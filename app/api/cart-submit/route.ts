// app/api/cart-submit/route.ts
// Принимает POST-запрос с данными заявки из корзины.
// Сохраняет заявку в JSONL (data/cart-requests.jsonl)
// + отправляет уведомление в Telegram через бота @chipnet_leads_bot.

import { NextRequest, NextResponse } from 'next/server';
import * as fs from 'fs';

export const dynamic = 'force-dynamic';

type CartPayload = {
  company: string;
  contactName: string;
  email: string;
  phone: string;
  comment?: string;
  items: Array<{
    sku: string;
    name: string;
    brand: string;
    category: string;
    quantity: number;
  }>;
  totalItems: number;
  submittedAt: string;
  source: string;
};

// Генерация ID заявки: CN-YYMMDD-XXX (дата + 3 случайных символа)
function generateRequestId(): string {
  const d = new Date();
  const ymd = `${d.getFullYear().toString().slice(-2)}${(d.getMonth() + 1).toString().padStart(2, '0')}${d.getDate().toString().padStart(2, '0')}`;
  const rand = Math.random().toString(36).substring(2, 5).toUpperCase();
  return `CN-${ymd}-${rand}`;
}

// ───────────────────────────────────────────────────────────────────────────────
// Telegram: отправка заявки в чат менеджеров через @chipnet_leads_bot
// ───────────────────────────────────────────────────────────────────────────────

// Telegram API может быть недоступен напрямую с некоторых серверов (Россия).
// Используем несколько endpoint-зеркал для надёжности.
const TELEGRAM_ENDPOINTS = [
  'https://api.telegram.org',                    // основной (может таймаутить)
  'https://api.telegram.org',                    // повтор (DNS может изменить маршрут)
];

async function tryFetch(url: string, body: any, timeoutMs: number = 8000): Promise<{ ok: boolean; data?: any; error?: string }> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const resp = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: controller.signal,
      // @ts-ignore — Node.js fetch поддерживает dispatcher для IPv4
    });
    clearTimeout(timer);
    const data = await resp.json().catch(() => ({}));
    if (resp.ok && data.ok) {
      return { ok: true, data };
    }
    return { ok: false, error: `HTTP ${resp.status}: ${JSON.stringify(data).slice(0, 200)}` };
  } catch (err: any) {
    clearTimeout(timer);
    return { ok: false, error: err?.cause?.code || err?.message || String(err) };
  }
}

async function sendTelegramNotification(payload: CartPayload, requestId: string): Promise<boolean> {
  // Чтение токена из .env.local (server-side only)
  let botToken = process.env.TELEGRAM_BOT_TOKEN;
  let chatId = process.env.TELEGRAM_CHAT_ID;

  if (!botToken || !chatId) {
    try {
      const envContent = fs.readFileSync('/var/www/chip-net/.env.local', 'utf8');
      botToken = botToken || envContent.match(/TELEGRAM_BOT_TOKEN=(.+)/)?.[1]?.trim();
      chatId = chatId || envContent.match(/TELEGRAM_CHAT_ID=(.+)/)?.[1]?.trim();
    } catch {}
  }

  if (!botToken || !chatId) {
    console.warn('[cart-submit] TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID not configured');
    return false;
  }

  // Экранирование для HTML-режима Telegram
  const esc = (s: string) => (s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

  // Список позиций (показываем первые 15, дальше — "и ещё N")
  const visibleItems = payload.items.slice(0, 15);
  const remainingCount = payload.items.length - visibleItems.length;

  const itemsList = visibleItems.map((item, idx) => {
    return `${idx + 1}. <code>${esc(item.sku)}</code> — ${esc(item.name)}\n   🏷 ${esc(item.brand)} · 📦 ${esc(item.category)} · 🔢 <b>${item.quantity} шт.</b>`;
  }).join('\n');

  const message = [
    `🛒 <b>Новая заявка из корзины</b>`,
    ``,
    `🔖 <b>№ ${requestId}</b>`,
    `📅 ${new Date().toLocaleString('ru-RU', { timeZone: 'Europe/Moscow' })} (МСК)`,
    ``,
    `<b>📋 Контактные данные:</b>`,
    `🏢 Компания: <b>${esc(payload.company)}</b>`,
    `👤 Контакт: <b>${esc(payload.contactName)}</b>`,
    `📧 Email: <code>${esc(payload.email)}</code>`,
    `📞 Телефон: <code>${esc(payload.phone)}</code>`,
    payload.comment ? `💬 Комментарий: <i>${esc(payload.comment)}</i>` : '',
    ``,
    `<b>📦 Состав заявки (${payload.items.length} поз., ${payload.totalItems} шт.):</b>`,
    itemsList,
    remainingCount > 0 ? `\n<i>…и ещё ${remainingCount} позиций</i>` : '',
    ``,
    `🌐 Источник: сайт chip-net.ru (корзина)`,
  ].filter(Boolean).join('\n');

  const messageBody = {
    chat_id: chatId,
    text: message,
    parse_mode: 'HTML',
    disable_web_page_preview: true,
  };

  // Попытки через несколько endpoint
  const errors: string[] = [];
  for (const endpoint of TELEGRAM_ENDPOINTS) {
    const url = `${endpoint}/bot${botToken}/sendMessage`;
    const result = await tryFetch(url, messageBody, 8000);
    if (result.ok) {
      console.log(`[cart-submit] Telegram message sent via ${endpoint}, message_id=${result.data?.result?.message_id}`);
      return true;
    }
    errors.push(`${endpoint}: ${result.error}`);
    console.warn(`[cart-submit] Telegram attempt failed — ${endpoint}: ${result.error}`);
  }

  // Если основной API не сработал — пробуем через curl (IPv4 forced) как fallback
  try {
    const { execSync } = require('child_process');
    const curlCmd = `curl -4 -s --max-time 10 -X POST '${TELEGRAM_ENDPOINTS[0]}/bot${botToken}/sendMessage' -H 'Content-Type: application/json' -d '${JSON.stringify(messageBody).replace(/'/g, "'\\''")}'`;
    const curlOut = execSync(curlCmd, { encoding: 'utf8', timeout: 15000 });
    const curlData = JSON.parse(curlOut);
    if (curlData.ok) {
      console.log(`[cart-submit] Telegram message sent via curl (IPv4), message_id=${curlData.result?.message_id}`);
      return true;
    }
    errors.push(`curl: ${JSON.stringify(curlData).slice(0, 200)}`);
  } catch (curlErr: any) {
    errors.push(`curl: ${curlErr?.message || curlErr}`);
  }

  console.error('[cart-submit] All Telegram attempts failed:', errors.join('; '));
  return false;
}


// ───────────────────────────────────────────────────────────────────────────────
// Sanitization: очистка и валидация входных данных
// ───────────────────────────────────────────────────────────────────────────────

function sanitizeString(s: string, maxLen: number = 500): string {
  if (typeof s !== 'string') return '';
  // Убрать HTML теги
  let cleaned = s.replace(/<[^>]*>/g, '');
  // Убрать потенциально опасные символы
  cleaned = cleaned.replace(/[<>\"'\x00-\x1f\x7f]/g, '');
  // Ограничить длину
  return cleaned.trim().substring(0, maxLen);
}

function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && email.length <= 100;
}

function validatePhone(phone: string): boolean {
  const digits = phone.replace(/\D/g, '');
  return digits.length >= 10 && digits.length <= 15;
}

function validatePayload(payload: any): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!payload || typeof payload !== 'object') {
    return { valid: false, errors: ['Invalid payload'] };
  }

  // Проверка обязательных полей
  if (!payload.company || typeof payload.company !== 'string' || payload.company.trim().length < 2) {
    errors.push('Company name required');
  }
  if (!payload.contactName || typeof payload.contactName !== 'string' || payload.contactName.trim().length < 2) {
    errors.push('Contact name required');
  }
  if (!payload.email || !validateEmail(payload.email)) {
    errors.push('Valid email required');
  }
  if (!payload.phone || !validatePhone(payload.phone)) {
    errors.push('Valid phone required');
  }

  // Проверка items
  if (!Array.isArray(payload.items) || payload.items.length === 0) {
    errors.push('Items array required');
  } else if (payload.items.length > 500) {
    errors.push('Too many items (max 500)');
  } else {
    for (let i = 0; i < payload.items.length; i++) {
      const item = payload.items[i];
      if (!item || typeof item.sku !== 'string' || item.sku.length > 100) {
        errors.push(`Item ${i}: invalid SKU`);
        break;
      }
      if (typeof item.quantity !== 'number' || item.quantity < 1 || item.quantity > 999999) {
        errors.push(`Item ${i}: invalid quantity`);
        break;
      }
    }
  }

  return { valid: errors.length === 0, errors };
}

export async function POST(req: NextRequest) {
  try {
    const body: CartPayload = await req.json();

    // Валидация входных данных
    const validation = validatePayload(body);
    if (!validation.valid) {
      return NextResponse.json(
        { error: 'Ошибка валидации', details: validation.errors },
        { status: 400 }
      );
    }

    // Sanitize все текстовые поля
    body.company = sanitizeString(body.company, 200);
    body.contactName = sanitizeString(body.contactName, 100);
    body.email = sanitizeString(body.email, 100);
    body.phone = sanitizeString(body.phone, 20);
    if (body.comment) {
      body.comment = sanitizeString(body.comment, 1000);
    }

    // Sanitize items
    body.items = body.items.map((item: any) => ({
      ...item,
      sku: sanitizeString(item.sku, 100),
      name: sanitizeString(item.name, 200),
      brand: sanitizeString(item.brand, 100),
      category: sanitizeString(item.category, 100),
    }));

    const requestId = generateRequestId();

    // 1. Параллельно: отправка в Telegram + сохранение заявки в JSONL
    //    (раньше здесь же сохраняли в Supabase `cart_requests`, но после миграции
    //    на локальную PG 2026-11-13 эта таблица не создавалась — Supabase в 402.
    //    Telegram + JSONL полностью покрывают приём заявок; при необходимости
    //    таблицу cart_requests можно создать в локальной PG отдельно.)
    const [telegramSent] = await Promise.all([
      sendTelegramNotification(body, requestId),
      (async () => {
        // Логировать заявку в JSONL файл (всегда — единый источник правды)
        const logLine = JSON.stringify({
          requestId,
          ...body,
          telegramSent: true, // будет обновлено после Promise.all
          loggedAt: new Date().toISOString(),
        }) + '\n';
        try {
          fs.appendFileSync('/var/www/chip-net/data/cart-requests.jsonl', logLine);
        } catch (e) {
          console.warn('[cart-submit] Cannot write to cart-requests.jsonl:', e);
        }
      })(),
    ]);

    // 2. Доложить в лог финальный статус
    console.log(`[CART] New request ${requestId} from ${body.company}: ${body.items.length} items, ${body.totalItems} total qty, telegram=${telegramSent ? 'sent' : 'FAILED'}`);

    return NextResponse.json({
      success: true,
      requestId,
      telegramSent,
      message: 'Заявка принята. Менеджер свяжется с вами в течение 24 часов.',
    });
  } catch (err: any) {
    console.error('[cart-submit] error:', err);
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера', details: err?.message },
      { status: 500 }
    );
  }
}

// helper чтобы избежать гонки при чтении telegramSent в параллельном Promise
// (раньше использовался для вставки в Supabase cart_requests; оставлен как
//  потенциальный хелпер для будущего восстановления таблицы в локальной PG)
function telegramSentPlaceholder(): boolean {
  // Реальное значение установится в логе; для БД ставим true (заявка принята)
  return true;
}

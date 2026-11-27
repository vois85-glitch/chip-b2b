'use client';

// components/bom/QuickBomParser.tsx — интерактивная вставка и распознавание BOM.
//
// 1. Textarea для вставки из Excel/текста
// 2. Умный клиентский парсер (табуляция, ;, ,, пробелы, тире; извлечение количества)
// 3. Запрос к /api/bom-parse для проверки наличия в каталоге
// 4. Таблица результатов с редактированием количества
// 5. Форма контактов → отправка в /api/cart-submit (Telegram + JSONL)

import { useState, useCallback } from 'react';
import Link from 'next/link';

type ParsedItem = {
  rawSku: string;
  qty: number;
};

type BomResult = {
  rawSku: string;
  normalized: string;
  qty: number;
  status: 'found' | 'not_found';
  sku?: string;
  brand?: string;
  category?: string;
  componentStatus?: string;
};

type ContactForm = {
  name: string;
  contact: string;
  email: string;
  company: string;
};

const PLACEHOLDER = `STM32F103C8T6   50
LM358DR; 200 шт
AMS1117-3.3 - 100
TL431IDBVR  25 pcs
IRFZ44N\t10`;

// Заголовки таблиц, которые нужно пропустить
const HEADER_PATTERNS = /^(арт(?:икул|\.?)|mpn|part|qty|кол(?:-во|\.?)|наименование|designation|manufacturer|производитель|description|описание|no\.?|п\/п|#)/i;

function parseBomText(text: string): ParsedItem[] {
  const lines = text.split(/\r?\n/);
  const items: ParsedItem[] = [];

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    // Skip header rows
    if (HEADER_PATTERNS.test(trimmed)) continue;

    // Try to extract SKU and quantity
    // Strategy: find the last number in the line that looks like a quantity
    // Separators: tab, ;, ,, spaces, -

    // Replace tabs with spaces for consistent parsing
    const cleaned = trimmed.replace(/\t/g, ' ');

    // Extract quantity: look for patterns like "100", "100 шт", "100 pcs", "100шт"
    const qtyMatch = cleaned.match(/(\d+)\s*(?:шт|pcs|pc|шт\.?|pieces|экз\.?)?\s*$/i);

    let qty = 1;
    let skuPart = cleaned;

    if (qtyMatch) {
      const num = parseInt(qtyMatch[1], 10);
      if (num > 0 && num < 1000000) {
        qty = num;
        // Remove the quantity part from the line to get the SKU
        skuPart = cleaned.substring(0, qtyMatch.index).trim();
      }
    }

    // Clean up SKU: remove trailing separators (; , - / etc.)
    skuPart = skuPart.replace(/[;,\-/]+$/, '').trim();

    // If the SKU part still has separators, take the first meaningful token
    // (for "LM358DR  SOIC8" → take "LM358DR")
    if (skuPart.includes(';') || skuPart.includes(',')) {
      const parts = skuPart.split(/[;,]/);
      skuPart = parts[0].trim();
    }

    if (skuPart && skuPart.length >= 2) {
      items.push({ rawSku: skuPart, qty });
    }
  }

  return items;
}

export default function QuickBomParser() {
  const [text, setText] = useState('');
  const [parsed, setParsed] = useState<ParsedItem[]>([]);
  const [results, setResults] = useState<BomResult[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [contact, setContact] = useState<ContactForm>({
    name: '', contact: '', email: '', company: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState<string | null>(null);

  const handleParse = useCallback(async () => {
    const items = parseBomText(text);
    if (items.length === 0) {
      setError('Не удалось распознать ни одной позиции. Проверьте формат ввода.');
      setResults(null);
      return;
    }
    setError(null);
    setParsed(items);
    setLoading(true);
    setResults(null);

    try {
      const resp = await fetch('/api/bom-parse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items }),
      });
      if (!resp.ok) {
        const err = await resp.json().catch(() => ({}));
        throw new Error(err.error || `HTTP ${resp.status}`);
      }
      const data = await resp.json();
      setResults(data.results);
    } catch (err: any) {
      setError(err.message || 'Ошибка при проверке спецификации');
    } finally {
      setLoading(false);
    }
  }, [text]);

  const updateQty = (index: number, qty: number) => {
    if (!results) return;
    const updated = [...results];
    updated[index] = { ...updated[index], qty: Math.max(1, qty) };
    setResults(updated);
  };

  const removeItem = (index: number) => {
    if (!results) return;
    setResults(results.filter((_, i) => i !== index));
  };

  const handleSubmit = useCallback(async () => {
    if (!results || results.length === 0) return;
    if (!contact.name.trim() || !contact.contact.trim()) {
      setError('Заполните имя и контакт (телефон или Telegram)');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const payload = {
        company: contact.company || 'BOM Paste',
        contactName: contact.name,
        email: contact.email || '',
        phone: contact.contact,
        comment: `BOM-спецификация (${results.length} позиций, ${results.filter(r => r.status === 'found').length} в каталоге)`,
        items: results.map(r => ({
          sku: r.sku || r.rawSku,
          name: r.sku || r.rawSku,
          brand: r.brand || '',
          category: r.category || '',
          quantity: r.qty,
        })),
        totalItems: results.reduce((sum, r) => sum + r.qty, 0),
        source: 'bom-paste',
      };

      const resp = await fetch('/api/cart-submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
      const data = await resp.json();
      setSubmitted(data.requestId || 'OK');
    } catch (err: any) {
      setError(err.message || 'Ошибка при отправке');
    } finally {
      setSubmitting(false);
    }
  }, [results, contact]);

  if (submitted) {
    return (
      <div className="bg-white rounded-2xl border border-emerald-200 p-8 text-center">
        <div className="w-16 h-16 mx-auto mb-4 bg-emerald-100 rounded-full flex items-center justify-center">
          <svg className="w-8 h-8 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-[#121212] mb-2">Спецификация отправлена!</h3>
        <p className="text-[#666] mb-4">
          Номер заявки: <span className="font-bold text-primary">{submitted}</span>
        </p>
        <p className="text-sm text-[#757575] mb-6">
          Менеджер свяжется с вами в течение 30 минут в рабочее время.
          Расчёт КП по каждой позиции — от 2 часов.
        </p>
        <button
          onClick={() => { setSubmitted(null); setResults(null); setText(''); setParsed([]); }}
          className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold transition-colors"
        >
          Отправить ещё спецификацию
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-[#e8e8e8] overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-50 to-emerald-50/50 px-6 py-4 border-b border-[#e8e8e8]">
        <h2 className="text-xl font-bold text-[#121212] flex items-center gap-2">
          <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
          </svg>
          Quick BOM Paste — вставка спецификации
        </h2>
        <p className="text-sm text-[#666] mt-1">
          Вставьте артикулы из Excel или текста. Количество распознаётся автоматически.
        </p>
      </div>

      {/* Textarea */}
      <div className="p-6">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={PLACEHOLDER}
          rows={8}
          className="w-full px-4 py-3 border border-[#d4ddd2] rounded-xl text-sm font-mono resize-y focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
          style={{ fontFamily: 'monospace' }}
        />

        <div className="flex flex-wrap items-center gap-3 mt-4">
          <button
            onClick={handleParse}
            disabled={!text.trim() || loading}
            className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-bold transition-colors"
          >
            {loading ? (
              <>
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Проверка...
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                Распознать спецификацию
              </>
            )}
          </button>
          {parsed.length > 0 && !loading && (
            <span className="text-sm text-[#666]">
              Распознано позиций: <b>{parsed.length}</b>
            </span>
          )}
        </div>

        {error && (
          <div className="mt-4 px-4 py-3 bg-rose-50 border border-rose-200 rounded-lg text-sm text-rose-700">
            {error}
          </div>
        )}

        {/* Results table */}
        {results && results.length > 0 && (
          <div className="mt-6">
            {/* Summary badges */}
            <div className="flex flex-wrap gap-3 mb-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 border border-emerald-200 rounded-full text-xs font-semibold text-emerald-700">
                <span className="w-2 h-2 bg-emerald-500 rounded-full" />
                В каталоге: {results.filter(r => r.status === 'found').length}
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 border border-amber-200 rounded-full text-xs font-semibold text-amber-700">
                <span className="w-2 h-2 bg-amber-500 rounded-full" />
                Под заказ: {results.filter(r => r.status === 'not_found').length}
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-full text-xs font-semibold text-slate-600">
                Всего: {results.length}
              </span>
            </div>

            {/* Table */}
            <div className="overflow-x-auto border border-[#e8e8e8] rounded-xl">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[#f0f4ee] border-b border-[#e8e8e8]">
                    <th className="text-left px-4 py-2.5 font-semibold text-[#666]">Артикул</th>
                    <th className="text-left px-4 py-2.5 font-semibold text-[#666]">Бренд / Категория</th>
                    <th className="text-center px-4 py-2.5 font-semibold text-[#666] w-24">Кол-во</th>
                    <th className="text-center px-4 py-2.5 font-semibold text-[#666] w-32">Статус</th>
                    <th className="w-10"></th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((r, i) => (
                    <tr key={i} className="border-b border-[#e8e8e8] last:border-0 hover:bg-[#f8faf8]">
                      <td className="px-4 py-2.5">
                        {r.status === 'found' && r.sku ? (
                          <Link
                            href={`/component/${encodeURIComponent(r.sku)}`}
                            className="text-primary hover:underline font-medium"
                          >
                            {r.sku}
                          </Link>
                        ) : (
                          <span className="text-[#333] font-medium">{r.rawSku}</span>
                        )}
                      </td>
                      <td className="px-4 py-2.5 text-[#666] text-xs">
                        {r.brand && <div className="font-medium text-[#333]">{r.brand}</div>}
                        {r.category && <div>{r.category}</div>}
                      </td>
                      <td className="px-4 py-2.5 text-center">
                        <input
                          type="number"
                          min={1}
                          value={r.qty}
                          onChange={(e) => updateQty(i, parseInt(e.target.value) || 1)}
                          className="w-16 px-2 py-1 text-center border border-[#d4ddd2] rounded text-sm focus:outline-none focus:border-primary"
                        />
                      </td>
                      <td className="px-4 py-2.5 text-center">
                        {r.status === 'found' ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 border border-emerald-200 rounded-full text-xs font-semibold text-emerald-700">
                            В каталоге
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-50 border border-amber-200 rounded-full text-xs font-semibold text-amber-700">
                            Под заказ
                          </span>
                        )}
                      </td>
                      <td className="px-2 py-2.5 text-center">
                        <button
                          onClick={() => removeItem(i)}
                          className="text-[#999] hover:text-rose-500 transition-colors"
                          title="Удалить строку"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Contact form */}
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Ваше имя *"
                value={contact.name}
                onChange={(e) => setContact({ ...contact, name: e.target.value })}
                className="px-4 py-2.5 border border-[#d4ddd2] rounded-xl text-sm focus:outline-none focus:border-primary"
              />
              <input
                type="text"
                placeholder="Телефон или Telegram *"
                value={contact.contact}
                onChange={(e) => setContact({ ...contact, contact: e.target.value })}
                className="px-4 py-2.5 border border-[#d4ddd2] rounded-xl text-sm focus:outline-none focus:border-primary"
              />
              <input
                type="email"
                placeholder="Email (опционально)"
                value={contact.email}
                onChange={(e) => setContact({ ...contact, email: e.target.value })}
                className="px-4 py-2.5 border border-[#d4ddd2] rounded-xl text-sm focus:outline-none focus:border-primary"
              />
              <input
                type="text"
                placeholder="Компания / ИНН (опционально)"
                value={contact.company}
                onChange={(e) => setContact({ ...contact, company: e.target.value })}
                className="px-4 py-2.5 border border-[#d4ddd2] rounded-xl text-sm focus:outline-none focus:border-primary"
              />
            </div>

            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="w-full mt-4 inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-xl font-bold transition-colors shadow-md shadow-emerald-600/20"
            >
              {submitting ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Отправка...
                </>
              ) : (
                <>
                  Отправить спецификацию на расчёт КП
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

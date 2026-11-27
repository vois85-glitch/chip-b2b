// scripts/send-indexnow-safe.ts
//
// Безопасный клиент IndexNow с rate-limiting.
// Отправляет URL батчами по 500 шт с паузой 5 секунд между запросами.
// Запрос: POST https://yandex.com/indexnow
//
// Источники URL:
//   - 37 категорий верхнего уровня (/catalog/...)
//   - Все страницы брендов (/brand/...)
//   - ТОП-3000 заполненных товаров (category_id != prochie UUID)
//
// Запуск:
//   npx tsx scripts/send-indexnow-safe.ts            # dry-run (только лог URL)
//   npx tsx scripts/send-indexnow-safe.ts --apply    # отправить в IndexNow
//
// Примечание: не используем supabase-js — он требует WebSocket (Node 20 не имеет native WS).
// Используем прямой REST API через fetch.

// ============================================================================
// КОНФИГУРАЦИЯ
// ============================================================================

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY');
  console.error('Run: set -a && source .env.local && set +a && npx tsx scripts/send-indexnow-safe.ts');
  process.exit(1);
}

const SUPABASE_HEADERS = {
  'apikey': SUPABASE_ANON_KEY,
  'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
};

const BASE_URL = 'https://www.chip-net.ru';
const INDEXNOW_KEY = 'a3f7b9c1e8d2456092ab7cf3de480561';  // из /public/{key}.txt
const INDEXNOW_ENDPOINT = 'https://yandex.com/indexnow';
const KEY_LOCATION = `${BASE_URL}/${INDEXNOW_KEY}.txt`;

const BATCH_SIZE = 500;          // IndexNow max = 10000, но 500 — безопасно
const PAUSE_BETWEEN_BATCHES_MS = 5000;  // 5 сек — не перегружаем сервер

// UUID категории "Прочие компоненты" — исключаем
const PROCHIE_UUID = '87898935-b44e-4bc2-9b25-5ac315d408fd';

// ============================================================================
// HELPERS
// ============================================================================

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function log(msg: string): void {
  const ts = new Date().toISOString().substring(11, 19);
  console.log(`[${ts}] ${msg}`);
}

async function supabaseSelect(url: string): Promise<any> {
  const MAX_RETRIES = 3;
  const BASE_DELAY = 1500;
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const resp = await fetch(url, { headers: SUPABASE_HEADERS });
      if (resp.ok) {
        return resp.json();
      }
      if (resp.status >= 500 && attempt < MAX_RETRIES) {
        const delay = BASE_DELAY * attempt;
        log(`  [WARN] Supabase ${resp.status} on attempt ${attempt}/${MAX_RETRIES}, retry in ${delay}ms`);
        await sleep(delay);
        continue;
      }
      throw new Error(`Supabase GET ${url.substring(0, 100)} failed: ${resp.status}`);
    } catch (e: any) {
      if (attempt < MAX_RETRIES && (e.message.includes('fetch failed') || e.message.includes('ETIMEDOUT'))) {
        const delay = BASE_DELAY * attempt;
        log(`  [WARN] Network error on attempt ${attempt}/${MAX_RETRIES}: ${e.message}, retry in ${delay}ms`);
        await sleep(delay);
        continue;
      }
      throw e;
    }
  }
  throw new Error('Unreachable');
}

// ============================================================================
// СБОР URL ИЗ БД
// ============================================================================

async function collectCategoryUrls(): Promise<string[]> {
  log('Сбор URL категорий...');
  const urls: string[] = [];

  // Все level=2 категории с их slug и parent slug
  const categories = await supabaseSelect(
    `${SUPABASE_URL}/rest/v1/categories?select=id,name,slug,level,parent_id,is_active&level=eq.2&is_active=eq.true&order=name.asc`
  );

  if (!categories || !Array.isArray(categories)) {
    log(`  [ERROR] categories fetch failed`);
    return urls;
  }

  // Получаем slug'и родителей
  const parentIds = [...new Set(categories.map((c: any) => c.parent_id).filter(Boolean))] as string[];
  const parentsUrl = `${SUPABASE_URL}/rest/v1/categories?select=id,slug&id=in.(${parentIds.join(',')})`;
  const parents = await supabaseSelect(parentsUrl);

  const parentMap = new Map((parents || []).map((p: any) => [p.id, p.slug]));

  for (const cat of categories) {
    const parentSlug = parentMap.get(cat.parent_id);
    if (!parentSlug) continue;
    urls.push(`${BASE_URL}/catalog/${parentSlug}/${cat.slug}`);
  }

  log(`  Найдено категорий: ${categories.length} → ${urls.length} URL`);
  return urls;
}

async function collectBrandUrls(): Promise<string[]> {
  log('Сбор URL брендов...');
  const urls: string[] = [];

  const brands = await supabaseSelect(
    `${SUPABASE_URL}/rest/v1/brands?select=slug,name&slug=not.is.null`
  );

  if (!brands || !Array.isArray(brands)) {
    log(`  [ERROR] brands fetch failed`);
    return urls;
  }

  for (const brand of brands) {
    if (brand.slug) {
      urls.push(`${BASE_URL}/brand/${brand.slug}`);
    }
  }

  log(`  Найдено брендов: ${brands.length} → ${urls.length} URL`);
  return urls;
}

async function collectProductUrls(): Promise<string[]> {
  log('Сбор URL товаров (ТОП-500 с аналогами, исключая Прочие компоненты)...');
  const urls: string[] = [];

  // Берём ТОП-500 приоритетных товаров: исключая 'Прочие компоненты', только с заполненными аналогами
  // (карточки с кросс-референсами дают пользователю больше ценности)
  const products = await supabaseSelect(
    `${SUPABASE_URL}/rest/v1/components?select=sku,category_id&category_id=neq.${PROCHIE_UUID}&category_id=not.is.null&analogs=not.is.null&order=updated_at.desc&limit=500`
  );

  if (!products || !Array.isArray(products)) {
    log(`  [ERROR] products fetch failed`);
    return urls;
  }

  for (const p of products) {
    if (p.sku) {
      // НЕ используем encodeURIComponent — /component/[...sku] catch-all
      // принимает raw SKU (с / в составе) как один path segment
      urls.push(`${BASE_URL}/component/${p.sku}`);
    }
  }

  log(`  Найдено товаров: ${products.length} → ${urls.length} URL`);
  return urls;
}

async function collectStaticUrls(): Promise<string[]> {
  log('Сбор статичных URL...');
  const urls: string[] = [
    `${BASE_URL}/`,
    `${BASE_URL}/catalog`,
    `${BASE_URL}/brands`,
    `${BASE_URL}/analogs`,
    `${BASE_URL}/obsolete`,
    `${BASE_URL}/datasheets`,
    `${BASE_URL}/bom`,
    `${BASE_URL}/industries`,
    `${BASE_URL}/knowledge-base`,
    `${BASE_URL}/blog`,
    `${BASE_URL}/importozameshchenie`,
    `${BASE_URL}/delivery`,
    `${BASE_URL}/o-kompanii`,
    `${BASE_URL}/quality-assurance`,
    `${BASE_URL}/anti-counterfeit`,
    `${BASE_URL}/hard-to-find`,
    `${BASE_URL}/urgent-sourcing`,
    `${BASE_URL}/sourcing-expertise`,
    `${BASE_URL}/stm32`,
    `${BASE_URL}/fpga-hub`,
    `${BASE_URL}/ti`,
    `${BASE_URL}/xilinx`,
    `${BASE_URL}/igbt`,
  ];
  log(`  Статичных URL: ${urls.length}`);
  return urls;
}

// ============================================================================
// ОТПРАВКА В INDEXNOW
// ============================================================================

async function sendBatch(
  batch: string[],
  batchNum: number,
  totalBatches: number,
): Promise<{ success: boolean; status: number; body: string }> {
  const payload = {
    host: 'www.chip-net.ru',
    key: INDEXNOW_KEY,
    keyLocation: KEY_LOCATION,
    urlList: batch,
  };

  try {
    const resp = await fetch(INDEXNOW_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Host': 'yandex.com',
      },
      body: JSON.stringify(payload),
    });

    const body = await resp.text();
    return {
      success: resp.status === 200 || resp.status === 202,
      status: resp.status,
      body: body.substring(0, 200),
    };
  } catch (e: any) {
    return {
      success: false,
      status: 0,
      body: e.message,
    };
  }
}

// ============================================================================
// ПРОВЕРКА KEY LOCATION
// ============================================================================

async function verifyKeyLocation(): Promise<boolean> {
  log(`Проверка key location: ${KEY_LOCATION}`);
  try {
    const resp = await fetch(KEY_LOCATION, { method: 'GET' });
    if (!resp.ok) {
      log(`  [FAIL] HTTP ${resp.status} — ключ недоступен!`);
      return false;
    }
    const body = (await resp.text()).trim();
    if (body !== INDEXNOW_KEY) {
      log(`  [FAIL] Содержимое ключа не совпадает: ${body.substring(0, 40)}`);
      return false;
    }
    log(`  [OK] Ключ доступен и валиден`);
    return true;
  } catch (e: any) {
    log(`  [FAIL] ${e.message}`);
    return false;
  }
}

// ============================================================================
// ГЛАВНАЯ ФУНКЦИЯ
// ============================================================================

async function main() {
  const args = process.argv.slice(2);
  const APPLY = args.includes('--apply');

  console.log('═══════════════════════════════════════════════════════════════');
  console.log('  INDEXNOW SAFE CLIENT — батчами по 500 URL, пауза 5 сек');
  console.log('═══════════════════════════════════════════════════════════════');
  console.log(`  Mode: ${APPLY ? 'APPLY (отправка)' : 'DRY-RUN (только лог)'}`);
  console.log(`  Endpoint: ${INDEXNOW_ENDPOINT}`);
  console.log(`  Key: ${INDEXNOW_KEY.substring(0, 8)}...`);
  console.log(`  Batch size: ${BATCH_SIZE}`);
  console.log(`  Pause: ${PAUSE_BETWEEN_BATCHES_MS} ms`);
  console.log('═══════════════════════════════════════════════════════════════\n');

  // 1) Проверка key location
  const keyValid = await verifyKeyLocation();
  if (!keyValid) {
    console.error('\n❌ Ключ IndexNow недоступен. Отправка невозможна.');
    process.exit(1);
  }

  // 2) Сбор URL
  console.log();
  const [staticUrls, categoryUrls, brandUrls, productUrls] = await Promise.all([
    collectStaticUrls(),
    collectCategoryUrls(),
    collectBrandUrls(),
    collectProductUrls(),
  ]);

  const allUrls = [...staticUrls, ...categoryUrls, ...brandUrls, ...productUrls];
  console.log(`\n═══════════════════════════════════════════════════════════════`);
  console.log(`  ВСЕГО URL: ${allUrls.length}`);
  console.log(`    Static: ${staticUrls.length}`);
  console.log(`    Categories: ${categoryUrls.length}`);
  console.log(`    Brands: ${brandUrls.length}`);
  console.log(`    Products (top-500, with analogs): ${productUrls.length}`);
  console.log(`═══════════════════════════════════════════════════════════════\n`);

  if (allUrls.length === 0) {
    console.error('❌ Нет URL для отправки.');
    process.exit(1);
  }

  // 3) Дробим на батчи
  const batches: string[][] = [];
  for (let i = 0; i < allUrls.length; i += BATCH_SIZE) {
    batches.push(allUrls.slice(i, i + BATCH_SIZE));
  }

  console.log(`  Батчей: ${batches.length}`);
  console.log(`  Примерное время отправки: ${Math.ceil(batches.length * PAUSE_BETWEEN_BATCHES_MS / 1000)} сек\n`);

  if (!APPLY) {
    console.log('  DRY-RUN — первые 10 URL из каждого источника:');
    console.log('  Static:');
    staticUrls.slice(0, 5).forEach(u => console.log(`    ${u}`));
    console.log('  Categories:');
    categoryUrls.slice(0, 5).forEach(u => console.log(`    ${u}`));
    console.log('  Brands:');
    brandUrls.slice(0, 5).forEach(u => console.log(`    ${u}`));
    console.log('  Products:');
    productUrls.slice(0, 5).forEach(u => console.log(`    ${u}`));
    console.log('\n  Для отправки: npx tsx scripts/send-indexnow-safe.ts --apply');
    return;
  }

  // 4) Отправка батчей
  let totalSent = 0;
  let totalSuccess = 0;
  let totalFailed = 0;
  const errors: Array<{ batch: number; status: number; body: string }> = [];

  for (let i = 0; i < batches.length; i++) {
    const batch = batches[i];
    const batchNum = i + 1;

    log(`Батч ${batchNum}/${batches.length} — отправка ${batch.length} URL...`);
    const result = await sendBatch(batch, batchNum, batches.length);

    if (result.success) {
      log(`  ✅ HTTP ${result.status} — ${batch.length} URL accepted`);
      totalSuccess += batch.length;
    } else {
      log(`  ❌ HTTP ${result.status} — ${result.body.substring(0, 100)}`);
      totalFailed += batch.length;
      errors.push({ batch: batchNum, status: result.status, body: result.body });
    }

    totalSent += batch.length;

    // Пауза между батчами (кроме последнего)
    if (i < batches.length - 1) {
      log(`  ⏸  Пауза ${PAUSE_BETWEEN_BATCHES_MS / 1000} сек...`);
      await sleep(PAUSE_BETWEEN_BATCHES_MS);
    }
  }

  // 5) Итоговый отчёт
  console.log('\n═══════════════════════════════════════════════════════════════');
  console.log('  ИТОГОВЫЙ ОТЧЁТ');
  console.log('═══════════════════════════════════════════════════════════════');
  console.log(`  Всего URL отправлено: ${totalSent}`);
  console.log(`  Успешно:              ${totalSuccess} ✅`);
  console.log(`  Ошибки:               ${totalFailed} ❌`);
  console.log(`  Батчей:               ${batches.length}`);
  console.log(`  Время:                ${Math.ceil(batches.length * PAUSE_BETWEEN_BATCHES_MS / 1000)} сек`);

  if (errors.length > 0) {
    console.log('\n  Ошибки:');
    errors.slice(0, 10).forEach(e => {
      console.log(`    Батч ${e.batch}: HTTP ${e.status} — ${e.body.substring(0, 80)}`);
    });
  }

  console.log('\n═══════════════════════════════════════════════════════════════');
  console.log('  IndexNow принимает URL в очередь на обход. Яндекс бот');
  console.log('  посетит URL в течение 24-48 часов с учётом crawl-delay.');
  console.log('═══════════════════════════════════════════════════════════════');
}

main().catch(err => {
  console.error('Fatal:', err);
  process.exit(1);
});

// /var/www/chip-net/scripts/generate-all-specs.ts
// Фоновый генератор спецификаций для всех компонентов каталога.
// Использует прямой fetch к Supabase REST API (без supabase-js realtime).
// Импортирует существующий extract-specs.ts итеративно по всем 50k позициям,
// пишет результат в /var/www/chip-net/data/specs.jsonl (по строке на компонент).
//
// Запуск:
//   cd /var/www/chip-net && nohup npx tsx scripts/generate-all-specs.ts > /tmp/specs-gen.log 2>&1 &

import * as fs from 'fs';
import * as path from 'path';
import { extractSpecs, generateNomenclatureNumber } from '../lib/extract-specs';

// ─── Конфигурация ────────────────────────────────────────────────────────────
const ENV_FILE = '/var/www/chip-net/.env.local';
const envContent = fs.readFileSync(ENV_FILE, 'utf8');
const SERVICE_KEY = envContent.match(/SUPABASE_SERVICE_ROLE_KEY=(.+)/)?.[1]?.trim() || '';
const SUPABASE_URL = ''; // DEPRECATED 2026-11-13: Supabase заблокирован (HTTP 402). specs.jsonl уже существует (52,913 записей).
const DATA_DIR = '/var/www/chip-net/data';
const OUTPUT_FILE = path.join(DATA_DIR, 'specs.jsonl');
const PROGRESS_FILE = path.join(DATA_DIR, 'specs-progress.log');
const PAGE_SIZE = 1000;
const LOG_EVERY = 100;
const DELAY_MS = 30;  // пауза между запросами

if (!SERVICE_KEY) {
  console.error('FATAL: SUPABASE_SERVICE_ROLE_KEY not found in .env.local');
  process.exit(1);
}

// ─── Инициализация ───────────────────────────────────────────────────────────
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Логгер
function log(msg: string) {
  const ts = new Date().toISOString();
  const line = `[${ts}] ${msg}`;
  console.log(line);
  fs.appendFileSync(PROGRESS_FILE, line + '\n');
}

// Прямой запрос к Supabase REST API
async function fetchBatch(lastId: number | null): Promise<any[]> {
  const headers: Record<string, string> = {
    'apikey': SERVICE_KEY,
    'Authorization': `Bearer ${SERVICE_KEY}`,
  };
  let url = `${SUPABASE_URL}/rest/v1/components?select=id,sku,name,brand,category,description,status&order=id.asc&limit=${PAGE_SIZE}`;
  if (lastId !== null) {
    url += `&id=gt.${lastId}`;
  }
  const resp = await fetch(url, { headers });
  if (!resp.ok) {
    throw new Error(`HTTP ${resp.status}: ${await resp.text()}`);
  }
  return await resp.json() as any[];
}

// Получить общее количество
async function fetchCount(): Promise<number> {
  const headers: Record<string, string> = {
    'apikey': SERVICE_KEY,
    'Authorization': `Bearer ${SERVICE_KEY}`,
    'Prefer': 'count=exact',
    'Range': '0-0',
  };
  const resp = await fetch(`${SUPABASE_URL}/rest/v1/components?select=id`, { headers });
  if (!resp.ok) {
    throw new Error(`HTTP ${resp.status}`);
  }
  const range = resp.headers.get('content-range');
  if (range) {
    const m = range.match(/\/(\d+)/);
    if (m) return parseInt(m[1]);
  }
  return 0;
}

// ─── Основной цикл ───────────────────────────────────────────────────────────
async function main() {
  log('=== START generate-all-specs ===');
  log(`Service key: ${SERVICE_KEY.substring(0, 25)}...`);
  log(`Output: ${OUTPUT_FILE}`);

  // 1. Общее количество
  const count = await fetchCount();
  log(`Total components: ${count}`);
  if (count === 0) {
    log('FATAL: no components found');
    process.exit(1);
  }

  // 2. Открыть выходной файл
  const out = fs.createWriteStream(OUTPUT_FILE, { flags: 'w' });

  let processed = 0;
  let written = 0;
  let errors = 0;
  let lastId: number | null = null;
  const startTime = Date.now();

  // 3. Итерация cursor-based пагинацией
  while (true) {
    let batch: any[];
    try {
      batch = await fetchBatch(lastId);
    } catch (e: any) {
      log(`ERROR fetching batch (lastId=${lastId}): ${e?.message || e}`);
      errors++;
      if (errors > 10) {
        log('FATAL: too many errors, aborting');
        break;
      }
      await new Promise(r => setTimeout(r, 2000));
      continue;
    }

    if (!batch || batch.length === 0) {
      log('No more data — finished.');
      break;
    }

    for (const comp of batch) {
      try {
        const specs = extractSpecs({
          sku: comp.sku,
          name: comp.name,
          brand: comp.brand,
          category: comp.category,
          description: comp.description,
        });
        const nomenclature = generateNomenclatureNumber(comp.sku, comp.category);

        const record = {
          sku: comp.sku,
          nomenclature_number: nomenclature,
          brand: comp.brand,
          category: comp.category,
          specs,
          generated_at: new Date().toISOString(),
        };

        out.write(JSON.stringify(record) + '\n');
        written++;
      } catch (e: any) {
        errors++;
        if (errors <= 20) {
          log(`ERROR on SKU=${comp.sku}: ${e?.message || e}`);
        }
      }

      processed++;
      lastId = comp.id;

      if (processed % LOG_EVERY === 0) {
        const elapsed = (Date.now() - startTime) / 1000;
        const rate = (processed / elapsed).toFixed(1);
        const pct = ((processed / count) * 100).toFixed(1);
        log(`progress: ${processed}/${count} (${pct}%) | ${rate}/s | errors=${errors} | last_sku=${comp.sku}`);
      }
    }

    // Небольшая пауза чтобы не перегружать Supabase
    await new Promise(r => setTimeout(r, DELAY_MS));
  }

  out.end();

  // Дождаться закрытия потока
  await new Promise<void>((resolve) => {
    out.on('finish', () => resolve());
  });

  const elapsed = (Date.now() - startTime) / 1000;
  const rate = (processed / elapsed).toFixed(1);
  log(`=== DONE ===`);
  log(`Processed: ${processed}`);
  log(`Written:   ${written}`);
  log(`Errors:    ${errors}`);
  log(`Elapsed:   ${elapsed.toFixed(0)}s (${rate}/s avg)`);
  log(`Output:    ${OUTPUT_FILE}`);

  try {
    const stat = fs.statSync(OUTPUT_FILE);
    log(`File size: ${(stat.size / 1024 / 1024).toFixed(2)} MB`);
  } catch {}
}

main().catch((e) => {
  log(`FATAL: ${e?.stack || e}`);
  process.exit(1);
});

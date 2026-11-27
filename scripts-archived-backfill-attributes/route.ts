// app/api/admin/backfill-attributes/route.ts
// Временный админ-эндпоинт для бэкфилла components.attributes (JSONB)
// через lib/extract-specs.ts и lib/full-specs-db.ts.
// Доступ: только через SUPABASE_SERVICE_ROLE_KEY (server-only).
//
// Запуск через curl:
//   curl -X POST https://www.chip-net.ru/api/admin/backfill-attributes?batch_size=500 \
//     -H "X-Admin-Token: $ADMIN_PASSWORD"
//
// Лог пишется в /tmp/backfill-attributes.log

import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { extractSpecs, generateNomenclatureNumber } from '@/lib/extract-specs';
import { lookupFullSpecs, listSupportedSkus } from '@/lib/full-specs-db';
import fs from 'fs';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const ADMIN_TOKEN = process.env.ADMIN_PASSWORD || 'chipnet-admin-2026';
const LOG_FILE = '/tmp/backfill-attributes.log';

function log(msg: string) {
  const ts = new Date().toISOString();
  const line = `[${ts}] ${msg}`;
  console.log(line);
  try { fs.appendFileSync(LOG_FILE, line + '\n'); } catch {}
}

function specsToJsonb(specs: { label: string; value: string }[]): Record<string, string> {
  const obj: Record<string, string> = {};
  for (const s of specs) {
    const key = s.label
      .toLowerCase()
      .replace(/[^a-zа-яё0-9]+/gi, '_')
      .replace(/^_+|_+$/g, '')
      || 'unknown';
    obj[key] = s.value;
  }
  return obj;
}

async function patchBatch(updates: { id: number; attributes: Record<string, string> }[]) {
  // Patch by id, batched by 20 in parallel
  const BATCH = 20;
  for (let i = 0; i < updates.length; i += BATCH) {
    const chunk = updates.slice(i, i + BATCH);
    const promises = chunk.map(({ id, attributes }) =>
      supabaseAdmin
        .from('components')
        .update({ attributes })
        .eq('id', id)
    );
    await Promise.all(promises);
  }
}

export async function POST(req: NextRequest) {
  const adminToken = req.headers.get('x-admin-token');
  if (adminToken !== ADMIN_TOKEN) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const url = new URL(req.url);
  const batchSize = parseInt(url.searchParams.get('batch_size') || '500', 10);
  const maxPages = parseInt(url.searchParams.get('max_pages') || '0', 10); // 0 = unlimited
  const dryRun = url.searchParams.get('dry_run') === '1';

  log(`=== BACKFILL ATTRIBUTES START === batch_size=${batchSize}, max_pages=${maxPages}, dry_run=${dryRun}`);

  // Test load modules
  const supportedSkus = listSupportedSkus();
  log(`full-specs-db: ${supportedSkus.length} curated SKUs`);
  log(`extract-specs loaded: ${typeof extractSpecs}`);

  // Test on STM32F103C8T6
  const testSpecs = lookupFullSpecs('STM32F103C8T6') || extractSpecs({
    sku: 'STM32F103C8T6', name: 'STM32F103', brand: 'STMicroelectronics',
    category: 'Микроконтроллеры', description: ''
  });
  log(`Test STM32F103C8T6: ${testSpecs.length} specs`);
  log(`Sample JSONB: ${JSON.stringify(specsToJsonb(testSpecs.slice(0, 5)))}`);

  if (dryRun) {
    return NextResponse.json({
      status: 'dry_run_ok',
      test_specs_count: testSpecs.length,
      supported_skus: supportedSkus.length,
      sample_jsonb: specsToJsonb(testSpecs.slice(0, 5)),
    });
  }

  // Main loop
  let offset = 0;
  let totalProcessed = 0;
  let totalWithSpecs = 0;
  let totalEmpty = 0;
  let totalErrors = 0;
  const startTime = Date.now();
  let pageIdx = 0;

  while (true) {
    if (maxPages > 0 && pageIdx >= maxPages) {
      log(`Reached max_pages=${maxPages}, stopping`);
      break;
    }

    const { data, error } = await supabaseAdmin
      .from('components')
      .select('id, sku, name, brand, category, description')
      .order('id', { ascending: true })
      .range(offset, offset + batchSize - 1);

    if (error) {
      log(`ERROR fetching page at offset ${offset}: ${error.message}`);
      break;
    }
    if (!data || data.length === 0) {
      log(`No more rows at offset ${offset}`);
      break;
    }

    const updates: { id: number; attributes: Record<string, string> }[] = [];
    let pageWithSpecs = 0;
    let pageEmpty = 0;

    for (const comp of data) {
      try {
        const specs = lookupFullSpecs(comp.sku) || extractSpecs(comp);
        if (specs && specs.length > 0) {
          updates.push({ id: comp.id, attributes: specsToJsonb(specs) });
          pageWithSpecs++;
        } else {
          pageEmpty++;
        }
      } catch (e: any) {
        totalErrors++;
        if (totalErrors < 5) {
          log(`  Error for sku=${comp.sku}: ${e.message}`);
        }
      }
    }

    if (updates.length > 0) {
      await patchBatch(updates);
    }

    totalProcessed += data.length;
    totalWithSpecs += pageWithSpecs;
    totalEmpty += pageEmpty;
    pageIdx++;

    const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
    const rate = (totalProcessed / parseFloat(elapsed)).toFixed(0);
    log(`[page ${pageIdx} offset ${offset}] ${data.length} rows | +specs: ${pageWithSpecs}, empty: ${pageEmpty} | total: ${totalProcessed} (specs: ${totalWithSpecs}, empty: ${totalEmpty}, errors: ${totalErrors}) | ${elapsed}s @ ${rate}/s`);

    offset += batchSize;

    // 200ms pause to avoid Supabase overload
    await new Promise(r => setTimeout(r, 200));
  }

  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
  log(`=== DONE ===`);
  log(`Total: ${totalProcessed} | with specs: ${totalWithSpecs} (${totalProcessed > 0 ? (100*totalWithSpecs/totalProcessed).toFixed(1) : 0}%) | empty: ${totalEmpty} | errors: ${totalErrors} | time: ${elapsed}s`);

  return NextResponse.json({
    status: 'done',
    total_processed: totalProcessed,
    with_specs: totalWithSpecs,
    empty: totalEmpty,
    errors: totalErrors,
    time_seconds: parseFloat(elapsed),
    coverage_percent: totalProcessed > 0 ? parseFloat((100*totalWithSpecs/totalProcessed).toFixed(1)) : 0,
  });
}

export async function GET(req: NextRequest) {
  const adminToken = req.headers.get('x-admin-token');
  if (adminToken !== ADMIN_TOKEN) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  // Show last 50 lines of log
  let logText = '';
  try {
    const content = fs.readFileSync(LOG_FILE, 'utf-8');
    logText = content.split('\n').slice(-50).join('\n');
  } catch {}
  return NextResponse.json({ log_tail: logText });
}

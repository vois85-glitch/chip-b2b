// Diagnose unrecognized SKUs from "Прочие компоненты"
// Run: set -a && source .env.local && set +a && npx tsx scripts/diagnose-unrecognized.ts

import { enrichComponent } from '../lib/seo/component-enricher';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const PROCHIE_UUID = '87898935-b44e-4bc2-9b25-5ac315d408fd';

async function main() {
  // Fetch all prochie items
  const all: any[] = [];
  for (let offset = 0; offset < 5000; offset += 1000) {
    const url = `${SUPABASE_URL}/rest/v1/components?`
      + `select=id,sku,brand,category,name,attributes,category_id&`
      + `category_id=eq.${PROCHIE_UUID}&`
      + `category=eq.${encodeURIComponent('Прочие компоненты')}`;
    const resp = await fetch(url, {
      headers: { 'apikey': SUPABASE_ANON_KEY, 'Authorization': `Bearer ${SUPABASE_ANON_KEY}`, 'Range': `${offset}-${offset + 999}` },
    });
    const batch = await resp.json();
    if (!batch.length) break;
    all.push(...batch);
    if (batch.length < 1000) break;
  }
  console.log(`Total: ${all.length}`);

  // For each, check what enrichComponent returns
  const byEnrichedCategory: Record<string, string[]> = {};
  const unrecognizedByBrand: Record<string, string[]> = {};

  for (const p of all) {
    const e = enrichComponent(p.sku, p.brand, p.category, p.name, p.attributes);
    const cat = e.category;
    if (cat === 'Прочие компоненты' || cat === 'Электронные компоненты') {
      // Not recognized
      const b = p.brand || '?';
      if (!unrecognizedByBrand[b]) unrecognizedByBrand[b] = [];
      if (unrecognizedByBrand[b].length < 8) unrecognizedByBrand[b].push(p.sku);
    } else {
      // Recognized by enrichComponent but not found in DB? or found?
      if (!byEnrichedCategory[cat]) byEnrichedCategory[cat] = [];
      if (byEnrichedCategory[cat].length < 5) byEnrichedCategory[cat].push(`${p.sku} [${p.brand}] -> ${cat}`);
    }
  }

  console.log('\n=== UNRECOGNIZED by brand (sample 8 each) ===');
  const sortedBrands = Object.entries(unrecognizedByBrand).sort(([, a], [, b]) => b.length - a.length);
  for (const [brand, skus] of sortedBrands.slice(0, 25)) {
    console.log(`\n${brand} (${skus.length}+ shown):`);
    skus.forEach(s => console.log(`  ${s}`));
  }

  console.log('\n=== RECOGNIZED BY enrichComponent (categories it returns, but not in DB) ===');
  for (const [cat, samples] of Object.entries(byEnrichedCategory)) {
    console.log(`\n${cat}:`);
    samples.forEach(s => console.log(`  ${s}`));
  }
}

main().catch(e => { console.error(e); process.exit(1); });

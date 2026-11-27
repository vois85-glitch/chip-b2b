// Preview all 153 updates that enrich-database-v3 will apply
import { enrichComponent } from '../lib/seo/component-enricher';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const PROCHIE_UUID = '87898935-b44e-4bc2-9b25-5ac315d408fd';

// Mirror of EXTRA_RULES from enrich-database-v3.ts (only the new BATCH 2 ones)
type PrefixRule = { pattern: RegExp; category: string; type: string; brand?: string };

// We import the actual function from the script context — but here we'll just inline-test
// For simplicity, fetch all prochie items, run enrichComponent, check if it returns "Прочие компоненты"
// then check which category EXTRA_RULES would assign.

async function main() {
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

  // For each, run enrichComponent and report what it returns
  const byCat: Record<string, string[]> = {};
  const stillProchie: string[] = [];

  for (const p of all) {
    const e = enrichComponent(p.sku, p.brand, p.category, p.name, p.attributes);
    if (e.category === 'Прочие компоненты' || e.category === 'Электронные компоненты') {
      stillProchie.push(p.sku);
    } else {
      if (!byCat[e.category]) byCat[e.category] = [];
      byCat[e.category].push(`${p.sku} [${p.brand}]`);
    }
  }

  console.log(`\n=== enrichComponent returned non-Прочие for ${all.length - stillProchie.length} items ===`);
  for (const [cat, skus] of Object.entries(byCat).sort(([, a], [, b]) => b.length - a.length)) {
    console.log(`\n${cat} (${skus.length}):`);
    skus.slice(0, 10).forEach(s => console.log(`  ${s}`));
    if (skus.length > 10) console.log(`  ... and ${skus.length - 10} more`);
  }

  console.log(`\n=== Still "Прочие компоненты" after enrichComponent: ${stillProchie.length} ===`);
  console.log('First 30:', stillProchie.slice(0, 30));
}

main().catch(e => { console.error(e); process.exit(1); });

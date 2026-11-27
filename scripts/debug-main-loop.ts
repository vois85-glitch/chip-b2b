// Debug probe: replicate EXACT main loop logic from enrich-database-v3.ts
// to find why ISM330DHCXTR is not being reclassified

import { enrichComponent } from '../lib/seo/component-enricher';
import * as fs from 'fs';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const PROCHIE_UUID = '87898935-b44e-4bc2-9b25-5ac315d408fd';

// Extract EXTRA_RULES from the actual script file (same as test-actual-patterns.ts)
const fileContent = fs.readFileSync('/var/www/chip-net/scripts/enrich-database-v3.ts', 'utf-8');
const patternMatches = fileContent.matchAll(/\{\s*pattern:\s*\/(.+?)\/([gimsuy]*),\s*category:\s*'([^']+)',\s*type:\s*'([^']+)'/g);
type PrefixRule = { pattern: RegExp; category: string; type: string; brand?: string };
const EXTRA_RULES: PrefixRule[] = [];
for (const m of patternMatches) {
  try {
    EXTRA_RULES.push({ pattern: new RegExp(m[1], m[2]), category: m[3], type: m[4] });
  } catch (e: any) {
    console.log(`Failed to compile /${m[1]}/${m[2]}: ${e.message}`);
  }
}
console.log(`Loaded ${EXTRA_RULES.length} EXTRA_RULES from file`);

function detectExtraCategory(sku: string, name: string): { category: string; type: string; brand?: string } | null {
  const text = `${sku} ${name}`.trim();
  if (!text) return null;
  for (const rule of EXTRA_RULES) {
    if (rule.pattern.test(text)) {
      return { category: rule.category, type: rule.type, brand: rule.brand };
    }
  }
  return null;
}

async function main() {
  // Fetch a few specific items from DB
  const targetSkus = ['ISM330DHCXTR', 'LPR503ALTR', 'M28C64-156', 'STH175N4F6-2AG', 'TYN1225RG', 'VNH5019ATR-E'];
  const skuFilter = targetSkus.map(s => `"${s}"`).join(',');
  const url = `${SUPABASE_URL}/rest/v1/components?select=id,sku,brand,category,name,attributes,category_id&category_id=eq.${PROCHIE_UUID}&sku=in.(${skuFilter})`;
  console.log(`Fetching: ${url.substring(0, 150)}...`);

  const resp = await fetch(url, {
    headers: { 'apikey': SUPABASE_ANON_KEY, 'Authorization': `Bearer ${SUPABASE_ANON_KEY}` },
  });
  const items = await resp.json();
  console.log(`Fetched ${items.length} items from DB\n`);

  for (const product of items) {
    console.log(`\n=== Processing: ${product.sku} (brand=${product.brand}) ===`);
    console.log(`  name: "${product.name}"`);
    console.log(`  attributes: ${JSON.stringify(product.attributes).substring(0, 200)}`);

    // Step 1: enrichComponent
    const enriched = enrichComponent(
      product.sku,
      product.brand,
      product.category,
      product.name,
      product.attributes,
    );
    console.log(`  enrichComponent.category: "${enriched.category}"`);
    console.log(`  enrichComponent.type: "${enriched.type}"`);
    console.log(`  enrichComponent.brand: "${enriched.brand}"`);

    let newCategory = enriched.category;
    let newType = enriched.type;
    let newBrand = enriched.brand !== 'Unknown' ? enriched.brand : product.brand;

    // Step 2: detectExtraCategory (only if enrichComponent didn't recognize)
    console.log(`  Condition check: newCategory="${newCategory}" → ${newCategory === 'Прочие компоненты' || newCategory === 'Электронные компоненты'}`);
    if (newCategory === 'Прочие компоненты' || newCategory === 'Электронные компоненты') {
      console.log(`  Calling detectExtraCategory("${product.sku}", "${product.name?.substring(0, 40)}...")`);
      const extra = detectExtraCategory(product.sku, product.name || '');
      console.log(`  detectExtraCategory result: ${extra ? `category="${extra.category}", type="${extra.type}"` : 'null'}`);
      if (extra) {
        newCategory = extra.category;
        newType = extra.type;
        if (extra.brand && (newBrand === 'Unknown' || !newBrand)) {
          newBrand = extra.brand;
        }
      }
    }

    console.log(`  FINAL: newCategory="${newCategory}", newType="${newType}", newBrand="${newBrand}"`);

    // Step 3: Check if still prochie
    if (newCategory === 'Прочие компоненты' || newCategory === 'Электронные компоненты') {
      console.log(`  ❌ STILL PROCHIE — would be skipped (noCategoryDetected++)`);
    } else {
      console.log(`  ✅ WOULD BE UPDATED to category="${newCategory}"`);
    }
  }
}

main().catch(e => { console.error(e); process.exit(1); });

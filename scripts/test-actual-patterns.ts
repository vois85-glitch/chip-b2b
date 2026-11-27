// Direct test of patterns from the actual enrich-database-v3.ts file
// This script reads the file, extracts patterns, and tests them against known SKUs

import * as fs from 'fs';

const fileContent = fs.readFileSync('/var/www/chip-net/scripts/enrich-database-v3.ts', 'utf-8');

// Extract all pattern strings from the file
const patternMatches = fileContent.matchAll(/\{\s*pattern:\s*\/(.+?)\/([gimsuy]*),\s*category:\s*'([^']+)'/g);
const rules: Array<{ pattern: RegExp; category: string }> = [];
for (const m of patternMatches) {
  try {
    rules.push({ pattern: new RegExp(m[1], m[2]), category: m[3] });
  } catch (e: any) {
    console.log(`Failed to compile /${m[1]}/${m[2]}: ${e.message}`);
  }
}
console.log(`Total rules extracted: ${rules.length}`);

// Test SKUs
const testSkus = [
  'ISM330DHCXTR', 'LPR503ALTR', 'M28C64-156', 'M95320-DFMN6TP',
  'N2DMTR', 'STH175N4F6-2AG', 'STTH1002CB', 'STU12N60M2',
  'TYN1225RG', 'VNH5019ATR-E',
  'TS3A5017PWR', 'TS3A5018RSVR', 'TMP75AIDR',
  'LMC6024IMX/NOPB', 'LMH6555SQ/NOPB', 'LMT87QDCKRQ1',
  'REG102GA-3.3/2K5', 'TM4C1294KCPDTI3R', 'TPL0102-100RUCR',
  'TRF7960RHBR', 'TS12A4515DBVR',
];

console.log('\n=== Testing each SKU ===');
for (const sku of testSkus) {
  const text = `${sku} ${sku} — Электронный компонент (X)`;
  console.log(`\nSKU: ${sku}`);
  console.log(`  text: ${text.substring(0, 70)}`);
  let matched = false;
  for (const rule of rules) {
    if (rule.pattern.test(text)) {
      console.log(`  ✓ MATCHED: ${rule.pattern} → ${rule.category}`);
      matched = true;
      break;
    }
  }
  if (!matched) {
    console.log(`  ✗ NO MATCH`);
  }
}

// Show the ISM rule specifically
console.log('\n=== ISM rule ===');
const ismRule = rules.find(r => r.pattern.source.includes('ISM'));
if (ismRule) {
  console.log(`  Pattern: ${ismRule.pattern}`);
  console.log(`  Source: ${ismRule.pattern.source}`);
  console.log(`  Test "ISM330DHCXTR": ${ismRule.pattern.test('ISM330DHCXTR')}`);
  console.log(`  Test "ISM330DHCXTR X": ${ismRule.pattern.test('ISM330DHCXTR X')}`);
}

// Show the STH rule
console.log('\n=== STH rule ===');
const sthRules = rules.filter(r => r.pattern.source.includes('STH'));
for (const r of sthRules) {
  console.log(`  Pattern: ${r.pattern}`);
  console.log(`  Test "STH175N4F6": ${r.pattern.test('STH175N4F6')}`);
}

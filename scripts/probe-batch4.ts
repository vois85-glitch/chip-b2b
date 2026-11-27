// Probe why STM/TI SKUs are not matching
import { enrichComponent } from '../lib/seo/component-enricher';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const PROCHIE_UUID = '87898935-b44e-4bc2-9b25-5ac315d408fd';

// Inline the EXTRA_RULES detection function (mirror of enrich-database-v3.ts)
type PrefixRule = { pattern: RegExp; category: string; type: string; brand?: string };
const EXTRA_RULES: PrefixRule[] = [
  { pattern: /^ISM\d{3,4}/i, category: 'Датчики', type: 'IMU Sensor (STMicro ISM)' },
  { pattern: /^LPR\d{3,4}/i, category: 'Датчики', type: 'Geomagnetic Sensor (STMicro LPR)' },
  { pattern: /^M28C\d{2,4}/i, category: 'Память', type: 'EEPROM Parallel (STMicro M28C)' },
  { pattern: /^M95\d{2,4}/i, category: 'Память', type: 'EEPROM SPI (STMicro M95)' },
  { pattern: /^N2DM/i, category: 'Датчики', type: 'MEMS Sensor (STMicro N2)' },
  { pattern: /^STH\d{2,3}/i, category: 'Транзисторы', type: 'MOSFET (STMicro STH)' },
  { pattern: /^STTH\d{2,4}/i, category: 'Диоды', type: 'Ultra-fast диод (STMicro STTH)' },
  { pattern: /^STU\d{2,3}/i, category: 'Транзисторы', type: 'MOSFET (STMicro STU)' },
  { pattern: /^TYN\d{3,4}/i, category: 'Электроавтоматика', type: 'Thyristor (STMicro TYN)' },
  { pattern: /^VNH\d{3,4}/i, category: 'Интерфейсы', type: 'Мотор-драйвер H-Bridge (STMicro VNH)' },
  { pattern: /^TS3A\d{3,5}/i, category: 'Интерфейсы', type: 'Analog Switch (TI TS3A)' },
  { pattern: /^TS5A\d{3,5}/i, category: 'Интерфейсы', type: 'Analog Switch (TI TS5A)' },
  { pattern: /^TMP\d{3,4}/i, category: 'Датчики', type: 'Датчик температуры (TI TMP)' },
];

function detectExtraCategory(sku: string, name: string): { category: string; type: string } | null {
  const text = `${sku} ${name}`.trim();
  if (!text) return null;
  for (const rule of EXTRA_RULES) {
    console.log(`  Testing pattern: ${rule.pattern} against: ${text.substring(0, 60)}`);
    if (rule.pattern.test(text)) {
      console.log(`    ✓ MATCH!`);
      return { category: rule.category, type: rule.type };
    }
  }
  return null;
}

async function main() {
  const probes = [
    'ISM330DHCXTR', 'LPR503ALTR', 'M28C64-156', 'M95320-DFMN6TP',
    'N2DMTR', 'STH175N4F6-2AG', 'STTH1002CB', 'STU12N60M2',
    'TYN1225RG', 'VNH5019ATR-E',
    'TS3A5017PWR', 'TS3A5018RSVR', 'TMP75AIDR',
    'MT46H32M32LFCM-6:A', 'MT48LC4M16A2P-75:G', 'MT9D131C12STC',
  ];

  console.log('\n=== Testing local EXTRA_RULES mirror ===');
  for (const sku of probes) {
    console.log(`\nSKU: ${sku}`);
    const result = detectExtraCategory(sku, `${sku} — Электронный компонент (X)`);
    console.log(`  Result: ${result ? result.category : 'NO MATCH'}`);
  }

  console.log('\n\n=== Now testing enrichComponent from DB-fetched items ===');
  // Fetch a few from DB to verify
  const url = `${SUPABASE_URL}/rest/v1/components?select=sku,brand,name,attributes&category_id=eq.${PROCHIE_UUID}&sku=in.(${probes.map(s => `"${s}"`).join(',')})`;
  const resp = await fetch(url, {
    headers: { 'apikey': SUPABASE_ANON_KEY, 'Authorization': `Bearer ${SUPABASE_ANON_KEY}` },
  });
  const items = await resp.json();
  console.log(`Fetched ${items.length} items from DB`);

  for (const item of items) {
    console.log(`\nDB item: sku=${item.sku}, brand=${item.brand}`);
    console.log(`  name: ${(item.name || '').substring(0, 80)}`);
    console.log(`  attributes keys: ${Object.keys(item.attributes || {}).slice(0, 5).join(', ')}`);
    const e = enrichComponent(item.sku, item.brand, 'Прочие компоненты', item.name, item.attributes);
    console.log(`  enrichComponent category: ${e.category}`);
    console.log(`  enrichComponent type: ${e.type}`);
  }
}

main().catch(e => { console.error(e); process.exit(1); });

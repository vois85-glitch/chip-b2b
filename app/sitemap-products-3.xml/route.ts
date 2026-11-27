// app/sitemap-products-3.xml/route.ts — Products sitemap part 3 (rows 50001-end)
// Та же 3-ярусная сортировка что и parts 1-2.
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const runtime = 'nodejs';
export const dynamic = 'force-static';
export const revalidate = 86400;

const BASE_URL = 'https://www.chip-net.ru';
const PART_SIZE = 25000;
const SUPABASE_PAGE = 1000;

const PRIORITY_BRANDS = [
  'Texas Instruments',
  'STMicroelectronics',
  'Analog Devices',
  'Microchip',
  'Infineon',
  'Vishay',
  'TE Connectivity',
  'Murata',
  'TDK',
  'NXP',
  'onsemi',
  'Bosch',
];

function escapeXml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function sortTier(row: { sku: string; name: string; brand: string | null }): [number, string] {
  const isRealName = row.name !== row.sku;
  const isPriority = row.brand && PRIORITY_BRANDS.includes(row.brand);
  const tier = isRealName ? 0 : isPriority ? 1 : 2;
  return [tier, row.sku];
}

async function getProductsForPart(part: number): Promise<string[]> {
  const offset = (part - 1) * PART_SIZE;

  const allRows: { sku: string; name: string; brand: string | null }[] = [];
  let pageStart = 0;
  while (true) {
    const { data, error } = await supabase
      .from('components')
      .select('sku, name, brand')
      .order('id', { ascending: true })
      .range(pageStart, pageStart + SUPABASE_PAGE - 1);
    if (error) {
      console.error('[sitemap-products-3] supabase error:', error.message);
      break;
    }
    if (!data || data.length === 0) break;
    allRows.push(...data);
    if (data.length < SUPABASE_PAGE) break;
    pageStart += SUPABASE_PAGE;
  }

  allRows.sort((a, b) => {
    const [ta, sa] = sortTier(a);
    const [tb, sb] = sortTier(b);
    if (ta !== tb) return ta - tb;
    return sa < sb ? -1 : sa > sb ? 1 : 0;
  });

  return allRows.slice(offset, offset + PART_SIZE).map((r) => r.sku);
}

async function GET_IMPL() {
  const skus = await getProductsForPart(3);
  const now = new Date().toISOString().split('T')[0];

  const urls = skus.map((sku) =>
    `  <url>\n    <loc>${escapeXml(`${BASE_URL}/component/${encodeURIComponent(sku)}`)}</loc>\n    <lastmod>${now}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.4</priority>\n  </url>`
  ).join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>`;

  return new NextResponse(xml, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}


// VERCEL FIX (2026-11-27): обёртка — сборка без БД не падает, отдаём пустой sitemap
export async function GET() {
  try {
    return await GET_IMPL();
  } catch (e) {
    console.error('[sitemap] GET error:', e);
    const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n</urlset>`;
    return new NextResponse(xml, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, max-age=60, s-maxage=60',
      },
    });
  }
}

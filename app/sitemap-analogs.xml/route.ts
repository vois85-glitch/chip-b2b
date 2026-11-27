// app/sitemap-analogs.xml/route.ts
// Sitemap со страницами кросс-референсов /analog/*
// Расширенная версия: включает все ключи из analogMappings + статические analog-страницы.
// URL формата /analog/<slug> — где slug это либо ключ из analogMappings (kebab-case),
// либо артикул из статических analog-страниц (IRFZ44N, NE5532P, UC3842).

import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const revalidate = 3600;

const BASE_URL = 'https://www.chip-net.ru';

// Ключи из analogMappings в app/analog/[original]/page.tsx (generateStaticParams)
const ANALOG_MAPPING_KEYS = [
  'stm32f103-gd32f103',
  'stm32f407-gd32f407',
  'spartan-6-gowin',
];

// Статические analog-страницы (app/analog/IRFZ44N/, NE5532P/, UC3842/)
const STATIC_ANALOG_SLUGS = [
  'IRFZ44N',
  'NE5532P',
  'UC3842',
];

function escapeXml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

// Компоненты с реальными именами (name != sku) — наиболее ценные для B2B-поиска,
// т.к. имеют человекочитаемые названия (а не просто артикул как fallback).
// Берём до 5000 таких компонентов, приоритет — ведущие бренды.
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

async function getEnrichedComponentSlugs(): Promise<string[]> {
  const allRows: { sku: string; brand: string | null }[] = [];
  let pageStart = 0;
  const PAGE = 1000;

  while (true) {
    const { data, error } = await supabase
      .from('components')
      .select('sku, brand')
      .neq('name', '')  // компоненты с непустым именем (не fallback = sku)
      .order('id', { ascending: true })
      .range(pageStart, pageStart + PAGE - 1);

    if (error || !data || data.length === 0) break;
    allRows.push(...data);
    if (data.length < PAGE) break;
    pageStart += PAGE;
  }

  // Сортировка: приоритетные бренды первыми, затем по SKU
  allRows.sort((a, b) => {
    const pa = a.brand && PRIORITY_BRANDS.includes(a.brand) ? 0 : 1;
    const pb = b.brand && PRIORITY_BRANDS.includes(b.brand) ? 0 : 1;
    if (pa !== pb) return pa - pb;
    return a.sku < b.sku ? -1 : a.sku > b.sku ? 1 : 0;
  });

  return allRows.slice(0, 5000).map((r) => r.sku);
}

export async function GET() {
  const now = new Date().toISOString().split('T')[0];

  // 1. Analog mapping pages (kebab-case keys → /analog/<key>)
  const mappingUrls = ANALOG_MAPPING_KEYS.map((slug) =>
    `  <url>\n    <loc>${BASE_URL}/analog/${slug}</loc>\n    <lastmod>${now}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.8</priority>\n  </url>`
  );

  // 2. Static analog pages (/analog/IRFZ44N etc.)
  const staticUrls = STATIC_ANALOG_SLUGS.map((slug) =>
    `  <url>\n    <loc>${BASE_URL}/analog/${slug}</loc>\n    <lastmod>${now}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.8</priority>\n  </url>`
  );

  // 3. Компоненты с реальными именами (name != sku) — наиболее ценные
  //    для B2B-поиска аналогов. Приоритет — ведущие бренды.
  const enrichedSlugs = await getEnrichedComponentSlugs();
  const enrichedUrls = enrichedSlugs.map((sku) =>
    `  <url>\n    <loc>${escapeXml(`${BASE_URL}/component/${encodeURIComponent(sku)}`)}</loc>\n    <lastmod>${now}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.7</priority>\n  </url>`
  );

  const allUrls = [...mappingUrls, ...staticUrls, ...enrichedUrls].join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${allUrls}\n</urlset>`;

  return new NextResponse(xml, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}

// app/sitemap-recent.xml/route.ts
// Sitemap с недавно добавленными компонентами (последние 1000)
// Создан для устранения ошибки Yandex Webmaster "404 на sitemap-recent.xml"
//
// SEO FIX (audit 2026-11-10): SKU экранируется через encodeURIComponent,
// чтобы спецсимволы (#, &, ?, +, пробел) корректно вставлялись в URL.
// Раньше SKU с '#' (например, LT8390AIUFD#PBF) попадал в <loc> как literal,
// что ломало краулинг: браузеры и curl интерпретировали #PBF как fragment,
// а сервер получал только путь /component/LT8390AIUFD → 404.
// Теперь # становится %23, и URL кликабелен и валиден.

import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-static';
export const revalidate = 86400; // 24 hours

const BASE_URL = 'https://www.chip-net.ru';

function escapeXml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

async function GET_IMPL() {
  const now = new Date().toISOString().split('T')[0];

  // Получаем последние 1000 компонентов, отсортированных по дате создания
  const { data, error } = await supabase
    .from('components')
    .select('sku, created_at')
    .order('created_at', { ascending: false })
    .limit(1000);

  const components = data || [];

  const urls = components
    .map((c: { sku: string; created_at?: string }) => {
      const lastmod = c.created_at
        ? new Date(c.created_at).toISOString().split('T')[0]
        : now;
      // encodeURIComponent кодирует #, &, ?, +, пробел и т.д.
      // escapeXml дополнительно экранирует & (из %26 и т.п.) для XML-валидности
      const loc = escapeXml(`${BASE_URL}/component/${encodeURIComponent(c.sku)}`);
      return `
  <url>
    <loc>${loc}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>`;
    })
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;

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

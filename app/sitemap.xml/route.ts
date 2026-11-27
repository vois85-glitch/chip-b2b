// app/sitemap.xml/route.ts — Proper Sitemap INDEX
//
// Этот роут возвращает <sitemapindex> со ссылками на все sitemap-сегменты:
//   - sitemap-static.xml       (homepage, categories, brands, blog, hubs)
//   - sitemap-products-1.xml   (components 1-25000)
//   - sitemap-products-2.xml   (components 25001-50000)
//   - sitemap-products-3.xml   (components 50001-75000, фактически ~2913 для 52913 в БД)
//   - sitemap-analogs.xml      (analog/landing pages for popular parts)
//   - sitemap-recent.xml       (last 1000 components by created_at)

export const dynamic = 'force-dynamic';
export const revalidate = 3600;

const BASE_URL = 'https://www.chip-net.ru';

export async function GET() {
  const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

  const sitemaps: Array<{ loc: string; lastmod: string }> = [
    { loc: `${BASE_URL}/sitemap-static.xml`, lastmod: today },
    { loc: `${BASE_URL}/sitemap-products-1.xml`, lastmod: today },
    { loc: `${BASE_URL}/sitemap-products-2.xml`, lastmod: today },
    { loc: `${BASE_URL}/sitemap-products-3.xml`, lastmod: today },
    { loc: `${BASE_URL}/sitemap-analogs.xml`, lastmod: today },
    { loc: `${BASE_URL}/sitemap-recent.xml`, lastmod: today },
  ];

  const body =
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    sitemaps
      .map(
        (s) =>
          `  <sitemap>\n    <loc>${s.loc}</loc>\n    <lastmod>${s.lastmod}</lastmod>\n  </sitemap>`
      )
      .join('\n') +
    `\n</sitemapindex>\n`;

  return new Response(body, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
      'X-Robots-Tag': 'index, follow',
    },
  });
}

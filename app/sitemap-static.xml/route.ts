// app/sitemap-static.xml/route.ts — Static pages sitemap
// Homepage, SEO hubs, categories, brands, blog posts, knowledge-base, industries
// Expected: ~170 URLs (well under 50k limit)

import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { seoPages } from '@/lib/seo-pages-data';
import { blogPosts } from '@/lib/blog-data';
import { brandUrl } from '@/lib/brand-url';

export const runtime = 'nodejs';
export const revalidate = 3600; // Cache for 1 hour
export const dynamic = 'force-static'; // ISR — build once, revalidate every hour

const BASE_URL = 'https://www.chip-net.ru';

function escapeXml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

// ─────────────────────────────────────────────────────────────────────────
// SEO FIX (audit 2026-11-09, upd 2026-11-10): пути, отдающие HTTP 3xx редирект.
// Эти легаси-URL редиректят на канонические хаб-страницы, которые уже
// присутствуют в sitemap. Чтобы не тратить краулинговый бюджет поисковых
// роботов на редиректы, исключаем их из sitemap-static.xml.
//
// Карта редиректов (проверено curl -IL):
//   HTTP 308 (Permanent Redirect, метод сохраняется):
//     /hard-to-find     → /elektronnye-komponenty  (есть в hubPages)
//     /toshiba          → /brands                  (есть в hubPages)
//     /yageo            → /brands                  (есть в hubPages)
//     /kemet            → /brands                  (есть в hubPages)
//     /podbor-analogov  → /analogs                 (есть в hubPages)
//     /proizvoditeli    → /brands                  (есть в hubPages)
//   HTTP 301 (Permanent Redirect, метод GET):
//     /brand/c&k        → /brands                  (есть в hubPages; бренд C&K удалён из БД)
// ─────────────────────────────────────────────────────────────────────────
const EXCLUDED_REDIRECT_PATHS = new Set([
  // HTTP 308 — легаси-URL, редиректящие на хаб-страницы
  '/hard-to-find',
  '/toshiba',
  '/yageo',
  '/kemet',
  '/podbor-analogov',
  '/proizvoditeli',
  // HTTP 301 — бренд C&K удалён из БД, редирект на индекс брендов
  '/brand/c&k',
]);


export async function GET() {
  const urls: Array<{ loc: string; lastmod: string; changefreq: string; priority: string }> = [];
  const now = new Date().toISOString().split('T')[0];

  // 1. Homepage
  urls.push({
    loc: `${BASE_URL}/`,
    lastmod: now,
    changefreq: 'weekly',
    priority: '1.0',
  });

  // 2. SEO hub pages
  const hubPages = [
    { path: '/catalog', priority: '0.9', changefreq: 'daily' },
    { path: '/brands', priority: '0.9', changefreq: 'weekly' },
    { path: '/analogs', priority: '0.8', changefreq: 'weekly' },
    { path: '/obsolete', priority: '0.8', changefreq: 'weekly' },
    { path: '/datasheets', priority: '0.8', changefreq: 'weekly' },
    { path: '/bom', priority: '0.8', changefreq: 'monthly' },
    { path: '/industries', priority: '0.7', changefreq: 'monthly' },
    { path: '/knowledge-base', priority: '0.7', changefreq: 'weekly' },
    { path: '/blog', priority: '0.7', changefreq: 'weekly' },
    { path: '/importozameshchenie', priority: '0.8', changefreq: 'weekly' },
    { path: '/delivery', priority: '0.8', changefreq: 'monthly' },
    { path: '/o-kompanii', priority: '0.7', changefreq: 'monthly' },
    { path: '/quality-assurance', priority: '0.7', changefreq: 'monthly' },
    { path: '/anti-counterfeit', priority: '0.7', changefreq: 'monthly' },
    { path: '/hard-to-find', priority: '0.7', changefreq: 'monthly' },
    { path: '/urgent-sourcing', priority: '0.7', changefreq: 'monthly' },
    { path: '/sourcing-expertise', priority: '0.7', changefreq: 'monthly' },
    { path: '/stm32', priority: '0.8', changefreq: 'weekly' },
    { path: '/fpga-hub', priority: '0.8', changefreq: 'weekly' },
    { path: '/ti', priority: '0.8', changefreq: 'weekly' },
    { path: '/xilinx', priority: '0.8', changefreq: 'weekly' },
    { path: '/igbt', priority: '0.7', changefreq: 'weekly' },
  ];

  for (const hub of hubPages) {
    urls.push({
      loc: `${BASE_URL}${hub.path}`,
      lastmod: now,
      changefreq: hub.changefreq,
      priority: hub.priority,
    });
  }

  // 3. SEO pages from seoPages data (categories, brands, info)
  for (const slug of Object.keys(seoPages)) {
    const page = seoPages[slug];
    urls.push({
      loc: `${BASE_URL}/${slug}`,
      lastmod: now,
      changefreq: page.type === 'category' ? 'weekly' : 'monthly',
      priority: page.type === 'category' ? '0.8' : page.type === 'brand' ? '0.7' : '0.6',
    });
  }

  // 4. Dynamic brand pages (only brands without seoPages and without redirects)
  const seoBrandSlugs = new Set(
    Object.keys(seoPages).filter(s => seoPages[s].type === 'brand')
  );
  const redirectedBrandSlugs = new Set([
    'intel-altera', 'xilinx', 'nxp', 'infineon', 'stmicroelectronics',
    'texas-instruments', 'analog-devices', 'microchip', 'renesas', 'onsemi',
    'lattice', 'murata', 'tdk', 'vishay', 'micron', 'gigadevice',
    'wurth-elektronik', 'diodes-inc', 'fujitsu', 'nordic',
    'stm', 'ti', 'adi', 'microchip-technology', 'on-semiconductor',
    'wurth', 'diodes', 'aimtec',
    'molex', 'rohm', 'avx', 'cypress',
    'espressif', 'gowin', 'monolithic-power', 'mdd', 'we',
    'другой', 'китай', 'invensense', 'worldsemi',
    'ixys', 'u-blox', 'qualcomm', 'realtek', 'panasonic',
  ]);

  try {
    // SEO FIX (2026-11-13): Раньше `supabase.from('components').select('brand')`
    // тянул ВСЕ 53 000+ строк только для получения уникальных брендов.
    // Это была одна из причин превышения лимита egress Supabase (HTTP 402).
    // Заменяем на лёгкий запрос к таблице `brands` (~60 строк).
    const { data: brandRows } = await supabase
      .from('brands')
      .select('slug, name')
      .order('name', { ascending: true });
    if (brandRows) {
      for (const b of brandRows) {
        if (!b.slug || !b.name) continue;
        if (seoBrandSlugs.has(b.slug)) continue;
        if (redirectedBrandSlugs.has(b.slug)) continue;
        urls.push({
          loc: `${BASE_URL}${brandUrl(b.slug)}`,
          lastmod: now,
          changefreq: 'weekly',
          priority: '0.7',
        });
      }
    }
  } catch (e) {
    console.error('[sitemap-static] brand fetch error:', e);
  }

  // 4b. Catalog pagination pages (/catalog/page/1..N) — crawlable URLs
  // that surface 100 components per page for search engines.
  try {
    const { count: catalogCount } = await supabase
      .from('components')
      .select('*', { count: 'exact', head: true });
    const PAGE_SIZE = 100;
    const MAX_PAGES = 200;
    const totalPages = Math.min(
      Math.max(1, Math.ceil((catalogCount || 0) / PAGE_SIZE)),
      MAX_PAGES
    );
    for (let i = 1; i <= totalPages; i++) {
      urls.push({
        loc: `${BASE_URL}/catalog/page/${i}`,
        lastmod: now,
        changefreq: 'weekly',
        priority: '0.8',
      });
    }
  } catch (e) {
    console.error('[sitemap-static] catalog pagination error:', e);
  }

  // 4c. Все категории из БД (level 1 + 2) с ЧПУ /catalog/<parent>/<child>
  // После миграции 13.07.2026 у нас 173 категории (6 root + 30 level-2 + 137 level-3).
  // Только level-1 и level-2 попадают в sitemap (level-3 — слишком много, низкий приоритет).
  try {
    // Level 1 — корневые группы
    const { data: rootCategories } = await supabase
      .from('categories')
      .select('slug, name, updated_at')
      .eq('level', 1)
      .eq('is_active', true)
      .order('sort_order', { ascending: true });
    if (rootCategories) {
      for (const cat of rootCategories) {
        urls.push({
          loc: `${BASE_URL}/catalog/${cat.slug}`,
          lastmod: cat.updated_at ? cat.updated_at.split('T')[0] : now,
          changefreq: 'weekly',
          priority: '0.9',
        });
      }
    }

    // Level 2 — подкатегории (нужен JOIN с parent для parent.slug)
    const { data: subCategories } = await supabase
      .from('categories')
      .select('id, slug, name, parent_id, updated_at')
      .eq('level', 2)
      .eq('is_active', true)
      .order('sort_order', { ascending: true });
    if (subCategories && subCategories.length > 0) {
      // Получим slug всех parent_id одним запросом
      const parentIds = [...new Set(subCategories.map(c => c.parent_id).filter(Boolean))] as string[];
      const { data: parents } = await supabase
        .from('categories')
        .select('id, slug')
        .in('id', parentIds);
      const parentSlugMap = new Map((parents || []).map(p => [p.id, p.slug]));

      for (const cat of subCategories) {
        const parentSlug = parentSlugMap.get(cat.parent_id);
        if (!parentSlug) continue;
        urls.push({
          loc: `${BASE_URL}/catalog/${parentSlug}/${cat.slug}`,
          lastmod: cat.updated_at ? cat.updated_at.split('T')[0] : now,
          changefreq: 'weekly',
          priority: '0.8',
        });
      }
    }
  } catch (e) {
    console.error('[sitemap-static] categories fetch error:', e);
  }

  // 4d. Все бренды из таблицы brands (61 шт. после миграции)
  try {
    const { data: brandsData } = await supabase
      .from('brands')
      .select('slug, name, updated_at')
      .eq('is_active', true)
      .order('sort_order', { ascending: true });
    if (brandsData) {
      for (const brand of brandsData) {
        if (!brand.slug) continue;
        // Skip if already in seoPages (will be added later with higher priority)
        if (seoBrandSlugs.has(brand.slug)) continue;
        if (redirectedBrandSlugs.has(brand.slug)) continue;
        urls.push({
          loc: `${BASE_URL}/brand/${brand.slug}`,
          lastmod: brand.updated_at ? brand.updated_at.split('T')[0] : now,
          changefreq: 'weekly',
          priority: '0.7',
        });
      }
    }
  } catch (e) {
    console.error('[sitemap-static] brands fetch error:', e);
  }

// 5. Blog posts
  for (const post of blogPosts) {
    urls.push({
      loc: `${BASE_URL}/blog/${post.slug}`,
      lastmod: post.date,
      changefreq: 'yearly',
      priority: '0.6',
    });
  }

  // 6. Industries
  urls.push({
    loc: `${BASE_URL}/industries`,
    lastmod: now,
    changefreq: 'monthly',
    priority: '0.7',
  });

  // 7. Knowledge base (hub + articles)
  urls.push({
    loc: `${BASE_URL}/knowledge-base`,
    lastmod: now,
    changefreq: 'weekly',
    priority: '0.7',
  });
  // Real knowledge-base article slugs (must match app/knowledge-base/[slug]/page.tsx)
  const kbArticles = [
    'proverka-originalnosti-mikroshem',
    'podbor-analogov-sanktsionnykh-komponentov',
    'importozameshchenie-stm32',
    'vybor-fpga-dlya-promyshlennykh-proektov',
    'bom-analiz-i-optimizatsiya',
    'logistika-i-ved',
  ];
  for (const slug of kbArticles) {
    urls.push({
      loc: `${BASE_URL}/knowledge-base/${slug}`,
      lastmod: now,
      changefreq: 'monthly',
      priority: '0.6',
    });
  }
  // Real industries slugs (must match app/industries/[slug]/page.tsx)
  const industries = [
    'oboronnij-kompleks',
    'promyshlennaya-avtomatika',
    'telekommunikatsii',
    'energetika',
    'meditsina',
    'avtomobilestroenie',
    'aerokosmicheskaya-otrasl',
    'potrebitelskaya-otrasl',
  ];
  for (const slug of industries) {
    urls.push({
      loc: `${BASE_URL}/industries/${slug}`,
      lastmod: now,
      changefreq: 'monthly',
      priority: '0.6',
    });
  }
  // Real analog mappings (must match app/analog/[original]/page.tsx keys)
  const analogMappings = [
    'stm32f103-gd32f103',
    'stm32f407-gd32f407',
    'spartan-6-gowin',
    'STM32F103C8T6',
    'STM32F407VET6',
    'ESP32-WROOM-32',
    'ATmega328P',
    'TPS5430',
    'LM2596',
    'AMS1117',
  ];
  for (const original of analogMappings) {
    urls.push({
      loc: `${BASE_URL}/analog/${encodeURIComponent(original)}`,
      lastmod: now,
      changefreq: 'monthly',
      priority: '0.7',
    });
  }

  // ─────────────────────────────────────────────────────────────────────────
  // SEO FIX (audit 2026-11-09, upd 2026-11-10): исключаем пути с HTTP 3xx редиректом.
  // Эти легаси-URL редиректят на канонические хаб-страницы, которые уже
  // присутствуют в sitemap — нет смысла отдавать их поисковым роботам.
  // Полный список — в EXCLUDED_REDIRECT_PATHS выше.
  // ─────────────────────────────────────────────────────────────────────────
  const filteredForRedirects = urls.filter(u => {
    try {
      const path = new URL(u.loc).pathname;
      return !EXCLUDED_REDIRECT_PATHS.has(path);
    } catch {
      return true; // если URL невалидный — оставляем (дедупликация разберётся)
    }
  });

  // ─────────────────────────────────────────────────────────────────────────
  // Дедупликация URL по loc (audit 2026-07-20: было 25 дублей, /brands ×19 и т.д.)
  // ─────────────────────────────────────────────────────────────────────────
  const seen = new Set<string>();
  const dedupedUrls = filteredForRedirects.filter(u => {
    if (seen.has(u.loc)) return false;
    seen.add(u.loc);
    return true;
  });

  // Build XML
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${dedupedUrls.map(u => `  <url>
    <loc>${escapeXml(u.loc)}</loc>
    <lastmod>${u.lastmod}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

  return new NextResponse(xml, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}

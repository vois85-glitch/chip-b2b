/**
 * lib/brand-url.ts — Helper to convert brand slug to direct URL.
 *
 * Why: /brand/[slug] now redirects to either:
 *   - /slug (for brands with their own SEO page — see next.config.ts redirects)
 *   - /brands (catch-all for brands without SEO page)
 *
 * Yandex Webmaster reports 984 broken internal links because /brand/* returns
 * HTTP 308 redirect, which Yandex treats as "broken" for SEO purposes.
 * Using direct URLs instead eliminates the redirect hop and improves SEO.
 */

// Brand slugs that have their own SEO page (matching next.config.ts redirects)
const BRAND_DIRECT_URLS: Record<string, string> = {
  'intel-altera': '/altera',
  'xilinx': '/xilinx',
  'nxp': '/nxp',
  'infineon': '/infineon',
  'stmicroelectronics': '/stmicroelectronics',
  'texas-instruments': '/texas-instruments',
  'analog-devices': '/analog-devices',
  'microchip': '/microchip',
  'renesas': '/renesas',
  'onsemi': '/onsemi',
  'lattice': '/lattice',
  'murata': '/murata',
  'tdk': '/tdk',
  'vishay': '/vishay',
  'micron': '/micron',
  'gigadevice': '/gigadevice',
  'wurth-elektronik': '/wurth-elektronik',
  'diodes-inc': '/diodes-inc',
  'fujitsu': '/fujitsu',
  'nordic': '/nordic',
  'altera': '/altera',
  // Common alternative spellings
  'st': '/stmicroelectronics',
  'ti': '/texas-instruments',
  'adi': '/analog-devices',
  'on-semi': '/onsemi',
  'wurth-elektronik-gmbh': '/wurth-elektronik',
};

/**
 * Convert brand slug to direct URL.
 * Returns /brands (catch-all) for brands without their own SEO page.
 *
 * @example
 * brandUrl('xilinx')        // → '/xilinx'
 * brandUrl('Gowin')         // → '/brands'  (no direct page)
 * brandUrl('Analog Devices') // → '/analog-devices'  (auto slugified)
 */
export function brandUrl(slugOrName: string): string {
  if (!slugOrName) return '/brands';

  // Normalize: lowercase, replace spaces/dots with dashes
  const slug = slugOrName
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/\./g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');

  return BRAND_DIRECT_URLS[slug] || '/brands';
}

/**
 * Convert brand name (human-readable) to slug.
 * @example
 * brandToSlug('Analog Devices') // → 'analog-devices'
 */
export function brandToSlug(brand: string): string {
  return brand
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/\./g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

// Export the lookup table for direct access if needed
export { BRAND_DIRECT_URLS };

/**
 * 2026-10-30: Единая точка построения ссылки на бренд.
 * Активный бренд с хабом → хаб (/altera, /xilinx…), активный без хаба →
 * /brand/<slug>, иначе — фильтр каталога /catalog?brand=<имя>.
 */
export function brandPageUrl(name: string, slug: string, active: boolean): string {
  if (slug && active) {
    const normalized = slug.toLowerCase().trim();
    const direct = BRAND_DIRECT_URLS[normalized];
    if (direct) return direct;
    return `/brand/${slug}`;
  }
  return `/catalog?brand=${encodeURIComponent(name)}`;
}

/**
 * 2026-10-31: ссылка на бренд ИЗ каталога (плитки «Каталог по брендам»).
 * По требованию заказчика все бренды ведут на страницу-витрину /brand/<slug>
 * (категории бренда с фото + навигация, референс avd-instrument.ru),
 * включая те, у кого есть SEO-хаб /<slug> — хабы остаются для поисковиков.
 */
export function brandCatalogUrl(name: string, slug: string, active: boolean): string {
  if (slug && active) return `/brand/${slug}`;
  return `/catalog?brand=${encodeURIComponent(name)}`;
}

// lib/seo/filter-params.ts
//
// SEO (2026-11-23): параметры фильтрации/поиска/пагинации каталога.
// Google Search Console фиксировал 22 000+ «пустых» показов на URL вида
// /catalog?brand=... и /catalog?...page=7 — комбинации фильтров и глубокая
// пагинация не дают уникальной ценности и размывают индекс.
//
// Политика:
//   • если в searchParams есть хотя бы один параметр ниже — страница
//     отдаёт robots: noindex, follow (бот ходит по ссылкам на карточки
//     товаров, но комбинации фильтров не индексируются);
//   • alternates.canonical всегда указывает на чистый URL раздела
//     без query-параметров.

export const FILTER_SEARCH_PARAMS = [
  'category',
  'brand',
  'page',
  'search',
  'q',
  'sort',
  'capacity',
] as const;

export type SearchParamsRecord = Record<string, string | string[] | undefined>;

/** Есть ли в searchParams параметры фильтрации/поиска/пагинации. */
export function hasFilterSearchParams(
  sp: SearchParamsRecord | undefined | null,
): boolean {
  if (!sp) return false;
  return FILTER_SEARCH_PARAMS.some((key) => {
    const v = sp[key];
    if (typeof v === 'string') return v.length > 0;
    if (Array.isArray(v)) return v.some((x) => typeof x === 'string' && x.length > 0);
    return false;
  });
}

/** robots-мета в зависимости от наличия фильтров. */
export function robotsForSearchParams(
  sp: SearchParamsRecord | undefined | null,
): { index: boolean; follow: boolean } {
  return hasFilterSearchParams(sp)
    ? { index: false, follow: true }
    : { index: true, follow: true };
}

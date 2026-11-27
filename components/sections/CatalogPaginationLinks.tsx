// components/sections/CatalogPaginationLinks.tsx
// Server Component — adds crawlable pagination links from homepage to /catalog/page/N
// This boosts internal linking depth and exposes all 200 paginated catalog pages to crawlers.

import Link from 'next/link';

const BASE_URL = 'https://www.chip-net.ru';
const MAX_LINKS = 200; // matches MAX_PAGES in [page]/page.tsx

// Generate a sparse but comprehensive set of pagination links:
// 1, 2, 3, 4, 5, 10, 20, 30, ..., 100, 110, 120, ..., 200
function getPageNumbers(): number[] {
  const pages: Set<number> = new Set([1, 2, 3, 4, 5]);
  // Add every 10th page: 10, 20, 30, ..., 200
  for (let p = 10; p <= MAX_LINKS; p += 10) {
    pages.add(p);
  }
  // Add some final pages
  pages.add(MAX_LINKS);
  return Array.from(pages).sort((a, b) => a - b);
}

export default function CatalogPaginationLinks() {
  const pages = getPageNumbers();

  const itemListLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Страницы каталога электронных компонентов ChipNet',
    numberOfItems: MAX_LINKS,
    itemListElement: pages.map((p, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      name: `Страница ${p}`,
      url: `${BASE_URL}/catalog/page/${p}`,
    })),
  };

  return (
    <section className="px-4 py-12 bg-[#f5f7f3]" aria-label="Страницы каталога">
      <div className="max-w-7xl mx-auto">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListLd) }}
        />
        <h2 className="text-2xl md:text-3xl font-bold mb-3 text-[#121212] text-center">
          Каталог электронных компонентов
        </h2>
        <p className="text-center text-[#666] mb-8 max-w-2xl mx-auto">
          Более 20 000 наименований микросхем, транзисторов, ПЛИС и разъёмов от 70+ мировых производителей.
          Выберите страницу каталога для просмотра списка компонентов с актуальным наличием.
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          {pages.map((p) => (
            <Link
              key={p}
              href={`/catalog/page/${p}`}
              className="px-3 py-2 text-sm border border-[#e8e8e8] rounded-md bg-white hover:border-[#02a391] hover:text-[#02a391] transition-colors font-medium"
              prefetch={false}
            >
              {p}
            </Link>
          ))}
        </div>
        <div className="text-center mt-6">
          <Link prefetch={false}
            href="/catalog"
            className="inline-flex items-center gap-2 text-[#02a391] hover:text-[#02907f] font-semibold transition-colors"
          >
            Открыть полный каталог с фильтрами
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}

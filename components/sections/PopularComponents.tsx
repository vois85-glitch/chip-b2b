// components/sections/PopularComponents.tsx
// Server Component — fetches 16 random in-stock components from Supabase
// and renders them as standard <a href="/component/{sku}"> links for SEO.
// These deep links from the homepage pass PageRank to product pages.

import Link from 'next/link';
import { supabaseAdmin } from '@/lib/supabase-admin';

export const revalidate = 3600; // ISR — refresh cache every hour

export default async function PopularComponents() {
  // Fetch up to 24 in-stock components (status === 'В производстве'),
  // most recently added first (descending id), then randomize on display.
  const { data: components, error } = await supabaseAdmin
    .from('components')
    .select('sku, name, brand, category, status')
    .eq('status', 'В производстве')
    .order('id', { ascending: false })
    .range(0, 23);

  if (error || !components || components.length === 0) {
    return null;
  }

  // Pick 16 random from the 24 fetched — gives variety on each revalidate,
  // so each Yandexbot visit sees a slightly different set of links.
  const shuffled = [...components].sort(() => Math.random() - 0.5).slice(0, 16);

  return (
    <section
      className="py-12 px-4 bg-[#f0f4ee] border-y border-[#e8e8e8]"
      data-section="popular-components"
      aria-label="Популярные компоненты в наличии"
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex items-end justify-between mb-6 flex-wrap gap-3">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <svg className="w-5 h-5 text-[#02a391]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <h2 className="text-xl md:text-2xl font-bold text-[#121212]">
                Популярные компоненты
              </h2>
            </div>
            <p className="text-sm text-[#666] max-w-2xl">
              Компоненты в наличии на складе, готовые к отгрузке. Поставка от 1 шт.,
              безналичный расчёт с НДС, проверка подлинности в лаборатории СВП.
            </p>
          </div>
          <Link prefetch={false}
            href="/catalog"
            className="text-sm text-[#02a391] hover:underline whitespace-nowrap font-medium"
          >
            Весь каталог →
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {shuffled.map((c) => (
            <Link
              key={c.sku}
              href={`/component/${encodeURIComponent(c.sku)}`}
              className="block bg-white border border-[#e8e8e8] rounded-lg p-3 hover:border-[#02a391]/40 hover:shadow-md transition-all group"
              prefetch={false}
            >
              <div className="font-mono text-sm font-bold text-[#121212] group-hover:text-[#02a391] transition-colors truncate">
                {c.sku}
              </div>
              <div className="text-[11px] text-[#757575] mt-1 truncate">
                {c.brand}
              </div>
              <div className="text-[10px] text-[#9a9a9a] mt-0.5 truncate">
                {c.category}
              </div>
              <div className="mt-2 inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded">
                <span className="w-1 h-1 bg-emerald-500 rounded-full" />
                В наличии
              </div>
            </Link>
          ))}
        </div>

        <p className="text-xs text-[#9a9a9a] mt-4 text-center">
          Показано 16 из 50 000+ компонентов в каталоге. Полный список — на странице каталога.
        </p>
      </div>
    </section>
  );
}

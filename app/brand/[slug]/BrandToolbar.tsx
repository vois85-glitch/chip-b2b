'use client';

/**
 * app/brand/[slug]/BrandToolbar.tsx — панель инструментов страницы бренда
 * по образцу avd-instrument.ru (референс 2026-10-31):
 *  - крупная кнопка «Категории» (раскрывает панель со всеми категориями бренда)
 *  - выпадающий список сортировки → ведёт в каталог с фильтром бренда и sort=
 * Все переходы — настоящие URL: работает история назад/вперёд.
 */
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export type BrandCategoryItem = {
  name: string;
  count: number;
  href: string;
};

const SORT_OPTIONS: { value: string; label: string }[] = [
  { value: '', label: 'Исходная сортировка' },
  { value: 'name', label: 'Название: А–Я' },
  { value: 'stock', label: 'Сначала в наличии' },
  { value: 'price_asc', label: 'Цена: сначала дешевле' },
  { value: 'price_desc', label: 'Цена: сначала дороже' },
];

export default function BrandToolbar({
  brandSlug,
  brandName,
  categories,
  initialSort = '',
}: {
  brandSlug: string;
  brandName: string;
  categories: BrandCategoryItem[];
  initialSort?: string;
}) {
  const router = useRouter();
  const [catsOpen, setCatsOpen] = useState(false);

  // 2026-10-31: сортировка применяется НА странице бренда (/brand/<slug>?sort=…)
  // — middleware канонизирует /catalog?brand=… в /brand/…, поэтому сортируем тут.
  const onSortChange = (value: string) => {
    router.push(value ? `/brand/${brandSlug}?sort=${value}` : `/brand/${brandSlug}`);
  };

  return (
    <div className="mb-6">
      {/* Ряд инструментов: «Категории» + сортировка */}
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          type="button"
          onClick={() => setCatsOpen(v => !v)}
          aria-expanded={catsOpen}
          className="flex-1 min-w-0 inline-flex items-center justify-center gap-2.5 h-12 px-6 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-base font-bold transition-colors shadow-sm cursor-pointer"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h10M4 18h7" />
          </svg>
          Категории
          <svg
            className={`w-4 h-4 transition-transform duration-200 ${catsOpen ? 'rotate-180' : ''}`}
            fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {/* Сортировка — как у референса «Исходная сортировка» */}
        <div className="relative sm:w-72">
          <select
            onChange={e => onSortChange(e.target.value)}
            defaultValue={initialSort}
            aria-label="Сортировка компонентов бренда"
            className="w-full h-12 pl-4 pr-10 bg-white border border-[#e4eae2] rounded-xl text-base font-semibold text-[#333] appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-colors"
          >
            {SORT_OPTIONS.map(o => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
          <svg
            className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#666] pointer-events-none"
            fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 9l4-4 4 4M8 15l4 4 4-4" />
          </svg>
        </div>
      </div>

      {/* Раскрывающаяся панель категорий бренда */}
      {catsOpen && (
        <div className="mt-3 bg-white border border-[#e4eae2] rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-bold text-[#333] uppercase tracking-wider">
              Все категории {brandName}
            </h2>
            <button
              type="button"
              onClick={() => setCatsOpen(false)}
              aria-label="Скрыть категории"
              className="w-7 h-7 flex items-center justify-center rounded-full text-[#9a9a9a] hover:text-white hover:bg-[#9a9a9a] transition-colors cursor-pointer"
            >
              &#10005;
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map(cat => (
              <Link
                key={cat.name}
                prefetch={false}
                href={cat.href}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#f4f6f3] hover:bg-[#e8f0e6] border border-transparent hover:border-primary/30 rounded-full text-sm text-[#444] hover:text-primary transition-colors"
              >
                {cat.name}
                <span className="text-[11px] text-[#898989]">{cat.count.toLocaleString('ru-RU')}</span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

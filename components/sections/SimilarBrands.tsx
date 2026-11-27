// components/sections/SimilarBrands.tsx
// Server Component — cross-linking between brand pages.
// Renders up to 8 other brand links on each brand page to pass PageRank between brand pages.

import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { brandUrl } from '@/lib/brand-url';

type Props = {
  currentSlug: string;
  currentBrand: string;
};

function brandToSlug(brand: string): string {
  return brand
    .toLowerCase()
    .replace(/[^a-z0-9а-яё]+/gi, '-')
    .replace(/^-|-$/g, '');
}

export default async function SimilarBrands({ currentSlug, currentBrand }: Props) {
  // Fetch all distinct brands from DB, then filter current and pick top 8 by component count
  let otherBrands: { brand: string; count: number }[] = [];
  try {
    const { data, error } = await supabase
      .from('components')
      .select('brand')
      .not('brand', 'is', null);

    if (!error && data && data.length > 0) {
      // Count per brand
      const counts = new Map<string, number>();
      for (const row of data as Array<{ brand: string }>) {
        if (!row.brand) continue;
        counts.set(row.brand, (counts.get(row.brand) || 0) + 1);
      }
      // Convert to array, exclude current brand (by name and by slug match)
      const arr = Array.from(counts.entries())
        .filter(([brand]) => {
          if (brand === currentBrand) return false;
          if (brandToSlug(brand) === currentSlug) return false;
          return true;
        })
        .map(([brand, count]) => ({ brand, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 8);
      otherBrands = arr;
    }
  } catch (e) {
    console.error('[SimilarBrands] fetch error:', e);
    return null;
  }

  if (otherBrands.length === 0) return null;

  return (
    <section className="px-4 pb-16" aria-label="Другие бренды">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl font-bold mb-2 text-[#121212]">
          Другие производители
        </h2>
        <p className="text-[#666] text-sm mb-6">
          Поставка оригинальных компонентов от других мировых брендов. Все компоненты проходят входной контроль в лаборатории СВП.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {otherBrands.map(({ brand, count }) => {
            const slug = brandToSlug(brand);
            return (
              <Link
                key={brand}
                href={`${brandUrl(slug)}`}
                className="block bg-white border border-[#e8e8e8] rounded-lg p-4 hover:border-[#02a391]/40 hover:shadow-md transition-all group"
                prefetch={false}
              >
                <div className="font-semibold text-sm text-[#121212] group-hover:text-[#02a391] transition-colors truncate">
                  {brand}
                </div>
                <div className="text-xs text-[#757575] mt-1">
                  {count.toLocaleString('ru-RU')} позиций
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

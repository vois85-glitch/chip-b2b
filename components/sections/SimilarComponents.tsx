// components/sections/SimilarComponents.tsx
// Server Component — fetches 4-8 similar components (same brand or category,
// excluding current SKU) and renders them as <a href> links.
// This ensures no product page is an "orphan" — every page links to related
// pages, distributing PageRank through the catalog.

import Link from 'next/link';
import { supabaseAdmin } from '@/lib/supabase-admin';

export const revalidate = 3600;

type SimilarItem = {
  sku: string;
  name: string;
  brand: string;
  category: string;
  status: string;
};

export default async function SimilarComponents({
  currentSku,
  brand,
  category,
}: {
  currentSku: string;
  brand: string;
  category: string;
}) {
  // Strategy: try same brand first (excludes current SKU), supplement with
  // same category if brand has fewer than 4 results.
  let { data: byBrand } = await supabaseAdmin
    .from('components')
    .select('sku, name, brand, category, status')
    .eq('brand', brand)
    .neq('sku', currentSku)
    .limit(8);

  let similar: SimilarItem[] = byBrand || [];

  if (similar.length < 4) {
    const { data: byCat } = await supabaseAdmin
      .from('components')
      .select('sku, name, brand, category, status')
      .eq('category', category)
      .neq('sku', currentSku)
      .limit(8 - similar.length);
    if (byCat) {
      const existingSkus = new Set(similar.map((s) => s.sku));
      similar = [...similar, ...byCat.filter((s) => !existingSkus.has(s.sku))];
    }
  }

  if (similar.length === 0) return null;

  // Deduplicate and limit to 8
  // audit 2026-07-24 P0: filter out items with null/empty/"null" SKU to prevent
  // generation of /component/null links (4 hits in 7 days from YandexBot)
  const seen = new Set<string>();
  const items = similar.filter((s) => {
    if (!s.sku || s.sku === 'null' || s.sku === 'undefined' || s.sku.trim() === '') return false;
    if (seen.has(s.sku)) return false;
    seen.add(s.sku);
    return true;
  }).slice(0, 8);

  return (
    <section
      className="mt-12"
      data-section="similar-components"
      aria-label="Похожие компоненты"
    >
      <div className="flex items-end justify-between mb-4 flex-wrap gap-2">
        <div>
          <h2 className="text-2xl font-bold text-[#121212] mb-1">
            Похожие компоненты
          </h2>
          <p className="text-sm text-[#666]">
            Компоненты из той же категории и от того же производителя
          </p>
        </div>
        {category && (
          <Link prefetch={false}
            href={`/catalog?category=${encodeURIComponent(category)}`}
            className="text-sm text-[#02a391] hover:underline whitespace-nowrap font-medium"
          >
            Все в категории «{category}» →
          </Link>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {items.map((c) => (
          <Link
            key={c.sku}
            href={`/component/${encodeURIComponent(c.sku)}`}
            className="block bg-[#f0f4ee] border border-[#e8e8e8] rounded-lg p-4 hover:border-[#02a391]/40 hover:shadow-md transition-all group"
            prefetch={false}
          >
            <div className="font-mono text-sm font-bold text-[#121212] group-hover:text-[#02a391] transition-colors truncate">
              {c.sku}
            </div>
            <div className="text-xs text-[#757575] mt-1 truncate">{c.brand}</div>
            <div className="text-[10px] text-[#9a9a9a] mt-0.5 truncate">{c.category}</div>
            <div className="mt-2">
              {c.status !== 'В производстве' && (
                <span className="inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 bg-red-50 text-red-700 border border-red-200 rounded">
                  <span className="w-1 h-1 bg-red-500 rounded-full" />
                  EOL
                </span>
              )}
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

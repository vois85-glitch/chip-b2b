// app/catalog/[parentSlug]/page.tsx
//
// Страница группы каталога (level=1): /catalog/<group-slug>
// Пример: /catalog/active — обзор группы "Активные компоненты"
// Показывает все подкатегории (level=2) этой группы + топ-компоненты

import { Metadata } from 'next';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import BreadcrumbNav from '@/components/ui/BreadcrumbNav';
import { notFound } from 'next/navigation';
import { robotsForSearchParams, SearchParamsRecord } from '@/lib/seo/filter-params';

const BASE_URL = 'https://www.chip-net.ru';

export const revalidate = 3600;
export const dynamicParams = false;  // audit 2026-07-20: 404 for unknown parentSlug (was 200 soft-404)

type Props = {
  params: Promise<{ parentSlug: string }>;
  searchParams: Promise<SearchParamsRecord>;
};

export async function generateStaticParams() {
  // VERCEL FIX (2026-11-27): try/catch — сборка без БД не падает (см. childSlug)
  try {
    const { data: groups } = await supabase
      .from('categories')
      .select('slug')
      .eq('level', 1)
      .eq('is_active', true);

    return (groups || []).map(g => ({ parentSlug: g.slug }));
  } catch (e) {
    console.error('[catalog/parent] generateStaticParams error:', e);
    return [];
  }
}

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const { parentSlug } = await params;
  const sp = await searchParams;
  const { data: group } = await supabase
    .from('categories')
    .select('name, slug, description, seo_title, seo_description, meta_h1, icon, color, bg')
    .eq('slug', parentSlug)
    .eq('level', 1)
    .limit(1)
    .single();

  if (!group) {
    // audit 2026-07-20: real 404 (was soft-404 with title 'Группа не найдена' + 200 OK)
    notFound();
  }

  const title = group.seo_title || `${group.name} — каталог и поставка оптом`;
  const description = group.seo_description || group.description || `${group.name}: полный каталог электронных компонентов. Поставка оптом, проверка СВП, доставка по РФ.`;
  const url = `${BASE_URL}/catalog/${parentSlug}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url, type: 'website', locale: 'ru_RU', siteName: 'ChipNet' },
    // SEO (2026-11-23): чистые URL группы — index; query-параметры (?brand=,
    // ?page=, ?search=...) → noindex, follow. Canonical всегда чистый.
    robots: robotsForSearchParams(sp),
  };
}

export default async function GroupPage({ params }: Props) {
  const { parentSlug } = await params;

  const { data: group } = await supabase
    .from('categories')
    .select('id, name, slug, description, meta_h1, icon, color, bg')
    .eq('slug', parentSlug)
    .eq('level', 1)
    .limit(1)
    .single();

  if (!group) notFound();

  // Получим все level=2 категории этой группы + count компонентов в каждой
  const { data: categories } = await supabase
    .from('categories')
    .select('id, name, slug, description, sort_order')
    .eq('parent_id', group.id)
    .eq('level', 2)
    .eq('is_active', true)
    .order('sort_order', { ascending: true });

  // Count компонентов в каждой категории (параллельные запросы)
  const categoriesWithCounts = await Promise.all(
    (categories || []).map(async (cat) => {
      const { count } = await supabase
        .from('components')
        .select('id', { count: 'exact', head: true })
        .eq('category_id', cat.id);
      return { ...cat, count: count || 0 };
    })
  );

  const url = `${BASE_URL}/catalog/${parentSlug}`;
  const h1 = group.meta_h1 || group.name;

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Главная', item: BASE_URL },
      { '@type': 'ListItem', position: 2, name: 'Каталог', item: `${BASE_URL}/catalog` },
      { '@type': 'ListItem', position: 3, name: group.name, item: url },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />

      <main className="min-h-screen bg-background text-[#121212]">
        <section className="pb-6">
          {/* pt- и max-w-7xl предоставляются catalog layout.tsx */}
            {/* 2026-10-31: крошки-КНОПКИ (пилюли 40px) */}
            <BreadcrumbNav
              className="mb-3"
              items={[
                { name: 'Главная', href: '/' },
                { name: 'Каталог', href: '/catalog' },
                { name: group.name },
              ]}
            />

            <h1 className="text-3xl md:text-4xl font-bold mb-2 text-primary">{h1}</h1>
            {group.description && (
              <p className="text-[#666] text-lg max-w-3xl">{group.description}</p>
            )}
        </section>

        <section className="px-4 pb-12">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {categoriesWithCounts.map(cat => (
                <Link
                  key={cat.id}
                  href={`/catalog/${parentSlug}/${cat.slug}`}
                  className="block bg-white border border-[#e8e8e8] rounded-xl p-5 hover:border-[#059669]/40 hover:shadow-md transition-all group"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h2 className="text-lg font-bold text-[#121212] group-hover:text-[#059669] transition-colors">
                      {cat.name}
                    </h2>
                    <span className="text-[10px] text-[#757575] bg-[#eaf0e8] px-2 py-1 rounded">
                      {cat.count.toLocaleString('ru-RU')} шт.
                    </span>
                  </div>
                  {cat.description && (
                    <p className="text-xs text-[#666] line-clamp-2">{cat.description}</p>
                  )}
                  <div className="mt-3 text-xs text-[#059669] font-semibold">
                    Смотреть все →
                  </div>
                </Link>
              ))}
            </div>

            {categoriesWithCounts.length === 0 && (
              <div className="text-center py-20">
                <p className="text-[#757575]">В этой группе пока нет категорий.</p>
                <Link href="/catalog" className="text-[#059669] hover:underline mt-4 inline-block">
                  ← В каталог
                </Link>
              </div>
            )}
          </div>
        </section>
      </main>
    </>
  );
}

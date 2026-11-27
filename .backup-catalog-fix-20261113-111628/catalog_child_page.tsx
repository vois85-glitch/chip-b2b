// app/catalog/[parentSlug]/[childSlug]/page.tsx
//
// ЧПУ-страница категории: /catalog/<group-slug>/<category-slug>
// Примеры:
//   /catalog/active/mikrokontrollery  — Микроконтроллеры (группа "Активные")
//   /catalog/passive/kondensatory     — Конденсаторы (группа "Пассивные")
//   /catalog/power/stabilizatory      — Стабилизаторы
//
// Делает JOIN с categories по (parent.slug + child.slug), потом JOIN с components
// по category_id. Показывает:
//   - Хлебные крошки: Главная / Каталог / Группа / Категория
//   - Список компонентов (48 на страницу)
//   - Sidebar с подкатегориями (level 3) этой категории
//   - Sidebar с топ-брендами в этой категории

import { Metadata } from 'next';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { itemListSchema } from '@/lib/seo/item-list-schema';
import ProductCard from '@/components/ui/ProductCard';
import BreadcrumbNav from '@/components/ui/BreadcrumbNav';

const BASE_URL = 'https://www.chip-net.ru';

export const revalidate = 3600;
export const dynamic = 'force-dynamic';

type Props = {
  params: Promise<{ parentSlug: string; childSlug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

// ───────────────────────────────────────────────────────────────────────────
// generateStaticParams: прегенерация всех 30 категорий уровня 2
// (для SSG при build)
// ───────────────────────────────────────────────────────────────────────────
export async function generateStaticParams() {
  const { data: categories } = await supabase
    .from('categories')
    .select('slug, parent_id')
    .eq('level', 2)
    .not('parent_id', 'is', null);

  if (!categories) return [];

  // Получим slug всех родителей одним запросом
  const parentIds = [...new Set(categories.map(c => c.parent_id).filter(Boolean))] as string[];
  const { data: parents } = await supabase
    .from('categories')
    .select('id, slug')
    .in('id', parentIds);

  const parentMap = new Map((parents || []).map(p => [p.id, p.slug]));

  return categories
    .map(c => ({
      parentSlug: parentMap.get(c.parent_id!) || 'category',
      childSlug: c.slug,
    }))
    .filter(p => p.parentSlug !== 'category');
}

// ───────────────────────────────────────────────────────────────────────────
// generateMetadata: SEO-теги для страницы категории
// ───────────────────────────────────────────────────────────────────────────
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { parentSlug, childSlug } = await params;

  // Найдём категорию + её родителя
  const { data: parent } = await supabase
    .from('categories')
    .select('id, name, slug')
    .eq('slug', parentSlug)
    .eq('level', 1)
    .limit(1)
    .single();

  if (!parent) return { title: 'Категория не найдена' };

  const { data: category } = await supabase
    .from('categories')
    .select('id, name, slug, description, seo_title, seo_description, meta_h1')
    .eq('slug', childSlug)
    .eq('parent_id', parent.id)
    .eq('level', 2)
    .limit(1)
    .single();

  if (!category) return { title: 'Категория не найдена' };

  const title = category.seo_title || `${category.name} — купить оптом с доставкой по РФ | ChipNet`;
  const description = category.seo_description || category.description || `${category.name} — поставка электронных компонентов оптом. Проверка в лаборатории СВП, доставка по РФ и ЕАЭС, от 1 шт.`;
  const url = `${BASE_URL}/catalog/${parentSlug}/${childSlug}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type: 'website',
      locale: 'ru_RU',
      siteName: 'ChipNet',
    },
    robots: { index: true, follow: true },
  };
}

// ───────────────────────────────────────────────────────────────────────────
// Page component
// ───────────────────────────────────────────────────────────────────────────
export default async function CategoryPage({ params, searchParams }: Props) {
  const { parentSlug, childSlug } = await params;
  const sp = await searchParams;
  const pageStr = typeof sp.page === 'string' ? sp.page : '1';
  const currentPage = Math.max(1, parseInt(pageStr, 10) || 1);
  const brandFilter = typeof sp.brand === 'string' ? sp.brand : '';
  const search = typeof sp.search === 'string' ? sp.search : '';

  // 1. Найти parent (level=1)
  const { data: parent } = await supabase
    .from('categories')
    .select('id, name, slug, description')
    .eq('slug', parentSlug)
    .eq('level', 1)
    .limit(1)
    .single();

  if (!parent) notFound();

  // 2. Найти категорию (level=2) под этим parent
  const { data: category } = await supabase
    .from('categories')
    .select('id, name, slug, description, seo_title, seo_description, meta_h1, icon, color, bg')
    .eq('slug', childSlug)
    .eq('parent_id', parent.id)
    .eq('level', 2)
    .limit(1)
    .single();

  if (!category) notFound();

  const PAGE_SIZE = 48;
  const offset = (currentPage - 1) * PAGE_SIZE;
  const url = `${BASE_URL}/catalog/${parentSlug}/${childSlug}`;
  const h1 = category.meta_h1 || category.name;

  // 3. Найти brand_id если есть фильтр бренда
  let brandId: string | null = null;
  let brandName: string | null = null;
  if (brandFilter) {
    const { data: brandRow } = await supabase
      .from('brands')
      .select('id, name, slug')
      .or(`slug.eq.${brandFilter},name.eq.${brandFilter}`)
      .limit(1);
    if (brandRow && brandRow[0]) {
      brandId = brandRow[0].id;
      brandName = brandRow[0].name;
    }
  }

  // 4. Основной запрос к components с серверной фильтрацией по category_id (UUID)
  let query = supabase
    .from('components')
    .select('id, sku, name, brand, category, category_id, status, attributes', { count: 'exact' })
    .eq('category_id', category.id);

  if (brandId) {
    query = query.eq('brand_id', brandId);
  }

  if (search) {
    query = query.or(`sku.ilike.%${search}%,name.ilike.%${search}%`);
  }

  const { data: components, count } = await query
    .order('id', { ascending: true })
    .range(offset, offset + PAGE_SIZE - 1);

  // 5. Получить подкатегории (level=3) этой категории
  const { data: subcategories } = await supabase
    .from('categories')
    .select('id, name, slug, level, parent_id')
    .eq('parent_id', category.id)
    .eq('level', 3)
    .eq('is_active', true)
    .order('sort_order', { ascending: true });

  // 6. Получить топ-брендов в этой категории (с count компонентов)
  // ✅ RPC: 1 запрос вместо загрузки всех компонентов категории
  const { data: brandsInCatData } = await supabase.rpc('get_brand_counts_by_category', { cat_uuid: category.id });
  const brandCounts: Record<string, number> = (brandsInCatData && typeof brandsInCatData === 'object')
    ? brandsInCatData as Record<string, number>
    : {};
  const topBrands = Object.entries(brandCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 15);

  // 7. Получить соседние категории (level=2 в той же группе) — для навигации
  const { data: siblingCategories } = await supabase
    .from('categories')
    .select('id, name, slug')
    .eq('parent_id', parent.id)
    .eq('level', 2)
    .neq('id', category.id)
    .eq('is_active', true)
    .order('sort_order', { ascending: true });

  // 8. Total pages
  const totalItems = count || 0;
  const totalPages = Math.max(1, Math.ceil(totalItems / PAGE_SIZE));

  // 9. JSON-LD
  const itemListLd = components && components.length > 0 ? itemListSchema(
    components.slice(0, 20).map((c: any) => ({
      sku: c.sku,
      name: c.name,
      brand: c.brand,
      category: c.category,
      description: c.description,
      status: c.status,
    })),
    `${category.name}${brandName ? ` — ${brandName}` : ''}`,
    url,
    totalItems
  ) : null;

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Главная', item: BASE_URL },
      { '@type': 'ListItem', position: 2, name: 'Каталог', item: `${BASE_URL}/catalog` },
      { '@type': 'ListItem', position: 3, name: parent.name, item: `${BASE_URL}/catalog/${parent.slug}` },
      { '@type': 'ListItem', position: 4, name: category.name, item: url },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      {itemListLd && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListLd) }} />
      )}

      <main className="min-h-screen bg-background text-[#121212]">
        <section className="pt-[196px] pb-6 px-4">
          <div className="max-w-7xl mx-auto">
            {/* 2026-10-31: крошки-КНОПКИ (пилюли 40px) */}
            <BreadcrumbNav
              className="mb-3"
              items={[
                { name: 'Главная', href: '/' },
                { name: 'Каталог', href: '/catalog' },
                { name: parent.name, href: `/catalog/${parent.slug}` },
                { name: category.name },
              ]}
            />

            <h1 className="text-3xl md:text-4xl font-bold mb-2 text-primary">
              {h1}
              {brandName && <span className="text-[#666] text-2xl"> — {brandName}</span>}
            </h1>
            <p className="text-[#666] text-lg mb-2">
              {totalItems.toLocaleString('ru-RU')} {totalItems === 1 ? 'наименование' : totalItems < 5 ? 'наименования' : 'наименований'}
              {search && ` по запросу «${search}»`}
            </p>
            {category.description && (
              <p className="text-[#757575] text-sm max-w-3xl">{category.description}</p>
            )}
          </div>
        </section>

        <section className="px-4 pb-6">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-6">
            {/* Sidebar */}
            <aside className="space-y-4">
              {/* Subcategories (level 3) — 2026-10-31: КНОПКИ, а не слова */}
              {subcategories && subcategories.length > 0 && (
                <div className="bg-[#eaf0e8] border border-[#e8e8e8] rounded-xl p-4">
                  <h3 className="text-sm font-bold text-[#333] mb-3 uppercase tracking-wider">Подкатегории</h3>
                  <div className="flex flex-col gap-1.5">
                    {subcategories.map(sub => (
                      <Link
                        key={sub.id}
                        href={`/catalog/${parent.slug}/${childSlug}?search=${encodeURIComponent(sub.name)}`}
                        className="inline-flex items-center justify-between gap-2 min-h-10 px-3.5 py-2 bg-white border border-[#e4eae2] rounded-lg text-sm font-semibold text-[#555] hover:text-primary hover:border-primary/50 hover:bg-[#f4faf6] active:bg-[#e6f2ea] transition-all shadow-sm touch-manipulation"
                      >
                        <span className="truncate">{sub.name}</span>
                        <svg className="w-3.5 h-3.5 text-[#c4cdc2] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Top brands in this category — 2026-10-31: КНОПКИ с бейджем количества */}
              {topBrands.length > 0 && (
                <div className="bg-[#eaf0e8] border border-[#e8e8e8] rounded-xl p-4">
                  <h3 className="text-sm font-bold text-[#333] mb-3 uppercase tracking-wider">Бренды в категории</h3>
                  <div className="flex flex-col gap-1.5 max-h-96 overflow-y-auto">
                    {topBrands.map(([name, cnt]) => {
                      // brand slug для ссылки
                      const brandSlugForLink = name.toLowerCase().replace(/[^a-z0-9а-яё]+/gi, '-').replace(/^-+|-+$/g, '');
                      const isActive = brandName === name;
                      return (
                        <Link
                          key={name}
                          href={`/catalog/${parent.slug}/${childSlug}?brand=${encodeURIComponent(brandSlugForLink)}`}
                          className={`inline-flex items-center justify-between gap-2 min-h-10 px-3.5 py-2 rounded-lg text-sm font-semibold transition-all shadow-sm touch-manipulation ${
                            isActive
                              ? 'bg-primary text-white border border-primary'
                              : 'bg-white border border-[#e4eae2] text-[#555] hover:text-primary hover:border-primary/50 hover:bg-[#f4faf6] active:bg-[#e6f2ea]'
                          }`}
                        >
                          <span className="truncate">{name}</span>
                          <span className={`text-[11px] flex-shrink-0 px-1.5 py-0.5 rounded-full ${
                            isActive ? 'bg-white/20 text-white' : 'bg-[#f4f6f3] text-[#898989] border border-[#e9eee7]'
                          }`}>
                            {cnt}
                          </span>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Sibling categories — 2026-10-31: КНОПКИ, а не слова */}
              {siblingCategories && siblingCategories.length > 0 && (
                <div className="bg-[#eaf0e8] border border-[#e8e8e8] rounded-xl p-4">
                  <h3 className="text-sm font-bold text-[#333] mb-3 uppercase tracking-wider">Соседние категории</h3>
                  <div className="flex flex-col gap-1.5">
                    {siblingCategories.map(sib => (
                      <Link
                        key={sib.id}
                        href={`/catalog/${parent.slug}/${sib.slug}`}
                        className="inline-flex items-center justify-between gap-2 min-h-10 px-3.5 py-2 bg-white border border-[#e4eae2] rounded-lg text-sm font-semibold text-[#555] hover:text-primary hover:border-primary/50 hover:bg-[#f4faf6] active:bg-[#e6f2ea] transition-all shadow-sm touch-manipulation"
                      >
                        <span className="truncate">{sib.name}</span>
                        <svg className="w-3.5 h-3.5 text-[#c4cdc2] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </aside>

            {/* Component grid */}
            <div>
              {components && components.length > 0 ? (
                <>
                  <p className="text-sm text-[#757575] mb-4">
                    Страница {currentPage} из {totalPages}. Показано {components.length} из {totalItems.toLocaleString('ru-RU')}.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {components.map((c: any) => (
                      <ProductCard
                        key={c.sku}
                        product={{
                          sku: c.sku,
                          name: c.name,
                          brand: c.brand,
                          category: c.category,
                          status: c.status,
                          attributes: c.attributes,
                        }}
                      />
                    ))}
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <nav className="flex items-center justify-center gap-2 mt-8 flex-wrap">
                      {currentPage > 1 && (
                        <Link
                          href={`/catalog/${parentSlug}/${childSlug}?page=${currentPage - 1}${brandFilter ? `&brand=${brandFilter}` : ''}${search ? `&search=${search}` : ''}`}
                          className="px-3 py-2 text-sm border border-[#e8e8e8] rounded hover:border-primary"
                        >
                          ← Назад
                        </Link>
                      )}
                      {Array.from({ length: Math.min(7, totalPages) }, (_, i) => {
                        const startPage = Math.max(1, Math.min(currentPage - 3, totalPages - 6));
                        const pageNum = startPage + i;
                        if (pageNum > totalPages) return null;
                        return (
                          <Link
                            key={pageNum}
                            href={`/catalog/${parentSlug}/${childSlug}?page=${pageNum}${brandFilter ? `&brand=${brandFilter}` : ''}${search ? `&search=${search}` : ''}`}
                            className={`px-3 py-2 text-sm border rounded ${
                              pageNum === currentPage
                                ? 'bg-primary text-white border-primary'
                                : 'border-[#e8e8e8] hover:border-primary'
                            }`}
                          >
                            {pageNum}
                          </Link>
                        );
                      })}
                      {currentPage < totalPages && (
                        <Link
                          href={`/catalog/${parentSlug}/${childSlug}?page=${currentPage + 1}${brandFilter ? `&brand=${brandFilter}` : ''}${search ? `&search=${search}` : ''}`}
                          className="px-3 py-2 text-sm border border-[#e8e8e8] rounded hover:border-primary"
                        >
                          Вперёд →
                        </Link>
                      )}
                    </nav>
                  )}
                </>
              ) : (
                <div className="text-center py-20">
                  <div className="text-5xl mb-4">&#128269;</div>
                  <h3 className="text-xl font-bold text-[#333] mb-2">В этой категории нет компонентов</h3>
                  <p className="text-[#757575] mb-6">Возможно, они были перемещены или сняты с производства.</p>
                  <Link
                    href="/catalog"
                    className="px-6 py-2.5 bg-primary hover:bg-primary-dark rounded-lg font-semibold text-[#121212] transition-colors"
                  >
                    ← В каталог
                  </Link>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

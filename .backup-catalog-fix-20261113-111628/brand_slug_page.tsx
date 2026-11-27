import { Metadata } from 'next';
import { supabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import ComponentSearch from '@/components/sections/ComponentSearch';
import SimilarBrands from '@/components/sections/SimilarBrands';
import BrandLogoImg from '@/components/ui/BrandLogoImg';
import { categoryPhoto } from '@/lib/category-photos';
import { itemListSchema } from '@/lib/seo/item-list-schema';
import BrandToolbar, { BrandCategoryItem } from './BrandToolbar';
import BreadcrumbNav from '@/components/ui/BreadcrumbNav';
import ProductCard from '@/components/ui/ProductCard';

const BASE_URL = 'https://www.chip-net.ru';

export const revalidate = 3600;
export const dynamic = 'force-dynamic';

type Component = {
  sku: string;
  name: string;
  brand: string;
  category: string;
  category_id: string | null;
  description: string;
  status: string;
  analogs: string[];
};

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

// Разрешённые сортировки (совпадают с каталогом)
const VALID_SORTS = new Set(['name', 'stock', 'price_asc', 'price_desc']);

// ───────────────────────────────────────────────────────────────────────────
// generateStaticParams: прегенерация активных брендов из БД
// ───────────────────────────────────────────────────────────────────────────
export async function generateStaticParams() {
  try {
    const { data: brands } = await supabase
      .from('brands')
      .select('slug')
      .eq('is_active', true);
    if (!brands) return [];
    return brands
      .filter(b => b.slug && b.slug.length > 0)
      .map(b => ({ slug: b.slug }));
  } catch (e) {
    console.error('[brand] generateStaticParams error:', e);
    return [];
  }
}

// ───────────────────────────────────────────────────────────────────────────
// generateMetadata: SEO-теги из brands.seo_title / seo_description
// ───────────────────────────────────────────────────────────────────────────
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  const { data: brand } = await supabase
    .from('brands')
    .select('id, name, slug, description, seo_title, seo_description')
    .eq('slug', slug)
    .eq('is_active', true)
    .limit(1)
    .single();

  if (!brand) {
    return { title: 'Бренд не найден' };
  }

  const title = brand.seo_title || `${brand.name} — электронные компоненты оптом, аналоги, даташит`;
  const description = brand.seo_description || brand.description || `Поставка электронных компонентов ${brand.name}. Оригинальная продукция, подбор аналогов, проверка в лаборатории СВП.`;
  // Если у бренда есть SEO-хаб страница /<slug> — canonical указывает на неё
  // (чтобы избежать дублей с /brand/<slug> и /<slug>)
  const seoHubBrands = new Set([
    'texas-instruments', 'stmicroelectronics', 'analog-devices', 'microchip',
    'onsemi', 'nxp', 'infineon', 'xilinx', 'intel-altera', 'lattice',
    'murata', 'tdk', 'vishay', 'micron', 'gigadevice', 'renesas',
    'broadcom', 'rohm', 'toshiba', 'samsung',
  ]);
  const hasSeoHub = seoHubBrands.has(slug);
  const canonicalUrl = hasSeoHub ? `${BASE_URL}/${slug}` : `${BASE_URL}/brand/${slug}`;
  const url = `${BASE_URL}/brand/${slug}`;

  return {
    title,
    description,
    alternates: { canonical: canonicalUrl },
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
// Page component — редизайн 2026-10-31 по референсу avd-instrument.ru:
// тёмно-изумрудный hero с логотипом, тулбар «Категории + сортировка»,
// плитки категорий бренда с фотографиями, затем компоненты.
// ───────────────────────────────────────────────────────────────────────────
export default async function BrandPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const sp = await searchParams;
  const url = `${BASE_URL}/brand/${slug}`;
  const currentSort = typeof sp.sort === 'string' && VALID_SORTS.has(sp.sort) ? sp.sort : '';

  // 1. Найти бренд по slug в таблице brands
  const { data: brand } = await supabase
    .from('brands')
    .select('id, name, slug, description, seo_title, seo_description, country, official_distributor, website_url')
    .eq('slug', slug)
    .eq('is_active', true)
    .limit(1)
    .single();

  if (!brand) {
    notFound();
  }

  // 2. Компоненты бренда — первые 50 для витрины, с серверной сортировкой ?sort=
  const PAGE_SIZE = 50;
  let compQuery = supabase
    .from('components')
    .select('sku, name, brand, category, category_id, description, status, analogs', { count: 'exact' })
    .eq('brand_id', brand.id);
  if (currentSort === 'name') {
    compQuery = compQuery.order('name', { ascending: true });
  } else if (currentSort === 'stock') {
    compQuery = compQuery.order('stock', { ascending: false, nullsFirst: false });
  } else if (currentSort === 'price_asc') {
    compQuery = compQuery.order('price', { ascending: true, nullsFirst: false });
  } else if (currentSort === 'price_desc') {
    compQuery = compQuery.order('price', { ascending: false, nullsFirst: false });
  }
  const { data: components, count } = await compQuery
    .order('id', { ascending: true })
    .range(0, PAGE_SIZE - 1);

  const totalCount = count || 0;
  const componentsList: Component[] = (components || []) as Component[];

  // 3. Категории бренда с точными счётчиками.
  // Полный скан одного лёгкого столбца category_id (индекс по brand_id) —
  // даёт честные числа на плитках для любого объёма (TI ~5.9К позиций).
  const catCounts: Record<string, number> = {};
  try {
    const { data: catIdsRows } = await supabase
      .from('components')
      .select('category_id')
      .eq('brand_id', brand.id);
    for (const r of catIdsRows || []) {
      if (r.category_id) catCounts[r.category_id] = (catCounts[r.category_id] || 0) + 1;
    }
  } catch {
    // без счётчиков плитки всё равно показываются
  }

  // 4. Имена/slug/родители категорий → ссылки ЧПУ /catalog/<parent>/<child>?brand=<slug>
  const catIds = Object.keys(catCounts);
  const categoryMap = new Map<string, { name: string; slug: string; parentSlug: string | null }>();
  if (catIds.length > 0) {
    const { data: cats } = await supabase
      .from('categories')
      .select('id, name, slug, parent_id')
      .in('id', catIds)
      .eq('level', 2);

    if (cats && cats.length > 0) {
      const parentIds = [...new Set(cats.map(c => c.parent_id).filter(Boolean))] as string[];
      const { data: parents } = await supabase
        .from('categories')
        .select('id, slug')
        .in('id', parentIds);
      const parentSlugMap = new Map((parents || []).map(p => [p.id, p.slug]));

      for (const c of cats) {
        categoryMap.set(c.id, {
          name: c.name,
          slug: c.slug,
          parentSlug: c.parent_id ? parentSlugMap.get(c.parent_id) || null : null,
        });
      }
    }
  }

  // Плитки категорий бренда — сортировка по количеству (как на референсе)
  const brandCategoryItems: BrandCategoryItem[] = Array.from(categoryMap.entries())
    .map(([catId, cat]) => ({
      name: cat.name,
      count: catCounts[catId] || 0,
      href: cat.parentSlug
        ? `/catalog/${cat.parentSlug}/${cat.slug}?brand=${encodeURIComponent(brand.slug)}`
        : `/catalog?brand=${encodeURIComponent(brand.slug)}&category=${encodeURIComponent(cat.name)}`,
    }))
    .sort((a, b) => b.count - a.count);

  // 5. Breadcrumb + ItemList JSON-LD
  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Главная', item: BASE_URL },
      { '@type': 'ListItem', position: 2, name: 'Каталог', item: `${BASE_URL}/catalog` },
      { '@type': 'ListItem', position: 3, name: 'Бренды', item: `${BASE_URL}/brands` },
      { '@type': 'ListItem', position: 4, name: brand.name, item: url },
    ],
  };

  const itemListLd = componentsList.length > 0 ? itemListSchema(
    componentsList.slice(0, 20).map((c) => ({
      sku: c.sku,
      name: c.name,
      brand: c.brand,
      category: c.category,
      description: c.description,
      status: c.status,
    })),
    `Компоненты ${brand.name}`,
    url,
    totalCount
  ) : null;

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      {itemListLd && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListLd) }} />
      )}
      <main className="min-h-screen bg-background text-[#121212]">
        {/* 2026-10-31: крошки-КНОПКИ (пилюли 40px) — удобно нажимать, история назад/вперёд работает */}
        {/* pt-190/200: шапка + sticky-поиск занимают ~180px — раньше крошки прятались под поиск */}
        <div className="px-4 pt-[190px] md:pt-[200px]">
          <div className="max-w-7xl mx-auto">
            <BreadcrumbNav
              className="mb-5"
              items={[
                { name: 'Главная', href: '/' },
                { name: 'Каталог', href: '/catalog' },
                { name: 'Бренды', href: '/brands' },
                { name: brand.name },
              ]}
            />
          </div>
        </div>

        {/* Hero бренда — тёмно-изумрудный, логотип как главный элемент */}
        <section className="px-4">
          <div className="max-w-7xl mx-auto">
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#082c23] via-[#052018] to-[#02120e] shadow-sm">
              <div className="relative px-6 py-7 md:px-10 md:py-9">
                <div className="lg:grid lg:grid-cols-[1.4fr_1fr] lg:gap-10">
                  <div>
                    {/* Логотип бренда на белой плашке — главный элемент шапки */}
                    <div className="inline-flex items-center justify-center bg-white rounded-xl px-5 py-3 mb-4 min-w-[140px] min-h-[64px]">
                      <BrandLogoImg
                        name={brand.name}
                        slug={brand.slug}
                        alt={`Логотип ${brand.name}`}
                        className="max-h-10 max-w-[180px] w-auto object-contain"
                      />
                    </div>
                    <h1 className="text-2xl md:text-4xl font-bold text-white mb-2 leading-tight">
                      Компоненты {brand.name}
                    </h1>
                    <p className="text-white/70 text-sm md:text-base max-w-2xl">
                      {brand.description || `Поставка оригинальных электронных компонентов производства ${brand.name}. Проверка оригинальности в лаборатории СВП, подбор аналогов, доставка от 6 дней.`}
                    </p>
                  </div>
                  <div className="flex flex-col justify-center gap-3 mt-5 lg:mt-0">
                    <div className="flex flex-wrap gap-2">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/10 border border-white/15 rounded-full text-xs font-medium text-white backdrop-blur-sm">
                        <svg className="w-3.5 h-3.5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                        </svg>
                        {totalCount.toLocaleString('ru-RU')} наименований
                      </span>
                      {brandCategoryItems.length > 0 && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/10 border border-white/15 rounded-full text-xs font-medium text-white backdrop-blur-sm">
                          <svg className="w-3.5 h-3.5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1V6zM14 6a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1V6zM4 14a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1v-4zM14 14a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
                          </svg>
                          {brandCategoryItems.length} категорий
                        </span>
                      )}
                      {brand.country && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/10 border border-white/15 rounded-full text-xs font-medium text-white backdrop-blur-sm">
                          <svg className="w-3.5 h-3.5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {brand.country}
                        </span>
                      )}
                      {brand.official_distributor && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/20 border border-emerald-400/30 rounded-full text-xs font-semibold text-emerald-300 backdrop-blur-sm">
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                          Официальный дистрибьютор
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-3">
                      <Link
                        prefetch={false}
                        href="#categories"
                        className="inline-flex items-center gap-2 px-5 h-11 bg-emerald-600 text-white hover:bg-emerald-500 rounded-xl text-sm font-bold transition-colors shadow-sm"
                      >
                        К категориям бренда
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7-7-7m7 7V3" />
                        </svg>
                      </Link>
                      <Link
                        prefetch={false}
                        href="/rfq"
                        className="inline-flex items-center gap-2 px-5 h-11 border border-white/40 text-white hover:bg-white/10 rounded-xl text-sm font-semibold backdrop-blur-sm transition-colors"
                      >
                        Запрос (RFQ)
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Поиск */}
        <section className="px-4 mt-8">
          <div className="max-w-7xl mx-auto">
            <ComponentSearch />
          </div>
        </section>

        {/* Тулбар референса: «Категории» + сортировка */}
        {brandCategoryItems.length > 0 && (
          <section className="px-4 mt-8">
            <div className="max-w-7xl mx-auto">
              <BrandToolbar
                brandSlug={brand.slug}
                brandName={brand.name}
                categories={brandCategoryItems}
                initialSort={currentSort}
              />
            </div>
          </section>
        )}

        {/* Категории бренда — плитки с фотографиями (как на референсе AirTac) */}
        {brandCategoryItems.length > 0 && (
          <section id="categories" className="px-4 pb-4 scroll-mt-36" aria-label={`Категории компонентов ${brand.name}`}>
            <div className="max-w-7xl mx-auto">
              <h2 className="text-xl md:text-2xl font-bold text-[#121212] mb-5">
                Категории {brand.name}
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
                {brandCategoryItems.map(cat => (
                  <Link
                    key={cat.name}
                    prefetch={false}
                    href={cat.href}
                    className="group bg-white border border-[#e4eae2] rounded-xl overflow-hidden hover:border-primary/50 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
                  >
                    {/* Фотография категории — главная картинка плитки */}
                    <span className="block aspect-[4/3] overflow-hidden bg-white relative">
                      <Image
                        src={categoryPhoto(cat.name)}
                        alt={cat.name}
                        width={200}
                        height={150}
                        loading="lazy"
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </span>
                    <span className="block p-3">
                      <span className="block font-semibold text-sm text-[#121212] group-hover:text-primary leading-snug line-clamp-2 transition-colors">
                        {cat.name} {brand.name}
                      </span>
                      <span className="block text-xs text-[#898989] mt-1">
                        {cat.count.toLocaleString('ru-RU')} наименований
                      </span>
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Список компонентов */}
        {componentsList.length > 0 && (
          <section className="px-4 py-12">
            <div className="max-w-7xl mx-auto">
              <div className="flex items-baseline justify-between gap-3 mb-5">
                <h2 className="text-xl md:text-2xl font-bold text-[#121212]">
                  Популярные компоненты {brand.name}
                </h2>
                <span className="text-sm text-[#898989] whitespace-nowrap">
                  Первые {componentsList.length} из {totalCount.toLocaleString('ru-RU')}
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {componentsList.map((c) => {
                  const cat = c.category_id ? categoryMap.get(c.category_id) : null;
                  return (
                    <ProductCard
                      key={c.sku}
                      product={{
                        sku: c.sku,
                        name: c.name,
                        brand: c.brand,
                        category: cat ? cat.name : undefined,
                        status: c.status,
                      }}
                    />
                  );
                })}
              </div>

              {totalCount > PAGE_SIZE && (
                <div className="mt-8 text-center">
                  <p className="text-sm text-[#757575] mb-4">
                    Показано первые {PAGE_SIZE} из {totalCount.toLocaleString('ru-RU')} компонентов.
                    Полный список — через категории выше или по запросу.
                  </p>
                  <div className="flex flex-wrap justify-center gap-3">
                    <Link
                      prefetch={false}
                      href="#categories"
                      className="inline-block px-6 py-3 bg-emerald-600 hover:bg-emerald-500 rounded-lg font-semibold text-white transition-colors"
                    >
                      Выбрать категорию {brand.name}
                    </Link>
                    <Link
                      prefetch={false}
                      href="/rfq"
                      className="inline-block px-6 py-3 bg-white border border-[#e0e8de] hover:border-primary/50 rounded-lg font-semibold text-[#333] hover:text-primary transition-colors"
                    >
                      Запросить полный список
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </section>
        )}

        <SimilarBrands currentSlug={brand.slug} currentBrand={brand.name} />
      </main>
    </>
  );
}

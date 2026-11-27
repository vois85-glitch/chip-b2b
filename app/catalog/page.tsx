import { Metadata } from 'next';
import Link from 'next/link';
import { Suspense } from 'react';
import { supabase } from '@/lib/supabase';
import CatalogClient from './CatalogClient';
import CallbackRequestButton from '@/components/layout/CallbackRequestButton';
import BreadcrumbNav from '@/components/ui/BreadcrumbNav';
import { itemListSchema } from '@/lib/seo/item-list-schema';
import { classifyComponents } from '@/lib/classify-component';
import { robotsForSearchParams, SearchParamsRecord } from '@/lib/seo/filter-params';

const BASE_URL = 'https://www.chip-net.ru';

export const revalidate = 3600;
// SEO FIX (2026-11-13): убран force-dynamic — он отключал ISR и заставлял
// каждый визит делать живые запросы к Supabase (усиливало превышение egress quota).
// Теперь страница кэшируется на час.

// SEO (2026-11-23): metadata → generateMetadata. Если в URL есть параметры
// фильтрации/поиска/пагинации (?category=, ?brand=, ?page=, ?search=, ?sort=),
// отдаём robots: noindex, follow — бот переходит по ссылкам на карточки товаров,
// но комбинации фильтров и глубокая пагинация (?page=7, ?page=13) не индексируются.
// Canonical всегда указывает на чистый /catalog без query-параметров.
// Устраняет 22 000+ «пустых» показов из Google Search Console.
type PageProps = {
  searchParams: Promise<SearchParamsRecord>;
};

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const params = await searchParams;
  return {
    title: 'Каталог электронных компонентов — Микросхемы, транзисторы, ПЛИС, разъёмы',
    description: 'Каталог электронных компонентов: микросхемы, микроконтроллеры, ПЛИС, транзисторы, диоды, конденсаторы, резисторы, разъёмы. Более 50 000 наименований от 60+ производителей. Проверка в лаборатории СВП.',
    alternates: { canonical: `${BASE_URL}/catalog` },
    openGraph: {
      title: 'Каталог электронных компонентов',
      description: 'Более 50 000 наименований электронных компонентов от 60+ производителей.',
      url: `${BASE_URL}/catalog`,
      type: 'website',
      locale: 'ru_RU',
      siteName: 'ChipNet',
      images: [{ url: '/og-image.png', width: 1344, height: 768, alt: 'Каталог электронных компонентов ChipNet' }],
    },
    robots: robotsForSearchParams(params),
  };
}

function CatalogFallback() {
  return (
    <div className="text-center py-20">
      <div className="text-4xl mb-4">&#9203;</div>
      <p className="text-[#757575]">Загрузка каталога...</p>
    </div>
  );
}

// Разрешённые режимы сортировки (серверные, через Supabase order)
const VALID_SORTS = new Set(['name', 'stock', 'price_asc', 'price_desc']);

export default async function CatalogPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const currentCategory = typeof params.category === 'string' ? params.category : '';
  const currentBrand = typeof params.brand === 'string' ? params.brand : '';
  const currentSearch = typeof params.search === 'string' ? params.search : '';
  const currentSort = typeof params.sort === 'string' && VALID_SORTS.has(params.sort) ? params.sort : '';
  const pageStr = typeof params.page === 'string' ? params.page : '1';
  const currentPage = Math.max(1, parseInt(pageStr, 10) || 1);

  const PAGE_SIZE = 48;
  const offset = (currentPage - 1) * PAGE_SIZE;

  // Шаг 1. Найти category_id по имени (или slug)
  let categoryId: string | null = null;
  if (currentCategory) {
    const { data: catRow } = await supabase
      .from('categories')
      .select('id, name, slug')
      .eq('name', currentCategory)
      .limit(1);
    if (catRow && catRow[0]) {
      categoryId = catRow[0].id;
    } else {
      const { data: catBySlug } = await supabase
        .from('categories')
        .select('id, name, slug')
        .eq('slug', currentCategory)
        .limit(1);
      if (catBySlug && catBySlug[0]) {
        categoryId = catBySlug[0].id;
      }
    }
  }

  // Шаг 2. Найти brand_id по имени (или slug)
  let brandId: string | null = null;
  if (currentBrand) {
    const { data: brandRow } = await supabase
      .from('brands')
      .select('id, name, slug')
      .eq('name', currentBrand)
      .limit(1);
    if (brandRow && brandRow[0]) {
      brandId = brandRow[0].id;
    } else {
      const { data: brandBySlug } = await supabase
        .from('brands')
        .select('id, name, slug')
        .eq('slug', currentBrand)
        .limit(1);
      if (brandBySlug && brandBySlug[0]) {
        brandId = brandBySlug[0].id;
      }
    }
  }

  // Шаг 3. Основной запрос с серверной фильтрацией и сортировкой.
  // Редизайн 2026-10-28: добавлены price, stock, attributes, description —
  // нужны для бейджей наличия, цен и характеристик в карточках.
  // 48 позиций на страницу — объём HTML остаётся компактным.
  const selectFields = 'id, sku, name, brand, category, description, status, price, stock, attributes';

  let query = supabase
    .from('components')
    .select(selectFields, { count: 'exact' });

  if (categoryId) {
    query = query.eq('category_id', categoryId);
  } else if (currentCategory) {
    query = query.eq('category', currentCategory);
  }

  if (brandId) {
    query = query.eq('brand_id', brandId);
  } else if (currentBrand) {
    query = query.eq('brand', currentBrand);
  }

  if (currentSearch) {
    // Fix 2026-10-28: добавлен brand.ilike — поиск по бренду работал только в старой версии
    query = query.or(`sku.ilike.%${currentSearch}%,name.ilike.%${currentSearch}%,brand.ilike.%${currentSearch}%`);
  }

  // Серверная сортировка (nullsLast — чтобы позиции без цены/остатка не всплывали)
  if (currentSort === 'name') {
    query = query.order('name', { ascending: true });
  } else if (currentSort === 'price_asc') {
    query = query.order('price', { ascending: true, nullsFirst: false });
  } else if (currentSort === 'price_desc') {
    query = query.order('price', { ascending: false, nullsFirst: false });
  } else if (currentSort === 'stock') {
    query = query.order('stock', { ascending: false, nullsFirst: false });
  }

  // SEO FIX (2026-11-13): обёртка в try/catch для устойчивости при ошибках
  // Supabase (402 exceed_egress_quota / 5xx / timeout). Раньше при ошибке
  // переменные молча становились null/0, и UI показывал «0 наименований /
  // 0 брендов / 0 категорий». Теперь при ошибке показываем fallback и баннер.
  let rawComponents: any[] | null = null;
  let count: number | null = null;
  let dbError: string | null = null;
  try {
    const resp = await query
      .order('id', { ascending: true })
      .range(offset, offset + PAGE_SIZE - 1);
    if (resp.error) {
      const msg = resp.error.message || 'unknown error';
      console.error('[catalog/page] Supabase error:', msg);
      if (msg.includes('exceed_egress_quota') || msg.includes('restricted due to')) {
        dbError = 'Идёт плановое обновление каталога.';
      } else {
        dbError = 'Идёт плановое обновление каталога. Отправьте запрос (RFQ) — менеджер подберёт позиции и пришлёт КП в течение 24 часов.';
      }
    } else {
      rawComponents = resp.data;
      count = resp.count;
    }
  } catch (e: any) {
    console.error('[catalog/page] network error:', e?.message || e);
    dbError = 'Идёт плановое обновление каталога. Отправьте запрос (RFQ) — менеджер подберёт позиции и пришлёт КП в течение 24 часов.';
  }

  const components = rawComponents ? classifyComponents(rawComponents as any[]) : [];

  // Шаг 4. Счётчики для сайдбара
  let categoryCounts: Record<string, number> = {};
  let brandCounts: Record<string, number> = {};

  if (currentBrand && brandId) {
    const { data: catsInBrand } = await supabase
      .from('components')
      .select('category')
      .eq('brand_id', brandId);
    if (catsInBrand) {
      for (const c of catsInBrand) {
        if (c.category) categoryCounts[c.category] = (categoryCounts[c.category] || 0) + 1;
      }
    }
  } else {
    // ✅ RPC: get_category_counts() — 1 запрос вместо загрузки 50K строк
    const { data: catCountsData } = await supabase.rpc('get_category_counts');
    if (catCountsData && typeof catCountsData === 'object') {
      categoryCounts = catCountsData as Record<string, number>;
    }
  }

  if (currentCategory && categoryId) {
    // ✅ RPC: get_brand_counts_by_category() — 1 запрос вместо full-scan
    const { data: brandsInCatData } = await supabase.rpc('get_brand_counts_by_category', { cat_uuid: categoryId });
    if (brandsInCatData && typeof brandsInCatData === 'object') {
      brandCounts = brandsInCatData as Record<string, number>;
    }
  } else {
    // ✅ RPC: get_brand_counts() — 1 запрос вместо загрузки 50K строк
    const { data: brandCountsData } = await supabase.rpc('get_brand_counts');
    if (brandCountsData && typeof brandCountsData === 'object') {
      brandCounts = brandCountsData as Record<string, number>;
    }
  }

  const sortedCategories = Object.entries(categoryCounts).sort((a, b) => b[1] - a[1]);
  const sortedBrands = Object.entries(brandCounts).sort((a, b) => b[1] - a[1]);

  // 2026-10-30: слаги и активность брендов — для ссылок на страницы брендов
  // (/brand/<slug>) и реальных логотипов (манифест lib/brand-logos).
  const brandMeta: Record<string, { slug: string; active: boolean }> = {};
  try {
    const { data: brandRows } = await supabase
      .from('brands')
      .select('name, slug, is_active');
    for (const b of brandRows || []) {
      if (b.name && b.name !== '*') {
        brandMeta[b.name] = { slug: b.slug || '', active: !!b.is_active };
      }
    }
  } catch {
    // без слагов плитки брендов просто ссылаются на /catalog?brand=<имя>
  }

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Главная', item: BASE_URL },
      { '@type': 'ListItem', position: 2, name: 'Каталог', item: `${BASE_URL}/catalog` },
    ],
  };

  const itemListLd = components.length > 0 ? itemListSchema(
    components.slice(0, 20).map((c: any) => ({
      sku: c.sku,
      name: c.name,
      brand: c.brand,
      category: c.category,
      description: c.description,
      status: c.status,
    })),
    currentCategory || currentBrand
      ? `Компоненты${currentCategory ? `: ${currentCategory}` : ''}${currentBrand ? ` — ${currentBrand}` : ''}`
      : 'Каталог электронных компонентов',
    `${BASE_URL}/catalog`,
    count || 0
  ) : null;

  const pageTitle = currentCategory || currentBrand
    ? `${currentCategory || ''}${currentCategory && currentBrand ? ' — ' : ''}${currentBrand || ''}`
    : 'Каталог электронных компонентов';

  // SEO FIX (2026-11-13): fallback-значения при ошибке Supabase (402/5xx),
  // чтобы UI не показывал «0 наименований / 0 брендов / 0 категорий».
  // Используем комфортные приближения из метаданных сайта.
  const displayCount = count || (dbError ? 52913 : 0);
  const displayBrandsCount = sortedBrands.length > 0 ? sortedBrands.length : (dbError ? 60 : 0);
  const displayCategoriesCount = sortedCategories.length > 0 ? sortedCategories.length : (dbError ? 30 : 0);

  // УТП-блок в hero — показываем только на общем обзоре каталога,
  // не в режиме поиска/фильтров (как на референсе avd-instrument.ru)
  const showUsp = !currentCategory && !currentBrand && !currentSearch;

  const uspItems: Array<{
    text?: string;
    pre?: string;
    post?: string;
    link?: { href: string; label: string };
  }> = [
    { text: 'Работаем только с юрлицами — договор и закрывающие документы' },
    { pre: 'Подбор ', link: { href: '/analogs', label: 'аналогов и импортозамещение' } },
    { pre: 'Поставка под заказ, в том числе ', link: { href: '/urgent-sourcing', label: 'срочная' } },
    { link: { href: '/bom', label: 'BOM-комплектация' }, post: ' по вашему списку' },
    { link: { href: '/quality-assurance', label: 'Проверка оригинальности' }, post: ' компонентов' },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      {itemListLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListLd) }}
        />
      )}

      {/* ✅ Хлебные крошки-кнопки (пилюли 40px) — единый дизайн-код сайта
          pt-[190px] в catalog/layout.tsx даёт ~16px зазора под 3-рядной шапкой.
          -mt-12 убран: раньше компенсировал отсутствие Row 3 (поиска) в шапке,
          теперь Row 3 есть на всех страницах — отрицательный margin прятал крошки под шапку. */}
      <BreadcrumbNav
        className="mb-4"
        items={[
          { name: 'Главная', href: '/' },
          { name: 'Каталог' },
        ]}
      />

      {/* Hero-блок каталога — фото-фон по образцу avd-instrument.ru */}
      <section className="mb-6">
        <div className="relative overflow-hidden rounded-2xl border border-[#e0e8de] shadow-sm">
          {/* Фотография: печатная плата с микросхемами */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/photos/hero.jpg"
            alt=""
            aria-hidden="true"
            className="absolute inset-0 w-full h-full object-cover"
          />
          {/* Тёмно-изумрудный градиент для читаемости текста */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#082c23] via-[#052018] to-[#02120e]/60" aria-hidden="true" />

          <div className="relative px-6 py-8 md:px-10 md:py-11">
            <div className={showUsp ? 'lg:grid lg:grid-cols-[1.2fr_1fr] lg:gap-12' : ''}>
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/10 border border-white/20 rounded-full text-[11px] font-semibold text-white/90 backdrop-blur-sm mb-4">
                  <svg className="w-3.5 h-3.5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  Поставщик электронных компонентов для производств
                </div>
                <h1 className="text-2xl md:text-[2rem] font-bold text-white mb-2 leading-tight">
                  {pageTitle}
                </h1>
                <p className="text-white/75">
                  {dbError
                    ? 'Идёт плановое обновление каталога.'
                    : count
                      ? `${count.toLocaleString('ru-RU')} наименований${currentSearch ? ` по запросу «${currentSearch}»` : ''}`
                      : 'Загрузка...'}
                </p>
                <div className="flex flex-wrap gap-2 mt-4">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/10 border border-white/15 rounded-full text-xs font-medium text-white backdrop-blur-sm">
                    <svg className="w-3.5 h-3.5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" />
                    </svg>
                    {(count || displayCount).toLocaleString('ru-RU')} наименований
                  </span>
                  <Link
                    href="/brands"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/10 border border-white/15 rounded-full text-xs font-medium text-white backdrop-blur-sm hover:bg-white/20 transition-colors"
                  >
                    <svg className="w-3.5 h-3.5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M7 3h5a1.99 1.99 0 011.41.59l7 7a2 2 0 010 2.83l-7 7a2 2 0 01-2.83 0l-7-7A1.99 1.99 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                    {displayBrandsCount} брендов
                  </Link>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/10 border border-white/15 rounded-full text-xs font-medium text-white backdrop-blur-sm">
                    <svg className="w-3.5 h-3.5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1V6zM14 6a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1V6zM4 14a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1v-4zM14 14a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
                    </svg>
                    {displayCategoriesCount} категорий
                  </span>
                </div>
                {/* CTA «Заказать звонок» — открывает форму заявки (CallbackModal),
                    а не набор номера: заказ обратного звонка, а не звонок */}
                <div className="flex flex-wrap items-center gap-3 mt-5">
                  <CallbackRequestButton
                    className="inline-flex items-center gap-2 px-5 h-11 bg-emerald-600 text-white hover:bg-emerald-500 rounded-xl text-sm font-bold transition-colors shadow-sm cursor-pointer"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    Заказать звонок
                  </CallbackRequestButton>
                  <Link
                    href="/rfq"
                    className="inline-flex items-center gap-2 px-5 h-11 border border-white/40 text-white hover:bg-white/10 rounded-xl text-sm font-semibold backdrop-blur-sm transition-colors"
                  >
                    Отправить запрос (RFQ)
                  </Link>
                </div>
              </div>
              {showUsp && (
                <ul className="mt-7 lg:mt-0 lg:pl-10 lg:border-l lg:border-white/20 space-y-2.5 self-center">
                  {uspItems.map((item, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm leading-snug text-white/85">
                      <svg className="w-4 h-4 mt-0.5 text-emerald-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      <span>
                        {item.link ? (
                          <>
                            {item.pre}
                            <Link href={item.link.href} className="text-white font-semibold hover:underline underline-offset-2 transition-colors">
                              {item.link.label}
                            </Link>
                            {item.post}
                          </>
                        ) : (
                          item.text
                        )}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </section>

      <Suspense fallback={<CatalogFallback />}>
        {dbError ? (
          <div className="bg-amber-50 border border-amber-300 rounded-xl p-6 md:p-8 text-center">
            <div className="text-4xl mb-3">⚠️</div>
            <h2 className="text-lg font-bold text-amber-900 mb-2">{dbError}</h2>
            <p className="text-sm text-amber-700 mb-5">
              Идёт плановое обновление каталога. Отправьте запрос (RFQ) — менеджер подберёт позиции и пришлёт КП в течение 24 часов.
              Мы уже работаем над восстановлением. Отправьте заявку — менеджер подберёт
              компоненты и пришлёт КП в течение 24 часов.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <a
                href="/rfq"
                className="inline-flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white px-5 py-2.5 rounded-lg font-medium text-sm transition-colors"
              >
                Отправить заявку
              </a>
              <a
                href="/catalog?retry=1"
                className="inline-flex items-center gap-2 border border-amber-600 text-amber-700 hover:bg-amber-100 px-5 py-2.5 rounded-lg font-medium text-sm transition-colors"
              >
                Повторить загрузку
              </a>
            </div>
          </div>
        ) : (
          <CatalogClient
            allComponents={components}
            categories={sortedCategories}
            brands={sortedBrands}
            totalCount={count || displayCount}
            brandMeta={brandMeta}
          />
        )}
      </Suspense>

      {/* CTA-блок «Не нашли компонент» — по референсу avd-instrument.ru */}
      <section className="mt-10">
        <div className="relative overflow-hidden rounded-2xl border border-[#e0e8de] bg-gradient-to-br from-white via-[#f7faf5] to-[#eef5ec] px-6 py-8 md:px-10 md:py-9 text-center">
          <div className="absolute -left-10 -bottom-10 w-40 h-40 rounded-full bg-primary/5 pointer-events-none" aria-hidden="true" />
          <h2 className="text-xl md:text-2xl font-bold text-[#121212] mb-2 relative">
            Не нашли нужный компонент?
          </h2>
          <p className="text-[#666] max-w-2xl mx-auto mb-6 relative">
            Пришлите артикул, маркировку или список — менеджер проверит наличие,
            подберёт аналог и выставит счёт. Работаем с юрлицами по договору.
          </p>
          <div className="flex flex-wrap justify-center gap-3 relative">
            <Link
              href="/rfq"
              className="inline-flex items-center justify-center gap-2 px-6 h-11 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-sm font-semibold transition-colors shadow-sm"
            >
              Оставить заявку
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </Link>
            <Link
              href="/kontakty"
              className="inline-flex items-center justify-center gap-2 px-6 h-11 bg-white border border-[#e0e8de] hover:border-primary/50 rounded-xl text-sm font-semibold text-[#333] hover:text-primary transition-colors"
            >
              Контакты менеджеров
            </Link>
          </div>
          <p className="text-xs text-[#898989] mt-5 relative">
            Или позвоните:{' '}
            <a href="tel:+79103219191" className="text-primary font-medium hover:underline underline-offset-2">
              +7 910 321-91-91
            </a>
          </p>
        </div>
      </section>
    </>
  );
}

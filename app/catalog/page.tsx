import { Metadata } from 'next';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import CatalogClient from './CatalogClient';

const BASE_URL = 'https://www.chip-net.ru';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Каталог электронных компонентов — ChipNet | Микросхемы, транзисторы, ПЛИС, разъёмы',
  description: 'Каталог электронных компонентов: микросхемы, микроконтроллеры, ПЛИС, транзисторы, диоды, конденсаторы, резисторы, разъёмы. Более 2600 наименований от 70+ производителей. Проверка в лаборатории СВП.',
  alternates: { canonical: `${BASE_URL}/catalog` },
  openGraph: {
    title: 'Каталог электронных компонентов — ChipNet',
    description: 'Более 2600 наименований электронных компонентов от 70+ производителей.',
    url: `${BASE_URL}/catalog`,
    type: 'website',
    locale: 'ru_RU',
    siteName: 'ChipNet',
  },
};

const ITEMS_PER_PAGE = 48;

export default async function CatalogPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const page = Math.max(1, parseInt(String(params.page || '1')));
  const category = String(params.category || '');
  const brand = String(params.brand || '');
  const search = String(params.search || '');

  let query = supabase.from('components').select('*', { count: 'exact' });

  if (category) {
    query = query.eq('category', category);
  }
  if (brand) {
    query = query.eq('brand', brand);
  }
  if (search) {
    query = query.or(`sku.ilike.%${search}%,name.ilike.%${search}%,brand.ilike.%${search}%`);
  }

  const from = (page - 1) * ITEMS_PER_PAGE;
  const to = from + ITEMS_PER_PAGE - 1;

  const { data: components, count } = await query
    .order('id', { ascending: true })
    .range(from, to);

  const totalPages = Math.ceil((count || 0) / ITEMS_PER_PAGE);

  const { data: catData } = await supabase.from('components').select('category');
  const categoryCounts: Record<string, number> = {};
  if (catData) {
    catData.forEach((item: { category: string }) => {
      if (item.category) categoryCounts[item.category] = (categoryCounts[item.category] || 0) + 1;
    });
  }

  const { data: brandData } = await supabase.from('components').select('brand');
  const brandCounts: Record<string, number> = {};
  if (brandData) {
    brandData.forEach((item: { brand: string }) => {
      if (item.brand) brandCounts[item.brand] = (brandCounts[item.brand] || 0) + 1;
    });
  }

  const sortedCategories = Object.entries(categoryCounts).sort((a, b) => b[1] - a[1]);
  const sortedBrands = Object.entries(brandCounts).sort((a, b) => b[1] - a[1]);

  // JSON-LD для каталога
  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Главная', item: BASE_URL },
      { '@type': 'ListItem', position: 2, name: 'Каталог', item: `${BASE_URL}/catalog` },
    ],
  };

  const itemListLd = (components || []).length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Каталог электронных компонентов',
    numberOfItems: count || 0,
    itemListElement: (components || []).slice(0, 10).map((comp: any, i: number) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: {
        '@type': 'Product',
        name: comp.sku,
        description: comp.description || comp.name,
        brand: { '@type': 'Brand', name: comp.brand },
        url: `${BASE_URL}/component/${comp.sku}`,
        offers: {
          '@type': 'Offer',
          priceCurrency: 'RUB',
          availability: comp.status === 'EOL'
            ? 'https://schema.org/Discontinued'
            : 'https://schema.org/InStock',
          seller: { '@type': 'Organization', name: 'ChipNet' },
        },
      },
    })),
  } : null;

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
      <section className="pt-[108px] pb-8 px-4">
        <div className="max-w-7xl mx-auto">
          <nav className="text-sm text-[#757575] mb-4 flex items-center gap-2">
            <Link href="/" className="hover:text-primary transition-colors">Главная</Link>
            <span className="text-[#cbcbcb]">/</span>
            <span className="text-[#333]">Каталог</span>
          </nav>
          <h1 className="text-3xl md:text-4xl font-bold mb-2 text-primary">
            Каталог электронных компонентов
          </h1>
          <p className="text-[#666] text-lg">
            {count ? `${count.toLocaleString()} наименований` : 'Загрузка...'} от {sortedBrands.length} производителей
          </p>
        </div>
      </section>

      <CatalogClient
        components={components || []}
        currentPage={page}
        totalPages={totalPages}
        totalItems={count || 0}
        currentCategory={category}
        currentBrand={brand}
        currentSearch={search}
        categories={sortedCategories}
        brands={sortedBrands}
      />
    </>
  );
}


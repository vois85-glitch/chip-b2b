import { Metadata } from 'next';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import FloatingCta from '@/components/layout/FloatingCta';
import CatalogClient from './CatalogClient';

const BASE_URL = 'https://www.chip-net.ru';

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

  // Build query
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

  // Get all categories with counts
  const { data: catData } = await supabase.from('components').select('category');
  const categoryCounts: Record<string, number> = {};
  if (catData) {
    catData.forEach((item: { category: string }) => {
      if (item.category) categoryCounts[item.category] = (categoryCounts[item.category] || 0) + 1;
    });
  }

  // Get all brands with counts
  const { data: brandData } = await supabase.from('components').select('brand');
  const brandCounts: Record<string, number> = {};
  if (brandData) {
    brandData.forEach((item: { brand: string }) => {
      if (item.brand) brandCounts[item.brand] = (brandCounts[item.brand] || 0) + 1;
    });
  }

  const sortedCategories = Object.entries(categoryCounts).sort((a, b) => b[1] - a[1]);
  const sortedBrands = Object.entries(brandCounts).sort((a, b) => b[1] - a[1]);

  return (
    <main className="min-h-screen bg-[#050807] text-white">
      <Header />
      <section className="pt-28 pb-8 px-4">
        <div className="max-w-7xl mx-auto">
          <nav className="text-sm text-gray-500 mb-4 flex items-center gap-2">
            <Link href="/" className="hover:text-emerald-400 transition-colors">Главная</Link>
            <span className="text-gray-600">/</span>
            <span className="text-gray-400">Каталог</span>
          </nav>
          <h1 className="text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
            Каталог электронных компонентов
          </h1>
          <p className="text-gray-400 text-lg">
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

      <Footer />
      <FloatingCta />
    </main>
  );
}

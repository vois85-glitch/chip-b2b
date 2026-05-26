import { supabase } from '@/lib/supabase';
import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

const BASE_URL = 'https://www.chip-net.ru';

type Props = {
  params: Promise<{ sku: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { sku } = await params;

  const { data: component } = await supabase
    .from('components')
    .select('*')
    .eq('sku', sku)
    .single();

  if (!component) return { title: "Компонент не найден" };

  const url = `${BASE_URL}/component/${sku}`;
  const title = `${component.sku} — купить, цена, аналоги, даташит`;
  const description = `Поставка ${component.name} (${component.brand}). ${component.status === 'EOL' ? 'Снят с производства. Подберем аналог.' : 'В наличии под заказ.'} Проверка в лаборатории СВП. ООО Деловой Партнёр.`;

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: `${title} | ChipNet`,
      description,
      url,
      type: 'website',
      locale: 'ru_RU',
      siteName: 'ChipNet',
    },
  };
}

export default async function ComponentPage({ params }: Props) {
  const { sku } = await params;

  const { data: component } = await supabase
    .from('components')
    .select('*')
    .eq('sku', sku)
    .single();

  if (!component) {
    notFound();
  }

  const url = `${BASE_URL}/component/${sku}`;

  const productLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: component.sku,
    description: component.description || component.name,
    brand: { '@type': 'Brand', name: component.brand },
    category: component.category,
    offers: {
      '@type': 'Offer',
      url,
      priceCurrency: 'RUB',
      availability: component.status === 'EOL'
        ? 'https://schema.org/Discontinued'
        : 'https://schema.org/InStock',
      seller: { '@type': 'Organization', name: 'ChipNet (ООО Деловой Партнёр)' },
    },
  };

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Главная', item: BASE_URL },
      { '@type': 'ListItem', position: 2, name: 'Каталог', item: `${BASE_URL}/#search` },
      { '@type': 'ListItem', position: 3, name: component.sku, item: url },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <div className="min-h-screen bg-[#050807] text-white">
        <div className="max-w-7xl mx-auto px-4 py-24">
          <div className="text-sm text-gray-500 mb-8 flex items-center gap-2">
            <Link href="/" className="hover:text-emerald-400 transition-colors">Главная</Link> &gt;
            <Link href="/#search" className="hover:text-emerald-400 transition-colors">Каталог</Link> &gt;
            <span className="text-emerald-400">{component.sku}</span>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">{component.sku}</h1>
              <p className="text-xl text-gray-300 mb-8">{component.name}</p>
              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold mb-8 ${
                component.status === 'EOL' ? 'bg-red-900/30 text-red-400 border border-red-800/50' : 'bg-emerald-900/30 text-emerald-400 border border-emerald-800/50'
              }`}>
                {component.status === 'EOL' ? 'Снят с производства (EOL)' : 'В производстве'}
              </div>
              <div className="bg-emerald-950/10 border border-emerald-900/30 rounded-2xl p-8 mb-8">
                <h2 className="text-xl font-bold mb-4 text-emerald-400">Технические данные</h2>
                <div className="grid grid-cols-2 gap-4 text-gray-300">
                  <div><span className="text-gray-500">Бренд:</span> <strong>{component.brand}</strong></div>
                  <div><span className="text-gray-500">Категория:</span> <strong>{component.category}</strong></div>
                  <div className="col-span-2"><span className="text-gray-500">Описание:</span> <strong>{component.description}</strong></div>
                </div>
              </div>
              {component.analogs && component.analogs.length > 0 && (
                <div className="bg-black/40 border border-emerald-900/30 rounded-2xl p-8">
                  <h2 className="text-xl font-bold mb-4 text-white">Аналоги и замены для {component.sku}</h2>
                  <p className="text-gray-400 mb-4">
                    {component.status === 'EOL'
                      ? 'Данный компонент снят с производства. Мы предлагаем следующие аналоги:'
                      : 'В случае недоступности, рекомендуем следующие кросс-референсы:'}
                  </p>
                  <div className="flex flex-wrap gap-3">
                    {component.analogs.map((analog: string) => (
                      <Link key={analog} href={`/component/${analog}`}
                        className="px-4 py-2 bg-emerald-900/20 border border-emerald-800/50 rounded-lg text-emerald-400 hover:bg-emerald-800/30 transition-colors font-semibold">
                        {analog}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="lg:col-span-1">
              <div className="sticky top-24 bg-emerald-950/10 border border-emerald-900/30 rounded-2xl p-8">
                <h2 className="text-2xl font-bold mb-4">Запросить КП на {component.sku}</h2>
                <p className="text-gray-400 mb-6">Укажите нужный объем. Мы проверим наличие и выставим коммерческое предложение.</p>
                <a href="/#bom" className="block w-full text-center px-8 py-4 bg-emerald-600 hover:bg-emerald-700 rounded-xl text-lg font-semibold transition-all shadow-lg shadow-emerald-600/25 hover:shadow-emerald-600/40 mb-4">
                  Отправить заявку
                </a>
                <p className="text-xs text-gray-500 text-center">Гарантия оригинала. Контроль в лаборатории СВП.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

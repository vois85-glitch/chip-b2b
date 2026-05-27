import { Metadata } from 'next';
import { geoCities } from '@/lib/geo-data';
import { notFound } from 'next/navigation';
import Link from 'next/link';

const BASE_URL = 'https://www.chip-net.ru';
export const revalidate = 86400;

type Props = {
  params: Promise<{ city: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { city } = await params;
  const geo = geoCities[city];

  if (!geo) {
    return { title: 'Город не найден' };
  }

  const url = `${BASE_URL}/geo/${city}`;

  return {
    title: geo.title,
    description: geo.description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: geo.title,
      description: geo.description,
      url,
      type: 'website',
      locale: 'ru_RU',
      siteName: 'ChipNet',
    },
  };
}

export default async function GeoPage({ params }: Props) {
  const { city } = await params;
  const geo = geoCities[city];

  if (!geo) {
    notFound();
  }

  const url = `${BASE_URL}/geo/${city}`;

  // JSON-LD
  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Главная', item: BASE_URL },
      { '@type': 'ListItem', position: 2, name: geo.h1, item: url },
    ],
  };

  const localBusinessLd = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'ChipNet — поставка электронных компонентов',
    description: geo.description,
    url,
    address: {
      '@type': 'PostalAddress',
      addressLocality: geo.name,
      addressCountry: 'RU',
    },
    areaServed: {
      '@type': 'AdministrativeArea',
      name: geo.region,
    },
    telephone: '+7 (495) 123-45-67',
  };

  // Popular categories for geo pages
  const categories = [
    { name: 'Микроконтроллеры', slug: 'arm-kontrollery' },
    { name: 'ПЛИС (FPGA)', slug: 'fpga' },
    { name: 'Транзисторы', slug: 'tranzistory' },
    { name: 'АЦП/ЦАП', slug: 'adc-dac' },
    { name: 'Стабилизаторы', slug: 'stabilizatory' },
    { name: 'Операционные усилители', slug: 'operatsionnye-usiliteli' },
    { name: 'Конденсаторы', slug: 'kondensatory' },
    { name: 'Датчики', slug: 'datchiki' },
    { name: 'Интерфейсы', slug: 'interfeysy' },
    { name: 'Память', slug: 'pamyat' },
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessLd) }} />
      <main className="min-h-screen bg-background text-[#121212] dark:text-white">

        {/* Hero */}
        <section className="pt-32 pb-16 px-4">
          <div className="max-w-7xl mx-auto">
            <nav className="text-sm text-[#757575] dark:text-[#7a8a84] mb-6 flex items-center gap-2">
              <Link href="/" className="hover:text-primary transition-colors">Главная</Link>
              <span className="text-[#898989]">/</span>
              <span className="text-[#666] dark:text-[#8a9a94]">{geo.name}</span>
            </nav>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-primary-dark bg-clip-text text-transparent">
              {geo.h1}
            </h1>
            <p className="text-lg text-[#666] dark:text-[#8a9a94] max-w-3xl mb-8">
              {geo.description}
            </p>
          </div>
        </section>

        {/* SEO text */}
        <section className="px-4 pb-12">
          <div className="max-w-4xl mx-auto">
            <div className="bg-gray-900/40 rounded-xl border border-[#e8e8e8] dark:border-[#2a3530] p-6 md:p-8">
              <p className="text-[#333] dark:text-[#c4d0ca] leading-relaxed text-base">
                {geo.text}
              </p>
            </div>
          </div>
        </section>

        {/* Categories grid */}
        <section className="px-4 pb-16">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-2xl font-bold mb-8">
              Категории компонентов в <span className="text-primary">{geo.name}</span>
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {categories.map((cat) => (
                <Link
                  key={cat.slug}
                  href={`/${cat.slug}`}
                  className="bg-gray-900/40 hover:bg-gray-800/60 border border-[#e8e8e8] dark:border-[#2a3530] hover:border-[#cbcbcb] rounded-lg p-4 text-center transition-all"
                >
                  <span className="text-[#333] dark:text-[#c4d0ca] text-sm font-medium">{cat.name}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Advantages */}
        <section className="px-4 pb-16">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-2xl font-bold mb-8">Почему выбирают ChipNet в {geo.name}</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-gray-900/40 rounded-xl border border-[#e8e8e8] dark:border-[#2a3530] p-6">
                <div className="text-primary text-3xl font-bold mb-2">204+</div>
                <div className="text-[#666] dark:text-[#8a9a94] text-sm">Позиций в каталоге</div>
              </div>
              <div className="bg-gray-900/40 rounded-xl border border-[#e8e8e8] dark:border-[#2a3530] p-6">
                <div className="text-primary text-3xl font-bold mb-2">СВП</div>
                <div className="text-[#666] dark:text-[#8a9a94] text-sm">Проверка оригинальности</div>
              </div>
              <div className="bg-gray-900/40 rounded-xl border border-[#e8e8e8] dark:border-[#2a3530] p-6">
                <div className="text-primary text-3xl font-bold mb-2">1-4</div>
                <div className="text-[#666] dark:text-[#8a9a94] text-sm">Дня доставка</div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="px-4 pb-20">
          <div className="max-w-4xl mx-auto bg-gradient-to-br from-emerald-900/30 to-cyan-900/20 rounded-2xl border border-emerald-800/30 p-8 md:p-12 text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Нужна поставка компонентов в {geo.name}?
            </h2>
            <p className="text-[#666] dark:text-[#8a9a94] mb-8 max-w-xl mx-auto">
              Отправьте заявку — подберём компоненты, найдём аналоги и рассчитаем сроки доставки в {geo.region}.
            </p>
            <Link
              href="/#bom"
              className="inline-flex items-center gap-2 bg-primary hover:bg-primary-dark text-[#121212] dark:text-white font-medium px-8 py-3 rounded-lg transition-colors"
            >
              Отправить заявку
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
            </Link>
          </div>
        </section>

        {/* Other cities */}
        <section className="px-4 pb-20">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-2xl font-bold mb-8">Поставка в другие города</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
              {Object.values(geoCities)
                .filter(c => c.slug !== city)
                .map(c => (
                  <Link
                    key={c.slug}
                    href={`/geo/${c.slug}`}
                    className="text-[#666] dark:text-[#8a9a94] hover:text-primary text-sm transition-colors py-1"
                  >
                    {c.name}
                  </Link>
                ))}
            </div>
          </div>
        </section>
      </main>
    </>
  );
}


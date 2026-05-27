import { Metadata } from 'next';
import { supabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import ComponentSearch from '@/components/sections/ComponentSearch';

const BASE_URL = 'https://www.chip-net.ru';

export const revalidate = 3600;

type Component = {
  sku: string;
  name: string;
  brand: string;
  category: string;
  description: string;
  status: string;
  analogs: string[];
};

type Props = {
  params: Promise<{ slug: string }>;
};

const brandNames: Record<string, string> = {
  'stmicroelectronics': 'STMicroelectronics',
  'texas-instruments': 'Texas Instruments',
  'analog-devices': 'Analog Devices',
  'infineon': 'Infineon Technologies',
  'nxp': 'NXP Semiconductors',
  'microchip': 'Microchip Technology',
  'onsemi': 'ON Semiconductor',
  'vishay': 'Vishay Intertechnology',
  'murata': 'Murata Manufacturing',
  'tdk': 'TDK Corporation',
  'samsung-electro': 'Samsung Electro-Mechanics',
  'kemet': 'KEMET (YAGEO)',
  'xilinx': 'Xilinx (AMD)',
  'intel-altera': 'Intel / Altera',
  'lattice': 'Lattice Semiconductor',
  'broadcom': 'Broadcom',
  'qualcomm': 'Qualcomm',
  'realtek': 'Realtek Semiconductor',
  'mediatek': 'MediaTek',
  'cypress': 'Cypress Semiconductor (Infineon)',
  'renesas': 'Renesas Electronics',
  'rohm': 'ROHM Semiconductor',
  'toshiba': 'Toshiba Electronic Devices',
  'nippon-chemi-con': 'Nippon Chemi-Con',
  'panasonic': 'Panasonic Industrial',
  'molex': 'Molex (Koch Industries)',
  'te-connectivity': 'TE Connectivity',
  'amphenol': 'Amphenol',
  'samtec': 'Samtec',
  'jst': 'JST Manufacturing',
  'hicrl': 'Harting',
  'wurth': 'Wurth Elektronik',
  'bourns': 'Bourns',
  'cobham': 'Cobham Advanced Electronic Solutions',
  'macom': 'MACOM Technology Solutions',
  'qorvo': 'Qorvo',
  'skyworks': 'Skyworks Solutions',
  'silicon-labs': 'Silicon Labs',
  'maxim': 'Maxim Integrated (Analog Devices)',
  'linear-tech': 'Linear Technology (Analog Devices)',
  'samsung-semi': 'Samsung Semiconductor',
  'yeelong': 'Yageo',
  'avx': 'AVX Corporation',
  'cornell-dubilier': 'Cornell Dubilier',
  'knowles': 'Knowles Corporation',
  'tdk-lambda': 'TDK-Lambda',
  'coilcraft': 'Coilcraft',
  'walsin': 'Walsin Technology',
  'yageo': 'YAGEO Corporation',
  'kyocera': 'Kyocera AVX',
  'diodes-inc': 'Diodes Incorporated',
  'ixys': 'IXYS (Littelfuse)',
  'littelfuse': 'Littelfuse',
  'sensata': 'Sensata Technologies',
  'ebm-papst': 'EBM-Papst',
  'mean-well': 'Mean Well',
  'traco-power': 'Traco Power',
  'cernex': 'Cernex',
  'minicircuits': 'Mini-Circuits',
  'psemi': 'pSemi (Murata)',
  'gowin': 'Gowin Semiconductor',
  'efinix': 'Efinix',
  'allwinner': 'Allwinner Technology',
  'rockchip': 'Rockchip Electronics',
  'espressif': 'Espressif Systems',
  'gigadevice': 'GigaDevice Semiconductor',
  'winner-micro': 'Winner Micro',
  'holtek': 'Holtek Semiconductor',
  'elmos': 'ELMOS Semiconductor',
  'melexis': 'Melexis',
  'semtech': 'Semtech',
  'monolithic-power': 'Monolithic Power Systems',
  'silergy': 'Silergy',
  'richtek': 'Richtek Technology',
  'nuvoton': 'Nuvoton Technology',
  'druge': 'Другой',
};

export async function generateStaticParams() {
  try {
    const { data } = await supabase
      .from('components')
      .select('brand');

    if (!data) return [];

    const uniqueBrands = [...new Set(data.map((c: { brand: string }) => c.brand).filter(Boolean))];
    return uniqueBrands
      .map((brand: string) => {
        const slug = brand
          .toLowerCase()
          .replace(/[^a-z0-9а-яё]+/gi, '-')
          .replace(/^-|-$/g, '');
        return { slug };
      })
      .filter(p => p.slug.length > 0);
  } catch (e) {
    console.error('generateStaticParams error:', e);
    return [];
  }
}

function slugToBrandName(slug: string): string {
  return brandNames[slug] || slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const brandName = slugToBrandName(slug);
  const title = `${brandName} — электронные компоненты оптом, аналоги, даташит`;
  const description = `Поставка электронных компонентов ${brandName}. Оригинальная продукция, подбор аналогов, проверка в лаборатории СВП. ООО Деловой Партнёр.`;
  const url = `${BASE_URL}/brand/${slug}`;

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
  };
}

export default async function BrandPage({ params }: Props) {
  const { slug } = await params;
  const brandName = slugToBrandName(slug);
  const url = `${BASE_URL}/brand/${slug}`;

  // Try to find components with this brand
  let components: Component[] = [];
  let totalCount = 0;

  // Try exact match first
  const { data: exactData, count } = await supabase
    .from('components')
    .select('*', { count: 'exact' })
    .eq('brand', brandName)
    .limit(50);

  if (exactData && exactData.length > 0) {
    components = exactData as Component[];
    totalCount = count || 0;
  } else {
    // Try case-insensitive search
    const { data: ilikeData, count: ilikeCount } = await supabase
      .from('components')
      .select('*', { count: 'exact' })
      .ilike('brand', `%${brandName}%`)
      .limit(50);

    if (ilikeData) {
      components = ilikeData as Component[];
      totalCount = ilikeCount || 0;
    }
  }

  if (components.length === 0) {
    notFound();
  }

  // Get categories for this brand
  const categorySet = new Set(components.map(c => c.category).filter(Boolean));
  const categories = Array.from(categorySet);

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Главная', item: BASE_URL },
      { '@type': 'ListItem', position: 2, name: 'Каталог', item: `${BASE_URL}/catalog` },
      { '@type': 'ListItem', position: 3, name: brandName, item: url },
    ],
  };

  const itemListLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `Компоненты ${brandName}`,
    numberOfItems: totalCount,
    itemListElement: components.slice(0, 10).map((comp, i) => ({
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
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListLd) }}
      />
      <main className="min-h-screen bg-background text-[#121212] dark:text-white">
        <section className="pt-32 pb-16 px-4">
          <div className="max-w-7xl mx-auto">
            <nav className="text-sm text-[#757575] dark:text-[#7a8a84] mb-6 flex items-center gap-2">
              <Link href="/" className="hover:text-primary transition-colors">Главная</Link>
              <span className="text-[#cbcbcb]">/</span>
              <Link href="/catalog" className="hover:text-primary transition-colors">Каталог</Link>
              <span className="text-[#cbcbcb]">/</span>
              <span className="text-[#666] dark:text-[#8a9a94]">{brandName}</span>
            </nav>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-primary-dark bg-clip-text text-transparent">
              Компоненты {brandName}
            </h1>
            <p className="text-lg text-[#666] dark:text-[#8a9a94] max-w-3xl mb-4">
              Поставка оригинальных электронных компонентов производства {brandName}. Проверка оригинальности в лаборатории СВП, подбор аналогов, доставка от 6 дней.
            </p>
            <p className="text-sm text-[#757575] dark:text-[#7a8a84]">
              {totalCount} позиций в каталоге
            </p>
          </div>
        </section>

        <section className="px-4 pb-12">
          <div className="max-w-7xl mx-auto">
            <ComponentSearch />
          </div>
        </section>

        {categories.length > 0 && (
          <section className="px-4 pb-12">
            <div className="max-w-7xl mx-auto">
              <h2 className="text-xl font-bold mb-4">Категории компонентов {brandName}</h2>
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <Link
                    key={cat}
                    href={`/catalog?brand=${encodeURIComponent(brandName)}&category=${encodeURIComponent(cat)}`}
                    className="px-3 py-1.5 bg-section-alt dark:bg-[#1e2a25] border border-[#cbcbcb] rounded-lg text-sm text-[#333] dark:text-[#c4d0ca] hover:text-primary transition-colors"
                  >
                    {cat}
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {components.length > 0 && (
          <section className="px-4 pb-16">
            <div className="max-w-7xl mx-auto">
              <h2 className="text-2xl font-bold mb-8">
                Компоненты {brandName}
                <span className="text-primary ml-2">({totalCount})</span>
              </h2>
              <div className="overflow-x-auto rounded-xl border border-[#e8e8e8] dark:border-[#2a3530]">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-[#eaf0e8] border-b border-[#e8e8e8] dark:border-[#2a3530]">
                      <th className="text-left py-4 px-4 text-[#666] dark:text-[#8a9a94] font-medium">SKU</th>
                      <th className="text-left py-4 px-4 text-[#666] dark:text-[#8a9a94] font-medium">Наименование</th>
                      <th className="text-left py-4 px-4 text-[#666] dark:text-[#8a9a94] font-medium">Категория</th>
                      <th className="text-left py-4 px-4 text-[#666] dark:text-[#8a9a94] font-medium">Статус</th>
                      <th className="text-left py-4 px-4 text-[#666] dark:text-[#8a9a94] font-medium">Аналоги</th>
                    </tr>
                  </thead>
                  <tbody>
                    {components.map((comp) => (
                      <tr key={comp.sku} className="border-b border-[#e8e8e8] dark:border-[#2a3530]/50 hover:bg-[#eaf0e8] dark:hover:bg-[#253530] dark:bg-[#1a1f1c] transition-colors">
                        <td className="py-3 px-4">
                          <Link
                            href={`/component/${comp.sku}`}
                            className="text-primary hover:text-emerald-300 font-mono font-medium transition-colors"
                          >
                            {comp.sku}
                          </Link>
                        </td>
                        <td className="py-3 px-4 text-[#333] dark:text-[#c4d0ca] max-w-xs truncate">{comp.name}</td>
                        <td className="py-3 px-4 text-[#666] dark:text-[#8a9a94]">
                          <Link href={`/catalog?category=${encodeURIComponent(comp.category)}`} className="hover:text-primary transition-colors">
                            {comp.category}
                          </Link>
                        </td>
                        <td className="py-3 px-4">
                          {comp.status === 'EOL' ? (
                            <span className="px-2 py-1 rounded-full bg-red-50 text-danger text-xs">EOL</span>
                          ) : (
                            <span className="px-2 py-1 rounded-full bg-section-alt dark:bg-[#1e2a25] text-primary text-xs">В производстве</span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-[#757575] dark:text-[#7a8a84] text-xs max-w-xs truncate">
                          {comp.analogs && comp.analogs.length > 0 ? comp.analogs.join(', ') : '—'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        )}

        <section className="px-4 pb-16">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-4">О компании {brandName}</h2>
            <p className="text-[#333] dark:text-[#c4d0ca] leading-relaxed text-base">
              {brandName} — один из ведущих производителей электронных компонентов, продукция которого широко применяется в промышленной электронике, системах связи, automotive и оборонном комплексе. ООО «Деловой Партнёр» (ChipNet) осуществляет прямые поставки оригинальных компонентов {brandName} с полным пакетом сопроводительной документации. Каждый компонент проходит входной контроль в аккредитованной лаборатории СВП, включая рентгеновский контроль, декэпсуляцию и электрические тесты. Для компонентов, снятых с производства, подбираем кросс-референсы с гарантией электрической совместимости.
            </p>
          </div>
        </section>

        <section className="px-4 pb-20">
          <div className="max-w-4xl mx-auto bg-gradient-to-br from-primary/10 to-primary-dark/5 rounded-2xl border border-emerald-800/30 p-8 md:p-12 text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Нужна поставка компонентов {brandName}?
            </h2>
            <p className="text-[#666] dark:text-[#8a9a94] mb-8 max-w-xl mx-auto">
              Отправьте заявку — проверим наличие, подберём аналоги и выставим КП.
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
      </main>
    </>
  );
}

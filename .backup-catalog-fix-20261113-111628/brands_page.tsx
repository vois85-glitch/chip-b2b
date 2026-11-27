import { Metadata } from 'next';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import BrandLogoImg from '@/components/ui/BrandLogoImg';
import BreadcrumbNav from '@/components/ui/BreadcrumbNav';
import { brandPageUrl } from '@/lib/brand-url';

const BASE_URL = 'https://www.chip-net.ru';

export const revalidate = 3600;
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Производители электронных компонентов — каталог брендов',
  description: 'Каталог производителей электронных компонентов: Texas Instruments, STMicroelectronics, Infineon, NXP, Xilinx, Microchip и другие. Поставка оригиналов, подбор аналогов, проверка в лаборатории СВП.',
  alternates: {
    canonical: `${BASE_URL}/brands`,
  },
  openGraph: {
    title: 'Производители электронных компонентов — каталог брендов',
    description: 'Каталог производителей электронных компонентов с логотипами и количеством наименований. Поставка оригиналов, подбор аналогов.',
    url: `${BASE_URL}/brands`,
    type: 'website',
    locale: 'ru_RU',
    siteName: 'ChipNet',
  },
};

type BrandRow = {
  name: string;
  slug: string;
  is_active: boolean | null;
  country: string | null;
};

type Tile = {
  name: string;
  slug: string;
  active: boolean;
  count: number;
  hasLogo: boolean;
};

const faqItems = [
  {
    question: 'Как заказать компоненты определённого производителя?',
    answer: 'Выберите нужного производителя в каталоге брендов и перейдите на его страницу — там доступны компоненты, категории и даташиты. Также вы можете отправить BOM-лист с указанием необходимых позиций — наши менеджеры проверят наличие у авторизованных дистрибьюторов и подготовят коммерческое предложение в течение 24 часов.',
  },
  {
    question: 'Все ли компоненты оригинальные?',
    answer: 'Да, мы работаем исключительно с авторизованными дистрибьюторами и заводами-изготовителями. Каждая партия проходит входной контроль в аккредитованной лаборатории СВП: рентгеновский контроль внутренней структуры, декэпсуляция, электрические тесты и визуальный осмотр под микроскопом.',
  },
  {
    question: 'Можно ли подобрать аналоги для компонентов недоступных производителей?',
    answer: 'Да, это одно из ключевых направлений нашей работы. Инженеры ChipNet подбирают кросс-референсы для санкционных и снятых с производства компонентов: GD32 и HK32 вместо STM32, Gowin и Efinix вместо Xilinx FPGA, доступные аналоги TI LDO и ADI операционных усилителей.',
  },
  {
    question: 'Как быстро вы можете поставить компоненты нужного бренда?',
    answer: 'Срочная поставка авиатранспортом — от 6 рабочих дней. Стандартная логистика — от 14 дней. Для компонентов на складе в Белгороде возможна отгрузка в день оплаты.',
  },
];

const breadcrumbLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Главная', item: BASE_URL },
    { '@type': 'ListItem', position: 2, name: 'Каталог', item: `${BASE_URL}/catalog` },
    { '@type': 'ListItem', position: 3, name: 'Производители', item: `${BASE_URL}/brands` },
  ],
};

const faqLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqItems.map((item) => ({
    '@type': 'Question',
    name: item.question,
    acceptedAnswer: { '@type': 'Answer', text: item.answer },
  })),
};

// Ссылка на бренд: хаб (/altera, /xilinx…) → /brand/<slug> → фильтр каталога.
// Общая логика в lib/brand-url.ts (brandPageUrl).

export default async function BrandsPage() {
  // 1. Все бренды из БД + счётчики компонентов (RPC, с таймаутом на всякий случай)
  let brandRows: BrandRow[] = [];
  let counts: Record<string, number> = {};
  try {
    const [{ data: rows }, { data: countsData }] = await Promise.all([
      supabase.from('brands').select('name, slug, is_active, country').order('name', { ascending: true }),
      supabase.rpc('get_brand_counts'),
    ]);
    brandRows = (rows || []) as BrandRow[];
    if (countsData && typeof countsData === 'object') {
      counts = countsData as Record<string, number>;
    }
  } catch {
    // ниже отрисуем страницу без счётчиков
  }

  // 2. Дедупликация + сортировка (латиница и кириллица)
  const seen = new Set<string>();
  const tiles: Tile[] = brandRows
    .filter((b) => b.name && b.name !== '*' && b.slug)
    .filter((b) => (seen.has(b.name) ? false : (seen.add(b.name), true)))
    .map((b) => ({
      name: b.name,
      slug: b.slug,
      active: !!b.is_active,
      count: counts[b.name] || 0,
      hasLogo: false, // заполнится ниже — не важно для рендера, логотип решит BrandLogoImg
    }))
    .sort((a, b) => a.name.localeCompare(b.name, 'en'));

  // 3. Группировка по первой букве (латиница A–Z, прочее — в «#»)
  const groups = new Map<string, Tile[]>();
  for (const t of tiles) {
    const first = (t.name[0] || '#').toUpperCase();
    const key = /[A-Z]/.test(first) ? first : '#';
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(t);
  }
  const letters = [...groups.keys()].sort((a, b) => {
    if (a === '#') return 1;
    if (b === '#') return -1;
    return a.localeCompare(b, 'en');
  });

  // Топ-бренды по количеству для блока «Популярные производители»
  const topTiles = [...tiles].filter((t) => t.count > 0).sort((a, b) => b.count - a.count).slice(0, 12);

  const totalBrands = tiles.length;
  const totalNames = tiles.reduce((s, t) => s + t.count, 0);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />

      <main className="min-h-screen bg-background text-[#121212]">
        {/* Hero (pt-190: шапка + sticky-поиск ~180px) */}
        <section className="pt-[190px] pb-10 px-4">
          <div className="max-w-7xl mx-auto">
            {/* 2026-10-31: крошки-КНОПКИ (пилюли 40px) */}
            <BreadcrumbNav
              className="mb-6"
              items={[
                { name: 'Главная', href: '/' },
                { name: 'Каталог', href: '/catalog' },
                { name: 'Производители' },
              ]}
            />

            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              Производители электронных компонентов
            </h1>
            <p className="text-lg text-[#666] max-w-3xl mb-2">
              {totalBrands} производителей в каталоге — выберите бренд, чтобы посмотреть
              компоненты, наличие и даташиты. Поставка оригинальной продукции, подбор
              аналогов, проверка в лаборатории СВП.
            </p>
            <p className="text-sm text-[#757575]">
              Всего {totalNames.toLocaleString('ru-RU')} наименований · ООО «Деловой Партнёр» (ChipNet)
            </p>
          </div>
        </section>

        {/* Популярные производители — топ по количеству наименований */}
        {topTiles.length > 0 && (
          <section className="px-4 pb-6" aria-label="Популярные производители">
            <div className="max-w-7xl mx-auto">
              <h2 className="text-xl font-bold mb-4">Популярные производители</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                {topTiles.map((t) => (
                  <Link
                    key={t.slug || t.name}
                    prefetch={false}
                    href={brandPageUrl(t.name, t.slug, t.active)}
                    className="group bg-white rounded-xl border border-[#e8e8e8] p-4 flex flex-col items-center gap-2 hover:border-primary/40 hover:shadow-md hover:-translate-y-0.5 transition-all"
                  >
                    <span className="h-11 w-full flex items-center justify-center overflow-hidden">
                      <BrandLogoImg
                        name={t.name}
                        slug={t.slug}
                        className="max-h-11 max-w-[100px] w-auto object-contain transition-transform duration-300 group-hover:scale-105"
                      />
                    </span>
                    <span className="text-xs font-semibold text-center leading-tight group-hover:text-primary transition-colors">
                      {t.name}
                    </span>
                    <span className="text-[10px] text-[#898989]">
                      {t.count.toLocaleString('ru-RU')} наименований
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Алфавитная навигация по буквам */}
        <section className="px-4 pb-8" id="brand-letter-top">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-2xl font-bold mb-4">Все производители — по алфавиту</h2>
            <nav aria-label="Навигация по алфавиту" className="sticky top-[64px] z-20 bg-background/95 backdrop-blur-sm border border-[#e8e8e8] rounded-xl px-3 py-2.5 mb-6 flex flex-wrap gap-1 shadow-sm">
              {letters.map((letter) => (
                <a
                  key={letter}
                  href={`#brand-letter-${letter}`}
                  className="min-w-[34px] h-8 flex items-center justify-center px-1.5 rounded-lg text-sm font-semibold text-[#555] hover:bg-primary/10 hover:text-primary transition-colors"
                >
                  {letter}
                </a>
              ))}
            </nav>

            {/* Группы брендов по буквам */}
            <div className="space-y-8">
              {letters.map((letter) => (
                <div key={letter} id={`brand-letter-${letter}`} className="scroll-mt-32">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="w-9 h-9 flex items-center justify-center rounded-lg bg-primary/10 text-primary font-bold text-lg">
                      {letter}
                    </span>
                    <span className="text-sm text-[#898989]">
                      {groups.get(letter)!.length}{' '}
                      {groups.get(letter)!.length === 1 ? 'производитель' : 'производителей'}
                    </span>
                    <span className="flex-1 h-px bg-[#e8e8e8]" />
                    {/* Назад к началу списка */}
                    <a
                      href="#brand-letter-top"
                      title="Наверх"
                      className="text-xs text-[#898989] hover:text-primary transition-colors"
                    >
                      ↑ наверх
                    </a>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                    {groups.get(letter)!.map((t) => (
                      <Link
                        key={t.slug || t.name}
                        prefetch={false}
                        href={brandPageUrl(t.name, t.slug, t.active)}
                        className="group bg-white rounded-xl border border-[#e8e8e8] p-3.5 flex flex-col items-center gap-2 hover:border-primary/40 hover:shadow-md hover:-translate-y-0.5 transition-all"
                      >
                        <span className="h-10 w-full flex items-center justify-center overflow-hidden">
                          <BrandLogoImg
                            name={t.name}
                            slug={t.slug}
                            className="max-h-10 max-w-[96px] w-auto object-contain transition-transform duration-300 group-hover:scale-105"
                          />
                        </span>
                        <span className="text-xs font-semibold text-center leading-tight group-hover:text-primary transition-colors">
                          {t.name}
                        </span>
                        <span className="text-[10px] text-[#898989]">
                          {t.count > 0 ? `${t.count.toLocaleString('ru-RU')} наименований` : 'по запросу'}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="px-4 pb-16 bg-section-accent/30 mt-4">
          <div className="max-w-4xl mx-auto py-14">
            <h2 className="text-2xl md:text-3xl font-bold mb-10 text-center">Часто задаваемые вопросы</h2>
            <div className="space-y-4">
              {faqItems.map((item, index) => (
                <details
                  key={index}
                  className="group bg-[#f0f4ee] rounded-2xl border border-[#e8e8e8] overflow-hidden"
                >
                  <summary className="flex items-center justify-between p-6 cursor-pointer hover:bg-[#eaf0e8] transition-colors">
                    <span className="font-semibold text-[#121212] pr-4">{item.question}</span>
                    <svg
                      className="w-5 h-5 text-[#757575] group-open:rotate-180 transition-transform shrink-0"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </summary>
                  <div className="px-6 pb-6 text-[#666] leading-relaxed">{item.answer}</div>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="px-4 pb-20">
          <div className="max-w-4xl mx-auto bg-gradient-to-br from-primary/10 to-primary-dark/5 rounded-2xl border border-emerald-800/30 p-8 md:p-12 text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Не нашли нужного производителя?
            </h2>
            <p className="text-[#666] mb-8 max-w-xl mx-auto">
              Отправьте заявку с указанием необходимых компонентов — найдём оригиналы у авторизованных
              дистрибьюторов или подберём аналоги от доступных производителей с гарантией совместимости.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link prefetch={false}
                href="/rfq"
                className="inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark text-white font-medium px-8 py-3 rounded-lg transition-colors"
              >
                Отправить заявку
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
              </Link>
              <Link prefetch={false}
                href="/catalog"
                className="inline-flex items-center justify-center gap-2 border border-primary text-primary hover:bg-primary/5 font-medium px-8 py-3 rounded-lg transition-colors"
              >
                Каталог компонентов
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

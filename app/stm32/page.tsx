import { Metadata } from 'next';
import Link from 'next/link';
import AiSearchBlock from '@/components/seo/AiSearchBlock';
import InternalLinkGrid from '@/components/seo/InternalLinkGrid';
import JsonLd from '@/components/seo/JsonLd';
import type { InternalLink } from '@/components/seo/InternalLinkGrid';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const BASE_URL = 'https://www.chip-net.ru';
const PAGE_URL = `${BASE_URL}/stm32`;

// ---------------------------------------------------------------------------
// Metadata
// ---------------------------------------------------------------------------

export const revalidate = 3600;

export function generateMetadata(): Metadata {
  return {
    title: 'Микроконтроллеры STM32 — аналоги, замена, поставка оптом | ChipNet',
    description:
      'STM32 микроконтроллеры и полные аналоги для импортозамещения: GD32, HK32, CH32, AT32. Pin-to-pin совместимые замены STM32F103, STM32F407, STM32H743. Проверка в лаборатории СВП. Доставка по России.',
    keywords: [
      'STM32',
      'аналоги STM32',
      'GD32',
      'HK32',
      'CH32',
      'импортозамещение STM32',
      'STM32F103 аналог',
      'STM32F407 замена',
      'микроконтроллеры ARM оптом',
    ],
    alternates: {
      canonical: PAGE_URL,
    },
    openGraph: {
      title: 'Микроконтроллеры STM32 — аналоги, замена, поставка оптом | ChipNet',
      description:
        'STM32 микроконтроллеры и полные аналоги для импортозамещения: GD32, HK32, CH32, AT32. Pin-to-pin совместимые замены. Проверка в лаборатории СВП.',
      url: PAGE_URL,
      type: 'website',
      locale: 'ru_RU',
      siteName: 'ChipNet',
    },
  };
}

// ---------------------------------------------------------------------------
// Data: STM32 series overview
// ---------------------------------------------------------------------------

const stm32Series = [
  {
    id: 'stm32f0',
    name: 'STM32F0',
    core: 'ARM Cortex-M0',
    freq: 'до 48 МГц',
    flash: '16–256 КБ',
    ram: '4–32 КБ',
    target: 'Бюджетные применения',
    badge: 'Бюджетные',
    badgeColor: 'bg-gray-100 text-gray-600',
    highlighted: false,
  },
  {
    id: 'stm32f1',
    name: 'STM32F1',
    core: 'ARM Cortex-M3',
    freq: 'до 72 МГц',
    flash: '16–512 КБ',
    ram: '4–64 КБ',
    target: 'Классика, самый востребованный',
    badge: 'Самый востребованный',
    badgeColor: 'bg-primary/15 text-primary font-bold',
    highlighted: true,
  },
  {
    id: 'stm32f4',
    name: 'STM32F4',
    core: 'ARM Cortex-M4F',
    freq: 'до 168 МГц',
    flash: '128 КБ – 2 МБ',
    ram: '32–256 КБ',
    target: 'DSP, цифровая обработка',
    badge: 'DSP',
    badgeColor: 'bg-amber-100 text-amber-700',
    highlighted: false,
  },
  {
    id: 'stm32h7',
    name: 'STM32H7',
    core: 'ARM Cortex-M7',
    freq: 'до 480 МГц',
    flash: 'до 2 МБ',
    ram: 'до 1 МБ',
    target: 'Флагман, макс. производительность',
    badge: 'Флагман',
    badgeColor: 'bg-rose-100 text-rose-700',
    highlighted: false,
  },
  {
    id: 'stm32l4',
    name: 'STM32L4',
    core: 'ARM Cortex-M4',
    freq: 'до 80 МГц',
    flash: '128–1024 КБ',
    ram: '40–320 КБ',
    target: 'Ультранизкопотребление',
    badge: 'Low-Power',
    badgeColor: 'bg-sky-100 text-sky-700',
    highlighted: false,
  },
];

// ---------------------------------------------------------------------------
// Data: Analog cross-reference table
// ---------------------------------------------------------------------------

const analogCrossRef = [
  {
    original: 'STM32F103C8T6',
    analogs: [
      { sku: 'GD32F103C8T6', brand: 'Gigadevice', compat: 'Pin-compatible', notes: '108 МГц vs 72 МГц, корректировка задержек Flash' },
      { sku: 'HK32F103C8T6', brand: 'HKMicro', compat: 'Pin-compatible', notes: 'Программно совместим, доступная цена' },
      { sku: 'CH32F103C8T6', brand: 'WCH', compat: 'Near-equivalent', notes: 'Периферия имеет отличия, нужна адаптация драйверов' },
    ],
  },
  {
    original: 'STM32F103RBT6',
    analogs: [
      { sku: 'GD32F103RBT6', brand: 'Gigadevice', compat: 'Pin-compatible', notes: '128 КБ Flash, LQFP64, полная замена' },
      { sku: 'HK32F103RBT6', brand: 'HKMicro', compat: 'Pin-compatible', notes: 'Доступен без ограничений' },
    ],
  },
  {
    original: 'STM32F103VET6',
    analogs: [
      { sku: 'GD32F103VET6', brand: 'Gigadevice', compat: 'Pin-compatible', notes: '512 КБ Flash, LQFP100, полная совместимость' },
      { sku: 'HK32F103VET6', brand: 'HKMicro', compat: 'Pin-compatible', notes: 'Доступен для поставок' },
    ],
  },
  {
    original: 'STM32F407VGT6',
    analogs: [
      { sku: 'GD32F407VGT6', brand: 'Gigadevice', compat: 'Pin-compatible', notes: '168 МГц, отличия в USB OTG' },
      { sku: 'AT32F407VGT7', brand: 'Artery', compat: 'Pin-compatible', notes: '240 МГц, расширенная периферия' },
    ],
  },
  {
    original: 'STM32F429ZIT6',
    analogs: [
      { sku: 'GD32F470ZIT6', brand: 'Gigadevice', compat: 'Near-equivalent', notes: 'Совместим по выводам, LTDC имеет отличия' },
      { sku: 'AT32F437ZMT7', brand: 'Artery', compat: 'Near-equivalent', notes: '288 МГц, нужна адаптация графического стека' },
    ],
  },
  {
    original: 'STM32H743VIT6',
    analogs: [
      { sku: 'GD32H743VIT6', brand: 'Gigadevice', compat: 'Near-equivalent', notes: '600 МГц, архитектура периферии отличается' },
    ],
  },
];

// ---------------------------------------------------------------------------
// Data: FAQ
// ---------------------------------------------------------------------------

const faqItems = [
  {
    question: 'Чем GD32 отличается от STM32?',
    answer: 'GD32 от Gigadevice — прямой аналог STM32 с совместимостью pin-to-pin и программной на уровне 95–100%. Основные отличия: более высокая тактовая частота (108 МГц у GD32F103 vs 72 МГц у STM32F103), отличия в задержках доступа к Flash, небольшие различия в реализации некоторых периферийных блоков. Для большинства применений замена прозрачна и не требует изменения схемы.',
  },
  {
    question: 'Совместимы ли GD32 и STM32 программно?',
    answer: 'Да, программная совместимость составляет 95–100%. Бинарный код, скомпилированный для STM32, в большинстве случаев выполняется на GD32 без изменений. Требуется корректировка задержек Flash-памяти (GD32 работает на большей частоте) и проверка таймингов для критичных участков. Стандартные библиотеки STM32 HAL и SPL работают на GD32 с минимальными модификациями.',
  },
  {
    question: 'Какой аналог STM32F103 лучше выбрать?',
    answer: 'Рекомендуем GD32F103 от Gigadevice — самый проверенный аналог с полной pin-to-pin и программной совместимостью. HK32F103 от HKMicro — более доступный по цене вариант с аналогичной совместимостью. CH32F103 от WCH подходит для некритичных применений, но требует адаптации драйверов периферии. Для ответственных проектов рекомендуем GD32 с обязательной лабораторной проверкой.',
  },
  {
    question: 'Можно ли заменить STM32F407 на AT32F407?',
    answer: 'Да, AT32F407VGT7 от Artery Technology совместим pin-to-pin с STM32F407VGT6. Преимущества: более высокая частота (240 МГц vs 168 МГц), расширенная периферия. Необходимо учитывать отличия в работе USB OTG и некоторых модулях DMA. Рекомендуем лабораторную верификацию для конкретной схемы.',
  },
  {
    question: 'Поставляются ли STM32 в Россию в 2025-2026?',
    answer: 'STMicroelectronics приостановила прямые поставки в Россию. Оригинальные STM32 доступны через параллельный импорт из складских запасов в Азии, но сроки поставки увеличены, цены выше среднемировых, а гарантия оригинальности требует тщательной проверки. Мы рекомендуем рассмотреть аналоги GD32, HK32, AT32 — они доступны без ограничений, стоят дешевле и проходят проверку в нашей лаборатории СВП.',
  },
  {
    question: 'Как проверить оригинальность STM32?',
    answer: 'Проверка включает: 1) Визуальный контроль маркировки и корпуса; 2) Рентгеновский контроль для выявления re-marking; 3) Декэпсуляция и анализ кристалла; 4) Электрические тесты — измерение параметров и сравнение с даташитом; 5) Функциональное тестирование на стенде. Наша лаборатория СВП аккредитована и проводит полный цикл проверки для каждой партии.',
  },
  {
    question: 'Какие инструменты нужны для миграции с STM32 на GD32?',
    answer: 'Для миграции нужны: 1) IDE — Keil MDK, IAR или STM32CubeIDE (работают с GD32); 2) Пакет GD32 Firmware Library от Gigadevice; 3) JTAG/SWD программатор (J-Link, ST-Link совместимы); 4) Сравнительная таблица регистров (большинство совпадают). Процесс миграции: замена заголовочных файлов, корректировка задержек Flash, компиляция и тестирование. Для типовых проектов миграция занимает 1–2 дня.',
  },
  {
    question: 'В чём разница между HK32 и CH32?',
    answer: 'HK32 от HKMicro (Гонконг) — более близкий к STM32 аналог с высокой степенью программной совместимости и стабильными поставками. CH32 от WCH (Нанкин) — более доступный по цене вариант, но архитектура периферии имеет больше отличий от STM32, что требует дополнительной адаптации драйверов. Для промышленных применений рекомендуем HK32, для бюджетных проектов — CH32.',
  },
];

// ---------------------------------------------------------------------------
// Data: Internal links
// ---------------------------------------------------------------------------

const internalLinks: InternalLink[] = [
  { label: 'FPGA / ПЛИС хаб', href: '/fpga-hub', description: 'Авторитетный хаб по ПЛИС: Xilinx, Intel, Gowin, Lattice — аналоги и замена', weight: 10, type: 'hub', intentMatch: 0.7, conversionProbability: 0.5, entityOverlap: 0.6 },
  { label: 'Texas Instruments хаб', href: '/ti', description: 'Авторитетный хаб TI: стабилизаторы, ОУ, АЦП/ЦАП — аналоги и кросс-референсы', weight: 10, type: 'hub', intentMatch: 0.6, conversionProbability: 0.5, entityOverlap: 0.4 },
  { label: 'Xilinx хаб', href: '/xilinx', description: 'Авторитетный хаб Xilinx: Artix-7, Kintex-7, Zynq — аналоги и миграция', weight: 10, type: 'hub', intentMatch: 0.6, conversionProbability: 0.5, entityOverlap: 0.4 },
  { label: 'ARM-контроллеры', href: '/arm-kontrollery', description: 'Каталог 32-битных микроконтроллеров ARM Cortex-M для промышленности и ВПК', weight: 10, type: 'category', intentMatch: 0.9, conversionProbability: 0.6, entityOverlap: 0.9 },
  { label: 'Подбор аналогов', href: '/analogs', description: 'Кросс-референсы и подбор аналогов санкционных электронных компонентов', weight: 9, type: 'analog', intentMatch: 1.0, conversionProbability: 0.7, entityOverlap: 0.8 },
  { label: 'STM32F103 → GD32F103', href: '/analog/stm32f103-gd32f103', description: 'Детальное сравнение STM32F103 и GD32F103: совместимость, миграция, отличия', weight: 9, type: 'analog', intentMatch: 1.0, conversionProbability: 0.7, entityOverlap: 0.8 },
  { label: 'STMicroelectronics', href: '/brand/stmicroelectronics', description: 'Продукция STMicroelectronics: STM32, силовая электроника, датчики, аналоговые ИС', weight: 8, type: 'brand', intentMatch: 0.8, conversionProbability: 0.5, entityOverlap: 0.7 },
  { label: 'Gigadevice', href: '/brand/gigadevice', description: 'Микроконтроллеры GD32 — полные аналоги STM32 для импортозамещения', weight: 8, type: 'brand', intentMatch: 0.8, conversionProbability: 0.5, entityOverlap: 0.7 },
  { label: 'FPGA / ПЛИС', href: '/fpga', description: 'Программируемая логика: Xilinx, Intel, Lattice, Gowin — подбор аналогов', weight: 7, type: 'category', intentMatch: 0.9, conversionProbability: 0.6, entityOverlap: 0.9 },
  { label: 'Снятое с производства', href: '/obsolete', description: 'EOL и устаревшие компоненты — подбор современных аналогов для замены', weight: 7, type: 'category', intentMatch: 0.9, conversionProbability: 0.6, entityOverlap: 0.9 },
  { label: 'Труднодоступные компоненты', href: '/hard-to-find', description: 'Поиск и поставка дефицитных и снятых с производства микросхем', weight: 6, type: 'category', intentMatch: 0.9, conversionProbability: 0.6, entityOverlap: 0.9 },
  { label: 'Импорт компонентов', href: '/import-komponentov', description: 'Параллельный импорт электронных компонентов из Азии и Европы', weight: 6, type: 'info', intentMatch: 0.5, conversionProbability: 0.8, entityOverlap: 0.4 },
  { label: 'BOM-комплектация', href: '/bom', description: 'Комплектация по спецификации: подбор аналогов, проверка, поставка', weight: 6, type: 'info', intentMatch: 0.5, conversionProbability: 0.8, entityOverlap: 0.4 },
  { label: 'Запрос КП', href: '/rfq', description: 'Запрос коммерческого предложения на электронные компоненты и аналоги', weight: 5, type: 'info', intentMatch: 0.5, conversionProbability: 0.8, entityOverlap: 0.4 },
];

// ---------------------------------------------------------------------------
// JSON-LD schemas
// ---------------------------------------------------------------------------

const breadcrumbLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Главная', item: BASE_URL },
    { '@type': 'ListItem', position: 2, name: 'Микроконтроллеры', item: `${BASE_URL}/arm-kontrollery` },
    { '@type': 'ListItem', position: 3, name: 'STM32', item: PAGE_URL },
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

const itemListLd = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: 'Серии микроконтроллеров STM32',
  itemListElement: stm32Series.map((s, idx) => ({
    '@type': 'ListItem',
    position: idx + 1,
    name: s.name,
    description: `${s.core}, ${s.freq}, Flash ${s.flash}, RAM ${s.ram}. ${s.target}`,
    url: `${BASE_URL}/catalog?search=${encodeURIComponent(s.name)}`,
  })),
};

const productLds = analogCrossRef.slice(0, 4).map((entry) => ({
  '@context': 'https://schema.org',
  '@type': 'Product',
  name: entry.original,
  description: `Микроконтроллер ${entry.original} и аналоги для импортозамещения: ${entry.analogs.map((a) => a.sku).join(', ')}`,
  brand: {
    '@type': 'Brand',
    name: 'STMicroelectronics',
  },
  sku: entry.original,
  offers: {
    '@type': 'Offer',
    availability: 'https://schema.org/InStock',
    seller: {
      '@type': 'Organization',
      name: 'ChipNet',
    },
  },
  isSimilarTo: entry.analogs.map((alt) => ({
    '@type': 'Product',
    name: alt.sku,
    brand: { '@type': 'Brand', name: alt.brand },
    description: alt.compat,
  })),
}));

// ---------------------------------------------------------------------------
// Helper: Compatibility badge color
// ---------------------------------------------------------------------------

function compatBadge(compat: string) {
  if (compat === 'Pin-compatible') return 'bg-primary/15 text-primary';
  if (compat === 'Near-equivalent') return 'bg-amber-100 text-amber-700';
  if (compat === 'Functional-equivalent') return 'bg-sky-100 text-sky-700';
  return 'bg-gray-100 text-gray-600';
}

function compatLabel(compat: string) {
  if (compat === 'Pin-compatible') return 'Pin-to-pin';
  if (compat === 'Near-equivalent') return 'Близкий аналог';
  if (compat === 'Functional-equivalent') return 'Функциональный';
  return compat;
}

// ---------------------------------------------------------------------------
// Page component
// ---------------------------------------------------------------------------

export default function Stm32Page() {
  return (
    <>
      {/* JSON-LD schemas */}
      <JsonLd />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListLd) }}
      />
      {productLds.map((ld, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }}
        />
      ))}

      <main className="min-h-screen bg-background text-[#121212]">
        {/* ─── 1. Hero Section ──────────────────────────────────────────── */}
        <section className="pt-28 pb-16 px-4 bg-gradient-to-b from-[#f0f4ee] to-background">
          <div className="max-w-7xl mx-auto">
            {/* Breadcrumb */}
            <nav className="text-sm text-[#757575] mb-6 flex items-center gap-2" aria-label="Breadcrumb">
              <Link href="/" className="hover:text-primary transition-colors">Главная</Link>
              <span className="text-[#cbcbcb]">/</span>
              <Link href="/arm-kontrollery" className="hover:text-primary transition-colors">Микроконтроллеры</Link>
              <span className="text-[#cbcbcb]">/</span>
              <span className="text-[#555] font-medium">STM32</span>
            </nav>

            {/* Badge */}
            <div className="mb-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/15 text-primary">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                Импортозамещение
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-primary-dark bg-clip-text text-transparent leading-tight">
              Микроконтроллеры STM32: подбор, аналоги и поставка для промышленности
            </h1>

            <p className="text-base sm:text-lg text-[#555] max-w-3xl leading-relaxed">
              STM32 — самая распространённая платформа 32-битных микроконтроллеров ARM Cortex в России.
              В условиях санкционных ограничений на поставки STMicroelectronics, компания ChipNet предлагает
              как оригинальные STM32 через параллельный импорт, так и полные аналоги для импортозамещения:
              <strong className="text-[#121212]"> GD32</strong> (Gigadevice),
              <strong className="text-[#121212]"> HK32</strong> (HKMicro),
              <strong className="text-[#121212]"> CH32</strong> (WCH),
              <strong className="text-[#121212]"> AT32</strong> (Artery) —
              с проверкой совместимости в аккредитованной лаборатории СВП.
            </p>

            {/* Quick stats */}
            <div className="mt-8 flex flex-wrap gap-3">
              {[
                { label: 'Серий STM32', value: '5+' },
                { label: 'Аналогов в наличии', value: '200+' },
                { label: 'Pin-to-pin замен', value: '150+' },
                { label: 'Проверка в лаборатории', value: 'СВП' },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-[#e8e8e8] shadow-sm"
                >
                  <span className="text-lg font-bold text-primary">{stat.value}</span>
                  <span className="text-xs text-[#757575]">{stat.label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── Authority Signal Block ─────────────────────────────────────── */}
        <section className="px-4 py-8 bg-gradient-to-r from-primary/[0.04] to-background border-y border-primary/10">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row gap-6 items-start">
              <div className="flex-1">
                <h2 className="text-lg font-bold text-[#121212] mb-2 flex items-center gap-2">
                  <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  Почему этот хаб — авторитетный источник
                </h2>
                <p className="text-sm text-[#555] leading-relaxed">
                  Хаб STM32 охватывает полную экосистему микроконтроллеров ARM Cortex-M и их аналогов для импортозамещения.
                  Мы предоставляем проверенные кросс-референсы, инженерную экспертизу по совместимости и прямые
                  ссылки на компоненты в наличии. Данные актуализируются инженерами ChipNet на основе реального
                  опыта поставок и лабораторных испытаний в СВП.
                </p>
              </div>
              <div className="flex flex-wrap gap-3 md:gap-4">
                <div className="text-center px-4 py-2 rounded-lg bg-white border border-[#e8e8e8]">
                  <div className="text-xl font-bold text-primary">5</div>
                  <div className="text-[10px] text-[#757575] uppercase tracking-wide">Серий STM32</div>
                </div>
                <div className="text-center px-4 py-2 rounded-lg bg-white border border-[#e8e8e8]">
                  <div className="text-xl font-bold text-primary">4</div>
                  <div className="text-[10px] text-[#757575] uppercase tracking-wide">Бренда аналогов</div>
                </div>
                <div className="text-center px-4 py-2 rounded-lg bg-white border border-[#e8e8e8]">
                  <div className="text-xl font-bold text-primary">200+</div>
                  <div className="text-[10px] text-[#757575] uppercase tracking-wide">Кросс-референсов</div>
                </div>
                <div className="text-center px-4 py-2 rounded-lg bg-white border border-[#e8e8e8]">
                  <div className="text-xl font-bold text-primary">98</div>
                  <div className="text-[10px] text-[#757575] uppercase tracking-wide">Authority Score</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─── 2. AI DirectAnswer Block ─────────────────────────────────── */}
        <section className="px-4 py-12 bg-background">
          <div className="max-w-7xl mx-auto">
            <AiSearchBlock
              type="DirectAnswer"
              question="Какие аналоги STM32 доступны в России?"
              answer="В России доступны четыре основных семейства аналогов STM32. GD32 (Gigadevice) — pin-to-pin совместимые микроконтроллеры, самый проверенный вариант с программной совместимостью 95–100%. HK32 (HKMicro) — доступный аналог с высокой совместимостью и стабильными поставками. CH32 (WCH) — бюджетная замена с оговорками: периферия имеет отличия, требует адаптации драйверов. AT32 (Artery Technology) — аналоги серий STM32F4/F1 с расширенной периферией и повышенной частотой (до 240 МГц). Все аналоги доступны для поставок без санкционных ограничений."
              sources={[`${BASE_URL}/analogs`, `${BASE_URL}/brand/gigadevice`]}
            />
          </div>
        </section>

        {/* ─── 3. STM32 Series Overview ─────────────────────────────────── */}
        <section className="px-4 py-16 bg-[#f0f4ee]" aria-labelledby="series-heading">
          <div className="max-w-7xl mx-auto">
            <h2
              id="series-heading"
              className="text-2xl sm:text-3xl font-bold mb-3 text-[#121212]"
            >
              Обзор серий микроконтроллеров STM32
            </h2>
            <p className="text-[#555] mb-8 max-w-3xl">
              Семейство STM32 охватывает все сегменты — от бюджетных Cortex-M0 до флагманских Cortex-M7.
              Каждая серия оптимизирована под конкретные задачи: массовое производство, цифровая обработка
              сигналов, ультранизкое потребление или максимальная производительность.
            </p>

            {/* Comparison table using AiSearchBlock */}
            <div className="mb-10">
              <AiSearchBlock
                type="ComparisonTable"
                title="Сравнение серий STM32 по ключевым параметрам"
                headers={['Серия', 'Ядро', 'Частота', 'Flash', 'RAM', 'Назначение']}
                rows={stm32Series.map((s) => [
                  s.highlighted ? `${s.name} ★` : s.name,
                  s.core,
                  s.freq,
                  s.flash,
                  s.ram,
                  s.target,
                ])}
                caption="Сравнение основных серий микроконтроллеров STM32. ★ — самая востребованная серия на российском рынке"
              />
            </div>

            {/* Series cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {stm32Series.map((s) => (
                <div
                  key={s.id}
                  className={`rounded-xl border p-5 transition-all hover:shadow-md ${
                    s.highlighted
                      ? 'bg-gradient-to-br from-primary/[0.06] to-white border-primary/30 ring-1 ring-primary/10'
                      : 'bg-white border-[#d4ddd2] hover:border-primary/20'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-bold text-[#121212]">{s.name}</h3>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wide ${s.badgeColor}`}>
                      {s.badge}
                    </span>
                  </div>
                  <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                    <dt className="text-[#757575]">Ядро</dt>
                    <dd className="font-medium text-[#121212]">{s.core}</dd>
                    <dt className="text-[#757575]">Частота</dt>
                    <dd className="font-medium text-[#121212]">{s.freq}</dd>
                    <dt className="text-[#757575]">Flash</dt>
                    <dd className="font-medium text-[#121212]">{s.flash}</dd>
                    <dt className="text-[#757575]">RAM</dt>
                    <dd className="font-medium text-[#121212]">{s.ram}</dd>
                  </dl>
                  <p className="mt-3 text-xs text-[#757575]">{s.target}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── 4. Analog Cross-Reference Table ──────────────────────────── */}
        <section className="px-4 py-16 bg-background" aria-labelledby="xref-heading">
          <div className="max-w-7xl mx-auto">
            <h2
              id="xref-heading"
              className="text-2xl sm:text-3xl font-bold mb-3 text-[#121212]"
            >
              Таблица кросс-референсов аналогов STM32
            </h2>
            <p className="text-[#555] mb-8 max-w-3xl">
              Актуальные кросс-референсы для замены STM32 на доступные аналоги.
              Данные проверены инженерами ChipNet на соответствие электрических параметров
              и корпусной совместимости. Все аналоги доступны для поставок в Россию.
            </p>

            <div className="overflow-x-auto rounded-xl border border-[#d4ddd2] shadow-sm">
              <table className="w-full text-sm border-collapse">
                <caption className="sr-only">
                  Кросс-референсы аналогов микроконтроллеров STM32
                </caption>
                <thead>
                  <tr className="bg-primary/10">
                    <th scope="col" className="px-4 py-3 text-left font-semibold text-[#121212] border-b-2 border-primary/30 whitespace-nowrap">
                      STM32 (оригинал)
                    </th>
                    <th scope="col" className="px-4 py-3 text-left font-semibold text-[#121212] border-b-2 border-primary/30 whitespace-nowrap">
                      Аналог
                    </th>
                    <th scope="col" className="px-4 py-3 text-left font-semibold text-[#121212] border-b-2 border-primary/30 whitespace-nowrap">
                      Бренд
                    </th>
                    <th scope="col" className="px-4 py-3 text-left font-semibold text-[#121212] border-b-2 border-primary/30 whitespace-nowrap">
                      Совместимость
                    </th>
                    <th scope="col" className="px-4 py-3 text-left font-semibold text-[#121212] border-b-2 border-primary/30">
                      Примечания
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {analogCrossRef.map((entry) =>
                    entry.analogs.map((alt, ai) => (
                      <tr
                        key={`${entry.original}-${alt.sku}`}
                        className="border-b border-[#e8e8e8] hover:bg-[#f0f4ee]/60 transition-colors"
                      >
                        {ai === 0 && (
                          <td
                            className="px-4 py-3 font-mono font-semibold text-primary whitespace-nowrap align-top"
                            rowSpan={entry.analogs.length}
                          >
                            <Link
                              href={`/catalog?search=${encodeURIComponent(entry.original)}`}
                              className="hover:underline"
                            >
                              {entry.original}
                            </Link>
                          </td>
                        )}
                        <td className="px-4 py-3 font-mono text-[#121212]">
                          <Link
                            href={`/catalog?search=${encodeURIComponent(alt.sku)}`}
                            className="hover:text-primary hover:underline transition-colors"
                          >
                            {alt.sku}
                          </Link>
                        </td>
                        <td className="px-4 py-3 text-[#555]">
                          <Link
                            href={`/brand/${alt.brand.toLowerCase().replace(/\s+/g, '-')}`}
                            className="hover:text-primary transition-colors"
                          >
                            {alt.brand}
                          </Link>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wide ${compatBadge(alt.compat)}`}>
                            {compatLabel(alt.compat)}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-[#555] text-xs leading-relaxed">
                          {alt.notes}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <p className="mt-4 text-xs text-[#757575]">
              Совместимость подтверждена инженерами ChipNet. Для каждой конкретной схемы рекомендуем лабораторную проверку.
            </p>
          </div>
        </section>

        {/* ─── 5. Import Substitution Guide ─────────────────────────────── */}
        <section className="px-4 py-16 bg-[#f0f4ee]" aria-labelledby="importsub-heading">
          <div className="max-w-7xl mx-auto">
            <h2
              id="importsub-heading"
              className="text-2xl sm:text-3xl font-bold mb-3 text-[#121212]"
            >
              Руководство по импортозамещению STM32
            </h2>
            <p className="text-[#555] mb-8 max-w-3xl">
              Пошаговое руководство по замене микроконтроллеров STM32 на доступные аналоги
              для обеспечения непрерывности производства в условиях санкционных ограничений.
            </p>

            {/* AiSummaryBox with key points */}
            <div className="mb-10">
              <AiSearchBlock
                type="AiSummaryBox"
                title="Ключевые принципы замены STM32"
                summary="Замена STM32 на GD32/HK32/CH32/AT32 возможна в большинстве промышленных применений благодаря высокой степени pin-to-pin и программной совместимости. Основные риски связаны с отличиями во временных характеристиках Flash-памяти, реализации специфических периферийных блоков и работе на повышенных частотах."
                keyPoints={[
                  'GD32 — самый проверенный аналог: 95–100% программная совместимость, pin-to-pin замена без изменения PCB',
                  'HK32 — доступный вариант для массовых применений с высокой совместимостью и стабильными поставками',
                  'CH32 — бюджетная замена для некритичных проектов, требует адаптации драйверов периферии',
                  'AT32 — альтернатива серий F4/F1 с расширенной периферией и повышенной частотой до 240 МГц',
                  'Обязательна лабораторная проверка: тестирование в реальной схеме, подтверждение оригинальности чипа',
                  'Миграция firmware занимает 1–2 дня для типового проекта при замене на GD32',
                ]}
              />
            </div>

            {/* Detailed guide sections */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Hardware compatibility */}
              <div className="rounded-xl border border-[#d4ddd2] bg-white p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-[#121212]">Аппаратная совместимость</h3>
                </div>
                <ul className="space-y-3 text-sm text-[#444]">
                  <li className="flex items-start gap-2">
                    <svg className="w-4 h-4 mt-0.5 shrink-0 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    <span><strong>Цоколёвка:</strong> GD32 и HK32 полностью совместимы по выводам с соответствующими сериями STM32 — замена без переработки PCB</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg className="w-4 h-4 mt-0.5 shrink-0 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    <span><strong>Напряжение питания:</strong> аналогичное (2.0–3.6 В), обвязка не требует изменений</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg className="w-4 h-4 mt-0.5 shrink-0 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    <span><strong>Корпуса:</strong> LQFP48/64/100/144, BGA — те же, что и у STM32</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg className="w-4 h-4 mt-0.5 shrink-0 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" /></svg>
                    <span><strong>Внимание:</strong> CH32 имеет отличия в назначении некоторых альтернативных функций выводов</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg className="w-4 h-4 mt-0.5 shrink-0 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" /></svg>
                    <span><strong>AT32:</strong> повышенная частота может потребовать корректировки обвязки тактового генератора</span>
                  </li>
                </ul>
              </div>

              {/* Software migration */}
              <div className="rounded-xl border border-[#d4ddd2] bg-white p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-[#121212]">Программная миграция</h3>
                </div>
                <ul className="space-y-3 text-sm text-[#444]">
                  <li className="flex items-start gap-2">
                    <svg className="w-4 h-4 mt-0.5 shrink-0 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    <span><strong>Бинарная совместимость:</strong> GD32/HK32 выполняют скомпилированный код STM32 без перекомпиляции</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg className="w-4 h-4 mt-0.5 shrink-0 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    <span><strong>HAL/SPL:</strong> стандартные библиотеки STM32 работают с минимальными модификациями</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg className="w-4 h-4 mt-0.5 shrink-0 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    <span><strong>IDE:</strong> Keil MDK, IAR, STM32CubeIDE — все совместимы с GD32/HK32</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg className="w-4 h-4 mt-0.5 shrink-0 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" /></svg>
                    <span><strong>Задержки Flash:</strong> GD32 на частотах выше 72 МГц требует настройки wait states</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg className="w-4 h-4 mt-0.5 shrink-0 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" /></svg>
                    <span><strong>CH32:</strong> собственная библиотека WCH — требуется адаптация кода периферии</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* KeySpecsTable for the most popular component */}
            <div className="mt-10">
              <AiSearchBlock
                type="KeySpecsTable"
                component="STM32F103C8T6"
                specs={{
                  'Ядро': 'ARM Cortex-M3',
                  'Частота': 'до 72 МГц',
                  'Flash': '64 КБ',
                  'RAM': '20 КБ',
                  'Питание': '2.0–3.6 В',
                  'Корпус': 'LQFP48',
                  'Периферия': 'USART×3, SPI×2, I2C×2, USB 2.0 FS, CAN, ADC×2 12-бит',
                  'Производитель': 'STMicroelectronics',
                }}
                alternates={[
                  { sku: 'GD32F103C8T6', brand: 'Gigadevice', compatibility: 'Pin-to-pin совместим' },
                  { sku: 'HK32F103C8T6', brand: 'HKMicro', compatibility: 'Pin-to-pin совместим' },
                  { sku: 'CH32F103C8T6', brand: 'WCH', compatibility: 'Близкий аналог' },
                ]}
              />
            </div>
          </div>
        </section>

        {/* ─── Procurement Decision Block ──────────────────────────────── */}
        <section className="px-4 py-16 bg-gradient-to-br from-primary/[0.06] to-background" aria-labelledby="procurement-heading">
          <div className="max-w-7xl mx-auto">
            <h2 id="procurement-heading" className="text-2xl sm:text-3xl font-bold mb-3 text-[#121212]">
              Решение о закупке
            </h2>
            <p className="text-[#555] mb-8 max-w-3xl">
              Независимо от того, нужны ли оригинальные STM32 или аналоги для импортозамещения — мы поможем подобрать оптимальное решение. Запросите коммерческое предложение, и инженеры ChipNet подготовят детальное предложение с учётом ваших технических требований и сроков.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Link href="/rfq" className="group rounded-xl border-2 border-primary/30 bg-gradient-to-br from-primary/5 to-card p-6 hover:border-primary hover:shadow-lg transition-all">
                <div className="text-2xl mb-3">📋</div>
                <h3 className="text-lg font-bold text-[#121212] mb-2 group-hover:text-primary transition-colors">Запросить КП</h3>
                <p className="text-sm text-[#555]">Отправьте заявку — подготовим коммерческое предложение за 2 часа с указанием цен, сроков и аналогов.</p>
              </Link>
              <Link href="/bom" className="group rounded-xl border-2 border-primary/30 bg-gradient-to-br from-primary/5 to-card p-6 hover:border-primary hover:shadow-lg transition-all">
                <div className="text-2xl mb-3">📦</div>
                <h3 className="text-lg font-bold text-[#121212] mb-2 group-hover:text-primary transition-colors">BOM-комплектация</h3>
                <p className="text-sm text-[#555]">Загрузите спецификацию — подберём аналоги, проверим наличие, скомплектуем заказ.</p>
              </Link>
              <Link href="/analogs" className="group rounded-xl border-2 border-primary/30 bg-gradient-to-br from-primary/5 to-card p-6 hover:border-primary hover:shadow-lg transition-all">
                <div className="text-2xl mb-3">🔄</div>
                <h3 className="text-lg font-bold text-[#121212] mb-2 group-hover:text-primary transition-colors">Подбор аналогов</h3>
                <p className="text-sm text-[#555]">Инженерный кросс-референс с учётом электрических параметров и совместимости.</p>
              </Link>
            </div>
          </div>
        </section>

        {/* ─── 6. FAQ Section ───────────────────────────────────────────── */}
        <section className="px-4 py-16 bg-background" aria-labelledby="faq-heading">
          <div className="max-w-4xl mx-auto">
            <h2
              id="faq-heading"
              className="text-2xl sm:text-3xl font-bold mb-3 text-center text-[#121212]"
            >
              Часто задаваемые вопросы о STM32 и аналогах
            </h2>
            <p className="text-[#555] mb-10 text-center max-w-2xl mx-auto">
              Ответы на ключевые вопросы по импортозамещению микроконтроллеров STM32,
              совместимости аналогов и условиям поставки.
            </p>

            <div className="space-y-3">
              {faqItems.map((item, index) => (
                <details
                  key={index}
                  className="group rounded-xl border border-[#d4ddd2] bg-white overflow-hidden hover:border-primary/20 transition-colors"
                >
                  <summary className="flex items-center justify-between p-5 cursor-pointer hover:bg-[#f0f4ee]/50 transition-colors">
                    <span className="font-semibold text-[#121212] pr-4 text-sm sm:text-base">{item.question}</span>
                    <svg
                      className="w-5 h-5 text-[#757575] group-open:rotate-180 transition-transform shrink-0"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </summary>
                  <div className="px-5 pb-5 text-[#555] text-sm leading-relaxed border-t border-[#e8e8e8] pt-4">
                    {item.answer}
                  </div>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* ─── 7. Internal Link Grid ─────────────────────────────────────── */}
        <section className="px-4 py-16 bg-[#f0f4ee]" aria-labelledby="links-heading">
          <div className="max-w-7xl mx-auto">
            <InternalLinkGrid
              title="Связанные разделы и категории"
              links={internalLinks}
              columns={3}
            />
          </div>
        </section>

        {/* ─── 8. CTA Section ────────────────────────────────────────────── */}
        <section className="px-4 py-16 bg-background">
          <div className="max-w-4xl mx-auto">
            <div className="rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/[0.06] to-primary-dark/[0.03] p-8 md:p-12 text-center shadow-sm">
              <div className="flex justify-center mb-4">
                <div className="w-14 h-14 rounded-full bg-primary/15 flex items-center justify-center">
                  <svg className="w-7 h-7 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold mb-3 text-[#121212]">
                Запросить КП на STM32 и аналоги
              </h2>
              <p className="text-[#555] mb-8 max-w-xl mx-auto text-sm sm:text-base leading-relaxed">
                Отправьте спецификацию (BOM) или список нужных компонентов — подберём доступные аналоги,
                проверим совместимость в лаборатории СВП и подготовим коммерческое предложение
                с фиксированными сроками поставки.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/rfq"
                  className="inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark text-[#121212] font-semibold px-8 py-3.5 rounded-xl transition-colors shadow-sm hover:shadow-md"
                >
                  Запросить коммерческое предложение
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
                <Link
                  href="/bom"
                  className="inline-flex items-center justify-center gap-2 border-2 border-primary text-primary hover:bg-primary/5 font-semibold px-8 py-3.5 rounded-xl transition-colors"
                >
                  Загрузить BOM-лист
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                </Link>
              </div>
              <p className="mt-6 text-xs text-[#757575]">
                Среднее время ответа — 2 часа в рабочие дни. Бесплатный подбор аналогов для BOM от 20 позиций.
              </p>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

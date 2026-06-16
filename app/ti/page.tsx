import { Metadata } from 'next';
import Link from 'next/link';
import AiSearchBlock from '@/components/seo/AiSearchBlock';
import InternalLinkGrid from '@/components/seo/InternalLinkGrid';
import { analogMap } from '@/lib/semantic-data';

const BASE_URL = 'https://www.chip-net.ru';

export const revalidate = 3600;

// ---------------------------------------------------------------------------
// Metadata
// ---------------------------------------------------------------------------

export const metadata: Metadata = {
  title: 'Компоненты Texas Instruments — аналоги, замена, поставка оптом | ChipNet',
  description:
    'Аналоги Texas Instruments: TPS5430→MP1584, LM2596→XL2596, LM358→TS358. Кросс-референсы TI, подбор замены стабилизаторов, ОУ, АЦП. Проверка в СВП. Доставка по РФ.',
  keywords: [
    'Texas Instruments',
    'аналоги TI',
    'TPS5430 аналог',
    'LM2596 замена',
    'LM358 аналог',
    'стабилизаторы TI',
    'ОУ TI',
    'импортозамещение Texas Instruments',
  ],
  alternates: {
    canonical: `${BASE_URL}/ti`,
  },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Компоненты Texas Instruments — аналоги, замена, поставка оптом | ChipNet',
    description:
      'Аналоги Texas Instruments: TPS5430→MP1584, LM2596→XL2596, LM358→TS358. Кросс-референсы TI, подбор замены стабилизаторов, ОУ, АЦП.',
    url: `${BASE_URL}/ti`,
    type: 'website',
    locale: 'ru_RU',
    siteName: 'ChipNet',
  },
};

// ---------------------------------------------------------------------------
// Data: TI-related analog entries from semantic-data
// ---------------------------------------------------------------------------

const tiAnalogEntries = analogMap.filter(
  (entry) =>
    entry.original.startsWith('TPS') ||
    entry.original.startsWith('LM2596') ||
    entry.original.startsWith('LM358') ||
    entry.original.startsWith('LM324') ||
    entry.original.startsWith('TL072') ||
    entry.original.startsWith('AMS1117') ||
    entry.original.startsWith('TLV1117') ||
    entry.original.startsWith('LM7805') ||
    entry.original.startsWith('LM317') ||
    entry.original.startsWith('OPA2134')
);

// ---------------------------------------------------------------------------
// Data: Product categories
// ---------------------------------------------------------------------------

const tiCategories = [
  {
    name: 'DC-DC стабилизаторы',
    description:
      'Импульсные понижающие преобразователи Texas Instruments — серия TPS54xxx, TPS56xxx и классика LM2596 Simple Switcher. Широкий диапазон входных напряжений (3.5–60 В), выходные токи до 10 А, КПД до 95%. Основные компоненты для промышленных источников питания и распределённых систем питания.',
    parts: ['TPS5430DDAR', 'TPS54331DR', 'TPS563200DDCR', 'LM2596S-5.0', 'LM2596S-3.3'],
    specs: {
      'Входное напряжение': '3.5–60 В',
      'Выходной ток': '0.5–10 А',
      'Частота ШИМ': '150 кГц – 2.2 МГц',
      'КПД': 'до 95%',
    },
    icon: '⚡',
  },
  {
    name: 'LDO стабилизаторы',
    description:
      'Линейные стабилизаторы напряжения от TI: серия TLV1117, AMS1117 и классические 78xx. Ультранизкое падение напряжения, токи до 1 А, фиксированные и регулируемые варианты выходного напряжения. Широко применяются для питания микроконтроллеров, FPGA и пост-стабилизации DC-DC.',
    parts: ['TLV1117LV33DCYR', 'AMS1117-3.3', 'AMS1117-5.0', 'LM7805CT', 'LM317T'],
    specs: {
      'Выходной ток': 'до 1 А',
      'Падение напряжения': 'от 0.4 В',
      'Выходное напряжение': '1.2 / 1.8 / 2.5 / 3.3 / 5.0 / Adj.',
      'Корпус': 'SOT-223, SOT-23, TO-220',
    },
    icon: '🔋',
  },
  {
    name: 'Операционные усилители',
    description:
      'Операционные усилители TI — от универсального LM358 до высококачественных аудио ОУ OPA2134 и NE5532. Двойные и счетверённые конфигурации, широкий диапазон питания (1.8–36 В), полоса пропускания от 1 МГц до 50+ МГц. Применяются в аналоговых цепях, усилителях датчиков, активных фильтрах и аудиоаппаратуре.',
    parts: ['LM358DR', 'TL072CDR', 'OPA2134PA', 'NE5532P', 'LM324DR'],
    specs: {
      'Тип': 'Двойные / Счетверённые ОУ',
      'Питание': '1.8 – 36 В',
      'Gain-BW': '1 МГц – 50+ МГц',
      'Корпус': 'DIP-8, SOIC-8, MSOP-8',
    },
    icon: '📈',
  },
  {
    name: 'АЦП/ЦАП',
    description:
      'Высокоточные аналого-цифровые и цифро-аналоговые преобразователи TI. ADS1115 — 16-битный АЦП с I2C для датчиков, ADS1256 — 24-битный прецизионный для измерительных систем, DAC7578 — 12-битный 8-канальный ЦАП. Основа измерительных и управляющих систем промышленности и ВПК.',
    parts: ['ADS1115IDGSR', 'ADS1256IDBR', 'DAC7578SPW', 'ADS1220IPW', 'DAC8568SDSCR'],
    specs: {
      'Разрядность': '12 – 24 бит',
      'Интерфейс': 'I2C, SPI',
      'Частота дискретизации': 'до 80 kSPS (ADS1256)',
      'Каналы': '1 – 8',
    },
    icon: '🔲',
  },
  {
    name: 'MSP430 микроконтроллеры',
    description:
      'Серия ультранизкопотребляющих 16-битных микроконтроллеров MSP430 от TI. Идеальны для приложений с батарейным питанием, датчиков и носимой электроники. Активное потребление от 100 мкА/МГц, режим LPM3 — 0.5 мкА. Встроенная периферия: АЦП, компараторы, LCD-контроллер, радиочастотные интерфейсы.',
    parts: ['MSP430G2553IPW20', 'MSP430F5529IPN', 'MSP430FR5994IPZ'],
    specs: {
      'Ядро': '16-бит MSP430',
      'Питание': '1.8 – 3.6 В',
      'Активное потребление': 'от 100 мкА/МГц',
      'Flash / FRAM': 'до 256 КБ',
    },
    icon: '🔧',
  },
  {
    name: 'DSP C2000',
    description:
      'Серия 32-битных DSP-микроконтроллеров C2000 для управления силовой электроникой и моторами. Ядро C28x с аппаратным ускорителем TMU, ШИМ-модули высокого разрешения, быстрый АЦП. Применяются в инверторах, сервоприводах, системах управления питанием и электротранспорте.',
    parts: ['TMS320F28379D', 'TMS320F280049C', 'TMS320F28335ZJZ'],
    specs: {
      'Ядро': 'C28x + CLA',
      'Частота': 'до 200 МГц',
      'ШИМ': 'высокого разрешения (HRPWM)',
      'АЦП': '12/16 бит, до 3.5 MSPS',
    },
    icon: '⚙️',
  },
];

// ---------------------------------------------------------------------------
// Data: Cross-reference table rows
// ---------------------------------------------------------------------------

const crossRefHeaders = ['TI компонент', 'Аналог', 'Бренд аналога', 'Совместимость', 'Примечание'];

const crossRefRows: string[][] = tiAnalogEntries.flatMap((entry) =>
  entry.replacements.map((rep) => [
    entry.original,
    rep.sku,
    rep.brand,
    rep.compatibility === 'pin-compatible'
      ? 'Pin-to-pin'
      : rep.compatibility === 'functional-equivalent'
        ? 'Функциональный аналог'
        : rep.compatibility === 'near-equivalent'
          ? 'Близкий аналог'
          : rep.compatibility === 'upgrade'
            ? 'Улучшение'
            : rep.compatibility,
    rep.notes.length > 80 ? rep.notes.slice(0, 77) + '...' : rep.notes,
  ])
);

// ---------------------------------------------------------------------------
// Data: Import substitution guide steps
// ---------------------------------------------------------------------------

const substitutionSteps = [
  {
    step: '01',
    title: 'Аудит BOM на компоненты TI',
    description:
      'Вы загружаете BOM-лист или спецификацию. Наши инженеры выделяют все позиции Texas Instruments и определяют приоритет замены: недоступные из-за санкций, EOL-компоненты и позиции с длительным сроком поставки.',
  },
  {
    step: '02',
    title: 'Подбор аналогов по кросс-референсам',
    description:
      'Для каждого TI-компонента подбираем доступные аналоги от Monolithic Power, Richtek, XLSEMI, Silergy, STMicroelectronics и других производителей. Оцениваем электрическую совместимость, доступность на складе и сроки поставки.',
  },
  {
    step: '03',
    title: 'Проверка совместимости в лаборатории СВП',
    description:
      'Каждый аналог проходит лабораторную верификацию: измерение реальных параметров на стенде, проверка работы в типовой схеме, рентгеновский контроль и декэпсуляция для подтверждения оригинальности кристалла.',
  },
  {
    step: '04',
    title: 'Адаптация обвязки и документации',
    description:
      'Подготавливаем рекомендации по изменению обвязки (если аналог не pin-to-pin), обновляем BOM и схему электрическую принципиальную. При необходимости — инженерное сопровождение на этапе прототипирования.',
  },
  {
    step: '05',
    title: 'Поставка и гарантия качества',
    description:
      'Поставляем аналоги TI с полным пакетом документации: сертификат соответствия, протокол измерений, заключение лаборатории СВП. Гарантируем происхождение каждого компонента из авторизованных каналов.',
  },
];

// ---------------------------------------------------------------------------
// Data: FAQ
// ---------------------------------------------------------------------------

const faqItems = [
  {
    question: 'Чем заменить стабилизаторы TPS5430 и TPS563200 от Texas Instruments?',
    answer:
      'TPS5430 можно заменить на MP1584EN-LF-Z (Monolithic Power) — аналогичные параметры: 3 А, 4.5–28 В, частота 1.5 МГц, но отличается pinout, потребуется переработка обвязки. Для TPS563200 подойдут MP2143GD-Z (Monolithic Power) или SY8120BABC (Silergy) — оба в корпусе SOT-23-6, совместимы по форм-фактору. Мы проверяем каждый аналог на стенде перед поставкой.',
  },
  {
    question: 'Является ли XL2596 полной заменой LM2596?',
    answer:
      'Да, XL2596S-5.0E1 и XL2596S-3.3E1 от XLSEMI — прямые клоны LM2596 с pin-to-pin совместимостью в корпусе TO-263. Электрические параметры идентичны: вход до 40 В, выходной ток до 3 А, частота ШИМ 150 кГц. Дополнительный вариант замены — MP1584EN-LF-Z, который работает на более высокой частоте (1.5 МГц), что позволяет использовать индуктивность меньшего размера, но требует переработки обвязки.',
  },
  {
    question: 'Какие аналоги LM358 доступны для поставки?',
    answer:
      'LM358 — один из самых массовых двойных ОУ, и аналогов несколько: TS358CDT (STMicroelectronics) — полный pin-to-pin аналог; MCP6002-I/SN (Microchip) — совместим по выводам SOIC-8, но диапазон питания 1.8–6 В вместо 3–32 В у LM358; LM358PSR (onsemi) — прямой аналог. Для высоковольтовых применений (до 32 В) рекомендуем TS358 или LM358PSR, для низковольтовых — MCP6002 с ультранизким потреблением.',
  },
  {
    question: 'Как заменить АЦП ADS1115 и ADS1256 от TI?',
    answer:
      'Для ADS1115 (16-бит, I2C) аналогом является MCP3424 (Microchip) — 18-битный АЦП с I2C, но с отличающейся адресацией и регистровой картой. Для ADS1256 (24-бит, SPI) прямых pin-to-pin аналогов нет, но можно рассмотреть AD7124 (Analog Devices) с аналогичными характеристиками и переработкой программного обеспечения. Мы помогаем адаптировать драйверы при переходе на альтернативные АЦП.',
  },
  {
    question: 'Можно ли заменить MSP430 микроконтроллеры на аналоги?',
    answer:
      'Прямых pin-to-pin аналогов MSP430 нет из-за уникальной 16-битной архитектуры. Для импортозамещения рекомендуем переход на 32-битные микроконтроллеры: STM32L4 (STMicroelectronics) для низкопотребляющих применений, GD32E230 (Gigadevice) — бюджетный аналог с Cortex-M23. Обе опции требуют переработки программного обеспечения, но обеспечивают лучшую производительность и доступность.',
  },
  {
    question: 'Как вы гарантируете оригинальность аналогов TI?',
    answer:
      'Проверка оригинальности проходит в аккредитованной лаборатории СВП (система видеоконтроля производства): рентгеновский контроль корпуса и кристалла, декэпсуляция с верификацией маркировки кристалла, измерение электрических параметров и сравнение с даташитом, проверка трассировки поставки до производителя. Каждая партия сопровождается протоколом проверки и сертификатом соответствия.',
  },
];

// ---------------------------------------------------------------------------
// Data: Internal links
// ---------------------------------------------------------------------------

const internalLinks = [
  { label: 'STM32 хаб', href: '/stm32', description: 'Авторитетный хаб по микроконтроллерам STM32 и аналогам GD32, HK32, CH32', weight: 10, type: 'hub' as const, intentMatch: 0.5, conversionProbability: 0.5, entityOverlap: 0.4 },
  { label: 'FPGA / ПЛИС хаб', href: '/fpga-hub', description: 'Авторитетный хаб по ПЛИС: Xilinx, Intel, Gowin, Lattice — аналоги и замена', weight: 10, type: 'hub' as const, intentMatch: 0.5, conversionProbability: 0.5, entityOverlap: 0.3 },
  { label: 'Xilinx хаб', href: '/xilinx', description: 'Авторитетный хаб Xilinx: Artix-7, Kintex-7, Zynq — аналоги и миграция', weight: 10, type: 'hub' as const, intentMatch: 0.5, conversionProbability: 0.5, entityOverlap: 0.3 },
  { label: 'Texas Instruments — бренд', href: '/texas-instruments', description: 'Каталог продукции TI, семейства TPS, LM, OPA, MSP430', weight: 10, type: 'brand' as const, intentMatch: 0.8, conversionProbability: 0.5, entityOverlap: 0.7 },
  { label: 'TPS5430 → MP1584', href: '/analog/TPS5430DDAR', description: 'Замена DC-DC стабилизатора TPS5430 на Monolithic Power MP1584', weight: 9, type: 'analog' as const, intentMatch: 1.0, conversionProbability: 0.7, entityOverlap: 0.8 },
  { label: 'LM2596 → XL2596', href: '/analog/LM2596S-5.0', description: 'Pin-to-pin замена Simple Switcher LM2596 на XLSEMI XL2596', weight: 9, type: 'analog' as const, intentMatch: 1.0, conversionProbability: 0.7, entityOverlap: 0.8 },
  { label: 'LM358 → TS358 / MCP6002', href: '/analog/LM358DR', description: 'Аналоги двойного ОУ LM358 от STMicroelectronics и Microchip', weight: 9, type: 'analog' as const, intentMatch: 1.0, conversionProbability: 0.7, entityOverlap: 0.8 },
  { label: 'AMS1117 → RT9193', href: '/analog/AMS1117-3.3', description: 'Замена LDO AMS1117 на Richtek RT9193, Torex XC6206', weight: 8, type: 'analog' as const, intentMatch: 1.0, conversionProbability: 0.7, entityOverlap: 0.8 },
  { label: 'Стабилизаторы напряжения', href: '/stabilizatory', description: 'DC-DC и LDO стабилизаторы всех брендов: подбор и аналоги', weight: 9, type: 'category' as const, intentMatch: 0.9, conversionProbability: 0.6, entityOverlap: 0.9 },
  { label: 'Операционные усилители', href: '/operatsionnye-usiliteli', description: 'Каталог ОУ: LM358, TL072, OPA2134 и аналоги', weight: 8, type: 'category' as const, intentMatch: 0.9, conversionProbability: 0.6, entityOverlap: 0.9 },
  { label: 'АЦП/ЦАП преобразователи', href: '/adc-dac', description: 'Аналого-цифровые и цифро-аналоговые преобразователи', weight: 8, type: 'category' as const, intentMatch: 0.9, conversionProbability: 0.6, entityOverlap: 0.9 },
  { label: 'Подбор аналогов', href: '/analogs', description: 'Кросс-референсы и подбор аналогов для санкционных компонентов', weight: 9, type: 'analog' as const, intentMatch: 1.0, conversionProbability: 0.7, entityOverlap: 0.8 },
  { label: 'Запросить КП', href: '/rfq', description: 'Запрос коммерческого предложения на TI и аналоги', weight: 7, type: 'info' as const, intentMatch: 0.5, conversionProbability: 0.8, entityOverlap: 0.4 },
  { label: 'BOM-комплектация', href: '/bom', description: 'Загрузите BOM — подберём аналоги для всех позиций', weight: 7, type: 'info' as const, intentMatch: 0.5, conversionProbability: 0.8, entityOverlap: 0.4 },
];

// ---------------------------------------------------------------------------
// JSON-LD schemas
// ---------------------------------------------------------------------------

const breadcrumbLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Главная', item: BASE_URL },
    { '@type': 'ListItem', position: 2, name: 'Texas Instruments', item: `${BASE_URL}/ti` },
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
  name: 'Аналоги компонентов Texas Instruments',
  description: 'Кросс-референсы для замены компонентов Texas Instruments на доступные аналоги',
  numberOfItems: crossRefRows.length,
  itemListElement: crossRefRows.map((row, idx) => ({
    '@type': 'ListItem',
    position: idx + 1,
    name: `Замена ${row[0]} на ${row[1]}`,
    url: `${BASE_URL}/analog/${encodeURIComponent(row[0])}`,
  })),
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function TIPage() {
  return (
    <>
      {/* JSON-LD */}
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

      <main className="min-h-screen bg-background text-[#121212]">
        {/* ── Hero ────────────────────────────────────────────────────────── */}
        <section className="pt-28 pb-16 px-4">
          <div className="max-w-7xl mx-auto">
            <nav className="text-sm text-[#757575] mb-6 flex items-center gap-2" aria-label="Хлебные крошки">
              <Link href="/" className="hover:text-primary transition-colors">Главная</Link>
              <span className="text-[#cbcbcb]">/</span>
              <span className="text-[#666]">Texas Instruments</span>
            </nav>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-primary-dark bg-clip-text text-transparent leading-tight">
              Компоненты Texas Instruments: аналоги, замена и поставка для промышленности
            </h1>

            <p className="text-lg text-[#555] max-w-3xl mb-4 leading-relaxed">
              Texas Instruments — один из крупнейших производителей аналоговых и силовых микросхем,
              микроконтроллеров и DSP. В условиях санкционных ограничений на поставки TI критически
              важен подбор доступных аналогов от Monolithic Power, Richtek, XLSEMI, Silergy и других
              производителей с проверкой совместимости в аккредитованной лаборатории СВП.
            </p>

            <div className="flex flex-wrap gap-3 mt-6">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-medium">
                ⚡ DC-DC стабилизаторы
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-medium">
                🔋 LDO стабилизаторы
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-medium">
                📈 Операционные усилители
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-medium">
                🔲 АЦП/ЦАП
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-medium">
                🔧 MSP430
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-medium">
                ⚙️ DSP C2000
              </span>
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
                  Хаб Texas Instruments — исчерпывающий ресурс по замене компонентов TI: DC-DC и LDO стабилизаторы,
                  операционные усилители, АЦП/ЦАП, MSP430 и DSP C2000. Кросс-референсы на Monolithic Power, Richtek,
                  XLSEMI, Silergy верифицированы в лаборатории СВП. Каждый аналог проверен на реальных стендах
                  с измерением параметров и сравнением с даташитом оригинала.
                </p>
              </div>
              <div className="flex flex-wrap gap-3 md:gap-4">
                <div className="text-center px-4 py-2 rounded-lg bg-white border border-[#e8e8e8]">
                  <div className="text-xl font-bold text-primary">6</div>
                  <div className="text-[10px] text-[#757575] uppercase tracking-wide">Категорий TI</div>
                </div>
                <div className="text-center px-4 py-2 rounded-lg bg-white border border-[#e8e8e8]">
                  <div className="text-xl font-bold text-primary">4</div>
                  <div className="text-[10px] text-[#757575] uppercase tracking-wide">Бренда аналогов</div>
                </div>
                <div className="text-center px-4 py-2 rounded-lg bg-white border border-[#e8e8e8]">
                  <div className="text-xl font-bold text-primary">30+</div>
                  <div className="text-[10px] text-[#757575] uppercase tracking-wide">Кросс-референсов</div>
                </div>
                <div className="text-center px-4 py-2 rounded-lg bg-white border border-[#e8e8e8]">
                  <div className="text-xl font-bold text-primary">88</div>
                  <div className="text-[10px] text-[#757575] uppercase tracking-wide">Authority Score</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── AI DirectAnswer ──────────────────────────────────────────────── */}
        <section className="px-4 pb-12">
          <div className="max-w-7xl mx-auto">
            <AiSearchBlock
              type="DirectAnswer"
              question="Чем заменить компоненты Texas Instruments в условиях санкций?"
              answer="Для замены компонентов TI доступны проверенные аналоги: MP1584 (Monolithic Power) для TPS5430 — DC-DC 3А, 4.5–28 В; XL2596 (XLSEMI) для LM2596 — pin-to-pin клон Simple Switcher; RT9193 (Richtek) для TLV1117 — LDO 300 мА в SOT-23; MCP6002 (Microchip) для LM358 — двойной ОУ с питанием от 1.8 В. Все аналоги проверяются в лаборатории СВП на соответствие электрических параметров и оригинальность."
              sources={[
                'https://www.monolithicpower.com',
                'https://www.richtek.com',
                'https://www.xlsemi.com',
              ]}
            />
          </div>
        </section>

        {/* ── TI Product Categories ──────────────────────────────────────── */}
        <section className="px-4 pb-20">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Категории продукции Texas Instruments</h2>
            <p className="text-[#666] mb-10 max-w-3xl">
              Обзор основных категорий компонентов TI с ключевыми параметрами и типовыми применениями.
              Для каждой категории доступны аналоги от других производителей.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tiCategories.map((cat) => (
                <article
                  key={cat.name}
                  className="rounded-xl border border-[#d4ddd2] bg-card p-6 hover:border-primary/30 hover:shadow-lg transition-all group"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-2xl" aria-hidden="true">{cat.icon}</span>
                    <h3 className="text-lg font-bold text-[#121212] group-hover:text-primary transition-colors">
                      {cat.name}
                    </h3>
                  </div>

                  <p className="text-sm text-[#555] leading-relaxed mb-4">
                    {cat.description}
                  </p>

                  {/* Specs */}
                  <div className="bg-background/60 rounded-lg p-3 mb-4 border border-[#e8e8e8]">
                    <dl className="grid grid-cols-2 gap-x-4 gap-y-1.5">
                      {Object.entries(cat.specs).map(([key, val]) => (
                        <div key={key}>
                          <dt className="text-[10px] font-semibold uppercase tracking-wide text-muted">{key}</dt>
                          <dd className="text-xs font-medium text-[#121212]">{val}</dd>
                        </div>
                      ))}
                    </dl>
                  </div>

                  {/* Key parts */}
                  <div className="flex flex-wrap gap-1.5">
                    {cat.parts.map((part) => (
                      <Link
                        key={part}
                        href={`/component/${encodeURIComponent(part)}`}
                        className="text-xs font-mono px-2 py-1 bg-primary/8 text-primary rounded border border-primary/15 hover:bg-primary/15 transition-colors"
                      >
                        {part}
                      </Link>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ── Cross-Reference Table ──────────────────────────────────────── */}
        <section className="px-4 pb-20 bg-section/50">
          <div className="max-w-7xl mx-auto py-20">
            <AiSearchBlock
              type="ComparisonTable"
              title="Кросс-референсы: Texas Instruments → аналоги"
              headers={crossRefHeaders}
              rows={crossRefRows}
              caption="Таблица кросс-референсов для замены компонентов Texas Instruments. Данные проверены инженерами ChipNet."
            />
          </div>
        </section>

        {/* ── Import Substitution Guide ──────────────────────────────────── */}
        <section className="px-4 pb-20">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Руководство по импортозамещению TI</h2>
            <p className="text-[#666] mb-10 max-w-3xl">
              Пошаговый процесс замены компонентов Texas Instruments на доступные аналоги
              с сохранением работоспособности вашего изделия и минимальными изменениями в конструкции.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {substitutionSteps.map((item) => (
                <div
                  key={item.step}
                  className="relative bg-card rounded-xl border border-[#d4ddd2] p-6 hover:border-primary/30 hover:shadow-lg transition-all group"
                >
                  <span className="text-5xl font-bold text-primary/10 group-hover:text-primary/20 transition-colors absolute top-4 right-4">
                    {item.step}
                  </span>
                  <h3 className="text-base font-semibold mb-3 text-[#121212] pr-8">{item.title}</h3>
                  <p className="text-sm text-[#555] leading-relaxed">{item.description}</p>
                </div>
              ))}
            </div>

            {/* Compatibility notes */}
            <div className="mt-10 rounded-xl border-2 border-primary/15 bg-gradient-to-br from-primary/[0.04] to-card p-6">
              <h3 className="text-lg font-bold text-[#121212] mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Важные замечания по совместимости
              </h3>
              <ul className="space-y-3 text-sm text-[#444]">
                <li className="flex items-start gap-2">
                  <svg className="w-4 h-4 mt-0.5 shrink-0 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span><strong>Pin-to-pin аналоги</strong> (XL2596 для LM2596, TS358 для LM358) — минимальные изменения в PCB, достаточно обновить BOM.</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-4 h-4 mt-0.5 shrink-0 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span><strong>Функциональные аналоги</strong> (MP1584 для TPS5430) — требуют переработки обвязки (другая частота, другие внешние компоненты), но электрические параметры аналогичны или лучше.</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-4 h-4 mt-0.5 shrink-0 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span><strong>Близкие аналоги</strong> (MCP6002 для LM358) — совместимы по выводам, но имеют отличия в диапазоне питания или параметрах. Требуется проверка в конкретной схеме.</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-4 h-4 mt-0.5 shrink-0 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Все аналоги проходят <strong>лабораторную верификацию в СВП</strong> — измерение параметров, проверка в схеме, рентген-контроль оригинальности.</span>
                </li>
              </ul>
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
              Компоненты Texas Instruments широко применяются в силовой электронике, измерительных системах и промышленной автоматике. Мы поможем подобрать доступные аналоги для замены unavailable позиций с учётом электрических параметров и корпуса.
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

        {/* ── FAQ ─────────────────────────────────────────────────────────── */}
        <section className="px-4 pb-20 bg-section/50">
          <div className="max-w-4xl mx-auto py-20">
            <h2 className="text-2xl md:text-3xl font-bold mb-12 text-center">
              Часто задаваемые вопросы об аналогах Texas Instruments
            </h2>
            <div className="space-y-4">
              {faqItems.map((item, index) => (
                <details
                  key={index}
                  className="group bg-card rounded-xl border border-[#d4ddd2] overflow-hidden"
                >
                  <summary className="flex items-center justify-between p-6 cursor-pointer hover:bg-[#eaf0e8] transition-colors">
                    <span className="font-semibold text-[#121212] pr-4">{item.question}</span>
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
                  <div className="px-6 pb-6 text-[#555] leading-relaxed text-sm">
                    {item.answer}
                  </div>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* ── Internal Link Grid ──────────────────────────────────────────── */}
        <section className="px-4 pb-20">
          <div className="max-w-7xl mx-auto">
            <InternalLinkGrid
              title="Полезные ссылки по TI и аналогам"
              links={internalLinks}
              columns={3}
            />
          </div>
        </section>

        {/* ── CTA ─────────────────────────────────────────────────────────── */}
        <section className="px-4 pb-20">
          <div className="max-w-4xl mx-auto bg-gradient-to-br from-primary/10 to-primary-dark/5 rounded-2xl border border-primary/30 p-8 md:p-12 text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Запросить КП на TI и аналоги
            </h2>
            <p className="text-[#555] mb-8 max-w-xl mx-auto">
              Отправьте BOM-лист или спецификацию — подберём доступные аналоги для всех позиций
              Texas Instruments, проверим совместимость в лаборатории СВП и подготовим
              коммерческое предложение с гарантией качества.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/rfq"
                className="inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark text-[#121212] font-semibold px-8 py-3.5 rounded-lg transition-colors"
              >
                Запросить коммерческое предложение
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
              <Link
                href="/bom"
                className="inline-flex items-center justify-center gap-2 border border-primary text-primary hover:bg-primary/5 font-medium px-8 py-3.5 rounded-lg transition-colors"
              >
                Загрузить BOM-лист
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

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
  title: 'ПЛИС Xilinx (AMD) — аналоги, замена, импортозамещение | ChipNet',
  description:
    'Аналоги ПЛИС Xilinx Spartan, Artix, Kintex: Gowin Arora, Lattice ECP5, Efinix Trion. Кросс-референсы, миграция проектов, замена EOL. Проверка в СВП.',
  keywords: [
    'Xilinx',
    'ПЛИС Xilinx',
    'аналоги Xilinx',
    'Artix-7 замена',
    'Spartan аналог',
    'Gowin замена Xilinx',
    'импортозамещение Xilinx',
    'Zynq аналог',
  ],
  alternates: {
    canonical: `${BASE_URL}/xilinx`,
  },
  openGraph: {
    title: 'ПЛИС Xilinx (AMD) — аналоги, замена, импортозамещение | ChipNet',
    description:
      'Аналоги ПЛИС Xilinx Spartan, Artix, Kintex: Gowin Arora, Lattice ECP5, Efinix Trion. Кросс-референсы, миграция проектов.',
    url: `${BASE_URL}/xilinx`,
    type: 'website',
    locale: 'ru_RU',
    siteName: 'ChipNet',
  },
};

// ---------------------------------------------------------------------------
// Data: Xilinx-related analog entries from semantic-data
// ---------------------------------------------------------------------------

const xilinxAnalogEntries = analogMap.filter(
  (entry) =>
    entry.original.startsWith('XC7A') ||
    entry.original.startsWith('XC7K') ||
    entry.original.startsWith('XC7S') ||
    entry.original.startsWith('XC6S')
);

// ---------------------------------------------------------------------------
// Data: Xilinx product lines
// ---------------------------------------------------------------------------

const xilinxProductLines = [
  {
    name: 'Spartan-3 / Spartan-6 (EOL)',
    status: 'Сняты с производства',
    statusColor: 'bg-red-100 text-red-700',
    description:
      'Серии Spartan-3 и Spartan-6 — классические бюджетные FPGA от Xilinx, снятые с производства (EOL). Spartan-3 (90 нм, до 74K логических ячеек) и Spartan-6 (45 нм, до 147K логических ячеек, до 4.8 Гбит/с трансиверы). Широко применялись в промышленной автоматике, интерфейсной логике и обработке сигналов. Требуют замены на доступные аналоги.',
    keyParts: ['XC3S200A', 'XC6SLX9-2TQG144C', 'XC6SLX16', 'XC6SLX45'],
    specs: {
      'Логические ячейки': 'до 147K (Spartan-6)',
      'Техпроцесс': '90 нм (S-3), 45 нм (S-6)',
      'Трансиверы': 'до 4.8 Гбит/с (S-6 LXT)',
      'Питание': '1.2 В ядро',
    },
    replacement: 'Gowin GW1N (аналог Spartan-6), Lattice iCE40 (младшие модели)',
    icon: '🔴',
  },
  {
    name: 'Spartan-7',
    status: 'Доступен с ограничениями',
    statusColor: 'bg-amber-100 text-amber-700',
    description:
      'Spartan-7 — самая бюджетная серия 7-го поколения Xilinx на 28 нм. До 23K логических ячеек, компактные корпуса, минимальное энергопотребление. Без трансиверов — ориентирована на простые задачи интерфейсной логики, замены CPLD и расширения I/O. Поставки ограничены санкциями.',
    keyParts: ['XC7S25-1CSGA225C', 'XC7S50-1FGGA484C', 'XC7S15-1CSGA225C'],
    specs: {
      'Логические ячейки': '5 800 – 23 000',
      'DSP-блоки': 'до 60',
      'BRAM': 'до 1 350 Кбит',
      'Трансиверы': 'нет',
    },
    replacement: 'Gowin GW1N-UV4, Lattice iCE40UP5K',
    icon: '🟡',
  },
  {
    name: 'Artix-7',
    status: 'Доступен с ограничениями',
    statusColor: 'bg-amber-100 text-amber-700',
    description:
      'Artix-7 — оптимальное соотношение цены, производительности и энергопотребления среди 7-й серии. До 158K логических ячеек, до 16 трансиверов GTP (6.6 Гбит/с). Основная серия для встраиваемых систем, обработки видео, промышленной автоматики и связи. Поставки в РФ ограничены.',
    keyParts: ['XC7A35T-1FTG256C', 'XC7A100T-1FTG256C', 'XC7A200T-1FBG676C'],
    specs: {
      'Логические ячейки': '15 850 – 158 000',
      'DSP-блоки': 'до 740',
      'BRAM': 'до 8 250 Кбит',
      'Трансиверы': 'до 16 (GTP, 6.6 Гбит/с)',
    },
    replacement: 'Gowin GW2A-18/GW2A-55, Lattice ECP5',
    icon: '🟢',
  },
  {
    name: 'Kintex-7',
    status: 'Доступен с ограничениями',
    statusColor: 'bg-amber-100 text-amber-700',
    description:
      'Kintex-7 — средний класс производительности с трансиверами до 12.5 Гбит/с. До 478K логических ячеек, до 1920 DSP-блоков. Для телекоммуникационного, сетевого, радарного и медицинского оборудования. Критически зависим от санкционных поставок.',
    keyParts: ['XC7K70T-1FBG484C', 'XC7K160T-1FBG484C', 'XC7K325T-1FFG900C'],
    specs: {
      'Логические ячейки': '62 550 – 478 000',
      'DSP-блоки': 'до 1 920',
      'BRAM': 'до 34 380 Кбит',
      'Трансиверы': 'до 36 (GTX, 12.5 Гбит/с)',
    },
    replacement: 'Gowin GW2A-55, Lattice ECP5-G5',
    icon: '🔵',
  },
  {
    name: 'Zynq-7000 / UltraScale+',
    status: 'Доступен с ограничениями',
    statusColor: 'bg-amber-100 text-amber-700',
    description:
      'Zynq — семейство SoC с интегрированным процессором ARM Cortex-A9 (7000) или Cortex-A53/Mali (UltraScale+). Сочетает программную гибкость ARM с аппаратным ускорением FPGA. Применяется в промышленных контроллерах, автомобильной электронике, системах машинного зрения и обработки сигналов.',
    keyParts: ['XC7Z010-1CLG400C', 'XC7Z020-1CLG484C', 'XCZU7EV-2FFVC1156E'],
    specs: {
      'Процессор': 'ARM Cortex-A9 (Z-7000) / A53+R5 (UltraScale+)',
      'Логические ячейки': '28K – 930K',
      'DSP-блоки': 'до 2 520',
      'Трансиверы': 'до 32 (до 32.75 Гбит/с)',
    },
    replacement: 'Lattice ECP5 + внешний ARM SoC, Intel Cyclone V SoC',
    icon: '🟣',
  },
  {
    name: 'Virtex (EOL)',
    status: 'Сняты с производства',
    statusColor: 'bg-red-100 text-red-700',
    description:
      'Серии Virtex-II, Virtex-4, Virtex-5, Virtex-6 и Virtex-7 — флагманские высокопроизводительные FPGA от Xilinx, снятые с производства. Virtex-7 UltraScale достигал 2M логических ячеек и трансиверов до 28.05 Гбит/с. Использовались в радарах, телекоммуникациях и оборудовании ВПК.',
    keyParts: ['XC5VLX50T', 'XC6VLX130T', 'XC7V2000T'],
    specs: {
      'Логические ячейки': 'до 2 000 000 (Virtex-7)',
      'Техпроцесс': 'от 130 нм (Virtex-II) до 28 нм (Virtex-7)',
      'Трансиверы': 'до 96 (до 28.05 Гбит/с)',
      'Питание': '0.9 – 1.0 В ядро',
    },
    replacement: 'Gowin Arora GW5A, Efinix Titanium (для новых проектов)',
    icon: '🔴',
  },
];

// ---------------------------------------------------------------------------
// Data: Cross-reference table rows
// ---------------------------------------------------------------------------

const crossRefHeaders = ['Xilinx компонент', 'Аналог', 'Бренд аналога', 'Совместимость', 'Примечание'];

const crossRefRows: string[][] = xilinxAnalogEntries.flatMap((entry) =>
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
          : rep.compatibility,
    rep.notes.length > 80 ? rep.notes.slice(0, 77) + '...' : rep.notes,
  ])
);

// ---------------------------------------------------------------------------
// Data: Migration guide steps
// ---------------------------------------------------------------------------

const migrationSteps = [
  {
    step: '01',
    title: 'Анализ проекта и подбор аналога',
    description:
      'Анализируем VHDL/Verilog-код, утилизацию ресурсов (LUT, BRAM, DSP), требования к трансиверам и таймингу. Подбираем оптимальную ПЛИС Gowin, Lattice или Efinix по ёмкости и периферии. Формируем матрицу соответствия ресурсов.',
  },
  {
    step: '02',
    title: 'Миграция HDL-кода',
    description:
      'Адаптируем HDL-код для целевой ПЛИС: замена Xilinx-специфичных примитивов (BUFG, MMCME2, OSERDESE2 и др.) на аналоги целевой платформы. Перерабатываем IP-ядра (FIFO, DDR-контроллер, PCIe) на эквиваленты от производителя-аналога.',
  },
  {
    step: '03',
    title: 'Адаптация pinout и PCB',
    description:
      'Разрабатываем новый pinout для целевой ПЛИС с учётом ограничений банков I/O, размещения тактовых входов и трансиверов. Вносим необходимые изменения в PCB (питание, обвязка, разъёмы).',
  },
  {
    step: '04',
    title: 'Синтез и верификация',
    description:
      'Выполняем синтез проекта в САПР целевой ПЛИС (Gowin EDA, Diamond, Efinix Efinity). Проверяем тайминг (STA), утилизацию ресурсов и работоспособность на стенде. Сравниваем результаты с исходным проектом Xilinx.',
  },
  {
    step: '05',
    title: 'Производство и поставка',
    description:
      'Поставляем ПЛИС с подтверждением оригинальности через лабораторию СВП. Сопровождаем запуск серийного производства, при необходимости — доработка проекта и устранение замечаний.',
  },
];

// ---------------------------------------------------------------------------
// Data: FAQ
// ---------------------------------------------------------------------------

const faqItems = [
  {
    question: 'Как заменить Artix-7 (XC7A35T, XC7A100T) на доступные аналоги?',
    answer:
      'Для XC7A35T (33K LUT) оптимальная замена — Gowin GW1N-UV4PQ256C6/I5 (~33K LUT) или Lattice ECP5 LFE5U-45F-BG381 (45K LUT). Для XC7A100T подходит Gowin GW2A-18PQ256C8/I5 (20K LUT) или Lattice LFE5U-85F-BG381C (85K LUT). Во всех случаях требуется перекомпиляция проекта и адаптация pinout — замена не является pin-to-pin. Gowin предоставляет инструменты миграции, а наши инженеры помогают адаптировать HDL-код.',
  },
  {
    question: 'Можно ли заменить Spartan-6 на Gowin GW1N?',
    answer:
      'Да, Gowin GW1N-UV9LQ144C6/I5 — функциональный аналог Spartan-6 XC6SLX9 с сопоставимой ёмкостью (~9K LUT). Преимущества: доступность без санкций, компактные корпуса, бесплатный САПР Gowin EDA. Недостатки: требуется перекомпиляция проекта, адаптация HDL-кода (замена Xilinx-примитивов), переработка PCB под новый pinout. Для младших Spartan-6 также подойдёт Lattice iCE40HX4K, но ёмкость может быть недостаточной для некоторых проектов.',
  },
  {
    question: 'Как заменить Kintex-7 на ПЛИС с трансиверами?',
    answer:
      'Для Kintex-7 XC7K70T оптимальные замены: Gowin GW2A-55PG484C8/I5 (55K LUT, трансиверы 6.6 Гбит/с) или Lattice ECP5-G5 LFE5UM-85F-BG381 (с трансиверами 5 Гбит/с). Для XC7K160T ёмкость Gowin GW2A-55 может быть недостаточной — может потребоваться оптимизация проекта или переход на Gowin Arora GW5A с большей ёмкостью. Мы проводим анализ утилизации ресурсов и помогаем выбрать оптимальную замену.',
  },
  {
    question: 'Есть ли альтернатива Zynq-7000 с ARM-процессором?',
    answer:
      'Прямой pin-to-pin альтернативы Zynq нет — это уникальная архитектура с интегрированным ARM-ядром. Возможные варианты: 1) Intel Cyclone V SoC (5CEFA) — FPGA + ARM Cortex-A9, доступна с ограничениями; 2) Lattice ECP5 + внешний ARM-процессор (i.MX, STM32MP1) — двухчиповое решение с большей гибкостью; 3) Gowin Arora GW5A — для новых проектов с внешним процессором. Мы помогаем оценить трудоёмкость миграции для каждого варианта.',
  },
  {
    question: 'Что делать с EOL-сериями Spartan-3 и Virtex?',
    answer:
      'Spartan-3, Spartan-6, Virtex-II/4/5/6 и Virtex-7 сняты с производства. Для новых проектов рекомендуем: Spartan-3/6 → Gowin GW1N или Lattice iCE40; Virtex-5/6 → Gowin GW2A-55 или Lattice ECP5; Virtex-7 → Gowin Arora GW5A или Efinix Titanium. Для поддержания существующих изделий мы поставляем остаточные партии с проверкой оригинальности в СВП и помогаем спланировать миграцию на доступные ПЛИС.',
  },
  {
    question: 'Какие САПР используются для ПЛИС Gowin, Lattice и Efinix?',
    answer:
      'Gowin — бесплатный САПР Gowin EDA (синтез, P&R, тайминг-анализ), поддерживает Verilog/VHDL, есть IP-менеджер с готовыми ядрами. Lattice — Diamond (бесплатный для ECP5/iCE40) или Lattice Radiant; также доступен открытый инструментарий Yosys+nextpnr для iCE40 и ECP5. Efinix — Efinity (бесплатная лицензия), оптимизирован для семейств Trion и Titanium. Все САПР поддерживают стандартный HDL, что упрощает миграцию проектов Xilinx.',
  },
];

// ---------------------------------------------------------------------------
// Data: Internal links
// ---------------------------------------------------------------------------

const internalLinks = [
  { label: 'FPGA / ПЛИС хаб', href: '/fpga-hub', description: 'Авторитетный хаб по ПЛИС: Xilinx, Intel, Gowin, Lattice — аналоги и замена', weight: 10, type: 'hub' as const, intentMatch: 0.9, conversionProbability: 0.6, entityOverlap: 0.9 },
  { label: 'STM32 хаб', href: '/stm32', description: 'Авторитетный хаб по микроконтроллерам STM32 и аналогам GD32, HK32, CH32', weight: 10, type: 'hub' as const, intentMatch: 0.5, conversionProbability: 0.5, entityOverlap: 0.4 },
  { label: 'Texas Instruments хаб', href: '/ti', description: 'Авторитетный хаб TI: стабилизаторы, ОУ, АЦП/ЦАП — аналоги и кросс-референсы', weight: 10, type: 'hub' as const, intentMatch: 0.5, conversionProbability: 0.5, entityOverlap: 0.3 },
  { label: 'FPGA / ПЛИС — хаб', href: '/fpga', description: 'Обзор всех ПЛИС: Xilinx, Intel, Lattice, Gowin, Efinix', weight: 10, type: 'brand' as const, intentMatch: 0.8, conversionProbability: 0.5, entityOverlap: 0.7 },
  { label: 'Xilinx — бренд', href: '/xilinx', description: 'Каталог продукции Xilinx, все семейства ПЛИС', weight: 10, type: 'brand' as const, intentMatch: 0.8, conversionProbability: 0.5, entityOverlap: 0.7 },
  { label: 'Artix-7 → Gowin GW2A', href: '/analog/XC7A35T-1FTG256C', description: 'Замена Artix-7 на Gowin GW1N/GW2A и Lattice ECP5', weight: 9, type: 'analog' as const, intentMatch: 1.0, conversionProbability: 0.7, entityOverlap: 0.8 },
  { label: 'Kintex-7 → Gowin/Lattice', href: '/analog/XC7K70T-1FBG484C', description: 'Замена Kintex-7 на ПЛИС с трансиверами', weight: 9, type: 'analog' as const, intentMatch: 1.0, conversionProbability: 0.7, entityOverlap: 0.8 },
  { label: 'Spartan-6 → Gowin GW1N', href: '/analog/XC6SLX9-2TQG144C', description: 'Замена EOL Spartan-6 на Gowin GW1N и Lattice iCE40', weight: 9, type: 'analog' as const, intentMatch: 1.0, conversionProbability: 0.7, entityOverlap: 0.8 },
  { label: 'Gowin Semiconductor', href: '/brand/gowin', description: 'ПЛИС Gowin: GW1N, GW2A, Arora — аналоги Xilinx', weight: 8, type: 'brand' as const, intentMatch: 0.8, conversionProbability: 0.5, entityOverlap: 0.7 },
  { label: 'Lattice Semiconductor', href: '/brand/lattice', description: 'ПЛИС Lattice: ECP5, iCE40 — доступны без санкций', weight: 8, type: 'brand' as const, intentMatch: 0.8, conversionProbability: 0.5, entityOverlap: 0.7 },
  { label: 'Подбор аналогов', href: '/analogs', description: 'Кросс-референсы для всех санкционных компонентов', weight: 9, type: 'analog' as const, intentMatch: 1.0, conversionProbability: 0.7, entityOverlap: 0.8 },
  { label: 'Устаревшие компоненты', href: '/obsolete', description: 'EOL-компоненты и рекомендованные замены', weight: 7, type: 'info' as const, intentMatch: 0.5, conversionProbability: 0.8, entityOverlap: 0.4 },
  { label: 'Запросить КП', href: '/rfq', description: 'Запрос коммерческого предложения на Xilinx и аналоги', weight: 7, type: 'info' as const, intentMatch: 0.5, conversionProbability: 0.8, entityOverlap: 0.4 },
];

// ---------------------------------------------------------------------------
// JSON-LD schemas
// ---------------------------------------------------------------------------

const breadcrumbLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Главная', item: BASE_URL },
    { '@type': 'ListItem', position: 2, name: 'FPGA / ПЛИС', item: `${BASE_URL}/fpga` },
    { '@type': 'ListItem', position: 3, name: 'Xilinx', item: `${BASE_URL}/xilinx` },
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
  name: 'Аналоги ПЛИС Xilinx',
  description: 'Кросс-референсы для замены ПЛИС Xilinx на Gowin, Lattice, Efinix',
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

export default function XilinxPage() {
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
              <Link href="/fpga" className="hover:text-primary transition-colors">FPGA / ПЛИС</Link>
              <span className="text-[#cbcbcb]">/</span>
              <span className="text-[#666]">Xilinx</span>
            </nav>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-primary-dark bg-clip-text text-transparent leading-tight">
              ПЛИС Xilinx (AMD): аналоги, замена и импортозамещение
            </h1>

            <p className="text-lg text-[#555] max-w-3xl mb-4 leading-relaxed">
              Xilinx (с 2022 года — часть AMD) — лидер рынка FPGA с линейками Spartan, Artix, Kintex,
              Zynq и Virtex. В условиях санкций поставки ПЛИС Xilinx в РФ ограничены, что делает
              критически важным подбор аналогов от Gowin, Lattice и Efinix с миграцией проектов
              и сохранением функциональности.
            </p>

            <div className="flex flex-wrap gap-3 mt-6">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-medium">
                🔴 Spartan (EOL)
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-medium">
                🟢 Artix-7
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-medium">
                🔵 Kintex-7
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-medium">
                🟣 Zynq
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-medium">
                🔴 Virtex (EOL)
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
                  Хаб Xilinx — наиболее полный русскоязычный ресурс по замене ПЛИС Xilinx (AMD) на доступные
                  альтернативы. Покрывает все серии 7-го поколения (Spartan-7, Artix-7, Kintex-7, Zynq) и EOL-серии
                  (Spartan-3/6, Virtex). Для каждого семейства предоставляем рекомендованные замены Gowin, Lattice, Efinix
                  с оценкой трудоёмкости миграции, основанной на реальных проектах.
                </p>
              </div>
              <div className="flex flex-wrap gap-3 md:gap-4">
                <div className="text-center px-4 py-2 rounded-lg bg-white border border-[#e8e8e8]">
                  <div className="text-xl font-bold text-primary">6</div>
                  <div className="text-[10px] text-[#757575] uppercase tracking-wide">Серий Xilinx</div>
                </div>
                <div className="text-center px-4 py-2 rounded-lg bg-white border border-[#e8e8e8]">
                  <div className="text-xl font-bold text-primary">3</div>
                  <div className="text-[10px] text-[#757575] uppercase tracking-wide">Бренда аналогов</div>
                </div>
                <div className="text-center px-4 py-2 rounded-lg bg-white border border-[#e8e8e8]">
                  <div className="text-xl font-bold text-primary">8+</div>
                  <div className="text-[10px] text-[#757575] uppercase tracking-wide">Кросс-референсов</div>
                </div>
                <div className="text-center px-4 py-2 rounded-lg bg-white border border-[#e8e8e8]">
                  <div className="text-xl font-bold text-primary">92</div>
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
              question="Как заменить ПЛИС Xilinx на доступные аналоги?"
              answer="Для замены Xilinx доступны три основных направления: 1) Gowin GW1N/GW2A — замена Spartan-6/7 и Artix-7, сопоставимая ёмкость, бесплатный САПР Gowin EDA; 2) Lattice ECP5 — замена Artix-7 и Kintex-7 (вариант с трансиверами ECP5-G5), доступна без санкций; 3) Efinix Trion/Titanium — для высокопроизводительных задач, замена Kintex и Virtex. Все варианты требуют перекомпиляции HDL-проекта и адаптации pinout, но обеспечивают сопоставимую функциональность."
              sources={[
                'https://www.gowinsemi.com',
                'https://www.latticesemi.com',
                'https://www.efinix.com',
              ]}
            />
          </div>
        </section>

        {/* ── Xilinx Product Lines ─────────────────────────────────────────── */}
        <section className="px-4 pb-20">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Линейки ПЛИС Xilinx</h2>
            <p className="text-[#666] mb-10 max-w-3xl">
              Обзор семейств ПЛИС Xilinx от бюджетных Spartan до высокопроизводительных Virtex.
              Серии 7-го поколения (Spartan-7, Artix-7, Kintex-7) — наиболее востребованы
              в промышленности и доступны с ограничениями.
            </p>

            <div className="space-y-6">
              {xilinxProductLines.map((line) => (
                <article
                  key={line.name}
                  className="rounded-xl border border-[#d4ddd2] bg-card p-6 hover:border-primary/30 hover:shadow-lg transition-all group"
                >
                  <div className="flex flex-col lg:flex-row gap-6">
                    {/* Left: Info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3 flex-wrap">
                        <span className="text-2xl" aria-hidden="true">{line.icon}</span>
                        <h3 className="text-lg font-bold text-[#121212] group-hover:text-primary transition-colors">
                          {line.name}
                        </h3>
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${line.statusColor}`}>
                          {line.status}
                        </span>
                      </div>

                      <p className="text-sm text-[#555] leading-relaxed mb-4">
                        {line.description}
                      </p>

                      {/* Key parts */}
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {line.keyParts.map((part) => (
                          <Link
                            key={part}
                            href={`/component/${encodeURIComponent(part)}`}
                            className="text-xs font-mono px-2 py-1 bg-primary/8 text-primary rounded border border-primary/15 hover:bg-primary/15 transition-colors"
                          >
                            {part}
                          </Link>
                        ))}
                      </div>
                    </div>

                    {/* Right: Specs + Replacement */}
                    <div className="lg:w-80 shrink-0 space-y-4">
                      {/* Specs */}
                      <div className="bg-background/60 rounded-lg p-3 border border-[#e8e8e8]">
                        <h4 className="text-xs font-semibold uppercase tracking-wide text-muted mb-2">Характеристики</h4>
                        <dl className="grid grid-cols-1 gap-y-1.5">
                          {Object.entries(line.specs).map(([key, val]) => (
                            <div key={key} className="flex justify-between gap-2">
                              <dt className="text-xs text-muted">{key}</dt>
                              <dd className="text-xs font-medium text-[#121212] text-right">{val}</dd>
                            </div>
                          ))}
                        </dl>
                      </div>

                      {/* Replacement */}
                      <div className="bg-primary/[0.06] rounded-lg p-3 border border-primary/15">
                        <h4 className="text-xs font-semibold uppercase tracking-wide text-primary mb-1.5">Рекомендованная замена</h4>
                        <p className="text-xs text-[#444] leading-relaxed">{line.replacement}</p>
                      </div>
                    </div>
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
              title="Кросс-референсы: Xilinx → Gowin / Lattice / Efinix"
              headers={crossRefHeaders}
              rows={crossRefRows}
              caption="Таблица кросс-референсов для замены ПЛИС Xilinx на доступные аналоги. Данные проверены инженерами ChipNet."
            />
          </div>
        </section>

        {/* ── Migration Guide: Xilinx → Gowin ─────────────────────────────── */}
        <section className="px-4 pb-20">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Миграция проекта: Xilinx → Gowin</h2>
            <p className="text-[#666] mb-10 max-w-3xl">
              Пошаговый процесс миграции HDL-проекта с ПЛИС Xilinx на Gowin — от анализа
              утилизации ресурсов до запуска серийного производства с новой ПЛИС.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {migrationSteps.map((item) => (
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

            {/* Migration tools */}
            <div className="mt-10 rounded-xl border-2 border-primary/15 bg-gradient-to-br from-primary/[0.04] to-card p-6">
              <h3 className="text-lg font-bold text-[#121212] mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
                Инструменты миграции
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-background/60 rounded-lg p-4 border border-[#e8e8e8]">
                  <h4 className="text-sm font-bold text-[#121212] mb-2">Gowin EDA</h4>
                  <p className="text-xs text-[#555] leading-relaxed">
                    Бесплатный САПР для всех ПЛИС Gowin. Синтез, P&R, тайминг-анализ.
                    Поддержка Verilog/VHDL, IP-менеджер с готовыми ядрами (DDR, FIFO, SPI, UART).
                    Автоматическая конвертация XDC → SDC constraints.
                  </p>
                </div>
                <div className="bg-background/60 rounded-lg p-4 border border-[#e8e8e8]">
                  <h4 className="text-sm font-bold text-[#121212] mb-2">Lattice Diamond / Radiant</h4>
                  <p className="text-xs text-[#555] leading-relaxed">
                    САПР для ECP5 и iCE40. Diamond — классическая среда, Radiant — обновлённая.
                    Альтернатива: открытый инструментарий Yosys + nextpnr для iCE40 и ECP5,
                    полностью бесплатный и поддерживаемый сообществом.
                  </p>
                </div>
                <div className="bg-background/60 rounded-lg p-4 border border-[#e8e8e8]">
                  <h4 className="text-sm font-bold text-[#121212] mb-2">Efinix Efinity</h4>
                  <p className="text-xs text-[#555] leading-relaxed">
                    САПР для семейств Trion и Titanium. Оптимизирован для архитектуры Efinix,
                    поддержка Verilog/VHDL, встроенный IP-генератор. Бесплатная лицензия
                    для всех кристаллов семейств Trion и Titanium.
                  </p>
                </div>
              </div>
            </div>

            {/* Key differences */}
            <div className="mt-6 rounded-xl border border-[#d4ddd2] bg-card p-6">
              <h3 className="text-base font-bold text-[#121212] mb-4">Ключевые отличия при миграции Xilinx → Gowin</h3>
              <div className="overflow-x-auto -mx-2 px-2">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="bg-primary/10">
                      <th scope="col" className="px-4 py-2.5 text-left font-semibold text-[#121212] border-b-2 border-primary/30">Аспект</th>
                      <th scope="col" className="px-4 py-2.5 text-left font-semibold text-[#121212] border-b-2 border-primary/30">Xilinx (Vivado)</th>
                      <th scope="col" className="px-4 py-2.5 text-left font-semibold text-[#121212] border-b-2 border-primary/30">Gowin (Gowin EDA)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      ['Примитивы', 'BUFG, MMCME2, OSERDESE2', 'PLL, OSER10, OSER8'],
                      ['Файл ограничений', 'XDC (Tcl-синтаксис)', 'SDC (стандартный Synopsys)'],
                      ['IP-ядра', 'Vivado IP Catalog', 'Gowin IP Core Generator'],
                      ['DDR-контроллер', 'MIG (Memory Interface Gen.)', 'Gowin DDR IP'],
                      ['PCIe', 'Integrated Block for PCIe', 'Gowin PCIe IP'],
                      ['Стоимость САПР', 'От $2 995/год (Webpack — бесплатно)', 'Бесплатно'],
                    ].map((row, i) => (
                      <tr key={i} className={i % 2 === 0 ? 'bg-card' : 'bg-section/50'}>
                        {row.map((cell, ci) => (
                          <td
                            key={ci}
                            className={`px-4 py-2.5 border-b border-[#e8e8e8] ${
                              ci === 0 ? 'font-medium text-[#121212]' : 'text-[#555]'
                            }`}
                          >
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
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
              ПЛИС Xilinx (AMD) — критически важные компоненты для многих проектов. В условиях санкционных ограничений мы предлагаем как оригинальные компоненты через параллельный импорт, так и полную инженерную поддержку миграции на альтернативные платформы.
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
              Часто задаваемые вопросы о замене ПЛИС Xilinx
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
              title="Полезные ссылки по Xilinx и аналогам ПЛИС"
              links={internalLinks}
              columns={3}
            />
          </div>
        </section>

        {/* ── CTA ─────────────────────────────────────────────────────────── */}
        <section className="px-4 pb-20">
          <div className="max-w-4xl mx-auto bg-gradient-to-br from-primary/10 to-primary-dark/5 rounded-2xl border border-primary/30 p-8 md:p-12 text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Запросить КП на Xilinx и аналоги
            </h2>
            <p className="text-[#555] mb-8 max-w-xl mx-auto">
              Отправьте спецификацию или описание проекта — подберём доступные ПЛИС Xilinx
              или аналоги Gowin/Lattice/Efinix, поможем с миграцией проекта и проверим
              все компоненты в лаборатории СВП.
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

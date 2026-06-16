import { Metadata } from 'next';
import Link from 'next/link';
import AiSearchBlock from '@/components/seo/AiSearchBlock';
import InternalLinkGrid from '@/components/seo/InternalLinkGrid';
import JsonLd from '@/components/seo/JsonLd';
import type { InternalLink } from '@/components/seo/InternalLinkGrid';
import { entityNodes, entityEdges, hubPages } from '@/lib/entity-authority-graph';
import { componentClusters, analogMap } from '@/lib/semantic-data';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const BASE_URL = 'https://www.chip-net.ru';
const PAGE_URL = `${BASE_URL}/fpga-hub`;

// ---------------------------------------------------------------------------
// Derived data from entity-authority-graph and semantic-data
// ---------------------------------------------------------------------------

/** FPGA-related entity IDs from the authority graph */
const fpgaEntityIds = new Set([
  'brand-xilinx', 'brand-intel-altera', 'brand-lattice', 'brand-gowin', 'brand-efinix',
  'family-artix-7', 'family-kintex-7', 'family-spartan-7', 'family-zynq',
  'family-cyclone-v', 'family-cyclone-iv', 'family-ecp5', 'family-ice40',
  'cat-fpga',
]);

/** FPGA brand nodes from authority graph, sorted by authority weight */
const fpgaBrandNodes = entityNodes
  .filter((n) => fpgaEntityIds.has(n.id) && n.type === 'brand')
  .sort((a, b) => b.authorityWeight - a.authorityWeight);

/** FPGA family nodes from authority graph */
const fpgaFamilyNodes = entityNodes
  .filter((n) => fpgaEntityIds.has(n.id) && n.type === 'family')
  .sort((a, b) => b.authorityWeight - a.authorityWeight);

/** Replacement edges for FPGA entities */
const fpgaReplaceEdges = entityEdges.filter(
  (e) => fpgaEntityIds.has(e.from) && fpgaEntityIds.has(e.to) &&
    (e.relationship === 'replaces' || e.relationship === 'alternative-to'),
);

/** FPGA hub page from authority graph */
const fpgaHub = hubPages.find((h) => h.slug === 'fpga');

/** FPGA component clusters from semantic data */
const fpgaClusterKeys = ['xc7a', 'xc7k', 'xc7s', '5cefa', 'ep4ce', 'lfe5', 'ice40'];
const fpgaClusters = fpgaClusterKeys
  .filter((k) => k in componentClusters)
  .map((k) => componentClusters[k]);

/** FPGA analog entries from semantic data (originals starting with XC, EP, 5C) */
const fpgaAnalogs = analogMap.filter(
  (a) => a.original.startsWith('XC7') || a.original.startsWith('EP4C') || a.original.startsWith('5CE'),
);

// ---------------------------------------------------------------------------
// Metadata
// ---------------------------------------------------------------------------

export const revalidate = 3600;

export function generateMetadata(): Metadata {
  return {
    title: 'ПЛИС (FPGA) — аналоги Xilinx, Intel/Altera, замена, поставка | ChipNet',
    description:
      'ПЛИС FPGA для промышленности и ВПК. Аналоги Xilinx Spartan/Artix/Kintex и Intel Cyclone от Gowin, Lattice, Efinix. Кросс-референсы, миграция проектов, проверка в СВП.',
    keywords: [
      'FPGA',
      'ПЛИС',
      'аналоги Xilinx',
      'Gowin',
      'Lattice ECP5',
      'Artix-7 аналог',
      'Spartan замена',
      'импортозамещение FPGA',
      'ПЛИС для ВПК',
    ],
    alternates: {
      canonical: PAGE_URL,
    },
    robots: { index: true, follow: true },
    openGraph: {
      title: 'ПЛИС (FPGA) — аналоги Xilinx, Intel/Altera, замена, поставка | ChipNet',
      description:
        'ПЛИС FPGA для промышленности и ВПК. Аналоги Xilinx Spartan/Artix/Kintex и Intel Cyclone от Gowin, Lattice, Efinix. Кросс-референсы, миграция проектов, проверка в СВП.',
      url: PAGE_URL,
      type: 'website',
      locale: 'ru_RU',
      siteName: 'ChipNet',
    },
  };
}

// ---------------------------------------------------------------------------
// Data: FPGA Family Comparison
// ---------------------------------------------------------------------------

const fpgaFamilies = [
  {
    family: 'Artix-7',
    manufacturer: 'Xilinx (AMD)',
    lutLe: '33K–158K LUT',
    transceivers: 'до 16 GTP (6.6 Гбит/с)',
    process: '28 нм',
    availability: 'Санкции',
    badge: 'Санкции',
    badgeColor: 'bg-red-100 text-red-700',
  },
  {
    family: 'Kintex-7',
    manufacturer: 'Xilinx (AMD)',
    lutLe: '63K–478K LUT',
    transceivers: 'до 36 GTX (12.5 Гбит/с)',
    process: '28 нм',
    availability: 'Санкции',
    badge: 'Санкции',
    badgeColor: 'bg-red-100 text-red-700',
  },
  {
    family: 'Spartan-7',
    manufacturer: 'Xilinx (AMD)',
    lutLe: '6K–23K LUT',
    transceivers: 'Нет',
    process: '28 нм',
    availability: 'Санкции',
    badge: 'Санкции',
    badgeColor: 'bg-red-100 text-red-700',
  },
  {
    family: 'Zynq-7000',
    manufacturer: 'Xilinx (AMD)',
    lutLe: '28K–350K LUT',
    transceivers: 'до 16 GTP (6.6 Гбит/с)',
    process: '28 нм',
    availability: 'Санкции',
    badge: 'Санкции',
    badgeColor: 'bg-red-100 text-red-700',
  },
  {
    family: 'Cyclone V',
    manufacturer: 'Intel/Altera',
    lutLe: '25K–301K LE',
    transceivers: 'до 24 (5 Гбит/с)',
    process: '28 нм',
    availability: 'Санкции',
    badge: 'Санкции',
    badgeColor: 'bg-red-100 text-red-700',
  },
  {
    family: 'Cyclone IV',
    manufacturer: 'Intel/Altera',
    lutLe: '6K–150K LE',
    transceivers: 'до 8 (3.125 Гбит/с)',
    process: '60 нм',
    availability: 'Ограничен',
    badge: 'Ограничен',
    badgeColor: 'bg-amber-100 text-amber-700',
  },
  {
    family: 'Cyclone 10',
    manufacturer: 'Intel/Altera',
    lutLe: '10K–280K LE',
    transceivers: 'до 36 (12.5 Гбит/с)',
    process: '20 нм',
    availability: 'Санкции',
    badge: 'Санкции',
    badgeColor: 'bg-red-100 text-red-700',
  },
  {
    family: 'ECP5',
    manufacturer: 'Lattice',
    lutLe: '12K–85K LUT',
    transceivers: 'до 4 (5 Гбит/с)',
    process: '45 нм',
    availability: 'Доступна',
    badge: 'Доступна',
    badgeColor: 'bg-primary/15 text-primary font-bold',
  },
  {
    family: 'iCE40',
    manufacturer: 'Lattice',
    lutLe: '384–8K LUT',
    transceivers: 'Нет',
    process: '40 нм',
    availability: 'Доступна',
    badge: 'Доступна',
    badgeColor: 'bg-primary/15 text-primary font-bold',
  },
  {
    family: 'GW1N',
    manufacturer: 'Gowin',
    lutLe: '1K–9K LUT',
    transceivers: 'Нет',
    process: '55 нм',
    availability: 'Доступна',
    badge: 'Доступна',
    badgeColor: 'bg-primary/15 text-primary font-bold',
  },
  {
    family: 'GW2A',
    manufacturer: 'Gowin',
    lutLe: '18K–55K LUT',
    transceivers: 'до 8 (6.6 Гбит/с)',
    process: '22 нм',
    availability: 'Доступна',
    badge: 'Доступна',
    badgeColor: 'bg-primary/15 text-primary font-bold',
  },
  {
    family: 'Arora',
    manufacturer: 'Gowin',
    lutLe: '16K–118K LUT',
    transceivers: 'до 16 (12.5 Гбит/с)',
    process: '22 нм',
    availability: 'Доступна',
    badge: 'Доступна',
    badgeColor: 'bg-primary/15 text-primary font-bold',
  },
];

// ---------------------------------------------------------------------------
// Data: Cross-Reference Table — Xilinx/Altera → Gowin/Lattice
// ---------------------------------------------------------------------------

const crossRefEntries = [
  {
    original: 'XC7A35T',
    originalFamily: 'Artix-7',
    replacements: [
      { sku: 'GW1N-UV4PQ256C6/I5', brand: 'Gowin', family: 'GW1N', compat: 'Функциональный аналог', notes: '~33K LUT, перекомпиляция + адаптация pinout' },
      { sku: 'LFE5U-45F-BG381', brand: 'Lattice', family: 'ECP5', compat: 'Функциональный аналог', notes: '45K LUT, без санкций, переработка платы' },
    ],
  },
  {
    original: 'XC7A100T',
    originalFamily: 'Artix-7',
    replacements: [
      { sku: 'GW2A-18PQ256C8/I5', brand: 'Gowin', family: 'GW2A', compat: 'Функциональный аналог', notes: '20K LUT, адаптация проекта' },
      { sku: 'LFE5U-85F-BG381C', brand: 'Lattice', family: 'ECP5', compat: 'Функциональный аналог', notes: '85K LUT, без санкций, переработка pinout' },
    ],
  },
  {
    original: 'XC7K70T',
    originalFamily: 'Kintex-7',
    replacements: [
      { sku: 'GW2A-55PG484C8/I5', brand: 'Gowin', family: 'GW2A', compat: 'Функциональный аналог', notes: '55K LUT, трансиверы 6.6 Гбит/с, миграция проекта' },
    ],
  },
  {
    original: 'XC7S25',
    originalFamily: 'Spartan-7',
    replacements: [
      { sku: 'GW1N-UV4LQ144C6/I5', brand: 'Gowin', family: 'GW1N', compat: 'Функциональный аналог', notes: 'Аналог по ёмкости, компактный корпус' },
      { sku: 'ICE40UP5K-SG48', brand: 'Lattice', family: 'iCE40', compat: 'Функциональный аналог', notes: '5K LUT, SPI Flash, без санкций' },
    ],
  },
  {
    original: 'EP4CE6',
    originalFamily: 'Cyclone IV',
    replacements: [
      { sku: 'GW1N-UV4PQ100C6/I5', brand: 'Gowin', family: 'GW1N', compat: 'Функциональный аналог', notes: 'Перекомпиляция и адаптация pinout' },
      { sku: 'LFE5U-12F-BG256C', brand: 'Lattice', family: 'ECP5', compat: 'Функциональный аналог', notes: '12K LUT, без ограничений' },
    ],
  },
  {
    original: '5CEFA2',
    originalFamily: 'Cyclone V',
    replacements: [
      { sku: 'GW2A-18PQ256C8/I5', brand: 'Gowin', family: 'GW2A', compat: 'Функциональный аналог', notes: 'Без ARM-ядра, внешний процессор' },
      { sku: 'LFE5U-25F-BG381C', brand: 'Lattice', family: 'ECP5', compat: 'Функциональный аналог', notes: '25K LUT, без процессорного ядра' },
    ],
  },
];

// ---------------------------------------------------------------------------
// Data: FAQ
// ---------------------------------------------------------------------------

const faqItems = [
  {
    question: 'Какие FPGA доступны в России без санкций?',
    answer: 'Без санкционных ограничений в Россию поставляются FPGA от Lattice (серии ECP5 и iCE40), Gowin Semiconductor (серии GW1N, GW2A, Arora) и Efinix (серии Trion и Titanium). Эти производители не подпадают под экспортные ограничения США и ЕС, что обеспечивает стабильные поставки и предсказуемое ценообразование. Xilinx (AMD) и Intel/Altera официально приостановили прямые поставки, их продукция доступна только через параллельный импорт с повышенными рисками и ценами.',
  },
  {
    question: 'Как заменить Xilinx Artix-7 на Gowin?',
    answer: 'Замена Artix-7 на Gowin GW2A или GW1N — это функциональная аналогия, не pin-to-pin замена. Процесс включает: 1) Выбор кристалла Gowin с сопоставимой ёмкостью LUT (XC7A35T → GW1N-UV4PQ256C6/I5, XC7A100T → GW2A-18PQ256C8/I5); 2) Перекомпиляцию HDL-кода в Gowin EDA; 3) Адаптацию IP-ядер под библиотеку Gowin; 4) Переработку pinout и PCB; 5) Верификацию проекта на стенде. Типовой срок миграции — 4–8 недель для проекта средней сложности.',
  },
  {
    question: 'Совместимы ли Gowin и Xilinx по периферии?',
    answer: 'Gowin и Xilinx не совместимы pin-to-pin, но имеют сопоставимый набор периферийных блоков: DSP-блоки, блочную память (BRAM/BSRAM), PLL, трансиверы. HDL-код на Verilog/VHDL переносится с минимальными изменениями. Основные отличия: имена IP-ядер, параметры PLL, назначение контактов — всё это адаптируется при перекомпиляции проекта в Gowin EDA. С точки зрения функциональности периферия Gowin покрывает большинство типовых применений Xilinx.',
  },
  {
    question: 'Какая FPGA лучше для промышленной автоматики?',
    answer: 'Для промышленной автоматики оптимальны Lattice ECP5 или Gowin GW2A. ECP5 обеспечивает до 85K LUT с трансиверами до 5 Гбит/с — достаточно для управления моторами, обработки сигналов датчиков и реализации промышленных протоколов (EtherCAT, PROFINET). Gowin GW2A предлагает до 55K LUT с трансиверами 6.6 Гбит/с по более доступной цене. Для простых задач управления и интерфейсной логики достаточно Gowin GW1N или Lattice iCE40.',
  },
  {
    question: 'Сколько стоит миграция с Xilinx на Gowin?',
    answer: 'Стоимость миграции зависит от сложности проекта. Перекомпиляция простого проекта (до 10K LUT, без кастомных IP-ядер) — от 200 000 руб. Проект средней сложности (10K–50K LUT, IP-ядра, трансиверы) — от 500 000 руб. Сложный проект (50K+ LUT, высокоскоростные интерфейсы, SoC) — от 1 000 000 руб. В стоимость входят: адаптация HDL-кода, замена IP-ядер, переработка pinout, верификация на стенде. Экономия на компонентах при серийном производстве обычно окупает миграцию за 6–12 месяцев.',
  },
  {
    question: 'Lattice ECP5 или Gowin GW2A — что выбрать?',
    answer: 'Lattice ECP5 — зрелая платформа с развитой экосистемой, открытой инструментальной цепочкой (Yosys/nextpnr), широкой базой проектов и документации. Оптимальна для проектов, где важна стабильность и предсказуемость. Gowin GW2A — более новое решение с лучшим соотношением LUT/цена, более скоростными трансиверами (6.6 vs 5 Гбит/с), но с менее развитой экосистемой. Рекомендуем: ECP5 для ответственных проектов с долгим жизненным циклом, GW2A — для новых проектов, где важна стоимость и производительность трансиверов.',
  },
  {
    question: 'Как проверить оригинальность FPGA?',
    answer: 'Проверка оригинальности FPGA включает: 1) Визуальный контроль маркировки и корпуса под микроскопом; 2) Рентгеновский контроль для выявления re-marking и подделок; 3) Декэпсуляция и анализ кристалла — сравнение структуры с эталонным образцом; 4) Электрические тесты — измерение токов, напряжений, временных параметров; 5) Функциональное тестирование — загрузка конфигурации и проверка работы периферии; 6) Проверка JTAG ID-кода на соответствие даташиту. Наша лаборатория СВП аккредитована для проведения полного цикла проверки.',
  },
  {
    question: 'Возможно ли использование Spartan-6 в новых проектах?',
    answer: 'Spartan-6 официально переведён в статус Not Recommended for New Designs (NRND). Xilinx не рекомендует использование этой серии в новых разработках, хотя компоненты ещё производятся. Для новых проектов рекомендуем Gowin GW1N (аналог по ёмкости и назначению) — доступен без санкций, дешевле и имеет активную дорожную карту развития. Для существующих проектов на Spartan-6 миграция на Gowin GW1N-UV9LQ144C6/I5 является прямой функциональной заменой с перекомпиляцией HDL-кода.',
  },
];

// ---------------------------------------------------------------------------
// Data: Internal links
// ---------------------------------------------------------------------------

const internalLinks: InternalLink[] = [
  { label: 'STM32 хаб', href: '/stm32', description: 'Авторитетный хаб по микроконтроллерам STM32 и аналогам GD32, HK32, CH32', weight: 10, type: 'hub', intentMatch: 0.6, conversionProbability: 0.5, entityOverlap: 0.5 },
  { label: 'Xilinx хаб', href: '/xilinx', description: 'Авторитетный хаб Xilinx: Artix-7, Kintex-7, Zynq — аналоги и миграция', weight: 10, type: 'hub', intentMatch: 0.9, conversionProbability: 0.6, entityOverlap: 0.9 },
  { label: 'Texas Instruments хаб', href: '/ti', description: 'Авторитетный хаб TI: стабилизаторы, ОУ, АЦП/ЦАП — аналоги и кросс-референсы', weight: 10, type: 'hub', intentMatch: 0.5, conversionProbability: 0.5, entityOverlap: 0.3 },
  { label: 'FPGA / ПЛИС', href: '/fpga', description: 'Каталог ПЛИС всех производителей: Xilinx, Intel, Lattice, Gowin, Efinix', weight: 10, type: 'category', intentMatch: 0.9, conversionProbability: 0.6, entityOverlap: 0.9 },
  { label: 'Xilinx хаб', href: '/xilinx-hub', description: 'ПЛИС Xilinx: Artix-7, Kintex-7, Spartan-7, Zynq — аналоги и замена', weight: 9, type: 'category', intentMatch: 0.9, conversionProbability: 0.6, entityOverlap: 0.9 },
  { label: 'Подбор аналогов', href: '/analogs', description: 'Кросс-референсы и подбор аналогов санкционных FPGA и других компонентов', weight: 9, type: 'analog', intentMatch: 1.0, conversionProbability: 0.7, entityOverlap: 0.8 },
  { label: 'Xilinx (AMD)', href: '/brand/xilinx', description: 'Продукция Xilinx: FPGA Artix-7, Kintex-7, Zynq, UltraScale+', weight: 8, type: 'brand', intentMatch: 0.8, conversionProbability: 0.5, entityOverlap: 0.7 },
  { label: 'Lattice Semiconductor', href: '/brand/lattice', description: 'FPGA Lattice: ECP5, iCE40 — доступна без санкций', weight: 8, type: 'brand', intentMatch: 0.8, conversionProbability: 0.5, entityOverlap: 0.7 },
  { label: 'Импорт компонентов', href: '/import-komponentov', description: 'Параллельный импорт электронных компонентов из Азии и Европы', weight: 8, type: 'info', intentMatch: 0.5, conversionProbability: 0.8, entityOverlap: 0.4 },
  { label: 'Intel/Altera', href: '/brand/altera', description: 'FPGA Intel/Altera: Cyclone, Arria, Stratix — аналоги и замена', weight: 7, type: 'brand', intentMatch: 0.8, conversionProbability: 0.5, entityOverlap: 0.7 },
  { label: 'Снятое с производства', href: '/obsolete', description: 'EOL FPGA: Spartan-6, Cyclone II/III — подбор современных аналогов', weight: 7, type: 'category', intentMatch: 0.9, conversionProbability: 0.6, entityOverlap: 0.9 },
  { label: 'Труднодоступные компоненты', href: '/hard-to-find', description: 'Поиск и поставка дефицитных FPGA и микросхем', weight: 7, type: 'category', intentMatch: 0.9, conversionProbability: 0.6, entityOverlap: 0.9 },
  { label: 'BOM-комплектация', href: '/bom', description: 'Комплектация по спецификации: подбор аналогов FPGA, проверка, поставка', weight: 6, type: 'info', intentMatch: 0.5, conversionProbability: 0.8, entityOverlap: 0.4 },
  { label: 'Запрос КП', href: '/rfq', description: 'Запрос коммерческого предложения на ПЛИС и аналоги', weight: 6, type: 'info', intentMatch: 0.5, conversionProbability: 0.8, entityOverlap: 0.4 },
];

// ---------------------------------------------------------------------------
// Data: Import substitution guide steps
// ---------------------------------------------------------------------------

const migrationSteps = [
  {
    step: '01',
    title: 'Анализ проекта',
    icon: (
      <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
      </svg>
    ),
    description: 'Анализ текущего проекта: использование LUT, BRAM, DSP, трансиверов, тактовых частот и IP-ядер. Определение целевого кристалла Gowin/Lattice с сопоставимыми ресурсами.',
    details: ['Подсчёт используемых LUT, FF, BRAM, DSP', 'Инвентаризация IP-ядер (Xilinx PM, MIG, PCIe)', 'Анализ использования трансиверов и скоростей', 'Оценка временных ограничений (timing constraints)'],
  },
  {
    step: '02',
    title: 'Миграция инструментальных средств',
    icon: (
      <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
      </svg>
    ),
    description: 'Переход с Vivado/Quartus на Gowin EDA или Lattice Diamond. Перекомпиляция HDL-кода, адаптация constraint-файлов и скриптов сборки.',
    details: [
      'Vivado → Gowin EDA: полная перекомпиляция Verilog/VHDL',
      'Quartus → Lattice Diamond: адаптация проекта и constraint-файлов',
      'Замена Xilinx/Altera IP-ядер на аналоги Gowin/Lattice',
      'Адаптация SDC-файлов временных ограничений',
    ],
  },
  {
    step: '03',
    title: 'IP-ядра и периферия',
    icon: (
      <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
      </svg>
    ),
    description: 'Замена проприетарных IP-ядер Xilinx/Altera на эквиваленты Gowin/Lattice или открытые реализации. Адаптация интерфейсов периферии.',
    details: [
      'Xilinx PCIe IP → Gowin PCIe IP или открытый core',
      'Xilinx MIG (DDR) → Gowin DDR IP',
      'Altera PLL/Transceiver → аналоги Lattice/Gowin',
      'Кастомные IP-ядра — ручная адаптация или open-source',
    ],
  },
  {
    step: '04',
    title: 'Переработка PCB',
    icon: (
      <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
      </svg>
    ),
    description: 'Gowin/Lattice FPGA не совместимы pin-to-pin с Xilinx/Altera. Требуется переработка разводки PCB под новый корпус и назначение контактов.',
    details: [
      'Назначение контактов Gowin/Lattice (pinout planner)',
      'Адаптация цепей питания (отличия в потреблении)',
      'Переработка обвязки тактовых генераторов и JTAG',
      'Разводка трансиверов с учётом требований нового чипа',
    ],
  },
  {
    step: '05',
    title: 'Верификация и тестирование',
    icon: (
      <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    description: 'Функциональная верификация мигрированного проекта на стенде: проверка временных параметров, тестирование интерфейсов, подтверждение работоспособности в реальных условиях.',
    details: [
      'Static timing analysis (STA) — закрытие timing constraints',
      'Тестирование трансиверов на целевых скоростях',
      'Проверка работы DDR-контроллера и внешних интерфейсов',
      'Климатические испытания (−40...+85°C)',
    ],
  },
];

// ---------------------------------------------------------------------------
// Data: Migration timeline
// ---------------------------------------------------------------------------

const migrationTimeline = [
  { complexity: 'Простой проект', lutRange: 'до 10K LUT', time: '2–4 недели', risk: 'Низкий', riskColor: 'bg-primary/15 text-primary' },
  { complexity: 'Средний проект', lutRange: '10K–50K LUT', time: '4–8 недель', risk: 'Средний', riskColor: 'bg-amber-100 text-amber-700' },
  { complexity: 'Сложный проект', lutRange: '50K+ LUT / трансиверы', time: '8–16 недель', risk: 'Высокий', riskColor: 'bg-red-100 text-red-700' },
];

// ---------------------------------------------------------------------------
// JSON-LD schemas
// ---------------------------------------------------------------------------

const breadcrumbLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Главная', item: BASE_URL },
    { '@type': 'ListItem', position: 2, name: 'ПЛИС (FPGA)', item: `${BASE_URL}/fpga` },
    { '@type': 'ListItem', position: 3, name: 'FPGA Хаб', item: PAGE_URL },
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
  name: 'Семейства ПЛИС (FPGA) для промышленности и ВПК',
  itemListElement: fpgaFamilies.map((f, idx) => ({
    '@type': 'ListItem',
    position: idx + 1,
    name: f.family,
    description: `${f.manufacturer}, ${f.lutLe}, трансиверы: ${f.transceivers}, техпроцесс: ${f.process}, доступность в РФ: ${f.availability}`,
    url: `${BASE_URL}/catalog?search=${encodeURIComponent(f.family)}`,
  })),
};

const productLds = crossRefEntries.slice(0, 4).map((entry) => ({
  '@context': 'https://schema.org',
  '@type': 'Product',
  name: entry.original,
  description: `ПЛИС ${entry.original} (${entry.originalFamily}) и аналоги для импортозамещения: ${entry.replacements.map((r) => r.sku).join(', ')}`,
  brand: {
    '@type': 'Brand',
    name: entry.originalFamily.includes('Cyclone') ? 'Intel/Altera' : 'Xilinx',
  },
  sku: entry.original,
  offers: {
    '@type': 'Offer',
    availability: 'https://schema.org/LimitedAvailability',
    seller: {
      '@type': 'Organization',
      name: 'ChipNet',
    },
  },
  isSimilarTo: entry.replacements.map((alt) => ({
    '@type': 'Product',
    name: alt.sku,
    brand: { '@type': 'Brand', name: alt.brand },
    description: alt.compat,
  })),
}));

// ---------------------------------------------------------------------------
// Helper: Availability badge color
// ---------------------------------------------------------------------------

function availBadge(color: string) {
  return color;
}

// ---------------------------------------------------------------------------
// Page component
// ---------------------------------------------------------------------------

export default function FpgaHubPage() {
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
              <Link href="/fpga" className="hover:text-primary transition-colors">ПЛИС (FPGA)</Link>
              <span className="text-[#cbcbcb]">/</span>
              <span className="text-[#555] font-medium">FPGA Хаб</span>
            </nav>

            {/* Badge */}
            <div className="mb-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                Критическая важность
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-primary-dark bg-clip-text text-transparent leading-tight">
              ПЛИС (FPGA): выбор, аналоги и импортозамещение для промышленности и ВПК
            </h1>

            <p className="text-base sm:text-lg text-[#555] max-w-3xl leading-relaxed">
              ПЛИС (FPGA) — критически важный компонент для систем промышленной автоматики, связи,
              радарных комплексов и оборонной промышленности. В условиях санкционных ограничений на поставки
              <strong className="text-[#121212]"> Xilinx (AMD)</strong> и
              <strong className="text-[#121212]"> Intel/Altera</strong>, компания ChipNet предлагает
              полномасштабное импортозамещение: <strong className="text-[#121212]">Gowin Semiconductor</strong>,
              <strong className="text-[#121212]"> Lattice</strong> и
              <strong className="text-[#121212]"> Efinix</strong> —
              доступные без ограничений, с поддержкой миграции проектов и проверкой в аккредитованной лаборатории СВП.
            </p>

            {/* Quick stats — derived from authority graph */}
            <div className="mt-8 flex flex-wrap gap-3">
              {[
                { label: 'Семейств FPGA', value: `${fpgaFamilyNodes.length}+` },
                { label: 'Кросс-референсов', value: `${fpgaAnalogs.length + fpgaReplaceEdges.length}+` },
                { label: 'Брендов в графе', value: `${fpgaBrandNodes.length}` },
                { label: 'Authority score', value: `${fpgaHub?.authorityScore ?? 95}` },
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
                  Хаб FPGA охватывает все семейства программируемой логики — от санкционных Xilinx и Intel/Altera
                  до доступных Gowin, Lattice и Efinix. Кросс-референсы проверены инженерами на реальных проектах
                  миграции, сроки и стоимость адаптации основаны на выполненных проектах. Хаб является
                  первичным входом для всех FPGA-запросов в России.
                </p>
              </div>
              <div className="flex flex-wrap gap-3 md:gap-4">
                <div className="text-center px-4 py-2 rounded-lg bg-white border border-[#e8e8e8]">
                  <div className="text-xl font-bold text-primary">12</div>
                  <div className="text-[10px] text-[#757575] uppercase tracking-wide">Семейств FPGA</div>
                </div>
                <div className="text-center px-4 py-2 rounded-lg bg-white border border-[#e8e8e8]">
                  <div className="text-xl font-bold text-primary">5</div>
                  <div className="text-[10px] text-[#757575] uppercase tracking-wide">Брендов ПЛИС</div>
                </div>
                <div className="text-center px-4 py-2 rounded-lg bg-white border border-[#e8e8e8]">
                  <div className="text-xl font-bold text-primary">6+</div>
                  <div className="text-[10px] text-[#757575] uppercase tracking-wide">Кросс-референсов</div>
                </div>
                <div className="text-center px-4 py-2 rounded-lg bg-white border border-[#e8e8e8]">
                  <div className="text-xl font-bold text-primary">95</div>
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
              question="Какие аналоги Xilinx и Intel/Altera FPGA доступны?"
              answer="В России доступны три основных производителя FPGA для замены Xilinx и Intel/Altera. Gowin Semiconductor — серии Arora, GW1N и GW2A, прямая замена Spartan/Artix по функциональности с трансиверами до 12.5 Гбит/с. Lattice — серии ECP5 (до 85K LUT) и iCE40 (до 8K LUT), доступна без санкций, развитая экосистема с открытым инструментараем. Efinix — серии Trion и Titanium, высокопроизводительная альтернатива для задач цифровой обработки сигналов и видеообработки. Все три производителя обеспечивают стабильные поставки без экспортных ограничений."
              sources={[`${BASE_URL}/analogs`, `${BASE_URL}/brand/lattice`, `${BASE_URL}/import-komponentov`]}
            />
          </div>
        </section>

        {/* ─── 3. FPGA Family Comparison Table ──────────────────────────── */}
        <section className="px-4 py-16 bg-[#f0f4ee]" aria-labelledby="families-heading">
          <div className="max-w-7xl mx-auto">
            <h2
              id="families-heading"
              className="text-2xl sm:text-3xl font-bold mb-3 text-[#121212]"
            >
              Сравнение семейств ПЛИС (FPGA)
            </h2>
            <p className="text-[#555] mb-8 max-w-3xl">
              Основные семейства FPGA от Xilinx, Intel/Altera, Lattice и Gowin с указанием
              ключевых параметров и доступности в России. Санкционные серии выделены красным,
              доступные без ограничений — зелёным.
            </p>

            {/* Comparison table using AiSearchBlock */}
            <div className="mb-10">
              <AiSearchBlock
                type="ComparisonTable"
                title="Семейства FPGA: сравнение параметров и доступности в РФ"
                headers={['Семейство', 'Производитель', 'LUT/LE', 'Трансиверы', 'Техпроцесс', 'Доступность в РФ']}
                rows={fpgaFamilies.map((f) => [
                  f.family,
                  f.manufacturer,
                  f.lutLe,
                  f.transceivers,
                  f.process,
                  f.availability,
                ])}
                caption="Сравнение основных семейств ПЛИС (FPGA). Красным — санкционные серии, зелёным — доступные без ограничений"
              />
            </div>

            {/* Family cards with availability badges */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {fpgaFamilies.map((f) => (
                <div
                  key={f.family}
                  className={`rounded-xl border p-5 transition-all hover:shadow-md ${
                    f.availability === 'Доступна'
                      ? 'bg-gradient-to-br from-primary/[0.06] to-white border-primary/30 ring-1 ring-primary/10'
                      : 'bg-white border-[#d4ddd2] hover:border-primary/20'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-bold text-[#121212]">{f.family}</h3>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wide ${availBadge(f.badgeColor)}`}>
                      {f.badge}
                    </span>
                  </div>
                  <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                    <dt className="text-[#757575]">Производитель</dt>
                    <dd className="font-medium text-[#121212]">{f.manufacturer}</dd>
                    <dt className="text-[#757575]">Ёмкость</dt>
                    <dd className="font-medium text-[#121212]">{f.lutLe}</dd>
                    <dt className="text-[#757575]">Техпроцесс</dt>
                    <dd className="font-medium text-[#121212]">{f.process}</dd>
                  </dl>
                  <p className="mt-3 text-xs text-[#757575]">{f.transceivers}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── 4. Cross-Reference Table ─────────────────────────────────── */}
        <section className="px-4 py-16 bg-background" aria-labelledby="xref-heading">
          <div className="max-w-7xl mx-auto">
            <h2
              id="xref-heading"
              className="text-2xl sm:text-3xl font-bold mb-3 text-[#121212]"
            >
              Кросс-референсы: Xilinx/Altera → Gowin/Lattice
            </h2>
            <p className="text-[#555] mb-8 max-w-3xl">
              Таблица прямой замены санкционных FPGA Xilinx и Intel/Altera на доступные аналоги
              Gowin Semiconductor и Lattice. Все кросс-референсы проверены инженерами ChipNet.
            </p>

            <div className="overflow-x-auto rounded-xl border border-[#d4ddd2] shadow-sm">
              <table className="w-full text-sm border-collapse">
                <caption className="sr-only">
                  Кросс-референсы аналогов ПЛИС Xilinx/Altera → Gowin/Lattice
                </caption>
                <thead>
                  <tr className="bg-primary/10">
                    <th scope="col" className="px-4 py-3 text-left font-semibold text-[#121212] border-b-2 border-primary/30 whitespace-nowrap">
                      Оригинал
                    </th>
                    <th scope="col" className="px-4 py-3 text-left font-semibold text-[#121212] border-b-2 border-primary/30 whitespace-nowrap">
                      Семейство
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
                  {crossRefEntries.map((entry) =>
                    entry.replacements.map((alt, ai) => (
                      <tr
                        key={`${entry.original}-${alt.sku}`}
                        className="border-b border-[#e8e8e8] hover:bg-[#f0f4ee]/60 transition-colors"
                      >
                        {ai === 0 && (
                          <td
                            className="px-4 py-3 font-mono font-semibold text-primary whitespace-nowrap align-top"
                            rowSpan={entry.replacements.length}
                          >
                            <Link
                              href={`/catalog?search=${encodeURIComponent(entry.original)}`}
                              className="hover:underline"
                            >
                              {entry.original}
                            </Link>
                          </td>
                        )}
                        {ai === 0 && (
                          <td
                            className="px-4 py-3 text-[#555] whitespace-nowrap align-top"
                            rowSpan={entry.replacements.length}
                          >
                            {entry.originalFamily}
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
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wide bg-sky-100 text-sky-700">
                            Функциональный
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
              Совместимость подтверждена инженерами ChipNet на основе данных авторитетного графа
              ({fpgaReplaceEdges.length} рёбер замены) и семантических кластеров ({fpgaClusters.length} кластеров).
              FPGA не являются pin-to-pin совместимыми — требуется перекомпиляция проекта и переработка PCB.
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
              Миграция с Xilinx/Altera на Gowin и Lattice
            </h2>
            <p className="text-[#555] mb-8 max-w-3xl">
              Пошаговое руководство по замене санкционных FPGA на доступные аналоги
              для обеспечения непрерывности производства в условиях санкционных ограничений.
            </p>

            {/* AiSummaryBox with key points */}
            <div className="mb-10">
              <AiSearchBlock
                type="AiSummaryBox"
                title="Ключевые принципы миграции FPGA"
                summary="Замена Xilinx/Altera на Gowin/Lattice — это функциональная аналогия, не pin-to-pin замена. Проект требует перекомпиляции HDL-кода, адаптации IP-ядер и переработки PCB. Основные риски связаны с отличиями в наборах IP-ядер, параметрах трансиверов и требованиях к обвязке. При правильном планировании миграция занимает 4–8 недель для проекта средней сложности."
                keyPoints={[
                  'Gowin Arora — прямая замена Artix-7/Kintex-7: сопоставимая ёмкость LUT, трансиверы до 12.5 Гбит/с',
                  'Lattice ECP5 — проверенная альтернатива Cyclone IV/V: доступна без санкций, открытый инструментарий',
                  'HDL-код (Verilog/VHDL) переносится с минимальными изменениями — основной объём работы приходится на IP-ядра',
                  'Обязательна переработка PCB: Gowin/Lattice не совместимы pin-to-pin с Xilinx/Altera',
                  'Экономия на компонентах при серийном производстве окупает миграцию за 6–12 месяцев',
                ]}
              />
            </div>

            {/* Migration steps */}
            <div className="space-y-6">
              {migrationSteps.map((step) => (
                <div
                  key={step.step}
                  className="rounded-xl border border-[#d4ddd2] bg-white p-6 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start gap-4">
                    <div className="shrink-0 w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                      {step.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-xs font-bold text-primary/50 tracking-wider uppercase">Шаг {step.step}</span>
                        <h3 className="text-lg font-bold text-[#121212]">{step.title}</h3>
                      </div>
                      <p className="text-sm text-[#555] leading-relaxed mb-4">
                        {step.description}
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {step.details.map((detail, i) => (
                          <div key={i} className="flex items-start gap-2 text-sm text-[#444]">
                            <svg className="w-4 h-4 mt-0.5 shrink-0 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <span>{detail}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Timeline and risk assessment */}
            <div className="mt-10">
              <h3 className="text-xl font-bold text-[#121212] mb-4">Сроки и оценка рисков</h3>
              <div className="overflow-x-auto rounded-xl border border-[#d4ddd2] shadow-sm">
                <table className="w-full text-sm border-collapse">
                  <caption className="sr-only">
                    Сроки и оценка рисков миграции FPGA проектов
                  </caption>
                  <thead>
                    <tr className="bg-primary/10">
                      <th scope="col" className="px-4 py-3 text-left font-semibold text-[#121212] border-b-2 border-primary/30">
                        Сложность проекта
                      </th>
                      <th scope="col" className="px-4 py-3 text-left font-semibold text-[#121212] border-b-2 border-primary/30">
                        Ёмкость LUT
                      </th>
                      <th scope="col" className="px-4 py-3 text-left font-semibold text-[#121212] border-b-2 border-primary/30">
                        Срок миграции
                      </th>
                      <th scope="col" className="px-4 py-3 text-left font-semibold text-[#121212] border-b-2 border-primary/30">
                        Уровень риска
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {migrationTimeline.map((row, i) => (
                      <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-[#f0f4ee]/50'}>
                        <td className="px-4 py-3 font-medium text-[#121212]">{row.complexity}</td>
                        <td className="px-4 py-3 text-[#555]">{row.lutRange}</td>
                        <td className="px-4 py-3 text-[#121212] font-medium">{row.time}</td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wide ${row.riskColor}`}>
                            {row.risk}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* QuickFacts */}
            <div className="mt-10">
              <AiSearchBlock
                type="QuickFacts"
                facts={[
                  { label: 'Инструмент Xilinx', value: 'Vivado → Gowin EDA' },
                  { label: 'Инструмент Altera', value: 'Quartus → Lattice Diamond' },
                  { label: 'Совместимость PCB', value: 'Не pin-to-pin, переработка обязательна' },
                  { label: 'HDL-код', value: 'Verilog/VHDL — минимальные изменения' },
                  { label: 'IP-ядра', value: 'Замена на аналоги Gowin/Lattice' },
                  { label: 'Окупаемость', value: '6–12 месяцев при серии' },
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
              ПЛИС/FPGA требуют особенно внимательного подхода к подбору аналогов из-за различий в архитектуре и инструментальных цепочках. Наши инженеры помогут подобрать замены с учётом ресурсной совместимости, миграции проекта и сроков поставки.
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

        {/* ─── 6. FAQ ───────────────────────────────────────────────────── */}
        <section className="px-4 py-16 bg-section-accent/30" aria-labelledby="faq-heading">
          <div className="max-w-4xl mx-auto">
            <h2
              id="faq-heading"
              className="text-2xl sm:text-3xl font-bold mb-12 text-center text-[#121212]"
            >
              Часто задаваемые вопросы о ПЛИС (FPGA)
            </h2>
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
                      aria-hidden="true"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </summary>
                  <div className="px-6 pb-6 text-[#555] leading-relaxed">{item.answer}</div>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* ─── 7. Internal Link Grid ────────────────────────────────────── */}
        <section className="px-4 py-16 bg-background">
          <div className="max-w-7xl mx-auto">
            <InternalLinkGrid
              title="Связанные разделы"
              links={internalLinks}
              columns={3}
            />
          </div>
        </section>

        {/* ─── 8. CTA ───────────────────────────────────────────────────── */}
        <section className="px-4 pb-20">
          <div className="max-w-4xl mx-auto bg-gradient-to-br from-primary/10 to-primary-dark/5 rounded-2xl border border-emerald-800/30 p-8 md:p-12 text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Запросить КП на ПЛИС и аналоги
            </h2>
            <p className="text-[#666] mb-8 max-w-xl mx-auto">
              Отправьте спецификацию или BOM-лист — подберём доступные аналоги FPGA,
              оценим миграцию проекта, проверим совместимость в лаборатории СВП
              и подготовим коммерческое предложение.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/rfq"
                className="inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark text-[#121212] font-medium px-8 py-3 rounded-lg transition-colors"
              >
                Запросить коммерческое предложение
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
              <Link
                href="/bom"
                className="inline-flex items-center justify-center gap-2 border border-primary text-primary hover:bg-primary/5 font-medium px-8 py-3 rounded-lg transition-colors"
              >
                Отправить BOM-лист
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

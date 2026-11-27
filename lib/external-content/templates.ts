/**
 * External Authority Content Templates
 * Ready-to-publish content for Habr, VC.ru, Reddit, LinkedIn, electronics forums
 * Goal: obtain entity mentions and topical backlinks to chip-net.ru
 */

export interface ExternalContentTemplate {
  platform: string;
  title: string;
  outline: string[];
  targetUrl: string;
  targetKeywords: string[];
  content: string;
}

export const externalContentTemplates: ExternalContentTemplate[] = [
  // ═══════════════════════════════════════
  // HABR — Technical deep-dive articles
  // ═══════════════════════════════════════
  {
    platform: 'Habr',
    title: 'Миграция с Xilinx Spartan-6 на Gowin Arora: практический опыт замены FPGA в санкционных условиях',
    outline: [
      'Введение: почему Spartan-6 больше не доступен',
      'Сравнение ресурсов Spartan-6 XC6SLX9 и Gowin GW2A-18',
      'Таблица совместимости периферийных блоков',
      'Пошаговая инструкция миграции проекта',
      'Адаптация Verilog-кода: что меняется',
      'Переназначение пинов и переработка PCB',
      'Результаты: производительность, задержки, совместимость',
      'Выводы и рекомендации для инженеров',
    ],
    targetUrl: 'https://www.chip-net.ru/fpga',
    targetKeywords: ['аналог Xilinx', 'замена FPGA', 'Gowin Arora', 'Spartan-6 миграция', 'FPGA импортозамещение'],
    content: `Статья для Habr объёмом 3000-5000 слов. Техническая глубина: сравнение LUT-ресурсов, DSP-блоков, BRAM. Практические примеры миграции Verilog-кода. Скриншоты Gowin EDA. Таблицы таймингов. Ссылка на chip-net.ru/fpga как источник кросс-референсов и поставки Gowin FPGA.`,
  },
  {
    platform: 'Habr',
    title: 'STM32 → GD32: полный кросс-референс для замены микроконтроллеров в промышленных проектах',
    outline: [
      'Контекст: санкции на STMicroelectronics и доступность STM32',
      'Сравнительная таблица STM32F1/F4 vs GD32F1/F4',
      'Совместимость на уровне регистров и периферии',
      'Известные различия и подводные камни',
      'Проверка совместимости в лаборатории: методология',
      'Рекомендации по переходу для серийного производства',
    ],
    targetUrl: 'https://www.chip-net.ru/arm-kontrollery',
    targetKeywords: ['аналог STM32', 'GD32', 'замена микроконтроллера', 'кросс-референс STM32', 'импортозамещение MCU'],
    content: `Статья для Habr объёмом 2500-4000 слов. Фокус на инженерной экспертизе. Регистровые карты, тесты на стенде. Ссылка на chip-net.ru/arm-kontrollery как источник поставки GD32 и кросс-референсов.`,
  },
  {
    platform: 'Habr',
    title: 'Дефицит электронных компонентов 2025-2026: что доступно, чем заменить, как обеспечить производство',
    outline: [
      'Обзор рынка: какие серии в дефиците',
      'STM32: текущая доступность и альтернативы',
      'FPGA: Xilinx/Altera vs Gowin/Lattice/Efinix',
      'Texas Instruments: LDO, ОУ, DC-DC — замены',
      'Стратегии обеспечения производства: буферизация, last-time buy, аналоги',
      'Проверка оригинальности: методы и лаборатории',
    ],
    targetUrl: 'https://www.chip-net.ru/importozameshchenie',
    targetKeywords: ['дефицит компонентов', 'аналоги микросхем', 'поставка чипов', 'импортозамещение 2025'],
    content: `Аналитическая статья для Habr объёмом 4000-6000 слов. Рыночные данные, графики доступности. Ссылка на chip-net.ru/importozameshchenie как платформу для подбора аналогов и поставки.`,
  },

  // ═══════════════════════════════════════
  // VC.RU — Business/procurement analytics
  // ═══════════════════════════════════════
  {
    platform: 'VC.ru',
    title: 'Как обеспечить производство электроникой в условиях санкций: опыт B2B-поставщика компонентов',
    outline: [
      'Проблема: почему OEM-производители теряют поставки',
      'Рынок серых поставок: риски и как их минимизировать',
      'Аналоги vs оригиналы: экономика замены',
      'BOM-комплектация: как снизить зависимость от одного поставщика',
      'Лабораторная проверка: зачем и как проверять компоненты',
      'Кейсы: реальные проекты по импортозамещению',
    ],
    targetUrl: 'https://www.chip-net.ru/bom',
    targetKeywords: ['B2B поставка компонентов', 'BOM комплектация', 'импортозамещение электроники', 'поставка микросхем'],
    content: `Бизнес-статья для VC.ru объёмом 2000-3000 слов. Фокус на экономике, рисках, кейсах. Цитаты инженеров. Ссылка на chip-net.ru/bom как решение для BOM-комплектации.`,
  },
  {
    platform: 'VC.ru',
    title: 'Рынок электронных компонентов 2026: прогнозы доступности STM32, FPGA и аналогов',
    outline: [
      'Текущее состояние рынка: тренды и прогнозы',
      'STM32: доступность по сериям (F0/F1/F4/H7/L4)',
      'FPGA: Xilinx vs Gowin vs Lattice — что доступно',
      'Texas Instruments: LDO и DC-DC — стабильность поставок',
      'Рекомендации для производственных компаний',
      'Как подготовить BOM к санкционным рискам',
    ],
    targetUrl: 'https://www.chip-net.ru/obsolete',
    targetKeywords: ['рынок компонентов 2026', 'доступность STM32', 'поставка FPGA', 'дефицит микросхем'],
    content: `Аналитическая статья для VC.ru объёмом 2000-3000 слов. Рыночные данные, прогнозы. Ссылка на chip-net.ru как источник актуальной информации о доступности.`,
  },

  // ═══════════════════════════════════════
  // REDDIT — Community engagement
  // ═══════════════════════════════════════
  {
    platform: 'Reddit (r/electronics, r/FPGA, r/Embedded)',
    title: 'Comprehensive cross-reference guide: STM32 to GD32/HK32 replacement (pin-to-pin compatibility table)',
    outline: [
      'Context: why STM32 replacement is needed',
      'GD32F103 vs STM32F103: register-level comparison',
      'Known differences and gotchas',
      'Testing methodology in accredited lab',
      'Availability and sourcing from Asia',
    ],
    targetUrl: 'https://www.chip-net.ru/analogs',
    targetKeywords: ['STM32 alternative', 'GD32 cross-reference', 'ARM MCU replacement', 'pin-compatible MCU'],
    content: `Reddit post 500-800 words. Technical and community-friendly. Link to chip-net.ru/analogs as cross-reference resource. No marketing language — pure technical value.`,
  },
  {
    platform: 'Reddit (r/FPGA)',
    title: 'Xilinx Spartan-6 EOL replacement: Gowin Arora GW2A migration guide with performance benchmarks',
    outline: [
      'Spartan-6 EOL timeline',
      'GW2A-18 resource comparison',
      'HDL migration steps',
      'Performance benchmarks (timing, power)',
      'Where to source Gowin FPGAs',
    ],
    targetUrl: 'https://www.chip-net.ru/fpga',
    targetKeywords: ['Xilinx replacement', 'Gowin FPGA', 'Spartan-6 alternative', 'FPGA migration'],
    content: `Reddit post 500-800 words. Technical focus with benchmarks. Link to chip-net.ru/fpga for sourcing and cross-references.`,
  },

  // ═══════════════════════════════════════
  // LINKEDIN — Professional network
  // ═══════════════════════════════════════
  {
    platform: 'LinkedIn',
    title: 'Обеспечение производства электроникой: как закрыть BOM в 2026 году',
    outline: [
      'Проблема доступности компонентов',
      'Стратегия: аналоги, буферизация, diversified sourcing',
      'Роль лабораторной проверки',
      'Практический опыт BOM-комплектации на 200+ позиций',
    ],
    targetUrl: 'https://www.chip-net.ru/bom',
    targetKeywords: ['BOM комплектация', 'электронные компоненты', 'поставка микросхем', 'производство электроники'],
    content: `LinkedIn post 300-500 words. Professional tone, industry insights. Link to chip-net.ru/bom.`,
  },

  // ═══════════════════════════════════════
  // ENGINEERING FORUMS
  // ═══════════════════════════════════════
  {
    platform: 'Electronics forums (eevblog, cxem.net, radiokot)',
    title: 'Таблица кросс-референсов: STM32→GD32, Xilinx→Gowin, TI→Richtek — проверенные замены',
    outline: [
      'Актуальность кросс-референсов в текущих условиях',
      'Таблица совместимости STM32F1/F4 → GD32F1/F4',
      'Таблица совместимости Xilinx → Gowin/Lattice',
      'Таблица совместимости TI LDO → Richtek/Silergy',
      'Методика проверки совместимости',
    ],
    targetUrl: 'https://www.chip-net.ru/analogs',
    targetKeywords: ['кросс-референс', 'аналог STM32', 'замена Xilinx', 'аналог TI LDO'],
    content: `Форумный пост 800-1200 слов. Технические таблицы, практический опыт. Ссылка на chip-net.ru/analogs.`,
  },
];

/**
 * Get content templates filtered by platform
 */
export function getTemplatesByPlatform(platform: string): ExternalContentTemplate[] {
  return externalContentTemplates.filter(t => t.platform.toLowerCase().includes(platform.toLowerCase()));
}

/**
 * Get all unique target URLs for backlink tracking
 */
export function getAllTargetUrls(): string[] {
  return [...new Set(externalContentTemplates.map(t => t.targetUrl))];
}

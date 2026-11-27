// ============================================================================
// Entity Authority Graph для chip-net.ru
// Взвешенный граф сущностей полупроводникового B2B-рынка России
// Отображает бренды, семейства, категории с весами авторитетности
// на основе поискового объёма, коммерческого интента и конкурентного позиционирования
// ============================================================================

// ---------------------------------------------------------------------------
// Интерфейсы
// ---------------------------------------------------------------------------

/** Узел сущности в графе авторитетности */
export interface EntityNode {
  /** Уникальный идентификатор сущности */
  id: string;
  /** Отображаемое название (русское, где уместно) */
  name: string;
  /** Slug для URL */
  slug: string;
  /** Тип сущности */
  type: 'brand' | 'family' | 'category' | 'component';
  /** Вес авторитетности (0–100) на основе поискового объёма и коммерческого интента */
  authorityWeight: number;
  /** Объём поисковых запросов */
  searchVolume: 'high' | 'medium' | 'low';
  /** Коммерческий интент закупочных запросов */
  commercialIntent: 'high' | 'medium' | 'low';
  /** Идентификаторы связанных сущностей */
  relatedEntityIds: string[];
  /** Slug хаб-страницы (если сущность принадлежит хабу) */
  hubPageSlug?: string;
}

/** Ребро связи между двумя сущностями */
export interface EntityEdge {
  /** Идентификатор исходной сущности */
  from: string;
  /** Идентификатор целевой сущности */
  to: string;
  /** Тип отношения */
  relationship: 'produces' | 'alternative-to' | 'category-of' | 'replaces' | 'competes-with';
  /** Вес связи (1–10): сила отношения для передачи авторитетности */
  weight: number;
}

/** Хаб-страница тематического авторитета */
export interface HubPage {
  /** Slug для URL (напр. /stm32) */
  slug: string;
  /** HTML Title */
  title: string;
  /** Заголовок H1 */
  h1: string;
  /** Meta description */
  description: string;
  /** Идентификаторы целевых сущностей, охватываемых хабом */
  targetEntityIds: string[];
  /** Первичное ключевое слово (высокий поисковый объём) */
  primaryKeyword: string;
  /** Вторичные ключевые слова */
  secondaryKeywords: string[];
  /** Оценка авторитетности хаб-страницы (0–100) */
  authorityScore: number;
}

// ---------------------------------------------------------------------------
// 1. entityNodes — Узлы графа сущностей
// ---------------------------------------------------------------------------

export const entityNodes: EntityNode[] = [
  // ── Бренды (30) ──────────────────────────────────────────────────────────
  {
    id: 'brand-stmicroelectronics',
    name: 'STMicroelectronics',
    slug: 'stmicroelectronics',
    type: 'brand',
    authorityWeight: 95,
    searchVolume: 'high',
    commercialIntent: 'high',
    relatedEntityIds: ['family-stm32f1', 'family-stm32f4', 'family-stm32h7', 'family-stm32f0', 'family-stm32l4'],
    hubPageSlug: 'stm32',
  },
  {
    id: 'brand-xilinx',
    name: 'Xilinx (AMD)',
    slug: 'xilinx',
    type: 'brand',
    authorityWeight: 90,
    searchVolume: 'high',
    commercialIntent: 'high',
    relatedEntityIds: ['family-artix-7', 'family-kintex-7', 'family-spartan-7', 'family-zynq'],
    hubPageSlug: 'xilinx',
  },
  {
    id: 'brand-texas-instruments',
    name: 'Texas Instruments',
    slug: 'texas-instruments',
    type: 'brand',
    authorityWeight: 85,
    searchVolume: 'high',
    commercialIntent: 'high',
    relatedEntityIds: ['family-tps54xxx', 'family-lm2596', 'family-lm358'],
    hubPageSlug: 'ti',
  },
  {
    id: 'brand-intel-altera',
    name: 'Intel/Altera',
    slug: 'intel-altera',
    type: 'brand',
    authorityWeight: 82,
    searchVolume: 'high',
    commercialIntent: 'high',
    relatedEntityIds: ['family-cyclone-v', 'family-cyclone-iv'],
    hubPageSlug: 'fpga',
  },
  {
    id: 'brand-microchip',
    name: 'Microchip Technology',
    slug: 'microchip',
    type: 'brand',
    authorityWeight: 78,
    searchVolume: 'high',
    commercialIntent: 'medium',
    relatedEntityIds: ['family-atmega328', 'family-pic18'],
  },
  {
    id: 'brand-infineon',
    name: 'Infineon Technologies',
    slug: 'infineon',
    type: 'brand',
    authorityWeight: 76,
    searchVolume: 'medium',
    commercialIntent: 'high',
    relatedEntityIds: ['cat-tranzistory'],
  },
  {
    id: 'brand-nxp',
    name: 'NXP Semiconductors',
    slug: 'nxp',
    type: 'brand',
    authorityWeight: 74,
    searchVolume: 'medium',
    commercialIntent: 'high',
    relatedEntityIds: ['cat-mikrokontrollery'],
  },
  {
    id: 'brand-analog-devices',
    name: 'Analog Devices',
    slug: 'analog-devices',
    type: 'brand',
    authorityWeight: 73,
    searchVolume: 'medium',
    commercialIntent: 'high',
    relatedEntityIds: ['cat-adc-dac', 'cat-opamp'],
  },
  {
    id: 'brand-lattice',
    name: 'Lattice Semiconductor',
    slug: 'lattice',
    type: 'brand',
    authorityWeight: 75,
    searchVolume: 'medium',
    commercialIntent: 'high',
    relatedEntityIds: ['family-ecp5', 'family-ice40'],
    hubPageSlug: 'fpga',
  },
  {
    id: 'brand-renesas',
    name: 'Renesas Electronics',
    slug: 'renesas',
    type: 'brand',
    authorityWeight: 65,
    searchVolume: 'medium',
    commercialIntent: 'medium',
    relatedEntityIds: ['cat-mikrokontrollery'],
  },
  {
    id: 'brand-onsemi',
    name: 'onsemi',
    slug: 'onsemi',
    type: 'brand',
    authorityWeight: 68,
    searchVolume: 'medium',
    commercialIntent: 'medium',
    relatedEntityIds: ['cat-tranzistory'],
  },
  {
    id: 'brand-nordic',
    name: 'Nordic Semiconductor',
    slug: 'nordic',
    type: 'brand',
    authorityWeight: 60,
    searchVolume: 'medium',
    commercialIntent: 'medium',
    relatedEntityIds: ['cat-interfeysy'],
  },
  {
    id: 'brand-murata',
    name: 'Murata',
    slug: 'murata',
    type: 'brand',
    authorityWeight: 62,
    searchVolume: 'medium',
    commercialIntent: 'medium',
    relatedEntityIds: ['cat-kondensatory'],
  },
  {
    id: 'brand-tdk',
    name: 'TDK / EPCOS',
    slug: 'tdk',
    type: 'brand',
    authorityWeight: 60,
    searchVolume: 'medium',
    commercialIntent: 'medium',
    relatedEntityIds: ['cat-kondensatory'],
  },
  {
    id: 'brand-vishay',
    name: 'Vishay',
    slug: 'vishay',
    type: 'brand',
    authorityWeight: 64,
    searchVolume: 'medium',
    commercialIntent: 'medium',
    relatedEntityIds: ['cat-tranzistory', 'cat-optoelektronika'],
  },
  {
    id: 'brand-gigadevice',
    name: 'Gigadevice',
    slug: 'gigadevice',
    type: 'brand',
    authorityWeight: 80,
    searchVolume: 'high',
    commercialIntent: 'high',
    relatedEntityIds: ['family-gd32f1', 'family-gd32f4'],
    hubPageSlug: 'stm32',
  },
  {
    id: 'brand-gowin',
    name: 'Gowin Semiconductor',
    slug: 'gowin',
    type: 'brand',
    authorityWeight: 70,
    searchVolume: 'medium',
    commercialIntent: 'high',
    relatedEntityIds: ['cat-fpga'],
    hubPageSlug: 'fpga',
  },
  {
    id: 'brand-efinix',
    name: 'Efinix',
    slug: 'efinix',
    type: 'brand',
    authorityWeight: 58,
    searchVolume: 'low',
    commercialIntent: 'medium',
    relatedEntityIds: ['cat-fpga'],
    hubPageSlug: 'fpga',
  },
  {
    id: 'brand-artery',
    name: 'Artery Technology',
    slug: 'artery',
    type: 'brand',
    authorityWeight: 62,
    searchVolume: 'medium',
    commercialIntent: 'medium',
    relatedEntityIds: ['family-at32f407'],
    hubPageSlug: 'stm32',
  },
  {
    id: 'brand-wch',
    name: 'WCH (Nanjing Qinheng)',
    slug: 'wch',
    type: 'brand',
    authorityWeight: 65,
    searchVolume: 'medium',
    commercialIntent: 'medium',
    relatedEntityIds: ['family-ch32f103'],
    hubPageSlug: 'stm32',
  },
  {
    id: 'brand-silicon-labs',
    name: 'Silicon Labs',
    slug: 'silicon-labs',
    type: 'brand',
    authorityWeight: 58,
    searchVolume: 'medium',
    commercialIntent: 'medium',
    relatedEntityIds: ['cat-interfeysy'],
  },
  {
    id: 'brand-monolithic-power',
    name: 'Monolithic Power Systems',
    slug: 'monolithic-power',
    type: 'brand',
    authorityWeight: 60,
    searchVolume: 'medium',
    commercialIntent: 'medium',
    relatedEntityIds: ['cat-stabilizatory'],
  },
  {
    id: 'brand-richtek',
    name: 'Richtek Technology',
    slug: 'richtek',
    type: 'brand',
    authorityWeight: 55,
    searchVolume: 'low',
    commercialIntent: 'medium',
    relatedEntityIds: ['cat-stabilizatory'],
  },
  {
    id: 'brand-xlsemi',
    name: 'XLSEMI (Nanjing Xiling',
    slug: 'xlsemi',
    type: 'brand',
    authorityWeight: 50,
    searchVolume: 'low',
    commercialIntent: 'medium',
    relatedEntityIds: ['cat-stabilizatory'],
  },
  {
    id: 'brand-samsung-electro',
    name: 'Samsung Electro-Mechanics',
    slug: 'samsung-electro',
    type: 'brand',
    authorityWeight: 62,
    searchVolume: 'medium',
    commercialIntent: 'medium',
    relatedEntityIds: ['cat-kondensatory'],
  },
  {
    id: 'brand-kemet',
    name: 'KEMET (Yageo Group)',
    slug: 'kemet',
    type: 'brand',
    authorityWeight: 58,
    searchVolume: 'medium',
    commercialIntent: 'medium',
    relatedEntityIds: ['cat-kondensatory'],
  },
  {
    id: 'brand-yageo',
    name: 'Yageo',
    slug: 'yageo',
    type: 'brand',
    authorityWeight: 55,
    searchVolume: 'low',
    commercialIntent: 'medium',
    relatedEntityIds: ['cat-kondensatory'],
  },
  {
    id: 'brand-bourns',
    name: 'Bourns',
    slug: 'bourns',
    type: 'brand',
    authorityWeight: 52,
    searchVolume: 'low',
    commercialIntent: 'medium',
    relatedEntityIds: ['cat-kondensatory', 'cat-rele'],
  },
  {
    id: 'brand-ftdi',
    name: 'FTDI (Future Technology)',
    slug: 'ftdi',
    type: 'brand',
    authorityWeight: 63,
    searchVolume: 'medium',
    commercialIntent: 'high',
    relatedEntityIds: ['family-ft232r'],
  },
  {
    id: 'brand-sharp',
    name: 'Sharp',
    slug: 'sharp',
    type: 'brand',
    authorityWeight: 55,
    searchVolume: 'low',
    commercialIntent: 'medium',
    relatedEntityIds: ['family-pc817'],
  },

  // ── Семейства (28) ───────────────────────────────────────────────────────
  {
    id: 'family-stm32f1',
    name: 'STM32F1',
    slug: 'stm32f1',
    type: 'family',
    authorityWeight: 92,
    searchVolume: 'high',
    commercialIntent: 'high',
    relatedEntityIds: ['brand-stmicroelectronics', 'family-gd32f1', 'family-hk32f103', 'family-ch32f103'],
    hubPageSlug: 'stm32',
  },
  {
    id: 'family-stm32f4',
    name: 'STM32F4',
    slug: 'stm32f4',
    type: 'family',
    authorityWeight: 88,
    searchVolume: 'high',
    commercialIntent: 'high',
    relatedEntityIds: ['brand-stmicroelectronics', 'family-gd32f4', 'family-at32f407'],
    hubPageSlug: 'stm32',
  },
  {
    id: 'family-stm32h7',
    name: 'STM32H7',
    slug: 'stm32h7',
    type: 'family',
    authorityWeight: 82,
    searchVolume: 'high',
    commercialIntent: 'high',
    relatedEntityIds: ['brand-stmicroelectronics', 'family-stm32f4'],
    hubPageSlug: 'stm32',
  },
  {
    id: 'family-stm32f0',
    name: 'STM32F0',
    slug: 'stm32f0',
    type: 'family',
    authorityWeight: 75,
    searchVolume: 'medium',
    commercialIntent: 'high',
    relatedEntityIds: ['brand-stmicroelectronics', 'family-stm32f1'],
    hubPageSlug: 'stm32',
  },
  {
    id: 'family-stm32l4',
    name: 'STM32L4',
    slug: 'stm32l4',
    type: 'family',
    authorityWeight: 72,
    searchVolume: 'medium',
    commercialIntent: 'high',
    relatedEntityIds: ['brand-stmicroelectronics', 'family-stm32f4'],
    hubPageSlug: 'stm32',
  },
  {
    id: 'family-gd32f1',
    name: 'GD32F1',
    slug: 'gd32f1',
    type: 'family',
    authorityWeight: 78,
    searchVolume: 'high',
    commercialIntent: 'high',
    relatedEntityIds: ['brand-gigadevice', 'family-stm32f1', 'family-hk32f103', 'family-ch32f103'],
    hubPageSlug: 'stm32',
  },
  {
    id: 'family-gd32f4',
    name: 'GD32F4',
    slug: 'gd32f4',
    type: 'family',
    authorityWeight: 74,
    searchVolume: 'medium',
    commercialIntent: 'high',
    relatedEntityIds: ['brand-gigadevice', 'family-stm32f4', 'family-at32f407'],
    hubPageSlug: 'stm32',
  },
  {
    id: 'family-atmega328',
    name: 'ATmega328',
    slug: 'atmega328',
    type: 'family',
    authorityWeight: 70,
    searchVolume: 'high',
    commercialIntent: 'medium',
    relatedEntityIds: ['brand-microchip', 'family-lgt8f328'],
  },
  {
    id: 'family-pic18',
    name: 'PIC18',
    slug: 'pic18',
    type: 'family',
    authorityWeight: 55,
    searchVolume: 'medium',
    commercialIntent: 'medium',
    relatedEntityIds: ['brand-microchip'],
  },
  {
    id: 'family-artix-7',
    name: 'Artix-7',
    slug: 'artix-7',
    type: 'family',
    authorityWeight: 85,
    searchVolume: 'high',
    commercialIntent: 'high',
    relatedEntityIds: ['brand-xilinx', 'family-ecp5', 'family-kintex-7'],
    hubPageSlug: 'xilinx',
  },
  {
    id: 'family-kintex-7',
    name: 'Kintex-7',
    slug: 'kintex-7',
    type: 'family',
    authorityWeight: 80,
    searchVolume: 'high',
    commercialIntent: 'high',
    relatedEntityIds: ['brand-xilinx', 'family-artix-7', 'family-cyclone-v'],
    hubPageSlug: 'xilinx',
  },
  {
    id: 'family-spartan-7',
    name: 'Spartan-7',
    slug: 'spartan-7',
    type: 'family',
    authorityWeight: 72,
    searchVolume: 'medium',
    commercialIntent: 'medium',
    relatedEntityIds: ['brand-xilinx', 'family-ice40', 'family-artix-7'],
    hubPageSlug: 'xilinx',
  },
  {
    id: 'family-zynq',
    name: 'Zynq-7000',
    slug: 'zynq',
    type: 'family',
    authorityWeight: 78,
    searchVolume: 'high',
    commercialIntent: 'high',
    relatedEntityIds: ['brand-xilinx', 'family-cyclone-v'],
    hubPageSlug: 'xilinx',
  },
  {
    id: 'family-cyclone-v',
    name: 'Cyclone V',
    slug: 'cyclone-v',
    type: 'family',
    authorityWeight: 76,
    searchVolume: 'high',
    commercialIntent: 'high',
    relatedEntityIds: ['brand-intel-altera', 'family-ecp5', 'family-zynq', 'family-cyclone-iv'],
    hubPageSlug: 'fpga',
  },
  {
    id: 'family-cyclone-iv',
    name: 'Cyclone IV',
    slug: 'cyclone-iv',
    type: 'family',
    authorityWeight: 70,
    searchVolume: 'medium',
    commercialIntent: 'high',
    relatedEntityIds: ['brand-intel-altera', 'family-ecp5', 'family-cyclone-v'],
    hubPageSlug: 'fpga',
  },
  {
    id: 'family-ecp5',
    name: 'ECP5',
    slug: 'ecp5',
    type: 'family',
    authorityWeight: 73,
    searchVolume: 'medium',
    commercialIntent: 'high',
    relatedEntityIds: ['brand-lattice', 'family-artix-7', 'family-cyclone-iv', 'family-ice40'],
    hubPageSlug: 'fpga',
  },
  {
    id: 'family-ice40',
    name: 'iCE40',
    slug: 'ice40',
    type: 'family',
    authorityWeight: 68,
    searchVolume: 'medium',
    commercialIntent: 'medium',
    relatedEntityIds: ['brand-lattice', 'family-ecp5', 'family-spartan-7'],
    hubPageSlug: 'fpga',
  },
  {
    id: 'family-tps54xxx',
    name: 'TPS54xxx Step-Down',
    slug: 'tps54xxx',
    type: 'family',
    authorityWeight: 65,
    searchVolume: 'medium',
    commercialIntent: 'high',
    relatedEntityIds: ['brand-texas-instruments', 'family-lm2596'],
    hubPageSlug: 'ti',
  },
  {
    id: 'family-lm2596',
    name: 'LM2596 Simple Switcher',
    slug: 'lm2596',
    type: 'family',
    authorityWeight: 72,
    searchVolume: 'high',
    commercialIntent: 'high',
    relatedEntityIds: ['brand-texas-instruments', 'family-tps54xxx', 'family-ams1117'],
    hubPageSlug: 'ti',
  },
  {
    id: 'family-ams1117',
    name: 'AMS1117',
    slug: 'ams1117',
    type: 'family',
    authorityWeight: 70,
    searchVolume: 'high',
    commercialIntent: 'medium',
    relatedEntityIds: ['family-lm2596'],
  },
  {
    id: 'family-pc817',
    name: 'PC817',
    slug: 'pc817',
    type: 'family',
    authorityWeight: 68,
    searchVolume: 'medium',
    commercialIntent: 'high',
    relatedEntityIds: ['brand-sharp', 'cat-optoelektronika'],
  },
  {
    id: 'family-ft232r',
    name: 'FT232R',
    slug: 'ft232r',
    type: 'family',
    authorityWeight: 72,
    searchVolume: 'high',
    commercialIntent: 'high',
    relatedEntityIds: ['brand-ftdi', 'family-sp3485'],
  },
  {
    id: 'family-sp3485',
    name: 'SP3485',
    slug: 'sp3485',
    type: 'family',
    authorityWeight: 60,
    searchVolume: 'medium',
    commercialIntent: 'high',
    relatedEntityIds: ['family-ft232r', 'cat-interfeysy'],
  },
  {
    id: 'family-lm358',
    name: 'LM358',
    slug: 'lm358',
    type: 'family',
    authorityWeight: 66,
    searchVolume: 'high',
    commercialIntent: 'medium',
    relatedEntityIds: ['brand-texas-instruments', 'cat-opamp'],
    hubPageSlug: 'ti',
  },
  {
    id: 'family-at32f407',
    name: 'AT32F407',
    slug: 'at32f407',
    type: 'family',
    authorityWeight: 62,
    searchVolume: 'medium',
    commercialIntent: 'medium',
    relatedEntityIds: ['brand-artery', 'family-stm32f4', 'family-gd32f4'],
    hubPageSlug: 'stm32',
  },
  {
    id: 'family-hk32f103',
    name: 'HK32F103',
    slug: 'hk32f103',
    type: 'family',
    authorityWeight: 58,
    searchVolume: 'medium',
    commercialIntent: 'medium',
    relatedEntityIds: ['family-stm32f1', 'family-gd32f1', 'family-ch32f103'],
    hubPageSlug: 'stm32',
  },
  {
    id: 'family-ch32f103',
    name: 'CH32F103',
    slug: 'ch32f103',
    type: 'family',
    authorityWeight: 60,
    searchVolume: 'medium',
    commercialIntent: 'medium',
    relatedEntityIds: ['brand-wch', 'family-stm32f1', 'family-gd32f1', 'family-hk32f103'],
    hubPageSlug: 'stm32',
  },
  {
    id: 'family-lgt8f328',
    name: 'LGT8F328',
    slug: 'lgt8f328',
    type: 'family',
    authorityWeight: 52,
    searchVolume: 'low',
    commercialIntent: 'medium',
    relatedEntityIds: ['family-atmega328'],
  },

  // ── Категории (15) ───────────────────────────────────────────────────────
  {
    id: 'cat-mikrokontrollery',
    name: 'Микроконтроллеры',
    slug: 'mikrokontrollery',
    type: 'category',
    authorityWeight: 90,
    searchVolume: 'high',
    commercialIntent: 'high',
    relatedEntityIds: [
      'family-stm32f1', 'family-stm32f4', 'family-stm32h7', 'family-stm32f0',
      'family-stm32l4', 'family-gd32f1', 'family-gd32f4', 'family-atmega328',
      'family-pic18', 'family-at32f407', 'family-hk32f103', 'family-ch32f103',
      'family-lgt8f328',
    ],
    hubPageSlug: 'stm32',
  },
  {
    id: 'cat-fpga',
    name: 'ПЛИС (FPGA)',
    slug: 'fpga',
    type: 'category',
    authorityWeight: 85,
    searchVolume: 'high',
    commercialIntent: 'high',
    relatedEntityIds: [
      'family-artix-7', 'family-kintex-7', 'family-spartan-7', 'family-zynq',
      'family-cyclone-v', 'family-cyclone-iv', 'family-ecp5', 'family-ice40',
    ],
    hubPageSlug: 'fpga',
  },
  {
    id: 'cat-tranzistory',
    name: 'Транзисторы',
    slug: 'tranzistory',
    type: 'category',
    authorityWeight: 65,
    searchVolume: 'medium',
    commercialIntent: 'high',
    relatedEntityIds: ['brand-infineon', 'brand-onsemi', 'brand-vishay', 'brand-stmicroelectronics'],
  },
  {
    id: 'cat-kondensatory',
    name: 'Конденсаторы',
    slug: 'kondensatory',
    type: 'category',
    authorityWeight: 63,
    searchVolume: 'medium',
    commercialIntent: 'medium',
    relatedEntityIds: ['brand-murata', 'brand-tdk', 'brand-samsung-electro', 'brand-kemet', 'brand-yageo'],
  },
  {
    id: 'cat-adc-dac',
    name: 'АЦП/ЦАП',
    slug: 'adc-dac',
    type: 'category',
    authorityWeight: 60,
    searchVolume: 'medium',
    commercialIntent: 'high',
    relatedEntityIds: ['brand-analog-devices', 'brand-texas-instruments'],
  },
  {
    id: 'cat-stabilizatory',
    name: 'Стабилизаторы',
    slug: 'stabilizatory',
    type: 'category',
    authorityWeight: 62,
    searchVolume: 'medium',
    commercialIntent: 'high',
    relatedEntityIds: ['family-tps54xxx', 'family-lm2596', 'family-ams1117', 'brand-monolithic-power', 'brand-richtek', 'brand-xlsemi'],
  },
  {
    id: 'cat-opamp',
    name: 'Операционные усилители',
    slug: 'operatsionnye-usiliteli',
    type: 'category',
    authorityWeight: 58,
    searchVolume: 'medium',
    commercialIntent: 'medium',
    relatedEntityIds: ['family-lm358', 'brand-analog-devices', 'brand-texas-instruments'],
  },
  {
    id: 'cat-razemy',
    name: 'Разъёмы',
    slug: 'razemy',
    type: 'category',
    authorityWeight: 55,
    searchVolume: 'medium',
    commercialIntent: 'medium',
    relatedEntityIds: ['brand-bourns'],
  },
  {
    id: 'cat-datchiki',
    name: 'Датчики',
    slug: 'datchiki',
    type: 'category',
    authorityWeight: 57,
    searchVolume: 'medium',
    commercialIntent: 'medium',
    relatedEntityIds: ['brand-stmicroelectronics', 'brand-analog-devices', 'brand-nxp'],
  },
  {
    id: 'cat-optoelektronika',
    name: 'Оптоэлектроника',
    slug: 'optoelektronika',
    type: 'category',
    authorityWeight: 56,
    searchVolume: 'medium',
    commercialIntent: 'medium',
    relatedEntityIds: ['family-pc817', 'brand-vishay', 'brand-sharp'],
  },
  {
    id: 'cat-interfeysy',
    name: 'Интерфейсы',
    slug: 'interfeysy',
    type: 'category',
    authorityWeight: 60,
    searchVolume: 'medium',
    commercialIntent: 'high',
    relatedEntityIds: ['family-ft232r', 'family-sp3485', 'brand-ftdi', 'brand-silicon-labs', 'brand-wch', 'brand-nordic'],
  },
  {
    id: 'cat-pitanie',
    name: 'Питание',
    slug: 'pitaniya',
    type: 'category',
    authorityWeight: 58,
    searchVolume: 'medium',
    commercialIntent: 'high',
    relatedEntityIds: ['cat-stabilizatory', 'family-tps54xxx', 'family-lm2596'],
  },
  {
    id: 'cat-pamyat',
    name: 'Память',
    slug: 'pamyat',
    type: 'category',
    authorityWeight: 55,
    searchVolume: 'medium',
    commercialIntent: 'medium',
    relatedEntityIds: ['brand-gigadevice'],
  },
  {
    id: 'cat-logika',
    name: 'Логика',
    slug: 'logika',
    type: 'category',
    authorityWeight: 50,
    searchVolume: 'low',
    commercialIntent: 'medium',
    relatedEntityIds: ['brand-texas-instruments', 'brand-nxp'],
  },
  {
    id: 'cat-rele',
    name: 'Реле',
    slug: 'rele',
    type: 'category',
    authorityWeight: 48,
    searchVolume: 'low',
    commercialIntent: 'medium',
    relatedEntityIds: ['brand-bourns'],
  },
];

// ---------------------------------------------------------------------------
// 2. entityEdges — Рёбра связей между сущностями
// ---------------------------------------------------------------------------

export const entityEdges: EntityEdge[] = [
  // ── produces: Бренд → Семейство (24 ребра) ──────────────────────────────
  { from: 'brand-stmicroelectronics', to: 'family-stm32f1',  relationship: 'produces', weight: 10 },
  { from: 'brand-stmicroelectronics', to: 'family-stm32f4',  relationship: 'produces', weight: 10 },
  { from: 'brand-stmicroelectronics', to: 'family-stm32h7',  relationship: 'produces', weight: 9  },
  { from: 'brand-stmicroelectronics', to: 'family-stm32f0',  relationship: 'produces', weight: 8  },
  { from: 'brand-stmicroelectronics', to: 'family-stm32l4',  relationship: 'produces', weight: 8  },
  { from: 'brand-xilinx',             to: 'family-artix-7',  relationship: 'produces', weight: 10 },
  { from: 'brand-xilinx',             to: 'family-kintex-7', relationship: 'produces', weight: 10 },
  { from: 'brand-xilinx',             to: 'family-spartan-7',relationship: 'produces', weight: 8  },
  { from: 'brand-xilinx',             to: 'family-zynq',     relationship: 'produces', weight: 9  },
  { from: 'brand-intel-altera',       to: 'family-cyclone-v',relationship: 'produces', weight: 9  },
  { from: 'brand-intel-altera',       to: 'family-cyclone-iv',relationship:'produces', weight: 8  },
  { from: 'brand-lattice',            to: 'family-ecp5',     relationship: 'produces', weight: 9  },
  { from: 'brand-lattice',            to: 'family-ice40',    relationship: 'produces', weight: 8  },
  { from: 'brand-microchip',          to: 'family-atmega328',relationship: 'produces', weight: 9  },
  { from: 'brand-microchip',          to: 'family-pic18',    relationship: 'produces', weight: 7  },
  { from: 'brand-texas-instruments',  to: 'family-tps54xxx', relationship: 'produces', weight: 8  },
  { from: 'brand-texas-instruments',  to: 'family-lm2596',   relationship: 'produces', weight: 9  },
  { from: 'brand-texas-instruments',  to: 'family-lm358',    relationship: 'produces', weight: 8  },
  { from: 'brand-gigadevice',         to: 'family-gd32f1',   relationship: 'produces', weight: 10 },
  { from: 'brand-gigadevice',         to: 'family-gd32f4',   relationship: 'produces', weight: 9  },
  { from: 'brand-artery',             to: 'family-at32f407', relationship: 'produces', weight: 8  },
  { from: 'brand-wch',                to: 'family-ch32f103', relationship: 'produces', weight: 8  },
  { from: 'brand-sharp',              to: 'family-pc817',    relationship: 'produces', weight: 7  },
  { from: 'brand-ftdi',               to: 'family-ft232r',   relationship: 'produces', weight: 9  },

  // ── category-of: Семейство → Категория (28 рёбер) ────────────────────────
  { from: 'family-stm32f1',    to: 'cat-mikrokontrollery',  relationship: 'category-of', weight: 10 },
  { from: 'family-stm32f4',    to: 'cat-mikrokontrollery',  relationship: 'category-of', weight: 10 },
  { from: 'family-stm32h7',    to: 'cat-mikrokontrollery',  relationship: 'category-of', weight: 9  },
  { from: 'family-stm32f0',    to: 'cat-mikrokontrollery',  relationship: 'category-of', weight: 8  },
  { from: 'family-stm32l4',    to: 'cat-mikrokontrollery',  relationship: 'category-of', weight: 8  },
  { from: 'family-gd32f1',     to: 'cat-mikrokontrollery',  relationship: 'category-of', weight: 9  },
  { from: 'family-gd32f4',     to: 'cat-mikrokontrollery',  relationship: 'category-of', weight: 8  },
  { from: 'family-atmega328',  to: 'cat-mikrokontrollery',  relationship: 'category-of', weight: 8  },
  { from: 'family-pic18',      to: 'cat-mikrokontrollery',  relationship: 'category-of', weight: 6  },
  { from: 'family-at32f407',   to: 'cat-mikrokontrollery',  relationship: 'category-of', weight: 7  },
  { from: 'family-hk32f103',   to: 'cat-mikrokontrollery',  relationship: 'category-of', weight: 7  },
  { from: 'family-ch32f103',   to: 'cat-mikrokontrollery',  relationship: 'category-of', weight: 7  },
  { from: 'family-lgt8f328',   to: 'cat-mikrokontrollery',  relationship: 'category-of', weight: 5  },
  { from: 'family-artix-7',    to: 'cat-fpga',              relationship: 'category-of', weight: 10 },
  { from: 'family-kintex-7',   to: 'cat-fpga',              relationship: 'category-of', weight: 9  },
  { from: 'family-spartan-7',  to: 'cat-fpga',              relationship: 'category-of', weight: 8  },
  { from: 'family-zynq',       to: 'cat-fpga',              relationship: 'category-of', weight: 9  },
  { from: 'family-cyclone-v',  to: 'cat-fpga',              relationship: 'category-of', weight: 9  },
  { from: 'family-cyclone-iv', to: 'cat-fpga',              relationship: 'category-of', weight: 8  },
  { from: 'family-ecp5',       to: 'cat-fpga',              relationship: 'category-of', weight: 8  },
  { from: 'family-ice40',      to: 'cat-fpga',              relationship: 'category-of', weight: 7  },
  { from: 'family-tps54xxx',   to: 'cat-stabilizatory',     relationship: 'category-of', weight: 8  },
  { from: 'family-lm2596',     to: 'cat-stabilizatory',     relationship: 'category-of', weight: 9  },
  { from: 'family-ams1117',    to: 'cat-stabilizatory',     relationship: 'category-of', weight: 8  },
  { from: 'family-pc817',      to: 'cat-optoelektronika',   relationship: 'category-of', weight: 8  },
  { from: 'family-ft232r',     to: 'cat-interfeysy',        relationship: 'category-of', weight: 9  },
  { from: 'family-sp3485',     to: 'cat-interfeysy',        relationship: 'category-of', weight: 7  },
  { from: 'family-lm358',      to: 'cat-opamp',             relationship: 'category-of', weight: 8  },

  // ── alternative-to: Взаимозаменяемые семейства (13 рёбер) ────────────────
  { from: 'family-stm32f1',   to: 'family-gd32f1',     relationship: 'alternative-to', weight: 9  },
  { from: 'family-stm32f1',   to: 'family-hk32f103',   relationship: 'alternative-to', weight: 7  },
  { from: 'family-stm32f1',   to: 'family-ch32f103',   relationship: 'alternative-to', weight: 7  },
  { from: 'family-stm32f4',   to: 'family-gd32f4',     relationship: 'alternative-to', weight: 9  },
  { from: 'family-stm32f4',   to: 'family-at32f407',   relationship: 'alternative-to', weight: 8  },
  { from: 'family-atmega328', to: 'family-lgt8f328',   relationship: 'alternative-to', weight: 6  },
  { from: 'family-artix-7',   to: 'family-ecp5',       relationship: 'alternative-to', weight: 8  },
  { from: 'family-cyclone-iv',to: 'family-ecp5',       relationship: 'alternative-to', weight: 7  },
  { from: 'family-spartan-7', to: 'family-ice40',      relationship: 'alternative-to', weight: 7  },
  { from: 'family-lm2596',    to: 'family-ams1117',    relationship: 'alternative-to', weight: 5  },
  { from: 'family-cyclone-v', to: 'family-artix-7',    relationship: 'alternative-to', weight: 8  },
  { from: 'family-kintex-7',  to: 'family-cyclone-v',  relationship: 'alternative-to', weight: 8  },
  { from: 'family-zynq',      to: 'family-cyclone-v',  relationship: 'alternative-to', weight: 7  },

  // ── replaces: Замена санкционных/EOL компонентов (9 рёбер) ───────────────
  { from: 'family-gd32f1',    to: 'family-stm32f1',   relationship: 'replaces', weight: 10 },
  { from: 'family-gd32f4',    to: 'family-stm32f4',   relationship: 'replaces', weight: 9  },
  { from: 'family-hk32f103',  to: 'family-stm32f1',   relationship: 'replaces', weight: 8  },
  { from: 'family-ch32f103',  to: 'family-stm32f1',   relationship: 'replaces', weight: 7  },
  { from: 'family-at32f407',  to: 'family-stm32f4',   relationship: 'replaces', weight: 8  },
  { from: 'family-ecp5',      to: 'family-artix-7',   relationship: 'replaces', weight: 8  },
  { from: 'family-ecp5',      to: 'family-cyclone-iv',relationship: 'replaces', weight: 7  },
  { from: 'family-ice40',     to: 'family-spartan-7', relationship: 'replaces', weight: 7  },
  { from: 'family-lgt8f328',  to: 'family-atmega328', relationship: 'replaces', weight: 6  },

  // ── competes-with: Конкуренция между брендами (16 рёбер) ─────────────────
  { from: 'brand-xilinx',            to: 'brand-intel-altera',     relationship: 'competes-with', weight: 10 },
  { from: 'brand-xilinx',            to: 'brand-lattice',          relationship: 'competes-with', weight: 7  },
  { from: 'brand-stmicroelectronics',to: 'brand-microchip',        relationship: 'competes-with', weight: 8  },
  { from: 'brand-stmicroelectronics',to: 'brand-nxp',              relationship: 'competes-with', weight: 7  },
  { from: 'brand-texas-instruments', to: 'brand-analog-devices',   relationship: 'competes-with', weight: 9  },
  { from: 'brand-texas-instruments', to: 'brand-infineon',         relationship: 'competes-with', weight: 7  },
  { from: 'brand-murata',            to: 'brand-tdk',              relationship: 'competes-with', weight: 8  },
  { from: 'brand-kemet',             to: 'brand-yageo',            relationship: 'competes-with', weight: 6  },
  { from: 'brand-gigadevice',        to: 'brand-artery',           relationship: 'competes-with', weight: 6  },
  { from: 'brand-gowin',             to: 'brand-lattice',          relationship: 'competes-with', weight: 7  },
  { from: 'brand-gowin',             to: 'brand-xilinx',           relationship: 'competes-with', weight: 6  },
  { from: 'brand-efinix',            to: 'brand-lattice',          relationship: 'competes-with', weight: 5  },
  { from: 'brand-nordic',            to: 'brand-silicon-labs',     relationship: 'competes-with', weight: 7  },
  { from: 'brand-infineon',          to: 'brand-onsemi',           relationship: 'competes-with', weight: 8  },
  { from: 'brand-samsung-electro',   to: 'brand-murata',           relationship: 'competes-with', weight: 6  },
  { from: 'brand-monolithic-power',  to: 'brand-richtek',          relationship: 'competes-with', weight: 5  },
];

// ---------------------------------------------------------------------------
// 3. hubPages — Хаб-страницы тематического авторитета
// ---------------------------------------------------------------------------

export const hubPages: HubPage[] = [
  {
    slug: 'stm32',
    title: 'STM32 микроконтроллеры и аналоги — купить оптом, замена GD32 HK32 CH32',
    h1: 'Микроконтроллеры STM32: выбор серий и аналоги для импортозамещения',
    description:
      'Полный каталог микроконтроллеров STM32 всех серий (F0, F1, F4, H7, L4) и аналогов для импортозамещения: GD32, HK32, CH32, AT32. Кросс-референсы, совместимость pin-to-pin, подбор замены санкционных компонентов.',
    targetEntityIds: [
      'brand-stmicroelectronics',
      'brand-gigadevice',
      'brand-artery',
      'brand-wch',
      'family-stm32f1',
      'family-stm32f4',
      'family-stm32h7',
      'family-stm32f0',
      'family-stm32l4',
      'family-gd32f1',
      'family-gd32f4',
      'family-at32f407',
      'family-hk32f103',
      'family-ch32f103',
      'cat-mikrokontrollery',
    ],
    primaryKeyword: 'STM32 микроконтроллеры купить',
    secondaryKeywords: [
      'STM32F103 аналоги замена',
      'GD32F103 аналог STM32',
      'HK32F103 импортозамещение',
      'CH32F103 совместимость',
      'STM32F407 аналоги',
      'AT32F407 замена STM32F4',
      'микроконтроллер ARM Cortex купить оптом',
    ],
    authorityScore: 98,
  },
  {
    slug: 'fpga',
    title: 'ПЛИС и FPGA: выбор, аналоги, замена — Xilinx, Intel, Lattice, Gowin',
    h1: 'Программируемая логика (FPGA): подбор серий и аналоги для импортозамещения',
    description:
      'Каталог ПЛИС/FPGA для промышленности и ВПК: Xilinx Artix-7/Kintex-7/Zynq, Intel Cyclone, Lattice ECP5/iCE40, Gowin. Кросс-референсы для замены санкционных серий, поддержка миграции проектов.',
    targetEntityIds: [
      'brand-xilinx',
      'brand-intel-altera',
      'brand-lattice',
      'brand-gowin',
      'brand-efinix',
      'family-artix-7',
      'family-kintex-7',
      'family-spartan-7',
      'family-zynq',
      'family-cyclone-v',
      'family-cyclone-iv',
      'family-ecp5',
      'family-ice40',
      'cat-fpga',
    ],
    primaryKeyword: 'ПЛИС FPGA купить аналоги',
    secondaryKeywords: [
      'Artix-7 аналог ECP5',
      'Xilinx замена Gowin',
      'Cyclone IV аналог Lattice',
      'FPGA импортозамещение',
      'Zynq альтернатива Cyclone V',
      'iCE40 замена Spartan',
      'ПЛИС для оборонного комплекса',
    ],
    authorityScore: 95,
  },
  {
    slug: 'ti',
    title: 'Компоненты Texas Instruments: аналоги и замена — TPS, LM, АЦП/ЦАП, ОУ',
    h1: 'Компоненты Texas Instruments: подбор серий и аналоги для замены',
    description:
      'Каталог микросхем Texas Instruments: стабилизаторы TPS/LM, операционные усилители, АЦП/ЦАП, DSP. Кросс-референсы для замены unavailable компонентов на Monolithic Power, Richtek, XLSEMI и другие доступные бренды.',
    targetEntityIds: [
      'brand-texas-instruments',
      'brand-monolithic-power',
      'brand-richtek',
      'brand-xlsemi',
      'family-tps54xxx',
      'family-lm2596',
      'family-lm358',
      'cat-stabilizatory',
      'cat-opamp',
      'cat-adc-dac',
    ],
    primaryKeyword: 'Texas Instruments аналоги замена',
    secondaryKeywords: [
      'TPS5430 аналог MP1584',
      'LM2596 замена XL2596',
      'LM358 аналоги операционный усилитель',
      'TI стабилизатор импортозамещение',
      'TPS563200 аналог',
      'AMS1117 альтернатива TI',
    ],
    authorityScore: 88,
  },
  {
    slug: 'xilinx',
    title: 'ПЛИС Xilinx: аналоги и импортозамещение — Artix-7, Kintex-7, Zynq',
    h1: 'Программируемая логика Xilinx: подбор аналогов и замена санкционных серий',
    description:
      'Каталог FPGA Xilinx (AMD): Artix-7, Kintex-7, Spartan-7, Zynq-7000. Кросс-референсы для импортозамещения на Lattice ECP5/iCE40, Gowin Arora/Nano, Efinix Trion. Миграция проектов, адаптация pinout.',
    targetEntityIds: [
      'brand-xilinx',
      'brand-lattice',
      'brand-gowin',
      'brand-efinix',
      'family-artix-7',
      'family-kintex-7',
      'family-spartan-7',
      'family-zynq',
      'cat-fpga',
    ],
    primaryKeyword: 'Xilinx FPGA аналоги импортозамещение',
    secondaryKeywords: [
      'Artix-7 замена Gowin',
      'Kintex-7 аналог ECP5',
      'Zynq альтернатива Cyclone V',
      'Spartan-7 замена iCE40',
      'Xilinx санкции аналоги',
      'FPGA миграция проекта',
      'ПЛИС Xilinx купить оптом',
    ],
    authorityScore: 92,
  },
];

// ---------------------------------------------------------------------------
// 4. Вспомогательные индексы для быстрого поиска
// ---------------------------------------------------------------------------

/** Карта id → EntityNode для O(1) доступа */
const nodeMap = new Map<string, EntityNode>(entityNodes.map((n) => [n.id, n]));

/** Карта id → все рёбра исходящие из узла */
const outgoingEdgesMap = new Map<string, EntityEdge[]>();
for (const edge of entityEdges) {
  const list = outgoingEdgesMap.get(edge.from) ?? [];
  list.push(edge);
  outgoingEdgesMap.set(edge.from, list);
}

/** Карта id → все рёбра входящие в узел */
const incomingEdgesMap = new Map<string, EntityEdge[]>();
for (const edge of entityEdges) {
  const list = incomingEdgesMap.get(edge.to) ?? [];
  list.push(edge);
  incomingEdgesMap.set(edge.to, list);
}

/** Карта slug → HubPage */
const hubPageMap = new Map<string, HubPage>(hubPages.map((h) => [h.slug, h]));

// ---------------------------------------------------------------------------
// 5. Экспортируемые вспомогательные функции
// ---------------------------------------------------------------------------

/**
 * Найти сущность по идентификатору
 * @returns EntityNode или undefined
 */
export function getEntityById(id: string): EntityNode | undefined {
  return nodeMap.get(id);
}

/**
 * Получить все сущности, напрямую связанные с данной
 * (по рёбрам в обоих направлениях)
 * @returns Массив связанных EntityNode
 */
export function getRelatedEntities(id: string): EntityNode[] {
  const relatedIds = new Set<string>();

  // Исходящие рёбра
  const outgoing = outgoingEdgesMap.get(id) ?? [];
  for (const edge of outgoing) {
    relatedIds.add(edge.to);
  }

  // Входящие рёбра
  const incoming = incomingEdgesMap.get(id) ?? [];
  for (const edge of incoming) {
    relatedIds.add(edge.from);
  }

  // Также учитываем relatedEntityIds из самого узла
  const node = nodeMap.get(id);
  if (node) {
    for (const rid of node.relatedEntityIds) {
      relatedIds.add(rid);
    }
  }

  const result: EntityNode[] = [];
  for (const rid of relatedIds) {
    const entity = nodeMap.get(rid);
    if (entity) {
      result.push(entity);
    }
  }
  return result;
}

/**
 * Определить хаб-страницу, к которой принадлежит сущность
 * @returns HubPage или undefined
 */
export function getHubPageForEntity(id: string): HubPage | undefined {
  const node = nodeMap.get(id);
  if (!node) return undefined;

  // Сначала проверяем прямую привязку через hubPageSlug
  if (node.hubPageSlug) {
    return hubPageMap.get(node.hubPageSlug);
  }

  // Затем проверяем, входит ли сущность в targetEntityIds какой-либо хаб-страницы
  for (const hub of hubPages) {
    if (hub.targetEntityIds.includes(id)) {
      return hub;
    }
  }

  return undefined;
}

/**
 * Получить все сущности заданного типа
 * @param type — 'brand' | 'family' | 'category' | 'component'
 * @returns Массив EntityNode указанного типа
 */
export function getEntitiesByType(type: EntityNode['type']): EntityNode[] {
  return entityNodes.filter((n) => n.type === type);
}

/**
 * Получить топ-N сущностей по весу авторитетности
 * @param limit — количество сущностей
 * @returns Массив EntityNode, отсортированный по authorityWeight по убыванию
 */
export function getTopEntities(limit: number): EntityNode[] {
  return [...entityNodes].sort((a, b) => b.authorityWeight - a.authorityWeight).slice(0, limit);
}

/**
 * Найти кратчайший путь авторитетности между двумя сущностями
 * Использует алгоритм Дейкстры с учётом весов рёбер (меньший вес = более сильная связь)
 * Вес ребра инвертируется (10 - weight) для Дейкстры: сильная связь = меньшая дистанция
 *
 * @param fromId — идентификатор начальной сущности
 * @param toId — идентификатор целевой сущности
 * @returns Массив EntityEdge, представляющий кратчайший путь, или пустой массив если путь не найден
 */
export function getAuthorityPath(fromId: string, toId: string): EntityEdge[] {
  if (fromId === toId) return [];
  if (!nodeMap.has(fromId) || !nodeMap.has(toId)) return [];

  // Дейкстра: дистанция = сумма инвертированных весов (10 - edge.weight)
  // Сильная связь (weight=10) → дистанция 0, слабая (weight=1) → дистанция 9
  const distances = new Map<string, number>();
  const previous = new Map<string, EntityEdge>();
  const visited = new Set<string>();

  // Инициализация
  for (const node of entityNodes) {
    distances.set(node.id, Infinity);
  }
  distances.set(fromId, 0);

  // Очередь с приоритетом (простая реализация через массив)
  const queue: string[] = [fromId];

  while (queue.length > 0) {
    // Находим узел с минимальной дистанцией
    let minDist = Infinity;
    let current = '';
    for (const id of queue) {
      const d = distances.get(id) ?? Infinity;
      if (d < minDist) {
        minDist = d;
        current = id;
      }
    }

    if (!current || minDist === Infinity) break;
    if (current === toId) break;

    // Удаляем из очереди
    queue.splice(queue.indexOf(current), 1);
    visited.add(current);

    // Обрабатываем исходящие рёбра
    const edges = outgoingEdgesMap.get(current) ?? [];
    for (const edge of edges) {
      if (visited.has(edge.to)) continue;
      const edgeDist = 10 - edge.weight; // инвертированный вес: 10-10=0 (сильная), 10-1=9 (слабая)
      const newDist = (distances.get(current) ?? Infinity) + edgeDist;
      const curDist = distances.get(edge.to) ?? Infinity;
      if (newDist < curDist) {
        distances.set(edge.to, newDist);
        previous.set(edge.to, edge);
        if (!queue.includes(edge.to)) {
          queue.push(edge.to);
        }
      }
    }

    // Обрабатываем входящие рёбра (граф неориентированный для поиска пути)
    const inEdges = incomingEdgesMap.get(current) ?? [];
    for (const edge of inEdges) {
      if (visited.has(edge.from)) continue;
      const edgeDist = 10 - edge.weight;
      const newDist = (distances.get(current) ?? Infinity) + edgeDist;
      const curDist = distances.get(edge.from) ?? Infinity;
      if (newDist < curDist) {
        distances.set(edge.from, newDist);
        previous.set(edge.from, edge);
        if (!queue.includes(edge.from)) {
          queue.push(edge.from);
        }
      }
    }
  }

  // Восстановление пути
  if (!previous.has(toId)) return [];

  const path: EntityEdge[] = [];
  let current = toId;
  while (current !== fromId) {
    const edge = previous.get(current);
    if (!edge) break;
    path.unshift(edge);
    // Определяем предыдущий узел
    current = edge.from === current ? edge.to : edge.from;
  }

  return path;
}

// ---------------------------------------------------------------------------
// 5. Authority Propagation Model
// ---------------------------------------------------------------------------

/** Authority decay by depth level */
export const AUTHORITY_DECAY = {
  hub: 1.0,       // Hub pages transmit full authority
  component: 0.8, // Component pages receive 80% from hub
  analog: 0.6,    // Analog pages receive 60% from component
  rfq: 0.9,       // RFQ pages receive 90% (money page)
  brand: 0.7,     // Brand pages receive 70%
  info: 0.3,      // Info pages receive 30%
} as const;

/** Compute entity centrality score (0–100) based on:
 *  - number of incoming edges (higher = more central)
 *  - authority weight of connected entities
 *  - commercial intent level
 */
export function computeCentralityScore(entityId: string): number {
  const incomingEdges = entityEdges.filter(e => e.to === entityId);
  const outgoingEdges = entityEdges.filter(e => e.from === entityId);
  const node = nodeMap.get(entityId);
  if (!node) return 0;

  const edgeScore = (incomingEdges.length * 3 + outgoingEdges.length * 1);
  const weightScore = node.authorityWeight / 100;
  const intentMultiplier = node.commercialIntent === 'high' ? 1.5 : node.commercialIntent === 'medium' ? 1.0 : 0.7;

  return Math.min(100, Math.round(edgeScore * weightScore * intentMultiplier * 5));
}

/** Compute propagated authority score for a hub page */
export function computeHubAuthority(hubSlug: string): number {
  const hub = hubPages.find(h => h.slug === hubSlug);
  if (!hub) return 0;

  const targetEntities = hub.targetEntityIds.map(id => nodeMap.get(id)).filter(Boolean) as EntityNode[];
  const avgWeight = targetEntities.reduce((sum, n) => sum + (n.authorityWeight ?? 0), 0) / (targetEntities.length || 1);
  const avgCentrality = targetEntities.reduce((sum, n) => sum + computeCentralityScore(n.id), 0) / (targetEntities.length || 1);

  return Math.min(100, Math.round((avgWeight * 0.6 + avgCentrality * 0.4)));
}

/** Get the depth-based authority decay factor for a page type */
export function getAuthorityDecay(pageType: keyof typeof AUTHORITY_DECAY): number {
  return AUTHORITY_DECAY[pageType];
}

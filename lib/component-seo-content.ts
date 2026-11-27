// lib/component-seo-content.ts
// Programmatic SEO content generator for /component/[sku] pages.
// Generates unique 500-800 char descriptions for each component based on its data.
// This is the key to ranking 50K+ pages in Yandex long-tail search.

export type ComponentData = {
  sku: string;
  name: string;
  brand: string;
  category: string;
  description: string;
  status: string;
  analogs: string[] | null;
};

// Category-specific context paragraphs
const CATEGORY_CONTEXT: Record<string, string> = {
  'Микроконтроллеры': 'Микроконтроллер — программируемое устройство для управления электронными системами. Применяется в промышленной автоматике, IoT-устройствах, бытовой технике, медицинском оборудовании. Для импортозамещения sanctions-серий STM32 рекомендуем аналоги GD32 (Gigadevice), HK32 (HKC), CH32 (WCH) с pin-to-pin совместимостью.',
  'ПЛИС (FPGA)': 'Программируемая логическая интегральная схема (ПЛИС/FPGA) — для параллельной обработки сигналов, высокоскоростных интерфейсов, криптографии. После санкций 2022 года прямые поставки Xilinx и Intel ограничены — предлагаем аналоги Gowin Arora и Efinix Trion с поддержкой миграции HDL-кода.',
  'Транзисторы': 'Транзисторы (MOSFET, IGBT, биполярные) — силовые ключи для источников питания, инверторов, мотор-драйверов. Поставляем от Infineon OptiMOS, ST MDmesh, onsemi Super-Junction с Rds(on) от 1 мОм. Для EOL-серий подбираем современные аналоги с сохранением электрических параметров.',
  'Конденсаторы': 'Конденсаторы (керамические MLCC, танталовые, полимерные) — для фильтрации питания, развязки, хранения заряда. Каталог включает Murata, KEMET, AVX, Panasonic с диапазоном от 0.1 пФ до 100 мФ. Все компоненты хранятся в ESD-зоне с контролем влажности.',
  'АЦП/ЦАП': 'АЦП и ЦАП — аналого-цифровые и цифро-аналоговые преобразователи для измерительных систем, аудиоустройств, управления напряжением. Поставляем от Analog Devices (AD7689, AD7124), Texas Instruments (ADS8688, DAC8568). Для sanctions-серий подбираем кросс-референсы с pin-to-pin совместимостью.',
  'Резисторы': 'Резисторы (SMD, выводные, прецизионные) — для ограничения тока, делителей напряжения, подтяжки. Каталог от Yageo, Bourns, Vishay с допуском от 0.1% и мощностью от 0.05 Вт до 5 Вт. Поставляем в Tape & Reel упаковке для автоматического монтажа.',
  'Диоды': 'Диоды (выпрямительные, Шоттки, стабилитроны, TVS) — для выпрямления, защиты, стабилизации напряжения. Каталог от ST, ON Semiconductor, Vishay с диапазоном токов от 0.1 А до 100 А. Для EOL-серий подбираем аналоги с теми же электрическими параметрами.',
  'Операционные усилители': 'Операционные усилители (ОУ) — для усиления сигналов, фильтрации, сравнения. Каталог от Analog Devices (AD8512, AD8422), Texas Instruments (OPA2134, LM358), NE5532. Подбираем аналоги с учетом noise, offset, bandwidth для каждого применения.',
  'Стабилизаторы': 'Стабилизаторы (LDO линейные, импульсные DC-DC) — для питания электронных схем с стабильным выходным напряжением. Поставляем от Texas Instruments (TPS, LM), Analog Devices (LTC), Monolithic Power. Для sanctions-серий подбираем аналоги с тем же dropout и током.',
  'Датчики': 'Датчики (температуры, давления, ускорения, освещённости) — для измерения физических параметров. Каталог от Bosch, ST, ADI, Sensirion с цифровыми и аналоговыми интерфейсами (I2C, SPI, 1-Wire). Для IoT-применений — низкопотребляющие варианты.',
  'Разъёмы': 'Разъёмы (Board-to-Board, Wire-to-Board, RF, USB) — для подключения модулей и кабелей. Каталог от TE Connectivity, Molex, Amphenol, JST с шагом от 0.5 мм до 5.0 мм. Поставляем в Tray и Tape & Reel упаковке для SMD-монтажа.',
  'Индуктивности': 'Индуктивности и дроссели — для фильтрации EMI, DC-DC преобразователей, накопления энергии. Каталог от Wurth Elektronik, Coilcraft, Bourns с диапазоном от 1 µH до 10 mH и токами до 50 A. Для силовых применений — shielded-варианты.',
  'Оптоэлектроника': 'Оптоэлектроника (оптопары, оптореле, LED, фотодиоды) — для гальванической развязки, индикации, оптических датчиков. Каталог от Vishay, Broadcom, Toshiba с напряжением изоляции до 5 kV. Для медицинских применений — IEC 60601 сертифицированные.',
  'Память': 'Память (EEPROM, Flash, FRAM, SRAM) — для хранения данных и программ. Каталог от Microchip (24LC), ST (M95), Fujitsu (MB85 FRAM), ISSI. FRAM — энергонезависимая память с 10^12 циклов записи, идеально для счётчиков и логгеров.',
  'Логика': 'Логические микросхемы (буферы, шифраторы, мультиплексоры) — для построения цифровых схем. Каталог от Texas Instruments (74HC, 74LVC), NXP (74HCT). Для EOL-серий подбираем аналоги из доступных регионов (TI, Nexperia).',
  'Интерфейсы': 'Интерфейсные микросхемы (RS-485, CAN, USB-UART, Ethernet PHY) — для связи между устройствами. Каталог от Texas Instruments, Maxim, WCH (CH340/CH348). Для sanctions-серий подбираем аналоги с теми же протоколами и скоростями.',
  'Питание': 'Источники питания (DC-DC модули, AC-DC, LDO) — для питания электронных устройств. Каталог от Mean Well, CUI, Recom с мощностью от 1 Вт до 500 Вт. Для промышленных применений — с расширенным температурным диапазоном.',
  'Реле': 'Реле (электромеханические, твердотельные) — для коммутации силовых цепей. Каталог от Omron, Fujitsu, Mean Well с током от 1 А до 40 А. Для промышленной автоматики — реле с долгим сроком службы (10^7 циклов).',
  'Предохранители': 'Предохранители (плавкие, самовосстанавливающиеся) — для защиты от перегрузки по току. Каталог от Littelfuse, Bourns, Schurter с током от 0.1 А до 30 А. Для automotive — AEC-Q200 сертифицированные.',
  'Кварцы и резонаторы': 'Кварцы и резонаторы — для тактирования микроконтроллеров и микросхем. Каталог от Abracon, Kyocera, NDK с частотой от 32.768 kHz до 100 MHz. Для прецизионных применений — TCXO и OCXO.',
  'Переключатели': 'Переключатели (кнопки, тумблеры, DIP) — для пользовательского ввода и настройки. Каталог от ALPS, Omron, C&K с ресурсом от 10 000 до 1 000 000 циклов. Для industrial — IP67 герметичные.',
  'Фильтры': 'Фильтры (EMI, LC, керамические) — для подавления помех. Каталог от Murata, TDK, Wurth Elektronik с частотой среза от 1 kHz до 10 GHz. Для medical — IEC 60601-1-2 совместимые.',
  'Трансформаторы': 'Трансформаторы — для гальванической развязки и преобразования напряжения. Каталог от Wurth Elektronik, Coilcraft, Pulse с мощностью от 1 Вт до 100 Вт. Для Flyback — с зазором в сердечнике.',
  'Модули и платы': 'Модули и отладочные платы — для прототипирования и быстрого запуска. Каталог от Espressif (ESP32), ST (Nucleo), Sipeed (Gowin). Для серийных проектов — модули с долгосрочной доступностью.',
  'Монтаж и аксессуары': 'Монтажные принадлежности (радиаторы, термопрокладки, винты) — для сборки электронных устройств. Каталог от Aavid, Wakefield, 3M. Для силовых компонентов — радиаторы с Rth от 0.5°C/W.',
  'Кабели и провода': 'Кабели и провода — для подключения питания и сигналов. Каталог от TE, Molex, Belden с сечением от 0.05 мм² до 6 мм². Для industrial — с маслостойкой изоляцией.',
  'Телекоммуникации': 'Телекоммуникационные компоненты (трансиверы, модули связи) — для передачи данных. Каталог от Maxim, Silicon Labs, WCH. Для IoT — LoRa, BLE, NB-IoT модули.',
  'Электроавтоматика': 'Электроавтоматика (автоматические выключатели, контакторы, УЗО) — для защиты цепей. Каталог от ABB, Siemens, Schneider. Для промышленных применений — с характеристикой C/D.',
  'Прочие компоненты': 'Прочие электронные компоненты — различные компоненты, не вошедшие в основные категории. Каталог включает разъёмы, контакты, клеммы, держатели. Все компоненты проверяются в лаборатории СВП.',
};

// Brand-specific context
const BRAND_CONTEXT: Record<string, string> = {
  'STMicroelectronics': 'STMicroelectronics (ST) — один из ведущих производителей полупроводников. После санкций 2022 года прямые поставки ограничены, ChipNet поставляет через параллельный импорт и предлагает аналоги GD32, HK32.',
  'Texas Instruments': 'Texas Instruments (TI) — крупнейший производитель аналоговых и встраиваемых процессоров. Прямые поставки ограничены, поставляем через партнёров в Гонконге и Турции.',
  'Analog Devices': 'Analog Devices (ADI) — ведущий производитель высокоточных аналоговых микросхем. Поставляем через параллельный импорт, для sanctions-серий подбираем кросс-референсы от TI.',
  'Xilinx': 'Xilinx (ныне AMD) — лидер в производстве FPGA. Прямые поставки прекращены, предлагаем аналоги Gowin Arora и Efinix Trion с поддержкой миграции.',
  'Intel/Altera': 'Intel (Altera) — производитель FPGA Cyclone, Arria, Stratix. Поставляем через параллельный импорт, для EOL-серий — Efinix Trion.',
  'Lattice': 'Lattice Semiconductor — производитель low-power FPGA (iCE40, ECP5, MachXO). Поддерживает open-source toolchain (Yosys + nextpnr).',
  'Gowin': 'Gowin Semiconductor — китайский производитель FPGA, аналог Xilinx Spartan/Artix. Поддержка через Gowin EDA и Yosys.',
  'Gigadevice': 'Gigadevice — производитель микроконтроллеров GD32, прямой аналог STM32. Pin-to-pin совместимость 95-100%.',
  'Infineon': 'Infineon — производитель силовых MOSFET (OptiMOS), IGBT, датчиков. Поставляем через параллельный импорт.',
  'Murata': 'Murata — производитель конденсаторов (MLCC), фильтров, модулей связи. Поставляем через authorised distributors.',
  'NXP': 'NXP — микроконтроллеры LPC, Kinetis, i.MX, CAN/LIN трансиверы. Поставляем через параллельный импорт.',
  'Microchip': 'Microchip — микроконтроллеры PIC, ATmega, SAM, память EEPROM. Поставляем через партнёров.',
  'onsemi': 'ON Semiconductor (onsemi) — силовые MOSFET, IGBT, датчики изображения. Поставляем через параллельный импорт.',
  'Vishay': 'Vishay — резисторы, конденсаторы, диоды, MOSFET. Поставляем через authorised distributors.',
  'Wurth Elektronik': 'Wurth Elektronik — индуктивности, разъёмы, ЭМС-компоненты. Authorised Partner ChipNet с 2020 года.',
};


// ───────────────────────────────────────────────────────────────────────────────
// Parameter parsers — extract technical specs from SKU/name for dynamic Title/H1
// ───────────────────────────────────────────────────────────────────────────────

/**
 * Parse LUT count from component name/SKU for FPGA pages.
 * @example "XC7A35T" → 33280, "GW2A-18" → 18000, "EP4CE10" → 10320
 */
export function parseLutCount(sku: string, name: string): number | null {
  const text = `${sku} ${name}`;
  
  // Xilinx Artix-7: XC7A35T=33280, XC7A50T=52160, XC7A75T=75840, XC7A100T=101440, XC7A200T=215360
  const xilinxArtix: Record<string, number> = {
    'XC7A12': 12000, 'XC7A15': 16640, 'XC7A25': 23200, 'XC7A35': 33280,
    'XC7A50': 52160, 'XC7A75': 75840, 'XC7A100': 101440, 'XC7A200': 215360,
  };
  for (const [prefix, luts] of Object.entries(xilinxArtix)) {
    if (text.toUpperCase().includes(prefix)) return luts;
  }
  
  // Xilinx Spartan-6: XC6SLX9=9152, XC6SLX16=14579, XC6SLX25=24051, XC6SLX45=43661, XC6SLX75=74662, XC6SLX100=101261
  const spartan6: Record<string, number> = {
    'XC6SLX9': 9152, 'XC6SLX16': 14579, 'XC6SLX25': 24051,
    'XC6SLX45': 43661, 'XC6SLX75': 74662, 'XC6SLX100': 101261,
  };
  for (const [prefix, luts] of Object.entries(spartan6)) {
    if (text.toUpperCase().includes(prefix)) return luts;
  }
  
  // Gowin: GW1N-1=1152, GW1N-2=2304, GW1N-4=4608, GW2A-18=18000, GW2A-55=55000, GW5A-25=25600
  const gowin: Record<string, number> = {
    'GW1N-1': 1152, 'GW1N-2': 2304, 'GW1N-4': 4608, 'GW1N-9': 9216,
    'GW2A-18': 18000, 'GW2A-55': 55000, 'GW5A-25': 25600,
  };
  for (const [prefix, luts] of Object.entries(gowin)) {
    if (text.toUpperCase().includes(prefix)) return luts;
  }
  
  // Intel/Altera Cyclone IV: EP4CE6=6272, EP4CE10=10320, EP4CE15=15408, EP4CE22=22320, EP4CE40=39600, EP4CE55=55856, EP4CE75=75408, EP4CE115=114480
  const cyclone4: Record<string, number> = {
    'EP4CE6': 6272, 'EP4CE10': 10320, 'EP4CE15': 15408,
    'EP4CE22': 22320, 'EP4CE40': 39600, 'EP4CE55': 55856,
    'EP4CE75': 75408, 'EP4CE115': 114480,
  };
  for (const [prefix, les] of Object.entries(cyclone4)) {
    if (text.toUpperCase().includes(prefix)) return les;
  }
  
  // Intel Cyclone V: 5CEA2=25000, 5CEA4=49000, 5CEA5=77000, 5CEA7=149500, 5CEA9=301000
  const cyclone5: Record<string, number> = {
    '5CEA2': 25000, '5CEA4': 49000, '5CEA5': 77000,
    '5CEA7': 149500, '5CEA9': 301000,
  };
  for (const [prefix, les] of Object.entries(cyclone5)) {
    if (text.toUpperCase().includes(prefix)) return les;
  }
  
  // Lattice ECP5: LFE5U-12=12000, LFE5U-25=24000, LFE5U-45=44000, LFE5U-85=84000
  const ecp5: Record<string, number> = {
    'LFE5U-12': 12000, 'LFE5U-25': 24000, 'LFE5U-45': 44000, 'LFE5U-85': 84000,
  };
  for (const [prefix, luts] of Object.entries(ecp5)) {
    if (text.toUpperCase().includes(prefix)) return luts;
  }
  
  // Generic: look for "LUT" in name
  const lutMatch = text.match(/(\d+)\s*K?\s*LUT/i);
  if (lutMatch) return parseInt(lutMatch[1]) * (lutMatch[0].toUpperCase().includes('K') ? 1000 : 1);
  
  // Generic: look for "LE" (Logic Elements)
  const leMatch = text.match(/(\d+)\s*K?\s*LE/i);
  if (leMatch) return parseInt(leMatch[1]) * (leMatch[0].toUpperCase().includes('K') ? 1000 : 1);
  
  return null;
}

/**
 * Parse ADC/DAC resolution (bits) from component name/SKU.
 * @example "AD7190 24-bit" → 24, "ADS1115 12-bit" → 12
 */
export function parseResolution(sku: string, name: string): number | null {
  const text = `${sku} ${name}`;
  
  // Match "16-bit", "24-bit", "12 bit", "8bit"
  const match = text.match(/(\d{1,2})\s*-?\s*bit/i);
  if (match) return parseInt(match[1]);
  
  // Match known ADC/DAC prefixes
  const adcMap: Record<string, number> = {
    'ADS1115': 16, 'ADS1118': 16, 'ADS1220': 24, 'ADS1256': 24, 'ADS7953': 12,
    'AD7190': 24, 'AD7124': 24, 'AD7689': 16, 'AD7606': 16, 'AD9220': 12,
    'MCP3208': 12, 'MCP3008': 10, 'MCP3424': 18, 'MCP4725': 12, 'MCP4921': 12,
    'MAX11200': 24, 'MAX11615': 12, 'MAX5812': 12,
    'DAC8568': 16, 'DAC8581': 16, 'DAC7578': 12, 'LTC2630': 12,
  };
  for (const [prefix, bits] of Object.entries(adcMap)) {
    if (text.toUpperCase().includes(prefix)) return bits;
  }
  
  return null;
}

/**
 * Parse interface type from component name/category for Interface pages.
 * @example "RS-485", "USB-UART", "CAN", "Ethernet PHY"
 */
export function parseInterfaceType(name: string, category: string): string | null {
  const text = `${name} ${category}`;
  
  if (text.match(/RS-?485/i)) return 'RS-485';
  if (text.match(/RS-?232/i)) return 'RS-232';
  if (text.match(/CAN\s*(bus|controller|transceiver)?/i)) return 'CAN';
  if (text.match(/USB\s*-?\s*UART|USB\s+to\s+UART/i)) return 'USB-UART';
  if (text.match(/Ethernet\s*PHY|Ethernet\s*controller/i)) return 'Ethernet PHY';
  if (text.match(/I2C|I²C/i)) return 'I2C';
  if (text.match(/SPI\b/i)) return 'SPI';
  if (text.match(/LIN\s*bus/i)) return 'LIN';
  if (text.match(/Modbus/i)) return 'Modbus';
  
  return null;
}

/**
 * Parse package type from component name/SKU.
 * @example "LQFP48", "QFN-32", "SOIC-8", "BGA-256"
 */
export function parsePackage(sku: string, name: string): string | null {
  const text = `${sku} ${name}`;
  
  const match = text.match(/\b(LQFP|QFP|QFN|BGA|SOIC|TSSOP|SSOP|SOT-?23|SOT-?223|TO-?220|TO-?252|DFN|MSOP|TQFP|VQFN)\s*[-]?(\d{2,4})?\b/i);
  if (match) {
    const pkg = match[1].toUpperCase().replace('-', '');
    const pins = match[2] || '';
    return pins ? `${pkg}${pins}` : pkg;
  }
  
  return null;
}

/**
 * Generate enhanced Title for a component page.
 * Uses parsed parameters for better search relevance.
 */
export function generateComponentTitle(component: ComponentData): string {
  const { sku, brand, name, category, status } = component;
  const isEOL = status === 'EOL';
  
  // FPGA: add LUT count
  if (category === 'ПЛИС (FPGA)') {
    const luts = parseLutCount(sku, name);
    const lutStr = luts ? ` ${luts >= 1000 ? (luts / 1000) + 'K' : luts} LUT` : '';
    return isEOL
      ? `${sku} (${brand}) — аналоги FPGA${lutStr}, замена EOL`
      : `${sku} (${brand}) — ПЛИС${lutStr}: даташит, аналоги, toolchain`;
  }
  
  // ADC/DAC: add resolution
  if (category === 'АЦП/ЦАП') {
    const bits = parseResolution(sku, name);
    const bitStr = bits ? `${bits}bit ` : '';
    return isEOL
      ? `${sku} (${brand}) — аналоги ${bitStr}ADC/DAC, замена EOL`
      : `${sku} (${brand}) — ${bitStr}АЦП/ЦАП: даташит, аналоги`;
  }
  
  // Interfaces: add interface type
  if (category === 'Интерфейсы') {
    const iface = parseInterfaceType(name, category);
    const ifaceStr = iface ? `${iface} ` : '';
    return isEOL
      ? `${sku} (${brand}) — ${ifaceStr}аналоги, замена`
      : `${sku} (${brand}) — ${ifaceStr}трансивер: аналоги, даташит`;
  }
  
  // Default
  return isEOL
    ? `${sku} (${brand}) — аналоги, замена EOL`
    : `${sku} (${brand}) — ${category}: даташит, аналоги, под заказ`;
}

/**
 * Generate unique SEO-optimized content for a component page.
 * Returns 500-800 characters of unique text based on component data.
 */
export function generateComponentSeoContent(component: ComponentData): string {
  const { sku, name, brand, category, status, analogs, description } = component;
  const isEOL = status === 'EOL';
  const isNRND = status === 'NRND';

  // 1. Opening sentence — unique per component
  const opening = `${sku} от ${brand} — ${name.toLowerCase()}. ${description || ''}`;

  // 2. Category context (unique per category, 30 categories)
  const categoryText = CATEGORY_CONTEXT[category] || `${category} — компонент для промышленной электроники. Поставка под заказ от 1 шт. с проверкой в лаборатории СВП.`;

  // 3. Brand context (unique per brand, 60+ brands)
  const brandText = BRAND_CONTEXT[brand] || `${brand} — производитель электронных компонентов. ChipNet поставляет продукцию ${brand} через проверенных партнёров.`;

  // 4. Status-specific text
  let statusText = '';
  if (isEOL) {
    statusText = `Компонент ${sku} снят с производства (EOL). ChipNet предлагает подбор современных аналогов с pin-to-pin совместимостью, инженерную поддержку миграции и пилотные образцы для тестирования.`;
    if (analogs && analogs.length > 0) {
      statusText += ` Рекомендуемые аналоги: ${analogs.join(', ')}.`;
    }
  } else if (isNRND) {
    statusText = `Компонент ${sku} не рекомендуется для новых проектов (NRND). Рекомендуем рассмотреть актуальные аналоги из той же категории.`;
  } else {
    statusText = `Компонент ${sku} в производстве. Поставка под заказ от 1 шт., срок 5-30 дней. Безналичный расчёт с НДС, отсрочка платежа до 30 дней для постоянных клиентов.`;
  }

  // 5. Supply terms (same for all, but contextual)
  const supplyText = `Каждая партия проходит входной контроль в аккредитованной лаборатории СВП: рентген, декэпсуляция, электрические тесты. Доставка по России — СДЭК, DPD, от 6 рабочих дней. Гарантия 12 месяцев.`;

  // Combine all parts — total ~600-900 chars
  return `${opening} ${categoryText} ${brandText} ${statusText} ${supplyText}`;
}

/**
 * Generate a list of FAQ items for the component page.
 * Returns 3-5 Q&A pairs based on component data.
 */
export function generateComponentFaqs(component: ComponentData): { q: string; a: string }[] {
  const { sku, brand, category, status, analogs } = component;
  const isEOL = status === 'EOL';
  const faqs: { q: string; a: string }[] = [];

  // FAQ 1: Availability
  if (isEOL) {
    faqs.push({
      q: `Можно ли купить ${sku} в 2026 году?`,
      a: `${sku} снят с производства (EOL). ChipNet предлагает подбор современных аналогов с pin-to-pin совместимостью${analogs && analogs.length > 0 ? `. Рекомендуемые замены: ${analogs.join(', ')}` : ''}. Все аналоги проверяются в лаборатории СВП.`,
    });
  } else {
    faqs.push({
      q: `Как заказать ${sku}?`,
      a: `Отправьте заявку через форму на сайте, по email info@chip-net.ru или телефону +7-910-321-91-91. Менеджер подготовит КП в течение 1-2 часов. Поставка ${sku} от 1 шт., срок 5-30 дней.`,
    });
  }

  // FAQ 2: Price
  faqs.push({
    q: `Сколько стоит ${sku}?`,
    a: `Цена ${sku} зависит от объёма заказа и канала поставки. Для расчёта стоимости отправьте заявку — менеджер подготовит индивидуальное коммерческое предложение. Для серийных проектов действуют специальные цены и отсрочка платежа до 30 дней.`,
  });

  // FAQ 3: Authenticity
  faqs.push({
    q: `Как проверить оригинальность ${sku}?`,
    a: `Каждая партия ${sku} проходит 5-ступенчатую проверку в аккредитованной лаборатории СВП: визуальный осмотр под микроскопом, рентгеновский контроль, декэпсуляция, электрические тесты, функциональное тестирование. По результатам выдаём сертификат.`,
  });

  // FAQ 4: Analog (if EOL or has analogs)
  if (analogs && analogs.length > 0) {
    faqs.push({
      q: `Чем заменить ${sku}?`,
      a: `Рекомендуемые аналоги для ${sku}: ${analogs.join(', ')}. Каждый аналог проверяется на электрическую совместимость с оригиналом. ChipNet предоставляет пилотные образцы для тестирования и инженерную поддержку миграции.`,
    });
  }

  // FAQ 5: Delivery
  faqs.push({
    q: `Какие сроки доставки ${sku}?`,
    a: `Доставка ${sku} по России — 1-5 рабочих дней (СДЭК, DPD). Самовывоз со склада в Москве. Международная доставка — DHL, FedEx (3-7 дней). Для серийных проектов — резервирование складских позиций на 6-12 месяцев.`,
  });

  return faqs;
}

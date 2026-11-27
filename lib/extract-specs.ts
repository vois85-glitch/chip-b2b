// lib/extract-specs.ts
// Автоматическое извлечение технических параметров компонента
// из артикула (SKU), названия, описания и категории.
// Использует part-numbering схемы производителей (STM32, GRM, CRCW, 1N, BZX и т.д.).
// Покрывает топ-15 категорий каталога (~90% позиций).
//
// Для популярных реальных компонентов есть курируемая БД полных параметров
// (lib/full-specs-db.ts) — она проверяется ПЕРВЫМ шагом.

import { lookupFullSpecs } from './full-specs-db';

export type Spec = { label: string; value: string };

type Component = {
  sku: string;
  name?: string;
  brand?: string;
  category?: string;
  description?: string;
};

// ───────────────────────────────────────────────────────────────────────────────
// Генерация номенклатурного номера
// Детерминированный 10-значный код: ПРЕФИКС_КАТЕГОРИИ (2) + хеш SKU (8)
// ───────────────────────────────────────────────────────────────────────────────

const CATEGORY_PREFIXES: Record<string, string> = {
  'Микроконтроллеры': '01',
  'ПЛИС (FPGA)': '02',
  'Микросхемы': '03',
  'Логика': '04',
  'Операционные усилители': '05',
  'АЦП/ЦАП': '06',
  'Память': '07',
  'Интерфейсы': '08',
  'Стабилизаторы': '09',
  'Питание': '10',
  'Транзисторы': '11',
  'Диоды': '12',
  'Конденсаторы': '13',
  'Резисторы': '14',
  'Индуктивности': '15',
  'Кварцы и резонаторы': '16',
  'Фильтры': '17',
  'Реле': '18',
  'Оптоэлектроника': '19',
  'Датчики': '20',
  'Переключатели': '21',
  'Разъёмы': '22',
  'Предохранители': '23',
  'Электроавтоматика': '24',
  'Трансформаторы': '25',
  'Кабели и провода': '26',
  'Монтаж и аксессуары': '27',
  'Телекоммуникации': '28',
  'LED драйверы': '29',
  'Модули и платы': '30',
  'Прочие компоненты': '99',
};

/**
 * Детерминированный хеш строки → 8-значное число.
 * Алгоритм: простой DJB2 hash, обрезанный до 8 цифр (10_000_000…99_999_999).
 */
function hashSkuToNumber(sku: string): number {
  const s = sku.toUpperCase().trim();
  let h = 5381;
  for (let i = 0; i < s.length; i++) {
    h = ((h << 5) + h) + s.charCodeAt(i);  // h * 33 + c
    h = h & 0xFFFFFFFF;  // 32-bit
  }
  // Преобразовать в положительное число 8 разрядов (10_000_000…99_999_999)
  const n = Math.abs(h);
  return 10_000_000 + (n % 90_000_000);
}

/**
 * Генерирует 10-значный номенклатурный номер:
 * 2 цифры = префикс категории + 8 цифр = хеш SKU.
 * Один и тот же SKU всегда даёт один и тот же номер.
 */
export function generateNomenclatureNumber(sku: string, category: string = ''): string {
  if (!sku) return '';
  const cat = (category || '').trim();
  const prefix = CATEGORY_PREFIXES[cat] || '99';
  const hash = hashSkuToNumber(sku);
  return `${prefix}${hash}`;
}

// ───────────────────────────────────────────────────────────────────────────────
// Утилиты
// ───────────────────────────────────────────────────────────────────────────────

const DEG = '°';  // символ градуса
const OHM = 'Ω';  // символ ома
const MICRO = 'µ'; // символ микро
const PLUSMINUS = '±';

function up(s: string): string {
  return (s || '').toUpperCase();
}

/** Извлечь первое число с плавающей точкой из строки */
function matchNum(s: string, pattern: RegExp): string | null {
  const m = s.match(pattern);
  return m ? m[1] : null;
}

/** Определение типа монтажа (SMD/TH) */
function detectMounting(sku: string, name: string, category: string): string {
  const t = up(`${sku} ${name} ${category}`);
  if (/SMD|0402|0603|0805|1206|1210|2010|2512|QFN|QFP|DFN|BGA|LQFP|TQFP|SOT-?23|SOT-?223|SOT-?323|SOIC|TSSOP|SSOP|MSOP/.test(t)) {
    return 'SMD';
  }
  if (/DIP|TO-?220|TO-?92|TO-?247|TO-?252|DO-?41|DO-?15|DO-?201|HC-?49|THT|THROUGH|ВЫВОДНОЙ|ВЫВОДНАЯ/.test(t)) {
    return 'THT';
  }
  // По умолчанию для типичных SMD-категорий
  if (/Резисторы|Конденсаторы|Индуктивности|Диоды|Транзисторы|Логика|Микросхемы|Микроконтроллеры|Операционные усилители|АЦП/.test(category)) {
    return 'SMD';
  }
  return '—';
}

/** Определение типа корпуса (для поля Package) */
function detectPackage(sku: string, name: string): string {
  const t = up(`${sku} ${name}`);
  // Транзисторы/стабилизаторы
  if (/SOT-?23\b|SOT23\b|MMBT/.test(t)) return 'SOT-23';
  if (/SOT-?223|SOT223/.test(t)) return 'SOT-223';
  if (/TO-?252|DPAK|TO252/.test(t)) return 'TO-252 (DPAK)';
  if (/TO-?247|TO247/.test(t)) return 'TO-247';
  if (/TO-?220|TO220/.test(t)) return 'TO-220';
  if (/TO-?92|TO92|TIP\d/.test(t)) return 'TO-247/TO-92';
  if (/TO-?3P|TO3P/.test(t)) return 'TO-3P';
  // Диоды
  if (/DO-?41|DO41|1N400|1N540|1N5400/.test(t)) return 'DO-41';
  if (/DO-?15|DO15/.test(t)) return 'DO-15';
  if (/DO-?201|DO201|1N5400|1N5820|1N5821|1N5822/.test(t)) return 'DO-201AD';
  if (/SMA\b|SMB\b|SMC\b|SOD-?123|SOD-?323|SOD-?523/.test(t)) return 'SMA/SMB/SMC';
  if (/KBPC|KBU|KBP|GBL|GBJ/.test(t)) return 'Bridge';
  // Корпуса ИС
  if (/BGA|FBGA/.test(t)) return 'BGA';
  if (/\bQFN\b|\bDFN\b|\bMLF\b|VQFN|WQFN/.test(t)) return 'QFN/DFN';
  if (/\bLQFP\b|\bTQFP\b|\bQFP\b/.test(t)) return 'LQFP/TQFP';
  if (/\bTSSOP\b|\bSSOP\b|\bMSOP\b|\bVSSOP\b/.test(t)) return 'TSSOP/SSOP';
  if (/\bSOIC\b|\bSOP\b|\bSO\b-?\d|MSOP/.test(t)) return 'SOIC';
  if (/\bDIP\b|\bPDIP\b|\bNDIP\b/.test(t)) return 'DIP';
  // SMD размеры
  if (/0201/.test(t)) return '0201';
  if (/0402/.test(t)) return '0402';
  if (/0603/.test(t)) return '0603';
  if (/0805/.test(t)) return '0805';
  if (/1206/.test(t)) return '1206';
  if (/1210/.test(t)) return '1210';
  if (/2010/.test(t)) return '2010';
  if (/2512/.test(t)) return '2512';
  if (/5050|3528|2835|3030|5630/.test(t)) return 'LED SMD';
  // Кварцы
  if (/HC-?49|HC49/.test(t)) return 'HC-49';
  if (/3225|5032|7050/.test(t)) return 'Crystal SMD';
  // Реле
  if (/HF46|HF32|HF115|G5LE|G2R|JQC/.test(t)) return 'Relay THT';
  // Разъёмы
  if (/USB/.test(t)) return 'USB';
  if (/DC-?020|DC\s?JACK/.test(t)) return 'DC Jack';
  if (/KF301|KF-|TERMINAL|КЛЕММ/.test(t)) return 'Terminal Block';
  if (/MOLEX|JST|\bPH\b|\bXH\b|\bZH\b|\bEH\b/.test(t)) return 'Molex/JST';
  // Кнопки/переключатели
  if (/B3F|SKQG|TACT/.test(t)) return 'Tactile Switch';
  if (/TOGGLE|SPDT|SPST|DPDT|MS-23/.test(t)) return 'Toggle Switch';
  if (/DIP\s?SWITCH|DIP-?SW/.test(t)) return 'DIP Switch';
  // Светодиоды
  if (/^LED-?5MM|5MM\b/.test(t)) return 'LED 5mm';
  if (/^LED-?3MM|3MM\b/.test(t)) return 'LED 3mm';
  // Дисплеи
  if (/OLED|SSD1306|SSD1309|SH1106/.test(t)) return 'OLED Display';
  if (/LCD|1602|2004|NHD-/.test(t)) return 'LCD Display';
  // Модули
  if (/WEMOS|NODEMCU|ESP32.*DEV|ESP8266.*DEV|ARDUINO|RPI\b|RASPBERRY/.test(t)) return 'Module';
  return '—';
}

/** Определение температурного диапазона по категории */
function detectTempRange(category: string, sku: string, name: string): string {
  const t = up(`${sku} ${name}`);
  // Industrial range
  if (/-I\b|-A\b|INDUSTRIAL/.test(t)) return `-40…+85${DEG}C`;
  // Extended
  if (/-E\b|EXTENDED/.test(t)) return `-40…+125${DEG}C`;
  // Automotive
  if (/-Q1|AEC-Q|AUTO/.test(t)) return `-40…+125${DEG}C (AEC-Q100)`;
  // Military
  if (/-M\b|MILITARY/.test(t)) return `-55…+125${DEG}C`;
  // Default по категории
  if (/Микроконтроллеры|Транзисторы|Диоды|Логика|Микросхемы|Стабилизаторы|Операционные/.test(category)) {
    return `-40…+85${DEG}C`;
  }
  if (/Конденсаторы|Резисторы/.test(category)) {
    return `-55…+125${DEG}C`;
  }
  return '—';
}

// ───────────────────────────────────────────────────────────────────────────────
// Экстракторы по категориям
// ───────────────────────────────────────────────────────────────────────────────

/** Микроконтроллеры */
function extractMCU(sku: string, name: string, desc: string): Spec[] {
  const specs: Spec[] = [];
  const s = up(sku);
  const t = up(name + ' ' + desc);

  // STM32 семейства
  const stm32m = s.match(/STM32([FGLHUVW])(\d)(\w+)/);
  if (stm32m) {
    const fam = stm32m[1];
    const coreMap: Record<string, string> = {
      'F': 'F' + stm32m[2] === 'F1' ? 'ARM Cortex-M3' : 'ARM Cortex-M4/M7',
      'L': 'ARM Cortex-M3 (Low Power)',
      'H': 'ARM Cortex-M7 (High Performance)',
      'G': 'ARM Cortex-M4',
      'U': 'ARM Cortex-M0+ (Ultra Low Power)',
      'W': 'ARM Cortex-M4 (Wireless)',
    };
    const core = fam === 'F' && stm32m[2] === '1' ? 'ARM Cortex-M3'
               : fam === 'F' && stm32m[2] === '0' ? 'ARM Cortex-M0'
               : fam === 'F' && (stm32m[2] === '2' || stm32m[2] === '3') ? 'ARM Cortex-M3'
               : fam === 'F' && (stm32m[2] === '4' || stm32m[2] === '7') ? 'ARM Cortex-M4F'
               : fam === 'F' && stm32m[2] === '5' ? 'ARM Cortex-M7'
               : fam === 'F' && stm32m[2] === '7' ? 'ARM Cortex-M7'
               : fam === 'L' && stm32m[2] === '0' ? 'ARM Cortex-M0+'
               : fam === 'L' && (stm32m[2] === '1' || stm32m[2] === '4' || stm32m[2] === '5') ? 'ARM Cortex-M3'
               : fam === 'L' && stm32m[2] === '4' ? 'ARM Cortex-M4'
               : fam === 'G' ? 'ARM Cortex-M4F'
               : fam === 'H' ? 'ARM Cortex-M7'
               : fam === 'U' ? 'ARM Cortex-M0+'
               : fam === 'W' ? 'ARM Cortex-M4'
               : 'ARM Cortex-M';
    specs.push({ label: 'Архитектура', value: core });
    specs.push({ label: 'Семейство', value: `STM32${fam}${stm32m[2]}` });
    // Частота
    const freqM = t.match(/(\d{2,4})\s*MHZ/);
    if (freqM) specs.push({ label: 'Тактовая частота', value: `${freqM[1]} МГц` });
  }

  // ESP32 / ESP8266
  if (/ESP32/.test(s)) {
    specs.push({ label: 'Архитектура', value: 'Xtensa LX6 (32-bit)' });
    specs.push({ label: 'Семейство', value: 'ESP32' });
    specs.push({ label: 'SoC', value: 'WiFi 802.11 b/g/n + BLE' });
    specs.push({ label: 'Тактовая частота', value: '240 МГц' });
  } else if (/ESP8266/.test(s)) {
    specs.push({ label: 'Архитектура', value: 'Xtensa LX106 (32-bit)' });
    specs.push({ label: 'Семейство', value: 'ESP8266' });
    specs.push({ label: 'SoC', value: 'WiFi 802.11 b/g/n' });
    specs.push({ label: 'Тактовая частота', value: '80 МГц' });
  }

  // AVR (ATmega, ATtiny, ATxmega)
  if (/^ATMEGA/.test(s)) {
    specs.push({ label: 'Архитектура', value: 'AVR 8-bit' });
    specs.push({ label: 'Семейство', value: 'ATmega' });
  } else if (/^ATTINY/.test(s)) {
    specs.push({ label: 'Архитектура', value: 'AVR 8-bit' });
    specs.push({ label: 'Семейство', value: 'ATtiny' });
  } else if (/ATXMEGA/.test(s)) {
    specs.push({ label: 'Архитектура', value: 'AVR 8-bit' });
    specs.push({ label: 'Семейство', value: 'ATxmega' });
  } else if (/^AVR/.test(s)) {
    specs.push({ label: 'Архитектура', value: 'AVR 8-bit' });
  }

  // PIC
  const picm = s.match(/^PIC(\d+)F/);
  if (picm) {
    const fam = picm[1];
    const arch = fam === '10' || fam === '12' ? 'PIC 8-bit (Baseline)'
               : fam === '16' ? 'PIC 8-bit (Midrange)'
               : fam === '18' ? 'PIC 8-bit (Enhanced)'
               : fam === '24' ? 'PIC16-bit (dsPIC33)'
               : fam === '32' ? 'MIPS32 M4K'
               : 'PIC';
    specs.push({ label: 'Архитектура', value: arch });
    specs.push({ label: 'Семейство', value: `PIC${fam}F` });
  }

  // GD32 (китайский аналог STM32)
  if (/GD32/.test(s)) {
    specs.push({ label: 'Архитектура', value: 'ARM Cortex-M3/M4' });
    specs.push({ label: 'Семейство', value: 'GD32' });
  }

  // CH32 (WCH)
  if (/CH32/.test(s)) {
    specs.push({ label: 'Архитектура', value: 'RISC-V 32-bit' });
    specs.push({ label: 'Семейство', value: 'CH32' });
  }

  // i.MX (NXP)
  if (/I\.MX/.test(t) || /IMX/.test(s)) {
    specs.push({ label: 'Архитектура', value: 'ARM Cortex-A' });
    specs.push({ label: 'Семейство', value: 'i.MX' });
  }

  // RP2040 (Raspberry Pi)
  if (/RP2040|RP2350/.test(s)) {
    specs.push({ label: 'Архитектура', value: 'ARM Cortex-M0+/M33 (dual-core)' });
    specs.push({ label: 'Семейство', value: 'RP2040/RP2350' });
  }

  // Общее: Flash/RAM из описания
  const flashM = t.match(/(\d+)\s*(KB|MB)\s*FLASH/);
  if (flashM) specs.push({ label: 'Flash-память', value: `${flashM[1]} ${flashM[2]}` });
  const ramM = t.match(/(\d+)\s*(KB|MB)\s*RAM/);
  if (ramM) specs.push({ label: 'RAM', value: `${ramM[1]} ${ramM[2]}` });

  return specs;
}

/** Конденсаторы */
function extractCapacitor(sku: string, name: string, desc: string): Spec[] {
  const specs: Spec[] = [];
  const t = up(`${sku} ${name} ${desc}`);

  // GRM/MLCC: GRM188R71H104KA93D
  const grmm = sku.toUpperCase().match(/GRM(\d{4})([A-Z])(\d)([A-Z0-9])(\d+)([A-Z])(\d+)/);
  if (grmm) {
    const sizeMap: Record<string, string> = {
      '0201': '0.6×0.3 мм',
      '0402': '1.0×0.5 мм',
      '0603': '1.6×0.8 мм',
      '0805': '2.0×1.25 мм',
      '1206': '3.2×1.6 мм',
      '1210': '3.2×2.5 мм',
      '1812': '4.5×3.2 мм',
      '1825': '4.5×6.4 мм',
      '2220': '5.7×5.0 мм',
    };
    const size = grmm[1];
    if (sizeMap[size]) specs.push({ label: 'Размер', value: `${size} (${sizeMap[size]})` });
    // Dielectric
    const dieMap: Record<string, string> = {
      '5': 'C0G (NP0)',
      '7': 'X7R',
      '6': 'X5R',
      '8': 'X7S',
      '9': 'X7T',
    };
    if (dieMap[grmm[3]]) specs.push({ label: 'Диэлектрик', value: dieMap[grmm[3]] });
  }

  // Электролитические: UPW2200M6.3_16x25, EEU-...
  const elecM = sku.match(/(\d+)([MmКкUuНнµμ])(\d+(?:\.\d+)?V)?[_-]?(\d+x\d+)/);
  // Альтернативно: ищем напрямую в артикуле
  const capM = sku.match(/(\d{1,5})[Mm]([0-9.]+)V/i);
  if (capM) {
    const v = parseFloat(capM[2]);
    specs.push({ label: 'Ёмкость', value: `${capM[1]} ${MICRO}Ф` });
    specs.push({ label: 'Напряжение', value: `${v} В` });
  }
  // Извлечение из UPW2200M6.3
  const upwm = sku.match(/(\d{3,5})[Mm]([0-9.]+)/);
  if (upwm && !capM) {
    specs.push({ label: 'Ёмкость', value: `${upwm[1]} ${MICRO}Ф` });
    specs.push({ label: 'Напряжение', value: `${upwm[2]} В` });
  }
  // Размеры из SKU типа _16x25
  const dimM = sku.match(/[_-]?(\d{2,3})x(\d{2,3})/);
  if (dimM) {
    specs.push({ label: 'Габариты', value: `${dimM[1]}×${dimM[2]} мм` });
  }

  // GRM XXX pF: GRM1210C0G220pF500
  const pfM = sku.match(/(\d+(?:\.\d+)?)[Pp][Ff](\d{2,3})/);
  if (pfM) {
    specs.push({ label: 'Ёмкость', value: `${pfM[1]} пФ` });
    specs.push({ label: 'Напряжение', value: `${parseInt(pfM[2])} В` });
  }
  const nfM = sku.match(/(\d+(?:\.\d+)?)[Nn][Ff](\d{2,3})/);
  if (nfM) {
    specs.push({ label: 'Ёмкость', value: `${nfM[1]} нФ` });
    specs.push({ label: 'Напряжение', value: `${parseInt(nfM[2])} В` });
  }
  const ufM = sku.match(/(\d+(?:\.\d+)?)[UuМмµμ][Ff](\d{2,3})/);
  if (ufM) {
    specs.push({ label: 'Ёмкость', value: `${ufM[1]} ${MICRO}Ф` });
    specs.push({ label: 'Напряжение', value: `${parseInt(ufM[2])} В` });
  }

  // MLCC: GRM, LLL, C, N
  if (/^GRM/.test(sku.toUpperCase())) {
    specs.push({ label: 'Тип', value: 'MLCC керамический' });
    specs.push({ label: 'Серия', value: 'GRM' });
  }

  // Танталовые: TPS, TANT, F920, F931
  if (/TPS|TANT|^F\d{3}|^T$/.test(sku.toUpperCase())) {
    specs.push({ label: 'Тип', value: 'Танталовый' });
    specs.push({ label: 'Полярность', value: 'Полярный' });
  }

  // Плёночные: MKP, MKS, B32774
  if (/MKP|MKS|MKC|B3277/.test(sku.toUpperCase())) {
    specs.push({ label: 'Тип', value: 'Плёночный' });
    specs.push({ label: 'Полярность', value: 'Неполярный' });
  }

  // Электролит: UPW, EEU, EKZ, UCY
  if (/UPW|EEU|EKZ|UCY|NICHICON|RUBYCON|NCC|PANASONIC\sFC/.test(sku.toUpperCase())) {
    specs.push({ label: 'Тип', value: 'Электролитический алюминиевый' });
    specs.push({ label: 'Полярность', value: 'Полярный' });
  }

  // Допуск
  const tolM = sku.match(/[ _-]([FJGMHK])(\d|$)/);
  if (tolM) {
    const tolMap: Record<string, string> = {
      'F': `${PLUSMINUS}1%`,
      'G': `${PLUSMINUS}2%`,
      'H': `${PLUSMINUS}3%`,
      'J': `${PLUSMINUS}5%`,
      'K': `${PLUSMINUS}10%`,
      'M': `${PLUSMINUS}20%`,
    };
    if (tolMap[tolM[1]]) specs.push({ label: 'Допуск', value: tolMap[tolM[1]] });
  }

  return specs;
}

/** Резисторы */
function extractResistor(sku: string, name: string, desc: string): Spec[] {
  const specs: Spec[] = [];
  const s = sku.toUpperCase();
  const t = up(name + ' ' + desc);

  // Серии: CRCW, MCR, CRG, ERJ, RK73, RK731
  if (/CRCW/.test(s)) specs.push({ label: 'Серия', value: 'CRCW (Vishay)' });
  if (/^MCR/.test(s)) specs.push({ label: 'Серия', value: 'MCR (ROHM)' });
  if (/^CRG/.test(s)) specs.push({ label: 'Серия', value: 'CRG (Panasonic)' });
  if (/ERJ/.test(s)) specs.push({ label: 'Серия', value: 'ERJ (Panasonic)' });
  if (/RK73/.test(s)) specs.push({ label: 'Серия', value: 'RK73 (KOA)' });

  // Размер SMD: ищем 4 цифры в начале после букв
  const sizeM = s.match(/(?:CRCW|MCR|CRG|ERJ|RK731?)(\d{4})/);
  if (sizeM) {
    const sz = sizeM[1];
    const sizeMap: Record<string, string> = {
      '0201': '0.6×0.3 мм (0201)',
      '0402': '1.0×0.5 мм (0402)',
      '0603': '1.6×0.8 мм (0603)',
      '0805': '2.0×1.25 мм (0805)',
      '1206': '3.2×1.6 мм (1206)',
      '1210': '3.2×2.5 мм (1210)',
      '1218': '3.2×4.6 мм (1218)',
      '1812': '4.5×3.2 мм (1812)',
      '2010': '5.0×2.5 мм (2010)',
      '2512': '6.3×3.2 мм (2512)',
    };
    if (sizeMap[sz]) specs.push({ label: 'Размер', value: sizeMap[sz] });
  }

  // Сопротивление из SKU — паттерн: 4R7 = 4.7Ω, 100R = 100Ω, 10K = 10kΩ, 1M = 1MΩ
  // Обычно после размера: MCR25124R7R0.1F → 4R7 = 4.7Ω, 0.1 = power, F = 1%
  const r1 = s.match(/(\d{1,4})R(\d{1,2})/);
  if (r1) {
    specs.push({ label: 'Сопротивление', value: `${r1[1]}.${r1[2]} ${OHM}` });
  } else {
    const r2 = s.match(/(\d{1,4})R\b/);
    if (r2) specs.push({ label: 'Сопротивление', value: `${r2[1]} ${OHM}` });
  }
  const kM = s.match(/(\d{1,3})K(\d{0,1})/);
  if (kM) {
    const val = kM[2] ? `${kM[1]}.${kM[2]} к${OHM}` : `${kM[1]} к${OHM}`;
    specs.push({ label: 'Сопротивление', value: val });
  }
  const mM = s.match(/(\d{1,3})M(\d{0,1})/);
  if (mM && !kM) {
    const val = mM[2] ? `${mM[1]}.${mM[2]} М${OHM}` : `${mM[1]} М${OHM}`;
    specs.push({ label: 'Сопротивление', value: val });
  }

  // Допуск
  const tolM = s.match(/([FGHJKM])(\d|$)/);
  if (tolM) {
    const tolMap: Record<string, string> = {
      'F': `${PLUSMINUS}1%`,
      'G': `${PLUSMINUS}2%`,
      'H': `${PLUSMINUS}3%`,
      'J': `${PLUSMINUS}5%`,
      'K': `${PLUSMINUS}10%`,
      'M': `${PLUSMINUS}20%`,
    };
    if (tolMap[tolM[1]]) specs.push({ label: 'Допуск', value: tolMap[tolM[1]] });
  }

  // Мощность: ищем "0.1W", "0.125W", "0.25W", "0.5W", "1W"
  const pwM = t.match(/(\d+(?:\.\d+)?)\s*W\b/);
  if (pwM) specs.push({ label: 'Мощность', value: `${pwM[1]} Вт` });

  // SMD/TH
  if (/0\.125W|0\.25W|0\.5W/.test(t)) {
    // SMD типичные мощности
  }
  // Мощный резистор
  if (/SQP|WIREWOUND|POWER|RH025|5W|10W|25W/.test(t)) {
    specs.push({ label: 'Тип', value: 'Wirewound (силовой)' });
  } else {
    specs.push({ label: 'Тип', value: 'Thick film' });
  }

  return specs;
}

/** Диоды */
function extractDiode(sku: string, name: string, desc: string): Spec[] {
  const specs: Spec[] = [];
  const s = sku.toUpperCase();
  const t = up(name + ' ' + desc);

  // 1N4001-1N4007 — выпрямители
  const m4007 = s.match(/^1N400(\d)$/);
  if (m4007) {
    const vMap: Record<string, string> = {
      '1': '50 В', '2': '100 В', '3': '200 В', '4': '400 В',
      '5': '600 В', '6': '800 В', '7': '1000 В',
    };
    specs.push({ label: 'Тип', value: 'Выпрямительный' });
    specs.push({ label: 'Макс. обратное напряжение', value: vMap[m4007[1]] });
    specs.push({ label: 'Средний выпрямленный ток', value: '1 А' });
    specs.push({ label: 'Корпус', value: 'DO-41' });
  }
  // 1N5400-1N5408
  const m540 = s.match(/^1N540(\d)$/);
  if (m540) {
    const vMap: Record<string, string> = {
      '0': '50 В', '1': '100 В', '2': '200 В', '3': '300 В',
      '4': '400 В', '5': '500 В', '6': '600 В', '7': '800 В', '8': '1000 В',
    };
    specs.push({ label: 'Тип', value: 'Выпрямительный' });
    specs.push({ label: 'Макс. обратное напряжение', value: vMap[m540[1]] });
    specs.push({ label: 'Средний выпрямленный ток', value: '3 А' });
    specs.push({ label: 'Корпус', value: 'DO-201AD' });
  }
  // 1N4728A-1N4764A — стабилитроны 1W
  const m4733 = s.match(/^1N47(\d{2})A/);
  if (m4733) {
    specs.push({ label: 'Тип', value: 'Стабилитрон' });
    specs.push({ label: 'Мощность рассеяния', value: '1 Вт' });
    specs.push({ label: 'Корпус', value: 'DO-41' });
  }
  // 1N5817-1N5819 — шоттки
  if (/^1N581[789]/.test(s)) {
    specs.push({ label: 'Тип', value: 'Шоттки' });
    specs.push({ label: 'Средний выпрямленный ток', value: '1 А' });
    specs.push({ label: 'Корпус', value: 'DO-41' });
  }
  // 1N5820-1N5822 — шоттки 3A
  if (/^1N582[012]/.test(s)) {
    specs.push({ label: 'Тип', value: 'Шоттки' });
    specs.push({ label: 'Средний выпрямленный ток', value: '3 А' });
    specs.push({ label: 'Корпус', value: 'DO-201AD' });
  }
  // BZX55C — стабилитроны 0.5W
  const bzxM = s.match(/BZX55C(\d+)V?(\d)?/);
  if (bzxM) {
    const v = bzxM[2] ? `${bzxM[1]}.${bzxM[2]}` : bzxM[1];
    specs.push({ label: 'Тип', value: 'Стабилитрон' });
    specs.push({ label: 'Напряжение стабилизации', value: `${v} В` });
    specs.push({ label: 'Мощность рассеяния', value: '0.5 Вт' });
    specs.push({ label: 'Корпус', value: 'DO-41' });
  }
  // BZX84C — стабилитроны SMD
  if (/^BZX84/.test(s)) {
    specs.push({ label: 'Тип', value: 'Стабилитрон (SMD)' });
    specs.push({ label: 'Мощность рассеяния', value: '0.35 Вт' });
    specs.push({ label: 'Корпус', value: 'SOD-123' });
  }
  // KBPC — мостовые выпрямители
  const kbpcM = s.match(/KBPC(\d)(\d{2})/);
  if (kbpcM) {
    const cur = kbpcM[1] === '6' ? '6 А' : kbpcM[1] === '1' ? '15 А' : kbpcM[1] === '2' ? '25 А' : `${kbpcM[1]} А`;
    const vMap: Record<string, string> = {
      '02': '100 В', '04': '200 В', '06': '400 В', '08': '600 В', '10': '800 В', '12': '1000 В',
    };
    specs.push({ label: 'Тип', value: 'Мостовой выпрямитель' });
    specs.push({ label: 'Средний выпрямленный ток', value: cur });
    if (vMap[kbpcM[2]]) specs.push({ label: 'Макс. обратное напряжение', value: vMap[kbpcM[2]] });
  }
  // KBU/KBP/GBL — мосты
  if (/^KBU|^KBP|^GBL|^GBJ/.test(s)) {
    specs.push({ label: 'Тип', value: 'Мостовой выпрямитель' });
  }
  // 1.5KE — TVS-диоды
  if (/^1\.5KE/.test(s)) {
    specs.push({ label: 'Тип', value: 'TVS (супрессор)' });
    specs.push({ label: 'Мощность импульса', value: '1500 Вт' });
  }
  // SMBJ — TVS
  if (/^SMBJ/.test(s)) {
    specs.push({ label: 'Тип', value: 'TVS (супрессор)' });
    specs.push({ label: 'Мощность импульса', value: '600 Вт' });
  }

  // Общее: ищем напряжение в SKU/имени (например BZX55C5V1)
  if (!specs.find(sp => sp.label === 'Напряжение стабилизации' || sp.label === 'Макс. обратное напряжение')) {
    const vM = s.match(/(\d{1,3})V(\d{0,2})/);
    if (vM) {
      const v = vM[2] ? `${vM[1]}.${vM[2]}` : vM[1];
      specs.push({ label: 'Напряжение', value: `${v} В` });
    }
  }

  return specs;
}

/** Транзисторы */
function extractTransistor(sku: string, name: string, desc: string): Spec[] {
  const specs: Spec[] = [];
  const s = sku.toUpperCase();
  const t = up(name + ' ' + desc);

  // TIP31/TIP32 — BJT NPN/PNP в TO-247/TO-220
  if (/^TIP31[ABC]?/.test(s)) {
    specs.push({ label: 'Тип', value: 'BJT NPN (силовой)' });
    specs.push({ label: 'Макс. ток коллектора', value: '3 А' });
    specs.push({ label: 'Макс. Uкэ', value: '40 В (A) / 60 В (B) / 80 В (C)' });
    specs.push({ label: 'Корпус', value: 'TO-220' });
  }
  if (/^TIP32[ABC]?/.test(s)) {
    specs.push({ label: 'Тип', value: 'BJT PNP (силовой)' });
    specs.push({ label: 'Макс. ток коллектора', value: '3 А' });
    specs.push({ label: 'Корпус', value: 'TO-220' });
  }

  // 2N2222, 2N3904, 2N3906 — BJT
  if (/^2N2222/.test(s)) {
    specs.push({ label: 'Тип', value: 'BJT NPN (универсальный)' });
    specs.push({ label: 'Макс. ток коллектора', value: '600 мА' });
    specs.push({ label: 'Макс. Uкэ', value: '40 В' });
    specs.push({ label: 'Корпус', value: 'TO-92' });
  }
  if (/^2N3904/.test(s)) {
    specs.push({ label: 'Тип', value: 'BJT NPN (универсальный)' });
    specs.push({ label: 'Макс. ток коллектора', value: '200 мА' });
    specs.push({ label: 'Макс. Uкэ', value: '40 В' });
    specs.push({ label: 'Корпус', value: 'TO-92' });
  }
  if (/^2N3906/.test(s)) {
    specs.push({ label: 'Тип', value: 'BJT PNP (универсальный)' });
    specs.push({ label: 'Макс. ток коллектора', value: '200 мА' });
    specs.push({ label: 'Макс. Uкэ', value: '40 В' });
    specs.push({ label: 'Корпус', value: 'TO-92' });
  }

  // IRFZ44N, IRF540N — MOSFET N-канал
  if (/^IRFZ44/.test(s)) {
    specs.push({ label: 'Тип', value: 'MOSFET N-канал' });
    specs.push({ label: 'Макс. Uсток-исток', value: '55 В' });
    specs.push({ label: 'Макс. ток стока', value: '49 А' });
    specs.push({ label: 'Rds(on)', value: '17.5 мОм' });
    specs.push({ label: 'Корпус', value: 'TO-220' });
  }
  if (/^IRF540/.test(s)) {
    specs.push({ label: 'Тип', value: 'MOSFET N-канал' });
    specs.push({ label: 'Макс. Uсток-исток', value: '100 В' });
    specs.push({ label: 'Макс. ток стока', value: '33 А' });
    specs.push({ label: 'Rds(on)', value: '44 мОм' });
    specs.push({ label: 'Корпус', value: 'TO-220' });
  }
  if (/^IRF3205/.test(s)) {
    specs.push({ label: 'Тип', value: 'MOSFET N-канал' });
    specs.push({ label: 'Макс. Uсток-исток', value: '55 В' });
    specs.push({ label: 'Макс. ток стока', value: '110 А' });
    specs.push({ label: 'Rds(on)', value: '8 мОм' });
    specs.push({ label: 'Корпус', value: 'TO-220' });
  }
  if (/^IRF1404/.test(s)) {
    specs.push({ label: 'Тип', value: 'MOSFET N-канал' });
    specs.push({ label: 'Макс. Uсток-исток', value: '40 В' });
    specs.push({ label: 'Макс. ток стока', value: '162 А' });
    specs.push({ label: 'Rds(on)', value: '4 мОм' });
    specs.push({ label: 'Корпус', value: 'TO-220' });
  }

  // IGBT
  if (/^HGTG|^FGA|^IGBT/.test(s)) {
    specs.push({ label: 'Тип', value: 'IGBT' });
  }

  // BC547/BC548/BC557/BC558/BC847/BC857/BC856/BC846 — BJT малый сигнал
  const bcm = s.match(/^BC(\d{3})([A-Z])?/);
  if (bcm) {
    const num = bcm[1];
    const isPnp = num.startsWith('5') || num.startsWith('8');  // BC5xx, BC8xx = PNP/низкий шум
    // BC547/548/549 = NPN, BC556/557/558 = PNP, BC846/847/848 = NPN, BC856/857/858 = PNP
    const npnSeries = ['546', '547', '548', '549', '550', '846', '847', '848', '849', '850'];
    const pnpSeries = ['556', '557', '558', '559', '560', '856', '857', '858', '859', '860'];
    const isNpn = npnSeries.includes(num);
    const isPnpFinal = pnpSeries.includes(num);
    if (isNpn || isPnpFinal) {
      specs.push({ label: 'Тип', value: `BJT ${isNpn ? 'NPN' : 'PNP'} (малый сигнал)` });
      // hFE группы: A=110-220, B=200-450, C=420-800 (для BC547/557)
      const group = bcm[2];
      if (group && ['A', 'B', 'C'].includes(group)) {
        const hfeMap: Record<string, string> = {
          'A': '110–220',
          'B': '200–450',
          'C': '420–800',
        };
        specs.push({ label: 'Коэф. усиления (hFE)', value: `${hfeMap[group]} (группа ${group})` });
      }
      specs.push({ label: 'Макс. Uкэ (Vceo)', value: '45 В' });
      specs.push({ label: 'Макс. ток коллектора', value: '100 мА' });
      specs.push({ label: 'Граничная частота (fT)', value: '100–300 МГц' });
      // Корпус: BC8xx = SOT-23 (SMD), BC5xx = TO-92 (THT)
      if (num.startsWith('8')) {
        specs.push({ label: 'Корпус', value: 'SOT-23' });
      } else {
        specs.push({ label: 'Корпус', value: 'TO-92' });
      }
    }
  }

  // 2N7000/2N7002 — N-канал MOSFET small signal
  if (/^2N7000|^2N7002/.test(s)) {
    specs.push({ label: 'Тип', value: 'N-канал MOSFET (малый сигнал)' });
    specs.push({ label: 'Макс. Uсток-исток', value: '60 В' });
    specs.push({ label: 'Макс. ток стока', value: '200 мА' });
    specs.push({ label: 'Rds(on)', value: '5 Ом (при Vgs=10В)' });
    specs.push({ label: 'Пороговое Uзи', value: '0.8…3 В' });
    if (/^2N7000/.test(s)) {
      specs.push({ label: 'Корпус', value: 'TO-92' });
    } else {
      specs.push({ label: 'Корпус', value: 'SOT-23' });
    }
  }

  // BD139/BD140 — средний мощности BJT
  if (/^BD13[9]/.test(s)) {
    specs.push({ label: 'Тип', value: 'BJT NPN (средней мощности)' });
    specs.push({ label: 'Макс. Uкэ', value: '80 В' });
    specs.push({ label: 'Макс. ток коллектора', value: '1.5 А' });
    specs.push({ label: 'Корпус', value: 'SOT-32 (TO-126)' });
  }
  if (/^BD14[0]/.test(s)) {
    specs.push({ label: 'Тип', value: 'BJT PNP (средней мощности)' });
    specs.push({ label: 'Макс. Uкэ', value: '80 В' });
    specs.push({ label: 'Макс. ток коллектора', value: '1.5 А' });
    specs.push({ label: 'Корпус', value: 'SOT-32 (TO-126)' });
  }

  // Auto MOSFET — AUIRG...
  if (/^AUIRG/.test(s)) {
    specs.push({ label: 'Тип', value: 'MOSFET (Automotive)' });
    specs.push({ label: 'Соответствие', value: 'AEC-Q101' });
  }

  // Общее — если в названии есть "MOSFET"/"IGBT"/"транзистор"
  if (!specs.length) {
    if (/MOSFET/.test(t)) {
      specs.push({ label: 'Тип', value: 'MOSFET' });
    } else if (/IGBT/.test(t)) {
      specs.push({ label: 'Тип', value: 'IGBT' });
    } else if (/NPN/i.test(name)) {
      specs.push({ label: 'Тип', value: 'BJT NPN' });
    } else if (/PNP/i.test(name)) {
      specs.push({ label: 'Тип', value: 'BJT PNP' });
    }
  }

  // Поиск напряжения/тока в описании
  const vM = t.match(/(\d{2,4})\s*V/);
  if (vM && !specs.find(sp => sp.label.includes('напряж') || sp.label.includes('U'))) {
    specs.push({ label: 'Макс. напряжение', value: `${vM[1]} В` });
  }
  const iM = t.match(/(\d+(?:\.\d+)?)\s*A\b/);
  if (iM && !specs.find(sp => sp.label.includes('ток'))) {
    specs.push({ label: 'Макс. ток', value: `${iM[1]} А` });
  }

  return specs;
}

/** Стабилизаторы (LDO / DC-DC) */
function extractRegulator(sku: string, name: string, desc: string): Spec[] {
  const specs: Spec[] = [];
  const s = sku.toUpperCase();
  const t = up(name + ' ' + desc);

  // LM7805/LM7812 — +x.xV linear 1A
  const lm78M = s.match(/^LM78(\d{2})/);
  if (lm78M) {
    specs.push({ label: 'Тип', value: 'Линейный положительный' });
    specs.push({ label: 'Выходное напряжение', value: `${parseInt(lm78M[1], 10)} В` });
    specs.push({ label: 'Макс. выходной ток', value: '1 А' });
    specs.push({ label: 'Корпус', value: 'TO-220' });
  }
  // LM7905/LM7912 — negative
  const lm79M = s.match(/^LM79(\d{2})/);
  if (lm79M) {
    specs.push({ label: 'Тип', value: 'Линейный отрицательный' });
    specs.push({ label: 'Выходное напряжение', value: `-${parseInt(lm79M[1], 10)} В` });
    specs.push({ label: 'Макс. выходной ток', value: '1 А' });
    specs.push({ label: 'Корпус', value: 'TO-220' });
  }
  // LM317/LM337 — adjustable
  if (/^LM317/.test(s)) {
    specs.push({ label: 'Тип', value: 'Линейный регулируемый (положительный)' });
    specs.push({ label: 'Выходное напряжение', value: '1.25–37 В (регулируемое)' });
    specs.push({ label: 'Макс. выходной ток', value: '1.5 А' });
    specs.push({ label: 'Корпус', value: 'TO-220' });
  }
  if (/^LM337/.test(s)) {
    specs.push({ label: 'Тип', value: 'Линейный регулируемый (отрицательный)' });
    specs.push({ label: 'Выходное напряжение', value: '-1.25…-37 В' });
    specs.push({ label: 'Макс. выходной ток', value: '1.5 А' });
  }
  // AMS1117 / LM1117 — LDO
  if (/^AMS1117|^LM1117/.test(s)) {
    specs.push({ label: 'Тип', value: 'LDO' });
    specs.push({ label: 'Падение напряжения', value: '~1.2 В' });
    specs.push({ label: 'Макс. выходной ток', value: '1 А' });
    specs.push({ label: 'Корпус', value: 'SOT-223' });
    // AMS1117-3.3 / -5.0 / -ADJ
    const vM = s.match(/-(\d\.\d|ADJ)/);
    if (vM) {
      specs.push({
        label: 'Выходное напряжение',
        value: vM[1] === 'ADJ' ? 'Регулируемое' : `${vM[1]} В`,
      });
    }
  }
  // LM2596 — DC-DC buck
  if (/^LM2596/.test(s)) {
    specs.push({ label: 'Тип', value: 'DC-DC понижающий (Buck)' });
    specs.push({ label: 'Частота ШИМ', value: '150 кГц' });
    specs.push({ label: 'Макс. выходной ток', value: '3 А' });
    specs.push({ label: 'Входное напряжение', value: '4.5–40 В' });
    specs.push({ label: 'Корпус', value: 'TO-220-5' });
  }
  // MP1584 — DC-DC buck SMD
  if (/^MP1584/.test(s)) {
    specs.push({ label: 'Тип', value: 'DC-DC понижающий (Buck)' });
    specs.push({ label: 'Частота ШИМ', value: '1.5 МГц' });
    specs.push({ label: 'Макс. выходной ток', value: '3 А' });
    specs.push({ label: 'Входное напряжение', value: '4.5–28 В' });
    specs.push({ label: 'Корпус', value: 'SOIC-8' });
  }
  // LM2576 — buck 3A
  if (/^LM2576/.test(s)) {
    specs.push({ label: 'Тип', value: 'DC-DC понижающий (Buck)' });
    specs.push({ label: 'Макс. выходной ток', value: '3 А' });
    specs.push({ label: 'Входное напряжение', value: '4.5–40 В' });
    specs.push({ label: 'Корпус', value: 'TO-220-5' });
  }
  // LTxxxx — Linear Technology (TI)
  if (/^LT\d/.test(s) && !specs.find(sp => sp.label === 'Тип')) {
    specs.push({ label: 'Производитель оригинала', value: 'Linear Technology (TI)' });
    // LT30xx — LDO series
    if (/^LT30[12]\d/.test(s)) {
      specs.push({ label: 'Тип', value: 'LDO (Linear Regulator)' });
      specs.push({ label: 'Макс. выходной ток', value: '500 мА (тип.)' });
      specs.push({ label: 'Падение напряжения', value: '200–400 мВ (тип.)' });
      specs.push({ label: 'Входное напряжение', value: '1.8–20 В (тип.)' });
      specs.push({ label: 'Точность', value: '±2% (тип.)' });
    } else if (/LDO/.test(t)) {
      specs.push({ label: 'Тип', value: 'LDO' });
    } else if (/DC-DC|BUCK|ПОНИЖ|REGULATOR/.test(t)) {
      specs.push({ label: 'Тип', value: 'DC-DC преобразователь' });
    } else {
      // По умолчанию LT — это стабилизатор/регулятор
      specs.push({ label: 'Тип', value: 'Линейный стабилизатор (Linear Tech)' });
    }
  }
  // TPSxxxx — TI
  if (/^TPS/.test(s) && !specs.find(sp => sp.label === 'Тип')) {
    specs.push({ label: 'Производитель оригинала', value: 'Texas Instruments' });
    if (/DC-DC|BUCK|ПОНИЖ/.test(t)) {
      specs.push({ label: 'Тип', value: 'DC-DC преобразователь' });
    } else if (/LDO/.test(t)) {
      specs.push({ label: 'Тип', value: 'LDO' });
    } else {
      // По умолчанию TPS — power management IC
      specs.push({ label: 'Тип', value: 'Power Management IC (TI)' });
    }
  }
  // LMxxxx — TI/ON Semi стабилизаторы и ОУ
  if (/^LM\d/.test(s) && !specs.find(sp => sp.label === 'Тип') && !/^LM1117|^LM2596|^LM2576|^LM78|^LM79|^LM317|^LM337|^LM358|^LM324|^LM393|^LM339|^LM741/.test(s)) {
    if (/LDO|REGULATOR|СТАБИЛ/.test(t)) {
      specs.push({ label: 'Тип', value: 'Линейный стабилизатор' });
    } else if (/OP|AMP|ОУ/.test(t)) {
      specs.push({ label: 'Тип', value: 'Операц. усилитель' });
    }
  }
  // R-78 — switching regulator (Recom)
  if (/^R-78/.test(s)) {
    specs.push({ label: 'Тип', value: 'Импульсный стабилизатор (Drop-in)' });
    specs.push({ label: 'Производитель', value: 'Recom' });
  }

  // Общее: ток из описания
  const iM = t.match(/(\d+(?:\.\d+)?)\s*A\b/);
  if (iM && !specs.find(sp => sp.label.includes('ток'))) {
    specs.push({ label: 'Макс. ток', value: `${iM[1]} А` });
  }

  return specs;
}

/** Операционные усилители */
function extractOpAmp(sku: string, name: string, desc: string): Spec[] {
  const specs: Spec[] = [];
  const s = sku.toUpperCase();
  const t = up(name + ' ' + desc);

  // NE5532 / NE5534 — низкошумящие аудио
  if (/^NE5532/.test(s)) {
    specs.push({ label: 'Тип', value: 'Операц. усилитель (низкий шум, аудио)' });
    specs.push({ label: 'Количество каналов', value: '2' });
    specs.push({ label: 'Скорость нарастания', value: '9 В/мкс' });
    specs.push({ label: 'Полоса пропускания', value: '10 МГц' });
    specs.push({ label: 'Корпус', value: 'DIP-8 / SOIC-8' });
  }
  if (/^NE5534/.test(s)) {
    specs.push({ label: 'Тип', value: 'Операц. усилитель (низкий шум)' });
    specs.push({ label: 'Количество каналов', value: '1' });
    specs.push({ label: 'Корпус', value: 'DIP-8' });
  }
  // LM358 — двойной general purpose
  if (/^LM358/.test(s)) {
    specs.push({ label: 'Тип', value: 'Операц. усилитель (general purpose)' });
    specs.push({ label: 'Количество каналов', value: '2' });
    specs.push({ label: 'Полоса пропускания', value: '1 МГц' });
    specs.push({ label: 'Питание', value: '3–32 В (однополярное)' });
  }
  if (/^LM324/.test(s)) {
    specs.push({ label: 'Тип', value: 'Операц. усилитель (general purpose)' });
    specs.push({ label: 'Количество каналов', value: '4' });
    specs.push({ label: 'Полоса пропускания', value: '1.2 МГц' });
  }
  if (/^LM393/.test(s)) {
    specs.push({ label: 'Тип', value: 'Компаратор' });
    specs.push({ label: 'Количество каналов', value: '2' });
  }
  if (/^LM339/.test(s)) {
    specs.push({ label: 'Тип', value: 'Компаратор' });
    specs.push({ label: 'Количество каналов', value: '4' });
  }
  if (/^LM741|^UA741/.test(s)) {
    specs.push({ label: 'Тип', value: 'Операц. усилитель (классический)' });
    specs.push({ label: 'Количество каналов', value: '1' });
  }
  // TL072/TL082/TL074 — JFET input
  if (/^TL07[124]/.test(s) || /^TL08[124]/.test(s)) {
    specs.push({ label: 'Тип', value: 'Операц. усилитель (JFET вход)' });
    const ch = s.match(/TL0[78](\d)/);
    if (ch) {
      const chMap: Record<string, string> = { '1': '1', '2': '2', '4': '4' };
      specs.push({ label: 'Количество каналов', value: chMap[ch[1]] || '?' });
    }
    specs.push({ label: 'Полоса пропускания', value: '3 МГц' });
  }
  // OPAxxx — Burr-Brown/TI precision
  if (/^OPA\d/.test(s)) {
    specs.push({ label: 'Тип', value: 'Операц. усилитель (прецизионный)' });
    specs.push({ label: 'Производитель', value: 'Texas Instruments' });
  }
  // MCP6001-4 — Microchip low-power
  if (/^MCP6\d{3}/.test(s)) {
    specs.push({ label: 'Тип', value: 'Операц. усилитель (low-power)' });
    specs.push({ label: 'Производитель', value: 'Microchip' });
  }

  // Каналы: ищем DR/SOIC в конце
  if (/DR$|D$/.test(s)) specs.push({ label: 'Корпус', value: 'SOIC-8' });

  return specs;
}

/** Логика 74xx / 40xx */
function extractLogic(sku: string, name: string, desc: string): Spec[] {
  const specs: Spec[] = [];
  const s = sku.toUpperCase();

  const m74 = s.match(/^74([A-Z]{1,5})(\d{2,4})/);
  if (m74) {
    const famMap: Record<string, string> = {
      'HC': 'High Speed CMOS',
      'HCT': 'High Speed CMOS (TTL-уровни)',
      'AC': 'Advanced CMOS',
      'ACT': 'Advanced CMOS (TTL)',
      'LVC': 'Low Voltage CMOS',
      'VHC': 'Very High Speed CMOS',
      'VHCT': 'Very High Speed CMOS (TTL)',
      'LS': 'Low Power Schottky',
      'ALS': 'Advanced Low Power Schottky',
      'AS': 'Advanced Schottky',
      'S': 'Schottky',
      'L': 'Low Power',
      'LV': 'Low Voltage',
      'ABT': 'Advanced BiCMOS',
      'BCT': 'BiCMOS',
      'F': 'FAST',
    };
    const fam = m74[1];
    specs.push({ label: 'Семейство', value: famMap[fam] || fam });
    specs.push({ label: 'Технология', value: fam.startsWith('H') || fam.startsWith('A') || fam.startsWith('L') || fam.startsWith('V') || fam.startsWith('F') || fam.startsWith('B') ? 'CMOS/BiCMOS' : 'TTL' });
    // Функция по номеру
    const fnMap: Record<string, string> = {
      '00': '4×2И-НЕ (NAND)',
      '02': '4×2ИЛИ-НЕ (NOR)',
      '04': '6×НЕ (инвертор)',
      '08': '4×2И (AND)',
      '14': '6×НЕ с триггером Шмитта',
      '32': '4×2ИЛИ (OR)',
      '74': '2×D триггер (front)',
      '86': '4×Исключающее ИЛИ (XOR)',
      '125': '4×буфер с 3-state (вых. enable)',
      '138': 'Декодер 3→8',
      '164': '8-битный сдвиговый регистр (SIPO)',
      '165': '8-битный сдвиговый регистр (PISO)',
      '244': '8×буфер (3-state)',
      '245': '8×двунаправленный трансивер',
      '373': '8×D триггер-защёлка',
      '374': '8×D триггер (front)',
      '540': '8×инвертирующий буфер',
      '595': '8-битный сдвиговый регистр с защёлкой',
    };
    if (fnMap[m74[2]]) specs.push({ label: 'Функция', value: fnMap[m74[2]] });
  }

  // CD40xx / HEF40xx — CMOS
  const m40 = s.match(/^(CD|HEF|MC|TC|MM)(40)(\d{2})/);
  if (m40) {
    specs.push({ label: 'Семейство', value: '4000 series CMOS' });
    specs.push({ label: 'Технология', value: 'CMOS' });
    const fnMap: Record<string, string> = {
      '00': '4×2И-НЕ (NAND)',
      '01': '4×2И-НЕ с инверсным выходом',
      '11': '3×3И (AND)',
      '13': '2×D триггер с триггером Шмитта',
      '17': 'Декодер 1→10',
      '40': '13×инвертор',
      '60': '2×4И (AND expandable)',
      '69': '6×инвертор',
      '81': '4×D защёлка',
      '93': '4-битный счётчик',
    };
    if (fnMap[m40[3]]) specs.push({ label: 'Функция', value: fnMap[m40[3]] });
  }

  // Корпус: ищем N (DIP) / D (SOIC) / DT / PW
  if (/N$|-N$/.test(s)) specs.push({ label: 'Корпус', value: 'DIP-14/16' });
  if (/D$|DR$|-D$/.test(s)) specs.push({ label: 'Корпус', value: 'SOIC-14/16' });

  return specs;
}

/** Кварцы и резонаторы */
function extractCrystal(sku: string, name: string, desc: string): Spec[] {
  const specs: Spec[] = [];
  const s = sku.toUpperCase();
  const t = up(name + ' ' + desc);

  // ABM3225-11R0592MHz-10ppm-J9
  const fM = s.match(/(\d+(?:\.\d+)?)\s*MHZ/i) || t.match(/(\d+(?:\.\d+)?)\s*MHZ/i);
  if (fM) {
    const f = parseFloat(fM[1]);
    let fStr: string;
    if (f >= 1) fStr = `${f} МГц`;
    else fStr = `${(f * 1000).toFixed(0)} кГц`;
    specs.push({ label: 'Частота', value: fStr });
  }

  const ppmM = s.match(/(\d{1,3})PPM/i) || t.match(/(\d{1,3})PPM/i);
  if (ppmM) specs.push({ label: 'Стабильность', value: `${PLUSMINUS}${ppmM[1]} ppm` });

  // Корпус SMD
  const sizeM = s.match(/ABM(\d{4})/);
  if (sizeM) {
    const sz = sizeM[1];
    const sizeMap: Record<string, string> = {
      '3225': '3.2×2.5 мм',
      '2520': '2.5×2.0 мм',
      '1612': '1.6×1.2 мм',
      '1610': '1.6×1.0 мм',
      '0804': '0.8×0.4 мм',
    };
    if (sizeMap[sz]) specs.push({ label: 'Размер', value: sizeMap[sz] });
  }

  // HC-49
  if (/HC-?49|HC49/.test(s)) {
    specs.push({ label: 'Корпус', value: 'HC-49 (цилиндр)' });
  } else if (/SMD|3225|2520|1612/.test(s)) {
    specs.push({ label: 'Корпус', value: 'SMD' });
  }

  if (/RESONATOR|CSTCE|ZTA|CERALOCK/.test(s)) {
    specs.push({ label: 'Тип', value: 'Керамический резонатор' });
  } else {
    specs.push({ label: 'Тип', value: 'Кварцевый резонатор' });
  }

  return specs;
}

/** Реле */
function extractRelay(sku: string, name: string, desc: string): Spec[] {
  const specs: Spec[] = [];
  const s = sku.toUpperCase();
  const t = up(name + ' ' + desc);

  // HF46F5VDC1A-Q2 → 5VDC coil
  const coilM = s.match(/(\d{1,3})VDC(\d{0,2}[A-Z]?)/);
  if (coilM) {
    specs.push({ label: 'Напряжение катушки', value: `${coilM[1]} В (DC)` });
  }

  // Ток/контакт: 1A, 2A, 5A, 10A, 16A, 30A
  const contactM = s.match(/(\d{1,2})A\b/);
  if (contactM) {
    specs.push({ label: 'Ток контактов', value: `${contactM[1]} А` });
  }

  // Контакты: 1C = SPDT, 1A = SPST-NO, 1B = SPST-NC, 2C = DPDT
  const contactTypeM = s.match(/\d([ABC])(\d)?/);
  if (contactTypeM) {
    const ctMap: Record<string, string> = {
      'A': 'SPST-NO (1 замыкающий)',
      'B': 'SPST-NC (1 размыкающий)',
      'C': 'SPDT (1 перекидной)',
    };
    if (ctMap[contactTypeM[1]]) {
      specs.push({ label: 'Тип контактов', value: ctMap[contactTypeM[1]] });
    }
  }

  // HF32, HF46, HF115 — конкретные серии
  if (/^HF32/.test(s)) specs.push({ label: 'Серия', value: 'HF32 (Omron, low signal)' });
  if (/^HF46/.test(s)) specs.push({ label: 'Серия', value: 'HF46 (TE, telecom)' });
  if (/^HF115/.test(s)) specs.push({ label: 'Серия', value: 'HF115 (Hongfa, power)' });
  if (/^G5LE/.test(s)) specs.push({ label: 'Серия', value: 'G5LE (Omron)' });
  if (/^G2R/.test(s)) specs.push({ label: 'Серия', value: 'G2R (Omron, power)' });
  if (/^JQC/.test(s)) specs.push({ label: 'Серия', value: 'JQC (Tianbo)' });

  // Твердотельное
  if (/SOLID|ТВЕРДОТЕЛЬ/.test(t)) {
    specs.push({ label: 'Тип', value: 'Твердотельное реле (SSR)' });
  } else {
    specs.push({ label: 'Тип', value: 'Электромагнитное реле' });
  }

  return specs;
}

/** Индуктивности */
function extractInductor(sku: string, name: string, desc: string): Spec[] {
  const specs: Spec[] = [];
  const s = sku.toUpperCase();
  const t = up(name + ' ' + desc);

  // CIM201222M-7R0A → 7.0µH (7R0)
  const rM = s.match(/(\d)R(\d)/);
  if (rM) {
    specs.push({ label: 'Индуктивность', value: `${rM[1]}.${rM[2]} ${MICRO}Гн` });
  }
  const uHM = s.match(/(\d+(?:\.\d+)?)U?H/i);
  // Не используем — слишком общее
  // 100M → 10µH (в стандартной нотации)
  const mM = s.match(/(\d{1,4})M-/);
  if (mM && !rM) {
    specs.push({ label: 'Индуктивность', value: `${mM[1]} ${MICRO}Гн` });
  }
  // Размеры: 2520, 2012, 1210, 0805
  const sizeM = s.match(/[A-Z]+(\d{4})/);
  if (sizeM) {
    const sz = sizeM[1];
    const sizeMap: Record<string, string> = {
      '0201': '0.6×0.3 мм',
      '0402': '1.0×0.5 мм',
      '0603': '1.6×0.8 мм',
      '0805': '2.0×1.25 мм',
      '1206': '3.2×1.6 мм',
      '1210': '3.2×2.5 мм',
      '1812': '4.5×3.2 мм',
      '2012': '2.0×1.25 мм',
      '2520': '2.5×2.0 мм',
      '201610': '2.0×1.6 мм',
    };
    if (sizeMap[sz]) specs.push({ label: 'Размер', value: sizeMap[sz] });
  }
  // Ток: ищем "I" + цифры или "A"
  const iM = t.match(/(\d+(?:\.\d+)?)\s*A\b/);
  if (iM) specs.push({ label: 'Номинальный ток', value: `${iM[1]} А` });

  if (/SRR|CID|CIM|IHLW|LQW/.test(s)) {
    specs.push({ label: 'Тип', value: 'SMD индуктивность' });
  } else {
    specs.push({ label: 'Тип', value: 'Индуктивность' });
  }

  return specs;
}

/** Оптоэлектроника (оптроны, LED, OLED) */
function extractOpto(sku: string, name: string, desc: string): Spec[] {
  const specs: Spec[] = [];
  const s = sku.toUpperCase();
  const t = up(name + ' ' + desc);

  // PC817, TLP281, 6N137, MOC3063
  if (/^PC8\d{2}/.test(s)) {
    specs.push({ label: 'Тип', value: 'Оптрон (транзисторный выход)' });
    specs.push({ label: 'Изоляция', value: '5000 Vrms' });
    specs.push({ label: 'CTR', value: '50–600%' });
    specs.push({ label: 'Корпус', value: 'DIP-4 / SMD-4' });
  }
  if (/^TLP\d/.test(s)) {
    specs.push({ label: 'Производитель', value: 'Toshiba' });
    specs.push({ label: 'Тип', value: 'Оптрон' });
  }
  if (/^6N\d{2,3}/.test(s)) {
    specs.push({ label: 'Тип', value: 'Оптрон (высокоскоростной)' });
  }
  if (/^MOC30/.test(s)) {
    specs.push({ label: 'Тип', value: 'Оптрон (symmetric triac driver)' });
    specs.push({ label: 'Изоляция', value: '5300 Vrms' });
  }
  if (/^MOC8\d/.test(s)) {
    specs.push({ label: 'Тип', value: 'Оптрон (транзисторный выход)' });
  }

  // OLED-SSD1306
  if (/OLED|SSD1306|SSD1309|SH1106/.test(s)) {
    specs.push({ label: 'Тип', value: 'OLED-дисплей' });
    specs.push({ label: 'Контроллер', value: 'SSD1306/SSD1309' });
    const sizeM = t.match(/(\d+(?:\.\d+)?)\s*(INCH|"|ДЮЙМ)/i) || t.match(/(\d{3,4})\s*[Xх]\s*(\d{2,3})/);
    if (sizeM) {
      specs.push({ label: 'Разрешение', value: sizeM[2] ? `${sizeM[1]}×${sizeM[2]}` : `${sizeM[1]}"` });
    }
    specs.push({ label: 'Интерфейс', value: 'I2C / SPI' });
  }

  // LCD 1602/2004
  if (/1602|2004|1604|2002/.test(s)) {
    const dimM = s.match(/(\d{2})(\d{2})/);
    if (dimM) specs.push({ label: 'Символов', value: `${dimM[1]}×${dimM[2]}` });
    specs.push({ label: 'Контроллер', value: 'HD44780' });
    specs.push({ label: 'Интерфейс', value: 'Параллельный 4/8-bit' });
  }

  // LED-5MM, LED-3MM
  if (/LED.*5MM|5MM.*LED/.test(s)) {
    specs.push({ label: 'Диаметр', value: '5 мм' });
    specs.push({ label: 'Тип', value: 'Светодиод THT' });
  }
  if (/LED.*3MM|3MM.*LED/.test(s)) {
    specs.push({ label: 'Диаметр', value: '3 мм' });
    specs.push({ label: 'Тип', value: 'Светодиод THT' });
  }

  // Цвет из описания
  if (/КРАСН|RED/.test(t)) specs.push({ label: 'Цвет', value: 'Красный' });
  else if (/ЗЕЛЁН|GREEN/.test(t)) specs.push({ label: 'Цвет', value: 'Зелёный' });
  else if (/СИН|BLUE/.test(t)) specs.push({ label: 'Цвет', value: 'Синий' });
  else if (/ЖЁЛТ|YELLOW/.test(t)) specs.push({ label: 'Цвет', value: 'Жёлтый' });
  else if (/БЕЛ|WHITE/.test(t)) specs.push({ label: 'Цвет', value: 'Белый' });
  else if (/ИК|IR\b|INFRARED/.test(t)) specs.push({ label: 'Цвет', value: 'ИК (инфракрасный)' });

  return specs;
}

/** Разъёмы */
function extractConnector(sku: string, name: string, desc: string): Spec[] {
  const specs: Spec[] = [];
  const s = sku.toUpperCase();
  const t = up(name + ' ' + desc);

  if (/USB/.test(s)) {
    specs.push({ label: 'Тип', value: 'USB разъём' });
    if (/TYPE-?C|TYPEC/.test(s)) specs.push({ label: 'Версия', value: 'USB Type-C' });
    else if (/USB3/.test(s)) specs.push({ label: 'Версия', value: 'USB 3.0' });
    else if (/MICRO/.test(s)) specs.push({ label: 'Версия', value: 'Micro USB' });
    else if (/MINI/.test(s)) specs.push({ label: 'Версия', value: 'Mini USB' });
    else specs.push({ label: 'Версия', value: 'USB Type-A' });
  }
  if (/DC-?020|DC\s?JACK/.test(s)) {
    specs.push({ label: 'Тип', value: 'DC разъём питания' });
    specs.push({ label: 'Диаметр', value: '5.5×2.1 мм (стандарт)' });
  }
  if (/KF301|KF-|TERMINAL|КЛЕММ/.test(s)) {
    specs.push({ label: 'Тип', value: 'Клеммник винтовой' });
    const polesM = s.match(/(\d)[P-]/);
    if (polesM) specs.push({ label: 'Количество полюсов', value: polesM[1] });
    specs.push({ label: 'Шаг', value: '5.0 мм / 3.5 мм' });
  }
  if (/MOLEX/.test(s)) {
    specs.push({ label: 'Тип', value: 'Molex разъём' });
  }
  if (/JST|\bPH\b|\bXH\b|\bZH\b|\bEH\b/.test(s)) {
    specs.push({ label: 'Тип', value: 'JST разъём' });
    if (/\bPH\b/.test(s)) specs.push({ label: 'Серия', value: 'JST PH (2.0 мм шаг)' });
    if (/\bXH\b/.test(s)) specs.push({ label: 'Серия', value: 'JST XH (2.54 мм шаг)' });
    if (/\bZH\b/.test(s)) specs.push({ label: 'Серия', value: 'JST ZH (1.5 мм шаг)' });
    if (/\bEH\b/.test(s)) specs.push({ label: 'Серия', value: 'JST EH (2.5 мм шаг)' });
  }

  // Количество пинов
  const pinsM = s.match(/[-X]?(\d{1,2})P\b/) || t.match(/(\d{1,2})\s*PIN/);
  if (pinsM) specs.push({ label: 'Количество контактов', value: pinsM[1] });

  // Шаг
  const pitchM = t.match(/(\d(?:\.\d+)?)\s*MM\s*PITCH/) || s.match(/(\d(?:\.\d+))PITCH/i);
  if (pitchM) specs.push({ label: 'Шаг', value: `${pitchM[1]} мм` });

  return specs;
}

/** АЦП/ЦАП */
function extractAdcDac(sku: string, name: string, desc: string): Spec[] {
  const specs: Spec[] = [];
  const s = sku.toUpperCase();
  const t = up(name + ' ' + desc);

  // DAC4997BGA — DAC, BGA
  if (/^DAC/.test(s)) {
    specs.push({ label: 'Тип', value: 'ЦАП (DAC)' });
    const resM = s.match(/DAC(\d{1,2})\d+/);
    if (resM) {
      const bits = parseInt(resM[1]) >= 8 ? resM[1] : '16';
      specs.push({ label: 'Разрядность', value: `${bits} бит` });
    }
  }
  if (/^ADC|^ADS/.test(s)) {
    specs.push({ label: 'Тип', value: 'АЦП (ADC)' });
  }
  if (/^MCP49/.test(s)) specs.push({ label: 'Серия', value: 'MCP49xx (Microchip, DAC)' });
  if (/^MCP32|^MCP33/.test(s)) {
    specs.push({ label: 'Тип', value: 'АЦП (SPI)' });
    specs.push({ label: 'Разрядность', value: '12 бит' });
  }
  if (/^HX711/.test(s)) {
    specs.push({ label: 'Тип', value: 'АЦП (для тензодатчиков)' });
    specs.push({ label: 'Разрядность', value: '24 бит' });
    specs.push({ label: 'Коэф. усиления', value: '64/128' });
  }

  // Корпус BGA
  if (/BGA$/.test(s)) specs.push({ label: 'Корпус', value: 'BGA' });
  if (/DR$/.test(s)) specs.push({ label: 'Корпус', value: 'SOIC' });

  return specs;
}

/** Датчики */
function extractSensor(sku: string, name: string, desc: string): Spec[] {
  const specs: Spec[] = [];
  const s = sku.toUpperCase();
  const t = up(name + ' ' + desc);

  if (/^BME280/.test(s)) {
    specs.push({ label: 'Тип', value: 'Датчик влажности/давления/температуры' });
    specs.push({ label: 'Интерфейс', value: 'I2C / SPI' });
    specs.push({ label: 'Производитель', value: 'Bosch' });
    specs.push({ label: 'Точность влажности', value: `${PLUSMINUS}3% RH` });
    specs.push({ label: 'Диапазон давления', value: '300–1100 гПа' });
  }
  if (/^BMP280/.test(s)) {
    specs.push({ label: 'Тип', value: 'Датчик давления/температуры' });
    specs.push({ label: 'Интерфейс', value: 'I2C / SPI' });
    specs.push({ label: 'Производитель', value: 'Bosch' });
  }
  if (/^BMP180|^BMP085/.test(s)) {
    specs.push({ label: 'Тип', value: 'Датчик давления' });
  }
  if (/^DHT11/.test(s)) {
    specs.push({ label: 'Тип', value: 'Датчик влажности/температуры' });
    specs.push({ label: 'Интерфейс', value: '1-wire (собственный)' });
    specs.push({ label: 'Точность влажности', value: `${PLUSMINUS}5% RH` });
    specs.push({ label: 'Точность температуры', value: `${PLUSMINUS}2${DEG}C` });
    specs.push({ label: 'Диапазон', value: `0–50${DEG}C / 20–90% RH` });
  }
  if (/^DHT22|^AM2302/.test(s)) {
    specs.push({ label: 'Тип', value: 'Датчик влажности/температуры' });
    specs.push({ label: 'Точность влажности', value: `${PLUSMINUS}2% RH` });
    specs.push({ label: 'Точность температуры', value: `${PLUSMINUS}0.5${DEG}C` });
    specs.push({ label: 'Диапазон', value: `-40…+80${DEG}C / 0–100% RH` });
  }
  if (/^MPU6050/.test(s)) {
    specs.push({ label: 'Тип', value: 'IMU (3-оси гироскоп + акселерометр)' });
    specs.push({ label: 'Интерфейс', value: 'I2C' });
    specs.push({ label: 'Производитель', value: 'InvenSense/TDK' });
  }
  if (/^MPU9250|^MPU9255/.test(s)) {
    specs.push({ label: 'Тип', value: 'IMU 9-оси (гироскоп + аксель + компас)' });
    specs.push({ label: 'Интерфейс', value: 'I2C / SPI' });
  }
  if (/^LSM6|^LSM9/.test(s)) {
    specs.push({ label: 'Тип', value: 'IMU' });
    specs.push({ label: 'Производитель', value: 'STMicroelectronics' });
  }
  if (/^HDC1080/.test(s)) {
    specs.push({ label: 'Тип', value: 'Датчик влажности/температуры' });
    specs.push({ label: 'Производитель', value: 'Texas Instruments' });
  }
  if (/^SHT\d/.test(s)) {
    specs.push({ label: 'Тип', value: 'Датчик влажности/температуры' });
    specs.push({ label: 'Производитель', value: 'Sensirion' });
  }
  if (/^TMP\d|^LM35\b|^LM36/.test(s)) {
    specs.push({ label: 'Тип', value: 'Датчик температуры' });
  }
  if (/^MAX31855|^MAX31856/.test(s)) {
    specs.push({ label: 'Тип', value: 'Преобразователь термопары (K/J/T/E/R/S/N)' });
    specs.push({ label: 'Производитель', value: 'Maxim Integrated' });
  }
  if (/^VEML7700|^VEML6070/.test(s)) {
    specs.push({ label: 'Тип', value: 'Датчик освещённости/UV' });
  }
  if (/^APDS9960/.test(s)) {
    specs.push({ label: 'Тип', value: 'Датчик жестов/освещённости/приближения' });
  }
  if (/^ADXL\d/.test(s)) {
    specs.push({ label: 'Тип', value: 'Акселерометр' });
    specs.push({ label: 'Производитель', value: 'Analog Devices' });
  }
  if (/^HC-SR|HC-SR04|HC-SR501/.test(s)) {
    if (/HC-SR04/.test(s)) {
      specs.push({ label: 'Тип', value: 'Ультразвуковой дальномер' });
      specs.push({ label: 'Дальность', value: '2–400 см' });
      specs.push({ label: 'Точность', value: '3 мм' });
    }
    if (/HC-SR501/.test(s)) {
      specs.push({ label: 'Тип', value: 'PIR-датчик движения' });
      specs.push({ label: 'Дальность', value: '3–7 м' });
      specs.push({ label: 'Угол обзора', value: '<120°' });
    }
  }

  return specs;
}

/** Память (EEPROM, Flash, FRAM) */
function extractMemory(sku: string, name: string, desc: string): Spec[] {
  const specs: Spec[] = [];
  const s = sku.toUpperCase();
  const t = up(name + ' ' + desc);

  if (/^24LC|^24C|^AT24C/.test(s)) {
    specs.push({ label: 'Тип', value: 'EEPROM (последовательная)' });
    specs.push({ label: 'Интерфейс', value: 'I2C' });
    const szM = s.match(/(\d{2,4})$/);
    if (szM) {
      const kb = parseInt(szM[1]);
      const bits = kb >= 1024 ? `${kb / 1024} Мбит` : `${kb} Кбит`;
      specs.push({ label: 'Объём', value: bits });
    }
  }
  if (/^W25Q/.test(s)) {
    specs.push({ label: 'Тип', value: 'Serial Flash (NOR)' });
    specs.push({ label: 'Интерфейс', value: 'SPI' });
    specs.push({ label: 'Производитель', value: 'Winbond' });
  }
  if (/^SST25|^SST26/.test(s)) {
    specs.push({ label: 'Тип', value: 'Serial Flash (NOR)' });
    specs.push({ label: 'Интерфейс', value: 'SPI' });
  }
  if (/^FM25/.test(s)) {
    specs.push({ label: 'Тип', value: 'FRAM (Ferroelectric RAM)' });
    specs.push({ label: 'Интерфейс', value: 'SPI' });
  }
  if (/^MR25|^MR4A/.test(s)) {
    specs.push({ label: 'Тип', value: 'MRAM (Magnetoresistive RAM)' });
  }

  return specs;
}

/** Интерфейсы (USB/RS485/CAN/Ethernet) */
function extractInterface(sku: string, name: string, desc: string): Spec[] {
  const specs: Spec[] = [];
  const s = sku.toUpperCase();
  const t = up(name + ' ' + desc);

  if (/^MAX485|^SP485|^SP3485/.test(s)) {
    specs.push({ label: 'Тип', value: 'Приёмопередатчик RS-485/RS-422' });
    specs.push({ label: 'Скорость', value: 'до 10 Мбит/с' });
    specs.push({ label: 'Питание', value: '5 В' });
  }
  if (/^MCP2515/.test(s)) {
    specs.push({ label: 'Тип', value: 'CAN-контроллер (SPI)' });
    specs.push({ label: 'Производитель', value: 'Microchip' });
  }
  if (/^CP210|^FT2\d|^FT23/.test(s)) {
    specs.push({ label: 'Тип', value: 'USB-UART мост' });
    if (/CP210/.test(s)) specs.push({ label: 'Производитель', value: 'Silicon Labs' });
    if (/FT/.test(s)) specs.push({ label: 'Производитель', value: 'FTDI' });
  }
  if (/^CH340|^CH9/.test(s)) {
    specs.push({ label: 'Тип', value: 'USB-UART мост' });
    specs.push({ label: 'Производитель', value: 'WCH (Qinheng)' });
  }
  if (/^LAN87|^DP83/.test(s)) {
    specs.push({ label: 'Тип', value: 'Ethernet PHY' });
  }
  if (/^TUSB|^USB3/.test(s)) {
    specs.push({ label: 'Тип', value: 'USB-хаб/контроллер' });
  }
  if (/^SN65HVD/.test(s)) {
    specs.push({ label: 'Тип', value: 'CAN/RS-485 приёмопередатчик' });
    specs.push({ label: 'Производитель', value: 'Texas Instruments' });
  }

  return specs;
}

/** Электроавтоматика (автоматы, контакторы) */
function extractElectric(sku: string, name: string, desc: string): Spec[] {
  const specs: Spec[] = [];
  const s = sku.toUpperCase();
  const t = up(name + ' ' + desc);

  // Siemens 5SYxxxx-x — автоматы
  if (/^5SY\d/.test(s)) {
    specs.push({ label: 'Тип', value: 'Автоматический выключатель' });
    specs.push({ label: 'Производитель', value: 'Siemens' });
    specs.push({ label: 'Серия', value: '5SY (модульный)' });
    // Ток: 5SY6125-7 → 12А? или по другим признакам
    const cM = s.match(/(\d{2})A?-/);
    if (cM) specs.push({ label: 'Номинальный ток', value: `${cM[1]} А` });
    specs.push({ label: 'Характеристика', value: 'C (стандартная)' });
  }
  if (/^5SP|^5SL/.test(s)) {
    specs.push({ label: 'Тип', value: 'УЗО / дифавтомат' });
    specs.push({ label: 'Производитель', value: 'Siemens' });
  }

  return specs;
}

/** Предохранители */
function extractFuse(sku: string, name: string, desc: string): Spec[] {
  const specs: Spec[] = [];
  const s = sku.toUpperCase();
  const t = up(name + ' ' + desc);

  // 1206Lxxx — SMD polyfuse
  if (/^1206L|^0805L/.test(s)) {
    specs.push({ label: 'Тип', value: 'SMD самовосстанавливающийся предохранитель (polyfuse)' });
    const sizeM = s.match(/^(\d{4})L/);
    if (sizeM) specs.push({ label: 'Размер', value: sizeM[1] });
  }
  // MF-MSMF — polyfuse
  if (/^MF-MSMF|^MF-PSMF/.test(s)) {
    specs.push({ label: 'Тип', value: 'Polyfuse (самовосстанавливающийся)' });
  }
  // Стеклянные: 5x20, 6x30
  if (/5X20|6X30|FUSE.*GLASS/.test(s)) {
    specs.push({ label: 'Тип', value: 'Стеклянный предохранитель' });
    specs.push({ label: 'Корпус', value: '5×20 мм' });
  }

  // Ток: ищем 1A, 2A, 5A
  const iM = t.match(/(\d+(?:\.\d+)?)\s*A\b/);
  if (iM) specs.push({ label: 'Номинальный ток', value: `${iM[1]} А` });

  return specs;
}

// ───────────────────────────────────────────────────────────────────────────────
// Главная функция
// ───────────────────────────────────────────────────────────────────────────────

export function extractSpecs(component: Component): Spec[] {
  const { sku, name = '', brand = '', category = '', description = '' } = component;
  if (!sku) return [];

  // ─────────────────────────────────────────────────────────────
  // 0. Обязательные верхние строки: Номенклатурный № + Артикул + Бренд
  // ─────────────────────────────────────────────────────────────
  const header: Spec[] = [];
  const nomenclatureNumber = generateNomenclatureNumber(sku, category);
  if (nomenclatureNumber) {
    header.push({ label: 'Номенклатурный номер', value: nomenclatureNumber });
  }
  header.push({ label: 'Артикул', value: sku });
  if (brand) {
    header.push({ label: 'Бренд', value: brand });
  }

  // ─────────────────────────────────────────────────────────────
  // 1. ПРИОРИТЕТ: курируемая БД полных параметров популярных деталей.
  // Если SKU найден — вернуть header + полные параметры из БД.
  // ─────────────────────────────────────────────────────────────
  const fullSpecs = lookupFullSpecs(sku);
  if (fullSpecs && fullSpecs.length > 0) {
    // Дедупликация: убрать из БД поля, уже присутствующие в header
    const headerLabels = new Set(header.map(s => s.label));
    const filtered = fullSpecs.filter(s => !headerLabels.has(s.label));
    return [...header, ...filtered];
  }

  // ─────────────────────────────────────────────────────────────
  // 2. Rule-based экстрактор (если SKU не в БД)
  // ─────────────────────────────────────────────────────────────
  const specs: Spec[] = [];
  const cat = (category || '').trim();

  if (/Микроконтроллер/.test(cat)) {
    specs.push(...extractMCU(sku, name, description));
  } else if (/Конденсатор/.test(cat)) {
    specs.push(...extractCapacitor(sku, name, description));
  } else if (/Резистор/.test(cat)) {
    specs.push(...extractResistor(sku, name, description));
  } else if (/Диод/.test(cat)) {
    specs.push(...extractDiode(sku, name, description));
  } else if (/Транзистор/.test(cat)) {
    specs.push(...extractTransistor(sku, name, description));
  } else if (/Стабилизатор/.test(cat)) {
    specs.push(...extractRegulator(sku, name, description));
  } else if (/Операционные/.test(cat)) {
    specs.push(...extractOpAmp(sku, name, description));
  } else if (/Логик/.test(cat)) {
    specs.push(...extractLogic(sku, name, description));
  } else if (/Кварц|Резонатор/.test(cat)) {
    specs.push(...extractCrystal(sku, name, description));
  } else if (/Реле/.test(cat)) {
    specs.push(...extractRelay(sku, name, description));
  } else if (/Индуктивн/.test(cat)) {
    specs.push(...extractInductor(sku, name, description));
  } else if (/Оптоэлектрон/.test(cat)) {
    specs.push(...extractOpto(sku, name, description));
  } else if (/Разъём|Разъем/.test(cat)) {
    specs.push(...extractConnector(sku, name, description));
  } else if (/АЦП|ЦАП/.test(cat)) {
    specs.push(...extractAdcDac(sku, name, description));
  } else if (/Датчик/.test(cat)) {
    specs.push(...extractSensor(sku, name, description));
  } else if (/Память/.test(cat)) {
    specs.push(...extractMemory(sku, name, description));
  } else if (/Интерфейс/.test(cat)) {
    specs.push(...extractInterface(sku, name, description));
  } else if (/Электроавтомат/.test(cat)) {
    specs.push(...extractElectric(sku, name, description));
  } else if (/Предохран/.test(cat)) {
    specs.push(...extractFuse(sku, name, description));
  } else {
    // Fallback: попытка по SKU
    if (/^STM32|^ESP|^ATMEGA|^ATTINY|^PIC\d/.test(sku.toUpperCase())) {
      specs.push(...extractMCU(sku, name, description));
    } else if (/^GRM|^UPW|^EEU|^LGK/.test(sku.toUpperCase())) {
      specs.push(...extractCapacitor(sku, name, description));
    } else if (/^CRCW|^MCR|^CRG|^ERJ|^RK7/.test(sku.toUpperCase())) {
      specs.push(...extractResistor(sku, name, description));
    } else if (/^1N|^BZX|^KBPC|^SMBJ/.test(sku.toUpperCase())) {
      specs.push(...extractDiode(sku, name, description));
    } else if (/^74|^CD40|^HEF40/.test(sku.toUpperCase())) {
      specs.push(...extractLogic(sku, name, description));
    } else if (/^LM\d|^AMS\d|^TPS\d|^LT\d/.test(sku.toUpperCase())) {
      specs.push(...extractRegulator(sku, name, description));
    }
  }

  // 3. Общие параметры (добавляем в конце) — только те, что не в header
  const general: Spec[] = [];
  // "Производитель" уже выведен как "Бренд" в header — пропускаем здесь

  const pkg = detectPackage(sku, name);
  if (pkg !== '—') general.push({ label: 'Корпус', value: pkg });

  const mounting = detectMounting(sku, name, cat);
  general.push({ label: 'Тип монтажа', value: mounting });

  const temp = detectTempRange(cat, sku, name);
  if (temp !== '—') general.push({ label: 'Рабочая температура', value: temp });

  // ─────────────────────────────────────────────────────────────────
  // 3.5 ENRICHMENT: добавить недостающие параметры по типу/корпусу/категории
  // Это гарантирует что каждый компонент будет иметь 12+ параметров.
  // ─────────────────────────────────────────────────────────────────
  const enriched = enrichWithDefaults(specs, pkg, mounting, cat, sku, name, description);

  // Объединить: header (Номенклатура/Артикул/Бренд) + параметры из экстрактора + обогащённые + общие
  // Дедупликация по label — header имеет приоритет
  const seen = new Set<string>();
  const result: Spec[] = [];
  for (const sp of [...header, ...enriched, ...general]) {
    if (!seen.has(sp.label)) {
      seen.add(sp.label);
      result.push(sp);
    }
  }

  return result;
}

// ───────────────────────────────────────────────────────────────────────────────
// ENRICHMENT: добавляет недостающие параметры на основе корпуса/категории
// Это гарантирует 12+ параметров для каждого компонента
// ───────────────────────────────────────────────────────────────────────────────

function enrichWithDefaults(
  specs: Spec[],
  pkg: string,
  mounting: string,
  category: string,
  sku: string,
  name: string,
  desc: string
): Spec[] {
  const result = [...specs];
  const t = up(`${sku} ${name} ${desc}`);
  const cat = (category || '').trim();
  const hasLabel = (label: string) => result.some(s => s.label === label);
  const addIfMissing = (label: string, value: string) => {
    if (!hasLabel(label) && value && value !== '—') {
      result.push({ label, value });
    }
  };

  // ─── Конденсаторы: добавить ESR, lifetime, ripple current ────────────────
  if (/Конденсатор/.test(cat)) {
    if (/Электролит/.test(result.find(s => s.label === 'Тип')?.value || '')) {
      addIfMissing('ESR (экв. послед. сопр.)', '≤0.1 Ом (тип., 100 кГц)');
      addIfMissing('Пульсирующий ток', '1.5 А (тип., 105°C, 100 кГц)');
      addIfMissing('Срок службы', '8000–10000 ч (при 105°C)');
      addIfMissing('Ток утечки', '≤0.01·C·V (мкА, после 2 мин)');
      addIfMissing('Тангенс угла потерь (tg δ)', '≤0.20 (при 120 Гц, 20°C)');
      addIfMissing('Категория температуры', '105°C (стандарт.)');
    } else if (/MLCC|керам/.test(result.find(s => s.label === 'Тип')?.value || '')) {
      addIfMissing('ESR (экв. послед. сопр.)', '5–50 мОм (тип.)');
      addIfMissing('Тангенс угла потерь (tg δ)', 'C0G: ≤0.001 / X7R: ≤0.025');
      addIfMissing('Срок службы', 'не ограничен (твёрдый диэлектрик)');
      addIfMissing('Самовосстановление', 'Нет');
      addIfMissing('DC bias effect', 'X7R/X5R: -30…-60% при рабочем V');
      addIfMissing('Сертификация', 'AEC-Q200 (automotive, опц.)');
    } else if (/Тантал/.test(result.find(s => s.label === 'Тип')?.value || '')) {
      addIfMissing('ESR (экв. послед. сопр.)', '50–500 мОм (тип.)');
      addIfMissing('Ток утечки', '≤0.01·C·V (мкА)');
      addIfMissing('Срок службы', 'не ограничен');
      addIfMissing('Защита', 'Внутренний предохранитель (опц.)');
      addIfMissing('Тангенс угла потерь (tg δ)', '≤0.06 (при 120 Гц)');
    } else if (/Плён/.test(result.find(s => s.label === 'Тип')?.value || '')) {
      addIfMissing('ESR (экв. послед. сопр.)', '5–20 мОм (тип.)');
      addIfMissing('Тангенс угла потерь (tg δ)', '≤0.001 (MKP), ≤0.0008 (MKS)');
      addIfMissing('Срок службы', '100 000+ ч');
      addIfMissing('Самовосстановление', 'Да (металлизированная плёнка)');
      addIfMissing('Рабочая частота', 'до 100 кГц');
    }
  }

  // ─── Резисторы: добавить TCR, max voltage, noise ─────────────────────────
  if (/Резистор/.test(cat)) {
    addIfMissing('TCR (темп. коэф.)', '±100 ppm/°C (тип., толстоплёночный)');
    addIfMissing('Макс. рабочее напряжение', pkg.includes('0603') ? '75 В' :
                pkg.includes('0805') ? '150 В' :
                pkg.includes('1206') ? '200 В' :
                pkg.includes('2512') ? '500 В' :
                '200 В (тип.)');
    addIfMissing('Шум', '< 0.1 мкВ/В (тип.)');
    addIfMissing('Сопротивление изоляции', '> 10 ГОм');
    addIfMissing('Сертификация', 'AEC-Q200 (опц.)');
    if (/Wirewound/.test(result.find(s => s.label === 'Тип')?.value || '')) {
      addIfMissing('Индуктивность', '5–50 нГн (тип., wirewound)');
      addIfMissing('TCR (темп. коэф.)', '±50 ppm/°C (тип.)');
    }
  }

  // ─── Диоды: добавить trr, Ir, junction capacitance ───────────────────────
  if (/Диод/.test(cat)) {
    const dType = result.find(s => s.label === 'Тип')?.value || '';
    if (/Стабилитрон/.test(dType)) {
      addIfMissing('Время восстановления', '< 100 нс (тип.)');
      addIfMissing('Ёмкость перехода', '50–200 пФ (при Vr=0)');
      addIfMissing('Тепловое сопротивление', '50°C/Вт (DO-41)');
      addIfMissing('Макс. импульсный ток', '8.3 мс, 2× IZM');
    } else if (/Шоттки/.test(dType)) {
      addIfMissing('Время восстановления', '< 10 нс');
      addIfMissing('Ёмкость перехода', '50–150 пФ');
      addIfMissing('Обратный ток (Ir)', '0.5 мА (тип., при 25°C)');
      addIfMissing('Тепловое сопротивление', pkg.includes('DO-41') ? '50°C/Вт' :
                  pkg.includes('DO-201') ? '30°C/Вт' : '50°C/Вт');
    } else if (/Выпрямител|мост/.test(dType)) {
      addIfMissing('Время восстановления (trr)', '30 мкс (стандартный) / <100 нс (fast)');
      addIfMissing('Обратный ток (Ir)', '5–50 мкА (при 25°C)');
      addIfMissing('Ёмкость перехода', '10–30 пФ (при Vr=4В)');
      addIfMissing('Тепловое сопротивление', pkg.includes('KBPC') ? '2°C/Вт' : '50°C/Вт');
      addIfMissing('Макс. импульсный ток', '30 А (8.3 мс, 1N400x)');
    } else if (/TVS/.test(dType)) {
      addIfMissing('Время отклика', '< 1 пс (clamping)');
      addIfMissing('Ёмкость перехода', '50–3000 пФ (зависит от типа)');
      addIfMissing('Тепловое сопротивление', '40–80°C/Вт');
    }
  }

  // ─── Транзисторы: добавить Qg, Vth, td(on/off), Ciss/Crss ───────────────
  if (/Транзистор/.test(cat)) {
    const tType = result.find(s => s.label === 'Тип')?.value || '';
    if (/MOSFET/.test(tType)) {
      addIfMissing('Пороговое Uзи (Vgs(th))', '2–4 В (тип.)');
      addIfMissing('Заряд затвора (Qg)', pkg.includes('TO-220') ? '30–80 нКл' : '5–30 нКл');
      addIfMissing('Время вкл. (td(on))', '10–50 нс (тип.)');
      addIfMissing('Время выкл. (td(off))', '30–150 нс (тип.)');
      addIfMissing('Входная ёмкость (Ciss)', '500–3000 пФ (тип.)');
      addIfMissing('Обратная ёмкость (Crss)', '50–300 пФ (тип.)');
      addIfMissing('Тепловое сопротивление Rth(j-c)', pkg.includes('TO-220') ? '1.0°C/Вт' :
                  pkg.includes('TO-247') ? '0.5°C/Вт' :
                  pkg.includes('SOT-23') ? '150°C/Вт' :
                  pkg.includes('DPAK') ? '4°C/Вт' : '50°C/Вт');
      addIfMissing('Макс. Uзи (Vgs)', '±20 В');
      addIfMissing('Диапазон рабочих частот', 'до 1 МГц (силовые)');
    } else if (/BJT/.test(tType)) {
      addIfMissing('Граничная частота (fT)', '100–300 МГц (тип., малый сигнал)');
      addIfMissing('Коэф. усиления (hFE)', '100–300 (тип.)');
      addIfMissing('Напряжение насыщения (Vce(sat))', '0.2–0.5 В (тип.)');
      addIfMissing('Тепловое сопротивление Rth(j-c)', pkg.includes('TO-220') ? '4°C/Вт' :
                  pkg.includes('TO-92') ? '150°C/Вт' :
                  pkg.includes('SOT-23') ? '300°C/Вт' : '80°C/Вт');
      addIfMissing('Ёмкость коллектор-база (Ccb)', '2–10 пФ (тип.)');
      addIfMissing('Макс. Uбэ', '5–6 В');
    } else if (/IGBT/.test(tType)) {
      addIfMissing('Vce(sat)', '1.5–2.5 В (тип.)');
      addIfMissing('Заряд затвора (Qg)', '50–200 нКл');
      addIfMissing('Тепловое сопротивление', '0.5–1.5°C/Вт');
      addIfMissing('Частота коммутации', 'до 30 кГц (тип.)');
    }
  }

  // ─── Стабилизаторы: добавить Iq, PSRR, dropout, output noise ────────────
  if (/Стабилизатор/.test(cat)) {
    const rType = result.find(s => s.label === 'Тип')?.value || '';
    if (/LDO/.test(rType)) {
      addIfMissing('Ток покоя (Iq)', '1–10 мА (тип.)');
      addIfMissing('PSRR (подавление пульсаций)', '40–70 дБ (при 1 кГц)');
      addIfMissing('Выходной шум', '30–100 мкВ/√Гц (тип., 10 Гц–100 кГц)');
      addIfMissing('Line regulation', '0.01–0.1 %/В (тип.)');
      addIfMissing('Load regulation', '0.1–1 % (тип.)');
      addIfMissing('Защита', 'От перегрева, от КЗ (current limit)');
      addIfMissing('Стабильность', 'Конденсатор на выходе 1–22 мкФ');
    } else if (/DC-DC|Buck|Boost/.test(rType)) {
      addIfMissing('Ток покоя (Iq)', '0.5–5 мА (тип.)');
      addIfMissing('КПД', '85–95% (тип., при оптимальной нагрузке)');
      addIfMissing('Частота ШИМ', '150 кГц–4 МГц (зависит от модели)');
      addIfMissing('Line regulation', '0.1 %/В (тип.)');
      addIfMissing('Load regulation', '0.5 % (тип.)');
      addIfMissing('Защита', 'От перегрева, КЗ, UVLO');
      addIfMissing('Пуск (soft-start)', '1–5 мс (тип.)');
    } else if (/Линейн/.test(rType)) {
      addIfMissing('Ток покоя (Iq)', '5–10 мА (тип.)');
      addIfMissing('Line regulation', '0.1 %/В (тип.)');
      addIfMissing('Load regulation', '0.5 % (тип.)');
      addIfMissing('Ripple rejection', '40–70 дБ (при 120 Гц)');
      addIfMissing('Выходной шум', '40 мкВ/√Гц (тип.)');
      addIfMissing('Защита', 'От перегрева, от КЗ (current foldback)');
      addIfMissing('Стабильность', 'Выходной конденсатор 0.1–10 мкФ');
    }
  }

  // ─── ОУ: добавить slew rate, GBP, CMRR, PSRR, offset ────────────────────
  if (/Операционные/.test(cat)) {
    addIfMissing('Скорость нарастания (slew rate)', '0.5–13 В/мкс (тип.)');
    addIfMissing('Произведение усиления на полосу (GBP)', '1–10 МГц (тип.)');
    addIfMissing('CMRR', '70–100 дБ (тип.)');
    addIfMissing('PSRR', '70–100 дБ (тип.)');
    addIfMissing('Входное напряжение смещения', '1–10 мВ (тип.)');
    addIfMissing('Входной ток смещения', '10 нА–1 мкА (тип.)');
    addIfMissing('Выходной ток', '20–50 мА (тип.)');
    addIfMissing('Ток потребления', '0.5–10 мА (тип., на канал)');
    addIfMissing('Входное напряжение шума', '5–20 нВ/√Гц (тип., при 1 кГц)');
    addIfMissing('Напряжение питания', '±1.5…±18 В (тип.)');
  }

  // ─── Логика: добавить propagation delay, Vih/Vil, Icc ───────────────────
  if (/Логик/.test(cat)) {
    addIfMissing('Напряжение питания (Vcc)', '2–6 В (74HC), 4.5–5.5 В (74LS)');
    addIfMissing('Время задержки (tpd)', '5–25 нс (тип., при 5В)');
    addIfMissing('Макс. тактовая частота', '25–50 МГц (тип.)');
    addIfMissing('Входной ток (Iih/Iil)', '±1 мкА (CMOS), 0.4 мА (TTL)');
    addIfMissing('Выходной ток (Ioh/Iol)', '±6 мА (74HC), ±8 мА (74LS)');
    addIfMissing('Ток потребления (Icc)', '4 мкА (статич., CMOS), 4–20 мА (TTL)');
    addIfMissing('Входной ток утечки', '±1 мкА (тип.)');
    addIfMissing('Помехоустойчивость', '1 В (тип., при 5В)');
  }

  // ─── MCU: добавить peripherals, ADC, GPIO, Freq, supply ─────────────────
  if (/Микроконтролл/.test(cat)) {
    addIfMissing('Напряжение питания (Vdd)', '1.8…3.6 В (тип.)');
    addIfMissing('Ток потребления (Run)', '10–100 мА (тип., при макс. частоте)');
    addIfMissing('Ток потребления (Sleep)', '1–50 мкА (тип.)');
    addIfMissing('Программная память', result.find(s => s.label === 'Flash-память')?.value || '32–512 КБ');
    addIfMissing('ОЗУ (SRAM)', result.find(s => s.label === 'RAM')?.value || '4–192 КБ');
    addIfMissing('EEPROM', '0–4 КБ (опц., завис. от серии)');
    addIfMissing('АЦП', '12-bit, 8–24 канала (тип.)');
    addIfMissing('ЦАП', '0–2 канала, 12-bit (опц.)');
    addIfMissing('Таймеры', '3–10× 16-bit (PWM, capture, compare)');
    addIfMissing('Интерфейсы', 'I2C, SPI, USART, USB, CAN (зависит от модели)');
    addIfMissing('Сторожевой таймер (WDT)', 'Да (независимый)');
    addIfMissing('Рабочая частота', result.find(s => s.label === 'Тактовая частота')?.value || 'до 80 МГц');
  }

  // ─── Кварцы: добавить load capacitance, ESR, drive level ────────────────
  if (/Кварц|Резонатор/.test(cat)) {
    addIfMissing('Нагрузочная ёмкость (CL)', '12–18 пФ (тип., SMD), 18–32 пФ (HC-49)');
    addIfMissing('ESR (экв. послед. сопр.)', pkg.includes('3225') ? '60–200 Ом' :
                pkg.includes('HC-49') ? '20–40 Ом' : '40–100 Ом');
    addIfMissing('Уровень возбуждения', '100 мкВт (макс.)');
    addIfMissing('Долговременная стабильность', '±3 ppm/год (тип.)');
    addIfMissing('Тип резонатора', 'AT-cut (основной тон)');
    addIfMissing('Резонанс', 'Параллельный (Series — опц.)');
    addIfMissing('Старение', '±1 ppm/год (тип.)');
  }

  // ─── Реле: добавить coil resistance, operate/release time, dielectric ──
  if (/Реле/.test(cat)) {
    addIfMissing('Сопротивление катушки', '400 Ом–10 кОм (тип., 5–24В)');
    addIfMissing('Ток катушки', '10–80 мА (тип., 5В)');
    addIfMissing('Время срабатывания', '5–15 мс (тип.)');
    addIfMissing('Время отпускания', '5–15 мс (тип.)');
    addIfMissing('Сопротивление контактов', '≤ 100 мОм (начальное)');
    addIfMissing('Электрическая износостойкость', '100 000–1 000 000 циклов');
    addIfMissing('Механическая износостойкость', '10 000 000 циклов');
    addIfMissing('Диэлектрическая прочность', '1500 Vrms (катушка-контакт)');
    addIfMissing('Макс. коммутируемая мощность', 'до 2500 ВА (тип.)');
    addIfMissing('Изоляция', '1000 МОм (мин., 500В DC)');
  }

  // ─── Индуктивности: добавить DCR, SRF, rated current, Q factor ─────────
  if (/Индуктивн/.test(cat)) {
    addIfMissing('DCR (омическое сопр.)', '10–500 мОм (тип.)');
    addIfMissing('Ток насыщения (Isat)', '1–10 А (тип., -20% L)');
    addIfMissing('Тепловой ток (Irms)', '1–8 А (тип., +40°C)');
    addIfMissing('Саморезонансная частота (SRF)', '10–100 МГц (тип.)');
    addIfMissing('Добротность (Q)', '20–80 (при 1 МГц, тип.)');
    addIfMissing('Допуск индуктивности', '±20% (тип.) / ±10% (опц.)');
    addIfMissing('Магнитное экранирование', pkg.includes('SMD') ? 'Да (металлический компаунд)' : 'Нет');
  }

  // ─── Оптроны/оптоэлектроника: Vce, Vf, CTR, isolation, Bandwidth ──────
  if (/Оптоэлектрон/.test(cat)) {
    const oType = result.find(s => s.label === 'Тип')?.value || '';
    if (/Оптрон/.test(oType)) {
      addIfMissing('Макс. U коллектор-эмиттер', '35–80 В (тип.)');
      addIfMissing('Макс. входной ток (If)', '50–80 мА (тип.)');
      addIfMissing('Входное прямое напряжение (Vf)', '1.2–1.4 В (тип., при 20 мА)');
      addIfMissing('Время нарастания/спада', '3–50 мкс (транзисторный выход)');
      addIfMissing('Bandwidth', '20–300 кГц (тип.)');
      addIfMissing('Макс. ток коллектора (Ic)', '20–50 мА (тип.)');
      addIfMissing('Ток потребления (CE leakage)', '≤ 100 нА (при Vce)');
      addIfMissing('Сопротивление изоляции', '≥ 10¹² Ом (тип.)');
    } else if (/OLED|Display/.test(oType)) {
      addIfMissing('Напряжение питания', '3.3 В (тип.)');
      addIfMissing('Угол обзора', '160° (тип.)');
      addIfMissing('Контраст', '2000:1 (OLED), 200:1 (LCD)');
      addIfMissing('Яркость', '100–350 кд/м² (тип.)');
      addIfMissing('Подключение', 'I2C (адрес 0x3C/0x3D), SPI');
      addIfMissing('Рабочее напряжение', '3.3–5 В');
    } else if (/LED/.test(oType) || /Светодиод/.test(oType)) {
      addIfMissing('Прямое напряжение (Vf)', '1.8–3.4 В (зависит от цвета)');
      addIfMissing('Прямой ток (If)', '20 мА (макс. 30 мА)');
      addIfMissing('Сила света', '5–20 мкд (тип., 5мм LED)');
      addIfMissing('Угол обзора', '15–60° (тип.)');
      addIfMissing('Длина волны', '625 нм (красный), 590 нм (жёлтый), 525 нм (зелёный), 470 нм (синий)');
      addIfMissing('Обратное напряжение (Vr)', '5 В (макс.)');
      addIfMissing('Рабочая температура', '-40…+80°C');
    }
  }

  // ─── Разъёмы: добавить current rating, voltage, contact resistance ─────
  if (/Разъём|Разъем/.test(cat)) {
    addIfMissing('Номинальный ток', '1–10 А (зависит от типа)');
    addIfMissing('Номинальное напряжение', '50–500 В (тип.)');
    addIfMissing('Сопротивление контактов', '≤ 20 мОм (тип.)');
    addIfMissing('Сопротивление изоляции', '≥ 1000 МОм');
    addIfMissing('Диэлектрическая прочность', '500–2000 Vrms');
    addIfMissing('Количество циклов подключения', '500–10 000 (зависит от типа)');
    addIfMissing('Материал контактов', 'Латунь с золотым покрытием (опц.)');
    addIfMissing('Материал изолятора', 'LCP/PA66 (темп. до 260°C)');
    addIfMissing('Стандарт', 'UL, RoHS');
  }

  // ─── Датчики: добавить supply, interface, response time, accuracy ─────
  if (/Датчик/.test(cat)) {
    addIfMissing('Напряжение питания', '1.7–5.5 В (тип.)');
    addIfMissing('Ток потребления (active)', '0.5–5 мА (тип.)');
    addIfMissing('Ток потребления (sleep)', '1–10 мкА (тип.)');
    addIfMissing('Время отклика', '1–100 мс (тип.)');
    addIfMissing('Точность', '±1–3% (тип.)');
    addIfMissing('Сертификация', 'AEC-Q100 (опц., automotive)');
    addIfMissing('Разрешение', '12–24 бит (зависит от типа)');
    addIfMissing('Частота выборки (ODR)', '1–75 Гц (тип.)');
  }

  // ─── Интерфейсы: добавить data rate, ESD, supply ───────────────────────
  if (/Интерфейс/.test(cat)) {
    const iType = result.find(s => s.label === 'Тип')?.value || '';
    if (/RS-485|RS485/.test(iType)) {
      addIfMissing('Макс. скорость', 'до 10 Мбит/с');
      addIfMissing('Напряжение питания', '4.75–5.25 В (5В) или 3.0–3.6 В (3.3В)');
      addIfMissing('Кол-во узлов в сети', '32 (unit load)');
      addIfMissing('ESD защита', '±15 кВ (HBM)');
      addIfMissing('Дифференциальный выход', '±2 В (макс.)');
      addIfMissing('Ток потребления (Rx)', '300 мкА (тип.)');
      addIfMissing('Защита', 'Тепловая, от КЗ на шине');
    } else if (/USB-UART/.test(iType)) {
      addIfMissing('Стандарт USB', 'USB 2.0 Full Speed (12 Мбит/с)');
      addIfMissing('Макс. скорость UART', '1–3 Мбит/с (тип.)');
      addIfMissing('FIFO буфер', '16–256 байт (TX/RX)');
      addIfMissing('GPIO', '4–8 линий (мультиплексируемые)');
      addIfMissing('EEPROM', 'Внутренняя (для VID/PID/serial)');
      addIfMissing('ESD защита', '±8 кВ (HBM, на D+/D-)');
    } else if (/CAN/.test(iType)) {
      addIfMissing('Стандарт', 'CAN 2.0A/B (ISO 11898)');
      addIfMissing('Макс. скорость', '1 Мбит/с');
      addIfMissing('Буферы', '3× TX, 2× RX (тип.)');
      addIfMissing('Фильтры', '2 маски + 6 фильтров');
      addIfMissing('Напряжение питания', '2.7–5.5 В');
      addIfMissing('Ток потребления (sleep)', '1–10 мкА');
    } else if (/Ethernet/.test(iType)) {
      addIfMissing('Скорость', '10/100 Мбит/с (Fast Ethernet)');
      addIfMissing('Стандарт', 'IEEE 802.3u');
      addIfMissing('Напряжение питания', '1.8–3.3 В (аналог.), 3.3 В (цифр.)');
      addIfMissing('Интерфейс к MCU', 'MII/RMII');
      addIfMissing('ESD защита', '±4 кВ (HBM)');
    }
  }

  // ─── Память: добавить write cycles, retention, speed ───────────────────
  if (/Память/.test(cat)) {
    const mType = result.find(s => s.label === 'Тип')?.value || '';
    if (/EEPROM/.test(mType)) {
      addIfMissing('Частота шины', '100–400 кГц (I2C)');
      addIfMissing('Время записи страницы', '5 мс (макс.)');
      addIfMissing('Размер страницы', '8–64 байта');
      addIfMissing('Ресурс записи', '1 000 000 циклов');
      addIfMissing('Сохранность данных', '100–200 лет');
      addIfMissing('Защита от записи', 'Hardware Write Protect (опц.)');
    } else if (/Flash/.test(mType)) {
      addIfMissing('Скорость интерфейса', 'до 104 МГц (SPI), Dual/Quad-SPI');
      addIfMissing('Время записи страницы', '0.7–3 мс (тип.)');
      addIfMissing('Размер страницы', '256 байт');
      addIfMissing('Размер сектора', '4 КБ');
      addIfMissing('Размер блока', '32–128 КБ');
      addIfMissing('Ресурс записи', '100 000 циклов на сектор');
      addIfMissing('Сохранность данных', '20 лет');
      addIfMissing('Защита', 'Block Lock, OTP area');
    } else if (/FRAM|MRAM/.test(mType)) {
      addIfMissing('Ресурс записи', '10¹⁴ циклов (неограничен)');
      addIfMissing('Сохранность данных', '151 год (тип., при 85°C)');
      addIfMissing('Время записи', '< 1 мкс (no page-write delay)');
      addIfMissing('Напряжение питания', '1.8–3.6 В');
      addIfMissing('Защита', 'Hardware Write Protect');
    }
  }

  // ─── АЦП/ЦАП: добавить resolution, sample rate, SNR, INL ───────────────
  if (/АЦП|ЦАП/.test(cat)) {
    addIfMissing('Напряжение питания', '2.7–5.5 В (тип.)');
    addIfMissing('Ток потребления (active)', '0.5–5 мА (тип.)');
    addIfMissing('Ток потребления (power-down)', '1–10 мкА');
    addIfMissing('Частота выборки (sample rate)', '1–1000 kSPS (тип.)');
    addIfMissing('SNR (отношение сигнал/шум)', '60–95 дБ (тип.)');
    addIfMissing('INL (интегральная нелинейность)', '±0.5–2 LSB (тип.)');
    addIfMissing('DNL (дифф. нелинейность)', '±0.5 LSB (тип., no missing codes)');
    addIfMissing('Опорное напряжение (Vref)', '2.5 В (внутр.) или до Vdd');
    addIfMissing('Сертификация', 'AEC-Q100 (опц.)');
  }

  // ─── Переключатели/Кнопки: добавить rating, IP, lifecycle ──────────────
  if (/Переключател/.test(cat)) {
    addIfMissing('Контактное сопротивление', '≤ 100 мОм (начальное)');
    addIfMissing('Изоляционное сопротивление', '≥ 100 МОм (при 100В DC)');
    addIfMissing('Диэлектрическая прочность', '500–1000 Vrms');
    addIfMissing('Электрическая износостойкость', '100 000–1 000 000 циклов');
    addIfMissing('Механическая износостойкость', '1 000 000+ циклов');
    addIfMissing('Усилие нажатия', '1.0–3.0 Н (тип.)');
    addIfMissing('Ход (travel)', '0.25–3.0 мм (зависит от типа)');
    addIfMissing('Степень защиты (IP)', 'IP40–IP67 (опц.)');
    addIfMissing('Материал контактов', 'Фосфорная бронза с золотым покрытием');
  }

  // ─── Предохранители: добавить I2t, melting, clearing time ──────────────
  if (/Предохран/.test(cat)) {
    addIfMissing('Время срабатывания (melting)', 'быстродействующие: <1 мс / slow-blow: 1–10 с');
    addIfMissing('I²t (тепловая энергия)', '0.1–1000 A²с (зависит от номинала)');
    addIfMissing('Ток срабатывания', '1.35–2× Inom (тип.)');
    addIfMissing('Breaking capacity', '50–1500 А (зависит от типа)');
    addIfMissing('Сопротивление', '10–500 мОм (тип.)');
    addIfMissing('Падение напряжения', '≤ 200 мВ (при номинальном токе)');
    addIfMissing('Стандарт', 'IEC 60127, UL 248');
  }

  // ─── Электроавтоматика: добавить характеристики автоматов ──────────────
  if (/Электроавтомат/.test(cat)) {
    addIfMissing('Количество полюсов', '1–4 (тип.)');
    addIfMissing('Характеристика срабатывания', 'B/C/D (тип., C для стандартных нагрузок)');
    addIfMissing('Отключающая способность (Icu)', '4.5–10 кА (тип.)');
    addIfMissing('Механическая износостойкость', '20 000 циклов (тип.)');
    addIfMissing('Электрическая износостойкость', '10 000 циклов (тип.)');
    addIfMissing('Сечение подключаемого провода', '1–25 мм² (тип.)');
    addIfMissing('Стандарт', 'IEC 60898, ГОСТ Р 50345');
    addIfMissing('Степень защиты', 'IP20 (выводы)');
  }

  // ─── Если вообще ничего не добавлено — добавить минимальный набор ──────
  // (чтобы каждый компонент имел хотя бы 6-8 параметров)
  if (result.length < 5) {
    addIfMissing('Категория', cat || '—');
    addIfMissing('Тип компонента', t.includes('IC') ? 'Интегральная схема' :
                t.includes('PASSIVE') ? 'Пассивный компонент' :
                t.includes('CONNECTOR') ? 'Разъём' :
                'Электронный компонент');
    addIfMissing('Применение', 'Промышленная электроника, B2B поставка');
    addIfMissing('Сертификация', 'RoHS, REACH (по запросу)');
    addIfMissing('Гарантия', '12 месяцев (оригинальная упаковка)');
    addIfMissing('Проверка подлинности', 'Входной контроль в лаборатории СВП');
  }

  return result;
}

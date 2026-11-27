// scripts/enrich-database-v3.ts
//
// Скрипт реклассификации 'Прочие компоненты' через MPN-декодер + keyword matcher.
// Для каждого товара с category_id=prochie UUID:
//   1. Запускает enrichComponent() для распознавания реальной категории
//   2. Применяет CATEGORY_MAPPING: subcategory → parent level-2 category
//      (например, 'Импульсные стабилизаторы (DC-DC)' → 'Стабилизаторы')
//   3. Находит UUID категории в таблице categories по name
//   4. PATCH components: обновляет category (string) + category_id (UUID) + brand + name + attributes
//
// Поддержка пагинации через Range header (Supabase REST API cap = 1000 per page).
//
// Запуск:
//   npx tsx scripts/enrich-database-v3.ts            # dry-run
//   npx tsx scripts/enrich-database-v3.ts --apply    # применить

import { enrichComponent } from '../lib/seo/component-enricher';

// ============================================================================
// КОНФИГУРАЦИЯ
// ============================================================================

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  console.error('Run: set -a && source .env.local && set +a && npx tsx scripts/enrich-database-v3.ts');
  process.exit(1);
}

const HEADERS = {
  'apikey': SUPABASE_SERVICE_KEY,
  'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
  'Content-Type': 'application/json',
  'Prefer': 'return=minimal',
};

const PROCHIE_UUID = '87898935-b44e-4bc2-9b25-5ac315d408fd';

// ============================================================================
// CATEGORY MAPPING: subcategory → parent level-2 category
// Возвращает классификатор для категорий, которые не существуют в categories.name (level=2)
// ============================================================================
const CATEGORY_MAPPING: Record<string, string> = {
  'Аналоговая электроника': 'Микросхемы',
  'Импульсные стабилизаторы (DC-DC)': 'Стабилизаторы',
  'Линейные стабилизаторы (LDO)': 'Стабилизаторы',
  'Конденсаторы танталовые': 'Конденсаторы',
  'Конденсаторы электролитические': 'Конденсаторы',
  'Микросхемы управления питанием (PMIC)': 'Стабилизаторы',
};

// ============================================================================
// EXTRA SKU PREFIX RULES (для нераспознанных товаров)
// Применяются ПОСЛЕ enrichComponent если category = 'Прочие компоненты'
// ============================================================================
type PrefixRule = {
  pattern: RegExp;
  category: string;
  type: string;
  brand?: string;
};

const EXTRA_RULES: PrefixRule[] = [
  // Optocouplers (Broadcom HCPL series)
  { pattern: /^HCPL[-_]?/i, category: 'Оптоэлектроника', type: 'Оптопара (Optocoupler)', brand: 'Broadcom' },
  { pattern: /^HCNR/i, category: 'Оптоэлектроника', type: 'Оптопара (Linear Optocoupler)' },
  { pattern: /^PS2[89]/i, category: 'Оптоэлектроника', type: 'Оптопара (Optocoupler)' },
  { pattern: /^TLP/i, category: 'Оптоэлектроника', type: 'Оптопара (Toshiba Optocoupler)', brand: 'Toshiba' },
  { pattern: /^PC[89]\d{2}/i, category: 'Оптоэлектроника', type: 'Оптопара (Sharp Optocoupler)', brand: 'Sharp' },
  { pattern: /^6N\d{2,3}/i, category: 'Оптоэлектроника', type: 'Оптопара (Transistor Output)' },
  // CNY17 — classic optocoupler
  { pattern: /^CNY\d{2}/i, category: 'Оптоэлектроника', type: 'Оптопара (Transistor Output)' },
  // Photodiodes / phototransistors
  { pattern: /^BPW/i, category: 'Оптоэлектроника', type: 'Фотодиод (Photodiode)', brand: 'Sharp' },
  { pattern: /^BPX/i, category: 'Оптоэлектроника', type: 'Фотодиод (Photodiode)' },
  { pattern: /^SFH/i, category: 'Оптоэлектроника', type: 'Фотодиод / фототранзистор (Osram)', brand: 'Osram' },
  // LED drivers (Worldsemi WS28xx series — broader than existing WS2811/12/13)
  { pattern: /^WS28[0-9]/i, category: 'LED драйверы', type: 'LED драйвер (Worldsemi)', brand: 'Worldsemi' },
  { pattern: /^WS28[2-9]/i, category: 'LED драйверы', type: 'LED драйвер (Worldsemi)', brand: 'Worldsemi' },
  { pattern: /^WS281[6-9]/i, category: 'LED драйверы', type: 'LED драйвер (Worldsemi)', brand: 'Worldsemi' },
  // LCD displays
  { pattern: /^LCD\d/i, category: 'Оптоэлектроника', type: 'LCD дисплей (Character Display)' },
  { pattern: /^NHD[-_]/i, category: 'Оптоэлектроника', type: 'OLED/LCD дисплей (Newhaven)', brand: 'Newhaven Display' },
  { pattern: /^WC1602/i, category: 'Оптоэлектроника', type: 'LCD дисплей (Character)' },
  { pattern: /^WC2004/i, category: 'Оптоэлектроника', type: 'LCD дисплей (Character)' },
  // MOSFETs — AOS AOT/AOD/AON/AO + AOS530
  { pattern: /^AO[TDN]\d/i, category: 'Транзисторы', type: 'MOSFET (AOS)', brand: 'Alpha & Omega Semiconductor' },
  { pattern: /^AOS\d/i, category: 'Транзисторы', type: 'MOSFET (AOS)', brand: 'Alpha & Omega Semiconductor' },
  { pattern: /^AON\d/i, category: 'Транзисторы', type: 'MOSFET (AOS)', brand: 'Alpha & Omega Semiconductor' },
  // AO + digit (AO11, AO530) — AOS MOSFETs
  { pattern: /^AO[0-9]/i, category: 'Транзисторы', type: 'MOSFET (AOS)', brand: 'Alpha & Omega Semiconductor' },
  // IXYS IXFA/IXFH/IXGP — MOSFET
  { pattern: /^IX[FDGP]/i, category: 'Транзисторы', type: 'MOSFET (IXYS)', brand: 'IXYS' },
  // AD669 — ADI DAC
  { pattern: /^AD[0-9]{3,4}/i, category: 'АЦП/ЦАП', type: 'АЦП/ЦАП (Analog Devices)', brand: 'Analog Devices' },
  // LM73 — TI temperature sensor
  { pattern: /^LM7\d{1,3}/i, category: 'Датчики', type: 'Датчик температуры (TI)', brand: 'Texas Instruments' },
  // LMV — TI op-amp (low voltage)
  { pattern: /^LMV\d{3,4}/i, category: 'Операционные усилители', type: 'ОУ (Low Voltage)', brand: 'Texas Instruments' },
  // LC4256 — Lattice CPLD
  { pattern: /^LC[0-9]{4}/i, category: 'ПЛИС (FPGA)', type: 'CPLD (Lattice)', brand: 'Lattice' },
  // FA22X7R — TDK MLCC capacitor (C_x_R dielectric pattern)
  { pattern: /^[CF][A-Z]?[0-9]+X[57]R/i, category: 'Конденсаторы', type: 'Керамический чип-конденсатор (MLCC)' },
  // ESDAVLC — STM ESD protection diode
  { pattern: /^ESDA?VL/i, category: 'Диоды', type: 'TVS-диод (ESD Protection)', brand: 'STMicroelectronics' },
  // CAT5113 — onsemi digital potentiometer
  { pattern: /^CAT511[0-9]/i, category: 'Резисторы', type: 'Цифровой потенциометр (Digital Pot)', brand: 'onsemi' },
  // Fairchild/ON Semi FDM/FDD/FDP — MOSFETs
  { pattern: /^FDM[DS]?[0-9]/i, category: 'Транзисторы', type: 'MOSFET (Fairchild/onsemi)', brand: 'onsemi' },
  { pattern: /^FDD[0-9]/i, category: 'Транзисторы', type: 'MOSFET (Fairchild/onsemi)', brand: 'onsemi' },
  { pattern: /^FDP[0-9]/i, category: 'Транзисторы', type: 'MOSFET (Fairchild/onsemi)', brand: 'onsemi' },
  // Rohm IKD/IKW/IGW
  { pattern: /^IKD/i, category: 'Транзисторы', type: 'MOSFET (Rohm IGBT)', brand: 'Rohm' },
  { pattern: /^IKW/i, category: 'Транзисторы', type: 'MOSFET (Rohm IGBT)', brand: 'Rohm' },
  { pattern: /^IGW/i, category: 'Транзисторы', type: 'MOSFET (Infineon IGBT)', brand: 'Infineon' },
  { pattern: /^IGK/i, category: 'Транзисторы', type: 'MOSFET (Infineon IGBT)', brand: 'Infineon' },
  // BJT transistors (2Nxxxx)
  { pattern: /^2N\d{3,4}/i, category: 'Транзисторы', type: 'Биполярный транзистор (BJT)' },
  { pattern: /^2SA/i, category: 'Транзисторы', type: 'BJT PNP (Japanese)' },
  { pattern: /^2SC/i, category: 'Транзисторы', type: 'BJT NPN (Japanese)' },
  { pattern: /^2SB/i, category: 'Транзисторы', type: 'BJT PNP (Japanese)' },
  { pattern: /^2SD/i, category: 'Транзисторы', type: 'BJT NPN (Japanese)' },
  { pattern: /^2SJ/i, category: 'Транзисторы', type: 'MOSFET P-channel (Japanese)' },
  { pattern: /^2SK/i, category: 'Транзисторы', type: 'MOSFET N-channel (Japanese)' },
  // Nexperia PBSS BJT series
  { pattern: /^PBSS\d/i, category: 'Транзисторы', type: 'BJT (Nexperia)', brand: 'Nexperia' },
  // STMicro TIP/STP/STB/STD/STN — MOSFETs
  { pattern: /^STP\d/i, category: 'Транзисторы', type: 'MOSFET (STMicro)', brand: 'STMicroelectronics' },
  { pattern: /^STB\d/i, category: 'Транзисторы', type: 'MOSFET (STMicro)', brand: 'STMicroelectronics' },
  { pattern: /^STD\d/i, category: 'Транзисторы', type: 'MOSFET (STMicro)', brand: 'STMicroelectronics' },
  { pattern: /^STN\d/i, category: 'Транзисторы', type: 'MOSFET (STMicro)', brand: 'STMicroelectronics' },
  // Littelfuse fuses
  { pattern: /^044[0-9]{4}/i, category: 'Предохранители', type: 'Предохранитель (Littelfuse)', brand: 'Littelfuse' },
  { pattern: /^0218[0-9]/i, category: 'Предохранители', type: 'Предохранитель (Littelfuse)', brand: 'Littelfuse' },
  { pattern: /^028[0-9]/i, category: 'Предохранители', type: 'Предохранитель (Littelfuse)', brand: 'Littelfuse' },
  { pattern: /^054[0-9]{3}/i, category: 'Предохранители', type: 'Предохранитель (Littelfuse)', brand: 'Littelfuse' },
  { pattern: /^296[0-9]{3}/i, category: 'Предохранители', type: 'Предохранитель (Littelfuse)', brand: 'Littelfuse' },
  { pattern: /^385[0-9]{3}/i, category: 'Предохранители', type: 'Предохранитель (Littelfuse)', brand: 'Littelfuse' },
  { pattern: /^421[0-9]{3}/i, category: 'Предохранители', type: 'Предохранитель (Littelfuse)', brand: 'Littelfuse' },
  // Chip resistors — UNI-ROYAL 0603WAF / 0805WAF
  { pattern: /^[0-9]{4}WAF/i, category: 'Резисторы', type: 'Чип-резистор (SMD)' },
  { pattern: /^[0-9]{4}WA/i, category: 'Резисторы', type: 'Чип-резистор (SMD)' },
  // Kyocera AVX capacitors — 06035A, 06035C, 08055A
  { pattern: /^[0-9]{4}5[AC][0-9]{3,4}/i, category: 'Конденсаторы', type: 'Керамический чип-конденсатор (MLCC)', brand: 'Kyocera AVX' },
  // Murata GRM/GRJ/NFM (chip capacitors)
  { pattern: /^GRM[0-9]/i, category: 'Конденсаторы', type: 'Керамический чип-конденсатор (MLCC)', brand: 'Murata' },
  { pattern: /^GRJ[0-9]/i, category: 'Конденсаторы', type: 'Керамический чип-конденсатор (MLCC)', brand: 'Murata' },
  { pattern: /^NFM[0-9]/i, category: 'Конденсаторы', type: 'Керамический чип-конденсатор (3-terminal)', brand: 'Murata' },
  // Yageo RC/LCR chip resistors
  { pattern: /^RC[0-9]{4}/i, category: 'Резисторы', type: 'Чип-резистор (SMD)', brand: 'Yageo' },
  { pattern: /^LCR[0-9]/i, category: 'Резисторы', type: 'Чип-резистор (SMD Current Sense)' },
  // TDK C / CKD capacitors
  { pattern: /^CKD/i, category: 'Конденсаторы', type: 'Керамический конденсатор (TDK)', brand: 'TDK' },
  { pattern: /^C[0-9]{5}X/i, category: 'Конденсаторы', type: 'Керамический чип-конденсатор (MLCC)' },
  // KEMET T / C capacitors
  { pattern: /^T5[0-9]{2}[A-Z]/i, category: 'Конденсаторы', type: 'Танталовый конденсатор (KEMET)', brand: 'KEMET' },
  // Nichicon UC/UCA electrolytic
  { pattern: /^UC[A-Z]?[0-9]/i, category: 'Конденсаторы', type: 'Электролитический конденсатор (Nichicon)', brand: 'Nichicon' },
  { pattern: /^UP[A-Z]?[0-9]/i, category: 'Конденсаторы', type: 'Электролитический конденсатор (Nichicon)', brand: 'Nichicon' },
  // Rubycon ZL / YX
  { pattern: /^ZL[HIRS]?[0-9]/i, category: 'Конденсаторы', type: 'Электролитический конденсатор (Rubycon)', brand: 'Rubycon' },
  { pattern: /^YX[0-9]/i, category: 'Конденсаторы', type: 'Электролитический конденсатор (Rubycon)', brand: 'Rubycon' },
  // Wurth 744xxxxx inductors
  { pattern: /^744[0-9]{5}/i, category: 'Индуктивности', type: 'Катушка индуктивности SMD (Wurth)', brand: 'Würth Elektronik' },
  // Coilcraft DO/DE inductors
  { pattern: /^DO[0-9]{4}/i, category: 'Индуктивности', type: 'Катушка индуктивности (Coilcraft)', brand: 'Coilcraft' },
  { pattern: /^DE[0-9]{4}/i, category: 'Индуктивности', type: 'Катушка индуктивности (Coilcraft)', brand: 'Coilcraft' },
  // Bourns SRR / SRW inductors
  { pattern: /^SRR[0-9]/i, category: 'Индуктивности', type: 'Катушка индуктивности (Bourns)', brand: 'Bourns' },
  { pattern: /^SRW[0-9]/i, category: 'Индуктивности', type: 'Катушка индуктивности (Bourns)', brand: 'Bourns' },
  // === NEW rules: TI / ADI / Microchip ICs ===
  // AD9833 — Direct Digital Synthesis (DDS) chip
  { pattern: /^AD98[0-9]{2}/i, category: 'АЦП/ЦАП', type: 'DDS синтезатор (Direct Digital Synthesis)', brand: 'Analog Devices' },
  // AD99xx — also DDS
  { pattern: /^AD99[0-9]{2}/i, category: 'АЦП/ЦАП', type: 'DDS синтезатор (Direct Digital Synthesis)', brand: 'Analog Devices' },
  // LMD18200 — TI motor driver (H-bridge)
  { pattern: /^LMD\d{4,5}/i, category: 'Интерфейсы', type: 'Мотор-драйвер (H-Bridge)', brand: 'Texas Instruments' },
  // TCA9544A — I2C multiplexer (Microchip)
  { pattern: /^TCA\d{4}/i, category: 'Интерфейсы', type: 'I2C мультиплексор (Microchip)', brand: 'Microchip' },
  // MAX825 — voltage supervisor (ADI/Maxim)
  { pattern: /^MAX8\d{2,3}/i, category: 'Стабилизаторы', type: 'Voltage Supervisor (Maxim/ADI)', brand: 'Analog Devices' },
  { pattern: /^MAX6\d{3,4}/i, category: 'Стабилизаторы', type: 'Voltage Supervisor (Maxim/ADI)', brand: 'Analog Devices' },
  // MC12095 — prescaler (onsemi)
  { pattern: /^MC120[0-9]{2}/i, category: 'Логика', type: 'Прескалер / делитель частоты', brand: 'onsemi' },
  // PTN78060 — TI isolated DC-DC power module
  { pattern: /^PTN[0-9]{4,5}/i, category: 'Стабилизаторы', type: 'Изолированный DC-DC модуль (TI)', brand: 'Texas Instruments' },
  { pattern: /^PTD[0-9]{4,5}/i, category: 'Стабилизаторы', type: 'Изолированный DC-DC модуль (TI)', brand: 'Texas Instruments' },
  // TPD8F003 — TI power distribution switch
  { pattern: /^TPD[89][A-Z]?[0-9]{2,4}/i, category: 'Стабилизаторы', type: 'Power Distribution Switch (TI)', brand: 'Texas Instruments' },
  // PI4IOE5V9555 — Diodes Inc I/O expander
  { pattern: /^PI4IOE/i, category: 'Интерфейсы', type: 'I/O Expander (I2C)', brand: 'Diodes Inc' },

  // ====================================================================
  // BATCH 3 — additions for remaining ~1093 "Прочие компоненты"
  // ====================================================================

  // --- TI LDOs and buck regulators ---
  { pattern: /^LMR\d{3,5}/i, category: 'Стабилизаторы', type: 'Step-down регулятор (TI)', brand: 'Texas Instruments' },
  { pattern: /^LM\d{3,5}/i, category: 'Стабилизаторы', type: 'LDO / линейный регулятор (TI)', brand: 'Texas Instruments' },
  { pattern: /^TLV\d{4,5}/i, category: 'Стабилизаторы', type: 'LDO / Step-down (TI TLV)', brand: 'Texas Instruments' },
  { pattern: /^LP\d{3,4}/i, category: 'Стабилизаторы', type: 'LDO (TI LP)', brand: 'Texas Instruments' },
  { pattern: /^THS\d{3,4}/i, category: 'Операционные усилители', type: 'High-Speed ОУ (TI THS)', brand: 'Texas Instruments' },
  { pattern: /^TS\d{3,4}/i, category: 'Операционные усилители', type: 'ОУ (TI TS)', brand: 'Texas Instruments' },
  { pattern: /^TMP\d{2,4}/i, category: 'Датчики', type: 'Датчик температуры (TI TMP)', brand: 'Texas Instruments' },
  { pattern: /^ISO\d{3,4}/i, category: 'Интерфейсы', type: 'Изолятор (TI ISO)', brand: 'Texas Instruments' },
  { pattern: /^DCP\d{4,5}/i, category: 'Питание', type: 'DC-DC изолированный модуль (TI DCP)', brand: 'Texas Instruments' },
  { pattern: /^LP8\d{3,4}/i, category: 'Стабилизаторы', type: 'PMIC (TI LP8)', brand: 'Texas Instruments' },
  // --- ADI / Maxim / Linear Tech ---
  { pattern: /^MAX\d{3,5}/i, category: 'Интерфейсы', type: 'Интерфейсная ИС (ADI/Maxim MAX)', brand: 'Analog Devices' },
  { pattern: /^ADG\d{3,4}/i, category: 'Интерфейсы', type: 'Analog Switch (ADI ADG)', brand: 'Analog Devices' },
  { pattern: /^ADP\d{3,4}/i, category: 'Стабилизаторы', type: 'LDO (ADI ADP)', brand: 'Analog Devices' },
  { pattern: /^LT\d{3,5}/i, category: 'Стабилизаторы', type: 'Регулятор / ОУ (ADI/LTC LT)', brand: 'Analog Devices' },
  { pattern: /^LTC\d{3,5}/i, category: 'Стабилизаторы', type: 'Регулятор (ADI/LTC LTC)', brand: 'Analog Devices' },
  { pattern: /^LTM\d{3,5}/i, category: 'Питание', type: 'uModule регулятор (ADI LTM)', brand: 'Analog Devices' },
  { pattern: /^OP\d{3,4}/i, category: 'Операционные усилители', type: 'ОУ (ADI OP)', brand: 'Analog Devices' },
  { pattern: /^REF\d{2,4}/i, category: 'Стабилизаторы', type: 'ИОН Voltage Reference (ADI REF)', brand: 'Analog Devices' },
  { pattern: /^ADR\d{2,4}/i, category: 'Стабилизаторы', type: 'ИОН Voltage Reference (ADI ADR)', brand: 'Analog Devices' },
  // --- Microchip MCUs and peripherals ---
  { pattern: /^AT89C/i, category: 'Микроконтроллеры', type: '8051 MCU (Microchip/Atmel AT89)', brand: 'Microchip' },
  { pattern: /^ATmega/i, category: 'Микроконтроллеры', type: 'AVR 8-bit MCU (Microchip/Atmel)', brand: 'Microchip' },
  { pattern: /^ATtiny/i, category: 'Микроконтроллеры', type: 'AVR tiny MCU (Microchip/Atmel)', brand: 'Microchip' },
  { pattern: /^TCAN\d{3,4}/i, category: 'Интерфейсы', type: 'CAN Transceiver (Microchip TCAN)', brand: 'Microchip' },
  { pattern: /^KSZ\d{3,4}/i, category: 'Интерфейсы', type: 'Ethernet PHY/Switch (Microchip KSZ)', brand: 'Microchip' },
  { pattern: /^MCP\d{3,4}/i, category: 'Микросхемы', type: 'Периферийная ИС (Microchip MCP)', brand: 'Microchip' },
  { pattern: /^TC\d{3,4}/i, category: 'Микросхемы', type: 'Периферийная ИС (Microchip TC)', brand: 'Microchip' },
  // --- STMicroelectronics ---
  { pattern: /^STM32/i, category: 'Микроконтроллеры', type: '32-bit ARM MCU (STMicroelectronics)', brand: 'STMicroelectronics' },
  { pattern: /^STM8/i, category: 'Микроконтроллеры', type: '8-bit MCU (STMicroelectronics)', brand: 'STMicroelectronics' },
  { pattern: /^VL53/i, category: 'Датчики', type: 'ToF Distance Sensor (STMicroelectronics)', brand: 'STMicroelectronics' },
  { pattern: /^LPS\d{2,4}/i, category: 'Датчики', type: 'Pressure Sensor (STMicroelectronics)', brand: 'STMicroelectronics' },
  { pattern: /^LIS\d{2,4}/i, category: 'Датчики', type: 'Accelerometer (STMicroelectronics)', brand: 'STMicroelectronics' },
  { pattern: /^LSM\d{2,4}/i, category: 'Датчики', type: 'IMU (STMicroelectronics)', brand: 'STMicroelectronics' },
  { pattern: /^L\d{3,5}[A-Z]/i, category: 'Стабилизаторы', type: 'LDO (STMicroelectronics L-series)', brand: 'STMicroelectronics' },
  { pattern: /^LD\d{3,4}/i, category: 'Стабилизаторы', type: 'LDO (STMicroelectronics LD)', brand: 'STMicroelectronics' },
  { pattern: /^M24/i, category: 'Память', type: 'EEPROM Serial (STMicroelectronics)', brand: 'STMicroelectronics' },
  { pattern: /^M25/i, category: 'Память', type: 'Serial Flash (STMicroelectronics)', brand: 'STMicroelectronics' },
  { pattern: /^M93/i, category: 'Память', type: 'EEPROM Microwire (STMicroelectronics)', brand: 'STMicroelectronics' },
  { pattern: /^SM\d{2}T/i, category: 'Диоды', type: 'TVS-диод (STMicroelectronics SMxxT)', brand: 'STMicroelectronics' },
  { pattern: /^SMAJ/i, category: 'Диоды', type: 'TVS-диод (STMicroelectronics SMAJ)', brand: 'STMicroelectronics' },
  { pattern: /^SMBJ/i, category: 'Диоды', type: 'TVS-диод (STMicroelectronics SMBJ)', brand: 'STMicroelectronics' },
  { pattern: /^SMCJ/i, category: 'Диоды', type: 'TVS-диод (STMicroelectronics SMCJ)', brand: 'STMicroelectronics' },
  { pattern: /^VNI\d{3,4}/i, category: 'Интерфейсы', type: 'Driver (STMicroelectronics VNI)', brand: 'STMicroelectronics' },
  { pattern: /^SCT\d{3,4}/i, category: 'Транзисторы', type: 'SiC MOSFET (STMicroelectronics SCT)', brand: 'STMicroelectronics' },
  { pattern: /^TS\d{3,4}[A-Z]/i, category: 'Операционные усилители', type: 'ОУ (STMicroelectronics TS)', brand: 'STMicroelectronics' },
  { pattern: /^M25P/i, category: 'Память', type: 'Serial Flash (STMicroelectronics M25P)', brand: 'STMicroelectronics' },
  { pattern: /^M950/i, category: 'Память', type: 'EEPROM Serial (STMicroelectronics M950)', brand: 'STMicroelectronics' },
  // --- onsemi ---
  { pattern: /^MM5Z/i, category: 'Диоды', type: 'Стабилитрон Zener (onsemi MM5Z)', brand: 'onsemi' },
  { pattern: /^MMSZ/i, category: 'Диоды', type: 'Стабилитрон Zener (onsemi MMSZ)', brand: 'onsemi' },
  { pattern: /^BZX84/i, category: 'Диоды', type: 'Стабилитрон Zener (onsemi BZX84)', brand: 'onsemi' },
  { pattern: /^BZX55/i, category: 'Диоды', type: 'Стабилитрон Zener (onsemi BZX55)', brand: 'onsemi' },
  { pattern: /^BZV55/i, category: 'Диоды', type: 'Стабилитрон Zener (Nexperia/onsemi BZV55)', brand: 'Nexperia' },
  { pattern: /^MBT\d{3,4}/i, category: 'Транзисторы', type: 'BJT (onsemi MBT)', brand: 'onsemi' },
  { pattern: /^MMUN\d{3,4}/i, category: 'Транзисторы', type: 'BJT (onsemi MMUN)', brand: 'onsemi' },
  { pattern: /^MMBT\d{3,4}/i, category: 'Транзисторы', type: 'BJT SMD (onsemi MMBT)', brand: 'onsemi' },
  { pattern: /^NC7WZ/i, category: 'Логика', type: 'Логический ИС (onsemi NC7WZ)', brand: 'onsemi' },
  { pattern: /^NC7S/i, category: 'Логика', type: 'Логический ИС (onsemi NC7S)', brand: 'onsemi' },
  { pattern: /^NCV\d{3,5}/i, category: 'Стабилизаторы', type: 'Automotive LDO/PMIC (onsemi NCV)', brand: 'onsemi' },
  { pattern: /^NCP\d{3,5}/i, category: 'Стабилизаторы', type: 'PMIC / LDO (onsemi NCP)', brand: 'onsemi' },
  { pattern: /^SURS/i, category: 'Диоды', type: 'Выпрямительный диод (onsemi SURS)', brand: 'onsemi' },
  { pattern: /^MURS/i, category: 'Диоды', type: 'Выпрямительный диод (onsemi MURS)', brand: 'onsemi' },
  { pattern: /^MUR\d{3,4}/i, category: 'Диоды', type: 'Ultra-fast диод (onsemi MUR)', brand: 'onsemi' },
  { pattern: /^MC9S/i, category: 'Микроконтроллеры', type: 'HC08/S08 MCU (Freescale/onsemi)', brand: 'onsemi' },
  { pattern: /^MC\d{5,6}/i, category: 'Микросхемы', type: 'ИС (onsemi MC)', brand: 'onsemi' },
  { pattern: /^MCWF/i, category: 'Резисторы', type: 'Чип-резистор (onsemi MCWF)', brand: 'onsemi' },
  { pattern: /^MCSJK/i, category: 'Кварцы и резонаторы', type: 'Кварцевый резонатор (onsemi MCSJK)', brand: 'onsemi' },
  // --- Nexperia ---
  { pattern: /^PMEG\d{3,4}/i, category: 'Диоды', type: 'Schottky диод (Nexperia PMEG)', brand: 'Nexperia' },
  { pattern: /^PMV\d{3,4}/i, category: 'Транзисторы', type: 'MOSFET (Nexperia PMV)', brand: 'Nexperia' },
  { pattern: /^BUK\d{2,4}/i, category: 'Транзисторы', type: 'MOSFET (Nexperia BUK)', brand: 'Nexperia' },
  { pattern: /^BSH\d{3,4}/i, category: 'Транзисторы', type: 'MOSFET (Nexperia BSH)', brand: 'Nexperia' },
  { pattern: /^BSD\d{3,4}/i, category: 'Транзисторы', type: 'MOSFET (Nexperia BSD)', brand: 'Nexperia' },
  { pattern: /^BSS\d{3,4}/i, category: 'Транзисторы', type: 'MOSFET (Nexperia BSS)', brand: 'Nexperia' },
  // --- NXP ---
  { pattern: /^LPC\d{3,5}/i, category: 'Микроконтроллеры', type: 'ARM MCU (NXP LPC)', brand: 'NXP' },
  { pattern: /^PCA\d{3,5}/i, category: 'Интерфейсы', type: 'I2C периферия (NXP PCA)', brand: 'NXP' },
  { pattern: /^PCF\d{3,5}/i, category: 'Интерфейсы', type: 'Периферийная ИС (NXP PCF)', brand: 'NXP' },
  { pattern: /^TEA\d{3,5}/i, category: 'Стабилизаторы', type: 'SMPS Controller (NXP TEA)', brand: 'NXP' },
  { pattern: /^TDA\d{3,5}/i, category: 'Микросхемы', type: 'Аналоговая ИС (NXP TDA)', brand: 'NXP' },
  { pattern: /^TEA1520/i, category: 'Стабилизаторы', type: 'SMPS Controller (NXP TEA1520)', brand: 'NXP' },
  { pattern: /^MK-?\d/i, category: 'Реле', type: 'Реле (NXP MK)', brand: 'NXP' },
  // --- Renesas / IDT ---
  { pattern: /^R7F[A-Z]/i, category: 'Микроконтроллеры', type: 'RA ARM MCU (Renesas R7F)', brand: 'Renesas' },
  { pattern: /^R5F[A-Z]/i, category: 'Микроконтроллеры', type: 'RL78/RX MCU (Renesas R5F)', brand: 'Renesas' },
  { pattern: /^RBN\d{2,4}/i, category: 'Транзисторы', type: 'IGBT (Renesas RBN)', brand: 'Renesas' },
  { pattern: /^70T\d{3,5}/i, category: 'Память', type: 'Dual-Port RAM (Renesas/IDT 70T)', brand: 'Renesas' },
  { pattern: /^70V\d{3,5}/i, category: 'Память', type: 'FIFO/SRAM (Renesas/IDT 70V)', brand: 'Renesas' },
  { pattern: /^ISL\d{4,5}/i, category: 'Стабилизаторы', type: 'Регулятор (Renesas/Intersil ISL)', brand: 'Renesas' },
  // --- Silicon Labs ---
  { pattern: /^EFM8/i, category: 'Микроконтроллеры', type: '8-bit MCU (Silicon Labs EFM8)', brand: 'Silicon Labs' },
  { pattern: /^EFM32/i, category: 'Микроконтроллеры', type: '32-bit ARM MCU (Silicon Labs EFM32)', brand: 'Silicon Labs' },
  { pattern: /^SiT\d{3,5}/i, category: 'Кварцы и резонаторы', type: 'Программируемый генератор (SiTime SiT)', brand: 'Silicon Labs' },
  { pattern: /^SI\d{3,5}/i, category: 'Транзисторы', type: 'MOSFET (Silicon Labs SI)', brand: 'Silicon Labs' },
  // --- TI level shifters ---
  { pattern: /^TXS\d{3,5}/i, category: 'Интерфейсы', type: 'Level Shifter (TI TXS)', brand: 'Texas Instruments' },
  { pattern: /^TXB\d{3,5}/i, category: 'Интерфейсы', type: 'Level Shifter (TI TXB)', brand: 'Texas Instruments' },
  { pattern: /^TS5A\d{3,5}/i, category: 'Интерфейсы', type: 'Analog Switch (TI TS5A)', brand: 'Texas Instruments' },
  { pattern: /^TS5U\d{3,5}/i, category: 'Интерфейсы', type: 'Analog Switch (TI TS5U)', brand: 'Texas Instruments' },
  // --- Diodes Inc ---
  { pattern: /^DMN/i, category: 'Транзисторы', type: 'MOSFET (Diodes Inc DMN)', brand: 'Diodes Inc' },
  { pattern: /^DMP/i, category: 'Транзисторы', type: 'MOSFET P-ch (Diodes Inc DMP)', brand: 'Diodes Inc' },
  { pattern: /^AP[ij]?\d{3,5}/i, category: 'Стабилизаторы', type: 'LDO/PMIC (Diodes Inc AP)', brand: 'Diodes Inc' },
  // --- Optocouplers ---
  { pattern: /^PS2[7-9]\d{2}/i, category: 'Оптоэлектроника', type: 'Оптопара (Sharp/CEL PS)', brand: 'Sharp' },
  { pattern: /^PS\d{3,4}/i, category: 'Оптоэлектроника', type: 'Оптопара (NEC/CEL PS)', brand: 'NEC' },
  { pattern: /^EL8\d{2,3}/i, category: 'Оптоэлектроника', type: 'Оптопара (Everlight EL8xx)', brand: 'Everlight' },
  { pattern: /^PC3\d{2}/i, category: 'Оптоэлектроника', type: 'Оптопара (Sharp PC3xx)', brand: 'Sharp' },
  { pattern: /^PC4\d{2}/i, category: 'Оптоэлектроника', type: 'Оптопара (Sharp PC4xx)', brand: 'Sharp' },
  { pattern: /^PC8\d{2}/i, category: 'Оптоэлектроника', type: 'Оптопара (Sharp PC8xx)', brand: 'Sharp' },
  { pattern: /^PC9\d{2}/i, category: 'Оптоэлектроника', type: 'Оптопара (Sharp PC9xx)', brand: 'Sharp' },
  // --- Yageo / SEMTECH ESD ---
  { pattern: /^ACM\d{3,5}/i, category: 'Индуктивности', type: 'Common Mode Choke (Yageo ACM)', brand: 'Yageo' },
  { pattern: /^ACPL/i, category: 'Оптоэлектроника', type: 'Оптопара (Avago/Broadcom ACPL)', brand: 'Broadcom' },
  { pattern: /^RCLAMP/i, category: 'Диоды', type: 'TVS-диод ESD (Semtech RCLAMP)', brand: 'Semtech' },
  { pattern: /^RCL\d{4,5}/i, category: 'Микросхемы', type: 'ИС (Semtech RCL)', brand: 'Semtech' },
  // --- Würth ---
  { pattern: /^6\d{10}/i, category: 'Разъёмы', type: 'Разъём (Würth Elektronik)', brand: 'Würth Elektronik' },
  { pattern: /^88\d{9}/i, category: 'Конденсаторы', type: 'Конденсатор (Würth Elektronik)', brand: 'Würth Elektronik' },
  { pattern: /^82\d{9}/i, category: 'Конденсаторы', type: 'Конденсатор (Würth Elektronik)', brand: 'Würth Elektronik' },
  { pattern: /^7\d{10}/i, category: 'Индуктивности', type: 'Катушка индуктивности (Würth)', brand: 'Würth Elektronik' },
  // --- TDK / Cypress / Murata misc ---
  { pattern: /^NLV\d{2,3}T-/i, category: 'Индуктивности', type: 'Катушка индуктивности (TDK/Murata NLV)', brand: 'TDK' },
  { pattern: /^CY\d{1,2}C/i, category: 'Микросхемы', type: 'PSoC MCU (Cypress CY8C)', brand: 'Cypress' },
  { pattern: /^CY14/i, category: 'Память', type: 'nvSRAM (Cypress CY14)', brand: 'Cypress' },
  { pattern: /^CTM\d{3,5}/i, category: 'Интерфейсы', type: 'CAN Transceiver (TDK CTM)', brand: 'TDK' },
  { pattern: /^CT4-/i, category: 'Конденсаторы', type: 'Керамический чип-конденсатор (TDK CT4)', brand: 'TDK' },
  { pattern: /^CMH\d{2}-/i, category: 'Оптоэлектроника', type: 'SMD LED (Cree CMH)', brand: 'Cree' },
  { pattern: /^CLT/i, category: 'Конденсаторы', type: 'Конденсатор (TDK CLT)', brand: 'TDK' },
  { pattern: /^[CS][KК]\d{3,5}/i, category: 'Конденсаторы', type: 'Конденсатор (TDK)', brand: 'TDK' },
  // --- TE Connectivity ---
  { pattern: /^[1-9]-\d{5,8}-\d/i, category: 'Разъёмы', type: 'Разъём (TE Connectivity)', brand: 'TE Connectivity' },
  { pattern: /^\d{6}-\d/i, category: 'Разъёмы', type: 'Разъём (TE Connectivity)', brand: 'TE Connectivity' },
  { pattern: /^RTH\d{4,5}/i, category: 'Резисторы', type: 'Термистор (TE Connectivity RTH)', brand: 'TE Connectivity' },
  // --- Brightking ---
  { pattern: /^R5\d{2,3}/i, category: 'Диоды', type: 'TVS-диод (Brightking)', brand: 'Brightking' },
  { pattern: /^SM\d{2,3}S/i, category: 'Диоды', type: 'TVS-диод (Brightking SM)', brand: 'Brightking' },
  // --- TI DRV8 motor drivers ---
  { pattern: /^DRV8\d{3,4}/i, category: 'Интерфейсы', type: 'Мотор-драйвер (TI DRV8)', brand: 'Texas Instruments' },
  { pattern: /^DRV\d{3,4}[A-Z]/i, category: 'Интерфейсы', type: 'Драйвер (TI DRV)', brand: 'Texas Instruments' },
  // --- TS4148 / 1N4148 ---
  { pattern: /^TS4148/i, category: 'Диоды', type: 'Переключающий диод (Taiwan Semi TS4148)', brand: 'Taiwan Semiconductor' },
  { pattern: /^1N4148/i, category: 'Диоды', type: 'Переключающий диод (1N4148)', brand: 'Generic' },
  // --- 2Nxxxx series ---
  { pattern: /^2N\d{3,5}/i, category: 'Транзисторы', type: 'Биполярный транзистор (BJT 2N)', brand: 'Generic' },
  { pattern: /^MMBT390[4-6]/i, category: 'Транзисторы', type: 'BJT SMD (MMBT390x)', brand: 'Generic' },
  { pattern: /^BC\d{3}-/i, category: 'Транзисторы', type: 'BJT (BC-series)', brand: 'Generic' },
  { pattern: /^BC8\d{2}/i, category: 'Транзисторы', type: 'BJT SMD (BC8xx)', brand: 'Nexperia' },
  // --- MSC / Microchip ---
  { pattern: /^MSCJK/i, category: 'Кварцы и резонаторы', type: 'Кварцевый резонатор', brand: 'Microchip' },
  // --- AOS / Alpha & Omega ---
  { pattern: /^AON\d{2,3}/i, category: 'Транзисторы', type: 'MOSFET N-ch (AOS AON)', brand: 'Alpha & Omega Semiconductor' },
  { pattern: /^AOP\d{2,3}/i, category: 'Транзисторы', type: 'MOSFET P-ch (AOS AOP)', brand: 'Alpha & Omega Semiconductor' },
  { pattern: /^AOT\d{2,3}/i, category: 'Транзисторы', type: 'MOSFET N-ch (AOS AOT)', brand: 'Alpha & Omega Semiconductor' },
  // --- Panasonic ---
  { pattern: /^ECA/i, category: 'Конденсаторы', type: 'Электролитический конденсатор (Panasonic)', brand: 'Panasonic' },
  { pattern: /^EEU/i, category: 'Конденсаторы', type: 'Электролитический конденсатор (Panasonic)', brand: 'Panasonic' },
  // --- Murata ---
  { pattern: /^BLM\d/i, category: 'Индуктивности', type: 'Ferrite Bead (Murata BLM)', brand: 'Murata' },
  { pattern: /^LQM\d/i, category: 'Индуктивности', type: 'Катушка индуктивности (Murata LQM)', brand: 'Murata' },
  // --- IR / International Rectifier ---
  { pattern: /^IRF\d{3,4}/i, category: 'Транзисторы', type: 'MOSFET N-ch (IR IRF)', brand: 'Infineon' },
  { pattern: /^IRL\d{3,4}/i, category: 'Транзисторы', type: 'Logic-Level MOSFET (IR IRL)', brand: 'Infineon' },
  { pattern: /^IRFR\d{3,4}/i, category: 'Транзисторы', type: 'MOSFET SMD (IR IRFR)', brand: 'Infineon' },


  // ====================================================================
  // BATCH 4 — 2nd round: ~150 rules for remaining 528 prochie SKU
  // ====================================================================

  // --- TI: Communication interfaces, signal conditioners, ESD, audio ---
  { pattern: /^AMC\d{3,4}/i, category: 'Интерфейсы', type: 'Isolation Amplifier (TI AMC)', brand: 'Texas Instruments' },
  { pattern: /^AWR\d{3,4}/i, category: 'Интерфейсы', type: 'Radar MMIC (TI AWR)', brand: 'Texas Instruments' },
  { pattern: /^DS25BR/i, category: 'Интерфейсы', type: 'Signal Conditioner (TI DS25BR)', brand: 'Texas Instruments' },
  { pattern: /^DS80PCI/i, category: 'Интерфейсы', type: 'PCIe Signal Conditioner (TI DS80PCI)', brand: 'Texas Instruments' },
  { pattern: /^DS92LV/i, category: 'Интерфейсы', type: 'LVDS Signal Conditioner (TI DS92LV)', brand: 'Texas Instruments' },
  { pattern: /^ESD\d{3,4}/i, category: 'Диоды', type: 'TVS-диод ESD (TI ESD)', brand: 'Texas Instruments' },
  { pattern: /^ESDS\d{3,4}/i, category: 'Диоды', type: 'TVS-диод ESD (TI ESDS)', brand: 'Texas Instruments' },
  { pattern: /^FPC\d{2,3}/i, category: 'Интерфейсы', type: 'Контроллер (TI FPC)', brand: 'Texas Instruments' },
  { pattern: /^ISO\d{2,3}[A-Z]/i, category: 'Интерфейсы', type: 'Изолятор (TI ISO)', brand: 'Texas Instruments' },
  { pattern: /^ISOW\d{3,4}/i, category: 'Интерфейсы', type: 'Изолированный DC-DC (TI ISOW)', brand: 'Texas Instruments' },
  { pattern: /^LF398/i, category: 'Операционные усилители', type: 'Sample-and-Hold ОУ (TI LF398)', brand: 'Texas Instruments' },
  { pattern: /^LSF\d{3,4}/i, category: 'Интерфейсы', type: 'Level Shifter (TI LSF)', brand: 'Texas Instruments' },
  { pattern: /^LV\d{3,5}/i, category: 'Стабилизаторы', type: 'Step-down регулятор (TI LV)', brand: 'Texas Instruments' },
  { pattern: /^MF\d{2,3}/i, category: 'Микросхемы', type: 'Фильтр (TI MF)', brand: 'Texas Instruments' },
  { pattern: /^PCM\d{3,5}/i, category: 'АЦП/ЦАП', type: 'Audio Codec/DAC (TI PCM)', brand: 'Texas Instruments' },
  { pattern: /^PGA\d{3,4}/i, category: 'Операционные усилители', type: 'Programmable Gain Amp (TI PGA)', brand: 'Texas Instruments' },
  { pattern: /^PTH\d{2,4}/i, category: 'Питание', type: 'Power Module (TI PTH)', brand: 'Texas Instruments' },
  { pattern: /^UCC\d{3,5}/i, category: 'Стабилизаторы', type: 'PWM Controller (TI UCC)', brand: 'Texas Instruments' },
  { pattern: /^PUCC\d{2,5}/i, category: 'Стабилизаторы', type: 'PWM Controller (TI UCC)', brand: 'Texas Instruments' },
  { pattern: /^DP83\d{3,4}/i, category: 'Интерфейсы', type: 'Ethernet PHY (TI DP83xxx)', brand: 'Texas Instruments' },
  { pattern: /^DP83640/i, category: 'Интерфейсы', type: 'Ethernet PHY IEEE1588 (TI DP83640)', brand: 'Texas Instruments' },
  { pattern: /^LMC555/i, category: 'Микросхемы', type: 'CMOS Timer (TI LMC555)', brand: 'Texas Instruments' },
  { pattern: /^TLC555/i, category: 'Микросхемы', type: 'CMOS Timer (TI TLC555)', brand: 'Texas Instruments' },
  { pattern: /^LMP\d{3,4}/i, category: 'Операционные усилители', type: 'Precision ОУ (TI LMP)', brand: 'Texas Instruments' },
  // --- ADI: Ethernet PHY, LVDS isolators, video, temp ---
  { pattern: /^ADIN\d{3,4}/i, category: 'Интерфейсы', type: 'Ethernet PHY (ADI ADIN)', brand: 'Analog Devices' },
  { pattern: /^ADN\d{3,4}/i, category: 'Интерфейсы', type: 'Isolator (ADI ADN)', brand: 'Analog Devices' },
  { pattern: /^ADT\d{3,4}/i, category: 'Датчики', type: 'Датчик температуры (ADI ADT)', brand: 'Analog Devices' },
  { pattern: /^ADV\d{3,4}/i, category: 'Интерфейсы', type: 'Video Codec/Receiver (ADI ADV)', brand: 'Analog Devices' },
  { pattern: /^LTC\d{3,5}/i, category: 'Стабилизаторы', type: 'Регулятор (ADI LTC)', brand: 'Analog Devices' },
  { pattern: /^AD[78]\d{3,4}/i, category: 'АЦП/ЦАП', type: 'АЦП/ЦАП (ADI AD7xxx/AD8xxx)', brand: 'Analog Devices' },
  // Lite-On (often misbranded as ADI)
  { pattern: /^LTST-/i, category: 'Оптоэлектроника', type: 'SMD LED (Lite-On LTST)', brand: 'Lite-On' },
  { pattern: /^LTV-\d{2,3}/i, category: 'Оптоэлектроника', type: 'Оптопара (Lite-On LTV)', brand: 'Lite-On' },
  // --- Micron ---
  { pattern: /^MT46/i, category: 'Память', type: 'Mobile DRAM (Micron MT46)', brand: 'Micron' },
  { pattern: /^MT48/i, category: 'Память', type: 'SDR SDRAM (Micron MT48)', brand: 'Micron' },
  { pattern: /^MT9/i, category: 'Оптоэлектроника', type: 'CMOS Image Sensor (Micron MT9)', brand: 'Micron' },
  { pattern: /^MT41K/i, category: 'Память', type: 'DDR3L SDRAM (Micron MT41K)', brand: 'Micron' },
  { pattern: /^MT29F/i, category: 'Память', type: 'NAND Flash (Micron MT29F)', brand: 'Micron' },
  // --- Renesas ---
  { pattern: /^HD64/i, category: 'Микроконтроллеры', type: 'H8/300 MCU (Renesas HD64)', brand: 'Renesas' },
  // --- NXP: PCF85xx, PCA9xxx ---
  { pattern: /^PCF8\d{2,3}/i, category: 'Интерфейсы', type: 'I2C периферия (NXP PCF8xxx)', brand: 'NXP' },
  { pattern: /^PCF85\d{2,3}/i, category: 'Интерфейсы', type: 'I2C Expander (NXP PCF85xx)', brand: 'NXP' },
  { pattern: /^PCA9\d{2,3}/i, category: 'Интерфейсы', type: 'I2C Expander (NXP PCA9xxx)', brand: 'NXP' },
  // --- STMicro: VN5E/VND5/VNH/STH/STTH/STU/TYN/ISM/LPR/M28C/M95/N2 ---
  { pattern: /^VN[5D]\w/i, category: 'Интерфейсы', type: 'Автомобильный ключ/драйвер (STMicro VN)', brand: 'STMicroelectronics' },
  { pattern: /^VNH\d{3,4}/i, category: 'Интерфейсы', type: 'Мотор-драйвер H-Bridge (STMicro VNH)', brand: 'STMicroelectronics' },
  { pattern: /^STH\d{2,3}/i, category: 'Транзисторы', type: 'MOSFET (STMicro STH)', brand: 'STMicroelectronics' },
  { pattern: /^STTH\d{2,4}/i, category: 'Диоды', type: 'Ultra-fast диод (STMicro STTH)', brand: 'STMicroelectronics' },
  { pattern: /^STU\d{1,3}/i, category: 'Транзисторы', type: 'MOSFET (STMicro STU)', brand: 'STMicroelectronics' },
  { pattern: /^TYN\d{3,4}/i, category: 'Электроавтоматика', type: 'Thyristor (STMicro TYN)', brand: 'STMicroelectronics' },
  { pattern: /^ISM\d{3,4}/i, category: 'Датчики', type: 'IMU Sensor (STMicro ISM)', brand: 'STMicroelectronics' },
  { pattern: /^LPR\d{3,4}/i, category: 'Датчики', type: 'Geomagnetic Sensor (STMicro LPR)', brand: 'STMicroelectronics' },
  { pattern: /^M28C\d{2,4}/i, category: 'Память', type: 'EEPROM Parallel (STMicro M28C)', brand: 'STMicroelectronics' },
  { pattern: /^M95\d{2,4}/i, category: 'Память', type: 'EEPROM SPI (STMicro M95)', brand: 'STMicroelectronics' },
  { pattern: /^N2DM/i, category: 'Датчики', type: 'MEMS Sensor (STMicro N2)', brand: 'STMicroelectronics' },
  // --- onsemi: MJ, MM3Z, MBRS, NL17SZ, NSR, NTHD, NUD, LB ---
  { pattern: /^MJ\d{4,5}/i, category: 'Транзисторы', type: 'BJT Power Darlington (onsemi MJ)', brand: 'onsemi' },
  { pattern: /^MM3Z/i, category: 'Диоды', type: 'Стабилитрон Zener (onsemi MM3Z)', brand: 'onsemi' },
  { pattern: /^MBRS\d{2,4}/i, category: 'Диоды', type: 'Schottky Rectifier (onsemi MBRS)', brand: 'onsemi' },
  { pattern: /^MBR\d{2,4}/i, category: 'Диоды', type: 'Schottky Rectifier (onsemi MBR)', brand: 'onsemi' },
  { pattern: /^NL17SZ/i, category: 'Логика', type: 'Логический ИС (onsemi NL17SZ)', brand: 'onsemi' },
  { pattern: /^NL17SV/i, category: 'Логика', type: 'Логический ИС (onsemi NL17SV)', brand: 'onsemi' },
  { pattern: /^NSR\d{2,3}/i, category: 'Диоды', type: 'Schottky диод (onsemi NSR)', brand: 'onsemi' },
  { pattern: /^NTHD\d{3,4}/i, category: 'Транзисторы', type: 'MOSFET (onsemi NTHD)', brand: 'onsemi' },
  { pattern: /^NTGD\d{3,4}/i, category: 'Транзисторы', type: 'MOSFET (onsemi NTGD)', brand: 'onsemi' },
  { pattern: /^NUD\d{3,5}/i, category: 'Интерфейсы', type: 'Relay Driver (onsemi NUD)', brand: 'onsemi' },
  { pattern: /^LB19\d{2,4}/i, category: 'Интерфейсы', type: 'Мотор-драйвер (onsemi LB19)', brand: 'onsemi' },
  // --- Siemens SINAMICS drives ---
  { pattern: /^6SL3\d{3,4}-/i, category: 'Электроавтоматика', type: 'SINAMICS Frequency Converter (Siemens)', brand: 'Siemens' },
  { pattern: /^6SL3255/i, category: 'Электроавтоматика', type: 'SINAMICS Control Module (Siemens)', brand: 'Siemens' },
  // --- Microchip ATSAM, LAN87xx, LAN92xx, MIC29xxx, TC7S, EQCO ---
  { pattern: /^ATSAM\d/i, category: 'Микроконтроллеры', type: 'ARM Cortex-M MCU (Microchip ATSAM)', brand: 'Microchip' },
  { pattern: /^LAN87\d{2,3}/i, category: 'Интерфейсы', type: 'Ethernet PHY (Microchip LAN87xx)', brand: 'Microchip' },
  { pattern: /^LAN92\d{2,3}/i, category: 'Интерфейсы', type: 'EtherCAT Slave (Microchip LAN92xx)', brand: 'Microchip' },
  { pattern: /^MIC29\d{2,3}/i, category: 'Стабилизаторы', type: 'LDO (Microchip MIC29xxx)', brand: 'Microchip' },
  { pattern: /^MIC29302/i, category: 'Стабилизаторы', type: 'LDO 3A (Microchip MIC29302)', brand: 'Microchip' },
  { pattern: /^TC7S\d{2,3}/i, category: 'Логика', type: 'Логический ИС (Microchip TC7S)', brand: 'Microchip' },
  { pattern: /^EQCO6\d/i, category: 'Интерфейсы', type: 'CoaXPress Transceiver (Microchip EQCO)', brand: 'Microchip' },
  // --- MORNSUN DC-DC converters ---
  { pattern: /^LH\d{2}-/i, category: 'Питание', type: 'DC-DC Конвертер (MORNSUN LH)', brand: 'MORNSUN' },
  { pattern: /^PV\d{2}-/i, category: 'Питание', type: 'PV Inverter (MORNSUN PV)', brand: 'MORNSUN' },
  { pattern: /^UR[AB]\d{4}/i, category: 'Питание', type: 'DC-DC Изолированный (MORNSUN UR)', brand: 'MORNSUN' },
  { pattern: /^UWF\d{4}/i, category: 'Питание', type: 'DC-DC Изолированный (MORNSUN UWF)', brand: 'MORNSUN' },
  { pattern: /^VR[AB]\d{4}/i, category: 'Питание', type: 'DC-DC Изолированный (MORNSUN VR)', brand: 'MORNSUN' },
  { pattern: /^WRB\d{4}/i, category: 'Питание', type: 'DC-DC Изолированный (MORNSUN WRB)', brand: 'MORNSUN' },
  // --- Panasonic: BR coin cell, ERA/ERJ chip resistors ---
  { pattern: /^BR\d{4}A/i, category: 'Питание', type: 'Coin Cell Battery (Panasonic BR)', brand: 'Panasonic' },
  { pattern: /^CR\d{4}/i, category: 'Питание', type: 'Coin Cell Battery (CR-series)', brand: 'Panasonic' },
  { pattern: /^ERA-?3/i, category: 'Резисторы', type: 'Чип-резистор (Panasonic ERA)', brand: 'Panasonic' },
  { pattern: /^ERA-?8/i, category: 'Резисторы', type: 'Чип-резистор (Panasonic ERA)', brand: 'Panasonic' },
  { pattern: /^ERJ\d/i, category: 'Резисторы', type: 'Чип-резистор (Panasonic ERJ)', brand: 'Panasonic' },
  { pattern: /^ERJ3/i, category: 'Резисторы', type: 'Чип-резистор 0603 (Panasonic ERJ3)', brand: 'Panasonic' },
  // --- Infineon: BGT, BTS, HYB, IPA, IPP ---
  { pattern: /^BGT\d{2,3}/i, category: 'Интерфейсы', type: 'Radar MMIC (Infineon BGT)', brand: 'Infineon' },
  { pattern: /^BTS\d{3,4}/i, category: 'Интерфейсы', type: 'High-Side Switch (Infineon BTS)', brand: 'Infineon' },
  { pattern: /^HYB\d{2}/i, category: 'Память', type: 'Mobile SDRAM (Infineon HYB)', brand: 'Infineon' },
  { pattern: /^IPA\d{2,3}[A-Z]/i, category: 'Транзисторы', type: 'CoolMOS (Infineon IPA)', brand: 'Infineon' },
  { pattern: /^IPP\d{2,3}[A-Z]/i, category: 'Транзисторы', type: 'OptiMOS (Infineon IPP)', brand: 'Infineon' },
  { pattern: /^IP[A-Z]\d{2,3}/i, category: 'Транзисторы', type: 'MOSFET (Infineon IP)', brand: 'Infineon' },
  // --- TAITIEN crystal oscillators ---
  { pattern: /^[EO]CET/i, category: 'Кварцы и резонаторы', type: 'Кварцевый генератор (TAITIEN)', brand: 'TAITIEN' },
  { pattern: /^[EO]VET/i, category: 'Кварцы и резонаторы', type: 'Кварцевый генератор (TAITIEN)', brand: 'TAITIEN' },
  { pattern: /^XIH[CE]/i, category: 'Кварцы и резонаторы', type: 'Кварцевый генератор (TAITIEN)', brand: 'TAITIEN' },
  // --- Vishay: BYM, BZG, VLMB, Y-resistors ---
  { pattern: /^BYM\d{2}/i, category: 'Диоды', type: 'Выпрямительный диод (Vishay BYM)', brand: 'Vishay' },
  { pattern: /^BZG\d{2}/i, category: 'Диоды', type: 'TVS-диод (Vishay BZG)', brand: 'Vishay' },
  { pattern: /^VLMB\d{3,4}/i, category: 'Оптоэлектроника', type: 'SMD LED (Vishay VLMB)', brand: 'Vishay' },
  { pattern: /^Y\d{7}R\d{3}T/i, category: 'Резисторы', type: 'Прецизионный резистор (Vishay Y)', brand: 'Vishay' },
  // --- Broadcom: HSMP, HCPL, HCNR ---
  { pattern: /^HSMP-/i, category: 'Диоды', type: 'RF Schottky Detector (Broadcom HSMP)', brand: 'Broadcom' },
  { pattern: /^HCPL-/i, category: 'Оптоэлектроника', type: 'Оптопара (Broadcom HCPL)', brand: 'Broadcom' },
  { pattern: /^HCNR/i, category: 'Оптоэлектроника', type: 'Linear Optocoupler (Broadcom HCNR)', brand: 'Broadcom' },
  // --- Delta Electronics: DOP, DVP ---
  { pattern: /^DOP-\d{3,4}/i, category: 'Модули и платы', type: 'HMI Панель (Delta DOP)', brand: 'Delta Electronics' },
  { pattern: /^DVP\d{2}/i, category: 'Модули и платы', type: 'PLC Module (Delta DVP)', brand: 'Delta Electronics' },
  // --- YAGEO: MFR through-hole resistors ---
  { pattern: /^MFR-?\d{2}/i, category: 'Резисторы', type: 'Металлоплёночный резистор (Yageo MFR)', brand: 'Yageo' },
  { pattern: /^MFR\dWS/i, category: 'Резисторы', type: 'Металлоплёночный резистор 1W (Yageo MFR1WS)', brand: 'Yageo' },
  { pattern: /^MFR\dWSF/i, category: 'Резисторы', type: 'Металлоплёночный резистор (Yageo MFR3WSF)', brand: 'Yageo' },
  // --- Intel/Altera: Enpirion PMIC (EP5), MAX CPLD (EPM) ---
  { pattern: /^EP5\d{3,4}/i, category: 'Стабилизаторы', type: 'PowerSoC PMIC (Intel/Altera Enpirion EP5)', brand: 'Intel/Altera' },
  { pattern: /^EPM\d{3,4}/i, category: 'ПЛИС (FPGA)', type: 'CPLD MAX (Intel/Altera EPM)', brand: 'Intel/Altera' },
  { pattern: /^EP[A-Z]\dC/i, category: 'ПЛИС (FPGA)', type: 'CPLD (Intel/Altera)', brand: 'Intel/Altera' },
  // --- LRC: L2N7002, LBC847, LR431 ---
  { pattern: /^L2N\d{3,4}/i, category: 'Транзисторы', type: 'MOSFET (LRC L2N)', brand: 'LRC' },
  { pattern: /^LBC\d{3,4}/i, category: 'Транзисторы', type: 'BJT SMD (LRC LBC)', brand: 'LRC' },
  { pattern: /^LR\d{3,4}/i, category: 'Стабилизаторы', type: 'Регулируемый шунт-регулятор (LRC LR)', brand: 'LRC' },
  // --- MDD: DSK, SF, US2M ---
  { pattern: /^DSK\d{2,3}/i, category: 'Диоды', type: 'Schottky Bridge (MDD DSK)', brand: 'MDD' },
  { pattern: /^SF\d{2,3}/i, category: 'Диоды', type: 'Ultra-fast Rectifier (MDD SF)', brand: 'MDD' },
  { pattern: /^US2M/i, category: 'Диоды', type: 'Ultra-fast Rectifier (MDD US2M)', brand: 'MDD' },
  // --- Sharp: PT33x, QSD, QSE, TEPT, WH ---
  { pattern: /^PT33[34]/i, category: 'Оптоэлектроника', type: 'Phototransistor (Sharp PT33x)', brand: 'Sharp' },
  { pattern: /^QSD\d{2,3}/i, category: 'Оптоэлектроника', type: 'Photologic Sensor (Sharp QSD)', brand: 'Sharp' },
  { pattern: /^QSE\d{2,3}/i, category: 'Оптоэлектроника', type: 'Photologic Sensor (Sharp QSE)', brand: 'Sharp' },
  { pattern: /^TEPT\d{3,4}/i, category: 'Оптоэлектроника', type: 'Phototransistor (Sharp TEPT)', brand: 'Sharp' },
  { pattern: /^WH\d{4}A/i, category: 'Оптоэлектроника', type: 'LCD Character Display (Sharp WH)', brand: 'Sharp' },
  // --- Rohm: BD239, BDW47C, BSS84, TIP1xx, TIP3x, TIP4x ---
  { pattern: /^BD239/i, category: 'Транзисторы', type: 'BJT NPN Power (Rohm BD239)', brand: 'Rohm' },
  { pattern: /^BDW\d{2}/i, category: 'Транзисторы', type: 'BJT Darlington (Rohm BDW)', brand: 'Rohm' },
  { pattern: /^BSS\d{2,3}/i, category: 'Транзисторы', type: 'MOSFET P-ch (Rohm BSS)', brand: 'Rohm' },
  { pattern: /^TIP1\d{2}/i, category: 'Транзисторы', type: 'BJT Darlington (TIP1xx)', brand: 'Rohm' },
  { pattern: /^TIP3\d[A-Z]?/i, category: 'Транзисторы', type: 'BJT Power NPN (TIP3x)', brand: 'Rohm' },
  { pattern: /^TIP4\d[A-Z]?/i, category: 'Транзисторы', type: 'BJT Power NPN (TIP4x)', brand: 'Rohm' },
  // --- Toshiba: FGA, IGT, IPPZ ---
  { pattern: /^FGA\d{2,3}/i, category: 'Транзисторы', type: 'IGBT (Toshiba FGA)', brand: 'Toshiba' },
  { pattern: /^IGT\d{2,3}/i, category: 'Транзисторы', type: 'IGBT (Toshiba IGT)', brand: 'Toshiba' },
  { pattern: /^IPPZ\d{2,3}/i, category: 'Транзисторы', type: 'MOSFET (Toshiba IPPZ)', brand: 'Toshiba' },
  // --- TDK: ICM, FA24, MPZ, CK45, CBG, CM, C46V, CUD ---
  { pattern: /^ICM-\d{4,5}/i, category: 'Датчики', type: 'IMU Sensor (TDK InvenSense ICM)', brand: 'TDK' },
  { pattern: /^FA24X/i, category: 'Конденсаторы', type: 'Керамический чип-конденсатор (TDK FA24)', brand: 'TDK' },
  { pattern: /^MPZ\d{3,4}/i, category: 'Индуктивности', type: 'Ferrite Bead (TDK MPZ)', brand: 'TDK' },
  { pattern: /^CK45-/i, category: 'Конденсаторы', type: 'Керамический конденсатор (TDK CK45)', brand: 'TDK' },
  { pattern: /^CBG\d{5,6}/i, category: 'Индуктивности', type: 'Катушка индуктивности (TDK CBG)', brand: 'TDK' },
  { pattern: /^CM13\d{2}/i, category: 'Кварцы и резонаторы', type: 'Кварцевый резонатор (TDK CM)', brand: 'TDK' },
  { pattern: /^C46V/i, category: 'Конденсаторы', type: 'Керамический чип-конденсатор (TDK C46V)', brand: 'TDK' },
  { pattern: /^CUD/i, category: 'Конденсаторы', type: 'Конденсатор (TDK CUD)', brand: 'TDK' },
  { pattern: /^CH376/i, category: 'Интерфейсы', type: 'USB Host Controller (WCH CH376)', brand: 'WCH' },
  { pattern: /^CY23\d{2}/i, category: 'Кварцы и резонаторы', type: 'Clock Generator (Cypress CY23)', brand: 'Cypress' },
  { pattern: /^CA31\d{2}/i, category: 'Операционные усилители', type: 'CMOS ОУ (CA3xxx)', brand: 'Renesas' },
  { pattern: /^CR24\d{2}/i, category: 'Питание', type: 'Coin Cell Battery (CR-series)', brand: 'Generic' },
  // --- Samtec connectors ---
  { pattern: /^[TS]MM-?\d{2,3}-/i, category: 'Разъёмы', type: 'Разъём (Samtec TMM/SMM)', brand: 'Samtec' },
  { pattern: /^EJH-\d{2,3}/i, category: 'Разъёмы', type: 'Разъём (Samtec EJH)', brand: 'Samtec' },
  { pattern: /^SEAM-\d{2}/i, category: 'Разъёмы', type: 'Разъём (Samtec SEAM)', brand: 'Samtec' },
  // --- Bourns: SRN, SRP, TBU, P40 ---
  { pattern: /^SRN\d{3,4}-/i, category: 'Индуктивности', type: 'Катушка индуктивности (Bourns SRN)', brand: 'Bourns' },
  { pattern: /^SRP\d{3,4}/i, category: 'Индуктивности', type: 'Катушка индуктивности (Bourns SRP)', brand: 'Bourns' },
  { pattern: /^TBU-\w{2}\d{3}/i, category: 'Предохранители', type: 'TBU Protector (Bourns TBU)', brand: 'Bourns' },
  { pattern: /^P40-/i, category: 'Переключатели', type: 'Переключатель (Bourns P40)', brand: 'Bourns' },
  // --- Nextron industrial connectors ---
  { pattern: /^Z-\d{3,4}-\d{3,4}/i, category: 'Разъёмы', type: 'Разъём (Nextron)', brand: 'Nextron' },
  { pattern: /^Z-\d{5}/i, category: 'Разъёмы', type: 'Разъём (Nextron)', brand: 'Nextron' },
  { pattern: /^Z8\d{3,5}/i, category: 'Разъёмы', type: 'Разъём (Nextron)', brand: 'Nextron' },
  // --- Realtek Ethernet switches/PHYs ---
  { pattern: /^RTL8\d{3,4}/i, category: 'Интерфейсы', type: 'Ethernet Switch/PHY (Realtek RTL8)', brand: 'Realtek' },
  // --- Eaton relays ---
  { pattern: /^DILAC-\d{2}/i, category: 'Реле', type: 'Контактор (Eaton DILAC)', brand: 'Eaton Corporation' },
  // --- Fuji IGBT/MOSFET ---
  { pattern: /^1MB/i, category: 'Транзисторы', type: 'IGBT Module (Fuji 1MB)', brand: 'Fuji' },
  { pattern: /^2MB/i, category: 'Транзисторы', type: 'IGBT Module (Fuji 2MB)', brand: 'Fuji' },
  { pattern: /^2SK\d{3,4}/i, category: 'Транзисторы', type: 'MOSFET N-ch (Japanese 2SK)', brand: 'Fuji' },
  { pattern: /^2SJ\d{3,4}/i, category: 'Транзисторы', type: 'MOSFET P-ch (Japanese 2SJ)', brand: 'Fuji' },
  // --- Allegro Hall sensors / motor drivers ---
  { pattern: /^A\d{3,4}L/i, category: 'Датчики', type: 'Hall Sensor (Allegro A)', brand: 'Allegro' },
  { pattern: /^ACS\d{3,4}/i, category: 'Датчики', type: 'Current Sensor (Allegro ACS)', brand: 'Allegro' },
  { pattern: /^A49\d{3,4}/i, category: 'Интерфейсы', type: 'Мотор-драйвер (Allegro A49)', brand: 'Allegro' },
  // --- WEIDY capacitors ---
  { pattern: /^WD\d{2,3}/i, category: 'Конденсаторы', type: 'Электролитический конденсатор (WEIDY)', brand: 'WEIDY' },
  { pattern: /^VZ\d{2,3}/i, category: 'Конденсаторы', type: 'Электролитический конденсатор (WEIDY VZ)', brand: 'WEIDY' },
  // --- CHFRPU (Chinese PCB hardware) ---
  { pattern: /^\d\.\dMM/i, category: 'Монтаж и аксессуары', type: 'Fastener (CHFRPU)', brand: 'CHFRPU' },
  { pattern: /^E0510/i, category: 'Монтаж и аксессуары', type: 'PCB Hardware (CHFRPU)', brand: 'CHFRPU' },
  { pattern: /^SV\d/i, category: 'Монтаж и аксессуары', type: 'Wire/Connector (CHFRPU SV)', brand: 'CHFRPU' },
  // --- Xilinx / Lattice FPGAs ---
  { pattern: /^XC\d{2,4}[-A-Z]/i, category: 'ПЛИС (FPGA)', type: 'FPGA/CPLD (Xilinx XC)', brand: 'Xilinx' },
  { pattern: /^LFE\d{2,3}/i, category: 'ПЛИС (FPGA)', type: 'FPGA (Lattice LFE)', brand: 'Lattice' },
  { pattern: /^LCMXO/i, category: 'ПЛИС (FPGA)', type: 'CPLD/FPGA (Lattice LCMXO)', brand: 'Lattice' },
  // --- Murata ferrite beads ---
  { pattern: /^BLM\d{2,3}/i, category: 'Индуктивности', type: 'Ferrite Bead (Murata BLM)', brand: 'Murata' },
  { pattern: /^BLM15/i, category: 'Индуктивности', type: 'Ferrite Bead 0402 (Murata BLM15)', brand: 'Murata' },
  { pattern: /^BLM18/i, category: 'Индуктивности', type: 'Ferrite Bead 0603 (Murata BLM18)', brand: 'Murata' },
  // --- Würth broader ---
  { pattern: /^7\d{7,8}/i, category: 'Индуктивности', type: 'Катушка индуктивности (Würth 7xxx)', brand: 'Würth Elektronik' },
  { pattern: /^7499\d{4,5}/i, category: 'Разъёмы', type: 'Разъём (Würth 7499)', brand: 'Würth Elektronik' },
  { pattern: /^746\d{4,5}/i, category: 'Разъёмы', type: 'Разъём (Würth 746)', brand: 'Würth Elektronik' },
  { pattern: /^742\d{4,5}/i, category: 'Индуктивности', type: 'Катушка индуктивности (Würth 742)', brand: 'Würth Elektronik' },
  { pattern: /^82\d{4,5}/i, category: 'Конденсаторы', type: 'Конденсатор (Würth 82xx)', brand: 'Würth Elektronik' },
  { pattern: /^88\d{4,5}/i, category: 'Конденсаторы', type: 'Конденсатор (Würth 88xx)', brand: 'Würth Elektronik' },
  // --- Littelfuse ---
  { pattern: /^046[0-9]{3,4}/i, category: 'Предохранители', type: 'Предохранитель (Littelfuse)', brand: 'Littelfuse' },
  { pattern: /^044[0-9]{3,4}/i, category: 'Предохранители', type: 'Предохранитель (Littelfuse)', brand: 'Littelfuse' },
  // --- 3M / TE headers ---
  { pattern: /^8\d{3,4}-?/i, category: 'Разъёмы', type: 'Разъём (3M/TE)', brand: '3M' },
  { pattern: /^85\d{3,4}/i, category: 'Разъёмы', type: 'Разъём (3M)', brand: '3M' },
  // --- Yageo CC capacitors ---
  { pattern: /^CC\d{4}-/i, category: 'Конденсаторы', type: 'Керамический конденсатор (Yageo CC)', brand: 'Yageo' },
  // --- FSC (Fairchild) ---
  { pattern: /^FDD\d{3,4}/i, category: 'Транзисторы', type: 'MOSFET (Fairchild FDD)', brand: 'onsemi' },
  { pattern: /^FDP\d{3,4}/i, category: 'Транзисторы', type: 'MOSFET (Fairchild FDP)', brand: 'onsemi' },
  { pattern: /^FQA\d{3,4}/i, category: 'Транзисторы', type: 'MOSFET QFET (Fairchild FQA)', brand: 'onsemi' },
  { pattern: /^FQU\d{3,4}/i, category: 'Транзисторы', type: 'MOSFET QFET (Fairchild FQU)', brand: 'onsemi' },
  { pattern: /^KSP\d{2,3}/i, category: 'Транзисторы', type: 'BJT (Fairchild KSP)', brand: 'onsemi' },
  { pattern: /^KSP\d{2,3}B/i, category: 'Транзисторы', type: 'BJT PNP (Fairchild KSP)', brand: 'onsemi' },


  // ====================================================================
  // BATCH 5 — 3rd round: ~100 rules for remaining 253 prochie SKU
  // Focus: TI LMC/LMH/LMT/LMX/SN65xxx, plus long-tail brands
  // ====================================================================

  // --- TI: LMC (CMOS op-amps), LMH (high-speed), LMT (temp), LMX (PLL) ---
  { pattern: /^LMC\d{3,4}/i, category: 'Операционные усилители', type: 'CMOS ОУ (TI LMC)', brand: 'Texas Instruments' },
  { pattern: /^LMH\d{3,4}/i, category: 'Операционные усилители', type: 'High-Speed ОУ (TI LMH)', brand: 'Texas Instruments' },
  { pattern: /^LMT\d{2,3}/i, category: 'Датчики', type: 'Датчик температуры (TI LMT)', brand: 'Texas Instruments' },
  { pattern: /^LMX\d{4}/i, category: 'Интерфейсы', type: 'PLL Synthesizer (TI LMX)', brand: 'Texas Instruments' },
  { pattern: /^LM20/i, category: 'Датчики', type: 'Датчик температуры (TI LM20)', brand: 'Texas Instruments' },
  // --- TI: REG (LDO), SN75DP (DisplayPort), SNJ (military), TM4C (ARM MCU) ---
  { pattern: /^REG\d{3,4}/i, category: 'Стабилизаторы', type: 'LDO (TI REG)', brand: 'Texas Instruments' },
  { pattern: /^SN75DP\d{2,3}/i, category: 'Интерфейсы', type: 'DisplayPort Signal Conditioner (TI SN75DP)', brand: 'Texas Instruments' },
  { pattern: /^SNJ\d{4,5}/i, category: 'Логика', type: 'Military Logic (TI SNJ)', brand: 'Texas Instruments' },
  { pattern: /^TM4C\d{3,4}/i, category: 'Микроконтроллеры', type: 'ARM Cortex-M4 MCU (TI Tiva TM4C)', brand: 'Texas Instruments' },
  // --- TI: TPL (timers), TRF (RFID/RF), TS12A/TS3A/TS3V (analog switches) ---
  { pattern: /^TPL\d{3,4}/i, category: 'Микросхемы', type: 'Timer/Watcher (TI TPL)', brand: 'Texas Instruments' },
  { pattern: /^TRF\d{3,4}/i, category: 'Интерфейсы', type: 'RFID Reader / RF (TI TRF)', brand: 'Texas Instruments' },
  { pattern: /^TS\d{1,2}A\d{3,4}/i, category: 'Интерфейсы', type: 'Analog Switch (TI TSxxA)', brand: 'Texas Instruments' },
  { pattern: /^TS3A\d{3,5}/i, category: 'Интерфейсы', type: 'Analog Switch (TI TS3A)', brand: 'Texas Instruments' },
  { pattern: /^TS3V\d{2,4}/i, category: 'Интерфейсы', type: 'Video Switch (TI TS3V)', brand: 'Texas Instruments' },
  // --- TI: ULN/ULQ (Darlington arrays), WL (WiLink) ---
  { pattern: /^UL[NDQ]\d{4}/i, category: 'Интерфейсы', type: 'Darlington Driver Array (TI ULN/ULQ)', brand: 'Texas Instruments' },
  { pattern: /^WL\d{4}MOD/i, category: 'Модули и платы', type: 'WiLink Wireless Module (TI WL)', brand: 'Texas Instruments' },
  // --- TI: SN65C (RS-485), SN65LBC, SN65LVDS, SN65LVDT, SN65MLVD ---
  { pattern: /^SN65C\d{3,4}/i, category: 'Интерфейсы', type: 'RS-485 Transceiver (TI SN65C)', brand: 'Texas Instruments' },
  { pattern: /^SN65LBC\d{2,3}/i, category: 'Интерфейсы', type: 'RS-485 Transceiver (TI SN65LBC)', brand: 'Texas Instruments' },
  { pattern: /^SN65LVDS\d{1,3}/i, category: 'Интерфейсы', type: 'LVDS Transceiver (TI SN65LVDS)', brand: 'Texas Instruments' },
  { pattern: /^SN65LVDT\d{1,3}/i, category: 'Интерфейсы', type: 'LVDS Transceiver (TI SN65LVDT)', brand: 'Texas Instruments' },
  { pattern: /^SN65MLVD\d{1,3}/i, category: 'Интерфейсы', type: 'MLVD Transceiver (TI SN65MLVD)', brand: 'Texas Instruments' },
  { pattern: /^SN65\d{2,3}/i, category: 'Интерфейсы', type: 'Интерфейсная ИС (TI SN65)', brand: 'Texas Instruments' },
  // --- TI: DS34C86 (NSC brand) ---
  { pattern: /^DS34C\d{2,3}/i, category: 'Интерфейсы', type: 'RS-422 Receiver (TI/NSC DS34C)', brand: 'Texas Instruments' },
  // --- TI: THS, TS (already have), OPA ---
  { pattern: /^OPA\d{3,4}/i, category: 'Операционные усилители', type: 'ОУ (TI OPA)', brand: 'Texas Instruments' },

  // --- Microchip: AT89S, AT45DB, TC7SET ---
  { pattern: /^AT89S\d{2}/i, category: 'Микроконтроллеры', type: '8051 MCU (Microchip AT89S)', brand: 'Microchip' },
  { pattern: /^AT45DB\d{3,4}/i, category: 'Память', type: 'Serial DataFlash (Microchip AT45DB)', brand: 'Microchip' },
  { pattern: /^TC7SET\d{2}/i, category: 'Логика', type: 'Логический ИС (Microchip TC7SET)', brand: 'Microchip' },

  // --- Atmel AT45DB (also) ---
  { pattern: /^AT45/i, category: 'Память', type: 'DataFlash (Atmel AT45)', brand: 'Microchip' },

  // --- Cypress S25FL (Serial Flash) ---
  { pattern: /^S25FL\d{2,3}/i, category: 'Память', type: 'Serial NOR Flash (Cypress S25FL)', brand: 'Cypress' },
  { pattern: /^S25/i, category: 'Память', type: 'Flash Memory (Cypress S25)', brand: 'Cypress' },

  // --- Marvell 88E1112 (Ethernet PHY) ---
  { pattern: /^88E\d{3,4}/i, category: 'Интерфейсы', type: 'Ethernet PHY (Marvell 88E)', brand: 'Marvell' },

  // --- Samsung K4T (DRAM), K4B, K4A ---
  { pattern: /^K4[TBA]\d/i, category: 'Память', type: 'DRAM (Samsung K4T/B/A)', brand: 'Samsung' },

  // --- ISSI IS61/62 (SRAM/DRAM) ---
  { pattern: /^IS[67][12]\w/i, category: 'Память', type: 'SRAM/DRAM (ISSI IS6x)', brand: 'ISSI' },
  { pattern: /^IS61WV/i, category: 'Память', type: 'SRAM (ISSI IS61WV)', brand: 'ISSI' },

  // --- MXIC MX25L (Serial Flash) ---
  { pattern: /^MX25L\d{2,3}/i, category: 'Память', type: 'Serial NOR Flash (MXIC MX25L)', brand: 'MXIC' },
  { pattern: /^MX\d{2}/i, category: 'Память', type: 'Flash Memory (MXIC MX)', brand: 'MXIC' },

  // --- Maxim ICL7660 (voltage converter) ---
  { pattern: /^ICL\d{3,4}/i, category: 'Стабилизаторы', type: 'Voltage Converter (Maxim ICL)', brand: 'Maxim' },

  // --- U-Blox NEO-M8 (GPS) ---
  { pattern: /^NEO-M\d/i, category: 'Модули и платы', type: 'GPS/GNSS Module (U-Blox NEO)', brand: 'U-Blox' },

  // --- Trinamic TMC5130 (motor driver) ---
  { pattern: /^TMC\d{3,5}/i, category: 'Интерфейсы', type: 'Stepper Motor Driver (Trinamic TMC)', brand: 'Trinamic' },

  // --- ams OSRAM AS5147 (magnetic encoder) ---
  { pattern: /^AS\d{3,4}[A-Z]?/i, category: 'Датчики', type: 'Magnetic Encoder (ams AS)', brand: 'ams OSRAM' },

  // --- Allegro A4985/A4988 (stepper driver) ---
  { pattern: /^A49\d{2,3}/i, category: 'Интерфейсы', type: 'Stepper Motor Driver (Allegro A49)', brand: 'Allegro' },

  // --- Dialog DA14531 (BLE) ---
  { pattern: /^DA145\d{2}/i, category: 'Микроконтроллеры', type: 'BLE Wireless MCU (Dialog DA145xx)', brand: 'Dialog' },

  // --- Geehy APM32 (ARM MCU) ---
  { pattern: /^APM32/i, category: 'Микроконтроллеры', type: 'ARM Cortex-M MCU (Geehy APM32)', brand: 'Geehy' },

  // --- STC IAP15F105 (8051 MCU) ---
  { pattern: /^IAP15/i, category: 'Микроконтроллеры', type: '8051 MCU (STC IAP15)', brand: 'STC' },
  { pattern: /^STC\d/i, category: 'Микроконтроллеры', type: '8051 MCU (STC)', brand: 'STC' },

  // --- Nuvoton W681512 (telecom codec) ---
  { pattern: /^W68\d{3,5}/i, category: 'Интерфейсы', type: 'Telecom Codec (Nuvoton W68)', brand: 'Nuvoton Technology' },

  // --- NCE MOSFETs ---
  { pattern: /^NCE\d{2,4}/i, category: 'Транзисторы', type: 'MOSFET (NCE)', brand: 'NCE' },

  // --- Infineon BAT240A (Schottky) ---
  { pattern: /^BAT\d{3,4}/i, category: 'Диоды', type: 'Schottky диод (Infineon BAT)', brand: 'Infineon' },

  // --- onsemi MURF, MCWR ---
  { pattern: /^MURF\d{3,4}/i, category: 'Диоды', type: 'Ultra-fast Rectifier (onsemi MURF)', brand: 'onsemi' },
  { pattern: /^MCWR\d/i, category: 'Резисторы', type: 'Чип-резистор (onsemi MCWR)', brand: 'onsemi' },

  // --- Renesas HFA3127, 70V25L25 ---
  { pattern: /^HFA\d{3,4}/i, category: 'Операционные усилители', type: 'High-Speed ОУ (Renesas/Intersil HFA)', brand: 'Renesas' },
  { pattern: /^70V\d{2,3}[A-Z]/i, category: 'Память', type: 'FIFO/SRAM (Renesas/IDT 70V)', brand: 'Renesas' },

  // --- Microsemi APT30D60, JANTX1N ---
  { pattern: /^APT\d{2}/i, category: 'Транзисторы', type: 'Power MOSFET/Diode (Microsemi APT)', brand: 'Microsemi' },
  { pattern: /^JANTX/i, category: 'Диоды', type: 'Military JANTX Diode (Microsemi)', brand: 'Microsemi' },

  // --- MagnaChip MDP12N50 ---
  { pattern: /^MDP\d{2,3}/i, category: 'Транзисторы', type: 'MOSFET (MagnaChip MDP)', brand: 'MagnaChip' },

  // --- IXYS DSEI2X30 (fast diode) ---
  { pattern: /^DSEI\d/i, category: 'Диоды', type: 'Fast Rectifier Diode (IXYS DSEI)', brand: 'IXYS' },
  { pattern: /^DSEI2X/i, category: 'Диоды', type: 'Ultra-fast Diode (IXYS DSEI2X)', brand: 'IXYS' },

  // --- ROHM BA4424N, BP5310A ---
  { pattern: /^BA44\d/i, category: 'Микросхемы', type: 'Аналоговая ИС (Rohm BA44)', brand: 'Rohm' },
  { pattern: /^BP53\d/i, category: 'Стабилизаторы', type: 'DC-DC Конвертер (Rohm BP53)', brand: 'Rohm' },

  // --- Silicon Labs SI7N60L (MOSFET), SIZ44N ---
  { pattern: /^SI[7-9][A-Z]/i, category: 'Транзисторы', type: 'MOSFET (Silicon Labs SI)', brand: 'Silicon Labs' },
  { pattern: /^SIZ\d{2}/i, category: 'Транзисторы', type: 'MOSFET (Silicon Labs SIZ)', brand: 'Silicon Labs' },

  // --- MPS MP4575 (PMIC) ---
  { pattern: /^MP\d{4,5}[A-Z]/i, category: 'Стабилизаторы', type: 'PMIC/Регулятор (MPS MP)', brand: 'MPS' },

  // --- Mean Well RPT-75C (power supply) ---
  { pattern: /^RPT-\d{2,3}/i, category: 'Питание', type: 'Блок питания (Mean Well RPT)', brand: 'Mean Well' },
  { pattern: /^TEL\s?\d-\d{4}/i, category: 'Питание', type: 'DC-DC Конвертер (TracoPower TEL)', brand: 'TRACO Power' },

  // --- THD0515 (DC-DC) ---
  { pattern: /^THD\d{4}/i, category: 'Питание', type: 'DC-DC Конвертер (THD)', brand: 'THD' },

  // --- Viking AR03BTDX, ARG03DTC (chip resistors) ---
  { pattern: /^AR[0-9G]{2}/i, category: 'Резисторы', type: 'Чип-резистор (Viking AR)', brand: 'Viking' },

  // --- WEIDY W222A (capacitors) ---
  { pattern: /^W\d{3}A\d{3,4}/i, category: 'Конденсаторы', type: 'Конденсатор (WEIDY W)', brand: 'WEIDY' },

  // --- MuRata DFE, DLW, GA (inductors/common mode) ---
  { pattern: /^DFE\d{6,7}/i, category: 'Индуктивности', type: 'Катушка индуктивности SMD (Murata DFE)', brand: 'Murata' },
  { pattern: /^DLW\d{2}/i, category: 'Индуктивности', type: 'Common Mode Choke (Murata DLW)', brand: 'Murata' },
  { pattern: /^GA\d{3}/i, category: 'Индуктивности', type: 'Катушка индуктивности (Murata GA)', brand: 'Murata' },
  { pattern: /^BNX\d{2,3}/i, category: 'Индуктивности', type: 'EMI Filter (Murata BNX)', brand: 'Murata' },
  { pattern: /^PKLCS\d{4}/i, category: 'Индуктивности', type: 'Piezoelectric Sounder (Murata PKLCS)', brand: 'Murata' },

  // --- Sunlord SWPA (inductors) ---
  { pattern: /^SWPA\d{4}/i, category: 'Индуктивности', type: 'Катушка индуктивности (Sunlord SWPA)', brand: 'Sunlord' },

  // --- Sensirion SLF (inductors — actually Sensirion doesn't make inductors, this might be misbranded) ---
  { pattern: /^SLF\d{5}/i, category: 'Индуктивности', type: 'Катушка индуктивности (Sensirion SLF)', brand: 'Sensirion' },

  // --- Chilisin BMRA (inductors) ---
  { pattern: /^BMRA\d/i, category: 'Индуктивности', type: 'Катушка индуктивности (Chilisin BMRA)', brand: 'Chilisin' },

  // --- Pulse HM1188NLT (transformer) ---
  { pattern: /^HM\d{3,4}NLT/i, category: 'Трансформаторы', type: 'Трансформатор (Pulse HM)', brand: 'Pulse' },

  // --- Mini-Circuits ROS, XLF (RF components) ---
  { pattern: /^ROS-\d{3,4}/i, category: 'Интерфейсы', type: 'RF Oscillator (Mini-Circuits ROS)', brand: 'Mini-Circuits' },
  { pattern: /^XLF-\d{3}/i, category: 'Интерфейсы', type: 'RF Filter (Mini-Circuits XLF)', brand: 'Mini-Circuits' },
  { pattern: /^T1-\d/i, category: 'Трансформаторы', type: 'RF Transformer (Mini-Circuits T1)', brand: 'Mini-Circuits' },

  // --- Qorvo SGA, SZA (RF transistors) ---
  { pattern: /^SG[AP]-\d/i, category: 'Интерфейсы', type: 'RF Amplifier (Qorvo SG)', brand: 'Qorvo' },
  { pattern: /^SZ\d[A-Z]\d/i, category: 'Интерфейсы', type: 'RF Transistor (Qorvo SZ)', brand: 'Qorvo' },

  // --- Ampleon BLP7G22 (RF LDMOS) ---
  { pattern: /^BLP\dG\d/i, category: 'Интерфейсы', type: 'RF LDMOS (Ampleon BLP)', brand: 'Ampleon' },

  // --- SEMELAB D1008UK (RF transistor) ---
  { pattern: /^D\d{4}UK/i, category: 'Транзисторы', type: 'RF Transistor (SEMELAB D)', brand: 'SEMELAB' },

  // --- ams OSRAM (already have AS), Sensirion SLF (already have) ---

  // --- KEMET ELG (capacitor), R413 (resistor) ---
  { pattern: /^ELG\d{3}/i, category: 'Конденсаторы', type: 'Электролитический конденсатор (KEMET ELG)', brand: 'KEMET' },
  { pattern: /^R4\d{2}W/i, category: 'Резисторы', type: 'Толстоплёночный резистор (KEMET R4)', brand: 'KEMET' },

  // --- Nichicon UHE (electrolytic) ---
  { pattern: /^UHE\d[A-Z]\d{2,3}/i, category: 'Конденсаторы', type: 'Электролитический конденсатор (Nichicon UHE)', brand: 'Nichicon' },

  // --- Omron EEV (electrolytic) ---
  { pattern: /^EEV\d{2,3}/i, category: 'Конденсаторы', type: 'Электролитический конденсатор (Omron EEV)', brand: 'Omron' },

  // --- Panasonic MKP (film capacitor) ---
  { pattern: /^MKP\d{2}-\d{3}/i, category: 'Конденсаторы', type: 'Pl плёночный конденсатор (Panasonic MKP)', brand: 'Panasonic' },

  // --- Ohmite HS50 (power resistor) ---
  { pattern: /^HS\d{2,3}\s/i, category: 'Резисторы', type: 'Толстоплёночный резистор (Ohmite HS)', brand: 'Ohmite' },

  // --- ROYALOHM RESC1608 (chip resistor) ---
  { pattern: /^RESC\d{4}/i, category: 'Резисторы', type: 'Чип-резистор (ROYALOHM RESC)', brand: 'ROYALOHM' },

  // --- UNI-ROYAL 181207 (chip resistor — already have \d{6}[FJ]\d{3,4}[KT] but check) ---
  // (already covered)

  // --- Multicomp PRO MP0xxx (generic) ---
  { pattern: /^MP0\d{4,5}/i, category: 'Микросхемы', type: 'ИС (Multicomp PRO MP0)', brand: 'Multicomp PRO' },

  // --- GENESYS GL827/GL850 (USB hub) ---
  { pattern: /^GL\d{3,4}-/i, category: 'Интерфейсы', type: 'USB Hub Controller (Genesys GL)', brand: 'GENESYS' },

  // --- FTDI FT5HNBPK (USB bridge) ---
  { pattern: /^FT\d[A-Z]/i, category: 'Интерфейсы', type: 'USB Bridge (FTDI FT)', brand: 'FTDI' },

  // --- LANSON 5M1500A (CPLD) ---
  { pattern: /^5M\d{3,4}/i, category: 'ПЛИС (FPGA)', type: 'CPLD (Intel/Altera MAX 5M)', brand: 'Intel/Altera' },

  // --- Intel/Altera EP53A8HQI (Enpirion PMIC, has letter after 3 digits) ---
  { pattern: /^EP53\d/i, category: 'Стабилизаторы', type: 'PowerSoC PMIC (Intel/Altera Enpirion EP53)', brand: 'Intel/Altera' },
  { pattern: /^EP5[0-9A-Z]\d/i, category: 'Стабилизаторы', type: 'PowerSoC PMIC (Intel/Altera Enpirion EP5)', brand: 'Intel/Altera' },

  // --- MICRON/AMD M29W800 (Flash) ---
  { pattern: /^M29W\d{3,4}/i, category: 'Память', type: 'Parallel NOR Flash (Micron M29W)', brand: 'Micron' },

  // --- SEMTECH SRV05 (ESD protection) ---
  { pattern: /^SRV\d{2}-\d/i, category: 'Диоды', type: 'TVS-диод ESD (Semtech SRV)', brand: 'Semtech' },

  // --- TECH PUBLIC PRTR5V0U2X (ESD protection) ---
  { pattern: /^PRTR\dV/i, category: 'Диоды', type: 'TVS-диод ESD (NXP/TECH PRTR)', brand: 'NXP' },

  // --- TDK CDDFN (TVS array), CTA (inductor) ---
  { pattern: /^CDDFN\d/i, category: 'Диоды', type: 'TVS-диод array (TDK CDDFN)', brand: 'TDK' },
  { pattern: /^CTA-\d/i, category: 'Индуктивности', type: 'Катушка индуктивности (TDK CTA)', brand: 'TDK' },

  // --- PANJIT ES2J (diode) ---
  { pattern: /^ES[12]J/i, category: 'Диоды', type: 'Ultra-fast Rectifier (PANJIT ES)', brand: 'PANJIT' },

  // --- MCC MMSS8050 (transistor) ---
  { pattern: /^MMSS\d{4}/i, category: 'Транзисторы', type: 'BJT (MCC MMSS)', brand: 'MCC' },
  { pattern: /^MMS\d{4}/i, category: 'Транзисторы', type: 'BJT (MCC MMS)', brand: 'MCC' },

  // --- JSCJ BU406 (BJT) ---
  { pattern: /^BU\d{3,4}/i, category: 'Транзисторы', type: 'BJT Power (JSCJ BU)', brand: 'JSCJ' },

  // --- HJC B5819WS (Schottky) ---
  { pattern: /^B58\d{2}/i, category: 'Диоды', type: 'Schottky диод (HJC B58xx)', brand: 'HJC' },

  // --- GOOD-ARK / GOODWORK diodes ---
  { pattern: /^FR\d{3}/i, category: 'Диоды', type: 'Fast Rectifier (GOOD-ARK FR)', brand: 'GOOD-ARK' },
  { pattern: /^HER\d{3}/i, category: 'Диоды', type: 'High-Efficiency Rectifier (GOODWORK HER)', brand: 'GOODWORK' },

  // --- FSC FFB2222A (BJT) ---
  { pattern: /^FFB\d{4}/i, category: 'Транзисторы', type: 'BJT SMD (Fairchild FFB)', brand: 'onsemi' },

  // --- EVERLIGHT ITR9608 (photointerrupter) ---
  { pattern: /^ITR\d{3,4}/i, category: 'Оптоэлектроника', type: 'Photointerrupter (Everlight ITR)', brand: 'Everlight' },

  // --- Kingbright KAA-3528 (LED) ---
  { pattern: /^KAA-\d{4}/i, category: 'Оптоэлектроника', type: 'SMD LED (Kingbright KAA)', brand: 'Kingbright' },

  // --- NATIONSTAR NCD0603 (LED) ---
  { pattern: /^NCD\d{4}/i, category: 'Оптоэлектроника', type: 'SMD LED (Nationstar NCD)', brand: 'NATIONSTAR' },

  // --- LG INOTEK LEUVK37 (UV LED) ---
  { pattern: /^LEUVK/i, category: 'Оптоэлектроника', type: 'UV LED (LG Innotek LEUVK)', brand: 'LG INNOTEK' },

  // --- Orient ORH-YG (LED) ---
  { pattern: /^ORH-/i, category: 'Оптоэлектроника', type: 'LED (Orient ORH)', brand: 'Orient' },

  // --- TT Electronics OPB608A (optical sensor) ---
  { pattern: /^OPB\d{3,4}/i, category: 'Оптоэлектроника', type: 'Optical Sensor (TT Electronics OPB)', brand: 'TT Electronics/Optek Technology' },

  // --- FOXCONN UEA3119C (connector) ---
  { pattern: /^UEA\d{4}/i, category: 'Разъёмы', type: 'Разъём (Foxconn UEA)', brand: 'FOXCONN' },

  // --- Harwin M20-9990245 (connector) ---
  { pattern: /^M20-\d{6,7}/i, category: 'Разъёмы', type: 'Разъём (Harwin M20)', brand: 'Harwin' },

  // --- Hirose DF57H (connector) ---
  { pattern: /^DF\d{2}[A-Z]-/i, category: 'Разъёмы', type: 'Разъём (Hirose DF)', brand: 'Hirose' },

  // --- JAE ST1W008 (connector) ---
  { pattern: /^ST1W\d{3}/i, category: 'Разъёмы', type: 'Разъём (JAE ST1W)', brand: 'JAE Electronics' },

  // --- TXGA FHG20001 (connector) ---
  { pattern: /^FHG\d{4,5}/i, category: 'Разъёмы', type: 'Разъём (TXGA FHG)', brand: 'TXGA' },

  // --- WXRKDZ IDC3-20P (connector) ---
  { pattern: /^IDC\d-\d{1,2}P/i, category: 'Разъёмы', type: 'IDC Разъём (WXRKDZ IDC)', brand: 'WXRKDZ' },

  // --- Urite F5B-T3.5 (connector) ---
  { pattern: /^F5B-T/i, category: 'Разъёмы', type: 'Разъём (Urite F5B)', brand: 'Urite' },

  // --- SKF bearings ---
  { pattern: /^BM[OB]-\d{4}/i, category: 'Монтаж и аксессуары', type: 'Подшипник (SKF BM)', brand: 'SKF' },

  // --- Essentra DLCBST (cable tie) ---
  { pattern: /^DLCBST/i, category: 'Монтаж и аксессуары', type: 'Cable Tie (Essentra DLCBST)', brand: 'Essentra' },

  // --- MPD BK-912 (battery holder) ---
  { pattern: /^BK-\d{3,4}/i, category: 'Монтаж и аксессуары', type: 'Battery Holder (MPD BK)', brand: 'MPD' },

  // --- ABLIC S-24C02 (EEPROM) ---
  { pattern: /^S-\dC/i, category: 'Память', type: 'EEPROM Serial (ABLIC S-24C)', brand: 'ABLIC' },

  // --- AMS/ScioSense ENS210 (temp sensor) ---
  { pattern: /^ENS\d{3}/i, category: 'Датчики', type: 'Датчик температуры (AMS ENS)', brand: 'AMS/ScioSense' },

  // --- ANPEC APL3523 (PMIC) ---
  { pattern: /^APL\d{3,4}/i, category: 'Стабилизаторы', type: 'LDO/PMIC (ANPEC APL)', brand: 'ANPEC' },

  // --- BELLING BL8052 (timer) ---
  { pattern: /^BL8\d{3}/i, category: 'Микросхемы', type: 'Timer (BELLING BL8)', brand: 'BELLING' },

  // --- GENITOP GT21L16S2W (display driver) ---
  { pattern: /^GT21L\d/i, category: 'Интерфейсы', type: 'Display Driver (GENITOP GT21L)', brand: 'GENITOP' },

  // --- Mayatech MT10PRO (instrument) ---
  { pattern: /^Mayatech/i, category: 'Монтаж и аксессуары', type: 'Инструмент (Mayatech)', brand: 'Mayatech' },

  // --- C&K TDA08H0SB1 (switch) ---
  { pattern: /^TDA\d{2}H/i, category: 'Переключатели', type: 'Тумблер (C&K TDA)', brand: 'C&K' },

  // --- Cherry DB2C-A1MC (switch) ---
  { pattern: /^DB2C-/i, category: 'Переключатели', type: 'Переключатель (Cherry DB2C)', brand: 'Cherry' },

  // --- SHOU HAN MSK12C02 (switch) ---
  { pattern: /^MSK\d{2}C/i, category: 'Переключатели', type: 'Переключатель (SHOU HAN MSK)', brand: 'SHOU HAN' },

  // --- YE DSWB05LHGET (switch) ---
  { pattern: /^DSWB\d{2}/i, category: 'Переключатели', type: 'Переключатель (YE DSWB)', brand: 'YE' },

  // --- FOTEK PL-05N (sensor) ---
  { pattern: /^PL-\d{2}/i, category: 'Датчики', type: 'Photoelectric Sensor (Fotek PL)', brand: 'FOTEK' },

  // --- STMicro VIPer22ADIP (offline converter) ---
  { pattern: /^VIPer\d{2}/i, category: 'Стабилизаторы', type: 'Offline Converter (STMicro VIPer)', brand: 'STMicroelectronics' },

  // --- ST ST662ABD (charge pump) ---
  { pattern: /^ST66\d/i, category: 'Стабилизаторы', type: 'Charge Pump (ST ST66)', brand: 'ST' },

  // --- YXC X32258MOB4SI (oscillator) ---
  { pattern: /^X\d{5,6}MO/i, category: 'Кварцы и резонаторы', type: 'Кварцевый генератор (YXC)', brand: 'YXC' },

  // --- Intersil HS1-3282 (military op-amp) ---
  { pattern: /^HS1-\d/i, category: 'Операционные усилители', type: 'Military ОУ (Intersil HS1)', brand: 'Intersil' },

  // --- Deltatech NE182UEEL6AMP (MOSFET) ---
  { pattern: /^NE18\dU/i, category: 'Транзисторы', type: 'MOSFET (Deltatech NE18)', brand: 'Deltatech' },

  // --- Fuji FA23842, V706MD ---
  { pattern: /^FA23\d{3}/i, category: 'Транзисторы', type: 'IGBT (Fuji FA23)', brand: 'Fuji' },
  { pattern: /^V70\dMD/i, category: 'Транзисторы', type: 'IGBT Module (Fuji V70)', brand: 'Fuji' },

  // --- NXP SCC2681 (UART) ---
  { pattern: /^SCC\d{4}/i, category: 'Интерфейсы', type: 'UART Controller (NXP/Philips SCC)', brand: 'NXP' },

  // --- Nexperia PDTA114Y (BJT) ---
  { pattern: /^PDT[A-Z]\d{3}/i, category: 'Транзисторы', type: 'BJT SMD (Nexperia PDTA/PDTB)', brand: 'Nexperia' },

  // --- Nuvoton W681512RG (already added) ---

  // --- MARVELL 88E1112 (already added) ---

  // --- MXIC MX25L25673G (already added) ---

  // --- Bourns SRN/SRP (already have) ---

];

function detectExtraCategory(sku: string, name: string): { category: string; type: string; brand?: string } | null {
  const text = `${sku} ${name}`.trim();
  if (!text) return null;
  for (const rule of EXTRA_RULES) {
    if (rule.pattern.test(text)) {
      return { category: rule.category, type: rule.type, brand: rule.brand };
    }
  }
  return null;
}

// ============================================================================
// REST API HELPERS
// ============================================================================

async function fetchSelect(url: string, rangeHeader?: string): Promise<any> {
  const headers: Record<string, string> = { ...HEADERS };
  if (rangeHeader) headers['Range'] = rangeHeader;
  const resp = await fetch(url, { headers });
  if (!resp.ok && resp.status !== 206) {
    const text = await resp.text();
    throw new Error(`GET ${url} failed: ${resp.status} ${text}`);
  }
  return resp.json();
}

async function patchRow(table: string, id: string, patch: any): Promise<void> {
  const url = `${SUPABASE_URL}/rest/v1/${table}?id=eq.${id}`;
  const resp = await fetch(url, {
    method: 'PATCH',
    headers: HEADERS,
    body: JSON.stringify(patch),
  });
  if (!resp.ok) {
    const text = await resp.text();
    throw new Error(`PATCH ${table}/${id} failed: ${resp.status} ${text}`);
  }
}

// ============================================================================
// КЭШ КАТЕГОРИЙ: name → UUID
// ============================================================================

let categoryCache: Map<string, string> = new Map();

async function loadCategoryCache(): Promise<void> {
  const url = `${SUPABASE_URL}/rest/v1/categories?select=id,name,slug,level&level=eq.2&limit=100`;
  const data = await fetchSelect(url);
  for (const cat of data) {
    categoryCache.set(cat.name, cat.id);
    categoryCache.set(cat.slug, cat.id);
  }
  console.log(`  Loaded ${categoryCache.size / 2} level-2 categories into cache`);
}

function resolveCategoryId(categoryName: string): { uuid: string; resolvedName: string } | null {
  // Try direct match
  let uuid = categoryCache.get(categoryName);
  if (uuid) return { uuid, resolvedName: categoryName };

  // Try mapping (subcategory → parent level-2)
  const mapped = CATEGORY_MAPPING[categoryName];
  if (mapped) {
    uuid = categoryCache.get(mapped);
    if (uuid) return { uuid, resolvedName: mapped };
  }

  return null;
}

// ============================================================================
// ПАРСЕР АРГУМЕНТОВ
// ============================================================================

const args = process.argv.slice(2);
const APPLY = args.includes('--apply');
const LIMIT_IDX = args.indexOf('--limit');
const LIMIT = LIMIT_IDX >= 0 ? parseInt(args[LIMIT_IDX + 1]) : 10000;
const PAGE_SIZE = 1000; // Supabase REST API max per request
const BATCH_SIZE = 50;  // PATCH parallelism

// ============================================================================
// ГЛАВНАЯ ФУНКЦИЯ
// ============================================================================

async function main() {
  console.log('===============================================================');
  console.log('  ENRICH DATABASE v3 — reclassify "Прочие компоненты" via MPN decoder');
  console.log('===============================================================');
  console.log(`  Mode: ${APPLY ? 'APPLY (запись)' : 'DRY-RUN (только отчёт)'}`);
  console.log(`  Limit: ${LIMIT} товаров (пагинация по ${PAGE_SIZE} per request)`);
  console.log('===============================================================\n');

  // 1) Загрузить кэш категорий
  console.log('[1] Loading category cache...');
  await loadCategoryCache();

  // 2) Fetch all items with pagination (Range header)
  console.log('\n[2] Fetching items with category_id=prochie AND category="Прочие компоненты"...');
  const allProducts: any[] = [];
  let offset = 0;

  while (offset < LIMIT) {
    const pageSize = Math.min(PAGE_SIZE, LIMIT - offset);
    // Use ONLY Range header for pagination (PostgREST/Supabase respects Range).
    // Do NOT put ?limit=... in URL — it overrides Range header and resets to row 0.
    const url = `${SUPABASE_URL}/rest/v1/components?`
      + `select=id,sku,brand,category,name,attributes,category_id&`
      + `category_id=eq.${PROCHIE_UUID}&`
      + `category=eq.${encodeURIComponent('Прочие компоненты')}`;

    const rangeHeader = `${offset}-${offset + pageSize - 1}`;
    let batch: any[];
    try {
      batch = await fetchSelect(url, rangeHeader);
    } catch (e: any) {
      console.error(`  Fetch error at offset ${offset}:`, e.message);
      break;
    }
    if (!batch || batch.length === 0) {
      console.log(`  No more items at offset ${offset}. Total fetched: ${allProducts.length}`);
      break;
    }
    allProducts.push(...batch);
    console.log(`  Fetched ${batch.length} items (offset ${offset}, total: ${allProducts.length})`);
    if (batch.length < pageSize) break; // last page
    offset += pageSize;
  }

  if (allProducts.length === 0) {
    console.log('Нет товаров для реклассификации — БД уже чистая!');
    return;
  }

  console.log(`\n  Total items to process: ${allProducts.length}\n`);

  // 3) Process
  let updated = 0;
  let noCategoryDetected = 0;
  let categoryNotFound = 0;
  let noChanges = 0;

  const stats = {
    byCategory: {} as Record<string, number>,
    byBrand: {} as Record<string, number>,
  };

  for (let i = 0; i < allProducts.length; i += BATCH_SIZE) {
    const batch = allProducts.slice(i, i + BATCH_SIZE);
    console.log(`--- Батч ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(allProducts.length / BATCH_SIZE)} (${batch.length} тов.) ---`);

    const updates: Array<{ id: string; patch: any; sku: string; newCategory: string }> = [];

    for (const product of batch) {
      const enriched = enrichComponent(
        product.sku,
        product.brand,
        product.category,
        product.name,
        product.attributes,
      );

      let newCategory = enriched.category;
      let newType = enriched.type;
      let newBrand = enriched.brand !== 'Unknown' ? enriched.brand : product.brand;

      // If MPN decoder didn't recognize — try extra SKU prefix rules
      if (newCategory === 'Прочие компоненты' || newCategory === 'Электронные компоненты') {
        const extra = detectExtraCategory(product.sku, product.name);
        if (extra) {
          newCategory = extra.category;
          newType = extra.type;
          if (extra.brand && (newBrand === 'Unknown' || !newBrand)) {
            newBrand = extra.brand;
          }
        }
      }

      // Skip if still 'Прочие компоненты' — couldn't be classified
      if (newCategory === 'Прочие компоненты' || newCategory === 'Электронные компоненты') {
        noCategoryDetected++;
        continue;
      }

      // Resolve category UUID (with mapping fallback)
      const resolved = resolveCategoryId(newCategory);
      if (!resolved) {
        categoryNotFound++;
        continue;
      }

      const targetCategoryId = resolved.uuid;
      const finalCategory = resolved.resolvedName;

      // Skip if UUID unchanged
      if (targetCategoryId === product.category_id) {
        noChanges++;
        continue;
      }

      // Build patch
      const oldAttrs = (product.attributes as Record<string, string | number>) || {};
      const newAttrs: Record<string, string | number> = { ...oldAttrs };
      for (const [key, value] of Object.entries(enriched.specs)) {
        const lowerKey = key.toLowerCase();
        const exists = Object.keys(oldAttrs).some(k => k.toLowerCase() === lowerKey);
        if (!exists) {
          newAttrs[key] = value;
        }
      }

      const newName = `${product.sku} — ${newType} (${newBrand})`;

      const patch: any = {
        category: finalCategory,
        category_id: targetCategoryId,
        brand: newBrand,
        name: newName,
        attributes: newAttrs,
      };

      updates.push({ id: product.id, patch, sku: product.sku, newCategory: finalCategory });

      stats.byCategory[finalCategory] = (stats.byCategory[finalCategory] || 0) + 1;
      stats.byBrand[newBrand] = (stats.byBrand[newBrand] || 0) + 1;

      const changes: string[] = [
        `cat: Прочие → ${finalCategory}`,
        `cat_id: ${targetCategoryId.substring(0, 8)}...`,
      ];
      if (newBrand !== product.brand) changes.push(`brand: ${product.brand} → ${newBrand}`);
      console.log(`  ${product.sku.padEnd(30)} ${changes.join(' | ')}`);
    }

    if (APPLY && updates.length > 0) {
      console.log(`  Applying ${updates.length} updates...`);
      const results = await Promise.all(
        updates.map(u => patchRow('components', u.id, u.patch).catch(e => ({ error: e.message })))
      );
      const errors = results.filter((r: any) => r && r.error);
      if (errors.length > 0) {
        console.error(`  ${errors.length} errors:`);
        errors.slice(3).forEach((e: any, idx: number) => {
          console.error(`    ${idx + 1}. ${e.error}`);
        });
      } else {
        console.log(`  ✅ OK: ${updates.length} updated`);
        updated += updates.length;
      }
    } else if (!APPLY) {
      updated += updates.length;
    }
  }

  // 4) Final report
  console.log('\n===============================================================');
  console.log('  ИТОГОВЫЙ ОТЧЁТ');
  console.log('===============================================================');
  console.log(`  Всего проверено:           ${allProducts.length}`);
  console.log(`  Будет обновлено:          ${updated}`);
  console.log(`  Без изменений:            ${noChanges}`);
  console.log(`  Категория не распознана:   ${noCategoryDetected}`);
  console.log(`  Категория не найдена в БД: ${categoryNotFound}`);
  console.log(`  Mode: ${APPLY ? 'APPLY (применено)' : 'DRY-RUN (--apply для записи)'}`);

  if (Object.keys(stats.byCategory).length > 0) {
    console.log('\n  Новые категории (топ-20):');
    Object.entries(stats.byCategory)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 20)
      .forEach(([cat, count]) => console.log(`    ${cat}: ${count}`));
  }

  if (Object.keys(stats.byBrand).length > 0) {
    console.log('\n  Новые бренды (топ-10):');
    Object.entries(stats.byBrand)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .forEach(([brand, count]) => console.log(`    ${brand}: ${count}`));
  }

  console.log('\n===============================================================');
  if (!APPLY && updated > 0) {
    console.log('  DRY-RUN. Для применения: npx tsx scripts/enrich-database-v3.ts --apply');
  } else if (APPLY) {
    console.log('  Все изменения применены в БД.');
  }
  console.log('===============================================================');
}

main().catch(err => {
  console.error('Fatal:', err);
  process.exit(1);
});

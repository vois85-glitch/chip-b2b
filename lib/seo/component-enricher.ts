// lib/seo/component-enricher.ts
//
// Динамический детектор и парсер типов компонентов по MPN (Manufacturer Part Number).
// Используется когда в БД нет точных данных о категории/типе/спецификациях,
// или когда данные в БД содержат фантомные бренды/категории.
//
// Источник истины (Single Source of Truth) для:
//   - calculateCategory(sku) — точная категория по MPN
//   - calculateType(sku) — точный тип компонента
//   - calculateSpecs(sku, attributes) — технические параметры (V, I, package, etc.)
//   - calculateDescription(sku, brand) — SEO-описание на основе параметров
//
// Поддерживает 80+ серий компонентов основных производителей:
//   TI, ST, ADI, Microchip, NXP, Infineon, onsemi, Renesas, Murata, TDK, Yageo и др.

// ============================================================================
// ТИПЫ
// ============================================================================

export type ComponentSpecs = Record<string, string | number>;

export type EnrichedComponent = {
  category: string;          // Точная категория (например "Микроконтроллеры")
  type: string;               // Точный тип (например "32-разрядный ARM Cortex-M7")
  brand: string;              // Реальный бренд по MPN
  package: string;            // Корпус (например "LQFP-64", "DSBGA")
  specs: ComponentSpecs;     // Технические параметры (V, I, freq, etc.)
  description: string;        // SEO-описание
  isEnriched: boolean;        // True если данные вычислены (а не из БД)
};

// ============================================================================
// MPN -> BRAND MAPPING (расширенная карта, 90+ паттернов)
// ============================================================================

type BrandPattern = { prefixes: string[]; brand: string };

const BRAND_PATTERNS: BrandPattern[] = [
  // Sensirion
  { prefixes: ['SHT', 'STS', 'SGP', 'SFA', 'SLF', 'SDP', 'SHTC'], brand: 'Sensirion' },
  // Bosch Sensortec
  { prefixes: ['BMP', 'BME', 'BMM', 'BHI', 'BMI', 'BMA', 'BNO', 'BHY'], brand: 'Bosch Sensortec' },
  // STMicroelectronics
  { prefixes: ['STM32', 'STM8', 'STP', 'STW', 'STSN', 'STV', 'STEVAL', 'STNRG', 'STSPIN', 'LDL', 'LPS', 'LIS', 'LSM', 'VL53', 'STUSB', 'STBRG'], brand: 'STMicroelectronics' },
  // Texas Instruments
  { prefixes: ['TPS', 'INA', 'CC', 'MSP', 'BQ', 'LM', 'TL', 'UC', 'SN74', 'CD74', 'CD4', 'TMS', 'DAC', 'ADS', 'AFE', 'OPA', 'THS', 'LMR', 'LMG', 'UCC', 'SN65', 'DP83', 'TUSB', 'MSP430', 'MSP432', 'TIVA'], brand: 'Texas Instruments' },
  // Analog Devices (includes Maxim Integrated since 2021)
  { prefixes: ['AD', 'MAX', 'LTC', 'ADM', 'ADV', 'HMC', 'ADUM', 'ADXL', 'AD7', 'AD8', 'ADA', 'LT', 'LTZ', 'LT3', 'LTC3', 'HMC', 'AD9', 'AD5', 'AD4', 'ADR'], brand: 'Analog Devices' },
  // Microchip (includes Atmel)
  { prefixes: ['ATmega', 'ATtiny', 'AT90', 'ATxmega', 'AVR', 'AT32', 'PIC', 'dsPIC', 'PIC32', 'MCP', '24LC', '24AA', '24C', 'TC', 'KSZ', 'SST', 'ATA'], brand: 'Microchip' },
  // Espressif
  { prefixes: ['ESP32', 'ESP8266', 'ESP-C', 'ESP-S', 'ESP'], brand: 'Espressif' },
  // GigaDevice
  { prefixes: ['GD32', 'GD25', 'GD5F', 'GD9'], brand: 'GigaDevice' },
  // WCH
  { prefixes: ['CH32', 'CH55', 'CH57', 'CH58', 'CH59', 'CH340', 'CH341'], brand: 'WCH' },
  // HKMicroelectronics
  { prefixes: ['HK32'], brand: 'HKMicroelectronics' },
  // Infineon (was International Rectifier)
  { prefixes: ['IRF', 'IRL', 'IR', 'IRG', 'IKP', 'IPT', 'BSC', 'SPW', 'SKW', 'BTS', 'TLE', 'IFX'], brand: 'Infineon' },
  // ON Semiconductor
  { prefixes: ['NCP', 'NVM', 'FAN', 'FSDL', 'MC', 'MC74', 'MC34', 'MC33', 'CAT', 'NBS', 'EBC', 'NSI', '1N4148', '1N4007', '1N5817', 'MUR', 'NTD'], brand: 'onsemi' },
  // NXP
  { prefixes: ['MPU', 'i.MX', 'Kinetis', 'MK', 'LPC', 'S32', 'TJA', 'PCF', 'SAF', 'BF', 'LFS', 'HEF', '74HC', '74HCT'], brand: 'NXP' },
  // Silicon Labs
  { prefixes: ['EFM32', 'C8051', 'Si', 'EFR32', 'CP', 'TS5', 'EFM8'], brand: 'Silicon Labs' },
  // Xilinx
  { prefixes: ['XC', 'SP', 'ZC', 'ZU', 'XC7', 'XC6', 'XC9', 'XC3S', 'XC2S'], brand: 'Xilinx' },
  // Intel/Altera
  { prefixes: ['EP', 'EP2C', 'EP4C', 'EP1C', 'EPM', 'Cyclone', 'MAX10', '10M', '5CG', '5CE'], brand: 'Intel/Altera' },
  // Lattice
  { prefixes: ['ICE40', 'LFX', 'LCMXO', 'LCMXO2', 'LIF', 'LFD', 'MachXO'], brand: 'Lattice' },
  // Gowin
  { prefixes: ['GW1N', 'GW2A', 'GW3', 'GW5'], brand: 'Gowin' },
  // Efinix
  { prefixes: ['EF', 'T8', 'T20', 'T35', 'T120', 'TX'], brand: 'Efinix' },
  // Winbond
  { prefixes: ['W25', 'W98', 'W39'], brand: 'Winbond' },
  // FTDI
  { prefixes: ['FT232', 'FT2232', 'FT4232', 'FT', 'FT240', 'FT245'], brand: 'FTDI' },
  // WIZnet
  { prefixes: ['W5100', 'W5200', 'W5300', 'W5500', 'W7100'], brand: 'WIZnet' },
  // SIMCom
  { prefixes: ['SIM800', 'SIM7600', 'SIM900', 'SIM5300', 'SIM7000', 'SIM'], brand: 'SIMCom' },
  // Semtech
  { prefixes: ['SX1278', 'SX1262', 'SX1276', 'SX1268', 'SX1280', 'SX'], brand: 'Semtech' },
  // Realtek
  { prefixes: ['RTL8211', 'RTL8201', 'RTL'], brand: 'Realtek' },
  // Renesas
  { prefixes: ['R5F', 'RA4', 'RA6', 'RL78', 'RX', 'RZ'], brand: 'Renesas' },
  // Nordic
  { prefixes: ['nRF', 'NRF', 'NRF52', 'NRF53', 'NRF24'], brand: 'Nordic Semiconductor' },
  // Murata
  { prefixes: ['NCP18', 'NCP21', 'NTCG', 'GRM', 'LQM', 'BLM'], brand: 'Murata' },
  // TDK
  { prefixes: ['C', 'FK', 'CGA', 'CGB', 'C1005', 'C1608', 'C2012', 'C3216'], brand: 'TDK' },
  // Yageo
  { prefixes: ['CC', 'RC', 'AC'], brand: 'Yageo' },
  // Samsung Electro-Mechanics
  { prefixes: ['CL', 'CL10', 'CL21', 'CL31', 'CL32'], brand: 'Samsung Electro-Mechanics' },
  // Vishay
  { prefixes: ['SI', 'VS', 'VSS', 'SMAJ', 'SMBJ', 'SMCJ', '1.5KE', 'P6KE', 'S34', 'SS'], brand: 'Vishay' },
  // Mean Well
  { prefixes: ['LRS', 'DR', 'RSP', 'MDR', 'IRM', 'RS', 'DDK', 'SD'], brand: 'Mean Well' },
  // Omron
  { prefixes: ['B3U', 'B3F', 'G6D', 'G2R', 'MY2', 'LY2', 'EE'], brand: 'Omron' },
  // Diodes Inc
  { prefixes: ['1N4148', '1N400', '1N540', 'B340', 'B540', 'DMN', 'DPN'], brand: 'Diodes Inc' },
  // Bourns
  { prefixes: ['PTS', 'PTV', 'PDB', '3296', '3362', '3386'], brand: 'Bourns' },
  // Abracon
  { prefixes: ['ABM', 'ABLS', 'AISC'], brand: 'Abracon' },
  // Broadcom/AVAGO
  { prefixes: ['HSMP', 'MGA', 'ADA', 'HCPL', 'ACPL', 'HEDR', 'AFBR'], brand: 'Broadcom' },
  // TDK Lambda
  { prefixes: ['CCS', 'CFM', 'KAS'], brand: 'TDK Lambda' },
  // Lite-On
  { prefixes: ['LTST', 'LTL', 'LTV'], brand: 'Lite-On' },
  // Kingbright
  { prefixes: ['WP'], brand: 'Kingbright' },
];

// ============================================================================
// MPN -> CATEGORY + TYPE MAPPING (с расширенными спецификациями)
// ============================================================================

type EnrichPattern = {
  prefixes: string[];
  category: string;
  type: string;
  specs?: ComponentSpecs;
};

const ENRICH_PATTERNS: EnrichPattern[] = [
  // === МНОГОКАНАЛЬНЫЕ ПЕРЕКЛЮЧАТЕЛИ ПИТАНИЯ (Load Switches, PMIC) ===
  {
    prefixes: ['TPS229'],
    category: 'Микросхемы управления питанием (PMIC)',
    type: 'Переключатель питания под нагрузкой (Load Switch)',
    specs: {
      'Тип': 'Load Switch',
      'Входное напряжение (V_in)': '1.4V — 5.5V',
      'Выходной ток (I_out)': '2A',
      'Корпус': 'DSBGA / WSON',
      'Сопротивление (R_on)': '≤ 60 мОм',
    },
  },
  {
    prefixes: ['TPS2291'],
    category: 'Микросхемы управления питанием (PMIC)',
    type: 'Переключатель питания под нагрузкой (Load Switch)',
    specs: {
      'Тип': 'Load Switch',
      'Входное напряжение (V_in)': '1.0V — 5.5V',
      'Выходной ток (I_out)': '0.5A',
      'Корпус': 'SOT-23',
    },
  },
  // === DC-DC ПРЕОБРАЗОВАТЕЛИ (Step-Down) ===
  {
    prefixes: ['TPS54', 'TPS62', 'TPS65', 'TPS67'],
    category: 'Импульсные стабилизаторы (DC-DC)',
    type: 'DC-DC преобразователь (Step-Down Buck)',
    specs: {
      'Тип': 'Buck (Step-Down)',
      'Входное напряжение (V_in)': '4.5V — 17V',
      'Выходной ток (I_out)': '1.5A — 5A',
      'Частота переключения': '500 кГц — 1.2 МГц',
      'КПД': 'до 95%',
    },
  },
  {
    prefixes: ['TPS61', 'TPS63', 'TPS64'],
    category: 'Импульсные стабилизаторы (DC-DC)',
    type: 'DC-DC преобразователь (Step-Up Boost)',
    specs: {
      'Тип': 'Boost (Step-Up)',
      'Входное напряжение (V_in)': '0.9V — 5.5V',
      'Выходной ток (I_out)': 'до 2A',
      'Частота переключения': '600 кГц — 2 МГц',
    },
  },
  // === LDO СТАБИЛИЗАТОРЫ ===
  {
    prefixes: ['TPS7A', 'TPS70', 'TPS71', 'TPS72', 'TPS73', 'TPS74', 'TPS75', 'TPS76', 'TPS79'],
    category: 'Линейные стабилизаторы (LDO)',
    type: 'LDO стабилизатор напряжения',
    specs: {
      'Тип': 'LDO (Low Dropout)',
      'Выходное напряжение (V_out)': '0.8V — 5.0V',
      'Выходной ток (I_out)': '0.15A — 3A',
      'Падение напряжения (V_drop)': '50 мВ — 500 мВ',
      'Точность': '±1% — ±3%',
    },
  },
  {
    prefixes: ['LM78'],
    category: 'Линейные стабилизаторы (LDO)',
    type: 'Линейный стабилизатор напряжения (положительный)',
    specs: {
      'Тип': 'Linear Regulator',
      'Выходное напряжение (V_out)': '5V / 6V / 8V / 9V / 12V / 15V / 18V / 24V',
      'Выходной ток (I_out)': '1A',
      'Входное напряжение (V_in)': 'до 35V',
      'Корпус': 'TO-220 / TO-252 (DPAK)',
    },
  },
  {
    prefixes: ['LM79'],
    category: 'Линейные стабилизаторы (LDO)',
    type: 'Линейный стабилизатор напряжения (отрицательный)',
    specs: {
      'Тип': 'Linear Regulator (Negative)',
      'Выходное напряжение (V_out)': '-5V / -12V / -15V',
      'Выходной ток (I_out)': '1A',
      'Корпус': 'TO-220',
    },
  },
  {
    prefixes: ['LM317', 'LM337'],
    category: 'Линейные стабилизаторы (LDO)',
    type: 'Регулируемый линейный стабилизатор',
    specs: {
      'Тип': 'Adjustable Linear Regulator',
      'Выходное напряжение (V_out)': '1.25V — 37V (регулируемое)',
      'Выходной ток (I_out)': '1.5A',
      'Корпус': 'TO-220 / TO-252 / SOT-223',
    },
  },
  {
    prefixes: ['LM1117', 'AMS1117'],
    category: 'Линейные стабилизаторы (LDO)',
    type: 'LDO стабилизатор напряжения',
    specs: {
      'Тип': 'LDO',
      'Выходное напряжение (V_out)': '1.8V / 2.5V / 3.3V / 5V (фикс. или регулируемое)',
      'Выходной ток (I_out)': '1A',
      'Падение напряжения (V_drop)': '1.2V',
      'Корпус': 'SOT-223',
    },
  },
  {
    prefixes: ['LM2596', 'LM2675', 'LM2678'],
    category: 'Импульсные стабилизаторы (DC-DC)',
    type: 'DC-DC преобразователь (Step-Down)',
    specs: {
      'Тип': 'Buck (Step-Down)',
      'Входное напряжение (V_in)': '4.5V — 40V',
      'Выходной ток (I_out)': '3A (LM2596) / 5A (LM2678)',
      'Частота переключения': '150 кГц',
      'КПД': 'до 90%',
      'Корпус': 'TO-220-5 / TO-263',
    },
  },
  {
    prefixes: ['MP1584', 'MP2161'],
    category: 'Импульсные стабилизаторы (DC-DC)',
    type: 'DC-DC преобразователь (Step-Down)',
    specs: {
      'Тип': 'Buck (Step-Down)',
      'Входное напряжение (V_in)': '4.5V — 28V',
      'Выходной ток (I_out)': '3A',
      'Частота переключения': '1.5 МГц',
      'Корпус': 'SOIC-8 / TSOT-23',
    },
  },
  // === ДАТЧИКИ ВЛАЖНОСТИ/ТЕМПЕРАТУРЫ ===
  {
    prefixes: ['SHT', 'STS', 'SHTC'],
    category: 'Датчики',
    type: 'Цифровой датчик влажности и температуры',
    specs: {
      'Тип': 'Humidity + Temperature Sensor',
      'Интерфейс': 'I2C',
      'Диапазон влажности (RH)': '0% — 100%',
      'Точность влажности': '±1.5% — ±3% RH',
      'Диапазон температуры': '-40°C — +125°C',
      'Точность температуры': '±0.2°C — ±0.3°C',
      'Напряжение питания (V_in)': '2.15V — 5.5V',
      'Корпус': 'DFN / SMD',
    },
  },
  {
    prefixes: ['BMP', 'BME'],
    category: 'Датчики',
    type: 'Цифровой датчик давления, температуры и влажности',
    specs: {
      'Тип': 'Barometric Pressure Sensor',
      'Интерфейс': 'I2C / SPI',
      'Диапазон давления': '300 — 1100 hPa',
      'Точность давления': '±1 hPa',
      'Диапазон температуры': '-40°C — +85°C',
      'Напряжение питания (V_in)': '1.7V — 3.6V',
      'Корпус': 'LGA / SMD',
    },
  },
  // === АКСЕЛЕРОМЕТРЫ / IMU ===
  {
    prefixes: ['ADXL'],
    category: 'Датчики',
    type: '3-осевой акселерометр',
    specs: {
      'Тип': '3-axis Accelerometer',
      'Интерфейс': 'I2C / SPI',
      'Диапазон измерения': '±2g / ±4g / ±8g / ±16g',
      'Разрешение': '10-bit — 13-bit',
      'Напряжение питания (V_in)': '2.0V — 3.6V',
      'Корпус': 'LGA / QFN',
    },
  },
  {
    prefixes: ['BMI', 'LSM6', 'ICM4'],
    category: 'Датчики',
    type: '3-осевой IMU (акселерометр + гироскоп)',
    specs: {
      'Тип': '6-axis IMU (Accelerometer + Gyroscope)',
      'Интерфейс': 'I2C / SPI',
      'Диапазон акселерометра': '±2g / ±4g / ±8g / ±16g',
      'Диапазон гироскопа': '±125 / ±250 / ±500 / ±1000 / ±2000 °/с',
      'Напряжение питания (V_in)': '1.7V — 3.6V',
      'Корпус': 'LGA / QFN',
    },
  },
  {
    prefixes: ['BNO'],
    category: 'Датчики',
    type: '9-осевой IMU-модуль (акселерометр + гироскоп + магнитометр)',
    specs: {
      'Тип': '9-axis IMU (Smart Sensor Hub)',
      'Интерфейс': 'I2C / UART',
      'Встроенный MCU': 'Cortex-M0',
      'Напряжение питания (V_in)': '2.5V — 5.5V',
      'Корпус': 'LGA',
    },
  },
  {
    prefixes: ['BMM'],
    category: 'Датчики',
    type: '3-осевой магнитометр',
    specs: {
      'Тип': '3-axis Magnetometer',
      'Интерфейс': 'I2C / SPI',
      'Диапазон измерения': '±1300 µT',
      'Напряжение питания (V_in)': '1.7V — 3.6V',
      'Корпус': 'LGA',
    },
  },
  // === ОПТИЧЕСКИЕ ДАТЧИКИ ===
  {
    prefixes: ['VEML'],
    category: 'Датчики',
    type: 'Цифровой датчик освещённости',
    specs: {
      'Тип': 'Ambient Light Sensor',
      'Интерфейс': 'I2C',
      'Диапазон освещённости': '0 — 65535 lux',
      'Напряжение питания (V_in)': '2.5V — 5.5V',
      'Корпус': 'SMD',
    },
  },
  // === ДАТЧИКИ ГАЗА ===
  {
    prefixes: ['SGP'],
    category: 'Датчики',
    type: 'Цифровой датчик качества воздуха (TVOC/eCO2)',
    specs: {
      'Тип': 'Air Quality Sensor (TVOC + eCO2)',
      'Интерфейс': 'I2C',
      'Тип газа': 'TVOC, CO2 (эквивалент), H2, Ethanol',
      'Напряжение питания (V_in)': '1.8V — 3.3V',
      'Корпус': 'DFN',
    },
  },
  // === МИКРОКОНТРОЛЛЕРЫ (STM32) ===
  {
    prefixes: ['STM32H7'],
    category: 'Микроконтроллеры',
    type: '32-разрядный микроконтроллер ARM Cortex-M7',
    specs: {
      'Ядро': 'ARM Cortex-M7',
      'Тактовая частота': 'до 480 МГц',
      'Flash-память': '128 КБ — 2 МБ',
      'SRAM': '4 КБ — 1 МБ',
      'Интерфейсы': 'SPI, I2C, UART, CAN, USB, Ethernet, SDIO',
      'Напряжение питания (V_in)': '1.62V — 3.6V',
      'Корпус': 'LQFP / UFBGA / TFBGA',
    },
  },
  {
    prefixes: ['STM32F7'],
    category: 'Микроконтроллеры',
    type: '32-разрядный микроконтроллер ARM Cortex-M7',
    specs: {
      'Ядро': 'ARM Cortex-M7',
      'Тактовая частота': 'до 216 МГц',
      'Flash-память': '256 КБ — 2 МБ',
      'SRAM': '128 КБ — 512 КБ',
      'Интерфейсы': 'SPI, I2C, UART, CAN, USB, Ethernet',
      'Напряжение питания (V_in)': '1.7V — 3.6V',
      'Корпус': 'LQFP / UFBGA',
    },
  },
  {
    prefixes: ['STM32F4'],
    category: 'Микроконтроллеры',
    type: '32-разрядный микроконтроллер ARM Cortex-M4',
    specs: {
      'Ядро': 'ARM Cortex-M4F',
      'Тактовая частота': 'до 180 МГц',
      'Flash-память': '256 КБ — 1 МБ',
      'SRAM': '128 КБ — 192 КБ',
      'Интерфейсы': 'SPI, I2C, UART, CAN, USB OTG',
      'Напряжение питания (V_in)': '1.7V — 3.6V',
      'Корпус': 'LQFP / UFBGA / WLCSP',
    },
  },
  {
    prefixes: ['STM32G4'],
    category: 'Микроконтроллеры',
    type: '32-разрядный микроконтроллер ARM Cortex-M4 (mixed-signal)',
    specs: {
      'Ядро': 'ARM Cortex-M4F',
      'Тактовая частота': 'до 170 МГц',
      'Flash-память': '128 КБ — 512 КБ',
      'SRAM': '32 КБ — 128 КБ',
      'Особенности': 'Op-Amp, Comparator, DAC, HRTIM',
      'Напряжение питания (V_in)': '1.7V — 3.6V',
      'Корпус': 'LQFP / UFBGA',
    },
  },
  {
    prefixes: ['STM32L4'],
    category: 'Микроконтроллеры',
    type: '32-разрядный микроконтроллер ARM Cortex-M4 (low-power)',
    specs: {
      'Ядро': 'ARM Cortex-M4F',
      'Тактовая частота': 'до 80 МГц',
      'Flash-память': '64 КБ — 1 МБ',
      'SRAM': '32 КБ — 320 КБ',
      'Особенности': 'Ultra-low power, LCD controller',
      'Напряжение питания (V_in)': '1.65V — 3.6V',
      'Корпус': 'LQFP / UFBGA / WLCSP',
    },
  },
  {
    prefixes: ['STM32F1'],
    category: 'Микроконтроллеры',
    type: '32-разрядный микроконтроллер ARM Cortex-M3',
    specs: {
      'Ядро': 'ARM Cortex-M3',
      'Тактовая частота': 'до 72 МГц',
      'Flash-память': '32 КБ — 1 МБ',
      'SRAM': '6 КБ — 96 КБ',
      'Интерфейсы': 'SPI, I2C, UART, CAN, USB',
      'Напряжение питания (V_in)': '2.0V — 3.6V',
      'Корпус': 'LQFP / UFQFPN',
    },
  },
  {
    prefixes: ['STM32F0'],
    category: 'Микроконтроллеры',
    type: '32-разрядный микроконтроллер ARM Cortex-M0',
    specs: {
      'Ядро': 'ARM Cortex-M0',
      'Тактовая частота': 'до 48 МГц',
      'Flash-память': '16 КБ — 256 КБ',
      'SRAM': '4 КБ — 32 КБ',
      'Напряжение питания (V_in)': '2.0V — 3.6V',
      'Корпус': 'LQFP / UFQFPN',
    },
  },
  {
    prefixes: ['STM32G0'],
    category: 'Микроконтроллеры',
    type: '32-разрядный микроконтроллер ARM Cortex-M0+',
    specs: {
      'Ядро': 'ARM Cortex-M0+',
      'Тактовая частота': 'до 64 МГц',
      'Flash-память': '8 КБ — 512 КБ',
      'SRAM': '8 КБ — 144 КБ',
      'Напряжение питания (V_in)': '1.7V — 3.6V',
      'Корпус': 'LQFP / UFQFPN',
    },
  },
  {
    prefixes: ['STM32L5'],
    category: 'Микроконтроллеры',
    type: '32-разрядный микроконтроллер ARM Cortex-M33 (TrustZone)',
    specs: {
      'Ядро': 'ARM Cortex-M33 (with TrustZone)',
      'Тактовая частота': 'до 110 МГц',
      'Flash-память': '256 КБ — 512 КБ',
      'SRAM': '128 КБ — 256 КБ',
      'Напряжение питания (V_in)': '1.65V — 3.6V',
      'Корпус': 'LQFP / UFBGA',
    },
  },
  {
    prefixes: ['STM32U5'],
    category: 'Микроконтроллеры',
    type: '32-разрядный микроконтроллер ARM Cortex-M33 (Ultra-low power)',
    specs: {
      'Ядро': 'ARM Cortex-M33',
      'Тактовая частота': 'до 160 МГц',
      'Flash-память': '256 КБ — 2 МБ',
      'SRAM': '128 КБ — 768 КБ',
      'Напряжение питания (V_in)': '1.6V — 3.6V',
      'Корпус': 'LQFP / UFBGA',
    },
  },
  {
    prefixes: ['STM32WB'],
    category: 'Микроконтроллеры',
    type: '32-разрядный микроконтроллер ARM Cortex-M4 + BLE',
    specs: {
      'Ядро': 'ARM Cortex-M4 + Cortex-M0+',
      'Тактовая частота': 'до 64 МГц',
      'Беспроводная связь': 'Bluetooth 5.0 LE, Zigbee, Thread',
      'Напряжение питания (V_in)': '1.7V — 3.6V',
      'Корпус': 'QFN / UFBGA',
    },
  },
  {
    prefixes: ['STM32WL'],
    category: 'Микроконтроллеры',
    type: '32-разрядный микроконтроллер ARM Cortex-M4 + LoRa',
    specs: {
      'Ядро': 'ARM Cortex-M4 + Cortex-M0+',
      'Тактовая частота': 'до 48 МГц',
      'Беспроводная связь': 'LoRa, Sub-GHz',
      'Напряжение питания (V_in)': '1.8V — 3.6V',
      'Корпус': 'QFN',
    },
  },
  {
    prefixes: ['STM8'],
    category: 'Микроконтроллеры',
    type: '8-разрядный микроконтроллер',
    specs: {
      'Ядро': 'ST7-совместимое 8-разрядное ядро',
      'Тактовая частота': 'до 24 МГц',
      'Flash-память': '4 КБ — 128 КБ',
      'SRAM': '1 КБ — 6 КБ',
      'Напряжение питания (V_in)': '2.95V — 5.5V',
      'Корпус': 'LQFP / SOIC / DIP',
    },
  },
  // === AVR (Atmel) ===
  {
    prefixes: ['ATmega'],
    category: 'Микроконтроллеры',
    type: '8-разрядный микроконтроллер AVR',
    specs: {
      'Ядро': 'AVR 8-bit',
      'Тактовая частота': 'до 20 МГц',
      'Flash-память': '4 КБ — 256 КБ',
      'SRAM': '512 Б — 16 КБ',
      'EEPROM': '256 Б — 4 КБ',
      'Напряжение питания (V_in)': '1.8V — 5.5V',
      'Корпус': 'DIP / TQFP / QFN / MLF',
    },
  },
  {
    prefixes: ['ATtiny'],
    category: 'Микроконтроллеры',
    type: '8-разрядный микроконтроллер AVR (Compact)',
    specs: {
      'Ядро': 'AVR 8-bit',
      'Тактовая частота': 'до 20 МГц',
      'Flash-память': '512 Б — 32 КБ',
      'SRAM': '32 Б — 4 КБ',
      'Напряжение питания (V_in)': '1.8V — 5.5V',
      'Корпус': 'DIP / SOIC / SOT-23',
    },
  },
  // === PIC ===
  {
    prefixes: ['PIC32'],
    category: 'Микроконтроллеры',
    type: '32-разрядный микроконтроллер MIPS',
    specs: {
      'Ядро': 'MIPS32 (M4K)',
      'Тактовая частота': 'до 200 МГц',
      'Flash-память': '32 КБ — 512 КБ',
      'SRAM': '8 КБ — 128 КБ',
      'Напряжение питания (V_in)': '2.3V — 3.6V',
      'Корпус': 'TQFP / QFN',
    },
  },
  {
    prefixes: ['PIC', 'dsPIC'],
    category: 'Микроконтроллеры',
    type: '16-разрядный микроконтроллер',
    specs: {
      'Ядро': 'PIC16/PIC18/dsPIC33',
      'Тактовая частота': 'до 70 МГц',
      'Flash-память': '7 КБ — 256 КБ',
      'SRAM': '256 Б — 16 КБ',
      'Напряжение питания (V_in)': '1.8V — 5.5V',
      'Корпус': 'DIP / SOIC / TQFP / QFN',
    },
  },
  // === ESP (Espressif) ===
  {
    prefixes: ['ESP32'],
    category: 'Микроконтроллеры',
    type: 'Wi-Fi/BLE микроконтроллер',
    specs: {
      'Ядро': 'Xtensa LX6 / LX7 (Dual-core)',
      'Тактовая частота': 'до 240 МГц',
      'Flash-память': '4 МБ — 16 МБ (внешняя)',
      'SRAM': '320 КБ — 512 КБ',
      'Беспроводная связь': 'Wi-Fi 802.11 b/g/n, Bluetooth 4.2/5.0',
      'Напряжение питания (V_in)': '2.7V — 3.6V',
      'Корпус': 'QFN / Module',
    },
  },
  {
    prefixes: ['ESP8266'],
    category: 'Микроконтроллеры',
    type: 'Wi-Fi микроконтроллер',
    specs: {
      'Ядро': 'Xtensa Diamond Standard 106Micro (32-bit)',
      'Тактовая частота': 'до 80 МГц',
      'Flash-память': '512 КБ — 16 МБ',
      'SRAM': '80 КБ',
      'Беспроводная связь': 'Wi-Fi 802.11 b/g/n',
      'Напряжение питания (V_in)': '2.5V — 3.6V',
      'Корпус': 'QFN',
    },
  },
  // === GD32 (GigaDevice) ===
  {
    prefixes: ['GD32'],
    category: 'Микроконтроллеры',
    type: '32-разрядный микроконтроллер ARM Cortex',
    specs: {
      'Ядро': 'ARM Cortex-M0/M3/M4/M23/M33',
      'Тактовая частота': 'до 108 МГц',
      'Flash-память': '16 КБ — 3 МБ',
      'SRAM': '4 КБ — 512 КБ',
      'Напряжение питания (V_in)': '1.8V — 3.6V',
      'Корпус': 'LQFP / QFN',
    },
  },
  // === CH32 (WCH) ===
  {
    prefixes: ['CH32'],
    category: 'Микроконтроллеры',
    type: '32-разрядный микроконтроллер RISC-V',
    specs: {
      'Ядро': 'RISC-V RV32IMAC',
      'Тактовая частота': 'до 144 МГц',
      'Flash-память': '16 КБ — 256 КБ',
      'SRAM': '4 КБ — 64 КБ',
      'Напряжение питания (V_in)': '2.4V — 3.6V',
      'Корпус': 'LQFP / QFN',
    },
  },
  {
    prefixes: ['CH340', 'CH341'],
    category: 'Интерфейсы',
    type: 'USB-UART преобразователь',
    specs: {
      'Тип': 'USB-UART Bridge',
      'Интерфейс': 'USB 2.0 Full Speed',
      'Скорость UART': 'до 2 Мбит/с',
      'Напряжение питания (V_in)': '3.3V — 5V',
      'Корпус': 'SOIC-16',
    },
  },
  // === HK32 ===
  {
    prefixes: ['HK32'],
    category: 'Микроконтроллеры',
    type: '32-разрядный микроконтроллер ARM Cortex',
    specs: {
      'Ядро': 'ARM Cortex-M0/M3',
      'Тактовая частота': 'до 72 МГц',
      'Flash-память': '16 КБ — 512 КБ',
      'SRAM': '4 КБ — 64 КБ',
      'Напряжение питания (V_in)': '2.0V — 3.6V',
      'Корпус': 'LQFP / QFN',
    },
  },
  // === ДАТЧИКИ ТОКА (TI INA) ===
  {
    prefixes: ['INA'],
    category: 'Аналоговая электроника',
    type: 'Датчик тока и напряжения',
    specs: {
      'Тип': 'Current/Voltage Sense',
      'Интерфейс': 'I2C / Analog',
      'Диапазон напряжения': '0V — 26V / 36V',
      'Точность': '±0.5% — ±1%',
      'Напряжение питания (V_in)': '2.7V — 5.5V',
      'Корпус': 'MSOP / SOIC / QFN',
    },
  },
  // === ADC/DAC ===
  {
    prefixes: ['ADS'],
    category: 'АЦП/ЦАП',
    type: 'АЦП (аналого-цифровой преобразователь)',
    specs: {
      'Тип': 'ADC',
      'Разрешение': '12-bit — 24-bit',
      'Частота дискретизации': 'до 4 MSPS',
      'Интерфейс': 'SPI / I2C',
      'Напряжение питания (V_in)': '2.7V — 5.5V',
      'Корпус': 'SOIC / TSSOP / QFN',
    },
  },
  {
    prefixes: ['DAC'],
    category: 'АЦП/ЦАП',
    type: 'ЦАП (цифро-аналоговый преобразователь)',
    specs: {
      'Тип': 'DAC',
      'Разрешение': '8-bit — 16-bit',
      'Частота обновления': 'до 1 MSPS',
      'Интерфейс': 'SPI / I2C / Parallel',
      'Напряжение питания (V_in)': '2.7V — 5.5V',
      'Корпус': 'SOIC / TSSOP / QFN',
    },
  },
  {
    prefixes: ['MCP320', 'MCP330', 'MCP342'],
    category: 'АЦП/ЦАП',
    type: 'АЦП (аналого-цифровой преобразователь)',
    specs: {
      'Тип': 'ADC (SAR)',
      'Разрешение': '12-bit — 18-bit',
      'Частота дискретизации': 'до 100 kSPS',
      'Интерфейс': 'SPI / I2C',
      'Напряжение питания (V_in)': '2.7V — 5.5V',
      'Корпус': 'DIP / SOIC / TSSOP',
    },
  },
  {
    prefixes: ['MCP472', 'MCP492'],
    category: 'АЦП/ЦАП',
    type: 'ЦАП (цифро-аналоговый преобразователь)',
    specs: {
      'Тип': 'DAC',
      'Разрешение': '12-bit',
      'Интерфейс': 'SPI / I2C',
      'Напряжение питания (V_in)': '2.7V — 5.5V',
      'Корпус': 'DIP / SOIC / TSSOP',
    },
  },
  // === ОПЕРАЦИОННЫЕ УСИЛИТЕЛИ ===
  {
    prefixes: ['OPA', 'OP07', 'AD8', 'AD7'],
    category: 'Операционные усилители',
    type: 'Операционный усилитель',
    specs: {
      'Тип': 'Op-Amp',
      'Питание': 'Single / Dual',
      'Напряжение питания (V_in)': '±2.5V — ±18V',
      'GBW': '1 МГц — 50 МГц',
      'Корпус': 'SOIC / TSSOP / DIP',
    },
  },
  {
    prefixes: ['NE5532', 'NE5534'],
    category: 'Операционные усилители',
    type: 'Малошумящий операционный усилитель (двойной)',
    specs: {
      'Тип': 'Low-Noise Dual Op-Amp',
      'Напряжение питания (V_in)': '±3V — ±20V',
      'GBW': '10 МГц',
      'Шум (input)': '5 nV/√Hz',
      'Корпус': 'DIP-8 / SOIC-8',
    },
  },
  {
    prefixes: ['LM358', 'LM324', 'LM2904', 'LM224'],
    category: 'Операционные усилители',
    type: 'Операционный усилитель (двойной/счетверённый)',
    specs: {
      'Тип': 'Dual/Quad Op-Amp',
      'Напряжение питания (V_in)': '3V — 32V (single) / ±1.5V — ±16V (dual)',
      'GBW': '~1 МГц',
      'Корпус': 'DIP-8 / SOIC-8 / TSSOP',
    },
  },
  {
    prefixes: ['TL072', 'TL082', 'TL062'],
    category: 'Операционные усилители',
    type: 'Операционный усилитель с JFET-входом',
    specs: {
      'Тип': 'JFET-input Dual Op-Amp',
      'Напряжение питания (V_in)': '±3V — ±18V',
      'GBW': '3 МГц',
      'Входной ток': '65 pA (typ.)',
      'Корпус': 'DIP-8 / SOIC-8',
    },
  },
  // === ТРАНЗИСТОРЫ (MOSFET) ===
  {
    prefixes: ['IRF', 'IRL', 'IRFP'],
    category: 'Транзисторы',
    type: 'N-channel MOSFET транзистор',
    specs: {
      'Тип': 'N-channel Power MOSFET',
      'V_DS (макс)': '55V — 600V',
      'I_D (макс)': '10A — 100A',
      'R_DS(on)': '5 мОм — 200 мОм',
      'V_GS (gate threshold)': '2V — 4V',
      'Корпус': 'TO-220 / TO-247 / TO-252 (DPAK)',
    },
  },
  {
    prefixes: ['IRG', 'IGBT'],
    category: 'Транзисторы',
    type: 'IGBT транзистор',
    specs: {
      'Тип': 'IGBT (Insulated Gate Bipolar Transistor)',
      'V_CE (макс)': '600V — 1200V',
      'I_C (макс)': '10A — 100A',
      'V_CE(sat)': '1.5V — 3.0V',
      'Корпус': 'TO-220 / TO-247',
    },
  },
  {
    prefixes: ['2N7002', '2N7000'],
    category: 'Транзисторы',
    type: 'N-channel MOSFET транзистор (малосигнальный)',
    specs: {
      'Тип': 'N-channel Small-Signal MOSFET',
      'V_DS (макс)': '60V',
      'I_D (макс)': '0.2A — 0.4A',
      'R_DS(on)': '1.8 Ω — 5 Ω',
      'Корпус': 'SOT-23 / TO-92',
    },
  },
  {
    prefixes: ['BC847', 'BC547', 'BC557', 'BC327', 'BC337'],
    category: 'Транзисторы',
    type: 'Биполярный транзистор (NPN/PNP)',
    specs: {
      'Тип': 'Bipolar Junction Transistor (BJT)',
      'V_CE (макс)': '45V',
      'I_C (макс)': '100 mA',
      'h_FE': '110 — 800',
      'Корпус': 'SOT-23 / TO-92',
    },
  },
  // === ПАМЯТЬ (Memory) ===
  {
    prefixes: ['W25Q', 'W25X'],
    category: 'Память',
    type: 'NOR Flash-память',
    specs: {
      'Тип': 'Serial NOR Flash',
      'Интерфейс': 'SPI (4-wire)',
      'Объём': '512 КБ — 256 МБ',
      'Напряжение питания (V_in)': '2.7V — 3.6V',
      'Корпус': 'SOIC-8 / WSON / USON',
    },
  },
  {
    prefixes: ['24LC', '24AA', '24C'],
    category: 'Память',
    type: 'EEPROM память (I2C)',
    specs: {
      'Тип': 'Serial EEPROM',
      'Интерфейс': 'I2C',
      'Объём': '128 бит — 1 Мбит',
      'Напряжение питания (V_in)': '1.7V — 5.5V',
      'Корпус': 'DIP / SOIC / TSSOP / TSSOP',
    },
  },
  {
    prefixes: ['FM24'],
    category: 'Память',
    type: 'FRAM память (Ferroelectric RAM)',
    specs: {
      'Тип': 'FRAM (Ferroelectric RAM)',
      'Интерфейс': 'SPI / I2C',
      'Объём': '4 Кбит — 4 Мбит',
      'Напряжение питания (V_in)': '2.0V — 5.5V',
      'Корпус': 'SOIC / TSSOP / DFN',
    },
  },
  {
    prefixes: ['IS62', 'IS64'],
    category: 'Память',
    type: 'SRAM память',
    specs: {
      'Тип': 'Static RAM (SRAM)',
      'Объём': '1 Мбит — 64 Мбит',
      'Время доступа': '8 ns — 55 ns',
      'Напряжение питания (V_in)': '2.7V — 5.5V',
      'Корпус': 'SOIC / TSOP / BGA',
    },
  },
  {
    prefixes: ['MT47', 'MT41', 'H5T'],
    category: 'Память',
    type: 'DRAM память (DDR)',
    specs: {
      'Тип': 'DDR3 / DDR4 SDRAM',
      'Объём': '256 МБ — 16 ГБ',
      'Частота': '800 MT/s — 3200 MT/s',
      'Напряжение питания (V_in)': '1.2V — 1.5V',
      'Корпус': 'BGA',
    },
  },
  // === ИНТЕРФЕЙСЫ (USB, RS-485, CAN) ===
  {
    prefixes: ['FT232'],
    category: 'Интерфейсы',
    type: 'USB-UART преобразователь',
    specs: {
      'Тип': 'USB-to-UART Bridge',
      'Интерфейс': 'USB 2.0 Full Speed',
      'Скорость UART': 'до 3 Мбит/с',
      'Напряжение питания (V_in)': '3.3V — 5V',
      'Корпус': 'SSOP-28 / QFN-32',
    },
  },
  {
    prefixes: ['FT2232'],
    category: 'Интерфейсы',
    type: 'USB-UART/FIFO преобразователь (двухканальный)',
    specs: {
      'Тип': 'Dual-channel USB-to-UART/FIFO',
      'Интерфейс': 'USB 2.0 Hi-Speed',
      'Скорость': 'до 6 Мбит/с',
      'Напряжение питания (V_in)': '3.3V — 5V',
      'Корпус': 'SSOP-48 / LQFP-48',
    },
  },
  {
    prefixes: ['FT4232'],
    category: 'Интерфейсы',
    type: 'USB-UART/FIFO преобразователь (четырёхканальный)',
    specs: {
      'Тип': 'Quad-channel USB-to-UART/FIFO',
      'Интерфейс': 'USB 2.0 Hi-Speed',
      'Скорость': 'до 12 Мбит/с',
      'Напряжение питания (V_in)': '3.3V — 5V',
      'Корпус': 'LQFP-48 / QFN-48',
    },
  },
  {
    prefixes: ['MAX485', 'SP3485', 'ST3485'],
    category: 'Интерфейсы',
    type: 'RS-485 трансивер',
    specs: {
      'Тип': 'RS-485 Transceiver',
      'Скорость': 'до 10 Мбит/с',
      'Напряжение питания (V_in)': '3.3V — 5V',
      'Узлов на шине': 'до 32',
      'Корпус': 'SOIC-8 / DIP-8',
    },
  },
  {
    prefixes: ['MAX232', 'ST3232'],
    category: 'Интерфейсы',
    type: 'RS-232 трансивер',
    specs: {
      'Тип': 'RS-232 Transceiver',
      'Драйверов/приёмников': '2 / 2',
      'Напряжение питания (V_in)': '3.3V — 5V',
      'Зарядовый насос': 'встроенная (для ±12V)',
      'Корпус': 'SOIC-16 / DIP-16',
    },
  },
  {
    prefixes: ['MCP2551', 'TJA1050', 'SN65HVD'],
    category: 'Интерфейсы',
    type: 'CAN-трансивер',
    specs: {
      'Тип': 'CAN Transceiver',
      'Стандарт': 'ISO 11898',
      'Скорость': 'до 1 Мбит/с',
      'Напряжение питания (V_in)': '4.5V — 5.5V',
      'Корпус': 'SOIC-8 / DIP-8',
    },
  },
  {
    prefixes: ['LAN8720', 'DP83848', 'KSZ8081', 'RTL8211'],
    category: 'Интерфейсы',
    type: 'Ethernet PHY',
    specs: {
      'Тип': 'Ethernet PHY',
      'Скорость': '10/100 Mbps',
      'Интерфейс': 'MII / RMII',
      'Напряжение питания (V_in)': '1.6V — 3.6V',
      'Корпус': 'QFN-24 / QFP-48',
    },
  },
  {
    prefixes: ['W5500'],
    category: 'Интерфейсы',
    type: 'Ethernet-контроллер (TCP/IP hardware stack)',
    specs: {
      'Тип': 'Hardwired TCP/IP Ethernet Controller',
      'Скорость': '10/100 Mbps',
      'Сокетов': '8 (аппаратных)',
      'Интерфейс': 'SPI',
      'Напряжение питания (V_in)': '3.3V',
      'Корпус': 'LQFP-48',
    },
  },
  // === БЕСПРОВОДНЫЕ МОДУЛИ ===
  {
    prefixes: ['nRF24', 'NRF24'],
    category: 'Телекоммуникации',
    type: 'Радиомодуль 2.4 ГГц',
    specs: {
      'Тип': '2.4 GHz RF Transceiver',
      'Частота': '2.400 — 2.525 ГГц',
      'Скорость': 'до 2 Мбит/с',
      'Интерфейс': 'SPI',
      'Напряжение питания (V_in)': '1.9V — 3.6V',
      'Корпус': 'QFN-20',
    },
  },
  {
    prefixes: ['SX1278', 'SX1262'],
    category: 'Телекоммуникации',
    type: 'LoRa-трансивер',
    specs: {
      'Тип': 'LoRa Transceiver (Sub-GHz)',
      'Частота': '137 — 1020 МГц',
      'Чувствительность': 'до -148 dBm',
      'Дальность': 'до 15 км (LoS)',
      'Интерфейс': 'SPI',
      'Напряжение питания (V_in)': '1.8V — 3.7V',
      'Корпус': 'QFN-32',
    },
  },
  {
    prefixes: ['SIM800'],
    category: 'Телекоммуникации',
    type: 'GSM/GPRS модуль',
    specs: {
      'Тип': 'GSM/GPRS Module',
      'Стандарт': '2G (GSM/GPRS)',
      'Скорость': 'до 85.6 кбит/с',
      'Напряжение питания (V_in)': '3.4V — 4.4V',
      'Корпус': 'Module',
    },
  },
  {
    prefixes: ['SIM7600'],
    category: 'Телекоммуникации',
    type: '4G LTE модуль',
    specs: {
      'Тип': '4G LTE Module',
      'Стандарт': 'LTE Cat-4 / Cat-1',
      'Скорость': 'до 50 Мбит/с (uplink) / 150 Мбит/с (downlink)',
      'Напряжение питания (V_in)': '3.4V — 4.4V',
      'Корпус': 'Module',
    },
  },
  // === ПЛИС (FPGA) ===
  {
    prefixes: ['XC7Z', 'XC7K', 'XC7A', 'XC7S'],
    category: 'ПЛИС (FPGA)',
    type: 'FPGA (Artix/Kintex/Zynq-7)',
    specs: {
      'Семейство': '7-Series (Artix/Kintex/Zynq)',
      'Техпроцесс': '28 нм',
      'LUT': '6K — 478K (зависит от модели)',
      'DSP-блоки': 'до 1920',
      'BRAM': 'до 34 Мбит',
      'Напряжение питания (V_in)': '1.0V (core)',
      'Корпус': 'BGA',
    },
  },
  {
    prefixes: ['XC6S', 'XC6V'],
    category: 'ПЛИС (FPGA)',
    type: 'FPGA (Spartan-6/Vertex-6)',
    specs: {
      'Семейство': '6-Series (Spartan/Vertex)',
      'Техпроцесс': '45 нм',
      'LUT': '3K — 758K',
      'Напряжение питания (V_in)': '1.2V (core)',
      'Корпус': 'BGA',
    },
  },
  {
    prefixes: ['EP2C', 'EP4CE'],
    category: 'ПЛИС (FPGA)',
    type: 'FPGA (Cyclone II/IV)',
    specs: {
      'Семейство': 'Cyclone (Intel/Altera)',
      'LUT': '4K — 150K',
      'Напряжение питания (V_in)': '1.2V (core)',
      'Корпус': 'TQFP / BGA',
    },
  },
  {
    prefixes: ['ICE40'],
    category: 'ПЛИС (FPGA)',
    type: 'FPGA (iCE40)',
    specs: {
      'Семейство': 'iCE40 (Lattice)',
      'LUT': '384 — 8K',
      'Напряжение питания (V_in)': '1.2V (core)',
      'Корпус': 'QFN / BGA',
    },
  },
  {
    prefixes: ['GW1N'],
    category: 'ПЛИС (FPGA)',
    type: 'FPGA (Gowin)',
    specs: {
      'Семейство': 'Gowin Arora',
      'LUT': '576 — 50K',
      'Напряжение питания (V_in)': '1.2V (core)',
      'Корпус': 'QFN / BGA',
    },
  },
  // === ЛОГИКА ===
  {
    prefixes: ['74HC', '74HCT'],
    category: 'Логика',
    type: 'Логическая микросхема (CMOS)',
    specs: {
      'Семейство': '74HC/74HCT (High-Speed CMOS)',
      'Напряжение питания (V_in)': '2V — 6V (HC) / 4.5V — 5.5V (HCT)',
      'Время задержки': '~10 нс',
      'Корпус': 'DIP / SOIC / TSSOP',
    },
  },
  {
    prefixes: ['74LVC', '74AHC', '74ALVC'],
    category: 'Логика',
    type: 'Логическая микросхема (advanced CMOS)',
    specs: {
      'Семейство': '74LVC/74AHC (Advanced CMOS)',
      'Напряжение питания (V_in)': '1.2V — 5.5V',
      'Время задержки': '~5 нс',
      'Корпус': 'SOIC / TSSOP',
    },
  },
  {
    prefixes: ['74LS', '74ALS'],
    category: 'Логика',
    type: 'Логическая микросхема (TTL)',
    specs: {
      'Семейство': '74LS/74ALS (TTL)',
      'Напряжение питания (V_in)': '4.75V — 5.25V',
      'Время задержки': '~10 нс',
      'Корпус': 'DIP / SOIC',
    },
  },
  {
    prefixes: ['CD40', 'CD45'],
    category: 'Логика',
    type: 'Логическая микросхема (CMOS 4000 series)',
    specs: {
      'Семейство': 'CD4000 (CMOS 4000)',
      'Напряжение питания (V_in)': '3V — 18V',
      'Время задержки': '~50 нс',
      'Корпус': 'DIP / SOIC',
    },
  },
  // === RTC (Часы реального времени) ===
  {
    prefixes: ['DS1307', 'DS3231', 'PCF8563'],
    category: 'Кварцы и резонаторы',
    type: 'Часы реального времени (RTC)',
    specs: {
      'Тип': 'Real-Time Clock (RTC)',
      'Интерфейс': 'I2C',
      'Точность': '±2 ppm (DS3231 TCXO)',
      'Напряжение питания (V_in)': '1.8V — 5.5V',
      'Резерв (батарея)': 'CR2032 / Super Cap',
      'Корпус': 'DIP / SOIC',
    },
  },
  {
    prefixes: ['ABM', 'ABLS'],
    category: 'Кварцы и резонаторы',
    type: 'Кварцевый резонатор',
    specs: {
      'Тип': 'Crystal Resonator',
      'Частота': '8 МГц — 50 МГц',
      'Точность': '±10 — ±50 ppm',
      'Нагрузочная ёмкость': '12 пФ — 22 пФ',
      'Корпус': 'SMD / DIP',
    },
  },
  // === ДИОДЫ / СТАБИЛИТРОНЫ ===
  {
    prefixes: ['SMAJ', 'SMBJ', 'SMCJ'],
    category: 'Диоды',
    type: 'TVS-диод (защита от перенапряжения)',
    specs: {
      'Тип': 'TVS Diode (Transient Voltage Suppressor)',
      'V_BR (breakdown)': '5V — 440V',
      'P_peak (импульсная)': '400W — 1500W',
      'Корпус': 'SMA / SMB / SMC',
    },
  },
  {
    prefixes: ['P6KE', '1.5KE'],
    category: 'Диоды',
    type: 'TVS-диод (силовой)',
    specs: {
      'Тип': 'Power TVS Diode',
      'V_BR (breakdown)': '5V — 440V',
      'P_peak (импульсная)': '600W / 1500W',
      'Корпус': 'DO-201 / SMC',
    },
  },
  {
    prefixes: ['BZX55'],
    category: 'Диоды',
    type: 'Стабилитрон (Zener diode)',
    specs: {
      'Тип': 'Zener Diode',
      'V_Z (напряжение стабилизации)': '2.4V — 75V',
      'P (мощность рассеяния)': '0.5 Вт',
      'V_Z tolerance': '±5% (BZX55C) / ±2% (BZX55B)',
      'Корпус': 'DO-35',
    },
  },
  {
    prefixes: ['1N47'],
    category: 'Диоды',
    type: 'Стабилитрон (Zener diode)',
    specs: {
      'Тип': 'Zener Diode',
      'V_Z (напряжение стабилизации)': '3.3V — 100V',
      'P (мощность рассеяния)': '1 Вт',
      'Корпус': 'DO-41',
    },
  },
  {
    prefixes: ['1N400'],
    category: 'Диоды',
    type: 'Выпрямительный диод',
    specs: {
      'Тип': 'General Purpose Rectifier Diode',
      'V_R (обратное напряжение)': '50V — 1000V',
      'I_F (средний прямой ток)': '1A',
      'V_F (прямое падение)': '1.1V',
      'Корпус': 'DO-41',
    },
  },
  {
    prefixes: ['1N540'],
    category: 'Диоды',
    type: 'Выпрямительный диод (3А)',
    specs: {
      'Тип': 'General Purpose Rectifier Diode',
      'V_R (обратное напряжение)': '50V — 1000V',
      'I_F (средний прямой ток)': '3A',
      'V_F (прямое падение)': '1.2V',
      'Корпус': 'DO-201AD',
    },
  },
  {
    prefixes: ['1N4148', '1N914'],
    category: 'Диоды',
    type: 'Импульсный диод',
    specs: {
      'Тип': 'Fast Switching Diode',
      'V_R (обратное напряжение)': '100V',
      'I_F (прямой ток)': '0.3A',
      'Время восстановления': '4 нс',
      'Корпус': 'DO-35 / SOD-123',
    },
  },
  {
    prefixes: ['SS', 'B340', 'B540'],
    category: 'Диоды',
    type: 'Диод Шоттки',
    specs: {
      'Тип': 'Schottky Diode',
      'V_R (обратное напряжение)': '20V — 100V',
      'I_F (прямой ток)': '1A — 5A',
      'V_F (прямое падение)': '0.5V — 0.8V',
      'Корпус': 'SMA / SMB / SMC',
    },
  },
  {
    prefixes: ['GBU', 'GBJ', 'KBP', 'KBU'],
    category: 'Диоды',
    type: 'Диодный мост',
    specs: {
      'Тип': 'Bridge Rectifier',
      'V_R (обратное напряжение)': '50V — 1000V',
      'I_F (средний ток)': '1A — 35A',
      'Корпус': 'GBU / GBJ / KBP / KBU',
    },
  },
  // === КЕРАМИЧЕСКИЕ КОНДЕНСАТОРЫ (MLCC) ===
  {
    prefixes: ['GRM'],
    category: 'Конденсаторы',
    type: 'Керамический чип-конденсатор (MLCC)',
    specs: {
      'Тип': 'MLCC (Multi-Layer Ceramic Capacitor)',
      'Производитель': 'Murata',
      'Корпус': '0201 / 0402 / 0603 / 0805 / 1206',
      'Диэлектрик': 'NP0 / X7R / X5R / Y5V',
      'Температурный диапазон': '-55°C — +125°C (X7R)',
    },
  },
  {
    prefixes: ['CL'],
    category: 'Конденсаторы',
    type: 'Керамический чип-конденсатор (MLCC)',
    specs: {
      'Тип': 'MLCC (Multi-Layer Ceramic Capacitor)',
      'Производитель': 'Samsung Electro-Mechanics',
      'Корпус': '0201 / 0402 / 0603 / 0805 / 1206',
      'Диэлектрик': 'NP0 / X7R / X5R',
    },
  },
  {
    prefixes: ['C0603', 'C0805', 'C1206', 'C1005', 'C1608', 'C2012', 'C3216'],
    category: 'Конденсаторы',
    type: 'Керамический чип-конденсатор (MLCC)',
    specs: {
      'Тип': 'MLCC (Multi-Layer Ceramic Capacitor)',
      'Производитель': 'TDK',
      'Корпус': '0201 / 0402 / 0603 / 0805 / 1206',
      'Диэлектрик': 'NP0 / X7R / X5R',
    },
  },
];

// ============================================================================
// ФУНКЦИИ
// ============================================================================

/**
 * Определяет реальный бренд по MPN (артикулу).
 * Если паттерн не найден — возвращает dbBrand (если не пустой) или 'Unknown'.
 */
export function detectBrandByMpn(sku: string, dbBrand?: string | null): string {
  const skuUpper = sku.toUpperCase();
  for (const pattern of BRAND_PATTERNS) {
    for (const prefix of pattern.prefixes) {
      if (skuUpper.startsWith(prefix.toUpperCase())) {
        return pattern.brand;
      }
    }
  }
  const cleaned = (dbBrand || '').trim();
  return cleaned || 'Unknown';
}

/**
 * Находит enrichment-паттерн по MPN (для категории + типа + спецификаций).
 * Возвращает null если паттерн не найден.
 */
function findEnrichPattern(sku: string): EnrichPattern | null {
  const skuUpper = sku.toUpperCase();
  for (const pattern of ENRICH_PATTERNS) {
    for (const prefix of pattern.prefixes) {
      if (skuUpper.startsWith(prefix.toUpperCase())) {
        return pattern;
      }
    }
  }
  return null;
}

/**
 * Главная функция обогащения: вычисляет category, type, brand, package, specs, description.
 *
 * @param sku MPN компонента
 * @param dbBrand Бренд из БД (может содержать ошибки — приоритет MPN)
 * @param dbCategory Категория из БД
 * @param dbName Название из БД (может содержать грязный бренд)
 * @param dbAttributes JSONB attributes из БД
 * @returns EnrichedComponent — единый источник истины
 */
export function enrichComponent(
  sku: string,
  dbBrand?: string | null,
  dbCategory?: string | null,
  dbName?: string | null,
  dbAttributes?: Record<string, string | number> | null,
): EnrichedComponent {
  const brand = detectBrandByMpn(sku, dbBrand);
  const enrichPattern = findEnrichPattern(sku);

  // Если есть enrichment-паттерн — используем его категорию, тип, корпус
  const category = enrichPattern?.category
    || dbCategory
    || 'Электронные компоненты';
  const type = enrichPattern?.type
    || 'Электронный компонент';
  const pkg = enrichPattern?.specs?.['Корпус']
    || extractPackageFromAttributes(dbAttributes)
    || '';

  // === SPECS ===
  // Начинаем с шаблона из enrichPattern, затем дополняем/перебиваем данными из БД
  const specs: ComponentSpecs = {};
  if (enrichPattern?.specs) {
    Object.assign(specs, enrichPattern.specs);
  }

  // Дополняем specs из attributes БД (если они точнее)
  if (dbAttributes) {
    for (const [key, value] of Object.entries(dbAttributes)) {
      const cleanKey = key.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
      const cleanValue = String(value).trim();
      // Пропускаем служебные ключи
      if (['бренд', 'артикул', 'производитель', 'семейство', 'номенклатурный номер'].includes(key.toLowerCase())) {
        continue;
      }
      // Пропускаем диапазоны с тире (4–192, 8–24 и т.д.) — оставляем только точные
      if (/\d+\s*[–-]\s*\d+/.test(cleanValue) && !cleanValue.includes('V') && !cleanValue.includes('A')) {
        continue;
      }
      // Пропускаем значения "(тип.)" и "(зависит от)"
      if (cleanValue.includes('зависит') || cleanValue.includes('тип.')) {
        continue;
      }
      if (cleanValue && cleanValue !== '—' && cleanValue !== '-') {
        specs[cleanKey] = cleanValue;
      }
    }
  }

  // === DESCRIPTION ===
  // Формируем SEO-описание на основе вычисленных параметров
  // Конвертируем значения specs в строки (некоторые поля могут быть number)
  const stringSpecs: Record<string, string> = {};
  for (const [k, v] of Object.entries(specs)) {
    stringSpecs[k] = typeof v === 'number' ? String(v) : v;
  }
  const description = buildDescription(sku, brand, type, category, pkg, stringSpecs);

  return {
    category,
    type,
    brand,
    package: pkg,
    specs,
    description,
    isEnriched: !!enrichPattern,
  };
}

/**
 * Извлекает корпус из attributes (БД).
 * Ищет по ключам: 'корпус', 'пакет', 'package', 'тип_корпуса', 'тип_монтажа'.
 */
function extractPackageFromAttributes(attrs?: Record<string, string | number> | null): string {
  if (!attrs) return '';
  const packageKeys = ['корпус', 'пакет', 'package', 'тип_корпуса', 'тип_монтажа'];
  for (const key of Object.keys(attrs)) {
    const lower = key.toLowerCase();
    if (packageKeys.some(pk => lower.includes(pk))) {
      const val = String(attrs[key]).trim();
      if (val && val !== '—' && val !== '-') return val;
    }
  }
  return '';
}

/**
 * Формирует SEO-описание на основе вычисленных параметров.
 *
 * Пример:
 *   "SHT30-O3 — Цифровой датчик влажности и температуры от Sensirion.
 *    Интерфейс: I2C. Диапазон влажности (RH): 0% — 100%. Точность влажности: ±1.5% — ±3% RH.
 *    Корпус: DFN / SMD. Применяется в промышленной электронике и B2B-проектах."
 */
function buildDescription(
  sku: string,
  brand: string,
  type: string,
  _category: string,
  pkg: string,
  specs: ComponentSpecs,
): string {
  const parts: string[] = [];

  // Вступление
  parts.push(`${type} ${sku} от ${brand}.`);

  // Ключевые технические параметры (первые 3-4)
  const importantKeys = [
    'Интерфейс',
    'Напряжение питания (V_in)',
    'Выходное напряжение (V_out)',
    'Входное напряжение (V_in)',
    'Выходной ток (I_out)',
    'Диапазон температуры',
    'Диапазон влажности (RH)',
    'Ядро',
    'Тактовая частота',
    'Flash-память',
    'SRAM',
    'V_Z (напряжение стабилизации)',
    'V_DS (макс)',
    'R_DS(on)',
    'Объём',
    'Частота',
    'Семейство',
    'V_R (обратное напряжение)',
    'I_F (прямой ток)',
  ];

  const selectedSpecs: string[] = [];
  for (const key of importantKeys) {
    if (specs[key]) {
      selectedSpecs.push(`${key}: ${specs[key]}`);
    }
    if (selectedSpecs.length >= 4) break;
  }

  if (pkg) {
    selectedSpecs.push(`Корпус: ${pkg}`);
  }

  if (selectedSpecs.length > 0) {
    parts.push(selectedSpecs.join('. ') + '.');
  }

  // Финал
  parts.push('Применяется в промышленной электронике и B2B-проектах.');

  return parts.join(' ');
}

/**
 * Быстрая проверка — поддерживается ли MPN в enricher.
 * Используется для отладки и для принятия решения вызывать enricher или нет.
 */
export function isMpnSupported(sku: string): boolean {
  return findEnrichPattern(sku) !== null;
}

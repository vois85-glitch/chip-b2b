/**
 * Hub Authority Data — structured data for topical hub pages
 * Used by [slug]/page.tsx to render enhanced hub sections
 */

export type HubKey = 'arm-kontrollery' | 'fpga' | 'texas-instruments' | 'xilinx' | 'stmicroelectronics';

export interface HubEcosystemItem {
  name: string;
  type: 'mcu' | 'fpga' | 'analog' | 'power' | 'sensor';
  href: string;
}

export interface HubCompatibilityRow {
  original: string;
  analog: string;
  compatibility: 'pin-to-pin' | 'functional' | 'parametric';
  score: number;
  href: string;
}

export interface HubDirectAnswer {
  question: string;
  answer: string;
  specs: { label: string; value: string }[];
  alternatives: { name: string; href: string }[];
}

export interface HubUrgency {
  level: 'high' | 'medium' | 'low';
  message: string;
}

export interface HubProcurement {
  category: string;
  urgency: 'standard' | 'urgent' | 'critical';
  recommendations: string[];
}

export interface HubData {
  hubKey: HubKey;
  ecosystemType: 'stm32' | 'fpga' | 'ti' | 'xilinx';
  ecosystemItems: HubEcosystemItem[];
  compatibilityRows: HubCompatibilityRow[];
  directAnswers: HubDirectAnswer[];
  urgency: HubUrgency;
  procurement: HubProcurement;
  faqItems: { question: string; answer: string }[];
}

export const hubDataMap: Record<HubKey, HubData> = {
  'arm-kontrollery': {
    hubKey: 'arm-kontrollery',
    ecosystemType: 'stm32',
    ecosystemItems: [
      { name: 'STM32F1', type: 'mcu', href: '/arm-kontrollery' },
      { name: 'STM32F4', type: 'mcu', href: '/arm-kontrollery' },
      { name: 'GD32F1', type: 'analog', href: '/gigadevice' },
      { name: 'HK32F1', type: 'analog', href: '/gigadevice' },
      { name: 'LDO 3.3V', type: 'power', href: '/stabilizatory' },
      { name: 'LIS3DH', type: 'sensor', href: '/datchiki' },
      { name: 'STM32H7', type: 'mcu', href: '/stmicroelectronics' },
      { name: 'CH32F1', type: 'analog', href: '/gigadevice' },
    ],
    compatibilityRows: [
      { original: 'STM32F103C8T6', analog: 'GD32F103C8T6', compatibility: 'pin-to-pin', score: 100, href: '/analogs' },
      { original: 'STM32F103CBT6', analog: 'HK32F103CBT6', compatibility: 'pin-to-pin', score: 95, href: '/analogs' },
      { original: 'STM32F407VET6', analog: 'GD32F407VET6', compatibility: 'pin-to-pin', score: 98, href: '/analogs' },
      { original: 'STM32F103C8T6', analog: 'CH32F103C8T6', compatibility: 'pin-to-pin', score: 90, href: '/analogs' },
      { original: 'STM32F030F4P6', analog: 'GD32F130F4P6', compatibility: 'pin-to-pin', score: 95, href: '/analogs' },
      { original: 'STM32L432KC', analog: 'GD32L233KC', compatibility: 'functional', score: 80, href: '/analogs' },
    ],
    directAnswers: [
      {
        question: 'Чем заменить STM32F103C8T6 при санкционных ограничениях?',
        answer: 'GD32F103C8T6 от Gigadevice — полный pin-to-pin аналог STM32F103C8T6 с совместимостью 100%. Тот же кристалл ARM Cortex-M3, те же периферийные блоки, та же система команд. Доступен без ограничений на поставку из Азии.',
        specs: [
          { label: 'Ядро', value: 'ARM Cortex-M3 72 МГц' },
          { label: 'Flash', value: '64 КБ' },
          { label: 'RAM', value: '20 КБ' },
          { label: 'Совместимость', value: 'Pin-to-pin 100%' },
          { label: 'Срок поставки', value: '6-14 дней' },
        ],
        alternatives: [
          { name: 'GD32F103C8T6', href: '/gigadevice' },
          { name: 'HK32F103C8T6', href: '/gigadevice' },
          { name: 'CH32F103C8T6', href: '/gigadevice' },
        ],
      },
      {
        question: 'Какие микроконтроллеры ARM Cortex-M доступны для промышленных проектов?',
        answer: 'Доступны серии STM32 (STMicroelectronics), GD32 (Gigadevice), HK32 (HK Microelectronics), CH32 (WCH) — все на базе ARM Cortex-M0/M3/M4/M7. Для санкционных серий STM32 предоставляем полный кросс-референс на GD32/HK32 с проверкой совместимости в лаборатории.',
        specs: [
          { label: 'Архитектура', value: 'ARM Cortex-M0/M3/M4/M7' },
          { label: 'Частота', value: '48–480 МГц' },
          { label: 'Flash', value: '16 КБ – 2 МБ' },
          { label: 'Диапазон температур', value: '-40…+85°C (пром.)' },
          { label: 'Проверка', value: 'Лаборатория СВП' },
        ],
        alternatives: [
          { name: 'GD32 — аналог STM32', href: '/gigadevice' },
          { name: 'STM32 серии F0/F1/F4', href: '/stmicroelectronics' },
          { name: 'Подбор аналогов', href: '/analogs' },
        ],
      },
    ],
    urgency: {
      level: 'high',
      message: 'STM32 серий F1 и F4 — ограниченная доступность из-за санкций. Рекомендуем заблаговременный заказ или переход на аналоги GD32/HK32. Срочная поставка возможна из азиатских складов.',
    },
    procurement: {
      category: 'Микроконтроллеры ARM',
      urgency: 'urgent',
      recommendations: ['GD32F103C8T6', 'HK32F103C8T6', 'GD32F407VET6'],
    },
    faqItems: [
      {
        question: 'Насколько точна замена STM32 на GD32?',
        answer: 'Микроконтроллеры GD32 от Gigadevice являются практически полными аналогами STM32 с совместимостью pin-to-pin и программной на уровне 95-100%. Они используют то же ядро ARM Cortex-M, те же периферийные блоки и те же регистры. Основные отличия могут быть в предельных частотах и некоторых специфических режимах работы периферии.',
      },
      {
        question: 'Какой срок поставки STM32 и аналогов?',
        answer: 'Стандартная поставка GD32 и HK32 — 6-14 рабочих дней из азиатских складов. Для срочных заказов — 3-7 дней авиадоставкой. Оригинальные STM32 доступны под заказ с увеличенным сроком поставки, зависит от серии и объёма.',
      },
      {
        question: 'Проверяете ли вы аналоги STM32 в лаборатории?',
        answer: 'Да. Каждый аналоговый компонент проходит входной контроль в аккредитованной лаборатории СВП: рентгеновский контроль кристалла, декэпсуляция, электрические тесты параметров по даташиту. Гарантируем оригинальность и работоспособность.',
      },
    ],
  },

  'fpga': {
    hubKey: 'fpga',
    ecosystemType: 'fpga',
    ecosystemItems: [
      { name: 'Artix-7', type: 'fpga', href: '/xilinx' },
      { name: 'Kintex-7', type: 'fpga', href: '/xilinx' },
      { name: 'Cyclone V', type: 'fpga', href: '/altera' },
      { name: 'ECP5', type: 'fpga', href: '/lattice' },
      { name: 'Gowin Arora', type: 'analog', href: '/analogs' },
      { name: 'Efinix Trion', type: 'analog', href: '/analogs' },
      { name: 'DC-DC Питание', type: 'power', href: '/pitaniya' },
      { name: ' конфиг. Flash', type: 'analog', href: '/pamyat' },
    ],
    compatibilityRows: [
      { original: 'XC7A35T (Artix-7)', analog: 'GW2A-18 (Arora)', compatibility: 'functional', score: 78, href: '/analogs' },
      { original: 'XC6SLX9 (Spartan-6)', analog: 'GW2A-18 (Arora)', compatibility: 'functional', score: 75, href: '/analogs' },
      { original: 'XC3S200A (Spartan-3A)', analog: 'GW1N-4', compatibility: 'functional', score: 70, href: '/analogs' },
      { original: 'XC3S200A (Spartan-3A)', analog: 'T8F81 (Efinix)', compatibility: 'functional', score: 72, href: '/analogs' },
      { original: 'EP3C5E144 (Cyclone III)', analog: 'GW1N-4', compatibility: 'functional', score: 73, href: '/analogs' },
      { original: 'XC7A100T (Artix-7)', analog: 'GW2A-55', compatibility: 'functional', score: 76, href: '/analogs' },
    ],
    directAnswers: [
      {
        question: 'Как заменить Xilinx Spartan-6 на аналогичную FPGA?',
        answer: 'Gowin Arora GW2A-18 — оптимальная замена Spartan-6 XC6SLX9. Сопоставимая логическая ёмкость (~20K LUT), поддержка миграции проектов через Gowin EDA. Не является pin-to-pin заменой — требуется переработка PCB и адаптация HDL-кода.',
        specs: [
          { label: 'LUT', value: '~20 000' },
          { label: 'DSP блоки', value: '42' },
          { label: 'BRAM', value: '468 Кбит' },
          { label: 'Совместимость', value: 'Функциональный аналог' },
          { label: 'Миграция', value: 'Gowin EDA → Verilog' },
        ],
        alternatives: [
          { name: 'Gowin GW2A-18', href: '/analogs' },
          { name: 'Efinix T20F256', href: '/analogs' },
          { name: 'Lattice ECP5', href: '/lattice' },
        ],
      },
      {
        question: 'Какие FPGA доступны без санкционных ограничений?',
        answer: 'Lattice (iCE40, ECP5, MachXO) и Gowin (Arora, GW1N, GW2A) доступны без санкций. Intel/Altera Cyclone серии доступны с ограничениями. Xilinx Spartan-6 EOL, Artix-7 и Kintex-7 — ограниченная доступность для российских компаний.',
        specs: [
          { label: 'Lattice', value: 'Доступно без санкций' },
          { label: 'Gowin', value: 'Доступно без санкций' },
          { label: 'Efinix', value: 'Доступно без санкций' },
          { label: 'Intel/Altera', value: 'Ограниченная доступность' },
          { label: 'Xilinx', value: 'Ограниченная доступность' },
        ],
        alternatives: [
          { name: 'Lattice ECP5', href: '/lattice' },
          { name: 'Gowin Arora', href: '/analogs' },
          { name: 'Подбор аналогов FPGA', href: '/analogs' },
        ],
      },
    ],
    urgency: {
      level: 'high',
      message: 'Xilinx Spartan-6 снят с производства (EOL). Artix-7 и Kintex-7 — ограниченная доступность. Рекомендуем миграцию на Gowin Arora или Lattice ECP5 с поддержкой наших инженеров.',
    },
    procurement: {
      category: 'FPGA / ПЛИС',
      urgency: 'critical',
      recommendations: ['GW2A-18', 'GW1N-4', 'LFE5U-12F'],
    },
    faqItems: [
      {
        question: 'Можно ли заменить Xilinx FPGA на Gowin?',
        answer: 'Да, замена возможна, но она не является pin-to-pin. Gowin предоставляет инструменты миграции проектов, а наши инженеры помогают адаптировать HDL-код и пин-назначения для нового кристалла. По производительности серии Gowin Arora сопоставимы с Artix-7, а GW1N — с Spartan-6.',
      },
      {
        question: 'Какие FPGA не попадают под санкции?',
        answer: 'Lattice (iCE40, ECP5, MachXO) и Gowin (Arora, GW1N, GW2A) доступны без санкционных ограничений. Это китайские и американские производители, не ограничивающие поставки в РФ. Efinix (Сингапур) также доступен.',
      },
      {
        question: 'Сколько занимает миграция проекта с Xilinx на Gowin?',
        answer: 'Сроки миграции зависят от сложности проекта: простой Verilog-проект — 2-4 недели, проект с IP-ядрами — 4-8 недель, сложный SoC-проект — 2-3 месяца. Наши инженеры оказывают поддержку на всех этапах миграции.',
      },
    ],
  },

  'texas-instruments': {
    hubKey: 'texas-instruments',
    ecosystemType: 'ti',
    ecosystemItems: [
      { name: 'TPS LDO', type: 'power', href: '/stabilizatory' },
      { name: 'ADS АЦП', type: 'analog', href: '/adc-dac' },
      { name: 'OPA ОУ', type: 'analog', href: '/operatsionnye-usiliteli' },
      { name: 'MSP430', type: 'mcu', href: '/arm-kontrollery' },
      { name: 'DAC ЦАП', type: 'analog', href: '/adc-dac' },
      { name: 'LM358', type: 'analog', href: '/operatsionnye-usiliteli' },
      { name: 'C2000 DSP', type: 'mcu', href: '/arm-kontrollery' },
      { name: 'Сенсоры', type: 'sensor', href: '/datchiki' },
    ],
    compatibilityRows: [
      { original: 'AMS1117-3.3', analog: 'RT9193-33 (Richtek)', compatibility: 'pin-to-pin', score: 100, href: '/analogs' },
      { original: 'TLV1117-33', analog: 'RT9169-33 (Richtek)', compatibility: 'pin-to-pin', score: 100, href: '/analogs' },
      { original: 'TPS5430', analog: 'MP1584 (MPS)', compatibility: 'functional', score: 85, href: '/analogs' },
      { original: 'OPA2134PA', analog: 'NE5532P', compatibility: 'functional', score: 75, href: '/analogs' },
      { original: 'ADS1115', analog: 'CS1237 (ChipSailing)', compatibility: 'functional', score: 72, href: '/analogs' },
      { original: 'LM7805CT', analog: 'LM7805 (Diodes Inc)', compatibility: 'pin-to-pin', score: 100, href: '/analogs' },
    ],
    directAnswers: [
      {
        question: 'Чем заменить компоненты Texas Instruments при санкционных ограничениях?',
        answer: 'LDO стабилизаторы TI (AMS1117, TLV1117) заменяются на Richtek RT9193/RT9169 с pin-to-pin совместимостью 100%. Операционные усилители OPA — на аналоги от Microchip и STMicroelectronics. АЦП/ЦАП TI — на совместимые решения от китайских производителей.',
        specs: [
          { label: 'LDO', value: 'Richtek RT9193 — pin-to-pin' },
          { label: 'ОУ', value: 'Microchip MCP — функциональный аналог' },
          { label: 'DC-DC', value: 'MPS MP1584 — функциональный аналог' },
          { label: 'АЦП', value: 'CS1237 — функциональный аналог' },
          { label: 'Проверка', value: 'Лаборатория СВП' },
        ],
        alternatives: [
          { name: 'Richtek LDO', href: '/stabilizatory' },
          { name: 'MPS DC-DC', href: '/pitaniya' },
          { name: 'Подбор аналогов TI', href: '/analogs' },
        ],
      },
    ],
    urgency: {
      level: 'medium',
      message: 'Компоненты Texas Instruments доступны с ограничениями. LDO и DC-DC имеют аналоги от Richtek и MPS с немедленной поставкой. АЦП/ЦАП и MSP430 — ограниченная доступность, рекомендуем заблаговременный заказ.',
    },
    procurement: {
      category: 'Texas Instruments',
      urgency: 'urgent',
      recommendations: ['RT9193-33', 'MP1584', 'RT9169-33'],
    },
    faqItems: [
      {
        question: 'Есть ли pin-to-pin аналоги для LDO Texas Instruments?',
        answer: 'Да. Richtek RT9193-33 — полный pin-to-pin аналог AMS1117-3.3. RT9169-33 — аналог TLV1117-33. Оба компонента производятся на Тайване и доступны без санкционных ограничений. Совместимость подтверждена в нашей лаборатории.',
      },
      {
        question: 'Чем заменить TPS5430 DC-DC преобразователь?',
        answer: 'MPS MP1584 — функциональный аналог TPS5430 с сопоставимыми параметрами: вход 4.5-28В, выход до 3А, частота 1.5 МГц. Не является pin-to-pin заменой, но требует минимальных изменений обвязки. Подбираем оптимальную замену под конкретную схему.',
      },
    ],
  },

  'xilinx': {
    hubKey: 'xilinx',
    ecosystemType: 'xilinx',
    ecosystemItems: [
      { name: 'Spartan-6', type: 'fpga', href: '/xilinx' },
      { name: 'Artix-7', type: 'fpga', href: '/xilinx' },
      { name: 'Kintex-7', type: 'fpga', href: '/xilinx' },
      { name: 'Zynq-7000', type: 'fpga', href: '/xilinx' },
      { name: 'Gowin Arora', type: 'analog', href: '/analogs' },
      { name: 'Efinix Trion', type: 'analog', href: '/analogs' },
      { name: 'Конфиг. память', type: 'analog', href: '/pamyat' },
      { name: 'DC-DC Питание', type: 'power', href: '/pitaniya' },
    ],
    compatibilityRows: [
      { original: 'XC6SLX9 (Spartan-6)', analog: 'GW2A-18 (Gowin)', compatibility: 'functional', score: 75, href: '/analogs' },
      { original: 'XC7A35T (Artix-7)', analog: 'GW2A-18 (Gowin)', compatibility: 'functional', score: 78, href: '/analogs' },
      { original: 'XC7A100T (Artix-7)', analog: 'GW2A-55 (Gowin)', compatibility: 'functional', score: 76, href: '/analogs' },
      { original: 'XC3S200A (Spartan-3A)', analog: 'GW1N-4 (Gowin)', compatibility: 'functional', score: 70, href: '/analogs' },
      { original: 'XC7K70T (Kintex-7)', analog: 'T85F324 (Efinix)', compatibility: 'functional', score: 72, href: '/analogs' },
      { original: 'XC7Z010 (Zynq-7000)', analog: 'Нет прямого аналога', compatibility: 'parametric', score: 45, href: '/analogs' },
    ],
    directAnswers: [
      {
        question: 'Как заменить Xilinx Artix-7 на доступную FPGA?',
        answer: 'Gowin Arora GW2A-18 — оптимальная замена Artix-7 XC7A35T. Сопоставимая логическая ёмкость (~20K LUT), поддержка высокоскоростных интерфейсов. Требует миграции HDL-кода и переработки PCB. Наши инженеры оказывают полную поддержку миграции.',
        specs: [
          { label: 'LUT', value: '~20 736' },
          { label: 'DSP', value: '42 блока' },
          { label: 'BRAM', value: '468 Кбит' },
          { label: 'PLL', value: '4' },
          { label: 'Миграция', value: 'Gowin EDA' },
        ],
        alternatives: [
          { name: 'Gowin GW2A-18', href: '/analogs' },
          { name: 'Efinix T20F256', href: '/analogs' },
          { name: 'Lattice ECP5', href: '/lattice' },
        ],
      },
      {
        question: 'Доступны ли Xilinx FPGA для поставки в Россию?',
        answer: 'Прямые поставки Xilinx (AMD) для российских компаний ограничены санкциями. Доступны складские остатки через азиатских партнёров с увеличенным сроком поставки (4-8 недель). Для новых проектов рекомендуем миграцию на Gowin, Efinix или Lattice.',
        specs: [
          { label: 'Spartan-6', value: 'EOL, недоступен' },
          { label: 'Artix-7', value: 'Ограниченная доступность' },
          { label: 'Kintex-7', value: 'Ограниченная доступность' },
          { label: 'Zynq-7000', value: 'Под заказ, 8-12 недель' },
          { label: 'Альтернатива', value: 'Gowin / Lattice / Efinix' },
        ],
        alternatives: [
          { name: 'Миграция на Gowin', href: '/analogs' },
          { name: 'Lattice ECP5', href: '/lattice' },
          { name: 'Импортозамещение', href: '/importozameshchenie' },
        ],
      },
    ],
    urgency: {
      level: 'high',
      message: 'Xilinx Spartan-6 — EOL (снят с производства). Artix-7 и Kintex-7 — ограниченная доступность из-за санкций. Рекомендуем миграцию на Gowin Arora или Efinix Trion для новых проектов.',
    },
    procurement: {
      category: 'Xilinx FPGA',
      urgency: 'critical',
      recommendations: ['GW2A-18', 'T20F256', 'LFE5U-12F'],
    },
    faqItems: [
      {
        question: 'Как мигрировать проект с Xilinx на Gowin?',
        answer: 'Миграция состоит из нескольких этапов: 1) Анализ текущего проекта — оценка используемых IP-ядер и ресурсов; 2) Выбор кристалла Gowin с сопоставимыми ресурсами; 3) Адаптация HDL-кода (Verilog/VHDL переносится с минимальными изменениями); 4) Переназначение пинов и переработка PCB; 5) Верификация на стенде. Наши инженеры поддерживают каждый этап.',
      },
      {
        question: 'Есть ли замена Zynq-7000 (FPGA+ARM)?',
        answer: 'Прямого pin-to-pin аналога Zynq нет — это уникальная архитектура FPGA+ARM на одном кристалле. Возможные решения: 1) Отдельная FPGA (Gowin) + внешний MCU (STM32/GD32); 2) Intel Cyclone 10 GX с встроенным ARM; 3) Lattice CrossLink-NX для специфических задач. Подбираем решение индивидуально.',
      },
    ],
  },

  'stmicroelectronics': {
    hubKey: 'stmicroelectronics',
    ecosystemType: 'stm32',
    ecosystemItems: [
      { name: 'STM32F0', type: 'mcu', href: '/arm-kontrollery' },
      { name: 'STM32F1', type: 'mcu', href: '/arm-kontrollery' },
      { name: 'STM32F4', type: 'mcu', href: '/arm-kontrollery' },
      { name: 'STM32H7', type: 'mcu', href: '/arm-kontrollery' },
      { name: 'GD32', type: 'analog', href: '/gigadevice' },
      { name: 'MDmesh MOSFET', type: 'power', href: '/mosfet' },
      { name: 'VL53L0X', type: 'sensor', href: '/datchiki' },
      { name: 'ОУ ST', type: 'analog', href: '/operatsionnye-usiliteli' },
    ],
    compatibilityRows: [
      { original: 'STM32F103C8T6', analog: 'GD32F103C8T6', compatibility: 'pin-to-pin', score: 100, href: '/analogs' },
      { original: 'STM32F407VET6', analog: 'GD32F407VET6', compatibility: 'pin-to-pin', score: 98, href: '/analogs' },
      { original: 'STM32F030F4P6', analog: 'GD32F130F4P6', compatibility: 'pin-to-pin', score: 95, href: '/analogs' },
      { original: 'STM32F103CBT6', analog: 'HK32F103CBT6', compatibility: 'pin-to-pin', score: 95, href: '/analogs' },
      { original: 'STM32L432KC', analog: 'GD32L233KC', compatibility: 'functional', score: 80, href: '/analogs' },
      { original: 'STM32H743VI', analog: 'GD32H7xx', compatibility: 'functional', score: 70, href: '/analogs' },
    ],
    directAnswers: [
      {
        question: 'Чем заменить STM32 микроконтроллеры при санкционных ограничениях?',
        answer: 'Gigadevice GD32 — полный pin-to-pin аналог STM32 с совместимостью 95-100%. Серии GD32F1 заменяют STM32F1, GD32F4 заменяют STM32F4. Тот же кристалл ARM Cortex-M, та же система команд, та же периферия. Поставляются из Азии без ограничений.',
        specs: [
          { label: 'Совместимость', value: 'Pin-to-pin 95-100%' },
          { label: 'Ядро', value: 'ARM Cortex-M0/M3/M4/M7' },
          { label: 'Срок поставки', value: '6-14 дней из Азии' },
          { label: 'Проверка', value: 'Лаборатория СВП' },
          { label: 'Производитель', value: 'Gigadevice (Китай)' },
        ],
        alternatives: [
          { name: 'GD32F103 — аналог F1', href: '/gigadevice' },
          { name: 'HK32 — аналог F1', href: '/gigadevice' },
          { name: 'Подбор аналогов STM32', href: '/analogs' },
        ],
      },
    ],
    urgency: {
      level: 'high',
      message: 'STM32 серий F1 и F4 — ограниченная доступность для российских компаний. Рекомендуем переход на GD32 (Gigadevice) — полные аналоги с немедленной поставкой из Азии.',
    },
    procurement: {
      category: 'STMicroelectronics',
      urgency: 'urgent',
      recommendations: ['GD32F103C8T6', 'GD32F407VET6', 'HK32F103C8T6'],
    },
    faqItems: [
      {
        question: 'Совместим ли GD32 с кодом STM32?',
        answer: 'Да. GD32 использует то же ядро ARM Cortex-M и ту же систему команд. Код, скомпилированный для STM32, работает на GD32 без изменений в большинстве случаев. Исключения возможны для специфических периферийных режимов и предельных частот.',
      },
      {
        question: 'Поставляются ли датчики STMicroelectronics (VL53L0X, LIS3DH)?',
        answer: 'Датчики STMicroelectronics доступны с ограничениями. Для VL53L0X (ToF-датчик) и LIS3DH (акселерометр) рекомендуем заблаговременный заказ. Аналоги доступны от Bosch и TDK/InvenSense с сопоставимыми характеристиками.',
      },
    ],
  },
};

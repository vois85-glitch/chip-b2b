// ============================================================================
// Семантический слой данных для B2B платформы поставок компонентов chip-net.ru
// Содержит кластеры компонентов, кросс-референсы аналогов, карты брендов,
// устаревшие компоненты, SEO-интенты и группы сравнений
// ============================================================================

// ---------------------------------------------------------------------------
// Интерфейсы
// ---------------------------------------------------------------------------

/** Кластер семейства компонентов по префиксу партномера */
export interface ComponentCluster {
  /** Регулярное выражение для префикса партномера */
  prefixPattern: string;
  /** Название семейства (на русском для отображения) */
  familyName: string;
  /** Бренд-производитель */
  brand: string;
  /** Категория компонентов */
  category: string;
  /** Краткое описание технических характеристик */
  description: string;
  /** Ключевые технические параметры */
  specs: Record<string, string>;
  /** Типовые применения */
  applications: string[];
  /** Связанные кластеры (аналоги) */
  relatedClusters: string[];
}

/** Альтернативный компонент для замены */
export interface ReplacementOption {
  /** Партномер замены */
  sku: string;
  /** Бренд замены */
  brand: string;
  /** Уровень совместимости */
  compatibility: 'pin-compatible' | 'software-compatible' | 'functional-equivalent' | 'near-equivalent' | 'upgrade';
  /** Описание отличий / примечания (на русском) */
  notes: string;
}

/** Запись кросс-референса аналогов */
export interface AnalogEntry {
  /** Оригинальный партномер */
  original: string;
  /** Массив альтернатив для замены */
  replacements: ReplacementOption[];
}

/** Семейство продукции бренда */
export interface BrandFamily {
  /** Название семейства */
  name: string;
  /** Описание семейства (на русском) */
  description: string;
  /** Ключевые партномеры семейства */
  keyParts: string[];
}

/** Бренд с семействами продукции */
export interface BrandEntry {
  /** Название бренда */
  brand: string;
  /** Slug для URL */
  slug: string;
  /** Страна происхождения */
  country: string;
  /** Описание деятельности бренда (на русском) */
  description: string;
  /** Семейства продукции */
  families: BrandFamily[];
}

/** Устаревший / снятый с производства компонент */
export interface ObsoleteComponent {
  /** Партномер */
  sku: string;
  /** Название / описание (на русском) */
  name: string;
  /** Статус жизненного цикла */
  status: 'obsolete' | 'not-recommended';
  /** Рекомендованная замена */
  replacementSuggestion: string;
  /** Дата последней покупки (LRFD) */
  lastBuyDate: string;
  /** Примечание (на русском) */
  notes: string;
}

/** SEO-интент закупочного поиска */
export interface ProcurementIntent {
  /** Шаблон поискового запроса */
  intentPattern: string;
  /** Целевая страница (slug) */
  targetPage: string;
  /** Приоритет (1 = высший) */
  priority: number;
  /** Тип интента */
  intentType: 'purchase' | 'analog' | 'datasheet' | 'comparison' | 'bom' | 'info';
}

/** Группа сравнения компонентов */
export interface ComparisonGroup {
  /** Slug для URL */
  slug: string;
  /** Заголовок страницы сравнения (на русском) */
  title: string;
  /** Сравниваемые компоненты */
  components: string[];
  /** Описание сравнения (на русском) */
  description: string;
  /** Категория сравнения */
  category: string;
}

// ---------------------------------------------------------------------------
// 1. componentClusters — Семантические кластеры компонентов
// ---------------------------------------------------------------------------

export const componentClusters: Record<string, ComponentCluster> = {
  'stm32f1': {
    prefixPattern: '^STM32F1[0-9]{2}',
    familyName: 'STM32F1',
    brand: 'STMicroelectronics',
    category: 'Микроконтроллеры',
    description: 'Серия 32-битных микроконтроллеров ARM Cortex-M3 с частотой до 72 МГц. Value line — бюджетное решение для массовых применений.',
    specs: {
      'Ядро': 'ARM Cortex-M3',
      'Частота': 'до 72 МГц',
      'Flash': '16–512 КБ',
      'RAM': '4–64 КБ',
      'Питание': '2.0–3.6 В',
      'Корпус': 'LQFP48/64/100/144, BGA',
    },
    applications: ['Промышленная автоматика', 'Управление моторами', 'Потребительская электроника', 'Медицинские приборы'],
    relatedClusters: ['gd32f1', 'hk32f1', 'ch32f1'],
  },
  'stm32f4': {
    prefixPattern: '^STM32F4[0-9]{2}',
    familyName: 'STM32F4',
    brand: 'STMicroelectronics',
    category: 'Микроконтроллеры',
    description: 'Серия высокопроизводительных микроконтроллеров ARM Cortex-M4 с FPU и DSP-инструкциями, частота до 168 МГц.',
    specs: {
      'Ядро': 'ARM Cortex-M4F',
      'Частота': 'до 168 МГц',
      'Flash': '128 КБ – 2 МБ',
      'RAM': '32–256 КБ',
      'Питание': '1.7–3.6 В',
      'DSP': 'Да (SIMD, FPU)',
    },
    applications: ['Цифровая обработка сигналов', 'Аудиообработка', 'Системы управления', 'Графические интерфейсы'],
    relatedClusters: ['stm32f1', 'stm32h7', 'gd32f4'],
  },
  'stm32h7': {
    prefixPattern: '^STM32H7[0-9]{2}',
    familyName: 'STM32H7',
    brand: 'STMicroelectronics',
    category: 'Микроконтроллеры',
    description: 'Флагманская серия ARM Cortex-M7 с частотой до 480 МГц, двойным ядром (M7+M4), для высокопроизводительных задач.',
    specs: {
      'Ядро': 'ARM Cortex-M7 (+Cortex-M4 в двухъядерных)',
      'Частота': 'до 480 МГц',
      'Flash': 'до 2 МБ',
      'RAM': 'до 1 МБ',
      'Питание': '1.62–3.6 В',
      'Кэш L1': '16 КБ I / 16 КБ D',
    },
    applications: ['Обработка изображений', 'Промышленные контроллеры', 'Сетевое оборудование', 'ЦОС реального времени'],
    relatedClusters: ['stm32f4', 'stm32f7'],
  },
  'xc7a': {
    prefixPattern: '^XC7A[0-9]{2}',
    familyName: 'Artix-7',
    brand: 'Xilinx',
    category: 'ПЛИС (FPGA)',
    description: 'Серия FPGA Artix-7 — оптимальное соотношение цены, производительности и энергопотребления. Логическая ёмкость до 158K логических ячеек.',
    specs: {
      'Логические ячейки': '15 850 – 158 000',
      'DSP-блоки': 'до 740',
      'BRAM': 'до 8 250 Кбит',
      'Трансиверы': 'до 16 (GTP, 6.6 Гбит/с)',
      'Питание': '1.0 В ядро',
      'Корпус': 'BGA, FBGA',
    },
    applications: ['Встраиваемые системы', 'Обработка видео', 'Промышленная автоматика', 'Связь'],
    relatedClusters: ['xc7k', 'xc7s', '5cefa', 'gw1n'],
  },
  'xc7k': {
    prefixPattern: '^XC7K[0-9]{2}',
    familyName: 'Kintex-7',
    brand: 'Xilinx',
    category: 'ПЛИС (FPGA)',
    description: 'Серия FPGA Kintex-7 — средний класс производительности с трансиверами до 12.5 Гбит/с. Для коммуникационного и промышленного оборудования.',
    specs: {
      'Логические ячейки': '62 550 – 478 000',
      'DSP-блоки': 'до 1 920',
      'BRAM': 'до 34 380 Кбит',
      'Трансиверы': 'до 36 (GTX, 12.5 Гбит/с)',
      'Питание': '1.0 В ядро',
      'Корпус': 'BGA, FBGA',
    },
    applications: ['Телекоммуникации', 'Сетевое оборудование', 'Радары', 'Медицинская визуализация'],
    relatedClusters: ['xc7a', 'xc7v', '5cefa'],
  },
  'xc7s': {
    prefixPattern: '^XC7S[0-9]{2}',
    familyName: 'Spartan-7',
    brand: 'Xilinx',
    category: 'ПЛИС (FPGA)',
    description: 'Серия FPGA Spartan-7 — бюджетное решение в компактных корпусах. До 23 000 логических ячеек, минимальное энергопотребление.',
    specs: {
      'Логические ячейки': '5 800 – 23 000',
      'DSP-блоки': 'до 60',
      'BRAM': 'до 1 350 Кбит',
      'Трансиверы': 'нет',
      'Питание': '1.0 В ядро',
      'Корпус': 'BGA, CSBGA',
    },
    applications: ['Замена CPLD', 'Интерфейсная логика', 'Простые контроллеры', 'I/O расширение'],
    relatedClusters: ['xc7a', 'ice40', 'gw1n'],
  },
  '5cefa': {
    prefixPattern: '^5CEFA[0-9]',
    familyName: 'Cyclone V',
    brand: 'Intel/Altera',
    category: 'ПЛИС (FPGA)',
    description: 'Серия FPGA Cyclone V на базе 28 нм с опциональным ARM Cortex-A9 (SoC). До 301K логических элементов.',
    specs: {
      'Логические элементы': '25 000 – 301 000',
      'DSP-блоки': 'до 342',
      'MLAB': 'до 17 173 Кбит',
      'Трансиверы': 'до 24 (5 Гбит/с)',
      'Процессор': 'ARM Cortex-A9 (SoC варианты)',
      'Питание': '0.9 В / 1.1 В ядро',
    },
    applications: ['Промышленные контроллеры', 'Автомобильная электроника', 'Видеообработка', 'Коммуникации'],
    relatedClusters: ['ep4ce', 'xc7a', 'gw2a'],
  },
  'ep4ce': {
    prefixPattern: '^EP4CE[0-9]{2}',
    familyName: 'Cyclone IV',
    brand: 'Intel/Altera',
    category: 'ПЛИС (FPGA)',
    description: 'Серия FPGA Cyclone IV — проверенное бюджетное решение на 60 нм. Широко применяется в промышленном оборудовании.',
    specs: {
      'Логические элементы': '6 272 – 149 760',
      'DSP-блоки': 'до 366',
      'M9K': 'до 6 480 Кбит',
      'Трансиверы': 'до 8 (3.125 Гбит/с, E-вариант)',
      'Питание': '1.0 В / 1.2 В ядро',
      'Корпус': 'PQFP, BGA',
    },
    applications: ['Промышленная автоматика', 'Обработка сигналов', 'Автомобильная электроника', 'Тестовое оборудование'],
    relatedClusters: ['5cefa', 'xc7a', 'gw1n'],
  },
  'lfe5': {
    prefixPattern: '^LFE5U?[0-9]{2}',
    familyName: 'ECP5',
    brand: 'Lattice',
    category: 'ПЛИС (FPGA)',
    description: 'Серия FPGA ECP5 — 45 нм, до 85K LUT. Оптимальна для коммуникационного оборудования и видеообработки. Доступна без санкций.',
    specs: {
      'LUT': '12 000 – 85 000',
      'DSP-блоки': 'до 156',
      'EBR': 'до 3 872 Кбит',
      'Трансиверы': 'до 4 (5 Гбит/с, -G вариант)',
      'Питание': '1.1 В ядро',
      'Корпус': 'csfBGA, caBGA',
    },
    applications: ['Коммуникационное оборудование', 'Видеомосты', 'Промышленная автоматика', 'Автомобильная электроника'],
    relatedClusters: ['ice40', 'xc7a', '5cefa'],
  },
  'ice40': {
    prefixPattern: '^ICE40[UHPL]?[0-9]',
    familyName: 'iCE40',
    brand: 'Lattice',
    category: 'ПЛИС (FPGA)',
    description: 'Серия ультранизкопотребляющих FPGA iCE40 с конфигурацией через SPI Flash. До 8K LUT, открытый инструментарий.',
    specs: {
      'LUT': '384 – 8 320',
      'DSP-блоки': 'до 16 (DSP-вариант)',
      'BRAM': 'до 30 SPRAM по 4 Кбит',
      'Трансиверы': 'нет',
      'Питание': '1.14 – 1.26 В ядро',
      'Конфигурация': 'SPI Flash',
    },
    applications: ['IoT-устройства', 'Заменители CPLD', 'Интерфейсные мосты', 'Носимая электроника'],
    relatedClusters: ['lfe5', 'xc7s', 'gw1n'],
  },
  'tps54': {
    prefixPattern: '^TPS54[0-9]{2}',
    familyName: 'TPS54xxx Step-Down',
    brand: 'Texas Instruments',
    category: 'Стабилизаторы',
    description: 'Серия импульсных понижающих преобразователей (Step-Down / Buck) от Texas Instruments. Широкий диапазон входных напряжений, интегрированные ключи.',
    specs: {
      'Тип': 'DC-DC Buck',
      'Входное напряжение': '3.5 – 60 В (зависит от модели)',
      'Выходной ток': '0.5 – 10 А',
      'Частота ШИМ': '200 кГц – 2.2 МГц',
      'КПД': 'до 95%',
      'Корпус': 'VSON, SOT-23, TO-220',
    },
    applications: ['Промышленные источники питания', 'Питание FPGA/МК', 'Распределённые системы питания', 'PoE'],
    relatedClusters: ['lm2596', 'mp1584'],
  },
  'lm2596': {
    prefixPattern: '^LM2596[HV]?$',
    familyName: 'LM2596 Simple Switcher',
    brand: 'Texas Instruments',
    category: 'Стабилизаторы',
    description: 'Классический импульсный понижающий стабилизатор из семейства Simple Switcher. До 3 А, вход до 40 В (HV — до 60 В).',
    specs: {
      'Тип': 'DC-DC Buck',
      'Входное напряжение': '4.5 – 40 В (HV: до 60 В)',
      'Выходной ток': 'до 3 А',
      'Частота ШИМ': '150 кГц',
      'КПД': 'до 90%',
      'Корпус': 'TO-263, TO-220',
    },
    applications: ['Бюджетные источники питания', 'Автомобильная электроника', 'Стендовое оборудование', 'Питание МК'],
    relatedClusters: ['tps54', 'mp1584', 'ams1117'],
  },
  'pc817': {
    prefixPattern: '^PC817[ACDB]?$',
    familyName: 'PC817',
    brand: 'Sharp',
    category: 'Оптоэлектроника',
    description: 'Транзисторная оптопара с коэффициентом передачи 50–600%. Классический компонент гальванической развязки для интерфейсов и обратной связи.',
    specs: {
      'Тип': 'Транзисторная оптопара',
      'CTR': '50 – 600%',
      'Изоляция': '5 000 В (ср.кв.)',
      'Vce(sat)': 'до 0.2 В',
      'If': '50 мА (макс.)',
      'Корпус': 'DIP-4, SMD-4',
    },
    applications: ['Гальваническая развязка ШИМ', 'Обратная связь источников питания', 'Интерфейсные цепи', 'Сигнальная развязка'],
    relatedClusters: ['sfh615', 'tlp521'],
  },
  'ft232r': {
    prefixPattern: '^FT232R[LBH]?$',
    familyName: 'FT232R',
    brand: 'FTDI',
    category: 'Интерфейсы',
    description: 'Популярный мост USB — UART с интегрированным EEPROM. Поддержка всех режимов FTDI (UART, Bit-Bang, FIFO).',
    specs: {
      'Тип': 'USB-UART мост',
      'USB': 'Full-Speed (12 Мбит/с)',
      'UART': 'до 3 МБод',
      'GPIO': 'до 8 (CBUS, Bit-Bang)',
      'Питание': '3.3 – 5.25 В',
      'Корпус': 'SSOP-28, QFN-32',
    },
    applications: ['Отладочные интерфейсы', 'Программирование МК', 'Промышленные адаптеры', 'Встраиваемые USB-устройства'],
    relatedClusters: ['cp2102', 'ch340'],
  },
  'sp3485': {
    prefixPattern: '^SP348[15]$',
    familyName: 'SP3485',
    brand: 'Sipex/MaxLinear',
    category: 'Интерфейсы',
    description: 'Приёмопередатчик RS-485 / RS-422 с питанием 3.3 В. Скорость до 10 Мбит/с, совместим с промышленными шинами Modbus RTU.',
    specs: {
      'Тип': 'RS-485 / RS-422 трансивер',
      'Питание': '3.3 В',
      'Скорость': 'до 10 Мбит/с',
      'Приёмников на шину': 'до 64',
      'Защита': 'ESD ±15 кВ',
      'Корпус': 'DIP-8, SOIC-8',
    },
    applications: ['Modbus RTU', 'Промышленные сети', 'DMX-512', 'Автоматика зданий'],
    relatedClusters: ['max485', 'sn65hvd75'],
  },
  'lm358': {
    prefixPattern: '^LM358[ADN]?$',
    familyName: 'LM358',
    brand: 'Texas Instruments',
    category: 'Операционные усилители',
    description: 'Двойной операционный усилитель общего назначения. Широкий диапазон питания (3–32 В), низкая стоимость, массовость.',
    specs: {
      'Тип': 'Двойной ОУ',
      'Питание': '3 – 32 В (однополярное)',
      'Gain-BW': '1.1 МГц',
      'Скорость нарастания': '0.6 В/мкс',
      'Iq': '0.7 мА на канал',
      'Корпус': 'DIP-8, SOIC-8, MSOP-8',
    },
    applications: ['Аналоговые цепи общего назначения', 'Усилители датчиков', 'Компараторы', 'Активные фильтры'],
    relatedClusters: ['tl072', 'ne5532', 'mcp6002'],
  },
  'ams1117': {
    prefixPattern: '^AMS1117[-][0-9.]+$',
    familyName: 'AMS1117',
    brand: 'Advanced Monolithic Systems',
    category: 'Стабилизаторы',
    description: 'Линейный LDO-стабилизатор с током до 1 А. Фиксированные (1.2/1.5/1.8/2.5/3.3/5.0 В) и регулируемый варианты. Де-факто стандарт для питания МК.',
    specs: {
      'Тип': 'LDO линейный',
      'Выходной ток': 'до 1 А',
      'Падение напряжения': '1.1 В (макс. при 800 мА)',
      'Выходное напряжение': '1.2 / 1.5 / 1.8 / 2.5 / 3.3 / 5.0 / Adjustable',
      'Питание': 'до 15 В',
      'Корпус': 'SOT-223, TO-252',
    },
    applications: ['Питание микроконтроллеров', 'Питание FPGA', 'Пост-стабилизация DC-DC', 'Arduino-совместимые платы'],
    relatedClusters: ['tlv1117', 'ld1117', 'rt9193'],
  },
  'atmega328': {
    prefixPattern: '^ATmega328[P]?$',
    familyName: 'ATmega328',
    brand: 'Microchip',
    category: 'Микроконтроллеры',
    description: '8-битный AVR-микроконтроллер. Основной чип платформы Arduino Uno. 32 КБ Flash, 2 КБ SRAM, 1 КБ EEPROM.',
    specs: {
      'Архитектура': '8-бит AVR',
      'Частота': 'до 20 МГц',
      'Flash': '32 КБ',
      'SRAM': '2 КБ',
      'EEPROM': '1 КБ',
      'Корпус': 'DIP-28, TQFP-32, QFN/MLF-32',
    },
    applications: ['Arduino Uno', 'Простые контроллеры', 'Устройства с батарейным питанием', 'Legacy-проекты'],
    relatedClusters: ['lgt8f328', 'atmega2560', 'atmega168'],
  },
  'gd32f1': {
    prefixPattern: '^GD32F1[0-9]{2}',
    familyName: 'GD32F1',
    brand: 'Gigadevice',
    category: 'Микроконтроллеры',
    description: 'Серия 32-битных микроконтроллеров Gigadevice — аналог STM32F1 с совместимостью pin-to-pin. ARM Cortex-M3, частота до 108 МГц.',
    specs: {
      'Ядро': 'ARM Cortex-M3',
      'Частота': 'до 108 МГц',
      'Flash': '16–512 КБ',
      'RAM': '4–64 КБ',
      'Питание': '2.6–3.6 В',
      'Совместимость': 'Pin-to-pin и программная с STM32F1',
    },
    applications: ['Импортозамещение STM32F1', 'Промышленная автоматика', 'Потребительская электроника', 'Медицинские приборы'],
    relatedClusters: ['stm32f1', 'hk32f1', 'ch32f1'],
  },
};

// ---------------------------------------------------------------------------
// 2. analogMap — Кросс-референсы аналогов (40+ записей)
// ---------------------------------------------------------------------------

export const analogMap: AnalogEntry[] = [
  // --- STM32 → GD32 ---
  {
    original: 'STM32F103C8T6',
    replacements: [
      { sku: 'GD32F103C8T6', brand: 'Gigadevice', compatibility: 'pin-compatible', notes: 'Pin-to-pin совместим, частота 108 МГц vs 72 МГц. Требуется корректировка задержек Flash.' },
      { sku: 'HK32F103C8T6', brand: 'HKMicro', compatibility: 'pin-compatible', notes: 'Pin-to-pin совместим, программно совместим. Более доступная цена.' },
      { sku: 'CH32F103C8T6', brand: 'WCH', compatibility: 'near-equivalent', notes: 'Pin-to-pin совместим, но периферия имеет отличия. Требуется адаптация драйверов.' },
    ],
  },
  {
    original: 'STM32F103RBT6',
    replacements: [
      { sku: 'GD32F103RBT6', brand: 'Gigadevice', compatibility: 'pin-compatible', notes: 'Полный аналог 128 КБ Flash в корпусе LQFP64.' },
      { sku: 'HK32F103RBT6', brand: 'HKMicro', compatibility: 'pin-compatible', notes: 'Pin-to-pin замена, доступен без ограничений.' },
    ],
  },
  {
    original: 'STM32F103VET6',
    replacements: [
      { sku: 'GD32F103VET6', brand: 'Gigadevice', compatibility: 'pin-compatible', notes: '512 КБ Flash, LQFP100. Полная совместимость периферии.' },
      { sku: 'HK32F103VET6', brand: 'HKMicro', compatibility: 'pin-compatible', notes: 'Аналог STM32F103VET6, доступен для поставок.' },
    ],
  },
  {
    original: 'STM32F103ZET6',
    replacements: [
      { sku: 'GD32F103ZET6', brand: 'Gigadevice', compatibility: 'pin-compatible', notes: '512 КБ Flash, LQFP144. Полная замена.' },
    ],
  },
  {
    original: 'STM32F407VGT6',
    replacements: [
      { sku: 'GD32F407VGT6', brand: 'Gigadevice', compatibility: 'pin-compatible', notes: 'Cortex-M4, 168 МГц. Периферия в основном совместима, отличия в USB OTG.' },
      { sku: 'AT32F407VGT7', brand: 'Artery', compatibility: 'pin-compatible', notes: 'Совместим pin-to-pin, 240 МГц. Расширенная периферия.' },
    ],
  },
  {
    original: 'STM32F407IGH6',
    replacements: [
      { sku: 'GD32F407IGH6', brand: 'Gigadevice', compatibility: 'pin-compatible', notes: 'UFBGA176, полный аналог.' },
    ],
  },
  {
    original: 'STM32F429ZIT6',
    replacements: [
      { sku: 'GD32F470ZIT6', brand: 'Gigadevice', compatibility: 'near-equivalent', notes: 'Совместим по выводам, но LTDC-контроллер имеет отличия.' },
      { sku: 'AT32F437ZMT7', brand: 'Artery', compatibility: 'near-equivalent', notes: 'Аналог с LTDC, 288 МГц. Требуется адаптация графического стека.' },
    ],
  },
  {
    original: 'STM32H743VIT6',
    replacements: [
      { sku: 'GD32H743VIT6', brand: 'Gigadevice', compatibility: 'near-equivalent', notes: 'Совместимость по выводам, но архитектура периферии отличается. 600 МГц.' },
    ],
  },
  {
    original: 'STM32F030F4P6',
    replacements: [
      { sku: 'GD32F130F4P6', brand: 'Gigadevice', compatibility: 'pin-compatible', notes: 'TSSOP20, бюджетная замена для STM32F030.' },
      { sku: 'HK32F030F4P6', brand: 'HKMicro', compatibility: 'pin-compatible', notes: 'Полный аналог для массовых применений.' },
    ],
  },
  {
    original: 'STM32F051R8T6',
    replacements: [
      { sku: 'GD32F150R8T6', brand: 'Gigadevice', compatibility: 'pin-compatible', notes: 'Cortex-M3 вместо M0, совместимость pin-to-pin.' },
    ],
  },

  // --- Xilinx → Gowin / Efinix ---
  {
    original: 'XC7A35T-1FTG256C',
    replacements: [
      { sku: 'GW1N-UV4PQ256C6/I5', brand: 'Gowin', compatibility: 'functional-equivalent', notes: 'Аналогичная ёмкость ~33K LUT. Требуется перекомпиляция проекта и адаптация pinout.' },
      { sku: 'ECP5-LFE5U-45F-BG381', brand: 'Lattice', compatibility: 'functional-equivalent', notes: '45K LUT, доступен без санкций. Переработка платы.' },
    ],
  },
  {
    original: 'XC7A100T-1FTG256C',
    replacements: [
      { sku: 'GW2A-18PQ256C8/I5', brand: 'Gowin', compatibility: 'functional-equivalent', notes: '20K LUT, требуется адаптация проекта.' },
      { sku: 'LFE5U-85F-BG381C', brand: 'Lattice', compatibility: 'functional-equivalent', notes: '85K LUT, без санкций. Переработка pinout.' },
    ],
  },
  {
    original: 'XC7K70T-1FBG484C',
    replacements: [
      { sku: 'GW2A-55PG484C8/I5', brand: 'Gowin', compatibility: 'functional-equivalent', notes: '55K LUT, трансиверы 6.6 Гбит/с. Требуется миграция проекта.' },
      { sku: 'ECP5-G5-LFE5UM-85F-BG381', brand: 'Lattice', compatibility: 'functional-equivalent', notes: 'С трансиверами, доступен для поставок.' },
    ],
  },
  {
    original: 'XC7K160T-1FBG484C',
    replacements: [
      { sku: 'GW2A-55PG676C8/I5', brand: 'Gowin', compatibility: 'near-equivalent', notes: 'Ёмкость ниже, может потребоваться оптимизация проекта.' },
    ],
  },
  {
    original: 'XC7S25-1CSGA225C',
    replacements: [
      { sku: 'GW1N-UV4LQ144C6/I5', brand: 'Gowin', compatibility: 'functional-equivalent', notes: 'Аналог Spartan-7 по ёмкости. Компактный корпус.' },
      { sku: 'ICE40UP5K-SG48', brand: 'Lattice', compatibility: 'functional-equivalent', notes: '5K LUT, SPI Flash, без санкций.' },
    ],
  },
  {
    original: 'XC6SLX9-2TQG144C',
    replacements: [
      { sku: 'GW1N-UV9LQ144C6/I5', brand: 'Gowin', compatibility: 'functional-equivalent', notes: 'Замена Spartan-6. Аналогичная ёмкость, перекомпиляция проекта.' },
      { sku: 'ICE40HX4K-TQ144', brand: 'Lattice', compatibility: 'near-equivalent', notes: '3.5K LUT, может быть недостаточно для некоторых проектов Spartan-6.' },
    ],
  },

  // --- Intel/Altera → Gowin / Lattice ---
  {
    original: 'EP4CE6E22C8N',
    replacements: [
      { sku: 'GW1N-UV4PQ100C6/I5', brand: 'Gowin', compatibility: 'functional-equivalent', notes: 'Аналог Cyclone IV по ёмкости. Перекомпиляция и адаптация pinout.' },
      { sku: 'LFE5U-12F-BG256C', brand: 'Lattice', compatibility: 'functional-equivalent', notes: '12K LUT, доступен без ограничений.' },
    ],
  },
  {
    original: 'EP4CE15E22C8N',
    replacements: [
      { sku: 'GW1N-UV9PQ100C6/I5', brand: 'Gowin', compatibility: 'functional-equivalent', notes: '9K LUT, замена Cyclone IV 15K LE.' },
    ],
  },
  {
    original: '5CEFA2F23C8N',
    replacements: [
      { sku: 'GW2A-18PQ256C8/I5', brand: 'Gowin', compatibility: 'functional-equivalent', notes: 'Замена Cyclone V SoC. Без ARM-ядра, потребуется внешний процессор.' },
      { sku: 'LFE5U-25F-BG381C', brand: 'Lattice', compatibility: 'functional-equivalent', notes: '25K LUT, без процессорного ядра.' },
    ],
  },
  {
    original: '5CGXFC5C6U11C8N',
    replacements: [
      { sku: 'GW2A-55PG484C8/I5', brand: 'Gowin', compatibility: 'near-equivalent', notes: '55K LUT с трансиверами. Замена Cyclone V GX.' },
    ],
  },

  // --- TI → Monolithic Power / аналоги ---
  {
    original: 'TPS5430DDAR',
    replacements: [
      { sku: 'MP1584EN-LF-Z', brand: 'Monolithic Power', compatibility: 'pin-compatible', notes: '3 А, 4.5–28 В, частота 1.5 МГц. Совместим по функциональности, отличается pinout.' },
      { sku: 'TL2575-33IKVUR', brand: 'Texas Instruments', compatibility: 'functional-equivalent', notes: 'Аналог LM2596, может заменить TPS5430 с изменением обвязки.' },
    ],
  },
  {
    original: 'TPS54331DR',
    replacements: [
      { sku: 'MP8759GD-Z', brand: 'Monolithic Power', compatibility: 'functional-equivalent', notes: '5 А, 4.5–18 В. Требуется переработка обвязки.' },
    ],
  },
  {
    original: 'TPS563200DDCR',
    replacements: [
      { sku: 'MP2143GD-Z', brand: 'Monolithic Power', compatibility: 'functional-equivalent', notes: '3 А, 4.5–16 В, 500 кГц. Аналогичный форм-фактор SOT-23-6.' },
      { sku: 'SY8120BABC', brand: 'Silergy', compatibility: 'pin-compatible', notes: '3 А, 4.5–18 В, совместим по выводам SOT-23-6.' },
    ],
  },
  {
    original: 'LM2596S-5.0',
    replacements: [
      { sku: 'MP1584EN-LF-Z', brand: 'Monolithic Power', compatibility: 'functional-equivalent', notes: 'Выше частота, меньше габариты индуктивности. Переработка обвязки.' },
      { sku: 'XL2596S-5.0E1', brand: 'XLSEMI', compatibility: 'pin-compatible', notes: 'Прямой клон LM2596, pin-to-pin совместим в TO-263.' },
    ],
  },
  {
    original: 'LM2596S-3.3',
    replacements: [
      { sku: 'XL2596S-3.3E1', brand: 'XLSEMI', compatibility: 'pin-compatible', notes: 'Прямой клон LM2596-3.3, pin-to-pin.' },
      { sku: 'MP1584EN-LF-Z', brand: 'Monolithic Power', compatibility: 'functional-equivalent', notes: 'Требуется переработка обвязки.' },
    ],
  },
  {
    original: 'AMS1117-3.3',
    replacements: [
      { sku: 'TLV1117LV33DCYR', brand: 'Texas Instruments', compatibility: 'pin-compatible', notes: 'SOT-223, совместим по выводам. Ниже падение напряжения.' },
      { sku: 'LD1117S33TR', brand: 'STMicroelectronics', compatibility: 'pin-compatible', notes: 'Прямой аналог в SOT-223.' },
      { sku: 'RT9193-33GB', brand: 'Richtek', compatibility: 'pin-compatible', notes: 'SOT-23-3, компактнее. Ток до 300 мА.' },
      { sku: 'XC6206P332MR', brand: 'Torex', compatibility: 'functional-equivalent', notes: 'SOT-23, 300 мА, ультранизкий Iq.' },
    ],
  },

  // --- Операционные усилители ---
  {
    original: 'LM358DR',
    replacements: [
      { sku: 'MCP6002-I/SN', brand: 'Microchip', compatibility: 'pin-compatible', notes: 'Совместим по выводам SOIC-8, но питание 1.8–6 В (не 32 В).' },
      { sku: 'LM358PSR', brand: 'onsemi', compatibility: 'pin-compatible', notes: 'Прямой аналог от onsemi.' },
      { sku: 'TS358CDT', brand: 'STMicroelectronics', compatibility: 'pin-compatible', notes: 'Полный аналог LM358 от ST.' },
    ],
  },
  {
    original: 'OPA2134PA',
    replacements: [
      { sku: 'NE5532P', brand: 'Texas Instruments', compatibility: 'near-equivalent', notes: 'Бюджетная замена для аудио. Выше шум, ниже цена.' },
      { sku: 'LME49720NA', brand: 'Texas Instruments', compatibility: 'pin-compatible', notes: 'Высококачественный аудио ОУ, pin-to-pin.' },
    ],
  },
  {
    original: 'LM324DR',
    replacements: [
      { sku: 'TS324CDT', brand: 'STMicroelectronics', compatibility: 'pin-compatible', notes: 'Счетверённый ОУ, полный аналог LM324.' },
      { sku: 'MCP6004-I/SL', brand: 'Microchip', compatibility: 'near-equivalent', notes: 'Совместим по выводам, но питание до 6 В.' },
    ],
  },
  {
    original: 'TL072CDR',
    replacements: [
      { sku: 'TL072ACDR', brand: 'Texas Instruments', compatibility: 'pin-compatible', notes: 'Обновлённая версия с лучшими параметрами.' },
      { sku: 'RC4558DR', brand: 'onsemi', compatibility: 'near-equivalent', notes: 'Биполярный вход, совместим по выводам.' },
    ],
  },

  // --- Оптопары ---
  {
    original: 'PC817C',
    replacements: [
      { sku: 'SFH615A-3', brand: 'Vishay', compatibility: 'pin-compatible', notes: 'DIP-4, аналогичный CTR. Совместим по выводам.' },
      { sku: 'TLP521-3', brand: 'Toshiba', compatibility: 'pin-compatible', notes: 'Прямой аналог PC817, DIP-4.' },
      { sku: 'EL817C', brand: 'Everlight', compatibility: 'pin-compatible', notes: 'Клон PC817, широко доступен.' },
    ],
  },
  {
    original: 'HCPL-2631',
    replacements: [
      { sku: 'TLP2745', brand: 'Toshiba', compatibility: 'functional-equivalent', notes: 'Быстродействующая оптопара, отличающийся pinout.' },
      { sku: '6N137', brand: 'Vishay', compatibility: 'functional-equivalent', notes: '10 Мбит/с, совместим по функциональности.' },
    ],
  },

  // --- Интерфейсы ---
  {
    original: 'FT232RL',
    replacements: [
      { sku: 'CP2102N-A02-GQFN24', brand: 'Silicon Labs', compatibility: 'functional-equivalent', notes: 'USB-UART, QFN-24. Отличающийся pinout, переработка платы.' },
      { sku: 'CH340G', brand: 'WCH', compatibility: 'functional-equivalent', notes: 'Бюджетная замена, драйверы для всех ОС. SOIC-16.' },
      { sku: 'CH9102F', brand: 'WCH', compatibility: 'functional-equivalent', notes: 'Компактная замена FT232R, QFN-16.' },
    ],
  },
  {
    original: 'SP3485EN',
    replacements: [
      { sku: 'MAX3485ECSA', brand: 'Analog Devices', compatibility: 'pin-compatible', notes: 'SOIC-8, 3.3 В RS-485. Совместим по выводам.' },
      { sku: 'SN65HVD75DR', brand: 'Texas Instruments', compatibility: 'pin-compatible', notes: '3.3 В RS-485, SOIC-8, совместим по выводам.' },
      { sku: 'CH485E', brand: 'WCH', compatibility: 'pin-compatible', notes: 'Совместим по выводам с SP3485.' },
    ],
  },
  {
    original: 'MCP2515-I/SO',
    replacements: [
      { sku: 'MCP2518FD-I/SO', brand: 'Microchip', compatibility: 'upgrade', notes: 'CAN FD контроллер, обратная совместимость с MCP2515.' },
      { sku: 'SJA1000T', brand: 'NXP', compatibility: 'functional-equivalent', notes: 'Классический CAN-контроллер, отличный интерфейс.' },
    ],
  },

  // --- ATmega → аналоги ---
  {
    original: 'ATmega328P-AU',
    replacements: [
      { sku: 'LGT8F328P-SSOP20', brand: 'LogicGreen', compatibility: 'pin-compatible', notes: 'AVR-совместимый клон, расширенная периферия. Питание 2.4–5.5 В.' },
      { sku: 'ATmega328PB-AU', brand: 'Microchip', compatibility: 'pin-compatible', notes: 'Обновлённая версия с дополнительной периферией (SPI1, UART1).' },
    ],
  },
  {
    original: 'ATmega2560-16AU',
    replacements: [
      { sku: 'ATmega2561-16AU', brand: 'Microchip', compatibility: 'near-equivalent', notes: 'Аналогичное ядро, другой корпус TQFP-64 vs TQFP-100.' },
    ],
  },

  // --- LDO / Стабилизаторы ---
  {
    original: 'LM7805CT',
    replacements: [
      { sku: 'L7805CV', brand: 'STMicroelectronics', compatibility: 'pin-compatible', notes: 'Прямой аналог 7805 в TO-220.' },
      { sku: 'MC7805ECTG', brand: 'onsemi', compatibility: 'pin-compatible', notes: 'Аналог 7805 от onsemi.' },
    ],
  },
  {
    original: 'LM317T',
    replacements: [
      { sku: 'LM317AT', brand: 'onsemi', compatibility: 'pin-compatible', notes: 'Регулируемый LDO, полный аналог.' },
      { sku: 'LD1117V33', brand: 'STMicroelectronics', compatibility: 'near-equivalent', notes: 'Фиксированный 3.3 В, совместим по корпусу TO-220.' },
    ],
  },
  {
    original: 'TLV1117LV33DCYR',
    replacements: [
      { sku: 'RT9193-33GB', brand: 'Richtek', compatibility: 'pin-compatible', notes: 'SOT-23-3, 300 мА, низкое падение.' },
      { sku: 'AMS1117-3.3', brand: 'AMS', compatibility: 'pin-compatible', notes: 'SOT-223, 1 А, совместим по функциональности.' },
    ],
  },

  // --- MOSFET ---
  {
    original: 'IRF3205PBF',
    replacements: [
      { sku: 'IRF3205STRRPBF', brand: 'Infineon', compatibility: 'pin-compatible', notes: 'D2PAK вариант, тот же кристалл.' },
      { sku: 'IRLZ44NPBF', brand: 'Infineon', compatibility: 'near-equivalent', notes: 'Логический уровень затвора, ниже Vgs(th).' },
    ],
  },
  {
    original: 'IRF540NPBF',
    replacements: [
      { sku: 'IRL540NPBF', brand: 'Infineon', compatibility: 'near-equivalent', notes: 'Логический уровень затвора, аналогичные параметры.' },
      { sku: 'STP55NF06L', brand: 'STMicroelectronics', compatibility: 'functional-equivalent', notes: '60 В, 50 А, логический уровень.' },
    ],
  },
  {
    original: 'AO3400A',
    replacements: [
      { sku: 'SI2302DS', brand: 'Vishay', compatibility: 'pin-compatible', notes: 'SOT-23 N-CH MOSFET, аналогичные параметры.' },
      { sku: '2N7002K', brand: 'onsemi', compatibility: 'near-equivalent', notes: 'SOT-23, ниже ток, но совместим по цоколёвке.' },
    ],
  },

  // --- Конденсаторы / Пассивные ---
  {
    original: 'GRM21BR71C104KA01',
    replacements: [
      { sku: 'CL21B104KBCNNNC', brand: 'Samsung', compatibility: 'functional-equivalent', notes: '0805, 100 нФ, 16 В, X7R. Полный аналог MLCC.' },
      { sku: 'C0805C104K5RACTU', brand: 'KEMET', compatibility: 'functional-equivalent', notes: '0805, 100 нФ, 50 В, X7R.' },
    ],
  },

  // --- Датчики ---
  {
    original: 'ADXL345BCCZ',
    replacements: [
      { sku: 'LIS3DHTR', brand: 'STMicroelectronics', compatibility: 'functional-equivalent', notes: '3-осевой акселерометр, отличается интерфейс и регистры.' },
      { sku: 'MC3416', brand: 'mCube', compatibility: 'functional-equivalent', notes: '3-осевой акселерометр, I2C/SPI.' },
    ],
  },
  {
    original: 'VL53L0XV0DH/1',
    replacements: [
      { sku: 'VL53L1CBV0DH/1', brand: 'STMicroelectronics', compatibility: 'upgrade', notes: 'Обновлённая версия ToF-датчика, дальность до 4 м.' },
    ],
  },
];

// ---------------------------------------------------------------------------
// 3. brandFamilyMap — Бренды и семейства продукции
// ---------------------------------------------------------------------------

export const brandFamilyMap: BrandEntry[] = [
  {
    brand: 'STMicroelectronics',
    slug: 'stmicroelectronics',
    country: 'Швейцария',
    description: 'Один из крупнейших производителей полупроводниковых компонентов. Лидер в сегменте микроконтроллеров STM32, силовой электроники и датчиков.',
    families: [
      { name: 'STM32F0', description: 'Бюджетные ARM Cortex-M0 для массовых применений', keyParts: ['STM32F030F4P6', 'STM32F051R8T6', 'STM32F091RCT6'] },
      { name: 'STM32F1', description: 'ARM Cortex-M3, 72 МГц — классика промышленных применений', keyParts: ['STM32F103C8T6', 'STM32F103RBT6', 'STM32F103VET6', 'STM32F103ZET6'] },
      { name: 'STM32F4', description: 'ARM Cortex-M4F, 168 МГц, DSP — цифровая обработка сигналов', keyParts: ['STM32F407VGT6', 'STM32F429ZIT6', 'STM32F446RET6'] },
      { name: 'STM32H7', description: 'ARM Cortex-M7, 480 МГц — максимальная производительность', keyParts: ['STM32H743VIT6', 'STM32H750VBT6', 'STM32H747XIHX'] },
      { name: 'STM32L4', description: 'ARM Cortex-M4, ультранизкое потребление', keyParts: ['STM32L476RGT6', 'STM32L432KCU6'] },
      { name: 'STM32G4', description: 'ARM Cortex-M4, аналоговая периферия и DSP', keyParts: ['STM32G474RET6', 'STM32G431KBU6'] },
      { name: 'MDmesh', description: 'Высоковольтные силовые MOSFET', keyParts: ['STW88N150', 'STF12NM50N'] },
      { name: 'VL53L0X/L1X', description: 'ToF-датчики расстояния', keyParts: ['VL53L0X', 'VL53L1CB'] },
    ],
  },
  {
    brand: 'Texas Instruments',
    slug: 'texas-instruments',
    country: 'США',
    description: 'Крупнейший производитель аналоговых микросхем и встраиваемых процессоров. Широкая номенклатура от LDO до DSP.',
    families: [
      { name: 'TPS54xxx', description: 'Импульсные понижающие DC-DC преобразователи', keyParts: ['TPS5430DDAR', 'TPS54331DR', 'TPS563200DDCR', 'TPS54560BDDA'] },
      { name: 'Simple Switcher', description: 'Простые импульсные стабилизаторы LM2596/LM2678', keyParts: ['LM2596S-5.0', 'LM2596S-3.3', 'LM2678S-5.0'] },
      { name: 'OPAxxx', description: 'Прецизионные операционные усилители', keyParts: ['OPA2134PA', 'OPA277UA', 'OPA2340PA'] },
      { name: 'ADSxxxx', description: 'Высокоточные АЦП', keyParts: ['ADS1115IDGSR', 'ADS1256IDBR', 'ADS1220IPWR'] },
      { name: 'MSP430', description: 'Ультранизкопотребляющие 16-битные микроконтроллеры', keyParts: ['MSP430G2553IPW20', 'MSP430F5529IPZR'] },
      { name: 'C2000', description: 'DSP для управления моторами и силовой электроникой', keyParts: ['TMS320F28335PGFA', 'TMS320F28069MPZT'] },
      { name: 'SN74xx', description: 'Логические микросхемы 74-й серии', keyParts: ['SN74HC595N', 'SN74HC138N', 'SN74LVC1G04DBVR'] },
    ],
  },
  {
    brand: 'Infineon',
    slug: 'infineon',
    country: 'Германия',
    description: 'Европейский лидер силовой электроники. MOSFET OptiMOS, IGBT, датчики Холла, микроконтроллеры XMC и AURIX.',
    families: [
      { name: 'OptiMOS', description: 'N-канальные MOSFET низкого напряжения с минимальным Rds(on)', keyParts: ['BSC010NE2LS5', 'IPB044N15N5', 'BSC014N04LS5'] },
      { name: 'StrongIRFET', description: 'Надёжные MOSFET для тяжёлых режимов', keyParts: ['IRF3205PBF', 'IRFZ44NPBF', 'IRL540NPBF'] },
      { name: 'CoolMOS', description: 'Супер-переходные MOSFET для высоковольтных применений', keyParts: ['IPW60R099CPA', 'IPA60R120P7'] },
      { name: 'XMC', description: '32-битные микроконтроллеры ARM Cortex-M для промышленности', keyParts: ['XMC4500F144K1024', 'XMC4700F144K2048'] },
      { name: 'AURIX', description: 'Многоядерные микроконтроллеры для автомобилестроения (ASIL-D)', keyParts: ['TC297TA128F300S', 'TC377TA160F300S'] },
      { name: 'TLE5012B', description: 'Магнитные датчики угла поворота', keyParts: ['TLE5012BE1000'] },
    ],
  },
  {
    brand: 'Xilinx',
    slug: 'xilinx',
    country: 'США (AMD)',
    description: 'Лидер рынка FPGA и SoC. Семейства Spartan, Artix, Kintex, Virtex, Zynq. Под санкциями для РФ.',
    families: [
      { name: 'Spartan-7', description: 'Бюджетные FPGA в компактных корпусах', keyParts: ['XC7S25-1CSGA225C', 'XC7S50-1FGGA484C'] },
      { name: 'Artix-7', description: 'Оптимальное соотношение цена/производительность', keyParts: ['XC7A35T-1FTG256C', 'XC7A100T-1FTG256C', 'XC7A200T-1FBG484C'] },
      { name: 'Kintex-7', description: 'Средний класс с высокоскоростными трансиверами', keyParts: ['XC7K70T-1FBG484C', 'XC7K160T-1FBG484C', 'XC7K325T-1FFG900C'] },
      { name: 'Zynq-7000', description: 'SoC: ARM Cortex-A9 + FPGA на одном кристалле', keyParts: ['XC7Z010-1CLG400C', 'XC7Z020-1CLG484C', 'XC7Z045-2FFG900C'] },
      { name: 'Zynq UltraScale+', description: 'SoC: ARM Cortex-A53 + FPGA, 16 нм', keyParts: ['XCZU7EV-2FFVC1156E', 'XCZU3CG-1SBVA484E'] },
    ],
  },
  {
    brand: 'Intel/Altera',
    slug: 'altera',
    country: 'США (Intel)',
    description: 'Второй крупнейший производитель FPGA. Семейства Cyclone, Arria, Stratix. Под санкциями для РФ.',
    families: [
      { name: 'Cyclone IV', description: 'Бюджетные FPGA 60 нм, широко применяемые в промышленности', keyParts: ['EP4CE6E22C8N', 'EP4CE15E22C8N', 'EP4CE30F23C8N'] },
      { name: 'Cyclone V', description: 'FPGA 28 нм с опциональным ARM Cortex-A9', keyParts: ['5CEFA2F23C8N', '5CGXFC5C6U11C8N', '5CSEMA5U23C6N'] },
      { name: 'Cyclone 10 LP', description: 'Бюджетные FPGA без трансиверов', keyParts: ['10CL016YU256C8G', '10CL040YU484C8G'] },
      { name: 'Arria 10', description: 'Средний класс с трансиверами до 28.3 Гбит/с', keyParts: ['10AS016C4U27E2SG'] },
    ],
  },
  {
    brand: 'NXP',
    slug: 'nxp',
    country: 'Нидерланды',
    description: 'Производитель микроконтроллеров, датчиков и интерфейсных микросхем. Лидер в автомобильной электронике и безопасных подключениях.',
    families: [
      { name: 'LPC', description: 'ARM Cortex-M микроконтроллеры для промышленности', keyParts: ['LPC1768FBD100', 'LPC54616J512BD208', 'LPC845M301JBD48'] },
      { name: 'i.MX', description: 'Процессоры приложений для HMI и IoT', keyParts: ['MCIMX6G2CVM05AB', 'MCIMXRT1052DVL6B'] },
      { name: 'MPX', description: 'Датчики давления для промышленности', keyParts: ['MPX5100DP', 'MPX5010DP'] },
      { name: 'S32K', description: 'Автомобильные ARM Cortex-M4F/M33', keyParts: ['S32K144WAVTLLQ48', 'S32K148UAVTLLQ100'] },
    ],
  },
  {
    brand: 'Microchip',
    slug: 'microchip',
    country: 'США',
    description: 'Производитель микроконтроллеров PIC, AVR (ATmega), SAM и аналоговых компонентов. Широкая доступность.',
    families: [
      { name: 'ATmega', description: '8-битные AVR микроконтроллеры, основа Arduino', keyParts: ['ATmega328P-AU', 'ATmega2560-16AU', 'ATmega168PA-AU'] },
      { name: 'PIC18', description: '8-битные микроконтроллеры для legacy-проектов', keyParts: ['PIC18F4550-I/PT', 'PIC18F26K83-I/SO'] },
      { name: 'SAM D/E', description: '32-битные ARM Cortex-M0+/M4', keyParts: ['ATSAMD21G18A-AU', 'ATSAME54P20A-AU'] },
      { name: 'MCP25xx', description: 'CAN-контроллеры и трансиверы', keyParts: ['MCP2515-I/SO', 'MCP2551-I/SN', 'MCP2518FD-I/SO'] },
      { name: 'MCP47xx', description: 'ЦАП с I2C интерфейсом', keyParts: ['MCP4725A0T-E/CH', 'MCP47CVB02-E/MG'] },
      { name: 'MCP60xx', description: 'Операционные усилители с однополярным питанием', keyParts: ['MCP6002-I/SN', 'MCP6004-I/SL'] },
    ],
  },
  {
    brand: 'Analog Devices',
    slug: 'analog-devices',
    country: 'США',
    description: 'Лидер высокоточных аналоговых компонентов. АЦП, ЦАП, ОУ, инструментальные усилители, изоляторы.',
    families: [
      { name: 'AD7xxx', description: 'Высокоточные АЦП для измерительных систем', keyParts: ['AD7689BCPZ', 'AD7691BCPZ', 'AD7606CSTZ'] },
      { name: 'AD8xxx', description: 'Прецизионные операционные и инструментальные усилители', keyParts: ['AD8512ARZ', 'AD8422ARZ', 'AD8429ARZ'] },
      { name: 'ADXL', description: '3-осевые акселерометры', keyParts: ['ADXL345BCCZ', 'ADXL362BCCZ'] },
      { name: 'iCoupler', description: 'Цифровые изоляторы', keyParts: ['ADuM1201ARZ', 'ADuM3210ARZ', 'ADuM4160BRWZ'] },
      { name: 'LTxxxx', description: 'Линейные LDO и импульсные стабилизаторы (бывш. Linear Tech)', keyParts: ['LT1084CT5', 'LT1763CS8-3.3', 'LT8610EUDE'] },
    ],
  },
  {
    brand: 'Renesas',
    slug: 'renesas',
    country: 'Япония',
    description: 'Японский производитель микроконтроллеров (RA, RX, RL78) и силовых драйверов. Включает бывш. Intersil и IDT.',
    families: [
      { name: 'RA', description: 'ARM Cortex-M микроконтроллеры с безопасностью', keyParts: ['R7FA6M5BH2CBG', 'R7FA2E1A72DNK'] },
      { name: 'RX', description: '32-битные микроконтроллеры собственной архитектуры', keyParts: ['R5F5631EDDFP', 'R5F5651EADFP'] },
      { name: 'RL78', description: '16-битные ультранизкопотребляющие микроконтроллеры', keyParts: ['R5F104BGAFA', 'R5F100LJASB'] },
      { name: 'ISL9xxxx', description: 'Импульсные стабилизаторы и контроллеры питания (бывш. Intersil)', keyParts: ['ISL91127IRTNZ', 'ISL8018IRTAJZ'] },
    ],
  },
  {
    brand: 'Lattice',
    slug: 'lattice',
    country: 'США',
    description: 'Производитель энергоэффективных FPGA. iCE40, ECP5, MachXO — доступны для поставок в РФ без санкций.',
    families: [
      { name: 'iCE40', description: 'Ультранизкопотребляющие FPGA с SPI конфигурацией', keyParts: ['ICE40UP5K-SG48', 'ICE40HX1K-VQ100', 'ICE40LP384-SW32'] },
      { name: 'ECP5', description: 'FPGA среднего класса для коммуникаций и видео', keyParts: ['LFE5U-12F-BG256C', 'LFE5U-25F-BG381C', 'LFE5U-45F-BG381C', 'LFE5U-85F-BG381C'] },
      { name: 'MachXO2/3', description: 'CPLD/FPGA для загрузки, интерфейсов и управления питанием', keyParts: ['LCMXO2-1200ZE-1TG100C', 'LCMXO3LF-4300C-5BG256C'] },
      { name: 'CrossLink-NX', description: 'FPGA для видеомостов с MIPI CSI-2', keyParts: ['LIFCL-40-9BG256CES'] },
    ],
  },
  {
    brand: 'onsemi',
    slug: 'onsemi',
    country: 'США',
    description: 'Производитель силовых MOSFET, IGBT, диодов и драйверов. Super-Junction и FET технологии для силовой электроники.',
    families: [
      { name: 'Super-Junction MOSFET', description: 'Высоковольтные MOSFET для PFC и источников питания', keyParts: ['FCH47N60F', 'FGA25N120ANTD'] },
      { name: 'DT/MC', description: 'Драйверы затвора IGBT и MOSFET', keyParts: ['NCP5111DR2G', 'NCV5111DR2G'] },
      { name: 'FSB/FSQ', description: 'Интегральные контроллеры FPS для AC-DC', keyParts: ['FSQ0565RLDTU', 'FSQ0765RLDTU'] },
      { name: 'CAT24C', description: 'EEPROM память I2C', keyParts: ['CAT24C256WI-GT3', 'CAT24C128LI-GT3'] },
    ],
  },
  {
    brand: 'Nordic Semiconductor',
    slug: 'nordic',
    country: 'Норвегия',
    description: 'Специализированный производитель BLE-чипов и модулей для IoT и носимых устройств.',
    families: [
      { name: 'nRF52', description: 'BLE 5.x микроконтроллеры ARM Cortex-M4F', keyParts: ['NRF52832-QFAA-R', 'NRF52840-QIAA-R', 'NRF52810-QCAA-R'] },
      { name: 'nRF53', description: 'Двухъядерные BLE 5.x + ARM Cortex-M33', keyParts: ['NRF5340-QKIAA-R'] },
      { name: 'nRF24L01+', description: 'Трансиверы 2.4 ГГц для проприетарных протоколов', keyParts: ['NRF24L01P-S'] },
    ],
  },
  {
    brand: 'Gigadevice',
    slug: 'gigadevice',
    country: 'Китай',
    description: 'Китайский производитель микроконтроллеров GD32 (аналоги STM32), SPI Flash и SRAM. Доступны без санкционных ограничений.',
    families: [
      { name: 'GD32F1', description: 'ARM Cortex-M3, аналог STM32F1, до 108 МГц', keyParts: ['GD32F103C8T6', 'GD32F103RBT6', 'GD32F103VET6'] },
      { name: 'GD32F4', description: 'ARM Cortex-M4F, аналог STM32F4, до 168 МГц', keyParts: ['GD32F407VGT6', 'GD32F450ZKT6'] },
      { name: 'GD32E23', description: 'ARM Cortex-M23, бюджетная замена STM32F0/G0', keyParts: ['GD32E230C8T6', 'GD32E230F8P6'] },
      { name: 'GD25Q', description: 'SPI NOR Flash для хранения прошивок', keyParts: ['GD25Q16CSIG', 'GD25Q32CSIG', 'GD25Q128CSIG'] },
    ],
  },
  {
    brand: 'Murata',
    slug: 'murata',
    country: 'Япония',
    description: 'Лидер производства MLCC-конденсаторов, ЭМС-фильтров, DC-DC модулей и беспроводных модулей.',
    families: [
      { name: 'GRM', description: 'Керамические MLCC-конденсаторы для развязки и фильтрации', keyParts: ['GRM21BR71C104KA01', 'GRM188R71C104KA01', 'GRM32ER71H106KA12'] },
      { name: 'NFE', description: 'ЭМС-фильтры для подавления помех', keyParts: ['NFE61PT472C1H9L', 'BLM21PG221SN1D'] },
      { name: 'MYA/MGJ', description: 'Изолированные DC-DC модули питания', keyParts: ['MYA1S1205A', 'MGJ2S121205MC'] },
    ],
  },
  {
    brand: 'TDK',
    slug: 'tdk',
    country: 'Япония',
    description: 'Производитель конденсаторов, индуктивностей, варисторов и пьезоэлектрических компонентов (бренды TDK и EPCOS).',
    families: [
      { name: 'C Series MLCC', description: 'Керамические конденсаторы для развязки', keyParts: ['C0805C104K5RACTU', 'C0603C104K5RAC7867'] },
      { name: 'B3267x', description: 'Плёночные конденсаторы EPCOS для силовой электроники', keyParts: ['B32672A6104K000', 'B32678A6475K000'] },
      { name: 'SMD Inductors', description: 'Катушки индуктивности для DC-DC', keyParts: ['SLF7032T-220M4R0-3', 'SLF10145T-220M4R2PF'] },
      { name: 'EPCOS Varistors', description: 'Варисторы для защиты от перенапряжения', keyParts: ['B72207S0271K101', 'B72214S0231K101'] },
    ],
  },
  {
    brand: 'Vishay',
    slug: 'vishay',
    country: 'США',
    description: 'Один из крупнейших производителей дискретных полупроводников и пассивных компонентов: MOSFET, диоды, резисторы, оптопары.',
    families: [
      { name: 'SiSxxx/SiHxxx', description: 'N-канальные MOSFET TrenchFET для коммутации', keyParts: ['SiS412DN', 'SiS416DN', 'SiHFA40P30-3E3'] },
      { name: 'SFH', description: 'Оптопары и ИК-компоненты', keyParts: ['SFH615A-3', 'SFH617A-3'] },
      { name: 'Dale Resistors', description: 'Прецизионные тонкоплёночные резисторы', keyParts: ['CRCW0402100KFKED', 'Y145310K0000T9L'] },
      { name: 'SSxx', description: 'Диоды Шоттки для выпрямления', keyParts: ['SS24-E3/57T', 'SS34-E3/57T', 'SS54-E3/57T'] },
    ],
  },
  {
    brand: 'Wurth Elektronik',
    slug: 'wurth-elektronik',
    country: 'Германия',
    description: 'Производитель индуктивностей, разъёмов, ЭМС-компонентов и модулей питания для промышленной электроники.',
    families: [
      { name: 'WE-PD', description: 'Силовые индуктивности для DC-DC преобразователей', keyParts: ['7447711100', '7447709100', '7447789004'] },
      { name: 'WR-BHD', description: 'Board-to-Board разъёмы для модульных систем', keyParts: ['6100XX2118121', '6103XX1833211'] },
      { name: 'WE-CFW', description: 'ЭМС-фильтры для подавления помех', keyParts: ['744821110', '744821220'] },
      { name: 'MagI³C', description: 'Изолированные DC-DC модули питания', keyParts: ['173010578', '173950336'] },
    ],
  },
  {
    brand: 'Broadcom',
    slug: 'broadcom',
    country: 'США',
    description: 'Производитель оптоэлектронных компонентов, интерфейсных микросхем и решений для хранения данных.',
    families: [
      { name: 'HCPL', description: 'Быстродействующие оптопары для передачи данных', keyParts: ['HCPL-2631', 'HCPL-2531', 'HCPL-0601'] },
      { name: 'ACSL', description: 'Транзисторные оптопары для гальванической развязки', keyParts: ['ACSL-6400-00RE', 'ACSL-7211-00RW'] },
      { name: 'AFBR', description: 'Оптические трансиверы для волоконно-оптических линий', keyParts: ['AFBR-57R5AEZ', 'AFBR-709DMZ'] },
    ],
  },
];

// ---------------------------------------------------------------------------
// 4. obsoleteComponents — Снятые с производства / не рекомендованные
// ---------------------------------------------------------------------------

export const obsoleteComponents: ObsoleteComponent[] = [
  {
    sku: 'XC3S200A-4VQG100C',
    name: 'FPGA Spartan-3A, 200K вентилей',
    status: 'obsolete',
    replacementSuggestion: 'XC7S25-1CSGA225C (Spartan-7) или GW1N-UV4LQ144C6/I5 (Gowin)',
    lastBuyDate: '2022-06-30',
    notes: 'Серия Spartan-3/A/AN/AN/E полностью снята. Рекомендуется миграция на Spartan-7 или Gowin GW1N.',
  },
  {
    sku: 'XC3S400-4PQG208C',
    name: 'FPGA Spartan-3, 400K вентилей',
    status: 'obsolete',
    replacementSuggestion: 'XC7A35T-1FTG256C (Artix-7) или GW1N-UV9LQ144C6/I5 (Gowin)',
    lastBuyDate: '2021-12-31',
    notes: 'Spartan-3 полностью EOL. Рекомендуется Artix-7 или Gowin GW1N.',
  },
  {
    sku: 'XC6SLX9-2TQG144C',
    name: 'FPGA Spartan-6, 9K логических ячеек',
    status: 'not-recommended',
    replacementSuggestion: 'XC7S25-1CSGA225C (Spartan-7) или GW1N-UV4LQ144C6/I5 (Gowin)',
    lastBuyDate: '2025-12-31',
    notes: 'Spartan-6 не рекомендован для новых проектов (NRND). Производство прекращено, остатки на складах.',
  },
  {
    sku: 'XC6SLX16-2CSG225C',
    name: 'FPGA Spartan-6, 16K логических ячеек',
    status: 'not-recommended',
    replacementSuggestion: 'XC7A35T-1FTG256C (Artix-7) или GW1N-UV9LQ144C6/I5 (Gowin)',
    lastBuyDate: '2025-12-31',
    notes: 'NRND. Для новых проектов использовать Artix-7 или Gowin GW1N.',
  },
  {
    sku: 'EP3C5E144C8N',
    name: 'FPGA Cyclone III, 5K LE',
    status: 'obsolete',
    replacementSuggestion: '10CL016YU256C8G (Cyclone 10 LP) или GW1N-UV4PQ100C6/I5 (Gowin)',
    lastBuyDate: '2021-03-31',
    notes: 'Cyclone III полностью снят с производства. Рекомендуется Cyclone 10 LP или Gowin.',
  },
  {
    sku: 'EP3C16E144C8N',
    name: 'FPGA Cyclone III, 16K LE',
    status: 'obsolete',
    replacementSuggestion: '10CL016YU256C8G (Cyclone 10 LP) или GW1N-UV9PQ100C6/I5 (Gowin)',
    lastBuyDate: '2021-03-31',
    notes: 'Cyclone III EOL. Замена на Cyclone 10 LP или Gowin с перекомпиляцией проекта.',
  },
  {
    sku: 'EP4CE6E22C8N',
    name: 'FPGA Cyclone IV, 6K LE',
    status: 'not-recommended',
    replacementSuggestion: '10CL016YU256C8G (Cyclone 10 LP) или GW1N-UV4PQ100C6/I5 (Gowin)',
    lastBuyDate: '2027-01-01',
    notes: 'Cyclone IV в статусе NRND. Рекомендуется миграция на Cyclone 10 LP или Gowin.',
  },
  {
    sku: 'STM32F103C8T6',
    name: 'МК ARM Cortex-M3, 72 МГц, 64 КБ Flash (Value line)',
    status: 'not-recommended',
    replacementSuggestion: 'GD32F103C8T6 (Gigadevice) или HK32F103C8T6 (HKMicro)',
    lastBuyDate: '2026-06-30',
    notes: 'Санкционные ограничения для РФ. Рекомендуется переход на GD32 или HK32 — полные аналоги pin-to-pin.',
  },
  {
    sku: 'STM32F103RBT6',
    name: 'МК ARM Cortex-M3, 72 МГц, 128 КБ Flash',
    status: 'not-recommended',
    replacementSuggestion: 'GD32F103RBT6 (Gigadevice) или HK32F103RBT6 (HKMicro)',
    lastBuyDate: '2026-06-30',
    notes: 'Ограниченная доступность. GD32 — полная замена с повышенной частотой 108 МГц.',
  },
  {
    sku: 'STM32F407VGT6',
    name: 'МК ARM Cortex-M4F, 168 МГц, 1 МБ Flash',
    status: 'not-recommended',
    replacementSuggestion: 'GD32F407VGT6 (Gigadevice) или AT32F407VGT7 (Artery)',
    lastBuyDate: '2026-06-30',
    notes: 'Санкции STMicroelectronics для РФ. Artery AT32 — совместимая замена с частотой 240 МГц.',
  },
  {
    sku: 'FT232RL',
    name: 'USB-UART мост, Full-Speed',
    status: 'not-recommended',
    replacementSuggestion: 'CP2102N-A02-GQFN24 (Silicon Labs) или CH9102F (WCH)',
    lastBuyDate: '2025-12-31',
    notes: 'FTDI ограничивает поставки в РФ. CH9102F — бюджетная замена, CP2102N — качественная альтернатива.',
  },
  {
    sku: 'LM2596S-5.0',
    name: 'DC-DC Step-Down, 3 А, 5 В выход',
    status: 'not-recommended',
    replacementSuggestion: 'XL2596S-5.0E1 (XLSEMI) или MP1584EN-LF-Z (Monolithic Power)',
    lastBuyDate: '2026-06-30',
    notes: 'Оригинальный LM2596 TI ограничен для РФ. XL2596 — полный клон pin-to-pin.',
  },
  {
    sku: 'PC817C',
    name: 'Оптопара транзисторная, CTR 200-400%',
    status: 'not-recommended',
    replacementSuggestion: 'EL817C (Everlight) или SFH615A-3 (Vishay)',
    lastBuyDate: '2026-06-30',
    notes: 'Sharp PC817 ограничен. EL817C — полный клон от Everlight, широко доступен.',
  },
  {
    sku: 'ATmega328P-PU',
    name: '8-бит AVR, 32 КБ Flash, DIP-28',
    status: 'not-recommended',
    replacementSuggestion: 'LGT8F328P-SSOP20 (LogicGreen) или ATmega328PB-AU (Microchip)',
    lastBuyDate: '2027-01-01',
    notes: 'DIP-28 версия в дефиците. ATmega328PB — обновлённая версия с доп. периферией.',
  },
  {
    sku: 'SP3485EN',
    name: 'RS-485 трансивер, 3.3 В, 10 Мбит/с',
    status: 'not-recommended',
    replacementSuggestion: 'MAX3485ECSA (Analog Devices) или SN65HVD75DR (TI)',
    lastBuyDate: '2025-12-31',
    notes: 'Sipex/MaxLinear ограничивает поставки. MAX3485 — полная замена SOIC-8.',
  },
  {
    sku: 'XC7K70T-1FBG484C',
    name: 'FPGA Kintex-7, 70K логических ячеек',
    status: 'not-recommended',
    replacementSuggestion: 'GW2A-55PG484C8/I5 (Gowin) — для новых проектов',
    lastBuyDate: '2024-12-31',
    notes: 'Xilinx/AMD под санкциями для РФ. Для новых проектов — Gowin GW2A или Lattice ECP5.',
  },
  {
    sku: '5CGXFC5C6U11C8N',
    name: 'FPGA Cyclone V GX, 77K LE с трансиверами',
    status: 'not-recommended',
    replacementSuggestion: 'GW2A-55PG484C8/I5 (Gowin) или LFE5UM-85F-BG381C (Lattice)',
    lastBuyDate: '2025-06-30',
    notes: 'Intel/Altera под санкциями. Gowin GW2A — доступная альтернатива с трансиверами.',
  },
  {
    sku: 'NRF52832-QFAA-R',
    name: 'BLE 5.0 микроконтроллер, ARM Cortex-M4F',
    status: 'not-recommended',
    replacementSuggestion: 'CH582M (WCH) — BLE 5.3, RISC-V, 20 МГц',
    lastBuyDate: '2025-12-31',
    notes: 'Nordic ограничивает поставки в РФ. WCH CH582 — доступная альтернатива с RISC-V.',
  },
  {
    sku: 'ADXL345BCCZ',
    name: '3-осевой акселерометр, I2C/SPI',
    status: 'not-recommended',
    replacementSuggestion: 'LIS3DHTR (STMicroelectronics) или MC3416 (mCube)',
    lastBuyDate: '2026-01-01',
    notes: 'ADI ограничивает поставки. LIS3DH — доступная замена от ST.',
  },
  {
    sku: 'HCPL-2631',
    name: 'Быстродействующая сдвоенная оптопара, 10 Мбит/с',
    status: 'not-recommended',
    replacementSuggestion: 'TLP2745 (Toshiba) или 6N137 (Vishay)',
    lastBuyDate: '2025-12-31',
    notes: 'Broadcom ограничивает поставки. Toshiba TLP2745 — доступная альтернатива.',
  },
  {
    sku: 'MCP2551-I/SN',
    name: 'CAN-трансивер, 1 Мбит/с, 5 В',
    status: 'obsolete',
    replacementSuggestion: 'MCP2562-E/SN (Microchip) — CAN FD совместимый',
    lastBuyDate: '2020-12-31',
    notes: 'Снята с производства. MCP2562 поддерживает CAN FD и обратную совместимость.',
  },
  {
    sku: 'LM7805CT',
    name: 'Линейный стабилизатор 5 В, 1 А, TO-220',
    status: 'not-recommended',
    replacementSuggestion: 'L7805CV (STMicroelectronics) или LM7805SR (onsemi)',
    lastBuyDate: '2027-01-01',
    notes: 'Оригинальный TI LM7805 ограничен. Аналоги от ST и onsemi полностью совместимы.',
  },
];

// ---------------------------------------------------------------------------
// 5. procurementIntents — SEO-интенты для программного SEO
// ---------------------------------------------------------------------------

export const procurementIntents: ProcurementIntent[] = [
  // --- Закупочные интенты ---
  { intentPattern: 'купить {component}', targetPage: '/component/{sku}', priority: 1, intentType: 'purchase' },
  { intentPattern: '{component} купить оптом', targetPage: '/component/{sku}', priority: 1, intentType: 'purchase' },
  { intentPattern: '{component} цена', targetPage: '/component/{sku}', priority: 1, intentType: 'purchase' },
  { intentPattern: '{component} стоимость', targetPage: '/component/{sku}', priority: 2, intentType: 'purchase' },
  { intentPattern: 'заказать {component}', targetPage: '/component/{sku}', priority: 2, intentType: 'purchase' },
  { intentPattern: '{component} в наличии', targetPage: '/component/{sku}', priority: 1, intentType: 'purchase' },
  { intentPattern: '{component} со склада', targetPage: '/component/{sku}', priority: 2, intentType: 'purchase' },
  { intentPattern: 'поставка {component}', targetPage: '/component/{sku}', priority: 2, intentType: 'purchase' },
  { intentPattern: 'доставка {component}', targetPage: '/component/{sku}', priority: 2, intentType: 'purchase' },

  // --- Интенты аналогов ---
  { intentPattern: '{component} аналог', targetPage: '/analog/{sku}', priority: 1, intentType: 'analog' },
  { intentPattern: 'аналог {component}', targetPage: '/analog/{sku}', priority: 1, intentType: 'analog' },
  { intentPattern: 'замена {component}', targetPage: '/analog/{sku}', priority: 1, intentType: 'analog' },
  { intentPattern: '{component} замена', targetPage: '/analog/{sku}', priority: 1, intentType: 'analog' },
  { intentPattern: '{component} кросс-референс', targetPage: '/analog/{sku}', priority: 2, intentType: 'analog' },
  { intentPattern: '{component} импортозамещение', targetPage: '/analog/{sku}', priority: 1, intentType: 'analog' },
  { intentPattern: '{component} российский аналог', targetPage: '/analog/{sku}', priority: 1, intentType: 'analog' },
  { intentPattern: '{component} китайский аналог', targetPage: '/analog/{sku}', priority: 2, intentType: 'analog' },
  { intentPattern: 'чем заменить {component}', targetPage: '/analog/{sku}', priority: 2, intentType: 'analog' },
  { intentPattern: 'альтернатива {component}', targetPage: '/analog/{sku}', priority: 2, intentType: 'analog' },

  // --- Даташит интенты ---
  { intentPattern: '{component} даташит', targetPage: '/datasheet/{sku}', priority: 1, intentType: 'datasheet' },
  { intentPattern: '{component} datasheet', targetPage: '/datasheet/{sku}', priority: 1, intentType: 'datasheet' },
  { intentPattern: '{component} описание', targetPage: '/datasheet/{sku}', priority: 2, intentType: 'datasheet' },
  { intentPattern: '{component} характеристики', targetPage: '/datasheet/{sku}', priority: 1, intentType: 'datasheet' },
  { intentPattern: '{component} спецификация', targetPage: '/datasheet/{sku}', priority: 2, intentType: 'datasheet' },
  { intentPattern: '{component} цоколёвка', targetPage: '/datasheet/{sku}', priority: 2, intentType: 'datasheet' },
  { intentPattern: '{component} pinout', targetPage: '/datasheet/{sku}', priority: 2, intentType: 'datasheet' },

  // --- Сравнительные интенты ---
  { intentPattern: '{component1} vs {component2}', targetPage: '/compare/{slug}', priority: 1, intentType: 'comparison' },
  { intentPattern: '{component1} или {component2}', targetPage: '/compare/{slug}', priority: 2, intentType: 'comparison' },
  { intentPattern: '{component1} сравнение {component2}', targetPage: '/compare/{slug}', priority: 2, intentType: 'comparison' },
  { intentPattern: 'отличие {component1} от {component2}', targetPage: '/compare/{slug}', priority: 2, intentType: 'comparison' },

  // --- BOM-интенты ---
  { intentPattern: 'BOM {brand}', targetPage: '/brands/{slug}', priority: 1, intentType: 'bom' },
  { intentPattern: 'компоненты {brand}', targetPage: '/brands/{slug}', priority: 2, intentType: 'bom' },
  { intentPattern: 'номенклатура {brand}', targetPage: '/brands/{slug}', priority: 2, intentType: 'bom' },
  { intentPattern: '{brand} микросхемы', targetPage: '/brands/{slug}', priority: 2, intentType: 'bom' },
  { intentPattern: 'подбор компонентов {brand}', targetPage: '/brands/{slug}', priority: 2, intentType: 'bom' },

  // --- Информационные интенты ---
  { intentPattern: '{component} применение', targetPage: '/component/{sku}', priority: 3, intentType: 'info' },
  { intentPattern: '{component} обзор', targetPage: '/component/{sku}', priority: 3, intentType: 'info' },
  { intentPattern: '{component} распиновка', targetPage: '/datasheet/{sku}', priority: 3, intentType: 'info' },
  { intentPattern: 'как прошить {component}', targetPage: '/knowledge-base', priority: 3, intentType: 'info' },
  { intentPattern: '{component} программатор', targetPage: '/knowledge-base', priority: 3, intentType: 'info' },

  // --- Категорийные интенты ---
  { intentPattern: 'купить микроконтроллеры оптом', targetPage: '/arm-kontrollery', priority: 1, intentType: 'purchase' },
  { intentPattern: 'ПЛИС купить', targetPage: '/fpga', priority: 1, intentType: 'purchase' },
  { intentPattern: 'FPGA купить оптом', targetPage: '/fpga', priority: 1, intentType: 'purchase' },
  { intentPattern: 'оптопары купить', targetPage: '/optoelektronika', priority: 2, intentType: 'purchase' },
  { intentPattern: 'стабилизаторы напряжения купить', targetPage: '/stabilizatory', priority: 2, intentType: 'purchase' },
  { intentPattern: 'операционные усилители купить', targetPage: '/operatsionnye-usiliteli', priority: 2, intentType: 'purchase' },

  // --- Устаревшие компоненты ---
  { intentPattern: '{component} снят с производства', targetPage: '/obsolete', priority: 2, intentType: 'info' },
  { intentPattern: '{component} EOL', targetPage: '/obsolete', priority: 2, intentType: 'info' },
  { intentPattern: '{component} устарел', targetPage: '/obsolete', priority: 3, intentType: 'info' },
  { intentPattern: 'замена снятых компонентов', targetPage: '/obsolete', priority: 2, intentType: 'analog' },
];

// ---------------------------------------------------------------------------
// 6. comparisonGroups — Предопределённые страницы сравнения
// ---------------------------------------------------------------------------

export const comparisonGroups: ComparisonGroup[] = [
  // --- Микроконтроллеры ---
  {
    slug: 'stm32f103-vs-gd32f103',
    title: 'STM32F103 vs GD32F103 — сравнение и выбор аналога',
    components: ['STM32F103C8T6', 'GD32F103C8T6'],
    description: 'Детальное сравнение STM32F103 и GD32F103: совместимость pin-to-pin, отличия периферии, скорость работы, доступность и стоимость. GD32F103 работает на 108 МГц vs 72 МГц у STM32, но имеет отличия во Flash-задержках и некоторых периферийных блоках.',
    category: 'Микроконтроллеры',
  },
  {
    slug: 'stm32f407-vs-gd32f407',
    title: 'STM32F407 vs GD32F407 — сравнение Cortex-M4F контроллеров',
    components: ['STM32F407VGT6', 'GD32F407VGT6'],
    description: 'Сравнение высокопроизводительных Cortex-M4F микроконтроллеров: STM32F407 и GD32F407. Оба работают на 168 МГц, совместимы pin-to-pin. Отличия в USB OTG, ETH MAC и температурных диапазонах.',
    category: 'Микроконтроллеры',
  },
  {
    slug: 'stm32f103-vs-hk32f103',
    title: 'STM32F103 vs HK32F103 — бюджетный аналог от HKMicro',
    components: ['STM32F103C8T6', 'HK32F103C8T6'],
    description: 'Сравнение STM32F103 и HK32F103: HK32 — китайский аналог с pin-to-pin совместимостью. Ниже цена, доступен без санкций. Отличия в качестве документации и поддержке IDE.',
    category: 'Микроконтроллеры',
  },
  {
    slug: 'stm32f103-vs-atmega328',
    title: 'STM32F103 vs ATmega328 — 32-бит или 8-бит?',
    components: ['STM32F103C8T6', 'ATmega328P-AU'],
    description: 'Сравнение 32-битного ARM Cortex-M3 и 8-битного AVR: производительность, периферия, энергопотребление, цена. STM32 выигрывает в вычислительной мощности, ATmega — в простоте и экосистеме Arduino.',
    category: 'Микроконтроллеры',
  },
  {
    slug: 'gd32f103-vs-hk32f103',
    title: 'GD32F103 vs HK32F103 — какой китайский аналог STM32 выбрать?',
    components: ['GD32F103C8T6', 'HK32F103C8T6'],
    description: 'Сравнение двух основных китайских аналогов STM32F103: Gigadevice GD32 и HKMicro HK32. Отличия в частоте, качестве документации, стабильности поставок и цене.',
    category: 'Микроконтроллеры',
  },
  {
    slug: 'atmega328-vs-lgt8f328',
    title: 'ATmega328 vs LGT8F328 — замена AVR для Arduino-проектов',
    components: ['ATmega328P-AU', 'LGT8F328P-SSOP20'],
    description: 'Сравнение ATmega328P и LGT8F328P: LogicGreen — клон AVR с расширенной периферией (дополнительный таймер, компаратор, DAC). Совместим с Arduino IDE.',
    category: 'Микроконтроллеры',
  },

  // --- FPGA ---
  {
    slug: 'artix7-vs-cyclone5',
    title: 'Xilinx Artix-7 vs Intel Cyclone V — сравнение FPGA',
    components: ['XC7A35T-1FTG256C', '5CEFA2F23C8N'],
    description: 'Сравнение двух популярных FPGA среднего класса: Artix-7 и Cyclone V. Ёмкость, DSP, BRAM, трансиверы, доступность инструментария. Для проектов в РФ актуальна проблема санкций.',
    category: 'ПЛИС (FPGA)',
  },
  {
    slug: 'artix7-vs-ecp5',
    title: 'Xilinx Artix-7 vs Lattice ECP5 — выбор FPGA с учётом санкций',
    components: ['XC7A35T-1FTG256C', 'LFE5U-25F-BG381C'],
    description: 'Сравнение Artix-7 и ECP5 для российских разработчиков. ECP5 доступен без санкций, имеет открытый инструментарий (Yosys+nextpnr). Artix-7 превосходит по ёмкости и DSP, но ограничен поставками.',
    category: 'ПЛИС (FPGA)',
  },
  {
    slug: 'spartan7-vs-ice40',
    title: 'Xilinx Spartan-7 vs Lattice iCE40 — бюджетные FPGA',
    components: ['XC7S25-1CSGA225C', 'ICE40UP5K-SG48'],
    description: 'Сравнение бюджетных FPGA: Spartan-7 и iCE40. iCE40 поддерживает открытый инструментарий и доступен без ограничений. Spartan-7 предлагает больше ресурсов, но под санкциями.',
    category: 'ПЛИС (FPGA)',
  },
  {
    slug: 'kintex7-vs-gowin-gw2a',
    title: 'Xilinx Kintex-7 vs Gowin GW2A — замена FPGA с трансиверами',
    components: ['XC7K70T-1FBG484C', 'GW2A-55PG484C8/I5'],
    description: 'Сравнение Kintex-7 и Gowin GW2A: трансиверы, логическая ёмкость, DSP, инструменты разработки. Gowin — основная замена санкционным Xilinx для проектов с высокоскоростными интерфейсами.',
    category: 'ПЛИС (FPGA)',
  },
  {
    slug: 'cyclone4-vs-gowin-gw1n',
    title: 'Intel Cyclone IV vs Gowin GW1N — замена устаревающей FPGA',
    components: ['EP4CE6E22C8N', 'GW1N-UV4PQ100C6/I5'],
    description: 'Сравнение Cyclone IV и Gowin GW1N для замены устаревающих проектов. GW1N — доступная альтернатива с аналогичной ёмкостью и китайским производством.',
    category: 'ПЛИС (FPGA)',
  },
  {
    slug: 'ecp5-vs-gowin-gw2a',
    title: 'Lattice ECP5 vs Gowin GW2A — альтернативы FPGA среднего класса',
    components: ['LFE5U-45F-BG381C', 'GW2A-18PQ256C8/I5'],
    description: 'Сравнение двух доступных FPGA: ECP5 от Lattice и GW2A от Gowin. Обе серии доступны для поставок в РФ. Отличия в ёмкости, трансиверах, инструментальной поддержке.',
    category: 'ПЛИС (FPGA)',
  },

  // --- Стабилизаторы ---
  {
    slug: 'tps5430-vs-lm2596',
    title: 'TPS5430 vs LM2596 — какой DC-DC Step-Down выбрать?',
    components: ['TPS5430DDAR', 'LM2596S-5.0'],
    description: 'Сравнение двух классических понижающих DC-DC: TPS5430 (5.5–36 В, 3 А, 500 кГц) и LM2596 (4.5–40 В, 3 А, 150 кГц). TPS5430 компактнее за счёт более высокой частоты, LM2596 проще в обвязке.',
    category: 'Стабилизаторы',
  },
  {
    slug: 'lm2596-vs-mp1584',
    title: 'LM2596 vs MP1584 — классика против компактности',
    components: ['LM2596S-5.0', 'MP1584EN-LF-Z'],
    description: 'LM2596 (150 кГц, TO-263) vs MP1584 (1.5 МГц, SOIC-8): MP1584 позволяет использовать меньшую индуктивность и конденсаторы, уменьшая габариты платы. LM2596 — проверенное решение для простых схем.',
    category: 'Стабилизаторы',
  },
  {
    slug: 'ams1117-vs-ld1117',
    title: 'AMS1117 vs LD1117 — LDO-стабилизаторы 3.3 В',
    components: ['AMS1117-3.3', 'LD1117S33TR'],
    description: 'Сравнение двух популярных LDO: AMS1117 (AMS) и LD1117 (STMicroelectronics). Оба в SOT-223, до 1 А. LD1117 имеет лучшую стабильность при низких ESR конденсаторах.',
    category: 'Стабилизаторы',
  },
  {
    slug: 'lm7805-vs-ams1117-5v',
    title: 'LM7805 vs AMS1117-5.0 — линейные стабилизаторы 5 В',
    components: ['LM7805CT', 'AMS1117-5.0'],
    description: 'Классический 7805 (2 В падение, TO-220) vs AMS1117 (1.1 В падение, SOT-223): AMS1117 выигрывает в падении напряжения и габаритах, LM7805 — в токе и простоте.',
    category: 'Стабилизаторы',
  },

  // --- Операционные усилители ---
  {
    slug: 'lm358-vs-tl072',
    title: 'LM358 vs TL072 — выбор операционного усилителя',
    components: ['LM358DR', 'TL072CDR'],
    description: 'Сравнение LM358 (биполярный, однополярное питание 3–32 В) и TL072 (JFET-вход, двухполярное питание). LM358 — для простых схем, TL072 — для аудио и прецизионных цепей.',
    category: 'Операционные усилители',
  },
  {
    slug: 'lm358-vs-mcp6002',
    title: 'LM358 vs MCP6002 — универсальный ОУ против низковольтного',
    components: ['LM358DR', 'MCP6002-I/SN'],
    description: 'LM358 (3–32 В, 1.1 МГц) vs MCP6002 (1.8–6 В, 1 МГц): MCP6002 для батарейных устройств с низким питанием, LM358 — для промышленных схем с широким диапазоном.',
    category: 'Операционные усилители',
  },
  {
    slug: 'opa2134-vs-ne5532',
    title: 'OPA2134 vs NE5532 — аудио операционные усилители',
    components: ['OPA2134PA', 'NE5532P'],
    description: 'Сравнение аудио ОУ: OPA2134 (JFET-вход, ультранизкие искажения) и NE5532 (биполярный, классика аудио). OPA2134 — для Hi-Fi, NE5532 — для массовых аудиоустройств.',
    category: 'Операционные усилители',
  },

  // --- Интерфейсы ---
  {
    slug: 'ft232rl-vs-cp2102',
    title: 'FT232RL vs CP2102 — USB-UART мосты',
    components: ['FT232RL', 'CP2102N-A02-GQFN24'],
    description: 'Сравнение двух популярных USB-UART мостов: FT232RL (FTDI, SSOP-28) и CP2102N (Silicon Labs, QFN-24). FT232RL поддерживает Bit-Bang и FIFO, CP2102N компактнее и дешевле.',
    category: 'Интерфейсы',
  },
  {
    slug: 'ft232rl-vs-ch340',
    title: 'FT232RL vs CH340G — дорогой или бюджетный USB-UART?',
    components: ['FT232RL', 'CH340G'],
    description: 'FT232RL (FTDI, $4-6) vs CH340G (WCH, $0.30): CH340G — бюджетная альтернатива для большинства применений. FT232RL оправдан только при необходимости Bit-Bang или FIFO.',
    category: 'Интерфейсы',
  },
  {
    slug: 'sp3485-vs-max3485',
    title: 'SP3485 vs MAX3485 — RS-485 трансиверы 3.3 В',
    components: ['SP3485EN', 'MAX3485ECSA'],
    description: 'Сравнение RS-485 трансиверов: SP3485 (Sipex) и MAX3485 (Analog Devices). Оба в SOIC-8, 3.3 В, до 10 Мбит/с. MAX3485 имеет встроенную ESD-защиту ±15 кВ.',
    category: 'Интерфейсы',
  },

  // --- Оптопары ---
  {
    slug: 'pc817-vs-sfh615a',
    title: 'PC817 vs SFH615A — транзисторные оптопары',
    components: ['PC817C', 'SFH615A-3'],
    description: 'Сравнение PC817 (Sharp) и SFH615A (Vishay): оба DIP-4, аналогичный CTR. SFH615A имеет лучшую документацию и стабильность параметров от Vishay.',
    category: 'Оптоэлектроника',
  },
  {
    slug: 'pc817-vs-el817',
    title: 'PC817 vs EL817 — оригинал или клон?',
    components: ['PC817C', 'EL817C'],
    description: 'Сравнение PC817 (Sharp) и EL817C (Everlight): EL817C — полный клон с pin-to-pin совместимостью. Широко доступен и значительно дешевле оригинала.',
    category: 'Оптоэлектроника',
  },

  // --- MOSFET ---
  {
    slug: 'irf3205-vs-irlz44n',
    title: 'IRF3205 vs IRLZ44N — N-канальные MOSFET',
    components: ['IRF3205PBF', 'IRLZ44NPBF'],
    description: 'Сравнение IRF3205 (55 В, 110 А, Vgs(th) 4 В) и IRLZ44N (55 В, 47 А, Vgs(th) 1–2 В): IRLZ44N — логический уровень, управляется от 3.3/5 В МК. IRF3205 — для силовых ключей с драйвером.',
    category: 'Транзисторы',
  },
];

// ---------------------------------------------------------------------------
// Вспомогательные функции
// ---------------------------------------------------------------------------

/**
 * Найти кластер компонента по партномеру
 */
export function findCluster(sku: string): ComponentCluster | undefined {
  const normalizedSku = sku.toUpperCase().trim();
  for (const [key, cluster] of Object.entries(componentClusters)) {
    const regex = new RegExp(cluster.prefixPattern, 'i');
    if (regex.test(normalizedSku)) {
      return cluster;
    }
  }
  return undefined;
}

/**
 * Найти аналоги для компонента
 */
export function findAnalogs(sku: string): AnalogEntry | undefined {
  const normalizedSku = sku.toUpperCase().trim();
  return analogMap.find(
    (entry) => entry.original.toUpperCase() === normalizedSku
  );
}

/**
 * Найти все аналоги по бренду
 */
export function findAnalogsByBrand(brand: string): AnalogEntry[] {
  const normalizedBrand = brand.toLowerCase().trim();
  return analogMap.filter((entry) =>
    entry.replacements.some(
      (r) => r.brand.toLowerCase() === normalizedBrand
    )
  );
}

/**
 * Проверить, является ли компонент устаревшим
 */
export function isObsolete(sku: string): ObsoleteComponent | undefined {
  const normalizedSku = sku.toUpperCase().trim();
  return obsoleteComponents.find(
    (entry) => entry.sku.toUpperCase() === normalizedSku
  );
}

/**
 * Найти сравнения, содержащие указанный компонент
 */
export function findComparisons(sku: string): ComparisonGroup[] {
  const normalizedSku = sku.toUpperCase().trim();
  return comparisonGroups.filter((group) =>
    group.components.some((c) => c.toUpperCase() === normalizedSku)
  );
}

/**
 * Получить семейства бренда
 */
export function getBrandFamilies(brandSlug: string): BrandEntry | undefined {
  return brandFamilyMap.find((entry) => entry.slug === brandSlug);
}

/**
 * Найти релевантные SEO-интенты по типу
 */
export function getIntentsByType(
  intentType: ProcurementIntent['intentType']
): ProcurementIntent[] {
  return procurementIntents.filter((intent) => intent.intentType === intentType);
}

/**
 * Получить SEO-интенты с высшим приоритетом (1-2)
 */
export function getHighPriorityIntents(): ProcurementIntent[] {
  return procurementIntents
    .filter((intent) => intent.priority <= 2)
    .sort((a, b) => a.priority - b.priority);
}

/**
 * Сгенерировать URL для интента с подстановкой партномера
 */
export function resolveIntentUrl(
  intent: ProcurementIntent,
  sku: string
): string {
  return intent.targetPage
    .replace('{sku}', sku.toLowerCase())
    .replace('{slug}', sku.toLowerCase());
}

/**
 * Найти все кластеры в указанной категории
 */
export function findClustersByCategory(category: string): ComponentCluster[] {
  return Object.values(componentClusters).filter(
    (cluster) => cluster.category === category
  );
}

/**
 * Получить все уникальные категории из кластеров
 */
export function getAllCategories(): string[] {
  const categories = new Set(
    Object.values(componentClusters).map((c) => c.category)
  );
  return Array.from(categories).sort();
}

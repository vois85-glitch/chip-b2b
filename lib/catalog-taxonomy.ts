// lib/catalog-taxonomy.ts
// Таксономия каталога: группировка 30+ категорий в 5 основных разделов
// для удобной навигации. Используется в layout.tsx (sidebar) и в CatalogClient.

export type CategoryGroup = {
  id: string;
  title: string;
  icon: string;  // SVG path d-attribute (для иконки-эмодзи или svg path)
  color: string; // tailwind text-color class
  bg: string;    // tailwind bg-color class для бейджа
  description: string;
  categories: string[];  // список категорий из БД, входящих в группу
};

// ───────────────────────────────────────────────────────────────────────────────
// 5 основных разделов каталога
// ───────────────────────────────────────────────────────────────────────────────

export const CATEGORY_GROUPS: CategoryGroup[] = [
  {
    id: 'active',
    title: 'Активные компоненты',
    icon: 'chip',
    color: 'text-emerald-700',
    bg: 'bg-emerald-50',
    description: 'Микросхемы, транзисторы, диоды',
    categories: [
      'Микроконтроллеры',
      'Микросхемы',
      'ПЛИС (FPGA)',
      'Логика',
      'Операционные усилители',
      'АЦП/ЦАП',
      'Память',
      'Интерфейсы',
      'Транзисторы',
      'Диоды',
    ],
  },
  {
    id: 'passive',
    title: 'Пассивные компоненты',
    icon: 'capacitor',
    color: 'text-emerald-700',
    bg: 'bg-emerald-50',
    description: 'Конденсаторы, резисторы, индуктивности',
    categories: [
      'Конденсаторы',
      'Резисторы',
      'Индуктивности',
      'Кварцы и резонаторы',
      'Фильтры',
      'Предохранители',
      'Трансформаторы',
    ],
  },
  {
    id: 'power',
    title: 'Питание и коммутация',
    icon: 'lightning',
    color: 'text-amber-700',
    bg: 'bg-amber-50',
    description: 'Стабилизаторы, реле, питание',
    categories: [
      'Стабилизаторы',
      'Питание',
      'Реле',
      'Электроавтоматика',
    ],
  },
  {
    id: 'opto',
    title: 'Оптоэлектроника и датчики',
    icon: 'sensor',
    color: 'text-purple-700',
    bg: 'bg-purple-50',
    description: 'Оптроны, LED, дисплеи, датчики',
    categories: [
      'Оптоэлектроника',
      'Датчики',
      'LED драйверы',
    ],
  },
  {
    id: 'electromech',
    title: 'Электромеханика и монтаж',
    icon: 'connector',
    color: 'text-rose-700',
    bg: 'bg-rose-50',
    description: 'Разъёмы, переключатели, корпуса',
    categories: [
      'Разъёмы',
      'Переключатели',
      'Кабели и провода',
      'Монтаж и аксессуары',
      'Модули и платы',
      'Телекоммуникации',
    ],
  },
];

// Категория "Прочие компоненты" идёт отдельно в конец списка
export const OTHER_CATEGORY = 'Прочие компоненты';

// ───────────────────────────────────────────────────────────────────────────────
// Подкатегории для каждой категории (по аналогии с chipget.ru)
// Используются для отображения в каталоге как чипы под названием категории
// ───────────────────────────────────────────────────────────────────────────────

export const SUBCATEGORIES: Record<string, string[]> = {
  'Микроконтроллеры': ['ARM Cortex-M', 'AVR', 'PIC', 'RISC-V', 'ESP32/ESP8266', 'STM32', 'ATmega/ATtiny'],
  'Микросхемы': ['Аналоговые', 'Преобразователи', 'Драйверы', 'Контроллеры', 'Супервизоры', 'Прочие'],
  'ПЛИС (FPGA)': ['Xilinx', 'Intel/Altera', 'Lattice', 'Gowin', 'Efinix'],
  'Логика': ['74HC', '74LVC', '74AC', '74LS', 'CD4000', 'Буферы', 'Триггеры'],
  'Операционные усилители': ['General Purpose', 'Precision', 'Low-Noise', 'Rail-to-Rail', 'Сравнивающие'],
  'АЦП/ЦАП': ['АЦП (ADC)', 'ЦАП (DAC)', 'SPI/I2C', 'Высокоскоростные'],
  'Память': ['EEPROM', 'Flash (NOR)', 'FRAM', 'MRAM', 'SRAM', 'DRAM'],
  'Интерфейсы': ['RS-485/RS-422', 'RS-232', 'CAN', 'USB-UART', 'Ethernet PHY', 'SPI/I2C'],
  'Транзисторы': ['MOSFET N-канал', 'MOSFET P-канал', 'BJT NPN', 'BJT PNP', 'IGBT', 'JFET'],
  'Диоды': ['Выпрямительные', 'Шоттки', 'Стабилитроны', 'TVS', 'Мосты', 'Варикапы', 'Светодиоды'],
  'Конденсаторы': ['Керамические SMD', 'Керамические выводные', 'Электролитические', 'Танталовые', 'Плёночные', 'Подстроечные'],
  'Резисторы': ['SMD (чип)', 'Выводные', 'Переменные', 'Сборки', 'Мощные', 'Фоторезисторы'],
  'Индуктивности': ['SMD', 'Выводные', 'Дроссели', 'Ферритовые бусины', 'Тороидальные'],
  'Кварцы и резонаторы': ['Кварцевые резонаторы', 'Кварцевые генераторы', 'Керамические', 'TCXO/OCXO'],
  'Фильтры': ['EMC/EMI', 'LC-фильтры', 'SMD', 'Пьезо'],
  'Предохранители': ['Плавкие', 'SMD', 'Self-resetting (polyfuse)', 'Держатели', 'Тепловые'],
  'Трансформаторы': ['Силовые', 'Импульсные', 'Аудио', 'Сетевые'],
  'Стабилизаторы': ['LDO', 'Линейные', 'DC-DC Buck', 'DC-DC Boost', 'AC-DC', 'Опорные'],
  'Питание': ['AC-DC модули', 'DC-DC модули', 'Блоки питания', 'Батареи', 'Аккумуляторы'],
  'Реле': ['Электромеханические', 'Твердотельные', 'Герконовые', 'Автомобильные', 'Силовые'],
  'Электроавтоматика': ['Автоматы', 'УЗО', 'Контакторы', 'DIN-рейка', 'Промautomation'],
  'Оптоэлектроника': ['Оптроны', 'Светодиоды', 'OLED/LCD', 'Фотодиоды', 'ИК', 'RGB LED'],
  'Датчики': ['Температуры', 'Влажности', 'Давления', 'IMU/Акселерометры', 'Холла', 'Оптические', 'Gas'],
  'LED драйверы': ['Constant Current', 'PWM', 'Адресные', 'Диммируемые'],
  'Разъёмы': ['USB', 'RJ45', 'DC jack', 'Terminal blocks', 'Pin headers', 'Molex/JST', 'RF', 'D-SUB'],
  'Переключатели': ['Тактовые кнопки', 'Тумблеры', 'DIP', 'Rocker', 'Концевые', 'Энкодеры'],
  'Кабели и провода': ['Коаксиальные', 'Многожильные', 'Монтажные', 'Силовые', 'Шлейфы'],
  'Монтаж и аксессуары': ['Радиаторы', 'Стойки', 'Винты/гайки', 'Корпуса', 'Термоусадка'],
  'Модули и платы': ['Dev boards', 'Wi-Fi/BLE', 'GPS/GNSS', 'Sensor modules', 'Display modules'],
  'Телекоммуникации': ['RF модули', 'GSM/LTE', 'Bluetooth', 'Wi-Fi', 'LoRa/Zigbee'],
  'Прочие компоненты': ['Разное', 'Радиодетали', 'NOS'],
};

/**
 * Возвращает группу, к которой относится категория.
 * Если категория не входит ни в одну группу — возвращается null (например, "Прочие компоненты").
 */
export function getCategoryGroup(categoryName: string): CategoryGroup | null {
  return CATEGORY_GROUPS.find(g => g.categories.includes(categoryName)) || null;
}

/**
 * Сгруппировать список категорий [name, count][] по группам.
 * Возвращает массив вида: [{ group, items: [...] }, ...]
 */
export function groupCategories(
  categories: [string, number][]
): Array<{ group: CategoryGroup | null; items: [string, number][] }> {
  const result: Array<{ group: CategoryGroup | null; items: [string, number][] }> = [];

  for (const group of CATEGORY_GROUPS) {
    const items = categories.filter(([name]) => group.categories.includes(name));
    if (items.length > 0) {
      // Сортируем внутри группы по убыванию количества
      items.sort((a, b) => b[1] - a[1]);
      result.push({ group, items });
    }
  }

  // "Прочие компоненты" — отдельно
  const other = categories.filter(([name]) => name === OTHER_CATEGORY);
  if (other.length > 0) {
    result.push({ group: null, items: other });
  }

  return result;
}

// ───────────────────────────────────────────────────────────────────────────────
// Breadcrumb навигация
// ───────────────────────────────────────────────────────────────────────────────

export type BreadcrumbItem = {
  label: string;
  href?: string;
};

/**
 * Построить breadcrumb для каталога с учётом активных фильтров.
 * Главная → Каталог → [Категория] → [Бренд] → [Поиск]
 */
export function buildCatalogBreadcrumb(opts: {
  category?: string;
  brand?: string;
  search?: string;
}): BreadcrumbItem[] {
  const crumbs: BreadcrumbItem[] = [
    { label: 'Главная', href: '/' },
    { label: 'Каталог', href: '/catalog' },
  ];

  if (opts.category) {
    crumbs.push({ label: opts.category, href: `/catalog?category=${encodeURIComponent(opts.category)}` });
  }
  if (opts.brand) {
    if (!opts.category) {
      crumbs.push({ label: opts.brand, href: `/catalog?brand=${encodeURIComponent(opts.brand)}` });
    } else {
      crumbs.push({ label: opts.brand });
    }
  }
  if (opts.search) {
    crumbs.push({ label: `«${opts.search}»` });
  }

  return crumbs;
}

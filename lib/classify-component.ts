// lib/classify-component.ts
// Авто-классификация компонентов по имени и SKU.
// Используется когда у компонента category === null/empty/"Прочие компоненты".
// Возвращает правильную категорию (из существующих или новую).

type Component = {
  sku?: string;
  name?: string;
  category?: string;
};

// Правила классификации — проверяются по порядку, первое совпадение выигрывает.
// 'pattern' — регулярное выражение, применяется к name + " " + sku (case-insensitive).
type Rule = {
  pattern: RegExp;
  category: string;
};

const RULES: Rule[] = [
  // LED драйверы — новая категория
  { pattern: /WS28\d{2,3}[A-Z]?|LED.*драйвер|драйвер.*LED|addressable.*led|адресн/i, category: 'LED драйверы' },
  // LED — общая оптоэлектроника
  { pattern: /^LED-|LED\s|светодиод|led\s*driver/i, category: 'Оптоэлектроника' },
  // Оптроны / оптопары
  { pattern: /оптрон|оптопар|MOC\d|PC817|TLP\d|ACPL|6N\d|HCPL/i, category: 'Оптоэлектроника' },
  // OLED/LCD дисплеи — Оптоэлектроника
  { pattern: /OLED|LCD|SSD1306|дисплей|NHD-/i, category: 'Оптоэлектроника' },
  // Конденсаторы
  { pattern: /конденсат|GRM|EEU|EKZ|LHY|LGK|TPS0R1|capacitor|OS-CON|tantalum|тантал/i, category: 'Конденсаторы' },
  // Резисторы
  { pattern: /резистор|CRCW|CRG|ERJ|Yageo|resistor/i, category: 'Резисторы' },
  // Диоды
  { pattern: /диод|BZX|SMBJ|1N\d|KBPC|1\.5KE|STPSC|schottky|шоттки|zener|стабилитрон/i, category: 'Диоды' },
  // Транзисторы
  { pattern: /транзистор|MOSFET|IGBT|NTM\d|IPD\d|STGW|FGA|BD\d|MMBT|IPP\d|2N\d{4}|HGT\d|Bipolar/i, category: 'Транзисторы' },
  // Микроконтроллеры
  { pattern: /микроконтроллер|STM32|STM8|GD32|ESP32|ESP8266|CH32|CH57|CH340|ATmega|ATtiny|PIC\d|R7FA|R5F1|MCXA|i\.MX|RPI-|Raspberry|ANNA-B|NINA-B|NEO-M|MAX-M|u-blox/i, category: 'Микроконтроллеры' },
  // ПЛИС (FPGA)
  { pattern: /FPGA|ПЛИС|Artix|Kintex|Spartan|Zynq|Cyclone|Trion|GW2A|GW1N|iCE5|Lattice|XQ7K|XCK\d|10M\d|10AS/i, category: 'ПЛИС (FPGA)' },
  // Операционные усилители
  { pattern: /операцион.*усил|ОУ\s|LM358|TL072|TL082|OPA\d|AD85|NE\d{2}|TLC\d|AD\d+|LT\d|MCP\d+|AD8422|INA128/i, category: 'Операционные усилители' },
  // АЦП/ЦАП
  { pattern: /АЦП|ЦАП|ADC|DAC|MCP49|AD54|AD55|ADS\d|ADS7|ADS8|HX711|MAX1118/i, category: 'АЦП/ЦАП' },
  // Стабилизаторы / DC-DC
  { pattern: /стабил|DC-DC|LDO|LM78|LM79|LT\d|TPS\d|MP\d|LM2596|MP1584|AMS1117|LM1117|R-78|преобразовател/i, category: 'Стабилизаторы' },
  // Питание (блоки питания)
  { pattern: /блок\sпитания|Mean\sWell|NDR-|LRS-|DR-60|RAC60|RAC20/i, category: 'Питание' },
  // Датчики
  { pattern: /датчик|IMU|BMP\d|BME\d|HDC\d|SHT\d|TMP\d|MAX318|VEML|APDS|LIS\d|LSM\d|MPU\d|гироскоп|акселером|температур|влажн|давлен/i, category: 'Датчики' },
  // Интерфейсы
  { pattern: /интерфейс|USB|RS485|RS-485|CAN|LAN87|DP83|CP210|FT2|CH340|TUSB|MCP2515|SP3485|SP491|MAX485|PHY|Ethernet|ethernet/i, category: 'Интерфейсы' },
  // Память
  { pattern: /память|EEPROM|Flash|MRAM|SST25|W25Q|24LC|AT24C|FM25|EM6AB|H5TC|W632|MT47|CY15|MR25/i, category: 'Память' },
  // Логика
  { pattern: /логическ|логика|74HC|74LS|74ALS|74ACT|74LVC|74VHC|74VHCT|CD40|HEF40/i, category: 'Логика' },
  // Реле
  { pattern: /реле|relay|HF115|RT\d|JQC|AZ\d|G5LE|G2R|RAP\d|RTB\d|твердотельн/i, category: 'Реле' },
  // Электроавтоматика (автоматы, контакторы)
  { pattern: /автомат|выключатель|контактор|S263|E225|5SY/i, category: 'Электроавтоматика' },
  // Переключатели
  { pattern: /кнопк|тактов|tactical|switch|B3F|SKQG|Alps|тумблер|переключатель/i, category: 'Переключатели' },
  // Кварцы и резонаторы
  { pattern: /кварц|резонатор|ABM\d|crystal|oscillator|XTAL|HC49/i, category: 'Кварцы и резонаторы' },
  // Предохранители
  { pattern: /предохранит|fuse|Littelfuse|1206L|0805L|MF-MSMF|MF-PSMF/i, category: 'Предохранители' },
  // Индуктивности
  { pattern: /индуктивн|катушк|IHLM|CID\d|CIM\d|SDL\d|SRR\d|LQG|inductor|coil/i, category: 'Индуктивности' },
  // Разъёмы
  { pattern: /разъём|разъем|клеммник|клемма|Molex|Amphenol|Phoenix|Degson|DG\d|connector/i, category: 'Разъёмы' },
  // Кабели
  { pattern: /кабель|cable|1-208|5-1900|03644|wire|провод/i, category: 'Кабели и провода' },
  // Фильтры
  { pattern: /фильтр|filter|DLP\d|BLM\d|MMZ\d|ACT45|EMI/i, category: 'Фильтры' },
  // Трансформаторы
  { pattern: /трансформ|transformer|75031\d|BCM\d/i, category: 'Трансформаторы' },
  // Монтаж и аксессуары
  { pattern: /монтаж|аксессуар|heat\s*sink|радиатор|винт|screw|standoff|DG381|DG300/i, category: 'Монтаж и аксессуары' },
  // Телекоммуникации (RF модули, GSM, LTE, WiFi)
  { pattern: /RF\sмодуль|GSM|GPRS|LTE|SIM\d|MDM\d|QCA\d|LBEE|WiFi|Bluetooth|BLE/i, category: 'Телекоммуникации' },
  // Микросхемы (общая категория — fallback для ИС, не попавших выше)
  { pattern: /микросхем|IC\b|chip|Maxim|Cypress|Silicon\sLabs|TL\d{3}|TLC\d|TL3901|ADA\d|MAX\d|WCH|Toshiba|Sharp|Worldsemi|Rohm|AOZ\d/i, category: 'Микросхемы' },
];

/**
 * Определяет правильную категорию для компонента.
 * Если у компонента уже есть осмысленная категория (не "Прочие компоненты" и не пустая) — возвращает её.
 * Иначе пытается классифицировать по имени и SKU.
 */
export function classifyComponent(component: Component): string {
  const currentCat = (component.category || '').trim();

  // Если категория уже есть и не "Прочие компоненты" — оставляем как есть
  if (currentCat && currentCat !== 'Прочие компоненты') {
    return currentCat;
  }

  // Пытаемся классифицировать
  const text = `${component.name || ''} ${component.sku || ''}`.trim();
  if (!text) return 'Прочие компоненты';

  for (const rule of RULES) {
    if (rule.pattern.test(text)) {
      return rule.category;
    }
  }

  // Ничего не подошло — оставляем в "Прочие компоненты"
  return 'Прочие компоненты';
}

/**
 * Применяет классификацию к списку компонентов.
 */
export function classifyComponents<T extends Component>(components: T[]): T[] {
  return components.map(c => ({
    ...c,
    category: classifyComponent(c),
  }));
}


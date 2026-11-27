// lib/images.ts
// Умный хелпер для определения типа изображения компонента на основе attributes (JSONB).
// Возвращает строку-идентификатор типа корпуса, который ComponentImage.tsx
// использует для отрисовки соответствующего SVG.
//
// Логика:
//   1. Парсит attributes.корпус (например "DO-41", "SOIC-8", "SOT-23", "0805")
//   2. Парсит attributes.тип_монтажа ("SMD", "THT", "THT (выводной)")
//   3. Парсит attributes.тип (например "Стабилитрон", "Мостовой выпрямитель")
//   4. Fallback на category / sku / name если attributes пустые
//
// Возвращает PackageType (совместим с ComponentImage.tsx).

export type PackageType =
  | 'dip' | 'soic' | 'tssop' | 'qfp' | 'qfn' | 'bga'
  | 'to220' | 'to247' | 'to92' | 'to252' | 'sot23' | 'sot223'
  | 'do41' | 'do201' | 'sma' | 'bridge'
  | 'led5' | 'led3' | 'ledsmd'
  | 'resistor-th' | 'resistor-smd' | 'resistor-power'
  | 'cap-ceramic-th' | 'cap-ceramic-smd' | 'cap-electrolytic' | 'cap-tantalum' | 'cap-film'
  | 'crystal-hc49' | 'crystal-smd' | 'resonator'
  | 'relay-th' | 'relay-solid'
  | 'header' | 'terminal-block' | 'usb' | 'dc-jack' | 'molex'
  | 'button-tact' | 'switch-toggle' | 'switch-dip'
  | 'inductor-smd' | 'inductor-th'
  | 'fuse-glass' | 'fuse-smd'
  | 'transformer'
  | 'sensor-dht' | 'sensor-pir' | 'sensor-smd'
  | 'display-oled' | 'display-lcd'
  | 'module-board'
  | 'cable' | 'wire'
  | 'generic-ic';

type ComponentLike = {
  sku?: string;
  name?: string;
  category?: string;
  attributes?: Record<string, string> | null;
};

/**
 * Получить тип корпуса для отрисовки изображения компонента.
 * Приоритет: attributes.корпус → attributes.тип_монтажа → category/sku/name эвристика.
 */
export function getComponentImageType(component: ComponentLike): PackageType {
  const attrs = component.attributes || {};
  const pkg = (attrs['корпус'] || attrs['корпус'] || '').toUpperCase().trim();
  const mountType = (attrs['тип_монтажа'] || '').toUpperCase().trim();
  const compType = (attrs['тип'] || '').toUpperCase().trim();
  const sku = (component.sku || '').toUpperCase();
  const name = (component.name || '').toUpperCase();
  const category = (component.category || '').toUpperCase();
  const combined = `${sku} ${name} ${category} ${pkg} ${compType}`;

  // ── IC корпуса (по attributes.корпус) ──
  if (/\bDIP\b|\bPDIP\b|\bNDIP\b|\bDIP-?\d/.test(pkg)) return 'dip';
  if (/\bSOIC\b|\bSOP\b|\bTSSOP\b|\bSSOP\b|\bMSOP\b|\bVSSOP\b|\bVQFN\b/.test(pkg)) return pkg.includes('TSSOP') || pkg.includes('SSOP') || pkg.includes('MSOP') ? 'tssop' : 'soic';
  if (/\bQFP\b|\bLQFP\b|\bTQFP\b|\bVQFP\b/.test(pkg)) return 'qfp';
  if (/\bQFN\b|\bMLF\b|\bDFN\b/.test(pkg)) return 'qfn';
  if (/\bBGA\b/.test(pkg)) return 'bga';

  // ── Транзисторные корпуса ──
  if (/\bTO-?220\b|\bTO220\b/.test(pkg)) return 'to220';
  if (/\bTO-?247\b|\bTO247\b|\bTO-?3P\b/.test(pkg)) return 'to247';
  if (/\bTO-?92\b|\bTO92\b/.test(pkg)) return 'to92';
  if (/\bTO-?252\b|\bDPAK\b|\bTO252\b/.test(pkg)) return 'to252';
  if (/\bSOT-?23\b|\bSOT23\b/.test(pkg)) return 'sot23';
  if (/\bSOT-?223\b|\bSOT223\b/.test(pkg)) return 'sot223';

  // ── Диодные корпуса ──
  if (/\bDO-?41\b|\bDO41\b/.test(pkg)) return 'do41';
  if (/\bDO-?201\b|\bDO201\b|\bDO-?15\b|\bDO15\b/.test(pkg)) return 'do201';
  if (/\bSMA\b|\bSMB\b|\bSMC\b|\bSOD-?123\b|\bSOD-?323\b|\bSOD-?523\b|\bSOD-?806\b|\bSOD-?323\b/.test(pkg)) return 'sma';
  if (/\bKBPC\b|\bKBU\b|\bKBP\b|\bGBL\b|\bGBJ\b|\bBRIDGE\b/.test(pkg)) return 'bridge';

  // ── LED корпуса ──
  if (/\bLED\b.*\b5MM\b|\b5MM\b.*\bLED\b|^\dMM\b/.test(pkg)) return 'led5';
  if (/\bLED\b.*\b3MM\b|\b3MM\b.*\bLED\b/.test(pkg)) return 'led3';
  if (/0603|0805|1206|5050|3528|2835|PLCC|SMD.*LED|LED.*SMD/.test(pkg)) return 'ledsmd';

  // ── Резисторы (по корпусу) ──
  if (/\b0402\b|\b0603\b|\b0805\b|\b1206\b|\b1210\b|\b2010\b|\b2512\b/.test(pkg) && /РЕЗИСТ|RESIST/.test(category)) return 'resistor-smd';
  if (/\bSQP\b|\bPOWER\b|\bWIREWOUND\b/.test(pkg)) return 'resistor-power';

  // ── Конденсаторы (по корпусу) ──
  if (/\b0402\b|\b0603\b|\b0805\b|\b1206\b/.test(pkg) && /КОНДЕНС|CAPAC/.test(category)) return 'cap-ceramic-smd';

  // ── Категорийная эвристика (если корпус не определился) ──
  if (/РЕЗИСТ|RESIST/.test(combined)) {
    if (/\b0402\b|\b0603\b|\b0805\b|\b1206\b|\b1210\b|\b2010\b|\b2512\b|SMD/.test(combined)) return 'resistor-smd';
    if (/WIREWOUND|POWER|SQP|RH025|0\.5W|1W|2W|3W|5W/.test(combined)) return 'resistor-power';
    return 'resistor-th';
  }

  if (/КОНДЕНС|CAPAC/.test(combined)) {
    if (/ELECTROLYT|ЭЛЕКТРОЛИТ|EKZ|EEU|UPW|UPJ|NICHICON|RUBYCON/.test(combined)) return 'cap-electrolytic';
    if (/TANTAL|ТАНТАЛ|TPS|TANT|F920|F931|T520/.test(combined)) return 'cap-tantalum';
    if (/FILM|ПЛЁНКА|ПЛЕНКА|MKP|MKS|MKC|ECQ/.test(combined)) return 'cap-film';
    if (/\b0402\b|\b0603\b|\b0805\b|\b1206\b|SMD|GRM|C0G|X7R|X5R/.test(combined)) return 'cap-ceramic-smd';
    return 'cap-ceramic-th';
  }

  if (/ДИОД|DIODE|SCHOTTKY|ШОТТКИ|ZENER|СТАБИЛИТРОН/.test(combined)) {
    // Для диодов: если тип_монтажа = SMD и нет DO-* → SMD-диод (sma)
    if (mountType.includes('SMD') && !pkg.includes('DO-')) return 'sma';
    if (/KBPC|KBU|KBP|GBL|GBJ|BRIDGE|МОСТ/.test(combined)) return 'bridge';
    if (/1N540|1N582|BYW|DO-201/.test(combined)) return 'do201';
    return 'do41';
  }

  if (/СВЕТОДИОД|LED\b/.test(combined)) {
    if (/0603|0805|1206|5050|3528|2835|PLCC|SMD/.test(combined)) return 'ledsmd';
    if (/3MM|3\.0MM/.test(combined)) return 'led3';
    return 'led5';
  }

  if (/ТРАНЗИСТ|MOSFET|IGBT|BIPOLAR/.test(combined)) {
    if (/SOT-?23|SOT23|MMBT/.test(combined)) return 'sot23';
    if (/SOT-?223|SOT223/.test(combined)) return 'sot223';
    if (/TO-?252|DPAK/.test(combined)) return 'to252';
    if (/TO-?247|TO247|TO3P/.test(combined)) return 'to247';
    if (/TO-?92|TO92|BC\d|2N\d{3,4}$|2N2222|2N3904|BC547|BC557/.test(combined)) return 'to92';
    return 'to220';
  }

  if (/СТАБИЛ|LDO|DC-DC|LM78|LM79|AMS1117|LM1117|LM2596|MP1584|TPS|LT\d|R-78/.test(combined)) {
    if (/SOT-?23/.test(combined)) return 'sot23';
    if (/SOT-?223/.test(combined)) return 'sot223';
    if (/TO-?252|DPAK/.test(combined)) return 'to252';
    return 'to220';
  }

  if (/КВАРЦ|РЕЗОНАТОР|CRYSTAL|OSCILLATOR|XTAL|ABM|HC49/.test(combined)) {
    if (/RESONATOR|РЕЗОНАТОР|CSTCE|ZTA/.test(combined)) return 'resonator';
    if (/SMD|3225|5032|7050/.test(combined)) return 'crystal-smd';
    return 'crystal-hc49';
  }

  if (/РЕЛЕ|RELAY/.test(combined)) {
    if (/SOLID|ТВЕРДОТЕЛЬ/.test(combined)) return 'relay-solid';
    return 'relay-th';
  }

  // ── IC по SKU эвристике ──
  if (/\bTSSOP\b|\bSSOP\b|\bMSOP\b/.test(combined)) return 'tssop';
  if (/\bSOIC\b|\bSOP\b/.test(combined)) return 'soic';
  if (/\bDIP\b|\bPDIP\b/.test(combined)) return 'dip';
  if (/ATMEGA|ATTINY/.test(combined)) return 'dip';
  if (/^74[A-Z]{1,4}\d{2,4}|^CD40\d{2}|^HEF40\d{2}/.test(sku)) return 'dip';
  if (/STM32|STM8|GD32|ESP32|ESP8266/.test(combined)) return 'qfp';
  if (/NE5532|LM358|LM324|TL072|LM393|LM741/.test(combined)) return 'dip';
  if (/PC817|TLP281|6N\d{2,3}|HCPL|ACPL/.test(combined)) return 'dip';

  return 'generic-ic';
}

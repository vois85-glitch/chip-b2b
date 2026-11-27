// components/ui/ComponentImage.tsx
// Редизайн 2026-10-29: настоящие фотографии компонентов вместо SVG-схем.
// Библиотека фото: /public/images/photos/*.jpg (квадрат 480×480, белый фон).
// Тип корпуса определяется через lib/images.ts (smart helper по attributes JSONB)
// с fallback на эвристику detectPackage().
// Для «живого» вида каждый тип корпуса имеет 2 фото (X.jpg и X-b.jpg) —
// вариант выбирается детерминированно по хэшу SKU, чтобы сетка каталога
// выглядела разнообразной, но стабильной между рендерами.

import { getComponentImageType, type PackageType } from '@/lib/images';
import Image from 'next/image';

type Props = {
  sku: string;
  name?: string;
  category?: string;
  size?: number;
  className?: string;
  attributes?: Record<string, string> | null;
};

// ───────────────────────────────────────────────────────────────────────────────
// Маппинг: PackageType → базовое имя фото в /images/photos/ (без расширения)
// ───────────────────────────────────────────────────────────────────────────────
const PHOTO_MAP: Partial<Record<PackageType, string>> = {
  // Микросхемы
  'dip': 'ic-dip',
  'soic': 'ic-smd',
  'tssop': 'ic-smd',
  'qfp': 'ic-smd',
  'qfn': 'ic-smd',
  'bga': 'bga',
  'generic-ic': 'ic-dip',
  // Транзисторы
  'to220': 'to220',
  'to247': 'to220',
  'to92': 'sot',
  'to252': 'sot',
  'sot23': 'sot',
  'sot223': 'sot',
  // Диоды
  'do41': 'diode',
  'do201': 'diode',
  'sma': 'diode',
  'bridge': 'diode',
  // LED
  'led5': 'led',
  'led3': 'led',
  'ledsmd': 'led',
  // Резисторы
  'resistor-smd': 'resistor',
  'resistor-th': 'resistor',
  'resistor-power': 'resistor',
  // Конденсаторы
  'cap-ceramic-smd': 'cap-smd',
  'cap-ceramic-th': 'cap-smd',
  'cap-tantalum': 'cap-smd',
  'cap-electrolytic': 'cap-electrolytic',
  'cap-film': 'cap-electrolytic',
  // Кварцы
  'crystal-hc49': 'crystal',
  'crystal-smd': 'crystal',
  'resonator': 'crystal',
  // Реле
  'relay-th': 'relay',
  'relay-solid': 'relay',
  // Оптопары
  'header': 'connector',
  // Прочее
  'transformer': 'inductor',
  'inductor-smd': 'inductor',
  'inductor-th': 'inductor',
  'fuse-glass': 'fuse',
  'fuse-smd': 'fuse',
  'sensor-dht': 'sensor',
  'sensor-pir': 'sensor',
  'sensor-smd': 'sensor',
  'display-oled': 'module',
  'display-lcd': 'module',
  'module-board': 'module',
  'cable': 'cable',
  'wire': 'cable',
  'button-tact': 'switch',
  'switch-toggle': 'switch',
  'switch-dip': 'switch',
  'terminal-block': 'connector',
  'usb': 'cable',
  'dc-jack': 'connector',
  'molex': 'connector',
};

// Группы PackageType → фото (fallback-эвристика detectPackage возвращает эти ключи)
const GROUP_PHOTO: Record<string, string> = {
  'resistor-smd': 'resistor',
  'resistor-th': 'resistor',
  'cap-ceramic-smd': 'cap-smd',
  'cap-ceramic-th': 'cap-smd',
  'cap-electrolytic': 'cap-electrolytic',
  'cap-tantalum': 'cap-smd',
  'cap-film': 'cap-electrolytic',
};

// ───────────────────────────────────────────────────────────────────────────────
// Fallback: эвристика по sku/name/category (упрощённая)
// ───────────────────────────────────────────────────────────────────────────────
function detectPackageFallback(sku: string, name: string, category: string): PackageType {
  const t = `${sku} ${name} ${category}`.toUpperCase();
  if (/РЕЗИСТ|RESIST/.test(t)) return /0402|0603|0805|1206|SMD/.test(t) ? 'resistor-smd' : 'resistor-th';
  if (/КОНДЕНС|CAPAC/.test(t)) return /ЭЛЕКТРОЛ|ELECTROLYT|ALUM/.test(t) ? 'cap-electrolytic' : /0402|0603|0805|1206|SMD/.test(t) ? 'cap-ceramic-smd' : 'cap-ceramic-th';
  if (/ДИОД|DIODE|ZENER/.test(t)) return /SMA|SMB|SOD|SMD/.test(t) ? 'sma' : 'do41';
  if (/LED|СВЕТОД/.test(t)) return /SMD/.test(t) ? 'ledsmd' : 'led5';
  if (/ТРАНЗИСТ|MOSFET/.test(t)) return /SOT-?23/.test(t) ? 'sot23' : 'to220';
  if (/РЕЛЕ|RELAY/.test(t)) return 'relay-th';
  if (/КВАРЦ|CRYSTAL|RESONAT|РЕЗОНАТ/.test(t)) return 'crystal-hc49';
  if (/ПРЕДОХР|FUSE/.test(t)) return 'fuse-glass';
  if (/ДАТЧИК|SENSOR/.test(t)) return 'sensor-dht';
  if (/РАЗЪЁМ|РАЗЪЕМ|КОННЕКТОР|CONNECTOR|HEADER/.test(t)) return 'header';
  if (/КНОПКА|BUTTON|SWITCH|ПЕРЕКЛЮЧАТ/.test(t)) return 'button-tact';
  if (/ИНДУКТИВ|ДРОССЕЛЬ|INDUCTOR|COIL/.test(t)) return 'inductor-smd';
  if (/МОДУЛЬ|MODULE|ПЛАТА/.test(t)) return 'module-board';
  if (/КАБЕЛЬ|CABLE|ПРОВОД|WIRE/.test(t)) return 'cable';
  if (/STM32|ESP32|МИКРОКОНТРОЛЛЕР|MICROCONTROLLER/.test(t)) return 'qfp';
  if (/DIP|PDIP/.test(t)) return 'dip';
  if (/SOIC|SOP|TSSOP|QFP|QFN/.test(t)) return 'soic';
  if (/74[A-Z]|CD40|HEF40/.test(sku.toUpperCase())) return 'dip';
  return 'generic-ic';
}

// ───────────────────────────────────────────────────────────────────────────────
// Детерминированный выбор варианта фото по SKU (0 или 1)
// ───────────────────────────────────────────────────────────────────────────────
function skuVariant(sku: string): 0 | 1 {
  let h = 0;
  for (let i = 0; i < sku.length; i++) h = (h * 31 + sku.charCodeAt(i)) & 0xffff;
  return (h & 1) as 0 | 1;
}

// ───────────────────────────────────────────────────────────────────────────────
// Путь к фото компонента (экспортируется для переиспользования в лайтбоксе
// и любом другом клиентском компоненте без дублирования логики).
// ───────────────────────────────────────────────────────────────────────────────
export function getComponentImagePath(opts: {
  sku: string;
  name?: string;
  category?: string;
  attributes?: Record<string, string> | null;
}): string {
  const { sku, name = '', category = '', attributes } = opts;
  // Smart: attributes (JSONB) first, then fallback
  const smartPkg = attributes ? getComponentImageType({ sku, name, category, attributes }) : null;
  const pkg: PackageType = smartPkg || detectPackageFallback(sku, name, category);

  const base = PHOTO_MAP[pkg] || GROUP_PHOTO[pkg] || 'ic-dip';
  const variant = skuVariant(sku);
  // Второй вариант есть не у всех фото — используем его только если SKU выпал на 1,
  // файлы X-b.jpg загружены для всех ключей, поэтому безопасно.
  return variant === 1 ? `/images/photos/${base}-b.jpg` : `/images/photos/${base}.jpg`;
}

// ───────────────────────────────────────────────────────────────────────────────
// Component
// ───────────────────────────────────────────────────────────────────────────────
export default function ComponentImage({ sku, name = '', category = '', size = 80, className, attributes }: Props) {
  const imagePath = getComponentImagePath({ sku, name, category, attributes });

  return (
    <div
      className={className}
      style={{
        width: size,
        height: size,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        // 2026-11-01: фото чипов всегда на чисто белом фоне (требование заказчика)
        backgroundColor: '#ffffff',
      }}
    >
      <Image
        src={imagePath}
        alt={`${sku} — ${category || 'электронный компонент'}`}
        width={size}
        height={size}
        loading="lazy"
        style={{
          maxWidth: '100%',
          maxHeight: '100%',
          objectFit: 'cover',
        }}
      />
    </div>
  );
}

// lib/category-photos.ts
// Редизайн 2026-10-29: реальные фотографии для плиток категорий каталога
// (по образцу avd-instrument.ru — «живые» плитки с фото вместо иконок).
// Фото лежат в /public/images/photos/*.jpg (квадрат 480×480).

export const CATEGORY_PHOTOS: Record<string, string> = {
  'Стабилизаторы': '/images/photos/to220-b.jpg',
  'Микроконтроллеры': '/images/photos/ic-smd.jpg',
  'Оптоэлектроника': '/images/photos/optocoupler.jpg',
  'Транзисторы': '/images/photos/to220.jpg',
  'Интерфейсы': '/images/photos/ic-smd-b.jpg',
  'Конденсаторы': '/images/photos/cap-electrolytic.jpg',
  'Конденсаторы электролитические': '/images/photos/cap-electrolytic.jpg',
  'Конденсаторы танталовые': '/images/photos/cap-smd.jpg',
  'Операционные усилители': '/images/photos/ic-dip-b.jpg',
  'ПЛИС (FPGA)': '/images/photos/bga.jpg',
  'Диоды': '/images/photos/diode.jpg',
  'Разъёмы': '/images/photos/connector.jpg',
  'Датчики': '/images/photos/sensor.jpg',
  'Память': '/images/photos/ic-smd.jpg',
  'АЦП/ЦАП': '/images/photos/ic-smd-b.jpg',
  'Резисторы': '/images/photos/resistor.jpg',
  'Индуктивности': '/images/photos/inductor.jpg',
  'Логика': '/images/photos/ic-dip.jpg',
  'Кварцы и резонаторы': '/images/photos/crystal.jpg',
  'Реле': '/images/photos/relay.jpg',
  'Электроавтоматика': '/images/photos/power-b.jpg',
  'Предохранители': '/images/photos/fuse.jpg',
  'Модули и платы': '/images/photos/module.jpg',
  'Микросхемы': '/images/photos/ic-dip.jpg',
  'Кабели и провода': '/images/photos/cable.jpg',
  'Питание': '/images/photos/power.jpg',
  'Монтаж и аксессуары': '/images/photos/switch-b.jpg',
  'Фильтры': '/images/photos/inductor-b.jpg',
  'Переключатели': '/images/photos/switch.jpg',
  'Трансформаторы': '/images/photos/inductor-b.jpg',
  'Телекоммуникации': '/images/photos/module-b.jpg',
  'Импульсные стабилизаторы (DC-DC)': '/images/photos/power.jpg',
  'Линейные стабилизаторы (LDO)': '/images/photos/to220.jpg',
  'Микросхемы управления питанием (PMIC)': '/images/photos/power-b.jpg',
  'Прочие компоненты': '/images/photos/module-b.jpg',
  'Аналоговая электроника': '/images/photos/ic-dip.jpg',
  'LED драйверы': '/images/photos/led.jpg',
};

// Фото по умолчанию — набор микросхем
const DEFAULT_PHOTO = '/images/photos/ic-dip.jpg';

export function categoryPhoto(category: string): string {
  return CATEGORY_PHOTOS[category] || DEFAULT_PHOTO;
}

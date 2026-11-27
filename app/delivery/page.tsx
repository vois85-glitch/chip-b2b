import { Metadata } from 'next';
import DeliveryClient from './DeliveryClient';

const BASE_URL = 'https://www.chip-net.ru';

export const metadata: Metadata = {
  title: 'Доставка и логистика — поставка электронных компонентов из Европы и Азии',
  description: 'Доставка электронных компонентов ChipNet: цепочка поставок из 5 этапов, экспресс (6-10 дней), стандарт (14-21 день), спецзаказ EOL. СДЭК, DHL, Деловые Линии. Входной контроль СВП. Бесплатная доставка от 50 000 ₽.',
  alternates: { canonical: `${BASE_URL}/delivery` },
  openGraph: {
    title: 'Доставка и логистика — поставка электронных компонентов из Европы и Азии',
    description: 'Цепочка поставок 5 этапов, 3 тарифа доставки, B2B-упаковка (ESD, MSL, Tape & Reel), СВП-контроль. От 6 дней. Бесплатная доставка от 50 000 ₽.',
    url: `${BASE_URL}/delivery`,
    type: 'website',
    locale: 'ru_RU',
    siteName: 'ChipNet',
    images: [{ url: '/og-image.png', width: 1344, height: 768, alt: 'Доставка электронных компонентов ChipNet' }],
  },
};

export default function DeliveryPage() {
  return <DeliveryClient />;
}

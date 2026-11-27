import { Metadata } from 'next';
import AboutClient from './AboutClient';

const BASE_URL = 'https://www.chip-net.ru';

export const metadata: Metadata = {
  title: 'О компании ChipNet — B2B-поставщик электронных компонентов',
  description: 'ChipNet (ООО «Деловой Партнёр») — поставщик оригинальных электронных компонентов для промышленности. 52 000+ позиций, проверка в лаборатории СВП, подбор аналогов EOL-компонентов, доставка от 6 дней.',
  alternates: { canonical: `${BASE_URL}/o-kompanii` },
  openGraph: {
    title: 'О компании ChipNet — B2B-поставщик электронных компонентов',
    description: '52 000+ позиций, входной контроль СВП, подбор аналогов, доставка от 6 дней. Работаем только с юрлицами по договору.',
    url: `${BASE_URL}/o-kompanii`,
    type: 'website',
    locale: 'ru_RU',
    siteName: 'ChipNet',
    images: [{ url: '/og-image.png', width: 1344, height: 768, alt: 'О компании ChipNet' }],
  },
};

export default function AboutPage() {
  return <AboutClient />;
}

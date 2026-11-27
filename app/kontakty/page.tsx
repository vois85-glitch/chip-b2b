import { Metadata } from 'next';
import ContactsClient from './ContactsClient';

const BASE_URL = 'https://www.chip-net.ru';

export const metadata: Metadata = {
  title: 'Контакты — Поставка электронных компонентов',
  description: 'Контакты компании ChipNet (ООО «Деловой Партнёр»): телефон +7 (910) 321-91-91, email info@chip-net.ru, г. Белгород. Заказ обратного звонка. Реквизиты. Карта.',
  alternates: { canonical: `${BASE_URL}/kontakty` },
  openGraph: {
    title: 'Контакты — Поставка электронных компонентов',
    description: 'Свяжитесь с нами для подбора компонентов, запроса КП или консультации по аналогам. Пн-Пт 9:00-18:00 МСК.',
    url: `${BASE_URL}/kontakty`,
    type: 'website',
    locale: 'ru_RU',
    siteName: 'ChipNet',
    images: [{ url: '/og-image.png', width: 1344, height: 768, alt: 'Контакты ChipNet' }],
  },
};

export default function ContactsPage() {
  return <ContactsClient />;
}

// app/cart/page.tsx
// Страница оформления заявки из корзины.
// Форма контактов + список позиций → отправка в Supabase (requests table) + email.

import { Metadata } from 'next';
import Link from 'next/link';
import CartCheckoutClient from './CartCheckoutClient';
import BreadcrumbNav from '@/components/ui/BreadcrumbNav';

export const metadata: Metadata = {
  title: 'Корзина заявки — оформление',
  description: 'Оформление заявки на поставку электронных компонентов. Укажите количество и контактные данные — менеджер подготовит коммерческое предложение в течение 24 часов.',
  alternates: { canonical: 'https://www.chip-net.ru/cart' },
  robots: { index: false, follow: false },
};

export default function CartPage() {
  return (
    <main className="min-h-screen bg-[#f8faf7] pt-[190px] md:pt-[200px] pb-20 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Breadcrumb */}
                <BreadcrumbNav
          className="mb-4"
          items={[
            { name: 'Главная', href: '/' },
            { name: 'Каталог', href: '/catalog' },
          ]}
        />

        <h1 className="text-3xl md:text-4xl font-bold mb-2 text-[#121212]">
          Оформление заявки
        </h1>
        <p className="text-[#555] mb-3 max-w-2xl">
          Проверьте состав заявки и укажите контактные данные. После отправки заявка
          мгновенно поступит менеджерам ChipNet в Telegram — мы свяжемся с вами в течение
          рабочего дня для подготовки коммерческого предложения.
        </p>
        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#eaf0e8] rounded-lg text-xs text-[#02a391] font-medium mb-8">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.022c.242-.213-.054-.334-.373-.121l-6.869 4.326-2.96-.924c-.64-.203-.658-.64.135-.954l11.566-4.458c.538-.196 1.006.128.832.941z"/>
          </svg>
          Заявки отправляются в Telegram-канал менеджеров
        </div>

        <CartCheckoutClient />
      </div>
    </main>
  );
}

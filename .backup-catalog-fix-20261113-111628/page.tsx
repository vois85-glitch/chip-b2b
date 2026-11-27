import nextDynamic from 'next/dynamic';
import Hero from '@/components/sections/Hero';
import Contacts from '@/components/sections/Contacts';

export const dynamic = 'force-dynamic';

// Code splitting: тяжёлые компоненты ниже первого экрана грузятся лениво
const BomUpload = nextDynamic(() => import('@/components/sections/BomUpload'));
const Guarantees = nextDynamic(() => import('@/components/sections/Guarantees'));
const HomeCatalog = nextDynamic(() => import('@/components/sections/HomeCatalog'));

// Минималистичная главная (2026-11-02):
// Убраны секции BrandsMarquee, ComponentSearch, AboutCompany, HowWeWork, FAQ.
// FAQ JSON-LD сохранён для SEO (Яндекс/Google показывают rich snippets по старым страницам).
const faqLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Как вы гарантируете оригинальность компонентов?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Работаем только с авторизованными дистрибьюторами и заводами. Все партии проходят входной контроль в лаборатории СВП (рентген, декапсуляция, электрическое тестирование).',
      },
    },
    {
      '@type': 'Question',
      name: 'Работаете ли вы с физическими лицами?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Нет, мы специализируемся на B2B-рынке. Работаем с юрлицами (ООО, АО) и ИП по договору поставки с закрывающими документами.',
      },
    },
    {
      '@type': 'Question',
      name: 'Какие условия оплаты?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Для постоянных клиентов — постоплата до 30 дней. Для новых — предоплата 50% или 100% в зависимости от суммы и редкости компонентов.',
      },
    },
    {
      '@type': 'Question',
      name: 'За сколько времени вы даете КП?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Стандартный прайс — 1-2 часа. Заявки на редкие или санкционные компоненты — до 24 часов.',
      },
    },
    {
      '@type': 'Question',
      name: 'Что если компонент попадет под санкции после оплаты?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Возвращаем средства в полном объеме за 3 рабочих дня, либо бесплатно подбираем функциональный аналог.',
      },
    },
  ],
};

export default function Home() {
  return (
    <main className="relative mt-0">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
      />
      <Hero />
      <HomeCatalog />
      <BomUpload />
      <Guarantees />
      <Contacts />
    </main>
  );
}

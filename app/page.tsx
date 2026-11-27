import nextDynamic from 'next/dynamic';
import Link from 'next/link';
import Hero from '@/components/sections/Hero';
import Contacts from '@/components/sections/Contacts';

// SEO FIX (2026-11-13): на главной остаётся force-dynamic, потому что
// дочерний клиентский компонент (TopSearchBar) использует useSearchParams(),
// а при ISR-режиме Next.js требует обернуть его в <Suspense>. Это отдельная
// задача — обернуть searchbar в Suspense и тогда можно будет включить ISR.
// Главная не делает прямых запросов к Supabase, так что force-dynamic здесь
// не бьёт по egress-квоте. На /catalog, /brands, /catalog/layout — ISR включён.
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
      {/* Quick BOM Paste — компактный виджет перехода к инструменту */}
      <section className="px-4 py-8 bg-section-alt/50">
        <div className="max-w-5xl mx-auto">
          <Link
            href="/bom#bom-paste"
            className="group flex flex-col sm:flex-row items-center gap-4 bg-white rounded-2xl border border-[#e8e8e8] hover:border-primary/40 hover:shadow-lg transition-all p-6"
          >
            <div className="flex-shrink-0 w-14 h-14 bg-emerald-100 rounded-xl flex items-center justify-center group-hover:bg-emerald-200 transition-colors">
              <svg className="w-7 h-7 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            </div>
            <div className="flex-1 text-center sm:text-left">
              <h2 className="text-lg font-bold text-[#121212] mb-1">Quick BOM Paste — вставка спецификации</h2>
              <p className="text-sm text-[#666]">
                Вставьте артикулы из Excel → мгновенная проверка наличия в каталоге → расчёт КП
              </p>
            </div>
            <div className="flex-shrink-0 inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 group-hover:bg-emerald-700 text-white rounded-xl font-semibold text-sm transition-colors">
              Открыть инструмент
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </div>
          </Link>
        </div>
      </section>
      <BomUpload />
      <Guarantees />
      <Contacts />
    </main>
  );
}

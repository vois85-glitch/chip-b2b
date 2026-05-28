import Hero from '@/components/sections/Hero';
import BrandsMarquee from '@/components/sections/BrandsMarquee';
import ComponentSearch from '@/components/sections/ComponentSearch';
import PopularCategories from '@/components/sections/PopularCategories';
import AboutCompany from '@/components/sections/AboutCompany';
import HardCases from '@/components/sections/HardCases';
import LogisticsDetails from '@/components/sections/LogisticsDetails';
import BomUpload from '@/components/sections/BomUpload';
import HowWeWork from '@/components/sections/HowWeWork';
import FAQ from '@/components/sections/FAQ';
import Contacts from '@/components/sections/Contacts';

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
      <BrandsMarquee />
      <ComponentSearch />
      <PopularCategories />
      <AboutCompany />
      <HardCases />
      <LogisticsDetails />
      <BomUpload />
      <HowWeWork />
      <FAQ />
      <Contacts />
    </main>
  );
}

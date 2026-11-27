import { Metadata } from 'next';
import { Suspense } from 'react';
import RfqClient from './RfqClient';

const BASE_URL = 'https://www.chip-net.ru';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Запрос КП на электронные компоненты — КП за 2 часа | ChipNet',
  description: 'Отправьте заявку на электронные компоненты — подготовим коммерческое предложение за 2 часа. Проверка наличия, подбор аналогов, BOM-комплектация. Без обязательств.',
  alternates: { canonical: `${BASE_URL}/rfq` },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Запрос КП на электронные компоненты — КП за 2 часа | ChipNet',
    description: 'Отправьте заявку — КП за 2 часа. Проверка наличия, подбор аналогов, поставка EOL. Без обязательств.',
    url: `${BASE_URL}/rfq`,
    type: 'website',
    locale: 'ru_RU',
    siteName: 'ChipNet',
  },
};

const faqLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    { '@type': 'Question', name: 'Как быстро вы обрабатываете запрос КП?', acceptedAnswer: { '@type': 'Answer', text: 'Стандартное КП — за 2 рабочих часа. Для сложных BOM — до 4 часов. Подтверждение получения заявки — в течение 15 минут.' } },
    { '@type': 'Question', name: 'Можно ли запросить КП на компоненты, которых нет в каталоге?', acceptedAnswer: { '@type': 'Answer', text: 'Да. Мы работаем с 10+ млн наименований от 200+ производителей.' } },
    { '@type': 'Question', name: 'Как гарантирована оригинальность?', acceptedAnswer: { '@type': 'Answer', text: 'Все компоненты проходят входной контроль в лаборатории СВП: рентген, декапсуляция, электротест.' } },
    { '@type': 'Question', name: 'Можно ли согласовать замену на аналоги?', acceptedAnswer: { '@type': 'Answer', text: 'Да. Инженеры подбирают аналоги с учётом параметров. Предоставляем сравнительную таблицу.' } },
  ],
};

const breadcrumbLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Главная', item: BASE_URL },
    { '@type': 'ListItem', position: 2, name: 'Запрос КП', item: `${BASE_URL}/rfq` },
  ],
};

export default function RfqPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <Suspense fallback={<div className="h-screen" />}>
        <RfqClient />
      </Suspense>
    </>
  );
}

import { Metadata } from 'next';
import Link from 'next/link';

const BASE_URL = 'https://www.chip-net.ru';

export const revalidate = 3600;

export const metadata: Metadata = {
 title: 'BOM-комплектация производств — поставка электронных компонентов',
 description: 'BOM-комплектация производств: загрузка спецификации, анализ наличия, подбор аналогов, расчёт стоимости и сроков, полная комплектация и доставка. Проверка в лаборатории СВП.',
 alternates: {
 canonical: `${BASE_URL}/bom`,
 },
 openGraph: {
 title: 'BOM-комплектация производств — поставка электронных компонентов',
 description: 'BOM-комплектация производств: загрузка спецификации, анализ наличия, подбор аналогов, расчёт стоимости и сроков, полная комплектация и доставка.',
 url: `${BASE_URL}/bom`,
 type: 'website',
 locale: 'ru_RU',
 siteName: 'ChipNet',
 },
};

const faqItems = [
 {
 question: 'Что такое BOM-комплектация?',
 answer: 'BOM-комплектация (Bill of Materials) — это услуга по полной или частичной закупке всех компонентов из вашей спецификации (BOM-листа) у одного поставщика. Вместо того чтобы искать каждый компонент у разных дистрибьюторов, вы отправляете нам BOM — и мы берём на себя поиск, закупку, проверку и доставку всех позиций.',
 },
 {
 question: 'В каком формате нужно предоставить BOM?',
 answer: 'Мы принимаем BOM в любом удобном формате: Excel (.xlsx,.xls), CSV, PDF или даже скан рукописной спецификации. В идеале BOM должен содержать: артикул компонента (MPN), наименование, количество, ссылку на даташит. Если артикулов нет — наши инженеры подберут компоненты по описанию и параметрам.',
 },
 {
 question: 'Сколько времени занимает BOM-анализ?',
 answer: 'Базовый анализ BOM с проверкой наличия и расчётом стоимости — от 2 до 24 часов в зависимости от количества позиций. BOM до 50 позиций — в течение рабочего дня. BOM на 200+ позиций — до 2 рабочих дней. Для срочных заказчиков доступна приоритетная обработка.',
 },
 {
 question: 'Что если некоторых компонентов нет в наличии?',
 answer: 'Для unavailable позиций мы предлагаем три варианта: 1) Подбор аналога с проверкой совместимости в лаборатории; 2) Закупка из складских остатков других дистрибьюторов (может быть дороже и дольше); 3) Буферизация — заказ с длительной поставкой для будущих партий. Мы всегда предлагаем несколько вариантов и клиент выбирает оптимальный.',
 },
 {
 question: 'Какие минимальные объёмы для BOM-комплектации?',
 answer: 'Минимального объёма нет — мы работаем с BOM любого размера: от 5 позиций для прототипов до тысяч позиций для серийного производства. Для BOM от 100 позиций действуют специальные условия: скидки до 15%, приоритетная логистика и персональный менеджер.',
 },
 {
 question: 'Как происходит оплата при BOM-комплектации?',
 answer: 'Стандартная схема: предоплата 50% после утверждения BOM и согласования КП, оставшиеся 50% — перед отгрузкой. Для постоянных клиентов с историей успешных поставок — постоплата до 30 календарных дней. Оплата по договору с НДС, полные закрывающие документы.',
 },
];

const processSteps = [
 {
 step: '01',
 title: 'Загрузка BOM',
 description: 'Загрузите BOM-лист в любом формате (Excel, CSV, PDF) через форму на сайте или отправьте на почту. Укажите требуемые количества и сроки. Чем подробнее спецификация — тем точнее и быстрее будет расчёт.',
 icon: (
 <svg className="w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
 </svg>
 ),
 },
 {
 step: '02',
 title: 'Анализ и проверка',
 description: 'Инженеры ChipNet анализируют каждую позицию: проверяем наличие у авторизованных дистрибьюторов, актуальность серий, EOL-статус, доступность аналогов. Формируем отчёт по каждой позиции с рекомендациями.',
 icon: (
 <svg className="w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
 </svg>
 ),
 },
 {
 step: '03',
 title: 'Коммерческое предложение',
 description: 'Подготавливаем детальное КП: цена, сроки поставки, доступность по каждой позиции. Для unavailable компонентов предлагаем аналоги с описанием совместимости. Указываем общую стоимость и сроки комплектации.',
 icon: (
 <svg className="w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
 </svg>
 ),
 },
 {
 step: '04',
 title: 'Закупка и комплектация',
 description: 'После подтверждения заказа выкупаем компоненты у поставщиков, комплектуем партию на нашем складе. Каждая позиция проходит входной контроль в лаборатории СВП. При необходимости проводим дополнительные тесты аналогов.',
 icon: (
 <svg className="w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
 </svg>
 ),
 },
 {
 step: '05',
 title: 'Доставка',
 description: 'Комплектуем и отгружаем партию со склада в Белгороде. Доставка транспортной компанией по всей России. Для срочных заказов — авиадоставка от 6 дней. Полный пакет закрывающих документов: УПД, сертификаты, отчёты о входном контроле.',
 icon: (
 <svg className="w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
 </svg>
 ),
 },
];

const breadcrumbLd = {
 '@context': 'https://schema.org',
 '@type': 'BreadcrumbList',
 itemListElement: [
 { '@type': 'ListItem', position: 1, name: 'Главная', item: BASE_URL },
 { '@type': 'ListItem', position: 2, name: 'BOM-комплектация', item: `${BASE_URL}/bom` },
 ],
};

const serviceLd = {
 '@context': 'https://schema.org',
 '@type': 'Service',
 name: 'BOM-комплектация производств',
 description: 'Полная комплектация BOM-листов электронных компонентов: анализ наличия, подбор аналогов, проверка в лаборатории СВП, доставка по России.',
 provider: {
 '@type': 'Organization',
 name: 'ChipNet (ООО Деловой Партнёр)',
 url: BASE_URL,
 },
 areaServed: { '@type': 'Country', name: 'Россия' },
 serviceType: 'BOM-комплектация электронных компонентов',
};

const faqLd = {
 '@context': 'https://schema.org',
 '@type': 'FAQPage',
 mainEntity: faqItems.map((item) => ({
 '@type': 'Question',
 name: item.question,
 acceptedAnswer: { '@type': 'Answer', text: item.answer },
 })),
};

export default function BomPage() {
 return (
 <>
 <script
 type="application/ld+json"
 dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
 />
 <script
 type="application/ld+json"
 dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceLd) }}
 />
 <script
 type="application/ld+json"
 dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
 />
 <main className="min-h-screen bg-background text-[#121212]">
 {/* Hero */}
 <section className="pt-32 pb-16 px-4">
 <div className="max-w-7xl mx-auto">
 <nav className="text-sm text-[#757575] mb-6 flex items-center gap-2">
 <Link href="/" className="hover:text-primary transition-colors">Главная</Link>
 <span className="text-[#cbcbcb]">/</span>
 <span className="text-[#666]">BOM-комплектация</span>
 </nav>
 <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-primary-dark bg-clip-text text-transparent">
 BOM-комплектация производств
 </h1>
 <p className="text-lg text-[#666] max-w-3xl mb-4">
 Полная комплектация BOM-листов электронных компонентов: от анализа наличия до доставки
 на ваш склад. Подбор аналогов unavailable позиций, проверка в лаборатории СВП,
 полный пакет документации.
 </p>
 <p className="text-base text-[#757575] max-w-3xl">
 Отправьте BOM-лист — и мы возьмём на себя поиск, закупку, проверку и логистику всех
 компонентов. Один поставщик вместо десятка дистрибьюторов, один договор, одна доставка.
 </p>
 </div>
 </section>

 {/* Upload CTA */}
 <section className="px-4 pb-16">
 <div className="max-w-4xl mx-auto">
 <div className="bg-gradient-to-br from-primary/10 to-primary-dark/5 rounded-2xl border border-emerald-800/30 p-8 md:p-12 text-center">
 <div className="mb-6 flex justify-center">
 <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
 <svg className="w-10 h-10 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
 </svg>
 </div>
 </div>
 <h2 className="text-2xl md:text-3xl font-bold mb-4">Загрузите BOM-лист</h2>
 <p className="text-[#666] mb-8 max-w-xl mx-auto">
 Загрузите спецификацию в любом формате (Excel, CSV, PDF) — проанализируем наличие,
 подберём аналоги и подготовим коммерческое предложение.
 </p>
 <Link
 href="/#bom"
 className="inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark text-[#121212] font-medium px-8 py-4 rounded-lg transition-colors text-lg"
 >
 Загрузить BOM-лист
 <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
 </Link>
 </div>
 </div>
 </section>

 {/* Process Steps */}
 <section className="px-4 pb-20">
 <div className="max-w-7xl mx-auto">
 <h2 className="text-3xl font-bold mb-4">Как работает BOM-комплектация</h2>
 <p className="text-[#666] mb-12 max-w-2xl">
 Пять чётких этапов от вашего BOM-листа до получения компонентов на складе.
 Прозрачный процесс с обратной связью на каждом этапе.
 </p>
 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
 {processSteps.map((item) => (
 <div
 key={item.step}
 className="relative bg-[#f0f4ee] rounded-2xl border border-[#e8e8e8] p-6 hover:border-primary/30 hover:shadow-lg transition-all group"
 >
 <span className="text-5xl font-bold text-primary/10 group-hover:text-primary/20 transition-colors absolute top-4 right-4">
 {item.step}
 </span>
 <div className="mb-4">{item.icon}</div>
 <h3 className="text-lg font-semibold mb-3 text-[#121212]">{item.title}</h3>
 <p className="text-[#666] text-sm leading-relaxed">{item.description}</p>
 </div>
 ))}
 </div>
 </div>
 </section>

 {/* Advantages */}
 <section className="px-4 pb-20 bg-section-accent/30">
 <div className="max-w-7xl mx-auto py-20">
 <h2 className="text-3xl font-bold mb-4">Преимущества BOM-комплектации в ChipNet</h2>
 <p className="text-[#666] mb-12 max-w-2xl">
 Комплексный подход к комплектации BOM-листов — от поиска и проверки до доставки и документооборота.
 </p>
 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
 {[
 {
 title: 'Один поставщик — один договор',
 description: 'Вместо десятка договоров с разными дистрибьюторами вы работаете с одним контрагентом. Один счёт, одна таможенная декларация, одна доставка. Упрощение документооборота и снижение административных затрат.',
 },
 {
 title: 'Проверка каждой позиции',
 description: 'Все компоненты проходят входной контроль в аккредитованной лаборатории СВП: рентген, декэпсуляция, электрические тесты. Гарантируем оригинальность и работоспособность каждой позиции в BOM.',
 },
 {
 title: 'Подбор аналогов unavailable позиций',
 description: 'Для компонентов, недоступных напрямую, подбираем аналоги с проверкой совместимости. Кросс-референсы для STM32, Xilinx FPGA, TI LDO и других популярных серий. Лабораторная верификация аналогов.',
 },
 {
 title: 'Оптимизация стоимости',
 description: 'BOM-анализ с предложением альтернатив по лучшему соотношению цена/качество. Для оптовых BOM от 100 позиций — скидки до 15%. Прозрачное ценообразование с разбивкой по каждой позиции.',
 },
 {
 title: 'Срочная комплектация',
 description: 'Авиадоставка для срочных заказов — от 6 рабочих дней. Приоритетная обработка BOM для постоянных клиентов. Для серийного производства — буферизация и хранение на нашем складе.',
 },
 {
 title: 'Полный пакет документов',
 description: 'УПД с НДС, сертификаты происхождения, отчёты о входном контроле, таможенные декларации для импортных компонентов. Вся документация в формате ЭДО. Соответствие требованиям бухгалтерии.',
 },
 ].map((item) => (
 <div
 key={item.title}
 className="bg-gradient-to-br from-primary/5 to-primary-dark/5 rounded-2xl border border-primary/10 p-6 hover:border-primary/30 transition-all"
 >
 <h3 className="text-lg font-semibold mb-3 text-[#121212]">{item.title}</h3>
 <p className="text-[#666] text-sm leading-relaxed">{item.description}</p>
 </div>
 ))}
 </div>
 </div>
 </section>

 {/* FAQ */}
 <section className="px-4 pb-20">
 <div className="max-w-4xl mx-auto">
 <h2 className="text-3xl font-bold mb-12 text-center">Часто задаваемые вопросы</h2>
 <div className="space-y-4">
 {faqItems.map((item, index) => (
 <details
 key={index}
 className="group bg-[#f0f4ee] rounded-2xl border border-[#e8e8e8] overflow-hidden"
 >
 <summary className="flex items-center justify-between p-6 cursor-pointer hover:bg-[#eaf0e8] transition-colors">
 <span className="font-semibold text-[#121212] pr-4">{item.question}</span>
 <svg
 className="w-5 h-5 text-[#757575] group-open:rotate-180 transition-transform shrink-0"
 fill="none"
 viewBox="0 0 24 24"
 stroke="currentColor"
 >
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
 </svg>
 </summary>
 <div className="px-6 pb-6 text-[#666] leading-relaxed">{item.answer}</div>
 </details>
 ))}
 </div>
 </div>
 </section>

 {/* CTA */}
 <section className="px-4 pb-20">
 <div className="max-w-4xl mx-auto bg-gradient-to-br from-primary/10 to-primary-dark/5 rounded-2xl border border-emerald-800/30 p-8 md:p-12 text-center">
 <h2 className="text-2xl md:text-3xl font-bold mb-4">
 Готовы загрузить BOM?
 </h2>
 <p className="text-[#666] mb-8 max-w-xl mx-auto">
 Отправьте BOM-лист — проанализируем наличие, подберём аналоги unavailable позиций,
 рассчитаем стоимость и сроки комплектации.
 </p>
 <div className="flex flex-col sm:flex-row gap-4 justify-center">
 <Link
 href="/#bom"
 className="inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark text-[#121212] font-medium px-8 py-3 rounded-lg transition-colors"
 >
 Загрузить BOM-лист
 <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
 </Link>
 <Link
 href="/import-komponentov"
 className="inline-flex items-center justify-center gap-2 border border-primary text-primary hover:bg-primary/5 font-medium px-8 py-3 rounded-lg transition-colors"
 >
 Импорт компонентов
 </Link>
 </div>
 </div>
 </section>
 </main>
 </>
 );
}

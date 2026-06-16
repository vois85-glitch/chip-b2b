import { Metadata } from 'next';
import Link from 'next/link';
import ComponentSearch from '@/components/sections/ComponentSearch';

const BASE_URL = 'https://www.chip-net.ru';

export const revalidate = 3600;

export const metadata: Metadata = {
 title: 'Снятые с производства электронные компоненты (EOL) — поиск и поставка',
 description: 'Поиск и поставка снятых с производства (EOL/obsolete) электронных компонентов. Последние партии, складские остатки, подбор аналогов. Проверка оригинальности в лаборатории СВП.',
 alternates: {
 canonical: `${BASE_URL}/obsolete`,
 },
 openGraph: {
 title: 'Снятые с производства электронные компоненты (EOL) — поиск и поставка',
 description: 'Поиск и поставка снятых с производства (EOL/obsolete) электронных компонентов. Последние партии, складские остатки, подбор аналогов.',
 url: `${BASE_URL}/obsolete`,
 type: 'website',
 locale: 'ru_RU',
 siteName: 'ChipNet',
 },
};

type EolComponent = {
 sku: string;
 name: string;
 brand: string;
 category: string;
 eolDate: string;
 replacement: string;
};

const eolComponents: EolComponent[] = [
 { sku: 'XC3S200A-4FTG256C', name: 'FPGA Spartan-3A 200K', brand: 'Xilinx', category: 'FPGA', eolDate: '2018', replacement: 'Gowin GW1N-4' },
 { sku: 'XC6SLX9-2TQG144C', name: 'FPGA Spartan-6 9K', brand: 'Xilinx', category: 'FPGA', eolDate: '2020', replacement: 'Gowin GW2A-18' },
 { sku: 'EP3C5E144C8N', name: 'FPGA Cyclone III 5K', brand: 'Intel/Altera', category: 'FPGA', eolDate: '2019', replacement: 'Gowin GW1N-4' },
 { sku: 'STM32F103C8T6', name: 'MCU Cortex-M3 72MHz', brand: 'STMicroelectronics', category: 'Микроконтроллеры', eolDate: 'В производстве*', replacement: 'GD32F103C8T6' },
 { sku: 'ATMEGA328P-AU', name: 'MCU AVR 32KB', brand: 'Microchip', category: 'Микроконтроллеры', eolDate: 'В производстве*', replacement: 'LGT8F328P' },
 { sku: 'LM7805CT', name: 'LDO 5V 1A', brand: 'Texas Instruments', category: 'Стабилизаторы', eolDate: '2021', replacement: 'LM7805 от Diodes Inc' },
 { sku: 'DS18B20+', name: 'Датчик температуры 1-Wire', brand: 'Maxim Integrated', category: 'Датчики', eolDate: 'В производстве*', replacement: 'DS18B20 от Dallas' },
 { sku: 'NE5532DR', name: 'ОУ сдвоенный', brand: 'Texas Instruments', category: 'Операционные усилители', eolDate: 'В производстве*', replacement: 'RC4580 от TI' },
 { sku: 'SN74HC595N', name: 'Сдвиговый регистр', brand: 'Texas Instruments', category: 'Логика', eolDate: 'В производстве*', replacement: '74HC595 от NXP/Diodes' },
 { sku: 'FT232RL', name: 'USB-UART мост', brand: 'FTDI', category: 'Интерфейсы', eolDate: '2022', replacement: 'CP2102 от Silicon Labs' },
 { sku: 'IRFZ44N', name: 'MOSFET N-Channel 55V 49A', brand: 'Infineon', category: 'Транзисторы', eolDate: '2023', replacement: 'IRFZ44N от Vishay' },
 { sku: 'TDA7294', name: 'Усилитель звука 100W', brand: 'STMicroelectronics', category: 'Аудио', eolDate: '2020', replacement: 'TDA7498E' },
];

const faqItems = [
 {
 question: 'Что такое EOL-компоненты?',
 answer: 'EOL (End of Life) — это компоненты, снятые с производства. Производитель прекращает их выпуск и продажу, но они всё ещё могут требоваться для обслуживания существующих устройств, ремонта и поддержки legacy-систем. Для таких компонентов существует несколько решений: закупка из складских остатков, покупка на вторичном рынке или подбор современного аналога.',
 },
 {
 question: 'Как вы находите снятые с производства компоненты?',
 answer: 'Мы используем несколько каналов: прямые контракты с дистрибьюторами, у которых могут оставаться складские остатки; партнёрскую сеть из более 50 поставщиков по всему миру; проверенные брокеры с резервными запасами. Каждый найденный компонент проходит входной контроль в лаборатории СВП для подтверждения оригинальности и работоспособности.',
 },
 {
 question: 'Можно ли гарантировать оригинальность EOL-компонентов?',
 answer: 'Да. Каждая партия снятых с производства компонентов проходит полный входной контроль: рентгеновский контроль кристалла, декэпсуляция для проверки внутренней структуры, электрические тесты параметров по даташиту и визуальный осмотр маркировки под микроскопом. Мы не работаем с «серыми» каналами — только авторизованные дистрибьюторы и проверенные поставщики.',
 },
 {
 question: 'Что если EOL-компонент невозможно найти?',
 answer: 'Если компонент полностью недоступен на рынке, мы подбираем современный аналог с максимальной совместимостью. Наши инженеры анализируют параметры оригинала и предлагают замены от доступных производителей. Совместимость проверяется в лаборатории на реальной схеме. В ряде случаев возможна переработка PCB для установки аналога в другом корпусе.',
 },
 {
 question: 'Сколько стоят снятые с производства компоненты?',
 answer: 'Стоимость EOL-компонентов зависит от редкости, объёма партии и канала поставки. Как правило, последние складские остатки стоят дороже текущих аналогов на 20–100%. Компоненты с вторичного рынка могут быть ещё дороже. Мы всегда предлагаем два варианта: поставку оригинального EOL-компонента и подбор современного аналога — клиент выбирает оптимальный по соотношению цена/сроки.',
 },
];

const breadcrumbLd = {
 '@context': 'https://schema.org',
 '@type': 'BreadcrumbList',
 itemListElement: [
 { '@type': 'ListItem', position: 1, name: 'Главная', item: BASE_URL },
 { '@type': 'ListItem', position: 2, name: 'Снятые с производства', item: `${BASE_URL}/obsolete` },
 ],
};

const serviceLd = {
 '@context': 'https://schema.org',
 '@type': 'Service',
 name: 'Поставка снятых с производства электронных компонентов',
 description: 'Поиск и поставка EOL/obsolete электронных компонентов. Последние партии, складские остатки, подбор современных аналогов.',
 provider: {
 '@type': 'Organization',
 name: 'ChipNet (ООО Деловой Партнёр)',
 url: BASE_URL,
 },
 areaServed: { '@type': 'Country', name: 'Россия' },
 serviceType: 'Поставка EOL электронных компонентов',
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

export default function ObsoletePage() {
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
 <span className="text-[#666]">Снятые с производства</span>
 </nav>
 <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-primary-dark bg-clip-text text-transparent">
 Снятые с производства электронные компоненты
 </h1>
 <p className="text-lg text-[#666] max-w-3xl mb-4">
 Поиск и поставка EOL-компонентов (End of Life): последние складские партии, резервные запасы
 дистрибьюторов и подбор современных аналогов. Проверка оригинальности в лаборатории СВП.
 </p>
 <p className="text-base text-[#757575] max-w-3xl">
 Когда производитель снимает компонент с производства, это не означает конец вашего проекта.
 Мы находим оригиналы из складских остатков или подбираем совместимые аналоги с гарантией
 работоспособности.
 </p>
 </div>
 </section>

 {/* Search */}
 <section className="px-4 pb-16">
 <div className="max-w-7xl mx-auto">
 <ComponentSearch />
 </div>
 </section>

 {/* EOL Components Table */}
 <section className="px-4 pb-20">
 <div className="max-w-7xl mx-auto">
 <h2 className="text-3xl font-bold mb-4">Запрашиваемые EOL-компоненты</h2>
 <p className="text-[#666] mb-8 max-w-2xl">
 Популярные компоненты, снятые с производства или близкие к снятию, по которым мы регулярно
 получаем запросы. Для каждого компонента указан рекомендуемый аналог.
 </p>
 <div className="overflow-x-auto rounded-xl border border-[#e8e8e8]">
 <table className="w-full text-sm">
 <thead>
 <tr className="bg-[#eaf0e8] border-b border-[#e8e8e8]">
 <th className="text-left py-4 px-4 text-[#666] font-medium">Артикул</th>
 <th className="text-left py-4 px-4 text-[#666] font-medium">Наименование</th>
 <th className="text-left py-4 px-4 text-[#666] font-medium">Бренд</th>
 <th className="text-left py-4 px-4 text-[#666] font-medium">Категория</th>
 <th className="text-left py-4 px-4 text-[#666] font-medium">Статус</th>
 <th className="text-left py-4 px-4 text-[#666] font-medium">Рекомендуемый аналог</th>
 </tr>
 </thead>
 <tbody>
 {eolComponents.map((comp) => (
 <tr key={comp.sku} className="border-b border-[#e8e8e8] hover:bg-[#eaf0e8] transition-colors">
 <td className="py-3 px-4">
 <Link
 href={`/component/${comp.sku}`}
 className="text-primary hover:text-emerald-300 font-mono font-medium transition-colors"
 >
 {comp.sku}
 </Link>
 </td>
 <td className="py-3 px-4 text-[#333] max-w-xs truncate">{comp.name}</td>
 <td className="py-3 px-4 text-[#666]">{comp.brand}</td>
 <td className="py-3 px-4 text-[#666]">{comp.category}</td>
 <td className="py-3 px-4">
 {comp.eolDate.includes('производстве') ? (
 <span className="px-2 py-1 rounded-full bg-section-alt text-primary text-xs">Active*</span>
 ) : (
 <span className="px-2 py-1 rounded-full bg-red-50 text-danger text-xs">EOL {comp.eolDate}</span>
 )}
 </td>
 <td className="py-3 px-4">
 <Link href={`/analogs`} className="text-primary hover:text-emerald-300 transition-colors text-xs">
 {comp.replacement}
 </Link>
 </td>
 </tr>
 ))}
 </tbody>
 </table>
 </div>
 <p className="text-xs text-[#757575] mt-3">
 * Компоненты помеченные «Active*» находятся в производстве, но имеют ограничения по поставкам или планируемый EOL.
 </p>
 </div>
 </section>

 {/* Solutions */}
 <section className="px-4 pb-20 bg-section-accent/30">
 <div className="max-w-7xl mx-auto py-20">
 <h2 className="text-3xl font-bold mb-4">Решения для EOL-компонентов</h2>
 <p className="text-[#666] mb-12 max-w-2xl">
 В зависимости от ситуации и требований проекта мы предлагаем три основных подхода
 к решению проблемы снятых с производства компонентов.
 </p>
 <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
 <div className="bg-[#f0f4ee] rounded-2xl border border-[#e8e8e8] p-6 hover:border-primary/30 hover:shadow-lg transition-all">
 <h3 className="text-lg font-semibold mb-3 text-[#121212]">Поиск складских остатков</h3>
 <p className="text-[#666] text-sm leading-relaxed">
 Находим оригинальные EOL-компоненты из складских остатков авторизованных дистрибьюторов
 по всему миру. Каждый компонент проверяется в лаборатории СВП: рентген, декэпсуляция,
 электрические тесты. Гарантируем оригинальность и работоспособность.
 </p>
 </div>
 <div className="bg-[#f0f4ee] rounded-2xl border border-[#e8e8e8] p-6 hover:border-primary/30 hover:shadow-lg transition-all">
 <h3 className="text-lg font-semibold mb-3 text-[#121212]">Подбор современных аналогов</h3>
 <p className="text-[#666] text-sm leading-relaxed">
 Подбираем актуальные аналоги снятых с производства компонентов с максимальной
 совместимостью. Кросс-референсы проверяются инженерами на соответствие электрических
 параметров, корпуса и температурного диапазона. Лабораторная верификация на стенде.
 </p>
 </div>
 <div className="bg-[#f0f4ee] rounded-2xl border border-[#e8e8e8] p-6 hover:border-primary/30 hover:shadow-lg transition-all">
 <h3 className="text-lg font-semibold mb-3 text-[#121212]">Last-time buy закупка</h3>
 <p className="text-[#666] text-sm leading-relaxed">
 При получении уведомления о планируемом EOL-статусе компонента организуем срочную
 закупку партии для обеспечения производства на весь оставшийся жизненный цикл изделия.
 Хранение на нашем складе с соблюдением температурно-влажностного режима.
 </p>
 </div>
 </div>
 </div>
 </section>

 {/* How it works */}
 <section className="px-4 pb-20">
 <div className="max-w-7xl mx-auto">
 <h2 className="text-3xl font-bold mb-4">Процесс поставки EOL-компонентов</h2>
 <p className="text-[#666] mb-12 max-w-2xl">
 От вашего запроса до получения компонентов — каждый этап под контролем.
 </p>
 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
 {[
 {
 step: '01',
 title: 'Запрос и идентификация',
 description: 'Вы отправляете список EOL-компонентов с указанием артикулов и требуемого количества. Мы проверяем статус компонентов через базы данных производителей и дистрибьюторов, подтверждаем EOL-статус и дату снятия с производства.',
 },
 {
 step: '02',
 title: 'Поиск на рынке',
 description: 'Обращаемся к нашей сети из 50+ поставщиков по всему миру: авторизованные дистрибьюторы с остатками, проверенные брокеры, склады долгосрочного хранения. Формируем отчёт о доступности по каждому компоненту.',
 },
 {
 step: '03',
 title: 'Входной контроль',
 description: 'Каждая найденная партия проходит проверку в аккредитованной лаборатории СВП: рентгеновский контроль кристалла, декэпсуляция, электрические тесты, визуальный осмотр. Гарантируем оригинальность и работоспособность.',
 },
 {
 step: '04',
 title: 'Доставка и документация',
 description: 'Организуем логистику с полным таможенным оформлением. Предоставляем полный пакет документов: сертификаты происхождения, отчёты о входном контроле, таможенные декларации. Доставка от 6 дней.',
 },
 ].map((item) => (
 <div
 key={item.step}
 className="relative bg-gradient-to-br from-primary/5 to-primary-dark/5 rounded-2xl border border-primary/10 p-6 hover:border-primary/30 transition-all"
 >
 <span className="text-5xl font-bold text-primary/10 absolute top-4 right-4">{item.step}</span>
 <h3 className="text-lg font-semibold mb-3 text-[#121212]">{item.title}</h3>
 <p className="text-[#666] text-sm leading-relaxed">{item.description}</p>
 </div>
 ))}
 </div>
 </div>
 </section>

 {/* FAQ */}
 <section className="px-4 pb-20 bg-section-accent/30">
 <div className="max-w-4xl mx-auto py-20">
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
 Нужны снятые с производства компоненты?
 </h2>
 <p className="text-[#666] mb-8 max-w-xl mx-auto">
 Отправьте заявку с артикулами EOL-компонентов — найдём оригиналы из складских остатков
 или подберём современные аналоги с гарантией совместимости.
 </p>
 <div className="flex flex-col sm:flex-row gap-4 justify-center">
 <Link
 href="/#bom"
 className="inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark text-[#121212] font-medium px-8 py-3 rounded-lg transition-colors"
 >
 Запросить EOL-компоненты
 <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
 </Link>
 <Link
 href="/analogs"
 className="inline-flex items-center justify-center gap-2 border border-primary text-primary hover:bg-primary/5 font-medium px-8 py-3 rounded-lg transition-colors"
 >
 Подобрать аналоги
 </Link>
 </div>
 </div>
 </section>
 </main>
 </>
 );
}

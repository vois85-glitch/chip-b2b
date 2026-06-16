import { Metadata } from 'next';
import Link from 'next/link';
import ComponentSearch from '@/components/sections/ComponentSearch';

const BASE_URL = 'https://www.chip-net.ru';

export const revalidate = 3600;

export const metadata: Metadata = {
 title: 'Подбор аналогов электронных компонентов — кросс-референсы',
 description: 'Подбор аналогов электронных компонентов: STM32 → GD32/HK32, Xilinx FPGA → Gowin/Efinix, TI LDO → Richtek/Silergy. Кросс-референсы с проверкой совместимости в лаборатории СВП.',
 alternates: {
 canonical: `${BASE_URL}/analogs`,
 },
 openGraph: {
 title: 'Подбор аналогов электронных компонентов — кросс-референсы',
 description: 'Подбор аналогов электронных компонентов: STM32 → GD32/HK32, Xilinx FPGA → Gowin/Efinix, TI LDO → Richtek/Silergy. Кросс-референсы с проверкой совместимости.',
 url: `${BASE_URL}/analogs`,
 type: 'website',
 locale: 'ru_RU',
 siteName: 'ChipNet',
 },
};

type AnalogGroup = {
 category: string;
 original: string;
 originalBrand: string;
 analogs: { name: string; brand: string; slug: string; compatibility: string }[];
};

const analogGroups: AnalogGroup[] = [
 {
 category: 'Микроконтроллеры',
 original: 'STM32F103C8T6',
 originalBrand: 'STMicroelectronics',
 analogs: [
 { name: 'GD32F103C8T6', brand: 'Gigadevice', slug: 'gigadevice', compatibility: 'Pin-to-pin, 100%' },
 { name: 'HK32F103C8T6', brand: 'HK Microelectronics', slug: 'gigadevice', compatibility: 'Pin-to-pin, 95%' },
 { name: 'CH32F103C8T6', brand: 'WCH', slug: 'gigadevice', compatibility: 'Pin-to-pin, 90%' },
 ],
 },
 {
 category: 'Микроконтроллеры',
 original: 'STM32F407VET6',
 originalBrand: 'STMicroelectronics',
 analogs: [
 { name: 'GD32F407VET6', brand: 'Gigadevice', slug: 'gigadevice', compatibility: 'Pin-to-pin, 98%' },
 { name: 'HK32F407VET6', brand: 'HK Microelectronics', slug: 'gigadevice', compatibility: 'Pin-to-pin, 93%' },
 ],
 },
 {
 category: 'FPGA',
 original: 'XC7A35T (Artix-7)',
 originalBrand: 'Xilinx',
 analogs: [
 { name: 'GW2A-18', brand: 'Gowin Semiconductor', slug: 'gowin', compatibility: 'Функциональный аналог' },
 { name: 'T20F256', brand: 'Efinix', slug: 'efinix', compatibility: 'Функциональный аналог' },
 ],
 },
 {
 category: 'FPGA',
 original: 'XC3S200A (Spartan-3A)',
 originalBrand: 'Xilinx',
 analogs: [
 { name: 'GW1N-4', brand: 'Gowin Semiconductor', slug: 'gowin', compatibility: 'Замена EOL серии' },
 { name: 'T8F81', brand: 'Efinix', slug: 'efinix', compatibility: 'Замена EOL серии' },
 ],
 },
 {
 category: 'LDO стабилизаторы',
 original: 'AMS1117-3.3',
 originalBrand: 'Texas Instruments',
 analogs: [
 { name: 'RT9193-33', brand: 'Richtek', slug: 'richtek', compatibility: 'Pin-to-pin, 100%' },
 { name: 'SY8009', brand: 'Silergy', slug: 'silergy', compatibility: 'Pin-to-pin, 95%' },
 ],
 },
 {
 category: 'LDO стабилизаторы',
 original: 'TLV1117-33',
 originalBrand: 'Texas Instruments',
 analogs: [
 { name: 'RT9169-33', brand: 'Richtek', slug: 'richtek', compatibility: 'Pin-to-pin, 100%' },
 { name: 'AP1117-33', brand: 'Diodes Inc', slug: 'diodes-inc', compatibility: 'Pin-to-pin, 100%' },
 ],
 },
 {
 category: 'Силовые MOSFET',
 original: 'IPD50N06S2L-23',
 originalBrand: 'Infineon',
 analogs: [
 { name: 'FDD86102', brand: 'onsemi', slug: 'onsemi', compatibility: 'Параметрический аналог' },
 { name: 'STP75NF75', brand: 'STMicroelectronics', slug: 'stmicroelectronics', compatibility: 'Параметрический аналог' },
 ],
 },
 {
 category: 'Силовые MOSFET',
 original: 'IRFZ44N',
 originalBrand: 'Infineon',
 analogs: [
 { name: 'FDD8424H', brand: 'onsemi', slug: 'onsemi', compatibility: 'Параметрический аналог' },
 { name: 'STW88NF20', brand: 'STMicroelectronics', slug: 'stmicroelectronics', compatibility: 'Параметрический аналог' },
 ],
 },
 {
 category: 'Операционные усилители',
 original: 'OPA2134PA',
 originalBrand: 'Analog Devices',
 analogs: [
 { name: 'NE5532P', brand: 'Texas Instruments', slug: 'texas-instruments', compatibility: 'Функциональный аналог' },
 { name: 'MCP6002', brand: 'Microchip', slug: 'microchip', compatibility: 'Функциональный аналог' },
 ],
 },
 {
 category: 'Операционные усилители',
 original: 'AD8512ARZ',
 originalBrand: 'Analog Devices',
 analogs: [
 { name: 'TL072CP', brand: 'Texas Instruments', slug: 'texas-instruments', compatibility: 'Функциональный аналог' },
 { name: 'MCP6022', brand: 'Microchip', slug: 'microchip', compatibility: 'Функциональный аналог' },
 ],
 },
];

const faqItems = [
 {
 question: 'Что такое кросс-референс электронных компонентов?',
 answer: 'Кросс-референс (cross-reference) — это таблица соответствия между компонентами разных производителей, которые имеют аналогичные электрические параметры и корпусное исполнение. Кросс-референсы позволяют заменить unavailable или санкционный компонент на доступный аналог с минимальными изменениями в схеме и PCB.',
 },
 {
 question: 'Насколько точна замена STM32 на GD32?',
 answer: 'Микроконтроллеры GD32 от Gigadevice являются практически полными аналогами STM32 с совместимостью pin-to-pin и программной на уровне 95–100%. Они используют то же ядро ARM Cortex-M, те же периферийные блоки и те же регистры. Основные отличия могут быть в предельных частотах и некоторых специфических режимах работы периферии. Мы проверяем совместимость каждого аналога в лаборатории.',
 },
 {
 question: 'Можно ли заменить Xilinx FPGA на Gowin?',
 answer: 'Да, замена возможна, но она не является pin-to-pin. Gowin предоставляет инструменты миграции проектов, а наши инженеры помогают адаптировать HDL-код и пин-назначения для нового кристалла. По производительности серии Gowin Arora сопоставимы с Artix-7, а GW1N — с Spartan-6. Для каждой конкретной задачи мы оцениваем совместимость индивидуально.',
 },
 {
 question: 'Как вы проверяете совместимость аналогов?',
 answer: 'Проверка проходит в три этапа: 1) Сравнение параметров по даташиту — электрические характеристики, температурный диапазон, корпус; 2) Лабораторные тесты — измерение реальных параметров на стенде, проверка работы в схеме заказчика; 3) Рентгеновский контроль и декэпсуляция для подтверждения оригинальности самого аналога.',
 },
 {
 question: 'Сколько стоит подбор аналогов?',
 answer: 'Базовый подбор аналогов по кросс-референсам — бесплатно. Вы отправляете BOM-лист, и мы подбираем доступные аналоги для каждой позиции. Лабораторная проверка совместимости на стенде — оплачивается отдельно, стоимость зависит от сложности компонента и объёма тестов. Для постоянных клиентов с BOM от 50 позиций — бесплатная верификация аналогов.',
 },
];

const breadcrumbLd = {
 '@context': 'https://schema.org',
 '@type': 'BreadcrumbList',
 itemListElement: [
 { '@type': 'ListItem', position: 1, name: 'Главная', item: BASE_URL },
 { '@type': 'ListItem', position: 2, name: 'Подбор аналогов', item: `${BASE_URL}/analogs` },
 ],
};

const serviceLd = {
 '@context': 'https://schema.org',
 '@type': 'Service',
 name: 'Подбор аналогов электронных компонентов',
 description: 'Кросс-референсы и подбор аналогов санкционных и unavailable электронных компонентов с проверкой совместимости в лаборатории СВП.',
 provider: {
 '@type': 'Organization',
 name: 'ChipNet (ООО Деловой Партнёр)',
 url: BASE_URL,
 },
 areaServed: { '@type': 'Country', name: 'Россия' },
 serviceType: 'Подбор аналогов электронных компонентов',
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

export default function AnalogsPage() {
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
 <span className="text-[#666]">Подбор аналогов</span>
 </nav>
 <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-primary-dark bg-clip-text text-transparent">
 Подбор аналогов электронных компонентов
 </h1>
 <p className="text-lg text-[#666] max-w-3xl mb-4">
 Кросс-референсы и подбор аналогов санкционных и unavailable электронных компонентов.
 Инженерная экспертиза с проверкой совместимости в аккредитованной лаборатории СВП.
 </p>
 <p className="text-base text-[#757575] max-w-3xl">
 Замена STM32 на GD32/HK32, Xilinx FPGA на Gowin/Efinix, TI LDO на Richtek/Silergy,
 Infineon MOSFET на onsemi — проверенные решения для импортозамещения.
 </p>
 </div>
 </section>

 {/* Search */}
 <section className="px-4 pb-16">
 <div className="max-w-7xl mx-auto">
 <ComponentSearch />
 </div>
 </section>

 {/* Cross-reference Tables */}
 <section className="px-4 pb-20">
 <div className="max-w-7xl mx-auto">
 <h2 className="text-3xl font-bold mb-4">Таблицы кросс-референсов</h2>
 <p className="text-[#666] mb-12 max-w-2xl">
 Актуальные кросс-референсы для основных категорий компонентов. Данные проверены инженерами
 ChipNet на соответствие электрических параметров и корпусной совместимости.
 </p>

 {Array.from(new Set(analogGroups.map(g => g.category))).map((category) => (
 <div key={category} className="mb-12">
 <h3 className="text-2xl font-bold mb-6 text-primary">{category}</h3>
 <div className="overflow-x-auto rounded-xl border border-[#e8e8e8]">
 <table className="w-full text-sm">
 <thead>
 <tr className="bg-[#eaf0e8] border-b border-[#e8e8e8]">
 <th className="text-left py-4 px-4 text-[#666] font-medium">Оригинал</th>
 <th className="text-left py-4 px-4 text-[#666] font-medium">Производитель</th>
 <th className="text-left py-4 px-4 text-[#666] font-medium">Аналог</th>
 <th className="text-left py-4 px-4 text-[#666] font-medium">Бренд аналога</th>
 <th className="text-left py-4 px-4 text-[#666] font-medium">Совместимость</th>
 </tr>
 </thead>
 <tbody>
 {analogGroups
.filter(g => g.category === category)
.flatMap(group =>
 group.analogs.map((analog, i) => (
 <tr
 key={`${group.original}-${analog.name}`}
 className="border-b border-[#e8e8e8] hover:bg-[#eaf0e8] transition-colors"
 >
 {i === 0 && (
 <td
 className="py-3 px-4 font-mono font-medium text-primary"
 rowSpan={group.analogs.length}
 >
 <Link href={`/catalog?q=${encodeURIComponent(group.original)}`} className="hover:text-emerald-300 transition-colors">
 {group.original}
 </Link>
 </td>
 )}
 {i === 0 && (
 <td
 className="py-3 px-4 text-[#666]"
 rowSpan={group.analogs.length}
 >
 <Link href={`/brand/${group.analogs[0].slug}`} className="hover:text-primary transition-colors">
 {group.originalBrand}
 </Link>
 </td>
 )}
 <td className="py-3 px-4 font-mono">{analog.name}</td>
 <td className="py-3 px-4">
 <Link href={`/brand/${analog.slug}`} className="text-primary hover:text-emerald-300 transition-colors">
 {analog.brand}
 </Link>
 </td>
 <td className="py-3 px-4">
 <span className={`px-2 py-1 rounded-full text-xs ${
 analog.compatibility.includes('100%')
 ? 'bg-primary/10 text-primary'
 : analog.compatibility.includes('Pin-to-pin')
 ? 'bg-[#eaf0e8] text-primary'
 : 'bg-[#f0f4ee] text-[#666]'
 }`}>
 {analog.compatibility}
 </span>
 </td>
 </tr>
 ))
 )}
 </tbody>
 </table>
 </div>
 </div>
 ))}
 </div>
 </section>

 {/* How it works */}
 <section className="px-4 pb-20 bg-section-accent/30">
 <div className="max-w-7xl mx-auto py-20">
 <h2 className="text-3xl font-bold mb-4">Как работает подбор аналогов</h2>
 <p className="text-[#666] mb-12 max-w-2xl">
 Процесс подбора аналога состоит из нескольких этапов, каждый из которых гарантирует
 корректность замены и сохранение работоспособности вашего устройства.
 </p>
 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
 {[
 {
 step: '01',
 title: 'Анализ BOM',
 description: 'Вы отправляете BOM-лист или спецификацию. Наши инженеры анализируют каждую позицию на предмет доступности и необходимости подбора аналога.',
 },
 {
 step: '02',
 title: 'Кросс-референс',
 description: 'Подбираем аналоги по базе кросс-референсов с учётом электрических параметров, корпуса, температурного диапазона и условий эксплуатации.',
 },
 {
 step: '03',
 title: 'Лабораторная проверка',
 description: 'Проверяем аналоги в аккредитованной лаборатории СВП: измеряем параметры, подтверждаем работоспособность в схеме, гарантируем оригинальность.',
 },
 {
 step: '04',
 title: 'Поставка и поддержка',
 description: 'Поставляем аналоги с полным пакетом документации. При необходимости оказываем техническую поддержку по интеграции аналога в ваше изделие.',
 },
 ].map((item) => (
 <div
 key={item.step}
 className="relative bg-[#f0f4ee] rounded-2xl border border-[#e8e8e8] p-6 hover:border-primary/30 hover:shadow-lg transition-all group"
 >
 <span className="text-5xl font-bold text-primary/10 group-hover:text-primary/20 transition-colors absolute top-4 right-4">
 {item.step}
 </span>
 <h3 className="text-lg font-semibold mb-3 text-[#121212]">{item.title}</h3>
 <p className="text-[#666] text-sm leading-relaxed">{item.description}</p>
 </div>
 ))}
 </div>
 </div>
 </section>

 {/* Related categories */}
 <section className="px-4 pb-20">
 <div className="max-w-7xl mx-auto">
 <h2 className="text-3xl font-bold mb-4">Категории с доступными аналогами</h2>
 <p className="text-[#666] mb-8 max-w-2xl">
 Наиболее востребованные категории компонентов, для которых мы регулярно подбираем аналоги.
 </p>
 <div className="flex flex-wrap gap-3">
 {[
 { title: 'Микроконтроллеры ARM', slug: 'arm-kontrollery' },
 { title: 'FPGA / ПЛИС', slug: 'fpga' },
 { title: 'Стабилизаторы напряжения', slug: 'stabilizatory' },
 { title: 'MOSFET транзисторы', slug: 'mosfet' },
 { title: 'Операционные усилители', slug: 'operatsionnye-usiliteli' },
 { title: 'АЦП/ЦАП', slug: 'adc-dac' },
 { title: 'Конденсаторы', slug: 'kondensatory' },
 { title: 'Диоды', slug: 'diody' },
 ].map((cat) => (
 <Link
 key={cat.slug}
 href={`/${cat.slug}`}
 className="px-4 py-2 bg-[#eaf0e8] border border-[#e8e8e8] rounded-lg text-sm text-[#333] hover:text-primary hover:border-primary/30 transition-all"
 >
 {cat.title}
 </Link>
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
 Нужен подбор аналогов?
 </h2>
 <p className="text-[#666] mb-8 max-w-xl mx-auto">
 Отправьте BOM-лист — подберём доступные аналоги для каждой позиции, проверим
 совместимость в лаборатории и подготовим коммерческое предложение.
 </p>
 <div className="flex flex-col sm:flex-row gap-4 justify-center">
 <Link
 href="/#bom"
 className="inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark text-[#121212] font-medium px-8 py-3 rounded-lg transition-colors"
 >
 Отправить BOM-лист
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

import { Metadata } from 'next';
import Link from 'next/link';
import ComponentSearch from '@/components/sections/ComponentSearch';

const BASE_URL = 'https://www.chip-net.ru';

export const revalidate = 3600;

export const metadata: Metadata = {
 title: 'Даташиты электронных компонентов — техническая документация',
 description: 'Даташиты электронных компонентов: микроконтроллеры, FPGA, транзисторы, конденсаторы, операционные усилители. Техническая документация для проектирования. Подбор компонентов по параметрам.',
 alternates: {
 canonical: `${BASE_URL}/datasheets`,
 },
 openGraph: {
 title: 'Даташиты электронных компонентов — техническая документация',
 description: 'Даташиты электронных компонентов: микроконтроллеры, FPGA, транзисторы, конденсаторы, операционные усилители. Техническая документация для проектирования.',
 url: `${BASE_URL}/datasheets`,
 type: 'website',
 locale: 'ru_RU',
 siteName: 'ChipNet',
 },
};

type DatasheetCategory = {
 title: string;
 slug: string;
 description: string;
 keyParams: string[];
 exampleSku: string;
};

const datasheetCategories: DatasheetCategory[] = [
 {
 title: 'Микроконтроллеры',
 slug: 'arm-kontrollery',
 description: 'Даташиты микроконтроллеров ARM Cortex-M, AVR, PIC: описание выводов, электрические параметры, периферия, карта памяти, временные диаграммы.',
 keyParams: ['Тактовая частота', 'Объём Flash/SRAM', 'Периферия', 'Корпус'],
 exampleSku: 'STM32F103C8T6',
 },
 {
 title: 'FPGA / ПЛИС',
 slug: 'fpga',
 description: 'Даташиты FPGA: логические ресурсы, блоки памяти, DSP-блоки, трансиверы, характеристики ввода-вывода, рассеиваемая мощность.',
 keyParams: ['Число LUT', 'Блоки RAM', 'DSP-блоки', 'Трансиверы'],
 exampleSku: 'XC7A35T-1FTG256C',
 },
 {
 title: 'Транзисторы MOSFET',
 slug: 'mosfet',
 description: 'Даташиты MOSFET: Rds(on), пороговое напряжение, максимальный ток и напряжение, заряд затвора, тепловое сопротивление, безопасная область работы.',
 keyParams: ['Rds(on)', 'Vds max', 'Id max', 'Qg'],
 exampleSku: 'IRFZ44N',
 },
 {
 title: 'Конденсаторы',
 slug: 'kondensatory',
 description: 'Даташиты конденсаторов MLCC, электролитических, танталовых: номинал, допуск, температурный коэффициент, ESR, ESL, срок службы.',
 keyParams: ['Ёмкость', 'Номинальное напряжение', 'Диэлектрик', 'ESR'],
 exampleSku: 'GRM21BR71C104KA01',
 },
 {
 title: 'Стабилизаторы напряжения',
 slug: 'stabilizatory',
 description: 'Даташиты LDO и импульсных стабилизаторов: выходное напряжение, максимальный ток, падение напряжения, КПД, шум, стабильность.',
 keyParams: ['Vout', 'Iout max', 'Dropout', 'КПД'],
 exampleSku: 'AMS1117-3.3',
 },
 {
 title: 'Операционные усилители',
 slug: 'operatsionnye-usiliteli',
 description: 'Даташиты ОУ: полоса пропускания, напряжение смещения, входной ток, скорость нарастания, напряжение питания, шум.',
 keyParams: ['GBP', 'Vos', 'Ib', 'SR'],
 exampleSku: 'OPA2134PA',
 },
 {
 title: 'АЦП / ЦАП',
 slug: 'adc-dac',
 description: 'Даташиты АЦП и ЦАП: разрешение, частота дискретизации, DNL/INL, потребление, интерфейс, входной диапазон.',
 keyParams: ['Разрешение', 'Частота выборки', 'DNL/INL', 'Интерфейс'],
 exampleSku: 'ADS1115IDGS',
 },
 {
 title: 'Разъёмы',
 slug: 'razemy',
 description: 'Даташиты разъёмов: тип контактов, шаг, число контактов, номинальный ток и напряжение, механическая прочность, степень защиты.',
 keyParams: ['Шаг', 'Число контактов', 'Номинальный ток', 'IP-рейтинг'],
 exampleSku: '5055700601',
 },
 {
 title: 'Диоды',
 slug: 'diody',
 description: 'Даташиты диодов: прямое напряжение, обратный ток, максимальный прямой ток, время восстановления, ёмкость перехода.',
 keyParams: ['Vf', 'Vr max', 'If max', 'trr'],
 exampleSku: 'SS34',
 },
 {
 title: 'Датчики',
 slug: 'datchiki',
 description: 'Даташиты датчиков: диапазон измерения, точность, интерфейс, напряжение питания, температурный диапазон.',
 keyParams: ['Диапазон', 'Точность', 'Интерфейс', 'Питание'],
 exampleSku: 'DS18B20+',
 },
 {
 title: 'Оптоэлектроника',
 slug: 'optoelektronika',
 description: 'Даташиты оптопар и оптореле: коэффициент передачи, изоляция, скорость переключения, CTR, выходной ток.',
 keyParams: ['CTR', 'V isolation', 'Скорость', 'Iout'],
 exampleSku: 'PC817C',
 },
 {
 title: 'Память',
 slug: 'pamyat',
 description: 'Даташиты микросхем памяти Flash, SRAM, EEPROM: организация, время доступа, число циклов перезаписи, интерфейс, напряжение.',
 keyParams: ['Объём', 'Время доступа', 'Интерфейс', 'Циклы R/W'],
 exampleSku: 'W25Q128JVSIQ',
 },
];

const faqItems = [
 {
 question: 'Что такое даташит электронного компонента?',
 answer: 'Даташит (datasheet) — это официальный технический документ от производителя, содержащий полное описание компонента: электрические параметры, предельные режимы, корпусное исполнение, типовую схему включения, временные диаграммы и рекомендации по проектированию. Даташит является основным источником информации для инженера-схемотехника при выборе и применении компонента.',
 },
 {
 question: 'Какие параметры обязательно проверять в даташите?',
 answer: 'Для каждого типа компонентов свои критичные параметры. Для микроконтроллеров — тактовая частота, объём памяти, периферия, корпус. Для MOSFET — Rds(on), максимальное напряжение и ток, заряд затвора. Для конденсаторов — номинал, допуск, температурный коэффициент, ESR. Важно проверять разделы Absolute Maximum Ratings и Recommended Operating Conditions — первый указывает предельные значения, второй — нормальные условия работы.',
 },
 {
 question: 'Чем отличаются Absolute Maximum Ratings от Recommended Operating Conditions?',
 answer: 'Absolute Maximum Ratings — это предельные значения параметров, при превышении которых компонент может быть необратимо повреждён. Это не рабочие значения! Recommended Operating Conditions — это диапазон параметров, в котором компонент гарантированно работает с заявленными характеристиками. Проектировать нужно по Recommended Operating Conditions с запасом от Absolute Maximum Ratings.',
 },
 {
 question: 'Где найти даташит на снятый с производства компонент?',
 answer: 'Даташиты на EOL-компоненты обычно доступны на сайтах производителей в архивных разделах, а также на специализированных ресурсах вроде Alldatasheet, DatasheetCatalog и Mouser. Если даташит недоступен, мы можем предоставить документацию из нашей базы — свяжитесь с нами для запроса.',
 },
 {
 question: 'Можете ли вы помочь с интерпретацией даташита?',
 answer: 'Да, наши инженеры помогут разобраться в даташите любого компонента: проконсультируют по критичным параметрам, подберут оптимальный режим работы, предложат аналоги с лучшими характеристиками для вашей задачи. Техническая консультация бесплатна при заказе компонентов через ChipNet.',
 },
];

const breadcrumbLd = {
 '@context': 'https://schema.org',
 '@type': 'BreadcrumbList',
 itemListElement: [
 { '@type': 'ListItem', position: 1, name: 'Главная', item: BASE_URL },
 { '@type': 'ListItem', position: 2, name: 'Даташиты', item: `${BASE_URL}/datasheets` },
 ],
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

export default function DatasheetsPage() {
 return (
 <>
 <script
 type="application/ld+json"
 dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
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
 <span className="text-[#666]">Даташиты</span>
 </nav>
 <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-primary-dark bg-clip-text text-transparent">
 Даташиты электронных компонентов
 </h1>
 <p className="text-lg text-[#666] max-w-3xl mb-4">
 Техническая документация и даташиты для основных категорий электронных компонентов.
 Поиск по артикулу, подбор по параметрам, помощь в интерпретации характеристик.
 </p>
 <p className="text-base text-[#757575] max-w-3xl">
 Даташит (datasheet) — основной документ для проектирования электронных устройств.
 В нём содержатся электрические параметры, предельные режимы, типовые схемы включения
 и рекомендации по применению каждого компонента.
 </p>
 </div>
 </section>

 {/* Search */}
 <section className="px-4 pb-16">
 <div className="max-w-7xl mx-auto">
 <ComponentSearch />
 </div>
 </section>

 {/* What's in a datasheet */}
 <section className="px-4 pb-20 bg-section-accent/30">
 <div className="max-w-7xl mx-auto py-20">
 <h2 className="text-3xl font-bold mb-4">Что содержит даташит</h2>
 <p className="text-[#666] mb-12 max-w-2xl">
 Стандартный даташит электронного компонента включает несколько обязательных разделов,
 каждый из которых важен для корректного проектирования.
 </p>
 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
 {[
 {
 title: 'Absolute Maximum Ratings',
 description: 'Предельно допустимые значения напряжения, тока, температуры и мощности. Превышение этих значений может привести к необратимому повреждению компонента. Никогда не проектируйте на пределе — оставляйте запас минимум 20–30%.',
 },
 {
 title: 'Recommended Operating Conditions',
 description: 'Рекомендуемые условия работы, при которых компонент гарантирует заявленные характеристики. Это реальный рабочий диапазон, на который нужно ориентироваться при проектировании. Указаны типичные и предельные значения.',
 },
 {
 title: 'Electrical Characteristics',
 description: 'Электрические параметры: входные и выходные токи и напряжения, задержки, потребление, точность, шум. Приводятся типичные, минимальные и максимальные значения при определённых условиях температуры и питания.',
 },
 {
 title: 'Timing Diagrams',
 description: 'Временные диаграммы для цифровых компонентов: задержки распространения, время установления и удержания, минимальные интервалы между сигналами. Критически важны для корректной работы интерфейсов.',
 },
 {
 title: 'Typical Application Circuits',
 description: 'Типовые схемы включения с номиналами внешних компонентов. Рекомендуются производителем как проверенные решения для типичных применений. Отличная отправная точка для проектирования.',
 },
 {
 title: 'Package Mechanical Drawing',
 description: 'Чертеж корпуса с размерами, допусками, расположением выводов (pinout) и рекомендуемой площадкой для PCB (land pattern). Необходим для разработки печатной платы и сборки.',
 },
 ].map((item) => (
 <div
 key={item.title}
 className="bg-[#f0f4ee] rounded-2xl border border-[#e8e8e8] p-6 hover:border-primary/30 hover:shadow-lg transition-all"
 >
 <h3 className="text-base font-semibold mb-3 text-[#121212]">{item.title}</h3>
 <p className="text-[#666] text-sm leading-relaxed">{item.description}</p>
 </div>
 ))}
 </div>
 </div>
 </section>

 {/* Datasheet Categories Grid */}
 <section className="px-4 pb-20">
 <div className="max-w-7xl mx-auto">
 <h2 className="text-3xl font-bold mb-4">Даташиты по категориям</h2>
 <p className="text-[#666] mb-12 max-w-2xl">
 Выберите категорию компонентов для просмотра доступной технической документации
 и основных параметров, которые нужно проверять в даташите.
 </p>
 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
 {datasheetCategories.map((cat) => (
 <Link
 key={cat.slug}
 href={`/${cat.slug}`}
 className="group bg-[#f0f4ee] rounded-2xl border border-[#e8e8e8] p-6 hover:border-primary/30 hover:shadow-lg transition-all"
 >
 <h3 className="text-lg font-semibold mb-2 text-[#121212] group-hover:text-primary transition-colors">
 {cat.title}
 </h3>
 <p className="text-[#666] text-sm leading-relaxed mb-4">{cat.description}</p>
 <div className="flex flex-wrap gap-1.5 mb-3">
 {cat.keyParams.map((param) => (
 <span
 key={param}
 className="px-2 py-0.5 bg-[#eaf0e8] text-primary text-xs rounded-md"
 >
 {param}
 </span>
 ))}
 </div>
 <p className="text-xs text-[#757575]">
 Пример: <span className="font-mono">{cat.exampleSku}</span>
 </p>
 </Link>
 ))}
 </div>
 </div>
 </section>

 {/* Popular brands with datasheets */}
 <section className="px-4 pb-20">
 <div className="max-w-7xl mx-auto">
 <h2 className="text-3xl font-bold mb-4">Производители с доступной документацией</h2>
 <p className="text-[#666] mb-8 max-w-2xl">
 Даташиты от ведущих производителей электронных компонентов. Полная техническая
 документация доступна на страницах брендов.
 </p>
 <div className="flex flex-wrap gap-3">
 {[
 { name: 'Texas Instruments', slug: 'texas-instruments' },
 { name: 'STMicroelectronics', slug: 'stmicroelectronics' },
 { name: 'Analog Devices', slug: 'analog-devices' },
 { name: 'Infineon', slug: 'infineon' },
 { name: 'NXP', slug: 'nxp' },
 { name: 'Microchip', slug: 'microchip' },
 { name: 'onsemi', slug: 'onsemi' },
 { name: 'Xilinx', slug: 'xilinx' },
 { name: 'Renesas', slug: 'renesas' },
 { name: 'Murata', slug: 'murata' },
 { name: 'TDK', slug: 'tdk' },
 { name: 'Vishay', slug: 'vishay' },
 ].map((brand) => (
 <Link
 key={brand.slug}
 href={`/brand/${brand.slug}`}
 className="px-4 py-2 bg-[#eaf0e8] border border-[#e8e8e8] rounded-lg text-sm text-[#333] hover:text-primary hover:border-primary/30 transition-all"
 >
 {brand.name}
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
 Нужна помощь с даташитом?
 </h2>
 <p className="text-[#666] mb-8 max-w-xl mx-auto">
 Отправьте заявку с артикулами компонентов — предоставим техническую документацию,
 поможем с интерпретацией параметров и подберём оптимальные аналоги.
 </p>
 <Link
 href="/#bom"
 className="inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark text-[#121212] font-medium px-8 py-3 rounded-lg transition-colors"
 >
 Запросить документацию
 <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
 </Link>
 </div>
 </section>
 </main>
 </>
 );
}

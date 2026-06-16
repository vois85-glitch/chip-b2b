import { Metadata } from 'next';
import Link from 'next/link';

const BASE_URL = 'https://www.chip-net.ru';

export const revalidate = 3600;

export const metadata: Metadata = {
 title: 'База знаний — статьи и руководства по электронным компонентам',
 description: 'База знаний по электронным компонентам: проверка оригинальности, подбор аналогов, импортозамещение STM32, выбор FPGA, BOM-анализ, логистика и ВЭД. Практические руководства от инженеров ChipNet.',
 alternates: {
 canonical: `${BASE_URL}/knowledge-base`,
 },
 openGraph: {
 title: 'База знаний — статьи и руководства по электронным компонентам',
 description: 'База знаний по электронным компонентам: проверка оригинальности, подбор аналогов, импортозамещение STM32, выбор FPGA, BOM-анализ, логистика и ВЭД.',
 url: `${BASE_URL}/knowledge-base`,
 type: 'website',
 locale: 'ru_RU',
 siteName: 'ChipNet',
 },
};

type Article = {
 title: string;
 slug: string;
 description: string;
 category: string;
 readTime: string;
 tags: string[];
};

const articles: Article[] = [
 {
 title: 'Проверка оригинальности микросхем',
 slug: 'proverka-originalnosti-mikroshem',
 description: 'Методы выявления контрафактных электронных компонентов: рентгеновский контроль, декэпсуляция, электрические тесты, визуальный осмотр под микроскопом. Как отличить оригинал от подделки и почему входной контроль критически важен для промышленных предприятий.',
 category: 'Качество',
 readTime: '12 мин',
 tags: ['СВП', 'Рентген', 'Декэпсуляция', 'Контрафакт'],
 },
 {
 title: 'Подбор аналогов санкционных компонентов',
 slug: 'podbor-analogov-sanktsionnykh-komponentov',
 description: 'Практическое руководство по замене санкционных электронных компонентов: методология кросс-референса, проверка совместимости, типовые замены для микроконтроллеров, FPGA, аналоговых ИС и пассивных компонентов. Примеры успешных замен из практики ChipNet.',
 category: 'Импортозамещение',
 readTime: '15 мин',
 tags: ['Кросс-референс', 'Совместимость', 'GD32', 'Gowin'],
 },
 {
 title: 'Импортозамещение STM32',
 slug: 'importozameshchenie-stm32',
 description: 'Детальное сравнение STM32 и его аналогов: GD32, HK32, CH32, APM32. Совместимость pin-to-pin, программная совместимость, различия в периферии и быстродействии. Рекомендации по миграции проектов с STM32 на доступные аналоги.',
 category: 'Импортозамещение',
 readTime: '18 мин',
 tags: ['STM32', 'GD32', 'HK32', 'CH32', 'Миграция'],
 },
 {
 title: 'Выбор FPGA для промышленных проектов',
 slug: 'vybor-fpga-dlya-promyshlennykh-proektov',
 description: 'Сравнительный анализ FPGA для промышленных применений: Xilinx Artix/Kintex, Intel Cyclone/Arria, Lattice ECP5/iCE40, Gowin Arora, Efinix Trion. Критерии выбора: логическая ёмкость, DSP-блоки, трансиверы, энергопотребление, стоимость и доступность.',
 category: 'Проектирование',
 readTime: '20 мин',
 tags: ['FPGA', 'Xilinx', 'Gowin', 'Efinix', 'Lattice'],
 },
 {
 title: 'BOM-анализ и оптимизация',
 slug: 'bom-analiz-i-optimizatsiya',
 description: 'Как правильно составить и оптимизировать BOM-лист для серийного производства: проверка доступности компонентов, анализ EOL-рисков, стандартизация номенклатуры, оптимизация стоимости без потери качества. Практические советы от инженеров ChipNet.',
 category: 'Производство',
 readTime: '14 мин',
 tags: ['BOM', 'Оптимизация', 'EOL', 'Стоимость'],
 },
 {
 title: 'Логистика и ВЭД',
 slug: 'logistika-i-ved',
 description: 'Организация поставок электронных компонентов из-за рубежа: выбор логистического маршрута, таможенное оформление, классификация по ТН ВЭД, работа с компонентами двойного назначения, страхование грузов, температурно-влажностный режим при транспортировке.',
 category: 'Логистика',
 readTime: '16 мин',
 tags: ['ВЭД', 'Таможня', 'ТН ВЭД', 'Логистика'],
 },
];

const additionalLinks = [
 {
 title: 'Импорт электронных компонентов',
 description: 'Полный цикл импорта: от заявки до доставки на склад',
 href: '/import-komponentov',
 },
 {
 title: 'Подбор аналогов',
 description: 'Кросс-референсы и замена санкционных компонентов',
 href: '/analogs',
 },
 {
 title: 'BOM-комплектация',
 description: 'Полная комплектация BOM-листов для производства',
 href: '/bom',
 },
 {
 title: 'Снятые с производства компоненты',
 description: 'Поиск EOL-компонентов и подбор аналогов',
 href: '/obsolete',
 },
 {
 title: 'Каталог производителей',
 description: 'Более 40 брендов электронных компонентов',
 href: '/brands',
 },
 {
 title: 'Отраслевые решения',
 description: 'Компоненты для автоматики, медицины и других отраслей',
 href: '/industries',
 },
];

const breadcrumbLd = {
 '@context': 'https://schema.org',
 '@type': 'BreadcrumbList',
 itemListElement: [
 { '@type': 'ListItem', position: 1, name: 'Главная', item: BASE_URL },
 { '@type': 'ListItem', position: 2, name: 'База знаний', item: `${BASE_URL}/knowledge-base` },
 ],
};

const itemListLd = {
 '@context': 'https://schema.org',
 '@type': 'ItemList',
 name: 'База знаний ChipNet',
 description: 'Статьи и руководства по электронным компонентам: проверка оригинальности, подбор аналогов, импортозамещение, выбор FPGA, BOM-анализ.',
 numberOfItems: articles.length,
 itemListElement: articles.map((article, i) => ({
 '@type': 'ListItem',
 position: i + 1,
 item: {
 '@type': 'Article',
 name: article.title,
 description: article.description,
 url: `${BASE_URL}/knowledge-base/${article.slug}`,
 },
 })),
};

export default function KnowledgeBasePage() {
 return (
 <>
 <script
 type="application/ld+json"
 dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
 />
 <script
 type="application/ld+json"
 dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListLd) }}
 />
 <main className="min-h-screen bg-background text-[#121212]">
 {/* Hero */}
 <section className="pt-32 pb-16 px-4">
 <div className="max-w-7xl mx-auto">
 <nav className="text-sm text-[#757575] mb-6 flex items-center gap-2">
 <Link href="/" className="hover:text-primary transition-colors">Главная</Link>
 <span className="text-[#cbcbcb]">/</span>
 <span className="text-[#666]">База знаний</span>
 </nav>
 <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-primary-dark bg-clip-text text-transparent">
 База знаний
 </h1>
 <p className="text-lg text-[#666] max-w-3xl mb-4">
 Статьи, руководства и практические рекомендации по работе с электронными компонентами:
 от проверки оригинальности и подбора аналогов до BOM-оптимизации и логистики ВЭД.
 Материалы подготовлены инженерами ChipNet на основе реального опыта поставок.
 </p>
 <p className="text-base text-[#757575] max-w-3xl">
 В условиях санкционных ограничений и disruptions в цепочках поставок знание —
 главный инструмент для обеспечения бесперебойной работы производства. Мы делимся
 экспертизой, чтобы помочь вам принимать обоснованные решения.
 </p>
 </div>
 </section>

 {/* Articles Grid */}
 <section className="px-4 pb-20">
 <div className="max-w-7xl mx-auto">
 <h2 className="text-3xl font-bold mb-4">Статьи и руководства</h2>
 <p className="text-[#666] mb-12 max-w-2xl">
 Практические материалы для инженеров-схемотехников, снабженцев и руководителей
 производственных предприятий.
 </p>
 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
 {articles.map((article) => (
 <article
 key={article.slug}
 className="bg-[#f0f4ee] rounded-2xl border border-[#e8e8e8] p-6 hover:border-primary/30 hover:shadow-lg transition-all group flex flex-col"
 >
 <div className="flex items-center gap-2 mb-3">
 <span className="px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-md font-medium">
 {article.category}
 </span>
 <span className="text-xs text-[#757575]">{article.readTime}</span>
 </div>
 <h3 className="text-lg font-semibold mb-3 text-[#121212] group-hover:text-primary transition-colors">
 {article.title}
 </h3>
 <p className="text-[#666] text-sm leading-relaxed mb-4 flex-grow">
 {article.description}
 </p>
 <div className="flex flex-wrap gap-1.5">
 {article.tags.map((tag) => (
 <span
 key={tag}
 className="px-2 py-0.5 bg-[#eaf0e8] text-[#666] text-xs rounded-md"
 >
 {tag}
 </span>
 ))}
 </div>
 </article>
 ))}
 </div>
 </div>
 </section>

 {/* Useful Links */}
 <section className="px-4 pb-20 bg-section-accent/30">
 <div className="max-w-7xl mx-auto py-20">
 <h2 className="text-3xl font-bold mb-4">Полезные разделы</h2>
 <p className="text-[#666] mb-12 max-w-2xl">
 Дополнительные ресурсы и сервисы ChipNet для решения задач по поставке
 электронных компонентов.
 </p>
 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
 {additionalLinks.map((link) => (
 <Link
 key={link.href}
 href={link.href}
 className="group bg-[#f0f4ee] rounded-2xl border border-[#e8e8e8] p-5 hover:border-primary/30 hover:shadow-lg transition-all"
 >
 <h3 className="text-base font-semibold mb-2 text-[#121212] group-hover:text-primary transition-colors">
 {link.title}
 </h3>
 <p className="text-[#666] text-sm">{link.description}</p>
 </Link>
 ))}
 </div>
 </div>
 </section>

 {/* Categories Quick Links */}
 <section className="px-4 pb-20">
 <div className="max-w-7xl mx-auto">
 <h2 className="text-3xl font-bold mb-4">Компоненты по категориям</h2>
 <p className="text-[#666] mb-8 max-w-2xl">
 Техническая информация и даташиты по основным категориям электронных компонентов.
 </p>
 <div className="flex flex-wrap gap-3">
 {[
 { title: 'Микроконтроллеры', slug: 'arm-kontrollery' },
 { title: 'FPGA / ПЛИС', slug: 'fpga' },
 { title: 'Транзисторы', slug: 'tranzistory' },
 { title: 'Конденсаторы', slug: 'kondensatory' },
 { title: 'Резисторы', slug: 'rezistory' },
 { title: 'Стабилизаторы', slug: 'stabilizatory' },
 { title: 'Операционные усилители', slug: 'operatsionnye-usiliteli' },
 { title: 'АЦП / ЦАП', slug: 'adc-dac' },
 { title: 'Диоды', slug: 'diody' },
 { title: 'Датчики', slug: 'datchiki' },
 { title: 'Разъёмы', slug: 'razemy' },
 { title: 'Оптоэлектроника', slug: 'optoelektronika' },
 { title: 'Память', slug: 'pamyat' },
 { title: 'Интерфейсы', slug: 'interfeysy' },
 { title: 'Логика', slug: 'logika' },
 { title: 'Питание', slug: 'pitaniya' },
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

 {/* Info Section */}
 <section className="px-4 pb-20">
 <div className="max-w-4xl mx-auto">
 <h2 className="text-3xl font-bold mb-6">О базе знаний ChipNet</h2>
 <div className="space-y-4 text-[#333] leading-relaxed">
 <p>
 База знаний ChipNet — это накопленная экспертиза команды инженеров и снабженцев,
 работающих с электронными компонентами для промышленности.
 Мы регулярно публикуем материалы, основанные на реальном опыте решения задач
 по поставке, проверке и подбору компонентов.
 </p>
 <p>
 Каждая статья проходит практическую верификацию: мы проверяем рекомендации
 в аккредитованной лаборатории СВП, тестируем аналоги на реальных стендах
 и подтверждаем данные из первых рук. Это не теоретические обзоры —
 это инструкции, которые можно применять на производстве.
 </p>
 <p>
 Если у вас есть вопрос, на который нет ответа в нашей базе знаний,
 свяжитесь с нами — наши инженеры проконсультируют бесплатно при заказе
 компонентов через ChipNet. Также мы открыты к предложениям по темам
 для новых статей.
 </p>
 </div>
 </div>
 </section>

 {/* CTA */}
 <section className="px-4 pb-20">
 <div className="max-w-4xl mx-auto bg-gradient-to-br from-primary/10 to-primary-dark/5 rounded-2xl border border-emerald-800/30 p-8 md:p-12 text-center">
 <h2 className="text-2xl md:text-3xl font-bold mb-4">
 Нужна консультация инженера?
 </h2>
 <p className="text-[#666] mb-8 max-w-xl mx-auto">
 Если вы не нашли ответ в базе знаний — отправьте заявку с описанием задачи.
 Наши инженеры проконсультируют по подбору компонентов, аналогам и условиям поставки.
 </p>
 <div className="flex flex-col sm:flex-row gap-4 justify-center">
 <Link
 href="/#bom"
 className="inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark text-[#121212] font-medium px-8 py-3 rounded-lg transition-colors"
 >
 Задать вопрос
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

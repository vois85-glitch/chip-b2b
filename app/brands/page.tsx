import { Metadata } from 'next';
import Link from 'next/link';

const BASE_URL = 'https://www.chip-net.ru';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Производители электронных компонентов — каталог брендов | ChipNet',
  description: 'Каталог производителей электронных компонентов: Texas Instruments, STMicroelectronics, Infineon, NXP, Xilinx, Microchip и более 40 брендов. Поставка оригиналов, подбор аналогов, проверка в лаборатории СВП.',
  alternates: {
    canonical: `${BASE_URL}/brands`,
  },
  openGraph: {
    title: 'Производители электронных компонентов — каталог брендов | ChipNet',
    description: 'Каталог производителей электронных компонентов: Texas Instruments, STMicroelectronics, Infineon, NXP, Xilinx, Microchip и более 40 брендов. Поставка оригиналов, подбор аналогов.',
    url: `${BASE_URL}/brands`,
    type: 'website',
    locale: 'ru_RU',
    siteName: 'ChipNet',
  },
};

type BrandItem = {
  name: string;
  slug: string;
  tags: string[];
};

const brands: BrandItem[] = [
  { name: 'Texas Instruments', slug: 'texas-instruments', tags: ['Микроконтроллеры', 'АЦП/ЦАП', 'ОУ', 'LDO'] },
  { name: 'STMicroelectronics', slug: 'stmicroelectronics', tags: ['STM32', 'MOSFET', 'Датчики'] },
  { name: 'Infineon', slug: 'infineon', tags: ['MOSFET', 'IGBT', 'Драйверы'] },
  { name: 'NXP', slug: 'nxp', tags: ['Микроконтроллеры', 'RF', 'Автоэлектроника'] },
  { name: 'Microchip', slug: 'microchip', tags: ['PIC', 'ATmega', 'Память'] },
  { name: 'onsemi', slug: 'onsemi', tags: ['MOSFET', 'IGBT', 'Диоды'] },
  { name: 'Analog Devices', slug: 'analog-devices', tags: ['АЦП/ЦАП', 'ОУ', 'Датчики'] },
  { name: 'Xilinx', slug: 'xilinx', tags: ['FPGA', 'Zynq', 'Artix'] },
  { name: 'Intel/Altera', slug: 'altera', tags: ['FPGA', 'Cyclone', 'Stratix'] },
  { name: 'Lattice', slug: 'lattice', tags: ['FPGA', 'iCE40', 'ECP5'] },
  { name: 'Renesas', slug: 'renesas', tags: ['RA', 'RX', 'RL78'] },
  { name: 'Murata', slug: 'murata', tags: ['MLCC', 'DC-DC', 'ЭМС'] },
  { name: 'TDK', slug: 'tdk', tags: ['Конденсаторы', 'Индуктивности', 'EPCOS'] },
  { name: 'Samsung', slug: 'samsung-electro', tags: ['MLCC', 'Память', 'Дисплеи'] },
  { name: 'KEMET', slug: 'kemet', tags: ['Конденсаторы', 'Тантал', 'Полимер'] },
  { name: 'Vishay', slug: 'vishay', tags: ['MOSFET', 'Диоды', 'Резисторы'] },
  { name: 'Broadcom', slug: 'broadcom', tags: ['Оптопары', 'RF', 'LED'] },
  { name: 'Yageo', slug: 'yageo', tags: ['Резисторы', 'MLCC', 'Пассивные'] },
  { name: 'Molex', slug: 'molex', tags: ['Разъёмы', 'Коннекторы'] },
  { name: 'TE Connectivity', slug: 'te-connectivity', tags: ['Разъёмы', 'Реле', 'Датчики'] },
  { name: 'Amphenol', slug: 'amphenol', tags: ['Разъёмы', 'RF-коннекторы'] },
  { name: 'Bourns', slug: 'bourns', tags: ['Резисторы', 'Предохранители', 'Датчики'] },
  { name: 'Littelfuse', slug: 'littelfuse', tags: ['Предохранители', 'TVS', 'тиристоры'] },
  { name: 'Mean Well', slug: 'mean-well', tags: ['AC-DC', 'DC-DC', 'Питание'] },
  { name: 'ROHM', slug: 'rohm', tags: ['MOSFET', 'LDO', 'LED'] },
  { name: 'Panasonic', slug: 'panasonic', tags: ['Реле', 'Конденсаторы', 'Резисторы'] },
  { name: 'Toshiba', slug: 'toshiba', tags: ['MOSFET', 'Оптопары', 'Диоды'] },
  { name: 'Diodes Inc', slug: 'diodes-inc', tags: ['Диоды', 'Мосты', 'Логика'] },
  { name: 'Wurth Elektronik', slug: 'wurth-elektronik', tags: ['Индуктивности', 'Разъёмы', 'ЭМС'] },
  { name: 'Fujitsu', slug: 'fujitsu', tags: ['Реле', 'FRAM', 'Модули'] },
  { name: 'ABB', slug: 'abb', tags: ['Силовая электроника', 'Автоматика'] },
  { name: 'Aimtec', slug: 'aimtec', tags: ['DC-DC', 'AC-DC', 'Питание'] },
  { name: 'Siemens', slug: 'siemens', tags: ['Автоматика', 'ПЛК', 'Силовая'] },
  { name: 'Espressif', slug: 'espressif', tags: ['Wi-Fi', 'ESP32', 'IoT'] },
  { name: 'Gigadevice', slug: 'gigadevice', tags: ['GD32', 'Flash', 'Аналоги STM32'] },
  { name: 'Nordic', slug: 'nordic', tags: ['BLE', 'nRF52', 'IoT'] },
  { name: 'Micron', slug: 'micron', tags: ['DDR', 'NAND', 'NOR Flash'] },
  { name: 'Maxim Integrated', slug: 'maxim', tags: ['АЦП/ЦАП', 'ОУ', 'DS'] },
];

const faqItems = [
  {
    question: 'Как заказать компоненты определённого производителя?',
    answer: 'Выберите нужного производителя в каталоге брендов, перейдите на его страницу и отправьте заявку через форму. Также вы можете отправить BOM-лист с указанием необходимых позиций — наши менеджеры проверят наличие у авторизованных дистрибьюторов и подготовят коммерческое предложение в течение 24 часов.',
  },
  {
    question: 'Все ли компоненты оригинальные?',
    answer: 'Да, мы работаем исключительно с авторизованными дистрибьюторами и заводами-изготовителями. Каждая партия проходит входной контроль в аккредитованной лаборатории СВП: рентгеновский контроль внутренней структуры, декэпсуляция, электрические тесты и визуальный осмотр под микроскопом. Гарантируем оригинальность каждого компонента.',
  },
  {
    question: 'Можно ли подобрать аналоги для компонентов unavailable производителей?',
    answer: 'Да, это одно из ключевых направлений нашей работы. Инженеры ChipNet подбирают кросс-референсы для санкционных и unavailable компонентов: GD32 и HK32 вместо STM32, Gowin и Efinix вместо Xilinx FPGA, доступные аналоги TI LDO и ADI операционных усилителей. Совместимость проверяется в лаборатории.',
  },
  {
    question: 'Какие производители доступны без санкционных ограничений?',
    answer: 'Без ограничений доступны компоненты азиатских производителей: Gigadevice (GD32), Espressif (ESP32), Gowin Semiconductor, Efinix, а также ряд китайских и тайваньских брендов. Из европейских и американских производителей доступность зависит от конкретной серии и категории — уточняйте у менеджеров.',
  },
  {
    question: 'Как быстро вы можете поставить компоненты нужного бренда?',
    answer: 'Срочная поставка авиатранспортом — от 6 рабочих дней. Стандартная логистика — от 14 дней. Для компонентов, которые есть на нашем складе в Белгороде, возможна отгрузка в день оплаты. Точные сроки зависят от производителя, наличия на складах дистрибьюторов и логистического маршрута.',
  },
];

const breadcrumbLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Главная', item: BASE_URL },
    { '@type': 'ListItem', position: 2, name: 'Производители', item: `${BASE_URL}/brands` },
  ],
};

const organizationLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'ChipNet (ООО Деловой Партнёр)',
  url: BASE_URL,
  description: 'Поставщик электронных компонентов от более 40 ведущих мировых производителей. Оригинальная продукция, проверка в лаборатории СВП, подбор аналогов.',
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

export default function BrandsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationLd) }}
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
              <span className="text-[#666]">Производители</span>
            </nav>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-primary-dark bg-clip-text text-transparent">
              Производители электронных компонентов
            </h1>
            <p className="text-lg text-[#666] max-w-3xl mb-4">
              Каталог ведущих мировых производителей электронных компонентов. Поставка оригинальной продукции,
              подбор аналогов санкционных и снятых с производства серий, проверка в аккредитованной лаборатории СВП.
            </p>
            <p className="text-base text-[#757575] max-w-3xl">
              ООО «Деловой Партнёр» (ChipNet) работает более чем с 40 производителями — от глобальных лидеров
              до нишевых поставщиков специализированных компонентов. Каждая позиция сопровождается полным пакетом
              документации и сертификатов происхождения.
            </p>
          </div>
        </section>

        {/* Brand Grid */}
        <section className="px-4 pb-20">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">Каталог производителей</h2>
            <p className="text-[#666] mb-12 max-w-2xl">
              Выберите производителя для просмотра доступных компонентов, категорий и аналогов.
              Если нужного бренда нет в списке — отправьте запрос, и мы найдём компоненты через наших партнёров.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {brands.map((brand) => (
                <Link
                  key={brand.slug}
                  href={`/brand/${brand.slug}`}
                  className="group bg-[#f0f4ee] rounded-2xl border border-[#e8e8e8] p-5 hover:border-primary/30 hover:shadow-lg transition-all"
                >
                  <h3 className="text-base font-semibold mb-3 text-[#121212] group-hover:text-primary transition-colors">
                    {brand.name}
                  </h3>
                  <div className="flex flex-wrap gap-1.5">
                    {brand.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 bg-[#eaf0e8] text-[#666] text-xs rounded-md group-hover:bg-primary/10 group-hover:text-primary transition-colors"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* About Brands Section */}
        <section className="px-4 pb-20 bg-section-accent/30">
          <div className="max-w-7xl mx-auto py-20">
            <h2 className="text-3xl font-bold mb-4">Почему важен выбор производителя</h2>
            <p className="text-[#666] mb-8 max-w-3xl">
              Выбор производителя электронных компонентов — это не просто вопрос цены. От бренда зависят
              качество, надёжность, доступность технической документации и возможность получения поддержки.
              В условиях санкционных ограничений выбор производителя приобретает особое значение.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-[#f0f4ee] rounded-2xl border border-[#e8e8e8] p-6">
                <h3 className="text-lg font-semibold mb-3 text-[#121212]">Оригинальная продукция</h3>
                <p className="text-[#666] text-sm leading-relaxed">
                  Мы гарантируем оригинальность каждого компонента. Все поставки осуществляются через
                  авторизованные каналы дистрибуции с полным прослеживанием от производства до доставки.
                  Каждая партия проходит входной контроль в аккредитованной лаборатории СВП: рентген,
                  декэпсуляция, электрические тесты и визуальный осмотр под микроскопом.
                </p>
              </div>
              <div className="bg-[#f0f4ee] rounded-2xl border border-[#e8e8e8] p-6">
                <h3 className="text-lg font-semibold mb-3 text-[#121212]">Подбор аналогов</h3>
                <p className="text-[#666] text-sm leading-relaxed">
                  Если нужный компонент недоступен напрямую, наши инженеры подберут полный аналог от другого
                  производителя с гарантией электрической совместимости. Кросс-референсы проверяются в
                  лаборатории на соответствие параметров даташита. Мы работаем с GD32, HK32, Gowin, Efinix
                  и другими доступными брендами.
                </p>
              </div>
              <div className="bg-[#f0f4ee] rounded-2xl border border-[#e8e8e8] p-6">
                <h3 className="text-lg font-semibold mb-3 text-[#121212]">Полная документация</h3>
                <p className="text-[#666] text-sm leading-relaxed">
                  Каждая поставка сопровождается полным пакетом документов: сертификаты происхождения,
                  декларации соответствия, отчёты о входном контроле. Для ВЭД-поставок — таможенные
                  декларации, УПД и закрывающие документы. Для компонентов двойного назначения —
                  экспортные лицензии и разрешения.
                </p>
              </div>
              <div className="bg-[#f0f4ee] rounded-2xl border border-[#e8e8e8] p-6">
                <h3 className="text-lg font-semibold mb-3 text-[#121212]">Гибкие условия</h3>
                <p className="text-[#666] text-sm leading-relaxed">
                  Работаем с любыми объёмами: от единичных компонентов для опытных образцов до оптовых
                  партий для серийного производства. Для постоянных клиентов — постоплата до 30 дней,
                  персональный менеджер и приоритетная обработка заявок. BOM-комплектация с оптимизацией
                  по цене и срокам.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Related Categories */}
        <section className="px-4 pb-20">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">Популярные категории компонентов</h2>
            <p className="text-[#666] mb-8 max-w-2xl">
              Перейдите в нужную категорию для просмотра доступных компонентов от всех производителей.
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
                { title: 'Разъёмы', slug: 'razemy' },
                { title: 'АЦП/ЦАП', slug: 'adc-dac' },
                { title: 'Диоды', slug: 'diody' },
                { title: 'Датчики', slug: 'datchiki' },
                { title: 'Оптоэлектроника', slug: 'optoelektronika' },
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
              Не нашли нужного производителя?
            </h2>
            <p className="text-[#666] mb-8 max-w-xl mx-auto">
              Отправьте заявку с указанием необходимых компонентов — найдём оригиналы у авторизованных
              дистрибьюторов или подберём аналоги от доступных производителей с гарантией совместимости.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/#bom"
                className="inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark text-[#121212] font-medium px-8 py-3 rounded-lg transition-colors"
              >
                Отправить заявку
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
              </Link>
              <Link
                href="/catalog"
                className="inline-flex items-center justify-center gap-2 border border-primary text-primary hover:bg-primary/5 font-medium px-8 py-3 rounded-lg transition-colors"
              >
                Каталог компонентов
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

import { Metadata } from 'next';
import Link from 'next/link';

const BASE_URL = 'https://www.chip-net.ru';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Труднодоступные электронные компоненты — поиск и поставка | ChipNet',
  description: 'Поиск и поставка труднодоступных электронных компонентов: санкционные ИС, снятые с производства FPGA, военного назначения, автомобильной квалификации, редкие пассивные компоненты. Глобальная сеть поставщиков, входной контроль, ВЭД.',
  alternates: {
    canonical: `${BASE_URL}/hard-to-find`,
  },
  openGraph: {
    title: 'Труднодоступные электронные компоненты — поиск и поставка | ChipNet',
    description: 'Поиск и поставка труднодоступных компонентов: санкционные, EOL, военного назначения. Глобальная сеть поставщиков, входной контроль, полный цикл ВЭД.',
    url: `${BASE_URL}/hard-to-find`,
    type: 'website',
    locale: 'ru_RU',
    siteName: 'ChipNet',
  },
};

const hardToFindReasons = [
  {
    icon: '🔒',
    title: 'Санкционные ограничения',
    description: 'Экспортные ограничения США и ЕС закрывают доступ к компонентам ведущих производителей для российских предприятий: Analog Devices, Texas Instruments, Xilinx, Intel/Altera, Maxim Integrated. Компоненты двойного назначения требуют экспортных лицензий, получение которых для российских компаний практически невозможно через стандартные каналы.',
  },
  {
    icon: '🛑',
    title: 'Снятие с производства (EOL)',
    description: 'Производители регулярно выводят с рынка устаревшие компоненты (End-of-Life), заменяя их новыми поколениями. Для изделий с длительным жизненным циклом (промавтоматика, ВПК, энергетика, медицина) редизайн платы не всегда целесообразен, и требуется поиск оставшихся запасов или аналогов.',
  },
  {
    icon: '📊',
    title: 'Аллокация и дефицит',
    description: 'Периодический дефицит отдельных категорий компонентов (аллокация) вызван перегрузкой производственных мощностей, кризисами цепочек поставок, аномальным спросом. В такие периоды производители приоритизируют крупных заказчиков, а средние и мелкие потребители не могут получить квоты.',
  },
  {
    icon: '🏭',
    title: 'Ограниченный выпуск',
    description: 'Некоторые компоненты выпускаются ограниченными партиями для нишевых применений: радиационно-стойкие микросхемы, специализированные АЦП, военные FPGA, СВЧ-компоненты. Объёмы производства малы, складские запасы минимальны, а срок поставки от производителя может достигать 40–60 недель.',
  },
  {
    icon: '⏰',
    title: 'Длительные сроки поставки',
    description: 'Срок поставки (lead time) для многих компонентов составляет 20–50 недель, что неприемлемо для текущего производства. Особенно это касается специализированных FPGA, силовых модулей IGBT, автомобильных микроконтроллеров и прецизионных аналоговых компонентов.',
  },
];

const searchMethods = [
  {
    icon: '🌐',
    title: 'Глобальная сеть дистрибьюторов',
    description: 'Прямые договоры с авторизованными дистрибьюторами (Arrow, Avnet, Mouser, Digi-Key, Future Electronics, Rutronik, TME) и региональными складами. Мгновенный запрос наличия по всей сети — мы получаем актуальные данные о складских запасах и сроках поставки от производителя в режиме реального времени.',
  },
  {
    icon: '🌏',
    title: 'Азиатские поставщики',
    description: 'Партнёрства с поставщиками в Китае, Южной Корее, Тайване и Гонконге — регионах с крупнейшими складскими запасами электронных компонентов. Азиатский рынок обеспечивает доступ к компонентам, недоступным через западные каналы, включая санкционные позиции и оригинальные компоненты с полной прослеживаемостью.',
  },
  {
    icon: '📦',
    title: 'Рынок избыточных запасов',
    description: 'Доступ к базам данных избыточных запасов (excess inventory) по всему миру: OEM-производители, контрактные производители, дистрибьюторы продают невостребованные складские остатки. Это источник оригинальных компонентов, снятых с производства, по рыночным ценам с полной документацией.',
  },
  {
    icon: '🏭',
    title: 'Прямые закупки у OCM',
    description: 'Прямые контакты с представителями оригинальных производителей (OCM — Original Component Manufacturer) для получения квот на текущее производство. Особенно актуально для компонентов с длительным сроком поставки: оформляем заказ с фиксацией цены и даты доставки напрямую в производственном графике OCM.',
  },
];

const hardToFindCategories = [
  {
    icon: '🔒',
    title: 'Санкционные ИС',
    description: 'Интегральные схемы, подпадающие под экспортные ограничения: высокопроизводительные FPGA Xilinx и Intel/Altera, прецизионные АЦП/ЦАП Analog Devices, микроконтроллеры с криптографией, компоненты для телекоммуникационного и оборонного применения. Поставляем через альтернативные каналы с полным входным контролем.',
  },
  {
    icon: '🔲',
    title: 'Снятые с производства FPGA',
    description: 'FPGA устаревших семейств, снятых с производства или переведённых в статус NRND (Not Recommended for New Designs): Xilinx Spartan-6, Virtex-5/6, Altera Cyclone III/IV, Stratix IV. Необходимы для поддержки действующих изделий, где редизайн нецелесообразен или невозможен.',
  },
  {
    icon: '🎖️',
    title: 'Военного назначения',
    description: 'Компоненты с военной приёмкой (MIL-STD-883, JAN, SMD): радиационно-стойкие микросхемы, высоконадёжные разъёмы, компоненты с расширенным температурным диапазоном (-55…+125°C). Для оборонного комплекса, аэрокосмической отрасли и систем критической инфраструктуры.',
  },
  {
    icon: '🚗',
    title: 'Автомобильной квалификации',
    description: 'Компоненты с квалификацией AEC-Q100/Q101/Q200 для автомобильной промышленности: микроконтроллеры NXP S32 и Infineon AURIX, силовые MOSFET и IGBT, CAN/LIN/FlexRay трансиверы, датчики. Дефицит автомобильных компонентов — системная проблема, требующая нестандартных каналов поставки.',
  },
  {
    icon: '🔌',
    title: 'Редкие пассивные компоненты',
    description: 'Специализированные пассивные компоненты: высоковольтные конденсаторы, прецизионные резисторы, мощные индуктивности, термисторы, варисторы для защиты. Кажутся простыми, но дефицит конкретных типоразмеров и характеристик может остановить производство не хуже, чем отсутствие микросхемы.',
  },
];

const advantages = [
  {
    icon: '🔬',
    title: 'Входной контроль качества',
    description: 'Аккредитованная лаборатория входного контроля СВП выполняет полный цикл проверки: визуальный осмотр под микроскопом, рентгеноскопия для выявления внутренних дефектов, декэпсуляция для верификации кристалла, электрические тесты по спецификации производителя. Это критично для труднодоступных компонентов, поставляемых через нестандартные каналы.',
  },
  {
    icon: '📋',
    title: 'Полная документация',
    description: 'УПД с НДС, сертификаты происхождения (Certificate of Origin), отчёты о входном контроле, таможенные декларации, спецификации качества. Документация в формате ЭДО, соответствие требованиям бухгалтерии, ВПК и государственных заказчиков. Для оборонных предприятий — полный пакет документов для приёмки.',
  },
  {
    icon: '🏛️',
    title: 'Соответствие ВЭД',
    description: 'Полный цикл внешнеэкономической деятельности: таможенное оформление, экспортные лицензии для компонентов двойного назначения, сертификаты происхождения, оформление по всем требованиям ТН ВЭД. Работаем с компонентами всех категорий, включая требующие специальных разрешений и лицензий.',
  },
];

const faqItems = [
  {
    question: 'Как вы находите санкционные компоненты?',
    answer: 'Мы используем альтернативные каналы поставки, не подпадающие под прямые экспортные ограничения: азиатские дистрибьюторы, складские запасы третьих стран, рынок избыточных запасов. Каждый компонент проходит входной контроль в аккредитованной лаборатории СВП для подтверждения оригинальности и соответствия спецификации. Предоставляем сертификаты происхождения и полную прослеживаемость партии.',
  },
  {
    question: 'Можно ли заказать компоненты, снятые с производства?',
    answer: 'Да, это одно из ключевых направлений нашей работы. Мы ищем EOL-компоненты по трём каналам: остатки на складах авторизованных дистрибьюторов, рынок избыточных запасов OEM-производителей, буферизированные партии на нашем складе. Для серийного производства предлагаем программу last-time buy — закупку партии, достаточной для обеспечения производства на весь оставшийся жизненный цикл изделия.',
  },
  {
    question: 'Как гарантируется оригинальность труднодоступных компонентов?',
    answer: 'Все компоненты, поставляемые через нестандартные каналы, проходят обязательный входной контроль в лаборатории СВП: визуальный осмотр, рентгеноскопия, декэпсуляция (при подозрении на подделку), электрические тесты. Мы работаем только с поставщиками, прошедшими верификацию, и обеспечиваем полную прослеживаемость происхождения каждой партии. При выявлении несоответствий — полная замена за наш счёт.',
  },
  {
    question: 'Какие сроки поставки труднодоступных компонентов?',
    answer: 'Сроки зависят от категории и доступности компонента. Для позиций, имеющихся на складах дистрибьюторов — 6–15 рабочих дней (авиадоставка). Для компонентов, требующих поиска по нестандартным каналам — 15–30 рабочих дней. Для редких и специализированных компонентов, доступных только через OCM — до 12 недель, но мы фиксируем дату поставки и информируем о статусе заказа. В каждом случае мы предоставляем реалистичные сроки, основанные на актуальных данных о наличии.',
  },
  {
    question: 'Работаете ли вы с компонентами военного назначения?',
    answer: 'Да, мы имеем опыт поставки компонентов военного назначения для предприятий ОПК. Это включает микросхемы с военной приёмкой (MIL-STD-883, JAN, SMD), радиационно-стойкие компоненты, высоконадёжные разъёмы и контакты. Обеспечиваем полный цикл ВЭД, включая экспортные лицензии для компонентов двойного назначения, сертификаты происхождения и оформление всей необходимой документации для военной приёмки.',
  },
];

const breadcrumbLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Главная', item: BASE_URL },
    { '@type': 'ListItem', position: 2, name: 'Труднодоступные компоненты', item: `${BASE_URL}/hard-to-find` },
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

export default function HardToFindPage() {
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
              <span className="text-[#666]">Труднодоступные компоненты</span>
            </nav>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-primary-dark bg-clip-text text-transparent">
              Поиск и поставка труднодоступных компонентов
            </h1>
            <p className="text-lg text-[#666] max-w-3xl mb-4">
              Поиск и поставка электронных компонентов, недоступных через стандартные каналы:
              санкционные ИС, EOL-компоненты, военная приёмка, автомобильная квалификация.
              Глобальная сеть поставщиков и входной контроль качества.
            </p>
            <p className="text-base text-[#757575] max-w-3xl">
              Труднодоступные компоненты — это не просто редкие позиции в каталоге. Это системная проблема,
              вызванная санкциями, снятием с производства, аллокацией и длительными сроками поставки.
              ChipNet решает эту проблему через многоканальный поиск и проверенные логистические цепочки.
            </p>
          </div>
        </section>

        {/* What Makes Components Hard to Find */}
        <section className="px-4 pb-20">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">Почему компоненты становятся труднодоступными</h2>
            <p className="text-[#666] mb-12 max-w-2xl">
              Системные факторы, которые делают невозможным или затруднительным приобретение компонентов
              через стандартные каналы дистрибьюции. Понимание этих факторов — основа для построения
              альтернативных логистических цепочек.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {hardToFindReasons.map((item) => (
                <div
                  key={item.title}
                  className="bg-[#f0f4ee] rounded-2xl border border-[#e8e8e8] p-6 hover:border-primary/30 hover:shadow-lg transition-all group"
                >
                  <span className="text-3xl block mb-4">{item.icon}</span>
                  <h3 className="text-lg font-semibold mb-3 text-[#121212] group-hover:text-primary transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-[#666] text-sm leading-relaxed">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How We Find Them */}
        <section className="px-4 pb-20 bg-section-accent/30">
          <div className="max-w-7xl mx-auto py-20">
            <h2 className="text-3xl font-bold mb-4">Как мы находим труднодоступные компоненты</h2>
            <p className="text-[#666] mb-12 max-w-2xl">
              Многоканальная стратегия поиска: от авторизованных дистрибьюторов до азиатских поставщиков
              и рынка избыточных запасов. Каждый канал верифицирован, каждый поставщик — проверен.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {searchMethods.map((item) => (
                <div
                  key={item.title}
                  className="bg-gradient-to-br from-primary/5 to-primary-dark/5 rounded-2xl border border-primary/10 p-6 hover:border-primary/30 transition-all"
                >
                  <div className="flex items-start gap-4">
                    <span className="text-3xl shrink-0">{item.icon}</span>
                    <div>
                      <h3 className="text-xl font-semibold mb-3 text-[#121212]">{item.title}</h3>
                      <p className="text-[#666] text-sm leading-relaxed">{item.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Categories of Hard-to-Find */}
        <section className="px-4 pb-20">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">Категории труднодоступных компонентов</h2>
            <p className="text-[#666] mb-12 max-w-2xl">
              Основные категории компонентов, которые наши заказчики чаще всего не могут найти
              через стандартные каналы. По каждой категории — проверенная логистическая цепочка
              и опыт множества успешно выполненных поставок.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {hardToFindCategories.map((item) => (
                <div
                  key={item.title}
                  className="bg-[#f0f4ee] rounded-2xl border border-[#e8e8e8] p-6 hover:border-primary/30 hover:shadow-lg transition-all group"
                >
                  <span className="text-3xl block mb-4">{item.icon}</span>
                  <h3 className="text-lg font-semibold mb-3 text-[#121212] group-hover:text-primary transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-[#666] text-sm leading-relaxed">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Our Advantages */}
        <section className="px-4 pb-20 bg-section-accent/30">
          <div className="max-w-7xl mx-auto py-20">
            <h2 className="text-3xl font-bold mb-4">Наши преимущества</h2>
            <p className="text-[#666] mb-12 max-w-2xl">
              При работе с труднодоступными компонентами качество и документальное подтверждение
              не менее важны, чем сам факт поставки. ChipNet обеспечивает полный цикл
              от поиска до приёмки с аккредитованным входным контролем.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {advantages.map((item) => (
                <div
                  key={item.title}
                  className="bg-gradient-to-br from-primary/5 to-primary-dark/5 rounded-2xl border border-primary/10 p-6 hover:border-primary/30 transition-all"
                >
                  <div className="flex items-start gap-4">
                    <span className="text-3xl shrink-0">{item.icon}</span>
                    <div>
                      <h3 className="text-lg font-semibold mb-3 text-[#121212]">{item.title}</h3>
                      <p className="text-[#666] text-sm leading-relaxed">{item.description}</p>
                    </div>
                  </div>
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
              Не можете найти нужный компонент?
            </h2>
            <p className="text-[#666] mb-8 max-w-xl mx-auto">
              Отправьте заявку с партномерами — найдём труднодоступные компоненты по глобальной
              сети поставщиков, проверим оригинальность и организуем поставку с полным ВЭД-сопровождением.
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
                href="/bom"
                className="inline-flex items-center justify-center gap-2 border border-primary text-primary hover:bg-primary/5 font-medium px-8 py-3 rounded-lg transition-colors"
              >
                Загрузить BOM
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

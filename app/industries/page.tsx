import { Metadata } from 'next';
import Link from 'next/link';

const BASE_URL = 'https://www.chip-net.ru';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Отраслевые решения — электронные компоненты для промышленности и ВПК | ChipNet',
  description: 'Отраслевые решения для оборонного комплекса, промышленной автоматики, телекоммуникаций, энергетики, медицины, автомобилестроения, аэрокосмической отрасли и потребительской электроники.',
  alternates: {
    canonical: `${BASE_URL}/industries`,
  },
  openGraph: {
    title: 'Отраслевые решения — электронные компоненты для промышленности и ВПК | ChipNet',
    description: 'Отраслевые решения для оборонного комплекса, промышленной автоматики, телекоммуникаций, энергетики, медицины, автомобилестроения, аэрокосмической отрасли.',
    url: `${BASE_URL}/industries`,
    type: 'website',
    locale: 'ru_RU',
    siteName: 'ChipNet',
  },
};

type Industry = {
  title: string;
  description: string;
  categories: string[];
  brands: string[];
  requirements: string;
  slug: string;
};

const industries: Industry[] = [
  {
    title: 'Оборонный комплекс',
    description: 'Поставка электронных компонентов для нужд оборонно-промышленного комплекса: радиолокация, системы связи, навигация, управление вооружением, криптография. Компоненты с военной приёмкой, расширенным температурным диапазоном и повышенной надёжностью. Полный цикл ВЭД для компонентов двойного назначения.',
    categories: ['FPGA / ПЛИС', 'Микроконтроллеры', 'АЦП / ЦАП', 'Оптоэлектроника', 'Радиокомпоненты'],
    brands: ['Xilinx', 'Intel/Altera', 'Analog Devices', 'Texas Instruments', 'Gowin'],
    requirements: 'Военная приёмка, расширенный температурный диапазон (-55…+125°C), сертификаты происхождения, экспортные лицензии',
    slug: 'oboronnij-kompleks',
  },
  {
    title: 'Промышленная автоматика',
    description: 'Компоненты для промышленных контроллеров, ПЛК, систем ЧРП, SCADA и АСУ ТП: микроконтроллеры, силовые модули, интерфейсные микросхемы, датчики и реле. Компоненты с промышленным температурным диапазоном и длительной доступностью для серийного производства.',
    categories: ['Микроконтроллеры', 'Силовая электроника', 'Интерфейсы', 'Датчики', 'Реле'],
    brands: ['STMicroelectronics', 'Infineon', 'Texas Instruments', 'NXP', 'Microchip'],
    requirements: 'Промышленный температурный диапазон (-40…+85°C), длительная доступность (10+ лет), AEC-Q100 для ответственных узлов',
    slug: 'promyshlennaya-avtomatika',
  },
  {
    title: 'Телекоммуникации',
    description: 'Компоненты для оборудования связи: Ethernet PHY, оптические трансиверы, RF-модули, базовые станции, коммутаторы и маршрутизаторы. Высокоскоростные интерфейсы, низколатентная память, программируемая логика для обработки пакетов.',
    categories: ['RF-компоненты', 'FPGA', 'Интерфейсы', 'Память', 'Оптоэлектроника'],
    brands: ['Broadcom', 'Xilinx', 'NXP', 'Microchip', 'Realtek'],
    requirements: 'Высокоскоростные интерфейсы (10G+, 100G), низкое энергопотребление, NEBS совместимость',
    slug: 'telekommunikatsii',
  },
  {
    title: 'Энергетика',
    description: 'Компоненты для энергосистем: силовые IGBT и MOSFET для инверторов, контроллеры зарядных станций, модули питания, компоненты для умных сетей (Smart Grid) и систем хранения энергии. Высоковольтные и сильноточные решения.',
    categories: ['Силовая электроника', 'Модули питания', 'Микроконтроллеры', 'Датчики', 'Изоляция'],
    brands: ['Infineon', 'onsemi', 'STMicroelectronics', 'Mean Well', 'ABB'],
    requirements: 'Высокая надёжность, длительный срок службы (20+ лет), соответствие стандартам МЭК',
    slug: 'energetika',
  },
  {
    title: 'Медицина',
    description: 'Электронные компоненты для медицинского оборудования: высокоточные АЦП для диагностических приборов, малошумящие ОУ для ЭКГ/ЭЭГ, датчики для мониторинга, компоненты для аппаратов ИВЛ и инфузионных помп. Соответствие стандартам IEC 60601.',
    categories: ['АЦП / ЦАП', 'Операционные усилители', 'Датчики', 'Питание', 'Оптоэлектроника'],
    brands: ['Analog Devices', 'Texas Instruments', 'Maxim Integrated', 'STMicroelectronics', 'TE Connectivity'],
    requirements: 'IEC 60601, биосовместимость, высокая точность, низкий уровень шума, отказоустойчивость',
    slug: 'meditsina',
  },
  {
    title: 'Автомобилестроение',
    description: 'Автомобильные компоненты с квалификацией AEC-Q100/Q101/Q200: микроконтроллеры для ECU, силовые MOSFET и IGBT для тяговых инверторов, датчики для ADAS, интерфейсы CAN/LIN/FlexRay, компоненты для бортовых зарядных устройств.',
    categories: ['Микроконтроллеры', 'Силовая электроника', 'Датчики', 'Интерфейсы', 'Питание'],
    brands: ['NXP', 'Infineon', 'STMicroelectronics', 'onsemi', 'Renesas'],
    requirements: 'AEC-Q100/Q101/Q200, температурный диапазон -40…+150°C, нулевой дефект, ISO 26262',
    slug: 'avtomobilestroenie',
  },
  {
    title: 'Аэрокосмическая отрасль',
    description: 'Компоненты для аэрокосмических применений: радиационно-стойкие FPGA и микроконтроллеры, компоненты с расширенным температурным диапазоном, высоконадёжные разъёмы и контакты, системы питания для спутников и бортовой аппаратуры.',
    categories: ['FPGA', 'Микроконтроллеры', 'Разъёмы', 'Питание', 'Память'],
    brands: ['Xilinx', 'Microchip', 'TE Connectivity', 'Amphenol', 'Cobham'],
    requirements: 'Радиационная стойкость, расширенный температурный диапазон, MIL-STD-883, высокая наработка на отказ',
    slug: 'aerokosmicheskaya-otrasl',
  },
  {
    title: 'Потребительская электроника',
    description: 'Компоненты для бытовой электроники, IoT-устройств, носимой электроники и умного дома: низкопотребляющие микроконтроллеры, беспроводные модули, датчики, аудиокомпоненты, разъёмы и индикаторы. Оптимальное соотношение цены и функциональности.',
    categories: ['Микроконтроллеры', 'RF / IoT', 'Датчики', 'Аудио', 'Питание'],
    brands: ['Espressif', 'Nordic', 'Gigadevice', 'STMicroelectronics', 'Silicon Labs'],
    requirements: 'Низкая стоимость, минимальное энергопотребление, компактные корпуса, массовое производство',
    slug: 'potrebitelskaya-elektronika',
  },
];

const faqItems = [
  {
    question: 'Работаете ли вы с оборонными предприятиями?',
    answer: 'Да, мы имеем опыт работы с предприятиями оборонно-промышленного комплекса. Поставляем компоненты с военной приёмкой, обеспечиваем полное прослеживание происхождения каждого компонента, оформляем необходимые разрешения и лицензии для компонентов двойного назначения. Все компоненты проходят входной контроль в аккредитованной лаборатории СВП.',
  },
  {
    question: 'Какие компоненты вы поставляете для автомобильной промышленности?',
    answer: 'Мы поставляем полный спектр автомобильных компонентов с квалификацией AEC-Q: микроконтроллеры NXP S32 и Infineon AURIX для ECU, силовые MOSFET и IGBT для тяговых инверторов и зарядных устройств, CAN/LIN/FlexRay трансиверы, датчики давления и ускорения для ADAS, компоненты питания для бортовой сети.',
  },
  {
    question: 'Можно ли заказать комплектацию для медицинской аппаратуры?',
    answer: 'Да, мы работаем с производителями медицинского оборудования. Поставляем высокоточные аналоговые компоненты (АЦП, ОУ, датчики) от Analog Devices и Texas Instruments, компоненты с сертификатами для медицинского применения, помогаем с подбором аналогов, соответствующих требованиям IEC 60601.',
  },
  {
    question: 'Как обеспечить длительную доступность компонентов для серийного производства?',
    answer: 'Для серийного производства мы предлагаем программу долгосрочного обеспечения: фиксация цены и объёмов на 12–36 месяцев, буферизация на нашем складе, мониторинг EOL-уведомлений от производителей, заблаговременная закупка last-time buy партий. Для BOM от 500 позиций — персональная программа управления жизненным циклом компонентов.',
  },
  {
    question: 'Как быстро вы можете поставить компоненты для срочного производства?',
    answer: 'Срочная авиадоставка — от 6 рабочих дней. Для позиций, которые есть на нашем складе в Белгороде, возможна отгрузка в день оплаты. Для критических ситуаций (остановка производства, срочный ремонт) — приоритетная обработка заявки в течение 2 часов с привлечением всех доступных каналов поставки.',
  },
];

const breadcrumbLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Главная', item: BASE_URL },
    { '@type': 'ListItem', position: 2, name: 'Отраслевые решения', item: `${BASE_URL}/industries` },
  ],
};

const organizationLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'ChipNet (ООО Деловой Партнёр)',
  url: BASE_URL,
  description: 'Поставщик электронных компонентов для оборонного комплекса, промышленной автоматики, телекоммуникаций, энергетики, медицины и других отраслей.',
  knowsAbout: industries.map(i => i.title),
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

export default function IndustriesPage() {
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
              <span className="text-[#666]">Отраслевые решения</span>
            </nav>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-primary-dark bg-clip-text text-transparent">
              Отраслевые решения
            </h1>
            <p className="text-lg text-[#666] max-w-3xl mb-4">
              Поставка электронных компонентов для ключевых отраслей промышленности: от оборонного
              комплекса до потребительской электроники. Отраслевая экспертиза, подбор компонентов
              по требованиям стандартов, проверка в лаборатории СВП.
            </p>
            <p className="text-base text-[#757575] max-w-3xl">
              Каждая отрасль предъявляет свои требования к компонентам — температурный диапазон,
              надёжность, сертификация, длительность поставок. Мы учитываем эти особенности
              и предлагаем решения, оптимальные для каждой конкретной отрасли.
            </p>
          </div>
        </section>

        {/* Industry Grid */}
        <section className="px-4 pb-20">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">Решения по отраслям</h2>
            <p className="text-[#666] mb-12 max-w-2xl">
              Выберите отрасль для просмотра специфики поставок, типовых компонентов и требований стандартов.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {industries.map((industry) => (
                <div
                  key={industry.slug}
                  className="bg-[#f0f4ee] rounded-2xl border border-[#e8e8e8] p-6 hover:border-primary/30 hover:shadow-lg transition-all group"
                >
                  <h3 className="text-xl font-semibold mb-3 text-[#121212] group-hover:text-primary transition-colors">
                    {industry.title}
                  </h3>
                  <p className="text-[#666] text-sm leading-relaxed mb-4">{industry.description}</p>

                  <div className="mb-4">
                    <p className="text-xs font-medium text-[#757575] mb-2 uppercase tracking-wider">Категории компонентов</p>
                    <div className="flex flex-wrap gap-1.5">
                      {industry.categories.map((cat) => (
                        <span
                          key={cat}
                          className="px-2 py-0.5 bg-[#eaf0e8] text-primary text-xs rounded-md"
                        >
                          {cat}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-xs font-medium text-[#757575] mb-2 uppercase tracking-wider">Ключевые производители</p>
                    <div className="flex flex-wrap gap-1.5">
                      {industry.brands.map((brand) => {
                        const brandSlug = brand.toLowerCase().replace(/[^a-z0-9]+/gi, '-').replace(/^-|-$/g, '');
                        return (
                          <Link
                            key={brand}
                            href={`/brand/${brandSlug}`}
                            className="px-2 py-0.5 bg-white border border-[#e8e8e8] text-[#666] text-xs rounded-md hover:text-primary hover:border-primary/30 transition-colors"
                          >
                            {brand}
                          </Link>
                        );
                      })}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-[#e8e8e8]">
                    <p className="text-xs text-[#757575]">
                      <span className="font-medium text-[#666]">Требования:</span> {industry.requirements}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Why ChipNet for Industries */}
        <section className="px-4 pb-20 bg-section-accent/30">
          <div className="max-w-7xl mx-auto py-20">
            <h2 className="text-3xl font-bold mb-4">Почему отрасли выбирают ChipNet</h2>
            <p className="text-[#666] mb-12 max-w-2xl">
              Отраслевая экспертиза и понимание специфики требований каждого сектора — основа
              нашей работы с предприятиями промышленности и ВПК.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  title: 'Отраслевая экспертиза',
                  description: 'Инженеры ChipNet знают специфику каждой отрасли: требования стандартов, типовые компоненты, критичные параметры. Мы предлагаем не просто поставку, а техническое сопровождение выбора компонентов с учётом отраслевых требований.',
                },
                {
                  title: 'Проверка в лаборатории СВП',
                  description: 'Аккредитованная лаборатория входного контроля для подтверждения оригинальности и параметров компонентов. Рентген, декэпсуляция, электрические тесты и визуальный контроль. Особенно критично для оборонного и аэрокосмического сектора.',
                },
                {
                  title: 'Управление жизненным циклом',
                  description: 'Мониторинг EOL-уведомлений, буферизация на складе, last-time buy закупки, подбор аналогов для снятых с производства компонентов. Долгосрочные программы обеспечения для серийного производства на 10+ лет.',
                },
                {
                  title: 'Полный цикл ВЭД',
                  description: 'Таможенное оформление, экспортные лицензии для компонентов двойного назначения, сертификаты происхождения. Работаем с компонентами всех категорий, включая специальные разрешения для оборонного комплекса.',
                },
                {
                  title: 'Гибкие условия работы',
                  description: 'Постоплата до 30 дней для постоянных клиентов, персональный менеджер для крупных заказчиков, приоритетная обработка срочных заявок. Для BOM от 100 позиций — специальные условия по цене и срокам.',
                },
                {
                  title: 'Полная документация',
                  description: 'УПД с НДС, сертификаты происхождения, отчёты о входном контроле, таможенные декларации. Документация в формате ЭДО. Соответствие требованиям бухгалтерии, ВПК и государственных заказчиков.',
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
              Нужны компоненты для вашей отрасли?
            </h2>
            <p className="text-[#666] mb-8 max-w-xl mx-auto">
              Отправьте заявку с описанием задачи — подберём компоненты с учётом отраслевых требований,
              проверим наличие и подготовим коммерческое предложение.
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
                BOM-комплектация
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

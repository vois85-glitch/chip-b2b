import { Metadata } from 'next';
import Link from 'next/link';

const BASE_URL = 'https://www.chip-net.ru';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Защита от контрафакта — проверка электронных компонентов | ChipNet',
  description: 'Защита от контрафактных электронных компонентов: визуальный контроль, рентген, электрические тесты, декапсуляция, поперечный срез. Аккредитованная лаборатория СВП ChipNet.',
  alternates: {
    canonical: `${BASE_URL}/anti-counterfeit`,
  },
  openGraph: {
    title: 'Защита от контрафакта — проверка электронных компонентов | ChipNet',
    description: 'Защита от контрафактных электронных компонентов: визуальный контроль, рентген, электрические тесты, декапсуляция. Аккредитованная лаборатория СВП.',
    url: `${BASE_URL}/anti-counterfeit`,
    type: 'website',
    locale: 'ru_RU',
    siteName: 'ChipNet',
  },
};

const processSteps = [
  {
    icon: '🔍',
    title: 'Визуальный контроль',
    description: 'Проверка маркировки, логотипов, шрифтов, качества нанесения текста и дата-кодов на корпусе компонента. Сравнение с эталонными образцами от производителя. Выявление следов перемаркировки: затёртости, нестандартные шрифты, смещение текста, несоответствие формата дата-кода. Инспекция корпуса на наличие следов повторной пайки, царапин, сколов, деформаций.',
  },
  {
    icon: '⚡',
    title: 'Электрическое тестирование',
    description: 'Измерение ключевых электрических параметров компонента и сравнение с datasheet-спецификацией производителя: напряжения пробоя, токи утечки, входные/выходные характеристики, ёмкости, сопротивления. Функциональное тестирование периферии микроконтроллеров: UART, SPI, I2C, ADC, DAC. Выявление компонентов с параметрами, не соответствующими заявленным.',
  },
  {
    icon: '🩻',
    title: 'Рентгеноскопия',
    description: 'Неразрушающий контроль внутренней структуры компонента с помощью рентгеновской установки. Оценка качества кристалла, проволочных перемычек (bond wires), компаундной заливки. Выявление пустот в компаунде, обрывов bond wires, инородных включений. Сравнение рентгеновского изображения с эталонным снимком оригинального компонента.',
  },
  {
    icon: '🔬',
    title: 'Декапсуляция',
    description: 'Вскрытие корпуса компонента для прямого доступа к кристаллу. Химическая или механическая декапсуляция в зависимости от типа корпуса. Визуальный контроль кристалла под микроскопом: проверка логотипа на кристалле, ревизии масок, размера кристалла, топологии металлизации. Позволяет однозначно установить производителя и подтвердить оригинальность.',
  },
  {
    icon: '✂️',
    title: 'Поперечный срез',
    description: 'Изготовление микрошлифа поперечного среза корпуса для исследования структуры слоёв: металлизация, диэлектрики, контактные площадки, компаунд. Метод позволяет выявить следы повторного корпусирования (repacking), отличия в толщине слоёв, неоригинальные материалы. Деструктивный метод — применяется для выборочного контроля из партии.',
  },
];

const counterfeitTypes = [
  {
    icon: '🏷️',
    title: 'Перемаркированные (Remarked)',
    description: 'Оригинальный компонент с изменённой маркировкой: более дешёвый чип перемаркирован под дорогую модель, коммерческий температурный диапазон — под промышленный или военный. Наиболее распространённый тип контрафакта на рынке электронных компонентов. Выявляется визуальным контролем, электрическими тестами и декапсуляцией.',
  },
  {
    icon: '📋',
    title: 'Клонированные (Cloned)',
    description: 'Компонент, произведённый неоригинальным производителем с копированием дизайна кристалла или функциональности. Может иметь аналогичные электрические параметры, но отличается качеством, надёжностью и отсутствием технической поддержки. Выявляется декапсуляцией и сравнением топологии кристалла с оригиналом.',
  },
  {
    icon: '♻️',
    title: 'Восстановленные (Recycled)',
    description: 'Компоненты, извлечённые из списанного оборудования и повторно введённые в оборот как новые. Могут иметь следы пайки, повреждения кристалла от термоциклирования, деградацию параметров. Наиболее опасный тип — компоненты проходят начальное тестирование, но имеют значительно сниженный ресурс. Выявляются визуальным контролем и рентгеном.',
  },
  {
    icon: '❌',
    title: 'Дефектные (Defective)',
    description: 'Компоненты, не прошедшие выходной контроль на заводе производителя и выведенные из цепочки поставок как брак. Попадают на серый рынок через неавторизованные каналы. Могут иметь скрытые дефекты: нестабильность параметров, отказы при температурных воздействиях, преждевременный выход из строя. Выявляются полным электрическим тестированием и климатическими испытаниями.',
  },
];

const whatWeCheck = [
  {
    icon: '📝',
    title: 'Маркировка и дата-коды',
    description: 'Проверка соответствия формата маркировки, шрифтов, логотипов и дата-кодов спецификации производителя. Выявление перемаркировки, несоответствия лот-кодов и страны производства.',
  },
  {
    icon: '💎',
    title: 'Аутентичность кристалла',
    description: 'Декапсуляция и визуальная проверка кристалла под микроскопом: логотип производителя, ревизия масок, размер и топология кристалла. Гарантия того, что внутри корпуса — оригинальный кристалл.',
  },
  {
    icon: '🔗',
    title: 'Bond wires и контакты',
    description: 'Рентгеноскопическая проверка целостности проволочных перемычек и контактных площадок. Обрывы, деформации и неоригинальные материалы bond wires — признак контрафакта.',
  },
  {
    icon: '📦',
    title: 'Целостность корпуса',
    description: 'Инспекция корпуса на следы повторного корпусирования (repacking): отличия в материале компаунда, размерах, качестве формовки, следы демонтажа с платы. Вскрытые и пересобранные корпуса — признак восстановления.',
  },
  {
    icon: '🔌',
    title: 'Электрические параметры',
    description: 'Полное электрическое тестирование ключевых параметров и сравнение с datasheet: напряжения, токи, ёмкости, задержки, частотные характеристики. Отклонения от спецификации — основание для браковки.',
  },
];

const labCapabilities = [
  {
    icon: '🏥',
    title: 'Аккредитованная лаборатория СВП',
    description: 'Лаборатория входного контроля ChipNet аккредитована для проведения испытаний электронных компонентов. Оборудование регулярно калибруется, методики соответствуют стандартам GOST и MIL-STD. Персонал проходит регулярную аттестацию.',
  },
  {
    icon: '🛡️',
    title: 'Аттестация методик',
    description: 'Все методики входного контроля аттестованы и документированы. Для каждого типа компонентов разработана программа испытаний, учитывающая специфику технологии производства и типичные дефекты контрафакта.',
  },
  {
    icon: '📊',
    title: 'Отчётность и прослеживаемость',
    description: 'По результатам контроля формируется отчёт о входном контроле с фотографиями, результатами измерений и заключением. Каждый компонент прослеживается от закупки до поставки заказчику с полным документооборотом.',
  },
];

const faqItems = [
  {
    question: 'Какова доля контрафактных компонентов на рынке?',
    answer: 'По оценкам ассоциации ERAI и IHS Markit, доля контрафактных электронных компонентов на мировом рынке составляет от 1% до 5% в зависимости от категории. Для дефицитных и снятых с производства компонентов этот показатель может достигать 20–30%. Наиболее подвержены контрафакту микроконтроллеры, FPGA и аналоговые микросхемы от ведущих производителей. В условиях санкций и дефицита риск получения контрафакта значительно возрастает, особенно при закупке через неавторизованные каналы.',
  },
  {
    question: 'Какие компоненты чаще всего подделывают?',
    answer: 'Наиболее часто подделывают компоненты с высокой добавленной стоимостью и ограниченной доступностью: микроконтроллеры STM32, FPGA Xilinx и Intel/Altera, операционные усилители Texas Instruments и Analog Devices, силовые MOSFET Infineon и ON Semiconductor. Типичная схема — перемаркировка более дешёвого или коммерческого варианта под дорогой промышленный/военный. Также распространено восстановление компонентов из электронного лома, особенно для снятых с производства позиций.',
  },
  {
    question: 'Сколько времени занимает проверка компонента?',
    answer: 'Сроки зависят от объёма партии и набора испытаний. Визуальный контроль и электрические тесты для партии до 100 штук — 1–3 рабочих дня. Рентгеноскопия добавляет 1–2 дня. Декапсуляция и анализ кристалла — 3–5 рабочих дней. Полный цикл входного контроля с поперечным срезом — до 7 рабочих дней. Для срочных заказов возможен ускоренный контроль с приоритетной обработкой.',
  },
  {
    question: 'Можно ли гарантировать 100% выявление контрафакта?',
    answer: 'Ни один метод не обеспечивает 100% гарантию выявления контрафакта в неразрушающем режиме. Однако комплексное применение визуального контроля, электрических тестов и рентгеноскопии позволяет выявить более 95% подделок. Декапсуляция и анализ кристалла дают практически 100% уверенность в аутентичности, но являются разрушающим методом. Мы рекомендуем комбинированный подход: 100% визуальный и электрический контроль партии + выборочная декапсуляция 2–5 штук.',
  },
  {
    question: 'Что делать, если обнаружен контрафакт?',
    answer: 'При обнаружении контрафактных компонентов ChipNet блокирует всю партию и формирует детальный отчёт с доказательной базой: фотографии, результаты измерений, рентгеновские снимки. Партия изолируется и не поступает к заказчику. Мы инициируем разбирательство с поставщиком, организуем возврат или замену. Для заказчика формируется акт о выявлении контрафакта с рекомендациями по дальнейшим действиям. Вся информация документируется для возможных претензионных процедур.',
  },
];

const breadcrumbLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Главная', item: BASE_URL },
    { '@type': 'ListItem', position: 2, name: 'Защита от контрафакта', item: `${BASE_URL}/anti-counterfeit` },
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

export default function AntiCounterfeitPage() {
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
              <span className="text-[#666]">Защита от контрафакта</span>
            </nav>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-primary-dark bg-clip-text text-transparent">
              Защита от контрафактных электронных компонентов
            </h1>
            <p className="text-lg text-[#666] max-w-3xl mb-4">
              Комплексная система выявления контрафактных электронных компонентов в аккредитованной
              лаборатории СВП. Пятиступенчатая процедура проверки: от визуального контроля до
              декапсуляции и анализа кристалла.
            </p>
            <p className="text-base text-[#757575] max-w-3xl">
              Контрафактные компоненты — реальная угроза для промышленного производства, оборонного комплекса
              и критической инфраструктуры. ChipNet гарантирует оригинальность каждого поставляемого компонента
              благодаря многоуровневому входному контролю.
            </p>
          </div>
        </section>

        {/* Counterfeit Problem */}
        <section className="px-4 pb-20">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">Проблема контрафакта в полупроводниковой отрасли</h2>
            <p className="text-[#666] mb-8 max-w-3xl">
              Рынок контрафактных электронных компонентов — масштабная и растущая угроза для всей электронной промышленности.
              По данным ERAI (Electronic Resellers Association International), ежегодно фиксируется более 800 новых случаев
              подозрительного контрафакта. Реальное количество значительно выше — большинство случаев остаётся невыявленным.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-[#f0f4ee] rounded-2xl border border-[#e8e8e8] p-6 hover:border-primary/30 hover:shadow-lg transition-all group">
                <div className="flex items-start gap-4">
                  <span className="text-3xl shrink-0">📈</span>
                  <div>
                    <h3 className="text-xl font-semibold mb-3 text-[#121212] group-hover:text-primary transition-colors">
                      Масштаб проблемы
                    </h3>
                    <p className="text-[#666] text-sm leading-relaxed">
                      Объём мирового рынка контрафактных полупроводников оценивается в $75–100 млрд ежегодно (данные IHS Markit).
                      Это 5–8% от всего рынка электронных компонентов. В условиях санкций и дефицита доля контрафакта
                      на российском рынке значительно возрастает, особенно для компонентов снятых с производства (obsolete)
                      и дефицитных позиций от ведущих производителей.
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-[#f0f4ee] rounded-2xl border border-[#e8e8e8] p-6 hover:border-primary/30 hover:shadow-lg transition-all group">
                <div className="flex items-start gap-4">
                  <span className="text-3xl shrink-0">⚠️</span>
                  <div>
                    <h3 className="text-xl font-semibold mb-3 text-[#121212] group-hover:text-primary transition-colors">
                      Риски для производства
                    </h3>
                    <p className="text-[#666] text-sm leading-relaxed">
                      Контрафактные компоненты приводят к отказам оборудования, снижению надёжности, преждевременному выходу
                      из строя изделий. Для оборонного комплекса и критической инфраструктуры последствия могут быть катастрофическими.
                      Финансовые потери от отказов превышают стоимость контрафактного компонента в 10–100 раз. Репутационный
                      ущерб и ответственность за брак — дополнительные риски.
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-[#f0f4ee] rounded-2xl border border-[#e8e8e8] p-6 hover:border-primary/30 hover:shadow-lg transition-all group">
                <div className="flex items-start gap-4">
                  <span className="text-3xl shrink-0">🏭</span>
                  <div>
                    <h3 className="text-xl font-semibold mb-3 text-[#121212] group-hover:text-primary transition-colors">
                      Реальные случаи
                    </h3>
                    <p className="text-[#666] text-sm leading-relaxed">
                      Крупнейшие случаи контрафакта документированы Министерством обороны США: микросхемы
                      в системах противоракетной обороны, вертолётах Black Hawk и самолётах P-8 Poseidon.
                      В России зафиксированы случаи перемаркировки коммерческих STM32 под промышленные,
                      восстановленных FPGA Xilinx и клонированных оптопар. Каждый случай — потенциальный отказ
                      в ответственных применениях.
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-[#f0f4ee] rounded-2xl border border-[#e8e8e8] p-6 hover:border-primary/30 hover:shadow-lg transition-all group">
                <div className="flex items-start gap-4">
                  <span className="text-3xl shrink-0">🔒</span>
                  <div>
                    <h3 className="text-xl font-semibold mb-3 text-[#121212] group-hover:text-primary transition-colors">
                      Санкции и серый рынок
                    </h3>
                    <p className="text-[#666] text-sm leading-relaxed">
                      Экспортные ограничения привели к росту предложения компонентов через неавторизованные каналы.
                      Брокеры и дистрибьюторы серого рынка предлагают &laquo;оригинальные&raquo; компоненты без прослеживаемости
                      происхождения. Отсутствие сертификатов от производителя, нестандартная упаковка, заниженная цена —
                      типичные признаки риска. ChipNet работает только с верифицированными поставщиками и проверяет
                      каждую партию.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Anti-Counterfeit Process */}
        <section className="px-4 pb-20 bg-section-accent/30">
          <div className="max-w-7xl mx-auto py-20">
            <h2 className="text-3xl font-bold mb-4">Процедура защиты от контрафакта</h2>
            <p className="text-[#666] mb-12 max-w-2xl">
              Пятиступенчатая система входного контроля, разработанная на основе стандартов SAE AS6171, IDEA-1010
              и GOST. Каждая ступень повышает вероятность выявления контрафакта.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {processSteps.map((step, index) => (
                <div
                  key={step.title}
                  className="bg-gradient-to-br from-primary/5 to-primary-dark/5 rounded-2xl border border-primary/10 p-6 hover:border-primary/30 transition-all"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary/10 text-primary font-bold text-lg flex items-center justify-center shrink-0">
                      {index + 1}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-2xl">{step.icon}</span>
                        <h3 className="text-lg font-semibold text-[#121212]">{step.title}</h3>
                      </div>
                      <p className="text-[#666] text-sm leading-relaxed">{step.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SVP Lab Capabilities */}
        <section className="px-4 pb-20">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">Возможности лаборатории СВП</h2>
            <p className="text-[#666] mb-12 max-w-2xl">
              Аккредитованная лаборатория входного контроля ChipNet оснащена современным оборудованием для
              выявления контрафактных компонентов всех типов. Методики аттестованы, персонал регулярно проходит
              повышение квалификации.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {labCapabilities.map((cap) => (
                <div
                  key={cap.title}
                  className="bg-[#f0f4ee] rounded-2xl border border-[#e8e8e8] p-6 hover:border-primary/30 hover:shadow-lg transition-all group"
                >
                  <div className="flex items-start gap-4">
                    <span className="text-3xl shrink-0">{cap.icon}</span>
                    <div>
                      <h3 className="text-xl font-semibold mb-3 text-[#121212] group-hover:text-primary transition-colors">
                        {cap.title}
                      </h3>
                      <p className="text-[#666] text-sm leading-relaxed">{cap.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* What We Check */}
        <section className="px-4 pb-20 bg-section-accent/30">
          <div className="max-w-7xl mx-auto py-20">
            <h2 className="text-3xl font-bold mb-4">Что мы проверяем</h2>
            <p className="text-[#666] mb-12 max-w-2xl">
              Комплексная проверка каждого компонента по пяти ключевым направлениям, обеспечивающая
              максимальную вероятность выявления контрафакта и подтверждение оригинальности.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {whatWeCheck.map((item) => (
                <div
                  key={item.title}
                  className="bg-white rounded-2xl border border-[#e8e8e8] p-6 hover:border-primary/30 hover:shadow-lg transition-all group"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-2xl">{item.icon}</span>
                    <h3 className="text-lg font-semibold text-[#121212] group-hover:text-primary transition-colors">
                      {item.title}
                    </h3>
                  </div>
                  <p className="text-[#666] text-sm leading-relaxed">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Counterfeit Types */}
        <section className="px-4 pb-20">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">Типы контрафактных компонентов</h2>
            <p className="text-[#666] mb-12 max-w-2xl">
              Знание типичных схем контрафакта позволяет выстроить эффективную стратегию выявления подделок.
              Каждый тип требует определённого набора методов контроля.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {counterfeitTypes.map((type) => (
                <div
                  key={type.title}
                  className="bg-[#f0f4ee] rounded-2xl border border-[#e8e8e8] p-6 hover:border-primary/30 hover:shadow-lg transition-all group"
                >
                  <div className="flex items-start gap-4">
                    <span className="text-3xl shrink-0">{type.icon}</span>
                    <div>
                      <h3 className="text-xl font-semibold mb-3 text-[#121212] group-hover:text-primary transition-colors">
                        {type.title}
                      </h3>
                      <p className="text-[#666] text-sm leading-relaxed">{type.description}</p>
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
              Нужна проверка компонентов на контрафакт?
            </h2>
            <p className="text-[#666] mb-8 max-w-xl mx-auto">
              Отправьте заявку — проведём входной контроль в лаборатории СВП, подтвердим оригинальность
              и подготовим полный отчёт с результатами испытаний.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/#bom"
                className="inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark text-[#121212] font-medium px-8 py-3 rounded-lg transition-colors"
              >
                Запросить проверку
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
              </Link>
              <Link
                href="/quality-assurance"
                className="inline-flex items-center justify-center gap-2 border border-primary text-primary hover:bg-primary/5 font-medium px-8 py-3 rounded-lg transition-colors"
              >
                Контроль качества
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

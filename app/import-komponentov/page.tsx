import { Metadata } from 'next';
import Link from 'next/link';
import ComponentSearch from '@/components/sections/ComponentSearch';

const BASE_URL = 'https://www.chip-net.ru';

export const metadata: Metadata = {
  title: 'Импорт электронных компонентов в Россию | Поставка и таможенное оформление',
  description: 'Импорт электронных компонентов из Китая, Гонконга, Южной Кореи и Европы. Таможенное оформление, логистика, проверка оригинальности. Срочная доставка от 6 дней.',
  alternates: {
    canonical: `${BASE_URL}/import-komponentov`,
  },
  openGraph: {
    title: 'Импорт электронных компонентов в Россию',
    description: 'Импорт электронных компонентов из Китая, Гонконга, Южной Кореи и Европы. Таможенное оформление, логистика, проверка оригинальности. Срочная доставка от 6 дней.',
    url: `${BASE_URL}/import-komponentov`,
    type: 'website',
    locale: 'ru_RU',
    siteName: 'ChipNet',
  },
};

const importSteps = [
  {
    step: '01',
    title: 'Заявка и подбор',
    description: 'Вы отправляете спецификацию или BOM-лист. Наши инженеры подбирают компоненты у авторизованных дистрибьюторов, проверяют наличие и актуальность серий, предлагают аналоги для unavailable позиций.',
  },
  {
    step: '02',
    title: 'Коммерческое предложение',
    description: 'Формируем КП с указанием цен, сроков поставки и условий оплаты. Для постоянных клиентов — постоплата до 30 календарных дней. Для редких и санкционных позиций сроки согласования до 24 часов.',
  },
  {
    step: '03',
    title: 'Закупка и отгрузка',
    description: 'После подтверждения заказа выкупаем компоненты у поставщиков в Азии, Европе или на международном рынке. Организуем отгрузку с соблюдением температурного режима и влагозащиты для чувствительных компонентов.',
  },
  {
    step: '04',
    title: 'Таможенное оформление',
    description: 'Полный цикл ВЭД: классификация по кодам ТН ВЭД, подготовка деклараций, прохождение таможни. Работаем с электронными компонентами всех категорий, включая двойного назначения.',
  },
  {
    step: '05',
    title: 'Входной контроль',
    description: 'Каждая партия проходит проверку в аккредитованной лаборатории СВП: рентгеновский контроль, декэпсуляция, электрические тесты и визуальный осмотр под микроскопом. Гарантируем оригинальность.',
  },
  {
    step: '06',
    title: 'Доставка клиенту',
    description: 'Срочная авиадоставка от 6 рабочих дней, стандартная от 14 дней. Компоненты поступают на наш склад в Белгороде с последующей отправкой транспортной компанией по всей России.',
  },
];

const importCategories = [
  {
    title: 'Микроконтроллеры и процессоры',
    items: 'ARM Cortex-M, AVR, PIC, RISC-V, DSP',
    description: 'STM32, ATmega, GD32, HK32, CH32 — полный ассортимент 8/16/32-битных микроконтроллеров для промышленной автоматики и встраиваемых систем.',
  },
  {
    title: 'ПЛИС (FPGA)',
    items: 'Xilinx, Intel/Altera, Lattice, Gowin, Efinix',
    description: 'Artix-7, Kintex-7, Zynq, Cyclone, ECP5 — программируемая логика для обработки сигналов, радиолокации и криптографии. Аналоги санкционных серий от Gowin и Efinix.',
  },
  {
    title: 'Силовая электроника',
    items: 'MOSFET, IGBT, драйверы, контроллеры',
    description: 'Infineon OptiMOS, onsemi Super-Junction, STMicroelectronics MDmesh — транзисторы и драйверы для инверторов, сварочного оборудования и преобразователей частоты.',
  },
  {
    title: 'Пассивные компоненты',
    items: 'Конденсаторы, резисторы, индуктивности',
    description: 'MLCC от Samsung, Murata, KEMET; электролитические от Nichicon, Panasonic; танталовые для ответственных применений. Полный кросс-референс электрических параметров.',
  },
  {
    title: 'Аналого-цифровые ИС',
    items: 'АЦП, ЦАП, операционные усилители, датчики',
    description: 'Analog Devices, Texas Instruments, Maxim — высокоточные преобразователи и усилители для измерительных систем, автоматики и ВПК.',
  },
  {
    title: 'Интерфейсы и связь',
    items: 'Трансиверы, модемы, RF-компоненты, оптоэлектроника',
    description: 'Высокоскоростные интерфейсы Ethernet, USB, PCIe, RF-модули и оптопары для телекоммуникационного и промышленного оборудования.',
  },
];

const advantages = [
  {
    title: 'Прямые контракты с дистрибьюторами',
    description: 'Работаем только с авторизованными дистрибьюторами и заводами-изготовителями. Никаких «серых» каналов — каждый компонент прослеживается от производства до доставки.',
  },
  {
    title: 'Полный цикл ВЭД',
    description: 'Берём на себя всё таможенное оформление: от классификации по ТН ВЭД до выпуска декларации. Вы получаете компоненты как российскую поставку с полным пакетом закрывающих документов.',
  },
  {
    title: 'Проверка в лаборатории СВП',
    description: 'Аккредитованная лаборатория входного контроля: рентген, декэпсуляция, электрические тесты и визуальный осмотр. Гарантируем оригинальность каждой партии.',
  },
  {
    title: 'Срочная доставка от 6 дней',
    description: 'Авиатранспортом из Азии — от 6 рабочих дней. Стандартная логистика — от 14 дней. Отслеживание груза на каждом этапе в режиме реального времени.',
  },
  {
    title: 'Подбор аналогов санкционных компонентов',
    description: 'Инженерная экспертиза по кросс-референсам: GD32 и HK32 вместо STM32, Gowin вместо Xilinx, доступные аналоги TI и ADI. Проверяем совместимость в лаборатории.',
  },
  {
    title: 'Гибкая система оплаты',
    description: 'Постоплата до 30 дней для постоянных клиентов. Для новых заказчиков — предоплата 50% с переходом на отсрочку после 3 успешных поставок.',
  },
];

const faqItems = [
  {
    question: 'Из каких стран вы импортируете электронные компоненты?',
    answer: 'Основные поставки идут из Китая, Гонконга, Тайваня и Южной Кореи — это крупнейшие центры производства и дистрибуции электроники. Также работаем с поставщиками из Европы (Германия, Нидерланды) и Юго-Восточной Азии. Для каждого региона у нас есть проверенные партнёры — авторизованные дистрибьюторы с прямыми контрактами.',
  },
  {
    question: 'Сколько времени занимает импорт компонентов?',
    answer: 'Срочная авиадоставка занимает от 6 до 10 рабочих дней с момента подтверждения заказа. Стандартная логистика (морская + наземная) — от 14 до 30 дней в зависимости от региона отправления. На таможенное оформление закладываем 2–5 рабочих дней. Итого: от заказа до получения на складе в Белгороде — от 8 дней по срочной схеме.',
  },
  {
    question: 'Как происходит таможенное оформление?',
    answer: 'Мы полностью берём на себя ВЭД: классифицируем компоненты по кодам ТН ВЭД, готовим декларации, оплачиваем пошлины и сборы, проходим все таможенные процедуры. Клиент получает компоненты как обычную российскую поставку с полным пакетом закрывающих документов (счёт-фактура, УПД, сертификаты).',
  },
  {
    question: 'Как вы гарантируете оригинальность импортных компонентов?',
    answer: 'Каждая партия проходит входной контроль в аккредитованной лаборатории СВП: рентгеновский контроль внутренней структуры, декэпсуляция для проверки кристалла, электрические тесты параметров по даташиту, визуальный контроль маркировки и корпуса под микроскопом. Работаем только с авторизованными дистрибьюторами — никаких «серых» каналов.',
  },
  {
    question: 'Работаете ли вы с компонентами двойного назначения?',
    answer: 'Да, мы имеем опыт поставок электронных компонентов, относящихся к товарам двойного назначения. В этом случае требуется дополнительное оформление экспортных лицензий и разрешений. Наши специалисты помогают подготовить все необходимые документы для законного импорта таких компонентов.',
  },
  {
    question: 'Какие минимальные объёмы заказа?',
    answer: 'Минимальный заказ — от 1 компонента. Мы работаем как с единичными поставками редких микросхем для опытных образцов, так и с оптовыми партиями для серийного производства. Для BOM-листов с большим количеством позиций предлагаем специальные условия по цене и срокам.',
  },
];

const breadcrumbLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Главная',
      item: BASE_URL,
    },
    {
      '@type': 'ListItem',
      position: 2,
      name: 'Импорт электронных компонентов',
      item: `${BASE_URL}/import-komponentov`,
    },
  ],
};

const serviceLd = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'Импорт электронных компонентов',
  description: 'Полный цикл импорта электронных компонентов из Китая, Гонконга, Южной Кореи и Европы. Таможенное оформление, логистика, проверка оригинальности.',
  provider: {
    '@type': 'Organization',
    name: 'ChipNet (ООО Деловой Партнёр)',
    url: BASE_URL,
  },
  areaServed: {
    '@type': 'Country',
    name: 'Россия',
  },
  serviceType: 'Импорт электронных компонентов',
};

const faqLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqItems.map((item) => ({
    '@type': 'Question',
    name: item.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: item.answer,
    },
  })),
};

export default function ImportKomponentovPage() {
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
        {/* Hero Section */}
        <section className="pt-32 pb-16 px-4">
          <div className="max-w-7xl mx-auto">
            <nav className="text-sm text-[#757575] mb-6 flex items-center gap-2">
              <Link href="/" className="hover:text-primary transition-colors">Главная</Link>
              <span className="text-gray-600">/</span>
              <span className="text-[#666]">Импорт компонентов</span>
            </nav>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-primary-dark bg-clip-text text-transparent">
              Импорт электронных компонентов
            </h1>
            <p className="text-lg text-[#666] max-w-3xl mb-4">
              Организуем полный цикл импорта электронных компонентов из Китая, Гонконга, Тайваня, Южной Кореи и Европы.
              Таможенное оформление, логистика, проверка оригинальности — от заявки до доставки на ваш склад.
            </p>
            <p className="text-base text-[#757575] max-w-3xl">
              Срочная авиадоставка от 6 рабочих дней. Работаем с B2B-клиентами: промышленные предприятия, оборонный комплекс, разработчики электроники.
            </p>
          </div>
        </section>

        {/* Component Search */}
        <section className="px-4 pb-16">
          <div className="max-w-7xl mx-auto">
            <ComponentSearch />
          </div>
        </section>

        {/* Import Process Steps */}
        <section className="px-4 pb-20">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">Как работает импорт компонентов</h2>
            <p className="text-[#666] mb-12 max-w-2xl">
              От вашей заявки до получения компонентов на складе — шесть чётких этапов с полным контролем на каждом.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {importSteps.map((item) => (
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

        {/* Import Categories */}
        <section className="px-4 pb-20 bg-section-accent/30">
          <div className="max-w-7xl mx-auto py-20">
            <h2 className="text-3xl font-bold mb-4">Что мы импортируем</h2>
            <p className="text-[#666] mb-12 max-w-2xl">
              Полный ассортимент электронных компонентов для промышленности и оборонного комплекса — от пассивных элементов до сложных систем-на-кристалле.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {importCategories.map((cat) => (
                <div
                  key={cat.title}
                  className="bg-[#f0f4ee] rounded-2xl border border-[#e8e8e8] p-6 hover:border-primary/30 hover:shadow-lg transition-all"
                >
                  <h3 className="text-lg font-semibold mb-2 text-[#121212]">{cat.title}</h3>
                  <p className="text-primary text-sm font-medium mb-3">{cat.items}</p>
                  <p className="text-[#666] text-sm leading-relaxed">{cat.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Advantages */}
        <section className="px-4 pb-20">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">Преимущества работы с ChipNet</h2>
            <p className="text-[#666] mb-12 max-w-2xl">
              Комплексный подход к импорту электронных компонентов — от поиска и проверки до доставки и документооборота.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {advantages.map((adv) => (
                <div
                  key={adv.title}
                  className="bg-gradient-to-br from-primary/5 to-primary-dark/5 rounded-2xl border border-primary/10 p-6 hover:border-primary/30 transition-all"
                >
                  <h3 className="text-lg font-semibold mb-3 text-[#121212]">{adv.title}</h3>
                  <p className="text-[#666] text-sm leading-relaxed">{adv.description}</p>
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
                  <div className="px-6 pb-6 text-[#666] leading-relaxed">
                    {item.answer}
                  </div>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="px-4 pb-20">
          <div className="max-w-4xl mx-auto bg-gradient-to-br from-primary/10 to-primary-dark/5 rounded-2xl border border-emerald-800/30 p-8 md:p-12 text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Нужен импорт электронных компонентов?
            </h2>
            <p className="text-[#666] mb-8 max-w-xl mx-auto">
              Отправьте заявку или BOM-лист — подберём компоненты, рассчитаем сроки и стоимость поставки, организуем полный цикл импорта.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/#bom"
                className="inline-flex items-center justify-center gap-2 bg-primary hover:bg-emerald-500 text-[#121212] font-medium px-8 py-3 rounded-lg transition-colors"
              >
                Отправить заявку
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
              </Link>
              <Link
                href="tel:+79103219191"
                className="inline-flex items-center justify-center gap-2 border border-primary text-primary hover:bg-primary/5 font-medium px-8 py-3 rounded-lg transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                Позвонить
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}


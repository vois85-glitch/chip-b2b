import { Metadata } from 'next';
import Link from 'next/link';

const BASE_URL = 'https://www.chip-net.ru';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Срочная поставка электронных компонентов | ChipNet',
  description: 'Срочная поставка электронных компонентов: авиадоставка от 6 рабочих дней, приоритетная обработка за 2 часа, поиск по глобальным каналам. Для остановки производства, EOL-закупок, аварийного ремонта.',
  alternates: {
    canonical: `${BASE_URL}/urgent-sourcing`,
  },
  openGraph: {
    title: 'Срочная поставка электронных компонентов | ChipNet',
    description: 'Срочная поставка электронных компонентов. Авиадоставка от 6 дней, приоритетная обработка, многоканальный поиск, прямые контакты дистрибьюторов.',
    url: `${BASE_URL}/urgent-sourcing`,
    type: 'website',
    locale: 'ru_RU',
    siteName: 'ChipNet',
  },
};

const urgentSituations = [
  {
    icon: '🛑',
    title: 'Остановка производства',
    description: 'Дефицит критичного компонента приводит к простою конвейера или сборочной линии. Каждый день простоя — это прямые убытки, невыполнение контракта и риск потери заказчика. Срочная поставка позволяет возобновить производство в кратчайшие сроки, минимизируя финансовые потери.',
  },
  {
    icon: '⏳',
    title: 'EOL Last-Time-Buy',
    description: 'Производитель объявил о снятии компонента с производства (End-of-Life), и окно последней закупки закрывается. Необходимо оперативно приобрести партию для обеспечения текущего производства на весь оставшийся жизненный цикл изделия. Промедление означает вынужденный редизайн платы.',
  },
  {
    icon: '📋',
    title: 'Дедлайн по контракту',
    description: 'Срыв сроков поставки по государственному или коммерческому контракту влечёт штрафные санкции, потерю гарантийного обеспечения и репутационные риски. Срочная поставка компонентов позволяет закрыть дефицит в BOM и выполнить обязательства перед заказчиком в срок.',
  },
  {
    icon: '🔧',
    title: 'Аварийный ремонт',
    description: 'Выход из строя оборудования на действующем объекте: промышленная линия, система связи, медицинский аппарат, объект энергетики. Требуется оперативная замена вышедшего из строя компонента для восстановления работоспособности. Любая задержка — это недополученная прибыль или угроза безопасности.',
  },
];

const capabilities = [
  {
    icon: '✈️',
    title: 'Доставка от 6 рабочих дней',
    description: 'Авиадоставка компонентов из-за рубежа за 6–10 рабочих дней. Для позиций на нашем складе в Белгороде — отгрузка в день оплаты. Логистическая цепочка оптимизирована для срочных заказов: приоритетное таможенное оформление и прямые рейсы без промежуточных складов.',
  },
  {
    icon: '⚡',
    title: 'Приоритетная обработка за 2 часа',
    description: 'Срочная заявка обрабатывается в приоритетном порядке: проверка наличия по всем каналам — в течение 2 часов, коммерческое предложение — не позднее 4 часов. Задействуются все доступные ресурсы компании, заявка курируется лично руководителем отдела закупок.',
  },
  {
    icon: '🌐',
    title: 'Многоканальный поиск',
    description: 'Одновременный поиск компонентов по всем доступным каналам: авторизованные дистрибьюторы, азиатские поставщики, рынок избыточных запасов, прямые контакты с OCM. Максимальное покрытие источников обеспечивает наивысшую вероятность нахождения нужного компонента в кратчайший срок.',
  },
  {
    icon: '🤝',
    title: 'Прямые контакты дистрибьюторов',
    description: 'Прямые договоры с ведущими мировыми дистрибьюторами (Arrow, Avnet, Mouser, Digi-Key, Future Electronics) и региональными поставщиками в Азии. Это позволяет оперативно получить доступ к складским запасам без посредников и сократить логистическую цепочку.',
  },
];

const processSteps = [
  {
    step: '1',
    icon: '📞',
    title: 'Срочная заявка',
    description: 'Позвоните по телефону или отправьте заявку с пометкой «срочно». Укажите партномера, количества и критичный срок доставки. Заявка немедленно передаётся руководителю отдела закупок для приоритетной обработки.',
  },
  {
    step: '2',
    icon: '🔍',
    title: 'Многоканальный поиск',
    description: 'Запускаем одновременный поиск по всем каналам: собственный склад, авторизованные дистрибьюторы, азиатские поставщики, избыточные запасы. Результат проверки наличия — в течение 2 часов с указанием актуальных сроков поставки по каждому варианту.',
  },
  {
    step: '3',
    icon: '📄',
    title: 'КП и подтверждение',
    description: 'Подготавливаем коммерческое предложение с вариантами поставки: срок, цена, источник. Для критичных ситуаций предлагаем несколько альтернативных вариантов, включая аналоги. После вашего подтверждения немедленно запускаем заказ.',
  },
  {
    step: '4',
    icon: '🚚',
    title: 'Авиадоставка и контроль',
    description: 'Оформляем авиадоставку с приоритетным таможенным оформлением. Отслеживаем груз на каждом этапе, уведомляем о статусе. Входной контроль в лаборатории СВП при необходимости — в день поступления на склад.',
  },
];

const componentTypes = [
  {
    icon: '🧠',
    title: 'Микроконтроллеры',
    description: 'Срочная поставка MCU от STMicroelectronics (STM32), NXP (LPC, i.MX), Microchip (PIC, SAM), Renesas (RL78, RA), Infineon (XMC). Все семейства, все корпуса, индустриальный и расширенный температурный диапазон.',
  },
  {
    icon: '🔲',
    title: 'FPGA / ПЛИС',
    description: 'Срочная поставка FPGA Xilinx (Spartan, Artix, Kintex, Virtex), Intel/Altera (Cyclone, Arria, Stratix), Gowin, Lattice. Включая отладочные платы, конфигурационную память и программаторы.',
  },
  {
    icon: '⚡',
    title: 'Силовые компоненты',
    description: 'IGBT и MOSFET модули (Infineon, onsemi, STMicroelectronics), SiC и GaN транзисторы, драйверы затворов, модули питания DC-DC и AC-DC. Для инверторов, приводов, систем питания и зарядных станций.',
  },
  {
    icon: '📐',
    title: 'Аналоговые компоненты',
    description: 'Операционные усилители, АЦП/ЦАП, регуляторы напряжения, интерфейсные микросхемы, компараторы, референсные ИОН от Analog Devices, Texas Instruments, Maxim Integrated. Прецизионные и стандартные серии.',
  },
  {
    icon: '📡',
    title: 'RF-компоненты',
    description: 'Трансиверы, RF-усилители, фильтры, антенны, СВЧ-компоненты, модули беспроводной связи (Wi-Fi, Bluetooth, LoRa, NB-IoT, Sub-GHz). Для телекоммуникационного оборудования, IoT и систем связи.',
  },
  {
    icon: '💾',
    title: 'Память',
    description: 'DDR3/DDR4/DDR5 SDRAM, eMMC, NAND/NOR Flash, SRAM, FRAM, EEPROM от Micron, Samsung, SK Hynix, ISSI, Winbond. Для вычислительных плат, контроллеров, телеком-оборудования и встраиваемых систем.',
  },
];

const faqItems = [
  {
    question: 'Как быстро вы можете поставить компоненты при срочном заказе?',
    answer: 'Минимальный срок срочной авиадоставки — 6 рабочих дней с момента подтверждения заказа и оплаты. Для компонентов, которые есть на нашем складе в Белгороде, возможна отгрузка в день оплаты. Срок зависит от доступности компонента и логистической цепочки: если позиция в наличии у авторизованного дистрибьютора — 6–10 дней, если требуется поиск по нестандартным каналам — до 15 дней.',
  },
  {
    question: 'Сколько стоит срочная поставка?',
    answer: 'Стоимость срочной поставки зависит от компонента, объёма заказа и логистической цепочки. Авиадоставка увеличивает логистические расходы на 15–30% по сравнению с обычной поставкой. При этом цена самого компонента не меняется — мы фиксируем цену в коммерческом предложении. Для постоянных клиентов и крупных заказов возможна компенсация части логистических расходов.',
  },
  {
    question: 'Что делать, если нужного компонента нет в наличии?',
    answer: 'Если компонент отсутствует у прямых дистрибьюторов, мы задействуем альтернативные каналы: азиатских поставщиков, рынок избыточных запасов (excess inventory), прямые закупки у OCM. Параллельно инженеры ChipNet подбирают аналоги с эквивалентными электрическими параметрами. Вы получаете все доступные варианты с указанием сроков, цен и технических характеристик — выбор за вами.',
  },
  {
    question: 'Гарантируется ли оригинальность при срочной поставке?',
    answer: 'Да, оригинальность гарантируется независимо от сроков поставки. Все компоненты проходят входной контроль в аккредитованной лаборатории СВП: визуальный осмотр, рентгеноскопия, электрические тесты. Мы работаем только с проверенными поставщиками с полной прослеживаемостью происхождения. Срочная поставка не означает снижение стандартов качества — контроль осуществляется в полном объёме, в том числе в ускоренном режиме.',
  },
  {
    question: 'Можно ли заказать срочную поставку для оборонного предприятия?',
    answer: 'Да, мы имеем опыт срочных поставок для предприятий оборонно-промышленного комплекса. Организуем полный цикл ВЭД: экспортные лицензии для компонентов двойного назначения, сертификаты происхождения, таможенное оформление. Компоненты с военной приёмкой и расширенным температурным диапазоном проходят обязательный входной контроль в лаборатории СВП с оформлением соответствующих отчётов.',
  },
];

const breadcrumbLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Главная', item: BASE_URL },
    { '@type': 'ListItem', position: 2, name: 'Срочная поставка', item: `${BASE_URL}/urgent-sourcing` },
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

export default function UrgentSourcingPage() {
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
              <span className="text-[#666]">Срочная поставка</span>
            </nav>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-primary-dark bg-clip-text text-transparent">
              Срочная поставка электронных компонентов
            </h1>
            <p className="text-lg text-[#666] max-w-3xl mb-4">
              Авиадоставка электронных компонентов от 6 рабочих дней. Приоритетная обработка заявки
              за 2 часа, поиск по глобальным каналам поставки, прямые контакты с дистрибьюторами.
            </p>
            <p className="text-base text-[#757575] max-w-3xl">
              Когда производство стоит или дедлайн горит — каждая минута на счету. ChipNet обеспечивает
              срочную поставку критичных компонентов с максимальным приоритетом и полным контролем
              качества на каждом этапе логистической цепочки.
            </p>
          </div>
        </section>

        {/* When Urgent Sourcing is Needed */}
        <section className="px-4 pb-20">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">Когда нужна срочная поставка</h2>
            <p className="text-[#666] mb-12 max-w-2xl">
              Срочная поставка требуется в критических ситуациях, когда задержка ведёт к прямым финансовым
              потерям, срыву контрактов или угрозе безопасности. Типовые сценарии, с которыми мы работаем ежедневно.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {urgentSituations.map((item) => (
                <div
                  key={item.title}
                  className="bg-[#f0f4ee] rounded-2xl border border-[#e8e8e8] p-6 hover:border-primary/30 hover:shadow-lg transition-all group"
                >
                  <div className="flex items-start gap-4">
                    <span className="text-3xl shrink-0">{item.icon}</span>
                    <div>
                      <h3 className="text-xl font-semibold mb-3 text-[#121212] group-hover:text-primary transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-[#666] text-sm leading-relaxed">{item.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Our Capabilities */}
        <section className="px-4 pb-20 bg-section-accent/30">
          <div className="max-w-7xl mx-auto py-20">
            <h2 className="text-3xl font-bold mb-4">Наши возможности срочной поставки</h2>
            <p className="text-[#666] mb-12 max-w-2xl">
              Инфраструктура и ресурсы ChipNet для обеспечения максимальной скорости поставки
              при сохранении полного контроля качества и документального сопровождения.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {capabilities.map((item) => (
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

        {/* Urgent Sourcing Process */}
        <section className="px-4 pb-20">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">Процесс срочной поставки</h2>
            <p className="text-[#666] mb-12 max-w-2xl">
              От срочной заявки до получения компонентов — каждый этап оптимизирован для сокращения сроков
              без ущерба для качества и документального оформления.
            </p>
            <div className="bg-white rounded-2xl border border-[#e8e8e8] p-8">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {processSteps.map((item) => (
                  <div key={item.step} className="text-center">
                    <div className="w-12 h-12 rounded-full bg-primary/10 text-primary font-bold text-lg flex items-center justify-center mx-auto mb-3">
                      {item.step}
                    </div>
                    <span className="text-2xl block mb-3">{item.icon}</span>
                    <h4 className="font-semibold mb-2 text-[#121212]">{item.title}</h4>
                    <p className="text-[#666] text-sm leading-relaxed">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Component Types */}
        <section className="px-4 pb-20 bg-section-accent/30">
          <div className="max-w-7xl mx-auto py-20">
            <h2 className="text-3xl font-bold mb-4">Компоненты для срочной поставки</h2>
            <p className="text-[#666] mb-12 max-w-2xl">
              Мы обеспечиваем срочную поставку всех основных категорий электронных компонентов:
              от микроконтроллеров и FPGA до силовых модулей и RF-компонентов.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {componentTypes.map((item) => (
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
              Нужна срочная поставка компонентов?
            </h2>
            <p className="text-[#666] mb-8 max-w-xl mx-auto">
              Отправьте заявку с пометкой «срочно» — проверим наличие за 2 часа и организуем
              авиадоставку от 6 рабочих дней с полным контролем качества.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/#bom"
                className="inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark text-[#121212] font-medium px-8 py-3 rounded-lg transition-colors"
              >
                Срочная заявка
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

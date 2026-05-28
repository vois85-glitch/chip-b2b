import { Metadata } from 'next';
import Link from 'next/link';

const BASE_URL = 'https://www.chip-net.ru';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Запрос коммерческого предложения на электронные компоненты | ChipNet',
  description: 'Запросите коммерческое предложение на электронные компоненты. Обработка заявки за 2 часа, проверка наличия по глобальным каналам, подбор аналогов, BOM-комплектация, поставка EOL-компонентов.',
  alternates: {
    canonical: `${BASE_URL}/rfq`,
  },
  openGraph: {
    title: 'Запрос коммерческого предложения на электронные компоненты | ChipNet',
    description: 'Запросите КП на электронные компоненты. Обработка за 2 часа, проверка наличия, подбор аналогов, поставка EOL-компонентов и объёмное ценообразование.',
    url: `${BASE_URL}/rfq`,
    type: 'website',
    locale: 'ru_RU',
    siteName: 'ChipNet',
  },
};

const rfqSteps = [
  {
    step: '1',
    icon: '📋',
    title: 'Отправка заявки',
    description: 'Заполните форму на сайте, отправьте BOM по email или передайте заявку менеджеру по телефону. Укажите партномера, количества, сроки и особые требования — это ускорит обработку.',
  },
  {
    step: '2',
    icon: '🔍',
    title: 'Проверка наличия',
    description: 'Мы проверяем наличие компонентов по всем доступным каналам: собственный склад, склады авторизованных дистрибьюторов, азиатские поставщики, рынок избыточных запасов. Для каждой позиции фиксируем актуальный статус и срок поставки.',
  },
  {
    step: '3',
    icon: '📄',
    title: 'Коммерческое предложение за 2 часа',
    description: 'Подготавливаем детализированное КП с указанием цен, сроков поставки, производителя, страны происхождения и условий оплаты. Для сложных BOM — разбивка по позициям с комментариями инженера.',
  },
  {
    step: '4',
    icon: '✅',
    title: 'Согласование и поставка',
    description: 'После подтверждения КП выставляем счёт и запускаем заказ в работу. Отслеживание на каждом этапе логистической цепочки, уведомления о статусе, полное таможенное оформление и документация.',
  },
];

const rfqRequirements = [
  {
    icon: '🔢',
    title: 'Партномера компонентов',
    description: 'Укажите полные партномера (manufacturer part number) включая суффиксы корпуса и температурного диапазона. Например: STM32F407VGT6, не просто STM32F407. Это исключает ошибки при подборе и сокращает время обработки заявки.',
  },
  {
    icon: '📊',
    title: 'Количество и кратность',
    description: 'Укажите требуемое количество с учётом кратности упаковки (tape & reel, tray, tube). Для серийного производства укажите плановую потребность на год — это позволит предложить объёмное ценообразование и зафиксировать наличие на длительный срок.',
  },
  {
    icon: '⏰',
    title: 'Сроки поставки',
    description: 'Укажите требуемую дату доставки. Для срочных заказов (остановка производства, аварийный ремонт) пометьте заявку как критическую — мы задействуем приоритетную обработку и авиадоставку от 6 рабочих дней.',
  },
  {
    icon: '⚙️',
    title: 'Технические требования',
    description: 'Укажите особые требования: температурный диапазон (индустриальный, расширенный, военный), квалификацию (AEC-Q100, MIL-STD-883), допустимость аналогов, требования к документации (сертификаты происхождения, отчёты входного контроля).',
  },
];

const rfqTypes = [
  {
    icon: '⚡',
    title: 'Срочный поиск компонентов',
    description: 'Для критических ситуаций: остановка конвейера, аварийный ремонт оборудования, срочная доработка изделия. Приоритетная обработка заявки, авиадоставка от 6 рабочих дней, задействование всех каналов поставки одновременно. Результат проверки наличия — в течение 2 часов.',
  },
  {
    icon: '📦',
    title: 'BOM-комплектация',
    description: 'Полная или частичная комплектация по спецификации (BOM). Проверяем наличие каждой позиции, подбираем аналоги для недоступных компонентов, формируем единое коммерческое предложение. Для BOM от 50 позиций — персональный менеджер и специальные условия по цене.',
  },
  {
    icon: '🔄',
    title: 'Подбор аналогов',
    description: 'Замена санкционных, снятых с производства или недоступных компонентов. Инженерный кросс-референс с учётом электрических параметров, корпуса, температурного диапазона и условий применения. Предоставляем сравнительную таблицу оригинал/аналог с комментариями.',
  },
  {
    icon: '🛑',
    title: 'EOL-компоненты',
    description: 'Закупка компонентов, снятых с производства (End-of-Life). Мониторинг EOL-уведомлений от производителей, last-time buy закупки, поиск остатков на складах дистрибьюторов и избыточных запасов. Буферизация на нашем складе для обеспечения длительного производства.',
  },
  {
    icon: '💰',
    title: 'Объёмное ценообразование',
    description: 'Для серийного производства с плановой потребностью от 1000 шт. на позицию — объёмные скидки до 30% от розничной цены. Фиксация цены на 6–12 месяцев, буферизация на складе, поэтапная отгрузка по графику производства без увеличения срока поставки.',
  },
];

const faqItems = [
  {
    question: 'Как быстро вы обрабатываете запрос коммерческого предложения?',
    answer: 'Стандартное коммерческое предложение готовится в течение 2 рабочих часов после получения заявки. Для сложных BOM с большим количеством позиций или компонентов, требующих поиска по нестандартным каналам, срок может увеличиться до 4 рабочих часов. В любом случае вы получаете подтверждение получения заявки и ориентировочное время подготовки КП в течение 15 минут.',
  },
  {
    question: 'Какую информацию нужно указать в заявке для быстрой обработки?',
    answer: 'Для максимально быстрой обработки укажите: полные партномера компонентов с суффиксами (корпус, температурный диапазон), требуемые количества с учётом кратности упаковки, желаемые сроки доставки, допустимость замены на аналоги, особые требования (температурный диапазон, квалификация, документация). Чем подробнее заявка, тем точнее и быстрее будет коммерческое предложение.',
  },
  {
    question: 'Можно ли запросить КП на компоненты, которых нет в каталоге?',
    answer: 'Да, мы работаем не только с позициями из каталога на сайте. Наша база данных охватывает более 10 миллионов наименований от 200+ производителей. Если компонент отсутствует в каталоге, мы проверяем его наличие по глобальной сети дистрибьюторов, азиатским поставщикам и рынку избыточных запасов. Отправьте заявку с партномером — и мы вернёмся с результатом проверки.',
  },
  {
    question: 'Предоставляете ли вы скидки при объёмном заказе?',
    answer: 'Да, для объёмных заказов мы предлагаем прогрессивные скидки: от 5% при заказе от 500 шт. на позицию до 30% при плановой потребности от 10 000 шт. Дополнительно доступна фиксация цены на 6–12 месяцев, буферизация на нашем складе и поэтапная отгрузка по графику производства. Для BOM-комплектации от 50 позиций формируем персональное предложение с учётом совокупного объёма.',
  },
  {
    question: 'Как гарантирована оригинальность компонентов при заказе через КП?',
    answer: 'Все компоненты проходят входной контроль в аккредитованной лаборатории СВП: визуальный осмотр, рентгеноскопия, декэпсуляция (при необходимости), электрические тесты. Мы работаем только с авторизованными дистрибьюторами и проверенными поставщиками с полной прослеживаемостью происхождения каждой партии. По запросу предоставляем сертификаты происхождения и отчёты о входном контроле.',
  },
  {
    question: 'Можно ли согласовать замену компонентов на аналоги в рамках КП?',
    answer: 'Да, подбор аналогов — одна из ключевых услуг в рамках коммерческого предложения. Инженеры ChipNet подбирают аналоги с учётом электрических параметров, типа корпуса, температурного диапазона и условий применения. Результат — сравнительная таблица оригинал/аналог с комментариями по каждому заменяемому компоненту. Окончательное решение о замене остаётся за заказчиком.',
  },
];

const breadcrumbLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Главная', item: BASE_URL },
    { '@type': 'ListItem', position: 2, name: 'Запрос КП', item: `${BASE_URL}/rfq` },
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

export default function RfqPage() {
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
              <span className="text-[#666]">Запрос КП</span>
            </nav>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-primary-dark bg-clip-text text-transparent">
              Запрос КП на электронные компоненты
            </h1>
            <p className="text-lg text-[#666] max-w-3xl mb-4">
              Отправьте заявку на электронные компоненты — подготовим коммерческое предложение за 2 часа.
              Проверяем наличие по глобальным каналам поставки, подбираем аналоги, фиксируем цены и сроки.
            </p>
            <p className="text-base text-[#757575] max-w-3xl">
              Запрос КП — первый шаг к получению нужных компонентов с гарантированным качеством.
              Укажите партномера, количества и требования — мы вернёмся с детализированным предложением,
              учитывающим все технические и логистические особенности вашего заказа.
            </p>
          </div>
        </section>

        {/* RFQ Process Steps */}
        <section className="px-4 pb-20">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">Как работает запрос КП</h2>
            <p className="text-[#666] mb-12 max-w-2xl">
              Процесс обработки заявки — от отправки до поставки. Каждый этап контролируется персональным
              менеджером, вы получаете уведомления о статусе заказа на всех этапах.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {rfqSteps.map((item) => (
                <div
                  key={item.step}
                  className="bg-[#f0f4ee] rounded-2xl border border-[#e8e8e8] p-6 hover:border-primary/30 hover:shadow-lg transition-all group"
                >
                  <div className="flex items-start gap-4">
                    <div className="shrink-0 flex flex-col items-center">
                      <div className="w-12 h-12 rounded-full bg-primary/10 text-primary font-bold text-lg flex items-center justify-center mb-2">
                        {item.step}
                      </div>
                      <span className="text-2xl">{item.icon}</span>
                    </div>
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

        {/* What to Include in RFQ */}
        <section className="px-4 pb-20 bg-section-accent/30">
          <div className="max-w-7xl mx-auto py-20">
            <h2 className="text-3xl font-bold mb-4">Что указать в заявке</h2>
            <p className="text-[#666] mb-12 max-w-2xl">
              Чем подробнее заявка, тем точнее и быстрее коммерческое предложение.
              Укажите ключевые параметры — это снизит количество уточняющих вопросов и сократит сроки обработки.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {rfqRequirements.map((item) => (
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

        {/* RFQ Types */}
        <section className="px-4 pb-20">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">Типы заявок</h2>
            <p className="text-[#666] mb-12 max-w-2xl">
              Мы обрабатываем все типы заявок на электронные компоненты — от разового заказа до комплексной
              BOM-комплектации. Каждая заявка получает подходящий уровень приоритета и ресурсы.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {rfqTypes.map((item) => (
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
              Отправьте заявку на компоненты
            </h2>
            <p className="text-[#666] mb-8 max-w-xl mx-auto">
              Заполните форму с указанием партномеров и требований — подготовим коммерческое
              предложение за 2 часа с проверкой наличия и подбором аналогов.
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

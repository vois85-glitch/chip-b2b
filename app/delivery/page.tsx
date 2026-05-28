import { Metadata } from 'next';
import Link from 'next/link';

const BASE_URL = 'https://www.chip-net.ru';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Доставка и оплата — условия поставки электронных компонентов | ChipNet',
  description: 'Условия доставки и оплаты электронных компонентов. Доставка по всей России (Деловые линии, СДЭК). Безналичный расчёт, частичная оплата, отсрочка платежа для постоянных клиентов.',
  alternates: {
    canonical: `${BASE_URL}/delivery`,
  },
  openGraph: {
    title: 'Доставка и оплата — условия поставки электронных компонентов | ChipNet',
    description: 'Условия доставки и оплаты электронных компонентов. Доставка по всей России. Безналичный расчёт, частичная оплата, отсрочка платежа.',
    url: `${BASE_URL}/delivery`,
    type: 'website',
    locale: 'ru_RU',
    siteName: 'ChipNet',
  },
};

const deliveryMethods = [
  {
    icon: '📦',
    title: 'Отгрузка от 1–2 дней',
    description: 'Отправляем товар в течение 1–2 рабочих дней после оплаты при условии наличия на складе. Для срочных заказов возможна приоритетная обработка и отправка в день оплаты.',
  },
  {
    icon: '🚚',
    title: 'Доставка по всей России',
    description: 'Сотрудничаем с надёжными транспортными компаниями — Деловые линии и СДЭК. Оформление накладных берём на себя. Если у вас есть своя накладная, просто отправьте её нам — организуем отправку по ней.',
  },
  {
    icon: '✈️',
    title: 'Авиадоставка',
    description: 'Для срочных заказов организуем авиадоставку от 6 рабочих дней. Особенно актуально при остановке производства или срочном ремонте оборудования.',
  },
];

const paymentMethods = [
  {
    icon: '💳',
    title: 'Безналичный расчёт',
    description: 'Оплачивайте с НДС или без НДС — выбирайте подходящий вариант. Выставляем счёт на ваши реквизиты в течение нескольких минут после оформления заявки. УПД предоставляем в формате ЭДО.',
  },
  {
    icon: '📊',
    title: 'Частичная оплата',
    description: 'Если товар заказной (поставляется под заказ из-за рубежа), вы можете оплатить его частями. Условия частичной оплаты обсуждаются индивидуально с менеджером в зависимости от объёма и сроков поставки.',
  },
  {
    icon: '⏳',
    title: 'Отсрочка платежа',
    description: 'Для постоянных клиентов доступна отсрочка платежа до 30 дней. Условия отсрочки зависят от истории сотрудничества, объёмов закупок и финансового положения компании. Уточните у менеджера возможность отсрочки.',
  },
  {
    icon: '📋',
    title: 'Платёжное поручение',
    description: 'Для оформления заказа достаточно произвести оплату или предоставить платёжное поручение. Мы оперативно выставим счёт на ваши реквизиты и начнём обработку заказа сразу после подтверждения оплаты.',
  },
];

const faqItems = [
  {
    question: 'Как быстро вы отправляете товар после оплаты?',
    answer: 'Отправка осуществляется в течение 1–2 рабочих дней после поступления оплаты, при условии наличия товара на складе. Для заказных позиций сроки зависят от логистической цепочки и обсуждаются с менеджером при оформлении заказа.',
  },
  {
    question: 'Какие транспортные компании вы используете?',
    answer: 'Мы работаем с надёжными транспортными компаниями — Деловые линии и СДЭК. Это обеспечивает доставку по всей России с отслеживанием груза на каждом этапе. Оформление всех транспортных накладных мы берём на себя. Если у вас есть договорённость с другой ТК, можем отправить по вашей накладной.',
  },
  {
    question: 'Кто оплачивает доставку?',
    answer: 'Доставка транспортной компанией оплачивается покупателем, если иное не согласовано заранее. Для крупных и регулярных заказов возможна бесплатная доставка — условия обсуждаются с менеджером. Стоимость доставки зависит от города, веса и габаритов груза.',
  },
  {
    question: 'Можно ли оплатить заказ с отсрочкой?',
    answer: 'Да, для постоянных клиентов мы предоставляем отсрочку платежа до 30 дней. Условия отсрочки зависят от истории сотрудничества, объёмов закупок и финансового положения компании. Для новых клиентов возможна постоплата после проверки компании. Уточните условия у вашего менеджера.',
  },
  {
    question: 'Выдаёте ли вы УПД и документы для бухгалтерии?',
    answer: 'Да, мы предоставляем полный пакет документов: УПД с НДС (или без НДС), сертификаты происхождения, отчёты о входном контроле, таможенные декларации. Документация оформляется в формате ЭДО. Все документы соответствуют требованиям бухгалтерии, ВПК и государственных заказчиков.',
  },
];

const breadcrumbLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Главная', item: BASE_URL },
    { '@type': 'ListItem', position: 2, name: 'Доставка и оплата', item: `${BASE_URL}/delivery` },
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

export default function DeliveryPage() {
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
              <span className="text-[#666]">Доставка и оплата</span>
            </nav>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-primary-dark bg-clip-text text-transparent">
              Доставка и оплата
            </h1>
            <p className="text-lg text-[#666] max-w-3xl mb-4">
              Получите ваш заказ быстро и удобно! Мы предлагаем гибкие условия доставки и оплаты,
              чтобы работа с ChipNet была максимально комфортной для вашего бизнеса.
            </p>
            <p className="text-base text-[#757575] max-w-3xl">
              Отправляем товар в течение 1–2 рабочих дней после оплаты, при условии его наличия на складе.
              Работаем с надёжными транспортными компаниями, предоставляем полный пакет документов.
            </p>
          </div>
        </section>

        {/* Delivery Section */}
        <section className="px-4 pb-20">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">Доставка</h2>
            <p className="text-[#666] mb-12 max-w-2xl">
              Организуем доставку электронных компонентов по всей России надёжными транспортными компаниями.
              Для срочных заказов — авиадоставка от 6 рабочих дней.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {deliveryMethods.map((method) => (
                <div
                  key={method.title}
                  className="bg-[#f0f4ee] rounded-2xl border border-[#e8e8e8] p-6 hover:border-primary/30 hover:shadow-lg transition-all group"
                >
                  <div className="flex items-start gap-4">
                    <span className="text-3xl shrink-0">{method.icon}</span>
                    <div>
                      <h3 className="text-xl font-semibold mb-3 text-[#121212] group-hover:text-primary transition-colors">
                        {method.title}
                      </h3>
                      <p className="text-[#666] text-sm leading-relaxed">{method.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Important note about delivery */}
            <div className="mt-8 bg-gradient-to-r from-primary/5 to-primary-dark/5 rounded-2xl border border-primary/10 p-6">
              <div className="flex items-start gap-3">
                <span className="text-2xl shrink-0">ℹ️</span>
                <div>
                  <p className="font-semibold text-[#121212] mb-1">Оплата доставки</p>
                  <p className="text-[#666] text-sm leading-relaxed">
                    Доставка транспортной компанией оплачивается покупателем, если иное не согласовано заранее.
                    Для крупных и регулярных заказов возможна бесплатная доставка — уточните условия у менеджера.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Payment Section */}
        <section className="px-4 pb-20 bg-section-accent/30">
          <div className="max-w-7xl mx-auto py-20">
            <h2 className="text-3xl font-bold mb-4">Оплата</h2>
            <p className="text-[#666] mb-12 max-w-2xl">
              Мы предлагаем гибкие условия оплаты, чтобы вам было удобно.
              Для оформления заказа достаточно произвести оплату или предоставить платёжное поручение.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {paymentMethods.map((method) => (
                <div
                  key={method.title}
                  className="bg-gradient-to-br from-primary/5 to-primary-dark/5 rounded-2xl border border-primary/10 p-6 hover:border-primary/30 transition-all"
                >
                  <div className="flex items-start gap-4">
                    <span className="text-3xl shrink-0">{method.icon}</span>
                    <div>
                      <h3 className="text-xl font-semibold mb-3 text-[#121212]">{method.title}</h3>
                      <p className="text-[#666] text-sm leading-relaxed">{method.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Payment process steps */}
            <div className="mt-12 bg-white rounded-2xl border border-[#e8e8e8] p-8">
              <h3 className="text-2xl font-bold mb-6">Как оформить заказ</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                  { step: '1', title: 'Заявка', description: 'Отправьте заявку через форму на сайте, по email или по телефону' },
                  { step: '2', title: 'Счёт', description: 'Мы выставим счёт на ваши реквизиты в течение нескольких минут' },
                  { step: '3', title: 'Оплата', description: 'Произведите оплату или предоставьте платёжное поручение' },
                  { step: '4', title: 'Отправка', description: 'Отгрузим товар в течение 1–2 рабочих дней после подтверждения оплаты' },
                ].map((item) => (
                  <div key={item.step} className="text-center">
                    <div className="w-12 h-12 rounded-full bg-primary/10 text-primary font-bold text-lg flex items-center justify-center mx-auto mb-3">
                      {item.step}
                    </div>
                    <h4 className="font-semibold mb-2 text-[#121212]">{item.title}</h4>
                    <p className="text-[#666] text-sm leading-relaxed">{item.description}</p>
                  </div>
                ))}
              </div>
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
              Сделайте заказ уже сегодня!
            </h2>
            <p className="text-[#666] mb-8 max-w-xl mx-auto">
              Мы позаботимся о быстрой доставке и удобной оплате.
              Отправьте заявку — и мы подготовим коммерческое предложение за 2 часа.
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

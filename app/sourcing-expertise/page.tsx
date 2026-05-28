import { Metadata } from 'next';
import Link from 'next/link';

const BASE_URL = 'https://www.chip-net.ru';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Экспертиза поставок электронных компонентов — ВЭД и логистика | ChipNet',
  description: 'Экспертиза поставок электронных компонентов: прямые дистрибьюторы, азиатские рынки, избыточные запасы. ВЭД, таможенное оформление, санкционное соответствие, реестр Минпромторга, логистика.',
  alternates: {
    canonical: `${BASE_URL}/sourcing-expertise`,
  },
  openGraph: {
    title: 'Экспертиза поставок электронных компонентов — ВЭД и логистика | ChipNet',
    description: 'Экспертиза поставок электронных компонентов: прямые дистрибьюторы, азиатские рынки, ВЭД, таможенное оформление, санкционное соответствие, реестр Минпромторга.',
    url: `${BASE_URL}/sourcing-expertise`,
    type: 'website',
    locale: 'ru_RU',
    siteName: 'ChipNet',
  },
};

const supplyChannels = [
  {
    icon: '🏭',
    title: 'Прямые дистрибьюторы',
    description: 'Работа с авторизованными дистрибьюторами ведущих производителей: STMicroelectronics, Texas Instruments, Infineon, NXP, Microchip, Analog Devices. Прямые контракты обеспечивают прослеживаемость происхождения, оригинальность компонентов и приоритетные сроки поставки. Для постоянных клиентов — резервирование на складе дистрибьютора и фиксация цен на период 3–6 месяцев.',
  },
  {
    icon: '🌏',
    title: 'Азиатские рынки',
    description: 'Прямые поставки от производителей Азиатско-Тихоокеанского региона: Gigadevice (Китай), Gowin Semiconductor (Китай), WCH (Китай), Artery (Китай), Everlight (Тайвань), Richtek (Тайвань), Silergy (Китай). Компоненты доступны без санкционных ограничений, с минимальными сроками доставки и конкурентной стоимостью. Многолетние партнёрства с китайскими и тайваньскими поставщиками.',
  },
  {
    icon: '📦',
    title: 'Избыточные запасы (Excess Inventory)',
    description: 'Закупка неиспользованных компонентов из избыточных запасов производителей оборудования. Компоненты с оригинальной упаковкой и полной прослеживаемостью происхождения. Значительная экономия — до 50–70% от каталогной цены. Каждый компонент проходит входной контроль в лаборатории СВП для подтверждения оригинальности и параметров.',
  },
  {
    icon: '🔗',
    title: 'Авторизованные брокеры',
    description: 'Сотрудничество с верифицированными брокерами, имеющими проверенную репутацию на рынке (членство в ERAI, ISO 9001). Применяется только для дефицитных и снятых с производства компонентов, недоступных через прямые каналы. Все компоненты от брокеров проходят 100% входной контроль с рентгеноскопией и электрическими тестами.',
  },
];

const vedCapabilities = [
  {
    icon: '📋',
    title: 'Таможенное оформление',
    description: 'Полный цикл таможенного оформления импортных электронных компонентов: классификация по ТН ВЭД, расчёт и уплата пошлин и НДС, оформление деклараций на товары (ДТ). Собственный опыт внешнеэкономической деятельности с 2017 года. Оформление всех категорий компонентов, включая компоненты двойного назначения и специального экспортного контроля.',
  },
  {
    icon: '📑',
    title: 'Лицензирование и разрешения',
    description: 'Оформление лицензий на импорт компонентов двойного назначения через Минпромторг РФ и ФСТЭК. Получение сертификатов соответствия, свидетельств о государственной регистрации, заключений ФСБ на криптографическое оборудование. Нормативное сопровождение поставок для оборонного комплекса и государственного заказа.',
  },
  {
    icon: '💸',
    title: 'Валютный контроль',
    description: 'Оформление паспортов сделок, контрактов и спецификаций для валютного контроля. Соблюдение требований валютного законодательства РФ при расчётах с иностранными поставщиками. Банковские переводы в USD, EUR, CNY. Работа с аккредитивами и документарными инкассо для обеспечения безопасности расчётов.',
  },
  {
    icon: '🧾',
    title: 'Налоговый учёт и ЭДО',
    description: 'УПД с НДС или без НДС, счета-фактуры, акты приёмки-передачи. Полная документация для бухгалтерии заказчика в электронном виде (ЭДО). Соответствие требованиям 44-ФЗ и 223-ФЗ для государственных закупок. Все документы оформляются в день отгрузки.',
  },
];

const sanctionsCompliance = [
  {
    icon: '🛡️',
    title: 'Санкционное соответствие',
    description: 'Мониторинг экспортных ограничений США (EAR), ЕС и Японии в отношении поставок электронных компонентов в РФ. Анализ ECCN-кодов и лицензионных исключений для каждой позиции. Выбор легальных каналов поставки, не подпадающих под санкции. Компоненты от китайских, тайваньских и ряда других производителей доступны без ограничений.',
  },
  {
    icon: '🏛️',
    title: 'Реестр Минпромторга',
    description: 'ChipNet включён в реестр организаций Минпромторга РФ, что позволяет поставлять электронные компоненты для нужд оборонно-промышленного комплекса. Статус реестровой организации подтверждает надёжность поставщика и соответствие требованиям к информационной безопасности и прослеживаемости происхождения компонентов.',
  },
  {
    icon: '📜',
    title: 'Документация для ВПК',
    description: 'Полный пакет документов для оборонных контрактов: сертификаты происхождения, отчёты о входном контроле, таможенные декларации, акты приёмки военного представительства. Прослеживаемость каждого компонента от производителя до конечного изделия. Соответствие требованиям ГОСТ РВ и стандартам военной приёмки.',
  },
];

const logisticsOptions = [
  {
    icon: '✈️',
    title: 'Авиадоставка',
    description: 'Срочная доставка авиатранспортом от 6 рабочих дней. Оптимальна для дефицитных и критичных позиций, когда остановка производства обходится дороже стоимости доставки. Прямые рейсы из Шэньчжэня, Гонконга, Шанхая, Тайбэя и Сеула. Таможенное оформление в аэропорту прилёта с минимальным временем хранения на СВХ.',
  },
  {
    icon: '🚢',
    title: 'Морская доставка',
    description: 'Экономичная доставка морем для крупных партий и некритичных сроков. Сроки — 30–45 дней от отправки из порта Азии. Оптимальна для регулярных поставок компонентов с предсказуемым спросом. Значительная экономия на логистике при объёмах от 100 кг. Контейнерные и сборные грузы через порты Дальнего Востока.',
  },
  {
    icon: '🚀',
    title: 'Экспресс-доставка',
    description: 'Срочная доставка курьерскими службами (DHL, FedEx, UPS) от 3 рабочих дней. Для критических ситуаций: остановка производства, аварийный ремонт, прототипирование. Полное отслеживание груза на каждом этапе. Таможенное оформление по ускоренной процедуре. Стоимость выше, но для экстренных ситуаций — оптимальное решение.',
  },
  {
    icon: '🚂',
    title: 'Железнодорожная доставка',
    description: 'Доставка по Транссибирской магистрали для партий из Китая. Сроки — 15–20 дней, стоимость ниже авиа. Оптимально для средних и крупных партий компонентов с умеренной срочностью. Маршруты через Маньчжурию, Забайкальск и Сухэ-Батор. Регулярные отправки с предсказуемым графиком.',
  },
];

const defenseDocs = [
  {
    icon: '📋',
    title: 'Сертификаты происхождения',
    description: 'Certificate of Origin от производителя, подтверждающий страну производства и легальное происхождение компонента. Необходим для таможенного оформления и приёмки военным представительством.',
  },
  {
    icon: '🔐',
    title: 'Экспортные лицензии',
    description: 'Лицензии на экспорт компонентов двойного назначения, оформленные в стране отправления. Соответствие требованиям экспортного контроля страны-производителя и российского законодательства.',
  },
  {
    icon: '📊',
    title: 'Отчёты о входном контроле',
    description: 'Протоколы входного контроля в лаборатории СВП с результатами визуального, электрического и рентгеноскопического контроля. Подтверждение оригинальности и параметров каждой партии.',
  },
  {
    icon: '🏛️',
    title: 'Документы Минпромторга',
    description: 'Заключения и разрешения Минпромторга РФ для компонентов, подлежащих импортозамещению. Включение в реестр российской радиоэлектронной продукции при необходимости.',
  },
];

const faqItems = [
  {
    question: 'Какие каналы поставки вы используете для санкционных компонентов?',
    answer: 'Для санкционных компонентов мы используем легальные каналы поставки через третьи страны, не подпадающие под экспортные ограничения. Компоненты проходят транзитную таможню и оформляются с полным пакетом документов. Однако приоритетной стратегией является замена санкционных компонентов на доступные аналоги от китайских, тайваньских и других производителей. Это обеспечивает стабильность поставок и устраняет риски, связанные с экспортными ограничениями.',
  },
  {
    question: 'Как оформить заказ на компоненты для оборонного контракта?',
    answer: 'Для оборонных контрактов необходимо предоставить спецификацию (BOM) с указанием партномеров, требуемого температурного диапазона и приёмки. ChipNet проверит наличие компонентов, подберёт аналоги при необходимости и подготовит коммерческое предложение с указанием сроков поставки и стоимости. Дополнительно оформляются сертификаты происхождения, отчёты о входном контроле и документы для военного представительства. Как реестровая организация Минпромторга, мы обеспечиваем полное нормативное сопровождение.',
  },
  {
    question: 'Какова минимальная партия для заказа?',
    answer: 'Минимальная партия зависит от типа компонента и канала поставки. Для компонентов в наличии на нашем складе — от 1 штуки. Для заказных позиций от дистрибьютора — от 1 тубы/ленты (обычно 250–3000 штук для SMD-компонентов). Для изготовления на заводе — минимальный объём производства (MOQ), который варьируется от 1000 до 100 000 штук в зависимости от типа компонента. Для небольших партий возможно объединение заказов нескольких клиентов.',
  },
  {
    question: 'Как вы обеспечиваете прослеживаемость компонентов?',
    answer: 'Прослеживаемость обеспечивается на каждом этапе цепочки поставки: от производителя через дистрибьютора и таможню до нашего склада и заказчика. Каждая партия сопровождается упаковочными листами с указанием лот-номера, дата-кода и страны производства. При входном контроле результаты привязываются к конкретной партии и сохраняются в электронном архиве. По запросу заказчика предоставляется полная цепочка поставки с документами на каждом этапе.',
  },
  {
    question: 'Работаете ли вы с контрактами по 44-ФЗ и 223-ФЗ?',
    answer: 'Да, ChipNet имеет опыт работы с государственными закупками по 44-ФЗ и 223-ФЗ. Мы предоставляем полный пакет документов, необходимый для участия в тендерах и исполнения контрактов: УПД с НДС, сертификаты происхождения, отчёты о входном контроле, таможенные декларации. Документация оформляется в соответствии с требованиями бухгалтерии государственных заказчиков. Для регулярных поставок по госконтрактам доступны специальные условия по цене и срокам.',
  },
];

const breadcrumbLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Главная', item: BASE_URL },
    { '@type': 'ListItem', position: 2, name: 'Экспертиза поставок', item: `${BASE_URL}/sourcing-expertise` },
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

export default function SourcingExpertisePage() {
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
              <span className="text-[#666]">Экспертиза поставок</span>
            </nav>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-primary-dark bg-clip-text text-transparent">
              Экспертиза поставок электронных компонентов
            </h1>
            <p className="text-lg text-[#666] max-w-3xl mb-4">
              Комплексная экспертиза поставок электронных компонентов: от поиска и закупки до таможенного
              оформления и доставки. ВЭД, санкционное соответствие, реестр Минпромторга, логистика
              всех типов для обеспечения бесперебойных поставок.
            </p>
            <p className="text-base text-[#757575] max-w-3xl">
              ChipNet располагает многолетним опытом внешнеэкономической деятельности и выстроенной
              инфраструктурой поставок электронных компонентов в условиях санкций и дефицита.
            </p>
          </div>
        </section>

        {/* Supply Chain Expertise */}
        <section className="px-4 pb-20">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">Каналы поставок</h2>
            <p className="text-[#666] mb-12 max-w-2xl">
              Разветвлённая сеть поставщиков и каналов закупки позволяет находить оптимальное решение
              для каждой позиции спецификации — от прямых дистрибьюторов до избыточных запасов.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {supplyChannels.map((channel) => (
                <div
                  key={channel.title}
                  className="bg-[#f0f4ee] rounded-2xl border border-[#e8e8e8] p-6 hover:border-primary/30 hover:shadow-lg transition-all group"
                >
                  <div className="flex items-start gap-4">
                    <span className="text-3xl shrink-0">{channel.icon}</span>
                    <div>
                      <h3 className="text-xl font-semibold mb-3 text-[#121212] group-hover:text-primary transition-colors">
                        {channel.title}
                      </h3>
                      <p className="text-[#666] text-sm leading-relaxed">{channel.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* VED and Customs */}
        <section className="px-4 pb-20 bg-section-accent/30">
          <div className="max-w-7xl mx-auto py-20">
            <h2 className="text-3xl font-bold mb-4">ВЭД и таможенное оформление</h2>
            <p className="text-[#666] mb-12 max-w-2xl">
              Полный цикл внешнеэкономической деятельности: от заключения контракта с иностранным поставщиком
              до оформления УПД заказчику. Таможенное оформление, валютный контроль, лицензирование.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {vedCapabilities.map((cap) => (
                <div
                  key={cap.title}
                  className="bg-gradient-to-br from-primary/5 to-primary-dark/5 rounded-2xl border border-primary/10 p-6 hover:border-primary/30 transition-all"
                >
                  <div className="flex items-start gap-4">
                    <span className="text-3xl shrink-0">{cap.icon}</span>
                    <div>
                      <h3 className="text-xl font-semibold mb-3 text-[#121212]">{cap.title}</h3>
                      <p className="text-[#666] text-sm leading-relaxed">{cap.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Sanctions Compliance and Minpromtorg */}
        <section className="px-4 pb-20">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">Санкционное соответствие и Минпромторг</h2>
            <p className="text-[#666] mb-12 max-w-2xl">
              Мониторинг экспортных ограничений, выбор легальных каналов поставки и полное нормативное
              сопровождение для оборонных и государственных контрактов.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sanctionsCompliance.map((item) => (
                <div
                  key={item.title}
                  className="bg-[#f0f4ee] rounded-2xl border border-[#e8e8e8] p-6 hover:border-primary/30 hover:shadow-lg transition-all group"
                >
                  <div className="flex items-start gap-4">
                    <span className="text-3xl shrink-0">{item.icon}</span>
                    <div>
                      <h3 className="text-lg font-semibold mb-3 text-[#121212] group-hover:text-primary transition-colors">
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

        {/* Defense and Government Documentation */}
        <section className="px-4 pb-20 bg-section-accent/30">
          <div className="max-w-7xl mx-auto py-20">
            <h2 className="text-3xl font-bold mb-4">Документация для оборонных и государственных контрактов</h2>
            <p className="text-[#666] mb-12 max-w-2xl">
              Полный комплект документов, необходимый для поставок электронных компонентов
              в рамках оборонных заказов и государственных контрактов по 44-ФЗ и 223-ФЗ.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {defenseDocs.map((doc) => (
                <div
                  key={doc.title}
                  className="bg-white rounded-2xl border border-[#e8e8e8] p-6 hover:border-primary/30 hover:shadow-lg transition-all group"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-2xl">{doc.icon}</span>
                    <h3 className="text-lg font-semibold text-[#121212] group-hover:text-primary transition-colors">
                      {doc.title}
                    </h3>
                  </div>
                  <p className="text-[#666] text-sm leading-relaxed">{doc.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Logistics */}
        <section className="px-4 pb-20">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">Логистика поставок</h2>
            <p className="text-[#666] mb-12 max-w-2xl">
              Различные варианты доставки для оптимального баланса скорости и стоимости —
              от срочной авиадоставки до экономичной морской перевозки.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {logisticsOptions.map((option) => (
                <div
                  key={option.title}
                  className="bg-[#f0f4ee] rounded-2xl border border-[#e8e8e8] p-6 hover:border-primary/30 hover:shadow-lg transition-all group"
                >
                  <div className="flex items-start gap-4">
                    <span className="text-3xl shrink-0">{option.icon}</span>
                    <div>
                      <h3 className="text-xl font-semibold mb-3 text-[#121212] group-hover:text-primary transition-colors">
                        {option.title}
                      </h3>
                      <p className="text-[#666] text-sm leading-relaxed">{option.description}</p>
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
              Нужна экспертиза поставок компонентов?
            </h2>
            <p className="text-[#666] mb-8 max-w-xl mx-auto">
              Отправьте спецификацию — проанализируем BOM, проверим наличие, подберём аналоги
              и подготовим коммерческое предложение с учётом всех требований по ВЭД и логистике.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/#bom"
                className="inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark text-[#121212] font-medium px-8 py-3 rounded-lg transition-colors"
              >
                Отправить BOM
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

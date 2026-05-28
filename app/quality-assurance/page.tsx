import { Metadata } from 'next';
import Link from 'next/link';

const BASE_URL = 'https://www.chip-net.ru';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Контроль качества электронных компонентов — СВП лаборатория | ChipNet',
  description: 'Входной контроль качества электронных компонентов: рентген, электрические тесты, визуальный контроль, механические и климатические испытания. Аккредитованная лаборатория СВП. GOST, MIL-STD, IEC.',
  alternates: {
    canonical: `${BASE_URL}/quality-assurance`,
  },
  openGraph: {
    title: 'Контроль качества электронных компонентов — СВП лаборатория | ChipNet',
    description: 'Входной контроль качества электронных компонентов: рентген, электрические тесты, визуальный контроль. Аккредитованная лаборатория СВП. GOST, MIL-STD, IEC.',
    url: `${BASE_URL}/quality-assurance`,
    type: 'website',
    locale: 'ru_RU',
    siteName: 'ChipNet',
  },
};

const qaProcessSteps = [
  {
    icon: '📥',
    title: 'Входная приёмка',
    description: 'Приёмка компонентов на склад с проверкой сопроводительной документации: упаковочные листы, сертификаты происхождения (Certificate of Origin), дата-коды, лот-номера. Сверка фактически полученного количества и номенклатуры с заказом. Визуальная оценка состояния тары и упаковки на наличие повреждений, следов вскрытия и несоответствий.',
  },
  {
    icon: '🔍',
    title: 'Визуальный контроль',
    description: 'Инспекция внешнего вида каждого компонента: маркировка, корпус, выводы. Проверка соответствия шрифтов, логотипов и дата-кодов спецификации производителя. Выявление следов перемаркировки, повторной пайки, механических повреждений. Фиксация результатов фотографированием каждого проверенного компонента.',
  },
  {
    icon: '⚡',
    title: 'Электрические тесты',
    description: 'Измерение электрических параметров компонентов и сравнение с datasheet: статические и динамические характеристики, токи утечки, напряжения пробоя, ёмкости, сопротивления. Функциональное тестирование цифровой и аналоговой периферии. Выявление компонентов с параметрами, выходящими за пределы спецификации.',
  },
  {
    icon: '📊',
    title: 'Документирование',
    description: 'Оформление отчёта о входном контроле с результатами всех испытаний, фотографиями и заключением о соответствии. Формирование акта приёмки, протоколов испытаний и сертификата качества. Вся документация предоставляется заказчику вместе с партией. Хранение результатов в электронном архиве для прослеживаемости.',
  },
  {
    icon: '🏷️',
    title: 'Маркировка и отгрузка',
    description: 'Нанесение идентификационных меток на прошедшие контроль компоненты: штрих-коды, QR-коды с информацией о дате контроля, номере партии и результатах испытаний. Формирование отгрузочных комплектов с полной документацией. Прослеживаемость каждой позиции от закупки до поставки заказчику.',
  },
];

const testingMethods = [
  {
    icon: '🩻',
    title: 'Рентгеноскопия (X-Ray)',
    description: 'Неразрушающий контроль внутренней структуры компонентов. Выявление дефектов кристалла, обрывов bond wires, пустот в компаунде, инородных включений. Сравнение с эталонными снимками оригинальных компонентов. Разрешение до 1 мкм позволяет обнаружить микродефекты, невидимые при внешнем осмотре. Метод особенно эффективен для выявления восстановленных (recycled) и пересобранных компонентов.',
  },
  {
    icon: '⚡',
    title: 'Электрическое тестирование',
    description: 'Комплексное измерение электрических параметров: постоянное и переменное напряжение, токи потребления и утечки, входные/выходные характеристики, частотные параметры. Для микроконтроллеров — функциональный тест периферии (UART, SPI, I2C, ADC, DAC, GPIO). Для аналоговых компонентов — измерение ОУ, компараторов, источников опорного напряжения. Для силовых — Rds(on), Vgs(th), Id, время переключения.',
  },
  {
    icon: '👁️',
    title: 'Визуальный контроль',
    description: 'Многоуровневая инспекция внешнего вида: маркировка, корпус, выводы, покрытие. Проверка шрифтов и логотипов на соответствие спецификации производителя. Выявление перемаркировки, повторной пайки, деформаций корпуса, коррозии выводов. Использование стереомикроскопов с увеличением до 200× для детального исследования. Сохранение фотографий каждого проверенного компонента в электронном архиве.',
  },
  {
    icon: '🔧',
    title: 'Механические испытания',
    description: 'Проверка механических параметров компонентов: усилие выводов на изгиб, устойчивость к вибрации и ударным нагрузкам (для компонентов военной приёмки). Контроль геометрических размеров корпуса и шага выводов. Проверка качества паяемого покрытия выводов. Методы стандартизированы по MIL-STD-883 и GOST для компонентов ответственного назначения.',
  },
  {
    icon: '🌡️',
    title: 'Климатические испытания',
    description: 'Термоциклирование и проверка работоспособности в расширенном температурном диапазоне. Для промышленных компонентов: -40…+85°C, для автомобильных: -40…+125°C, для военных: -55…+125°C. Испытания на влагостойкость, стойкость к соляному туману и атмосферному давлению. Выявление компонентов с перемаркированным температурным диапазоном (коммерческий под промышленный).',
  },
];

const accreditation = [
  {
    icon: '🏛️',
    title: 'Аккредитация лаборатории',
    description: 'Лаборатория входного контроля ChipNet аккредитована в системе ГОСТ Р для проведения испытаний электронных компонентов. Область аккредитации охватывает активные и пассивные компоненты, электромеханические изделия и соединители. Аккредитация подтверждается регулярными аудитами и межлабораторными сравнительными испытаниями.',
  },
  {
    icon: '📐',
    title: 'Метрологическое обеспечение',
    description: 'Средства измерений проходят регулярную поверку и калибровку в аккредитованных метрологических службах. Вся измерительная аппаратура имеет действующие свидетельства о поверке. Неопределённость измерений учитывается при оценке соответствия параметров спецификации производителя.',
  },
  {
    icon: '👨‍🔬',
    title: 'Квалификация персонала',
    description: 'Инженеры лаборатории имеют высшее техническое образование и регулярно проходят повышение квалификации по методам входного контроля и выявления контрафакта. Аттестация персонала проводится не реже одного раза в год. Каждый специалист сертифицирован по стандартам работы с электронными компонентами.',
  },
];

const standards = [
  {
    icon: '🇷🇺',
    title: 'ГОСТ Р',
    description: 'Компоненты проверяются на соответствие требованиям ГОСТ Р для электронных компонентов: ГОСТ Р 57350, ГОСТ Р МЭК 60721 и другим стандартам. Вся документация оформляется в соответствии с требованиями российской системы стандартизации. Для компонентов оборонного назначения — соответствие требованиям военной приёмки.',
  },
  {
    icon: '🇺🇸',
    title: 'MIL-STD',
    description: 'Для компонентов военной приёмки и ответственного назначения применяется стандарт MIL-STD-883 (микросхемы), MIL-STD-202 (пассивные компоненты), MIL-STD-750 (полупроводниковые приборы). Методы испытаний, уровни приёмки и критерии соответствия — по спецификациям военных стандартов США.',
  },
  {
    icon: '🌍',
    title: 'IEC / ISO',
    description: 'Международные стандарты IEC 60747 (полупроводниковые приборы), IEC 60384 (конденсаторы), IEC 60115 (резисторы), ISO 9001 (система менеджмента качества). Соответствие международным стандартам обеспечивает признание результатов контроля заказчиками из разных стран и отраслей.',
  },
  {
    icon: '📋',
    title: 'SAE AS6171 / IDEA-1010',
    description: 'Стандарт SAE AS6171 определяет методы выявления контрафактных электронных компонентов, включая уровни тестирования и критерии приёмки. IDEA-1010 — стандарт по визуальному контролю для выявления подозрительных компонентов. ChipNet применяет оба стандарта при входном контроле для максимальной вероятности выявления контрафакта.',
  },
];

const documentation = [
  {
    icon: '📄',
    title: 'Отчёт о входном контроле',
    description: 'Полный протокол с результатами визуального контроля, электрических измерений, рентгеновских снимков и заключением о соответствии. Включает фотографии каждого проверенного компонента, таблицы измеренных параметров и сравнение с datasheet.',
  },
  {
    icon: '🔐',
    title: 'Сертификат происхождения',
    description: 'Certificate of Origin от производителя или авторизованного дистрибьютора, подтверждающий легальное происхождение компонента. Для компонентов двойного назначения — экспортные лицензии и разрешения.',
  },
  {
    icon: '📦',
    title: 'Таможенная декларация',
    description: 'Полная таможенная документация: декларация на товары, сертификаты соответствия, документы об уплате пошлин. Прослеживаемость импортных компонентов от таможни до заказчика.',
  },
  {
    icon: '📊',
    title: 'УПД и бухгалтерские документы',
    description: 'Универсальный передаточный документ с НДС (или без НДС), счета-фактуры, акты приёмки-передачи. Документация в формате ЭДО для быстрого обмена с бухгалтерией заказчика.',
  },
];

const faqItems = [
  {
    question: 'Что такое лаборатория СВП и зачем она нужна?',
    answer: 'СВП (Сертифицированный Входной Приёмник) — это аккредитованная лаборатория входного контроля электронных компонентов. Лаборатория проводит проверку каждой партии компонентов на соответствие спецификации производителя, выявление контрафакта и подтверждение оригинальности. Входной контроль особенно критичен при закупке через неавторизованные каналы, в условиях санкций и дефицита, а также для компонентов ответственного назначения — оборонный комплекс, аэрокосмос, медицина.',
  },
  {
    question: 'Какие компоненты подлежат обязательному входному контролю?',
    answer: 'Обязательному входному контролю подлежат все компоненты, закупаемые через неавторизованные каналы поставки, компоненты для оборонного комплекса и критической инфраструктуры, компоненты снятые с производства (obsolete), а также компоненты от производителей, наиболее подверженных контрафакту — микроконтроллеры, FPGA, аналоговые микросхемы, силовые полупроводники. Для серийного производства рекомендуется 100% входной контроль всех компонентов.',
  },
  {
    question: 'Сколько стоит входной контроль компонентов?',
    answer: 'Стоимость входного контроля зависит от типа компонента, объёма партии и набора испытаний. Базовый визуальный контроль — от 50 руб./шт. Электрические тесты — от 150 руб./шт. Рентгеноскопия — от 300 руб./шт. Декапсуляция — от 5000 руб./шт. (выборочно 2–5 шт.). Полный цикл контроля для партии 100 штук микроконтроллеров — от 25 000 руб. Для постоянных клиентов действуют специальные условия.',
  },
  {
    question: 'Соответствуете ли вы требованиям Минпромторга?',
    answer: 'Да, ChipNet включён в реестр организаций Минпромторга РФ и соответствует требованиям к поставщикам электронных компонентов для нужд оборонно-промышленного комплекса. Мы предоставляем полный пакет документации для государственных и оборонных контрактов: сертификаты происхождения, отчёты о входном контроле, таможенные декларации, документы ЭДО. Лаборатория работает по стандартам, утверждённым для поставок в ОПК.',
  },
  {
    question: 'Какова процедура приёмки компонентов для серийного производства?',
    answer: 'Для серийного производства разработана регламентированная процедура: 1) входная приёмка с проверкой документации; 2) 100% визуальный контроль всех компонентов; 3) электрические тесты выборочно или 100% в зависимости от критичности; 4) рентгеноскопия выборочно; 5) оформление полного пакета документов с прослеживаемостью. Программа контроля согласовывается с заказчиком и фиксируется в нормативной документации на изделие.',
  },
];

const breadcrumbLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Главная', item: BASE_URL },
    { '@type': 'ListItem', position: 2, name: 'Контроль качества', item: `${BASE_URL}/quality-assurance` },
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

export default function QualityAssurancePage() {
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
              <span className="text-[#666]">Контроль качества</span>
            </nav>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-primary-dark bg-clip-text text-transparent">
              Входной контроль качества электронных компонентов
            </h1>
            <p className="text-lg text-[#666] max-w-3xl mb-4">
              Аккредитованная лаборатория СВП для проверки оригинальности и параметров электронных компонентов.
              Полный цикл входного контроля: от визуальной инспекции до электрических тестов и рентгеноскопии.
            </p>
            <p className="text-base text-[#757575] max-w-3xl">
              Каждый компонент, поставляемый ChipNet, проходит входной контроль с оформлением полного пакета
              документации. Соответствие стандартам GOST, MIL-STD, IEC — гарантия качества для ответственных применений.
            </p>
          </div>
        </section>

        {/* QA Process */}
        <section className="px-4 pb-20">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">Процесс контроля качества</h2>
            <p className="text-[#666] mb-8 max-w-2xl">
              Регламентированная процедура входного контроля от приёмки на склад до отгрузки заказчику.
              Каждый этап документируется для обеспечения полной прослеживаемости.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {qaProcessSteps.map((step, index) => (
                <div
                  key={step.title}
                  className="bg-[#f0f4ee] rounded-2xl border border-[#e8e8e8] p-6 hover:border-primary/30 hover:shadow-lg transition-all group"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary/10 text-primary font-bold text-lg flex items-center justify-center shrink-0">
                      {index + 1}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-2xl">{step.icon}</span>
                        <h3 className="text-lg font-semibold text-[#121212] group-hover:text-primary transition-colors">
                          {step.title}
                        </h3>
                      </div>
                      <p className="text-[#666] text-sm leading-relaxed">{step.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SVP Laboratory Accreditation */}
        <section className="px-4 pb-20 bg-section-accent/30">
          <div className="max-w-7xl mx-auto py-20">
            <h2 className="text-3xl font-bold mb-4">Аккредитация лаборатории СВП</h2>
            <p className="text-[#666] mb-12 max-w-2xl">
              Лаборатория ChipNet аккредитована и оснащена для проведения полного цикла входного контроля
              электронных компонентов. Метрологическое обеспечение и квалификация персонала — гарантия
              достоверности результатов.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {accreditation.map((item) => (
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

        {/* Testing Methods */}
        <section className="px-4 pb-20">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">Методы испытаний</h2>
            <p className="text-[#666] mb-8 max-w-2xl">
              Комплекс методов неразрушающего и разрушающего контроля для выявления контрафакта,
              подтверждения оригинальности и проверки параметров электронных компонентов.
            </p>
            <div className="space-y-6">
              {testingMethods.map((method) => (
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
          </div>
        </section>

        {/* Documentation and Traceability */}
        <section className="px-4 pb-20 bg-section-accent/30">
          <div className="max-w-7xl mx-auto py-20">
            <h2 className="text-3xl font-bold mb-4">Документация и прослеживаемость</h2>
            <p className="text-[#666] mb-12 max-w-2xl">
              Полный пакет документации для каждого поставляемого компонента — от отчёта о входном контроле
              до таможенной декларации. Прослеживаемость от закупки до поставки заказчику.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {documentation.map((doc) => (
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

        {/* Quality Standards */}
        <section className="px-4 pb-20">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">Соответствие стандартам качества</h2>
            <p className="text-[#666] mb-12 max-w-2xl">
              Контроль качества ChipNet основан на международных и национальных стандартах,
              обеспечивающих признание результатов заказчиками из любых отраслей.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {standards.map((std) => (
                <div
                  key={std.title}
                  className="bg-[#f0f4ee] rounded-2xl border border-[#e8e8e8] p-6 hover:border-primary/30 hover:shadow-lg transition-all group"
                >
                  <div className="flex items-start gap-4">
                    <span className="text-3xl shrink-0">{std.icon}</span>
                    <div>
                      <h3 className="text-xl font-semibold mb-3 text-[#121212] group-hover:text-primary transition-colors">
                        {std.title}
                      </h3>
                      <p className="text-[#666] text-sm leading-relaxed">{std.description}</p>
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
              Нужен входной контроль компонентов?
            </h2>
            <p className="text-[#666] mb-8 max-w-xl mx-auto">
              Отправьте заявку — проведём входной контроль в аккредитованной лаборатории СВП,
              подтвердим оригинальность и параметры, оформим полный пакет документации.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/#bom"
                className="inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark text-[#121212] font-medium px-8 py-3 rounded-lg transition-colors"
              >
                Запросить контроль
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
              </Link>
              <Link
                href="/anti-counterfeit"
                className="inline-flex items-center justify-center gap-2 border border-primary text-primary hover:bg-primary/5 font-medium px-8 py-3 rounded-lg transition-colors"
              >
                Защита от контрафакта
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

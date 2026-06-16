'use client';

import { motion } from 'framer-motion';

interface CommercialTrustProps {
  pageType?: 'homepage' | 'brand' | 'component';
  brandName?: string;
}

export default function CommercialTrustBlock({ pageType = 'homepage', brandName }: CommercialTrustProps) {
  const companyInfo = {
    legalName: 'ООО «Деловой Партнёр»',
    brand: 'ChipNet',
    inn: '3123341983',
    address: '308033, Белгородская обл., г. Белгород, ул. Шаландина, д. 4, к. 3, оф. 8',
    phone: '+7-910-321-91-91',
    email: 'info@chip-net.ru',
    foundedYear: '2018',
    registration: 'ЕГРЮЛ',
    accreditation: 'Аккредитованная лаборатория СВП',
  };

  const slaMetrics = [
    { label: 'Средний ответ на RFQ', value: '2 часа', detail: 'в рабочее время (09:00–18:00 МСК)', icon: '⏱' },
    { label: 'Коммерческое предложение', value: 'от 2 часов', detail: 'для стандартных позиций', icon: '📋' },
    { label: 'Поставка ЕС-канал', value: '6–14 дней', detail: 'авиа / авто из ЕС складов', icon: '✈' },
    { label: 'Поставка Азия-канал', value: '12–20 дней', detail: 'прямой канал из Азии', icon: '🚢' },
    { label: 'Срочная поставка', value: 'от 3 дней', detail: 'приоритетная обработка + авиа', icon: '⚡' },
    { label: 'Входной контроль', value: '1–3 дня', detail: 'X-ray + декэпсуляция + электротесты', icon: '🔍' },
  ];

  const deliveryGeography = [
    { region: 'Центральный ФО', cities: 'Москва, Тула, Ярославль, Владимир', coverage: '98%', time: '3–5 дней' },
    { region: 'Северо-Западный ФО', cities: 'С.-Петербург, Калининград, Мурманск', coverage: '96%', time: '4–6 дней' },
    { region: 'Приволжский ФО', cities: 'Казань, Н. Новгород, Самара, Уфа', coverage: '95%', time: '4–7 дней' },
    { region: 'Уральский ФО', cities: 'Екатеринбург, Челябинск, Тюмень', coverage: '94%', time: '5–8 дней' },
    { region: 'Сибирский ФО', cities: 'Новосибирск, Томск, Красноярск', coverage: '92%', time: '6–10 дней' },
    { region: 'Южный ФО', cities: 'Краснодар, Ростов-на-Дону, Волгоград', coverage: '95%', time: '4–7 дней' },
  ];

  const industriesServed = [
    { name: 'Промышленная автоматика', icon: '🏭', details: 'ПЛК, частотные приводы, системы ЧПУ, промышленные контроллеры' },
    { name: 'Телекоммуникации', icon: '📡', details: 'RF-модули, базовые станции, сетевое оборудование, оптоволоконные системы' },
    { name: 'Энергетика', icon: '⚡', details: 'Системы управления, инверторы, контроллеры заряда, силовая электроника' },
    { name: 'Automotive', icon: '🚗', details: 'AURIX MCU, CAN/LIN трансиверы, датчики, силовые драйверы' },
    { name: 'Медицинское оборудование', icon: '🏥', details: 'Precision ADC/DAC, малошумящие LDO, изоляция, датчики' },
    { name: 'Оборона и спецтехника', icon: '🛡', details: 'FPGA для обработки сигналов, радиационно-стойкие компоненты,军工-grade' },
    { name: 'Потребительская электроника', icon: '📱', details: 'IoT MCU, беспроводные модули, зарядные контроллеры, аудио-кодеки' },
    { name: 'Контрактное производство', icon: '🔧', details: 'BOM-комплектация серийных партий, DFM-анализ, подбор аналогов' },
  ];

  return (
    <section className="py-12 px-4 bg-[#f8faf7]" data-section="commercial-trust">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 1, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="flex items-center gap-2 mb-2">
            <svg className="w-5 h-5 text-[#02a391]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <h2 className="text-xl md:text-2xl font-bold text-[#121212]">Коммерческая надёжность и SLA</h2>
          </div>
          <p className="text-[#666] text-sm max-w-3xl">
            {pageType === 'brand'
              ? `Поставки компонентов ${brandName || ''} с гарантией оригинальности, контролем качества и прогнозируемыми сроками.`
              : 'Поставка оригинальных электронных компонентов с полным циклом верификации, прогнозируемыми сроками и гарантией качества.'
            }
          </p>
        </motion.div>

        {/* Company Legitimacy Card */}
        <motion.div
          initial={{ opacity: 1, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="bg-white border border-[#02a391]/15 rounded-2xl p-6 mb-6"
        >
          <div className="flex items-start gap-4 mb-4">
            <div className="shrink-0 w-12 h-12 bg-[#02a391]/10 rounded-xl flex items-center justify-center text-[#02a391]">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-base font-bold text-[#121212] mb-1">{companyInfo.legalName} (ChipNet)</h3>
              <p className="text-xs text-[#666]">Поставка электронных компонентов с {companyInfo.foundedYear} года. Аккредитация СВП, полный цикл входного контроля.</p>
            </div>
            <div className="hidden md:flex items-center gap-2">
              <span className="px-3 py-1.5 bg-emerald-50 border border-emerald-200 rounded-lg text-xs font-semibold text-emerald-700">
                {companyInfo.accreditation}
              </span>
              <span className="px-3 py-1.5 bg-[#02a391]/5 border border-[#02a391]/15 rounded-lg text-xs font-semibold text-[#02a391]">
                {companyInfo.registration}
              </span>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
            <div className="bg-[#f8faf7] rounded-lg px-3 py-2">
              <div className="text-[#757575] mb-0.5">ИНН</div>
              <div className="font-semibold text-[#121212]">{companyInfo.inn}</div>
            </div>
            <div className="bg-[#f8faf7] rounded-lg px-3 py-2">
              <div className="text-[#757575] mb-0.5">Телефон</div>
              <div className="font-semibold text-[#121212]">{companyInfo.phone}</div>
            </div>
            <div className="bg-[#f8faf7] rounded-lg px-3 py-2">
              <div className="text-[#757575] mb-0.5">Email</div>
              <div className="font-semibold text-[#02a391]">{companyInfo.email}</div>
            </div>
            <div className="bg-[#f8faf7] rounded-lg px-3 py-2">
              <div className="text-[#757575] mb-0.5">На рынке с</div>
              <div className="font-semibold text-[#121212]">{companyInfo.foundedYear} года</div>
            </div>
          </div>
        </motion.div>

        {/* SLA Metrics */}
        <motion.div
          initial={{ opacity: 1, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-6"
        >
          {slaMetrics.map((metric, idx) => (
            <div key={metric.label} className="bg-white border border-[#e8e8e8] rounded-xl p-4 hover:border-[#02a391]/30 transition-colors">
              <div className="text-lg mb-1">{metric.icon}</div>
              <div className="text-xs text-[#757575] mb-1">{metric.label}</div>
              <div className="text-base font-bold text-[#02a391] mb-1">{metric.value}</div>
              <div className="text-[10px] text-[#999]">{metric.detail}</div>
            </div>
          ))}
        </motion.div>

        {/* Two columns: Delivery Geography + Industries */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Delivery Geography */}
          <motion.div
            initial={{ opacity: 1, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="bg-white border border-[#e8e8e8] rounded-2xl overflow-hidden"
          >
            <div className="bg-[#02a391]/5 border-b border-[#02a391]/10 px-5 py-3 flex items-center gap-2">
              <svg className="w-4 h-4 text-[#02a391]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <h3 className="text-sm font-bold text-[#121212]">География поставок</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-[#e8e8e8]">
                    <th className="text-left py-2.5 px-4 text-[#666] font-medium">Регион</th>
                    <th className="text-left py-2.5 px-4 text-[#666] font-medium">Города</th>
                    <th className="text-left py-2.5 px-4 text-[#666] font-medium">Срок</th>
                    <th className="text-left py-2.5 px-4 text-[#666] font-medium">Охват</th>
                  </tr>
                </thead>
                <tbody>
                  {deliveryGeography.map((row) => (
                    <tr key={row.region} className="border-b border-[#f0f0f0] hover:bg-[#f8faf7] transition-colors">
                      <td className="py-2.5 px-4 font-medium text-[#121212]">{row.region}</td>
                      <td className="py-2.5 px-4 text-[#555]">{row.cities}</td>
                      <td className="py-2.5 px-4">
                        <span className="px-2 py-0.5 bg-[#02a391]/5 text-[#02a391] rounded text-[10px] font-semibold">{row.time}</span>
                      </td>
                      <td className="py-2.5 px-4">
                        <div className="flex items-center gap-2">
                          <div className="w-12 h-1.5 bg-[#e8e8e8] rounded-full overflow-hidden">
                            <div className="h-full bg-[#02a391] rounded-full" style={{ width: row.coverage }} />
                          </div>
                          <span className="text-[10px] text-[#555]">{row.coverage}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="px-4 py-2.5 bg-[#f8faf7] border-t border-[#e8e8e8] text-[10px] text-[#757575]">
              Склад входного контроля: г. Белгород. Логистические маршруты: авиа (5–7 дней), авто (4–6 дней), ж/д (7–12 дней).
            </div>
          </motion.div>

          {/* Industries Served */}
          <motion.div
            initial={{ opacity: 1, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="bg-white border border-[#e8e8e8] rounded-2xl overflow-hidden"
          >
            <div className="bg-[#02a391]/5 border-b border-[#02a391]/10 px-5 py-3 flex items-center gap-2">
              <svg className="w-4 h-4 text-[#02a391]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <h3 className="text-sm font-bold text-[#121212]">Отрасли-заказчики</h3>
            </div>
            <div className="grid grid-cols-2 gap-px bg-[#e8e8e8]">
              {industriesServed.map((industry) => (
                <div key={industry.name} className="bg-white px-4 py-3 hover:bg-[#f8faf7] transition-colors">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm">{industry.icon}</span>
                    <span className="text-xs font-semibold text-[#121212]">{industry.name}</span>
                  </div>
                  <p className="text-[10px] text-[#666] leading-relaxed">{industry.details}</p>
                </div>
              ))}
            </div>
            <div className="px-4 py-2.5 bg-[#f8faf7] border-t border-[#e8e8e8] text-[10px] text-[#757575]">
              Более 340 компаний из 58 регионов России — активные клиенты ChipNet.
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

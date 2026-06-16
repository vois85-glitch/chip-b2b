'use client';

import { motion } from 'framer-motion';

const workflowSteps = [
  {
    id: 1,
    title: 'Supplier Verification',
    subtitle: 'Верификация поставщика',
    steps: [
      'Проверка авторизованного дистрибьюторского статуса',
      'Аудит складских мощностей и цепочки хранения',
      'Верификация сертификатов происхождения (COO)',
      'Проверка истории поставок и отзывов',
    ],
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
  },
  {
    id: 2,
    title: 'Incoming Inspection',
    subtitle: 'Входной контроль',
    steps: [
      'Визуальный осмотр упаковки и маркировки',
      'Рентгеновский контроль (X-ray) кристалла и связок',
      'Декэпсуляция и проверка die-маркировки',
      'Электрическое тестирование параметров',
    ],
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    ),
  },
  {
    id: 3,
    title: 'Anti-Counterfeit',
    subtitle: 'Защита от контрафакта',
    steps: [
      'Сравнение date code с базой производителя',
      'Проверка серийных номеров и lot-трассировки',
      'Анализ физических характеристик корпуса',
      'Тестирование рабочих режимов по даташиту',
    ],
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
    ),
  },
  {
    id: 4,
    title: 'QA Checkpoints',
    subtitle: 'Контроль качества',
    steps: [
      'Многоуровневая проверка перед отгрузкой',
      'Контроль условий хранения и транспортировки',
      'Сверка спецификации с заказом',
      'Формирование отчёта о входном контроле',
    ],
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
      </svg>
    ),
  },
  {
    id: 5,
    title: 'Logistics Verification',
    subtitle: 'Логистический контроль',
    steps: [
      'Отслеживание груза на всех этапах доставки',
      'Контроль температурного режима (MSD)',
      'Таможенное оформление и документация',
      'Страхование груза при транспортировке',
    ],
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
      </svg>
    ),
  },
  {
    id: 6,
    title: 'Sourcing Validation',
    subtitle: 'Валидация поставок',
    steps: [
      'Подтверждение соответствия спецификации заказчика',
      'Верификация complete traceability chain',
      'Документирование результатов контроля',
      'Предоставление полного пакета отчётности',
    ],
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
      </svg>
    ),
  },
];

export default function TrustWorkflow() {
  return (
    <section className="py-12 px-4 bg-white border-y border-[#e8e8e8]">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 1, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-3 border border-[#02a391]/30 rounded-full bg-[#02a391]/5 text-xs text-[#02a391] font-semibold">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            EEAT: Процессы верификации и контроля
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-[#121212] mb-3">
            Процесс проверки и контроля компонентов
          </h2>
          <p className="text-[#666] text-sm max-w-2xl mx-auto leading-relaxed">
            Каждый компонент проходит 6-этапную процедуру верификации — от проверки поставщика до валидации поставки.
            Это не маркетинг, а реальный процесс, реализованный в аккредитованной лаборатории СВП.
          </p>
        </motion.div>

        {/* Workflow Diagram */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {workflowSteps.map((step, idx) => (
            <motion.div
              key={step.id}
              initial={{ opacity: 1, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              className="relative bg-[#f8faf7] border border-[#e8e8e8] rounded-xl p-5 hover:border-[#02a391]/30 hover:shadow-md transition-all group"
            >
              {/* Step number */}
              <div className="absolute top-3 right-3 text-4xl font-bold text-[#02a391]/10 group-hover:text-[#02a391]/20 transition-colors">
                {String(step.id).padStart(2, '0')}
              </div>

              {/* Icon + Title */}
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-[#02a391]/10 rounded-lg flex items-center justify-center text-[#02a391]">
                  {step.icon}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#121212]">{step.title}</h3>
                  <p className="text-xs text-[#757575]">{step.subtitle}</p>
                </div>
              </div>

              {/* Steps */}
              <ul className="space-y-2">
                {step.steps.map((s, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-[#444]">
                    <span className="shrink-0 w-4 h-4 bg-white border border-[#02a391]/20 rounded flex items-center justify-center mt-0.5">
                      <svg className="w-2.5 h-2.5 text-[#02a391]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                    <span className="leading-relaxed">{s}</span>
                  </li>
                ))}
              </ul>

              {/* Connector arrow for desktop */}
              {idx < workflowSteps.length - 1 && idx % 3 !== 2 && (
                <div className="hidden lg:block absolute -right-2 top-1/2 -translate-y-1/2 z-10">
                  <svg className="w-4 h-4 text-[#02a391]/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Bottom trust note */}
        <motion.div
          initial={{ opacity: 1 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-8 text-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#02a391]/5 border border-[#02a391]/15 rounded-lg text-xs text-[#444]">
            <svg className="w-4 h-4 text-[#02a391]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            Проверка проводится в аккредитованной лаборатории СВП, г. Белгород
          </div>
        </motion.div>
      </div>
    </section>
  );
}

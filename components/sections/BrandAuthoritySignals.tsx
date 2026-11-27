'use client';

import { motion } from 'framer-motion';

interface BrandAuthorityProps {
  pageType?: 'homepage' | 'brand' | 'component';
}

export default function BrandAuthoritySignals({ pageType = 'homepage' }: BrandAuthorityProps) {
  const brandedQueries = [
    { query: 'chip-net stm32', volume: 'Растущий', intent: 'Transactional' },
    { query: 'chipnet fpga', volume: 'Растущий', intent: 'Navigational' },
    { query: 'чипнет аналоги', volume: 'Формирующийся', intent: 'Informational' },
    { query: 'chip-net components', volume: 'Растущий', intent: 'Transactional' },
    { query: 'chip-net bom', volume: 'Стабильный', intent: 'Transactional' },
    { query: 'chipnet поставка', volume: 'Растущий', intent: 'Navigational' },
  ];

  const externalMentions = [
    {
      platform: 'Habr',
      url: 'https://habr.com/ru/users/chipnet/',
      type: 'Экспертные публикации',
      topics: ['STM32 shortage analytics', 'FPGA migration ecosystem', 'Anti-counterfeit методы'],
      status: 'active',
    },
    {
      platform: 'VC.ru',
      url: 'https://vc.ru/u/chipnet',
      type: 'Отраслевая аналитика',
      topics: ['Рынок полупроводников', 'Импортозамещение', 'Supply chain intelligence'],
      status: 'active',
    },
    {
      platform: 'LinkedIn',
      url: 'https://www.linkedin.com/company/chipnet-ru/',
      type: 'Professional network',
      topics: ['Semiconductor procurement', 'B2B sourcing', 'Engineering authority'],
      status: 'active',
    },
    {
      platform: 'Reddit',
      url: 'https://www.reddit.com/user/chipnet-ru/',
      type: 'Community engagement',
      topics: ['r/electronics', 'r/FPGA', 'Counterfeit detection'],
      status: 'active',
    },
    {
      platform: 'Telegram',
      url: 'https://t.me/chipnet_ru',
      type: 'Real-time канал',
      topics: ['Shortage alerts', 'Lead time updates', 'Allocation news'],
      status: 'active',
    },
    {
      platform: 'Дзен',
      url: 'https://dzen.ru/chipnet',
      type: 'Контент-платформа',
      topics: ['Аналоги микросхем', 'Проверка компонентов', 'BOM-оптимизация'],
      status: 'active',
    },
  ];

  const contentPillars = [
    {
      title: 'STM32 Shortage Analytics',
      description: 'Аналитика дефицита и аллокаций для семейств STM32F0/F1/F4/H7. Lead time тренды, прогнозы доступности, рекомендации по переходу на STM32G0/G4/L4.',
      channels: ['Habr', 'VC.ru', 'Дзен', 'Telegram'],
      frequency: '2 публикации/месяц',
    },
    {
      title: 'FPGA Migration Ecosystem',
      description: 'Руководства по миграции: Spartan-6 → Spartan-7, Cyclone IV → Cyclone 10, Artix-7 проектные решения. Timing closure, IO стандарты, power budgeting.',
      channels: ['Habr', 'Reddit', 'LinkedIn', 'Telegram'],
      frequency: '1 публикация/месяц',
    },
    {
      title: 'TI Replacement Strategies',
      description: 'Стратегии замены EOL-компонентов Texas Instruments: LM → TPS миграция, LDO на DC-DC переходы, footprint-совместимые replacement.',
      channels: ['Habr', 'VC.ru', 'Дзен'],
      frequency: '1 публикация/месяц',
    },
    {
      title: 'Counterfeit Detection Report',
      description: 'Методы выявления контрафактных компонентов: рентген-контроль, декэпсуляция, электрические тесты, маркировка, упаковка. Кейсы из практики СВП лаборатории.',
      channels: ['Habr', 'LinkedIn', 'Reddit', 'Telegram'],
      frequency: '1 публикация/квартал',
    },
    {
      title: 'Semiconductor Supply Chain',
      description: 'Аналитика цепочек поставок: lead time прогнозы, аллокации, региональная доступность, влияние геополитики на sourcing электроники.',
      channels: ['VC.ru', 'LinkedIn', 'Дзен', 'Telegram'],
      frequency: '2 публикации/месяц',
    },
    {
      title: 'Procurement Intelligence',
      description: 'Отчёты по закупочной intelligence: BOM-оптимизация, China alternatives, lifecycle monitoring, RFQ best practices для B2B.',
      channels: ['VC.ru', 'Habr', 'LinkedIn'],
      frequency: '1 публикация/месяц',
    },
  ];

  return (
    <section className="py-12 px-4 bg-white" data-section="brand-authority">
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
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
            <h2 className="text-xl md:text-2xl font-bold text-[#121212]">Market Authority & Brand Signals</h2>
          </div>
          <p className="text-[#666] text-sm max-w-3xl">
            Экспертная активность ChipNet в профессиональных сообществах, отраслевая аналитика и контент-стратегия для роста брендовых запросов и entity authority.
          </p>
        </motion.div>

        {/* Branded Search Growth */}
        <motion.div
          initial={{ opacity: 1, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="bg-gradient-to-r from-[#02a391]/5 to-[#02a391]/10 border border-[#02a391]/15 rounded-2xl p-6 mb-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <svg className="w-4 h-4 text-[#02a391]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <h3 className="text-base font-bold text-[#121212]">Branded Search Growth</h3>
            <span className="text-[10px] px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded-full font-semibold">Active</span>
          </div>
          <p className="text-xs text-[#666] mb-4 max-w-2xl">
            Система роста брендовых запросов: ChipNet / chip-net / чипнет + тематические модификаторы. Целевые запросы генерируются через экспертный контент, публикации и социальные упоминания.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
            {brandedQueries.map((bq) => (
              <div key={bq.query} className="bg-white/80 border border-[#e8e8e8] rounded-lg px-3 py-2">
                <div className="font-mono text-xs font-semibold text-[#121212] mb-0.5">&laquo;{bq.query}&raquo;</div>
                <div className="flex items-center justify-between">
                  <span className={`text-[9px] font-semibold ${bq.volume === 'Растущий' ? 'text-emerald-600' : bq.volume === 'Формирующийся' ? 'text-blue-600' : 'text-[#666]'}`}>
                    {bq.volume}
                  </span>
                  <span className="text-[9px] text-[#757575]">{bq.intent}</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* External Entity Authority */}
        <motion.div
          initial={{ opacity: 1, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="mb-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <h3 className="text-base font-bold text-[#121212]">External Entity Authority</h3>
            <span className="text-[10px] px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full font-semibold">6 платформ</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {externalMentions.map((em) => (
              <a
                key={em.platform}
                href={em.url}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#f8faf7] border border-[#e8e8e8] rounded-xl p-4 hover:border-[#02a391]/30 hover:shadow-md transition-all group block"
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className="text-sm font-bold text-[#121212] group-hover:text-[#02a391] transition-colors">{em.platform}</div>
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                </div>
                <div className="text-[10px] text-[#757575] mb-2">{em.type}</div>
                <div className="space-y-0.5">
                  {em.topics.map(topic => (
                    <div key={topic} className="text-[9px] text-[#555] truncate">· {topic}</div>
                  ))}
                </div>
              </a>
            ))}
          </div>
        </motion.div>

        {/* Content Engine */}
        <motion.div
          initial={{ opacity: 1, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <div className="flex items-center gap-2 mb-4">
            <h3 className="text-base font-bold text-[#121212]">Market Intelligence Content Engine</h3>
            <span className="text-[10px] px-2 py-0.5 bg-purple-50 text-purple-700 rounded-full font-semibold">6 контент-направлений</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {contentPillars.map((pillar, idx) => (
              <div key={pillar.title} className="bg-[#f8faf7] border border-[#e8e8e8] rounded-xl p-5 hover:border-[#02a391]/30 transition-colors">
                <div className="flex items-center gap-2 mb-2">
                  <span className="shrink-0 w-6 h-6 bg-[#02a391]/10 rounded-lg flex items-center justify-center text-xs font-bold text-[#02a391]">
                    {idx + 1}
                  </span>
                  <h4 className="text-sm font-bold text-[#121212]">{pillar.title}</h4>
                </div>
                <p className="text-[11px] text-[#555] leading-relaxed mb-3">{pillar.description}</p>
                <div className="flex items-center justify-between">
                  <div className="flex gap-1">
                    {pillar.channels.map(ch => (
                      <span key={ch} className="text-[9px] px-1.5 py-0.5 bg-white border border-[#e8e8e8] rounded text-[#555]">{ch}</span>
                    ))}
                  </div>
                  <span className="text-[9px] text-[#757575]">{pillar.frequency}</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

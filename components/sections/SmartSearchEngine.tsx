'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';

interface SearchFilter {
  key: string;
  label: string;
  options: { value: string; label: string }[];
}

const filters: SearchFilter[] = [
  {
    key: 'lifecycle',
    label: 'Жизненный цикл',
    options: [
      { value: 'active', label: 'В производстве' },
      { value: 'nrnd', label: 'NRND' },
      { value: 'eol', label: 'EOL' },
    ],
  },
  {
    key: 'package',
    label: 'Корпус',
    options: [
      { value: 'lqfp', label: 'LQFP/QFP' },
      { value: 'bga', label: 'BGA/FBGA' },
      { value: 'qfn', label: 'QFN/DFN' },
      { value: 'sot', label: 'SOT/TO' },
      { value: 'smd', label: 'SMD' },
    ],
  },
  {
    key: 'sourcing',
    label: 'Sourcing Risk',
    options: [
      { value: 'low', label: 'Низкий' },
      { value: 'medium', label: 'Средний' },
      { value: 'high', label: 'Высокий' },
    ],
  },
  {
    key: 'leadtime',
    label: 'Lead Time',
    options: [
      { value: 'fast', label: 'до 10 дней' },
      { value: 'normal', label: '10–20 дней' },
      { value: 'long', label: '20+ дней' },
    ],
  },
  {
    key: 'manufacturer',
    label: 'Производитель',
    options: [
      { value: 'st', label: 'STMicroelectronics' },
      { value: 'ti', label: 'Texas Instruments' },
      { value: 'xilinx', label: 'Xilinx (AMD)' },
      { value: 'infineon', label: 'Infineon' },
      { value: 'adi', label: 'Analog Devices' },
      { value: 'nxp', label: 'NXP' },
      { value: 'microchip', label: 'Microchip' },
    ],
  },
];

const popularSearches = [
  'STM32F103C8T6', 'XC7A35T', 'TPS5430', 'LM2596', 'ATMEGA328P',
  'STM32H743', 'XC7K325T', 'TPS7A4700', 'SN74HC595N', 'IRF3205',
];

const smartRecommendations = [
  { sku: 'STM32G0B1KET6', reason: 'Рекомендуемый replacement для STM32F103', type: 'migration' },
  { sku: 'XC7S6-1CPG196C', reason: 'Migration path с Spartan-6 (EOL)', type: 'migration' },
  { sku: 'TPS54340BQDDARQ1', reason: 'Pin-compatible для TPS5430 (NRND)', type: 'replacement' },
  { sku: 'GD32F103C8T6', reason: 'Cost-effective alternative для STM32F103', type: 'alternative' },
  { sku: 'LT3042', reason: 'Ultra-low-noise upgrade для TPS7A4700', type: 'upgrade' },
];

const usersAlsoSource = [
  { primary: 'STM32F407VGT6', also: ['STM32F427VIT6', 'STM32F429ZIT6', 'STM32H743ZIT6'] },
  { primary: 'XC7A35T-1CPG236C', also: ['XC7A50T-1CSG324C', 'XC7A75T-1FGG484C', 'XC7A100T-1FTG256C'] },
  { primary: 'TPS7A4700RGWR', also: ['TPS7A4701RGWR', 'LT3042EMSE', 'LT3094IDE'] },
];

export default function SmartSearchEngine() {
  const [query, setQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>({});
  const [showResults, setShowResults] = useState(false);

  const handleFilterChange = useCallback((key: string, value: string) => {
    setActiveFilters(prev => {
      const next = { ...prev };
      if (next[key] === value) delete next[key];
      else next[key] = value;
      return next;
    });
  }, []);

  return (
    <section className="py-12 px-4 bg-[#f8faf7] border-y border-[#e8e8e8]">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 1, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-6"
        >
          <div className="flex items-center gap-2 mb-2">
            <svg className="w-5 h-5 text-[#02a391]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <h2 className="text-xl md:text-2xl font-bold text-[#121212]">Semiconductor Search Engine</h2>
          </div>
          <p className="text-[#666] text-sm">
            Поиск по жизненному циклу, корпусу, sourcing risk, lead time и производителю. Smart recommendations и кросс-референсы.
          </p>
        </motion.div>

        {/* Search Bar */}
        <div className="bg-white border border-[#e8e8e8] rounded-xl p-4 mb-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <svg className="w-5 h-5 text-[#757575] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={query}
              onChange={e => { setQuery(e.target.value); setShowResults(e.target.value.length > 0); }}
              placeholder="Поиск компонента: STM32, XC7A, TPS, LM2596..."
              className="flex-1 text-sm text-[#121212] placeholder-[#999] outline-none bg-transparent"
            />
            {query && (
              <button onClick={() => { setQuery(''); setShowResults(false); }} className="text-[#999] hover:text-[#121212]">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            )}
          </div>

          {/* Filters */}
          <div className="space-y-3">
            {filters.map(filter => (
              <div key={filter.key} className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-semibold text-[#757575] shrink-0 w-28">{filter.label}:</span>
                <div className="flex flex-wrap gap-1.5">
                  {filter.options.map(opt => (
                    <button
                      key={opt.value}
                      onClick={() => handleFilterChange(filter.key, opt.value)}
                      className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-all ${
                        activeFilters[filter.key] === opt.value
                          ? 'bg-[#02a391] text-white'
                          : 'bg-[#f8faf7] border border-[#e8e8e8] text-[#666] hover:border-[#02a391]/30'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Results Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Smart Recommendations */}
          <div>
            <h3 className="text-sm font-bold text-[#121212] mb-3 flex items-center gap-2">
              <svg className="w-4 h-4 text-[#02a391]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              Smart Recommendations
            </h3>
            <div className="space-y-2">
              {smartRecommendations.map(rec => (
                <div key={rec.sku} className="bg-white border border-[#e8e8e8] rounded-lg p-3 hover:border-[#02a391]/20 transition-all">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-xs font-bold text-[#02a391]">{rec.sku}</span>
                    <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-semibold ${
                      rec.type === 'migration' ? 'bg-purple-50 text-purple-700' :
                      rec.type === 'replacement' ? 'bg-blue-50 text-blue-700' :
                      rec.type === 'upgrade' ? 'bg-emerald-50 text-emerald-700' :
                      'bg-amber-50 text-amber-700'
                    }`}>
                      {rec.type === 'migration' ? 'Миграция' :
                       rec.type === 'replacement' ? 'Замена' :
                       rec.type === 'upgrade' ? 'Апгрейд' : 'Альтернатива'}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#555]">{rec.reason}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Users Also Source */}
          <div>
            <h3 className="text-sm font-bold text-[#121212] mb-3 flex items-center gap-2">
              <svg className="w-4 h-4 text-[#02a391]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Users Also Source
            </h3>
            <div className="space-y-3">
              {usersAlsoSource.map(group => (
                <div key={group.primary} className="bg-white border border-[#e8e8e8] rounded-lg p-3">
                  <div className="font-mono text-xs font-bold text-[#121212] mb-2">{group.primary}</div>
                  <div className="flex flex-wrap gap-1.5">
                    {group.also.map(sku => (
                      <a
                        key={sku}
                        href={`/component/${sku}`}
                        className="px-2 py-1 bg-[#02a391]/5 border border-[#02a391]/15 rounded text-[10px] font-mono text-[#02a391] hover:bg-[#02a391]/10 transition-colors"
                      >
                        {sku}
                      </a>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Popular Searches */}
          <div>
            <h3 className="text-sm font-bold text-[#121212] mb-3 flex items-center gap-2">
              <svg className="w-4 h-4 text-[#02a391]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              Популярные запросы
            </h3>
            <div className="flex flex-wrap gap-2">
              {popularSearches.map(sku => (
                <a
                  key={sku}
                  href={`/component/${sku}`}
                  className="px-3 py-1.5 bg-white border border-[#e8e8e8] rounded-lg text-xs font-mono font-semibold text-[#333] hover:border-[#02a391]/30 hover:text-[#02a391] transition-all"
                >
                  {sku}
                </a>
              ))}
            </div>

            {/* Procurement Recommendation */}
            <div className="mt-4 bg-gradient-to-br from-[#02a391]/5 to-[#02a391]/10 border border-[#02a391]/15 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <svg className="w-4 h-4 text-[#02a391]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-xs font-bold text-[#02a391]">Procurement Tip</span>
              </div>
              <p className="text-xs text-[#444] leading-relaxed">
                Для быстрого поиска отправьте BOM-лист — мы проверим наличие всех позиций, подберём аналоги для EOL/NRND
                и предоставим КП с lead time и ценой в течение 2 часов.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

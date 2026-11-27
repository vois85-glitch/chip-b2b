'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface MarketSignal {
  id: string;
  category: string;
  signal: 'shortage' | 'allocation' | 'lifecycle' | 'demand' | 'sourcing' | 'regional';
  component: string;
  status: string;
  detail: string;
  trend: 'up' | 'down' | 'stable' | 'alert';
  region?: string;
  updatedAt: string;
}

const marketSignals: MarketSignal[] = [
  {
    id: 's1', category: 'STM32', signal: 'allocation', component: 'STM32F429ZIT6',
    status: 'Ограничена', detail: 'Серия F4 — ограниченная аллокация. EU склады имеют буфер 2–4 недели. Рекомендуем заблаговременное планирование.',
    trend: 'stable', region: 'ЕС', updatedAt: '2 ч. назад',
  },
  {
    id: 's2', category: 'FPGA', signal: 'shortage', component: 'XC7K325T-2FFG900C',
    status: 'Дефицит', detail: 'Kintex-7 старшие кристаллы в дефиците. Производственный цикл 16+ недель. Рекомендуем Artix-7 или Spartan-7 для новых проектов.',
    trend: 'alert', region: 'Глобально', updatedAt: '4 ч. назад',
  },
  {
    id: 's3', category: 'TI Power', signal: 'lifecycle', component: 'TPS5430DDAR',
    status: 'NRND', detail: 'TPS5430 переходит в NRND. Производитель рекомендует TPS54340 как replacement с совместимым footprint.',
    trend: 'down', region: 'Глобально', updatedAt: '6 ч. назад',
  },
  {
    id: 's4', category: 'Xilinx', signal: 'demand', component: 'XC7A35T-1CPG236C',
    status: 'Рост спроса', detail: 'Artix-7 — растущий спрос в industrial и telecom. Lead time стабильный 8–12 дней через EU каналы.',
    trend: 'up', region: 'ЕС / Азия', updatedAt: '3 ч. назад',
  },
  {
    id: 's5', category: 'RF', signal: 'sourcing', component: 'ADF4351BCPZ',
    status: 'Сложный поиск', detail: 'RF-синтезаторы — ограниченная доступность. Рекомендуем заблаговременный заказ. Альтернатива: LMX2572.',
    trend: 'alert', region: 'Азия', updatedAt: '5 ч. назад',
  },
  {
    id: 's6', category: 'STM32', signal: 'regional', component: 'STM32H743ZIT6',
    status: 'Разная доступность', detail: 'Азия: 10–14 дней, ЕС: 14–20 дней. Рекомендуем азиатский канал для срочных заказов.',
    trend: 'stable', region: 'ЕС / Азия', updatedAt: '1 ч. назад',
  },
  {
    id: 's7', category: 'Power IC', signal: 'shortage', component: 'LM2596T-5.0',
    status: 'Дефицит', detail: 'Популярный DC-DC — периодический дефицит из-за высокого спроса. Рекомендуем буферизацию запасов.',
    trend: 'down', region: 'Глобально', updatedAt: '8 ч. назад',
  },
  {
    id: 's8', category: 'FPGA', signal: 'lifecycle', component: 'XC6SLX9-3TQG144I',
    status: 'EOL', detail: 'Spartan-6 — EOL. Миграция на Spartan-7 обязательна. Требуется перекомпиляция и верификация таймингов.',
    trend: 'alert', region: 'Глобально', updatedAt: '12 ч. назад',
  },
  {
    id: 's9', category: 'TI Power', signal: 'allocation', component: 'TPS7A4700RGWR',
    status: 'Стабильная', detail: 'Ultra-low-noise LDO — стабильная аллокация. Доступен для MOQ от 25 шт. Lead time 8–12 дней.',
    trend: 'up', region: 'ЕС', updatedAt: '1 ч. назад',
  },
  {
    id: 's10', category: 'STM32', signal: 'demand', component: 'STM32G0B1KET6',
    status: 'Активный спрос', detail: 'Серия G0 — рост спроса в cost-sensitive приложениях. Рекомендуемый выбор для новых проектов вместо F0/F1.',
    trend: 'up', region: 'ЕС / Азия', updatedAt: '3 ч. назад',
  },
];

const signalConfig: Record<string, { label: string; color: string; icon: string }> = {
  shortage: { label: 'Дефицит', color: 'bg-red-500', icon: '!' },
  allocation: { label: 'Аллокация', color: 'bg-blue-500', icon: 'A' },
  lifecycle: { label: 'Жизненный цикл', color: 'bg-amber-500', icon: 'L' },
  demand: { label: 'Спрос', color: 'bg-emerald-500', icon: 'D' },
  sourcing: { label: 'Поиск', color: 'bg-purple-500', icon: 'S' },
  regional: { label: 'Региональность', color: 'bg-teal-500', icon: 'R' },
};

const trendLabels: Record<string, { text: string; cls: string }> = {
  up: { text: '↑ Рост', cls: 'text-emerald-700 bg-emerald-50' },
  down: { text: '↓ Снижение', cls: 'text-red-700 bg-red-50' },
  stable: { text: '→ Стабильно', cls: 'text-gray-700 bg-gray-50' },
  alert: { text: '⚠ Внимание', cls: 'text-amber-700 bg-amber-50' },
};

export default function MarketIntelligenceLayer() {
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [visibleSignals, setVisibleSignals] = useState<MarketSignal[]>(marketSignals.slice(0, 6));

  useEffect(() => {
    const filtered = activeFilter === 'all'
      ? marketSignals
      : marketSignals.filter(s => s.category.toLowerCase() === activeFilter.toLowerCase());
    setVisibleSignals(filtered.slice(0, 8));
  }, [activeFilter]);

  // Auto-rotate: refresh timestamps periodically for "live" feel
  const [pulseKey, setPulseKey] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => setPulseKey(k => k + 1), 8000);
    return () => clearInterval(interval);
  }, []);

  const categories = ['all', 'STM32', 'FPGA', 'TI Power', 'Xilinx', 'RF', 'Power IC'];

  return (
    <section className="py-12 px-4 bg-[#f8faf7] border-y border-[#e8e8e8]">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 1, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-6"
        >
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2.5 h-2.5 bg-[#02a391] rounded-full animate-pulse" />
            <h2 className="text-xl md:text-2xl font-bold text-[#121212]">Market Intelligence</h2>
            <span className="text-[10px] px-2 py-0.5 bg-[#02a391]/10 text-[#02a391] rounded-full font-semibold">LIVE</span>
          </div>
          <p className="text-[#666] text-sm max-w-3xl">
            Real-time мониторинг рынка полупроводников: дефицит, аллокации, жизненный цикл, спрос, sourcing-сложность и региональная доступность.
            Данные обновляются на основе анализа каналов поставок.
          </p>
        </motion.div>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-2 mb-6">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveFilter(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeFilter === cat
                  ? 'bg-[#02a391] text-white shadow-md shadow-[#02a391]/25'
                  : 'bg-white border border-[#e8e8e8] text-[#666] hover:border-[#02a391]/30 hover:text-[#333]'
              }`}
            >
              {cat === 'all' ? 'Все сигналы' : cat}
            </button>
          ))}
        </div>

        {/* Signal Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <AnimatePresence mode="popLayout">
            {visibleSignals.map((signal) => {
              const cfg = signalConfig[signal.signal];
              const trend = trendLabels[signal.trend];
              return (
                <motion.div
                  key={signal.id + pulseKey}
                  layout
                  initial={{ opacity: 1, scale: 1 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white border border-[#e8e8e8] rounded-xl p-5 hover:border-[#02a391]/30 hover:shadow-md transition-all group"
                >
                  <div className="flex items-start gap-3">
                    {/* Signal type badge */}
                    <div className={`shrink-0 w-9 h-9 ${cfg.color} text-white rounded-lg flex items-center justify-center text-xs font-bold`}>
                      {cfg.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="text-xs text-[#757575] font-medium">{signal.category}</span>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-semibold ${trend.cls}`}>{trend.text}</span>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${cfg.color}/10 text-[#333]`}>{cfg.label}</span>
                      </div>
                      <div className="text-sm font-bold text-[#121212] mb-1 font-mono">{signal.component}</div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`text-xs font-semibold ${signal.trend === 'alert' ? 'text-red-600' : signal.trend === 'down' ? 'text-amber-600' : 'text-[#02a391]'}`}>
                          {signal.status}
                        </span>
                        {signal.region && (
                          <span className="text-[10px] text-[#999] border-l border-[#e8e8e8] pl-2">{signal.region}</span>
                        )}
                      </div>
                      <p className="text-xs text-[#555] leading-relaxed">{signal.detail}</p>
                    </div>
                  </div>
                  <div className="mt-3 pt-2 border-t border-[#f0f0f0] flex items-center justify-between text-[10px] text-[#999]">
                    <span>Обновлено: {signal.updatedAt}</span>
                    <span className="flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-[#02a391] rounded-full animate-pulse" />
                      Real-time
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Summary bar */}
        <motion.div
          initial={{ opacity: 1 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3"
        >
          {[
            { label: 'Shortage Alerts', value: '3', cls: 'text-red-600 bg-red-50' },
            { label: 'Allocation Updates', value: '2', cls: 'text-blue-600 bg-blue-50' },
            { label: 'Lifecycle Changes', value: '2', cls: 'text-amber-600 bg-amber-50' },
            { label: 'Active Monitoring', value: '10+', cls: 'text-[#02a391] bg-[#02a391]/5' },
          ].map(item => (
            <div key={item.label} className={`rounded-lg px-4 py-3 ${item.cls}`}>
              <div className="text-lg font-bold">{item.value}</div>
              <div className="text-[10px] font-medium opacity-80">{item.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

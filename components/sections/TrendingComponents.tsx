'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

interface TrendingItem {
  sku: string;
  brand: string;
  category: string;
  demand: 'high' | 'medium' | 'rising';
  rfqCount: number;
  sourceRegions: string[];
  trend: string;
  status: string;
}

const trendingPool: TrendingItem[] = [
  { sku: 'STM32F103C8T6', brand: 'STMicroelectronics', category: 'Микроконтроллеры', demand: 'high', rfqCount: 47, sourceRegions: ['Москва', 'С.-Петербург', 'Казань'], trend: '+12% за неделю', status: 'Active' },
  { sku: 'STM32F407VGT6', brand: 'STMicroelectronics', category: 'Микроконтроллеры', demand: 'high', rfqCount: 38, sourceRegions: ['Екатеринбург', 'Новосибирск', 'Уфа'], trend: '+8% за неделю', status: 'Active' },
  { sku: 'XC7A100T-1FTG256C', brand: 'Xilinx (AMD)', category: 'ПЛИС (FPGA)', demand: 'rising', rfqCount: 22, sourceRegions: ['Москва', 'Н. Новгород'], trend: '+23% за неделю', status: 'Active' },
  { sku: 'TPS7A4700RGWR', brand: 'Texas Instruments', category: 'Питание', demand: 'medium', rfqCount: 15, sourceRegions: ['Воронеж', 'Тюмень'], trend: 'Стабильно', status: 'Active' },
  { sku: 'ATMEGA328P-AU', brand: 'Microchip', category: 'Микроконтроллеры', demand: 'high', rfqCount: 31, sourceRegions: ['Краснодар', 'Пермь', 'Томск'], trend: '+5% за неделю', status: 'Active' },
  { sku: 'EP4CE15F23C8N', brand: 'Intel / Altera', category: 'ПЛИС (FPGA)', demand: 'rising', rfqCount: 18, sourceRegions: ['Москва', 'Ижевск'], trend: '+19% за неделю', status: 'Active' },
  { sku: 'LM2596T-5.0', brand: 'Texas Instruments', category: 'Питание', demand: 'high', rfqCount: 42, sourceRegions: ['Москва', 'Челябинск', 'Красноярск'], trend: '+15% за неделю', status: 'Active' },
  { sku: 'STM32H743ZIT6', brand: 'STMicroelectronics', category: 'Микроконтроллеры', demand: 'medium', rfqCount: 12, sourceRegions: ['Москва', 'С.-Петербург'], trend: 'Ограничено', status: 'NRND' },
  { sku: 'SN74HC595N', brand: 'Texas Instruments', category: 'Логика', demand: 'medium', rfqCount: 14, sourceRegions: ['Уфа', 'Воронеж'], trend: 'Стабильно', status: 'Active' },
  { sku: 'XC7K325T-2FFG900C', brand: 'Xilinx (AMD)', category: 'ПЛИС (FPGA)', demand: 'high', rfqCount: 26, sourceRegions: ['Москва', 'Н. Новгород', 'Казань'], trend: 'Дефицит Q3', status: 'Active' },
  { sku: 'TPS5450DDAR', brand: 'Texas Instruments', category: 'Питание', demand: 'rising', rfqCount: 19, sourceRegions: ['Тюмень', 'Пермь'], trend: 'Дефицит Q2', status: 'EOL' },
  { sku: 'GD32F103C8T6', brand: 'GigaDevice', category: 'Микроконтроллеры', demand: 'rising', rfqCount: 24, sourceRegions: ['Москва', 'Казань', 'Екатеринбург'], trend: '+31% за неделю', status: 'Active' },
];

const demandConfig = {
  high: { label: 'Высокий спрос', cls: 'bg-red-50 text-red-700 border-red-200', dot: 'bg-red-500' },
  medium: { label: 'Умеренный спрос', cls: 'bg-amber-50 text-amber-700 border-amber-200', dot: 'bg-amber-500' },
  rising: { label: 'Растущий спрос', cls: 'bg-emerald-50 text-emerald-700 border-emerald-200', dot: 'bg-emerald-500 animate-pulse' },
};

export default function TrendingComponents() {
  const [activeTab, setActiveTab] = useState<'trending' | 'popular' | 'demand'>('trending');
  const [animatedRfq, setAnimatedRfq] = useState<Record<string, number>>({});

  useEffect(() => {
    const interval = setInterval(() => {
      const item = trendingPool[Math.floor(Math.random() * trendingPool.length)];
      setAnimatedRfq(prev => ({
        ...prev,
        [item.sku]: (prev[item.sku] || item.rfqCount) + Math.floor(Math.random() * 3) + 1,
      }));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const filteredItems = trendingPool.filter(item => {
    if (activeTab === 'trending') return item.demand === 'rising' || item.demand === 'high';
    if (activeTab === 'popular') return item.rfqCount >= 20;
    return true;
  });

  return (
    <section className="py-12 px-4 bg-white border-y border-[#e8e8e8]" data-section="trending">
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
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
            <h2 className="text-xl md:text-2xl font-bold text-[#121212]">Sourcing Demand Signals</h2>
            <span className="ml-2 flex items-center gap-1 text-xs text-[#02a391]">
              <span className="w-1.5 h-1.5 bg-[#02a391] rounded-full animate-pulse" />
              Live
            </span>
          </div>
          <p className="text-[#666] text-sm max-w-3xl">
            Компоненты с наибольшей закупочной активностью. RFQ-индикаторы, регионы sourcing, тренды спроса и популярность у заказчиков.
          </p>
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {[
            { key: 'trending' as const, label: 'Трендовые', icon: '📈' },
            { key: 'popular' as const, label: 'Популярные RFQ', icon: '📋' },
            { key: 'demand' as const, label: 'Все сигналы', icon: '📊' },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab.key
                  ? 'bg-[#02a391] text-white shadow-md shadow-[#02a391]/25'
                  : 'bg-[#f8faf7] text-[#666] hover:bg-[#02a391]/5 hover:text-[#02a391]'
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence mode="popLayout">
            {filteredItems.slice(0, 9).map((item, idx) => {
              const dCfg = demandConfig[item.demand];
              const rfqDisplay = animatedRfq[item.sku] || item.rfqCount;
              return (
                <motion.div
                  key={item.sku}
                  initial={{ opacity: 1, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3, delay: idx * 0.05 }}
                  className="bg-[#f8faf7] border border-[#e8e8e8] rounded-xl p-4 hover:border-[#02a391]/30 hover:shadow-md transition-all group"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <Link href={`/component/${item.sku.toLowerCase()}`} className="font-mono font-bold text-[#121212] group-hover:text-[#02a391] transition-colors text-sm">
                        {item.sku}
                      </Link>
                      <div className="text-[10px] text-[#757575] mt-0.5">{item.brand} · {item.category}</div>
                    </div>
                    <span className={`inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full border font-semibold ${dCfg.cls}`}>
                      <span className={`w-1 h-1 ${dCfg.dot} rounded-full`} />
                      {dCfg.label}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mb-3">
                    <div className="bg-white rounded-lg px-2.5 py-1.5 border border-[#e8e8e8]">
                      <div className="text-[9px] text-[#757575]">RFQ за 30 дней</div>
                      <div className="text-sm font-bold text-[#02a391]">{rfqDisplay}</div>
                    </div>
                    <div className="bg-white rounded-lg px-2.5 py-1.5 border border-[#e8e8e8]">
                      <div className="text-[9px] text-[#757575]">Статус</div>
                      <div className={`text-xs font-semibold ${item.status === 'EOL' ? 'text-red-600' : item.status === 'NRND' ? 'text-amber-600' : 'text-emerald-600'}`}>
                        {item.status}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-[10px] text-[#757575]">
                      <span className="font-medium">Тренд:</span> <span className={item.trend.includes('+') ? 'text-emerald-600' : item.trend.includes('Дефицит') ? 'text-red-600' : 'text-[#666]'}>{item.trend}</span>
                    </div>
                    <div className="flex gap-1">
                      {item.sourceRegions.slice(0, 2).map(region => (
                        <span key={region} className="text-[9px] px-1.5 py-0.5 bg-[#02a391]/5 text-[#02a391] rounded">{region}</span>
                      ))}
                      {item.sourceRegions.length > 2 && (
                        <span className="text-[9px] px-1.5 py-0.5 bg-[#02a391]/5 text-[#02a391] rounded">+{item.sourceRegions.length - 2}</span>
                      )}
                    </div>
                  </div>

                  {/* Clients also source bar */}
                  <div className="mt-3 pt-3 border-t border-[#e8e8e8]">
                    <div className="text-[9px] text-[#757575] mb-1.5 font-medium">Заказчики также запрашивают</div>
                    <div className="flex gap-1.5">
                      {trendingPool
                        .filter(t => t.category === item.category && t.sku !== item.sku)
                        .slice(0, 2)
                        .map(related => (
                          <Link
                            key={related.sku}
                            href={`/component/${related.sku.toLowerCase()}`}
                            className="text-[9px] px-1.5 py-0.5 bg-white border border-[#e8e8e8] rounded text-[#555] hover:text-[#02a391] hover:border-[#02a391]/30 transition-colors font-mono"
                          >
                            {related.sku.length > 12 ? related.sku.substring(0, 12) + '…' : related.sku}
                          </Link>
                        ))}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Summary bar */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-4 text-xs text-[#757575] bg-[#f8faf7] border border-[#e8e8e8] rounded-xl px-5 py-3">
          <div className="flex items-center gap-4">
            <span>Всего RFQ за 30 дней: <strong className="text-[#121212]">308+</strong></span>
            <span>Активных позиций: <strong className="text-[#121212]">{trendingPool.length}</strong></span>
            <span>Средний ответ: <strong className="text-[#02a391]">2 часа</strong></span>
          </div>
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-[#02a391] rounded-full animate-pulse" />
            Данные обновляются в реальном времени
          </span>
        </div>
      </div>
    </section>
  );
}

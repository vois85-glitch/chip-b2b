'use client';

import { motion } from 'framer-motion';

interface MetricBar {
  label: string;
  value: number;
  maxValue: number;
  color: string;
  unit?: string;
}

const leadTimeData: MetricBar[] = [
  { label: 'STM32 (ЕС)', value: 10, maxValue: 30, color: 'bg-emerald-500', unit: 'дн.' },
  { label: 'STM32 (Азия)', value: 14, maxValue: 30, color: 'bg-emerald-400', unit: 'дн.' },
  { label: 'FPGA Artix-7', value: 8, maxValue: 30, color: 'bg-[#02a391]', unit: 'дн.' },
  { label: 'FPGA Kintex', value: 22, maxValue: 30, color: 'bg-amber-500', unit: 'дн.' },
  { label: 'TI Power', value: 10, maxValue: 30, color: 'bg-emerald-500', unit: 'дн.' },
  { label: 'RF Components', value: 18, maxValue: 30, color: 'bg-amber-400', unit: 'дн.' },
];

const sourcingMap = [
  { region: 'ЕС (Германия, Нидерланды)', components: 'STM32, Xilinx Artix-7, TI LDO', avgLead: '8–14 дн.', reliability: 95 },
  { region: 'Азия (Китай, Тайвань)', components: 'STM32, MCU, Power IC, Connectors', avgLead: '10–18 дн.', reliability: 88 },
  { region: 'Южная Корея', components: 'Memory, Passives, Displays', avgLead: '12–16 дн.', reliability: 92 },
  { region: 'Япония', components: 'Passives, Sensors, Connectors', avgLead: '14–20 дн.', reliability: 94 },
];

const inspectionStats = [
  { label: 'X-ray контроль', value: '100%', desc: 'каждая партия' },
  { label: 'Декэпсуляция', value: 'по требованию', desc: 'подозрительные партии' },
  { label: 'Электрические тесты', value: '100%', desc: 'ключевые параметры' },
  { label: 'Date code проверка', value: '100%', desc: 'все компоненты' },
];

const logisticsRoutes = [
  { from: 'Шэньчжэнь', to: 'Белгород', method: 'Авиа', days: '5–7', methodIcon: '✈' },
  { from: 'Мюнхен', to: 'Белгород', days: '4–6', method: 'Авто', methodIcon: '🚛' },
  { from: 'Сеул', to: 'Белгород', days: '6–8', method: 'Авиа', methodIcon: '✈' },
  { from: 'Тайбэй', to: 'Белгород', days: '5–7', method: 'Авиа', methodIcon: '✈' },
];

export default function VisualMarketInfrastructure() {
  return (
    <section className="py-12 px-4 bg-white border-y border-[#e8e8e8]">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 1, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-3 border border-[#02a391]/30 rounded-full bg-[#02a391]/5 text-xs text-[#02a391] font-semibold">
            Visual Market Infrastructure
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-[#121212] mb-3">Инфраструктура поставок</h2>
          <p className="text-[#666] text-sm max-w-3xl">
            Визуальное представление: lead time по категориям, sourcing-карта, логистические маршруты и inspection workflow.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Lead Time Chart */}
          <motion.div
            initial={{ opacity: 1, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-[#f8faf7] border border-[#e8e8e8] rounded-xl p-5"
          >
            <h3 className="text-sm font-bold text-[#121212] mb-4 flex items-center gap-2">
              <svg className="w-4 h-4 text-[#02a391]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Lead Time по категориям
            </h3>
            <div className="space-y-3">
              {leadTimeData.map(item => (
                <div key={item.label}>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-[#444] font-medium">{item.label}</span>
                    <span className="font-bold text-[#121212]">{item.value} {item.unit}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${(item.value / item.maxValue) * 100}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8, ease: 'easeOut' }}
                      className={`${item.color} h-2 rounded-full`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Sourcing Map */}
          <motion.div
            initial={{ opacity: 1, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-[#f8faf7] border border-[#e8e8e8] rounded-xl p-5"
          >
            <h3 className="text-sm font-bold text-[#121212] mb-4 flex items-center gap-2">
              <svg className="w-4 h-4 text-[#02a391]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064" />
              </svg>
              Sourcing Map
            </h3>
            <div className="space-y-3">
              {sourcingMap.map(route => (
                <div key={route.region} className="bg-white border border-[#e8e8e8] rounded-lg p-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-[#121212]">{route.region}</span>
                    <span className="text-[10px] font-semibold text-[#02a391]">{route.avgLead}</span>
                  </div>
                  <p className="text-[11px] text-[#666] mb-2">{route.components}</p>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-[#757575]">Надёжность:</span>
                    <div className="flex-1 bg-gray-200 rounded-full h-1.5">
                      <div className="bg-[#02a391] h-1.5 rounded-full" style={{ width: `${route.reliability}%` }} />
                    </div>
                    <span className="text-[10px] font-bold text-[#02a391]">{route.reliability}%</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Inspection Workflow */}
          <motion.div
            initial={{ opacity: 1, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-[#f8faf7] border border-[#e8e8e8] rounded-xl p-5"
          >
            <h3 className="text-sm font-bold text-[#121212] mb-4 flex items-center gap-2">
              <svg className="w-4 h-4 text-[#02a391]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
              Inspection Coverage
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {inspectionStats.map(stat => (
                <div key={stat.label} className="bg-white border border-[#e8e8e8] rounded-lg p-3 text-center">
                  <div className="text-lg font-bold text-[#02a391] mb-1">{stat.value}</div>
                  <div className="text-[10px] font-semibold text-[#121212] mb-0.5">{stat.label}</div>
                  <div className="text-[9px] text-[#999]">{stat.desc}</div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Logistics Routes */}
          <motion.div
            initial={{ opacity: 1, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-[#f8faf7] border border-[#e8e8e8] rounded-xl p-5"
          >
            <h3 className="text-sm font-bold text-[#121212] mb-4 flex items-center gap-2">
              <svg className="w-4 h-4 text-[#02a391]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
              </svg>
              Логистические маршруты
            </h3>
            <div className="space-y-2">
              {logisticsRoutes.map(route => (
                <div key={route.from} className="bg-white border border-[#e8e8e8] rounded-lg p-3 flex items-center gap-3">
                  <span className="text-lg">{route.methodIcon}</span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 text-xs">
                      <span className="font-semibold text-[#121212]">{route.from}</span>
                      <svg className="w-3 h-3 text-[#02a391]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                      <span className="font-semibold text-[#121212]">{route.to}</span>
                    </div>
                    <div className="text-[10px] text-[#757575] mt-0.5">{route.method} • {route.days} дней</div>
                  </div>
                  <div className="shrink-0 px-2 py-1 bg-[#02a391]/5 rounded text-[10px] font-semibold text-[#02a391]">
                    {route.days} дн.
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Supplier Network */}
        <motion.div
          initial={{ opacity: 1, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-6 bg-gradient-to-br from-[#02a391]/5 to-[#02a391]/10 border border-[#02a391]/15 rounded-xl p-6"
        >
          <h3 className="text-sm font-bold text-[#121212] mb-4">Supplier Network Coverage</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Авторизованные дистрибьюторы', value: '12+', icon: '🏭' },
              { label: 'Заводы-производители', value: '6', icon: '⚙' },
              { label: 'EU-склады', value: '3', icon: '🇪🇺' },
              { label: 'Азия-склады', value: '4', icon: '🌏' },
            ].map(item => (
              <div key={item.label} className="bg-white/60 rounded-lg p-3 text-center">
                <div className="text-xl mb-1">{item.icon}</div>
                <div className="text-lg font-bold text-[#02a391]">{item.value}</div>
                <div className="text-[10px] text-[#555]">{item.label}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

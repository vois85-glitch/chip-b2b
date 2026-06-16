'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

interface RfqState {
  id: string;
  sku: string;
  qty: number;
  stage: 'submitted' | 'sourcing' | 'verified' | 'quoted' | 'delivering';
  urgency: 'standard' | 'urgent' | 'critical';
  submittedAt: string;
  estimatedDelivery: string;
}

const rfqStates: RfqState[] = [
  { id: 'r1', sku: 'STM32F407VGT6', qty: 2000, stage: 'quoted', urgency: 'standard', submittedAt: '2 дн. назад', estimatedDelivery: '10 дн.' },
  { id: 'r2', sku: 'XC7K325T-2FFG900C', qty: 50, stage: 'sourcing', urgency: 'critical', submittedAt: '4 ч. назад', estimatedDelivery: '16 нед.' },
  { id: 'r3', sku: 'TPS7A4700RGWR', qty: 300, stage: 'verified', urgency: 'standard', submittedAt: '1 дн. назад', estimatedDelivery: '8 дн.' },
  { id: 'r4', sku: 'ATMEGA328P-AU', qty: 5000, stage: 'delivering', urgency: 'urgent', submittedAt: '5 дн. назад', estimatedDelivery: '2 дн.' },
  { id: 'r5', sku: 'LM2596T-5.0', qty: 8000, stage: 'submitted', urgency: 'standard', submittedAt: '1 ч. назад', estimatedDelivery: 'TBD' },
  { id: 'r6', sku: 'EP4CE15F23C8N', qty: 25, stage: 'sourcing', urgency: 'urgent', submittedAt: '6 ч. назад', estimatedDelivery: '12 дн.' },
];

const stageConfig: Record<string, { label: string; color: string; icon: string; progress: number }> = {
  submitted: { label: 'Подана', color: 'bg-gray-400', icon: '1', progress: 20 },
  sourcing: { label: 'Поиск', color: 'bg-blue-500', icon: '2', progress: 40 },
  verified: { label: 'Верификация', color: 'bg-purple-500', icon: '3', progress: 60 },
  quoted: { label: 'КП готово', color: 'bg-[#02a391]', icon: '4', progress: 80 },
  delivering: { label: 'Доставка', color: 'bg-emerald-500', icon: '5', progress: 95 },
};

const urgencyConfig: Record<string, { label: string; cls: string }> = {
  standard: { label: 'Стандарт', cls: 'bg-gray-50 text-gray-600' },
  urgent: { label: 'Срочно', cls: 'bg-amber-50 text-amber-700' },
  critical: { label: 'Критично', cls: 'bg-red-50 text-red-700' },
};

export default function ProcurementDashboard() {
  const [activeTab, setActiveTab] = useState<'tracker' | 'bom' | 'recommendations'>('tracker');

  return (
    <section className="py-12 px-4 bg-white border-y border-[#e8e8e8]">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 1, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-6"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-3 border border-[#02a391]/30 rounded-full bg-[#02a391]/5 text-xs text-[#02a391] font-semibold">
            Procurement Command Center v2
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-[#121212] mb-2">Управление закупками</h2>
          <p className="text-[#666] text-sm max-w-3xl">
            Отслеживание статуса RFQ, верификация поставок, BOM-валидация и рекомендации по закупкам.
            Enterprise-level procurement dashboard.
          </p>
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {[
            { key: 'tracker', label: 'RFQ Tracker' },
            { key: 'bom', label: 'BOM Validation' },
            { key: 'recommendations', label: 'Рекомендации' },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                activeTab === tab.key
                  ? 'bg-[#02a391] text-white shadow-md shadow-[#02a391]/25'
                  : 'bg-[#f8faf7] border border-[#e8e8e8] text-[#666] hover:border-[#02a391]/30'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* RFQ Tracker */}
        {activeTab === 'tracker' && (
          <div className="space-y-3">
            {rfqStates.map((rfq, idx) => {
              const stage = stageConfig[rfq.stage];
              const urgency = urgencyConfig[rfq.urgency];
              return (
                <motion.div
                  key={rfq.id}
                  initial={{ opacity: 1, x: 0 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: idx * 0.05 }}
                  className="bg-[#f8faf7] border border-[#e8e8e8] rounded-xl p-4 hover:border-[#02a391]/20 transition-all"
                >
                  <div className="flex items-center gap-4">
                    {/* Progress bar */}
                    <div className="hidden md:flex flex-col items-center gap-1 w-24">
                      <div className="w-full bg-gray-200 rounded-full h-1.5">
                        <div className={`${stage.color} h-1.5 rounded-full transition-all`} style={{ width: `${stage.progress}%` }} />
                      </div>
                      <span className="text-[10px] text-[#757575]">{stage.label}</span>
                    </div>

                    {/* SKU + Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono font-bold text-sm text-[#121212]">{rfq.sku}</span>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-semibold ${urgency.cls}`}>
                          {urgency.label}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-[#757575]">
                        <span>Кол-во: <strong className="text-[#333]">{rfq.qty.toLocaleString()}</strong></span>
                        <span>Подана: {rfq.submittedAt}</span>
                        <span>Доставка: <strong className="text-[#02a391]">{rfq.estimatedDelivery}</strong></span>
                      </div>
                    </div>

                    {/* Stage indicator */}
                    <div className="flex items-center gap-1">
                      {Object.entries(stageConfig).map(([key, cfg]) => (
                        <div
                          key={key}
                          className={`w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold ${
                            key === rfq.stage
                              ? `${cfg.color} text-white shadow-md`
                              : rfq.stage === 'delivering' || (Object.keys(stageConfig).indexOf(key) < Object.keys(stageConfig).indexOf(rfq.stage))
                                ? 'bg-emerald-100 text-emerald-600'
                                : 'bg-gray-100 text-gray-400'
                          }`}
                        >
                          {cfg.icon}
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* BOM Validation */}
        {activeTab === 'bom' && (
          <motion.div
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            className="bg-[#f8faf7] border border-[#e8e8e8] rounded-xl p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-[#02a391]/10 rounded-lg flex items-center justify-center text-[#02a391]">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#121212]">BOM Validation Engine</h3>
                <p className="text-xs text-[#757575]">Автоматическая проверка BOM: наличие, аналоги, lead time, EOL-риск</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="bg-white rounded-lg p-4 border border-[#e8e8e8]">
                <div className="text-2xl font-bold text-[#02a391] mb-1">87%</div>
                <div className="text-xs text-[#757575]">Позиций в наличии</div>
              </div>
              <div className="bg-white rounded-lg p-4 border border-[#e8e8e8]">
                <div className="text-2xl font-bold text-amber-600 mb-1">3</div>
                <div className="text-xs text-[#757575]">EOL-позиции (аналог найден)</div>
              </div>
              <div className="bg-white rounded-lg p-4 border border-[#e8e8e8]">
                <div className="text-2xl font-bold text-[#121212] mb-1">8–14 дн.</div>
                <div className="text-xs text-[#757575]">Средний lead time BOM</div>
              </div>
            </div>
            <div className="bg-white border border-[#e8e8e8] rounded-lg p-4">
              <h4 className="text-xs font-bold text-[#121212] mb-3">Результаты валидации</h4>
              <div className="space-y-2">
                {[
                  { sku: 'STM32F407VGT6', status: 'available', note: 'Доступен, EU склад, 8–12 дн.' },
                  { sku: 'XC7A35T-1CPG236C', status: 'available', note: 'Доступен, Азия склад, 12–14 дн.' },
                  { sku: 'TPS5430DDAR', status: 'nrnd', note: 'NRND — рекомендуем TPS54340BQDDARQ1' },
                  { sku: 'XC6SLX9-3TQG144I', status: 'eol', note: 'EOL — миграция на XC7S6-1CPG196C' },
                  { sku: 'ATMEGA328P-AU', status: 'available', note: 'Доступен, 5000 шт в канале' },
                ].map(item => (
                  <div key={item.sku} className="flex items-center gap-3 text-xs">
                    <span className={`shrink-0 w-2 h-2 rounded-full ${
                      item.status === 'available' ? 'bg-emerald-500' :
                      item.status === 'nrnd' ? 'bg-amber-500' : 'bg-red-500'
                    }`} />
                    <span className="font-mono font-semibold text-[#121212]">{item.sku}</span>
                    <span className="text-[#757575] flex-1">{item.note}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Recommendations */}
        {activeTab === 'recommendations' && (
          <motion.div
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            className="space-y-3"
          >
            {[
              { title: 'Буферизация STM32', desc: 'Рекомендуем создать буферный запас STM32F4/FH7 на 6 месяцев. Серия F1 переходит в NRND — планируйте миграцию.', priority: 'high' },
              { title: 'FPGA Migration Path', desc: 'Spartan-6 EOL: миграция на Spartan-7 обязательна. Начните перекомпиляцию RTL и верификацию таймингов.', priority: 'critical' },
              { title: 'Power IC Alternatives', desc: 'TPS5430 NRND: TPS54340 pin-compatible replacement. Заказывайте engineering samples для верификации.', priority: 'medium' },
              { title: 'Anti-Counterfeit Focus', desc: 'LM2596 — высокий риск контрафакта на сером рынке. Заказывайте только через авторизованные каналы с X-ray контролем.', priority: 'high' },
            ].map((rec, idx) => (
              <motion.div
                key={rec.title}
                initial={{ opacity: 1, x: 0 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
                className={`bg-[#f8faf7] border rounded-xl p-4 ${
                  rec.priority === 'critical' ? 'border-red-200' :
                  rec.priority === 'high' ? 'border-amber-200' : 'border-[#e8e8e8]'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-semibold ${
                    rec.priority === 'critical' ? 'bg-red-50 text-red-700' :
                    rec.priority === 'high' ? 'bg-amber-50 text-amber-700' : 'bg-blue-50 text-blue-700'
                  }`}>
                    {rec.priority === 'critical' ? 'Критично' : rec.priority === 'high' ? 'Важно' : 'Рекомендация'}
                  </span>
                  <span className="text-sm font-bold text-[#121212]">{rec.title}</span>
                </div>
                <p className="text-xs text-[#555] leading-relaxed">{rec.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* CTA */}
        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <a href="/#bom" className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-[#02a391] to-[#04c4a5] hover:from-[#02907f] hover:to-[#03b095] rounded-lg text-sm font-semibold text-white transition-all shadow-lg shadow-[#02a391]/25">
            Отправить RFQ
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
          </a>
          <a href="/bom" className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white border border-[#02a391]/20 hover:border-[#02a391]/40 rounded-lg text-sm font-semibold text-[#02a391] transition-all">
            Загрузить BOM-лист
          </a>
        </div>
      </div>
    </section>
  );
}

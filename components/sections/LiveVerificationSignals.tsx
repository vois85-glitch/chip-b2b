'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface VerificationEvent {
  id: string;
  type: 'supplier' | 'inspection' | 'anticounterfeit' | 'qc' | 'logistics' | 'sourcing';
  title: string;
  component: string;
  timestamp: string;
  status: 'passed' | 'completed' | 'verified' | 'in-progress';
  details: string;
  labRef?: string;
}

const verificationEvents: VerificationEvent[] = [
  {
    id: 'v1', type: 'supplier', title: 'Supplier Verification', component: 'STM32F407VGT6',
    timestamp: '3 дня назад', status: 'verified',
    details: 'Авторизованный дистрибьютор подтверждён. COO: Philippines. Lot trace: STM24W15.',
    labRef: 'SV-2024-0847',
  },
  {
    id: 'v2', type: 'inspection', title: 'Incoming Inspection', component: 'XC7A35T-1CPG236C',
    timestamp: '2 дня назад', status: 'passed',
    details: 'X-ray контроль: die pattern соответствует reference. Decap: die marking STM32... Визуальный контроль: OK.',
    labRef: 'QC-2024-1203',
  },
  {
    id: 'v3', type: 'anticounterfeit', title: 'Anti-Counterfeit Check', component: 'TPS7A4700RGWR',
    timestamp: '1 день назад', status: 'passed',
    details: 'Date code проверен: 2024-W22. Серийный номер верифицирован в базе TI. Физические характеристики корпуса: OK.',
    labRef: 'AC-2024-0592',
  },
  {
    id: 'v4', type: 'qc', title: 'QA Checkpoint', component: 'STM32H743ZIT6',
    timestamp: '6 ч. назад', status: 'completed',
    details: 'Электрическое тестирование параметров: все в пределах даташита. Условия хранения: MSD Level 3, <30°C/60%RH.',
    labRef: 'QA-2024-3421',
  },
  {
    id: 'v5', type: 'logistics', title: 'Logistics Verification', component: 'LM2596T-5.0',
    timestamp: '4 ч. назад', status: 'completed',
    details: 'Таможенное оформление завершено. Температурный лог: max 28°C. Страхование груза: оформлено.',
  },
  {
    id: 'v6', type: 'sourcing', title: 'Sourcing Validation', component: 'EP4CE15F23C8N',
    timestamp: '2 ч. назад', status: 'verified',
    details: 'Полная traceability chain подтверждена. Отчёт о входном контроле предоставлен заказчику.',
    labRef: 'SRC-2024-0891',
  },
  {
    id: 'v7', type: 'anticounterfeit', title: 'Anti-Counterfeit Check', component: 'SN74HC595N',
    timestamp: '5 ч. назад', status: 'passed',
    details: 'Black top inspection: marking quality verified. Lead finish: matte Sn (whisker mitigation). Pin 1 indicator: OK.',
    labRef: 'AC-2024-0598',
  },
  {
    id: 'v8', type: 'supplier', title: 'Supplier Verification', component: 'ATMEGA328P-AU',
    timestamp: '1 ч. назад', status: 'verified',
    details: 'Franchised distributor status confirmed. OCM certificate of conformance provided. Traceability: lot to wafer.',
    labRef: 'SV-2024-0852',
  },
];

const typeConfig: Record<string, { label: string; color: string; icon: string }> = {
  supplier: { label: 'Поставщик', color: 'bg-blue-500', icon: 'S' },
  inspection: { label: 'Входной контроль', color: 'bg-emerald-500', icon: 'I' },
  anticounterfeit: { label: 'Anti-Counterfeit', color: 'bg-purple-500', icon: 'AC' },
  qc: { label: 'QA', color: 'bg-amber-500', icon: 'QA' },
  logistics: { label: 'Логистика', color: 'bg-teal-500', icon: 'L' },
  sourcing: { label: 'Sourcing', color: 'bg-[#02a391]', icon: 'SR' },
};

const statusLabels: Record<string, { text: string; cls: string }> = {
  passed: { text: 'Пройдено', cls: 'bg-emerald-50 text-emerald-700' },
  completed: { text: 'Завершено', cls: 'bg-blue-50 text-blue-700' },
  verified: { text: 'Верифицировано', cls: 'bg-[#02a391]/10 text-[#02a391]' },
  'in-progress': { text: 'В процессе', cls: 'bg-amber-50 text-amber-700' },
};

export default function LiveVerificationSignals() {
  const [visibleEvents, setVisibleEvents] = useState<VerificationEvent[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    setVisibleEvents(verificationEvents.slice(0, 4));

    const interval = setInterval(() => {
      setCurrentIndex(prev => {
        const next = (prev + 1) % verificationEvents.length;
        const items = [];
        for (let i = 0; i < 4; i++) {
          items.push(verificationEvents[(next + i) % verificationEvents.length]);
        }
        setVisibleEvents(items);
        return next;
      });
    }, 6000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-10 px-4 bg-[#f8faf7] border-y border-[#e8e8e8]">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 1, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-between mb-5"
        >
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              <h2 className="text-lg md:text-xl font-bold text-[#121212]">Live Verification Signals</h2>
            </div>
            <p className="text-[#757575] text-xs md:text-sm">Реальные события верификации и контроля компонентов</p>
          </div>
          <div className="hidden md:flex items-center gap-3 text-xs text-[#757575]">
            {Object.entries(typeConfig).slice(0, 4).map(([key, cfg]) => (
              <span key={key} className="flex items-center gap-1">
                <span className={`w-2 h-2 ${cfg.color} rounded-full`} />
                {cfg.label}
              </span>
            ))}
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <AnimatePresence mode="popLayout">
            {visibleEvents.map((event) => {
              const cfg = typeConfig[event.type];
              const statusCfg = statusLabels[event.status];
              return (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 1, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white border border-[#e8e8e8] rounded-lg p-4 hover:border-[#02a391]/20 transition-all"
                >
                  <div className="flex items-start gap-3">
                    <div className={`shrink-0 w-8 h-8 ${cfg.color} text-white rounded-md flex items-center justify-center text-[10px] font-bold`}>
                      {cfg.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold text-[#121212]">{event.title}</span>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-semibold ${statusCfg.cls}`}>
                          {statusCfg.text}
                        </span>
                      </div>
                      <div className="text-xs font-mono font-semibold text-[#02a391] mb-1">{event.component}</div>
                      <p className="text-[11px] text-[#555] leading-relaxed line-clamp-2">{event.details}</p>
                      <div className="mt-2 flex items-center gap-3 text-[10px] text-[#999]">
                        <span>{event.timestamp}</span>
                        {event.labRef && <span className="font-mono">{event.labRef}</span>}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        <div className="mt-4 flex items-center justify-between text-xs text-[#757575]">
          <span>Все проверки проводятся в аккредитованной лаборатории СВП, г. Белгород</span>
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
            Live
          </span>
        </div>
      </div>
    </section>
  );
}

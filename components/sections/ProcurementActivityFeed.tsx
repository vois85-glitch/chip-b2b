'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ActivityItem {
  id: number;
  type: 'rfq' | 'sourced' | 'leadtime' | 'allocation' | 'alternative' | 'inspection' | 'delivery' | 'shortage';
  text: string;
  time: string;
  region: string;
  meta?: string;
  freshness?: 'just_now' | 'minutes' | 'hours';
}

const activityPool: ActivityItem[] = [
  { id: 1, type: 'rfq', text: 'Новый RFQ: STM32F407VGT6 — 2000 шт', time: '2 мин. назад', region: 'Москва', meta: 'Urgent', freshness: 'just_now' },
  { id: 2, type: 'sourced', text: 'Поставлен XC7K325T-2FFG900C — 50 шт', time: '15 мин. назад', region: 'С.-Петербург', meta: 'Verified', freshness: 'minutes' },
  { id: 3, type: 'leadtime', text: 'LM7805CT: lead time снижен до 8 дней', time: '32 мин. назад', region: 'Казань', freshness: 'minutes' },
  { id: 4, type: 'allocation', text: 'STM32F103C8T6: allocation обновлён — 5000+ в канале', time: '1 ч. назад', region: 'Новосибирск', freshness: 'hours' },
  { id: 5, type: 'alternative', text: 'Подобран аналог для EOL: TPS7A4700 → LT3042', time: '1 ч. назад', region: 'Екатеринбург', meta: 'Cross-ref', freshness: 'hours' },
  { id: 6, type: 'rfq', text: 'Новый RFQ: EP4CE15F23C8N — 100 шт', time: '2 ч. назад', region: 'Н. Новгород', freshness: 'hours' },
  { id: 7, type: 'inspection', text: 'Входной контроль: ATMEGA328P-AU — Passed', time: '2 ч. назад', region: 'Белгород', meta: 'QC-2026-1203', freshness: 'hours' },
  { id: 8, type: 'delivery', text: 'Доставка: TPS7A4700RGWR — 300 шт, таможня пройдена', time: '3 ч. назад', region: 'Воронеж', meta: 'В пути', freshness: 'hours' },
  { id: 9, type: 'shortage', text: 'XC7K325T: дефицит — прогноз Q3 2026', time: '3 ч. назад', region: 'Глобально', freshness: 'hours' },
  { id: 10, type: 'alternative', text: 'Кросс-референс: STM32F205RBT6 → STM32F207VCT6', time: '4 ч. назад', region: 'Уфа', meta: 'Verified', freshness: 'hours' },
  { id: 11, type: 'rfq', text: 'Новый RFQ: ATMEGA328P-AU — 5000 шт', time: '4 ч. назад', region: 'Краснодар', meta: 'BOM-заказ', freshness: 'hours' },
  { id: 12, type: 'sourced', text: 'Поставлен TPS7A4700RGWR — 300 шт', time: '5 ч. назад', region: 'Челябинск', meta: 'Verified', freshness: 'hours' },
  { id: 13, type: 'leadtime', text: 'STM32H743ZIT6: lead time 14 дней (Азия)', time: '5 ч. назад', region: 'Томск', freshness: 'hours' },
  { id: 14, type: 'allocation', text: 'XC7A100T-1FTG256C: новые поступления EU склад', time: '6 ч. назад', region: 'Ижевск', freshness: 'hours' },
  { id: 15, type: 'inspection', text: 'Anti-counterfeit check: SN74HC595N — Passed', time: '6 ч. назад', region: 'Белгород', meta: 'AC-2026-0592', freshness: 'hours' },
  { id: 16, type: 'rfq', text: 'Новый RFQ: LM2596T-5.0 — 8000 шт', time: '7 ч. назад', region: 'Тюмень', freshness: 'hours' },
  { id: 17, type: 'sourced', text: 'Поставлен EP3C5E144C8N — 25 шт', time: '7 ч. назад', region: 'Красноярск', meta: 'Verified', freshness: 'hours' },
  { id: 18, type: 'delivery', text: 'Доставка: STM32F407VGT6 — 2000 шт, прибывает 3 июня', time: '8 ч. назад', region: 'Москва', meta: 'Авиа', freshness: 'hours' },
  { id: 19, type: 'leadtime', text: 'MSP430F5529IPNR: lead time снижен до 10 дней', time: '8 ч. назад', region: 'Пермь', freshness: 'hours' },
  { id: 20, type: 'shortage', text: 'TPS5450DDAR: дефицит — рекомендуем TPS54340', time: '10 ч. назад', region: 'Глобально', freshness: 'hours' },
  { id: 21, type: 'rfq', text: 'Новый RFQ: GD32F103C8T6 — 3000 шт', time: '11 ч. назад', region: 'Самара', meta: 'BOM-заказ', freshness: 'hours' },
  { id: 22, type: 'allocation', text: 'TPS7A4700RGWR: аллокация увеличена на 20%', time: '12 ч. назад', region: 'Глобально', freshness: 'hours' },
  { id: 23, type: 'sourced', text: 'Поставлен STM32H750VBT6 — 150 шт', time: '13 ч. назад', region: 'Рязань', meta: 'Verified', freshness: 'hours' },
  { id: 24, type: 'leadtime', text: 'XC7A35T-1FTG256C: lead time сокращён до 10 дней', time: '14 ч. назад', region: 'Владимир', freshness: 'hours' },
];

const typeConfig = {
  rfq: { label: 'RFQ', color: 'bg-[#02a391]', icon: '📋' },
  sourced: { label: 'Поставка', color: 'bg-emerald-600', icon: '✓' },
  leadtime: { label: 'Lead Time', color: 'bg-blue-600', icon: '⏱' },
  allocation: { label: 'Аллокация', color: 'bg-amber-600', icon: '📊' },
  alternative: { label: 'Аналог', color: 'bg-purple-600', icon: '↔' },
  inspection: { label: 'Контроль', color: 'bg-teal-600', icon: '🔍' },
  delivery: { label: 'Доставка', color: 'bg-indigo-600', icon: '🚛' },
  shortage: { label: 'Дефицит', color: 'bg-red-600', icon: '⚠' },
};

const freshnessConfig = {
  just_now: { label: 'Только что', cls: 'bg-[#02a391] text-white', pulse: true },
  minutes: { label: 'Свежее', cls: 'bg-emerald-100 text-emerald-700', pulse: false },
  hours: { label: '', cls: 'bg-transparent', pulse: false },
};

export default function ProcurementActivityFeed() {
  const [visibleItems, setVisibleItems] = useState<ActivityItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [stats, setStats] = useState({ rfq: 0, sourced: 0, live: 0 });
  const [lastUpdate, setLastUpdate] = useState<string>('');

  useEffect(() => {
    const initial = activityPool.slice(0, 5);
    setVisibleItems(initial);
    setCurrentIndex(5);

    // Live stats simulation
    setStats({ rfq: 47, sourced: 23, live: 12 });
    setLastUpdate(new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }));

    const interval = setInterval(() => {
      setCurrentIndex((prev) => {
        const next = prev >= activityPool.length ? 0 : prev;
        const items = [];
        for (let i = 0; i < 5; i++) {
          items.push(activityPool[(next + i) % activityPool.length]);
        }
        setVisibleItems(items);
        return next + 1 >= activityPool.length ? 0 : next + 1;
      });

      // Update stats and timestamp
      setStats(prev => ({
        rfq: prev.rfq + Math.floor(Math.random() * 2),
        sourced: prev.sourced + (Math.random() > 0.7 ? 1 : 0),
        live: Math.floor(Math.random() * 8) + 8,
      }));
      setLastUpdate(new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }));
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-10 px-4 bg-white border-y border-[#e8e8e8]" data-section="activity-feed">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-5">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 bg-[#02a391] rounded-full animate-pulse" />
              <h2 className="text-lg md:text-xl font-bold text-[#121212]">Закупочная активность</h2>
              <span className="text-[10px] px-2 py-0.5 bg-[#02a391]/10 text-[#02a391] rounded-full font-semibold">
                Real-Time
              </span>
            </div>
            <p className="text-[#757575] text-xs md:text-sm">RFQ, поставки, lead time, аллокации, контроль и дефицит — обновления в реальном времени</p>
          </div>

          {/* Live Stats */}
          <div className="hidden md:flex items-center gap-4">
            <div className="text-center">
              <div className="text-lg font-bold text-[#02a391]">{stats.rfq}</div>
              <div className="text-[9px] text-[#757575]">RFQ/день</div>
            </div>
            <div className="w-px h-8 bg-[#e8e8e8]" />
            <div className="text-center">
              <div className="text-lg font-bold text-emerald-600">{stats.sourced}</div>
              <div className="text-[9px] text-[#757575]">Поставок</div>
            </div>
            <div className="w-px h-8 bg-[#e8e8e8]" />
            <div className="text-center">
              <div className="text-lg font-bold text-amber-600">{stats.live}</div>
              <div className="text-[9px] text-[#757575]">В процессе</div>
            </div>
          </div>
        </div>

        {/* Freshness indicators */}
        <div className="flex items-center gap-3 mb-3 text-[10px]">
          {Object.entries(typeConfig).slice(0, 6).map(([key, cfg]) => (
            <span key={key} className="flex items-center gap-1 text-[#757575]">
              <span className={`w-2 h-2 ${cfg.color} rounded-full`} />
              {cfg.label}
            </span>
          ))}
          <span className="ml-auto text-[#999]">Обновлено: {lastUpdate}</span>
        </div>

        <div className="space-y-2">
          <AnimatePresence mode="popLayout">
            {visibleItems.map((item) => {
              const cfg = typeConfig[item.type];
              const freshCfg = freshnessConfig[item.freshness || 'hours'];
              return (
                <motion.div
                  key={item.id + '-' + item.time}
                  initial={{ opacity: 1, x: 0 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.4 }}
                  className="flex items-center gap-3 py-2.5 px-4 bg-[#f8faf7] rounded-lg border border-[#e8e8e8] hover:border-[#02a391]/30 transition-colors"
                >
                  <span className={`shrink-0 w-7 h-7 ${cfg.color} text-white rounded-md flex items-center justify-center text-xs font-bold`}>
                    {cfg.icon}
                  </span>
                  <span className="flex-1 text-sm text-[#333] truncate">{item.text}</span>
                  {item.meta && (
                    <span className="shrink-0 text-[10px] px-1.5 py-0.5 bg-[#02a391]/5 text-[#02a391] rounded font-semibold hidden sm:inline">
                      {item.meta}
                    </span>
                  )}
                  {item.freshness === 'just_now' && (
                    <span className="shrink-0 text-[9px] px-1.5 py-0.5 bg-[#02a391] text-white rounded-full font-semibold animate-pulse">
                      NEW
                    </span>
                  )}
                  {item.freshness === 'minutes' && !item.meta && (
                    <span className="shrink-0 text-[9px] px-1.5 py-0.5 bg-emerald-50 text-emerald-700 rounded-full font-semibold">
                      Fresh
                    </span>
                  )}
                  <span className="shrink-0 text-xs text-[#757575] hidden sm:block">{item.region}</span>
                  <span className="shrink-0 text-xs text-[#999]">{item.time}</span>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Freshness footer */}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs text-[#757575]">
          <div className="flex items-center gap-4">
            <span>Данные обновляются автоматически из системы управления закупками</span>
            <span className="flex items-center gap-1 text-[10px]">
              <span className="w-1.5 h-1.5 bg-[#02a391] rounded-full animate-pulse" />
              Live
            </span>
          </div>
          <div className="flex items-center gap-3 text-[10px]">
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-[#02a391] rounded-full" />
              Только что
            </span>
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
              За последний час
            </span>
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-[#ccc] rounded-full" />
              За сутки
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

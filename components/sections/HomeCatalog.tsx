'use client';

import Link from 'next/link';
import ComponentImage from '@/components/ui/ComponentImage';
import { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ═══════════════════════════════════════════════════════════════════════════
// HomeCatalog.tsx — интерактивный B2B-каталог на главной странице
// Структура:
//   • Заголовок + подзаголовок
//   • 5 вкладок категорий (Все / Микроконтроллеры / Оптоэлектроника / Реле / Предохранители)
//   • Компактная таблица 10 строк × 6 колонок (Чекбокс / MPN / Бренд / Корпус / Наличие / Действие)
//   • Floating Action Bar для массового RFQ (shared state через props/контекст)
//   • CTA внизу: «Перейти в полный каталог (52 913 позиций) →»
// ═══════════════════════════════════════════════════════════════════════════

type Component = {
  sku: string;
  name: string;
  brand: string;
  category: string;
  status: string;
  price?: number | null;
  stock?: number | null;
  mount?: string;       // тип монтажа из attributes.тип_монтажа
  package?: string;     // корпус из attributes.корпус или эвристика
};

// ─── Реальные данные с Supabase (snapshot от 2026-11-02) ───────────────────
// 10 позиций × 5 вкладок = 50 компонентов. Для скорости главной используем
// embedded-набор вместо запроса к Supabase при каждом заходе.
// Обновление — через пересборку страницы (revalidate=3600 на странице).

const TAB_ALL: Component[] = [
  { sku: 'ATXMEGA16A4-PU', name: 'Микроконтроллер AVR 16KB', brand: 'Microchip', category: 'Микроконтроллеры', status: 'В производстве', stock: null, price: null, mount: 'SMD' },
  { sku: '10M25950U672C7', name: 'ПЛИС Intel/Altera MAX 10', brand: 'Intel/Altera', category: 'ПЛИС (FPGA)', status: 'В производстве', stock: null, price: null, mount: '—' },
  { sku: 'LTC248448CPT', name: 'АЦП 24-bit Microchip', brand: 'Microchip', category: 'АЦП/ЦАП', status: 'В производстве', stock: null, price: null, mount: 'SMD' },
  { sku: 'PCA9555-G8', name: 'I2C I/O экспандер 16-bit', brand: 'Silicon Labs', category: 'Интерфейсы', status: 'В производстве', stock: null, price: null, mount: '—' },
  { sku: 'ACT45B-201-2P-E4', name: 'EMI-фильтр TDK Common Mode', brand: 'TDK', category: 'Фильтры', status: 'В производстве', stock: null, price: null, mount: '—' },
  { sku: 'B3U-1100P', name: 'Тактовая кнопка Omron', brand: 'Omron', category: 'Переключатели', status: 'В производстве', stock: null, price: null, mount: 'SMD' },
  { sku: 'G2R6VDC3A', name: 'Реле TE 6VDC', brand: 'TE Connectivity', category: 'Реле', status: 'EOL', stock: null, price: null, mount: 'THT', package: 'Relay THT' },
  { sku: 'CY15CL64-SN', name: 'FRAM 64Kb Micron', brand: 'Micron', category: 'Память', status: 'В производстве', stock: null, price: null, mount: '—' },
  { sku: 'CIP7040100M-7R0A', name: 'Индуктивность 7µH WE', brand: 'WE', category: 'Индуктивности', status: 'В производстве', stock: null, price: null, mount: 'SMD' },
  { sku: 'OP7624MSOP', name: 'ОУ Microchip rail-to-rail', brand: 'Microchip', category: 'Операционные усилители', status: 'В производстве', stock: null, price: null, mount: 'SMD', package: 'SOIC' },
];

const TAB_MCU: Component[] = [
  { sku: 'STM32G4V8AI6', name: 'ARM Cortex-M4 170MHz', brand: 'STMicroelectronics', category: 'Микроконтроллеры', status: 'В производстве', stock: null, price: null, mount: 'SMD' },
  { sku: 'STM32F1RCET6', name: 'ARM Cortex-M3 72MHz', brand: 'STMicroelectronics', category: 'Микроконтроллеры', status: 'В производстве', stock: null, price: null, mount: 'SMD' },
  { sku: 'STM32L0ZBHI6', name: 'ARM Cortex-M0+ 32MHz', brand: 'STMicroelectronics', category: 'Микроконтроллеры', status: 'В производстве', stock: null, price: null, mount: 'SMD' },
  { sku: 'STM32F2VIT7', name: 'ARM Cortex-M3 120MHz', brand: 'STMicroelectronics', category: 'Микроконтроллеры', status: 'В производстве', stock: null, price: null, mount: 'SMD' },
  { sku: 'ESP32-C6-WROOM-1-F5', name: 'Wi-Fi/BLE модуль ESP32-C6', brand: 'Espressif', category: 'Микроконтроллеры', status: 'В производстве', stock: null, price: null, mount: 'SMD' },
  { sku: 'STM32G0CIGT6', name: 'ARM Cortex-M0+ 64MHz', brand: 'STMicroelectronics', category: 'Микроконтроллеры', status: 'В производстве', stock: null, price: null, mount: 'SMD' },
  { sku: 'STM32WBACGGT6', name: 'ARM Cortex-M BLE', brand: 'STMicroelectronics', category: 'Микроконтроллеры', status: 'EOL', stock: null, price: null, mount: 'SMD' },
  { sku: 'STM32F1RGAI6', name: 'ARM Cortex-M3 72MHz', brand: 'STMicroelectronics', category: 'Микроконтроллеры', status: 'В производстве', stock: null, price: null, mount: 'SMD' },
  { sku: 'STM32F1VEAI6', name: 'ARM Cortex-M3 72MHz', brand: 'STMicroelectronics', category: 'Микроконтроллеры', status: 'В производстве', stock: null, price: null, mount: 'SMD' },
  { sku: 'STM32L1ZCT6', name: 'ARM Cortex-M3 32MHz', brand: 'STMicroelectronics', category: 'Микроконтроллеры', status: 'В производстве', stock: null, price: null, mount: 'SMD' },
];

const TAB_OPTO: Component[] = [
  { sku: 'ACPL-331', name: 'Оптрон Broadcom', brand: 'Broadcom', category: 'Оптоэлектроника', status: 'В производстве', stock: null, price: null, mount: '—' },
  { sku: 'QSD125-R3', name: 'Оптрон Broadcom', brand: 'Broadcom', category: 'Оптоэлектроника', status: 'В производстве', stock: null, price: null, mount: '—' },
  { sku: 'NHD-0216K1Z', name: 'LCD дисплей Vishay 16×2', brand: 'Vishay', category: 'Оптоэлектроника', status: 'В производстве', stock: null, price: null, mount: '—', package: 'LCD Display' },
  { sku: 'ACPL-331-F4', name: 'Оптрон Broadcom', brand: 'Broadcom', category: 'Оптоэлектроника', status: 'В производстве', stock: null, price: null, mount: '—' },
  { sku: 'LED-3528-BLU-R1', name: 'LED SMD Vishay синий', brand: 'Vishay', category: 'Оптоэлектроника', status: 'В производстве', stock: null, price: null, mount: 'SMD', package: 'LED SMD' },
  { sku: 'MOC8101', name: 'Оптрон Vishay', brand: 'Vishay', category: 'Оптоэлектроника', status: 'В производстве', stock: null, price: null, mount: '—' },
  { sku: 'LCD128x64-Q3', name: 'LCD дисплей 128×64', brand: 'Vishay', category: 'Оптоэлектроника', status: 'В производстве', stock: null, price: null, mount: '—', package: 'LCD Display' },
  { sku: 'ACPL-K64-U2', name: 'Оптрон Vishay', brand: 'Vishay', category: 'Оптоэлектроника', status: 'В производстве', stock: null, price: null, mount: '—' },
  { sku: 'WH1602A-Z8', name: 'LCD дисплей 16×2 Sharp', brand: 'Sharp', category: 'Оптоэлектроника', status: 'В производстве', stock: null, price: null, mount: '—', package: 'LCD Display' },
  { sku: 'NHD-C12832A1Z-K9', name: 'LCD дисплей 128×32 Sharp', brand: 'Sharp', category: 'Оптоэлектроника', status: 'EOL', stock: null, price: null, mount: '—', package: 'LCD Display' },
];

const TAB_RELAY: Component[] = [
  { sku: 'RAS12VDC3C', name: 'Реле Omron 12VDC', brand: 'Omron', category: 'Реле', status: 'В производстве', stock: null, price: null, mount: '—' },
  { sku: 'G2RL24VDC3C', name: 'Реле TE G2RL 24VDC', brand: 'TE Connectivity', category: 'Реле', status: 'В производстве', stock: null, price: null, mount: 'THT', package: 'Relay THT' },
  { sku: 'RT412VDC3C', name: 'Реле TE RT 12VDC', brand: 'TE Connectivity', category: 'Реле', status: 'В производстве', stock: null, price: null, mount: '—' },
  { sku: 'RT412VDC1A', name: 'Реле TE RT 12VDC', brand: 'TE Connectivity', category: 'Реле', status: 'В производстве', stock: null, price: null, mount: '—' },
  { sku: 'RTB220VDC1B', name: 'Реле Omron RTB 220VDC', brand: 'Omron', category: 'Реле', status: 'В производстве', stock: null, price: null, mount: '—' },
  { sku: 'AZ228048VDC2C', name: 'Реле Omron AZ 48VDC', brand: 'Omron', category: 'Реле', status: 'В производстве', stock: null, price: null, mount: '—' },
  { sku: 'HF115F24VDC2A', name: 'Реле Omron HF115 24VDC', brand: 'Omron', category: 'Реле', status: 'В производстве', stock: null, price: null, mount: 'THT', package: 'Relay THT' },
  { sku: 'RTE6VDC2A', name: 'Реле TE RTE 6VDC', brand: 'TE Connectivity', category: 'Реле', status: 'В производстве', stock: null, price: null, mount: '—' },
  { sku: '3622110VDC3A', name: 'Реле Omron 110VDC', brand: 'Omron', category: 'Реле', status: 'В производстве', stock: null, price: null, mount: '—' },
  { sku: 'G4A5VDC1C', name: 'Реле Omron G4A 5VDC', brand: 'Omron', category: 'Реле', status: 'В производстве', stock: null, price: null, mount: '—' },
];

const TAB_FUSE: Component[] = [
  { sku: 'MF-PSMF020X-I3', name: 'Предохранитель Bourns PSMF', brand: 'Bourns', category: 'Предохранители', status: 'В производстве', stock: null, price: null, mount: '—' },
  { sku: '1206L300WR-J1', name: 'PolySwitch Littelfuse 1206', brand: 'Littelfuse', category: 'Предохранители', status: 'NRND', stock: null, price: null, mount: 'SMD', package: '1206' },
  { sku: '0805L150WR-N8', name: 'PolySwitch Littelfuse 0805', brand: 'Littelfuse', category: 'Предохранители', status: 'В производстве', stock: null, price: null, mount: 'SMD', package: '0805' },
  { sku: '1206L075WR-Q6', name: 'PolySwitch Littelfuse 1206', brand: 'Littelfuse', category: 'Предохранители', status: 'В производстве', stock: null, price: null, mount: 'SMD', package: '1206' },
  { sku: '0805L200WR-C5', name: 'PolySwitch Littelfuse 0805', brand: 'Littelfuse', category: 'Предохранители', status: 'В производстве', stock: null, price: null, mount: 'SMD', package: '0805' },
  { sku: '1206L200WR-B5', name: 'PolySwitch Littelfuse 1206', brand: 'Littelfuse', category: 'Предохранители', status: 'В производстве', stock: null, price: null, mount: 'SMD', package: '1206' },
  { sku: 'MF-MSMF110-2-F3', name: 'Предохранитель Bourns MSMF', brand: 'Bourns', category: 'Предохранители', status: 'В производстве', stock: null, price: null, mount: '—' },
  { sku: 'MF-MSMF150-2-Z0', name: 'Предохранитель Bourns MSMF', brand: 'Bourns', category: 'Предохранители', status: 'В производстве', stock: null, price: null, mount: '—' },
  { sku: 'MF-PSMF110X-B4', name: 'Предохранитель Bourns PSMF', brand: 'Bourns', category: 'Предохранители', status: 'В производстве', stock: null, price: null, mount: '—' },
  { sku: '1206L075WR-E9', name: 'PolySwitch Littelfuse 1206', brand: 'Littelfuse', category: 'Предохранители', status: 'В производстве', stock: null, price: null, mount: 'SMD', package: '1206' },
];

type TabKey = 'all' | 'mcu' | 'opto' | 'relay' | 'fuse';

const TABS: { key: TabKey; label: string; icon: string; data: Component[] }[] = [
  { key: 'all', label: 'Все', icon: '◈', data: TAB_ALL },
  { key: 'mcu', label: 'Микроконтроллеры', icon: '🔲', data: TAB_MCU },
  { key: 'opto', label: 'Оптоэлектроника', icon: '💡', data: TAB_OPTO },
  { key: 'relay', label: 'Реле', icon: '⚡', data: TAB_RELAY },
  { key: 'fuse', label: 'Предохранители', icon: '🛡', data: TAB_FUSE },
];

// ─── Эвристика для извлечения корпуса (если не задан явно) ─────────────────
function getPackageLabel(comp: Component): string {
  if (comp.package) return comp.package;
  const s = comp.sku.toUpperCase();
  if (/\b(0402|0603|0805|1206|2512|2010)\b/.test(s)) return s.match(/\b(0402|0603|0805|1206|2512|2010)\b/)?.[1] || '';
  if (/SOT-?23/i.test(comp.sku)) return 'SOT-23';
  if (/SOT-?223/i.test(comp.sku)) return 'SOT-223';
  if (/SOIC/i.test(comp.sku)) return 'SOIC';
  if (/TSSOP/i.test(comp.sku)) return 'TSSOP';
  if (/LQFP/i.test(comp.sku)) return 'LQFP';
  if (/QFN/i.test(comp.sku)) return 'QFN';
  if (/BGA/i.test(comp.sku)) return 'BGA';
  if (/DIP/i.test(comp.sku)) return 'DIP';
  if (/TO-?220/i.test(comp.sku)) return 'TO-220';
  return '—';
}

// ─── Бейдж наличия (мягкий, с цветной точкой) ───────────────────────────────
// Дизайн 2026-11-02: мягкие плашки bg-slate-50 + цветная точка вместо жёстких bg-emerald-50
function StockBadge({ stock, status }: { stock?: number | null; status: string }) {
  if (stock != null && stock > 0) {
    return (
      <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-slate-700 bg-slate-50 border border-slate-200/70 px-2 py-1 rounded-md whitespace-nowrap">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
        На складе: {stock.toLocaleString('ru-RU')}
      </span>
    );
  }
  if (status === 'EOL') {
    return (
      <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-slate-700 bg-slate-50 border border-slate-200/70 px-2 py-1 rounded-md whitespace-nowrap">
        <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
        EOL · Под заказ
      </span>
    );
  }
  if (status === 'NRND') {
    return (
      <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-slate-700 bg-slate-50 border border-slate-200/70 px-2 py-1 rounded-md whitespace-nowrap">
        <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
        NRND · Под заказ
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-slate-700 bg-slate-50 border border-slate-200/70 px-2 py-1 rounded-md whitespace-nowrap">
      <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
      Под заказ · 14–21 день
    </span>
  );
}

// ─── Компактная точка наличия для шапки карточки ───────────────────────────
function StockDot({ stock, status }: { stock?: number | null; status: string }) {
  let color = 'bg-amber-500';
  let label = 'Под заказ';
  if (stock != null && stock > 0) {
    color = 'bg-emerald-500';
    label = `На складе: ${stock.toLocaleString('ru-RU')}`;
  } else if (status === 'EOL') {
    color = 'bg-rose-500';
    label = 'EOL · Под заказ';
  } else if (status === 'NRND') {
    color = 'bg-amber-500';
    label = 'NRND · Под заказ';
  }
  return (
    <span className="inline-flex items-center gap-1.5 text-[10px] font-medium text-slate-500" title={label}>
      <span className={`w-1.5 h-1.5 rounded-full ${color}`} />
      {label}
    </span>
  );
}

export default function HomeCatalog() {
  const [activeTab, setActiveTab] = useState<TabKey>('all');
  const [selectedSkus, setSelectedSkus] = useState<Set<string>>(new Set());

  const currentData = useMemo(() => {
    return TABS.find(t => t.key === activeTab)?.data || TAB_ALL;
  }, [activeTab]);

  // ─── Выбор / снятие выбора ───────────────────────────────────────────────
  const toggleSelect = useCallback((sku: string) => {
    setSelectedSkus(prev => {
      const next = new Set(prev);
      if (next.has(sku)) next.delete(sku); else next.add(sku);
      return next;
    });
  }, []);

  const toggleSelectAll = useCallback(() => {
    setSelectedSkus(prev => {
      // Если все текущие выбраны — снимаем все
      const allSelected = currentData.every(c => prev.has(c.sku));
      if (allSelected) {
        // Снимаем только те, что в текущей вкладке
        const next = new Set(prev);
        for (const c of currentData) next.delete(c.sku);
        return next;
      }
      // Иначе — выбираем все из текущей вкладки (добавляем к существующим)
      const next = new Set(prev);
      for (const c of currentData) next.add(c.sku);
      return next;
    });
  }, [currentData]);

  const clearSelection = useCallback(() => setSelectedSkus(new Set()), []);

  // Подсчёт выбранных в текущей вкладке
  const selectedInCurrent = currentData.filter(c => selectedSkus.has(c.sku)).length;
  const allCurrentSelected = currentData.length > 0 && selectedInCurrent === currentData.length;

  // ─── Floating Action Bar ────────────────────────────────────────────────
  const showFloatingBar = selectedSkus.size > 0;

  return (
    <section className="py-12 md:py-16 px-4 bg-white relative">
      <div className="max-w-6xl mx-auto relative z-10">
        {/* ─── Заголовок ──────────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-3 bg-slate-100 border border-slate-200/60 rounded-full text-xs font-semibold text-slate-600">
            <svg className="w-3.5 h-3.5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
            </svg>
            Каталог · 52 913 позиций
          </div>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-slate-900 mb-2">
            Популярные позиции в каталоге
          </h2>
          <p className="text-slate-500 text-sm md:text-base max-w-2xl mx-auto">
            Более 52 000 компонентов в наличии и под заказ. Выберите несколько позиций — сформируйте единый RFQ-запрос.
          </p>
        </motion.div>

        {/* ─── Вкладки категорий (Segmented Control) ──────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex justify-center mb-6 overflow-x-auto scrollbar-hide"
        >
          <div className="inline-flex bg-slate-100 p-1 rounded-xl border border-slate-200/60 gap-0.5">
            {TABS.map(tab => {
              const active = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`inline-flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs transition whitespace-nowrap ${
                    active
                      ? 'bg-white text-emerald-800 shadow-xs font-semibold'
                      : 'text-slate-600 hover:text-slate-900 font-medium'
                  }`}
                  aria-pressed={active}
                >
                  <span className="text-xs">{tab.icon}</span>
                  {tab.label}
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                    active ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200/70 text-slate-500'
                  }`}>
                    {tab.data.length}
                  </span>
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* ─── Тулбар: Select All + счётчик (только при выборе) ────────── */}
        {selectedSkus.size > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex flex-wrap items-center justify-between gap-3 mb-4 bg-slate-50 border border-slate-200/80 rounded-xl px-4 py-3 ${showFloatingBar ? 'mb-20 md:mb-16' : ''}`}
          >
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={allCurrentSelected}
                onChange={toggleSelectAll}
                aria-label="Выбрать все компоненты"
                className="w-4 h-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 focus:ring-2 cursor-pointer"
              />
              <span className="text-xs text-slate-600 font-medium">
                {allCurrentSelected ? 'Снять все' : 'Выбрать все'}
              </span>
            </label>
            <p className="text-xs text-slate-500">
              Показано <b className="text-slate-900">{currentData.length}</b> позиций из{' '}
              <b className="text-slate-900">52 913</b>
              <span className="ml-2 inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-50 border border-emerald-200 rounded-full text-[11px] text-emerald-700 font-semibold">
                выбрано: {selectedSkus.size}
              </span>
            </p>
            <button
              onClick={clearSelection}
              className="text-xs text-slate-500 hover:text-slate-900 font-medium transition"
            >
              Сбросить выбор
            </button>
          </motion.div>
        )}

        {/* ─── CSS Grid карточек товаров (10 шт) ─────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 ${showFloatingBar ? 'mb-20 md:mb-16' : ''}`}
        >
          <AnimatePresence mode="wait">
            {currentData.map((comp, i) => {
              const isSelected = selectedSkus.has(comp.sku);
              const pkg = getPackageLabel(comp);
              return (
                <motion.div
                  key={`${activeTab}-${comp.sku}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25, delay: i * 0.03 }}
                  layout
                  className={`group relative bg-white rounded-2xl border p-5 hover:shadow-md hover:border-emerald-500/40 transition duration-200 flex flex-col justify-between ${
                    isSelected
                      ? 'border-emerald-500 shadow-md ring-2 ring-emerald-500/20'
                      : 'border-slate-200/80'
                  }`}
                >
                  {/* Чекбокс в правом верхнем углу карточки */}
                  <label className="absolute top-3 right-3 cursor-pointer z-10" title={isSelected ? 'Снять выбор' : 'Выбрать'}>
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleSelect(comp.sku)}
                      aria-label={`Выбрать ${comp.sku}`}
                      className="w-4 h-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 focus:ring-2 cursor-pointer"
                    />
                  </label>

                  {/* Шапка карточки: бейдж бренда + точка наличия */}
                  <div className="flex items-center justify-between gap-2 mb-3 pr-6">
                    <Link
                      prefetch={false}
                      href={`/catalog?brand=${encodeURIComponent(comp.brand)}`}
                      className="inline-flex items-center bg-slate-100 hover:bg-slate-200 text-slate-700 px-2 py-0.5 rounded text-[11px] font-medium transition-colors truncate max-w-[120px]"
                    >
                      {comp.brand}
                    </Link>
                    <StockDot stock={comp.stock} status={comp.status} />
                  </div>

                  {/* Фото компонента 80×80 на белом фоне */}
                  <Link
                    prefetch={false}
                    href={`/component/${encodeURIComponent(comp.sku)}`}
                    className="flex items-center justify-center h-24 mb-3 bg-white rounded-xl border border-slate-100 overflow-hidden"
                  >
                    <ComponentImage
                      sku={comp.sku}
                      name={comp.name}
                      category={comp.category}
                      size={80}
                      className="w-20 h-20 transition-transform duration-300 group-hover:scale-105"
                    />
                  </Link>

                  {/* Артикул + микро-описание */}
                  <Link
                    prefetch={false}
                    href={`/component/${encodeURIComponent(comp.sku)}`}
                    className="block mb-3"
                  >
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="font-mono font-bold text-slate-900 text-sm group-hover:text-emerald-600 transition leading-tight break-all line-clamp-1">
                        {comp.sku}
                      </span>
                      {comp.status === 'EOL' && (
                        <span className="flex-shrink-0 px-1.5 py-0.5 rounded text-[9px] font-bold bg-rose-50 text-rose-600 uppercase tracking-wide">
                          EOL
                        </span>
                      )}
                      {comp.status === 'NRND' && (
                        <span className="flex-shrink-0 px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-50 text-amber-600 uppercase tracking-wide">
                          NRND
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed line-clamp-2 min-h-[2rem]">{comp.name}</p>
                    {(pkg !== '—' || (comp.mount && comp.mount !== '—')) && (
                      <p className="text-[10px] text-slate-400 mt-1 font-mono">
                        {pkg !== '—' && pkg}
                        {pkg !== '—' && comp.mount && comp.mount !== '—' && ' · '}
                        {comp.mount && comp.mount !== '—' && comp.mount}
                      </p>
                    )}
                  </Link>

                  {/* Кнопка снизу: Запросить КП / В RFQ */}
                  <Link
                    prefetch={false}
                    href={`/rfq?sku=${encodeURIComponent(comp.sku)}`}
                    className="inline-flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs w-full py-2.5 rounded-xl transition"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                    </svg>
                    Запросить КП
                  </Link>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>

        {/* ─── Пустое состояние (если данных нет) ───────────────────────── */}
        {currentData.length === 0 && (
          <div className="text-center py-12 bg-white rounded-2xl border border-slate-200/80">
            <p className="text-sm text-slate-500">В этой категории пока нет позиций</p>
          </div>
        )}

        {/* ─── Нижняя кнопка: центрированная, прозрачная, с emerald-рамкой ── */}
        <div className="flex justify-center mt-8">
          <Link
            prefetch={false}
            href="/catalog"
            className="group inline-flex items-center gap-2 border border-emerald-600/30 text-emerald-700 hover:bg-emerald-50 px-6 py-2.5 rounded-xl font-medium text-sm transition"
          >
            Смотреть весь каталог (52 913+ позиций)
            <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>

      {/* ═══ Floating Action Bar для массового RFQ ════════════════════════ */}
      {showFloatingBar && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 px-4 w-full max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            transition={{ duration: 0.3 }}
            className="bg-white border border-slate-200 shadow-lg rounded-2xl px-4 py-3 md:px-5 md:py-3.5 flex items-center gap-3 md:gap-4"
          >
            <div className="flex items-center gap-2 text-slate-900 flex-1 min-w-0">
              <span className="w-7 h-7 flex-shrink-0 flex items-center justify-center rounded-full bg-emerald-600 text-white text-xs font-bold">
                {selectedSkus.size}
              </span>
              <span className="text-sm font-semibold whitespace-nowrap truncate text-slate-900">
                {selectedSkus.size === 1 ? 'позиция выбрана' : 'позиций выбрано'}
              </span>
            </div>
            <div className="h-6 w-px bg-slate-200 flex-shrink-0 hidden sm:block" />
            <Link
              prefetch={false}
              href={`/rfq?bulk=${encodeURIComponent(Array.from(selectedSkus).join(','))}`}
              className="inline-flex items-center gap-2 px-3 md:px-4 h-9 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-medium transition-colors shadow-2xs whitespace-nowrap flex-shrink-0"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
              <span className="hidden sm:inline">Сформировать единый RFQ</span>
              <span className="sm:hidden">RFQ</span>
            </Link>
            <button
              onClick={clearSelection}
              aria-label="Сбросить выбор"
              className="inline-flex items-center justify-center w-9 h-9 rounded-lg text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-colors flex-shrink-0"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </motion.div>
        </div>
      )}
    </section>
  );
}

'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import BreadcrumbNav from '@/components/ui/BreadcrumbNav';

// ═══════════════════════════════════════════════════════════════════════════
// DeliveryClient.tsx — Оригинальный дизайн: строгие формы, стильные надписи
// Крупные номера-гиганты, технические линии, характерная типографика
// ═══════════════════════════════════════════════════════════════════════════

const SUPPLY_CHAIN = [
  { num: '01', title: 'Заявка и BOM', time: '1 день', tags: ['BOM', 'Email', 'CRM'] },
  { num: '02', title: 'Выкуп у дистрибьюторов', time: '1–2 дня', tags: ['HKG', 'SZX', 'IST', 'Win Source'] },
  { num: '03', title: 'Таможенная очистка', time: '3–5 дней', tags: ['SVO', 'DME', 'ТН ВЭД'] },
  { num: '04', title: 'Контроль СВП', time: '1 день', tags: ['X-Ray', 'Decap', 'Electro QC'] },
  { num: '05', title: 'Отгрузка производству', time: 'от 1 дня', tags: ['CDEK', 'DHL', 'Pickup'] },
];

const TARIFFS = [
  {
    name: 'ЭКСПРЕСС',
    days: '6–10',
    unit: 'дней',
    desc: 'Авиа из Гонконга, Стамбула, Дубая. DHL Express. Приоритетная таможня.',
    features: ['Авиа: HKG / IST / DXB', 'DHL Express 3-5 дней', 'Приоритетная таможня', 'СВП в день поступления', 'Трекинг на всех этапах'],
    recommended: true,
  },
  {
    name: 'СТАНДАРТ',
    days: '14–21',
    unit: 'день',
    desc: 'Авто и ж/д через партнёров. Оптимальное соотношение цена/срок.',
    features: ['Авто/ж/д: HKG / SZX', 'Таможня 3-5 дней', 'СВП-контроль 1 день', 'СДЭК / Деловые Линии', 'Для серийных контрактов'],
    recommended: false,
  },
  {
    name: 'EOL / СПЕЦЗАКАЗ',
    days: '3–4+',
    unit: 'недели',
    desc: 'Снятые с производства и редкие позиции. Поиск по складам партнёров.',
    features: ['Поиск EOL по 6 регионам', 'Подбор аналога', 'Проверка каждой партии', 'Гарантия замены — 3 дня', 'Отчёт о совместимости'],
    recommended: false,
  },
];

const STANDARDS = [
  { code: 'ESD', title: 'Антистатика', spec: 'IEC 61340-5-1', desc: 'ESD-пакеты, пеналы, маркировка' },
  { code: 'MSL 3', title: 'Вакуум от влаги', spec: 'IPC/JEDEC J-STD-033', desc: 'MBB, силикагель, HIC-индикатор' },
  { code: 'T&R', title: 'Заводская таба', spec: 'EIA-481-1', desc: 'Tape & Reel, Tube, Tray — оригинал' },
  { code: 'SVP', title: 'Контроль СВП', spec: 'ГОСТ Р 8.568', desc: 'Рентген, декап, электротест' },
];

const CARRIERS = ['СДЭК', 'Деловые Линии', 'ПЭК', 'Major Express', 'DHL Express'];

export default function DeliveryClient() {
  return (
    <main className="pt-[180px] pb-20 bg-white min-h-screen">
      <div className="max-w-6xl mx-auto px-4">
        <BreadcrumbNav className="mb-6" items={[{ name: 'Главная', href: '/' }, { name: 'Доставка и оплата' }]} />

        {/* ═══ HERO: H1 + описание ═════════════════════════════════════════ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-16"
        >
          {/* Метка */}
          <div className="flex items-center gap-3 mb-5">
            <div className="w-8 h-px bg-emerald-500" />
            <span className="text-xs font-bold tracking-[0.2em] text-emerald-600 uppercase">B2B Логистика</span>
          </div>

          {/* H1 — крупный, строгий */}
          <h1 className="text-5xl md:text-7xl font-black text-slate-900 mb-4 tracking-tight leading-[0.95]">
            Доставка<br />
            <span className="text-emerald-600">и логистика</span>
          </h1>

          {/* Описание — с вертикальной линией слева */}
          <div className="flex gap-4 max-w-2xl">
            <div className="w-1 bg-emerald-200 rounded-full flex-shrink-0" />
            <p className="text-slate-500 text-base md:text-lg leading-relaxed pt-1">
              Поставки оригинальных электронных компонентов из Европы и Азии.
              Авиа — от 6 дней. Стандарт — 14–21 день.
              Входной контроль в собственной лаборатории СВП.
            </p>
          </div>
        </motion.div>

        {/* ═══ 1. ЦЕПОЧКА ПОСТАВОК ══════════════════════════════════════════ */}
        <section className="mb-20">
          {/* Заголовок секции */}
          <div className="flex items-baseline gap-4 mb-8 border-b border-slate-200 pb-4">
            <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Цепочка поставок</h2>
            <span className="text-sm text-slate-400 font-mono">/ 5 ЭТАПОВ</span>
          </div>

          {/* 5 этапов — с крупными номерами */}
          <div className="space-y-0">
            {SUPPLY_CHAIN.map((item, i) => (
              <motion.div
                key={item.num}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.1 + i * 0.08 }}
                className="group relative flex items-stretch gap-4 md:gap-6 border-b border-slate-100 last:border-0 hover:bg-slate-50/50 transition-colors py-5"
              >
                {/* Крупный номер-гигант */}
                <div className="flex-shrink-0 w-16 md:w-24 flex items-start">
                  <span className="text-4xl md:text-6xl font-black text-slate-200 group-hover:text-emerald-200 transition-colors leading-none tracking-tighter">
                    {item.num}
                  </span>
                </div>

                {/* Контент */}
                <div className="flex-1 min-w-0 flex items-center gap-3 md:gap-6 flex-wrap">
                  {/* Заголовок */}
                  <h3 className="text-base md:text-lg font-bold text-slate-900 whitespace-nowrap">
                    {item.title}
                  </h3>

                  {/* Тайминг — строгая плашка */}
                  <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded whitespace-nowrap">
                    {item.time}
                  </span>

                  {/* Теги */}
                  <div className="flex flex-wrap gap-1.5">
                    {item.tags.map(tag => (
                      <span key={tag} className="text-[11px] font-mono text-slate-500 border border-slate-200 px-2 py-0.5 rounded">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Стрелка (кроме последнего) */}
                {i < SUPPLY_CHAIN.length - 1 && (
                  <div className="hidden md:flex items-center text-slate-300 group-hover:text-emerald-400 transition-colors">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </section>

        {/* ═══ 2. ТАРИФЫ ════════════════════════════════════════════════════ */}
        <section className="mb-20">
          <div className="flex items-baseline gap-4 mb-8 border-b border-slate-200 pb-4">
            <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Тарифы</h2>
            <span className="text-sm text-slate-400 font-mono">/ 3 ВАРИАНТА</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-slate-200 rounded-2xl overflow-hidden">
            {TARIFFS.map((tariff, i) => (
              <motion.div
                key={tariff.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 + i * 0.1 }}
                className={`relative bg-white p-6 md:p-8 flex flex-col ${tariff.recommended ? 'ring-2 ring-emerald-500 ring-inset z-10' : ''}`}
              >
                {/* Бейдж "Рекомендуем" */}
                {tariff.recommended && (
                  <div className="absolute top-0 left-0 bg-emerald-500 text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1">
                    ★ Рекомендуем
                  </div>
                )}

                {/* Название тарифа — строгое, uppercase */}
                <h3 className="text-sm font-black tracking-[0.15em] text-slate-400 uppercase mb-4 mt-2">
                  {tariff.name}
                </h3>

                {/* Крупные цифры сроков — главный визуальный элемент */}
                <div className="flex items-baseline gap-1.5 mb-2">
                  <span className="text-5xl md:text-6xl font-black text-slate-900 tracking-tighter leading-none">
                    {tariff.days}
                  </span>
                  <span className="text-sm font-medium text-slate-400">{tariff.unit}</span>
                </div>

                {/* Описание */}
                <p className="text-xs text-slate-500 leading-relaxed mb-5">{tariff.desc}</p>

                {/* Список — строгая сетка с верхней линией */}
                <div className="border-t border-slate-100 pt-4 mb-6 flex-1">
                  <ul className="space-y-2.5">
                    {tariff.features.map((f, fi) => (
                      <li key={fi} className="flex items-start gap-2 text-xs text-slate-600">
                        <span className="text-emerald-500 font-bold flex-shrink-0">✓</span>
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Кнопка — строгая, угловатая */}
                <Link
                  href="/rfq"
                  className={`block text-center w-full py-3 text-sm font-bold uppercase tracking-wider transition-all ${
                    tariff.recommended
                      ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  Запросить КП →
                </Link>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ═══ 3. СТАНДАРТЫ УПАКОВКИ ════════════════════════════════════════ */}
        <section className="mb-20">
          <div className="flex items-baseline gap-4 mb-8 border-b border-slate-200 pb-4">
            <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Стандарты</h2>
            <span className="text-sm text-slate-400 font-mono">/ УПАКОВКА И КОНТРОЛЬ</span>
          </div>

          {/* 4 блока — с крупными кодами слева */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-slate-200 rounded-2xl overflow-hidden">
            {STANDARDS.map((item, i) => (
              <motion.div
                key={item.code}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.05 + i * 0.06 }}
                className="bg-white p-5 md:p-6 hover:bg-slate-50 transition-colors group"
              >
                <div className="flex items-start gap-4">
                  {/* Крупный код — моноширинный, emerald */}
                  <div className="flex-shrink-0">
                    <span className="text-2xl font-black font-mono text-emerald-600 tracking-tight">
                      {item.code}
                    </span>
                  </div>

                  {/* Текст */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-bold text-slate-900 mb-0.5">{item.title}</h3>
                    <span className="text-[10px] font-mono text-slate-400">{item.spec}</span>
                    <p className="text-xs text-slate-500 mt-2 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ═══ 4. ПАРТНЁРЫ + БЕСПЛАТНАЯ ДОСТАВКА ════════════════════════════ */}
        <section className="mb-20">
          <div className="flex items-baseline gap-4 mb-8 border-b border-slate-200 pb-4">
            <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Партнёры</h2>
            <span className="text-sm text-slate-400 font-mono">/ ТК И САМОВЫВОЗ</span>
          </div>

          {/* Список ТК — в строку, строго */}
          <div className="flex flex-wrap items-center gap-3 mb-6">
            {CARRIERS.map(carrier => (
              <span key={carrier} className="text-sm font-bold text-slate-700 border border-slate-300 px-4 py-2 rounded-lg hover:border-emerald-400 hover:text-emerald-700 transition-colors cursor-default">
                {carrier}
              </span>
            ))}
          </div>

          {/* Баннер бесплатной доставки — контрастный, строгий */}
          <div className="bg-slate-900 rounded-2xl p-6 md:p-8 mb-6 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500" />
            <div className="flex items-center gap-5 flex-wrap">
              <div className="flex-1 min-w-0">
                <div className="text-xs font-mono text-emerald-400 uppercase tracking-widest mb-1">// FREE SHIPPING</div>
                <div className="text-2xl md:text-3xl font-black text-white tracking-tight">
                  Бесплатная доставка от 50 000 ₽
                </div>
                <div className="text-slate-400 text-sm mt-1">СДЭК или Деловые Линии — по всей России</div>
              </div>
              <svg className="w-12 h-12 text-emerald-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z" />
              </svg>
            </div>
          </div>

          {/* Самовывоз + карта */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-slate-200 rounded-2xl overflow-hidden">
            <div className="bg-white p-6">
              <div className="text-xs font-mono text-emerald-600 uppercase tracking-widest mb-3">// PICKUP</div>
              <div className="space-y-3">
                <div>
                  <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Адрес</div>
                  <div className="text-sm font-bold text-slate-900">г. Белгород, ул. Шаландина, д. 4, к. 3, оф. 8</div>
                </div>
                <div>
                  <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Режим</div>
                  <div className="text-sm font-bold text-slate-900">Пн–Пт 9:00–18:00 МСК</div>
                </div>
              </div>
              <a
                href="https://yandex.ru/maps/?text=Белгород,+Шаландина+4+к3"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm font-bold text-emerald-600 hover:text-emerald-700 transition mt-4"
              >
                Яндекс.Карты
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>
            <div className="h-[240px] md:h-auto min-h-[200px]">
              <iframe
                loading="lazy"
                src="https://yandex.ru/map-widget/v1/?um=constructor%3A619abb19c4c878892657356a3e329d1788ec96a002538002228dffa402cebfd0&source=constructor&z=16&text=%D0%91%D0%B5%D0%BB%D0%B3%D0%BE%D1%80%D0%BE%D0%B4%2C%20%D0%A8%D0%B0%D0%BB%D0%B0%D0%BD%D0%B4%D0%B8%D0%BD%D0%B0%204%20%D0%BA3"
                width="100%"
                height="100%"
                frameBorder="0"
                title="Офис ChipNet — Белгород, Шаландина 4 к3"
                className="block"
              />
            </div>
          </div>
        </section>

        {/* ═══ 5. ФИНАЛЬНЫЙ CTA ════════════════════════════════════════════ */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="relative overflow-hidden bg-emerald-600 rounded-2xl"
        >
          {/* Декоративная диагональная полоса */}
          <div className="absolute top-0 right-0 w-1/3 h-full bg-emerald-700/30 transform skew-x-12 origin-top-right" />

          <div className="relative p-8 md:p-12 text-center">
            <div className="text-xs font-mono text-emerald-100 uppercase tracking-widest mb-3">// РАСЧЁТ ЛОГИСТИКИ</div>
            <h2 className="text-2xl md:text-4xl font-black text-white mb-4 max-w-2xl mx-auto leading-tight tracking-tight">
              Нужен точный расчёт сроков под вашу спецификацию?
            </h2>
            <p className="text-emerald-50 text-sm md:text-base mb-8 max-w-xl mx-auto">
              Отправьте BOM-файл — КП за 2 часа. Менеджер рассчитает стоимость, сроки и оптимальный маршрут.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/#bom"
                className="inline-flex items-center gap-2 px-7 h-12 bg-white text-emerald-700 font-black text-sm uppercase tracking-wider hover:bg-emerald-50 transition-all rounded-lg"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                Загрузить BOM
              </Link>
              <Link
                href="/rfq"
                className="inline-flex items-center gap-2 px-7 h-12 bg-emerald-700 text-white font-bold text-sm uppercase tracking-wider hover:bg-emerald-800 transition-all rounded-lg border border-emerald-400/30"
              >
                Запросить КП
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        </motion.section>

      </div>
    </main>
  );
}

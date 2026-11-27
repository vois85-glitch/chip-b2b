'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';

// ─── 4 преимущества B2B-поставки ───────────────────────────────────────────
const GUARANTEES = [
  {
    id: 'svp',
    title: 'Входной контроль СВП',
    subtitle: 'Лаборатория проверки подлинности',
    description: 'Каждая партия проходит проверку в собственной лаборатории СВП: рентген-контроль, декапсуляция, электрическое тестирование. Гарантия 100% оригинала — или возврат средств.',
    bullets: [
      'Рентген-контроль корпуса и кристалла',
      'Электрическое тестирование по datasheet',
      'Декапсуляция для визуального контроля кристалла',
      'Проверка маркировки и дата-кодов',
    ],
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    color: 'emerald',
    badge: 'СВП',
  },
  {
    id: 'b2b',
    title: 'Работа с юрлицами',
    subtitle: 'НДС · Договор · Закрывающие документы',
    description: 'Работаем только с ООО, АО и ИП по договору поставки. Полный пакет закрывающих документов: УПД, счёт-фактура, накладная. НДС включён, работаем с плательщиками и неплательщиками.',
    bullets: [
      'Договор поставки по 44-ФЗ и 223-ФЗ',
      'УПД, счёт-фактура, товарная накладная',
      'Работа с НДС (включён в цену)',
      'ЭДО (Диадок, СБИС) — по запросу',
    ],
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    color: 'blue',
    badge: 'B2B',
  },
  {
    id: 'delivery',
    title: 'Доставка от 6 дней',
    subtitle: 'Таможенное оформление под ключ',
    description: 'Прямые поставки из Европы и Азии. Полное таможенное оформление, все необходимые сертификаты. Срочная доставка авиацией от 6 дней, стандартная — 14–21 день.',
    bullets: [
      'Авиа-доставка от 6 рабочих дней',
      'Таможенное оформление под ключ',
      'Сертификаты соответствия и происхождения',
      'Отслеживание груза на всех этапах',
    ],
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    color: 'amber',
    badge: '6 дней',
  },
  {
    id: 'payment',
    title: 'Постоплата и гарантия 12 мес',
    subtitle: 'Для постоянных клиентов',
    description: 'Постоплата до 30 дней для проверенных партнёров. Гарантия 12 месяцев на все компоненты в оригинальной упаковке. При выявлении брака — замена за наш счёт.',
    bullets: [
      'Постоплата до 30 дней после 1-й сделки',
      'Гарантия 12 месяцев на оригинал',
      'Возврат средств при браке — за 3 дня',
      'Бесплатный подбор аналога при EOL',
    ],
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
      </svg>
    ),
    color: 'violet',
    badge: '12 мес',
  },
];

// Цветовые классы
const COLORS: Record<string, {
  gradient: string;
  iconBg: string;
  iconText: string;
  badgeBg: string;
  badgeText: string;
  accent: string;
  bullet: string;
}> = {
  emerald: {
    gradient: 'from-emerald-500 to-emerald-700',
    iconBg: 'bg-emerald-100',
    iconText: 'text-emerald-700',
    badgeBg: 'bg-emerald-500',
    badgeText: 'text-white',
    accent: 'text-emerald-700',
    bullet: 'text-emerald-600',
  },
  blue: {
    gradient: 'from-blue-500 to-blue-700',
    iconBg: 'bg-blue-100',
    iconText: 'text-blue-700',
    badgeBg: 'bg-blue-500',
    badgeText: 'text-white',
    accent: 'text-blue-700',
    bullet: 'text-blue-600',
  },
  amber: {
    gradient: 'from-amber-500 to-amber-700',
    iconBg: 'bg-amber-100',
    iconText: 'text-amber-700',
    badgeBg: 'bg-amber-500',
    badgeText: 'text-white',
    accent: 'text-amber-700',
    bullet: 'text-amber-600',
  },
  violet: {
    gradient: 'from-violet-500 to-violet-700',
    iconBg: 'bg-violet-100',
    iconText: 'text-violet-700',
    badgeBg: 'bg-violet-500',
    badgeText: 'text-white',
    accent: 'text-violet-700',
    bullet: 'text-violet-600',
  },
};

export default function Guarantees() {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <section className="py-12 md:py-16 px-4 bg-white relative">
      <div className="max-w-7xl mx-auto">
        {/* Заголовок */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8 md:mb-10"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-3 bg-emerald-100 border border-emerald-300 rounded-full text-xs font-semibold text-emerald-800">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            Гарантии ChipNet
          </div>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-[#121212] mb-2">
            Почему нам доверяют B2B-поставки
          </h2>
          <p className="text-[#555] text-sm md:text-base max-w-2xl mx-auto">
            4 уровня защиты для вашего производства: от лаборатории СВП до постоплаты. Наведите на карточку для подробностей.
          </p>
        </motion.div>

        {/* Сетка 4 карточек */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {GUARANTEES.map((g, i) => {
            const c = COLORS[g.color];
            const isHovered = hoveredId === g.id;
            return (
              <motion.div
                key={g.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                onMouseEnter={() => setHoveredId(g.id)}
                onMouseLeave={() => setHoveredId(null)}
                className={`group relative bg-white rounded-2xl border-2 transition-all duration-300 cursor-pointer overflow-hidden ${
                  isHovered
                    ? 'border-emerald-500 shadow-2xl shadow-emerald-500/15 -translate-y-1'
                    : 'border-[#e8e8e8] shadow-sm hover:border-emerald-300 hover:shadow-md'
                }`}
              >
                {/* Цветная верхняя полоса с градиентом */}
                <div className={`h-1.5 bg-gradient-to-r ${c.gradient}`} />

                {/* Контент */}
                <div className="p-5 md:p-6">
                  {/* Иконка + бейдж */}
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-14 h-14 ${c.iconBg} ${c.iconText} rounded-2xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3`}>
                      {g.icon}
                    </div>
                    <span className={`inline-flex items-center px-2.5 py-1 ${c.badgeBg} ${c.badgeText} text-[10px] font-bold rounded-full uppercase tracking-wide`}>
                      {g.badge}
                    </span>
                  </div>

                  {/* Заголовок */}
                  <h3 className={`text-base md:text-lg font-bold text-[#121212] mb-1 transition-colors ${isHovered ? c.accent : ''}`}>
                    {g.title}
                  </h3>
                  <p className="text-xs text-[#757575] mb-3 leading-relaxed">{g.subtitle}</p>

                  {/* Описание (всегда видно) */}
                  <p className="text-xs text-[#555] leading-relaxed mb-3">
                    {g.description}
                  </p>

                  {/* Буллеты — раскрываются при hover */}
                  <motion.ul
                    initial={false}
                    animate={{
                      height: isHovered ? 'auto' : 0,
                      opacity: isHovered ? 1 : 0,
                    }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden space-y-1.5"
                  >
                    {g.bullets.map((b, bi) => (
                      <li key={bi} className="flex items-start gap-2 text-xs text-[#555]">
                        <svg className={`w-3.5 h-3.5 mt-0.5 ${c.bullet} flex-shrink-0`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                        <span>{b}</span>
                      </li>
                    ))}
                  </motion.ul>
                </div>

                {/* Декоративный glow при hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${c.gradient} opacity-0 group-hover:opacity-[0.03] transition-opacity duration-300 pointer-events-none`} />
              </motion.div>
            );
          })}
        </div>

        {/* Нижний CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-center mt-8 md:mt-10"
        >
          <p className="text-sm text-[#555] mb-4">
            Хотите убедиться лично? Посетите наш офис в Белгороде или запросите визит менеджера.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <a
              href="#bom"
              className="inline-flex items-center gap-2 px-5 h-11 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-sm font-bold transition-colors shadow-lg shadow-emerald-600/20"
            >
              Получить КП за 2 часа
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
            <a
              href="#contacts"
              className="inline-flex items-center gap-2 px-5 h-11 bg-white border-2 border-emerald-600/30 text-emerald-700 hover:border-emerald-600 hover:bg-emerald-50 rounded-xl text-sm font-semibold transition-colors"
            >
              Контакты и реквизиты
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

'use client';

import { motion } from 'framer-motion';
import { trackGoal } from '@/lib/metrika';
import BreadcrumbNav from '@/components/ui/BreadcrumbNav';

// ═══════════════════════════════════════════════════════════════════════════
// AboutClient.tsx — премиальная страница «О компании»
// pt-56 md:pt-60 — гарантированный отступ от двойной шапки с поисковым баром
// ═══════════════════════════════════════════════════════════════════════════

// ─── 4 ключевых показателя ─────────────────────────────────────────────────
const STATS = [
  {
    value: '52 000+',
    label: 'позиций в каталоге',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" />
      </svg>
    ),
    color: 'emerald',
  },
  {
    value: 'от 6 дней',
    label: 'доставка из Европы и Азии',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    color: 'amber',
  },
  {
    value: '100%',
    label: 'входной контроль в СВП',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    color: 'emerald',
  },
  {
    value: 'B2B',
    label: 'только юрлица, договор, постоплата',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    color: 'blue',
  },
];

const COLOR_CLASSES: Record<string, { bg: string; text: string; border: string; gradient: string }> = {
  emerald: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', gradient: 'from-emerald-500 to-emerald-700' },
  amber: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', gradient: 'from-amber-500 to-amber-700' },
  blue: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', gradient: 'from-blue-500 to-blue-700' },
};

// ─── 3 процесса (подбор аналогов, EOL, BOM) ────────────────────────────────
const PROCESSES = [
  {
    title: 'Подбор аналогов',
    description: 'Помогаем российским производителям заменить недоступные и санкционные компоненты на доступные аналоги с гарантией электрической совместимости. Анализ по datasheet, сравнение корпусного исполнения, температурного диапазона.',
    bullets: [
      'STM32 → GD32, HK32, CH32 (pin-to-pin 90-100%)',
      'Xilinx Spartan/Artix → Gowin Arora, Efinix Trion',
      'TI TPS → Richtek, Silergy, Monolithic Power',
      'ADI OPA → TI, Microchip MCP',
    ],
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
      </svg>
    ),
  },
  {
    title: 'Работа с EOL-компонентами',
    description: 'Компоненты, снятые с производства (End-of-Life), — наша специализация. Находим складские остатки у проверенных партнёров в Гонконге, Шэньчжэне, Стамбуле. Если оригинал недоступен — подбираем функциональный аналог.',
    bullets: [
      'Поиск складских остатков через партнёров Win Source, UTSource',
      'Проверка оригинальности каждой партии в СВП',
      'Гарантия замены при выявлении брака — за 3 дня',
      'Отчёт о совместимости с указанием отличий в параметрах',
    ],
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
  },
  {
    title: 'BOM-комплектация',
    description: 'Принимаем спецификации в любом формате (.xlsx, .pdf, .csv). Инженеры анализируют BOM, проверяют наличие по каждому артикулу, предлагают аналоги для недоступных позиций. КП с ценами и сроками — за 2 часа в рабочее время.',
    bullets: [
      'Анализ BOM: проверка наличия по 52 000+ позициям',
      'КП за 2 часа (стандарт) / до 24 часов (редкие позиции)',
      'Подбор аналогов для недоступных позиций — бесплатно',
      'Полная комплектация: от 1 до 10 000+ позиций в одной поставке',
    ],
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2m2 2v-4m2 4v-6m2 6V7m-9 6h.01M4 6a2 2 0 012-2h12a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V6z" />
      </svg>
    ),
  },
];

// ─── Реквизиты ─────────────────────────────────────────────────────────────
const REQUISITES = [
  { label: 'Наименование', value: 'ООО «Деловой Партнёр»' },
  { label: 'Бренд', value: 'ChipNet' },
  { label: 'ИНН / КПП', value: '3123341983 / 312301001' },
  { label: 'ОГРН', value: '1143123005838' },
  { label: 'Юридический адрес', value: '308033, г. Белгород, ул. Шаландина, д. 4, к. 3, оф. 8' },
  { label: 'Система налогообложения', value: 'ОСНО (с НДС)' },
];

export default function AboutClient() {
  return (
    <main className="pt-[190px] md:pt-[200px] pb-16 px-4 bg-section-alt min-h-screen">
      <div className="max-w-6xl mx-auto">
        <BreadcrumbNav className="mb-6" items={[{ name: 'Главная', href: '/' }, { name: 'О компании' }]} />

        {/* ═══ H1 + подзаголовок ═══════════════════════════════════════════ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10 text-center"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-4 bg-emerald-100 border border-emerald-300 rounded-full text-xs font-semibold text-emerald-800">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
            Поставщик электронных компонентов с 2018 года
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-3 bg-gradient-to-r from-primary to-primary-dark bg-clip-text text-transparent">
            О компании ChipNet
          </h1>
          <p className="text-slate-500 text-base md:text-lg leading-relaxed max-w-3xl mx-auto">
            Надёжный B2B-поставщик оригинальных электронных компонентов для промышленности. 52 000+ позиций в каталоге, проверка в собственной лаборатории СВП, подбор аналогов для EOL-компонентов, доставка из Европы и Азии от 6 дней.
          </p>
        </motion.div>

        {/* ═══ 4 ключевых показателя ════════════════════════════════════════ */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {STATS.map((stat, i) => {
            const c = COLOR_CLASSES[stat.color];
            return (
              <motion.div
                key={stat.value}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 + i * 0.08 }}
                className="bg-white rounded-2xl border border-slate-200/80 p-5 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 relative overflow-hidden"
              >
                {/* Цветная верхняя полоса */}
                <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${c.gradient}`} />

                {/* Иконка */}
                <div className={`w-11 h-11 ${c.bg} ${c.text} border ${c.border} rounded-xl flex items-center justify-center mb-3`}>
                  {stat.icon}
                </div>

                {/* Значение */}
                <div className={`text-2xl md:text-3xl font-bold ${c.text} mb-1`}>
                  {stat.value}
                </div>
                {/* Подпись */}
                <div className="text-xs text-slate-500 leading-snug">
                  {stat.label}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* ═══ Описание компании (текстовый блок) ═══════════════════════════ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-white rounded-2xl border border-slate-200/80 p-6 md:p-8 mb-10 shadow-sm"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">
            Поставка электронных компонентов для промышленности
          </h2>
          <div className="space-y-4 text-slate-600 text-sm md:text-base leading-relaxed">
            <p>
              ChipNet (юридическое лицо — ООО «Деловой Партнёр») — компания, специализирующаяся на поставках оригинальных электронных компонентов для промышленных предприятий. Работаем с 2018 года, за это время выполнили более 5000 поставок для предприятий машиностроения, энергетики, связи, медицинской техники.
            </p>
            <p>
              Каждая партия проходит входной контроль в аккредитованной лаборатории СВП с рентгеновским контролем, декапсуляцией и электрическими тестами. Подбираем аналоги санкционных компонентов из доступных регионов (Гонконг, Шэньчжэнь, Тайбэй, Стамбул, Дубай, Алматы) с гарантией электрической совместимости.
            </p>
            <p>
              Работаем <b className="text-slate-900">только с юридическими лицами</b> (ООО, АО, ИП) по договору поставки. Полный пакет закрывающих документов: УПД, счёт-фактура, товарная накладная. ЭДО — Диадок, СБИС. Для постоянных клиентов — постоплата до 30 дней.
            </p>
          </div>
        </motion.div>

        {/* ═══ Процессы: подбор аналогов, EOL, BOM ══════════════════════════ */}
        <div className="mb-12">
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="text-2xl md:text-3xl font-bold text-slate-900 mb-6 text-center"
          >
            Наши ключевые компетенции
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {PROCESSES.map((proc, i) => (
              <motion.div
                key={proc.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 + i * 0.1 }}
                className="group bg-white rounded-2xl border border-slate-200/80 p-5 hover:shadow-md hover:border-emerald-500/40 transition-all duration-200"
              >
                {/* Иконка + заголовок */}
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center justify-center text-emerald-700 group-hover:scale-110 transition-transform">
                    {proc.icon}
                  </div>
                  <h3 className="text-base font-bold text-slate-900">{proc.title}</h3>
                </div>

                {/* Описание */}
                <p className="text-xs text-slate-500 leading-relaxed mb-3">
                  {proc.description}
                </p>

                {/* Буллеты */}
                <ul className="space-y-1.5">
                  {proc.bullets.map((b, bi) => (
                    <li key={bi} className="flex items-start gap-2 text-xs text-slate-600">
                      <svg className="w-3.5 h-3.5 mt-0.5 text-emerald-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>

        {/* ═══ Реквизиты с PDF ══════════════════════════════════════════════ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-white rounded-2xl border border-slate-200/80 p-6 md:p-8 shadow-sm"
        >
          <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
            <h2 className="text-xl md:text-2xl font-bold text-slate-900 flex items-center gap-2">
              <svg className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Реквизиты компании
            </h2>
            <a
              href="/requisites.pdf"
              download
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white rounded-lg text-sm font-semibold transition-all shadow-md shadow-emerald-600/20"
              onClick={() => trackGoal('requisites_pdf_download', { section: 'about_page' })}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
              </svg>
              📄 Скачать реквизиты (PDF)
            </a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 text-sm">
            {REQUISITES.map((r) => (
              <div key={r.label} className="flex flex-col gap-0.5 pb-2 border-b border-slate-100 last:border-0">
                <span className="text-xs text-slate-500 font-medium">{r.label}</span>
                <span className="font-mono font-semibold text-slate-900 text-sm break-words">{r.value}</span>
              </div>
            ))}
          </div>

          <p className="text-xs text-slate-400 mt-4 flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Банковские реквизиты и ЭДО (Диадок, СБИС) предоставим по запросу: info@chip-net.ru
          </p>
        </motion.div>

      </div>
    </main>
  );
}

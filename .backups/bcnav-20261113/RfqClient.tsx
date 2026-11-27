'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { trackGoal } from '@/lib/metrika';
import BreadcrumbNav from '@/components/ui/BreadcrumbNav';

// ═══════════════════════════════════════════════════════════════════════════
// RfqClient.tsx — Дружелюбная, клиентоориентированная страница запроса КП
// Форма на первом экране, бейджи доверия, компактные шаги, тёплый тон
// ═══════════════════════════════════════════════════════════════════════════

const TRUST_BADGES = [
  { icon: '⚡', text: 'КП за 2 часа' },
  { icon: '🛡️', text: '100% оригинал' },
  { icon: '🤝', text: 'Без обязательств' },
  { icon: '📦', text: 'Постоплата' },
];

const STEPS = [
  { num: '1', icon: '📋', title: 'Отправка заявки', text: 'Заполните форму или отправьте BOM по email' },
  { num: '2', icon: '🔍', title: 'Проверка наличия', text: 'Склад, дистрибьюторы, азиатские поставщики' },
  { num: '3', icon: '📄', title: 'КП за 2 часа', text: 'Цены, сроки, аналоги — детализированное предложение' },
  { num: '4', icon: '✅', title: 'Поставка', text: 'Согласование, оплата, отгрузка с трекингом' },
];

const SERVICES = [
  { icon: '⚡', title: 'Срочный поиск', text: 'Авиа от 6 дней. Для остановки конвейера.' },
  { icon: '📦', title: 'BOM-комплектация', text: 'Полная спецификация. Персональный менеджер.' },
  { icon: '🔄', title: 'Подбор аналогов', text: 'Замена санкционных и EOL. Сравнительная таблица.' },
  { icon: '💰', title: 'Объёмные скидки', text: 'До 30% при заказе от 1000 шт. Фиксация цены.' },
];

const FAQ = [
  { q: 'Как быстро вы обрабатываете заявку?', a: 'КП за 2 рабочих часа. Подтверждение получения — в течение 15 минут. Для сложных BOM — до 4 часов.' },
  { q: 'Можно ли запросить компоненты, которых нет в каталоге?', a: 'Да. Работаем с 10+ млн наименований от 200+ производителей. Отправьте партномер — проверим наличие.' },
  { q: 'Как гарантирована оригинальность?', a: 'Все компоненты проходят входной контроль в лаборатории СВП: рентген, декапсуляция, электротест. Работаем только с авторизованными дистрибьюторами.' },
  { q: 'Можно ли согласовать замену на аналоги?', a: 'Да. Инженеры подбирают аналоги с учётом всех параметров. Предоставляем сравнительную таблицу оригинал/аналог. Решение остаётся за вами.' },
  { q: 'Есть ли скидки при объёмном заказе?', a: 'Да: от 5% при 500 шт. до 30% при 10 000+. Фиксация цены на 6–12 месяцев, поэтапная отгрузка.' },
];

export default function RfqClient() {
  const searchParams = useSearchParams();
  const [form, setForm] = useState({ name: '', company: '', contact: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  // Предзаполнение из URL: ?sku=STM32F103C8T6 или ?bulk=SKU1,SKU2,...
  useEffect(() => {
    const sku = searchParams.get('sku');
    const bulk = searchParams.get('bulk');
    if (sku) {
      setForm(prev => ({ ...prev, message: `Требуется подобрать компонент: ${sku}\n\nУточните наличие, цену и сроки поставки.` }));
    } else if (bulk) {
      const skus = bulk.split(',').filter(Boolean);
      setForm(prev => ({ ...prev, message: `Запрос на комплектацию:\n${skus.map(s => `- ${s}`).join('\n')}\n\nУточните наличие, цены и сроки.` }));
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.contact.trim() || !form.message.trim()) {
      setStatus('error');
      setErrorMsg('Заполните имя, контакты и список компонентов');
      return;
    }

    setStatus('loading');
    setErrorMsg('');

    try {
      const isEmail = form.contact.includes('@');
      const payload = isEmail
        ? { name: form.name, phone: '', email: form.contact, company: form.company }
        : { name: form.name, phone: form.contact, email: '', company: form.company };

      const res = await fetch('/api/callback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Ошибка отправки');
      }

      setStatus('success');
      setForm({ name: '', company: '', contact: '', message: '' });
      trackGoal('lead_rfq_submit', { source: 'rfq_page' });
    } catch (err) {
      setStatus('error');
      setErrorMsg(err instanceof Error ? err.message : 'Не удалось отправить. Позвоните +7 (910) 321-91-91');
    }
  };

  return (
    <main className="pt-[180px] pb-20 bg-slate-50 min-h-screen">
      <div className="max-w-6xl mx-auto px-4">
        <BreadcrumbNav className="mb-6" items={[{ name: 'Главная', href: '/' }, { name: 'Запрос КП (RFQ)' }]} />

        {/* ═══ HERO + ФОРМА (2-колоночный, форма на первом экране) ══════════ */}
        <section className="mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">

            {/* Левая колонка — текст + доверие */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {/* Бейдж */}
              <div className="inline-flex items-center gap-2 px-3 py-1 mb-4 bg-emerald-100 border border-emerald-200 rounded-full text-xs font-semibold text-emerald-800">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                КП за 2 часа · Без обязательств
              </div>

              {/* H1 — дружелюбный */}
              <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight leading-tight">
                Запросите КП на<br />
                <span className="text-emerald-600">электронные компоненты</span>
              </h1>

              {/* Описание — короткое, тёплое */}
              <p className="text-slate-600 text-base md:text-lg leading-relaxed mb-6 max-w-lg">
                Отправьте заявку — менеджер проверит наличие по 52 000+ позициям, подберёт аналоги и вернётся с детализированным предложением. Это бесплатно и ни к чему не обязывает.
              </p>

              {/* Бейджи доверия */}
              <div className="grid grid-cols-2 gap-3 max-w-md">
                {TRUST_BADGES.map(badge => (
                  <div key={badge.text} className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3 py-2.5">
                    <span className="text-lg">{badge.icon}</span>
                    <span className="text-xs font-semibold text-slate-700">{badge.text}</span>
                  </div>
                ))}
              </div>

              {/* Альтернативные способы связи */}
              <div className="mt-6 pt-6 border-t border-slate-200">
                <p className="text-xs text-slate-400 mb-2">Удобнее по-другому?</p>
                <div className="flex flex-wrap gap-3">
                  <a href="mailto:info@chip-net.ru" className="text-sm font-medium text-emerald-600 hover:text-emerald-700 transition flex items-center gap-1.5">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    info@chip-net.ru
                  </a>
                  <a href="tel:+79103219191" className="text-sm font-medium text-emerald-600 hover:text-emerald-700 transition flex items-center gap-1.5">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    +7 (910) 321-91-91
                  </a>
                </div>
              </div>
            </motion.div>

            {/* Правая колонка — ФОРМА (на первом экране!) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="bg-white rounded-2xl border border-slate-200 shadow-lg p-6 md:p-8"
            >
              {status === 'success' ? (
                <div className="text-center py-10">
                  <div className="w-16 h-16 mx-auto mb-4 bg-emerald-100 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">Заявка отправлена!</h3>
                  <p className="text-sm text-slate-500 mb-4">Менеджер свяжется с вами в течение 15 минут. КП — за 2 часа.</p>
                  <button onClick={() => setStatus('idle')} className="text-sm font-medium text-emerald-600 hover:text-emerald-700 transition">
                    Отправить ещё одну заявку
                  </button>
                </div>
              ) : (
                <>
                  {/* Заголовок формы */}
                  <div className="mb-5">
                    <h2 className="text-xl font-bold text-slate-900 mb-1">Оставить заявку</h2>
                    <p className="text-sm text-slate-500">Заполните форму — перезвоним в течение 15 минут</p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Имя + Компания в ряд */}
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-slate-700 mb-1.5">Ваше имя *</label>
                        <input
                          type="text"
                          value={form.name}
                          onChange={e => setForm({ ...form, name: e.target.value })}
                          required
                          placeholder="Иван"
                          className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-700 mb-1.5">Компания</label>
                        <input
                          type="text"
                          value={form.company}
                          onChange={e => setForm({ ...form, company: e.target.value })}
                          placeholder="ООО..."
                          className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition"
                        />
                      </div>
                    </div>

                    {/* Телефон/Email */}
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1.5">Телефон или Email *</label>
                      <input
                        type="text"
                        value={form.contact}
                        onChange={e => setForm({ ...form, contact: e.target.value })}
                        required
                        placeholder="+7 (999) 123-45-67"
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition font-mono"
                      />
                    </div>

                    {/* Компоненты */}
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1.5">Список компонентов *</label>
                      <textarea
                        value={form.message}
                        onChange={e => setForm({ ...form, message: e.target.value })}
                        required
                        rows={4}
                        placeholder="STM32F103C8T6 — 500 шт&#10;LM7805CT — 200 шт&#10;..."
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition resize-y font-mono"
                      />
                      <p className="text-[11px] text-slate-400 mt-1">Укажите партномера и количество. Можно вставить из BOM.</p>
                    </div>

                    {/* Ошибка */}
                    {status === 'error' && (
                      <div className="px-3.5 py-2.5 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-700 flex items-start gap-2">
                        <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        {errorMsg}
                      </div>
                    )}

                    {/* Submit */}
                    <button
                      type="submit"
                      disabled={status === 'loading'}
                      className="w-full inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-xl transition-all shadow-md shadow-emerald-600/20 disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {status === 'loading' ? (
                        <>
                          <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                          </svg>
                          Отправка…
                        </>
                      ) : (
                        <>
                          Отправить заявку
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                          </svg>
                        </>
                      )}
                    </button>

                    <p className="text-[11px] text-slate-400 text-center">
                      Нажимая «Отправить», вы соглашаетесь с обработкой персональных данных. Мы не передаём данные третьим лицам.
                    </p>
                  </form>
                </>
              )}
            </motion.div>
          </div>
        </section>

        {/* ═══ КАК ЭТО РАБОТАЕТ — 4 компактных шага ═════════════════════════ */}
        <section className="mb-16">
          <h2 className="text-2xl font-black text-slate-900 mb-2">Как это работает</h2>
          <p className="text-sm text-slate-500 mb-8">Просто отправьте заявку — дальше мы всё сделаем сами</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {STEPS.map((step, i) => (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 + i * 0.08 }}
                className="bg-white border border-slate-200 rounded-2xl p-5 hover:shadow-md hover:border-emerald-300 transition-all"
              >
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-7 h-7 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center text-xs font-bold">
                    {step.num}
                  </span>
                  <span className="text-xl">{step.icon}</span>
                </div>
                <h3 className="text-sm font-bold text-slate-900 mb-1">{step.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{step.text}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ═══ ЧТО МЫ МОЖЕМ — 4 услуги ══════════════════════════════════════ */}
        <section className="mb-16">
          <h2 className="text-2xl font-black text-slate-900 mb-2">Что мы можем</h2>
          <p className="text-sm text-slate-500 mb-8">Любой тип заявки — от разового заказа до комплексной BOM-комплектации</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {SERVICES.map((service, i) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.05 + i * 0.06 }}
                className="flex items-start gap-4 bg-white border border-slate-200 rounded-2xl p-5 hover:shadow-md hover:border-emerald-300 transition-all"
              >
                <div className="w-11 h-11 flex-shrink-0 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-center text-xl">
                  {service.icon}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 mb-1">{service.title}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">{service.text}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ═══ FAQ ═══════════════════════════════════════════════════════════ */}
        <section className="mb-16">
          <h2 className="text-2xl font-black text-slate-900 mb-8">Частые вопросы</h2>
          <div className="space-y-3 max-w-3xl">
            {FAQ.map((item, i) => (
              <details key={i} className="group bg-white border border-slate-200 rounded-xl overflow-hidden hover:border-slate-300 transition">
                <summary className="flex items-center justify-between p-4 cursor-pointer hover:bg-slate-50 transition-colors">
                  <span className="font-semibold text-sm text-slate-900 pr-4">{item.q}</span>
                  <svg className="w-4 h-4 text-slate-400 group-open:rotate-180 transition-transform shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <div className="px-4 pb-4 text-sm text-slate-500 leading-relaxed">{item.a}</div>
              </details>
            ))}
          </div>
        </section>

        {/* ═══ ФИНАЛЬНЫЙ CTA ════════════════════════════════════════════════ */}
        <section className="bg-emerald-600 rounded-2xl p-8 md:p-12 text-center">
          <h2 className="text-2xl md:text-3xl font-black text-white mb-3">Готовы отправить заявку?</h2>
          <p className="text-emerald-50 text-sm md:text-base mb-7 max-w-xl mx-auto">
            КП за 2 часа. Без обязательств. Проверка наличия, аналоги, фиксация цен.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <a
              href="#top"
              onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              className="inline-flex items-center gap-2 px-6 h-12 bg-white text-emerald-700 font-bold text-sm rounded-xl hover:bg-emerald-50 transition shadow-lg"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
              Заполнить форму
            </a>
            <Link
              href="/#bom"
              className="inline-flex items-center gap-2 px-6 h-12 bg-emerald-700/30 border border-white/30 text-white font-semibold text-sm rounded-xl hover:bg-emerald-700/40 transition backdrop-blur-sm"
            >
              Загрузить BOM-файл
            </Link>
          </div>
        </section>

      </div>
    </main>
  );
}

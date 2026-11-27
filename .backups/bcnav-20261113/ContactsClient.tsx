'use client';

import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { trackGoal } from '@/lib/metrika';
import BreadcrumbNav from '@/components/ui/BreadcrumbNav';

// ═══════════════════════════════════════════════════════════════════════════
// ContactsClient.tsx — премиальная страница контактов
// 2-колоночный layout (lg:grid-cols-12):
//   Левая (col-span-6): H1, карточки связи, реквизиты с PDF
//   Правая (col-span-6): форма обратной связи + Яндекс.Карта
// Фикс отступа от шапки: pt-28 (чтобы H1 не перекрывался fixed header)
// ═══════════════════════════════════════════════════════════════════════════

// ─── Карточки связи (изумрудные иконки, моноширинный шрифт) ────────────────
const CONTACT_CARDS = [
  {
    id: 'phone',
    label: 'Телефон / WhatsApp / Telegram',
    value: '+7 (910) 321-91-91',
    href: 'tel:+79103219191',
    copyable: '+79103219191',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
      </svg>
    ),
  },
  {
    id: 'email',
    label: 'Email',
    value: 'info@chip-net.ru',
    href: 'mailto:info@chip-net.ru',
    copyable: 'info@chip-net.ru',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    id: 'address',
    label: 'Юридический адрес',
    value: '308033, г. Белгород, ул. Шаландина, д. 4, к. 3, оф. 8',
    copyable: '308033, г. Белгород, ул. Шаландина, д. 4, к. 3, оф. 8',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
  {
    id: 'hours',
    label: 'Режим работы',
    value: 'Пн-Пт: 9:00 — 18:00 (МСК)',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
];

// ─── Реквизиты компании ────────────────────────────────────────────────────
const REQUISITES = [
  { label: 'Наименование', value: 'ООО «Деловой Партнёр»' },
  { label: 'ИНН / КПП', value: '3123341983 / 312301001' },
  { label: 'ОГРН', value: '1143123005838' },
  { label: 'Юридический адрес', value: '308033, г. Белгород, ул. Шаландина, д. 4, к. 3, оф. 8' },
];

export default function ContactsClient() {
  const [form, setForm] = useState({ name: '', contact: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // ─── Копирование в буфер обмена ──────────────────────────────────────────
  const handleCopy = useCallback(async (id: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 1500);
    } catch (err) {
      console.error('Clipboard error:', err);
    }
  }, []);

  // ─── Отправка формы обратной связи ───────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.contact.trim()) {
      setStatus('error');
      setErrorMsg('Имя и контакт (телефон или email) обязательны');
      return;
    }

    setStatus('loading');
    setErrorMsg('');

    try {
      // Определяем: email или телефон в поле contact
      const isEmail = form.contact.includes('@');
      const payload = isEmail
        ? { name: form.name, phone: '', email: form.contact, company: '' }
        : { name: form.name, phone: form.contact, email: '', company: '' };

      const res = await fetch('/api/callback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Ошибка отправки');
      }

      setStatus('success');
      setForm({ name: '', contact: '', message: '' });
      trackGoal('lead_callback_submit', { source: 'contacts_page' });
    } catch (err) {
      setStatus('error');
      setErrorMsg(err instanceof Error ? err.message : 'Не удалось отправить. Позвоните +7 (910) 321-91-91');
    }
  };

  return (
    <main className="pt-[180px] pb-16 px-4 bg-section-alt min-h-screen">
      <div className="max-w-6xl mx-auto">
        <BreadcrumbNav className="mb-6" items={[{ name: 'Главная', href: '/' }, { name: 'Контакты' }]} />
        {/* ─── Двухколоночный layout ──────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* ═══ ЛЕВАЯ КОЛОНКА (lg:col-span-6) ══════════════════════════════ */}
          <div className="lg:col-span-6">
            {/* H1 + подзаголовок */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-8"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 mb-4 bg-emerald-100 border border-emerald-300 rounded-full text-xs font-semibold text-emerald-800">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                B2B-поставщик электронных компонентов
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-3 bg-gradient-to-r from-primary to-primary-dark bg-clip-text text-transparent">
                Контакты
              </h1>
              <p className="text-slate-500 text-base md:text-lg leading-relaxed max-w-lg">
                Свяжитесь с нами для подбора компонентов, запроса КП или консультации по аналогам. Перезвоним в течение 30 минут в рабочее время.
              </p>
            </motion.div>

            {/* ─── Карточки связи ─────────────────────────────────────────── */}
            <div className="space-y-3 mb-8">
              {CONTACT_CARDS.map((card, i) => (
                <motion.div
                  key={card.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 + i * 0.08 }}
                  className={`group bg-white rounded-2xl border border-slate-200/80 p-4 flex items-center gap-4 transition-all hover:shadow-md hover:border-emerald-500/40 ${
                    card.href ? 'cursor-pointer' : ''
                  }`}
                  onClick={() => card.copyable && handleCopy(card.id, card.copyable)}
                >
                  {/* Изумрудная иконка */}
                  <div className="w-11 h-11 flex-shrink-0 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-center text-emerald-600 group-hover:bg-emerald-100 group-hover:scale-105 transition-all">
                    {card.icon}
                  </div>

                  {/* Текст */}
                  <div className="flex-1 min-w-0">
                    <div className="text-[11px] text-slate-500 font-medium uppercase tracking-wider mb-0.5">
                      {card.label}
                    </div>
                    <div className="font-mono text-sm md:text-[15px] font-semibold text-slate-900 break-words">
                      {card.value}
                    </div>
                  </div>

                  {/* Иконка действия (для кликабельных) */}
                  {card.href && (
                    <a
                      href={card.href}
                      onClick={(e) => e.stopPropagation()}
                      className="flex-shrink-0 w-9 h-9 flex items-center justify-center rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 transition-colors"
                      aria-label={`Открыть ${card.label}`}
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  )}

                  {/* Иконка копирования для некликабельных */}
                  {!card.href && card.copyable && (
                    <div className="flex-shrink-0 w-9 h-9 flex items-center justify-center rounded-lg text-slate-400 group-hover:text-emerald-600 transition-colors">
                      {copiedId === card.id ? (
                        <svg className="w-4 h-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      )}
                    </div>
                  )}
                </motion.div>
              ))}
            </div>

            {/* ─── Карточка реквизитов ───────────────────────────────────── */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.5 }}
              className="bg-white rounded-2xl border border-slate-200/80 p-5 md:p-6 shadow-sm"
            >
              <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <svg className="w-4 h-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Реквизиты компании
                </h2>
                <a
                  href="/requisites.pdf"
                  download
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white rounded-lg text-xs font-semibold transition-all shadow-md shadow-emerald-600/20"
                  onClick={() => trackGoal('requisites_pdf_download', { section: 'contacts_page' })}
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                  </svg>
                  Скачать реквизиты (PDF)
                </a>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2.5 text-xs">
                {REQUISITES.map((r) => (
                  <div key={r.label} className="flex flex-col gap-0.5 pb-2 border-b border-slate-100 last:border-0">
                    <span className="text-slate-500 font-medium">{r.label}</span>
                    <span className="font-mono font-semibold text-slate-900 break-words">{r.value}</span>
                  </div>
                ))}
              </div>
              <p className="text-[11px] text-slate-400 mt-4 flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Банковские реквизиты предоставим по запросу: info@chip-net.ru
              </p>
            </motion.div>
          </div>

          {/* ═══ ПРАВАЯ КОЛОНКА (lg:col-span-6) ═════════════════════════════ */}
          <div className="lg:col-span-6">
            {/* ─── Форма обратной связи ───────────────────────────────────── */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white rounded-2xl border border-slate-200/80 p-5 md:p-7 shadow-sm mb-6"
            >
              <h2 className="text-xl font-bold text-slate-900 mb-1.5">
                Обратный звонок
              </h2>
              <p className="text-sm text-slate-500 mb-5">
                Оставьте контакты — перезвоним в течение 30 минут в рабочее время.
              </p>

              {status === 'success' ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-8"
                >
                  <div className="w-14 h-14 mx-auto mb-3 bg-emerald-100 rounded-full flex items-center justify-center">
                    <svg className="w-7 h-7 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-1">Заявка отправлена!</h3>
                  <p className="text-sm text-slate-500 mb-4">Мы свяжемся с вами в ближайшее время.</p>
                  <button
                    onClick={() => setStatus('idle')}
                    className="text-sm font-medium text-emerald-700 hover:text-emerald-800 transition"
                  >
                    Отправить ещё одну заявку
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Имя */}
                  <div>
                    <label htmlFor="cf-name" className="block text-xs font-medium text-slate-700 mb-1.5">
                      Имя <span className="text-rose-500">*</span>
                    </label>
                    <input
                      id="cf-name"
                      type="text"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      required
                      placeholder="Как к вам обращаться?"
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-colors"
                    />
                  </div>

                  {/* Телефон/Email */}
                  <div>
                    <label htmlFor="cf-contact" className="block text-xs font-medium text-slate-700 mb-1.5">
                      Телефон или Email <span className="text-rose-500">*</span>
                    </label>
                    <input
                      id="cf-contact"
                      type="text"
                      value={form.contact}
                      onChange={(e) => setForm({ ...form, contact: e.target.value })}
                      required
                      placeholder="+7 (999) 123-45-67 или info@company.ru"
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-colors font-mono"
                    />
                  </div>

                  {/* Комментарий / Артикул */}
                  <div>
                    <label htmlFor="cf-message" className="block text-xs font-medium text-slate-700 mb-1.5">
                      Комментарий или артикул компонента
                    </label>
                    <textarea
                      id="cf-message"
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      rows={3}
                      placeholder="Например: нужен STM32F103C8T6, 500 шт..."
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-colors resize-y"
                    />
                  </div>

                  {/* Ошибка */}
                  {status === 'error' && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="px-3.5 py-2.5 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-700 flex items-start gap-2"
                    >
                      <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                      {errorMsg}
                    </motion.div>
                  )}

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={status === 'loading'}
                    className="w-full inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-semibold py-3 rounded-xl transition-all shadow-md shadow-emerald-600/20 disabled:opacity-60 disabled:cursor-not-allowed"
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
                        Отправить сообщение
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                        </svg>
                      </>
                    )}
                  </button>

                  <p className="text-[11px] text-slate-400 text-center">
                    Нажимая «Отправить», вы соглашаетесь с обработкой персональных данных.
                  </p>
                </form>
              )}
            </motion.div>

            {/* ─── Яндекс.Карта (закруглённая, h-280px) ────────────────────── */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-sm"
            >
              <div className="px-5 py-3 border-b border-slate-100 flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <svg className="w-4 h-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Офис на карте
                </h3>
                <a
                  href="https://yandex.ru/maps/?text=Белгород,+Шаландина+4+к3"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-medium text-emerald-700 hover:text-emerald-800 transition flex items-center gap-1"
                >
                  Открыть в Яндекс.Картах
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </div>
              <div className="h-[280px] relative">
                <iframe
                  loading="lazy"
                  src="https://yandex.ru/map-widget/v1/?um=constructor%3A619abb19c4c878892657356a3e329d1788ec96a002538002228dffa402cebfd0&source=constructor&z=16&text=%D0%91%D0%B5%D0%BB%D0%B3%D0%BE%D1%80%D0%BE%D0%B4%2C%20%D0%A8%D0%B0%D0%BB%D0%B0%D0%BD%D0%B4%D0%B8%D0%BD%D0%B0%204%20%D0%BA3"
                  width="100%"
                  height="100%"
                  frameBorder="0"
                  title="Офис ООО Деловой Партнёр на карте — Белгород, Шаландина 4 к3"
                  className="block"
                />
              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </main>
  );
}

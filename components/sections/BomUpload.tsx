'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useActionState } from 'react';
import { motion } from 'framer-motion';
import { useSearchParams } from 'next/navigation';
import { submitRequest } from '@/app/actions/request-action';

// ─── Преимущества BOM-комплектации ─────────────────────────────────────────
const ADVANTAGES = [
  {
    title: 'КП за 2 часа',
    description: 'Коммерческое предложение с ценами, сроками и аналогами — в течение 2 часов в рабочее время',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    color: 'emerald',
  },
  {
    title: 'Подбор аналогов EOL',
    description: 'Подберём функциональные аналоги для снятых с производства и санкционных компонентов',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
      </svg>
    ),
    color: 'amber',
  },
  {
    title: 'Постоплата для постоянных клиентов',
    description: 'Отсрочка платежа до 30 дней для проверенных партнёров после первой сделки',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
      </svg>
    ),
    color: 'blue',
  },
];

const ACCEPTED_FORMATS = '.xlsx,.xls,.pdf,.csv';
const ACCEPTED_EXTS = ['xlsx', 'xls', 'pdf', 'csv'];

// Цветовые классы для преимуществ
const ADV_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  emerald: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
  amber: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
  blue: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
};

export default function BomUpload() {
  const [fileName, setFileName] = useState('');
  const [fileSize, setFileSize] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [dragError, setDragError] = useState('');
  const searchParams = useSearchParams();
  const componentFromUrl = searchParams.get('component') || '';

  const [state, formAction, isPending] = useActionState(submitRequest, { success: false, message: '' });

  const [messageValue, setMessageValue] = useState('');
  const sectionRef = useRef<HTMLElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (componentFromUrl) {
      setMessageValue(`Требуется подобрать компонент: ${componentFromUrl}\n\nУточните наличие, цену и сроки поставки.`);
      setTimeout(() => {
        sectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 300);
    }
  }, [componentFromUrl]);

  // ─── Форматирование размера файла ────────────────────────────────────────
  const formatSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} Б`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} КБ`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} МБ`;
  };

  // ─── Обработка выбранного файла ──────────────────────────────────────────
  const handleFile = useCallback((file: File) => {
    const ext = file.name.split('.').pop()?.toLowerCase() || '';
    if (!ACCEPTED_EXTS.includes(ext)) {
      setDragError(`Формат .${ext} не поддерживается. Допустимо: ${ACCEPTED_EXTS.map(e => '.' + e).join(', ')}`);
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setDragError('Файл слишком большой. Максимум 10 МБ.');
      return;
    }
    setDragError('');
    setFileName(file.name);
    setFileSize(formatSize(file.size));
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFile(e.target.files[0]);
    }
  };

  // ─── Drag & Drop обработчики ─────────────────────────────────────────────
  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
    setDragError('');
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Проверяем, что курсор покинул зону (а не дочерний элемент)
    if (e.currentTarget === e.target) {
      setIsDragging(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  };

  const clearFile = () => {
    setFileName('');
    setFileSize('');
    setDragError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <section id="bom" ref={sectionRef} className="py-16 px-4 bg-section-alt relative overflow-hidden scroll-mt-[195px]">
      <div className="max-w-5xl mx-auto relative z-10">
        {/* Заголовок */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-3 bg-emerald-100 border border-emerald-300 rounded-full text-xs font-semibold text-emerald-800">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            BOM-комплектация для производств
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-3 text-[#121212]">
            Загрузите спецификацию — получите КП за 2 часа
          </h2>
          <p className="text-[#555] text-base max-w-3xl mx-auto leading-relaxed">
            Отправьте BOM в любом удобном формате — команда Chip-Net подберёт оптимальные решения по срокам, стоимости и доступности. Работаем с промышленной электроникой, embedded-системами, телеком-оборудованием.
          </p>
        </motion.div>

        {/* ═══ ПРЕИМУЩЕСТВА (3 карточки) ══════════════════════════════════ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6"
        >
          {ADVANTAGES.map((adv) => {
            const c = ADV_COLORS[adv.color];
            return (
              <div
                key={adv.title}
                className={`group ${c.bg} border ${c.border} rounded-xl p-4 transition-all hover:shadow-md hover:-translate-y-0.5`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 ${c.bg} ${c.text} border ${c.border} rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
                    {adv.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className={`text-sm font-bold ${c.text} mb-1`}>{adv.title}</h3>
                    <p className="text-xs text-[#555] leading-relaxed">{adv.description}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </motion.div>

        {/* ═══ ФОРМА ═══════════════════════════════════════════════════════ */}
        <motion.form
          action={formAction}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white border border-[#e8e8e8] rounded-2xl p-5 md:p-8 shadow-lg"
        >
          {state.message && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className={`mb-4 px-4 py-3 rounded-lg text-center text-sm font-semibold ${
                state.success ? 'bg-section-alt border border-primary/30 text-primary' : 'bg-red-50 border border-danger/30 text-danger'
              }`}
            >
              {state.message}
            </motion.div>
          )}

          {componentFromUrl && (
            <div className="mb-4 px-4 py-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-800 text-sm">
              <strong>Запрос на компонент:</strong> {componentFromUrl}
              <p className="text-xs mt-1 text-amber-700">Заполните форму ниже — мы подберём оптимальное решение по цене и срокам.</p>
            </div>
          )}

          {/* ── Поля компания/ИНН/email/телефон ──────────────────────────── */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
            <div>
              <label className="block text-xs font-medium text-[#333] mb-1">Компания</label>
              <input
                type="text"
                name="company_name"
                required
                className="w-full bg-[#eaf0e8] border border-[#e8e8e8] rounded-lg px-3 py-2 text-sm text-[#121212] placeholder-[#999] focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-colors"
                placeholder="ООО Инжиниринг"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#333] mb-1">ИНН</label>
              <input
                type="text"
                name="inn"
                required
                className="w-full bg-[#eaf0e8] border border-[#e8e8e8] rounded-lg px-3 py-2 text-sm text-[#121212] placeholder-[#999] focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-colors"
                placeholder="7712345678"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#333] mb-1">Email</label>
              <input
                type="email"
                name="email"
                required
                className="w-full bg-[#eaf0e8] border border-[#e8e8e8] rounded-lg px-3 py-2 text-sm text-[#121212] placeholder-[#999] focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-colors"
                placeholder="info@company.ru"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#333] mb-1">Телефон</label>
              <input
                type="tel"
                name="phone"
                className="w-full bg-[#eaf0e8] border border-[#e8e8e8] rounded-lg px-3 py-2 text-sm text-[#121212] placeholder-[#999] focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-colors"
                placeholder="+7 (999) 123-45-67"
              />
            </div>
          </div>

          {/* ── Список компонентов ───────────────────────────────────────── */}
          <div className="mb-4">
            <label className="block text-xs font-medium text-[#333] mb-1">Список компонентов или комментарий</label>
            <textarea
              name="message"
              value={messageValue}
              onChange={(e) => setMessageValue(e.target.value)}
              rows={4}
              required
              className="w-full bg-[#eaf0e8] border border-[#e8e8e8] rounded-lg px-3 py-2 text-sm text-[#121212] placeholder-[#999] focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-colors resize-y"
              placeholder="STM32F103C8T6 - 500 шт, LM7805CT - 200 шт..."
            />
          </div>

          {/* ═══ DRAG-AND-DROP ЗОНА ════════════════════════════════════════ */}
          <div className="mb-4">
            <label className="block text-xs font-medium text-[#333] mb-2">BOM-файл (необязательно)</label>
            <input
              type="file"
              name="bom_file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept={ACCEPTED_FORMATS}
              className="hidden"
              id="bom-file-input"
            />

            {!fileName ? (
              <div
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`relative cursor-pointer border-2 border-dashed rounded-xl px-4 py-8 text-center transition-all ${
                  isDragging
                    ? 'border-emerald-500 bg-emerald-50 scale-[1.02]'
                    : 'border-emerald-800/30 bg-[#f7f9f6] hover:border-emerald-600/60 hover:bg-emerald-50/40'
                }`}
              >
                <input type="hidden" name="bom_file_name" value={fileName} />

                {/* Иконка */}
                <div className={`mx-auto w-14 h-14 rounded-full flex items-center justify-center mb-3 transition-all ${
                  isDragging ? 'bg-emerald-500 text-white scale-110' : 'bg-emerald-100 text-emerald-700'
                }`}>
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                </div>

                <p className="text-sm font-semibold text-[#121212] mb-1">
                  {isDragging ? 'Отпустите файл здесь' : 'Перетащите файл сюда или нажмите для выбора'}
                </p>
                <p className="text-xs text-[#757575]">
                  Поддерживаемые форматы: {ACCEPTED_EXTS.map(e => '.' + e).join(', ')}
                  <span className="mx-1.5 text-[#d4ddd2]">·</span>
                  Макс. размер 10 МБ
                </p>

                {/* Бейджи форматов */}
                <div className="flex flex-wrap items-center justify-center gap-1.5 mt-3">
                  {ACCEPTED_EXTS.map(ext => (
                    <span key={ext} className="inline-flex items-center px-2 py-0.5 bg-white border border-emerald-800/30 rounded text-[10px] font-mono font-semibold text-emerald-700">
                      .{ext}
                    </span>
                  ))}
                </div>

                {dragError && (
                  <p className="mt-3 text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2 inline-block">
                    {dragError}
                  </p>
                )}
              </div>
            ) : (
              /* ── Карточка выбранного файла ──────────────────────────── */
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative bg-emerald-50 border border-emerald-300 rounded-xl px-4 py-4 flex items-center gap-3"
              >
                <input type="hidden" name="bom_file_name" value={fileName} />

                <div className="w-12 h-12 bg-emerald-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-[#121212] truncate">{fileName}</div>
                  <div className="flex items-center gap-2 text-xs text-[#757575] mt-0.5">
                    {fileSize && <span>{fileSize}</span>}
                    <span className="text-emerald-600 font-medium">✓ Готов к отправке</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={clearFile}
                  aria-label="Удалить файл"
                  className="w-8 h-8 flex items-center justify-center rounded-lg text-[#757575] hover:text-red-600 hover:bg-red-50 transition-colors flex-shrink-0"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </motion.div>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isPending}
            className="w-full bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-bold py-3.5 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2"
          >
            {isPending ? (
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
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </>
            )}
          </button>

          <p className="text-xs text-[#9a9a9a] text-center mt-3">
            Нажимая «Отправить», вы соглашаетесь с обработкой персональных данных. КП обычно приходит в течение 2 часов.
          </p>
        </motion.form>
      </div>
    </section>
  );
}

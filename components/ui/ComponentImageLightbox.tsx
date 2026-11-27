// components/ui/ComponentImageLightbox.tsx
// Лайтбокс для фото компонента в карточке товара (/component/[sku]).
// Клик по превью открывает модальное окно с крупным изображением:
//   • тёмный фон bg-black/75, закрытие по клику на фон и по Escape;
//   • белая подложка, изображение max-w-2xl max-h-[80vh] object-contain;
//   • кнопка закрытия «×»;
//   • лёгкий hover-эффект (рамка + тень + лёгкий zoom) и бейдж с лупой;
//   • блокировка прокрутки страницы, пока открыт модал.
// Если фото не загрузилось (битый путь/заглушка) — показываем аккуратный
// плейсхолдер вместо битой картинки, интерфейс не ломается.
'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import ComponentImage, { getComponentImagePath } from '@/components/ui/ComponentImage';

type Props = {
  sku: string;
  name?: string;
  category?: string;
  /** Размер превью (px) — как в ComponentImage */
  size?: number;
  /** Классы внешнего контейнера превью (w-32 h-32 sm:w-40 sm:h-40 и т.п.) */
  className?: string;
  attributes?: Record<string, string> | null;
};

export default function ComponentImageLightbox({
  sku,
  name = '',
  category = '',
  size = 160,
  className,
  attributes,
}: Props) {
  const [open, setOpen] = useState(false);
  const [failed, setFailed] = useState(false);
  const closeBtnRef = useRef<HTMLButtonElement | null>(null);

  // Тот же путь, что рендерит ComponentImage — без дублирования логики
  const imagePath = getComponentImagePath({ sku, name, category, attributes });

  const openLightbox = useCallback(() => {
    setFailed(false);
    setOpen(true);
  }, []);

  const closeLightbox = useCallback(() => setOpen(false), []);

  // Escape + блокировка прокрутки body, пока модал открыт
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeLightbox();
    };

    document.addEventListener('keydown', onKeyDown);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // фокус на кнопке закрытия — чтобы Escape/Tab работали предсказуемо
    const t = setTimeout(() => closeBtnRef.current?.focus(), 50);

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = prevOverflow;
      clearTimeout(t);
    };
  }, [open, closeLightbox]);

  const alt = `${sku} — ${category || 'электронный компонент'}`;

  return (
    <>
      {/* ── Превью с зоной клика ─────────────────────────────────────────── */}
      <button
        type="button"
        onClick={openLightbox}
        title={`Увеличить изображение ${sku}`}
        aria-label={`Увеличить изображение ${sku}`}
        className={`group relative block flex-shrink-0 w-32 h-32 sm:w-40 sm:h-40 rounded-2xl overflow-hidden border border-[#e8e8e8] bg-white shadow-sm cursor-zoom-in transition-all duration-200 hover:shadow-lg hover:border-primary/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 ${className ?? ''}`}
      >
        {/* Фото с лёгким zoom при hover */}
        <span className="block w-full h-full transition-transform duration-300 ease-out group-hover:scale-[1.06]">
          <ComponentImage
            sku={sku}
            name={name}
            category={category}
            size={size}
            className="w-full h-full"
            attributes={attributes}
          />
        </span>

        {/* Полупрозрачная затемняющая плёнка при hover */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-primary/0 group-hover:bg-primary/10 transition-colors duration-200"
        />

        {/* Бейдж с лупой: всегда слегка виден, ярче при hover */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute bottom-1.5 right-1.5 inline-flex items-center justify-center w-7 h-7 rounded-full bg-white/90 shadow-md text-primary opacity-60 group-hover:opacity-100 transition-opacity duration-200"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.2-5.2m2.2-5.3a7.5 7.5 0 11-15 0 7.5 7.5 0 0115 0z" />
          </svg>
        </span>
      </button>

      {/* ── Модальное окно ───────────────────────────────────────────────── */}
      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Изображение компонента ${sku}`}
          className="fixed inset-0 z-[110] flex items-center justify-center bg-black/75 p-4 sm:p-8 animate-lightbox-fade"
          onClick={closeLightbox}
        >
          <div
            className="relative bg-white rounded-2xl p-3 sm:p-4 shadow-2xl animate-lightbox-zoom"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Кнопка закрытия × */}
            <button
              ref={closeBtnRef}
              type="button"
              onClick={closeLightbox}
              aria-label="Закрыть просмотр изображения"
              className="absolute -top-3 -right-3 w-9 h-9 rounded-full bg-white text-[#333] shadow-lg border border-[#e8e8e8] flex items-center justify-center text-2xl leading-none hover:bg-[#f0f4ee] hover:text-danger transition-colors"
            >
              ×
            </button>

            {/* Крупное изображение — или плейсхолдер, если не загрузилось */}
            {failed ? (
              <div className="w-[min(672px,90vw)] max-w-2xl h-[60vh] flex flex-col items-center justify-center gap-3 bg-[#f0f4ee] rounded-xl text-[#757575]">
                <svg className="w-14 h-14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="text-sm font-medium">Фото компонента {sku} временно недоступно</p>
                <p className="text-xs">Отправьте запрос — пришлём фото и даташит от менеджера</p>
              </div>
            ) : (
              <Image
                src={imagePath}
                alt={alt}
                width={1024}
                height={1024}
                priority
                sizes="(max-width: 768px) 90vw, 672px"
                onError={() => setFailed(true)}
                className="max-w-2xl max-h-[80vh] w-auto h-auto object-contain rounded-xl"
                style={{ width: 'auto', height: 'auto' }}
              />
            )}

            {/* Подпись под изображением */}
            <p className="mt-2.5 text-center text-xs sm:text-sm text-[#757575] truncate px-2">
              {sku}
              {name ? ` — ${name}` : ''}
              <span className="text-[#cbcbcb] mx-1">·</span>
              <span className="text-primary">клик по фону или Esc — закрыть</span>
            </p>
          </div>
        </div>
      )}
    </>
  );
}

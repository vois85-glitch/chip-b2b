'use client';

import Link from 'next/link';

export type Crumb = {
  name: string;
  /** href отсутствует только у последнего (текущего) элемента */
  href?: string;
};

/**
 * components/ui/BreadcrumbNav.tsx — навигационные кнопки (хлебные крошки).
 * 2026-10-31: по требованию заказчика навигация оформлена НАСТОЯЩИМИ кнопками:
 *  - пилюли высотой 40px (h-10) — удобно попадать пальцем на мобильном;
 *  - белая плашка с рамкой и мягкой тенью — читается как элемент управления;
 *  - hover: изумрудная рамка/текст (в тон кнопкам пагинации каталога);
 *  - текущая страница — заполненная изумрудная пилюля («вы здесь»);
 *  - разделители-шевроны вместо текстового «/».
 * Всё это серверный компонент: только <Link>, без хуков.
 */
export default function BreadcrumbNav({
  items,
  ariaLabel = 'Хлебные крошки',
  className = '',
}: {
  items: Crumb[];
  ariaLabel?: string;
  className?: string;
}) {
  return (
    <nav aria-label={ariaLabel} className={`flex items-center flex-wrap gap-x-1.5 gap-y-2 ${className}`}>
      {items.map((c, i) => {
        const isLast = i === items.length - 1 || !c.href;
        const isFirst = i === 0;
        return (
          <span key={`${c.name}-${i}`} className="inline-flex items-center gap-1.5">
            {isLast ? (
              <span
                aria-current="page"
                className="inline-flex items-center h-10 px-4 bg-primary text-white rounded-full text-sm font-bold shadow-sm select-none"
              >
                {c.name}
              </span>
            ) : (
              <Link
                prefetch={false}
                href={c.href!}
                className="inline-flex items-center gap-1.5 h-10 px-4 bg-white border border-[#e4eae2] rounded-full text-sm font-semibold text-[#555] hover:text-primary hover:border-primary/50 hover:bg-[#f4faf6] active:bg-[#e6f2ea] transition-all shadow-sm touch-manipulation"
              >
                {isFirst && (
                  <svg className="w-4 h-4 text-[#9aa89f]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                )}
                {c.name}
              </Link>
            )}
            {!isLast && (
              <svg className="w-3.5 h-3.5 text-[#c4cdc2] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            )}
          </span>
        );
      })}
    </nav>
  );
}

'use client';

import { trackGoal } from '@/lib/metrika';

/**
 * Кнопка «Заказать звонок» для серверных компонентов (hero каталога, футер и т.д.).
 * Открывает единое окно заявки CallbackModal (смонтировано в Header) через
 * глобальное событие 'open-callback-modal'.
 */
export default function CallbackRequestButton({
  className = '',
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      className={className}
      onClick={() => {
        trackGoal('callback_open', { source: 'button' });
        window.dispatchEvent(new CustomEvent('open-callback-modal'));
      }}
    >
      {children}
    </button>
  );
}

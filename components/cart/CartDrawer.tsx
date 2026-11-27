// components/cart/CartDrawer.tsx
// Выезжающая справа панель с составом корзины.
// Доступна из любой страницы (оборачивается в CartProvider в root layout).

'use client';

import { useCart } from '@/lib/cart-context';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, totalItems } = useCart();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Не рендерить на SSR (избегаем несоответствий)
  if (!mounted) return null;

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[70] bg-black/40 backdrop-blur-sm"
          onClick={closeCart}
          aria-hidden="true"
        />
      )}

      {/* Drawer */}
      <aside
        className={`fixed top-0 right-0 bottom-0 z-[71] w-full max-w-md bg-white shadow-2xl transition-transform duration-300 ease-out flex flex-col ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        aria-label="Корзина"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#e8e8e8] bg-gradient-to-r from-[#02a391] to-[#027d70] text-white">
          <div className="flex items-center gap-2.5">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <div>
              <h2 className="text-lg font-bold leading-tight">Корзина заявки</h2>
              <p className="text-xs text-white/80">
                {totalItems > 0
                  ? `${totalItems} ${totalItems === 1 ? 'позиция' : totalItems < 5 ? 'позиции' : 'позиций'} в заявке`
                  : 'Пусто'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={closeCart}
            className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-white/10 transition-colors"
            aria-label="Закрыть"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body: список позиций */}
        <div className="flex-1 overflow-y-auto">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full px-6 text-center">
              <div className="w-20 h-20 rounded-full bg-[#eaf0e8] flex items-center justify-center mb-4">
                <svg className="w-10 h-10 text-[#9a9a9a]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-base font-semibold text-[#121212] mb-1.5">Корзина пуста</h3>
              <p className="text-sm text-[#757575] mb-5">
                Добавьте компоненты из каталога, чтобы сформировать заявку на расчёт стоимости.
              </p>
              <Link prefetch={false}
                href="/catalog"
                onClick={closeCart}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary hover:bg-primary-dark text-white rounded-lg text-sm font-semibold transition-colors"
              >
                Перейти в каталог
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          ) : (
            <ul className="divide-y divide-[#e8e8e8]">
              {items.map(item => (
                <li key={item.sku} className="px-4 py-3.5 hover:bg-[#f8faf7] transition-colors">
                  <div className="flex items-start gap-3">
                    <div className="flex-1 min-w-0">
                      <Link prefetch={false}
                        href={`/component/${encodeURIComponent(item.sku)}`}
                        onClick={closeCart}
                        className="font-mono text-sm font-bold text-[#121212] hover:text-primary transition-colors break-all leading-tight"
                      >
                        {item.sku}
                      </Link>
                      <p className="text-xs text-[#555] mt-0.5 line-clamp-1">{item.name}</p>
                      <div className="flex items-center gap-1.5 mt-1.5">
                        <span className="px-1.5 py-0.5 bg-[#eaf0e8] rounded text-[10px] text-[#02a391] font-medium">
                          {item.brand}
                        </span>
                        <span className="text-[10px] text-[#9a9a9a] truncate max-w-[140px]">
                          {item.category}
                        </span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeItem(item.sku)}
                      className="w-7 h-7 flex items-center justify-center rounded text-[#9a9a9a] hover:text-red-600 hover:bg-red-50 transition-colors shrink-0"
                      aria-label="Удалить"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>

                  {/* Quantity controls */}
                  <div className="flex items-center justify-between mt-2.5">
                    <div className="flex items-center border border-[#e8e8e8] rounded-lg overflow-hidden bg-white">
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.sku, item.quantity - 1)}
                        className="w-8 h-8 flex items-center justify-center text-[#555] hover:bg-[#eaf0e8] hover:text-primary transition-colors"
                        aria-label="Меньше"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" />
                        </svg>
                      </button>
                      <input
                        type="number"
                        min="1"
                        max="999999"
                        value={item.quantity}
                        onChange={(e) => {
                          const v = parseInt(e.target.value) || 1;
                          updateQuantity(item.sku, v);
                        }}
                        className="w-14 h-8 text-center text-sm font-semibold text-[#121212] focus:outline-none border-x border-[#e8e8e8] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      />
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.sku, item.quantity + 1)}
                        className="w-8 h-8 flex items-center justify-center text-[#555] hover:bg-[#eaf0e8] hover:text-primary transition-colors"
                        aria-label="Больше"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                        </svg>
                      </button>
                    </div>
                    <span className="text-xs text-[#9a9a9a]">шт.</span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer: оформление заявки */}
        {items.length > 0 && (
          <div className="border-t border-[#e8e8e8] bg-[#f8faf7] px-4 py-4 space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-[#555]">Позиций в заявке:</span>
              <span className="font-bold text-[#121212]">{items.length}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-[#555]">Общее количество:</span>
              <span className="font-bold text-[#121212]">{totalItems.toLocaleString('ru-RU')} шт.</span>
            </div>
            <p className="text-xs text-[#757575] leading-relaxed">
              Цена рассчитывается индивидуально под объём заказа. Менеджер свяжется с вами в течение 24 часов.
            </p>
            <div className="flex flex-col gap-2 pt-1">
              <Link prefetch={false}
                href="/cart"
                onClick={closeCart}
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 bg-primary hover:bg-primary-dark text-white rounded-lg text-sm font-semibold transition-colors shadow-sm"
              >
                Оформить заявку
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </Link>
              <button
                type="button"
                onClick={() => {
                  if (confirm('Очистить корзину?')) {
                    items.forEach(i => removeItem(i.sku));
                  }
                }}
                className="w-full text-xs text-[#757575] hover:text-red-600 transition-colors py-1.5"
              >
                Очистить корзину
              </button>
            </div>
          </div>
        )}
      </aside>
    </>
  );
}

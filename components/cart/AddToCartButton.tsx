// components/cart/AddToCartButton.tsx
// Кнопка добавления компонента в корзину.
// Размеры: 'sm' (карточки), 'md' (страница компонента), 'lg' (hero)

'use client';

import { useCart } from '@/lib/cart-context';
import { useState } from 'react';

type Props = {
  sku: string;
  name: string;
  brand: string;
  category: string;
  quantity?: number;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'outline';
  className?: string;
  label?: string;
};

export default function AddToCartButton({
  sku,
  name,
  brand,
  category,
  quantity = 1,
  size = 'md',
  variant = 'primary',
  className = '',
  label = 'В корзину',
}: Props) {
  const { addItem, items, updateQuantity } = useCart();
  const [justAdded, setJustAdded] = useState(false);

  const inCart = items.find(i => i.sku === sku);
  const inCartQty = inCart?.quantity || 0;

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (inCart) {
      // Уже в корзине — увеличить количество
      updateQuantity(sku, inCartQty + quantity);
    } else {
      addItem({ sku, name, brand, category }, quantity);
    }
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1500);
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-xs gap-1',
    md: 'px-4 py-2 text-sm gap-1.5',
    lg: 'px-6 py-3 text-base gap-2',
  };

  const variantClasses = {
    primary: 'bg-primary hover:bg-primary-dark text-white shadow-sm',
    outline: 'border border-primary text-primary hover:bg-primary/5 bg-white',
  };

  if (justAdded) {
    return (
      <button
        onClick={handleClick}
        className={`inline-flex items-center justify-center rounded-lg font-semibold transition-all ${sizeClasses[size]} bg-emerald-50 text-emerald-700 border border-emerald-200 ${className}`}
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
        {inCart ? `Добавлено (${inCartQty + quantity})` : 'Добавлено!'}
      </button>
    );
  }

  return (
    <button
      onClick={handleClick}
      className={`inline-flex items-center justify-center rounded-lg font-semibold transition-all ${sizeClasses[size]} ${variantClasses[variant]} ${className} hover:scale-[1.02] active:scale-[0.98]`}
      aria-label={`Добавить ${sku} в корзину`}
    >
      <svg className={size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4'} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
      {inCart ? `В корзине: ${inCartQty} +` : label}
    </button>
  );
}

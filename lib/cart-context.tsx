// lib/cart-context.tsx
// Глобальный контекст корзины с сохранением в localStorage.
// Используется для добавления компонентов в заявку (RFQ) с указанием количества.

'use client';

import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';

export type CartItem = {
  sku: string;
  name: string;
  brand: string;
  category: string;
  quantity: number;
  addedAt: number;
};

type CartContextValue = {
  items: CartItem[];
  isOpen: boolean;
  totalItems: number;
  addItem: (item: Omit<CartItem, 'quantity' | 'addedAt'>, quantity?: number) => void;
  removeItem: (sku: string) => void;
  updateQuantity: (sku: string, quantity: number) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

const STORAGE_KEY = 'chipnet-cart-v1';
const MAX_QUANTITY = 999999;

function loadFromStorage(): CartItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const data = JSON.parse(raw);
    if (!Array.isArray(data)) return [];
    return data.filter(item =>
      item && typeof item.sku === 'string' && typeof item.quantity === 'number'
    );
  } catch {
    return [];
  }
}

function saveToStorage(items: CartItem[]) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    // NOTE: не диспатчим 'chipnet-cart-updated' event — это вызывает гонку состояний
    // в пределах той же вкладки (loadFromStorage перезаписывает только что установленное состояние).
    // Cross-tab sync работает через нативный 'storage' event (см. ниже).
  } catch {}
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  // Hydrate из localStorage после монтирования (избегаем SSR-несоответствий)
  useEffect(() => {
    setItems(loadFromStorage());
    setHydrated(true);
  }, []);

  // Сохранять в localStorage при каждом изменении
  useEffect(() => {
    if (hydrated) {
      saveToStorage(items);
    }
  }, [items, hydrated]);

  // Синхронизация между вкладками (через нативный storage event —
  // он срабатывает только в ДРУГИХ вкладках, не в текущей)
  useEffect(() => {
    if (!hydrated) return;
    const handleStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) {
        setItems(loadFromStorage());
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => {
      window.removeEventListener('storage', handleStorage);
    };
  }, [hydrated]);

  // Закрытие по Escape
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen]);

  // Блокировка скролла body при открытом drawer
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const addItem = useCallback((item: Omit<CartItem, 'quantity' | 'addedAt'>, quantity: number = 1) => {
    setItems(prev => {
      const existing = prev.find(i => i.sku === item.sku);
      if (existing) {
        return prev.map(i =>
          i.sku === item.sku
            ? { ...i, quantity: Math.min(MAX_QUANTITY, i.quantity + quantity) }
            : i
        );
      }
      return [...prev, { ...item, quantity: Math.min(MAX_QUANTITY, quantity), addedAt: Date.now() }];
    });
    // Открыть drawer при добавлении (визуальная обратная связь)
    setIsOpen(true);
  }, []);

  const removeItem = useCallback((sku: string) => {
    setItems(prev => prev.filter(i => i.sku !== sku));
  }, []);

  const updateQuantity = useCallback((sku: string, quantity: number) => {
    if (quantity < 1) {
      setItems(prev => prev.filter(i => i.sku !== sku));
      return;
    }
    setItems(prev => prev.map(i =>
      i.sku === sku
        ? { ...i, quantity: Math.min(MAX_QUANTITY, quantity) }
        : i
    ));
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);
  const toggleCart = useCallback(() => setIsOpen(prev => !prev), []);

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        isOpen,
        totalItems,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        openCart,
        closeCart,
        toggleCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error('useCart must be used within CartProvider');
  }
  return ctx;
}

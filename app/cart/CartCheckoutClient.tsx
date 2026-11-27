// app/cart/CartCheckoutClient.tsx
// Клиентский компонент для страницы /cart.
// Читает корзину из контекста, показывает список + форму контактов.

'use client';

import { useCart } from '@/lib/cart-context';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

type FormState = {
  company: string;
  contactName: string;
  email: string;
  phone: string;
  comment: string;
};

type FormErrors = Partial<Record<keyof FormState, string>>;

export default function CartCheckoutClient() {
  const { items, totalItems, removeItem, updateQuantity, clearCart } = useCart();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [requestId, setRequestId] = useState<string>('');
  const [form, setForm] = useState<FormState>({
    company: '',
    contactName: '',
    email: '',
    phone: '',
    comment: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    setMounted(true);
  }, []);

  // Если корзина пуста и заявка отправлена — показать success
  // Если корзина пуста и не отправлена — показать empty state

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    if (!form.company.trim()) newErrors.company = 'Укажите название компании';
    if (!form.contactName.trim()) newErrors.contactName = 'Укажите контактное лицо';
    if (!form.email.trim()) {
      newErrors.email = 'Укажите email';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = 'Некорректный email';
    }
    if (!form.phone.trim()) {
      newErrors.phone = 'Укажите телефон';
    } else if (form.phone.replace(/\D/g, '').length < 10) {
      newErrors.phone = 'Некорректный телефон';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate() || items.length === 0) return;

    setSubmitting(true);
    try {
      const payload = {
        ...form,
        items: items.map(i => ({
          sku: i.sku,
          name: i.name,
          brand: i.brand,
          category: i.category,
          quantity: i.quantity,
        })),
        totalItems,
        submittedAt: new Date().toISOString(),
        source: 'cart',
      };

      const resp = await fetch('/api/cart-submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (resp.ok) {
        const data = await resp.json();
        setRequestId(data.requestId || `CN-${Date.now().toString(36).toUpperCase()}`);
        setSubmitted(true);
        clearCart();
        // Прокрутить наверх для показа success-блока
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        alert('Не удалось отправить заявку. Попробуйте ещё раз или свяжитесь с нами по телефону.');
      }
    } catch (err) {
      alert('Ошибка сети. Проверьте подключение и попробуйте снова.');
    } finally {
      setSubmitting(false);
    }
  };

  // Не рендерить на SSR
  if (!mounted) {
    return (
      <div className="bg-white rounded-2xl border border-[#e8e8e8] p-8 text-center">
        <div className="animate-pulse">Загрузка корзины...</div>
      </div>
    );
  }

  // Success screen
  if (submitted) {
    return (
      <div className="bg-white rounded-2xl border border-emerald-200 p-8 md:p-12 text-center shadow-sm">
        <div className="w-20 h-20 mx-auto rounded-full bg-emerald-100 flex items-center justify-center mb-6">
          <svg className="w-10 h-10 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-[#121212] mb-3">Заявка отправлена!</h2>
        <p className="text-[#555] mb-4 max-w-md mx-auto">
          Заявка мгновенно передана менеджерам ChipNet в Telegram.
          Мы свяжемся с вами в течение рабочего дня для уточнения деталей и подготовки КП.
        </p>
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#eaf0e8] rounded-lg text-sm text-[#02a391] font-mono font-semibold mb-6">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          № заявки: {requestId}
        </div>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/catalog"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-primary hover:bg-primary-dark text-white rounded-lg text-sm font-semibold transition-colors"
          >
            Продолжить выбор
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </Link>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 border border-[#e8e8e8] hover:bg-[#f0f4ee] rounded-lg text-sm font-semibold text-[#555] transition-colors"
          >
            На главную
          </Link>
        </div>
      </div>
    );
  }

  // Empty cart
  if (items.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-[#e8e8e8] p-8 md:p-12 text-center">
        <div className="w-20 h-20 mx-auto rounded-full bg-[#eaf0e8] flex items-center justify-center mb-4">
          <svg className="w-10 h-10 text-[#9a9a9a]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-[#121212] mb-2">Корзина пуста</h2>
        <p className="text-[#555] mb-6 max-w-md mx-auto">
          Добавьте компоненты из каталога, чтобы оформить заявку на расчёт стоимости поставки.
         </p>
        <Link
          href="/catalog"
          className="inline-flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary-dark text-white rounded-lg font-semibold transition-colors"
        >
          Перейти в каталог
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    );
  }

  const updateField = (key: keyof FormState, value: string) => {
    setForm(prev => ({ ...prev, [key]: value }));
    if (errors[key]) {
      setErrors(prev => ({ ...prev, [key]: undefined }));
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left: cart items */}
      <div className="lg:col-span-2 space-y-4">
        <div className="bg-white rounded-2xl border border-[#e8e8e8] overflow-hidden">
          <div className="px-5 py-4 border-b border-[#e8e8e8] bg-[#f8faf7]">
            <h2 className="font-bold text-[#121212] flex items-center gap-2">
              <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              Позиции в заявке ({items.length})
            </h2>
          </div>
          <ul className="divide-y divide-[#e8e8e8]">
            {items.map(item => (
              <li key={item.sku} className="px-5 py-4 flex items-start gap-3 hover:bg-[#f8faf7] transition-colors">
                <div className="flex-1 min-w-0">
                  <Link
                    href={`/component/${encodeURIComponent(item.sku)}`}
                    className="font-mono text-sm font-bold text-[#121212] hover:text-primary transition-colors break-all"
                  >
                    {item.sku}
                  </Link>
                  <p className="text-xs text-[#555] mt-0.5 line-clamp-1">{item.name}</p>
                  <div className="flex items-center gap-1.5 mt-1.5">
                    <span className="px-1.5 py-0.5 bg-[#eaf0e8] rounded text-[10px] text-[#02a391] font-medium">
                      {item.brand}
                    </span>
                    <span className="text-[10px] text-[#9a9a9a]">{item.category}</span>
                  </div>
                </div>

                {/* Quantity */}
                <div className="flex items-center border border-[#e8e8e8] rounded-lg overflow-hidden bg-white shrink-0">
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
                    onChange={(e) => updateQuantity(item.sku, parseInt(e.target.value) || 1)}
                    className="w-16 h-8 text-center text-sm font-semibold text-[#121212] focus:outline-none border-x border-[#e8e8e8] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
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

                <button
                  type="button"
                  onClick={() => removeItem(item.sku)}
                  className="w-8 h-8 flex items-center justify-center rounded text-[#9a9a9a] hover:text-red-600 hover:bg-red-50 transition-colors shrink-0"
                  aria-label="Удалить"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </li>
            ))}
          </ul>
          <div className="px-5 py-3 border-t border-[#e8e8e8] bg-[#f8faf7] flex items-center justify-between">
            <span className="text-sm text-[#555]">Всего: <strong className="text-[#121212]">{totalItems.toLocaleString('ru-RU')}</strong> шт.</span>
            <button
              type="button"
              onClick={() => {
                if (confirm('Очистить корзину?')) clearCart();
              }}
              className="text-xs text-[#757575] hover:text-red-600 transition-colors"
            >
              Очистить всё
            </button>
          </div>
        </div>
      </div>

      {/* Right: contact form */}
      <div className="lg:col-span-1">
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl border border-[#e8e8e8] p-5 sticky top-32 space-y-4"
        >
          <div>
            <h2 className="font-bold text-[#121212] mb-1">Контактные данные</h2>
            <p className="text-xs text-[#757575]">Все поля обязательны для заполнения</p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#555] mb-1">Компания *</label>
            <input
              type="text"
              value={form.company}
              onChange={(e) => updateField('company', e.target.value)}
              placeholder='ООО "Моя компания"'
              className={`w-full px-3 py-2.5 bg-[#f8faf7] border rounded-lg text-sm text-[#121212] placeholder-[#9a9a9a] focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all ${
                errors.company ? 'border-red-300 bg-red-50/30' : 'border-[#e8e8e8]'
              }`}
            />
            {errors.company && <p className="text-xs text-red-600 mt-1">{errors.company}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#555] mb-1">Контактное лицо *</label>
            <input
              type="text"
              value={form.contactName}
              onChange={(e) => updateField('contactName', e.target.value)}
              placeholder="Иван Иванов"
              className={`w-full px-3 py-2.5 bg-[#f8faf7] border rounded-lg text-sm text-[#121212] placeholder-[#9a9a9a] focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all ${
                errors.contactName ? 'border-red-300 bg-red-50/30' : 'border-[#e8e8e8]'
              }`}
            />
            {errors.contactName && <p className="text-xs text-red-600 mt-1">{errors.contactName}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#555] mb-1">Email *</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => updateField('email', e.target.value)}
              placeholder="ivan@company.ru"
              className={`w-full px-3 py-2.5 bg-[#f8faf7] border rounded-lg text-sm text-[#121212] placeholder-[#9a9a9a] focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all ${
                errors.email ? 'border-red-300 bg-red-50/30' : 'border-[#e8e8e8]'
              }`}
            />
            {errors.email && <p className="text-xs text-red-600 mt-1">{errors.email}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#555] mb-1">Телефон *</label>
            <input
              type="tel"
              value={form.phone}
              onChange={(e) => updateField('phone', e.target.value)}
              placeholder="+7 (XXX) XXX-XX-XX"
              className={`w-full px-3 py-2.5 bg-[#f8faf7] border rounded-lg text-sm text-[#121212] placeholder-[#9a9a9a] focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all ${
                errors.phone ? 'border-red-300 bg-red-50/30' : 'border-[#e8e8e8]'
              }`}
            />
            {errors.phone && <p className="text-xs text-red-600 mt-1">{errors.phone}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#555] mb-1">Комментарий к заявке</label>
            <textarea
              value={form.comment}
              onChange={(e) => updateField('comment', e.target.value)}
              placeholder="Сроки поставки, особые требования, целевая цена и т.д."
              rows={3}
              className="w-full px-3 py-2.5 bg-[#f8faf7] border border-[#e8e8e8] rounded-lg text-sm text-[#121212] placeholder-[#9a9a9a] focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={submitting || items.length === 0}
            className="w-full px-5 py-3 bg-primary hover:bg-primary-dark disabled:opacity-60 disabled:cursor-not-allowed text-white rounded-lg text-sm font-semibold transition-all shadow-sm flex items-center justify-center gap-2"
          >
            {submitting ? (
              <>
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" opacity="0.25" />
                  <path d="M12 2a10 10 0 0110 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                </svg>
                Отправка...
              </>
            ) : (
              <>
                Отправить заявку
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </>
            )}
          </button>

          <p className="text-[11px] text-[#9a9a9a] text-center leading-relaxed">
            Нажимая «Отправить», вы соглашаетесь с обработкой персональных данных.
            Заявка не является публичной офертой.
          </p>
        </form>
      </div>
    </div>
  );
}

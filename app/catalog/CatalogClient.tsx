'use client';

// ════════════════════════════════════════════════════════════════════════════
// CatalogClient.tsx — редизайн 2026-11-02 (Dark Emerald B2B)
// Плотный табличный каталог для инженеров и закупщиков:
//  • table view по умолчанию для всех устройств
//  • 8 колонок с compact padding (py-2.5 px-3)
//  • Floating Action Bar для массового RFQ
//  • Collapsible row аналогов (для EOL/санкционных позиций)
//  • Мгновенный клиентский поиск с debounce 300ms
//  • Мультивыбор mounting type / stock status
// ════════════════════════════════════════════════════════════════════════════

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import ComponentImage from '@/components/ui/ComponentImage';
import BrandLogoImg from '@/components/ui/BrandLogoImg';
import { categoryPhoto } from '@/lib/category-photos';
import CategoryThumb from '@/components/ui/CategoryThumb';
import AddToCartButton from '@/components/cart/AddToCartButton';
import { SUBCATEGORIES } from '@/lib/catalog-taxonomy';
import { brandCatalogUrl } from '@/lib/brand-url';
import { useState, useTransition, useEffect, useMemo, useRef, useCallback } from 'react';

type Component = {
  sku: string;
  name: string;
  brand: string;
  category: string;
  description?: string;
  status: string;
  analogs?: string[];
  price?: number | null;
  stock?: number | null;
  attributes?: Record<string, string | number>;
};

type BrandMeta = { slug: string; active: boolean };

const ITEMS_PER_PAGE = 48;
const PREVIEW_SUBCATEGORIES = 5;
const SIDEBAR_VISIBLE_ITEMS = 10;
const DEBOUNCE_MS = 300;

const ATTR_SKIP = new Set(['бренд', 'артикул', 'категория', 'номенклатурный_номер']);

const SORT_OPTIONS: { value: string; label: string }[] = [
  { value: '', label: 'По умолчанию' },
  { value: 'name', label: 'Название: А–Я' },
  { value: 'stock', label: 'Сначала в наличии' },
  { value: 'price_asc', label: 'Цена: сначала дешевле' },
  { value: 'price_desc', label: 'Цена: сначала дороже' },
];

/* ── Бейдж наличия (плотный, под таблицу) ──────────────────────────────── */
function StockBadge({ stock, compact = false }: { stock?: number | null; compact?: boolean }) {
  if (stock != null && stock > 0) {
    return (
      <span className={`inline-flex items-center gap-1 ${compact ? 'text-[10px] px-1.5 py-0.5' : 'text-[11px] px-2 py-1'} font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-md whitespace-nowrap`}>
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0" />
        На складе{stock > 1 ? `: ${stock.toLocaleString('ru-RU')}` : ''}
      </span>
    );
  }
  if (stock === 0) {
    return (
      <span className={`inline-flex items-center gap-1 ${compact ? 'text-[10px] px-1.5 py-0.5' : 'text-[11px] px-2 py-1'} font-semibold text-amber-700 bg-amber-50 border border-amber-200 rounded-md whitespace-nowrap`}>
        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 flex-shrink-0" />
        Под заказ · 14–21 день
      </span>
    );
  }
  return (
    <span className={`inline-flex items-center gap-1 ${compact ? 'text-[10px] px-1.5 py-0.5' : 'text-[11px] px-2 py-1'} font-medium text-[#757575] bg-[#f4f6f3] border border-[#e4eae2] rounded-md whitespace-nowrap`}>
      <span className="w-1.5 h-1.5 rounded-full bg-[#b8c4b6] flex-shrink-0" />
      Уточняйте
    </span>
  );
}

/* ── Извлечение типа монтажа из attributes ─────────────────────────────── */
function getMountType(comp: Component): string {
  const a = comp.attributes || {};
  const v = String(a['тип_монтажа'] || '').trim();
  if (!v || v === '—' || v === '-' || v.toLowerCase() === 'не указан') return '';
  return v.toUpperCase();
}

/* ── Извлечение корпуса ────────────────────────────────────────────────── */
function getPackageLabel(comp: Component): string {
  const a = comp.attributes || {};
  const candidates = ['корпус', 'package', 'корпус_монтаж', 'тип_корпуса'];
  for (const k of candidates) {
    const v = String(a[k] || '').trim();
    if (v && v !== '—' && v !== '-' && v.toLowerCase() !== 'не указан') {
      return v;
    }
  }
  // Эвристика по SKU
  const s = comp.sku.toUpperCase();
  if (/\b0402|0603|0805|1206|2512|2010\b/.test(s)) return s.match(/\b(0402|0603|0805|1206|2512|2010)\b/)?.[1] || '';
  if (/SOT-?23/i.test(comp.sku)) return 'SOT-23';
  if (/SOT-?223/i.test(comp.sku)) return 'SOT-223';
  if (/SOIC-?\d/i.test(comp.sku)) return comp.sku.match(/SOIC-?\d+/i)?.[0] || '';
  if (/TSSOP/i.test(comp.sku)) return 'TSSOP';
  if (/LQFP/i.test(comp.sku)) return comp.sku.match(/LQFP\d+/i)?.[0] || 'LQFP';
  if (/QFN/i.test(comp.sku)) return 'QFN';
  if (/BGA/i.test(comp.sku)) return 'BGA';
  if (/DIP-?\d/i.test(comp.sku)) return comp.sku.match(/DIP-?\d+/i)?.[0] || 'DIP';
  if (/TO-?220/i.test(comp.sku)) return 'TO-220';
  if (/TO-?247/i.test(comp.sku)) return 'TO-247';
  if (/TO-?92/i.test(comp.sku)) return 'TO-92';
  return '';
}

/* ── Иконка-кнопка «Datasheet» ─────────────────────────────────────────── */
function DatasheetLink({ sku }: { sku: string }) {
  return (
    <Link
      prefetch={false}
      href={`/datasheet/${encodeURIComponent(sku)}`}
      title="Datasheet (PDF)"
      aria-label={`Datasheet для ${sku}`}
      className="w-8 h-8 flex items-center justify-center rounded-md border border-emerald-800/40 bg-white text-emerald-700 hover:bg-emerald-50 hover:border-emerald-600 transition-colors flex-shrink-0"
    >
      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6M14 3v5h5M6 3h9l5 5v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5a2 2 0 012-2z" />
      </svg>
    </Link>
  );
}

/* ── Окно страниц пагинации ────────────────────────────────────────────── */
function buildPageWindow(current: number, total: number): (number | 'dots')[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const pages: (number | 'dots')[] = [1];
  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);
  if (start > 2) pages.push('dots');
  for (let i = start; i <= end; i++) pages.push(i);
  if (end < total - 1) pages.push('dots');
  pages.push(total);
  return pages;
}

/* ── Иконки ────────────────────────────────────────────────────────────── */
const SearchIcon = ({ className }: { className?: string }) => (
  <svg className={className || 'w-4 h-4'} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 10.5a6.5 6.5 0 11-13 0 6.5 6.5 0 0113 0z" />
  </svg>
);

const ChevronDown = ({ className, open }: { className?: string; open: boolean }) => (
  <svg className={`${className || 'w-3.5 h-3.5'} transition-transform ${open ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
  </svg>
);

export default function CatalogClient({
  allComponents,
  categories,
  brands,
  totalCount,
  brandMeta = {},
}: {
  allComponents: Component[];
  categories: [string, number][];
  brands: [string, number][];
  totalCount: number;
  brandMeta?: Record<string, BrandMeta>;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  // ─── Локальное состояние ───────────────────────────────────────────────
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  // FIX 2026-11-02: table view — принудительный дефолт SSR и клиента.
  // Раньше был useEffect с чтением localStorage — он вызывал мигание
  // (SSR рендерит table → гидрация → useEffect меняет на grid из localStorage).
  // Теперь useState всегда 'table', без автоматического восстановления.
  // Пользователь может вручную переключиться на grid через тулбар (только на текущую сессию).
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const [catQuery, setCatQuery] = useState('');
  const [brandQuery, setBrandQuery] = useState('');
  const [showAllCats, setShowAllCats] = useState(false);
  const [showAllBrands, setShowAllBrands] = useState(false);
  const [searchInput, setSearchInput] = useState('');

  // ─── B2B: массовый выбор для RFQ ───────────────────────────────────────
  const [selectedSkus, setSelectedSkus] = useState<Set<string>>(new Set());
  // ─── B2B: раскрытые строки аналогов ────────────────────────────────────
  const [expandedSkus, setExpandedSkus] = useState<Set<string>>(new Set());

  // ─── Клиентские фильтры (mount type / stock) ───────────────────────────
  const [mountFilter, setMountFilter] = useState<Set<string>>(new Set());
  const [stockFilter, setStockFilter] = useState<'all' | 'in_stock' | 'under_order'>('all');

  // ─── Сохранение выбора view-режима (только запись, без чтения) ─────────
  // Записываем в localStorage, чтобы при будущем визите пользователь сразу
  // видел свой режим. Но НЕ читаем при инициализации — это исключает
  // гидратацию-мismatch (SSR всегда table, клиент тоже всегда table).
  useEffect(() => {
    window.localStorage.setItem('catalog-view-v3', viewMode);
  }, [viewMode]);

  // Read state from URL search params
  const currentCategory = searchParams.get('category') || '';
  const currentBrand = searchParams.get('brand') || '';
  const currentSearch = searchParams.get('search') || '';
  const currentSort = searchParams.get('sort') || '';
  const currentPage = parseInt(searchParams.get('page') || '1', 10);

  useEffect(() => {
    setSearchInput(currentSearch);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentSearch]);

  // ─── Дебаунс-поиск (300ms): мгновенный ввод, отложенный URL-апдейт ─────
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const debouncedSearch = useCallback((value: string) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      updateParams('search', value);
    }, DEBOUNCE_MS);
  }, [searchParams]);

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  // ─── Клиентская фильтрация (search + mount + stock) ────────────────────
  const filteredComponents = useMemo(() => {
    return allComponents.filter(comp => {
      // URL-фильтры (категория/бренд уже отработали на сервере, но на клиенте
      // тоже проверяем для безопасности)
      if (currentCategory && comp.category !== currentCategory) return false;
      if (currentBrand && comp.brand !== currentBrand) return false;

      // Клиентский мгновенный поиск (пока URL ещё не обновился)
      if (searchInput && searchInput !== currentSearch) {
        const term = searchInput.toLowerCase();
        if (!comp.sku?.toLowerCase().includes(term) &&
            !comp.name?.toLowerCase().includes(term) &&
            !comp.brand?.toLowerCase().includes(term)) return false;
      } else if (currentSearch) {
        const term = currentSearch.toLowerCase();
        if (!comp.sku?.toLowerCase().includes(term) &&
            !comp.name?.toLowerCase().includes(term) &&
            !comp.brand?.toLowerCase().includes(term)) return false;
      }

      // Монтаж: мультивыбор
      if (mountFilter.size > 0) {
        const mt = getMountType(comp);
        if (!mt || !mountFilter.has(mt)) return false;
      }

      // Наличие: single-select
      if (stockFilter !== 'all') {
        if (stockFilter === 'in_stock' && !(comp.stock != null && comp.stock > 0)) return false;
        if (stockFilter === 'under_order' && !(comp.stock === 0 || comp.stock == null)) return false;
      }

      return true;
    });
  }, [allComponents, currentCategory, currentBrand, currentSearch, searchInput, mountFilter, stockFilter]);

  const totalPages = Math.max(1, Math.ceil(totalCount / ITEMS_PER_PAGE));
  const safePage = Math.min(Math.max(1, currentPage), totalPages);
  const paginatedComponents = filteredComponents;

  const shownFrom = totalCount === 0 ? 0 : (safePage - 1) * ITEMS_PER_PAGE + 1;
  const shownTo = Math.min(safePage * ITEMS_PER_PAGE, totalCount);

  const hasFilters = !!(currentCategory || currentBrand || currentSearch || mountFilter.size > 0 || stockFilter !== 'all');
  const activeFilterCount =
    (currentCategory ? 1 : 0) +
    (currentBrand ? 1 : 0) +
    (currentSearch ? 1 : 0) +
    (mountFilter.size > 0 ? 1 : 0) +
    (stockFilter !== 'all' ? 1 : 0);

  // ─── Escape для drawer ─────────────────────────────────────────────────
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowMobileFilters(false);
        setExpandedSkus(new Set());
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  useEffect(() => {
    document.body.style.overflow = showMobileFilters ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [showMobileFilters]);

  // ─── B2B: управление выбором ───────────────────────────────────────────
  const toggleSelect = useCallback((sku: string) => {
    setSelectedSkus(prev => {
      const next = new Set(prev);
      if (next.has(sku)) next.delete(sku); else next.add(sku);
      return next;
    });
  }, []);

  const toggleSelectAll = useCallback(() => {
    setSelectedSkus(prev => {
      if (prev.size === paginatedComponents.length) return new Set();
      return new Set(paginatedComponents.map(c => c.sku));
    });
  }, [paginatedComponents]);

  const clearSelection = useCallback(() => setSelectedSkus(new Set()), []);

  const toggleExpand = useCallback((sku: string) => {
    setExpandedSkus(prev => {
      const next = new Set(prev);
      if (next.has(sku)) next.delete(sku); else next.add(sku);
      return next;
    });
  }, []);

  // ─── Навигация по URL ──────────────────────────────────────────────────
  const updateParams = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    if (key !== 'page') params.delete('page');
    startTransition(() => {
      router.push(`/catalog?${params.toString()}`);
    });
  };

  const clearFilters = () => {
    setSearchInput('');
    setCatQuery('');
    setBrandQuery('');
    setMountFilter(new Set());
    setStockFilter('all');
    startTransition(() => {
      router.push('/catalog');
    });
  };

  const brandLink = (name: string) => {
    const meta = brandMeta[name];
    return brandCatalogUrl(name, meta?.slug || '', !!meta?.active);
  };

  const toggleHref = (key: 'category' | 'brand', value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    const cur = key === 'category' ? currentCategory : currentBrand;
    if (cur === value) params.delete(key);
    else params.set(key, value);
    params.delete('page');
    const qs = params.toString();
    return qs ? `/catalog?${qs}` : '/catalog';
  };

  const topBrands = brands.slice(0, 16);

  const pageHref = (p: number) => {
    const params = new URLSearchParams(searchParams.toString());
    if (p <= 1) params.delete('page');
    else params.set('page', String(p));
    const qs = params.toString();
    return qs ? `/catalog?${qs}` : '/catalog';
  };

  // ─── Sidebar lists ─────────────────────────────────────────────────────
  const filteredCats = useMemo(
    () => categories.filter(([c]) => c.toLowerCase().includes(catQuery.trim().toLowerCase())),
    [categories, catQuery]
  );
  const visibleCats = showAllCats ? filteredCats : filteredCats.slice(0, SIDEBAR_VISIBLE_ITEMS);
  const hiddenCats = filteredCats.length - SIDEBAR_VISIBLE_ITEMS;

  const filteredBrands = useMemo(
    () => brands.filter(([b]) => b.toLowerCase().includes(brandQuery.trim().toLowerCase())),
    [brands, brandQuery]
  );
  const visibleBrands = showAllBrands ? filteredBrands : filteredBrands.slice(0, SIDEBAR_VISIBLE_ITEMS);
  const hiddenBrands = filteredBrands.length - SIDEBAR_VISIBLE_ITEMS;

  // ─── Доступные типы монтажа на текущей странице ────────────────────────
  const availableMountTypes = useMemo(() => {
    const set = new Set<string>();
    for (const c of allComponents) {
      const mt = getMountType(c);
      if (mt) set.add(mt);
    }
    return Array.from(set).sort();
  }, [allComponents]);

  /* ═══════ SIDEBAR ═══════ */
  const sidebarContent = (
    <div className="space-y-4">
      {/* ── Поиск по каталогу убран — сквозной поиск теперь в шапке сайта ── */}

      {/* ── Категории ──────────────────────────────────────────────────── */}
      <div className="bg-white border border-emerald-800/40 rounded-xl p-4 shadow-sm">
        <div className="flex items-center justify-between mb-2.5">
          <h3 className="text-xs font-bold text-[#333] uppercase tracking-wider">Категории</h3>
          {currentCategory && (
            <button onClick={() => updateParams('category', '')} className="text-[11px] text-emerald-700 hover:underline">
              Сбросить
            </button>
          )}
        </div>
        <div className="relative mb-2">
          <input
            type="text"
            value={catQuery}
            onChange={e => { setCatQuery(e.target.value); setShowAllCats(false); }}
            placeholder="Поиск категории…"
            className="w-full pl-8 pr-3 py-2 text-sm bg-[#f7f9f6] border border-[#e4eae2] rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600/40 transition-colors"
          />
          <SearchIcon className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9a9a9a]" />
        </div>
        <ul className="space-y-0.5 max-h-80 overflow-y-auto scrollbar-thin -mx-1 px-1">
          {/* FIX 2026-11-02: skeleton для пустого списка категорий с сервера */}
          {categories.length === 0 && (
            <>
              {[...Array(8)].map((_, i) => (
                <li key={`cat-skel-${i}`} className="px-3 py-2.5 rounded-lg bg-[#f7f9f6] border border-[#eef2ec] animate-pulse">
                  <div className="flex items-center justify-between gap-2">
                    <div className="h-3.5 bg-[#e4eae2] rounded w-2/3" />
                    <div className="h-3 bg-[#e4eae2] rounded-full w-8" />
                  </div>
                </li>
              ))}
              <li className="text-[11px] text-[#9a9a9a] px-2 py-2 text-center">Загрузка категорий…</li>
            </>
          )}
          {categories.length > 0 && visibleCats.map(([cat, cnt]) => (
            <li key={cat}>
              <Link
                prefetch={false}
                href={toggleHref('category', cat)}
                aria-current={currentCategory === cat ? 'true' : undefined}
                className={`w-full text-left min-h-10 px-3 py-2 rounded-lg text-sm font-semibold transition-all shadow-sm touch-manipulation flex justify-between items-center gap-2 ${
                  currentCategory === cat
                    ? 'bg-emerald-600 text-white border border-emerald-600'
                    : 'bg-white border border-emerald-800/40 text-[#555] hover:text-emerald-700 hover:border-emerald-600/50 hover:bg-[#f4faf6] active:bg-[#e6f2ea]'
                }`}
              >
                <span className="truncate">{cat}</span>
                <span className={`text-[10px] rounded-full px-1.5 py-0.5 flex-shrink-0 ${
                  currentCategory === cat ? 'bg-white/20 text-white' : 'text-[#898989] bg-[#f0f4ee]'
                }`}>
                  {cnt.toLocaleString('ru-RU')}
                </span>
              </Link>
            </li>
          ))}
          {categories.length > 0 && filteredCats.length === 0 && (
            <li className="text-xs text-[#9a9a9a] px-2 py-3 text-center italic">По запросу ничего не найдено</li>
          )}
        </ul>
        {categories.length > 0 && hiddenCats > 0 && (
          <button
            onClick={() => setShowAllCats(v => !v)}
            className="w-full mt-2 text-xs font-medium text-emerald-700 hover:underline"
          >
            {showAllCats ? 'Свернуть' : `Показать все (${filteredCats.length})`}
          </button>
        )}
      </div>

      {/* ── Бренды ─────────────────────────────────────────────────────── */}
      <div className="bg-white border border-emerald-800/40 rounded-xl p-4 shadow-sm">
        <div className="flex items-center justify-between mb-2.5">
          <h3 className="text-xs font-bold text-[#333] uppercase tracking-wider">Бренды</h3>
          {currentBrand && (
            <button onClick={() => updateParams('brand', '')} className="text-[11px] text-emerald-700 hover:underline">
              Сбросить
            </button>
          )}
        </div>
        <div className="relative mb-2">
          <input
            type="text"
            value={brandQuery}
            onChange={e => { setBrandQuery(e.target.value); setShowAllBrands(false); }}
            placeholder="Поиск бренда…"
            className="w-full pl-8 pr-3 py-2 text-sm bg-[#f7f9f6] border border-[#e4eae2] rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600/40 transition-colors"
          />
          <SearchIcon className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9a9a9a]" />
        </div>
        <ul className="space-y-0.5 max-h-80 overflow-y-auto scrollbar-thin -mx-1 px-1">
          {/* FIX 2026-11-02: skeleton для пустого списка брендов с сервера */}
          {brands.length === 0 && (
            <>
              {[...Array(8)].map((_, i) => (
                <li key={`brand-skel-${i}`} className="px-3 py-2.5 rounded-lg bg-[#f7f9f6] border border-[#eef2ec] animate-pulse">
                  <div className="flex items-center justify-between gap-2">
                    <div className="h-3.5 bg-[#e4eae2] rounded w-1/2" />
                    <div className="h-3 bg-[#e4eae2] rounded-full w-8" />
                  </div>
                </li>
              ))}
              <li className="text-[11px] text-[#9a9a9a] px-2 py-2 text-center">Загрузка брендов…</li>
            </>
          )}
          {brands.length > 0 && visibleBrands.map(([br, cnt]) => (
            <li key={br}>
              <Link
                prefetch={false}
                href={toggleHref('brand', br)}
                aria-current={currentBrand === br ? 'true' : undefined}
                className={`w-full text-left min-h-10 px-3 py-2 rounded-lg text-sm font-semibold transition-all shadow-sm touch-manipulation flex justify-between items-center gap-2 ${
                  currentBrand === br
                    ? 'bg-emerald-600 text-white border border-emerald-600'
                    : 'bg-white border border-emerald-800/40 text-[#555] hover:text-emerald-700 hover:border-emerald-600/50 hover:bg-[#f4faf6] active:bg-[#e6f2ea]'
                }`}
              >
                <span className="truncate">{br}</span>
                <span className={`text-[10px] rounded-full px-1.5 py-0.5 flex-shrink-0 ${
                  currentBrand === br ? 'bg-white/20 text-white' : 'text-[#898989] bg-[#f0f4ee]'
                }`}>
                  {cnt.toLocaleString('ru-RU')}
                </span>
              </Link>
            </li>
          ))}
          {brands.length > 0 && filteredBrands.length === 0 && (
            <li className="text-xs text-[#9a9a9a] px-2 py-3 text-center italic">По запросу ничего не найдено</li>
          )}
        </ul>
        {brands.length > 0 && hiddenBrands > 0 && (
          <button
            onClick={() => setShowAllBrands(v => !v)}
            className="w-full mt-2 text-xs font-medium text-emerald-700 hover:underline"
          >
            {showAllBrands ? 'Свернуть' : `Показать все (${filteredBrands.length})`}
          </button>
        )}
      </div>

      {/* ── B2B: тип монтажа (мультивыбор) ─────────────────────────────── */}
      {availableMountTypes.length > 0 && (
        <div className="bg-white border border-emerald-800/40 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-2.5">
            <h3 className="text-xs font-bold text-[#333] uppercase tracking-wider">Тип монтажа</h3>
            {mountFilter.size > 0 && (
              <button onClick={() => setMountFilter(new Set())} className="text-[11px] text-emerald-700 hover:underline">
                Сбросить
              </button>
            )}
          </div>
          <div className="flex flex-wrap gap-1.5">
            {availableMountTypes.map(mt => {
              const active = mountFilter.has(mt);
              return (
                <button
                  key={mt}
                  onClick={() => {
                    const next = new Set(mountFilter);
                    if (active) next.delete(mt); else next.add(mt);
                    setMountFilter(next);
                  }}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
                    active
                      ? 'bg-emerald-600 text-white border-emerald-600'
                      : 'bg-white text-[#555] border-emerald-800/40 hover:border-emerald-600/50 hover:text-emerald-700'
                  }`}
                >
                  {mt}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ── B2B: наличие (single-select) ───────────────────────────────── */}
      <div className="bg-white border border-emerald-800/40 rounded-xl p-4 shadow-sm">
        <h3 className="text-xs font-bold text-[#333] uppercase tracking-wider mb-2.5">Наличие</h3>
        <div className="flex flex-col gap-1.5">
          {[
            { v: 'all', label: 'Все позиции' },
            { v: 'in_stock', label: 'На складе' },
            { v: 'under_order', label: 'Под заказ' },
          ].map(opt => (
            <button
              key={opt.v}
              onClick={() => setStockFilter(opt.v as 'all' | 'in_stock' | 'under_order')}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm font-semibold transition-all border ${
                stockFilter === opt.v
                  ? 'bg-emerald-600 text-white border-emerald-600'
                  : 'bg-white text-[#555] border-emerald-800/40 hover:border-emerald-600/50 hover:text-emerald-700'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  /* ═══════ Карточка компонента (grid-режим, компактная) ═══════ */
  const ComponentCard = ({ comp }: { comp: Component }) => {
    const attrEntries = comp.attributes
      ? Object.entries(comp.attributes)
          .filter(([k]) => !ATTR_SKIP.has(k))
          .slice(0, 3)
      : [];
    return (
      <div className="group bg-white border border-emerald-800/40 rounded-xl overflow-hidden hover:shadow-lg hover:-translate-y-0.5 hover:border-emerald-600/40 transition-all duration-200 flex flex-col">
        <Link
          prefetch={false}
          href={`/component/${encodeURIComponent(comp.sku)}`}
          className="relative flex items-center justify-center h-28 bg-white border-b border-[#eef2ec] overflow-hidden"
        >
          <ComponentImage
            sku={comp.sku}
            name={comp.name}
            category={comp.category}
            size={88}
            className="w-22 h-22 transition-transform duration-300 group-hover:scale-105"
          />
          {comp.status === 'EOL' && (
            <span className="absolute top-2 right-2 px-1.5 py-0.5 rounded text-[9px] font-bold bg-red-100 text-red-700 uppercase tracking-wide">
              EOL
            </span>
          )}
        </Link>
        <div className="flex-1 p-3 flex flex-col">
          <Link prefetch={false} href={`/component/${encodeURIComponent(comp.sku)}`} className="group/sku">
            <span className="font-mono font-bold text-emerald-700 group-hover/sku:text-emerald-600 text-sm leading-tight break-all">
              {comp.sku}
            </span>
          </Link>
          <p className="text-[#666] text-xs leading-relaxed line-clamp-2 mt-1 min-h-[2rem]">
            {comp.name}
          </p>
          <div className="flex items-center gap-1.5 flex-wrap mt-2">
            <span className="px-2 py-0.5 bg-[#eaf5f2] rounded-full text-[10px] text-emerald-800 font-medium">
              {comp.brand}
            </span>
            {attrEntries.map(([k, v]) => (
              <span
                key={k}
                className="px-2 py-0.5 bg-[#f4f6f3] border border-[#e9eee7] rounded-full text-[10px] text-[#555] truncate max-w-[130px]"
                title={`${k}: ${String(v)}`}
              >
                {k.replace(/_/g, ' ')}: {String(v).slice(0, 22)}
              </span>
            ))}
          </div>
          <div className="mt-auto pt-3">
            <StockBadge stock={comp.stock} />
          </div>
        </div>
        <div className="px-3 pb-3 flex items-center gap-2">
          <div className="flex-1 min-w-0">
            {comp.price != null ? (
              <span className="font-bold text-[#121212] text-base whitespace-nowrap">
                {comp.price.toLocaleString('ru-RU')} ₽
              </span>
            ) : (
              <span className="text-[10px] text-[#9a9a9a] uppercase tracking-wide">По запросу</span>
            )}
          </div>
          <DatasheetLink sku={comp.sku} />
          <AddToCartButton
            sku={comp.sku}
            name={comp.name}
            brand={comp.brand}
            category={comp.category}
            size="sm"
            variant="primary"
          />
        </div>
      </div>
    );
  };

  /* ═══════ Строка таблицы (compact, 8 колонок) ═══════ */
  const ComponentTableRow = ({ comp, index }: { comp: Component; index: number }) => {
    const isSelected = selectedSkus.has(comp.sku);
    const isExpanded = expandedSkus.has(comp.sku);
    const isEOL = comp.status === 'EOL';
    const pkg = getPackageLabel(comp);
    const mount = getMountType(comp);
    const selectedCount = paginatedComponents.filter(c => selectedSkus.has(c.sku)).length;

    return (
      <>
        <tr
          className={`border-b border-[#eef2ec] transition-colors ${isSelected ? 'bg-emerald-50' : index % 2 === 1 ? 'bg-[#fbfcfb]' : 'bg-white'} hover:bg-[#f4faf6]`}
        >
          {/* 1. Чекбокс массового выбора */}
          <td className="py-2.5 px-3 align-middle w-10">
            <label className="flex items-center justify-center cursor-pointer">
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => toggleSelect(comp.sku)}
                aria-label={`Выбрать ${comp.sku}`}
                className="w-4 h-4 rounded border-emerald-800/40 text-emerald-600 focus:ring-emerald-600/30 cursor-pointer"
              />
            </label>
          </td>

          {/* 2. Чертёж / Корпус — иконка/фото */}
          <td className="py-2.5 px-3 align-middle w-14">
            <Link prefetch={false} href={`/component/${encodeURIComponent(comp.sku)}`} className="block">
              <div className="w-10 h-10 rounded-md overflow-hidden border border-emerald-800/40 bg-white hover:border-emerald-600/60 transition-colors">
                <ComponentImage
                  sku={comp.sku}
                  name={comp.name}
                  category={comp.category}
                  size={40}
                  attributes={comp.attributes as Record<string, string>}
                  className="w-full h-full"
                />
              </div>
            </Link>
          </td>

          {/* 3. Артикул (MPN) + описание */}
          <td className="py-2.5 px-3 align-middle min-w-[200px]">
            <Link prefetch={false} href={`/component/${encodeURIComponent(comp.sku)}`} className="block group">
              <div className="flex items-center gap-1.5 mb-0.5">
                <span className="font-mono font-bold text-emerald-700 group-hover:text-emerald-600 text-sm leading-tight break-all">
                  {comp.sku}
                </span>
                {isEOL && (
                  <span className="flex-shrink-0 px-1.5 py-0.5 rounded text-[9px] font-semibold bg-red-100 text-red-700 uppercase tracking-wide">
                    EOL
                  </span>
                )}
                {/* Кнопка раскрытия аналогов — только для EOL */}
                {isEOL && (
                  <button
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleExpand(comp.sku); }}
                    aria-label="Показать аналоги"
                    title="Рекомендуемые аналоги"
                    className="flex-shrink-0 inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[9px] font-semibold bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100 transition-colors"
                  >
                    Аналоги
                    <ChevronDown className="w-3 h-3" open={isExpanded} />
                  </button>
                )}
              </div>
              <p className="text-[#666] text-xs leading-relaxed line-clamp-1">
                {comp.name}
              </p>
            </Link>
          </td>

          {/* 4. Производитель — чип фильтрации */}
          <td className="py-2.5 px-3 align-middle hidden md:table-cell min-w-[120px]">
            <Link
              prefetch={false}
              href={toggleHref('brand', comp.brand)}
              className="inline-flex items-center px-2 py-0.5 bg-[#eaf5f2] hover:bg-emerald-100 rounded-full text-[11px] text-emerald-800 font-medium transition-colors"
            >
              {comp.brand}
            </Link>
          </td>

          {/* 5. Корпус / Монтаж */}
          <td className="py-2.5 px-3 align-middle hidden lg:table-cell min-w-[120px]">
            <div className="flex flex-col gap-0.5">
              {pkg && (
                <span className="font-mono text-[11px] text-[#333] font-semibold">{pkg}</span>
              )}
              {mount && (
                <span className="text-[10px] text-[#757575] uppercase tracking-wide">{mount}</span>
              )}
              {!pkg && !mount && <span className="text-[11px] text-[#9a9a9a]">—</span>}
            </div>
          </td>

          {/* 6. Наличие / Срок */}
          <td className="py-2.5 px-3 align-middle min-w-[140px]">
            <StockBadge stock={comp.stock} compact />
          </td>

          {/* 7. Цена (без НДС / с НДС) */}
          <td className="py-2.5 px-3 align-middle text-right min-w-[110px]">
            {comp.price != null ? (
              <div className="flex flex-col items-end">
                <span className="font-bold text-[#121212] text-sm whitespace-nowrap">
                  {comp.price.toLocaleString('ru-RU')} ₽
                </span>
                <span className="text-[10px] text-[#9a9a9a]">
                  {Math.round(comp.price * 1.2).toLocaleString('ru-RU')} ₽ с НДС
                </span>
              </div>
            ) : (
              <span className="text-[10px] text-[#9a9a9a] uppercase tracking-wide">По запросу</span>
            )}
          </td>

          {/* 8. Действия */}
          <td className="py-2.5 px-3 align-middle text-right min-w-[120px]">
            <div className="flex items-center gap-1.5 justify-end">
              <DatasheetLink sku={comp.sku} />
              <AddToCartButton
                sku={comp.sku}
                name={comp.name}
                brand={comp.brand}
                category={comp.category}
                size="sm"
                variant="outline"
                label="В RFQ"
              />
            </div>
          </td>
        </tr>

        {/* ─── Collapsible row: аналоги (только для EOL) ─────────────── */}
        {isEOL && isExpanded && (
          <tr className="bg-amber-50/50 border-b border-amber-100">
            <td colSpan={8} className="py-4 px-6">
              <div className="flex flex-col md:flex-row md:items-start gap-4">
                <div className="flex-1">
                  <h4 className="text-xs font-bold text-amber-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                    Рекомендуемые аналоги / импортозамещение
                  </h4>
                  <p className="text-xs text-[#666] mb-3 leading-relaxed">
                    Компонент <span className="font-mono font-semibold text-[#333]">{comp.sku}</span> ({comp.brand}) снят с производства.
                    Наши инженеры подберут доступный аналог с учётом электрических параметров, корпуса и логистики.
                    Возможна поставка из складских остатков или аналогов из РФ/Китая.
                  </p>
                  <ul className="space-y-1.5 text-xs text-[#555]">
                    <li className="flex items-start gap-2">
                      <svg className="w-3.5 h-3.5 mt-0.5 text-emerald-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Подбор по электрическим параметрам и типу корпуса</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <svg className="w-3.5 h-3.5 mt-0.5 text-emerald-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Проверка оригинальности в лаборатории СВП</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <svg className="w-3.5 h-3.5 mt-0.5 text-emerald-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Срок поставки: от 6 дней (склад) / 14–21 день (под заказ)</span>
                    </li>
                  </ul>
                </div>
                <div className="flex flex-col gap-2 md:w-56 flex-shrink-0">
                  <Link
                    prefetch={false}
                    href={`/rfq?sku=${encodeURIComponent(comp.sku)}&type=analog`}
                    className="inline-flex items-center justify-center gap-2 px-4 h-10 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-sm font-bold transition-colors shadow-sm"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                    Запросить подбор аналога
                  </Link>
                  <Link
                    prefetch={false}
                    href={`/analogs?sku=${encodeURIComponent(comp.sku)}`}
                    className="inline-flex items-center justify-center gap-2 px-4 h-10 bg-white border border-emerald-800/40 text-emerald-700 hover:bg-emerald-50 rounded-lg text-sm font-semibold transition-colors"
                  >
                    Все аналоги {comp.brand}
                  </Link>
                </div>
              </div>
            </td>
          </tr>
        )}
      </>
    );
  };

  /* ═══════ Floating Action Bar для массового RFQ ═══════ */
  const floatingBar = selectedSkus.size > 0 ? (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="bg-gradient-to-r from-[#082c23] via-[#052018] to-[#02120e] border border-emerald-700/50 rounded-2xl shadow-2xl px-5 py-3.5 flex items-center gap-4 backdrop-blur-md">
        <div className="flex items-center gap-2 text-white">
          <span className="w-7 h-7 flex items-center justify-center rounded-full bg-emerald-500 text-white text-xs font-bold">
            {selectedSkus.size}
          </span>
          <span className="text-sm font-semibold whitespace-nowrap">
            {selectedSkus.size === 1 ? 'позиция выбрана' : 'позиций выбрано'}
          </span>
        </div>
        <div className="h-6 w-px bg-white/20" />
        <Link
          prefetch={false}
          href={`/rfq?bulk=${encodeURIComponent(Array.from(selectedSkus).join(','))}`}
          className="inline-flex items-center gap-2 px-4 h-9 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-sm font-bold transition-colors shadow-sm whitespace-nowrap"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
          Сформировать единый RFQ
        </Link>
        <button
          onClick={clearSelection}
          aria-label="Сбросить выбор"
          className="inline-flex items-center justify-center w-9 h-9 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  ) : null;

  /* ═══════ Тулбар ═══════ */
  const toolbar = (
    <div className="flex flex-wrap items-center justify-between gap-3 mb-5 bg-white border border-emerald-800/40 rounded-xl px-4 py-3 shadow-sm">
      <p className="text-sm text-[#666]">
        {isPending ? (
          <span className="inline-flex items-center gap-2">
            <span className="w-3.5 h-3.5 border-2 border-[#dfe8dd] border-t-emerald-600 rounded-full animate-spin" />
            Обновление…
          </span>
        ) : (
          <>
            Найдено: <b className="text-[#121212]">{totalCount.toLocaleString('ru-RU')}</b>
            {totalCount > 0 && (
              <span className="hidden sm:inline text-[#9a9a9a]"> · показаны {shownFrom}–{shownTo}</span>
            )}
            {selectedSkus.size > 0 && (
              <span className="ml-2 inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-50 border border-emerald-200 rounded-full text-[11px] text-emerald-700 font-semibold">
                выбрано: {selectedSkus.size}
              </span>
            )}
          </>
        )}
      </p>
      <div className="flex items-center gap-2">
        {/* Select All (только в table mode) */}
        {viewMode === 'table' && paginatedComponents.length > 0 && (
          <button
            onClick={toggleSelectAll}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 h-9 bg-white border border-emerald-800/40 rounded-lg text-xs font-semibold text-[#555] hover:border-emerald-600/50 hover:text-emerald-700 transition-colors"
          >
            <input
              type="checkbox"
              checked={selectedSkus.size === paginatedComponents.length && paginatedComponents.length > 0}
              readOnly
              className="w-3.5 h-3.5 rounded border-emerald-800/40 text-emerald-600"
            />
            {selectedSkus.size === paginatedComponents.length && paginatedComponents.length > 0 ? 'Снять все' : 'Все'}
          </button>
        )}
        {/* Сортировка */}
        <div className="relative">
          <select
            value={currentSort}
            onChange={e => updateParams('sort', e.target.value)}
            aria-label="Сортировка"
            className="appearance-none bg-white border border-emerald-800/40 rounded-lg pl-3 pr-9 py-2 text-sm text-[#333] hover:border-emerald-600/50 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 cursor-pointer transition-colors"
          >
            {SORT_OPTIONS.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          <svg className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9a9a9a] pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </div>
  );

  /* ═══════ Список или заглушка ═══════ */
  const gridList = (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
      {paginatedComponents.map(comp => (
        <ComponentCard key={comp.sku} comp={comp} />
      ))}
    </div>
  );

  const tableView = (
    <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
      <table className="w-full min-w-[900px] border-collapse bg-white rounded-xl overflow-hidden border border-emerald-800/40 shadow-sm">
        <thead>
          <tr className="bg-gradient-to-r from-[#082c23] to-[#052018] border-b border-emerald-800">
            {/* FIX 2026-11-02: чекбокс Select All в шапке (вместо символа ✓) */}
            <th className="py-2.5 px-3 text-left text-[10px] font-bold text-emerald-200 uppercase tracking-wider w-10">
              <label className="flex items-center justify-center cursor-pointer" title={selectedSkus.size === paginatedComponents.length && paginatedComponents.length > 0 ? 'Снять все' : 'Выбрать все'}>
                <input
                  type="checkbox"
                  checked={selectedSkus.size === paginatedComponents.length && paginatedComponents.length > 0}
                  onChange={toggleSelectAll}
                  aria-label="Выбрать все компоненты на странице"
                  className="w-4 h-4 rounded border-emerald-300/40 text-emerald-500 focus:ring-emerald-400/30 cursor-pointer bg-white/10"
                />
              </label>
            </th>
            <th className="py-2.5 px-3 text-left text-[10px] font-bold text-emerald-200 uppercase tracking-wider w-14">Корпус</th>
            <th className="py-2.5 px-3 text-left text-[10px] font-bold text-emerald-200 uppercase tracking-wider">Артикул (MPN) / Описание</th>
            <th className="py-2.5 px-3 text-left text-[10px] font-bold text-emerald-200 uppercase tracking-wider hidden md:table-cell">Производитель</th>
            <th className="py-2.5 px-3 text-left text-[10px] font-bold text-emerald-200 uppercase tracking-wider hidden lg:table-cell">Корпус / Монтаж</th>
            <th className="py-2.5 px-3 text-left text-[10px] font-bold text-emerald-200 uppercase tracking-wider">Наличие / Срок</th>
            <th className="py-2.5 px-3 text-right text-[10px] font-bold text-emerald-200 uppercase tracking-wider">Цена</th>
            <th className="py-2.5 px-3 text-right text-[10px] font-bold text-emerald-200 uppercase tracking-wider">Действия</th>
          </tr>
        </thead>
        <tbody>
          {paginatedComponents.map((comp, i) => (
            <ComponentTableRow key={comp.sku} comp={comp} index={i} />
          ))}
        </tbody>
      </table>
    </div>
  );

  const listOrEmpty = paginatedComponents.length > 0 ? (
    viewMode === 'table' ? tableView : gridList
  ) : (
    <div className="text-center py-16 bg-white border border-emerald-800/40 rounded-2xl">
      <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-[#f0f4ee] flex items-center justify-center text-[#9a9a9a]">
        <SearchIcon className="w-6 h-6" />
      </div>
      <h3 className="text-lg font-bold text-[#121212] mb-1.5">Компоненты не найдены</h3>
      <p className="text-sm text-[#757575] mb-5">Попробуйте изменить запрос или сбросить фильтры</p>
      <button
        onClick={clearFilters}
        className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 rounded-lg text-sm font-semibold text-white transition-colors"
      >
        Сбросить фильтры
      </button>
    </div>
  );

  /* ═══════ Пагинация ═══════ */
  const pagination = totalPages > 1 ? (
    <nav aria-label="Пагинация каталога" className="mt-8">
      <div className="flex items-center justify-center gap-1.5 flex-wrap">
        {safePage > 1 ? (
          <Link
            prefetch={false}
            href={pageHref(safePage - 1)}
            className="inline-flex items-center gap-1.5 px-3.5 h-10 bg-white border border-emerald-800/40 rounded-lg text-sm text-[#555] hover:text-emerald-700 hover:border-emerald-600/50 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Назад
          </Link>
        ) : (
          <span className="inline-flex items-center gap-1.5 px-3.5 h-10 bg-[#f4f6f3] border border-[#eef2ec] rounded-lg text-sm text-[#b8c4b6] cursor-not-allowed select-none">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Назад
          </span>
        )}

        {buildPageWindow(safePage, totalPages).map((p, i) =>
          p === 'dots' ? (
            <span key={`dots-${i}`} className="w-8 text-center text-[#9a9a9a] select-none">…</span>
          ) : (
            <Link
              key={p}
              prefetch={false}
              href={pageHref(p)}
              aria-current={p === safePage ? 'page' : undefined}
              className={`w-10 h-10 flex items-center justify-center rounded-lg text-sm font-medium transition-colors ${
                p === safePage
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-white border border-emerald-800/40 text-[#555] hover:text-emerald-700 hover:border-emerald-600/50'
              }`}
            >
              {p}
            </Link>
          )
        )}

        {safePage < totalPages ? (
          <Link
            prefetch={false}
            href={pageHref(safePage + 1)}
            className="inline-flex items-center gap-1.5 px-3.5 h-10 bg-white border border-emerald-800/40 rounded-lg text-sm text-[#555] hover:text-emerald-700 hover:border-emerald-600/50 transition-colors"
          >
            Вперёд
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        ) : (
          <span className="inline-flex items-center gap-1.5 px-3.5 h-10 bg-[#f4f6f3] border border-[#eef2ec] rounded-lg text-sm text-[#b8c4b6] cursor-not-allowed select-none">
            Вперёд
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </span>
        )}
      </div>
    </nav>
  ) : null;

  /* ════════════════════════ RENDER ═══════════════════════ */
  return (
    <div className={selectedSkus.size > 0 ? 'pb-24' : ''}>
      {/* Breadcrumb рендерится на уровне page.tsx (единый дизайн-код каталога) */}

      <div className="flex items-start gap-6">
        {/* Сайдбар */}
        <aside className="hidden lg:block w-64 flex-shrink-0 lg:sticky lg:top-24 self-start max-h-[calc(100vh-7rem)] overflow-y-auto scrollbar-thin pb-2">
          {sidebarContent}
        </aside>

        {/* Основная колонка */}
        <div className="flex-1 min-w-0">
          {/* Кнопка фильтров (мобильные) */}
          <div className="mb-4 lg:hidden">
            <button
              type="button"
              onClick={() => setShowMobileFilters(true)}
              className="relative px-4 py-2.5 bg-white border border-emerald-800/40 rounded-xl font-semibold transition-colors text-sm text-[#333] hover:border-emerald-600/50 shadow-sm inline-flex items-center gap-2"
            >
              <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              Фильтры
              {activeFilterCount > 0 && (
                <span className="absolute -top-2 -right-2 w-5 h-5 flex items-center justify-center bg-emerald-600 text-white text-[10px] font-bold rounded-full">
                  {activeFilterCount}
                </span>
              )}
            </button>
          </div>

          {/* Активные фильтры — чипсы */}
          {hasFilters && (
            <div className="flex flex-wrap items-center gap-2 mb-4">
              {currentCategory && (
                <span className="inline-flex items-center gap-1.5 pl-3 pr-2 py-1.5 bg-white border border-emerald-800/40 rounded-full text-sm text-[#333] shadow-sm">
                  <span className="w-2 h-2 rounded-full bg-emerald-600" />
                  {currentCategory}
                  <button onClick={() => updateParams('category', '')} aria-label="Убрать фильтр категории" className="w-5 h-5 flex items-center justify-center rounded-full text-[#9a9a9a] hover:text-white hover:bg-danger transition-colors">&#10005;</button>
                </span>
              )}
              {currentBrand && (
                <span className="inline-flex items-center gap-1.5 pl-3 pr-2 py-1.5 bg-white border border-emerald-800/40 rounded-full text-sm text-[#333] shadow-sm">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  {currentBrand}
                  <button onClick={() => updateParams('brand', '')} aria-label="Убрать фильтр бренда" className="w-5 h-5 flex items-center justify-center rounded-full text-[#9a9a9a] hover:text-white hover:bg-danger transition-colors">&#10005;</button>
                </span>
              )}
              {currentSearch && (
                <span className="inline-flex items-center gap-1.5 pl-3 pr-2 py-1.5 bg-white border border-emerald-800/40 rounded-full text-sm text-[#333] shadow-sm">
                  <SearchIcon className="w-3.5 h-3.5 text-[#9a9a9a]" />
                  &laquo;{currentSearch}&raquo;
                  <button onClick={() => { setSearchInput(''); updateParams('search', ''); }} aria-label="Убрать поиск" className="w-5 h-5 flex items-center justify-center rounded-full text-[#9a9a9a] hover:text-white hover:bg-danger transition-colors">&#10005;</button>
                </span>
              )}
              {mountFilter.size > 0 && (
                <span className="inline-flex items-center gap-1.5 pl-3 pr-2 py-1.5 bg-white border border-emerald-800/40 rounded-full text-sm text-[#333] shadow-sm">
                  <span className="w-2 h-2 rounded-full bg-emerald-600" />
                  Монтаж: {Array.from(mountFilter).join(', ')}
                  <button onClick={() => setMountFilter(new Set())} aria-label="Убрать фильтр монтажа" className="w-5 h-5 flex items-center justify-center rounded-full text-[#9a9a9a] hover:text-white hover:bg-danger transition-colors">&#10005;</button>
                </span>
              )}
              {stockFilter !== 'all' && (
                <span className="inline-flex items-center gap-1.5 pl-3 pr-2 py-1.5 bg-white border border-emerald-800/40 rounded-full text-sm text-[#333] shadow-sm">
                  <span className="w-2 h-2 rounded-full bg-emerald-600" />
                  {stockFilter === 'in_stock' ? 'На складе' : 'Под заказ'}
                  <button onClick={() => setStockFilter('all')} aria-label="Убрать фильтр наличия" className="w-5 h-5 flex items-center justify-center rounded-full text-[#9a9a9a] hover:text-white hover:bg-danger transition-colors">&#10005;</button>
                </span>
              )}
              <button onClick={clearFilters} className="text-[#757575] hover:text-emerald-700 text-sm underline underline-offset-2 ml-1 transition-colors">
                Сбросить все
              </button>
            </div>
          )}

          {/* Контент с fade при переходе */}
          <div className={`transition-opacity duration-200 ${isPending ? 'opacity-50 pointer-events-none' : ''}`}>
            {!hasFilters ? (
              <>
                {/* Каталог по брендам */}
                <section aria-label="Каталог по брендам">
                  <div className="flex items-baseline justify-between gap-3 mb-5">
                    <h2 className="text-xl md:text-2xl font-bold text-[#121212]">
                      Каталог по брендам
                    </h2>
                    <Link
                      prefetch={false}
                      href="/brands"
                      className="inline-flex items-center gap-1.5 h-10 px-4 bg-white border border-emerald-800/40 rounded-full text-sm font-semibold text-emerald-700 hover:border-emerald-600/50 hover:bg-[#f4faf6] active:bg-[#e6f2ea] shadow-sm whitespace-nowrap transition-all touch-manipulation"
                    >
                      Все производители ({brands.length})
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                    {topBrands.map(([name, count]) => (
                      <Link
                        key={name}
                        prefetch={false}
                        href={brandLink(name)}
                        className="group bg-white border border-emerald-800/40 rounded-xl px-4 py-4 flex flex-col items-center justify-center gap-2 hover:border-emerald-600/50 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
                      >
                        <span className="h-12 w-full flex items-center justify-center overflow-hidden">
                          <BrandLogoImg
                            name={name}
                            slug={brandMeta[name]?.slug || ''}
                            className="max-h-12 max-w-[120px] w-auto object-contain transition-transform duration-300 group-hover:scale-105"
                          />
                        </span>
                        <span className="text-xs font-semibold text-[#121212] group-hover:text-emerald-700 text-center leading-tight">
                          {name}
                        </span>
                        <span className="text-[10px] text-[#898989]">
                          {count.toLocaleString('ru-RU')} наименований
                        </span>
                      </Link>
                    ))}
                  </div>
                </section>

                {/* Сетка категорий */}
                <div className="mt-10 pt-8 border-t border-[#e8e8e8] grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                  {categories.map(([catName, count]) => {
                    const subs = SUBCATEGORIES[catName] || [];
                    return (
                      <div
                        key={catName}
                        className="group bg-white border border-emerald-800/40 rounded-xl p-3.5 hover:border-emerald-600/50 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
                      >
                        <Link
                          prefetch={false}
                          href={toggleHref('category', catName)}
                          className="flex items-center gap-3.5 w-full text-left"
                        >
                          <CategoryThumb
                            src={categoryPhoto(catName)}
                            categoryName={catName}
                          />
                          <span className="flex-1 min-w-0">
                            <span className="block font-semibold text-[#121212] group-hover:text-emerald-700 truncate transition-colors">
                              {catName}
                            </span>
                            <span className="text-xs text-[#898989]">
                              {count.toLocaleString('ru-RU')} наименований
                            </span>
                          </span>
                          <svg className="w-4 h-4 text-[#b8c4b6] group-hover:text-emerald-600 group-hover:translate-x-0.5 transition-all flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                          </svg>
                        </Link>
                        {subs.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 mt-3">
                            {subs.slice(0, PREVIEW_SUBCATEGORIES).map(sub => (
                              <Link
                                key={sub}
                                prefetch={false}
                                href={`/catalog?category=${encodeURIComponent(catName)}`}
                                className="px-2.5 py-1 bg-[#f4f6f3] hover:bg-[#e8f0e6] rounded-full text-[11px] text-[#555] hover:text-emerald-800 transition-colors"
                              >
                                {sub}
                              </Link>
                            ))}
                            {subs.length > PREVIEW_SUBCATEGORIES && (
                              <Link
                                prefetch={false}
                                href={`/catalog?category=${encodeURIComponent(catName)}`}
                                className="px-2.5 py-1 rounded-full text-[11px] font-medium text-emerald-700 hover:bg-emerald-50 transition-colors"
                              >
                                +{subs.length - PREVIEW_SUBCATEGORIES} ещё
                              </Link>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Популярные компоненты */}
                <section className="mt-10 pt-8 border-t border-[#e8e8e8]" aria-label="Популярные компоненты">
                  <h2 className="text-xl md:text-2xl font-bold text-[#121212] mb-5">
                    Популярные компоненты
                  </h2>
                  {toolbar}
                  {listOrEmpty}
                  {pagination}
                </section>
              </>
            ) : (
              <>
                {toolbar}
                {listOrEmpty}
                {pagination}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Floating Action Bar для массового RFQ */}
      {floatingBar}

      {/* Mobile Filter Drawer */}
      {showMobileFilters && (
        <div className="fixed inset-0 z-[60] lg:hidden">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowMobileFilters(false)}
          />
          <div className="absolute left-0 top-0 bottom-0 w-[85vw] max-w-sm bg-[#f7f9f6] border-r border-emerald-800/40 flex flex-col overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between px-5 py-4 bg-white border-b border-emerald-800/40">
              <h2 className="text-lg font-bold text-[#121212]">Фильтры</h2>
              <button
                onClick={() => setShowMobileFilters(false)}
                aria-label="Закрыть фильтры"
                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#f0f4ee] text-[#666] hover:text-[#121212] transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-4 py-4">
              {sidebarContent}
            </div>
            <div className="px-5 py-4 bg-white border-t border-emerald-800/40 flex gap-3">
              {hasFilters && (
                <button
                  onClick={clearFilters}
                  className="flex-1 py-3 border border-emerald-800/40 rounded-xl text-[#666] hover:text-[#121212] hover:border-emerald-600/50 transition-colors text-sm font-semibold"
                >
                  Сбросить ({activeFilterCount})
                </button>
              )}
              <button
                onClick={() => setShowMobileFilters(false)}
                className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-500 rounded-xl text-white text-sm font-semibold transition-colors"
              >
                Показать результаты
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

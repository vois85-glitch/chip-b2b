// components/sections/TopSearchBar.tsx
// Сквозной поиск в шапке сайта (inline, flex-1).
// Показывается на ВСЕХ страницах. Dropdown с результатами + кнопка «В КП».

'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '@/lib/cart-context';

type SearchResult = {
  sku: string;
  name: string;
  brand: string;
  category: string;
  status: string;
  has_analogs: boolean;
  url: string;
};

type SearchResponse = {
  query: string;
  normalized: string;
  status: 'exact' | 'analogues' | 'zero';
  results: SearchResult[];
  message?: string;
  cta_url?: string;
};

export default function TopSearchBar() {
  const router = useRouter();
  const { addItem } = useCart();
  const [searchQuery, setSearchQuery] = useState('');
  const [response, setResponse] = useState<SearchResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const performSearch = useCallback(async (q: string) => {
    if (q.trim().length < 2) {
      setResponse(null);
      setShowDropdown(false);
      return;
    }
    setLoading(true);
    setShowDropdown(true);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}&limit=8`);
      const data: SearchResponse = await res.json();
      setResponse(data);
    } catch (err) {
      console.error('[top-search] error:', err);
      setResponse(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // Debounce
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      performSearch(searchQuery);
    }, 300);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [searchQuery, performSearch]);

  // Click outside → close dropdown
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    if (response?.status === 'exact' && response.results.length === 1) {
      window.location.href = response.results[0].url;
      return;
    }
    if (response?.status === 'zero' && response.cta_url) {
      window.location.href = response.cta_url;
      return;
    }
    // Multi-result → переход в каталог с поиском
    router.push(`/catalog?search=${encodeURIComponent(searchQuery.trim())}`);
  };

  return (
    <div className="flex-1 min-w-0 relative" ref={containerRef}>
      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        {/* Единая капсула: иконка + инпут + очистка */}
        <div className="flex items-center flex-1 min-w-0 overflow-hidden rounded-xl border border-[#e8e8e8] bg-[#f0f4ee] focus-within:border-primary focus-within:ring-1 focus-within:ring-primary/20 transition-all">
          {/* Иконка лупы (flex-item, не absolute) */}
          <svg className="shrink-0 w-4 h-4 ml-3 text-[#9a9a9a] pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>

          {/* Инпут (flex-1, без padding под absolute-элементы) */}
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => searchQuery.length >= 2 && setShowDropdown(true)}
            placeholder="Поиск по артикулу, названию, производителю..."
            className="flex-1 min-w-0 px-2 py-2 bg-transparent text-[#121212] placeholder-[#9a9a9a] focus:outline-none text-sm"
            autoComplete="off"
            spellCheck={false}
          />

          {/* Кнопка очистки (flex-item, не absolute) */}
          {searchQuery && (
            <button
              type="button"
              onClick={() => { setSearchQuery(''); setResponse(null); setShowDropdown(false); }}
              className="shrink-0 mr-1.5 text-[#757575] hover:text-[#333] w-5 h-5 flex items-center justify-center rounded-full hover:bg-[#eaf0e8]"
              aria-label="Очистить"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* Зелёная кнопка поиска (отдельный блок, shrink-0) */}
        <button
          type="submit"
          className="shrink-0 inline-flex items-center justify-center px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-semibold transition-colors"
          aria-label="Найти"
        >
          {loading ? (
            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" opacity="0.25" />
              <path d="M12 2a10 10 0 0110 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
            </svg>
          ) : (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          )}
        </button>
      </form>

          {/* Dropdown с результатами */}
          {showDropdown && searchQuery.trim().length >= 2 && (
            <div className="absolute top-full left-0 right-0 mt-2 z-[100] bg-white rounded-xl shadow-2xl border border-[#e8e8e8] max-h-[400px] overflow-y-auto text-left">
              {loading && (
                <div className="p-4 text-center text-[#757575] text-sm">
                  <div className="inline-block w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin mr-2 align-middle"></div>
                  Поиск...
                </div>
              )}

              {!loading && response && response.results.length > 0 && (
                <>
                  <div className="px-4 py-2 bg-[#eaf0e8] text-[#02a391] text-xs font-semibold border-b border-[#e8e8e8]">
                    {response.status === 'exact' ? '✓ Точное совпадение' : 'Аналоги и похожие'}
                    {response.results.length > 0 && ` · ${response.results.length}`}
                  </div>
                  {response.results.slice(0, 8).map((item) => (
                    <div
                      key={item.sku}
                      className="px-4 py-3 hover:bg-[#f8faf7] transition-colors border-b border-[#f0f4ee] last:border-b-0"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <Link href={item.url} className="flex-1 min-w-0" onClick={() => setShowDropdown(false)}>
                          <div className="font-mono font-bold text-[#121212] text-sm break-all">{item.sku}</div>
                          <div className="text-xs text-[#555] mt-0.5 line-clamp-1">{item.name}</div>
                          <div className="flex items-center gap-1.5 mt-1">
                            <span className="px-1.5 py-0.5 bg-[#eaf0e8] rounded text-[10px] text-[#02a391] font-medium">{item.brand}</span>
                            <span className="text-[10px] text-[#9a9a9a]">{item.category}</span>
                            {item.status === 'EOL' && (
                              <span className="px-1.5 py-0.5 rounded text-[9px] font-semibold bg-red-100 text-red-700 uppercase tracking-wide">EOL</span>
                            )}
                          </div>
                        </Link>
                        {/* Кнопка «+ В КП» */}
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            addItem({
                              sku: item.sku,
                              name: item.name,
                              brand: item.brand,
                              category: item.category,
                            });
                          }}
                          className="shrink-0 px-2.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg text-xs font-semibold text-emerald-700 transition-colors whitespace-nowrap"
                        >
                          + В КП
                        </button>
                      </div>
                    </div>
                  ))}
                </>
              )}

              {!loading && response && response.results.length === 0 && (
                <div className="p-6 text-center">
                  <div className="text-sm text-[#555] mb-3">Компонент не найден в каталоге</div>
                  <Link prefetch={false}
                    href={response.cta_url || `/cart`}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg text-sm font-semibold transition-colors"
                  >
                    Запросить наличие
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              )}
            </div>
          )}
    </div>
  );
}

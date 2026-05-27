'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useTransition, useEffect } from 'react';

type Component = {
  sku: string;
  name: string;
  brand: string;
  category: string;
  description: string;
  status: string;
  analogs: string[];
};

export default function CatalogClient({
  components,
  currentPage,
  totalPages,
  totalItems,
  currentCategory,
  currentBrand,
  currentSearch,
  categories,
  brands,
}: {
  components: Component[];
  currentPage: number;
  totalPages: number;
  totalItems: number;
  currentCategory: string;
  currentBrand: string;
  currentSearch: string;
  categories: [string, number][];
  brands: [string, number][];
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [searchInput, setSearchInput] = useState(currentSearch);
  const [showFilters, setShowFilters] = useState(false);
  const [catSearch, setCatSearch] = useState('');
  const [brandSearch, setBrandSearch] = useState('');

  // Close drawer on Escape
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setShowFilters(false);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    if (showFilters) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [showFilters]);

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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateParams('search', searchInput);
  };

  const clearFilters = () => {
    setSearchInput('');
    setCatSearch('');
    setBrandSearch('');
    startTransition(() => {
      router.push('/catalog');
    });
  };

  const activeFilterCount = (currentCategory ? 1 : 0) + (currentBrand ? 1 : 0) + (currentSearch ? 1 : 0);
  const hasFilters = activeFilterCount > 0;

  const filteredCategories = catSearch
    ? categories.filter(([cat]) => cat.toLowerCase().includes(catSearch.toLowerCase()))
    : categories;

  const filteredBrands = brandSearch
    ? brands.filter(([br]) => br.toLowerCase().includes(brandSearch.toLowerCase()))
    : brands;

  // Sidebar content (shared between desktop inline and mobile drawer)
  const filterSidebar = (
    <>
      {/* Categories */}
      <div className="bg-[#eaf0e8] border border-[#e8e8e8] dark:border-[#2a3530] dark:border-[#2a3530] rounded-xl p-4 mb-4">
        <h3 className="text-sm font-bold text-[#333] dark:text-[#c4d0ca] dark:text-[#c4d0ca] mb-3 uppercase tracking-wider">Категории</h3>
        <div className="relative mb-3">
          <input
            type="text"
            value={catSearch}
            onChange={(e) => setCatSearch(e.target.value)}
            placeholder="Найти категорию..."
            className="w-full px-3 py-2 bg-[#f0f4ee] dark:bg-[#f0f4ee] border border-[#e8e8e8] dark:border-[#2a3530] dark:border-[#2a3530] rounded-lg text-sm text-[#121212] dark:text-white dark:text-white placeholder-[#999] dark:placeholder-[#5a6a64] dark:placeholder-[#5a6a64] focus:outline-none focus:border-primary"
          />
          {catSearch && (
            <button onClick={() => setCatSearch('')} className="absolute right-2 top-1/2 -translate-y-1/2 text-[#757575] dark:text-[#7a8a84] dark:text-[#7a8a84] hover:text-[#333] dark:text-[#c4d0ca] dark:text-[#c4d0ca] text-xs">✕</button>
          )}
        </div>
        <div className="space-y-0.5 max-h-72 overflow-y-auto scrollbar-thin">
          {filteredCategories.length > 0 ? filteredCategories.map(([cat, cnt]) => (
            <button
              key={cat}
              onClick={() => updateParams('category', currentCategory === cat ? '' : cat)}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex justify-between items-center ${
                currentCategory === cat
                  ? 'bg-section-alt dark:bg-[#1e2a25] dark:bg-[#1e2a25] text-primary font-semibold'
                  : 'text-[#666] dark:text-[#8a9a94] dark:text-[#8a9a94] hover:text-[#121212] dark:text-white dark:text-white hover:bg-[#eaf0e8] dark:hover:bg-[#253530] dark:bg-[#1a1f1c] dark:hover:bg-[#253530] dark:bg-[#1a1f1c]'
              }`}
            >
              <span className="truncate">{cat}</span>
              <span className="text-xs text-[#898989] ml-2 flex-shrink-0">{cnt}</span>
            </button>
          )) : (
            <p className="text-[#898989] text-sm py-2 px-3">Не найдено</p>
          )}
        </div>
      </div>

      {/* Brands */}
      <div className="bg-[#eaf0e8] border border-[#e8e8e8] dark:border-[#2a3530] dark:border-[#2a3530] rounded-xl p-4">
        <h3 className="text-sm font-bold text-[#333] dark:text-[#c4d0ca] dark:text-[#c4d0ca] mb-3 uppercase tracking-wider">Бренды</h3>
        <div className="relative mb-3">
          <input
            type="text"
            value={brandSearch}
            onChange={(e) => setBrandSearch(e.target.value)}
            placeholder="Найти бренд..."
            className="w-full px-3 py-2 bg-[#f0f4ee] dark:bg-[#f0f4ee] border border-[#e8e8e8] dark:border-[#2a3530] dark:border-[#2a3530] rounded-lg text-sm text-[#121212] dark:text-white dark:text-white placeholder-[#999] dark:placeholder-[#5a6a64] dark:placeholder-[#5a6a64] focus:outline-none focus:border-primary"
          />
          {brandSearch && (
            <button onClick={() => setBrandSearch('')} className="absolute right-2 top-1/2 -translate-y-1/2 text-[#757575] dark:text-[#7a8a84] dark:text-[#7a8a84] hover:text-[#333] dark:text-[#c4d0ca] dark:text-[#c4d0ca] text-xs">✕</button>
          )}
        </div>
        <div className="space-y-0.5 max-h-72 overflow-y-auto scrollbar-thin">
          {filteredBrands.length > 0 ? filteredBrands.map(([br, cnt]) => (
            <button
              key={br}
              onClick={() => updateParams('brand', currentBrand === br ? '' : br)}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex justify-between items-center ${
                currentBrand === br
                  ? 'bg-section-alt dark:bg-[#1e2a25] dark:bg-[#1e2a25] text-primary font-semibold'
                  : 'text-[#666] dark:text-[#8a9a94] dark:text-[#8a9a94] hover:text-[#121212] dark:text-white dark:text-white hover:bg-[#eaf0e8] dark:hover:bg-[#253530] dark:bg-[#1a1f1c] dark:hover:bg-[#253530] dark:bg-[#1a1f1c]'
              }`}
            >
              <span className="truncate">{br}</span>
              <span className="text-xs text-[#898989] ml-2 flex-shrink-0">{cnt}</span>
            </button>
          )) : (
            <p className="text-[#898989] text-sm py-2 px-3">Не найдено</p>
          )}
        </div>
      </div>
    </>
  );

  return (
    <div className="px-4 pb-20">
      <div className="max-w-7xl mx-auto">
        {/* Search bar */}
        <div className="mb-6">
          <form onSubmit={handleSearch} className="flex gap-2 sm:gap-3">
            <div className="flex-1 relative">
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Поиск по артикулу, названию или бренду..."
                className="w-full px-4 sm:px-5 py-3 sm:py-3.5 bg-[#f0f4ee] dark:bg-[#f0f4ee] border border-[#e8e8e8] dark:border-[#2a3530] dark:border-[#2a3530] rounded-xl text-[#121212] dark:text-white dark:text-white placeholder-[#999] dark:placeholder-[#5a6a64] dark:placeholder-[#5a6a64] focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all text-sm sm:text-base"
              />
              {searchInput && (
                <button
                  type="button"
                  onClick={() => { setSearchInput(''); updateParams('search', ''); }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#757575] dark:text-[#7a8a84] dark:text-[#7a8a84] hover:text-[#333] dark:text-[#c4d0ca] dark:text-[#c4d0ca]"
                >
                  ✕
                </button>
              )}
            </div>
            <button
              type="submit"
              className="px-4 sm:px-6 py-3 sm:py-3.5 bg-primary hover:bg-primary-dark rounded-xl font-semibold text-[#121212] dark:text-white dark:text-white transition-colors text-sm sm:text-base"
            >
              Найти
            </button>
            <button
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              className={`relative px-3 sm:px-4 py-3 sm:py-3.5 border rounded-xl font-semibold transition-colors text-sm sm:text-base ${
                showFilters
                  ? 'border-emerald-500/50 bg-emerald-900/20 text-primary'
                  : 'border-[#e8e8e8] dark:border-[#2a3530] dark:border-[#2a3530] bg-[#f0f4ee] dark:bg-[#f0f4ee] text-[#666] dark:text-[#8a9a94] dark:text-[#8a9a94] hover:text-[#121212] dark:text-white dark:text-white'
              }`}
            >
              <span className="hidden sm:inline">Фильтры</span>
              <svg className="w-5 h-5 sm:hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              {activeFilterCount > 0 && (
                <span className="absolute -top-2 -right-2 w-5 h-5 flex items-center justify-center bg-emerald-500 text-[#121212] dark:text-white dark:text-white text-[10px] font-bold rounded-full">
                  {activeFilterCount}
                </span>
              )}
            </button>
          </form>
        </div>

        {/* Active filters */}
        {hasFilters && (
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className="text-[#757575] dark:text-[#7a8a84] dark:text-[#7a8a84] text-sm">Фильтры:</span>
            {currentCategory && (
              <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-emerald-900/30 border border-emerald-800/50 rounded-lg text-primary text-sm">
                {currentCategory}
                <button onClick={() => updateParams('category', '')} className="hover:text-[#121212] dark:text-white dark:text-white ml-1">✕</button>
              </span>
            )}
            {currentBrand && (
              <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-cyan-900/30 border border-cyan-800/50 rounded-lg text-primary text-sm">
                {currentBrand}
                <button onClick={() => updateParams('brand', '')} className="hover:text-[#121212] dark:text-white dark:text-white ml-1">✕</button>
              </span>
            )}
            {currentSearch && (
              <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-section-alt dark:bg-[#1e2a25] dark:bg-[#1e2a25] border border-purple-800/50 rounded-lg text-primary text-sm">
                &laquo;{currentSearch}&raquo;
                <button onClick={() => { setSearchInput(''); updateParams('search', ''); }} className="hover:text-[#121212] dark:text-white dark:text-white ml-1">✕</button>
              </span>
            )}
            <button onClick={clearFilters} className="text-[#757575] dark:text-[#7a8a84] dark:text-[#7a8a84] hover:text-[#121212] dark:text-white dark:text-white text-sm underline ml-2">
              Сбросить все
            </button>
          </div>
        )}

        <div className="flex gap-6">
          {/* Desktop sidebar — visible on lg+ when showFilters is true */}
          {showFilters && (
            <aside className="w-64 flex-shrink-0 hidden lg:block">
              {filterSidebar}
            </aside>
          )}

          {/* Main content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-4">
              <p className="text-[#757575] dark:text-[#7a8a84] dark:text-[#7a8a84] text-sm">
                {isPending ? 'Загрузка...' : `Показано ${components.length} из ${totalItems.toLocaleString()} компонентов`}
              </p>
            </div>

            {components.length > 0 ? (
              <div className={`grid gap-3 ${showFilters ? 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'}`}>
                {components.map((comp) => (
                  <Link
                    key={comp.sku}
                    href={`/component/${encodeURIComponent(comp.sku)}`}
                    className="group block bg-[#e0e8de] border border-[#e8e8e8] dark:border-[#2a3530] dark:border-[#2a3530] rounded-xl p-4 hover:bg-[#d5e0d3] hover:border-emerald-800/50 transition-all duration-200"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <span className="font-mono font-bold text-primary group-hover:text-emerald-300 text-sm leading-tight break-all">
                        {comp.sku}
                      </span>
                      <span className={`flex-shrink-0 ml-2 px-2 py-0.5 rounded text-[10px] font-semibold ${
                        comp.status === 'EOL'
                          ? 'bg-red-900/40 text-red-400'
                          : 'bg-section-alt dark:bg-[#1e2a25] dark:bg-[#1e2a25] text-primary'
                      }`}>
                        {comp.status === 'EOL' ? 'EOL' : 'В пр.'}
                      </span>
                    </div>
                    <p className="text-[#666] dark:text-[#8a9a94] dark:text-[#8a9a94] text-xs leading-relaxed mb-2 line-clamp-2">
                      {comp.name}
                    </p>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 bg-[#d5e0d3] rounded text-[10px] text-[#757575] dark:text-[#7a8a84] dark:text-[#7a8a84]">
                        {comp.brand}
                      </span>
                      <span className="px-2 py-0.5 bg-[#d5e0d3] rounded text-[10px] text-[#757575] dark:text-[#7a8a84] dark:text-[#7a8a84]">
                        {comp.category}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <div className="text-5xl mb-4">🔍</div>
                <h3 className="text-xl font-bold text-[#333] dark:text-[#c4d0ca] dark:text-[#c4d0ca] mb-2">Компоненты не найдены</h3>
                <p className="text-[#757575] dark:text-[#7a8a84] dark:text-[#7a8a84] mb-6">Попробуйте изменить параметры поиска или фильтры</p>
                <button
                  onClick={clearFilters}
                  className="px-6 py-2.5 bg-primary hover:bg-primary-dark rounded-lg font-semibold text-[#121212] dark:text-white dark:text-white transition-colors"
                >
                  Сбросить фильтры
                </button>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-8">
                {currentPage > 1 && (
                  <Link
                    href={`/catalog?${new URLSearchParams({ ...Object.fromEntries(searchParams.entries()), page: String(currentPage - 1) }).toString()}`}
                    className="px-4 py-2 bg-[#f0f4ee] dark:bg-[#f0f4ee] border border-[#e8e8e8] dark:border-[#2a3530] dark:border-[#2a3530] rounded-lg text-[#666] dark:text-[#8a9a94] dark:text-[#8a9a94] hover:text-[#121212] dark:text-white dark:text-white hover:border-emerald-600/50 transition-colors"
                  >
                    ← Назад
                  </Link>
                )}
                {Array.from({ length: Math.min(7, totalPages) }, (_, i) => {
                  let pageNum: number;
                  if (totalPages <= 7) { pageNum = i + 1; }
                  else if (currentPage <= 4) { pageNum = i + 1; }
                  else if (currentPage >= totalPages - 3) { pageNum = totalPages - 6 + i; }
                  else { pageNum = currentPage - 3 + i; }
                  return pageNum;
                }).map((pageNum) => (
                  <Link
                    key={pageNum}
                    href={`/catalog?${new URLSearchParams({ ...Object.fromEntries(searchParams.entries()), page: String(pageNum) }).toString()}`}
                    className={`w-10 h-10 flex items-center justify-center rounded-lg font-medium transition-colors ${
                      pageNum === currentPage
                        ? 'bg-primary text-[#121212] dark:text-white dark:text-white'
                        : 'bg-[#f0f4ee] dark:bg-[#f0f4ee] border border-[#e8e8e8] dark:border-[#2a3530] dark:border-[#2a3530] text-[#666] dark:text-[#8a9a94] dark:text-[#8a9a94] hover:text-[#121212] dark:text-white dark:text-white hover:border-emerald-600/50'
                    }`}
                  >
                    {pageNum}
                  </Link>
                ))}
                {currentPage < totalPages && (
                  <Link
                    href={`/catalog?${new URLSearchParams({ ...Object.fromEntries(searchParams.entries()), page: String(currentPage + 1) }).toString()}`}
                    className="px-4 py-2 bg-[#f0f4ee] dark:bg-[#f0f4ee] border border-[#e8e8e8] dark:border-[#2a3530] dark:border-[#2a3530] rounded-lg text-[#666] dark:text-[#8a9a94] dark:text-[#8a9a94] hover:text-[#121212] dark:text-white dark:text-white hover:border-emerald-600/50 transition-colors"
                  >
                    Далее →
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile / Tablet Filter Drawer */}
      {showFilters && (
        <div className="fixed inset-0 z-[60] lg:hidden">
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowFilters(false)}
          />
          {/* Drawer panel */}
          <div className="absolute left-0 top-0 bottom-0 w-[85vw] max-w-sm bg-[#0a0d0c] border-r border-[#e8e8e8] dark:border-[#2a3530] dark:border-[#2a3530] flex flex-col overflow-hidden">
            {/* Drawer header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#e8e8e8] dark:border-[#2a3530] dark:border-[#2a3530]">
              <h2 className="text-lg font-bold text-[#121212] dark:text-white dark:text-white">Фильтры</h2>
              <button
                onClick={() => setShowFilters(false)}
                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#eaf0e8] dark:hover:bg-[#253530] dark:bg-[#1a1f1c] dark:hover:bg-[#253530] dark:bg-[#1a1f1c] text-[#666] dark:text-[#8a9a94] dark:text-[#8a9a94] hover:text-[#121212] dark:text-white dark:text-white transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Drawer body — scrollable */}
            <div className="flex-1 overflow-y-auto px-4 py-4">
              {filterSidebar}
            </div>

            {/* Drawer footer */}
            <div className="px-5 py-4 border-t border-[#e8e8e8] dark:border-[#2a3530] dark:border-[#2a3530] flex gap-3">
              {hasFilters && (
                <button
                  onClick={clearFilters}
                  className="flex-1 py-3 border border-[#e8e8e8] dark:border-[#2a3530] dark:border-[#2a3530] rounded-xl text-[#666] dark:text-[#8a9a94] dark:text-[#8a9a94] hover:text-[#121212] dark:text-white dark:text-white hover:border-gray-600 transition-colors text-sm font-semibold"
                >
                  Сбросить ({activeFilterCount})
                </button>
              )}
              <button
                onClick={() => setShowFilters(false)}
                className="flex-1 py-3 bg-primary hover:bg-primary-dark rounded-xl text-[#121212] dark:text-white dark:text-white text-sm font-semibold transition-colors"
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

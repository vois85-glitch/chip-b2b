'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useTransition } from 'react';

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
    startTransition(() => {
      router.push('/catalog');
    });
  };

  const hasFilters = currentCategory || currentBrand || currentSearch;

  return (
    <div className="px-4 pb-20">
      <div className="max-w-7xl mx-auto">
        {/* Search bar */}
        <div className="mb-6">
          <form onSubmit={handleSearch} className="flex gap-3">
            <div className="flex-1 relative">
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Поиск по артикулу, названию или бренду..."
                className="w-full px-5 py-3.5 bg-gray-900/80 border border-gray-700/50 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/30 transition-all"
              />
              {searchInput && (
                <button
                  type="button"
                  onClick={() => { setSearchInput(''); updateParams('search', ''); }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                >
                  ✕
                </button>
              )}
            </div>
            <button
              type="submit"
              className="px-6 py-3.5 bg-emerald-600 hover:bg-emerald-500 rounded-xl font-semibold text-white transition-colors"
            >
              Найти
            </button>
            <button
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              className={`px-4 py-3.5 border rounded-xl font-semibold transition-colors ${showFilters ? 'border-emerald-500/50 bg-emerald-900/20 text-emerald-400' : 'border-gray-700/50 bg-gray-900/80 text-gray-400 hover:text-white'}`}
            >
              Фильтры
            </button>
          </form>
        </div>

        {/* Active filters */}
        {hasFilters && (
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className="text-gray-500 text-sm">Фильтры:</span>
            {currentCategory && (
              <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-emerald-900/30 border border-emerald-800/50 rounded-lg text-emerald-400 text-sm">
                {currentCategory}
                <button onClick={() => updateParams('category', '')} className="hover:text-white ml-1">✕</button>
              </span>
            )}
            {currentBrand && (
              <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-cyan-900/30 border border-cyan-800/50 rounded-lg text-cyan-400 text-sm">
                {currentBrand}
                <button onClick={() => updateParams('brand', '')} className="hover:text-white ml-1">✕</button>
              </span>
            )}
            {currentSearch && (
              <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-purple-900/30 border border-purple-800/50 rounded-lg text-purple-400 text-sm">
                &laquo;{currentSearch}&raquo;
                <button onClick={() => { setSearchInput(''); updateParams('search', ''); }} className="hover:text-white ml-1">✕</button>
              </span>
            )}
            <button onClick={clearFilters} className="text-gray-500 hover:text-white text-sm underline ml-2">
              Сбросить все
            </button>
          </div>
        )}

        <div className="flex gap-6">
          {/* Sidebar filters */}
          {showFilters && (
            <aside className="w-64 flex-shrink-0 hidden lg:block">
              {/* Categories */}
              <div className="bg-gray-900/50 border border-gray-800/50 rounded-xl p-4 mb-4">
                <h3 className="text-sm font-bold text-gray-300 mb-3 uppercase tracking-wider">Категории</h3>
                <div className="space-y-1 max-h-80 overflow-y-auto">
                  {categories.map(([cat, cnt]) => (
                    <button
                      key={cat}
                      onClick={() => updateParams('category', currentCategory === cat ? '' : cat)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex justify-between items-center ${
                        currentCategory === cat
                          ? 'bg-emerald-900/40 text-emerald-400 font-semibold'
                          : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                      }`}
                    >
                      <span className="truncate">{cat}</span>
                      <span className="text-xs text-gray-600 ml-2 flex-shrink-0">{cnt}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Brands */}
              <div className="bg-gray-900/50 border border-gray-800/50 rounded-xl p-4">
                <h3 className="text-sm font-bold text-gray-300 mb-3 uppercase tracking-wider">Бренды</h3>
                <div className="space-y-1 max-h-80 overflow-y-auto">
                  {brands.map(([br, cnt]) => (
                    <button
                      key={br}
                      onClick={() => updateParams('brand', currentBrand === br ? '' : br)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex justify-between items-center ${
                        currentBrand === br
                          ? 'bg-cyan-900/40 text-cyan-400 font-semibold'
                          : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                      }`}
                    >
                      <span className="truncate">{br}</span>
                      <span className="text-xs text-gray-600 ml-2 flex-shrink-0">{cnt}</span>
                    </button>
                  ))}
                </div>
              </div>
            </aside>
          )}

          {/* Main content */}
          <div className="flex-1 min-w-0">
            {/* Results count */}
            <div className="flex items-center justify-between mb-4">
              <p className="text-gray-500 text-sm">
                {isPending ? 'Загрузка...' : `Показано ${components.length} из ${totalItems.toLocaleString()} компонентов`}
              </p>
            </div>

            {/* Products grid */}
            {components.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {components.map((comp) => (
                  <Link
                    key={comp.sku}
                    href={`/component/${encodeURIComponent(comp.sku)}`}
                    className="group block bg-gray-900/40 border border-gray-800/50 rounded-xl p-4 hover:bg-gray-900/70 hover:border-emerald-800/50 transition-all duration-200"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <span className="font-mono font-bold text-emerald-400 group-hover:text-emerald-300 text-sm leading-tight break-all">
                        {comp.sku}
                      </span>
                      <span className={`flex-shrink-0 ml-2 px-2 py-0.5 rounded text-[10px] font-semibold ${
                        comp.status === 'EOL'
                          ? 'bg-red-900/40 text-red-400'
                          : 'bg-emerald-900/40 text-emerald-400'
                      }`}>
                        {comp.status === 'EOL' ? 'EOL' : 'В пр.'}
                      </span>
                    </div>
                    <p className="text-gray-400 text-xs leading-relaxed mb-2 line-clamp-2">
                      {comp.name}
                    </p>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 bg-gray-800/80 rounded text-[10px] text-gray-500">
                        {comp.brand}
                      </span>
                      <span className="px-2 py-0.5 bg-gray-800/80 rounded text-[10px] text-gray-500">
                        {comp.category}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <div className="text-5xl mb-4">🔍</div>
                <h3 className="text-xl font-bold text-gray-300 mb-2">Компоненты не найдены</h3>
                <p className="text-gray-500 mb-6">Попробуйте изменить параметры поиска или фильтры</p>
                <button
                  onClick={clearFilters}
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 rounded-lg font-semibold text-white transition-colors"
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
                    className="px-4 py-2 bg-gray-900/80 border border-gray-700/50 rounded-lg text-gray-400 hover:text-white hover:border-emerald-600/50 transition-colors"
                  >
                    ← Назад
                  </Link>
                )}

                {Array.from({ length: Math.min(7, totalPages) }, (_, i) => {
                  let pageNum: number;
                  if (totalPages <= 7) {
                    pageNum = i + 1;
                  } else if (currentPage <= 4) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 3) {
                    pageNum = totalPages - 6 + i;
                  } else {
                    pageNum = currentPage - 3 + i;
                  }
                  return pageNum;
                }).map((pageNum) => (
                  <Link
                    key={pageNum}
                    href={`/catalog?${new URLSearchParams({ ...Object.fromEntries(searchParams.entries()), page: String(pageNum) }).toString()}`}
                    className={`w-10 h-10 flex items-center justify-center rounded-lg font-medium transition-colors ${
                      pageNum === currentPage
                        ? 'bg-emerald-600 text-white'
                        : 'bg-gray-900/80 border border-gray-700/50 text-gray-400 hover:text-white hover:border-emerald-600/50'
                    }`}
                  >
                    {pageNum}
                  </Link>
                ))}

                {currentPage < totalPages && (
                  <Link
                    href={`/catalog?${new URLSearchParams({ ...Object.fromEntries(searchParams.entries()), page: String(currentPage + 1) }).toString()}`}
                    className="px-4 py-2 bg-gray-900/80 border border-gray-700/50 rounded-lg text-gray-400 hover:text-white hover:border-emerald-600/50 transition-colors"
                  >
                    Далее →
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

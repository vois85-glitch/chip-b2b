'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

type SearchResult = {
  sku: string;
  name: string;
  brand: string;
  category: string;
  status: string;
  has_analogs: boolean;
  price_on_request: true;
  url: string;
};

type SearchResponse = {
  query: string;
  normalized: string;
  status: 'exact' | 'analogues' | 'zero';
  results: SearchResult[];
  message?: string;
  cta_url?: string;
  request_form?: boolean;
};

export default function ComponentSearch() {
  const [searchQuery, setSearchQuery] = useState('');
  const [response, setResponse] = useState<SearchResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Debounced search (300ms)
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
      console.error('[search] error:', err);
      setResponse({
        query: q,
        normalized: '',
        status: 'zero',
        results: [],
        message: 'Ошибка поиска. Попробуйте еще раз или оставьте заявку.',
        cta_url: `/cart`,
        request_form: true,
      });
    } finally {
      setLoading(false);
    }
  }, []);

  // Авто-скролл к полю поиска когда dropdown появляется
  // чтобы результаты были видны в viewport
  useEffect(() => {
    if (showDropdown && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const dropdownHeight = 420;
      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceNeeded = dropdownHeight + 20;
      
      if (spaceBelow < spaceNeeded) {
        const scrollOffset = spaceNeeded - spaceBelow;
        window.scrollBy({ top: scrollOffset, behavior: "smooth" });
      }
    }
  }, [showDropdown, response]);

  // Trigger search on input with debounce
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      performSearch(searchQuery);
    }, 300);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [searchQuery, performSearch]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fallback: scroll to BOM form on Enter (preserves old UX)
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      if (response?.status === 'exact' && response.results.length === 1) {
        window.location.href = response.results[0].url;
        return;
      }
      if (response?.status === 'zero' && response.cta_url) {
        window.location.href = response.cta_url;
        return;
      }
      const bomSection = document.getElementById('bom');
      if (bomSection) {
        bomSection.scrollIntoView({ behavior: 'smooth' });
        setTimeout(() => {
          const textarea = document.querySelector('textarea[name="message"]') as HTMLTextAreaElement;
          if (textarea) {
            textarea.value = `Требуется подбор/проверка наличия:\n${searchQuery}`;
            textarea.dispatchEvent(new Event('input', { bubbles: true }));
          }
        }, 500);
      }
    }
  };

  return (
    <section id="search" className="py-6 px-4 bg-[#f0f4ee] relative z-20 overflow-visible scroll-mt-[195px]">
      <div className="max-w-3xl mx-auto relative z-30 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-xl md:text-2xl font-bold mb-2 text-[#121212]">Поиск компонентов</h2>
          <p className="text-[#555] text-sm mb-4">Введите артикул — проверим наличие, подберем аналог или организуем поставку</p>

          <div ref={containerRef} className="relative">
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => searchQuery.length >= 2 && setShowDropdown(true)}
                placeholder="Например: STM32F103C8T6 или LM7805"
                className="flex-grow bg-[#eaf0e8] border border-[#e8e8e8] rounded-lg px-4 py-2.5 text-[#121212] placeholder-[#999] focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-colors text-base"
                autoComplete="off"
                spellCheck={false}
              />
              <button
                type="submit"
                className="px-6 py-2.5 bg-primary hover:bg-primary-dark rounded-lg text-sm font-semibold transition-all shadow-lg shadow-primary/25 whitespace-nowrap text-white"
              >
                {loading ? 'Поиск...' : 'Найти / Запросить'}
              </button>
            </form>

            {/* DROPDOWN — непрозрачный белый с тенью */}
            {showDropdown && searchQuery.trim().length >= 2 && (
              <div className="absolute top-full left-0 right-0 mt-2 z-[100] bg-white rounded-xl shadow-2xl border border-[#e8e8e8] max-h-[400px] overflow-y-auto text-left">
                  {loading && (
                    <div className="p-4 text-center text-[#757575] text-sm">
                      <div className="inline-block w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin mr-2 align-middle"></div>
                      Поиск...
                    </div>
                  )}

                  {!loading && response && (
                    <>
                      {/* STATE 1: EXACT MATCH */}
                      {response.status === 'exact' && (
                        <div>
                          <div className="px-4 py-2 bg-green-50 text-green-800 text-xs font-semibold border-b border-green-200">
                            ✓ {response.message}
                          </div>
                          {response.results.map((item) => (
                            <SearchResultItem key={item.sku} item={item} />
                          ))}
                        </div>
                      )}

                      {/* STATE 2: ANALOGUES (partial matches) */}
                      {response.status === 'analogues' && (
                        <div>
                          <div className="px-4 py-2 bg-amber-50 text-amber-800 text-xs font-semibold border-b border-amber-200">
                            ⚠ {response.message}
                          </div>
                          {response.results.map((item) => (
                            <SearchResultItem key={item.sku} item={item} />
                          ))}
                          <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 text-center">
                            <Link prefetch={false}
                              href={`/cart`}
                              className="inline-block px-4 py-2 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-primary-dark transition-colors"
                            >
                              Не нашли нужный? Запросить поиск →
                            </Link>
                          </div>
                        </div>
                      )}

                      {/* STATE 3: ZERO RESULTS */}
                      {response.status === 'zero' && (
                        <div className="p-6 text-center">
                          <div className="text-3xl mb-2">🔍</div>
                          <p className="text-[#333] font-semibold mb-2">{response.message}</p>
                          <p className="text-[#757575] text-sm mb-4">
                            Найдём оригинал или аналог за 24 часа. Поставка от 1 шт., безналичный расчёт с НДС.
                          </p>
                          <Link prefetch={false}
                            href={response.cta_url || `/cart`}
                            className="inline-block px-6 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary-dark transition-colors shadow-lg shadow-primary/25"
                          >
                            Запросить поиск компонента →
                          </Link>
                        </div>
                      )}
                    </>
                  )}
              </div>
            )}
          </div>

          <div className="mt-3 flex flex-wrap justify-center gap-2 text-xs text-[#757575]">
            <span>Часто ищут:</span>
            <button onClick={() => setSearchQuery('XC3S200A')} className="hover:text-primary transition-colors">XC3S200A</button>
            <button onClick={() => setSearchQuery('SN74HC595N')} className="hover:text-primary transition-colors">SN74HC595N</button>
            <button onClick={() => setSearchQuery('ATMEGA328P')} className="hover:text-primary transition-colors">ATMEGA328P</button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// Reusable search result item — с полупрозрачным hover
function SearchResultItem({ item }: { item: SearchResult }) {
  const isEOL = item.status === 'EOL';
  return (
    <Link prefetch={false}
      href={item.url}
      className="block px-4 py-3 hover:bg-[#f0f4ee] transition-colors border-b border-gray-100 last:border-b-0"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="font-bold text-[#121212] text-sm truncate">{item.sku}</div>
          <div className="text-xs text-[#666] truncate">{item.name}</div>
          <div className="text-xs text-[#757575] mt-1">
            {item.brand} · {item.category}
          </div>
        </div>
        <div className="flex flex-col items-end gap-1 shrink-0">
          {isEOL && (
            <span className="px-2 py-0.5 text-xs rounded-full bg-red-100 text-red-700">
              EOL
            </span>
          )}
          {item.has_analogs && (
            <span className="text-xs text-primary">есть аналоги</span>
          )}
          <span className="text-xs text-[#757575]">Цена по запросу</span>
        </div>
      </div>
    </Link>
  );
}


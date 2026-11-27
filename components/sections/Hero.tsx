'use client';

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useRef, useCallback, useEffect } from "react";
import { motion } from "framer-motion";

// ─── Частые запросы для чипов под поиском ──────────────────────────────────
const POPULAR_QUERIES = [
  { label: 'STM32', q: 'STM32' },
  { label: 'Texas Instruments', q: 'Texas Instruments' },
  { label: 'FPGA', q: 'FPGA' },
  { label: 'ESP32', q: 'ESP32' },
  { label: 'LM358', q: 'LM358' },
  { label: 'Xilinx', q: 'Xilinx' },
  { label: 'MIC5205', q: 'MIC5205' },
  { label: 'STM8', q: 'STM8' },
];

type SearchResult = {
  sku: string;
  name: string;
  brand: string;
  category: string;
  url?: string;
};

export default function Hero() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // ─── Debounced instant search (300ms) ───────────────────────────────────
  const performSearch = useCallback(async (q: string) => {
    if (q.trim().length < 2) {
      setResults([]);
      setShowDropdown(false);
      return;
    }
    setLoading(true);
    setShowDropdown(true);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}&limit=6`);
      const data = await res.json();
      setResults(data.results || []);
    } catch (err) {
      console.error('[hero-search] error:', err);
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    setQuery(v);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => performSearch(v), 300);
  };

  // Закрытие dropdown при клике вне
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  // ─── Submit: переход в каталог с поиском ─────────────────────────────────
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    if (q) {
      setShowDropdown(false);
      router.push(`/catalog?search=${encodeURIComponent(q)}`);
    }
  };

  const handleChipClick = (q: string) => {
    setQuery(q);
    router.push(`/catalog?search=${encodeURIComponent(q)}`);
  };

  // ─── Переход в карточку компонента ───────────────────────────────────────
  const goToComponent = (sku: string) => {
    setShowDropdown(false);
    setQuery(sku);
    router.push(`/component/${encodeURIComponent(sku)}`);
  };

  return (
    <section className="relative bg-[#052018] overflow-hidden pt-36 sm:pt-40 lg:pt-36 pb-12 md:pb-16" style={{ backgroundImage: 'linear-gradient(to bottom right, #082c23, #052018, #02120e)' }}>
      {/* Background decorative elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[180px]" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-[#10b981]/15 rounded-full blur-[150px]" />
        {/* Circuit pattern overlay */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: "linear-gradient(#10b981 1px, transparent 1px), linear-gradient(90deg, #10b981 1px, transparent 1px)",
          backgroundSize: "60px 60px"
        }} />
      </div>

      {/* ═══ 2-колоночный layout: lg:grid-cols-12, левая 6 + правая 6 ═════ */}
      <div className="relative z-10 max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">

          {/* ═════ ЛЕВАЯ КОЛОНКА (lg:col-span-6) ════════════════════════════ */}
          <div className="lg:col-span-6 order-1 lg:order-1">
            {/* Бейдж */}
            <motion.div
              initial={{ opacity: 1, y: 0 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-3 py-1 md:px-4 md:py-1.5 mb-3 md:mb-4 border border-[#34d399]/30 rounded-full bg-[#34d399]/10 backdrop-blur-md text-xs md:text-sm text-[#34d399]"
            >
              <span className="w-1.5 h-1.5 md:w-2 md:h-2 bg-[#34d399] rounded-full animate-pulse" />
              Поставщик электронных компонентов для производств
            </motion.div>

            {/* H1 */}
            <motion.h1
              initial={{ opacity: 1, y: 0 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="text-2xl sm:text-3xl md:text-4xl lg:text-[2.6rem] font-bold tracking-tight leading-[1.1] mb-2 md:mb-3 text-white"
            >
              Поставка оригинальных{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#34d399] to-[#10b981]">
                электронных компонентов
              </span>{" "}
              от 6 дней
            </motion.h1>

            {/* Подзаголовок */}
            <motion.p
              initial={{ opacity: 1, y: 0 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-sm md:text-base text-[#94a3b8] max-w-xl mb-5 md:mb-6 leading-relaxed"
            >
              Гарантия оригинала. Постоплата для постоянных клиентов.
              Подбор аналогов для снятых с производства позиций. Доставка из Европы и Азии.
            </motion.p>

            {/* ═══ Увеличенный 3D-чип для мобильных устройств ════════════════ */}
            <div className="block lg:hidden my-6 w-full max-w-[340px] sm:max-w-[380px] mx-auto relative z-10 px-2">
              <Image
                src="/hero-illustration.webp"
                alt="3D Электронный компонент ChipNet"
                width={380}
                height={285}
                priority
                className="w-full h-auto object-contain filter drop-shadow-[0_12px_30px_rgba(16,185,129,0.3)] transition-transform duration-300 hover:scale-105"
              />
            </div>

            {/* ═══ ПОИСКОВАЯ СТРОКА УБРАНА — сквозной поиск теперь в шапке сайта ═══ */}

            {/* ═══ ЧАСТЫЕ ЗАПРОСЫ (кликабельные теги) ═════════════════════════ */}
            <motion.div
              initial={{ opacity: 1, y: 0 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.45 }}
              className="flex flex-wrap items-center gap-2 mt-5 md:mt-6 pb-20"
            >
              <span className="text-xs text-[#64748b] mr-1">Часто ищут:</span>
              {POPULAR_QUERIES.map((item) => (
                <button
                  key={item.label}
                  onClick={() => handleChipClick(item.q)}
                  className="px-3 py-1.5 bg-white/5 hover:bg-[#34d399]/15 border border-white/10 hover:border-[#34d399]/40 rounded-full text-xs md:text-sm text-[#cbd5e1] hover:text-[#34d399] backdrop-blur-sm transition-all"
                >
                  {item.label}
                </button>
              ))}
            </motion.div>

            {/* ═══ CTA: Загрузить BOM + Реквизиты (PDF) ════════════════════ */}
            <motion.div
              initial={{ opacity: 1, y: 0 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.75 }}
              className="flex flex-wrap items-center gap-3 mt-7 md:mt-8"
            >
              <a href="#bom" className="group inline-flex items-center gap-2 px-5 h-11 bg-emerald-600 hover:bg-emerald-500 rounded-xl text-sm font-bold transition-all shadow-lg shadow-emerald-600/25 text-white">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                Загрузить BOM
              </a>
              <a
                href="/requisites.pdf"
                download
                className="inline-flex items-center gap-2 px-5 h-11 bg-white/5 hover:bg-white/10 border border-white/15 hover:border-white/30 rounded-xl text-sm font-semibold backdrop-blur-md transition-all text-white"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                </svg>
                Реквизиты (PDF)
              </a>
            </motion.div>
          </div>

          {/* ═════ ПРАВАЯ КОЛОНКА (lg:col-span-6) — 3D-иллюстрация (максимально крупная) ═══ */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="lg:col-span-6 order-2 lg:order-2 hidden lg:block"
          >
            <div className="group relative w-full h-full flex items-center justify-center">
              {/* Мягкое изумрудное свечение под изображением */}
              <div className="absolute inset-0 bg-emerald-500/15 rounded-3xl blur-3xl pointer-events-none transition-all duration-500 group-hover:bg-emerald-500/25" />

              {/* 3D-иллюстрация микросхемы ChipNet с плавным zoom при наведении */}
              <picture className="block w-full">
                <source srcSet="/hero-illustration.webp" type="image/webp" />
                <source srcSet="/hero-illustration.jpg" type="image/jpeg" />
                <Image
                  src="/hero-illustration.webp"
                  alt="3D-иллюстрация: микросхема ChipNet с holografic-панелями — 100% оригинал, B2B-поставка, доставка от 6 дней"
                  width={604}
                  height={451}
                  priority
                  className="relative w-full max-h-[540px] h-auto object-contain rounded-2xl shadow-[0_0_60px_-10px_rgba(16,185,129,0.35)] transition-transform duration-500 ease-out group-hover:scale-105"
                />
              </picture>
            </div>
          </motion.div>

        </div>
      </div>

      {/* Bottom wave separator */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
          <path d="M0 60L60 54C120 48 240 36 360 30C480 24 600 24 720 28C840 32 960 40 1080 42C1200 44 1320 40 1380 38L1440 36V60H0Z" fill="white"/>
        </svg>
      </div>
    </section>
  );
}

'use client';

import { motion } from 'framer-motion';

// Компонент парящего чипа
const FloatingChip = ({ className, delay = 0 }: { className?: string, delay?: number }) => (
  <motion.div 
    className={`absolute text-emerald-500/10 pointer-events-none ${className}`}
    animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay }}
  >
    <svg width="200" height="200" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="4" width="16" height="16" rx="2" ry="2"></rect>
      <rect x="9" y="9" width="6" height="6"></rect>
      <line x1="9" y1="1" x2="9" y2="4"></line>
      <line x1="15" y1="1" x2="15" y2="4"></line>
      <line x1="9" y1="20" x2="9" y2="23"></line>
      <line x1="15" y1="20" x2="15" y2="23"></line>
      <line x1="20" y1="9" x2="23" y2="9"></line>
      <line x1="20" y1="14" x2="23" y2="14"></line>
      <line x1="1" y1="9" x2="4" y2="9"></line>
      <line x1="1" y1="14" x2="4" y2="14"></line>
    </svg>
  </motion.div>
);

// Компонент парящего процессора (BGA)
const FloatingCPU = ({ className, delay = 0 }: { className?: string, delay?: number }) => (
  <motion.div 
    className={`absolute text-emerald-500/10 pointer-events-none ${className}`}
    animate={{ y: [0, 15, 0], rotate: [0, -5, 0] }}
    transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay }}
  >
    <svg width="180" height="180" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="4" width="16" height="16" rx="2" ry="2"></rect>
      <rect x="7" y="7" width="10" height="10" rx="1" ry="1"></rect>
      <line x1="7" y1="1" x2="7" y2="4"></line>
      <line x1="10" y1="1" x2="10" y2="4"></line>
      <line x1="14" y1="1" x2="14" y2="4"></line>
      <line x1="17" y1="1" x2="17" y2="4"></line>
      <line x1="7" y1="20" x2="7" y2="23"></line>
      <line x1="10" y1="20" x2="10" y2="23"></line>
      <line x1="14" y1="20" x2="14" y2="23"></line>
      <line x1="17" y1="20" x2="17" y2="23"></line>
      <line x1="20" y1="7" x2="23" y2="7"></line>
      <line x1="20" y1="10" x2="23" y2="10"></line>
      <line x1="20" y1="14" x2="23" y2="14"></line>
      <line x1="20" y1="17" x2="23" y2="17"></line>
      <line x1="1" y1="7" x2="4" y2="7"></line>
      <line x1="1" y1="10" x2="4" y2="10"></line>
      <line x1="1" y1="14" x2="4" y2="14"></line>
      <line x1="1" y1="17" x2="4" y2="17"></line>
    </svg>
  </motion.div>
);

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Анимированный зеленый неоновый фон */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-600 rounded-full blur-[200px] opacity-20 pointer-events-none" />
      <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-green-500 rounded-full blur-[180px] opacity-15 pointer-events-none" />
      
      {/* --- РИСУНКИ ЧИПОВ --- */}
      <FloatingChip className="hidden lg:block top-1/4 left-[10%] w-48 h-48" delay={0} />
      <FloatingCPU className="hidden lg:block bottom-1/4 right-[10%] w-40 h-40" delay={1.5} />
      <FloatingChip className="hidden md:block top-[15%] right-[25%] w-24 h-24 opacity-50" delay={3} />
      
      <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-2 mb-8 border border-emerald-800/50 rounded-full bg-emerald-900/20 backdrop-blur-md text-sm text-emerald-300"
        >
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          Работаем с импортозамещением и санкционными компонентами
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-5xl md:text-7xl font-bold tracking-tight leading-tight mb-6"
        >
          Поставка оригинальных <br className="hidden md:block" />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-green-300 to-emerald-500">электронных компонентов</span> <br className="hidden md:block" />
          от 6 дней
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-10"
        >
          Гарантия оригинала. Постоплата для постоянных клиентов. 
          Подбор аналогов для unavailable позиций. Доставка из Европы и Азии.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <a href="#bom" className="px-8 py-4 bg-emerald-600 hover:bg-emerald-700 rounded-xl text-lg font-semibold transition-all shadow-lg shadow-emerald-600/25 hover:shadow-emerald-600/40 text-center">
            Получить КП за 2 часа
          </a>
          <a href="#bom" className="px-8 py-4 bg-white/5 hover:bg-emerald-900/20 border border-emerald-800/50 rounded-xl text-lg font-semibold backdrop-blur-md transition-all text-center">
            Загрузить BOM
          </a>
        </motion.div>
      </div>
    </section>
  );
}
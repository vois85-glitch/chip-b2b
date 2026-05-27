'use client';

import { motion } from 'framer-motion';

export default function Hero() {
  return (
    <section className="relative py-10 md:py-14 flex items-center justify-center overflow-hidden pt-16 bg-section-alt">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary rounded-full blur-[200px] opacity-[0.06] pointer-events-none" />
      
      <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-1 mb-4 border border-[#bbd3ba] rounded-full bg-white/70 backdrop-blur-md text-sm text-primary"
        >
          <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
          Работаем с импортозамещением и санкционными компонентами
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-2xl md:text-4xl font-bold tracking-tight leading-tight mb-3 text-[#121212]"
        >
          Поставка оригинальных{' '}
          <span className="text-primary">электронных компонентов</span>{' '}от 6 дней
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-sm md:text-base text-[#666] max-w-2xl mx-auto mb-4"
        >
          Гарантия оригинала. Постоплата для постоянных клиентов. 
          Подбор аналогов для unavailable позиций. Доставка из Европы и Азии.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-2 justify-center"
        >
          <a href="#bom" className="px-5 py-2.5 bg-primary hover:bg-primary-dark rounded-lg text-sm font-semibold transition-all shadow-lg shadow-primary/25 hover:shadow-primary/40 text-white text-center">
            Получить КП за 2 часа
          </a>
          <a href="#bom" className="px-5 py-2.5 bg-white hover:bg-section border border-[#e8e8e8] rounded-lg text-sm font-semibold backdrop-blur-md transition-all text-[#121212] text-center shadow-sm">
            Загрузить BOM
          </a>
        </motion.div>
      </div>
    </section>
  );
}

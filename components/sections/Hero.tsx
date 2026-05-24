'use client';

import { motion } from 'framer-motion';

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Анимированный зеленый неоновый фон */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-600 rounded-full blur-[200px] opacity-20 pointer-events-none" />
      <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-green-500 rounded-full blur-[180px] opacity-15 pointer-events-none" />
      
      <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-2 mb-8 border border-emerald-800/50 rounded-full bg-emerald-900/20 backdrop-blur-md text-sm text-emerald-300"
        >
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          Поставки из Китая, Тайваня, США и Европы
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
          FPGA, микроконтроллеры, разъемы, БП и промышленная автоматика. 
          Работаем с ВПК, НИИ и производствами. 100% оригинал.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <button className="px-8 py-4 bg-emerald-600 hover:bg-emerald-700 rounded-xl text-lg font-semibold transition-all shadow-lg shadow-emerald-600/25 hover:shadow-emerald-600/40">
            Получить КП
          </button>
          <button className="px-8 py-4 bg-white/5 hover:bg-emerald-900/20 border border-emerald-800/50 rounded-xl text-lg font-semibold backdrop-blur-md transition-all">
            Загрузить BOM
          </button>
        </motion.div>
      </div>
    </section>
  );
}
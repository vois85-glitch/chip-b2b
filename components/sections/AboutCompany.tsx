'use client';

import { motion } from 'framer-motion';

export default function AboutCompany() {
  return (
    <section id="about" className="py-24 px-4 bg-black relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-600 rounded-full blur-[200px] opacity-5 pointer-events-none" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Левая часть - Текст */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              Надежный партнер для <span className="text-emerald-400">промышленности</span> и <span className="text-emerald-400">ВПК</span>
            </h2>
            <p className="text-gray-400 text-lg mb-6 leading-relaxed">
              ChipNet — это команда инженеров и логистов, которые решают самые сложные задачи по поставке электронных компонентов. Мы работаем напрямую с заводами-производителями и авторизованными дистрибьюторами из Китая, Тайваня, США и Европы.
            </p>
            <p className="text-gray-400 text-lg leading-relaxed">
              В условиях санкций мы обеспечиваем непрерывность вашего производства: подбираем аналоги, организуем сложную логистику и гарантируем 100% оригинальность каждой детали.
            </p>
          </motion.div>

          {/* Правая часть - Ключевые факты */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-2 gap-6"
          >
            <div className="bg-emerald-950/10 border border-emerald-900/30 rounded-2xl p-6 backdrop-blur-md">
              <div className="text-4xl font-bold text-emerald-400 mb-2">6+</div>
              <div className="text-gray-300">Дней срок поставки</div>
            </div>
            <div className="bg-emerald-950/10 border border-emerald-900/30 rounded-2xl p-6 backdrop-blur-md">
              <div className="text-4xl font-bold text-emerald-400 mb-2">100%</div>
              <div className="text-gray-300">Гарантия оригинала</div>
            </div>
            <div className="bg-emerald-950/10 border border-emerald-900/30 rounded-2xl p-6 backdrop-blur-md">
              <div className="text-4xl font-bold text-emerald-400 mb-2">4+</div>
              <div className="text-gray-300">Региона поставок</div>
            </div>
            <div className="bg-emerald-950/10 border border-emerald-900/30 rounded-2xl p-6 backdrop-blur-md">
              <div className="text-4xl font-bold text-emerald-400 mb-2">СВП</div>
              <div className="text-gray-300">Собственная лаборатория</div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
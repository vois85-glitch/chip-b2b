'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

export default function ComponentSearch() {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Перенаправляем на форму заявки и подставляем артикул в поле сообщения
      const bomSection = document.getElementById('bom');
      if (bomSection) {
        bomSection.scrollIntoView({ behavior: 'smooth' });
        // Ищем поле "Список компонентов" и вставляем туда артикул
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
        <section id="search" className="py-24 px-4 bg-black relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-600 rounded-full blur-[200px] opacity-10 pointer-events-none" />
      
      <div className="max-w-3xl mx-auto relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-4">Поиск компонентов</h2>
          <p className="text-gray-400 text-lg mb-10">Введите артикул (part number), и мы проверим наличие, подберем аналог или организуем поставку под заказ</p>
          
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4">
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Например: STM32F103C8T6 или LM7805"
              className="flex-grow bg-black/40 border border-emerald-900/50 rounded-xl px-6 py-4 text-white placeholder-gray-600 focus:outline-none focus:border-emerald-500 transition-colors text-lg"
            />
            <button 
              type="submit" 
              className="px-8 py-4 bg-emerald-600 hover:bg-emerald-700 rounded-xl text-lg font-semibold transition-all shadow-lg shadow-emerald-600/25 whitespace-nowrap"
            >
              Найти / Запросить
            </button>
          </form>

          <div className="mt-6 flex flex-wrap justify-center gap-3 text-sm text-gray-500">
            <span>Часто ищут:</span>
            <button onClick={() => setSearchQuery('XC3S200A')} className="hover:text-emerald-400 transition-colors">XC3S200A (FPGA)</button>
            <button onClick={() => setSearchQuery('SN74HC595N')} className="hover:text-emerald-400 transition-colors">SN74HC595N</button>
            <button onClick={() => setSearchQuery('ATMEGA328P')} className="hover:text-emerald-400 transition-colors">ATMEGA328P</button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
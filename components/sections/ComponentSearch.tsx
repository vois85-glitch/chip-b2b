'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

export default function ComponentSearch() {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
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
    <section id="search" className="py-6 px-4 bg-white dark:bg-[#0f1210] relative overflow-hidden">
      <div className="max-w-3xl mx-auto relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-xl md:text-2xl font-bold mb-2 text-[#121212] dark:text-white">Поиск компонентов</h2>
          <p className="text-[#666] dark:text-[#8a9a94] text-sm mb-4">Введите артикул — проверим наличие, подберем аналог или организуем поставку</p>
          
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2">
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Например: STM32F103C8T6 или LM7805"
              className="flex-grow bg-[#fafafa] border border-[#e8e8e8] dark:border-[#2a3530] rounded-lg px-4 py-2.5 text-[#121212] dark:text-white placeholder-[#999] focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-colors text-base"
            />
            <button 
              type="submit" 
              className="px-6 py-2.5 bg-primary hover:bg-primary-dark rounded-lg text-sm font-semibold transition-all shadow-lg shadow-primary/25 whitespace-nowrap text-white"
            >
              Найти / Запросить
            </button>
          </form>

          <div className="mt-3 flex flex-wrap justify-center gap-2 text-xs text-[#757575] dark:text-[#7a8a84]">
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

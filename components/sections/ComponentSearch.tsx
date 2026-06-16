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
 <section id="search" className="py-6 px-4 bg-[#f0f4ee] relative overflow-hidden scroll-mt-28">
 <div className="max-w-3xl mx-auto relative z-10 text-center">
 <motion.div
 initial={{ opacity: 0, y: 20 }}
 whileInView={{ opacity: 1, y: 0 }}
 viewport={{ once: true }}
 >
 <h2 className="text-xl md:text-2xl font-bold mb-2 text-[#121212]">Поиск компонентов</h2>
 <p className="text-[#555] text-sm mb-4">Введите артикул — проверим наличие, подберем аналог или организуем поставку</p>
 
 <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2">
 <input 
 type="text" 
 value={searchQuery}
 onChange={(e) => setSearchQuery(e.target.value)}
 placeholder="Например: STM32F103C8T6 или LM7805"
 className="flex-grow bg-[#eaf0e8] border border-[#e8e8e8] rounded-lg px-4 py-2.5 text-[#121212] placeholder-[#999] focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-colors text-base"
 />
 <button 
 type="submit" 
 className="px-6 py-2.5 bg-primary hover:bg-primary-dark rounded-lg text-sm font-semibold transition-all shadow-lg shadow-primary/25 whitespace-nowrap text-white"
 >
 Найти / Запросить
 </button>
 </form>

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

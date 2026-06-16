'use client';

import { motion } from 'framer-motion';

export default function PriceList() {
 return (
 <section className="py-12 px-4 bg-section border-y border-[#e8e8e8]">
 <div className="max-w-4xl mx-auto text-center">
 <motion.div
 initial={{ opacity: 0, y: 20 }}
 whileInView={{ opacity: 1, y: 0 }}
 viewport={{ once: true }}
 >
 <h2 className="text-2xl md:text-3xl font-bold mb-6 text-[#121212]">Нет времени искать?</h2>
 <p className="text-[#555] text-lg mb-6 max-w-2xl mx-auto">
 Отправьте нам список нужных компонентов (BOM-лист), и мы сами найдем лучшие цены, проверим наличие на складах и выставим коммерческое предложение.
 </p>

 <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 text-left">
 <div className="bg-[#f0f4ee] border border-[#e8e8e8] rounded-xl p-4 shadow-sm">
 <div className="w-10 h-10 mb-3 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
 <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
 </div>
 <h3 className="font-semibold text-lg mb-2 text-[#121212]">Загрузите BOM</h3>
 <p className="text-[#555] text-sm">Excel, CSV или PDF — примем в любом удобном для вас формате</p>
 </div>
 <div className="bg-[#f0f4ee] border border-[#e8e8e8] rounded-xl p-4 shadow-sm">
 <div className="w-10 h-10 mb-3 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
 <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
 </div>
 <h3 className="font-semibold text-lg mb-2 text-[#121212]">Мы ищем и проверяем</h3>
 <p className="text-[#555] text-sm">Подберем оригиналы или аналоги, проверим в лаборатории СВП</p>
 </div>
 <div className="bg-[#f0f4ee] border border-[#e8e8e8] rounded-xl p-4 shadow-sm">
 <div className="w-10 h-10 mb-3 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
 <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
 </div>
 <h3 className="font-semibold text-lg mb-2 text-[#121212]">Получите КП</h3>
 <p className="text-[#555] text-sm">Коммерческое предложение с актуальными ценами и сроками поставки</p>
 </div>
 </div>

 <a href="#bom" className="inline-block px-10 py-5 bg-primary hover:bg-primary-dark rounded-xl text-xl font-semibold transition-all shadow-lg shadow-primary/25 hover:shadow-primary/40 text-white">
 Отправить заявку на расчет
 </a>
 </motion.div>
 </div>
 </section>
 );
}

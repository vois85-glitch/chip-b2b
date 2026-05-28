'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

const categories = [
 {
 title: 'Микроконтроллеры',
 desc: 'STM32, NXP, Renesas, Microchip и другие решения для embedded-разработки и промышленной электроники.',
 href: '/arm-kontrollery',
 icon: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>,
 },
 {
 title: 'FPGA / ПЛИС',
 desc: 'Поставка FPGA и programmable logic решений для телекоммуникаций, автоматизации и высокопроизводительных embedded-систем.',
 href: '/fpga',
 icon: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" /></svg>,
 },
 {
 title: 'MOSFET и IGBT',
 desc: 'Компоненты силовой электроники для промышленных систем, преобразователей и power management решений.',
 href: '/tranzistory',
 icon: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>,
 },
 {
 title: 'DC/DC преобразователи',
 desc: 'Решения для управления питанием, industrial power systems и embedded applications.',
 href: '/pitaniya',
 icon: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>,
 },
 {
 title: 'Sensors',
 desc: 'Датчики для промышленной автоматизации, IoT, automotive и интеллектуальных электронных систем.',
 href: '/datchiki',
 icon: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>,
 },
 {
 title: 'RF Components',
 desc: 'RF-компоненты и решения для беспроводной связи, телекоммуникаций и высокочастотных систем.',
 href: '/optoelektronika',
 icon: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.858 15.355-5.858 21.213 0" /></svg>,
 },
];

export default function PopularCategories() {
 return (
 <section className="py-16 px-4 bg-section">
 <div className="max-w-7xl mx-auto">
 <motion.div
 initial={{ opacity: 0, y: 30 }}
 whileInView={{ opacity: 1, y: 0 }}
 viewport={{ once: true }}
 transition={{ duration: 0.6 }}
 className="text-center mb-10"
 >
 <h2 className="text-3xl md:text-4xl font-bold mb-3 text-[#121212]">Категории</h2>
 <p className="text-[#555] text-base max-w-2xl mx-auto">
 Ключевые направления поставок электронных компонентов
 </p>
 </motion.div>

 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
 {categories.map((cat, index) => (
 <motion.div
 key={cat.href}
 initial={{ opacity: 0, y: 20 }}
 whileInView={{ opacity: 1, y: 0 }}
 viewport={{ once: true }}
 transition={{ duration: 0.4, delay: index * 0.08 }}
 >
 <Link
 href={cat.href}
 className="group block bg-[#f0f4ee] border border-[#e8e8e8] rounded-2xl p-6 hover:border-primary/30 hover:shadow-lg transition-all duration-300 h-full"
 >
 <div className="w-12 h-12 mb-4 bg-primary/10 rounded-xl flex items-center justify-center text-primary group-hover:bg-primary/20 transition-colors">
 {cat.icon}
 </div>
 <h3 className="text-lg font-bold text-[#121212] group-hover:text-primary transition-colors mb-2">{cat.title}</h3>
 <p className="text-[#555] text-sm leading-relaxed">{cat.desc}</p>
 </Link>
 </motion.div>
 ))}
 </div>

 <div className="text-center mt-8">
 <Link
 href="/catalog"
 className="inline-flex items-center gap-2 px-7 py-3 bg-primary hover:bg-primary-dark rounded-xl font-semibold text-white transition-colors text-sm shadow-lg shadow-primary/25 hover:shadow-primary/40"
 >
 Все 2600+ компонентов
 <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
 </Link>
 </div>
 </div>
 </section>
 );
}

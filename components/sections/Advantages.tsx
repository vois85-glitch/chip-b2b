'use client';

import { motion } from 'framer-motion';

const advantages = [
 {
 title: 'Оригинальные компоненты',
 desc: 'Поставляем компоненты от проверенных международных поставщиков с контролем происхождения и минимизацией рисков counterfeit продукции.',
 icon: (
 <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
 <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
 </svg>
 ),
 },
 {
 title: 'Международная логистика',
 desc: 'Организуем поставки электронных компонентов из Европы и Азии с оптимизацией сроков и маршрутов.',
 icon: (
 <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
 <path strokeLinecap="round" strokeLinejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
 </svg>
 ),
 },
 {
 title: 'BOM-комплектация',
 desc: 'Помогаем закрывать спецификации любой сложности: от единичных позиций до комплексных BOM для серийного производства.',
 icon: (
 <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
 <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
 </svg>
 ),
 },
 {
 title: 'Подбор аналогов',
 desc: 'Находим совместимые решения для unavailable, obsolete и hard-to-find компонентов.',
 icon: (
 <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
 <path strokeLinecap="round" strokeLinejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
 </svg>
 ),
 },
 {
 title: 'Инженерная поддержка',
 desc: 'Работаем не только как поставщик, но и как sourcing-партнёр для инженерных и procurement-команд.',
 icon: (
 <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
 <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
 <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
 </svg>
 ),
 },
 {
 title: 'Поставка от 6 дней',
 desc: 'Оптимизированная логистика и международная сеть поставщиков позволяют сокращать сроки поставки критически важных компонентов.',
 icon: (
 <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
 <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
 </svg>
 ),
 },
];

export default function Advantages() {
 return (
 <section className="py-16 px-4 bg-white relative">
 <div className="max-w-7xl mx-auto">
 <motion.div
 initial={{ opacity: 0, y: 30 }}
 whileInView={{ opacity: 1, y: 0 }}
 viewport={{ once: true }}
 transition={{ duration: 0.6 }}
 className="text-center mb-12"
 >
 <h2 className="text-3xl md:text-4xl font-bold mb-3 text-[#121212]">
 Преимущества
 </h2>
 <p className="text-[#555] text-base max-w-2xl mx-auto">
 Почему производители электроники и инженерные команды выбирают Chip-Net
 </p>
 </motion.div>

 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
 {advantages.map((adv, index) => (
 <motion.div
 key={adv.title}
 initial={{ opacity: 0, y: 20 }}
 whileInView={{ opacity: 1, y: 0 }}
 viewport={{ once: true }}
 transition={{ duration: 0.4, delay: index * 0.08 }}
 className="bg-[#f0f4ee] border border-[#e8e8e8] rounded-2xl p-6 hover:border-primary/30 hover:shadow-lg transition-all duration-300 group"
 >
 <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-4 group-hover:bg-primary/20 transition-colors">
 {adv.icon}
 </div>
 <h3 className="text-lg font-bold mb-2 text-[#121212] group-hover:text-primary transition-colors">
 {adv.title}
 </h3>
 <p className="text-[#555] text-sm leading-relaxed">
 {adv.desc}
 </p>
 </motion.div>
 ))}
 </div>
 </div>
 </section>
 );
}

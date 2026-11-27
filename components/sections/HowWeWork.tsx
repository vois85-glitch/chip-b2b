'use client';

import { motion } from 'framer-motion';

const steps = [
 {
 step: '01', title: 'Заявка', desc: 'Оставьте заявку или загрузите BOM',
 icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>,
 },
 {
 step: '02', title: 'Подбор', desc: 'Находим у проверенных поставщиков',
 icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>,
 },
 {
 step: '03', title: 'Проверка', desc: 'Контроль в лаборатории СВП',
 icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>,
 },
 {
 step: '04', title: 'Доставка', desc: 'Логистика от 6 дней с таможней',
 icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>,
 },
 {
 step: '05', title: 'Гарантия', desc: 'Оригинальность, постоплата, документы',
 icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>,
 },
];

export default function HowWeWork() {
 return (
 <section className="py-6 px-4 bg-section relative overflow-hidden">
 <div className="max-w-7xl mx-auto">
 <div className="text-center mb-4">
 <h2 className="text-xl md:text-2xl font-bold mb-2 text-[#121212]">Как мы работаем</h2>
 <p className="text-[#555] text-xs">Прозрачный процесс от заявки до поставки</p>
 </div>

 <div className="grid grid-cols-5 gap-2 relative">
 <div className="hidden md:block absolute top-5 left-[10%] right-[10%] h-0.5 bg-gradient-to-r from-primary/20 via-primary to-primary/20"></div>

 {steps.map((item, index) => (
 <motion.div
 key={item.step}
 initial={{ opacity: 0, y: 30 }}
 whileInView={{ opacity: 1, y: 0 }}
 viewport={{ once: true }}
 transition={{ duration: 0.5, delay: index * 0.15 }}
 className="relative text-center z-10"
 >
 <div className="w-10 h-10 bg-[#f0f4ee] border-2 border-primary/40 rounded-full flex items-center justify-center text-primary mx-auto mb-1 shadow-lg shadow-primary/5">
 {item.icon}
 </div>
 <div className="text-primary font-bold text-xs mb-0.5">Шаг {item.step}</div>
 <h3 className="text-sm font-bold mb-0.5 text-[#121212]">{item.title}</h3>
 <p className="text-[#555] text-[10px] leading-snug">{item.desc}</p>
 </motion.div>
 ))}
 </div>
 </div>
 </section>
 );
}

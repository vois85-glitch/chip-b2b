'use client';

import { motion } from 'framer-motion';

const cases = [
 {
 problem: 'Срочно нужны FPGA Xilinx для срочного заказа',
 solution: 'Нашли аналог Lattice с поддержкой инженеров, доставили из Тайваня за 5 дней. Заказчик успел сдать проект.',
 tag: 'Импортозамещение'
 },
 {
 problem: 'Производство встало из-за отсутствия Texas Instruments',
 solution: 'Организовали поставку оригиналов через Европу с постоплатой. Полная проверка в лаборатории СВП.',
 tag: 'Срочная поставка'
 },
 {
 problem: 'Закупщик нашел чипы в 3 раза дешевле рынка',
 solution: 'Провели экспертизу — выявили контрафакт. Предложили надежного поставщика по рыночной цене с гарантией.',
 tag: 'Контроль качества'
 },
];

export default function Cases() {
 return (
 <section className="py-12 px-4 bg-black relative overflow-hidden">
 <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-emerald-600 rounded-full blur-[200px] opacity-5 pointer-events-none" />

 <div className="max-w-7xl mx-auto relative z-10">
 <div className="text-center mb-8">
 <h2 className="text-2xl md:text-3xl font-bold mb-4">Решенные кейсы</h2>
 <p className="text-gray-400 text-lg">Как мы спасаем производства и экономим время инженеров</p>
 </div>

 <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
 {cases.map((c, index) => (
 <motion.div
 key={index}
 initial={{ opacity: 0, y: 30 }}
 whileInView={{ opacity: 1, y: 0 }}
 viewport={{ once: true }}
 transition={{ duration: 0.5, delay: index * 0.15 }}
 className="bg-[#0a0f0d] border border-emerald-900/30 rounded-xl p-5 flex flex-col"
 >
 <span className="text-xs font-semibold text-emerald-400 bg-emerald-900/20 px-3 py-1 rounded-full self-start mb-6">
 {c.tag}
 </span>
 <div className="mb-6 flex-grow">
 <h3 className="text-lg font-bold mb-2 text-gray-300 flex items-start gap-2">
 <svg className="w-5 h-5 text-red-500 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
 <span>Проблема:</span>
 </h3>
 <p className="text-gray-400 text-sm mb-6 ml-7">{c.problem}</p>

 <h3 className="text-lg font-bold mb-2 text-gray-300 flex items-start gap-2">
 <svg className="w-5 h-5 text-emerald-500 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
 <span>Решение ChipNet:</span>
 </h3>
 <p className="text-gray-400 text-sm ml-7">{c.solution}</p>
 </div>
 </motion.div>
 ))}
 </div>
 </div>
 </section>
 );
}

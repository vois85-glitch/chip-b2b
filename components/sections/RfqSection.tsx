'use client';

import { motion } from 'framer-motion';

export default function RfqSection() {
 return (
 <section className="py-16 px-4 bg-white relative">
 <div className="max-w-5xl mx-auto relative z-10">
 <div className="flex flex-col lg:flex-row items-center gap-10">
 <motion.div
 initial={{ opacity: 0, x: -30 }}
 whileInView={{ opacity: 1, x: 0 }}
 viewport={{ once: true }}
 transition={{ duration: 0.6 }}
 className="flex-1"
 >
 <h2 className="text-3xl md:text-4xl font-bold mb-4 text-[#121212]">
 Поиск и поставка компонентов под ваш запрос
 </h2>
 <p className="text-[#555] text-base md:text-lg leading-relaxed mb-6">
 Подберём оригинальные компоненты, проверим доступность, предложим аналоги и организуем поставку под задачи вашего проекта или производства.
 </p>
 <a
 href="#bom"
 className="inline-flex items-center gap-2 px-7 py-3 bg-primary hover:bg-primary-dark rounded-xl text-sm font-semibold transition-all shadow-lg shadow-primary/25 hover:shadow-primary/40 text-white"
 >
 Отправить RFQ
 <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
 </a>
 </motion.div>

 <motion.div
 initial={{ opacity: 0, x: 30 }}
 whileInView={{ opacity: 1, x: 0 }}
 viewport={{ once: true }}
 transition={{ duration: 0.6, delay: 0.15 }}
 className="flex-1 w-full"
 >
 <div className="bg-[#f0f4ee] border border-[#e8e8e8] rounded-2xl p-6 md:p-8">
 <h3 className="text-lg font-bold mb-4 text-[#121212]">Как работает RFQ</h3>
 <div className="space-y-4">
 {[
 { step: '1', title: 'Отправьте запрос', desc: 'Укажите парт-номер, количество и требования' },
 { step: '2', title: 'Проверка наличия', desc: 'Проверим склады поставщиков и предложим аналоги' },
 { step: '3', title: 'Коммерческое предложение', desc: 'Получите КП с ценами, сроками и условиями' },
 { step: '4', title: 'Поставка', desc: 'Организуем логистику и контроль качества' },
 ].map((item) => (
 <div key={item.step} className="flex items-start gap-3">
 <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center text-primary font-bold text-sm shrink-0">
 {item.step}
 </div>
 <div>
 <h4 className="text-sm font-semibold text-[#121212]">{item.title}</h4>
 <p className="text-xs text-[#555] leading-relaxed">{item.desc}</p>
 </div>
 </div>
 ))}
 </div>
 </div>
 </motion.div>
 </div>
 </div>
 </section>
 );
}

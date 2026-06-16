'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const faqs = [
 {
 q: 'Как вы проверяете оригинальность компонентов?',
 a: 'Мы работаем с проверенными поставщиками и используем процедуры supplier verification и контроля происхождения продукции. Каждый компонент проходит входной контроль для подтверждения подлинности и соответствия спецификации.'
 },
 {
 q: 'Можно ли подобрать аналог unavailable компонента?',
 a: 'Да. Мы помогаем находить совместимые replacement-решения для unavailable и obsolete компонентов. Наши инженеры подбирают аналоги с учётом электрических параметров, типа корпуса и условий применения.'
 },
 {
 q: 'Работаете ли вы с BOM-комплектацией?',
 a: 'Да. Мы закрываем спецификации для контрактных производств, OEM и инженерных проектов. От единичных позиций до комплексных BOM для серийного производства — с оптимизацией по цене и срокам.'
 },
 {
 q: 'Откуда осуществляется поставка?',
 a: 'Основные направления поставок — Европа и Азия. Мы работаем с авторизованными дистрибьюторами и заводами-изготовителями из Китая, Тайваня, Южной Кореи, Германии и других стран.'
 },
 {
 q: 'Какие сроки поставки?',
 a: 'Средний срок поставки начинается от 6 дней и зависит от категории компонентов и доступности. Для срочных заказов возможна приоритетная обработка и ускоренная авиадоставка.'
 },
];

export default function FAQ() {
 const [openIndex, setOpenIndex] = useState<number | null>(null);

 return (
 <section className="py-16 px-4 bg-[#f0f4ee]">
 <div className="max-w-3xl mx-auto">
 <motion.div
 initial={{ opacity: 0, y: 30 }}
 whileInView={{ opacity: 1, y: 0 }}
 viewport={{ once: true }}
 transition={{ duration: 0.6 }}
 className="text-center mb-10"
 >
 <h2 className="text-3xl md:text-4xl font-bold mb-3 text-[#121212]">FAQ</h2>
 <p className="text-[#555] text-base">Ответы на частые вопросы о поставках электронных компонентов</p>
 </motion.div>

 <div className="space-y-3">
 {faqs.map((faq, index) => (
 <motion.div 
 key={index}
 initial={{ opacity: 0, y: 20 }}
 whileInView={{ opacity: 1, y: 0 }}
 viewport={{ once: true }}
 transition={{ delay: index * 0.08 }}
 className="border border-[#e8e8e8] rounded-xl overflow-hidden bg-white shadow-sm"
 >
 <button 
 onClick={() => setOpenIndex(openIndex === index ? null : index)}
 className="w-full flex items-center justify-between p-4 md:p-5 text-left hover:bg-[#f0f4ee] transition-colors"
 >
 <span className="text-sm md:text-base font-semibold text-[#121212] pr-4">{faq.q}</span>
 <span className={`text-primary text-xl transition-transform duration-300 shrink-0 ${openIndex === index ? 'rotate-45' : ''}`}>
 +
 </span>
 </button>
 <AnimatePresence>
 {openIndex === index && (
 <motion.div
 initial={{ height: 0, opacity: 0 }}
 animate={{ height: 'auto', opacity: 1 }}
 exit={{ height: 0, opacity: 0 }}
 transition={{ duration: 0.3 }}
 >
 <div className="px-4 md:px-5 pb-4 md:pb-5 text-[#555] text-sm leading-relaxed border-t border-[#e8e8e8] pt-3">
 {faq.a}
 </div>
 </motion.div>
 )}
 </AnimatePresence>
 </motion.div>
 ))}
 </div>
 </div>
 </section>
 );
}

'use client';

import { motion } from 'framer-motion';

const advantages = [
 {
 title: '100% Оригинал',
 desc: 'Строгий контроль и проверка в лаборатории СВП',
 icon: (
 <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
 <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
 </svg>
 ),
 },
 {
 title: 'Поставки от 6 дней',
 desc: 'Оперативная логистика из Китая, Тайваня, США и Европы',
 icon: (
 <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
 <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
 </svg>
 ),
 },
 {
 title: 'Инженерная поддержка',
 desc: 'Подбор аналогов и кросс-референсов для санкционных компонентов',
 icon: (
 <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
 <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
 <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
 </svg>
 ),
 },
 {
 title: 'Постоплата',
 desc: 'Гибкие условия для постоянных B2B клиентов',
 icon: (
 <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
 <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
 </svg>
 ),
 },
];

export default function Advantages() {
 return (
 <section className="py-6 px-4 bg-section-alt border-y border-[#bbd3ba]">
 <div className="max-w-7xl mx-auto">
 <div className="text-center mb-4">
 <h2 className="text-xl md:text-2xl font-bold mb-2 text-[#121212]">Почему выбирают нас</h2>
 <p className="text-[#555] text-sm">Работаем с промышленными и инженерными компаниями</p>
 </div>

 <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
 {advantages.map((adv, index) => (
 <motion.div
 key={adv.title}
 initial={{ opacity: 0, scale: 0.95 }}
 whileInView={{ opacity: 1, scale: 1 }}
 viewport={{ once: true }}
 transition={{ duration: 0.4, delay: index * 0.1 }}
 className="text-center p-3"
 >
 <div className="w-10 h-10 mx-auto mb-2 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
 {adv.icon}
 </div>
 <h3 className="text-base font-bold mb-1 text-[#121212]">{adv.title}</h3>
 <p className="text-[#555] text-xs leading-relaxed">{adv.desc}</p>
 </motion.div>
 ))}
 </div>
 </div>
 </section>
 );
}

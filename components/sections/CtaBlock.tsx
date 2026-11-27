'use client';

import { motion } from 'framer-motion';

export default function CtaBlock() {
 return (
 <section className="py-16 px-4 bg-[#0c1f1e] relative overflow-hidden" style={{ backgroundImage: 'linear-gradient(to bottom right, #0c1f1e, #0f2e2b, #091b1a)' }}>
 <div className="absolute inset-0 pointer-events-none">
 <div className="absolute top-0 left-1/4 w-[400px] h-[400px] bg-[#02a391]/10 rounded-full blur-[150px]" />
 <div className="absolute bottom-0 right-1/4 w-[300px] h-[300px] bg-[#02a391]/8 rounded-full blur-[120px]" />
 </div>

 <motion.div
 initial={{ opacity: 0, y: 30 }}
 whileInView={{ opacity: 1, y: 0 }}
 viewport={{ once: true }}
 transition={{ duration: 0.6 }}
 className="max-w-3xl mx-auto text-center relative z-10"
 >
 <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
 Нужны компоненты для проекта или производства?
 </h2>
 <p className="text-[#94a3b8] text-base md:text-lg leading-relaxed mb-8 max-w-2xl mx-auto">
 Отправьте запрос, спецификацию или BOM — команда Chip-Net поможет подобрать и организовать поставку необходимых компонентов.
 </p>
 <div className="flex flex-col sm:flex-row gap-3 justify-center">
 <a
 href="#bom"
 className="group px-7 py-3 bg-gradient-to-r from-[#02a391] to-[#04c4a5] hover:from-[#02907f] hover:to-[#03b095] rounded-xl text-sm font-semibold transition-all shadow-lg shadow-[#02a391]/25 hover:shadow-[#02a391]/40 text-white flex items-center justify-center gap-2"
 >
 Получить предложение
 <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
 </a>
 <a
 href="#bom"
 className="px-7 py-3 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-xl text-sm font-semibold backdrop-blur-md transition-all text-white text-center"
 >
 Загрузить BOM
 </a>
 </div>
 </motion.div>
 </section>
 );
}

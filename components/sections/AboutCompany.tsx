'use client';

import { motion } from 'framer-motion';

export default function AboutCompany() {
 return (
 <section id="about" className="py-16 px-4 bg-section-alt relative overflow-hidden">
 <div className="max-w-5xl mx-auto relative z-10">
 <motion.div
 initial={{ opacity: 0, y: 30 }}
 whileInView={{ opacity: 1, y: 0 }}
 viewport={{ once: true }}
 transition={{ duration: 0.6 }}
 className="text-center mb-10"
 >
 <h2 className="text-3xl md:text-4xl font-bold mb-4 text-[#121212]">
 О <span className="text-primary">компании</span>
 </h2>
 <p className="text-[#555] text-lg max-w-3xl mx-auto leading-relaxed">
 Chip-Net — B2B платформа поставки электронных компонентов для производителей электроники, контрактных производств и инженерных команд.
 </p>
 </motion.div>

 <motion.div
 initial={{ opacity: 0, y: 30 }}
 whileInView={{ opacity: 1, y: 0 }}
 viewport={{ once: true }}
 transition={{ duration: 0.6, delay: 0.15 }}
 className="space-y-5 max-w-4xl mx-auto"
 >
 <p className="text-[#444] text-base md:text-lg leading-relaxed">
 Мы специализируемся на поиске и поставке оригинальных микросхем, FPGA, микроконтроллеров и hard-to-find компонентов для задач промышленной электроники, embedded-разработки и серийного производства.
 </p>
 <p className="text-[#444] text-base md:text-lg leading-relaxed">
 Работаем с международной сетью поставщиков из Европы и Азии, обеспечивая контроль происхождения компонентов, проверку поставщиков и сопровождение закупок на всех этапах supply chain.
 </p>
 <p className="text-[#444] text-base md:text-lg leading-relaxed">
 Наша задача — помогать компаниям снижать риски procurement, сокращать lead time и находить решения даже для unavailable и obsolete позиций.
 </p>
 </motion.div>
 </div>
 </section>
 );
}

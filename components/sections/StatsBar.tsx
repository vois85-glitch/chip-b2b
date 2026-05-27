'use client';

import { motion } from 'framer-motion';

const stats = [
  { value: '6+', label: 'Лет на рынке' },
  { value: '24ч', label: 'Ответ на заявку' },
  { value: '100%', label: 'Гарантия оригинала' },
  { value: '500+', label: 'Выполненных заказов' },
];

export default function StatsBar() {
  return (
    <section className="py-16 px-4 bg-section-accent border-y border-[#bbd3ba]">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {stats.map((stat, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="text-center"
            >
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2">{stat.value}</div>
              <div className="text-[#555] text-sm md:text-base uppercase tracking-wider">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

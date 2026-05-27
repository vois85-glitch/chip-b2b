'use client';

import { motion } from 'framer-motion';

const industries = [
  { title: 'Оборонно-промышленный комплекс', desc: 'Поставка санкционных компонентов и аналогов для ВПК', icon: '🛡️' },
  { title: 'Промышленность', desc: 'Автоматизация производств, ПЛК, датчики и приводная техника', icon: '🏭' },
  { title: 'Научные институты (НИИ)', desc: 'Обеспечение опытных образцов и мелких серий уникальными чипами', icon: '🔬' },
  { title: 'Производство электроники', desc: 'Комплектующие для серийного и массового производства плат', icon: '💻' },
  { title: 'Энергетика', desc: 'Силовые модули, реле и блоки питания для энергосистем', icon: '⚡' },
  { title: 'Телекоммуникации', desc: 'RF-компоненты, трансиверы и оборудование связи', icon: '📡' },
];

export default function Industries() {
  return (
    <section className="py-12 px-4 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold mb-4 text-[#121212]">Сферы применения</h2>
          <p className="text-[#666] text-lg">Обеспечиваем компонентами самые требовательные отрасли</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {industries.map((ind, index) => (
            <motion.div 
              key={ind.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="group flex gap-4 p-4 bg-white border border-[#e8e8e8] rounded-2xl hover:bg-section-alt hover:border-primary/30 transition-all duration-300 shadow-sm"
            >
              <div className="text-3xl">{ind.icon}</div>
              <div>
                <h3 className="text-lg font-semibold mb-1 text-[#121212] group-hover:text-primary transition-colors">{ind.title}</h3>
                <p className="text-sm text-[#666] leading-relaxed">{ind.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

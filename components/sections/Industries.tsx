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
    <section className="py-24 px-4 bg-[#050807] relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">Сферы применения</h2>
          <p className="text-gray-400 text-lg">Обеспечиваем компонентами самые требовательные отрасли</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {industries.map((ind, index) => (
            <motion.div 
              key={ind.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="group flex gap-5 p-6 bg-emerald-950/5 border border-emerald-900/20 rounded-2xl hover:bg-emerald-900/10 hover:border-emerald-500/30 transition-all duration-300"
            >
              <div className="text-4xl">{ind.icon}</div>
              <div>
                <h3 className="text-lg font-semibold mb-1 text-white group-hover:text-emerald-400 transition-colors">{ind.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{ind.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
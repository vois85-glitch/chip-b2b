'use client';

import { motion } from 'framer-motion';

const categories = [
  { title: 'FPGA & ПЛИС', desc: 'Xilinx, Intel/Altera, Lattice', icon: '🔲' },
  { title: 'Микроконтроллеры', desc: 'STMicroelectronics, NXP, TI', icon: '🧠' },
  { title: 'Разъемы', desc: 'TE Connectivity, Amphenol, Molex', icon: '🔌' },
  { title: 'Блоки питания', desc: 'AC/DC, DC/DC преобразователи', icon: '⚡' },
  { title: 'Датчики', desc: 'MEMS, IMU, температуры, давления', icon: '📡' },
  { title: 'Силовая электроника', desc: 'IGBT, MOSFET, диоды, драйверы', icon: '🔥' },
  { title: 'Пассивные компоненты', desc: 'Конденсаторы, резисторы, индуктивности', icon: '🔧' },
  { title: 'Промышленная автоматика', desc: 'ПЛК, реле, HMI, моторы', icon: '🏭' },
];

export default function Catalog() {
  return (
    <section id="catalog" className="py-24 px-4 bg-black">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">Каталог компонентов</h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Поставляем оригинальную продукцию от ведущих мировых производителей с полной документацией
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat, index) => (
            <motion.div 
              key={cat.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              className="group relative bg-emerald-950/10 backdrop-blur-md border border-emerald-900/30 rounded-2xl p-6 hover:bg-emerald-900/20 hover:border-emerald-500/50 transition-all duration-300 cursor-pointer"
            >
              <div className="text-4xl mb-4">{cat.icon}</div>
              <h3 className="text-xl font-semibold mb-2 text-white group-hover:text-emerald-400 transition-colors">
                {cat.title}
              </h3>
              <p className="text-sm text-gray-400">{cat.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
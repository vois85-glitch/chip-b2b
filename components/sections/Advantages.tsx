'use client';

import { motion } from 'framer-motion';

const advantages = [
  { title: '100% Оригинал', desc: 'Строгий контроль качества и проверка в собственной лаборатории', icon: '🛡️' },
  { title: 'Поставки от 6 дней', desc: 'Оперативная логистика из Китая, Тайваня, США и Европы', icon: '🚀' },
  { title: 'Инженерная поддержка', desc: 'Подбор аналогов и кросс-референсов для санкционных компонентов', icon: '⚙️' },
  { title: 'Постоплата', desc: 'Гибкие условия для постоянных B2B клиентов', icon: '💼' },
];

export default function Advantages() {
  return (
    <section className="py-24 px-4 bg-[#050505] border-y border-white/5">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">Почему выбирают нас</h2>
          <p className="text-gray-400 text-lg">Работаем с оборонными, промышленными и инженерными компаниями</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {advantages.map((adv, index) => (
            <motion.div 
              key={adv.title}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="text-center p-6"
            >
              <div className="text-5xl mb-6">{adv.icon}</div>
              <h3 className="text-xl font-bold mb-3">{adv.title}</h3>
              <p className="text-gray-400 leading-relaxed">{adv.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
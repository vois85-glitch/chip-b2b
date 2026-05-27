'use client';

import { motion } from 'framer-motion';

const advantages = [
  { title: '100% Оригинал', desc: 'Строгий контроль и проверка в лаборатории СВП', icon: '🛡️' },
  { title: 'Поставки от 6 дней', desc: 'Оперативная логистика из Китая, Тайваня, США и Европы', icon: '🚀' },
  { title: 'Инженерная поддержка', desc: 'Подбор аналогов и кросс-референсов для санкционных компонентов', icon: '⚙️' },
  { title: 'Постоплата', desc: 'Гибкие условия для постоянных B2B клиентов', icon: '💼' },
];

export default function Advantages() {
  return (
    <section className="py-6 px-4 bg-section-alt border-y border-[#bbd3ba]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-4">
          <h2 className="text-xl md:text-2xl font-bold mb-2 text-[#121212]">Почему выбирают нас</h2>
          <p className="text-[#555] text-sm">Работаем с оборонными, промышленными и инженерными компаниями</p>
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
              <div className="text-2xl mb-1">{adv.icon}</div>
              <h3 className="text-base font-bold mb-1 text-[#121212]">{adv.title}</h3>
              <p className="text-[#555] text-xs leading-relaxed">{adv.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

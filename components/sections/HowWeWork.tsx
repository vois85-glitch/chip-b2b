'use client';

import { motion } from 'framer-motion';

const steps = [
  { step: '01', title: 'Заявка', desc: 'Оставьте заявку или загрузите BOM', icon: '📝' },
  { step: '02', title: 'Подбор', desc: 'Находим у проверенных поставщиков', icon: '🔍' },
  { step: '03', title: 'Проверка', desc: 'Контроль в лаборатории СВП', icon: '🛡️' },
  { step: '04', title: 'Доставка', desc: 'Логистика от 6 дней с таможней', icon: '🚀' },
  { step: '05', title: 'Гарантия', desc: 'Оригинальность, постоплата, документы', icon: '✅' },
];

export default function HowWeWork() {
  return (
    <section className="py-6 px-4 bg-section relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-4">
          <h2 className="text-xl md:text-2xl font-bold mb-2 text-[#121212]">Как мы работаем</h2>
          <p className="text-[#555] text-xs">Прозрачный процесс от заявки до поставки</p>
        </div>

        <div className="grid grid-cols-5 gap-2 relative">
          <div className="hidden md:block absolute top-5 left-[10%] right-[10%] h-0.5 bg-gradient-to-r from-primary/20 via-primary to-primary/20"></div>

          {steps.map((item, index) => (
            <motion.div 
              key={item.step}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              className="relative text-center z-10"
            >
              <div className="w-10 h-10 bg-[#f0f4ee] border-2 border-primary/40 rounded-full flex items-center justify-center text-lg mx-auto mb-1 shadow-lg shadow-primary/5">
                {item.icon}
              </div>
              <div className="text-primary font-bold text-xs mb-0.5">Шаг {item.step}</div>
              <h3 className="text-sm font-bold mb-0.5 text-[#121212]">{item.title}</h3>
              <p className="text-[#555] text-[10px] leading-snug">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

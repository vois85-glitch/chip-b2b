'use client';

import { motion } from 'framer-motion';

const steps = [
  { step: '01', title: 'Заявка', desc: 'Вы оставляете заявку на сайте или загружаете BOM-лист', icon: '📝' },
  { step: '02', title: 'Подбор', desc: 'Находим компоненты у проверенных поставщиков по всему миру', icon: '🔍' },
  { step: '03', title: 'Проверка', desc: 'Контроль качества и оригинальности в собственной лаборатории', icon: '🛡️' },
  { step: '04', title: 'Доставка', desc: 'Оперативная логистика от 6 дней с таможенным оформлением', icon: '🚀' },
  { step: '05', title: 'Гарантия', desc: 'Гарантия оригинальности, постоплата и документация', icon: '✅' },
];

export default function HowWeWork() {
  return (
    <section className="py-24 px-4 bg-[#050807] relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">Как мы работаем</h2>
          <p className="text-gray-400 text-lg">Прозрачный процесс от заявки до поставки на ваше производство</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 relative">
          {/* Линия соединяющая шаги (на десктопе) */}
          <div className="hidden md:block absolute top-12 left-[10%] right-[10%] h-0.5 bg-gradient-to-r from-emerald-900 via-emerald-500 to-emerald-900"></div>

          {steps.map((item, index) => (
            <motion.div 
              key={item.step}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              className="relative text-center z-10"
            >
              <div className="w-24 h-24 bg-[#0a0f0d] border-2 border-emerald-500/50 rounded-full flex items-center justify-center text-4xl mx-auto mb-6 shadow-lg shadow-emerald-500/10">
                {item.icon}
              </div>
              <div className="text-emerald-500 font-bold text-sm mb-2">Шаг {item.step}</div>
              <h3 className="text-xl font-bold mb-2">{item.title}</h3>
              <p className="text-gray-400 text-sm">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
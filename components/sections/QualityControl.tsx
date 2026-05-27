'use client';

import { motion } from 'framer-motion';

const steps = [
  { step: '01', title: 'Визуальный осмотр', desc: 'Проверка маркировки, корпуса и выводов под микроскопом.' },
  { step: '02', title: 'Электрический тест', desc: 'Измерение параметров по даташиту на стенде.' },
  { step: '03', title: 'Рентген / Декапсуляция', desc: 'Вскрытие или рентген для подтверждения кристалла.' },
  { step: '04', title: 'Документация', desc: 'Сертификаты соответствия и протоколы проверки.' },
];

export default function QualityControl() {
  return (
    <section className="py-6 px-4 bg-[#f0f4ee]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-4">
          <h2 className="text-xl md:text-2xl font-bold mb-2 text-[#121212]">Собственная лаборатория СВП</h2>
          <p className="text-[#666] text-sm max-w-2xl mx-auto">
            Защищаем ваше производство от контрафакта. Каждый компонент проходит входной контроль.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {steps.map((item, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-[#f0f4ee] border border-[#e8e8e8] rounded-lg p-3 relative overflow-hidden group shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="text-5xl font-bold text-primary/10 absolute top-1 right-2 group-hover:text-primary/20 transition-colors">
                {item.step}
              </div>
              <h3 className="text-base font-bold mb-1 text-[#121212] relative z-10">{item.title}</h3>
              <p className="text-[#666] text-xs relative z-10">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

'use client';

import { motion } from 'framer-motion';

const steps = [
  { step: '01', title: 'Визуальный осмотр', desc: 'Проверка маркировки, корпуса, выводов и следов пайки под микроскопом.' },
  { step: '02', title: 'Электрический тест', desc: 'Измерение электрических параметров по даташиту на стенде.' },
  { step: '03', title: 'Рентген / Декапсуляция', desc: 'Вскрытие корпуса или рентген для подтверждения кристалла (по требованию).' },
  { step: '04', title: 'Документация', desc: 'Предоставление сертификатов соответствия и протоколов проверки.' },
];

export default function QualityControl() {
  return (
    <section className="py-24 px-4 bg-black">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">Собственная лаборатория СВП</h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Защищаем ваше производство от контрафакта. Каждый компонент проходит входной контроль.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((item, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-emerald-950/10 border border-emerald-900/30 rounded-2xl p-6 relative overflow-hidden group"
            >
              <div className="text-6xl font-bold text-emerald-900/30 absolute top-2 right-4 group-hover:text-emerald-800/40 transition-colors">
                {item.step}
              </div>
              <h3 className="text-xl font-bold mb-3 text-white relative z-10">{item.title}</h3>
              <p className="text-gray-400 text-sm relative z-10">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
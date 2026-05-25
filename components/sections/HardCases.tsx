'use client';

import { motion } from 'framer-motion';

const cases = [
  {
    problem: 'Компоненты попали под санкции, производство встало',
    solution: 'Нашли азиатские аналоги с полной совместимостью по даташиту, провели тестирование, запустили производство за 10 дней.',
    tag: 'Импортозамещение'
  },
  {
    problem: 'Срочно нужна партия FPGA для оборонного контракта',
    solution: 'Организовали цепочку поставки через ОАЭ, оформили документацию, доставили под заказ за 6 дней.',
    tag: 'Срочная логистика'
  },
  {
    problem: 'Закупщик нашел чипы на 30% дешевле рынка в интернете',
    solution: 'Провели экспертизу — выявили контрафакт. Поставили клиента на прямые поставки от Ti/ST, защитили от брака.',
    tag: 'Контроль качества'
  },
];

export default function HardCases() {
  return (
    <section className="py-24 px-4 bg-black relative overflow-hidden">
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">Решаем нестандартные задачи</h2>
          <p className="text-gray-400 text-lg">Где другие отказывают — мы находим решение</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {cases.map((c, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              className="bg-[#0a0f0d] border border-emerald-900/30 rounded-2xl p-8 flex flex-col"
            >
              <span className="text-xs font-semibold text-emerald-400 bg-emerald-900/20 px-3 py-1 rounded-full self-start mb-6">
                {c.tag}
              </span>
              <div className="mb-6 flex-grow">
                <h3 className="text-lg font-bold mb-2 text-gray-300 flex items-start gap-2">
                  <span className="text-red-500 text-xl mt-0.5 shrink-0">⚠️</span> 
                  <span>Проблема:</span> 
                </h3>
                <p className="text-gray-400 text-sm mb-6 ml-8">{c.problem}</p>
                
                <h3 className="text-lg font-bold mb-2 text-gray-300 flex items-start gap-2">
                  <span className="text-emerald-500 text-xl mt-0.5 shrink-0">✅</span> 
                  <span>Решение ChipNet:</span>
                </h3>
                <p className="text-gray-400 text-sm ml-8">{c.solution}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
'use client';

import { motion } from 'framer-motion';

const cases = [
  {
    problem: 'Компоненты попали под санкции, производство встало',
    solution: 'Нашли азиатские аналоги с полной совместимостью, провели тестирование, запустили производство за 10 дней.',
    tag: 'Импортозамещение'
  },
  {
    problem: 'Срочно нужна партия FPGA для оборонного контракта',
    solution: 'Организовали цепочку поставки через ОАЭ, оформили документацию, доставили за 6 дней.',
    tag: 'Срочная логистика'
  },
  {
    problem: 'Закупщик нашел чипы на 30% дешевле рынка',
    solution: 'Провели экспертизу — выявили контрафакт. Поставили на прямые поставки от TI/ST, защитили от брака.',
    tag: 'Контроль качества'
  },
];

export default function HardCases() {
  return (
    <section className="py-6 px-4 bg-section relative overflow-hidden">
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-4">
          <h2 className="text-xl md:text-2xl font-bold mb-2 text-[#121212]">Решаем нестандартные задачи</h2>
          <p className="text-[#555] text-sm">Где другие отказывают — мы находим решение</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {cases.map((c, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              className="bg-[#f0f4ee] border border-[#e8e8e8] rounded-lg p-4 flex flex-col shadow-sm hover:shadow-md transition-shadow"
            >
              <span className="text-xs font-semibold text-primary bg-section-alt px-2 py-0.5 rounded-full self-start mb-3">
                {c.tag}
              </span>
              <div className="flex-grow">
                <h3 className="text-sm font-bold mb-1 text-[#333] flex items-start gap-1">
                  <span className="text-danger shrink-0">&#9888;</span> 
                  <span>Проблема:</span> 
                </h3>
                <p className="text-[#555] text-xs mb-3 ml-5">{c.problem}</p>
                
                <h3 className="text-sm font-bold mb-1 text-[#333] flex items-start gap-1">
                  <span className="text-primary shrink-0">&#10003;</span> 
                  <span>Решение ChipNet:</span>
                </h3>
                <p className="text-[#555] text-xs ml-5">{c.solution}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

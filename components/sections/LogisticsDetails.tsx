'use client';

import { motion } from 'framer-motion';

const details = [
  {
    title: 'Таможенное оформление (ВЭД)',
    text: 'Берем на себя растаможку, оформление сертификатов и отказных писем. Клиент получает груз со всеми документами.'
  },
  {
    title: 'Сложные схемы оплаты',
    text: 'Работаем с контрагентами из ОАЭ, Турции, Китая и Тайваня. Принимаем рубли и валюту. Постоплата для постоянных клиентов.'
  },
  {
    title: 'Защита от санкций',
    text: 'Вносим компоненты в перечни Минпромторга. Подбираем полные аналоги (cross-reference) по параметрам и корпусам.'
  },
  {
    title: 'Страхование груза',
    text: 'Все отправления застрахованы. Компенсация 100% стоимости партии при потере или повреждении.'
  },
];

export default function LogisticsDetails() {
  return (
    <section className="py-6 px-4 bg-[#f0f4ee]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-4">
          <h2 className="text-xl md:text-2xl font-bold mb-2 text-[#121212]">Импорт и логистика без рисков</h2>
          <p className="text-[#666] text-sm max-w-2xl mx-auto">
            Поставка электронных компонентов — сложный процесс ВЭД, где мы берем все риски на себя.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {details.map((item, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-[#f0f4ee] border border-[#e8e8e8] rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow"
            >
              <h3 className="text-base font-bold mb-1 text-primary">{item.title}</h3>
              <p className="text-[#666] text-xs leading-relaxed">{item.text}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

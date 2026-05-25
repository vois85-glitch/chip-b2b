'use client';

import { motion } from 'framer-motion';

const details = [
  {
    title: 'Таможенное оформление (ВЭД)',
    text: 'Берем на себя все хлопоты по растаможке. Ввоз по кодам ЕТН ВЭД, оформление сертификатов соответствия и отказных писем. Клиент получает груз на складе в РФ со всеми документами.'
  },
  {
    title: 'Сложные схемы оплаты',
    text: 'Работаем с контрагентами из ОАЭ, Турции, Китая и Тайваня. Принимаем рубли и валюту. Для постоянных клиентов — постоплата по договору.'
  },
  {
    title: 'Защита от санкций',
    text: 'Вносим компоненты в импортозамещающие перечни Минпромторга. Подбираем полные аналоги (cross-reference) по электрическим параметрам и корпусам для отсутствующих позиций.'
  },
  {
    title: 'Страхование груза',
    text: 'Все отправления застрахованы. В случае потери или повреждения на таможне или в пути — компенсация 100% стоимости партии.'
  },
];

export default function LogisticsDetails() {
  return (
    <section className="py-24 px-4 bg-black">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">Импорт и логистика без рисков</h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Поставка электронных компонентов — это не просто покупка. Это сложный процесс ВЭД, где мы берем все риски на себя.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {details.map((item, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-[#0a0f0d] border border-emerald-900/30 rounded-2xl p-8"
            >
              <h3 className="text-xl font-bold mb-4 text-emerald-400">{item.title}</h3>
              <p className="text-gray-400 leading-relaxed">{item.text}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
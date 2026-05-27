'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const faqs = [
  {
    q: 'Как вы гарантируете оригинальность компонентов?',
    a: 'Работаем только с авторизованными дистрибьюторами и заводами. Все партии проходят входной контроль в лаборатории СВП (рентген, декапсуляция, электрическое тестирование).'
  },
  {
    q: 'Работаете ли вы с физическими лицами?',
    a: 'Нет, мы специализируемся на B2B-рынке. Работаем с юрлицами (ООО, АО) и ИП по договору поставки с закрывающими документами.'
  },
  {
    q: 'Какие условия оплаты?',
    a: 'Для постоянных клиентов — постоплата до 30 дней. Для новых — предоплата 50% или 100% в зависимости от суммы и редкости компонентов.'
  },
  {
    q: 'За сколько времени вы даете КП?',
    a: 'Стандартный прайс — 1-2 часа. Заявки на редкие или санкционные компоненты — до 24 часов.'
  },
  {
    q: 'Что если компонент попадет под санкции после оплаты?',
    a: 'Возвращаем средства в полном объеме за 3 рабочих дня, либо бесплатно подбираем функциональный аналог.'
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="py-6 px-4 bg-white">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-4">
          <h2 className="text-xl md:text-2xl font-bold mb-2 text-[#121212]">Частые вопросы</h2>
          <p className="text-[#666] text-sm">Отвечаем на главные опасения инженеров и закупщиков</p>
        </div>

        <div className="space-y-2">
          {faqs.map((faq, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="border border-[#e8e8e8] rounded-lg overflow-hidden bg-white shadow-sm"
            >
              <button 
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full flex items-center justify-between p-3 text-left hover:bg-section transition-colors"
              >
                <span className="text-sm font-semibold text-[#333] pr-4">{faq.q}</span>
                <span className={`text-primary text-xl transition-transform duration-300 ${openIndex === index ? 'rotate-45' : ''}`}>
                  +
                </span>
              </button>
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="px-3 pb-3 text-[#666] text-sm leading-relaxed border-t border-[#e8e8e8] pt-3">
                      {faq.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

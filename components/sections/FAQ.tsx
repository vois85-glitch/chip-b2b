'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const faqs = [
  {
    q: 'Как вы гарантируете оригинальность компонентов?',
    a: 'Мы работаем только с авторизованными дистрибьюторами и заводами-производителями. Все партии проходят входной контроль в собственной лаборатории СВП (рентген, декапсуляция, электрическое тестирование).'
  },
  {
    q: 'Работаете ли вы с физическими лицами?',
    a: 'Нет, мы специализируемся исключительно на B2B-рынке. Мы работаем с юридическими лицами (ООО, АО) и ИП по договору поставки с закрывающими документами.'
  },
  {
    q: 'Какие условия оплаты?',
    a: 'Для постоянных клиентов действует постоплата (отсрочка платежа до 30 дней). Для новых клиентов — предоплата 50% или 100% в зависимости от суммы заказа и редкости компонентов.'
  },
  {
    q: 'За сколько времени вы даете коммерческое предложение?',
    a: 'Стандартный прайс-лист мы присылаем в течение 1-2 часов. Заявки на редкие или санкционные компоненты, требующие поиска аналогов, обрабатываются в течение 24 часов.'
  },
  {
    q: 'Что если компонент попадет под санкции после оплаты?',
    a: 'В случае невозможности поставки мы возвращаем средства в полном объеме в течение 3 рабочих дней, либо бесплатно подбираем функциональный аналог из доступных.'
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="py-24 px-4 bg-[#050807]">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">Частые вопросы</h2>
          <p className="text-gray-400 text-lg">Отвечаем на главные опасения инженеров и закупщиков</p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="border border-emerald-900/30 rounded-2xl overflow-hidden"
            >
              <button 
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full flex items-center justify-between p-6 text-left hover:bg-emerald-900/10 transition-colors"
              >
                <span className="text-lg font-semibold text-gray-200 pr-4">{faq.q}</span>
                <span className={`text-emerald-400 text-2xl transition-transform duration-300 ${openIndex === index ? 'rotate-45' : ''}`}>
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
                    <div className="px-6 pb-6 text-gray-400 leading-relaxed border-t border-emerald-900/20 pt-4">
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
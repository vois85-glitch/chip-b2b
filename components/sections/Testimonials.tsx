'use client';

import { motion } from 'framer-motion';

const testimonials = [
  {
    quote: "Искали редкие ПЛИС для оборонного контракта. ChipNet нашли аналоги и доставили за неделю. Спасли запуск серии.",
    name: "Алексей В.",
    role: "Ведущий инженер, НИИ РЭТ"
  },
  {
    quote: "Работаем по постоплате уже второй год. Всегда честные сроки, ни разу не прислали восстановленных чипов под видом новых.",
    name: "Ирина С.",
    role: "Руководитель закупок, Завод Промэлектроника"
  },
  {
    quote: "Организовали сложную логистику из Тайваня, когда обычные каналы закрылись. Профессионалы своего дела.",
    name: "Дмитрий К.",
    role: "Директор по производству, ТехноСофт"
  },
];

export default function Testimonials() {
  return (
    <section className="py-24 px-4 bg-[#050807]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">Нам доверяют</h2>
          <p className="text-gray-400 text-lg">Отзывы инженеров и руководителей закупок</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              className="bg-black/40 border border-emerald-900/30 rounded-2xl p-8"
            >
              <svg className="w-8 h-8 text-emerald-600 mb-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/>
              </svg>
              <p className="text-gray-300 mb-6 leading-relaxed italic">{t.quote}</p>
              <div>
                <p className="text-white font-semibold">{t.name}</p>
                <p className="text-gray-500 text-sm">{t.role}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
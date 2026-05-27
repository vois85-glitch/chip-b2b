'use client';

import { motion } from 'framer-motion';

const advantages = [
  { icon: '📋', text: 'Первая поставка без предоплаты' },
  { icon: '💰', text: 'Гарантия лучшей цены' },
  { icon: '🚚', text: 'Доставка за наш счёт' },
  { icon: '🏗️', text: 'Многолетний опыт работы' },
  { icon: '⚡', text: 'Минимальные сроки доставки' },
  { icon: '💳', text: 'Гибкая система оплаты заказа' },
  { icon: '🔍', text: 'Доставляем оригиналы и аналоги' },
  { icon: '🛡️', text: 'Гарантия 12 месяцев' },
  { icon: '📦', text: 'Более 50 млн наименований компонентов' },
];

export default function AboutCompany() {
  return (
    <section id="about" className="py-24 px-4 bg-section-alt relative overflow-hidden">
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Title */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-4 text-[#121212] dark:text-white">
            О <span className="text-primary">компании</span>
          </h2>
          <p className="text-[#666] dark:text-[#8a9a94] text-lg max-w-2xl mx-auto leading-relaxed">
            ChipNet — надёжный поставщик электронных компонентов для российского промышленного производства и оборонно-промышленного комплекса
          </p>
        </motion.div>

        {/* Main Tasks */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-20"
        >
          <h3 className="text-2xl md:text-3xl font-bold text-[#121212] dark:text-white mb-8 text-center">
            Основные задачи компании
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="bg-[#f0f4ee] border border-[#e8e8e8] dark:border-[#2a3530] rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                  <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <span className="text-primary font-semibold text-lg">Передовые технологии</span>
              </div>
              <p className="text-[#555] text-base leading-relaxed">
                Предоставить российским разработчикам доступ к передовым технологиям и решениям мировых лидеров в производстве электронных компонентов, обеспечивая при этом полный спектр необходимых услуг: техническую поддержку, информационные материалы и техническую документацию.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="bg-[#f0f4ee] border border-[#e8e8e8] dark:border-[#2a3530] rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                  <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
                <span className="text-primary font-semibold text-lg">Стабильные поставки</span>
              </div>
              <p className="text-[#555] text-base leading-relaxed">
                Гарантировать российским производителям электроники стабильные поставки компонентов и электротехнических изделий в требуемых объёмах, организуя как разовые, так и регулярные поставки, с возможностью подбора аналогов и эквивалентных решений.
              </p>
            </motion.div>
          </div>
        </motion.div>

        {/* Advantages */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h3 className="text-2xl md:text-3xl font-bold text-[#121212] dark:text-white mb-10 text-center">
            Наши преимущества
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {advantages.map((adv, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
                className="flex items-center gap-4 bg-[#f0f4ee] border border-[#e8e8e8] dark:border-[#2a3530] rounded-xl p-5 shadow-sm hover:shadow-md hover:border-primary/30 transition-all"
              >
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-xl shrink-0">
                  {adv.icon}
                </div>
                <span className="text-[#333] dark:text-[#c4d0ca] font-medium text-[15px] leading-snug">
                  {adv.text}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

'use client';

import { motion } from 'framer-motion';

const tasks = [
  {
    title: 'Передовые технологии',
    description:
      'Предоставить российским разработчикам доступ к передовым технологиям и решениям мировых лидеров в производстве электронных компонентов, обеспечивая при этом полный спектр необходимых услуг: техническую поддержку, информационные материалы и техническую документацию.',
    icon: (
      <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
      </svg>
    ),
  },
  {
    title: 'Стабильные поставки',
    description:
      'Гарантировать российским производителям электроники стабильные поставки компонентов и электротехнических изделий в требуемых объёмах, организуя как разовые, так и регулярные поставки, с возможностью подбора аналогов и эквивалентных решений.',
    icon: (
      <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
      </svg>
    ),
  },
];

const advantages = [
  { emoji: '📋', title: 'Первая поставка без предоплаты' },
  { emoji: '💰', title: 'Гарантия лучшей цены' },
  { emoji: '🚚', title: 'Доставка за наш счёт' },
  { emoji: '🏗️', title: 'Многолетний опыт работы' },
  { emoji: '⚡', title: 'Минимальные сроки доставки' },
  { emoji: '💳', title: 'Гибкая система оплаты заказа' },
  { emoji: '🔍', title: 'Доставляем оригиналы и аналоги' },
  { emoji: '🛡️', title: 'Гарантия 12 месяцев' },
  { emoji: '📦', title: 'Более 50 млн наименований компонентов' },
];

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.08 },
  }),
};

export default function AboutCompany() {
  return (
    <section id="about" className="py-16 px-4 bg-section-alt relative overflow-hidden scroll-mt-28">
      <div className="max-w-6xl mx-auto relative z-10">
        {/* Заголовок секции */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-[#121212]">
            О <span className="text-primary">компании</span>
          </h2>
          <p className="text-[#555] text-base md:text-lg max-w-3xl mx-auto leading-relaxed">
            ChipNet — надёжный поставщик электронных компонентов для российского промышленного производства и оборонно-промышленного комплекса
          </p>
        </motion.div>

        {/* Блок: Основные задачи компании */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-12"
        >
          <h3 className="text-2xl md:text-3xl font-bold text-center mb-10 text-[#121212]">
            Основные задачи компании
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {tasks.map((task, i) => (
              <motion.div
                key={task.title}
                custom={i}
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="bg-white border border-[#e8e8e8] rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 bg-primary rounded-full flex items-center justify-center shrink-0 shadow-lg">
                    {task.icon}
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-primary mb-2">{task.title}</h4>
                    <p className="text-[#555] text-base leading-relaxed">{task.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Блок: Наши преимущества */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h3 className="text-2xl md:text-3xl font-bold text-center mb-10 text-[#121212]">
            Наши преимущества
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {advantages.map((adv, i) => (
              <motion.div
                key={adv.title}
                custom={i}
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="flex items-center gap-4 bg-[#f0f4ee] border border-[#e8e8e8] rounded-xl p-5 shadow-sm hover:shadow-md hover:border-primary/30 transition-all"
              >
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-xl shrink-0">
                  {adv.emoji}
                </div>
                <span className="text-[#333] font-medium text-[15px] leading-snug">{adv.title}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

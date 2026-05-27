'use client';

import { motion } from 'framer-motion';

export default function PriceList() {
  return (
    <section className="py-12 px-4 bg-section border-y border-[#e8e8e8]">
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-[#121212]">Нет времени искать?</h2>
          <p className="text-[#666] text-lg mb-6 max-w-2xl mx-auto">
            Отправьте нам список нужных компонентов (BOM-лист), и мы сами найдем лучшие цены, проверим наличие на складах и выставим коммерческое предложение.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 text-left">
            <div className="bg-[#f0f4ee] border border-[#e8e8e8] rounded-xl p-4 shadow-sm">
              <div className="text-3xl mb-3">📄</div>
              <h3 className="font-semibold text-lg mb-2 text-[#121212]">Загрузите BOM</h3>
              <p className="text-[#666] text-sm">Excel, CSV или PDF — примем в любом удобном для вас формате</p>
            </div>
            <div className="bg-[#f0f4ee] border border-[#e8e8e8] rounded-xl p-4 shadow-sm">
              <div className="text-3xl mb-3">🔍</div>
              <h3 className="font-semibold text-lg mb-2 text-[#121212]">Мы ищем и проверяем</h3>
              <p className="text-[#666] text-sm">Подберем оригиналы или аналоги, проверим в лаборатории СВП</p>
            </div>
            <div className="bg-[#f0f4ee] border border-[#e8e8e8] rounded-xl p-4 shadow-sm">
              <div className="text-3xl mb-3">💰</div>
              <h3 className="font-semibold text-lg mb-2 text-[#121212]">Получите КП</h3>
              <p className="text-[#666] text-sm">Коммерческое предложение с актуальными ценами и сроками поставки</p>
            </div>
          </div>

          <a href="#bom" className="inline-block px-10 py-5 bg-primary hover:bg-primary-dark rounded-xl text-xl font-semibold transition-all shadow-lg shadow-primary/25 hover:shadow-primary/40 text-white">
            Отправить заявку на расчет
          </a>
        </motion.div>
      </div>
    </section>
  );
}

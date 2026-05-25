'use client';

import { motion } from 'framer-motion';

export default function PriceList() {
  return (
    <section className="py-24 px-4 bg-[#050807] border-y border-emerald-900/20">
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-6">Нет времени искать?</h2>
          <p className="text-gray-400 text-lg mb-10 max-w-2xl mx-auto">
            Отправьте нам список нужных компонентов (BOM-лист), и мы сами найдем лучшие цены, проверим наличие на складах и выставим коммерческое предложение.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 text-left">
            <div className="bg-emerald-950/10 border border-emerald-900/30 rounded-2xl p-6">
              <div className="text-3xl mb-3">📄</div>
              <h3 className="font-semibold text-lg mb-2">Загрузите BOM</h3>
              <p className="text-gray-400 text-sm">Excel, CSV или PDF — примем в любом удобном для вас формате</p>
            </div>
            <div className="bg-emerald-950/10 border border-emerald-900/30 rounded-2xl p-6">
              <div className="text-3xl mb-3">🔍</div>
              <h3 className="font-semibold text-lg mb-2">Мы ищем и проверяем</h3>
              <p className="text-gray-400 text-sm">Подберем оригиналы или аналоги, проверим в лаборатории СВП</p>
            </div>
            <div className="bg-emerald-950/10 border border-emerald-900/30 rounded-2xl p-6">
              <div className="text-3xl mb-3">💰</div>
              <h3 className="font-semibold text-lg mb-2">Получите КП</h3>
              <p className="text-gray-400 text-sm">Коммерческое предложение с актуальными ценами и сроками поставки</p>
            </div>
          </div>

          <a href="#bom" className="inline-block px-10 py-5 bg-emerald-600 hover:bg-emerald-700 rounded-xl text-xl font-semibold transition-all shadow-lg shadow-emerald-600/25 hover:shadow-emerald-600/40">
            Отправить заявку на расчет
          </a>
        </motion.div>
      </div>
    </section>
  );
}
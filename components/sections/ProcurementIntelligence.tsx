'use client';

import { motion } from 'framer-motion';

interface IntelItem {
  label: string;
  value: string;
  trend?: 'up' | 'down' | 'stable' | 'alert';
  description: string;
  category?: string;
  source?: string;
  lastUpdated?: string;
}

const intelData: IntelItem[] = [
  {
    label: 'STM32F4 Lead Time',
    value: '10–14 дн.',
    trend: 'down',
    description: 'Снижение сроков поставки за счёт расширения EU-канала. Серия F4 доступна из складов Германии и Китая. Средний lead time сократился на 18% за последний квартал.',
    category: 'Микроконтроллеры',
    source: 'Данные поставщиков EU + Азия',
    lastUpdated: 'Май 2026',
  },
  {
    label: 'Xilinx UltraScale+ Аллокация',
    value: 'Ограничена',
    trend: 'alert',
    description: 'Кристаллы Kintex UltraScale+ в дефиците. Аллокации для серийных объёмов требуют бронирования за 16+ недель. Рекомендуем переход на Artix-7 или Spartan-7 для проектов с гибкими требованиями.',
    category: 'FPGA',
    source: 'Авторизованные дистрибьюторы',
    lastUpdated: 'Май 2026',
  },
  {
    label: 'TI LDO Доступность',
    value: 'Стабильная',
    trend: 'stable',
    description: 'Серии TPS7A, TPS7B доступны из стандартных каналов. Lead time 8–12 дней для MOQ от 100 шт. Цены стабильны, прогноз без изменений до Q3 2026.',
    category: 'Питание',
    source: 'Direct channel + дистрибьюторы',
    lastUpdated: 'Май 2026',
  },
  {
    label: 'EOL Компоненты',
    value: 'Подбор аналогов',
    trend: 'up',
    description: 'Растущий запрос на кросс-референсы для EOL-позиций. За последний квартал обработано 340+ запросов на подбор аналогов. Инженерная верификация совместимости перед поставкой включена в стандартный процесс.',
    category: 'Аналоги',
    source: 'Внутренняя статистика ChipNet',
    lastUpdated: 'Май 2026',
  },
];

const shortageAlerts = [
  { part: 'XC7K325T-2FFG900C', status: 'Дефицит', eta: 'Q3 2026', alternative: 'XC7K160T-2FFG676C', risk: 'high', impact: 'Серийное производство', recommendation: 'Забронировать аллокацию или мигрировать на Artix-7' },
  { part: 'STM32H743ZIT6', status: 'Ограничено', eta: '4–6 нед.', alternative: 'STM32H750VBT6', risk: 'medium', impact: 'Новые проекты', recommendation: 'Использовать STM32H750 как cost-effective alternative' },
  { part: 'TPS5450DDAR', status: 'Дефицит', eta: 'Q2 2026', alternative: 'LM2596T-5.0', risk: 'high', impact: 'BOM-позиции', recommendation: 'Замена на LM2596 с проверкой thermal footprint' },
  { part: 'MSP430F5529IPNR', status: 'Ограничено', eta: '6–8 нед.', alternative: 'MSP430FR5994', risk: 'medium', impact: 'Пром. автоматика', recommendation: 'Рассмотреть MSP430FR с FRAM для новых проектов' },
];

// Market analytics section
const marketAnalytics = [
  { metric: 'Средний lead time MCU', current: '12 дн.', previous: '16 дн.', change: '-25%', direction: 'improving' },
  { metric: 'FPGA sourcing difficulty', current: '6.2/10', previous: '5.8/10', change: '+7%', direction: 'worsening' },
  { metric: 'LDO availability index', current: '94%', previous: '92%', change: '+2%', direction: 'improving' },
  { metric: 'EOL replacement rate', current: '87%', previous: '82%', change: '+5%', direction: 'improving' },
];

// China alternatives intelligence
const chinaAlternatives = [
  { original: 'STM32F103C8T6', alternative: 'GD32F103C8T6', brand: 'GigaDevice', compatibility: 'Pin-to-pin', verified: true, note: 'HAL совместим, отличия в USB и CAN' },
  { original: 'STM32F407VGT6', alternative: 'GD32F407VET6', brand: 'GigaDevice', compatibility: 'Высокая', verified: true, note: 'Проверены peripheral и timing' },
  { original: 'STM32F030F4P6', alternative: 'HK32F030F4P6', brand: 'HKMicro', compatibility: 'Pin-to-pin', verified: true, note: 'Drop-in replacement, проверен в серийном производстве' },
];

export default function ProcurementIntelligence() {
  return (
    <section className="py-12 px-4 bg-[#f8faf7]" data-section="procurement-intelligence">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 1, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="flex items-center gap-2 mb-2">
            <svg className="w-5 h-5 text-[#02a391]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <h2 className="text-xl md:text-2xl font-bold text-[#121212]">Procurement Intelligence</h2>
            <span className="text-[10px] px-2 py-0.5 bg-[#02a391]/10 text-[#02a391] rounded-full font-semibold">Market Data</span>
          </div>
          <p className="text-[#666] text-sm max-w-3xl">
            Аналитика рынка компонентов: lead time, аллокации, EOL-статус, China alternatives и рекомендации по закупкам. Обновляется на основе данных поставщиков и внутренней статистики ChipNet.
          </p>
        </motion.div>

        {/* Intelligence Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {intelData.map((item, idx) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 1, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              className="bg-white border border-[#e8e8e8] rounded-xl p-5 hover:border-[#02a391]/30 hover:shadow-md transition-all"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-[#757575] font-medium">{item.category}</span>
                {item.trend && (
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                    item.trend === 'down' ? 'bg-emerald-50 text-emerald-700' :
                    item.trend === 'up' ? 'bg-blue-50 text-blue-700' :
                    item.trend === 'stable' ? 'bg-gray-50 text-gray-700' :
                    'bg-amber-50 text-amber-700'
                  }`}>
                    {item.trend === 'down' ? '↓ Снижение' :
                     item.trend === 'up' ? '↑ Рост' :
                     item.trend === 'stable' ? '→ Стабильно' :
                     '⚠ Внимание'}
                  </span>
                )}
              </div>
              <h3 className="text-sm font-bold text-[#121212] mb-1">{item.label}</h3>
              <div className="text-lg font-bold text-[#02a391] mb-2">{item.value}</div>
              <p className="text-xs text-[#666] leading-relaxed mb-2">{item.description}</p>
              <div className="flex items-center justify-between text-[9px] text-[#999] pt-2 border-t border-[#f0f0f0]">
                <span>{item.source}</span>
                <span>{item.lastUpdated}</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Market Analytics Bar */}
        <motion.div
          initial={{ opacity: 1, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="bg-white border border-[#e8e8e8] rounded-xl p-5 mb-8"
        >
          <div className="flex items-center gap-2 mb-4">
            <svg className="w-4 h-4 text-[#02a391]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <h3 className="text-sm font-bold text-[#121212]">Market Analytics Index</h3>
            <span className="text-[9px] px-2 py-0.5 bg-[#02a391]/10 text-[#02a391] rounded-full">Q2 2026</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {marketAnalytics.map((ma) => (
              <div key={ma.metric} className="bg-[#f8faf7] rounded-lg px-4 py-3 border border-[#e8e8e8]">
                <div className="text-[10px] text-[#757575] mb-1">{ma.metric}</div>
                <div className="flex items-end gap-2">
                  <span className="text-base font-bold text-[#121212]">{ma.current}</span>
                  <span className={`text-[10px] font-semibold mb-0.5 ${
                    ma.direction === 'improving' ? 'text-emerald-600' : 'text-red-600'
                  }`}>
                    {ma.change}
                  </span>
                </div>
                <div className="text-[9px] text-[#999]">Пред.: {ma.previous}</div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Shortage Alerts — Enhanced */}
        <motion.div
          initial={{ opacity: 1, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="bg-white border border-amber-200 rounded-xl overflow-hidden mb-8"
        >
          <div className="bg-amber-50 border-b border-amber-200 px-5 py-3 flex items-center gap-2">
            <svg className="w-4 h-4 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <h3 className="text-sm font-bold text-amber-800">Shortage Alerts — Компоненты в дефиците</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#e8e8e8]">
                  <th className="text-left py-3 px-5 text-[#666] font-medium">Компонент</th>
                  <th className="text-left py-3 px-5 text-[#666] font-medium">Статус</th>
                  <th className="text-left py-3 px-5 text-[#666] font-medium">Прогноз</th>
                  <th className="text-left py-3 px-5 text-[#666] font-medium">Аналог</th>
                  <th className="text-left py-3 px-5 text-[#666] font-medium hidden md:table-cell">Влияние</th>
                  <th className="text-left py-3 px-5 text-[#666] font-medium hidden lg:table-cell">Рекомендация</th>
                </tr>
              </thead>
              <tbody>
                {shortageAlerts.map((alert) => (
                  <tr key={alert.part} className="border-b border-[#f0f0f0] hover:bg-amber-50/30 transition-colors">
                    <td className="py-3 px-5 font-mono font-semibold text-[#121212]">{alert.part}</td>
                    <td className="py-3 px-5">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        alert.risk === 'high' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                      }`}>{alert.status}</span>
                    </td>
                    <td className="py-3 px-5 text-[#666]">{alert.eta}</td>
                    <td className="py-3 px-5">
                      <a href={`/analog/${alert.part.toLowerCase()}`} className="text-[#02a391] hover:underline font-mono">{alert.alternative}</a>
                    </td>
                    <td className="py-3 px-5 text-[#666] text-xs hidden md:table-cell">{alert.impact}</td>
                    <td className="py-3 px-5 text-[#555] text-xs hidden lg:table-cell">{alert.recommendation}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-5 py-3 bg-amber-50/50 border-t border-amber-100 text-xs text-amber-700">
            Данные основаны на анализе каналов поставок и внутренней статистике ChipNet. Для получения актуальной аллокации по конкретной позиции отправьте RFQ.
          </div>
        </motion.div>

        {/* China Alternatives Intelligence */}
        <motion.div
          initial={{ opacity: 1, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="bg-white border border-[#02a391]/15 rounded-xl overflow-hidden"
        >
          <div className="bg-[#02a391]/5 border-b border-[#02a391]/10 px-5 py-3 flex items-center gap-2">
            <svg className="w-4 h-4 text-[#02a391]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
            </svg>
            <h3 className="text-sm font-bold text-[#121212]">China Alternatives — Проверенные кросс-референсы</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#e8e8e8]">
                  <th className="text-left py-3 px-5 text-[#666] font-medium">Оригинал</th>
                  <th className="text-left py-3 px-5 text-[#666] font-medium">Аналог (China)</th>
                  <th className="text-left py-3 px-5 text-[#666] font-medium">Производитель</th>
                  <th className="text-left py-3 px-5 text-[#666] font-medium">Совместимость</th>
                  <th className="text-left py-3 px-5 text-[#666] font-medium">Верификация</th>
                  <th className="text-left py-3 px-5 text-[#666] font-medium">Примечание</th>
                </tr>
              </thead>
              <tbody>
                {chinaAlternatives.map((ca) => (
                  <tr key={ca.alternative} className="border-b border-[#f0f0f0] hover:bg-[#f8faf7] transition-colors">
                    <td className="py-3 px-5 font-mono font-semibold text-[#121212]">{ca.original}</td>
                    <td className="py-3 px-5">
                      <a href={`/component/${ca.alternative.toLowerCase()}`} className="text-[#02a391] hover:underline font-mono">{ca.alternative}</a>
                    </td>
                    <td className="py-3 px-5 text-[#555]">{ca.brand}</td>
                    <td className="py-3 px-5">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                        ca.compatibility === 'Pin-to-pin' ? 'bg-emerald-50 text-emerald-700' : 'bg-blue-50 text-blue-700'
                      }`}>{ca.compatibility}</span>
                    </td>
                    <td className="py-3 px-5">
                      {ca.verified ? (
                        <span className="flex items-center gap-1 text-emerald-600 text-xs font-semibold">
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                          Verified
                        </span>
                      ) : (
                        <span className="text-amber-600 text-xs">Pending</span>
                      )}
                    </td>
                    <td className="py-3 px-5 text-[#555] text-xs">{ca.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-5 py-3 bg-[#02a391]/5 border-t border-[#02a391]/10 text-xs text-[#02a391]">
            Все China alternatives проверены в лаборатории СВП. Рекомендуем инженерную верификацию для каждого конкретного применения.
          </div>
        </motion.div>
      </div>
    </section>
  );
}

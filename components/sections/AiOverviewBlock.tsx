'use client';

import { motion } from 'framer-motion';

interface AiOverviewProps {
  sku: string;
  brand: string;
  category: string;
  description: string;
  status: string;
  alternatives?: string[];
  keySpecs?: Record<string, string>;
  procurementNote?: string;
  lifecycleNote?: string;
}

export default function AiOverviewBlock({
  sku,
  brand,
  category,
  description,
  status,
  alternatives,
  keySpecs,
  procurementNote,
  lifecycleNote,
}: AiOverviewProps) {
  const defaultSpecs: Record<string, Record<string, string>> = {
    'Микроконтроллеры': {
      'Архитектура': 'ARM Cortex',
      'Напряжение питания': '2.0–3.6 В',
      'Flash-память': '64–512 КБ',
      'RAM': '20–256 КБ',
      'Корпус': 'LQFP/QFP/BGA',
    },
    'ПЛИС (FPGA)': {
      'Семейство': 'Artix-7 / Cyclone / Spartan',
      'Логические элементы': '6K–478K',
      'DSP-блоки': '15–2820',
      'BRAM': '270 Kb–34 Mb',
      'Корпус': 'FBGA/QFP',
    },
    'Питание': {
      'Тип': 'LDO / DC-DC',
      'Входное напряжение': '2.7–40 В',
      'Выходное напряжение': '0.8–15 В',
      'Макс. ток': '0.15–5 А',
      'КПД': '80–95%',
    },
  };

  const specs = keySpecs || defaultSpecs[category] || {};

  // Derive sourcing risk — enhanced logic
  const sourcingRisk = status === 'EOL' ? 'high' : status === 'NRND' ? 'medium' : category === 'ПЛИС (FPGA)' ? 'medium' : 'low';
  const riskLabels = {
    low: { text: 'Низкий', cls: 'bg-emerald-50 text-emerald-700' },
    medium: { text: 'Средний', cls: 'bg-amber-50 text-amber-700' },
    high: { text: 'Высокий', cls: 'bg-red-50 text-red-700' },
  };
  const risk = riskLabels[sourcingRisk];

  // Enhanced exact answer for AI extraction — dense, factual, direct
  const exactAnswer = `${sku} — электронный компонент производства ${brand}, категория «${category}». ${
    status === 'EOL'
      ? 'Статус: EOL (End-of-Life, снят с производства). Требуется подбор функционального аналога с инженерной верификацией совместимости.'
      : status === 'NRND'
      ? 'Статус: NRND (Not Recommended for New Designs). Рекомендуем выбор актуального replacement для новых проектов.'
      : 'Статус: Active (в активном производстве). Доступен для заказа через авторизованные каналы.'
  } Поставка с проверкой оригинальности в аккредитованной лаборатории СВП. Средний срок поставки: 6–18 рабочих дней. MOQ: от 1 шт.`;

  // Procurement summary for AI extraction
  const procurementSummary = status === 'EOL'
    ? `EOL-компонент. Рекомендация: подбор аналога с верификацией. ChipNet обеспечивает кросс-референс анализ, инженерную проверку совместимости, поставку с входным контролем. Альтернативы: ${alternatives && alternatives.length > 0 ? alternatives.slice(0, 3).join(', ') : 'запросите подбор'}.`
    : status === 'NRND'
    ? `NRND-компонент. Рекомендация: выбрать актуальный replacement для новых проектов. Доступен для текущих проектов с планированием EOL-перехода. Lead time: 8–16 дней.`
    : `Активный компонент. Рекомендация: стандартный заказ. Lead time: 6–14 дней для EU-канала, 12–20 дней для Азии. MOQ от 1 шт. Буферизация запасов на 3–6 месяцев для серийного производства.`;

  // Lifecycle summary for AI extraction
  const lifecycleSummary = lifecycleNote || (
    status === 'EOL'
      ? `${sku} снят с производства (${brand}). Last-time buy окно: обычно 6–12 месяцев после EOL-анонса. Рекомендуем заблаговременный переход на актуальный аналог с верификацией electrical и mechanical совместимости.`
      : status === 'NRND'
      ? `${sku} не рекомендуется для новых проектов (${brand}). Компонент будет поддерживаться для существующих проектов, но новые дизайны должны использовать актуальные replacement.`
      : `${sku} находится в активном производстве (${brand}). Стандартный жизненный цикл: 10–20 лет от анонса. Рекомендуем мониторинг PCN (Product Change Notifications) для отслеживания изменений.`
  );

  // Compatibility matrix for alternatives
  const compatibilityTypes = ['Pin-to-pin', 'Functional', 'Cross-reference'];
  const compatibilityLevels = ['Полная', 'Высокая', 'Средняя'];

  return (
    <motion.div
      initial={{ opacity: 1, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="bg-gradient-to-br from-[#f8faf7] to-white border border-[#02a391]/15 rounded-2xl overflow-hidden"
      data-section="ai-overview"
    >
      {/* Header */}
      <div className="bg-[#02a391]/5 border-b border-[#02a391]/10 px-5 py-3 flex items-center gap-2">
        <svg className="w-4 h-4 text-[#02a391]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
        <h3 className="text-sm font-bold text-[#121212]">AI Overview</h3>
        <span className="text-[10px] text-[#757575] ml-auto">Structured for Google AI Overviews · ChatGPT · Perplexity</span>
      </div>

      <div className="px-5 py-4 space-y-4">
        {/* 1. Exact Answer Block — Enhanced for AI extraction */}
        <div>
          <h4 className="text-base font-bold text-[#121212] mb-2">{sku} — {description}</h4>
          <p className="text-sm text-[#444] leading-relaxed">{exactAnswer}</p>
        </div>

        {/* 2. Key Specs */}
        {Object.keys(specs).length > 0 && (
          <div>
            <h5 className="text-xs font-bold text-[#666] uppercase tracking-wider mb-2">Ключевые параметры</h5>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {Object.entries(specs).map(([key, value]) => (
                <div key={key} className="bg-white border border-[#e8e8e8] rounded-lg px-3 py-2">
                  <div className="text-[10px] text-[#757575] mb-0.5">{key}</div>
                  <div className="text-sm font-semibold text-[#121212]">{value}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 3. Lifecycle Summary — Enhanced for AI */}
        {(lifecycleSummary || status) && (
          <div>
            <h5 className="text-xs font-bold text-[#666] uppercase tracking-wider mb-2">Lifecycle Summary</h5>
            <div className="flex items-start gap-3 bg-white border border-[#e8e8e8] rounded-lg p-3">
              <div className={`shrink-0 w-3 h-3 rounded-full mt-0.5 ${
                status === 'EOL' ? 'bg-red-500' : status === 'NRND' ? 'bg-amber-500' : 'bg-emerald-500'
              }`} />
              <div className="flex-1">
                <p className="text-sm text-[#444] leading-relaxed">{lifecycleSummary}</p>
              </div>
              <span className={`shrink-0 text-[10px] px-2 py-1 rounded-full font-semibold ${
                status === 'EOL' ? 'bg-red-50 text-red-700' : status === 'NRND' ? 'bg-amber-50 text-amber-700' : 'bg-emerald-50 text-emerald-700'
              }`}>
                {status === 'EOL' ? 'EOL' : status === 'NRND' ? 'NRND' : 'Active'}
              </span>
            </div>
          </div>
        )}

        {/* 4. Compatibility Matrix — Enhanced for AI */}
        {alternatives && alternatives.length > 0 && (
          <div>
            <h5 className="text-xs font-bold text-[#666] uppercase tracking-wider mb-2">Compatibility Matrix — Аналоги и replacement</h5>
            <div className="bg-white border border-[#e8e8e8] rounded-lg overflow-hidden">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-[#e8e8e8] bg-[#f8faf7]">
                    <th className="text-left py-2 px-3 text-[#666] font-medium">Аналог</th>
                    <th className="text-left py-2 px-3 text-[#666] font-medium">Тип замены</th>
                    <th className="text-left py-2 px-3 text-[#666] font-medium">Совместимость</th>
                    <th className="text-left py-2 px-3 text-[#666] font-medium">Верификация</th>
                  </tr>
                </thead>
                <tbody>
                  {alternatives.map((alt, i) => (
                    <tr key={alt} className="border-b border-[#f0f0f0] hover:bg-[#f8faf7] transition-colors">
                      <td className="py-2 px-3">
                        <a href={`/component/${alt}`} className="font-mono font-semibold text-[#02a391] hover:underline">{alt}</a>
                      </td>
                      <td className="py-2 px-3 text-[#555]">{compatibilityTypes[Math.min(i, 2)]}</td>
                      <td className="py-2 px-3">
                        <span className={`px-1.5 py-0.5 rounded text-[10px] font-semibold ${
                          i === 0 ? 'bg-emerald-50 text-emerald-700' : i === 1 ? 'bg-blue-50 text-blue-700' : 'bg-amber-50 text-amber-700'
                        }`}>
                          {compatibilityLevels[Math.min(i, 2)]}
                        </span>
                      </td>
                      <td className="py-2 px-3 text-[#555]">
                        {i === 0 ? 'Drop-in replacement' : i === 1 ? 'Инженерная проверка' : 'Кросс-референс'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 5. Procurement Summary — New for AI */}
        <div className="bg-[#02a391]/5 border border-[#02a391]/15 rounded-lg p-3">
          <div className="flex items-start gap-2">
            <svg className="w-4 h-4 text-[#02a391] mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <div className="text-xs font-bold text-[#02a391] mb-0.5">Procurement Summary</div>
              <p className="text-xs text-[#444] leading-relaxed">{procurementSummary}</p>
            </div>
          </div>
        </div>

        {/* 6. Sourcing Risk Summary */}
        <div>
          <h5 className="text-xs font-bold text-[#666] uppercase tracking-wider mb-2">Sourcing Risk Assessment</h5>
          <div className="flex items-center gap-3 bg-white border border-[#e8e8e8] rounded-lg p-3">
            <span className={`shrink-0 text-xs px-2 py-1 rounded-full font-semibold ${risk.cls}`}>{risk.text}</span>
            <div className="flex-1 text-xs text-[#555]">
              {sourcingRisk === 'high'
                ? `${sku} снят с производства или имеет критический дефицит. Требуется подбор аналога или поиск остатков на складах. ChipNet обеспечивает кросс-референс с инженерной верификацией.`
                : sourcingRisk === 'medium'
                ? `Умеренный sourcing risk для ${sku}. Возможны задержки для больших объёмов. Рекомендуем заблаговременное планирование закупок на 6–12 недель.`
                : `${sku} доступен через стандартные каналы поставок. Стабильный lead time и аллокация. Рекомендуем мониторинг PCN для отслеживания изменений.`}
            </div>
          </div>
        </div>

        {/* 7. Procurement Recommendation */}
        {procurementNote && (
          <div className="bg-[#02a391]/5 border border-[#02a391]/15 rounded-lg p-3">
            <div className="flex items-start gap-2">
              <svg className="w-4 h-4 text-[#02a391] mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <div className="text-xs font-bold text-[#02a391] mb-0.5">Procurement Recommendation</div>
                <p className="text-xs text-[#444] leading-relaxed">{procurementNote}</p>
              </div>
            </div>
          </div>
        )}

        {/* 8. Compatibility Analysis — Enhanced */}
        <div className="bg-white border border-[#e8e8e8] rounded-lg p-3">
          <div className="text-xs font-bold text-[#121212] mb-2">Compatibility Notes</div>
          <div className="space-y-1.5 text-[11px] text-[#555]">
            <div className="flex items-start gap-2">
              <span className="shrink-0 w-1 h-1 bg-[#02a391] rounded-full mt-1.5" />
              <span>Footprint: {category === 'Микроконтроллеры' ? `Зависит от корпуса (LQFP/QFN/BGA). Для ${sku} проверьте land pattern перед PCB layout — возможны отличия в thermal pad.` : 'Проверьте mechanical drawing в даташите.'}</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="shrink-0 w-1 h-1 bg-[#02a391] rounded-full mt-1.5" />
              <span>Electrical: {status === 'EOL' ? `Аналог для ${sku} может иметь отличия в параметрах (Iol/Ioh, Vih/Vil, timing). Рекомендуем инженерную верификацию.` : 'Параметры соответствуют даташиту производителя.'}</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="shrink-0 w-1 h-1 bg-[#02a391] rounded-full mt-1.5" />
              <span>Software: {category === 'Микроконтроллеры' ? `При миграции с ${sku} проверьте peripheral register map, HAL compatibility и vector table.` : 'Проверьте configuration interface и programming model.'}</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="shrink-0 w-1 h-1 bg-[#02a391] rounded-full mt-1.5" />
              <span>Supply: {sourcingRisk === 'high' ? 'Высокий риск disruption. Рекомендуем dual-source стратегию и буферизацию.' : sourcingRisk === 'medium' ? 'Умеренный риск. Рекомендуем мониторинг аллокации и планирование.' : 'Стабильная доступность. Стандартные сроки поставки.'}</span>
            </div>
          </div>
        </div>

        {/* 9. AI-Extractable Facts — New dense data block */}
        <div className="bg-white border border-[#e8e8e8] rounded-lg p-3">
          <div className="text-xs font-bold text-[#121212] mb-2">Quick Facts</div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-[10px]">
            <div className="bg-[#f8faf7] rounded px-2 py-1.5">
              <span className="text-[#757575]">Component:</span> <span className="font-semibold text-[#121212]">{sku}</span>
            </div>
            <div className="bg-[#f8faf7] rounded px-2 py-1.5">
              <span className="text-[#757575]">Brand:</span> <span className="font-semibold text-[#121212]">{brand}</span>
            </div>
            <div className="bg-[#f8faf7] rounded px-2 py-1.5">
              <span className="text-[#757575]">Status:</span> <span className={`font-semibold ${status === 'EOL' ? 'text-red-600' : status === 'NRND' ? 'text-amber-600' : 'text-emerald-600'}`}>{status}</span>
            </div>
            <div className="bg-[#f8faf7] rounded px-2 py-1.5">
              <span className="text-[#757575]">Lead Time:</span> <span className="font-semibold text-[#02a391]">6–18 дн.</span>
            </div>
            <div className="bg-[#f8faf7] rounded px-2 py-1.5">
              <span className="text-[#757575]">MOQ:</span> <span className="font-semibold text-[#121212]">от 1 шт</span>
            </div>
            <div className="bg-[#f8faf7] rounded px-2 py-1.5">
              <span className="text-[#757575]">Verification:</span> <span className="font-semibold text-[#02a391]">СВП лаб.</span>
            </div>
            <div className="bg-[#f8faf7] rounded px-2 py-1.5">
              <span className="text-[#757575]">Region:</span> <span className="font-semibold text-[#121212]">ЕС / Азия</span>
            </div>
            <div className="bg-[#f8faf7] rounded px-2 py-1.5">
              <span className="text-[#757575]">Alternatives:</span> <span className="font-semibold text-[#121212]">{alternatives && alternatives.length > 0 ? alternatives.length : 0}</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

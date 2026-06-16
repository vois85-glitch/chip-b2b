import Link from 'next/link';

type Urgency = 'standard' | 'urgent' | 'critical';

interface ProcurementWidgetProps {
  category: string;
  urgency: Urgency;
  recommendations: string[];
}

const tiers = [
  {
    key: 'standard' as const,
    title: 'Стандартная поставка',
    timeline: '6-14 дней',
    priceNote: 'Оптимальная цена',
    modifier: '',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    dotColor: 'bg-emerald-500',
    barColor: 'bg-emerald-400',
    barWidth: 'w-1/3',
  },
  {
    key: 'urgent' as const,
    title: 'Срочная поставка',
    timeline: '3-7 дней',
    priceNote: 'Надбавка',
    modifier: '+15-30%',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    dotColor: 'bg-amber-500',
    barColor: 'bg-amber-400',
    barWidth: 'w-2/3',
  },
  {
    key: 'critical' as const,
    title: 'Критическая поставка',
    timeline: '1-3 дня',
    priceNote: 'Надбавка',
    modifier: '+40-80%',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
      </svg>
    ),
    dotColor: 'bg-red-500',
    barColor: 'bg-red-400',
    barWidth: 'w-full',
  },
];

export default function ProcurementWidget({ category, urgency, recommendations }: ProcurementWidgetProps) {
  const urgencyIndex = tiers.findIndex((t) => t.key === urgency);

  return (
    <div className="rounded-2xl border border-[#d4ddd2] bg-gradient-to-br from-[#f0f4ee] to-white overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-[#d4ddd2] bg-[#f0f4ee]">
        <h3 className="text-lg font-bold text-[#121212]">
          Варианты поставки: {category}
        </h3>
        <p className="text-xs text-[#555] mt-1">
          Выберите оптимальный вариант под ваши сроки и бюджет
        </p>
      </div>

      {/* Tiers */}
      <div className="p-6 space-y-4">
        {tiers.map((tier, idx) => {
          const isActive = idx === urgencyIndex;
          const isHighlighted = idx <= urgencyIndex;

          return (
            <div
              key={tier.key}
              className={`rounded-xl border p-4 transition-colors ${
                isActive
                  ? 'border-primary/40 bg-primary/5 ring-1 ring-primary/20'
                  : isHighlighted
                    ? 'border-[#d4ddd2] bg-white'
                    : 'border-[#e8e8e8] bg-[#fafafa] opacity-60'
              }`}
            >
              <div className="flex items-start gap-3">
                {/* Icon with dot */}
                <div className="relative shrink-0">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    isActive ? 'bg-primary/10 text-primary' : 'bg-[#f0f4ee] text-[#555]'
                  }`}>
                    {tier.icon}
                  </div>
                  <span className={`absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-white ${tier.dotColor}`} />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className={`text-sm font-semibold ${isActive ? 'text-primary' : 'text-[#121212]'}`}>
                      {tier.title}
                    </h4>
                    {tier.modifier && (
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                        tier.key === 'critical'
                          ? 'bg-red-100 text-red-700'
                          : 'bg-amber-100 text-amber-700'
                      }`}>
                        {tier.modifier}
                      </span>
                    )}
                  </div>

                  {/* Timeline bar */}
                  <div className="mt-2 flex items-center gap-2">
                    <span className="text-xs text-[#555] w-16 shrink-0">{tier.timeline}</span>
                    <div className="flex-1 h-1.5 bg-[#e8e8e8] rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${tier.barColor} ${tier.barWidth} transition-all`} />
                    </div>
                  </div>

                  <p className="text-[11px] text-[#555] mt-1">
                    {tier.key === 'critical' && 'Ограниченный складской остаток'}
                    {tier.key === 'urgent' && 'Ускоренная логистика из наличия'}
                    {tier.key === 'standard' && tier.priceNote}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recommendations */}
      {recommendations.length > 0 && (
        <div className="px-6 pb-4">
          <p className="text-xs text-[#555] mb-2">Рекомендуемые аналоги:</p>
          <div className="flex flex-wrap gap-1.5">
            {recommendations.map((rec) => (
              <Link
                key={rec}
                href={`/component/${rec}`}
                className="text-xs px-2.5 py-1 rounded-full bg-[#f0f4ee] border border-[#d4ddd2] text-[#121212] hover:bg-primary/10 hover:border-primary/30 hover:text-primary transition-colors"
              >
                {rec}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* CTA */}
      <div className="px-6 pb-6">
        <Link
          href="/#bom"
          className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-primary hover:bg-primary-dark rounded-xl text-sm font-semibold transition-all shadow-lg shadow-primary/25 hover:shadow-primary/40 text-white"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Запросить КП
        </Link>
      </div>
    </div>
  );
}

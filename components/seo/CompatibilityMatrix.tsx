import Link from 'next/link';

type Compatibility = 'pin-to-pin' | 'functional' | 'parametric';

interface CompatibilityRow {
  original: string;
  analog: string;
  compatibility: Compatibility;
  score: number;
  href: string;
}

interface CompatibilityMatrixProps {
  title: string;
  rows: CompatibilityRow[];
}

const compatibilityConfig: Record<Compatibility, { label: string; bgColor: string; textColor: string; borderColor: string }> = {
  'pin-to-pin': {
    label: 'Pin-to-pin 100%',
    bgColor: 'bg-emerald-50',
    textColor: 'text-emerald-700',
    borderColor: 'border-emerald-200',
  },
  functional: {
    label: 'Функциональный аналог',
    bgColor: 'bg-amber-50',
    textColor: 'text-amber-700',
    borderColor: 'border-amber-200',
  },
  parametric: {
    label: 'Параметрический аналог',
    bgColor: 'bg-orange-50',
    textColor: 'text-orange-700',
    borderColor: 'border-orange-200',
  },
};

function getScoreColor(score: number): string {
  if (score >= 90) return 'bg-emerald-400';
  if (score >= 70) return 'bg-amber-400';
  return 'bg-orange-400';
}

export default function CompatibilityMatrix({ title, rows }: CompatibilityMatrixProps) {
  return (
    <div className="rounded-2xl border border-[#d4ddd2] bg-white overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-[#d4ddd2] bg-[#f0f4ee]">
        <h3 className="text-lg font-bold text-[#121212]">{title}</h3>
        <p className="text-xs text-[#555] mt-1">
          Таблица совместимости аналогов для замены компонентов
        </p>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#e8e8e8] bg-[#fafafa]">
              <th className="text-left px-4 py-3 font-semibold text-[#121212] whitespace-nowrap">
                Оригинал
              </th>
              <th className="text-left px-4 py-3 font-semibold text-[#121212] whitespace-nowrap">
                Аналог
              </th>
              <th className="text-left px-4 py-3 font-semibold text-[#121212] whitespace-nowrap">
                Совместимость
              </th>
              <th className="text-left px-4 py-3 font-semibold text-[#121212] whitespace-nowrap min-w-[140px]">
                Оценка
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, idx) => {
              const compat = compatibilityConfig[row.compatibility];
              const clampedScore = Math.max(0, Math.min(100, row.score));

              return (
                <tr
                  key={`${row.original}-${row.analog}`}
                  className={`border-b border-[#f0f0f0] hover:bg-[#f0f4ee]/50 transition-colors ${
                    idx % 2 === 1 ? 'bg-[#fafafa]' : ''
                  }`}
                >
                  <td className="px-4 py-3 font-mono text-[#121212] whitespace-nowrap">
                    {row.original}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <Link
                      href={row.href}
                      className="font-mono text-primary hover:text-primary-dark hover:underline transition-colors"
                    >
                      {row.analog}
                    </Link>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-medium border ${compat.bgColor} ${compat.textColor} ${compat.borderColor}`}>
                      {compat.label}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 bg-[#e8e8e8] rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${getScoreColor(clampedScore)}`}
                          style={{ width: `${clampedScore}%` }}
                        />
                      </div>
                      <span className="text-xs font-medium text-[#555] w-8 text-right">
                        {clampedScore}%
                      </span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Footer note */}
      <div className="px-6 py-3 bg-[#fafafa] border-t border-[#e8e8e8]">
        <p className="text-[11px] text-[#555]">
          * Оценка совместимости основана на технической документации. Рекомендуем подтвердить замену у наших инженеров.
        </p>
      </div>
    </div>
  );
}

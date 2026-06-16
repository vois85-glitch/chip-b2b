import Link from 'next/link';

type UrgencyLevel = 'high' | 'medium' | 'low';

interface UrgencyBlockProps {
  level: UrgencyLevel;
  message: string;
  ctaText?: string;
  ctaHref?: string;
}

const urgencyConfig: Record<UrgencyLevel, {
  label: string;
  dotColor: string;
  pulseColor: string;
  bgColor: string;
  borderColor: string;
  textColor: string;
}> = {
  high: {
    label: 'Критический дефицит',
    dotColor: 'bg-red-500',
    pulseColor: 'bg-red-400',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
    textColor: 'text-red-800',
  },
  medium: {
    label: 'Ограниченная доступность',
    dotColor: 'bg-amber-500',
    pulseColor: 'bg-amber-400',
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-200',
    textColor: 'text-amber-800',
  },
  low: {
    label: 'Стабильная поставка',
    dotColor: 'bg-emerald-500',
    pulseColor: 'bg-emerald-400',
    bgColor: 'bg-emerald-50',
    borderColor: 'border-emerald-200',
    textColor: 'text-emerald-800',
  },
};

export default function UrgencyBlock({ level, message, ctaText, ctaHref }: UrgencyBlockProps) {
  const config = urgencyConfig[level];
  const showCta = ctaText && ctaHref;

  return (
    <div className={`rounded-2xl border ${config.borderColor} ${config.bgColor} p-5`}>
      <div className="flex items-start gap-3">
        {/* Pulsing dot */}
        <div className="relative shrink-0 mt-0.5">
          <span className={`absolute inline-flex h-3 w-3 rounded-full ${config.pulseColor} opacity-75 animate-ping`} />
          <span className={`relative inline-flex h-3 w-3 rounded-full ${config.dotColor}`} />
        </div>

        <div className="flex-1 min-w-0">
          {/* Label */}
          <p className={`text-sm font-semibold ${config.textColor}`}>
            {config.label}
          </p>

          {/* Message */}
          <p className="text-sm text-[#555] mt-1 leading-relaxed">
            {message}
          </p>

          {/* CTA */}
          {showCta && (
            <Link
              href={ctaHref!}
              className="inline-flex items-center gap-1.5 mt-3 text-xs font-semibold px-4 py-2 rounded-lg bg-primary hover:bg-primary-dark text-white transition-all shadow-sm shadow-primary/20"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              {ctaText}
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

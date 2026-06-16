import Link from 'next/link';

type AvailabilityStatus = 'in-stock' | 'under-order' | 'eol' | 'limited';
type Region = 'eu' | 'asia' | 'global';

interface AvailabilityIndicatorProps {
  status: AvailabilityStatus;
  leadTime?: string;
  region?: Region;
}

const statusConfig: Record<AvailabilityStatus, { label: string; dotColor: string; bgColor: string; textColor: string; borderColor: string }> = {
  'in-stock': {
    label: 'В наличии',
    dotColor: 'bg-emerald-500',
    bgColor: 'bg-emerald-50',
    textColor: 'text-emerald-700',
    borderColor: 'border-emerald-200',
  },
  'under-order': {
    label: 'Под заказ',
    dotColor: 'bg-amber-500',
    bgColor: 'bg-amber-50',
    textColor: 'text-amber-700',
    borderColor: 'border-amber-200',
  },
  eol: {
    label: 'EOL',
    dotColor: 'bg-red-500',
    bgColor: 'bg-red-50',
    textColor: 'text-red-700',
    borderColor: 'border-red-200',
  },
  limited: {
    label: 'Ограничено',
    dotColor: 'bg-orange-500',
    bgColor: 'bg-orange-50',
    textColor: 'text-orange-700',
    borderColor: 'border-orange-200',
  },
};

const regionConfig: Record<Region, { emoji: string; label: string }> = {
  eu: { emoji: '🇪🇺', label: 'EU' },
  asia: { emoji: '🌏', label: 'Asia' },
  global: { emoji: '🌐', label: 'Global' },
};

export default function AvailabilityIndicator({ status, leadTime, region }: AvailabilityIndicatorProps) {
  const config = statusConfig[status];
  const regionInfo = region ? regionConfig[region] : null;

  const leadTimeText = (() => {
    if (!leadTime) return null;
    if (status === 'eol') return 'Последние партии';
    if (status === 'under-order') return `Срок: ${leadTime}`;
    return leadTime;
  })();

  return (
    <div className="inline-flex flex-wrap items-center gap-1.5">
      <span
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${config.bgColor} ${config.textColor} ${config.borderColor}`}
      >
        <span className={`w-1.5 h-1.5 rounded-full ${config.dotColor}`} />
        {config.label}
      </span>

      {leadTimeText && (
        <span className="text-[11px] text-[#555] leading-none">
          {leadTimeText}
        </span>
      )}

      {regionInfo && (
        <Link
          href="/import-komponentov"
          className="inline-flex items-center gap-0.5 text-[11px] text-[#555] hover:text-primary transition-colors"
          title={`Регион поставки: ${regionInfo.label}`}
        >
          <span>{regionInfo.emoji}</span>
          <span>{regionInfo.label}</span>
        </Link>
      )}
    </div>
  );
}

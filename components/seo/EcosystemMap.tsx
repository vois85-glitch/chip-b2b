import Link from 'next/link';

type HubType = 'stm32' | 'fpga' | 'ti' | 'xilinx';
type ItemType = 'mcu' | 'fpga' | 'analog' | 'power' | 'sensor';

interface EcosystemItem {
  name: string;
  type: ItemType;
  href: string;
}

interface EcosystemMapProps {
  hub: HubType;
  items: EcosystemItem[];
}

const hubLabels: Record<HubType, string> = {
  stm32: 'STM32',
  fpga: 'FPGA',
  ti: 'Texas Instruments',
  xilinx: 'Xilinx',
};

const typeConfig: Record<ItemType, { color: string; bgColor: string; borderColor: string; label: string }> = {
  mcu: { color: 'text-blue-700', bgColor: 'bg-blue-50', borderColor: 'border-blue-200', label: 'МК' },
  fpga: { color: 'text-purple-700', bgColor: 'bg-purple-50', borderColor: 'border-purple-200', label: 'ПЛИС' },
  analog: { color: 'text-emerald-700', bgColor: 'bg-emerald-50', borderColor: 'border-emerald-200', label: 'Аналог' },
  power: { color: 'text-orange-700', bgColor: 'bg-orange-50', borderColor: 'border-orange-200', label: 'Питание' },
  sensor: { color: 'text-teal-700', bgColor: 'bg-teal-50', borderColor: 'border-teal-200', label: 'Датчик' },
};

// Positions for satellite nodes in a radial layout
function getSatellitePosition(index: number, total: number): { x: number; y: number } {
  const angle = (2 * Math.PI * index) / total - Math.PI / 2;
  const radius = 42; // percentage from center
  return {
    x: 50 + radius * Math.cos(angle),
    y: 50 + radius * Math.sin(angle),
  };
}

export default function EcosystemMap({ hub, items }: EcosystemMapProps) {
  const hubLabel = hubLabels[hub];

  return (
    <section className="py-8">
      <h2 className="text-2xl md:text-3xl font-bold text-[#121212] mb-2">
        Экосистема {hubLabel}
      </h2>
      <p className="text-sm text-[#555] mb-6 max-w-2xl">
        ChipNet покрывает полный цикл поставки компонентов экосистемы {hubLabel} — от подбора и проверки аналогов до логистики и контроля качества.
      </p>

      {/* Constellation map */}
      <div className="relative w-full max-w-xl mx-auto aspect-square">
        {/* Connection lines (SVG) */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
          {items.map((item, idx) => {
            const pos = getSatellitePosition(idx, items.length);
            return (
              <line
                key={`line-${item.name}`}
                x1="50"
                y1="50"
                x2={String(pos.x)}
                y2={String(pos.y)}
                stroke="#d4ddd2"
                strokeWidth="0.3"
                strokeDasharray="1,1"
              />
            );
          })}
        </svg>

        {/* Central hub node */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
          <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-primary/10 border-2 border-primary flex items-center justify-center shadow-lg shadow-primary/20">
            <span className="text-primary font-bold text-xs md:text-sm text-center leading-tight px-1">
              {hubLabel}
            </span>
          </div>
        </div>

        {/* Satellite items */}
        {items.map((item, idx) => {
          const pos = getSatellitePosition(idx, items.length);
          const config = typeConfig[item.type];

          return (
            <Link
              key={item.name}
              href={item.href}
              className="absolute z-10 -translate-x-1/2 -translate-y-1/2 group"
              style={{
                left: `${pos.x}%`,
                top: `${pos.y}%`,
              }}
            >
              <div className={`flex flex-col items-center gap-0.5 transition-transform group-hover:scale-110`}>
                <div className={`w-14 h-14 md:w-16 md:h-16 rounded-full border ${config.bgColor} ${config.borderColor} flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow`}>
                  <span className={`text-[10px] md:text-xs font-medium ${config.color} text-center leading-tight px-1 line-clamp-2`}>
                    {item.name}
                  </span>
                </div>
                <span className={`text-[9px] md:text-[10px] font-medium ${config.color} opacity-70`}>
                  {config.label}
                </span>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap justify-center gap-3 mt-6">
        {Object.entries(typeConfig).map(([key, config]) => (
          <div key={key} className="flex items-center gap-1.5">
            <span className={`w-3 h-3 rounded-full ${config.bgColor} border ${config.borderColor}`} />
            <span className="text-[11px] text-[#555]">{config.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

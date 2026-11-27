// components/ui/BrandLogo.tsx
// SVG-логотипы брендов электронных компонентов.
// Каждый логотип — стилизованный SVG с фирменными цветами бренда.
// Для неизвестных брендов — fallback на инициалы в цветном квадрате.
'use client';

import { ReactNode } from 'react';

type Props = {
  name: string;
  slug: string;
  className?: string;
  size?: number;
};

type LogoConfig = {
  // Цвета фирменного стиля бренда
  bg?: string;       // фон
  fg: string;        // основной цвет (foreground)
  accent?: string;   // акцентный цвет
  // Тип рендера:
  // 'text' — короткое имя бренда на фоне
  // 'abbr' — аббревиатура (1-4 буквы)
  // 'custom' — уникальный SVG (см. customRender)
  type: 'text' | 'abbr' | 'custom';
  abbr?: string;     // для type='abbr'
  text?: string;     // для type='text' (короткое имя)
};

// Конфигурация для топ-38 брендов каталога chip-net.ru
// Цвета приблизительные, но узнаваемые.
const BRAND_CONFIG: Record<string, LogoConfig> = {
  'texas-instruments': {
    type: 'custom', fg: '#CC0000', bg: '#ffffff',
  },
  'stmicroelectronics': {
    type: 'custom', fg: '#03234B', bg: '#3CB4E6',
  },
  'infineon': {
    type: 'custom', fg: '#006B3C', bg: '#ffffff',
  },
  'nxp': {
    type: 'custom', fg: '#ffffff', bg: '#7AB800',
  },
  'microchip': {
    type: 'custom', fg: '#ffffff', bg: '#0068B5',
  },
  'onsemi': {
    type: 'custom', fg: '#ffffff', bg: '#00A14B',
  },
  'analog-devices': {
    type: 'custom', fg: '#002249', bg: '#ffffff',
  },
  'xilinx': {
    type: 'custom', fg: '#ffffff', bg: '#E31E24',
  },
  'altera': {
    type: 'custom', fg: '#ffffff', bg: '#0071C5',
  },
  'lattice': {
    type: 'custom', fg: '#ffffff', bg: '#A4123F',
  },
  'renesas': {
    type: 'abbr', abbr: 'RZ', fg: '#ffffff', bg: '#1A1A1A',
  },
  'murata': {
    type: 'custom', fg: '#ffffff', bg: '#CC0000',
  },
  'tdk': {
    type: 'custom', fg: '#ffffff', bg: '#00529B',
  },
  'samsung-electro': {
    type: 'custom', fg: '#ffffff', bg: '#1428A0',
  },
  'kemet': {
    type: 'custom', fg: '#ffffff', bg: '#00563F',
  },
  'vishay': {
    type: 'custom', fg: '#ffffff', bg: '#00529B',
  },
  'broadcom': {
    type: 'custom', fg: '#ffffff', bg: '#CC092F',
  },
  'yageo': {
    type: 'custom', fg: '#ffffff', bg: '#003D7E',
  },
  'molex': {
    type: 'custom', fg: '#ffffff', bg: '#003087',
  },
  'te-connectivity': {
    type: 'custom', fg: '#ffffff', bg: '#1A4690',
  },
  'amphenol': {
    type: 'custom', fg: '#ffffff', bg: '#003DA5',
  },
  'bourns': {
    type: 'custom', fg: '#ffffff', bg: '#5A2914',
  },
  'littelfuse': {
    type: 'custom', fg: '#ffffff', bg: '#E03C31',
  },
  'mean-well': {
    type: 'custom', fg: '#ffffff', bg: '#005F2F',
  },
  'rohm': {
    type: 'abbr', abbr: 'ROHM', fg: '#ffffff', bg: '#00205B',
  },
  'panasonic': {
    type: 'custom', fg: '#ffffff', bg: '#005BAB',
  },
  'toshiba': {
    type: 'custom', fg: '#ffffff', bg: '#CC0000',
  },
  'diodes-inc': {
    type: 'abbr', abbr: 'DI', fg: '#ffffff', bg: '#0072CE',
  },
  'wurth-elektronik': {
    type: 'custom', fg: '#ffffff', bg: '#CD0E2B',
  },
  'fujitsu': {
    type: 'custom', fg: '#ffffff', bg: '#FF0000',
  },
  'abb': {
    type: 'abbr', abbr: 'ABB', fg: '#000000', bg: '#ffffff',
  },
  'aimtec': {
    type: 'abbr', abbr: 'AIM', fg: '#ffffff', bg: '#0F4C81',
  },
  'siemens': {
    type: 'abbr', abbr: 'SIEMENS', fg: '#ffffff', bg: '#009999',
  },
  'espressif': {
    type: 'custom', fg: '#E71D36', bg: '#ffffff',
  },
  'gigadevice': {
    type: 'abbr', abbr: 'GD', fg: '#ffffff', bg: '#003366',
  },
  'nordic': {
    type: 'custom', fg: '#ffffff', bg: '#00A9CE',
  },
  'micron': {
    type: 'custom', fg: '#ffffff', bg: '#0A2240',
  },
  'maxim': {
    type: 'abbr', abbr: 'MAXIM', fg: '#ffffff', bg: '#A6192E',
  },
};

// Палитра для fallback (по первой букве slug)
const FALLBACK_COLORS = [
  { fg: '#ffffff', bg: '#0F766E' }, // teal
  { fg: '#ffffff', bg: '#7C3AED' }, // purple
  { fg: '#ffffff', bg: '#B91C1C' }, // red
  { fg: '#ffffff', bg: '#1E40AF' }, // blue
  { fg: '#ffffff', bg: '#9333EA' }, // magenta
  { fg: '#ffffff', bg: '#15803D' }, // green
  { fg: '#ffffff', bg: '#C2410C' }, // orange
  { fg: '#ffffff', bg: '#0E7490' }, // cyan
  { fg: '#ffffff', bg: '#7E22CE' }, // violet
  { fg: '#ffffff', bg: '#BE123C' }, // rose
];

function getFallbackConfig(slug: string): LogoConfig {
  const first = slug[0]?.toUpperCase() || '?';
  const idx = (first.charCodeAt(0) - 65) % FALLBACK_COLORS.length;
  const color = FALLBACK_COLORS[Math.abs(idx)] || FALLBACK_COLORS[0];
  // Аббревиатура из первых букв каждого слова slug
  const abbr = slug
    .split('-')
    .map(w => w[0]?.toUpperCase() || '')
    .slice(0, 3)
    .join('');
  return {
    type: 'abbr',
    abbr: abbr || first,
    fg: color.fg,
    bg: color.bg,
  };
}

// ───────────────────────────────────────────────────────────────────────────────
// Уникальные SVG-логотипы для топ-брендов (узнаваемые)
// ───────────────────────────────────────────────────────────────────────────────

function CustomLogo({ slug, fg, bg, size }: { slug: string; fg: string; bg: string; size: number }) {
  // Все логотипы — стилизованный текст с акцентом на фирменных цветах
  // У каждого свой уникальный pattern

  const wrapStyle = { backgroundColor: bg };

  switch (slug) {
    case 'texas-instruments': {
      // TI — красный текст на белом, с тонкой красной полосой снизу
      return (
        <div className="w-full h-full flex flex-col items-center justify-center" style={wrapStyle}>
          <div className="font-bold text-[28px] tracking-tight leading-none" style={{ color: fg }}>TI</div>
          <div className="text-[8px] mt-1 tracking-wider" style={{ color: fg, opacity: 0.8 }}>TEXAS INSTRUMENTS</div>
          <div className="absolute bottom-0 left-0 right-0 h-[3px]" style={{ backgroundColor: fg }} />
        </div>
      );
    }
    case 'stmicroelectronics': {
      // ST — синий текст на голубом фоне
      return (
        <div className="w-full h-full flex flex-col items-center justify-center" style={wrapStyle}>
          <div className="font-black text-[34px] leading-none" style={{ color: fg }}>ST</div>
          <div className="text-[7px] mt-1 tracking-wider" style={{ color: fg, opacity: 0.85 }}>STMICROELECTRONICS</div>
        </div>
      );
    }
    case 'infineon': {
      // Infineon — зелёный текст на белом
      return (
        <div className="w-full h-full flex flex-col items-center justify-center" style={wrapStyle}>
          <div className="font-bold text-[15px] leading-none" style={{ color: fg }}>INFINEON</div>
          <div className="w-12 h-[2px] mt-1.5" style={{ backgroundColor: fg }} />
        </div>
      );
    }
    case 'nxp': {
      // NXP — белый текст на зелёном
      return (
        <div className="w-full h-full flex flex-col items-center justify-center" style={wrapStyle}>
          <div className="font-black text-[24px] leading-none tracking-tighter" style={{ color: fg }}>NXP</div>
          <div className="text-[8px] mt-1.5 tracking-wider" style={{ color: fg, opacity: 0.85 }}>SEMICONDUCTORS</div>
        </div>
      );
    }
    case 'microchip': {
      // Microchip — белый текст на синем
      return (
        <div className="w-full h-full flex flex-col items-center justify-center" style={wrapStyle}>
          <div className="font-bold text-[14px] leading-none" style={{ color: fg }}>MICROCHIP</div>
          <div className="text-[7px] mt-1 tracking-wider" style={{ color: fg, opacity: 0.8 }}>TECHNOLOGY</div>
        </div>
      );
    }
    case 'onsemi': {
      // onsemi — белый текст на зелёном, lowercase стиль бренда
      return (
        <div className="w-full h-full flex flex-col items-center justify-center" style={wrapStyle}>
          <div className="font-bold text-[20px] leading-none tracking-tight" style={{ color: fg }}>onsemi</div>
          <div className="text-[7px] mt-1.5 tracking-wider opacity-80" style={{ color: fg }}>INNOVATION</div>
        </div>
      );
    }
    case 'analog-devices': {
      // ADI — синий текст на белом
      return (
        <div className="w-full h-full flex flex-col items-center justify-center" style={wrapStyle}>
          <div className="font-black text-[22px] leading-none" style={{ color: fg }}>ADI</div>
          <div className="text-[8px] mt-1 tracking-wider" style={{ color: fg, opacity: 0.85 }}>ANALOG DEVICES</div>
        </div>
      );
    }
    case 'xilinx': {
      // Xilinx — белый текст на красном
      return (
        <div className="w-full h-full flex flex-col items-center justify-center" style={wrapStyle}>
          <div className="font-bold text-[16px] leading-none" style={{ color: fg }}>XILINX</div>
          <div className="text-[7px] mt-1 tracking-wider opacity-80" style={{ color: fg }}>AMD</div>
        </div>
      );
    }
    case 'altera': {
      // Altera (Intel) — белый текст на синем Intel
      return (
        <div className="w-full h-full flex flex-col items-center justify-center" style={wrapStyle}>
          <div className="font-bold text-[16px] leading-none" style={{ color: fg }}>ALTERA</div>
          <div className="text-[7px] mt-1 tracking-wider opacity-80" style={{ color: fg }}>INTEL COMPANY</div>
        </div>
      );
    }
    case 'lattice': {
      // Lattice — белый текст на бордовом
      return (
        <div className="w-full h-full flex flex-col items-center justify-center" style={wrapStyle}>
          <div className="font-bold text-[14px] leading-none" style={{ color: fg }}>LATTICE</div>
          <div className="text-[7px] mt-1 tracking-wider opacity-80" style={{ color: fg }}>SEMICONDUCTOR</div>
        </div>
      );
    }
    case 'murata': {
      // Murata — белый M на красном
      return (
        <div className="w-full h-full flex flex-col items-center justify-center" style={wrapStyle}>
          <div className="font-black text-[32px] leading-none" style={{ color: fg }}>m</div>
          <div className="text-[8px] mt-0.5 tracking-wider" style={{ color: fg, opacity: 0.9 }}>MURATA</div>
        </div>
      );
    }
    case 'tdk': {
      // TDK — белый текст на синем, жирный
      return (
        <div className="w-full h-full flex flex-col items-center justify-center" style={wrapStyle}>
          <div className="font-black text-[28px] leading-none tracking-tight" style={{ color: fg }}>TDK</div>
          <div className="text-[7px] mt-1 tracking-wider opacity-80" style={{ color: fg }}>ELECTRONICS</div>
        </div>
      );
    }
    case 'samsung-electro': {
      // Samsung — белый SAMSUNG на синем
      return (
        <div className="w-full h-full flex flex-col items-center justify-center" style={wrapStyle}>
          <div className="font-bold text-[13px] leading-none tracking-wider" style={{ color: fg }}>SAMSUNG</div>
          <div className="text-[7px] mt-1 tracking-wider opacity-80" style={{ color: fg }}>ELECTRO-MECHANICS</div>
        </div>
      );
    }
    case 'kemet': {
      // KEMET — белый на зелёном
      return (
        <div className="w-full h-full flex flex-col items-center justify-center" style={wrapStyle}>
          <div className="font-black text-[18px] leading-none tracking-tight" style={{ color: fg }}>KEMET</div>
        </div>
      );
    }
    case 'vishay': {
      // Vishay — белый на синем
      return (
        <div className="w-full h-full flex flex-col items-center justify-center" style={wrapStyle}>
          <div className="font-bold text-[18px] leading-none" style={{ color: fg }}>VISHAY</div>
        </div>
      );
    }
    case 'broadcom': {
      // Broadcom — белый на красном
      return (
        <div className="w-full h-full flex flex-col items-center justify-center" style={wrapStyle}>
          <div className="font-bold text-[14px] leading-none" style={{ color: fg }}>BROADCOM</div>
          <div className="text-[7px] mt-1 tracking-wider opacity-80" style={{ color: fg }}>AVAGO</div>
        </div>
      );
    }
    case 'yageo': {
      // Yageo — белый на тёмно-синем
      return (
        <div className="w-full h-full flex flex-col items-center justify-center" style={wrapStyle}>
          <div className="font-bold text-[20px] leading-none" style={{ color: fg }}>YAGEO</div>
        </div>
      );
    }
    case 'molex': {
      // Molex — белый на синем
      return (
        <div className="w-full h-full flex flex-col items-center justify-center" style={wrapStyle}>
          <div className="font-black text-[18px] leading-none" style={{ color: fg }}>molex</div>
        </div>
      );
    }
    case 'te-connectivity': {
      // TE — белый на тёмно-синем
      return (
        <div className="w-full h-full flex flex-col items-center justify-center" style={wrapStyle}>
          <div className="font-black text-[28px] leading-none" style={{ color: fg }}>TE</div>
          <div className="text-[7px] mt-1 tracking-wider opacity-80" style={{ color: fg }}>CONNECTIVITY</div>
        </div>
      );
    }
    case 'amphenol': {
      // Amphenol — белый на синем
      return (
        <div className="w-full h-full flex flex-col items-center justify-center" style={wrapStyle}>
          <div className="font-bold text-[14px] leading-none" style={{ color: fg }}>AMPHENOL</div>
        </div>
      );
    }
    case 'bourns': {
      // Bourns — белый на коричневом
      return (
        <div className="w-full h-full flex flex-col items-center justify-center" style={wrapStyle}>
          <div className="font-bold text-[18px] leading-none" style={{ color: fg }}>BOURNS</div>
        </div>
      );
    }
    case 'littelfuse': {
      // Littelfuse — белый на красном
      return (
        <div className="w-full h-full flex flex-col items-center justify-center" style={wrapStyle}>
          <div className="font-bold text-[12px] leading-none" style={{ color: fg }}>LITTEL</div>
          <div className="font-bold text-[12px] leading-none mt-0.5" style={{ color: fg }}>FUSE</div>
        </div>
      );
    }
    case 'mean-well': {
      // Mean Well — белый на зелёном
      return (
        <div className="w-full h-full flex flex-col items-center justify-center" style={wrapStyle}>
          <div className="font-bold text-[13px] leading-none" style={{ color: fg }}>MEAN</div>
          <div className="font-bold text-[13px] leading-none mt-0.5" style={{ color: fg }}>WELL</div>
        </div>
      );
    }
    case 'panasonic': {
      // Panasonic — белый на синем
      return (
        <div className="w-full h-full flex flex-col items-center justify-center" style={wrapStyle}>
          <div className="font-bold text-[12px] leading-none tracking-wider" style={{ color: fg }}>Panasonic</div>
          <div className="text-[7px] mt-1 tracking-wider opacity-80" style={{ color: fg }}>INDUSTRY</div>
        </div>
      );
    }
    case 'toshiba': {
      // Toshiba — белый на красном
      return (
        <div className="w-full h-full flex flex-col items-center justify-center" style={wrapStyle}>
          <div className="font-bold text-[13px] leading-none" style={{ color: fg }}>TOSHIBA</div>
        </div>
      );
    }
    case 'wurth-elektronik': {
      // Wurth — белый на красном
      return (
        <div className="w-full h-full flex flex-col items-center justify-center" style={wrapStyle}>
          <div className="font-bold text-[12px] leading-none" style={{ color: fg }}>WÜRTH</div>
          <div className="text-[7px] mt-1 tracking-wider opacity-80" style={{ color: fg }}>ELEKTRONIK</div>
        </div>
      );
    }
    case 'fujitsu': {
      // Fujitsu — белый на красном
      return (
        <div className="w-full h-full flex flex-col items-center justify-center" style={wrapStyle}>
          <div className="font-bold text-[14px] leading-none" style={{ color: fg }}>FUJITSU</div>
        </div>
      );
    }
    case 'siemens': {
      // Siemens — белый на бирюзовом
      return (
        <div className="w-full h-full flex flex-col items-center justify-center" style={wrapStyle}>
          <div className="font-bold text-[13px] leading-none tracking-wider" style={{ color: fg }}>SIEMENS</div>
        </div>
      );
    }
    case 'espressif': {
      // Espressif — красный текст на белом, с символом
      return (
        <div className="w-full h-full flex flex-col items-center justify-center" style={wrapStyle}>
          <div className="font-bold text-[13px] leading-none" style={{ color: fg }}>Espressif</div>
          <div className="text-[7px] mt-1 tracking-wider opacity-70" style={{ color: fg }}>SYSTEMS</div>
        </div>
      );
    }
    case 'nordic': {
      // Nordic — белый на голубом
      return (
        <div className="w-full h-full flex flex-col items-center justify-center" style={wrapStyle}>
          <div className="font-bold text-[14px] leading-none" style={{ color: fg }}>Nordic</div>
          <div className="text-[7px] mt-1 tracking-wider opacity-80" style={{ color: fg }}>SEMI</div>
        </div>
      );
    }
    case 'micron': {
      // Micron — белый на тёмно-синем
      return (
        <div className="w-full h-full flex flex-col items-center justify-center" style={wrapStyle}>
          <div className="font-bold text-[16px] leading-none" style={{ color: fg }}>Micron</div>
        </div>
      );
    }
    default:
      // Если бренд есть в BRAND_CONFIG но не имеет custom-кейса — fallback на abbr
      return null;
  }
}

// ───────────────────────────────────────────────────────────────────────────────
// Главная функция рендера
// ───────────────────────────────────────────────────────────────────────────────

export default function BrandLogo({ name, slug, className = '', size = 80 }: Props) {
  const config = BRAND_CONFIG[slug] || getFallbackConfig(slug);

  // Базовый контейнер — фиксированная высота, относительная позиция для абсолюта
  const containerClass = `relative w-full h-full flex items-center justify-center overflow-hidden ${className}`;

  if (config.type === 'custom') {
    const custom = CustomLogo({ slug, fg: config.fg, bg: config.bg || '#ffffff', size });
    if (custom) {
      return <div className={containerClass}>{custom}</div>;
    }
    // Если custom не определён — fallback на abbr
  }

  if (config.type === 'abbr' && config.abbr) {
    return (
      <div
        className={containerClass}
        style={{ backgroundColor: config.bg }}
      >
        <div
          className="font-black tracking-tight"
          style={{
            color: config.fg,
            fontSize: config.abbr.length <= 2 ? '28px' : config.abbr.length === 3 ? '22px' : '16px',
            lineHeight: 1,
          }}
        >
          {config.abbr}
        </div>
      </div>
    );
  }

  // Fallback: текст
  return (
    <div
      className={containerClass}
      style={{ backgroundColor: config.bg || '#0F766E' }}
    >
      <div className="font-bold text-[14px] leading-none" style={{ color: config.fg }}>
        {name}
      </div>
    </div>
  );
}

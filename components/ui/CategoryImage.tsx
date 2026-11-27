// components/ui/CategoryImage.tsx
// Цветные SVG-иллюстрации для категорий каталога.
// Каждая категория — узнаваемый визуальный символ в фирменной палитре.
// Используется в каталоге рядом с названием родительской категории.

import { ReactNode } from 'react';

type Props = {
  category: string;
  className?: string;
};

const WRAPPER_CLASS = 'inline-flex items-center justify-center';

// Цветовая палитра (фирменная — оттенки teal/зелёного + акценты)
const C = {
  primary: '#02a391',     // основной teal
  primaryDark: '#027d70', // тёмный teal
  body: '#1f2937',        // тёмно-серый для корпусов
  pin: '#9ca3a0',         // серый для ножек
  gold: '#d4a04f',        // золотистый для контактов
  red: '#dc2626',         // красный
  blue: '#3b82f6',        // синий
  amber: '#f59e0b',       // оранжевый
  green: '#16a34a',       // зелёный
  purple: '#7c3aed',      // фиолетовый
  cyan: '#06b6d4',        // голубой
  white: '#ffffff',
  bg: '#f8faf7',
};

function Svg({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <svg
      width="48"
      height="48"
      viewBox="0 0 48 48"
      xmlns="http://www.w3.org/2000/svg"
      className={className || ''}
      fill="none"
    >
      <rect width="48" height="48" rx="10" fill={C.bg} />
      {children}
    </svg>
  );
}

// ───────────────────────────────────────────────────────────────────────────────
// Иконки для 30 категорий
// ───────────────────────────────────────────────────────────────────────────────

function Microcontroller() {
  return (
    <Svg>
      {/* Корпус чипа */}
      <rect x="14" y="14" width="20" height="20" rx="2" fill={C.body} />
      <rect x="17" y="17" width="14" height="14" rx="1" fill="#374151" />
      {/* Ножки слева */}
      <rect x="10" y="17" width="4" height="2" fill={C.pin} />
      <rect x="10" y="21" width="4" height="2" fill={C.pin} />
      <rect x="10" y="25" width="4" height="2" fill={C.pin} />
      <rect x="10" y="29" width="4" height="2" fill={C.pin} />
      {/* Ножки справа */}
      <rect x="34" y="17" width="4" height="2" fill={C.pin} />
      <rect x="34" y="21" width="4" height="2" fill={C.pin} />
      <rect x="34" y="25" width="4" height="2" fill={C.pin} />
      <rect x="34" y="29" width="4" height="2" fill={C.pin} />
      {/* Метка пин 1 */}
      <circle cx="19" cy="19" r="1.5" fill={C.white} opacity="0.6" />
      {/* CPU символ */}
      <rect x="21" y="21" width="6" height="6" rx="0.5" fill={C.primary} opacity="0.8" />
    </Svg>
  );
}

function FPGA() {
  return (
    <Svg>
      {/* BGA — шариковая решётка сверху */}
      <rect x="12" y="12" width="24" height="24" rx="2" fill={C.body} />
      {[0, 1, 2, 3].map(row =>
        [0, 1, 2, 3].map(col => (
          <circle key={`${row}-${col}`} cx={16 + col * 5.3} cy={16 + row * 5.3} r="1.5" fill={C.gold} />
        ))
      )}
      <circle cx="15" cy="15" r="1" fill={C.white} opacity="0.5" />
    </Svg>
  );
}

function Transistor() {
  return (
    <Svg>
      {/* TO-220 корпус */}
      <rect x="14" y="10" width="20" height="22" rx="1" fill={C.body} />
      {/* Металлический язычок */}
      <rect x="12" y="14" width="24" height="8" fill="#c9c9c9" />
      <circle cx="24" cy="18" r="2" fill={C.white} stroke="#888" strokeWidth="0.5" />
      {/* Выводы */}
      <rect x="17" y="32" width="2" height="6" fill={C.pin} />
      <rect x="23" y="32" width="2" height="6" fill={C.pin} />
      <rect x="29" y="32" width="2" height="6" fill={C.pin} />
    </Svg>
  );
}

function Capacitor() {
  return (
    <Svg>
      {/* Электролитический — цилиндр */}
      <rect x="16" y="12" width="16" height="24" rx="2" fill={C.blue} />
      <rect x="16" y="12" width="16" height="4" rx="2" fill="#1e40af" />
      {/* Полоса минуса */}
      <rect x="18" y="30" width="12" height="2" fill={C.white} opacity="0.6" />
      {/* Выводы */}
      <rect x="20" y="36" width="2" height="4" fill={C.pin} />
      <rect x="26" y="36" width="2" height="4" fill={C.pin} />
      {/* Маркировка */}
      <text x="24" y="24" fontSize="6" fill={C.white} textAnchor="middle" fontWeight="bold">µF</text>
    </Svg>
  );
}

function Resistor() {
  return (
    <Svg>
      {/* Выводной резистор */}
      <rect x="10" y="20" width="6" height="3" fill={C.pin} />
      <rect x="32" y="20" width="6" height="3" fill={C.pin} />
      {/* Корпус */}
      <rect x="16" y="16" width="16" height="12" rx="5" fill="#d9b38c" />
      {/* Цветные полосы */}
      <rect x="19" y="16" width="2" height="12" fill={C.red} />
      <rect x="22" y="16" width="2" height="12" fill="#000" />
      <rect x="25" y="16" width="2" height="12" fill={C.amber} />
      <rect x="28" y="16" width="2" height="12" fill={C.amber} />
    </Svg>
  );
}

function Diode() {
  return (
    <Svg>
      {/* DO-41 корпус */}
      <rect x="10" y="22" width="6" height="2.5" fill={C.pin} />
      <rect x="32" y="22" width="6" height="2.5" fill={C.pin} />
      <rect x="16" y="18" width="16" height="10" rx="3" fill="#f5e6c4" stroke="#9a8040" strokeWidth="0.5" />
      {/* Катодная полоса */}
      <rect x="28" y="18" width="3" height="10" fill="#666" />
      {/* Треугольник (символ диода) */}
      <path d="M19 20 L25 24 L19 28 Z" fill={C.red} opacity="0.5" />
    </Svg>
  );
}

function OpAmp() {
  return (
    <Svg>
      {/* DIP-8 корпус */}
      <rect x="14" y="12" width="20" height="24" rx="1.5" fill={C.body} />
      {/* Полукруг (индикатор) */}
      <path d="M14 16 A10 10 0 0 1 34 16" fill="none" stroke="#555" strokeWidth="1" />
      {/* Выводы */}
      {[0, 1, 2, 3].map(i => (
        <g key={i}>
          <rect x={11} y={16 + i * 5.3} width={3} height={2} fill={C.pin} />
          <rect x={34} y={16 + i * 5.3} width={3} height={2} fill={C.pin} />
        </g>
      ))}
      {/* Символ ОУ — треугольник */}
      <path d="M19 22 L19 28 L25 25 Z" fill={C.primary} opacity="0.7" />
      <text x="20" y="26" fontSize="4" fill={C.white}>+</text>
      <text x="22" y="26" fontSize="4" fill={C.white}>−</text>
    </Svg>
  );
}

function Stabilizer() {
  return (
    <Svg>
      {/* TO-220 со стрелкой (регулятор) */}
      <rect x="14" y="10" width="20" height="22" rx="1" fill={C.body} />
      <rect x="12" y="14" width="24" height="8" fill="#c9c9c9" />
      <circle cx="24" cy="18" r="2" fill={C.white} stroke="#888" strokeWidth="0.5" />
      <rect x="17" y="32" width="2" height="6" fill={C.pin} />
      <rect x="23" y="32" width="2" height="6" fill={C.pin} />
      <rect x="29" y="32" width="2" height="6" fill={C.pin} />
      {/* Стрелка вниз */}
      <path d="M24 20 L24 26 M21 23 L24 26 L27 23" stroke={C.primary} strokeWidth="1.5" strokeLinecap="round" />
    </Svg>
  );
}

function Sensor() {
  return (
    <Svg>
      {/* Круг с волнами */}
      <circle cx="24" cy="24" r="6" fill={C.primary} opacity="0.2" />
      <circle cx="24" cy="24" r="4" fill={C.primary} />
      <circle cx="24" cy="24" r="10" stroke={C.primary} strokeWidth="1.5" fill="none" opacity="0.5" />
      <circle cx="24" cy="24" r="14" stroke={C.primary} strokeWidth="1.5" fill="none" opacity="0.3" />
      <circle cx="24" cy="24" r="18" stroke={C.primary} strokeWidth="1.5" fill="none" opacity="0.15" />
    </Svg>
  );
}

function Relay() {
  return (
    <Svg>
      {/* Корпус реле */}
      <rect x="12" y="12" width="24" height="24" rx="2" fill={C.body} />
      {/* Катушка */}
      <path d="M16 16 C16 14, 18 14, 18 16 L18 24 C18 26, 16 26, 16 24 Z" fill={C.amber} opacity="0.6" />
      <path d="M20 16 C20 14, 22 14, 22 16 L22 24 C22 26, 20 26, 20 24 Z" fill={C.amber} opacity="0.6" />
      {/* Контакты */}
      <line x1="26" y1="16" x2="32" y2="16" stroke={C.gold} strokeWidth="2" strokeLinecap="round" />
      <line x1="26" y1="24" x2="30" y2="20" stroke={C.gold} strokeWidth="2" strokeLinecap="round" />
      <line x1="26" y1="32" x2="32" y2="32" stroke={C.gold} strokeWidth="2" strokeLinecap="round" />
      {/* Выводы */}
      <rect x="15" y="36" width="2" height="3" fill={C.pin} />
      <rect x="23" y="36" width="2" height="3" fill={C.pin} />
      <rect x="31" y="36" width="2" height="3" fill={C.pin} />
    </Svg>
  );
}

function Connector() {
  return (
    <Svg>
      {/* Pin header */}
      <rect x="10" y="20" width="28" height="8" rx="1" fill={C.body} />
      {[0, 1, 2, 3, 4].map(i => (
        <g key={i}>
          <rect x={12 + i * 5} y={16} width={3} height={4} fill={C.gold} />
          <rect x={12 + i * 5} y={28} width={3} height={6} fill={C.gold} />
        </g>
      ))}
    </Svg>
  );
}

function Crystal() {
  return (
    <Svg>
      {/* HC-49 корпус */}
      <ellipse cx="24" cy="24" rx="12" ry="9" fill="#c4c4c4" stroke="#888" strokeWidth="0.5" />
      <ellipse cx="24" cy="24" rx="7" ry="5" fill="#a8a8a8" opacity="0.5" />
      <rect x="22" y="32" width="2" height="5" fill={C.pin} />
      <rect x="24" y="32" width="2" height="5" fill={C.pin} />
    </Svg>
  );
}

function Inductor() {
  return (
    <Svg>
      {/* SMD индуктивность */}
      <rect x="12" y="18" width="24" height="12" rx="3" fill={C.body} />
      {/* Спираль */}
      <circle cx="24" cy="24" r="6" fill="none" stroke={C.amber} strokeWidth="1.5" />
      <circle cx="24" cy="24" r="3.5" fill="none" stroke={C.amber} strokeWidth="1.5" />
      {/* Контакты */}
      <rect x="9" y="21" width="3" height="6" fill={C.gold} />
      <rect x="36" y="21" width="3" height="6" fill={C.gold} />
    </Svg>
  );
}

function Logic() {
  return (
    <Svg>
      {/* DIP-14 корпус с логическими элементами */}
      <rect x="12" y="14" width="24" height="20" rx="1.5" fill={C.body} />
      {/* Ножки */}
      {[0, 1, 2, 3, 4, 5, 6].map(i => (
        <g key={i}>
          <rect x={10} y={16 + i * 3} width={2} height={1.5} fill={C.pin} />
          <rect x={36} y={16 + i * 3} width={2} height={1.5} fill={C.pin} />
        </g>
      ))}
      {/* Метка пин 1 */}
      <circle cx="15" cy="18" r="1" fill={C.white} opacity="0.5" />
      {/* Логический символ AND */}
      <path d="M19 24 L24 24 A4 4 0 0 1 24 32 L19 32 Z" fill={C.primary} opacity="0.6" />
    </Svg>
  );
}

function Memory() {
  return (
    <Svg>
      {/* SOIC корпус */}
      <rect x="12" y="16" width="24" height="16" rx="1" fill={C.body} />
      {/* Ножки */}
      {[0, 1, 2, 3, 4, 5, 6, 7].map(i => (
        <g key={i}>
          <rect x={13 + i * 3} y={12} width={2} height={4} fill={C.pin} />
          <rect x={13 + i * 3} y={32} width={2} height={4} fill={C.pin} />
        </g>
      ))}
      {/* Маркировка */}
      <text x="24" y="26" fontSize="5" fill={C.primary} textAnchor="middle" fontWeight="bold">EEP</text>
    </Svg>
  );
}

function Interface() {
  return (
    <Svg>
      {/* SOIC с символом USB */}
      <rect x="14" y="14" width="20" height="20" rx="1.5" fill={C.body} />
      {/* Ножки */}
      {[0, 1, 2, 3, 4, 5, 6, 7].map(i => (
        <rect key={i} x={15 + i * 2.5} y={34} width={1.5} height={3} fill={C.pin} />
      ))}
      {/* USB символ */}
      <path d="M24 18 L24 24 M21 21 L24 18 L27 21" stroke={C.blue} strokeWidth="1.5" strokeLinecap="round" fill="none" />
      <circle cx="24" cy="28" r="2" fill={C.blue} opacity="0.5" />
    </Svg>
  );
}

function Power() {
  return (
    <Svg>
      {/* Молния в круге */}
      <circle cx="24" cy="24" r="14" fill={C.amber} opacity="0.15" />
      <circle cx="24" cy="24" r="14" stroke={C.amber} strokeWidth="2" fill="none" />
      <path d="M22 14 L18 26 L22 26 L20 34 L28 22 L24 22 L26 14 Z" fill={C.amber} />
    </Svg>
  );
}

function Opto() {
  return (
    <Svg>
      {/* Оптрон — DIP-4 со стрелкой */}
      <rect x="14" y="14" width="20" height="20" rx="1.5" fill={C.body} />
      {/* Ножки */}
      <rect x="17" y="34" width="2" height="4" fill={C.pin} />
      <rect x="29" y="34" width="2" height="4" fill={C.pin} />
      <rect x="17" y="10" width="2" height="4" fill={C.pin} />
      <rect x="29" y="10" width="2" height="4" fill={C.pin} />
      {/* LED + фототранзистор */}
      <circle cx="19" cy="24" r="3" fill={C.red} opacity="0.5" />
      <circle cx="29" cy="24" r="3" fill={C.primary} opacity="0.5" />
      {/* Стрелка света */}
      <path d="M22 21 L26 27" stroke={C.amber} strokeWidth="1.5" strokeDasharray="2,1" />
    </Svg>
  );
}

function Switch() {
  return (
    <Svg>
      {/* Тактовая кнопка */}
      <rect x="16" y="20" width="16" height="16" rx="2" fill={C.body} />
      <circle cx="24" cy="28" r="6" fill="#555" />
      <circle cx="24" cy="28" r="4" fill={C.primary} />
      {/* Выводы */}
      <rect x="14" y="22" width="2" height="14" fill={C.pin} />
      <rect x="32" y="22" width="2" height="14" fill={C.pin} />
      {/* Шляпка */}
      <circle cx="24" cy="16" r="3" fill="#888" />
      <rect x="22" y="14" width="4" height="4" fill="#888" />
    </Svg>
  );
}

function Fuse() {
  return (
    <Svg>
      {/* Стеклянный предохранитель */}
      <rect x="10" y="22" width="6" height="3" fill={C.pin} />
      <rect x="32" y="22" width="6" height="3" fill={C.pin} />
      <rect x="16" y="18" width="16" height="10" rx="5" fill={C.gold} />
      <rect x="18" y="20" width="12" height="6" rx="3" fill="#f5e6c4" opacity="0.5" />
      {/* Нить */}
      <line x1="18" y1="23" x2="30" y2="23" stroke={C.gold} strokeWidth="0.8" />
    </Svg>
  );
}

function Transformer() {
  return (
    <Svg>
      {/* Трансформатор — две катушки */}
      <rect x="10" y="14" width="28" height="20" rx="2" fill={C.body} />
      {/* Первичная обмотка */}
      {[0, 1, 2, 3].map(i => (
        <rect key={`p${i}`} x={12 + i * 2} y={16} width={1.5} height={16} fill={C.amber} opacity="0.7" />
      ))}
      {/* Сердечник */}
      <rect x="22" y="14" width="4" height="20" fill="#555" />
      {/* Вторичная обмотка */}
      {[0, 1, 2, 3].map(i => (
        <rect key={`s${i}`} x={28 + i * 2} y={16} width={1.5} height={16} fill={C.blue} opacity="0.7" />
      ))}
    </Svg>
  );
}

function Filter() {
  return (
    <Svg>
      {/* LC фильтр */}
      <rect x="10" y="14" width="28" height="20" rx="2" fill={C.body} />
      {/* Катушка */}
      <path d="M14 24 C14 20, 17 20, 17 24 C17 28, 20 28, 20 24 C20 20, 23 20, 23 24" stroke={C.amber} strokeWidth="1.5" fill="none" />
      {/* Конденсатор */}
      <line x1="27" y1="20" x2="27" y2="28" stroke={C.blue} strokeWidth="2" />
      <line x1="30" y1="20" x2="30" y2="28" stroke={C.blue} strokeWidth="2" />
      {/* Линии */}
      <line x1="14" y1="24" x2="14" y2="32" stroke={C.gold} strokeWidth="1" />
      <line x1="30" y1="24" x2="34" y2="24" stroke={C.gold} strokeWidth="1" />
    </Svg>
  );
}

function ElectroAuto() {
  return (
    <Svg>
      {/* Автоматический выключатель */}
      <rect x="14" y="12" width="20" height="24" rx="2" fill={C.body} />
      <rect x="16" y="14" width="16" height="6" rx="1" fill="#444" />
      {/* Рычажок */}
      <rect x="21" y="16" width="6" height="4" rx="1" fill={C.amber} />
      {/* Выводы */}
      <rect x="22" y="36" width="4" height="3" fill={C.gold} />
      <rect x="22" y="9" width="4" height="3" fill={C.gold} />
      {/* Символ автомата */}
      <line x1="18" y1="26" x2="30" y2="26" stroke={C.primary} strokeWidth="1.5" />
      <line x1="18" y1="26" x2="22" y2="30" stroke={C.primary} strokeWidth="1.5" />
    </Svg>
  );
}

function LED() {
  return (
    <Svg>
      {/* Купол */}
      <ellipse cx="24" cy="22" rx="8" ry="9" fill={C.red} opacity="0.7" stroke="#c92a2a" strokeWidth="0.5" />
      <ellipse cx="21" cy="18" rx="2.5" ry="3" fill={C.white} opacity="0.5" />
      {/* Выводы */}
      <rect x="21" y="30" width="2" height="8" fill={C.pin} />
      <rect x="25" y="30" width="2" height="8" fill={C.pin} />
      {/* Флашка на аноде */}
      <rect x="21" y="30" width="2" height="2" fill="#888" />
    </Svg>
  );
}

function Modules() {
  return (
    <Svg>
      {/* Модуль / плата */}
      <rect x="10" y="12" width="28" height="24" rx="1" fill="#1a4d1a" />
      {/* Компоненты на плате */}
      <rect x="13" y="15" width="8" height="8" fill={C.body} />
      <rect x="24" y="16" width="6" height="5" fill={C.amber} />
      <circle cx="30" cy="28" r="2.5" fill={C.gold} />
      {/* Пины */}
      {[0, 1, 2, 3].map(i => (
        <rect key={i} x={12 + i * 6} y={36} width={2} height={3} fill={C.gold} />
      ))}
    </Svg>
  );
}

function Telecom() {
  return (
    <Svg>
      {/* Антенна с волнами */}
      <line x1="24" y1="36" x2="24" y2="20" stroke={C.body} strokeWidth="2" strokeLinecap="round" />
      <circle cx="24" cy="16" r="3" fill={C.primary} />
      <path d="M14 18 Q18 14, 14 10" stroke={C.primary} strokeWidth="1.5" fill="none" />
      <path d="M34 18 Q30 14, 34 10" stroke={C.primary} strokeWidth="1.5" fill="none" />
      <path d="M10 20 Q16 14, 10 8" stroke={C.primary} strokeWidth="1" fill="none" opacity="0.6" />
      <path d="M38 20 Q32 14, 38 8" stroke={C.primary} strokeWidth="1" fill="none" opacity="0.6" />
    </Svg>
  );
}

function Cables() {
  return (
    <Svg>
      {/* USB штекер */}
      <rect x="10" y="18" width="10" height="12" rx="1" fill="#c4c4c4" stroke="#888" strokeWidth="0.5" />
      <rect x="12" y="20" width="6" height="8" fill={C.blue} />
      {/* Провод */}
      <path d="M20 24 Q28 18, 36 24 Q28 30, 20 24" stroke={C.body} strokeWidth="3" fill="none" />
    </Svg>
  );
}

function Mounting() {
  return (
    <Svg>
      {/* Радиатор */}
      <rect x="12" y="14" width="24" height="20" rx="1" fill="#c9c9c9" />
      {/* Ребра */}
      {[0, 1, 2, 3, 4].map(i => (
        <rect key={i} x={13 + i * 4.5} y={14} width={2} height={20} fill="#a8a8a8" />
      ))}
      {/* Отверстие */}
      <circle cx="24" cy="24" r="2" fill="#888" />
    </Svg>
  );
}

function Misc() {
  return (
    <Svg>
      {/* Шестерёнка */}
      <circle cx="24" cy="24" r="8" fill={C.primary} opacity="0.3" />
      <circle cx="24" cy="24" r="5" fill={C.body} />
      <circle cx="24" cy="24" r="2" fill={C.primary} />
      {/* Зубцы */}
      {[0, 45, 90, 135, 180, 225, 270, 315].map(deg => {
        const rad = (deg * Math.PI) / 180;
        const x1 = 24 + Math.cos(rad) * 8;
        const y1 = 24 + Math.sin(rad) * 8;
        const x2 = 24 + Math.cos(rad) * 10;
        const y2 = 24 + Math.sin(rad) * 10;
        return <line key={deg} x1={x1} y1={y1} x2={x2} y2={y2} stroke={C.body} strokeWidth="2" strokeLinecap="round" />;
      })}
    </Svg>
  );
}

function Chips() {
  return <Microcontroller />;
}

// ───────────────────────────────────────────────────────────────────────────────
// Маппинг: название категории → компонент иконки
// ───────────────────────────────────────────────────────────────────────────────

const CATEGORY_IMAGES: Record<string, ReactNode> = {
  'Микроконтроллеры': <Microcontroller />,
  'Микросхемы': <Chips />,
  'ПЛИС (FPGA)': <FPGA />,
  'Логика': <Logic />,
  'Операционные усилители': <OpAmp />,
  'АЦП/ЦАП': <OpAmp />,
  'Память': <Memory />,
  'Интерфейсы': <Interface />,
  'Транзисторы': <Transistor />,
  'Диоды': <Diode />,
  'Конденсаторы': <Capacitor />,
  'Резисторы': <Resistor />,
  'Индуктивности': <Inductor />,
  'Кварцы и резонаторы': <Crystal />,
  'Фильтры': <Filter />,
  'Предохранители': <Fuse />,
  'Трансформаторы': <Transformer />,
  'Стабилизаторы': <Stabilizer />,
  'Питание': <Power />,
  'Реле': <Relay />,
  'Электроавтоматика': <ElectroAuto />,
  'Оптоэлектроника': <Opto />,
  'Датчики': <Sensor />,
  'LED драйверы': <LED />,
  'Разъёмы': <Connector />,
  'Переключатели': <Switch />,
  'Кабели и провода': <Cables />,
  'Монтаж и аксессуары': <Mounting />,
  'Модули и платы': <Modules />,
  'Телекоммуникации': <Telecom />,
  'Прочие компоненты': <Misc />,
};

export default function CategoryImage({ category, className = '' }: Props) {
  const icon = CATEGORY_IMAGES[category] || <Misc />;
  return (
    <span className={`${WRAPPER_CLASS} ${className}`}>
      {icon}
    </span>
  );
}

'use client';

import { motion } from 'framer-motion';

interface EngineeringNote {
  title: string;
  items: string[];
  warning?: string;
}

interface EngineeringCategory {
  name: string;
  icon: string;
  notes: EngineeringNote[];
  migrationWarnings: string[];
  compatibilityMatrix: { from: string; to: string; effort: string; notes: string }[];
}

const engineeringData: EngineeringCategory[] = [
  {
    name: 'STM32',
    icon: 'MCU',
    notes: [
      {
        title: 'Bootloader Migration',
        items: [
          'STM32F1→F4: требуется обновление startup-кода и linker script. Векторная таблица relocated для F4.',
          'USB DFU bootloader: F1 использует разные endpoint-адреса по сравнению с F4/H7.',
          'UART bootloader: совместим между семействами, но baud rate определяется по HSI-частоте, которая отличается.',
        ],
      },
      {
        title: 'SWD/JTAG Differences',
        items: [
          'SWD: 2-pin (SWDIO/SWCLK) — стандарт для всех STM32. JTAG: 5-pin — требуется для boundary scan.',
          'STM32F1: JTAG занимает PA15, PB3, PB4. SWD — только PA13, PA14. Освобождает PB3/PB4 для GPIO.',
          'STM32H7: поддерживает SWV ITM trace через SWD — рекомендуется для debug production-кода.',
        ],
      },
      {
        title: 'EMC Implications',
        items: [
          'STM32F1 на 72 MHz: EMC-излучения в диапазоне 50–150 MHz. Требуется decoupling 100nF + 4.7uF на каждом VDD pin.',
          'STM32F4 на 168 MHz: критична разводка ground plane под кристаллом. Power island для VDDA.',
          'STM32H7 на 480 MHz: обязательно shielded clock trace, minimise loop area для high-speed interfaces.',
        ],
      },
      {
        title: 'PCB Layout Recommendations',
        items: [
          'Decoupling: 100nF ceramic < 5mm от каждого VDD pin. Bulk 4.7–10uF на входе power domain.',
          'Crystal: load capacitors рассчитываются по CL = (C1×C2)/(C1+C2) + Cstray. Типичный Cstray = 3–5 pF.',
          'USB: differential pair 90Ω, length matching ±0.5mm. ESD protection на D+/D-.',
        ],
      },
    ],
    migrationWarnings: [
      'GD32/HK32 caveats: не полностью совместимы на register level. RTC backup registers отличаются. Flash latency при 108 MHz требует WS=3 (vs WS=2 для STM32F1@72MHz).',
      'HK32F103: отличия в ADC resolution (12-bit vs 12-bit, но разная точность), timer prescaler limits, и GPIO speed modes.',
      'Рекомендация: верифицировать код на целевом кристалле. Не полагаться на «pin-to-pin совместимость» без тестирования.',
    ],
    compatibilityMatrix: [
      { from: 'STM32F103C8T6', to: 'GD32F103C8T6', effort: 'Низкий', notes: 'Register-совместим для базовой периферии. Проверить Flash latency и ADC.' },
      { from: 'STM32F103C8T6', to: 'HK32F103C8T6', effort: 'Низкий', notes: 'Pin-to-pin. Проверить timer и RTC. Power consumption выше.' },
      { from: 'STM32F103C8T6', to: 'STM32F407VGT6', effort: 'Средний', notes: 'Миграция периферии. Разные register map. Требуется переработка startup.' },
      { from: 'STM32F407VGT6', to: 'STM32H743ZIT6', effort: 'Высокий', notes: 'Разная архитектура bus matrix. CubeMX migration обязательна. Перепроверить DMA.' },
    ],
  },
  {
    name: 'FPGA',
    icon: 'FPGA',
    notes: [
      {
        title: 'Timing Closure Risks',
        items: [
          'Spartan-6→Spartan-7: timing constraints пересчитываются. DCM заменены на MMCME2/PLLE2.',
          'Artix-7: для 200+ MHz designs требуется pipeline registers. Critical path через BRAM — добавить register stage.',
          'Kintex UltraScale+: multi-clock domain crossing требует synchronizer FIFO. Metastability analysis обязателен.',
        ],
      },
      {
        title: 'IO Bank Compatibility',
        items: [
          'Spartan-7: HP banks (1.2–1.8V) и HR banks (1.2–3.3V). Проверить VADJ для каждого bank.',
          'Artix-7: Bank 0 — config only. Bank 14/15 — HR, поддерживает 3.3V LVCMOS.',
          'UltraScale+: все banks HP (1.0–1.8V). Для 3.3V I/O нужен level shifter на плате.',
        ],
      },
      {
        title: 'Migration Constraints',
        items: [
          'Spartan-6→Spartan-7: нет прямой совместимости bitstream. Требуется полная перекомпиляция.',
          'Artix-7→Kintex-7: совместимы на RTL уровне, но resource utilization отличается. Проверить DSP/BRAM mapping.',
          'Xilinx→Intel: полностью несовместимы. IP migration вручную. Рекомендуем сохранять RTL без vendor IP.',
        ],
      },
      {
        title: 'Power Rail Implications',
        items: [
          'Artix-7: VCCINT 1.0V, VCCAUX 1.8V, VCCO per bank. Power sequencing: VCCINT → VCCAUX → VCCO.',
          'Spartan-7: VCCINT 1.0V. Quiescent current 50–100mA. Dynamic power зависит от toggle rate.',
          'UltraScale+: VCCINT 0.72V/0.85V. Требуется precision power supply с <5% ripple.',
        ],
      },
    ],
    migrationWarnings: [
      'Spartan-6 EOL: миграция на Spartan-7 обязательна для новых проектов. Bitstream несовместим.',
      'Zynq-7000 → Zynq UltraScale+: PS-часть полностью перерабатывается. PL migration через RTL re-synthesis.',
    ],
    compatibilityMatrix: [
      { from: 'XC6SLX9', to: 'XC7S6', effort: 'Средний', notes: 'RTL migration. DCM→MMCME2. Пересмотреть timing constraints.' },
      { from: 'XC7A35T', to: 'XC7K70T', effort: 'Низкий', notes: 'Совместимы на RTL. Проверить resource utilization и I/O voltage.' },
      { from: 'XC7K325T', to: 'XCKU040', effort: 'Высокий', notes: 'UltraScale architecture. Перекомпиляция + timing closure.' },
    ],
  },
  {
    name: 'Power IC',
    icon: 'PWR',
    notes: [
      {
        title: 'Thermal Derating',
        items: [
          'TPS5430: 3A nominal, derating от Ta=25°C: 3A до 85°C (с heatsink), 2A без heatsink при 70°C.',
          'LM2596: thermal resistance junction-to-ambient 50°C/W (TO-263). При 2A/5V output → ~1.5W dissipation → ΔT=75°C.',
          'Рекомендация: для ambient >60°C — внешний heatsink или снижение выходного тока на 30%.',
        ],
      },
      {
        title: 'Ripple Analysis',
        items: [
          'Buck converter output ripple: ΔVout = ΔIL/(8×fsw×Cout). Для TPS5430@500kHz, 10uF → ΔV≈15mV.',
          'Input ripple: Cin ≥ Iout×D/(fsw×ΔVin). Рекомендуется X5R/X7R ceramic + bulk electrolytic.',
          'PSRR: LDO после DC-DC снижает ripple на 60–80dB. Рекомендуем TPS7A4700 для noise-sensitive приложений.',
        ],
      },
      {
        title: 'Efficiency Curves',
        items: [
          'TPS5430: peak efficiency 92% при 12V→5V/1A. Efficiency drops <85% при load <100mA (pulse skip mode).',
          'LM2596: efficiency 80–88% в диапазоне 0.5–3A. При <100mA — PFM mode, повышенный output ripple.',
          'Рекомендация: для loads <200mA — LDO предпочтительнее DC-DC по шумовым характеристикам.',
        ],
      },
    ],
    migrationWarnings: [
      'TPS5430 → TPS54340: совместимый pinout, но частота 500kHz→570kHz. Пересчитать inductor и output capacitor.',
      'LM2596 → LM2596HV: высоковольтная версия до 60V input. Pin-to-pin совместима, но требуется больший input capacitor.',
    ],
    compatibilityMatrix: [
      { from: 'TPS5430DDAR', to: 'TPS54340BQDDARQ1', effort: 'Низкий', notes: 'Pin-to-pin. Пересчитать L/C. Automotive grade.' },
      { from: 'LM2596T-5.0', to: 'LM2596HVS-5.0', effort: 'Минимальный', notes: 'Direct replacement. HV version up to 60V input.' },
      { from: 'TPS7A4700', to: 'LT3042', effort: 'Средний', notes: 'Отличный pinout. Ultra-low-noise. Переработать layout.' },
    ],
  },
];

export default function EngineeringAuthority() {
  return (
    <section className="py-12 px-4 bg-white border-y border-[#e8e8e8]">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 1, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-3 border border-[#02a391]/30 rounded-full bg-[#02a391]/5 text-xs text-[#02a391] font-semibold">
            EEAT: Engineering Authority
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-[#121212] mb-3">Инженерная экспертиза</h2>
          <p className="text-[#666] text-sm max-w-3xl">
            Глубокая техническая информация для инженеров: миграция, совместимость, рекомендации по PCB layout,
            EMC, thermal management. Каждый раздел верифицирован инженерами ChipNet.
          </p>
        </motion.div>

        {/* Engineering Categories */}
        <div className="space-y-8">
          {engineeringData.map((category, catIdx) => (
            <motion.div
              key={category.name}
              initial={{ opacity: 1, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: catIdx * 0.1 }}
            >
              {/* Category Header */}
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-[#02a391]/10 rounded-lg flex items-center justify-center text-[#02a391] text-xs font-bold">
                  {category.icon}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#121212]">{category.name}</h3>
                  <p className="text-xs text-[#757575]">Engineering notes, migration paths, compatibility</p>
                </div>
              </div>

              {/* Notes Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                {category.notes.map((note) => (
                  <div key={note.title} className="bg-[#f8faf7] border border-[#e8e8e8] rounded-xl p-5 hover:border-[#02a391]/20 transition-all">
                    <h4 className="text-sm font-bold text-[#121212] mb-3 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-[#02a391] rounded-full" />
                      {note.title}
                    </h4>
                    <ul className="space-y-2">
                      {note.items.map((item, i) => (
                        <li key={i} className="text-xs text-[#444] leading-relaxed flex items-start gap-2">
                          <span className="shrink-0 mt-1 w-1 h-1 bg-[#02a391]/40 rounded-full" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              {/* Migration Warnings */}
              {category.migrationWarnings.length > 0 && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <svg className="w-4 h-4 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                    <h4 className="text-sm font-bold text-amber-800">Migration Warnings</h4>
                  </div>
                  <ul className="space-y-2">
                    {category.migrationWarnings.map((w, i) => (
                      <li key={i} className="text-xs text-amber-700 leading-relaxed flex items-start gap-2">
                        <span className="shrink-0 mt-0.5 text-amber-500">▸</span>
                        <span>{w}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Compatibility Matrix */}
              <div className="bg-white border border-[#e8e8e8] rounded-xl overflow-hidden">
                <div className="bg-[#f8faf7] border-b border-[#e8e8e8] px-4 py-2.5">
                  <h4 className="text-sm font-bold text-[#121212]">Compatibility Matrix</h4>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b border-[#e8e8e8]">
                        <th className="text-left py-2 px-4 text-[#666] font-medium">From</th>
                        <th className="text-left py-2 px-4 text-[#666] font-medium">To</th>
                        <th className="text-left py-2 px-4 text-[#666] font-medium">Усилия</th>
                        <th className="text-left py-2 px-4 text-[#666] font-medium">Примечания</th>
                      </tr>
                    </thead>
                    <tbody>
                      {category.compatibilityMatrix.map((row) => (
                        <tr key={row.from + row.to} className="border-b border-[#f0f0f0] hover:bg-[#f8faf7] transition-colors">
                          <td className="py-2 px-4 font-mono font-semibold text-[#121212]">{row.from}</td>
                          <td className="py-2 px-4 font-mono text-[#02a391]">{row.to}</td>
                          <td className="py-2 px-4">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                              row.effort === 'Минимальный' ? 'bg-emerald-50 text-emerald-700' :
                              row.effort === 'Низкий' ? 'bg-emerald-50 text-emerald-700' :
                              row.effort === 'Средний' ? 'bg-amber-50 text-amber-700' :
                              'bg-red-50 text-red-700'
                            }`}>{row.effort}</span>
                          </td>
                          <td className="py-2 px-4 text-[#555]">{row.notes}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

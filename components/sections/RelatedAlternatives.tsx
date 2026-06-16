'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

interface AlternativeItem {
  sku: string;
  name: string;
  brand: string;
  compatibility: 'Полная' | 'Частичная' | 'Функциональная';
  status: 'В производстве' | 'EOL' | 'NRND';
  leadTime: string;
}

interface UsersAlsoSourceItem {
  sku: string;
  name: string;
  category: string;
}

interface RelatedAlternativesProps {
  currentSku: string;
  currentBrand: string;
  currentCategory: string;
  alternatives?: AlternativeItem[];
  usersAlsoSource?: UsersAlsoSourceItem[];
  engineeringNotes?: string;
}

export default function RelatedAlternatives({
  currentSku,
  currentBrand,
  currentCategory,
  alternatives,
  usersAlsoSource,
  engineeringNotes,
}: RelatedAlternativesProps) {
  // Default alternatives if none provided
  const defaultAlternatives: Record<string, AlternativeItem[]> = {
    'STM32F103C8T6': [
      { sku: 'STM32F103CBT6', name: 'STM32F103CBT6', brand: 'STMicroelectronics', compatibility: 'Полная', status: 'В производстве', leadTime: '8–12 дн.' },
      { sku: 'STM32F103RBT6', name: 'STM32F103RBT6', brand: 'STMicroelectronics', compatibility: 'Полная', status: 'В производстве', leadTime: '10–14 дн.' },
      { sku: 'GD32F103C8T6', name: 'GD32F103C8T6', brand: 'GigaDevice', compatibility: 'Частичная', status: 'В производстве', leadTime: '6–10 дн.' },
    ],
    'STM32F407VGT6': [
      { sku: 'STM32F407VET6', name: 'STM32F407VET6', brand: 'STMicroelectronics', compatibility: 'Полная', status: 'В производстве', leadTime: '10–14 дн.' },
      { sku: 'STM32F427VIT6', name: 'STM32F427VIT6', brand: 'STMicroelectronics', compatibility: 'Функциональная', status: 'В производстве', leadTime: '12–16 дн.' },
      { sku: 'STM32H743ZIT6', name: 'STM32H743ZIT6', brand: 'STMicroelectronics', compatibility: 'Частичная', status: 'В производстве', leadTime: '14–18 дн.' },
    ],
  };

  const defaultUsersAlsoSource: Record<string, UsersAlsoSourceItem[]> = {
    'Микроконтроллеры': [
      { sku: 'STM32F103C8T6', name: 'ARM Cortex-M3 MCU', category: 'Микроконтроллеры' },
      { sku: 'ATMEGA328P-AU', name: 'AVR MCU 32KB', category: 'Микроконтроллеры' },
      { sku: 'ESP32-WROOM-32D', name: 'WiFi/BLE MCU', category: 'Микроконтроллеры' },
      { sku: 'GD32F103C8T6', name: 'ARM Cortex-M3 Clone', category: 'Микроконтроллеры' },
    ],
    'ПЛИС (FPGA)': [
      { sku: 'XC7A100T-1FTG256C', name: 'Artix-7 FPGA', category: 'ПЛИС (FPGA)' },
      { sku: 'EP4CE15F23C8N', name: 'Cyclone IV FPGA', category: 'ПЛИС (FPGA)' },
      { sku: 'XC6SLX9-3TQG144I', name: 'Spartan-6 FPGA', category: 'ПЛИС (FPGA)' },
      { sku: 'ICE40HX1K-VQ100', name: 'iCE40 FPGA', category: 'ПЛИС (FPGA)' },
    ],
    'Питание': [
      { sku: 'LM7805CT', name: '5V LDO Regulator', category: 'Питание' },
      { sku: 'LM2596T-5.0', name: '5V Step-Down', category: 'Питание' },
      { sku: 'TPS7A4700RGWR', name: 'Ultra-Low-Noise LDO', category: 'Питание' },
      { sku: 'TPS54331DR', name: '3A Step-Down Converter', category: 'Питание' },
    ],
  };

  const alts = alternatives || defaultAlternatives[currentSku] || [];
  const alsoSource = usersAlsoSource || defaultUsersAlsoSource[currentCategory] || [];

  const compatibilityColor = (c: string) => {
    switch (c) {
      case 'Полная': return 'bg-emerald-100 text-emerald-700';
      case 'Частичная': return 'bg-amber-100 text-amber-700';
      case 'Функциональная': return 'bg-blue-100 text-blue-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  if (alts.length === 0 && alsoSource.length === 0) return null;

  return (
    <div className="space-y-6">
      {/* Alternatives Matrix */}
      {alts.length > 0 && (
        <motion.div
          initial={{ opacity: 1, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h3 className="text-lg font-bold text-[#121212] mb-3 flex items-center gap-2">
            <svg className="w-5 h-5 text-[#02a391]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
            </svg>
            Аналоги и кросс-референсы для {currentSku}
          </h3>
          <div className="bg-white border border-[#e8e8e8] rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[#f8faf7] border-b border-[#e8e8e8]">
                  <th className="text-left py-3 px-4 text-[#666] font-medium">SKU</th>
                  <th className="text-left py-3 px-4 text-[#666] font-medium">Бренд</th>
                  <th className="text-left py-3 px-4 text-[#666] font-medium">Совместимость</th>
                  <th className="text-left py-3 px-4 text-[#666] font-medium">Статус</th>
                  <th className="text-left py-3 px-4 text-[#666] font-medium">Lead Time</th>
                  <th className="text-left py-3 px-4 text-[#666] font-medium"></th>
                </tr>
              </thead>
              <tbody>
                {alts.map((alt) => (
                  <tr key={alt.sku} className="border-b border-[#f0f0f0] hover:bg-[#f8faf7] transition-colors">
                    <td className="py-3 px-4">
                      <Link href={`/component/${alt.sku}`} className="font-mono font-semibold text-[#02a391] hover:underline">
                        {alt.sku}
                      </Link>
                    </td>
                    <td className="py-3 px-4 text-[#333]">{alt.brand}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${compatibilityColor(alt.compatibility)}`}>
                        {alt.compatibility}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        alt.status === 'В производстве' ? 'bg-emerald-50 text-emerald-700' :
                        alt.status === 'EOL' ? 'bg-red-50 text-red-700' :
                        'bg-amber-50 text-amber-700'
                      }`}>
                        {alt.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-[#333]">{alt.leadTime}</td>
                    <td className="py-3 px-4">
                      <a href="/#bom" className="text-xs text-[#02a391] hover:underline font-semibold">Запросить КП</a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {engineeringNotes && (
            <div className="mt-3 p-4 bg-blue-50 border border-blue-100 rounded-lg">
              <div className="flex items-start gap-2">
                <svg className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-xs text-blue-700 leading-relaxed">{engineeringNotes}</p>
              </div>
            </div>
          )}
        </motion.div>
      )}

      {/* Users Also Source */}
      {alsoSource.length > 0 && (
        <motion.div
          initial={{ opacity: 1, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.15 }}
        >
          <h3 className="text-lg font-bold text-[#121212] mb-3 flex items-center gap-2">
            <svg className="w-5 h-5 text-[#02a391]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            Клиенты также закупают
          </h3>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {alsoSource.map((item) => (
              <Link
                key={item.sku}
                href={`/component/${item.sku}`}
                className="group bg-white border border-[#e8e8e8] rounded-lg p-4 hover:border-[#02a391]/30 hover:shadow-md transition-all"
              >
                <div className="font-mono text-sm font-bold text-[#02a391] group-hover:underline mb-1">{item.sku}</div>
                <div className="text-xs text-[#666] mb-2">{item.name}</div>
                <div className="text-[10px] text-[#757575] px-2 py-0.5 bg-[#f8faf7] rounded-full inline-block">{item.category}</div>
              </Link>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}

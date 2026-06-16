'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

interface UserJourneyPromptsProps {
  currentSku: string;
  category: string;
  status: string;
  hasAlternatives: boolean;
}

export default function UserJourneyPrompts({ currentSku, category, status, hasAlternatives }: UserJourneyPromptsProps) {
  // Determine urgency and context
  const isEol = status === 'EOL';
  const isShortage = currentSku.includes('XC7K') || currentSku.includes('XC7A') || currentSku.includes('XC6S');
  const isFpga = category === 'ПЛИС (FPGA)';
  const isMc = category === 'Микроконтроллеры';

  const prompts = [];

  // Urgency indicators
  if (isEol) {
    prompts.push({
      type: 'urgent' as const,
      icon: '⚠️',
      title: 'Компонент снят с производства',
      text: `${currentSku} больше не выпускается. Рекомендуем немедленно подобрать аналог для обеспечения непрерывности производства.`,
      cta: 'Подобрать аналог',
      href: `/analog/${currentSku.toLowerCase()}`,
    });
  }

  if (isShortage) {
    prompts.push({
      type: 'alert' as const,
      icon: '🔴',
      title: 'Дефицит на рынке',
      text: `${currentSku} испытывает рыночный дефицит. Заблаговременное планирование закупок снижает риски остановки производства.`,
      cta: 'Запросить аллокацию',
      href: '/#bom',
    });
  }

  // Sourcing recommendations
  if (hasAlternatives) {
    prompts.push({
      type: 'suggestion' as const,
      icon: '💡',
      title: 'Рекомендуем рассмотреть аналоги',
      text: 'Наши инженеры проверили совместимость и могут предложить альтернативные компоненты с подтверждённой кросс-референцией.',
      cta: 'Смотреть аналоги',
      href: `/analog/${currentSku.toLowerCase()}`,
    });
  }

  // Category-specific procurement suggestions
  if (isFpga) {
    prompts.push({
      type: 'suggestion' as const,
      icon: '🔧',
      title: 'Инженерная поддержка FPGA',
      text: 'Миграция между семействами FPGA требует анализа таймингов, ограничений и совместимости периферии. Наши инженеры помогут оценить риски.',
      cta: 'Запросить консультацию',
      href: '/#bom',
    });
  }

  if (isMc) {
    prompts.push({
      type: 'suggestion' as const,
      icon: '🔄',
      title: 'Подбор MCU под ваш проект',
      text: 'Поможем выбрать микроконтроллер с учётом требований по периферии, питанию, корпусу и доступности на рынке.',
      cta: 'Подобрать MCU',
      href: '/#bom',
    });
  }

  // Always add BOM suggestion
  prompts.push({
    type: 'action' as const,
    icon: '📦',
    title: 'Комплектация BOM',
    text: 'Отправьте спецификацию — проанализируем все позиции, проверим наличие и подготовим КП с оптимальными условиями.',
    cta: 'Загрузить BOM',
    href: '/#bom',
  });

  if (prompts.length === 0) return null;

  const typeStyles = {
    urgent: 'bg-red-50 border-red-200 hover:border-red-300',
    alert: 'bg-amber-50 border-amber-200 hover:border-amber-300',
    suggestion: 'bg-blue-50 border-blue-100 hover:border-blue-200',
    action: 'bg-[#02a391]/5 border-[#02a391]/15 hover:border-[#02a391]/30',
  };

  const ctaStyles = {
    urgent: 'bg-red-600 hover:bg-red-700',
    alert: 'bg-amber-600 hover:bg-amber-700',
    suggestion: 'bg-[#02a391] hover:bg-[#02907f]',
    action: 'bg-[#02a391] hover:bg-[#02907f]',
  };

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-bold text-[#121212] flex items-center gap-2">
        <svg className="w-5 h-5 text-[#02a391]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
        Рекомендации по закупке
      </h3>
      {prompts.map((prompt, idx) => (
        <motion.div
          key={prompt.title}
          initial={{ opacity: 1, x: 0 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3, delay: idx * 0.1 }}
          className={`border rounded-xl p-4 transition-all ${typeStyles[prompt.type]}`}
        >
          <div className="flex items-start gap-3">
            <span className="text-lg shrink-0">{prompt.icon}</span>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-bold text-[#121212] mb-1">{prompt.title}</h4>
              <p className="text-xs text-[#444] leading-relaxed mb-2">{prompt.text}</p>
              <Link
                href={prompt.href}
                className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-white transition-all ${ctaStyles[prompt.type]}`}
              >
                {prompt.cta}
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

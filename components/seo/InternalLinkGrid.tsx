import Link from 'next/link';
import React from 'react';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface InternalLink {
  label: string;
  href: string;
  description: string;
  weight?: number; // 1-10, higher = more prominent
  type?: 'brand' | 'category' | 'analog' | 'component' | 'info' | 'hub' | 'rfq' | 'bom';
  /** Intent match score (0-1): how well this link matches the page's search intent */
  intentMatch?: number;
  /** Conversion probability (0-1): likelihood this link leads to RFQ/BOM */
  conversionProbability?: number;
  /** Entity overlap (0-1): semantic overlap with current page's entity */
  entityOverlap?: number;
}

export interface InternalLinkGridProps {
  title: string;
  links: InternalLink[];
  maxDisplay?: number;
  columns?: 2 | 3 | 4;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const BASE_URL = 'https://www.chip-net.ru';

const TYPE_STYLES: Record<
  NonNullable<InternalLink['type']>,
  { badge: string; badgeText: string; icon: string }
> = {
  brand: {
    badge: 'bg-primary/15 text-primary',
    badgeText: 'Бренд',
    icon: '🏭',
  },
  category: {
    badge: 'bg-amber-100 text-amber-700',
    badgeText: 'Категория',
    icon: '📁',
  },
  analog: {
    badge: 'bg-sky-100 text-sky-700',
    badgeText: 'Аналог',
    icon: '🔄',
  },
  component: {
    badge: 'bg-emerald-100 text-emerald-700',
    badgeText: 'Компонент',
    icon: '🔌',
  },
  info: {
    badge: 'bg-gray-100 text-gray-600',
    badgeText: 'Справка',
    icon: 'ℹ️',
  },
  hub: {
    badge: 'bg-emerald-100 text-emerald-700',
    badgeText: 'Хаб',
    icon: '🏗️',
  },
  rfq: {
    badge: 'bg-rose-100 text-rose-700',
    badgeText: 'КП',
    icon: '📋',
  },
  bom: {
    badge: 'bg-violet-100 text-violet-700',
    badgeText: 'BOM',
    icon: '📦',
  },
};

// ---------------------------------------------------------------------------
// JSON-LD: BreadcrumbList
// ---------------------------------------------------------------------------

function BreadcrumbListJsonLd({ links }: { links: InternalLink[] }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Главная',
        item: BASE_URL,
      },
      ...links.slice(0, 10).map((link, idx) => ({
        '@type': 'ListItem',
        position: idx + 2,
        name: link.label,
        item: link.href.startsWith('http') ? link.href : `${BASE_URL}${link.href}`,
      })),
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// ---------------------------------------------------------------------------
// Weight-based styling helpers
// ---------------------------------------------------------------------------

function getWeightClasses(weight: number): {
  card: string;
  title: string;
  desc: string;
} {
  if (weight >= 8) {
    return {
      card: 'bg-gradient-to-br from-primary/[0.08] to-primary/[0.02] border-primary/25 shadow-md hover:shadow-lg ring-1 ring-primary/10',
      title: 'text-base md:text-lg font-bold',
      desc: 'text-sm',
    };
  }
  if (weight >= 5) {
    return {
      card: 'bg-card border-[#d4ddd2] shadow-sm hover:shadow-md',
      title: 'text-sm md:text-base font-bold',
      desc: 'text-xs md:text-sm',
    };
  }
  return {
    card: 'bg-background/60 border-[#e8e8e8] hover:border-[#d4ddd2] shadow-none hover:shadow-sm',
    title: 'text-sm font-semibold',
    desc: 'text-xs',
  };
}

// ---------------------------------------------------------------------------
// Link card
// ---------------------------------------------------------------------------

function LinkCard({ link }: { link: InternalLink }) {
  const weight = link.weight ?? 5;
  const typeInfo = TYPE_STYLES[link.type ?? 'component'];
  const styles = getWeightClasses(weight);
  const isHighWeight = weight >= 8;

  return (
    <Link
      href={link.href}
      className={`group block rounded-xl border p-4 transition-all duration-200 ${styles.card}`}
      rel={link.type === 'info' ? 'nofollow' : undefined}
    >
      {/* Badge + icon row */}
      <div className="flex items-center gap-2 mb-2">
        <span className="text-base" aria-hidden="true">
          {typeInfo.icon}
        </span>
        <span
          className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${typeInfo.badge}`}
        >
          {typeInfo.badgeText}
        </span>
        {isHighWeight && (
          <span className="ml-auto flex items-center gap-1 text-[10px] font-semibold text-primary">
            <svg
              className="w-3 h-3"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
              />
            </svg>
            Топ
          </span>
        )}
      </div>

      {/* Title */}
      <h3
        className={`text-[#121212] group-hover:text-primary transition-colors leading-snug mb-1 ${styles.title}`}
      >
        {link.label}
      </h3>

      {/* Description */}
      <p className={`text-muted leading-relaxed ${styles.desc}`}>
        {link.description}
      </p>

      {/* Arrow indicator */}
      <div className="mt-2 flex items-center gap-1 text-primary text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity">
        <span>Перейти</span>
        <svg
          className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17 8l4 4m0 0l-4 4m4-4H3"
          />
        </svg>
      </div>
    </Link>
  );
}

// ---------------------------------------------------------------------------
// Main component: InternalLinkGrid
// ---------------------------------------------------------------------------

export default function InternalLinkGrid({
  title,
  links,
  maxDisplay,
  columns = 3,
}: InternalLinkGridProps) {
  const sorted = [...links].sort((a, b) => {
    // Composite score: intent_match + conversion_probability + entity_overlap (weighted)
    const scoreA = (a.intentMatch ?? 0.5) * 0.4 + (a.conversionProbability ?? 0.3) * 0.35 + (a.entityOverlap ?? 0.5) * 0.25;
    const scoreB = (b.intentMatch ?? 0.5) * 0.4 + (b.conversionProbability ?? 0.3) * 0.35 + (b.entityOverlap ?? 0.5) * 0.25;
    if (Math.abs(scoreB - scoreA) > 0.01) return scoreB - scoreA;
    const wa = a.weight ?? 5;
    const wb = b.weight ?? 5;
    if (wb !== wa) return wb - wa;
    return a.label.localeCompare(b.label, 'ru');
  });

  const displayed = maxDisplay ? sorted.slice(0, maxDisplay) : sorted;
  const hiddenCount = sorted.length - displayed.length;

  const gridCols: Record<2 | 3 | 4, string> = {
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
  };

  return (
    <nav aria-label={title} className="rounded-xl border border-[#d4ddd2] bg-card p-5 md:p-6">
      <BreadcrumbListJsonLd links={displayed} />

      <h2 className="text-lg md:text-xl font-bold text-[#121212] mb-4 flex items-center gap-2">
        <svg
          className="w-5 h-5 text-primary shrink-0"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
          />
        </svg>
        {title}
      </h2>

      <div className={`grid ${gridCols[columns]} gap-3`}>
        {displayed.map((link) => (
          <LinkCard key={link.href} link={link} />
        ))}
      </div>

      {hiddenCount > 0 && (
        <p className="mt-4 text-xs text-muted text-center">
          Ещё {hiddenCount}{' '}
          {hiddenCount === 1
            ? 'ссылка'
            : hiddenCount >= 2 && hiddenCount <= 4
              ? 'ссылки'
              : 'ссылок'}{' '}
          доступно в полном каталоге
        </p>
      )}
    </nav>
  );
}

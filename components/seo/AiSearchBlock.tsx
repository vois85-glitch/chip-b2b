import React from 'react';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface DirectAnswerProps {
  question: string;
  answer: string;
  sources?: string[];
}

export interface ComparisonTableProps {
  title: string;
  headers: string[];
  rows: string[][];
  caption: string;
}

export interface Alternate {
  sku: string;
  brand: string;
  compatibility: string;
}

export interface KeySpecsTableProps {
  component: string;
  specs: Record<string, string>;
  alternates?: Alternate[];
}

export interface QuickFact {
  label: string;
  value: string;
}

export interface QuickFactsProps {
  facts: QuickFact[];
}

export interface AiSummaryBoxProps {
  title: string;
  summary: string;
  keyPoints: string[];
}

export type AiSearchBlockType =
  | 'DirectAnswer'
  | 'ComparisonTable'
  | 'KeySpecsTable'
  | 'QuickFacts'
  | 'AiSummaryBox';

export interface AiSearchBlockProps {
  type: AiSearchBlockType;
  // DirectAnswer
  question?: string;
  answer?: string;
  sources?: string[];
  // ComparisonTable
  title?: string;
  headers?: string[];
  rows?: string[][];
  caption?: string;
  // KeySpecsTable
  component?: string;
  specs?: Record<string, string>;
  alternates?: Alternate[];
  // QuickFacts
  facts?: QuickFact[];
  // AiSummaryBox
  summary?: string;
  keyPoints?: string[];
}

const BASE_URL = 'https://www.chip-net.ru';

// ---------------------------------------------------------------------------
// JSON-LD helpers
// ---------------------------------------------------------------------------

function FaqPageJsonLd({ question, answer }: { question: string; answer: string }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: answer,
        },
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

function ItemListJsonLd({ title, headers, rows }: { title: string; headers: string[]; rows: string[][] }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: title,
    itemListElement: rows.map((row, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      name: row[0],
      description: headers
        .slice(1)
        .map((h, i) => `${h}: ${row[i + 1]}`)
        .join('; '),
      url: `${BASE_URL}/catalog?search=${encodeURIComponent(row[0])}`,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

function ProductJsonLd({
  component,
  specs,
  alternates,
}: {
  component: string;
  specs: Record<string, string>;
  alternates?: Alternate[];
}) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: component,
    description: Object.entries(specs)
      .map(([k, v]) => `${k}: ${v}`)
      .join('; '),
    brand: {
      '@type': 'Brand',
      name: specs['Производитель'] || specs['Бренд'] || specs['Manufacturer'] || 'Unknown',
    },
    sku: specs['Артикул'] || specs['SKU'] || specs['Part Number'] || component,
    offers: {
      '@type': 'Offer',
      availability: 'https://schema.org/InStock',
      seller: {
        '@type': 'Organization',
        name: 'ChipNet',
      },
    },
    ...(alternates && alternates.length > 0
      ? {
          isSimilarTo: alternates.map((alt) => ({
            '@type': 'Product',
            name: alt.sku,
            brand: { '@type': 'Brand', name: alt.brand },
            description: alt.compatibility,
          })),
        }
      : {}),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// ---------------------------------------------------------------------------
// Sub-component: DirectAnswer
// ---------------------------------------------------------------------------

function DirectAnswer({ question, answer, sources }: DirectAnswerProps) {
  return (
    <section
      aria-labelledby="direct-answer-heading"
      className="rounded-xl border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-card p-5 md:p-6"
    >
      <FaqPageJsonLd question={question} answer={answer} />

      <h2
        id="direct-answer-heading"
        className="text-lg md:text-xl font-bold text-[#121212] mb-3 flex items-start gap-2"
      >
        <svg
          className="w-5 h-5 mt-0.5 shrink-0 text-primary"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
          />
        </svg>
        {question}
      </h2>

      <p className="text-[#333] text-sm md:text-base leading-relaxed mb-3">{answer}</p>

      {sources && sources.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-primary/10">
          <span className="text-xs text-muted font-medium">Источники:</span>
          {sources.map((src, i) => (
            <a
              key={i}
              href={src}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-primary hover:text-primary-dark underline underline-offset-2 transition-colors"
            >
              {new URL(src).hostname.replace('www.', '')}
            </a>
          ))}
        </div>
      )}
    </section>
  );
}

// ---------------------------------------------------------------------------
// Sub-component: ComparisonTable
// ---------------------------------------------------------------------------

function ComparisonTable({ title, headers, rows, caption }: ComparisonTableProps) {
  return (
    <section aria-labelledby="comparison-heading" className="rounded-xl border border-[#d4ddd2] bg-card p-5 md:p-6">
      <ItemListJsonLd title={title} headers={headers} rows={rows} />

      <h2
        id="comparison-heading"
        className="text-lg md:text-xl font-bold text-[#121212] mb-4"
      >
        {title}
      </h2>

      <div className="overflow-x-auto -mx-2 px-2">
        <table className="w-full text-sm border-collapse">
          <caption className="sr-only">{caption}</caption>
          <thead>
            <tr className="bg-primary/10">
              {headers.map((header, i) => (
                <th
                  key={i}
                  scope="col"
                  className="px-3 py-2.5 text-left font-semibold text-[#121212] border-b-2 border-primary/30 whitespace-nowrap"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, ri) => (
              <tr
                key={ri}
                className={ri % 2 === 0 ? 'bg-card' : 'bg-section/50'}
              >
                {row.map((cell, ci) => (
                  <td
                    key={ci}
                    className={`px-3 py-2.5 border-b border-[#e8e8e8] whitespace-nowrap ${
                      ci === 0 ? 'font-medium text-[#121212]' : 'text-[#555]'
                    }`}
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="mt-3 text-xs text-muted">{caption}</p>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Sub-component: KeySpecsTable
// ---------------------------------------------------------------------------

function KeySpecsTable({ component, specs, alternates }: KeySpecsTableProps) {
  const specEntries = Object.entries(specs);

  return (
    <section aria-labelledby="keyspecs-heading" className="rounded-xl border border-[#d4ddd2] bg-card p-5 md:p-6">
      <ProductJsonLd component={component} specs={specs} alternates={alternates} />

      <h2
        id="keyspecs-heading"
        className="text-lg md:text-xl font-bold text-[#121212] mb-4"
      >
        {component} — характеристики
      </h2>

      {/* Specs table */}
      <div className="overflow-x-auto -mx-2 px-2 mb-5">
        <table className="w-full text-sm border-collapse">
          <caption className="sr-only">
            Основные характеристики {component}
          </caption>
          <thead>
            <tr className="bg-primary/10">
              <th scope="col" className="px-3 py-2.5 text-left font-semibold text-[#121212] border-b-2 border-primary/30 w-2/5">
                Параметр
              </th>
              <th scope="col" className="px-3 py-2.5 text-left font-semibold text-[#121212] border-b-2 border-primary/30">
                Значение
              </th>
            </tr>
          </thead>
          <tbody>
            {specEntries.map(([key, value], i) => (
              <tr key={i} className={i % 2 === 0 ? 'bg-card' : 'bg-section/50'}>
                <td className="px-3 py-2.5 border-b border-[#e8e8e8] font-medium text-[#121212]">
                  {key}
                </td>
                <td className="px-3 py-2.5 border-b border-[#e8e8e8] text-[#555]">
                  {value}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Alternates table */}
      {alternates && alternates.length > 0 && (
        <>
          <h3 className="text-base font-bold text-[#121212] mb-3 flex items-center gap-2">
            <svg
              className="w-4 h-4 text-primary"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
              />
            </svg>
            Аналоги и замены
          </h3>
          <div className="overflow-x-auto -mx-2 px-2">
            <table className="w-full text-sm border-collapse">
              <caption className="sr-only">
                Аналоги для {component}
              </caption>
              <thead>
                <tr className="bg-primary/10">
                  <th scope="col" className="px-3 py-2.5 text-left font-semibold text-[#121212] border-b-2 border-primary/30">
                    Артикул
                  </th>
                  <th scope="col" className="px-3 py-2.5 text-left font-semibold text-[#121212] border-b-2 border-primary/30">
                    Бренд
                  </th>
                  <th scope="col" className="px-3 py-2.5 text-left font-semibold text-[#121212] border-b-2 border-primary/30">
                    Совместимость
                  </th>
                </tr>
              </thead>
              <tbody>
                {alternates.map((alt, i) => (
                  <tr key={i} className={i % 2 === 0 ? 'bg-card' : 'bg-section/50'}>
                    <td className="px-3 py-2.5 border-b border-[#e8e8e8] font-medium text-primary">
                      <a
                        href={`/component/${encodeURIComponent(alt.sku)}`}
                        className="hover:underline"
                      >
                        {alt.sku}
                      </a>
                    </td>
                    <td className="px-3 py-2.5 border-b border-[#e8e8e8] text-[#555]">
                      {alt.brand}
                    </td>
                    <td className="px-3 py-2.5 border-b border-[#e8e8e8] text-[#555]">
                      {alt.compatibility}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </section>
  );
}

// ---------------------------------------------------------------------------
// Sub-component: QuickFacts
// ---------------------------------------------------------------------------

function QuickFacts({ facts }: QuickFactsProps) {
  return (
    <section aria-label="Ключевые факты" className="rounded-xl border border-[#d4ddd2] bg-card p-5 md:p-6">
      <dl className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-3">
        {facts.map((fact, i) => (
          <div
            key={i}
            className="flex flex-col gap-0.5 p-3 rounded-lg bg-background/60 border border-[#e8e8e8]"
          >
            <dt className="text-xs font-semibold uppercase tracking-wide text-muted">
              {fact.label}
            </dt>
            <dd className="text-sm md:text-base font-medium text-[#121212]">
              {fact.value}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Sub-component: AiSummaryBox
// ---------------------------------------------------------------------------

function AiSummaryBox({ title, summary, keyPoints }: AiSummaryBoxProps) {
  return (
    <aside
      role="complementary"
      aria-label={`AI-сводка: ${title}`}
      className="rounded-xl border-2 border-primary/15 bg-gradient-to-br from-primary/[0.04] to-card p-5 md:p-6"
    >
      <div className="flex items-center gap-2 mb-3">
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
            d="M13 10V3L4 14h7v7l9-11h-7z"
          />
        </svg>
        <h2 className="text-lg md:text-xl font-bold text-[#121212]">
          {title}
        </h2>
      </div>

      <p className="text-[#333] text-sm md:text-base leading-relaxed mb-4">
        {summary}
      </p>

      {keyPoints.length > 0 && (
        <ul className="space-y-2" role="list">
          {keyPoints.map((point, i) => (
            <li
              key={i}
              className="flex items-start gap-2 text-sm text-[#444]"
            >
              <svg
                className="w-4 h-4 mt-0.5 shrink-0 text-primary"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span>{point}</span>
            </li>
          ))}
        </ul>
      )}
    </aside>
  );
}

// ---------------------------------------------------------------------------
// Main component: AiSearchBlock
// ---------------------------------------------------------------------------

export default function AiSearchBlock(props: AiSearchBlockProps) {
  switch (props.type) {
    case 'DirectAnswer':
      return (
        <DirectAnswer
          question={props.question ?? ''}
          answer={props.answer ?? ''}
          sources={props.sources}
        />
      );

    case 'ComparisonTable':
      return (
        <ComparisonTable
          title={props.title ?? ''}
          headers={props.headers ?? []}
          rows={props.rows ?? []}
          caption={props.caption ?? ''}
        />
      );

    case 'KeySpecsTable':
      return (
        <KeySpecsTable
          component={props.component ?? ''}
          specs={props.specs ?? {}}
          alternates={props.alternates}
        />
      );

    case 'QuickFacts':
      return <QuickFacts facts={props.facts ?? []} />;

    case 'AiSummaryBox':
      return (
        <AiSummaryBox
          title={props.title ?? ''}
          summary={props.summary ?? ''}
          keyPoints={props.keyPoints ?? []}
        />
      );

    default:
      return null;
  }
}

// Re-export individual sub-components for direct usage
export { DirectAnswer, ComparisonTable, KeySpecsTable, QuickFacts, AiSummaryBox };

import Link from 'next/link';

interface Spec {
  label: string;
  value: string;
}

interface Alternative {
  name: string;
  href: string;
}

interface DirectAnswerBlockProps {
  question: string;
  answer: string;
  specs?: Spec[];
  alternatives?: Alternative[];
}

export default function DirectAnswerBlock({ question, answer, specs, alternatives }: DirectAnswerBlockProps) {
  // Build JSON-LD structured data for Question + Answer schema
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Question',
    name: question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: answer,
    },
  };

  return (
    <div className="rounded-2xl border border-[#d4ddd2] bg-gradient-to-r from-primary/5 to-transparent overflow-hidden">
      {/* Green left border accent */}
      <div className="flex">
        <div className="w-1 shrink-0 bg-primary rounded-l-2xl" />

        <div className="flex-1 px-6 py-5">
          {/* Question as h3 with schema */}
          <h3 className="text-lg font-bold text-[#121212] mb-3">
            {question}
          </h3>

          {/* Direct Answer — bold, prominent */}
          <p className="text-base text-[#121212] font-semibold leading-relaxed mb-4">
            {answer}
          </p>

          {/* Structured specs table */}
          {specs && specs.length > 0 && (
            <div className="mb-4">
              <table className="w-full max-w-md text-sm">
                <tbody>
                  {specs.map((spec) => (
                    <tr key={spec.label} className="border-b border-[#e8e8e8] last:border-0">
                      <td className="py-1.5 pr-4 text-[#555] whitespace-nowrap">
                        {spec.label}
                      </td>
                      <td className="py-1.5 font-medium text-[#121212]">
                        {spec.value}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Recommended alternatives */}
          {alternatives && alternatives.length > 0 && (
            <div>
              <p className="text-xs text-[#555] mb-2 font-medium">Рекомендуемые альтернативы:</p>
              <div className="flex flex-wrap gap-2">
                {alternatives.map((alt) => (
                  <Link
                    key={alt.name}
                    href={alt.href}
                    className="inline-flex items-center gap-1 text-xs px-3 py-1.5 rounded-full bg-white border border-[#d4ddd2] text-[#121212] hover:bg-primary/10 hover:border-primary/30 hover:text-primary transition-colors"
                  >
                    <svg className="w-3 h-3 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                    {alt.name}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* JSON-LD for Question + Answer schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </div>
  );
}

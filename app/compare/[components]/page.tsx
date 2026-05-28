import { Metadata } from 'next';
import Link from 'next/link';
import { findAnalogs, findComparisons, comparisonGroups, findCluster, componentClusters } from '@/lib/semantic-data';
import { supabase } from '@/lib/supabase';

const BASE_URL = 'https://www.chip-net.ru';

export const revalidate = 3600;

type ComponentData = {
  sku: string;
  name: string;
  brand: string;
  category: string;
  description: string;
  specs: Record<string, string>;
};

type Props = {
  params: Promise<{ components: string }>;
};

export async function generateStaticParams() {
  return comparisonGroups.map((group) => ({
    components: group.components.join(','),
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { components } = await params;
  const parts = components.split(',').map((c) => c.trim().toUpperCase());
  const comp1 = parts[0] || '';
  const comp2 = parts[1] || '';

  const cluster1 = findCluster(comp1);
  const cluster2 = findCluster(comp2);

  const name1 = cluster1?.familyName || comp1;
  const name2 = cluster2?.familyName || comp2;

  const title = `Сравнение ${comp1} и ${comp2} — характеристики, отличия, выбор | ChipNet`;
  const description = `Детальное сравнение ${comp1} (${cluster1?.brand || ''}) и ${comp2} (${cluster2?.brand || ''}): технические характеристики, совместимость, когда выбрать каждый вариант. Экспертный анализ от ChipNet.`;
  const url = `${BASE_URL}/compare/${components}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type: 'website',
      locale: 'ru_RU',
      siteName: 'ChipNet',
    },
  };
}

async function getComponentData(sku: string): Promise<ComponentData | null> {
  // Try Supabase first
  try {
    const { data } = await supabase
      .from('components')
      .select('sku, name, brand, category, description, specs')
      .ilike('sku', sku)
      .limit(1)
      .maybeSingle();

    if (data) {
      return data as ComponentData;
    }
  } catch {
    // Supabase not available, fall back to semantic data
  }

  // Fall back to semantic data
  const cluster = findCluster(sku);
  if (cluster) {
    return {
      sku,
      name: cluster.familyName,
      brand: cluster.brand,
      category: cluster.category,
      description: cluster.description,
      specs: cluster.specs,
    };
  }

  return null;
}

const faqData: Record<string, { question: string; answer: string }[]> = {
  default: [
    {
      question: 'Насколько полностью совместимы эти компоненты?',
      answer: 'Степень совместимости зависит от конкретной пары компонентов. Pin-to-pin совместимые аналоги позволяют замену без перекладки платы, однако могут отличаться временные параметры, энергопотребление и поведение отдельных периферийных блоков. Рекомендуем проводить верификацию на опытной партии перед серийным внедрением. Инженеры ChipNet помогут оценить риски миграции и подготовить план тестирования.',
    },
    {
      question: 'Нужна ли перекладка платы при замене одного компонента на другой?',
      answer: 'Если компоненты имеют совместимость pin-to-pin, перекладка платы не требуется — выводы расположены идентично. Однако при функциональной эквивалентности (functional-equivalent) может потребоваться переработка обвязки: изменение номиналов внешних компонентов, добавление фильтрующих конденсаторов или изменение цепей питания. Наши инженеры проанализируют схему и подготовят рекомендации по адаптации.',
    },
    {
      question: 'Как проверить оригинальность компонентов при замене?',
      answer: 'Все компоненты, поставляемые ChipNet, проходят входной контроль в аккредитованной лаборатории СВП. Процедура включает визуальный контроль маркировки, рентгеноскопию внутренней структуры, электрические тесты параметров и опционально декапсуляцию для верификации кристалла. По результатам формируется отчёт о входном контроле, который предоставляется заказчику вместе с партией.',
    },
    {
      question: 'Какие компоненты доступны без санкционных ограничений?',
      answer: 'Компоненты китайских производителей (Gigadevice, Gowin, WCH, HKMicro, Artery, Everlight, XLSEMI) доступны для поставок без ограничений. Компоненты Lattice также доступны — компания не подпадает под экспортные ограничения для РФ. Компоненты Xilinx, Intel/Altera, Analog Devices, Texas Instruments и ряд других производителей подлежат санкционным ограничениям, но возможна поставка через альтернативные каналы.',
    },
    {
      question: 'Можно ли заказать оба компонента для сравнительного тестирования?',
      answer: 'Да, ChipNet предоставляет возможность заказать оба компонента для сравнительного тестирования на опытной партии. Мы рекомендуем приобрести по 10–50 штук каждого варианта для проведения полного цикла верификации: функциональное тестирование, климатические испытания, проверка электромагнитной совместимости. По результатам вы сможете принять обоснованное решение о выборе компонента для серийного производства.',
    },
  ],
};

export default async function ComparePage({ params }: Props) {
  const { components } = await params;
  const parts = components.split(',').map((c) => c.trim().toUpperCase());
  const comp1 = parts[0] || '';
  const comp2 = parts[1] || '';

  const data1 = await getComponentData(comp1);
  const data2 = await getComponentData(comp2);

  const analog1 = findAnalogs(comp1);
  const analog2 = findAnalogs(comp2);

  const comparisons1 = findComparisons(comp1);
  const comparisons2 = findComparisons(comp2);
  const relatedComparisons = [...comparisons1, ...comparisons2].filter(
    (c, i, arr) => arr.findIndex((x) => x.slug === c.slug) === i && !(c.components.includes(comp1) && c.components.includes(comp2))
  ).slice(0, 6);

  const cluster1 = findCluster(comp1);
  const cluster2 = findCluster(comp2);

  const useCases1 = cluster1?.applications || analog1?.replacements?.[0]?.notes?.split(', ') || ['Промышленная автоматика', 'Управление моторами', 'Потребительская электроника'];
  const useCases2 = cluster2?.applications || analog2?.replacements?.[0]?.notes?.split(', ') || ['Импортозамещение', 'Бюджетные решения', 'Массовое производство'];

  // Build comparison specs
  const allSpecKeys = new Set<string>();
  if (data1?.specs) Object.keys(data1.specs).forEach((k) => allSpecKeys.add(k));
  if (data2?.specs) Object.keys(data2.specs).forEach((k) => allSpecKeys.add(k));

  const faqItems = faqData.default;

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Главная', item: BASE_URL },
      { '@type': 'ListItem', position: 2, name: 'Сравнение', item: `${BASE_URL}/compare` },
      { '@type': 'ListItem', position: 3, name: `${comp1} vs ${comp2}`, item: `${BASE_URL}/compare/${components}` },
    ],
  };

  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqItems.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
      />
      <main className="min-h-screen bg-background text-[#121212]">
        {/* Hero */}
        <section className="pt-32 pb-16 px-4">
          <div className="max-w-7xl mx-auto">
            <nav className="text-sm text-[#757575] mb-6 flex items-center gap-2">
              <Link href="/" className="hover:text-primary transition-colors">Главная</Link>
              <span className="text-[#cbcbcb]">/</span>
              <Link href="/analogs" className="hover:text-primary transition-colors">Сравнение</Link>
              <span className="text-[#cbcbcb]">/</span>
              <span className="text-[#666]">{comp1} vs {comp2}</span>
            </nav>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-primary-dark bg-clip-text text-transparent">
              Сравнение {comp1} и {comp2}
            </h1>
            <p className="text-lg text-[#666] max-w-3xl mb-4">
              Детальное сравнение электронных компонентов {comp1} ({data1?.brand || cluster1?.brand || ''}) и {comp2} ({data2?.brand || cluster2?.brand || ''}):
              технические характеристики, совместимость, отличия и рекомендации по выбору для конкретных задач.
            </p>
            <p className="text-base text-[#757575] max-w-3xl">
              Инженерный анализ параметров и областей применения для обоснованного выбора компонента при проектировании
              и импортозамещении. Все компоненты проверяются в лаборатории СВП.
            </p>
          </div>
        </section>

        {/* Comparison Table */}
        <section className="px-4 pb-20">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">Сравнительная таблица характеристик</h2>
            <p className="text-[#666] mb-8 max-w-2xl">
              Сопоставление ключевых технических параметров {comp1} и {comp2}. Данные получены из спецификаций производителей
              и подтверждены измерениями в нашей лаборатории.
            </p>

            {/* Component header cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-[#f0f4ee] rounded-2xl border border-[#e8e8e8] p-6 hover:border-primary/30 hover:shadow-lg transition-all">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-2xl">🔵</span>
                  <div>
                    <h3 className="text-xl font-semibold text-[#121212]">{comp1}</h3>
                    <p className="text-sm text-[#666]">{data1?.brand || cluster1?.brand || '—'} · {data1?.category || cluster1?.category || '—'}</p>
                  </div>
                </div>
                <p className="text-[#666] text-sm leading-relaxed">{data1?.description || cluster1?.description || 'Описание недоступно'}</p>
              </div>
              <div className="bg-[#f0f4ee] rounded-2xl border border-[#e8e8e8] p-6 hover:border-primary/30 hover:shadow-lg transition-all">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-2xl">🟢</span>
                  <div>
                    <h3 className="text-xl font-semibold text-[#121212]">{comp2}</h3>
                    <p className="text-sm text-[#666]">{data2?.brand || cluster2?.brand || '—'} · {data2?.category || cluster2?.category || '—'}</p>
                  </div>
                </div>
                <p className="text-[#666] text-sm leading-relaxed">{data2?.description || cluster2?.description || 'Описание недоступно'}</p>
              </div>
            </div>

            {/* Specs comparison table */}
            {allSpecKeys.size > 0 && (
              <div className="overflow-x-auto rounded-2xl border border-[#e8e8e8]">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-[#eaf0e8] border-b border-[#e8e8e8]">
                      <th className="text-left py-4 px-6 text-[#666] font-medium">Параметр</th>
                      <th className="text-left py-4 px-6 text-[#666] font-medium">{comp1}</th>
                      <th className="text-left py-4 px-6 text-[#666] font-medium">{comp2}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Array.from(allSpecKeys).map((key) => (
                      <tr key={key} className="border-b border-[#e8e8e8] hover:bg-[#eaf0e8] transition-colors">
                        <td className="py-3 px-6 font-medium text-[#333]">{key}</td>
                        <td className="py-3 px-6 text-[#666]">{data1?.specs?.[key] || '—'}</td>
                        <td className="py-3 px-6 text-[#666]">{data2?.specs?.[key] || '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {allSpecKeys.size === 0 && (
              <div className="bg-[#f0f4ee] rounded-2xl border border-[#e8e8e8] p-8 text-center">
                <p className="text-[#666]">Подробные характеристики запрашиваются у производителей. Свяжитесь с нами для получения спецификаций.</p>
              </div>
            )}
          </div>
        </section>

        {/* When to choose Component 1 */}
        <section className="px-4 pb-20 bg-section-accent/30">
          <div className="max-w-7xl mx-auto py-20">
            <h2 className="text-3xl font-bold mb-4">Когда выбрать {comp1}</h2>
            <p className="text-[#666] mb-8 max-w-2xl">
              {comp1} от {data1?.brand || cluster1?.brand || 'производителя'} оптимально подходит для следующих задач и условий применения.
              Выбор данного компонента обоснован при требованиях к проверенной экосистеме, стабильности поставок и полной технической поддержке от производителя.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {useCases1.map((useCase) => (
                <div
                  key={useCase}
                  className="bg-gradient-to-br from-primary/5 to-primary-dark/5 rounded-2xl border border-primary/10 p-6 hover:border-primary/30 transition-all"
                >
                  <h3 className="text-lg font-semibold mb-3 text-[#121212]">{useCase}</h3>
                  <p className="text-[#666] text-sm leading-relaxed">
                    Применение {comp1} в области &laquo;{useCase}&raquo; обеспечивает высокую надёжность и предсказуемость работы системы.
                    Компонент имеет проверенную документацию, широкую поддержку в средствах разработки и подтверждённый срок доступности на рынке.
                  </p>
                </div>
              ))}
            </div>
            <div className="mt-8 bg-white rounded-2xl border border-[#e8e8e8] p-6">
              <p className="text-[#666] text-sm leading-relaxed">
                <span className="font-semibold text-[#121212]">Рекомендация:</span> Выбирайте {comp1}, если проект требует проверенной экосистемы
                разработки, длительного жизненного цикла компонента (10+ лет), полной технической поддержки от {data1?.brand || cluster1?.brand || 'производителя'}
                и стабильных поставок для серийного производства. Компонент особенно рекомендуется для ответственных применений,
                где цена ошибки критична — медицинское оборудование, оборонный комплекс, аэрокосмическая отрасль.
              </p>
            </div>
          </div>
        </section>

        {/* When to choose Component 2 */}
        <section className="px-4 pb-20">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">Когда выбрать {comp2}</h2>
            <p className="text-[#666] mb-8 max-w-2xl">
              {comp2} от {data2?.brand || cluster2?.brand || 'производителя'} является предпочтительным выбором в сценариях импортозамещения,
              оптимизации стоимости и обеспечения бесперебойных поставок без санкционных рисков.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {useCases2.map((useCase) => (
                <div
                  key={useCase}
                  className="bg-[#f0f4ee] rounded-2xl border border-[#e8e8e8] p-6 hover:border-primary/30 hover:shadow-lg transition-all group"
                >
                  <h3 className="text-lg font-semibold mb-3 text-[#121212] group-hover:text-primary transition-colors">
                    {useCase}
                  </h3>
                  <p className="text-[#666] text-sm leading-relaxed">
                    {comp2} в области &laquo;{useCase}&raquo; позволяет снизить стоимость изделия при сохранении функциональности.
                    Компонент доступен для поставок без ограничений, что обеспечивает предсказуемость логистической цепочки
                    и устраняет риски остановки производства.
                  </p>
                </div>
              ))}
            </div>
            <div className="mt-8 bg-gradient-to-r from-primary/5 to-primary-dark/5 rounded-2xl border border-primary/10 p-6">
              <p className="text-[#666] text-sm leading-relaxed">
                <span className="font-semibold text-[#121212]">Рекомендация:</span> Выбирайте {comp2} для проектов импортозамещения,
                где критична стоимость и доступность компонента без санкционных рисков. {comp2} от {data2?.brand || cluster2?.brand || 'производителя'}
                обеспечивает совместимость с существующими решениями и позволяет снизить зависимость от санкционных поставок.
                Рекомендуется провести верификацию на опытной партии перед внедрением в серийное производство.
              </p>
            </div>
          </div>
        </section>

        {/* Related Comparisons */}
        {relatedComparisons.length > 0 && (
          <section className="px-4 pb-20 bg-section-accent/30">
            <div className="max-w-7xl mx-auto py-20">
              <h2 className="text-3xl font-bold mb-4">Похожие сравнения</h2>
              <p className="text-[#666] mb-8 max-w-2xl">
                Другие сравнения компонентов в смежных категориях, которые могут быть полезны при выборе аналогов и импортозамещении.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {relatedComparisons.map((comparison) => (
                  <Link
                    key={comparison.slug}
                    href={`/compare/${comparison.components.join(',')}`}
                    className="bg-white rounded-2xl border border-[#e8e8e8] p-6 hover:border-primary/30 hover:shadow-lg transition-all group"
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <span className="px-2 py-0.5 bg-[#eaf0e8] text-primary text-xs rounded-md">
                        {comparison.category}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold mb-2 text-[#121212] group-hover:text-primary transition-colors">
                      {comparison.title}
                    </h3>
                    <p className="text-[#666] text-sm leading-relaxed line-clamp-2">
                      {comparison.description}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* FAQ */}
        <section className="px-4 pb-20">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-12 text-center">Часто задаваемые вопросы</h2>
            <div className="space-y-4">
              {faqItems.map((item, index) => (
                <details
                  key={index}
                  className="group bg-[#f0f4ee] rounded-2xl border border-[#e8e8e8] overflow-hidden"
                >
                  <summary className="flex items-center justify-between p-6 cursor-pointer hover:bg-[#eaf0e8] transition-colors">
                    <span className="font-semibold text-[#121212] pr-4">{item.question}</span>
                    <svg
                      className="w-5 h-5 text-[#757575] group-open:rotate-180 transition-transform shrink-0"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </summary>
                  <div className="px-6 pb-6 text-[#666] leading-relaxed">{item.answer}</div>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="px-4 pb-20">
          <div className="max-w-4xl mx-auto bg-gradient-to-br from-primary/10 to-primary-dark/5 rounded-2xl border border-emerald-800/30 p-8 md:p-12 text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Запросить КП на {comp1} или {comp2}
            </h2>
            <p className="text-[#666] mb-8 max-w-xl mx-auto">
              Отправьте заявку — подберём оптимальный вариант, проверим наличие на складе и подготовим
              коммерческое предложение с учётом ваших требований к объёмам и срокам поставки.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/#bom"
                className="inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark text-[#121212] font-medium px-8 py-3 rounded-lg transition-colors"
              >
                Запросить КП
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
              </Link>
              <Link
                href="/bom"
                className="inline-flex items-center justify-center gap-2 border border-primary text-primary hover:bg-primary/5 font-medium px-8 py-3 rounded-lg transition-colors"
              >
                Загрузить BOM
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

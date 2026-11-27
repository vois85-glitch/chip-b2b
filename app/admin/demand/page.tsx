// app/admin/demand/page.tsx — B2B Demand Analytics Dashboard
//
// Shows top searched-but-not-found components from search_zero_results table.
// Helps procurement team decide which components to add to inventory.
//
// Protected by middleware (HTTP Basic Auth on /admin/*).
// Page is a Server Component — fetches data at request time.

import { supabaseAdmin as supabase } from '@/lib/supabase-admin';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

type ZeroResultRow = {
  query: string;
  normalized: string | null;
  created_at: string;
  referrer: string | null;
  user_agent: string | null;
};

type GroupedResult = {
  query: string;
  normalized: string;
  count: number;
  last_searched: string;
  first_searched: string;
  referrers: string[];
};

const BASE_URL = 'https://www.chip-net.ru';

// Fetch up to 1000 recent records and group in JS (Supabase REST doesn't support GROUP BY)
async function fetchGroupedData(daysBack: number | null): Promise<GroupedResult[]> {
  let query = supabase
    .from('search_zero_results')
    .select('query, normalized, created_at, referrer, user_agent')
    .order('created_at', { ascending: false })
    .limit(1000);

  if (daysBack !== null) {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - daysBack);
    query = query.gte('created_at', cutoff.toISOString());
  }

  const { data, error } = await query;

  if (error) {
    console.error('[demand] fetch error:', error);
    return [];
  }

  if (!data || data.length === 0) {
    return [];
  }

  // Group by normalized (or query if normalized is null)
  const grouped = new Map<string, GroupedResult>();
  for (const row of data as ZeroResultRow[]) {
    const key = (row.normalized || row.query).toUpperCase();
    const existing = grouped.get(key);
    if (existing) {
      existing.count += 1;
      if (row.created_at > existing.last_searched) {
        existing.last_searched = row.created_at;
      }
      if (row.created_at < existing.first_searched) {
        existing.first_searched = row.created_at;
      }
      if (row.referrer && !existing.referrers.includes(row.referrer)) {
        existing.referrers.push(row.referrer);
      }
    } else {
      grouped.set(key, {
        query: row.query,
        normalized: key,
        count: 1,
        last_searched: row.created_at,
        first_searched: row.created_at,
        referrers: row.referrer ? [row.referrer] : [],
      });
    }
  }

  // Sort by count descending
  return Array.from(grouped.values()).sort((a, b) => b.count - a.count);
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Europe/Moscow',
  });
}

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return 'только что';
  if (minutes < 60) return `${minutes} мин назад`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} ч назад`;
  const days = Math.floor(hours / 24);
  return `${days} дн назад`;
}

export default async function DemandDashboard({
  searchParams,
}: {
  searchParams: Promise<{ period?: string }>;
}) {
  const params = await searchParams;
  const period = params.period || '7';
  const daysBack = period === 'all' ? null : parseInt(period, 10);

  const grouped = await fetchGroupedData(daysBack);
  const totalCount = grouped.reduce((sum, g) => sum + g.count, 0);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              📊 Дашборд спроса
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              Компоненты, которые искали, но не нашли — кандидаты на закупку
            </p>
          </div>
          <div className="flex items-center gap-3">
            <a
              href={BASE_URL}
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              ← На сайт
            </a>
          </div>
        </div>
      </header>

      {/* Filters */}
      <div className="bg-white border-b border-gray-200 px-6 py-3">
        <div className="max-w-7xl mx-auto flex items-center gap-4">
          <span className="text-sm font-medium text-gray-700">Период:</span>
          {[
            { value: '1', label: '24 часа' },
            { value: '7', label: '7 дней' },
            { value: '30', label: '30 дней' },
            { value: 'all', label: 'Всё время' },
          ].map((opt) => (
            <a
              key={opt.value}
              href={`/admin/demand?period=${opt.value}`}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                period === opt.value
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {opt.label}
            </a>
          ))}
          <div className="ml-auto text-sm text-gray-600">
            <span className="font-semibold text-gray-900">{grouped.length}</span> уникальных запросов ·{' '}
            <span className="font-semibold text-gray-900">{totalCount}</span> всего поисков
          </div>
        </div>
      </div>

      {/* Table */}
      <main className="max-w-7xl mx-auto px-6 py-6">
        {grouped.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <div className="text-5xl mb-4">📭</div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Нет данных за выбранный период
            </h2>
            <p className="text-gray-600">
              Когда пользователи будут искать несуществующие компоненты,
              они появятся здесь. Попробуйте поискать{' '}
              <a
                href={`${BASE_URL}/#search`}
                className="text-blue-600 hover:underline"
              >
                на сайте
              </a>{' '}
              что-нибудь несуществующее для теста.
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      #
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Запрос
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Нормализованный
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Кол-во
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Последний поиск
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Источник
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Действие
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {grouped.map((item, idx) => (
                    <tr key={item.normalized} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-500">
                        {idx + 1}
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-mono font-semibold text-gray-900 text-sm">
                          {item.query}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="font-mono text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded">
                          {item.normalized}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className={`inline-flex items-center justify-center min-w-[2rem] px-2 py-1 rounded-full text-xs font-bold ${
                          item.count >= 5
                            ? 'bg-red-100 text-red-700'
                            : item.count >= 3
                            ? 'bg-amber-100 text-amber-700'
                            : 'bg-gray-100 text-gray-700'
                        }`}>
                          {item.count}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        <div>{timeAgo(item.last_searched)}</div>
                        <div className="text-xs text-gray-400">
                          {formatDate(item.last_searched)}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-500">
                        {item.referrers.length > 0
                          ? item.referrers[0].replace(BASE_URL, '')
                          : '—'}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <a
                          href={`${BASE_URL}/bom?component=${encodeURIComponent(item.query)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg transition-colors"
                        >
                          + В закупку
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Footer note */}
        <div className="mt-6 text-xs text-gray-500">
          <p>
            💡 <strong>Как использовать:</strong> Компоненты с красным бейджем (5+ поисков) —
            высокий спрос, закупить срочно. Жёлтые (3-4) — средний приоритет.
            Данные обновляются в реальном времени при каждой загрузке страницы.
          </p>
          <p className="mt-2">
            Показано максимум 1000 последних записей. Для аналитики за большие периоды
            используйте Supabase Table Editor.
          </p>
        </div>
      </main>
    </div>
  );
}

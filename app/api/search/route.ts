// app/api/search/route.ts — Typo-tolerant search API with Zero-Results fallback
// Uses Supabase ilike for case-insensitive partial matching (NOT fuse.js — would kill RAM on 50k SKUs)
//
// 3 response states:
//   1. 'exact'     — exact SKU match found
//   2. 'analogues' — no exact, but partial matches exist
//   3. 'zero'      — nothing found at all, prompt user to request
//
// Zero-results are logged to `search_zero_results` table for demand analytics.
// Insert is wrapped in try-catch so it NEVER blocks the API response.

import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type SearchResult = {
  sku: string;
  name: string;
  brand: string;
  category: string;
  status: string;
  has_analogs: boolean;
  price_on_request: true;  // B2B — price is never public
  url: string;
};

type SearchResponse = {
  query: string;
  normalized: string;
  status: 'exact' | 'analogues' | 'zero';
  results: SearchResult[];
  message?: string;
  cta_url?: string;
  request_form?: boolean;
};

// Normalize: trim, uppercase, remove all whitespace and common separators
function normalizeQuery(q: string): string {
  return q
    .trim()
    .toUpperCase()
    .replace(/[\s\-_/.]+/g, '');  // remove spaces, dashes, underscores, slashes, dots
}

// Pre-clean: removes conversational filler words, quantities, and units
// Examples:
//   "Ищу M2012SD3W03 — 9 шт." -> "M2012SD3W03"
//   "купить IRF540 50шт" -> "IRF540"
//   "нужен транзистор IRFZ44N 10 pcs" -> "IRFZ44N"
//   "аналог STM32F103C8T6" -> "STM32F103C8T6"
function precleanQuery(q: string): string {
  let s = q.trim();

  // 1. Remove leading filler words (case-insensitive, Russian + English)
  //    "Ищу", "нужен", "купить", "цена", "аналог", "замена", "микросхема", etc.
  const fillerWords = [
    'ищу', 'нужен', 'нужна', 'нужно', 'купить', 'цена',
    'аналог', 'замена', 'замену', 'кросс-референс',
    'микросхема', 'микросхемы', 'транзистор', 'транзистора',
    'конденсатор', 'конденсатора', 'резистор', 'резистора',
    'разъем', 'разъём', 'реле', 'диод', 'диода',
    'стабилитрон', 'стабилитрона', 'предохранитель', 'предохранителя',
    'оптопара', 'оптрона', 'драйвер', 'усилитель',
    'стабилизатор', 'датчик', 'датчика', 'модуль',
    'need', 'looking for', 'search', 'find', 'buy', 'price',
  ];
  // Build alternation pattern
  const fillerPattern = fillerWords.join('|');
  // Remove filler words anywhere in the string
  // Note: \b doesn't work with Cyrillic in JS regex, so we use (^|\s) and (\s|$) boundaries
  s = s.replace(new RegExp(`(^|\\s)(${fillerPattern})(\\s|$)`, 'gi'), ' ');

  // 2. Cut quantity tails: everything after separator + number + unit
  //    Patterns: " — 9 шт.", " 50 шт", " 100 pcs", " 10 pc", " 5 ед", " 3 уп"
  //    Separators: dash, colon, semicolon, or just space before a number
  s = s.replace(/\s*[-:;]?\s*\d+\s*(шт\.?|pcs|pc|ед\.?|уп\.?|pieces|экз\.?)\s*$/gi, '');
  // Also cut trailing standalone numbers (likely quantities)
  s = s.replace(/\s+\d+\s*$/g, '');

  // 3. Remove leading/trailing punctuation that might remain
  s = s.replace(/^[\s\-—:;,.\s]+/, '').replace(/[\s\-—:;,.\s]+$/, '');

  return s.trim();
}

// Log zero-result to Supabase for demand analytics
// Wrapped in try-catch — NEVER throws, NEVER blocks API response
// Captures: query, normalized, referrer, user_agent
async function logZeroResult(
  query: string,
  normalized: string,
  req: NextRequest
): Promise<void> {
  try {
    const { error } = await supabase
      .from('search_zero_results')
      .insert({
        query,
        normalized,
        referrer: req.headers.get('referer') || null,
        user_agent: req.headers.get('user-agent') || null,
      });
    if (error) {
      // Table might not exist yet, or RLS blocked — log but don't fail
      console.warn('[search] zero-result logging failed (table may not exist yet):', error.message);
    }
  } catch (err) {
    // Network error, etc. — never block the API
    console.warn('[search] zero-result logging error:', err);
  }
}

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get('q') || '';
  const limit = Math.min(parseInt(req.nextUrl.searchParams.get('limit') || '10', 10), 20);

  // Validate input
  if (q.trim().length < 2) {
    return NextResponse.json<SearchResponse>({
      query: q,
      normalized: '',
      status: 'zero',
      results: [],
      message: 'Введите минимум 2 символа',
      request_form: false,
    });
  }

  // Pre-clean: remove filler words ("Ищу", "купить", "микросхема"...),
  // quantity tails ("50 шт", "100 pcs"), and punctuation.
  // This handles natural-language queries from emails/chats/BOMs.
  const cleaned = precleanQuery(q);

  // If precleaning produced a shorter query, use it; otherwise fall back to original
  const effectiveQuery = cleaned.length >= 2 ? cleaned : q.trim();

  const normalized = normalizeQuery(effectiveQuery);

  // ============================
  // STAGE 1: Exact match on SKU
  // ============================
  // Try exact case-insensitive SKU match first (fastest path)
  const { data: exactMatch, error: exactErr } = await supabase
    .from('components')
    .select('sku, name, brand, category, status, analogs')
    .ilike('sku', normalized)
    .limit(limit);

  if (exactErr) {
    console.error('[search] exact match error:', exactErr);
    return NextResponse.json(
      { error: 'Search service temporarily unavailable' },
      { status: 503 }
    );
  }

  if (exactMatch && exactMatch.length > 0) {
    return NextResponse.json<SearchResponse>({
      query: q,
      normalized,
      status: 'exact',
      results: exactMatch.map(toSearchResult),
      message: exactMatch.length === 1
        ? `Найдено точное совпадение:`
        : `Найдено точных совпадений: ${exactMatch.length}`,
    });
  }

  // ===========================================
  // STAGE 2: Partial match on SKU (ilike %query%)
  // ===========================================
  // Try SKU starts-with first (most relevant)
  const { data: startsWith } = await supabase
    .from('components')
    .select('sku, name, brand, category, status, analogs')
    .ilike('sku', normalized + '%')
    .limit(limit);

  let partialResults = startsWith || [];

  // If not enough, try SKU contains
  if (partialResults.length < limit) {
    const { data: contains } = await supabase
      .from('components')
      .select('sku, name, brand, category, status, analogs')
      .ilike('sku', '%' + normalized + '%')
      .limit(limit - partialResults.length);

    // Merge, dedupe by sku
    const existingSkus = new Set(partialResults.map(r => r.sku));
    for (const item of (contains || [])) {
      if (!existingSkus.has(item.sku)) {
        partialResults.push(item);
        existingSkus.add(item.sku);
      }
    }
  }

  // Also search by name (for cases like "stm32" matching name "Микроконтроллер STM32")
  if (partialResults.length < limit) {
    const { data: nameMatches } = await supabase
      .from('components')
      .select('sku, name, brand, category, status, analogs')
      .ilike('name', '%' + q.trim() + '%')
      .limit(limit - partialResults.length);

    const existingSkus = new Set(partialResults.map(r => r.sku));
    for (const item of (nameMatches || [])) {
      if (!existingSkus.has(item.sku)) {
        partialResults.push(item);
        existingSkus.add(item.sku);
      }
    }
  }

  if (partialResults.length > 0) {
    return NextResponse.json<SearchResponse>({
      query: q,
      normalized,
      status: 'analogues',
      results: partialResults.map(toSearchResult),
      message: 'Точного совпадения нет. Возможно, вы искали:',
    });
  }

  // ============================
  // STAGE 3: Zero results
  // ============================
  // Log to demand-analytics table (fire-and-forget, never blocks)
  // Only log the cleaned query (without filler words/quantities) if it's >= 4 chars
  // — prevents pollution of analytics with "Ищу ... 9 шт." noise
  if (effectiveQuery.length >= 4) {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    logZeroResult(effectiveQuery, normalized, req);
  }

  return NextResponse.json<SearchResponse>({
    query: q,
    normalized,
    status: 'zero',
    results: [],
    message: 'Компонент не найден. Отправьте запрос, и мы найдем его для вас.',
    cta_url: `/bom?component=${encodeURIComponent(q)}`,
    request_form: true,
  });
}

// Helper: transform DB row to SearchResult
function toSearchResult(row: any): SearchResult {
  return {
    sku: row.sku,
    name: row.name,
    brand: row.brand,
    category: row.category,
    status: row.status,
    has_analogs: Array.isArray(row.analogs) && row.analogs.length > 0,
    price_on_request: true,  // B2B — never expose price
    url: `/component/${encodeURIComponent(row.sku)}`,
  };
}

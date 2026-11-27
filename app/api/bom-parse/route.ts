// app/api/bom-parse/route.ts — BOM parsing API
// Принимает массив {rawSku, qty}, нормализует, ищет в локальной PG chip_net.
// Возвращает статус found/not_found для каждой строки.

import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function normalizeSku(q: string): string {
  return q
    .trim()
    .toUpperCase()
    .replace(/[\s\-_/.]+/g, '');
}

type BomItem = {
  rawSku: string;
  qty: number;
};

type BomResult = {
  rawSku: string;
  normalized: string;
  qty: number;
  status: 'found' | 'not_found';
  sku?: string;
  brand?: string;
  category?: string;
  componentStatus?: string;
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const items: BomItem[] = Array.isArray(body.items) ? body.items : [];

    if (items.length === 0) {
      return NextResponse.json({ error: 'No items provided' }, { status: 400 });
    }

    if (items.length > 500) {
      return NextResponse.json({ error: 'Too many items (max 500)' }, { status: 400 });
    }

    const results: BomResult[] = [];

    for (const item of items) {
      const normalized = normalizeSku(item.rawSku);
      if (!normalized || normalized.length < 2) {
        results.push({
          rawSku: item.rawSku,
          normalized: '',
          qty: item.qty,
          status: 'not_found',
        });
        continue;
      }

      // Try exact match (ilike = case-insensitive)
      const { data: exactMatch } = await supabase
        .from('components')
        .select('sku, brand, category, status')
        .ilike('sku', normalized)
        .limit(1);

      if (exactMatch && exactMatch.length > 0) {
        const c = exactMatch[0];
        results.push({
          rawSku: item.rawSku,
          normalized,
          qty: item.qty,
          status: 'found',
          sku: c.sku,
          brand: c.brand || undefined,
          category: c.category || undefined,
          componentStatus: c.status || undefined,
        });
        continue;
      }

      // Try prefix match (first 5+ chars)
      if (normalized.length >= 5) {
        const { data: prefixMatch } = await supabase
          .from('components')
          .select('sku, brand, category, status')
          .ilike('sku', normalized + '%')
          .limit(1);

        if (prefixMatch && prefixMatch.length > 0) {
          const c = prefixMatch[0];
          results.push({
            rawSku: item.rawSku,
            normalized,
            qty: item.qty,
            status: 'found',
            sku: c.sku,
            brand: c.brand || undefined,
            category: c.category || undefined,
            componentStatus: c.status || undefined,
          });
          continue;
        }
      }

      // Also try with the original rawSku (before normalization) — might have dashes
      if (item.rawSku.trim().toUpperCase() !== normalized) {
        const { data: origMatch } = await supabase
          .from('components')
          .select('sku, brand, category, status')
          .ilike('sku', item.rawSku.trim())
          .limit(1);

        if (origMatch && origMatch.length > 0) {
          const c = origMatch[0];
          results.push({
            rawSku: item.rawSku,
            normalized,
            qty: item.qty,
            status: 'found',
            sku: c.sku,
            brand: c.brand || undefined,
            category: c.category || undefined,
            componentStatus: c.status || undefined,
          });
          continue;
        }
      }

      results.push({
        rawSku: item.rawSku,
        normalized,
        qty: item.qty,
        status: 'not_found',
      });
    }

    const foundCount = results.filter(r => r.status === 'found').length;
    const notFoundCount = results.length - foundCount;

    return NextResponse.json({
      results,
      summary: {
        total: results.length,
        found: foundCount,
        notFound: notFoundCount,
      },
    });
  } catch (err: any) {
    console.error('[bom-parse] error:', err);
    return NextResponse.json(
      { error: 'Internal server error', details: err?.message },
      { status: 500 }
    );
  }
}

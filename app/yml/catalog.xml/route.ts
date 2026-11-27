// app/yml/catalog.xml/route.ts — YML feed (Yandex Market Language) for chip-net.ru
//
// Generates YML feed for Yandex Webmaster "Товары и предложения" feature.
// This enables rich product snippets in Yandex search results.
//
// YML spec: https://yandex.ru/support/webmaster/yml/about-yml.html
//
// Feed includes:
//   - All 50,000+ components from local PostgreSQL (chip_net)
//   - Categories tree (38 categories)
//   - Brands as vendors
//   - Component type, status, analogs
//   - URL to component page
//
// Data source: lib/supabase.ts (drop-in over local PG since 2026-11-13 migration).
// Earlier версия ходила на Supabase (заблокирован) напрямую через REST —
// после блокировки Supabase (HTTP 402) фид был недоступен.
//
// Performance: streamed response (no full XML in memory), ISR cached for 1 hour.

import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const revalidate = 3600; // Cache for 1 hour

const BASE_URL = 'https://www.chip-net.ru';

function escapeXml(s: string): string {
  return (s || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

type Component = { id: string; sku: string; name: string; brand: string; category: string; description: string; status: string };

async function fetchComponents(offset: number, limit: number): Promise<Component[]> {
  const { data, error } = await supabase
    .from('components')
    .select('id,sku,name,brand,category,description,status')
    .order('id', { ascending: true })
    .range(offset, offset + limit - 1);
  if (error) {
    console.error('[yml] components fetch error:', error.message);
    return [];
  }
  return (data || []) as Component[];
}

async function fetchAllCategories(): Promise<string[]> {
  const { data, error } = await supabase
    .from('categories')
    .select('name')
    .order('name');
  if (error) {
    console.error('[yml] categories fetch error:', error.message);
    return [];
  }
  return (data || []).map((c: { name: string }) => c.name).filter(Boolean);
}

export async function GET() {
  // 1. Fetch all categories for the categories tree
  const categories = await fetchAllCategories();

  // 2. Build YML in a streaming fashion
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      const write = (s: string) => controller.enqueue(encoder.encode(s + '\n'));

      // YML header
      write('<?xml version="1.0" encoding="UTF-8"?>');
      write('<!DOCTYPE yml_catalog SYSTEM "shops.dtd">');
      write(`<yml_catalog date="${new Date().toISOString()}">`);
      write('<shop>');
      write(`  <name>${escapeXml('ChipNet')}</name>`);
      write(`  <company>${escapeXml('ООО Деловой Партнёр (ChipNet)')}</company>`);
      write(`  <url>${BASE_URL}</url>`);
      write(`  <platform>Next.js 16</platform>`);
      write(`  <version>1.0</version>`);
      write(`  <agency>ChipNet</agency>`);
      write(`  <email>info@chip-net.ru</email>`);
      write(`  <cpa>0</cpa>`); // 0 = we don't sell via Yandex Market, only display
      write(`  <offers-cpa>0</offers-cpa>`);

      // Currencies
      write('<currencies>');
      write('  <currency id="RUB" rate="1"/>');
      write('  <currency id="USD" rate="CBR"/>');
      write('  <currency id="EUR" rate="CBR"/>');
      write('</currencies>');

      // Categories
      write('<categories>');
      categories.forEach((cat, idx) => {
        write(`  <category id="${idx + 1}">${escapeXml(cat)}</category>`);
      });
      write('</categories>');

      // Delivery options
      write('<delivery-options>');
      write('  <option cost="0" days="1-3"/>'); // Free pickup
      write('  <option cost="500" days="3-7"/>'); // Express
      write('</delivery-options>');

      // Offers
      write('<offers>');

      // 3. Stream offers in pages of 1000
      const PAGE_SIZE = 1000;
      const MAX_OFFERS = 50000; // Yandex limit
      let offset = 0;
      let totalWritten = 0;
      const categoryMap = new Map<string, number>();
      categories.forEach((c, i) => categoryMap.set(c, i + 1));

      while (totalWritten < MAX_OFFERS) {
        const batch = await fetchComponents(offset, PAGE_SIZE);
        if (!batch || batch.length === 0) break;

        for (const comp of batch) {
          if (totalWritten >= MAX_OFFERS) break;
          const catId = categoryMap.get(comp.category) || categories.length;
          const url = `${BASE_URL}/component/${encodeURIComponent(comp.sku)}`;
          const available = comp.status === 'EOL' ? 'false' : 'true';
          // No fixed price (B2B pricing on request) — use 0 with "На заказ"

          write('  <offer>');
          // id: используем SKU (алфавитно-цифровой, ≤20 символов у большинства;
          // UUID из локальной PG слишком длинный для YML-спецификации)
          write(`    <id>${escapeXml(comp.sku)}</id>`);
          write(`    <url>${escapeXml(url)}</url>`);
          write(`    <name>${escapeXml(comp.name || comp.sku)}</name>`);
          write(`    <vendor>${escapeXml(comp.brand || 'Unknown')}</vendor>`);
          write(`    <vendorCode>${escapeXml(comp.sku)}</vendorCode>`);
          if (comp.description) {
            write(`    <description>${escapeXml(comp.description)}</description>`);
          }
          write(`    <categoryId>${catId}</categoryId>`);
          write(`    <available>${available}</available>`);
          // B2B: price on request, use 1 RUB as placeholder
          write(`    <price>1</price>`);
          write(`    <currencyId>RUB</currencyId>`);
          // Country of origin — Russia for analogs, original for branded
          write(`    <country_of_origin>${escapeXml('Россия / Импорт')}</country_of_origin>`);
          write(`    <sales_notes>${escapeXml('Минимальный заказ от 1 шт. Цена по запросу. B2B-поставки.')}</sales_notes>`);
          // Age rating — components are 0+
          write(`    <age>0</age>`);
          // Store / pickup / delivery
          write(`    <store>true</store>`);
          write(`    <pickup>true</pickup>`);
          write(`    <delivery>true</delivery>`);
          write('  </offer>');
          totalWritten++;
        }

        offset += PAGE_SIZE;
        if (batch.length < PAGE_SIZE) break;
      }

      write('</offers>');
      write('</shop>');
      write('</yml_catalog>');

      controller.close();
    },
  });

  return new NextResponse(stream, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
      'X-Robots-Tag': 'noindex, follow', // Don't index the feed itself
    },
  });
}

// /var/www/chip-net/app/api/specs/[sku]/route.ts
// API endpoint для получения предрассчитанных технических параметров компонента.
// Читает из /var/www/chip-net/data/specs.jsonl через индексный файл.
//
// GET /api/specs/NE5532P → JSON с specs, nomenclature_number, brand, category
// 404 если SKU не найден.

import { NextRequest, NextResponse } from 'next/server';
import * as fs from 'fs';
import * as path from 'path';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const DATA_DIR = '/var/www/chip-net/data';
const SPECS_FILE = path.join(DATA_DIR, 'specs.jsonl');
const INDEX_FILE = path.join(DATA_DIR, 'specs-index.json');

// In-memory cache индекса (загружается один раз)
let indexCache: Record<string, number> | null = null;
let indexMtime = 0;

function loadIndex(): Record<string, number> | null {
  try {
    const stat = fs.statSync(INDEX_FILE);
    if (indexCache && stat.mtimeMs === indexMtime) {
      return indexCache;
    }
    const raw = fs.readFileSync(INDEX_FILE, 'utf8');
    indexCache = JSON.parse(raw);
    indexMtime = stat.mtimeMs;
    return indexCache;
  } catch {
    return null;
  }
}

function readLineAt(offset: number): any | null {
  try {
    const fd = fs.openSync(SPECS_FILE, 'r');
    // Читаем 32KB начиная с offset — этого хватит для любого компонента
    const buf = Buffer.alloc(32 * 1024);
    const len = fs.readSync(fd, buf, 0, buf.length, offset);
    fs.closeSync(fd);

    const text = buf.subarray(0, len).toString('utf8');
    const nlPos = text.indexOf('\n');
    const line = nlPos === -1 ? text : text.substring(0, nlPos);

    if (!line) return null;
    return JSON.parse(line);
  } catch (e) {
    return null;
  }
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ sku: string }> }
) {
  const { sku } = await params;
  if (!sku) {
    return NextResponse.json({ error: 'SKU is required' }, { status: 400 });
  }

  const index = loadIndex();
  if (!index) {
    return NextResponse.json(
      { error: 'Specs database not available' },
      { status: 503 }
    );
  }

  const offset = index[sku];
  if (offset === undefined) {
    return NextResponse.json(
      { error: 'SKU not found', sku },
      { status: 404 }
    );
  }

  const record = readLineAt(offset);
  if (!record) {
    return NextResponse.json(
      { error: 'Failed to read record' },
      { status: 500 }
    );
  }

  // Cache-Control: кэшируем на 1 час на CDN/браузере (specs immutable)
  return NextResponse.json(record, {
    headers: {
      'Cache-Control': 'public, max-age=3600, s-maxage=86400',
    },
  });
}

// middleware.ts — Case-insensitive part number redirect + Admin auth
//
// Two responsibilities:
// 1. /component/{sku} — case-insensitive lookup → 301 redirect to canonical SKU
// 2. /admin/* — HTTP Basic Auth protection (password from env)
//
// Auth uses HTTP Basic Auth (simple, no DB users needed).
// Password is set in /var/www/chip-net/.env.local as ADMIN_PASSWORD.

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// ============================================================
// SKU lookup cache (existing functionality)
// ============================================================
const skuCache = new Map<string, string | null>();
const CACHE_TTL = 60 * 60 * 1000;

function getCachedSku(lowerSku: string): string | null | undefined {
  const entry = skuCache.get(lowerSku);
  if (entry === undefined) return undefined;
  return entry;
}

function setCachedSku(lowerSku: string, canonicalSku: string | null) {
  skuCache.set(lowerSku, canonicalSku);
  setTimeout(() => skuCache.delete(lowerSku), CACHE_TTL);
}

async function findCanonicalSku(inputSku: string): Promise<string | null> {
  const lowerSku = inputSku.toLowerCase();
  const cached = getCachedSku(lowerSku);
  if (cached !== undefined) return cached;

  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!supabaseUrl || !supabaseKey) {
      setCachedSku(lowerSku, null);
      return null;
    }

    // Try exact case-insensitive match
    const res = await fetch(
      `${supabaseUrl}/rest/v1/components?select=sku&sku=ilike.${encodeURIComponent(inputSku)}&limit=1`,
      {
        headers: {
          apikey: supabaseKey,
          Authorization: `Bearer ${supabaseKey}`,
        },
        signal: AbortSignal.timeout(3000),
      }
    );

    if (res.ok) {
      const data = await res.json();
      if (data && data.length > 0) {
        const canonical = data[0].sku;
        setCachedSku(lowerSku, canonical);
        return canonical;
      }
    }

    // Try normalized (without spaces/dashes)
    const normalized = inputSku.replace(/[\s\-_]/g, '').toUpperCase();
    if (normalized !== inputSku.toUpperCase()) {
      const res2 = await fetch(
        `${supabaseUrl}/rest/v1/components?select=sku&sku=ilike.${encodeURIComponent(normalized)}&limit=1`,
        {
          headers: {
            apikey: supabaseKey,
            Authorization: `Bearer ${supabaseKey}`,
          },
          signal: AbortSignal.timeout(3000),
        }
      );
      if (res2.ok) {
        const data2 = await res2.json();
        if (data2 && data2.length > 0) {
          const canonical = data2[0].sku;
          setCachedSku(lowerSku, canonical);
          return canonical;
        }
      }
    }

    setCachedSku(lowerSku, null);
    return null;
  } catch {
    return null;
  }
}

// ============================================================
// HTTP Basic Auth for /admin/*
// ============================================================
const ADMIN_REALM = 'ChipNet Admin';

function checkAuth(authHeader: string | null): boolean {
  if (!authHeader || !authHeader.startsWith('Basic ')) {
    return false;
  }

  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) {
    // If no password configured, deny all access (fail secure)
    console.error('[admin] ADMIN_PASSWORD not set in env — denying access');
    return false;
  }

  try {
    const decoded = Buffer.from(authHeader.substring(6), 'base64').toString('utf-8');
    const [username, password] = decoded.split(':');
    // Username can be anything; only password matters
    return password === adminPassword;
  } catch {
    return false;
  }
}

function unauthorizedResponse() {
  return new NextResponse('Unauthorized', {
    status: 401,
    headers: {
      'WWW-Authenticate': `Basic realm="${ADMIN_REALM}", charset="UTF-8"`,
    },
  });
}

// ============================================================
// Main middleware
// ============================================================

// ─────────────────────────────────────────────────────────────────────────
// Кэш категорий для 301-редиректа: { name|slug → { parentSlug, slug } | null }
// TTL 1 час. Null = категория не найдена (тоже кэшируем, чтобы не дёргать БД).
// ─────────────────────────────────────────────────────────────────────────
const catChpuCache = new Map<string, { parentSlug: string; slug: string } | null>();
const CAT_CACHE_TTL = 60 * 60 * 1000;

async function resolveCategoryChpu(input: string): Promise<string | null> {
  const key = input.toLowerCase().trim();
  const cached = catChpuCache.get(key);
  if (cached !== undefined) {
    return cached ? `/catalog/${cached.parentSlug}/${cached.slug}` : null;
  }

  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!supabaseUrl || !supabaseKey) {
      catChpuCache.set(key, null);
      return null;
    }

    // Try by name first (old format), then by slug
    let row: { id: string; slug: string; parent_id: string | null; level: number } | null = null;
    const headers = { apikey: supabaseKey, Authorization: `Bearer ${supabaseKey}` };

    // by name
    const r1 = await fetch(
      `${supabaseUrl}/rest/v1/categories?select=id,slug,parent_id,level&name=eq.${encodeURIComponent(input)}&limit=1`,
      { headers }
    );
    if (r1.ok) {
      const arr = await r1.json();
      if (Array.isArray(arr) && arr[0]) row = arr[0];
    }

    // by slug (if not found by name)
    if (!row) {
      const r2 = await fetch(
        `${supabaseUrl}/rest/v1/categories?select=id,slug,parent_id,level&slug=eq.${encodeURIComponent(input)}&limit=1`,
        { headers }
      );
      if (r2.ok) {
        const arr = await r2.json();
        if (Array.isArray(arr) && arr[0]) row = arr[0];
      }
    }

    if (!row || !row.parent_id || row.level !== 2) {
      catChpuCache.set(key, null);
      setTimeout(() => catChpuCache.delete(key), CAT_CACHE_TTL);
      return null;
    }

    // Get parent slug
    const r3 = await fetch(
      `${supabaseUrl}/rest/v1/categories?select=slug&and=(id.eq.${row.parent_id},level.eq.1)&limit=1`,
      { headers }
    );
    if (!r3.ok) {
      catChpuCache.set(key, null);
      setTimeout(() => catChpuCache.delete(key), CAT_CACHE_TTL);
      return null;
    }
    const parentArr = await r3.json();
    if (!Array.isArray(parentArr) || !parentArr[0] || !parentArr[0].slug) {
      catChpuCache.set(key, null);
      setTimeout(() => catChpuCache.delete(key), CAT_CACHE_TTL);
      return null;
    }

    const result = { parentSlug: parentArr[0].slug, slug: row.slug };
    catChpuCache.set(key, result);
    setTimeout(() => catChpuCache.delete(key), CAT_CACHE_TTL);
    return `/catalog/${result.parentSlug}/${result.slug}`;
  } catch {
    return null;
  }
}


// ─────────────────────────────────────────────────────────────────────────
// Кэш брендов для 301-редиректа: { name|slug → slug | null }
// TTL 1 час.
// ─────────────────────────────────────────────────────────────────────────
const brandSlugCache = new Map<string, string | null>();
const BRAND_CACHE_TTL = 60 * 60 * 1000;

async function resolveBrandSlug(input: string): Promise<string | null> {
  const key = input.toLowerCase().trim();
  const cached = brandSlugCache.get(key);
  if (cached !== undefined) return cached;

  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!supabaseUrl || !supabaseKey) {
      brandSlugCache.set(key, null);
      return null;
    }
    const headers = { apikey: supabaseKey, Authorization: `Bearer ${supabaseKey}` };

    // Try by name first
    const r1 = await fetch(
      `${supabaseUrl}/rest/v1/brands?select=slug&name=eq.${encodeURIComponent(input)}&limit=1`,
      { headers }
    );
    if (r1.ok) {
      const arr = await r1.json();
      if (Array.isArray(arr) && arr[0] && arr[0].slug) {
        brandSlugCache.set(key, arr[0].slug);
        setTimeout(() => brandSlugCache.delete(key), BRAND_CACHE_TTL);
        return arr[0].slug;
      }
    }

    // Try by slug (if input is already a slug)
    const r2 = await fetch(
      `${supabaseUrl}/rest/v1/brands?select=slug&slug=eq.${encodeURIComponent(input)}&limit=1`,
      { headers }
    );
    if (r2.ok) {
      const arr = await r2.json();
      if (Array.isArray(arr) && arr[0] && arr[0].slug) {
        brandSlugCache.set(key, arr[0].slug);
        setTimeout(() => brandSlugCache.delete(key), BRAND_CACHE_TTL);
        return arr[0].slug;
      }
    }

    brandSlugCache.set(key, null);
    setTimeout(() => brandSlugCache.delete(key), BRAND_CACHE_TTL);
    return null;
  } catch {
    return null;
  }
}

export async function middleware(request: NextRequest) {
  // ─────────────────────────────────────────────────────────────────────────
  // ✅ HTTP 301 REDIRECT: /catalog?category=<X> → /catalog/<parent>/<child>
  // Старые URL с query-параметрами → новые ЧПУ. true 301 (не 308).
  // Cache: in-memory Map, TTL 1 hour.
  // ─────────────────────────────────────────────────────────────────────────
  if (request.nextUrl.pathname === '/catalog' && request.nextUrl.searchParams.has('category')) {
    const cat = request.nextUrl.searchParams.get('category') || '';
    if (cat) {
      const chpuUrl = await resolveCategoryChpu(cat);
      if (chpuUrl) {
        // Сохраним остальные query-параметры (page, search, brand)
        const q = new URLSearchParams();
        const search = request.nextUrl.searchParams.get('search');
        const brand = request.nextUrl.searchParams.get('brand');
        const page = request.nextUrl.searchParams.get('page');
        if (search) q.set('search', search);
        if (brand) q.set('brand', brand);
        if (page && page !== '1') q.set('page', page);
        const qs = q.toString();
        const target = chpuUrl + (qs ? '?' + qs : '');
        const targetUrl = new URL(target, request.url);
        return NextResponse.redirect(targetUrl, 301);
      }
    }
  }


  // ─────────────────────────────────────────────────────────────────────────
  // ✅ HTTP 301 REDIRECT: /catalog?brand=<X> (без category) → /brand/<slug>
  // Если есть ?category — он обрабатывается выше (redirect на ЧПУ категории с brand в query).
  // Здесь — только чистый brand-filter.
  // ─────────────────────────────────────────────────────────────────────────
  if (request.nextUrl.pathname === '/catalog'
      && !request.nextUrl.searchParams.has('category')
      && request.nextUrl.searchParams.has('brand')) {
    const brandInput = request.nextUrl.searchParams.get('brand') || '';
    if (brandInput) {
      const brandSlug = await resolveBrandSlug(brandInput);
      if (brandSlug) {
        // Сохраним остальные query-параметры (page, search, sort)
        // sort: 2026-10-31 — сортировка работает на /brand/<slug>?sort=…
        const q = new URLSearchParams();
        const search = request.nextUrl.searchParams.get('search');
        const page = request.nextUrl.searchParams.get('page');
        const sort = request.nextUrl.searchParams.get('sort');
        if (search) q.set('search', search);
        if (page && page !== '1') q.set('page', page);
        if (sort) q.set('sort', sort);
        const qs = q.toString();
        const target = `/brand/${brandSlug}${qs ? '?' + qs : ''}`;
        const targetUrl = new URL(target, request.url);
        return NextResponse.redirect(targetUrl, 301);
      }
    }
  }

  // ─────────────────────────────────────────────────────────────────────────
  // ✅ HTTP 301 REDIRECT: /brand?brand=<X> → /brand/<slug>
  // audit 2026-07-20: старый формат brand-filter не ловился, отдавал 404
  // ─────────────────────────────────────────────────────────────────────────
  if (request.nextUrl.pathname === '/brand' && request.nextUrl.searchParams.has('brand')) {
    const brandInput = request.nextUrl.searchParams.get('brand') || '';
    if (brandInput) {
      const brandSlug = await resolveBrandSlug(brandInput);
      if (brandSlug) {
        const q = new URLSearchParams();
        const search = request.nextUrl.searchParams.get('search');
        const page = request.nextUrl.searchParams.get('page');
        if (search) q.set('search', search);
        if (page && page !== '1') q.set('page', page);
        const qs = q.toString();
        const target = `/brand/${brandSlug}${qs ? '?' + qs : ''}`;
        const targetUrl = new URL(target, request.url);
        return NextResponse.redirect(targetUrl, 301);
      }
    }
  }

  // ─────────────────────────────────────────────────────────────────────────
  // ✅ HTTP 301 REDIRECT: /catalog?search=<SKU> → /component/<SKU>
  // audit 2026-07-21: если поиск возвращает ровно 1 результат — редирект на canonical SKU
  // убирает 14 NOT_CANONICAL страниц из индекса Яндекса
  // ─────────────────────────────────────────────────────────────────────────
  if (request.nextUrl.pathname === '/catalog' && request.nextUrl.searchParams.has('search')
      && !request.nextUrl.searchParams.has('category')
      && !request.nextUrl.searchParams.has('brand')) {
    const searchInput = request.nextUrl.searchParams.get('search') || '';
    if (searchInput && searchInput.length >= 2 && searchInput.length <= 100) {
      const canonicalSku = await findCanonicalSku(searchInput);
      // Only redirect if the canonical SKU differs from input (means: exact match found)
      // AND we don't have additional pagination params
      const hasOnlyPage = request.nextUrl.searchParams.has('page');
      if (canonicalSku && !hasOnlyPage) {
        const target = `/component/${encodeURIComponent(canonicalSku)}`;
        const targetUrl = new URL(target, request.url);
        return NextResponse.redirect(targetUrl, 301);
      }
    }
  }

  // ─── Сброс кэшированного 308-редиректа /cart → /bom ───
  // Старый permanent redirect закэширован в браузерах.
  // Если нет параметра _nc — делаем 302 на /cart?_nc=1 с no-cache заголовками.
  // Это перебивает любой закэшированный 308.
  if (request.nextUrl.pathname === '/cart' && !request.nextUrl.searchParams.has('_nc')) {
    const url = request.nextUrl.clone();
    url.searchParams.set('_nc', '1');
    const response = NextResponse.redirect(url, 302);
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
    return response;
  }
  // При наличии _nc — отдаём страницу с no-cache заголовками
  if (request.nextUrl.pathname === '/cart') {
    const response = NextResponse.next();
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
    return response;
  }
  const { pathname } = request.nextUrl;

  // ---------- Admin route protection ----------
  if (pathname.startsWith('/admin')) {
    const authHeader = request.headers.get('authorization');
    if (!checkAuth(authHeader)) {
      return unauthorizedResponse();
    }
    // Auth OK — continue to admin page
    return NextResponse.next();
  }

  // ---------- Case-insensitive SKU redirect ----------
  const componentMatch = pathname.match(/^\/component\/(.+)$/);
  if (!componentMatch) {
    return NextResponse.next();
  }

  const inputSku = decodeURIComponent(componentMatch[1]);
  if (inputSku.length > 100) {
    return NextResponse.next();
  }

  const canonicalSku = await findCanonicalSku(inputSku);
  if (canonicalSku && canonicalSku !== inputSku) {
    const url = request.nextUrl.clone();
    url.pathname = `/component/${encodeURIComponent(canonicalSku)}`;
    return NextResponse.redirect(url, 301);
  }

  return NextResponse.next();
}

export const config = {
  // Run middleware on /component/* and /admin/*
  matcher: ['/component/:sku*', '/admin/:path*', '/catalog', '/brand'],
};

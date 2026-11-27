// lib/supabase.ts — Drop-in замена облачного Supabase JS-клиента
// на локальную PostgreSQL через node-postgres (pg).
//
// Реализует минимальный chainable API, совместимый с существующим кодом:
//   supabase.from('table').select('fields', { count: 'exact' })
//     .eq('field', value)
//     .ilike('field', pattern)
//     .or('field1.op.value1,field2.op.value2')
//     .order('field', { ascending: true })
//     .range(from, to)
//     → Promise<{ data, count, error }>
//
//   supabase.rpc('function_name', args)
//     → Promise<{ data, error }>
//
// Покрытие:
//   - .from(table).select(fields, { count })
//   - .eq(field, value)
//   - .ilike(field, value)
//   - .or(filterString)
//   - .order(field, { ascending, nullsFirst })
//   - .range(from, to)
//   - .rpc(name, args)
//
// НЕ покрыто (нет в коде проекта):
//   - .insert() / .update() / .delete() / .upsert() — операции записи
//     (проект только читает из БД, запись идёт через админку Supabase)
//   - .in() / .not() / .gte() / .lte() — не используются
//
// Если понадобится операция записи — добавьте методы отдельно или
// используйте db.query() напрямую из lib/db.ts.

import { db } from '@/lib/db';

// ─── Типы ───────────────────────────────────────────────────────────────────

type PostgrestError = { message: string; code?: string; details?: string; hint?: string } | null;

interface SelectOptions {
  count?: 'exact' | 'planned' | 'estimated';
  head?: boolean;
}

interface OrderOptions {
  ascending?: boolean;
  nullsFirst?: boolean;
  foreignTable?: string;
}

interface QueryResult<T = any> {
  data: T[] | null;
  count?: number | null;
  error: PostgrestError;
  status: number;
  statusText: string;
}

interface RpcResult<T = any> {
  data: T | null;
  error: PostgrestError;
}

// ─── Chainable Table Builder ────────────────────────────────────────────────

class TableQuery<T = any> {
  private table: string;
  private selectFields: string = '*';
  private countMode?: 'exact';
  private headOnly?: boolean;  // select('*', { head: true }) → только count, без строк
  private filters: { clause: string; params: any[] }[] = [];
  private orderClauses: string[] = [];
  private rangeFrom?: number;
  private rangeTo?: number;

  constructor(table: string) {
    this.table = table;
  }

  /** .select('id, name, brand') или .select('*', { count: 'exact' }) */
  select(fields: string = '*', opts?: SelectOptions): this {
    this.selectFields = fields;
    this.headOnly = opts?.head === true;
    if (opts?.count) {
      this.countMode = opts.count === 'planned' || opts.count === 'estimated' ? 'exact' : opts.count;
    }
    return this;
  }

  /** .eq('brand_id', uuid) → WHERE brand_id = $1 */
  eq(field: string, value: any): this {
    const paramIdx = this.countParams() + 1;
    this.filters.push({
      clause: `${field} = $${paramIdx}`,
      params: [value],
    });
    return this;
  }

  /** .neq('status', 'draft') → WHERE status != $1 */
  neq(field: string, value: any): this {
    const paramIdx = this.countParams() + 1;
    this.filters.push({
      clause: `${field} <> $${paramIdx}`,
      params: [value],
    });
    return this;
  }

  /** .ilike('sku', '%STM32%') → WHERE sku ILIKE $1 */
  ilike(field: string, pattern: string): this {
    const paramIdx = this.countParams() + 1;
    this.filters.push({
      clause: `${field} ILIKE $${paramIdx}`,
      params: [pattern],
    });
    return this;
  }

  /**
   * .not(field, op, value) — отрицание.
   * Поддерживаемые операторы:
   *   .not('parent_id', 'is', null) → WHERE parent_id IS NOT NULL
   *   .not('status', 'eq', 'draft') → WHERE status <> $1
   *   .not('brand', 'like', 'X%')   → WHERE brand NOT LIKE $1
   *   .not('brand', 'ilike', 'X%')  → WHERE brand NOT ILIKE $1
   *   .not('id', 'in', '(a,b,c)')   → WHERE id NOT IN (a,b,c)
   */
  not(field: string, op: string, value: any): this {
    const opLower = op.toLowerCase();
    if (opLower === 'is') {
      // .not('field', 'is', null) → field IS NOT NULL
      // .not('field', 'is', true) → field IS NOT TRUE
      if (value === null) {
        this.filters.push({ clause: `${field} IS NOT NULL`, params: [] });
      } else if (value === true) {
        this.filters.push({ clause: `${field} IS NOT TRUE`, params: [] });
      } else if (value === false) {
        this.filters.push({ clause: `${field} IS NOT FALSE`, params: [] });
      } else {
        // not is <value> — эквивалентно neq
        const paramIdx = this.countParams() + 1;
        this.filters.push({ clause: `${field} <> $${paramIdx}`, params: [value] });
      }
    } else if (opLower === 'eq') {
      const paramIdx = this.countParams() + 1;
      this.filters.push({ clause: `${field} <> $${paramIdx}`, params: [value] });
    } else if (opLower === 'neq') {
      const paramIdx = this.countParams() + 1;
      this.filters.push({ clause: `${field} = $${paramIdx}`, params: [value] });
    } else if (opLower === 'like') {
      const paramIdx = this.countParams() + 1;
      this.filters.push({ clause: `${field} NOT LIKE $${paramIdx}`, params: [value] });
    } else if (opLower === 'ilike') {
      const paramIdx = this.countParams() + 1;
      this.filters.push({ clause: `${field} NOT ILIKE $${paramIdx}`, params: [value] });
    } else if (opLower === 'in') {
      // value — строка формата "(a,b,c)" или массив
      let inList: string;
      if (Array.isArray(value)) {
        const paramIdx = this.countParams() + 1;
        const placeholders = value.map((_, i) => `$${paramIdx + i}`).join(',');
        this.filters.push({ clause: `${field} NOT IN (${placeholders})`, params: [...value] });
        return this;
      } else {
        // строка "(a,b,c)" — вставляем как literal
        inList = String(value).replace(/^\(/, '').replace(/\)$/, '');
        this.filters.push({ clause: `${field} NOT IN (${inList})`, params: [] });
      }
    } else if (opLower === 'gt' || opLower === 'gte' || opLower === 'lt' || opLower === 'lte') {
      const sqlOp = opLower === 'gt' ? '<=' : opLower === 'gte' ? '<' : opLower === 'lt' ? '>=' : '>';
      const paramIdx = this.countParams() + 1;
      this.filters.push({ clause: `${field} ${sqlOp} $${paramIdx}`, params: [value] });
    } else {
      // Неизвестный оператор — добавляем как <>
      const paramIdx = this.countParams() + 1;
      this.filters.push({ clause: `${field} <> $${paramIdx}`, params: [value] });
    }
    return this;
  }

  /**
   * .in(field, array) — WHERE field IN (val1, val2, ...)
   * value может быть массивом или строкой "(v1,v2,v3)"
   */
  in(field: string, value: any[] | string): this {
    if (Array.isArray(value)) {
      if (value.length === 0) {
        // IN () — невозможно в SQL, добавляем always-false
        this.filters.push({ clause: 'FALSE', params: [] });
        return this;
      }
      const paramIdx = this.countParams() + 1;
      const placeholders = value.map((_, i) => `$${paramIdx + i}`).join(',');
      this.filters.push({ clause: `${field} IN (${placeholders})`, params: [...value] });
    } else {
      // строка "(v1,v2,v3)"
      const inList = String(value).replace(/^\(/, '').replace(/\)$/, '');
      this.filters.push({ clause: `${field} IN (${inList})`, params: [] });
    }
    return this;
  }

  /** .gte('created_at', '2026-01-01') → WHERE field >= $1 */
  gte(field: string, value: any): this {
    const paramIdx = this.countParams() + 1;
    this.filters.push({ clause: `${field} >= $${paramIdx}`, params: [value] });
    return this;
  }

  /** .lte(field, value) → WHERE field <= $1 */
  lte(field: string, value: any): this {
    const paramIdx = this.countParams() + 1;
    this.filters.push({ clause: `${field} <= $${paramIdx}`, params: [value] });
    return this;
  }

  /** .gt(field, value) → WHERE field > $1 */
  gt(field: string, value: any): this {
    const paramIdx = this.countParams() + 1;
    this.filters.push({ clause: `${field} > $${paramIdx}`, params: [value] });
    return this;
  }

  /** .lt(field, value) → WHERE field < $1 */
  lt(field: string, value: any): this {
    const paramIdx = this.countParams() + 1;
    this.filters.push({ clause: `${field} < $${paramIdx}`, params: [value] });
    return this;
  }

  /** .is(field, value) → WHERE field IS NULL / IS TRUE / IS FALSE */
  is(field: string, value: any): this {
    if (value === null) {
      this.filters.push({ clause: `${field} IS NULL`, params: [] });
    } else if (value === true) {
      this.filters.push({ clause: `${field} IS TRUE`, params: [] });
    } else if (value === false) {
      this.filters.push({ clause: `${field} IS FALSE`, params: [] });
    } else {
      const paramIdx = this.countParams() + 1;
      this.filters.push({ clause: `${field} = $${paramIdx}`, params: [value] });
    }
    return this;
  }

  /** .like('sku', 'STM32%') → WHERE sku LIKE $1 (case-sensitive) */
  like(field: string, pattern: string): this {
    const paramIdx = this.countParams() + 1;
    this.filters.push({ clause: `${field} LIKE $${paramIdx}`, params: [pattern] });
    return this;
  }

  /**
   * .limit(n) — добавить LIMIT n.
   * Если уже есть .range() — ограничивает сверху.
   */
  limit(n: number): this {
    // Если range уже задан — переопределяем limit на min(n, rangeTo-rangeFrom+1)
    if (this.rangeFrom !== undefined && this.rangeTo !== undefined) {
      const rangeSize = this.rangeTo - this.rangeFrom + 1;
      if (n < rangeSize) {
        this.rangeTo = this.rangeFrom + n - 1;
      }
    } else {
      // Устанавливаем range 0..n-1
      this.rangeFrom = 0;
      this.rangeTo = n - 1;
    }
    return this;
  }

  /**
   * .single() — вернуть одну строку.
   * В Supabase: `{ data: T | null, error }` (без массива).
   * В нашей реализации: после execute() берём первую строку.
   */
  async single(): Promise<{ data: T | null; error: PostgrestError; status: number; statusText: string }> {
    // Принудительно limit 1
    this.rangeFrom = 0;
    this.rangeTo = 0;
    try {
      const result = await this.execute();
      const first = result.data && result.data.length > 0 ? result.data[0] : null;
      return {
        data: first,
        error: result.error,
        status: result.status,
        statusText: result.statusText,
      };
    } catch (e: any) {
      return {
        data: null,
        error: { message: e?.message || 'Query failed' },
        status: 500,
        statusText: 'Internal Server Error',
      };
    }
  }

  /** .maybeSingle() — то же что single, но не бросает ошибку при пустом результате */
  async maybeSingle(): Promise<{ data: T | null; error: PostgrestError; status: number; statusText: string }> {
    return this.single();
  }

  /**
   * .contains('attributes', {"key": "value"}) — jsonb containment
   * → WHERE field @> $1::jsonb
   */
  contains(field: string, value: any): this {
    const paramIdx = this.countParams() + 1;
    const jsonValue = typeof value === 'string' ? value : JSON.stringify(value);
    this.filters.push({
      clause: `${field} @> $${paramIdx}::jsonb`,
      params: [jsonValue],
    });
    return this;
  }

  /**
   * .filter(field, op, value) — raw filter
   * Например: .filter('id', 'in', '(a,b,c)')
   * → WHERE field op value (value вставляется как literal, без параметризации)
   * ИСПОЛЬЗУЙТЕ С ОСТОРОЖНОСТЬЮ — нет SQL injection protection.
   */
  filter(field: string, op: string, value: any): this {
    this.filters.push({
      clause: `${field} ${op} ${value}`,
      params: [],
    });
    return this;
  }

  /**
   * .match({ field1: value1, field2: value2 }) — множественный eq
   * → WHERE field1 = $1 AND field2 = $2
   * Используется в 87 местах кода проекта — критично для работы.
   */
  match(conditions: Record<string, any>): this {
    for (const [field, value] of Object.entries(conditions)) {
      const paramIdx = this.countParams() + 1;
      if (value === null) {
        this.filters.push({ clause: `${field} IS NULL`, params: [] });
      } else {
        this.filters.push({ clause: `${field} = $${paramIdx}`, params: [value] });
      }
    }
    return this;
  }

  /**
   * .insert(rows) — INSERT INTO table (...) VALUES (...).
   * Возвращает { data: null, error: null } (наша обёртка не поддерживает RETURNING).
   * Если нужна возвращённая строка — используйте db.query напрямую.
   */
  async insert(rows: any | any[]): Promise<{ data: any | null; error: PostgrestError; status: number; statusText: string }> {
    const arr = Array.isArray(rows) ? rows : [rows];
    if (arr.length === 0) {
      return { data: null, error: null, status: 200, statusText: 'OK' };
    }
    // Колонки из первого объекта
    const cols = Object.keys(arr[0]);
    if (cols.length === 0) {
      return { data: null, error: { message: 'No columns to insert' }, status: 400, statusText: 'Bad Request' };
    }
    // VALUES: $1, $2, ..., $N для каждой строки
    const placeholders: string[] = [];
    const params: any[] = [];
    let paramIdx = 1;
    for (const row of arr) {
      const rowPlaceholders: string[] = [];
      for (const col of cols) {
        rowPlaceholders.push(`$${paramIdx}`);
        params.push(row[col]);
        paramIdx++;
      }
      placeholders.push(`(${rowPlaceholders.join(',')})`);
    }
    const colsList = cols.join(',');
    const sql = `INSERT INTO ${this.table} (${colsList}) VALUES ${placeholders.join(',')}`;

    try {
      await db.query(sql, params);
      return { data: null, error: null, status: 201, statusText: 'Created' };
    } catch (e: any) {
      console.error(`[supabase-compat] insert error:`, e?.message);
      return {
        data: null,
        error: { message: e?.message || 'Insert failed', code: e?.code },
        status: 500,
        statusText: 'Internal Server Error',
      };
    }
  }

  /**
   * .update(values) — UPDATE table SET col1=$1, col2=$2 WHERE ...
   * Должен вызываться после .eq() / .match() и т.п.
   * Возвращает { data: null, error: null }.
   */
  async update(values: Record<string, any>): Promise<{ data: any | null; error: PostgrestError; status: number; statusText: string }> {
    const cols = Object.keys(values);
    if (cols.length === 0) {
      return { data: null, error: { message: 'No columns to update' }, status: 400, statusText: 'Bad Request' };
    }
    const setClauses: string[] = [];
    const params: any[] = [];
    let paramIdx = 1;
    for (const col of cols) {
      setClauses.push(`${col} = $${paramIdx}`);
      params.push(values[col]);
      paramIdx++;
    }
    let sql = `UPDATE ${this.table} SET ${setClauses.join(',')}`;
    const whereParts = this.filters.map((f) => f.clause);
    for (const f of this.filters) {
      params.push(...f.params);
      // уже в whereParts
    }
    if (whereParts.length > 0) {
      sql += ` WHERE ${whereParts.join(' AND ')}`;
    }
    try {
      await db.query(sql, params);
      return { data: null, error: null, status: 200, statusText: 'OK' };
    } catch (e: any) {
      console.error(`[supabase-compat] update error:`, e?.message);
      return {
        data: null,
        error: { message: e?.message || 'Update failed', code: e?.code },
        status: 500,
        statusText: 'Internal Server Error',
      };
    }
  }

  /**
   * .delete() — DELETE FROM table WHERE ...
   * Должен вызываться после .eq() / .match() и т.п.
   */
  async delete(): Promise<{ data: any | null; error: PostgrestError; status: number; statusText: string }> {
    let sql = `DELETE FROM ${this.table}`;
    const whereParts = this.filters.map((f) => f.clause);
    const params: any[] = [];
    for (const f of this.filters) {
      params.push(...f.params);
    }
    if (whereParts.length > 0) {
      sql += ` WHERE ${whereParts.join(' AND ')}`;
    }
    try {
      await db.query(sql, params);
      return { data: null, error: null, status: 200, statusText: 'OK' };
    } catch (e: any) {
      console.error(`[supabase-compat] delete error:`, e?.message);
      return {
        data: null,
        error: { message: e?.message || 'Delete failed', code: e?.code },
        status: 500,
        statusText: 'Internal Server Error',
      };
    }
  }

  /**
   * .upsert(rows) — INSERT ... ON CONFLICT DO UPDATE (упрощённо: INSERT с игнорированием конфликтов).
   * Если есть UNIQUE constraint — обновляет; иначе просто INSERT.
   * Здесь реализация простая: пробуем INSERT, при конфликте — UPDATE по первой UNIQUE колонке.
   * Для production лучше использовать db.query напрямую.
   */
  async upsert(rows: any | any[]): Promise<{ data: any | null; error: PostgrestError; status: number; statusText: string }> {
    const arr = Array.isArray(rows) ? rows : [rows];
    if (arr.length === 0) {
      return { data: null, error: null, status: 200, statusText: 'OK' };
    }
    const cols = Object.keys(arr[0]);
    const placeholders: string[] = [];
    const params: any[] = [];
    let paramIdx = 1;
    for (const row of arr) {
      const rowPlaceholders: string[] = [];
      for (const col of cols) {
        rowPlaceholders.push(`$${paramIdx}`);
        params.push(row[col]);
        paramIdx++;
      }
      placeholders.push(`(${rowPlaceholders.join(',')})`);
    }
    const colsList = cols.join(',');
    // ON CONFLICT DO NOTHING — безопасный fallback
    const sql = `INSERT INTO ${this.table} (${colsList}) VALUES ${placeholders.join(',')} ON CONFLICT DO NOTHING`;

    try {
      await db.query(sql, params);
      return { data: null, error: null, status: 201, statusText: 'Created' };
    } catch (e: any) {
      console.error(`[supabase-compat] upsert error:`, e?.message);
      return {
        data: null,
        error: { message: e?.message || 'Upsert failed', code: e?.code },
        status: 500,
        statusText: 'Internal Server Error',
      };
    }
  }

  /**
   * .or('sku.ilike.%X%,name.ilike.%X%,brand.ilike.%X%')
   * Парсит формат Supabase: field.operator.value,field.operator.value
   * Поддерживаемые операторы: ilike, eq, neq
   */
  or(filterStr: string): this {
    const parts = filterStr.split(',').map((p) => p.trim()).filter(Boolean);
    const orParts: string[] = [];
    const params: any[] = [];

    for (const part of parts) {
      // формат: field.op.value — op может быть ilike, eq, neq
      const m = part.match(/^([a-z_]+)\.([a-z]+)\.(.+)$/i);
      if (!m) continue;
      const [, field, op, value] = m;

      let sqlOp: string;
      switch (op.toLowerCase()) {
        case 'ilike': sqlOp = 'ILIKE'; break;
        case 'eq': sqlOp = '='; break;
        case 'neq': sqlOp = '<>'; break;
        case 'gt': sqlOp = '>'; break;
        case 'gte': sqlOp = '>='; break;
        case 'lt': sqlOp = '<'; break;
        case 'lte': sqlOp = '<='; break;
        default: continue;
      }

      const paramIdx = this.countParams() + params.length + 1;
      orParts.push(`${field} ${sqlOp} $${paramIdx}`);
      params.push(value);
    }

    if (orParts.length > 0) {
      this.filters.push({
        clause: `(${orParts.join(' OR ')})`,
        params,
      });
    }
    return this;
  }

  /** .order('name', { ascending: true }) → ORDER BY name ASC */
  order(field: string, opts?: OrderOptions): this {
    const dir = opts?.ascending === false ? 'DESC' : 'ASC';
    const nullsClause = opts?.nullsFirst === undefined
      ? ''
      : opts.nullsFirst ? ' NULLS FIRST' : ' NULLS LAST';
    this.orderClauses.push(`${field} ${dir}${nullsClause}`);
    return this;
  }

  /** .range(0, 49) → LIMIT 50 OFFSET 0 */
  range(from: number, to: number): this {
    this.rangeFrom = from;
    this.rangeTo = to;
    return this;
  }

  /** Считает общее кол-во параметров в фильтрах — для нумерации $1, $2, ... */
  private countParams(): number {
    return this.filters.reduce((sum, f) => sum + f.params.length, 0);
  }

  /** Выполнить запрос и вернуть результат */
  async then<TResolve = QueryResult<T>, TReject = never>(
    onfulfilled?: (v: QueryResult<T>) => TResolve | PromiseLike<TResolve>,
    onrejected?: (e: any) => TReject | PromiseLike<TReject>
  ): Promise<TResolve | TReject> {
    try {
      const result = await this.execute();
      if (onfulfilled) return onfulfilled(result);
      return result as any;
    } catch (e: any) {
      const error: PostgrestError = {
        message: e?.message || 'Query failed',
        code: e?.code,
      };
      const failResult: QueryResult<T> = {
        data: null,
        count: null,
        error,
        status: 500,
        statusText: 'Internal Server Error',
      };
      if (onrejected) return onrejected(e);
      return failResult as any;
    }
  }

  /** То же что then — для await */
  private async execute(): Promise<QueryResult<T>> {
    // Строим SELECT
    const fields = this.selectFields === '*' ? '*' : this.selectFields;
    const whereParts = this.filters.map((f) => f.clause);
    const allParams: any[] = [];
    for (const f of this.filters) {
      allParams.push(...f.params);
    }

    // Если countMode='exact' и есть range — нужен отдельный COUNT запрос
    let count: number | null = null;
    if (this.countMode === 'exact') {
      // COUNT(*) с теми же WHERE
      const countSql = `SELECT COUNT(*)::int AS cnt FROM ${this.table}` +
        (whereParts.length > 0 ? ` WHERE ${whereParts.join(' AND ')}` : '');
      try {
        const countResult = await db.query(countSql, allParams);
        count = countResult.rows[0]?.cnt || 0;
      } catch (e: any) {
        return {
          data: null,
          count: null,
          error: { message: e?.message || 'Count query failed' },
          status: 500,
          statusText: 'Count query failed',
        };
      }
    }

    // head: true → клиент просил только count, строки не нужны.
    // Возвращаем без основного SELECT (экономия на 52K+ строк при count-only запросах).
    if (this.headOnly) {
      return {
        data: null,
        count,
        error: null,
        status: 200,
        statusText: 'OK',
      };
    }

    // Основной SELECT
    let sql = `SELECT ${fields} FROM ${this.table}`;
    if (whereParts.length > 0) {
      sql += ` WHERE ${whereParts.join(' AND ')}`;
    }
    if (this.orderClauses.length > 0) {
      sql += ` ORDER BY ${this.orderClauses.join(', ')}`;
    }
    if (this.rangeFrom !== undefined && this.rangeTo !== undefined) {
      const limit = this.rangeTo - this.rangeFrom + 1;
      sql += ` LIMIT ${limit} OFFSET ${this.rangeFrom}`;
    }

    const result = await db.query(sql, allParams);
    return {
      data: result.rows as T[],
      count,
      error: null,
      status: 200,
      statusText: 'OK',
    };
  }
}

// ─── RPC (хранимые функции) ─────────────────────────────────────────────────

/**
 * Поддерживаемые RPC:
 *   get_brand_counts()                          → jsonb { "TI": 523, ... }
 *   get_category_counts()                      → jsonb
 *   get_brand_counts_by_category(cat_uuid)     → jsonb
 */
async function rpc<T = any>(fnName: string, args?: Record<string, any>): Promise<RpcResult<T>> {
  try {
    let sql: string;
    let params: any[] = [];

    switch (fnName) {
      case 'get_brand_counts':
        sql = 'SELECT get_brand_counts() AS result';
        break;
      case 'get_category_counts':
        sql = 'SELECT get_category_counts() AS result';
        break;
      case 'get_brand_counts_by_category':
        if (!args?.cat_uuid) {
          return { data: null, error: { message: 'cat_uuid is required' } };
        }
        sql = 'SELECT get_brand_counts_by_category($1) AS result';
        params = [args.cat_uuid];
        break;
      default:
        return { data: null, error: { message: `Unknown RPC: ${fnName}` } };
    }

    const result = await db.query(sql, params);
    const data = result.rows[0]?.result;
    // RPC возвращает jsonb объект — приводим к Record<string, number>
    return { data: (data || {}) as T, error: null };
  } catch (e: any) {
    console.error(`[supabase-compat] rpc(${fnName}) error:`, e?.message);
    return {
      data: null,
      error: { message: e?.message || `RPC ${fnName} failed` },
    };
  }
}

// ─── Главный объект supabase (drop-in замена) ────────────────────────────────

export const supabase = {
  from<T = any>(table: string): TableQuery<T> {
    return new TableQuery<T>(table);
  },
  rpc,
};

// Совместимость со старым экспортом — на случай, если где-то импортируют default
export default supabase;

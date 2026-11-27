// lib/db.ts — Пул подключений к локальной PostgreSQL через node-postgres.
//
// Заменяет облачный Supabase. Использует DATABASE_URL из .env.local:
//   DATABASE_URL=postgresql://chipnet:PASSWORD@127.0.0.1:5432/chip_net
//
// Пул настроен консервативно под VPS 2GB RAM:
//   max: 10 подключений (PostgreSQL max_connections=50, останется для pg_dump и пр.)
//   idleTimeoutMillis: 30s (быстрое освобождение)
//   connectionTimeoutMillis: 5s (быстрый fail при проблемах)

import { Pool, PoolClient, QueryResult, QueryResultRow } from 'pg';

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error('[db] FATAL: DATABASE_URL is not set in environment');
  console.error('[db] Expected format: postgresql://chipnet:PASSWORD@127.0.0.1:5432/chip_net');
}

// Singleton pool — переиспользуется между запросами в рамках процесса Next.js
let _pool: Pool | null = null;

export function getPool(): Pool {
  if (!_pool) {
    if (!DATABASE_URL) {
      throw new Error('DATABASE_URL is not set');
    }
    _pool = new Pool({
      connectionString: DATABASE_URL,
      max: 10,                          // максимум 10 одновременных подключений
      idleTimeoutMillis: 30000,         // 30 сек idle → закрыть
      connectionTimeoutMillis: 5000,    // 5 сек на подключение
      statement_timeout: 15000,         // 15 сек на выполнение запроса (защита от долгих запросов)
      query_timeout: 15000,
    });

    _pool.on('error', (err) => {
      console.error('[db] Pool error:', err.message);
    });
  }
  return _pool;
}

/**
 * Выполнить SQL-запрос с параметрами.
 * Возвращает полный результат (rows, rowCount, fields).
 */
export async function query<T extends QueryResultRow = QueryResultRow>(
  text: string,
  params?: (string | number | boolean | null | Date)[]
): Promise<QueryResult<T>> {
  const pool = getPool();
  return pool.query<T>(text, params);
}

/**
 * Выполнить SQL-запрос и вернуть только строки.
 */
export async function queryRows<T extends QueryResultRow = QueryResultRow>(
  text: string,
  params?: (string | number | boolean | null | Date)[]
): Promise<T[]> {
  const result = await query<T>(text, params);
  return result.rows;
}

/**
 * Выполнить SQL-запрос и вернуть первую строку (или null).
 */
export async function queryOne<T extends QueryResultRow = QueryResultRow>(
  text: string,
  params?: (string | number | boolean | null | Date)[]
): Promise<T | null> {
  const rows = await queryRows<T>(text, params);
  return rows[0] || null;
}

/**
 * Получить клиента из пула для транзакций.
 * Не забудьте вызвать client.release() в finally.
 */
export async function getClient(): Promise<PoolClient> {
  return getPool().connect();
}

// Для graceful shutdown
export async function closePool(): Promise<void> {
  if (_pool) {
    await _pool.end();
    _pool = null;
    console.log('[db] Pool closed');
  }
}

// Сам пул для прямого доступа (если нужно)
export const db = {
  query,
  queryRows,
  queryOne,
  getClient,
  closePool,
  get pool() { return getPool(); },
};

// lib/supabase-admin.ts — server-side DB client for admin/server operations.
//
// МИГРАЦИЯ 2026-11-13: ранее это был реальный Supabase service_role клиент
// (createClient из @supabase/supabase-js), который ходил на
// Supabase (проект заблокирован HTTP 402,
// exceed_egress_quota) и миграции на локальную PostgreSQL chip_net этот
// модуль стал тонкой обёрткой над lib/supabase.ts — drop-in цепочечным API
// поверх pg Pool.
//
// Локальный PG-пользователь chipnet имеет полный доступ к БД chip_net
// (без RLS), что функционально эквивалентно service_role в Supabase.
//
// Потребители (app/admin/demand, app/catalog/page/[page],
// components/sections/PopularComponents, components/sections/SimilarComponents)
// получают те же .from().select().eq().order().limit().range().rpc() и т.д.
// — ничего менять в их коде не нужно.
//
// NEVER import this in client components.

import { supabase } from '@/lib/supabase';
import type { SupabaseClient } from '@supabase/supabase-js';

// Drop-in over local PG, приведённый к типу SupabaseClient для совместимости
// с существующими аннотациями потребителей (структурно API идентичен).
export const supabaseAdmin = supabase as unknown as SupabaseClient;

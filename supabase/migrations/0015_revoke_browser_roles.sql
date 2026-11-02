-- ─────────────────────────────────────────────────────────────────────────────
-- 0015 브라우저 역할의 남은 권한 걷기, 함수 search_path 고정 (2026-11-02, Supabase 감사).
--
-- DECIDED 2026-11-02 (사용자: "3,4 정리"): 감사에서 나온 두 가지를 정리합니다.
--
--   1. anon, authenticated가 public의 모든 표와 뷰에 Supabase 기본값의 권한(INSERT, UPDATE, DELETE,
--      TRUNCATE, 표에는 SELECT까지)을 갖고 있었습니다. 모든 표에 RLS가 켜져 있고 정책이 없으며 뷰는
--      security_invoker라 API로는 쓸 수 없었지만, "anon, authenticated에는 주지 않는다"(CLAUDE.md,
--      2026-10-23)와 어긋났고 TRUNCATE는 RLS가 막지 않습니다. 브라우저는 Supabase에 직접 닿지 않고
--      언제나 서버(service_role)를 거치므로 걷어도 바뀌는 동작은 없습니다.
--      앞으로 postgres가 만드는 표, 함수, 시퀀스에도 두 역할의 권한이 붙지 않게 기본 권한을 걷습니다.
--      (supabase_admin의 기본 권한은 그 역할만 바꿀 수 있어 그대로 둡니다. 마이그레이션은 postgres로 돕니다.)
--   2. 함수 넷의 search_path가 고정돼 있지 않았습니다(advisor: function_search_path_mutable). 본문이 모두
--      public.* 전체 이름이나 pg_catalog 내장 함수만 쓰므로 빈 search_path로 고정합니다.
--
-- service_role의 권한은 건드리지 않습니다. 여러 번 돌려도 같은 결과입니다.
-- ─────────────────────────────────────────────────────────────────────────────

-- ── 1 · 지금 있는 표와 뷰, 시퀀스, 함수 ─────────────────────────────────────────
revoke all on all tables in schema public from anon, authenticated;
revoke all on all sequences in schema public from anon, authenticated;
revoke all on all functions in schema public from anon, authenticated;

-- ── 1 · 앞으로 만드는 것(postgres 소유) ───────────────────────────────────────
alter default privileges for role postgres in schema public revoke all on tables from anon, authenticated;
alter default privileges for role postgres in schema public revoke all on sequences from anon, authenticated;
alter default privileges for role postgres in schema public revoke all on functions from anon, authenticated;

-- ── 2 · 함수 search_path ─────────────────────────────────────────────────────
alter function public.crossing_bookings_daily_limit() set search_path = '';
alter function public.crossing_fill_track() set search_path = '';
alter function public.crossing_norm_name(text) set search_path = '';
alter function public.crossing_plus_minutes(timestamptz, integer) set search_path = '';

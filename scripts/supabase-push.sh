#!/bin/bash
# 대기 중인 Supabase 마이그레이션을 실서버에 적용합니다(supabase db push --linked).
# .env.local의 SUPABASE_DB_PASSWORD를 씁니다. 액세스 토큰이 만료돼도 DB 비밀번호로 돕니다(2026-11-02).
# 실행: bash scripts/supabase-push.sh  (레포 루트에서). 확인을 물으면 Y.
cd "$(dirname "$0")/.." || exit 1
export SUPABASE_DB_PASSWORD="$(grep '^SUPABASE_DB_PASSWORD=' .env.local | cut -d= -f2- | tr -d "\"' ")"
supabase db push --linked

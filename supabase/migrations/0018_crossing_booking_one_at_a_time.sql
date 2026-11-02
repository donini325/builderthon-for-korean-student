-- ─────────────────────────────────────────────────────────────────────────────
-- 0018 멘토 칸: 이틀 통틀어 한 번에 한 칸, 2시간 규칙 없앰 (2026-11-03).
--
-- DECIDED 2026-11-03 (사용자): 규칙의 목적은 모든 팀이 한 번은 멘토님을 만나는 것과 멘토님께 무리가 가지 않는 것.
-- 한 팀은 한 번에 한 칸만 넣고(Day 2, 3 통틀어), 넣은 멘토링이 끝나면(칸의 시작에서 60분) 다음 칸을 넣습니다.
-- 그래서 미리(Day 1) 넣을 수 있는 칸은 하나이고, 칸 24개에 16팀이 먼저 한 번씩 갑니다.
-- 0016 트리거의 "같은 날" 조건을 걷어 팀 단위로 봅니다. 0008의 2시간 제약(team_cooldown)은 걷고,
-- 한 팀의 두 칸이 겹치지 않게 하는 60분 제약(team_overlap)만 둡니다. 멘토 앞뒤 10분 제약(mentor_buffer)은 그대로.
-- lib/crossingOps.ts teamHasPending, GRID_MINUTES와 같아야 합니다. 여러 번 돌려도 같은 결과입니다.
-- ─────────────────────────────────────────────────────────────────────────────

create or replace function public.crossing_bookings_one_pending()
  returns trigger language plpgsql set search_path = '' as $$
begin
  perform pg_advisory_xact_lock(hashtext('crossing_booking:' || new.team_name));
  if exists (
    select 1 from public.crossing_mentor_bookings
    where team_name = new.team_name
      and starts_at + interval '60 minutes' > now()
  ) then
    raise exception 'team_pending' using errcode = 'P0001';
  end if;
  return new;
end $$;
revoke execute on function public.crossing_bookings_one_pending() from public, anon, authenticated;

alter table public.crossing_mentor_bookings drop constraint if exists crossing_bookings_team_cooldown;
alter table public.crossing_mentor_bookings drop constraint if exists crossing_bookings_team_overlap;
alter table public.crossing_mentor_bookings add constraint crossing_bookings_team_overlap
  exclude using gist (team_name with =, tstzrange(starts_at, public.crossing_plus_minutes(starts_at, 60), '[)') with &&);

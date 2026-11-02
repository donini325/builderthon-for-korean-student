-- ─────────────────────────────────────────────────────────────────────────────
-- 0016 멘토 칸: 하루 두 칸 대신, 그 날 넣은 칸이 끝난 뒤에 다음 칸 (2026-11-02).
--
-- DECIDED 2026-11-02 (사용자: "하루 한도는 없음", "3시로 booking 을 하면, 4시에 마무리가 되니까, 4시 이후에 booking",
-- "날마다 하나씩 미리"): 0010의 하루 두 칸 트리거를 걷고, 같은 팀과 날에 아직 끝나지 않은 칸이 있으면 막는 트리거로 바꿉니다.
-- 끝은 칸의 시작에서 60분(시간표 한 줄, lib/crossingOps.ts GRID_MINUTES)입니다. 0008의 2시간 제약(team_cooldown)은 그대로.
-- 같은 순간 두 요청이 들어와도 하나만 들어가게 팀과 날로 잠급니다(0010과 같은 방식). 여러 번 돌려도 같은 결과입니다.
-- ─────────────────────────────────────────────────────────────────────────────

create or replace function public.crossing_bookings_one_pending()
  returns trigger language plpgsql set search_path = '' as $$
begin
  perform pg_advisory_xact_lock(hashtext('crossing_booking:' || new.team_name || ':' || new.day));
  if exists (
    select 1 from public.crossing_mentor_bookings
    where team_name = new.team_name and day = new.day
      and starts_at + interval '60 minutes' > now()
  ) then
    raise exception 'team_pending' using errcode = 'P0001';
  end if;
  return new;
end $$;
revoke execute on function public.crossing_bookings_one_pending() from public, anon, authenticated;

drop trigger if exists crossing_bookings_daily_limit on public.crossing_mentor_bookings;
drop function if exists public.crossing_bookings_daily_limit();

drop trigger if exists crossing_bookings_one_pending on public.crossing_mentor_bookings;
create trigger crossing_bookings_one_pending
  before insert on public.crossing_mentor_bookings
  for each row execute function public.crossing_bookings_one_pending();

-- ─────────────────────────────────────────────────────────────────────────────
-- 0022 멘토 칸: 마감(오전은 전날, 오후는 그날 12:00), 한 칸 제한을 없애고 팀 간격 2시간, 멘토 장소 (2026-11-08).
--
-- DECIDED 2026-11-08 (사용자, docs/booking-cutoff-brief.md): 멘토가 갑자기 튀어나온 예약에 놀라지 않게.
--  R3 오전 칸(KST 시작 13:00 전, 9:00 칸 포함)은 전날에 닫힙니다. Day 2는 Day 1 17:00, Day 3은 Day 2 14:00.
--  R4 오후 칸(13:00, 14:00, 15:00)은 그날 12:00에 닫힙니다.
--  R5 같은 팀의 두 칸은 시작이 2시간 이상 떨어져야 합니다(이동 시간). 0018의 60분 제약을 120분으로.
--  R6 팀이 미리 들고 있을 수 있는 칸 수는 제한이 없습니다. 0016, 0018의 crossing_bookings_one_pending 트리거를 걷습니다.
--  C6 멘토 장소(place, 예: "선릉 오피스", "온라인")를 시간표 머리에 보입니다. 값은 운영진이 표 편집기에서 넣습니다.
-- lib/crossingOps.ts의 TEAM_GAP_MINUTES, MORNING_END, MORNING_CUTOFF, AFTERNOON_CUTOFF와 같아야 합니다. 여러 번 돌려도 같은 결과입니다.
--
-- 적용 전 확인(0019, 0020, 0021처럼): 이 회차 예약이 0건이어야 합니다. 120분 제약은 이미 있는 행이 어기면 만들어지지 않습니다.
--   select count(*) from public.crossing_mentor_bookings b
--   join public.crossing_mentors m on m.id = b.mentor_id
--   where m.event_slug = 'crossing-seoul-2026-12';
--   -- 0이 아니면 적용하지 말고 운영진과 먼저 봅니다.
--
-- 마감 뒤에 운영진이 표 편집기로 칸을 넣어야 하면(D3) 트리거를 잠시 끕니다(넣은 뒤 다시 켭니다):
--   alter table public.crossing_mentor_bookings disable trigger crossing_bookings_cutoff;
--   alter table public.crossing_mentor_bookings enable trigger crossing_bookings_cutoff;
-- ─────────────────────────────────────────────────────────────────────────────

-- R6: 한 번에 한 칸 트리거를 걷습니다.
drop trigger if exists crossing_bookings_one_pending on public.crossing_mentor_bookings;
drop function if exists public.crossing_bookings_one_pending();

-- R5: 같은 팀의 두 칸은 시작이 120분 이상 떨어져야 합니다. 이름은 그대로 둡니다(라우트가 이 이름으로 team_gap을 알아봅니다).
alter table public.crossing_mentor_bookings drop constraint if exists crossing_bookings_team_overlap;
alter table public.crossing_mentor_bookings add constraint crossing_bookings_team_overlap
  exclude using gist (team_name with =, tstzrange(starts_at, public.crossing_plus_minutes(starts_at, 120), '[)') with &&);

-- R3, R4: 마감. 서버와 같은 시계(now())로 봅니다. Day 2, 3이 아닌 행은 건드리지 않습니다.
create or replace function public.crossing_bookings_cutoff()
  returns trigger language plpgsql set search_path = '' as $$
declare
  local_start timestamp := new.starts_at at time zone 'Asia/Seoul';
  cutoff timestamptz;
begin
  if new.day not in (2, 3) then
    return new;
  end if;
  if local_start::time < time '13:00' then
    -- 오전 칸: 전날. Day 2는 17:00, Day 3은 14:00.
    cutoff := ((local_start::date - 1) + case new.day when 2 then time '17:00' else time '14:00' end) at time zone 'Asia/Seoul';
  else
    -- 오후 칸: 그날 12:00.
    cutoff := (local_start::date + time '12:00') at time zone 'Asia/Seoul';
  end if;
  if now() >= cutoff then
    raise exception 'closed' using errcode = 'P0001';
  end if;
  return new;
end $$;
revoke execute on function public.crossing_bookings_cutoff() from public, anon, authenticated;

drop trigger if exists crossing_bookings_cutoff on public.crossing_mentor_bookings;
create trigger crossing_bookings_cutoff
  before insert on public.crossing_mentor_bookings
  for each row execute function public.crossing_bookings_cutoff();

-- C6: 멘토 장소.
alter table public.crossing_mentors add column if not exists place text check (place is null or char_length(place) <= 40);

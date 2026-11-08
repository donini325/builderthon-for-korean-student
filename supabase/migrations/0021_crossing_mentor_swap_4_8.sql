-- DECIDED 2026-11-08 (사용자): 멘토 4번(Day 2 오후)과 8번(Day 3 오후)이 맡는 날을 서로 바꿉니다. 시간은 둘 다 13:00~16:00 그대로입니다.
-- 그래서 4번은 Day 3 오후, 8번은 Day 2 오후가 됩니다. 0017의 "sort 3, 4 = Day 2 오후 / 7, 8 = Day 3 오후" 나눔은 이 두 분만 예외입니다.
-- 어느 번호가 누구인지는 운영진 문서(크로싱서울_멘토링크)에만 있습니다. 이 파일에 이름을 쓰지 않습니다.
-- 이 파일을 쓸 때 두 멘토의 예약은 0건이었습니다(예약 행의 day는 건드리지 않습니다).
update public.crossing_mentor_windows w
set day = case m.sort when 4 then 3 when 8 then 2 end
from public.crossing_mentors m
where w.mentor_id = m.id
  and m.event_slug = 'crossing-seoul-2026-12'
  and ((m.sort = 4 and w.day = 2) or (m.sort = 8 and w.day = 3))
  and w.start_time = time '13:00'
  and w.end_time = time '16:00';

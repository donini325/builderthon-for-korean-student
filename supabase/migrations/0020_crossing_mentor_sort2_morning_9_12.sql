-- DECIDED 2026-11-04 (사용자): 멘토 2번(Day 2 오전)은 개인 사정으로 10:00~13:00 대신 09:00~12:00(칸 9, 10, 11시)을 맡습니다.
-- 다른 멘토의 반나절(오전 10:00~13:00, 오후 13:00~16:00, 0017, 0019)은 그대로입니다. 이 한 분만 예외입니다.
-- 어느 번호가 누구인지는 운영진 문서(크로싱서울_멘토링크)에만 있습니다. 이 파일에 이름을 쓰지 않습니다.
-- 이 파일을 쓸 때 이 멘토의 예약은 0건이었습니다.
update public.crossing_mentor_windows w
set start_time = time '09:00', end_time = time '12:00'
from public.crossing_mentors m
where w.mentor_id = m.id
  and m.event_slug = 'crossing-seoul-2026-12'
  and m.sort = 2
  and w.day = 2
  and w.start_time = time '10:00'
  and w.end_time = time '13:00';

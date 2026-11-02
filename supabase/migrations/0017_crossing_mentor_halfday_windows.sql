-- DECIDED 2026-11-03 (사용자): 멘토 한 분은 Day 2(12.19 토) 또는 Day 3(12.20 일) 중 하루의 반나절만 맡습니다.
-- 오전 10:00~13:00(칸 10, 11, 12시), 오후 14:00~17:00(칸 14, 15, 16시). 13:00~14:00은 점심이라 칸이 없습니다.
-- 한 반나절에 두 분씩: sort 1, 2 = Day 2 오전 / 3, 4 = Day 2 오후 / 5, 6 = Day 3 오전 / 7, 8 = Day 3 오후. 9, 10은 아직 비어 있습니다(보류 1, 예비 1).
-- 어느 번호가 누구인지는 운영진 문서(크로싱서울_멘토링크)에만 있습니다. 이 파일에 이름을 쓰지 않습니다.
-- 그날 행이 없는 멘토는 그날 칸이 없습니다(lib/crossingOps.ts windowsFor, 2026-11-03부터. 그 전 기본값 10:00~22:00은 없앰).
insert into public.crossing_mentor_windows (mentor_id, day, start_time, end_time)
select m.id, v.day, v.start_time, v.end_time
from public.crossing_mentors m
join (values
  (1, 2, time '10:00', time '13:00'), (2, 2, time '10:00', time '13:00'),
  (3, 2, time '14:00', time '17:00'), (4, 2, time '14:00', time '17:00'),
  (5, 3, time '10:00', time '13:00'), (6, 3, time '10:00', time '13:00'),
  (7, 3, time '14:00', time '17:00'), (8, 3, time '14:00', time '17:00')
) as v(sort, day, start_time, end_time) on v.sort = m.sort
where m.event_slug = 'crossing-seoul-2026-12'
  and not exists (select 1 from public.crossing_mentor_windows w where w.mentor_id = m.id);

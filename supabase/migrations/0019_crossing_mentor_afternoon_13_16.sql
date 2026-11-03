-- DECIDED 2026-11-03 (사용자: "멘토링은 10시부터 4시까지, 점심시간 없이"): 하루는 10:00~16:00이고 점심시간이 없습니다.
-- 반나절 둘은 그대로이고(docs/mentoring-hours-brief.md D1), 오후 반나절만 14:00~17:00에서 13:00~16:00(칸 13, 14, 15시)으로 옮깁니다.
-- 오전 10:00~13:00, 반나절마다 두 분, 멘토 번호(sort 3, 4 = Day 2 오후 / 7, 8 = Day 3 오후)는 0017 그대로입니다.
-- 이 회차 멘토의 14:00~17:00 행만 고칩니다. 행을 지우거나 더하지 않습니다.
update public.crossing_mentor_windows w
set start_time = time '13:00', end_time = time '16:00'
from public.crossing_mentors m
where w.mentor_id = m.id
  and m.event_slug = 'crossing-seoul-2026-12'
  and w.start_time = time '14:00'
  and w.end_time = time '17:00';

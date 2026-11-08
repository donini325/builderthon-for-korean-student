# 멘토 반나절 칸 브리프 (2026-11-03)

대상 레포: `website`. 바꾸는 파일은 `lib/crossingOps.ts`, `app/api/crossing/mentoring/route.ts`, `app/api/crossing/mentor/route.ts`, `components/crossing/TeamTool.tsx`, `components/crossing/MentorTool.tsx`, `data/crossingTeam.ts`, 그리고 새 마이그레이션 `supabase/migrations/0017_crossing_mentor_halfday_windows.sql`. 배경(WebGL), 홈, 등록 폼, 매치, 투표, 미션 인증(proofs)은 건드리지 않습니다. 체인지로그는 `CLAUDE.md` 규칙대로 `CHANGELOG.md` 맨 위 항목 하나에만 씁니다. em dash 문자는 쓰지 않습니다. 사람 이름은 레포에 옮기지 않습니다(멘토 실명은 운영진 문서에만 있습니다).

출처: 사용자 결정(2026-11-03). 10/27~11/2 멘토 미팅에서 받은 가용 시간을 모아 배정했습니다.

## 0. 결론 한 줄

**멘토 한 분은 Day 2(12.19 토) 또는 Day 3(12.20 일) 중 하루, 그날의 반나절(오전 10:00~13:00 또는 오후 14:00~17:00)만 맡습니다. 한 반나절에 두 분씩이라 날마다 오전 2, 오후 2, 이틀 8분입니다. 13:00~14:00은 점심이라 칸이 없습니다.** 칸의 길이(40분)와 정각 시작(GRID 60분), 앞뒤 10분, 2시간 규칙, 한 칸씩 규칙은 그대로입니다.

## 1. 결정과 코드의 지금

| # | 결정 (2026-11-03, 사용자) | 코드의 지금 | 이번 처리 |
| --- | --- | --- | --- |
| 1 | 멘토마다 반나절 하나. 오전 10:00~13:00(칸 10, 11, 12시), 오후 14:00~17:00(칸 14, 15, 16시) | `crossing_mentor_windows`에 행이 없어 모든 멘토가 `DEFAULT_WINDOW` 10:00~22:00, 하루 12칸 | **2.1** 마이그레이션 0017이 번호(sort)대로 행을 넣음 |
| 2 | 맡지 않은 날은 칸이 없음 | `windowsFor`가 행이 없으면 10:00~22:00으로 채움 | **2.2** 기본값을 없애고 `[]`를 돌려줌 |
| 3 | 학생 시간표에는 그날 맡은 멘토만 보임 | `/api/crossing/mentoring` GET이 활성 멘토 10명을 모두 내보내 빈 열이 생김 | **2.3** 그날 구간이 있는 멘토만 내보냄 |
| 4 | 13:00 줄(점심)은 표에 없음 | `TeamTool` `rows`가 모든 구간의 최소~최대를 한 시간씩 채워 13:00 줄이 생김 | **2.4** 멘토들의 `slotStarts` 합집합으로 줄을 만듦 |
| 5 | 멘토 페이지에서 맡지 않은 날은 "이날은 맡지 않습니다" | `MentorTool`이 `slots`가 비면 `empty` 문장(팀이 넣으면 뜹니다)을 보여 줌 | **2.5** `offDay` 문구 추가 |
| 6 | 당일 예약은 오후 칸만(첫 오후 칸은 14:00) | `SAME_DAY_FROM = "13:00"`, 규칙 카드 "당일은 13:00부터" | **2.6** 14:00으로, 카드 문구도 맞춤 |

## 2. 바꿀 것

### 2.1 새 마이그레이션 `0017_crossing_mentor_halfday_windows.sql`

멘토 자리 10개(0012에서 `sort` 1~10으로 만든 행)에 반나절 구간을 넣습니다. 이름이 아니라 `sort`로 고릅니다(이름은 운영진이 표 편집기에서 바꾸므로). 이미 그 멘토의 행이 하나라도 있으면 건너뜁니다(두 번 돌려도 안전).

```sql
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
```

표를 새로 만들지 않으므로 grant는 필요 없습니다. 0008의 "행이 없으면 10:00~22:00" 주석은 그 파일을 고치지 말고, 이 파일 머리의 주석으로 바로잡습니다.

### 2.2 `lib/crossingOps.ts`

- `DEFAULT_WINDOW`를 지웁니다. `windowsFor`는 행이 없으면 `[]`를 돌려줍니다.

```ts
// DECIDED 2026-11-03 (사용자): 멘토는 맡은 날의 반나절(10:00~13:00 또는 14:00~17:00)만 받습니다(마이그레이션 0017).
// 그날 행이 없으면 그날은 맡지 않는 것이라 칸이 없습니다. 그 전(2026-10-17)에는 임시 기본값 10:00~22:00으로 채웠습니다.
export function windowsFor(day: number, rows: { start_time: string; end_time: string }[]): Window[] {
  return rows.map((w) => toWindow(day, w.start_time, w.end_time)).filter((w): w is Window => !!w);
}
```

- `SAME_DAY_FROM`을 `"14:00"`으로. 주석에 "당일에는 오후 칸(14:00부터)만. 오전 칸은 전날까지 넣어야 멘토가 1장을 미리 봅니다(2026-11-03, 그 전 13:00)"를 남깁니다. `bookingGate`의 계산은 그대로입니다.
- 파일 머리 주석에 반나절 구조 한 줄을 더합니다.

### 2.3 `app/api/crossing/mentoring/route.ts` GET

그날 구간이 하나도 없는 멘토는 내보내지 않습니다. `mentors` 배열을 만든 뒤 `windows.length > 0`으로 거릅니다. Day 1(`isOpsDay`가 아닌 날)은 지금처럼 구간을 읽지 않으므로 멘토가 모두 빠지고, 화면은 `noMentors`가 아니라 `day1BookHint`만 보입니다(2.4 참고). POST는 그대로입니다(`fitsWindow`가 이미 그 멘토의 구간 밖을 거절합니다).

### 2.4 `components/crossing/TeamTool.tsx`

- `rows`를 "모든 구간의 최소~최대를 한 시간씩" 대신 **멘토들의 `slotStarts(m.windows)` 합집합**으로 만듭니다. 그러면 13:00 줄이 생기지 않습니다(10, 11, 12, 14, 15, 16시 여섯 줄). `GRID_MINUTES`, `gridCeil` import가 더는 안 쓰이면 지웁니다.
- Day 1 탭: 멘토가 없어 `rows`가 비므로 `noMentors` 문장이 뜨지 않게, `mentors && !rows.length && !timetableLocked`일 때만 `noMentors`를 보여 줍니다. Day 1에는 지금처럼 `day1BookHint`만 남습니다.
- `cell`에서 구간 밖 줄은 먼저 빈 `<td>`로 끝냅니다(`!fitsWindow(r, m.windows)`이고 그 줄에 걸친 예약이 없으면). 지금은 `r < Date.now()` 판정이 먼저라, 행사 당일 오후가 되면 오후 멘토 열의 오전 줄에도 "지남" 빗금이 뜹니다. 그 멘토가 받지 않는 시간은 비어 있어야 합니다.
- 그 밖의 칸 판정(`slotState`, `bookingGate`, `fitsWindow`)은 그대로입니다.

### 2.5 `components/crossing/MentorTool.tsx`, `data/crossingTeam.ts`

- `mentorCopy`에 `offDay: { ko: "이날은 맡지 않습니다.", en: "You are not on this day." }`를 더합니다.
- `MentorTool`에서 그 날 `slots.length === 0`이고 `rows.length === 0`이면 `empty` 대신 `offDay`를 보여 줍니다. 띠(ol)는 지금처럼 `slots.length > 0`일 때만 그립니다. 머리 오른쪽의 "{n}칸 중 {b}팀"은 그대로입니다(맡은 날에는 3칸).

### 2.6 `data/crossingTeam.ts` `timetableRules`

- `today` 카드: `{ ko: "당일은 오후 칸만", en: "On the day, afternoon only" }`, 본문 `{ ko: "그날이 되면 그날의 칸은 14:00 이후만 넣습니다. 오전 칸은 전날까지 넣어 주세요.", en: "On the day itself, only slots from 14:00 can be added. Book morning slots the day before." }`. DECIDED 주석 한 줄.
- `clock` 카드 본문의 예시 "9:00, 10:00"을 "10:00, 11:00"으로 바꿉니다(이제 첫 칸이 10:00이라). 나머지 카드는 그대로입니다.

## 3. 바꾸지 않는 것

- `SESSION_MINUTES` 40, `BUFFER_MINUTES` 10, `GRID_MINUTES` 60, `TEAM_COOLDOWN_MINUTES` 120, `teamHasPending`, `BOOKING_OPENS_DAY`/`BOOKING_OPENS_AT`(Day 1 12:00), `TIMETABLE_OPEN`.
- DB 제약(0008 exclude, 0016 트리거), 멘토 링크 계산(`mentorKey`, `scripts/mentor-links.mjs`). 링크는 그대로 유효합니다.
- 멘토 자리 수 10. 9, 10번은 행 없이 둡니다.

## 4. 검증

1. `npm run lint && npm run build`가 통과합니다.
2. 마이그레이션을 적용한 뒤 `select m.sort, w.day, w.start_time, w.end_time from crossing_mentor_windows w join crossing_mentors m on m.id = w.mentor_id order by m.sort, w.day;` 결과가 8행이고, sort 1~4는 day 2, 5~8은 day 3, 오전은 10:00~13:00, 오후는 14:00~17:00입니다.
3. `/api/crossing/mentoring?day=2`가 멘토 4명(sort 1~4)만 내보내고, 각 `windows`가 한 구간입니다. `?day=3`은 sort 5~8입니다. `?day=1`은 멘토가 비어 있습니다.
4. `/crossing/team` Day 2 탭: 열 4개, 줄은 10, 11, 12, 14, 15, 16시 여섯 줄이고 13:00 줄이 없습니다. 오전 멘토 열의 14시 이후와 오후 멘토 열의 12시 이전은 빈칸이고, 시간이 지나도 "지남" 빗금이 뜨지 않습니다. Day 1 탭은 `day1BookHint`만 보입니다.
5. `/crossing/mentor?k=`로 sort 1 멘토를 열면 Day 2에 3칸 띠(10, 11, 12시), Day 3에는 "이날은 맡지 않습니다"가 보입니다.
6. 시계를 Day 2 09:00 KST로 가정한 `bookingGate(2, 10:00 KST)`는 `same_day_morning`, `bookingGate(2, 14:00 KST)`는 `ok`입니다.
7. `CHANGELOG.md` 맨 위에 항목 하나(한 것, 브리프 `docs/mentor-halfday-brief.md`, 검증), 월별 목차에 링크를 더합니다. 사람 이름은 쓰지 않습니다.

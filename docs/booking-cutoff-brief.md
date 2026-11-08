# 브리프: 멘토 칸 넣는 규칙, 멘토가 놀라지 않게 (2026-11-08)

대상 레포: `website` (main b822d85). 정본은 `docs/brand.md`(먼저 읽습니다). 근거는 사용자 2026-11-08: Day 1부터 Day 3까지 칸을 넣을 수 있어도 아무 때나 넣으면 혼선이 크다. 멘토 입장에서 갑자기 팀 예약이 튀어나오면 안 된다. 사용자가 준 대략의 가이드 셋: (1) Day 1에는 Day 2, 3의 어느 칸이나 넣을 수 있지만 Day 1 17:00 뒤로는 Day 2 오전 칸이 막힌다. (2) Day 2도 같고 Day 3에만 적용된다: Day 2 14:00 뒤로는 Day 3 오전 칸을 넣을 수 없다. (3) 한 번 넣으면 바로 다음 칸은 넣을 수 없다(이동 시간). 이 브리프는 그 셋을 빈틈없는 규칙으로 적고, 가이드가 말하지 않은 두 군데(오후 칸은 언제까지, 팀이 미리 들고 있을 수 있는 칸 수)를 결정으로 올립니다.

## 0. 지금 규칙 (코드 실측)

| 규칙 | 어디 | 값 |
| --- | --- | --- |
| 열림 | `lib/crossingOps.ts` `bookingGate` | Day 1 12:00 |
| 칸 | 같은 파일 | 1시간 격자, 멘토링 40분 + 앞뒤 10분. 멘토 창은 Day 2, 3 각각 10:00~13:00 또는 13:00~16:00(멘토 한 분 9:00~12:00) |
| 팀이 들고 있을 수 있는 칸 | `teamHasPending`, DB 트리거 0018 `crossing_bookings_one_pending` | 이틀 통틀어 하나. 넣은 칸의 시작 + 60분이 지나야 다음 칸 (2026-11-03 결정) |
| 팀 간격 | `slotState` teamBusy, DB `crossing_bookings_team_overlap` | 60분(겹치지만 않으면 됨). 2시간 규칙은 2026-11-02에 없앰 |
| 마감 | 없음 | 빈 칸이면 시작 직전까지 넣을 수 있음. 멘토는 아침에 처음 보는 팀이 생길 수 있음 |
| 취소 | 없음 | 넣은 칸은 팀이 바꿀 수 없음. 운영진이 표에서 지움 |

문제는 마감이 없다는 것과, 이틀 통틀어 하나라는 규칙이 새 마감과 부딪힌다는 것입니다(2장 R6).

## 1. 규칙 (뒤)

오전 칸 = 시작 시각이 13:00 전인 칸(9:00, 10:00, 11:00, 12:00). 오후 칸 = 13:00, 14:00, 15:00. 시각은 모두 KST.

| # | 규칙 | 값 | 가이드 |
| --- | --- | --- | --- |
| R1 | 열림 | Day 1(12.18) 12:00. 그대로 | |
| R2 | 넣을 수 있는 날 | Day 1 12:00부터 Day 2, Day 3 어느 칸이나 | (1) |
| R3 | 오전 칸 마감 | Day 2 오전 칸은 **Day 1 17:00**에 닫힘. Day 3 오전 칸은 **Day 2 14:00**에 닫힘. 닫힌 칸은 비어 있어도 넣을 수 없고 화면에 "닫힘"으로 보임 | (1), (2) |
| R4 | 오후 칸 마감 | **시작 2시간 전**까지(13:00 칸은 11:00, 14:00 칸은 12:00, 15:00 칸은 13:00). 그 뒤는 닫힘 | 가이드에 없음, D1 |
| R5 | 팀 간격 | 같은 날 우리 팀의 다른 칸과 시작 시각이 **2시간 이상** 떨어져야 함. 10:00을 넣었으면 9:00과 11:00은 막히고 12:00부터 | (3). 2026-11-02에 없앤 2시간 규칙이 이동 시간을 이유로 돌아오는 것 |
| R6 | 팀이 미리 들고 있을 수 있는 칸 | **날마다 하나**(Day 2 하나, Day 3 하나). 넣은 칸의 시작 + 60분이 지나면 그날 또 하나(R4, R5 안에서) | 가이드에 없음, D2 |
| R7 | 바꾸기 | 팀은 바꿀 수 없음. 운영진이 지움. 그대로 | |

시각별로 열려 있는 칸:

| 때 | Day 2 오전 | Day 2 오후 | Day 3 오전 | Day 3 오후 |
| --- | --- | --- | --- | --- |
| Day 1 12:00~17:00 | 열림 | 열림 | 열림 | 열림 |
| Day 1 17:00~Day 2 | 닫힘 | 열림 | 열림 | 열림 |
| Day 2 아침~14:00 | 지남 | 시작 2시간 전까지 | 열림 | 열림 |
| Day 2 14:00~ | 지남 | 15:00 칸만 13:00까지 | 닫힘 | 열림 |
| Day 3 | 지남 | 지남 | 지남 | 시작 2시간 전까지 |

멘토에게 이것이 뜻하는 것: **오전은 전날 저녁에 확정**되고(Day 2는 17:00, Day 3는 14:00), 오후는 늦어도 두 시간 전에 압니다. 멘토 페이지에 이 한 줄을 적습니다(3장).

왜 R6가 "날마다 하나"인가: 지금의 "이틀 통틀어 하나"를 두면, Day 2 14:00이나 15:00 칸을 넣은 팀은 그 칸이 끝나는 15:00, 16:00에야 다음 칸을 넣을 수 있는데 그때는 Day 3 오전이 이미 닫혀(R3) Day 3 오후만 남습니다. Day 2 오전 칸 팀만 Day 3 오전을 고를 수 있게 되어 공평하지 않습니다. 날마다 하나로 바꾸면 모든 팀이 Day 1에 Day 2 칸과 Day 3 칸을 하나씩 넣어 두고, 멘토는 이틀의 오전을 Day 1 저녁에 거의 다 압니다. 2026-11-03의 목적(모든 팀이 한 번은 만난다, 멘토에게 무리가 없다)은 그대로입니다. 칸 수는 하루 24개(멘토 네 분 × 여섯 칸)라 팀 수보다 많습니다.

## 2. 코드

| # | 어디 | 바꿀 것 |
| --- | --- | --- |
| C1 | `lib/crossingOps.ts` | 상수: `MORNING_END = "13:00"`, `MORNING_CUTOFF = { 2: [1, "17:00"], 3: [2, "14:00"] }`(Day, 시각), `AFTERNOON_LEAD_MINUTES = 120`, `TEAM_GAP_MINUTES = 120`. 함수 `slotClosed(day, t, now)`: 오전 칸이면 `now >= MORNING_CUTOFF[day]`, 오후 칸이면 `now >= t - AFTERNOON_LEAD_MINUTES`. `slotState`에 `"closed"` 상태를 더하고(past 판정 앞), teamBusy 판정을 `GRID_MINUTES`에서 `TEAM_GAP_MINUTES`로. `teamHasPending(teamBookings, now)`를 `teamHasPendingOn(day, teamBookings, now)`로(그날 칸만 셈) |
| C2 | `app/api/crossing/mentoring/route.ts` POST | 순서: gate(not_yet) → `slotClosed`(409 `closed`) → `teamHasPendingOn`(409 `team_pending`) → 팀 간격(409 `team_gap`) → insert. GET의 `pendingTeams`는 날마다 따로(지금은 이틀 통틀어) |
| C3 | 마이그레이션 `0022_crossing_booking_per_day_and_cutoffs.sql` | 트리거 함수 `crossing_bookings_one_pending`을 같은 `day`의 미래 칸만 세게. `crossing_bookings_team_overlap` 제약의 60분을 120분으로(같은 팀, 같은 날). 마감 R3, R4는 트리거에도(D3): `starts_at`의 KST 시각이 13:00 전이면 `now()`가 그 Day의 마감(Day 2는 12.18 17:00 KST, Day 3은 12.19 14:00 KST)을 넘지 않았는지, 아니면 `now() <= starts_at - interval '120 minutes'`. 위반은 `raise exception 'closed'`. 0019, 0020, 0021처럼 적용 전 예약 0건 확인 |
| C4 | `components/crossing/TeamTool.tsx` | `closed` 칸: "+" 없이 연한 빗금 또는 회색 글자 "닫힘". 범례에 "닫힘" 하나 더. 에러 토스트 둘 더(`errClosed`, `errGap`). `errPending` 문구 고침 |
| C5 | `components/crossing/MentorTool.tsx` | 표 위 한 줄(`mentorCutoffLine`) |

## 3. 글 (KO / EN)

`data/crossingTeam.ts`:

| 키 | 지금 | 뒤 |
| --- | --- | --- |
| `rulesLine` | 팀마다 한 번에 한 칸, 40분입니다. 넣은 멘토링이 끝나면 다음 칸을 넣을 수 있습니다. 12.18 12:00에 열리고, 넣은 칸은 바꿀 수 없습니다. | 팀마다 날마다 한 칸, 40분입니다. 12.18 12:00에 열립니다. 오전 칸은 전날에 닫히고(Day 2는 12.18 17:00, Day 3은 12.19 14:00), 오후 칸은 시작 2시간 전까지 넣습니다. 우리 팀의 다른 칸과는 2시간 이상 띄웁니다. 넣은 칸은 바꿀 수 없습니다. / One 40-minute slot per team per day. Opens Dec 18 at 12:00. Morning slots close the evening before (Day 2 at 17:00 on Dec 18, Day 3 at 14:00 on Dec 19); afternoon slots close two hours before they start. Leave at least two hours between your team's slots. Slots cannot be changed once added. |
| `errPending` | 우리 팀이 넣은 멘토링이 끝나면 다음 칸을 넣을 수 있습니다. | 우리 팀은 이날 칸을 하나 넣어 두었습니다. 그 멘토링이 끝나면 또 넣을 수 있습니다. / Your team already holds a slot this day. You can add another once that session is over. |
| `errClosed`(새) | | 닫힌 칸입니다. 오전 칸은 전날에, 오후 칸은 시작 2시간 전에 닫힙니다. / This slot is closed. Morning slots close the evening before, afternoon slots two hours ahead. |
| `errGap`(새) | | 우리 팀의 다른 칸과 2시간 이상 띄워 주세요. 이동 시간이 있습니다. / Leave at least two hours after your team's other slot; you need time to get there. |
| `legendClosed`(새) | | 닫힘 / Closed |
| `mentorCutoffLine`(새, 멘토 페이지) | | 오전 칸은 전날에 확정됩니다(Day 2는 12.18 17:00, Day 3은 12.19 14:00). 그 뒤로 오전에 새 팀이 들어오지 않습니다. 오후 칸은 늦어도 시작 2시간 전에 정해집니다. / Your morning is final the evening before (Day 2 at 17:00 on Dec 18, Day 3 at 14:00 on Dec 19). Afternoon slots are set at least two hours ahead. |

`errTeamBusy`("우리 팀의 다른 칸과 시간이 겹칩니다")는 `errGap`이 대신하므로 뺍니다. `/crossing` Day 카드와 하루의 흐름은 "Day 1 12:00 열림"만 말하므로 그대로. `docs/brand.md` 7장 멘토링 줄에 R3~R6을 한 문장으로 더합니다. 운영진 문서(`크로싱서울_멘토링크`, `크로싱서울_멘토링_안내`)는 이 브리프 밖, 사용자 결정 뒤 따로(D5).

## 4. 결정

| # | 질문 | 기본값 |
| --- | --- | --- |
| D1 | 오후 칸 마감(R4). 안 A 시작 2시간 전 / 안 B 당일 10:00(그날 오후는 아침에 확정) | 안 A. 멘토는 그 오후 이미 멘토링 중이라 두 시간 전 알림이면 놀라지 않고, Day 2 오전에 반박을 들은 팀이 그날 오후에 한 번 더 갈 길이 남음. 멘토가 "오전처럼 전날 확정"을 바라면 안 B |
| D2 | 팀이 들고 있을 수 있는 칸(R6). 안 A 날마다 하나 / 안 B 지금처럼 이틀 통틀어 하나 | 안 A(1장 끝의 이유). 안 B면 R3와 부딪히는 팀이 생김 |
| D3 | 마감(R3, R4)을 DB 트리거에도 넣을지 | 예. 서버 시계와 같은 `now()`를 쓰고, 운영진이 표 편집기에서 직접 넣는 줄은 트리거를 건너뛰지 않으므로 운영진은 마감 뒤에 넣을 때 `service_role`로 트리거를 끄거나(한 줄 SQL) 운영진용 예외 컬럼 없이 그냥 막힘을 받아들임. 운영진 예외가 필요하면 다음에 |
| D4 | 닫힌 칸의 모양 | 빗금 없이 회색 글자 "닫힘". 빈 칸(아무것도 없음)과 구별되고 "+"는 없음 |
| D5 | 운영진 문서 둘도 같은 규칙으로 고칠지 | 사이트가 먼저. 결정이 나면 두 문서는 같은 날 따로 |
| D6 | 9:00 칸(멘토 한 분)을 오전으로 셀지 | 예, 13:00 전은 모두 오전 |

## 5. 검증

| # | 기준 |
| --- | --- |
| 1 | `slotState` 단위 표: (Day 2 10:00 칸, now = Day 1 16:59) open, (now = Day 1 17:00) closed, (Day 2 14:00 칸, now = Day 2 11:59) open, (12:00) closed, (Day 3 9:00 칸, now = Day 2 13:59) open, (14:00) closed. 팀이 10:00을 들고 있을 때 9:00과 11:00 teamBusy, 12:00 open |
| 2 | API: Day 1 13:00에 한 팀이 Day 2 10:00과 Day 3 11:00을 넣으면 둘 다 201. 같은 팀이 Day 2 15:00을 더 넣으면 409 team_pending. Day 1 17:01에 다른 팀이 Day 2 11:00을 넣으면 409 closed |
| 3 | DB: 0022 적용 뒤 같은 넷을 트리거를 거쳐 직접 insert. 결과 같음. 적용 전 예약 0건 |
| 4 | 화면: 가짜 시계(now를 Day 1 17:30으로)로 `/crossing/team?day=2`에서 오전 네 줄이 "닫힘", 오후 세 줄에 "+". 범례에 닫힘. 멘토 페이지에 `mentorCutoffLine`. 1440과 390 스크린숏 |
| 5 | `rulesLine` 등 KO/EN 여섯 쌍 전후 표. 가운뎃점, 줄표 0. `npm run build` 통과 |

## 6. 커밋

`feat(crossing): 멘토 칸 마감(오전은 전날, 오후는 2시간 전), 날마다 한 칸, 팀 간격 2시간 (0022)` 하나 / changelog는 CHANGELOG.md에만. 마이그레이션 적용과 `main` 푸시는 사용자 확인 뒤.

# 브리프: Day 2, 3 미션 조건에 세션 참석을 더하고 멘토 조건을 분명히 (2026-11-08)

대상 레포: `website` (main a65b5ea). 정본은 `docs/brand.md`(먼저 읽습니다). 근거는 사용자 2026-11-08: 날마다의 미션은 멘토 한 분 이상 만나기, 멘토를 만날 때 팀 과반 참석, 세션(워크숍) 참석, 현장에 팀 과반 오기, PDF 제출. Day 1은 미션이 없습니다(10/19 결정 그대로, 같은 날 사용자 재확인). Day 4도 없습니다(발표 자체).

## 0. 지금과 뒤

지금 Day 2, 3 미션(`data/naru.ts` `stages[2].milestoneDetail`, `stages[3].milestoneDetail`)은 조건 셋입니다: 팀원 과반이 현장에 오기 / 팀원 과반이 멘토를 찾아가 사진 한 장 / 1장을 반박에 맞춰 고쳐 공유하기(Day 3은 Open tables에서 진척 공유하기). 사용자의 다섯 가지 중 넷은 이미 있고, **세션 참석**이 새로 들어갑니다. 멘토 조건은 "한 분 이상"과 "그 자리에 과반"이 한 줄에 보이게 다시 씁니다.

| | Day 2 확인받기 | Day 3 만들기 |
| --- | --- | --- |
| 조건 (전부 충족) | 팀원 과반이 현장에 오기 / 멘토 한 분 이상을 팀원 과반이 함께 찾아가기 / PO session에 함께 있기 / 1장을 반박에 맞춰 고쳐 올리기 | 팀원 과반이 현장에 오기 / 멘토 한 분 이상을 팀원 과반이 함께 찾아가기 / Open tables에서 진척 공유하기 / 발표 자료 올리기 |
| 제출 방법 | 멘토와 팀이 함께 찍은 사진(과반이 보이게) / 고쳐 올린 1장(PDF) / 현장 출석과 세션 참석은 운영진이 체크 | 멘토와 팀이 함께 찍은 사진(과반이 보이게) / 발표 자료(슬라이드 PDF) / 현장 출석과 Open tables는 운영진이 체크 |

인증은 지금 그대로 둘입니다: 사이트에 올리는 사진 하나와 PDF 하나, 나머지는 운영진 체크. 세션 참석 사진은 받지 않습니다(사진이 둘이면 팀이 헷갈림). 멘토가 "왔음"을 누르는 기능도 두지 않습니다(멘토 일이 늘어남).

## 1. 글 (KO / EN)

`data/naru.ts`:

| # | 키 | 지금 | 뒤 |
| --- | --- | --- | --- |
| S1 | `stages[2].milestoneDetail.conditions[1]` | 팀원 과반이 멘토를 찾아가 사진 한 장 / Most of the team visits a mentor, one photo | 멘토 한 분 이상을 팀원 과반이 함께 찾아가기 / Visit at least one mentor, with most of the team there |
| S2 | `stages[2].milestoneDetail.conditions` 새 셋째 줄(1장 줄 앞) | | PO session에 함께 있기 / Be at the PO session together |
| S3 | `stages[2].milestoneDetail.conditions` 1장 줄 | 1장을 반박에 맞춰 고쳐 공유하기 / Update your one page with feedback and share it | 1장을 반박에 맞춰 고쳐 올리기 / Revise your one page to the pushback and upload it |
| S4 | `stages[2].milestoneDetail.submit[0]` | 멘토와 팀이 함께 찍은 사진 / A photo of the team with the mentor | 멘토와 팀이 함께 찍은 사진(과반이 보이게) / A photo of the team with the mentor, most of the team in it |
| S5 | `stages[2].milestoneDetail.submit[2]` | 현장 출석은 운영진이 체크합니다 / The organisers check who is on site | 현장 출석과 세션 참석은 운영진이 체크합니다 / The organisers check who is on site and at the session |
| S6 | `stages[3].milestoneDetail.conditions[1]` | 팀원 과반이 멘토를 찾아가 사진 한 장 | S1과 같음 |
| S7 | `stages[3].milestoneDetail.submit[0]` | 멘토와 팀이 함께 찍은 사진 | S4와 같음 |
| S8 | `stages[3].milestoneDetail.submit[2]` | 현장 출석은 운영진이 체크합니다 | 현장 출석과 Open tables는 운영진이 체크합니다 / The organisers check who is on site and at Open tables |
| S9 | `stages[2].milestone` | 멘토 찾아가기와 진척 공유 / Visit a mentor, share progress | 멘토 찾아가기, PO session, 고친 1장 / Mentor visit, PO session, revised page |

Day 3 `milestone`("멘토 찾아가기와 Open tables 공유")과 Day 3 조건 셋째 줄("Open tables에서 진척 공유하기"), 미션 띠 `v`("Day 2와 Day 3에 하나씩, 함께 있었는지와 생각이 어떻게 달라졌는지(고친 1장)를 봅니다. 해낸 팀은 모두 그날 지원을 받습니다."), 하루의 흐름 줄, `/crossing/team`의 `proofLead`는 그대로. "지원"이 무엇인지는 사이트에 적지 않은 채로 둡니다(brand 8장, 12월 숫자를 약속하지 않음).

`docs/brand.md` 7장 미션 줄: "인정 조건(2026-10-17 사용자): Day 2와 Day 3은 날마다 팀원 과반이 현장에 옴, 그날의 진척을 PDF로 공유" 뒤에 "(2026-11-08 사용자: 멘토 한 분 이상을 팀원 과반이 함께 찾아가고, 그날 세션(Day 2 PO session, Day 3 Open tables)에 함께 있는 것이 조건에 더해짐. Day 1 미션 없음 재확인)"을 더합니다.

## 2. 결정

| # | 질문 | 기본값 |
| --- | --- | --- |
| D1 | 세션 참석 인증 | 운영진 체크. 사진 없음 |
| D2 | 사진 속 과반을 누가 세나 | 운영진이 팀 명단(`crossing_team_roster`)과 대조. 멘토 버튼 없음 |
| D3 | Day 1 미션 | 없음(그대로). 1장 PDF는 선택 그대로 |
| D4 | 운영진 문서(`크로싱서울_멘토링_안내` 등)의 미션 줄 | 사이트 뒤 따로 |

## 3. 검증

| # | 기준 |
| --- | --- |
| 1 | 바뀐 KO/EN 쌍 아홉 전후 표. Day 2 조건 넷, Day 3 조건 셋. 문장 밖 변화 0 |
| 2 | 1440과 390에서 Day 2, 3 미션 띠 펼친 스크린숏. 카드 높이는 Day 1~3 subgrid라 같이 늘어남, 390에서 한 화면 안 |
| 3 | brand 9장 금지어 0, 가운뎃점과 줄표 0, 숫자 약속 0. `npm run build` 통과 |

## 4. 커밋

`copy(crossing): Day 2, 3 미션 조건에 세션 참석, 멘토는 한 분 이상을 과반이 함께 (S1~S9)` 하나 / changelog는 CHANGELOG.md에만. `main` 푸시는 사용자 확인 뒤.

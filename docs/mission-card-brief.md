# 브리프: Day 2, 3 미션을 접지 않고 다 보이게, 세션 뒤에 받는 지원까지 (2026-11-08)

대상 레포: `website` (main 0b4ea00, 새 화면 `components/crossing/redesign/` 기준). 정본은 `docs/brand.md`(먼저 읽습니다). 근거는 사용자 2026-11-08: 멘토링 신청 페이지(`/crossing/team`)는 손대지 말고, `/crossing`의 Day 카드에서 날마다의 미션이 더 자세히 보이면 좋겠다. 미션을 해내면 그날 워크숍(세션) 뒤에 지원을 준다. 조건은 `docs/missions-brief.md`(같은 날)의 것이고, 이 브리프는 그 조건을 **어떻게 보일지**와 글이 사는 두 파일을 적습니다. missions-brief의 1장 S1~S9는 이 브리프 3장이 대신합니다(새 화면은 한국어를 `copy.ts`에서 덮어쓰기 때문).

## 0. 지금 (배포본 실측, 1440)

Day 2와 Day 3 카드의 미션은 접힌 띠 하나입니다: "★ 미션  멘토 만나고, 고친 한 장 올리기  ⌄"(높이 52px). 펼쳐야 "이걸 다 하면 돼요" 셋과 "올리는 것" 셋이 두 단으로 나옵니다. 처음 보는 사람은 미션이 무엇인지 한 줄 제목만 보고 지나가고, 무엇을 받는지는 카드에 없습니다(프로그램 리드 아래 표의 "미션" 줄에만 "해낸 팀이라면 전부, 그날 바로 지원받아요"). Day 1의 "Day 2에 들고 갈 것" 띠는 미션이 아니라 그대로 둡니다.

글이 사는 곳이 둘입니다. 영어와 기본값은 `data/naru.ts`(`stages[n].milestone`, `milestoneDetail.conditions`, `milestoneDetail.submit`), 한국어 화면 글은 `components/crossing/redesign/copy.ts`(`milestone`, `conditions`, `submit`)가 덮어씁니다. `copy.ts`의 `kos()`는 **길이가 같을 때만** 덮어쓰므로, 조건을 넷으로 늘리면 두 파일을 같이 고쳐야 합니다. 아니면 한국어가 조용히 `data/naru.ts`의 합니다체로 돌아갑니다.

## 1. 모양 (D1)

Day 2, 3 카드에서 접는 띠 대신 **펼쳐진 미션 카드** 하나. 흰 바탕, 같은 테두리(`RULE`), 안은 셋입니다.

```
★ 미션   멘토 만나고, PO session 듣고, 고친 한 장 올리기

☐ 팀원 절반 넘게 현장에 오기                       운영진 체크
☐ 멘토 한 분 이상을 절반 넘게 같이 찾아가기          사진 1장
☐ PO session에 같이 있기                            운영진 체크
☐ 반박 들은 대로 한 장을 고쳐서 올리기               PDF 1장

다 하면 그날 세션이 끝난 뒤 지원을 받아요. 사진과 PDF는 시간표 페이지에서, 날마다 한 번씩.
```

- 줄마다 왼쪽은 조건, 오른쪽은 **어떻게 확인하는지** 칩 하나(운영진 체크 / 사진 1장 / PDF 1장). 지금의 "올리는 것" 단은 이 칩이 대신하므로 없앱니다. 폰(390)은 칩이 조건 아래로 내려옵니다.
- ☐는 장식이 아니라 "네 가지 다"를 읽게 하는 표시입니다. 상태를 저장하지 않습니다(이 페이지는 로그인이 없고, 인증은 `/crossing/team`에서).
- 마지막 줄이 **받는 것과 때**입니다: 그날 세션(Day 2 PO session, Day 3 Open tables)이 끝난 뒤. "지원"이 무엇인지는 적지 않습니다(brand 8장). "시간표 페이지"는 `/crossing/team?day=2`(Day 3은 `day=3`)로 가는 글자 링크.
- 카드 높이는 접힌 띠 52px에서 약 220px(1440)로 늘어납니다. Day 1~3가 세로로 이어지는 목록이라 다른 카드와 높이를 맞출 필요는 없습니다. 미션 글자 색은 지금의 마젠타(#845185) 그대로, ★도 그대로.
- `/crossing/team`은 바꾸지 않습니다. 올리는 곳과 규칙 글(`proofLead`, `proofOnce`)은 그대로.

## 2. 데이터

`data/naru.ts` `stages[2]`, `stages[3]`의 `milestoneDetail`에 `checks: ("staff" | "photo" | "pdf")[]`를 더합니다(조건과 같은 길이. Day 2: staff, photo, staff, pdf. Day 3: staff, photo, staff, pdf). `naru.december`에 `checkLabels: { staff: Phrase; photo: Phrase; pdf: Phrase }`와 `milestoneReward: Phrase`, `milestoneUpload: Phrase`를 더합니다. 기존 `milestoneDetail.submit`은 데이터에 남기되 새 화면은 그리지 않습니다(옛 화면 `components/home/NaruHome.tsx`가 아직 씀).

## 3. 글 (KO 새 화면 / EN)

`copy.ts`(KO)와 `data/naru.ts`(EN, KO 기본값은 합니다체로 같은 뜻):

| # | 키 | KO (`copy.ts`) | EN (`data/naru.ts`) |
| --- | --- | --- | --- |
| S1 | `milestone[2]` | 멘토 만나고, PO session 듣고, 고친 한 장 올리기 | Meet a mentor, sit in the PO session, upload your revised page |
| S2 | `milestone[3]` | 멘토 만나고, Open tables에서 나누고, 발표 자료 올리기 | Meet a mentor, share at Open tables, upload your deck |
| S3 | `conditions[2]` (넷) | 팀원 절반 넘게 현장에 오기 / 멘토 한 분 이상을 절반 넘게 같이 찾아가기 / PO session에 같이 있기 / 반박 들은 대로 한 장을 고쳐서 올리기 | More than half the team on site / Visit at least one mentor, more than half of you together / Be at the PO session together / Revise your page to the pushback and upload it |
| S4 | `conditions[3]` (넷) | 팀원 절반 넘게 현장에 오기 / 멘토 한 분 이상을 절반 넘게 같이 찾아가기 / Open tables에서 어디까지 왔는지 나누기 / 발표 자료 올리기 | More than half the team on site / Visit at least one mentor, more than half of you together / Share where you are at Open tables / Upload your deck |
| S5 | `checkLabels` | 운영진 체크 / 사진 1장 / PDF 1장 | Checked by organisers / One photo / One PDF |
| S6 | `milestoneReward` | 다 하면 그날 세션이 끝난 뒤 지원을 받아요. | Do all of these and your team gets that day's support after the session. |
| S7 | `milestoneUpload` | 사진과 PDF는 시간표 페이지에서, 날마다 한 번씩. | Photos and PDFs go up on the timetable page, once a day. |
| S8 | `milestoneConditionsLabel` | 이걸 다 하면 돼요 (그대로) | |
| S9 | `facts[2]` 둘째 문장 | 해낸 팀이라면 전부, 그날 바로 지원받아요. → 해낸 팀이라면 전부, 그날 세션이 끝난 뒤 지원받아요. | Every team that does it gets that day's support after the session. |

"사진 1장"의 사진은 멘토와 팀이 같이 찍은 것이고 절반 넘게 보여야 한다는 말은 조건 줄(S3 둘째)이 이미 하므로 칩에는 쓰지 않습니다. 하루의 흐름(`flow`)의 "미션 올리기" 줄과 Day 1 "들고 갈 것", `/crossing/team`의 글은 그대로.

`docs/brand.md` 7장 미션 줄에 "(2026-11-08 사용자: 조건은 넷, 멘토 한 분 이상을 과반이 함께, 그날 세션에 함께 있기. 지원은 그날 세션이 끝난 뒤. Day 1 미션 없음 재확인. 새 화면에서는 접지 않고 다 보인다)"를 더합니다.

## 4. 결정

| # | 질문 | 기본값 |
| --- | --- | --- |
| D1 | 접는 띠를 없애고 펼친 카드로 / 띠는 두되 처음부터 펼쳐 둠 | 펼친 카드. 접었다 펴는 동작이 없으면 ⌄도 없어 더 단순 |
| D2 | 확인 칩 셋(운영진 체크, 사진 1장, PDF 1장) / 글 한 줄("출석과 세션은 운영진이, 사진과 PDF는 팀이") | 칩. 줄마다 무엇을 내야 하는지 바로 보임 |
| D3 | ☐ 표시 | 둠. 눌러도 아무 일 없게 보이지 않도록 버튼이 아니라 글자(U+2610) |
| D4 | 옛 화면(`components/home/NaruHome.tsx`)도 같이 고칠지 | 아니오. 배포는 새 화면이고 옛 화면은 그대로 둔다는 11/08 redesign 커밋의 뜻대로. 데이터 `submit`은 그래서 남김 |
| D5 | "지원"이 무엇인지 적을지 | 적지 않음(brand 8장) |

## 5. 검증

| # | 기준 |
| --- | --- |
| 1 | 1440과 390에서 Day 2, 3 카드 전후 스크린숏. 미션 카드에 조건 넷과 칩 넷, 마지막 두 줄. ⌄ 없음. 390에서 칩이 조건 아래 |
| 2 | `/crossing` innerText에 "그날 세션이 끝난 뒤" 3(Day 2, Day 3, facts), "PO session에 같이 있기" 1, "올리는 것" 0. EN도 같은 자리 |
| 3 | `copy.ts`의 `conditions[2]`, `conditions[3]` 길이 4가 `data/naru.ts`와 같음(`kos` 덮어쓰기가 살아 있음). 합니다체 문장이 새 화면에 새지 않음 |
| 4 | `/crossing/team` 파일 변화 0. Day 1 "들고 갈 것" 띠 변화 0 |
| 5 | 가운뎃점, 줄표 0, brand 9장 금지어 0. `npm run build` 통과 |

## 6. 커밋

`feat(crossing): Day 2, 3 미션을 펼친 카드로, 조건 넷과 확인 칩, 세션 뒤 지원 한 줄` 하나 / changelog는 CHANGELOG.md에만. `main` 푸시는 사용자 확인 뒤.

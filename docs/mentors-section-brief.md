# 브리프: 멘토 소개 줄 (2026-11-05, 같은 날 본인 확인 셋 반영)

대상 레포: `website` (main 59f7ea9). 정본은 `docs/brand.md`(먼저 읽습니다). 근거는 사용자 2026-11-05: 두 분(강상우, 안대선)을 뺀 멘토들이 온다는 것이 사이트에 보이면 좋겠다. 보여 주는 법은 8월 페이지(`/2026-08#mentoring`)를 참고. 멘토링의 목적은 현업의 감각을 주는 것이고, 근거는 멘토 브리프 4절과 11/05 출제사 미팅 전사록("멘토분들이 학생들한테 주는 것은 현업의 터치", "도메인 엑스퍼트는 아니어도"). 같은 날 밤 멘토 세 분이 메신저로 소속과 직책 표기를 직접 보내 주셨고, 사용자는 사진은 받지 않기로 했습니다("사진은 괜찮을 것 같습니다").

## 0. 8월은 어떻게 보여 줬나

둥근 사진, 이름에 존칭("님", 직함이 있으면 "이사님"), 소속 한 줄, 역할 칩("멘토", "피드백 패널"), LinkedIn 링크. 도움의 종류(만들 때 / 팔 때)로 묶고 날짜 칩은 묶음에 하나. 데이터는 `data/dictionary.ts` `mentoring.mentors[]`(name, org, role, intro, days, img, linkedin).

12월은 멘토링이 한 종류(Day 2, 3 찾아가기)라 묶음 없이 한 줄이고, **사진은 쓰지 않습니다**(사용자 11/05). 그래서 8월의 둥근 사진 자리는 없고, 카드는 글 세 줄입니다.

## 1. 자리와 모양 (D1)

`/crossing` 닷새 장 바로 아래, 남는 것 장 앞에 작은 블록 하나. 제목 "멘토", 리드 두 문장, 카드 여섯이 한 줄(폰은 두 줄). 카드는 글만: 이름 님(굵게) / 소속 / 직책. 8월 카드에서 사진을 뺀 꼴이라 위계와 글자 크기는 같습니다(이름 BODY 굵게, 소속과 직책 META). 새 장(챕터)이 아니라 블록이라 목차 칩은 늘리지 않습니다. 양은 site-tells 3장 범위 안.

리드(KO/EN, brand 7장 "멘토는 답을 주러 오지 않는다"와 멘토 브리프 4절에서):

| 키 | KO | EN |
| --- | --- | --- |
| `mentors.lead` | 멘토는 답을 주러 오지 않습니다. 일을 해 본 사람이면 누구나 아는 감각으로, 팀이 들고 간 한 장과 시안에 "실제로는 그렇게 안 돌아간다"를 그대로 말해 줍니다. | Mentors do not come with answers. With the sense anyone who has done the work has, they tell the team, to its one page and draft, "that is not how it works in practice." |
| `mentors.note` | 도메인 전문가가 아니어도 됩니다. 학생에게 빠진 것이 그 감각이라서요. | They need not be domain experts. That sense is what students are missing. |

"빌더"는 쓰지 않습니다(11/04 결정). 멘토 수, 팀 수는 쓰지 않습니다(brand 8장).

## 2. 멘토 여섯

본인이 보내 준 표기는 그대로 씁니다(존칭 "님"만 붙임). 확인 대기인 세 분은 LinkedIn 헤드라인을 임시 표기로 적어 두되 화면에는 확인 뒤에 올립니다(D2).

| # | 이름 | 소속 | 직책 | 상태 |
| --- | --- | --- | --- | --- |
| M1 | 허수진 님 | C&R Research | Project Leader | 본인 확인(11/05 메신저). 명함은 "Project Leader II, RWO"이지만 본인이 적은 "Project Leader"로 |
| M2 | 김규리 님 | Aside | Chief of Staff | 확인 대기. LinkedIn: GTM과 운영, YC F25 |
| M3 | 조동현 님 | KAIST AI 대학원, 인클리즈랩 | 박사과정, Co-founder&CTO | 본인 확인(11/05). "대학원이랑 사업 둘 다" 넣어 달라고 함. 두 소속을 쉼표로 한 줄 |
| M4 | 최우현 님 | DanaMed | CEO | 확인 대기. 회의록은 "AI, 인허가 담당 개발자"라 본인 확인 필요 |
| M5 | 강정민 님 | Independent AI Researcher | NeurIPS 2026 TAE 워크숍 포스터 저자 (AX 인재전쟁 본선, Upstage MABC 결선) | 본인 확인(11/05). 보낸 글의 가운뎃점은 쉼표로(사이트 규칙). "인재전쟁"은 대회 이름(고유명사)이라 brand 4장 쓰지 않는 말에 걸리지 않음(D6) |
| M6 | 이민재 님 | BIGPIE C&T | K-뷰티 해외영업 팀장 | 확인 대기 |

EN은 소속과 직책이 이미 영문인 곳은 그대로, 한글인 곳만 옮깁니다(예: "KAIST Graduate School of AI, Inclease Lab / PhD student, Co-founder & CTO", "Author of a NeurIPS 2026 TAE workshop poster (AX Talent War finals, Upstage MABC finals)", "K-beauty overseas sales team lead").

빼는 사람: 강상우 님, 안대선 님(사용자). 유재민 님은 멘토를 이어 준 분이라 명단이 아닙니다. 사진과 LinkedIn 링크는 쓰지 않습니다.

데이터: `data/naru.ts` `december.mentors: { name: Phrase; org: Phrase; role: Phrase; confirmed: boolean }[]`. 여섯을 다 적고 `confirmed`가 true인 사람만 그립니다(지금 M1, M3, M5). 순서는 Day 2 멘토부터(DB sort 순). 시간표(`/crossing/team`)의 멘토 열 머리에 쓰는 DB `crossing_mentors.field`에도 같은 소속을 넣어 두 자리가 같이 읽히게(D3).

## 3. 결정

| # | 질문 | 기본값 |
| --- | --- | --- |
| D1 | 자리: 닷새 장 아래 블록 / 함께하는 곳 안의 한 줄 | 닷새 장 아래 블록(멘토는 프로그램의 일부) |
| D2 | 확인된 세 분만 먼저 올릴지, 여섯이 다 확인될 때까지 기다릴지 | 세 분 먼저(`confirmed`). 나머지는 답이 오면 true로 바꾸는 한 줄 커밋 |
| D3 | DB `field`에 소속을 넣을지 | 예, 같은 문자열. 마이그레이션이 아니라 표 편집기에서(운영진) |
| D4 | 사진, LinkedIn 링크 | 둘 다 쓰지 않음(사용자 11/05) |
| D5 | 8월처럼 역할 칩("멘토")을 달지 | 아니오. 블록 제목이 이미 "멘토"이고 한 종류뿐 |
| D6 | M5 직책을 본인이 보낸 대로 길게 쓸지, "NeurIPS 2026 TAE 워크숍 포스터 저자"까지만 쓸지 | 보낸 대로(괄호 포함). 카드가 두 줄 더 길어지면 폰에서만 괄호를 접음 |

## 4. 검증

| # | 기준 |
| --- | --- |
| 1 | `confirmed` true가 0명이면 블록이 DOM에 없음. 셋이면 카드 셋, 여섯이면 여섯. 1440 한 줄, 390 두 줄 |
| 2 | 리드와 note, 카드 여섯 KO/EN 표. "빌더" 0, 멘토 수와 팀 수 0, 가운뎃점 0, brand 9장 금지어 0("인재전쟁"은 고유명사로 예외, D6) |
| 3 | 카드에 사진, 링크 없음. 이름 BODY 굵게, 소속과 직책 META |
| 4 | 시간표 멘토 열 머리의 소속이 카드의 소속과 같음(D3 뒤) |
| 5 | `npm run build` 통과 |

## 5. 커밋

`feat(crossing): 멘토 블록 (리드 둘, 카드는 본인 확인 셋부터, 사진 없이)` 하나 / changelog는 CHANGELOG.md에만. `main` 푸시는 사용자 확인 뒤.

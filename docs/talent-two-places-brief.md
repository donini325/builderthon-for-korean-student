# 브리프: 두 곳의 학교에서 온 학생을 보는 자리 (홈과 크로싱 서울, 문장 다시 쓰기)

대상 레포: `website` (`docs/rephrase-briefs-2026-10-31.md`, `docs/outputs-two-sides-brief.md` 적용 뒤). 정본은 `docs/brand.md`(먼저 읽습니다). 근거는 사용자 2026-10-31: 기업이 한국과 싱가포르 두 곳에서, 좋은 학교의 좋은 사람을 발견할 수 있다는 것이 홈과 크로싱 서울 둘 다에 보이면 좋겠다. **상자나 글을 더하지 않고 있는 문장을 다시 씁니다.**

## 0. 말하는 법

- "좋은 학교", "탤런트", "인재", "명문" 같은 형용사와 외래어는 쓰지 않습니다(brand 5장: 형용사로 설득하지 않는다, 숫자와 사실로. 10/24 외부 조언: 초엘리트 이미지는 필요 없다). 대신 **학교 이름을 사실로** 씁니다. 한국 쪽 셋은 이슈 파트너 브리프 3절 그대로 "서울대, 연세대, 건국대 학회원", 싱가포르 쪽은 같은 줄의 "싱가포르 한인 대학생"(브리프가 학교를 안 적었고, 8월의 NUS, NTU, SMU, Kaplan은 8월 기록에 있음).
- "발견"은 사이트에 이미 있는 "일하는 모습으로 보는 사람"(이력서 대신 ... 봅니다)으로 말하고, "두 공간"은 "한국과 싱가포르 두 곳"으로 붙입니다.
- 스크리닝 없음(코어 01)과 부딪히지 않습니다. 입구에서 거르지 않지만 학회를 통해 모이는 학생이라는 뜻이고, 브리프 3절도 같은 말을 합니다.
- 학교 이름은 `data/naru.ts`에 키 하나(`schools`)로 두고 세 자리가 같이 읽게 합니다. 학교가 바뀌면 한 곳만 고칩니다.

## 1. 홈 `/`

| # | 자리 | 지금 | 뒤 | EN |
| --- | --- | --- | --- | --- |
| T1 | 어떻게 일하는가, 후원 상자 "얻는 것" | 한 이슈에 대한 서로 다른 시도 여럿을 닷새 안에 보고, 회차의 기록에 회사 이름이 적힙니다. | 한국과 싱가포르 두 곳의 학교에서 온 학생들이 한 이슈에 내는 서로 다른 시도 여럿을 닷새 안에 보고, 회차의 기록에 회사 이름이 적힙니다. | You watch students from schools in Korea and Singapore make several different attempts at one issue within five days, and the company's name is written into the record of that edition. |
| T2 | 출제사가 얻는 것 1 (제목 그대로 "일하는 모습으로 보는 사람") | 이력서 대신, 묻고 반박받고 고치는 모습을 닷새 동안 봅니다. | 서울대, 연세대, 건국대 학회원과 싱가포르 한인 대학생을, 이력서 대신 묻고 반박받고 고치는 모습으로 닷새 동안 봅니다. | Students from the societies at Seoul National, Yonsei and Konkuk and Korean students in Singapore, seen over five days asking, being pushed back on and fixing, instead of on a CV. |

## 2. `/crossing`

| # | 자리 | 지금 | 뒤 | EN |
| --- | --- | --- | --- | --- |
| T3 | 큐레이션 표, 팀 구성 | 모든 팀에 싱가포르에서 공부하는 학생과 여러 학교 학생, 직접 만드는 학생과 숫자를 다루는 학생이 섞입니다. 대항전이 아닙니다. | 모든 팀에 서울대, 연세대, 건국대 학회원과 싱가포르 한인 대학생, 직접 만드는 학생과 숫자를 다루는 학생이 섞입니다. 대항전이 아닙니다. | Every team mixes society members from Seoul National, Yonsei and Konkuk with Korean students in Singapore, and students who build with students who handle numbers. It is not a contest between countries or schools. |
| T4 | 이슈를 낸 기업의 닷새, 2칸 "같은 이슈, 다른 시도" | 팀마다 다른 병목을 반박을 거쳐 푼 작은 툴과 생각 한 장, 발표와 질의를 기록으로 받으십니다. 더 이야기하고 싶은 한 팀을 골라 주시면 됩니다. | 한국과 싱가포르 두 곳의 학교에서 온 팀마다 다른 병목을 반박을 거쳐 푼 작은 툴과 생각 한 장, 발표와 질의를 기록으로 받으십니다. 더 이야기하고 싶은 한 팀을 골라 주시면 됩니다. | From teams drawn from schools in Korea and Singapore, you receive each team's small tool, fixed through pushback on a different bottleneck, with its one page, presentation and questions as a record. Pick one team you want to keep talking with. |
| T5 | 남는 것 05 "국경 너머의 팀" | 어느 나라에서 공부하든 Day 1에 한 팀이 되어 끝까지 함께합니다. | 서울대, 연세대, 건국대와 싱가포르의 학생이 Day 1에 한 팀이 되어 끝까지 함께합니다. | Students from Seoul National, Yonsei, Konkuk and Singapore become one team on Day 1 and stay together to the end. |

손대지 않는 것: 히어로 둘째 줄 "국경과 상관없이, 한인 학생 빌더가 만나는 자리."(참가자 문장, 학교를 안 묻는 코어 01의 자리), 등록 블록 "스크리닝 없이, 오는 사람이 참가자입니다.", 주관 상자(싱가포르 쪽 학생회는 12월 주관이 확정되지 않아 이름을 쓰지 않음), 8월 기록.

## 3. 결정

| # | 질문 | 기본값 |
| --- | --- | --- |
| D1 | 12월 학교 이름(서울대, 연세대, 건국대)을 사이트에 쓸지 | 씀. 이슈 파트너 브리프에 이미 쓴 사실이고 brand 8장이 막는 것은 인원·기업 수·결과. 바뀌면 `schools` 키 한 곳 |
| D2 | 싱가포르 쪽 학교 이름(NUS, NTU, SMU)을 12월 문장에 쓸지 | 쓰지 않음. 브리프가 "싱가포르 한인 대학생"이라 했고 8월 넷은 8월 기록이 말함. 쓰려면 "8월에는 NUS, NTU, SMU, Kaplan에서"로 사실로만 |
| D3 | brand 4장 기업 한 문장에 덧붙일지 | 덧붙임: "두 곳의 학교에서 온 학생을 이력서 대신 일하는 모습으로 본다". 쓰지 않는 말에 "인재, 탤런트, 명문" 추가 |

## 4. 검증

| # | 기준 |
| --- | --- |
| 1 | 바뀐 KO/EN 쌍 5개 전후 표. 상자·문장 수 변화 0 |
| 2 | 홈과 `/crossing` innerText에서 "서울대, 연세대, 건국대" 홈 1·/crossing 2, "두 곳" 홈 1·/crossing 1. "인재", "탤런트", "명문", "좋은 학교" 0 |
| 3 | 학교 이름이 `schools` 키 하나에서 옴(grep으로 문자열 중복 0) |
| 4 | 코어 둘, 히어로, 등록 블록 변화 0. brand 9장 금지어 0 |
| 5 | 1440과 390 KO/EN에서 바뀐 다섯 자리 스크린숏(T2는 토글을 연 상태). `npm run build` 통과 |

## 5. 커밋

`copy(site): 두 곳의 학교에서 온 학생을 일하는 모습으로 보는 자리 (학교 이름을 사실로, 문장 수 그대로)` + `docs(brand): 4장 기업 한 문장` 같은 커밋 / changelog. `main` 푸시는 사용자 확인 뒤.

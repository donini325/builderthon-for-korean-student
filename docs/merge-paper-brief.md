# 브리프: design/site-tells를 main으로, 백엔드와 도구 페이지까지 맞춰서 (2026-11-05)

대상 레포: `website`. 정본은 `docs/brand.md`(먼저 읽습니다). 근거는 사용자 2026-11-05: 종이 디자인 가지를 main에 합치되, 백엔드와 DB가 다 이어져 있어야 하고, 멘토 페이지와 Day 카드 버튼으로 들어가는 상세 페이지(시간표, 인증, 인기투표, 팀 매칭)도 같은 디자인이어야 한다.

## 0. 지금 상태 (실측)

| 항목 | 값 |
| --- | --- |
| `origin/main` (배포본) | 0365dd4 |
| 로컬 `main` | 046f2e2, origin/main보다 2개 뒤(빨리 감기 가능) |
| `design/site-tells` (로컬 = origin) | b3ae03c, origin/main 위에 24개. 43bcae9에서 origin/main(0365dd4)을 이미 합침 |
| `git log design/site-tells..origin/main` | 0개. 즉 main에는 가지에 없는 커밋이 없고, 합치기는 빨리 감기라 충돌 0 |
| 차이 | 55 파일, +670 −897. 새 마이그레이션 0, 표 스키마 변화 0 |
| 작업 트리 | `docs/mentor-halfday-brief.md` 하나가 추적되지 않은 채 남아 있음(가지와 무관) |

가지가 바꾼 백엔드는 넷이고 모두 작습니다: `lib/memThrottle.ts`(새, 함수 인스턴스 안 메모리 창 제한. 멘토 예약 POST와 업로드 서명에 IP당 10분 30번), `lib/register/shared.ts`와 `app/api/crossing/match/route.ts`의 `clientIp`(x-vercel-forwarded-for를 먼저), `app/api/crossing/proofs/route.ts`(올라간 파일의 실제 mimetype을 `PROOF_TYPES`로 한 번 더 확인, 아니면 삭제), `next.config.mjs`(poweredByHeader false). `lib/crossingOps.ts`의 `TRACK_TINTS`는 종이 팔레트 넷으로 바뀌었고 키(blue, violet, plum, orange)는 DB 값이라 그대로입니다.

도구 페이지는 가지 빌드를 가짜 데이터로 띄워 실측했습니다(`/crossing/team?day=2`, `/crossing/mentor`, `/crossing/vote`, `/match`, `/quiz`, `/2026-08`, 1440과 390). 색 토큰(`--ui-*`, Tailwind `white` → 잉크)이 전역이라 **여섯 페이지 모두 이미 종이 바탕 #FCFBF8이고 그라데이션 0, 캔버스 0**입니다. 남은 것은 3장의 일곱입니다.

## 1. 합치는 순서

| # | 할 것 | 어떻게 |
| --- | --- | --- |
| M1 | 가져오기 | `git fetch origin`. `git log design/site-tells..origin/main`이 0인지 다시 확인(그 사이 main에 커밋이 생겼으면 먼저 `git merge origin/main`을 가지에서) |
| M2 | 로컬 main 맞추기 | `git checkout main && git merge --ff-only origin/main` |
| M3 | 가지에서 3장 T1~T4 고치고 커밋 | 합치기 전에 가지에서. 빌드와 tsc 통과 |
| M4 | 프리뷰에서 2장 체크리스트 | `origin/design/site-tells`의 Vercel 프리뷰 URL에서. 프리뷰 환경에 2장의 변수가 다 있어야 함(Production만 있고 Preview에 없으면 API가 503 `not_configured`) |
| M5 | 합치기 | `git checkout main && git merge --no-ff design/site-tells -m "merge: design/site-tells (종이 팔레트, 바이브 코딩 티 걷기, 도구 페이지 정렬)"`. 충돌이 나면 멈추고 보고(예상 0) |
| M6 | 푸시 | 사용자가 확인한 뒤 `git push origin main`. 푸시가 곧 배포 |
| M7 | 배포 뒤 | 2장 4~6을 배포본에서 한 번 더. OG 이미지는 캐시라 바뀌지 않아도 정상(D3) |

## 2. 백엔드와 DB 체크리스트 (합치기 전)

| # | 확인 | 어디 | 기준 |
| --- | --- | --- | --- |
| B1 | 환경 변수 열 개가 Production과 Preview 둘 다에 | Vercel | `NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`(서버만, NEXT_PUBLIC_ 금지), `NEXT_PUBLIC_TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET_KEY`, `TURNSTILE_ALLOWED_HOSTNAMES`, `MENTOR_LINK_SECRET`, `MATCH_ROOM_CODE`, `NEXT_PUBLIC_MATCH_ROOM_CODE_ON`, `NEXT_PUBLIC_SITE_URL`, `CROSSING_VOTE_OPEN`(지금은 없음이 맞음) |
| B2 | 마이그레이션 0001~0020 적용 | Supabase | 0019는 적용 기록 있음(CHANGELOG). 0020(멘토 2번 9:00~12:00)은 기록이 "적용 전 예약 0건"뿐이라 `select sort, day, start_time, end_time from crossing_mentor_windows w join crossing_mentors m on m.id = w.mentor_id where m.event_slug = 'crossing-seoul-2026-12' order by sort`로 확인: sort 2가 09:00~12:00, 3, 4, 7, 8이 13:00~16:00 |
| B3 | 버킷 | Supabase Storage | `crossing-proofs` 있음, 공개 아님 |
| B4 | 가지의 새 서버 동작 | 프리뷰 | 시간표 GET 200, 멘토 링크 GET 200(`?k=` 실제 키 하나), 등록 POST는 창이 닫혀 403 `registration_not_open`(정상) |
| B5 | 업로드 mimetype 재확인(새 코드) | 프리뷰, 시험 팀 | JPEG, PNG, HEIC(아이폰), PDF 넷을 올려 모두 confirm 200. 실패하면 Storage metadata의 mimetype이 `PROOF_TYPES`와 다른 것이니 그 값을 보고 목록에 더함. 시험 행과 파일은 끝나고 지움 |
| B6 | 열림 스위치는 합쳐도 그대로 닫힘 | 코드 | `TIMETABLE_OPEN=false`, `VOTE_BUTTON_OPEN=false`, `CROSSING_VOTE_OPEN` 없음, `CROSSING_WINDOW` null. 합치기로 열리는 것은 없음. 여는 날은 D1 |
| B7 | 속도 제한 | 코드 | `memThrottle`은 인스턴스마다 따로 세는 최선의 노력(완전한 방어 아님). DB 표를 새로 만들지 않음. 그대로 둠 |

## 3. 도구 페이지에서 남은 것 (가지에서, 합치기 전)

| # | 자리 | 지금 | 뒤 |
| --- | --- | --- | --- |
| T1 | `components/crossing/TurnstileWidget.tsx` 68행 | `theme: "dark"`. 크림 바탕 위에 어두운 위젯 | `theme: "light"` |
| T2 | `data/crossingTeam.ts` `trackLegend` | "흰 테두리는 우리 팀입니다." 실제는 남색 테두리(실측) | { ko: "칸의 색은 그 팀의 트랙입니다. 남색 테두리는 우리 팀입니다.", en: "Each slot takes its team's track colour. A navy outline marks your team." }. 24행 주석도 |
| T3 | `components/crossing/VoteTool.tsx` 투표 보내기 버튼 꺼짐 상태 | 연보라(남색 60% 투명)로 보여 옛 팔레트처럼 읽힘 | `/match`와 같은 `disabled:opacity-40`, 색은 그대로 남색 |
| T4 | `components/crossing/MentorTool.tsx` "내 칸" 열 | 회색 테두리. 운영진 문서는 "파란 테두리"라고 씀 | 남색(`border-accent`) 2px로. 문서와 맞음(D2) |
| T5 | `lib/ogCard.ts`, 결과 카드 | 잉크 #070B1F 위 네 색(brand 10장 "아직 그 전 값") | 그대로(D3) |
| T6 | `/2026-08` | 번호 "01~06" 9개, 알약 41, 점 18 남음(site-tells C4는 A4, A5만) | 그대로(D4) |
| T7 | 멘토 페이지 머리 | 사이트 헤더(워드마크, 메뉴 없음). 시간표, 투표, 매칭은 "← 크로싱 서울" 작은 머리 | 그대로. 멘토는 돌아갈 곳이 없음 |

## 4. 결정

| # | 질문 | 기본값 |
| --- | --- | --- |
| D1 | 시간표 버튼(`TIMETABLE_OPEN`)과 인기투표(`VOTE_BUTTON_OPEN` + `CROSSING_VOTE_OPEN`)를 언제 켤지 | 이번 합치기에서는 켜지 않음. 시간표는 등록이 열린 뒤 팀이 생기는 Day 1 전, 투표는 Day 4 당일 |
| D2 | 내 칸 테두리를 남색으로(문서와 맞춤) | 예 |
| D3 | OG와 결과 카드를 종이로 | 아니오, 다음에 따로 |
| D4 | `/2026-08`의 번호, 알약, 점을 이번에 걷을지 | 아니오, 기록 페이지라 따로 |
| D5 | 합치기 방식 `--no-ff`(가지가 하나의 묶음으로 남음) | 예 |

## 5. 검증

| # | 기준 |
| --- | --- |
| 1 | M1에서 `design/site-tells..origin/main` 0. M5 충돌 0 |
| 2 | B1 열 개 표(이름만, 값은 적지 않음). B2 SQL 결과 여덟 행 |
| 3 | B5 넷 모두 confirm 200, 시험 데이터 삭제 확인 |
| 4 | T1~T4 뒤 가짜 데이터로 `/crossing/team?day=2`, 멘토 페이지, `/crossing/vote` 1440과 390 스크린숏. Turnstile 위젯이 밝은 테마, 우리 팀 칸과 내 칸 열이 남색 테두리 |
| 5 | 여섯 페이지 바탕 #FCFBF8, 그라데이션 0, 캔버스 0(사이트 점검 스크립트와 같은 기준) |
| 6 | tsc, `npm run build` 통과. brand 9장 금지어 0 |

## 6. 커밋

가지에서 `fix(crossing): 도구 페이지를 종이에 맞춤, Turnstile 밝은 테마, 우리 팀과 내 칸 남색 테두리, 투표 버튼 꺼짐 상태` 하나 / changelog는 CHANGELOG.md에만. 그 뒤 M5 합치기 커밋. `main` 푸시는 사용자 확인 뒤.

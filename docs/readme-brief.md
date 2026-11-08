# 브리프: README를 지금 레포에 맞게, 읽는 사람 셋으로 (2026-11-09)

대상 레포: `website` (main 01c3ee2 이후). 정본은 `docs/brand.md`(먼저 읽습니다. 사이트 판 문장이 아니라 정본 문장을 씁니다). 근거는 사용자 2026-11-09: GitHub README를 더 자세하고 보기 좋게. 지금 README(316줄)는 뼈대가 좋지만 사실이 여럿 낡았고, 참가자와 기업 담당자와 기여자가 한 흐름에 섞여 있습니다. 이 브리프는 **구조를 다시 짜고, 사실을 레포에서 확인해 고치고, GitHub가 그려 주는 것(스크린숏, Mermaid, details)만으로 보기 좋게** 합니다. README는 운영진 문서이므로 합니다체 그대로입니다(brand 5장. 사이트의 해요체를 따라가지 않습니다).

## 0. 낡은 사실 (먼저 고칠 것, 레포에서 다시 확인)

| # | 자리 | 지금 README | 확인할 곳 |
| --- | --- | --- | --- |
| F1 | 코어 둘 본문 | 10/31 전 문장("스크리닝하지 않습니다. 순위를 매기지 않습니다...") | `docs/brand.md` 2장 정본 문장 그대로 |
| F2 | 주소 표 | `/`가 크로싱 서울, `/naru`가 나루 | `app/` 폴더. `/`는 나루 홈, `/crossing`이 크로싱 서울, `/crossing/team`, `/crossing/vote`, `/crossing/mentor`, `/match`, `/quiz`, `/2026-08`, API 다섯 |
| F3 | 미션 | 조건 셋, Day 1 "손에 남는 것" | brand 7장(조건 넷, 세션 참석, 세션 뒤 지원, Day 1과 4는 없음) |
| F4 | 멘토링 규칙 | 없음 | brand 7장 멘토링 줄(Day 1 12:00 열림, 오전 칸은 전날 마감, 오후 칸은 그날 12:00, 팀 간격 2시간, 바꾸지 않음) |
| F5 | 기술 | three.js 배경 | `package.json`, `lib/`. 종이 팔레트 뒤 캔버스 없음. 실제 쓰는 것만 |
| F6 | 환경 변수 | 넷 | `grep -r "process.env"`로 전부(열 개 안팎: `NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `NEXT_PUBLIC_TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET_KEY`, `TURNSTILE_ALLOWED_HOSTNAMES`, `MENTOR_LINK_SECRET`, `MATCH_ROOM_CODE`, `NEXT_PUBLIC_MATCH_ROOM_CODE_ON`, `NEXT_PUBLIC_SITE_URL`, `CROSSING_VOTE_OPEN` 등). 값은 적지 않음 |
| F7 | 어디를 고치나 | `data/naru.ts`만 | 한국어 화면 글은 `components/crossing/redesign/copy.ts`, `components/naru/redesign/copy.ts`. EN과 KO 기본값은 `data/naru.ts`. 길이 규칙(`kos`) |
| F8 | 등록 | "아직 열지 않았습니다" | `lib/registrationWindow.ts`. 11월 14일(토)에 엶. 날짜는 `lib/naruDates.ts`에서 |
| F9 | 닷새 표 | Day 0 없음, 옛 문장 | `data/naru.ts` `december.stages` 다섯(컨텍스트 열기, 찾기, 확인받기, 만들기, 공유하기), 세션 셋, 장소 둘 |
| F10 | 정의 한 문장 | "학생 빌더 그룹" | brand 1장 정의문 그대로("...영리를 목적으로 하지 않는 그룹"). EN 부제의 student builders는 그대로 둠 |
| F11 | 마이그레이션 | 언급 없음 | `supabase/migrations/0001~0022` 한 줄씩(파일 머리 주석에서) |

## 1. 구조

위는 짧게(나루와 크로싱 서울이 무엇인지), 선을 긋고, 아래는 자세하게(레포). 장 머리마다 EN 한 줄을 이탤릭으로.

| 순서 | 장 | 내용 | 장치 |
| --- | --- | --- | --- |
| 1 | 머리 | 로고(밝음/어둠 `<picture>` 그대로), 정의문 한 문장(F10), 사이트 링크, 태그라인 두 줄, EN 한 줄 | 지금 그대로 |
| 2 | 화면 | 홈, 크로싱 서울, 멘토 시간표, 8월 기록. 1440 넉 장을 2×2 표로, 390 넉 장은 `<details>` 안에 한 줄로 | 2장 스크린숏 |
| 3 | 변하지 않는 두 개 | brand 2장 정본 문장(F1), 8월/12월 표, 판단 질문 둘 | 지금 표 |
| 4 | 크로싱 서울, 닷새 | Day 0~4를 그림 하나로, 아래에 표(날, 단계, 하는 일, 세션, 장소, 미션) | Mermaid M1 + 표 |
| 5 | 장치와 그 이유 | 지금 표에 미션 넷(F3)과 멘토 칸 규칙(F4)을 더함 | 표 |
| 6 | 8월에서 12월로 | 지금 표 그대로 | 표 |
| 7 | 나루는 | 정의, 뜻 세 겹(brand 6장), 세 층(주최, 주관, 후원) | Mermaid M2 + 표 |
| 8 | 빚지고 시작합니다 | 지금 글 그대로(사람 이름 없음 확인), Day 8 사진 | 사진 |
| 9 | 선 | `---` 와 "아래는 이 레포에 대한 안내입니다" | |
| 10 | 구조 | 주소 표(F2), 폴더 지도(`app/`, `components/`, `data/`, `lib/`, `supabase/`, `docs/`), 데이터 흐름 | Mermaid M3 |
| 11 | 로컬에서 돌리기 | 지금 그대로. 빌드 전 체인지로그 검사 한 줄 | 코드 블록 |
| 12 | 환경 변수 | 열 개 전부, 이름과 쓰는 곳만(F6). 서버 전용 표시 | 표, `<details>` |
| 13 | 데이터베이스 | Supabase 표 이름과 마이그레이션 0001~0022 한 줄씩(F11). 적용은 운영진이 순서대로 | `<details>` 안 표 |
| 14 | 어디를 고치나 | 두 벌 규칙(F7), brand.md가 정본, 날짜 단일 출처 | 표 |
| 15 | 일하는 규칙 | 브리프(`docs/*-brief.md`) → Claude Code → 검증 → 사용자 확인 → 푸시. 체인지로그 하나, DECIDED 주석, em dash 없음 | 짧게 + `docs/` 브리프 지도(주제별로 묶어 10줄 안팎) |
| 16 | EN 요약 | 지금 문단 고쳐 씀 | |

## 2. 스크린숏 (`docs/readme/`)

배포본(`https://naru-crossing-seoul.vercel.app`)을 Playwright로 찍습니다. 1440×900과 390×844, `deviceScaleFactor` 2, 첫 화면만(스크롤 없음). 파일: `home-1440.png`, `crossing-1440.png`, `team-1440.png`, `record-1440.png`와 같은 이름의 `-390`. 시간표는 `/crossing/team?day=2`. 사람 얼굴이 크게 나오는 사진이 첫 화면에 있으면(홈, 크로싱 히어로) 그대로 둡니다(8월 사진은 이미 사이트에 공개). 각 그림의 alt는 페이지 이름 한 줄. 표 캡션은 `<sub>`.

## 3. Mermaid 셋 (GitHub가 그립니다. 글은 brand 어휘로)

M1 닷새(`timeline`): Day 0 컨텍스트 열기(이슈 공개) / Day 1 찾기(팀 맺기, 출제사 30분, 병목 하나, Lovable workshop, 12:00 시간표 열림) / Day 2 확인받기(멘토 찾아가기, PO session, 미션) / Day 3 만들기(작은 툴, Open tables, 미션) / Day 4 공유하기(성과 공유회, 트랙별 인기투표, 시상). 숫자(인원, 팀 수, 상금)는 넣지 않습니다.

M2 세 층(`flowchart LR`): 학생회와 학회(주관) → 나루(주최) ← 기업(후원). 화살표에 내는 것 한 줄씩(소속 학생과 공간 / 이슈와 멘토). 나루 아래에 "회차마다 기록, 다음 자리를 열 사람".

M3 데이터 흐름(`sequenceDiagram`): 참가자 → 사이트(Turnstile) → `/api/crossing/register` → Supabase. 팀 → `/crossing/team` → `/api/crossing/mentoring`(마감과 간격 검사) → `crossing_mentor_bookings`. 팀 → 인증 업로드 → Storage `crossing-proofs`. 멘토 → 멘토 링크(서명된 키) → 같은 표 읽기. 키 이름만, 값 없음.

## 4. 쓰지 않는 것

배지 줄(빌드, 라이선스, 스타), 이모지, 사람 이름(멘토, 연사, 운영진 포함), 회의록 인용, 12월 숫자 약속(인원, 기업 수, 상금), 환경 변수 값, 서비스 키 흔적, "빌더"(제로백 빌더톤 이름과 EN 부제 student builders는 예외, brand 5장), em dash와 가운뎃점. 브리프 파일 이름은 적어도 브리프 안의 결정 내용을 README에 옮겨 적지 않습니다(README는 지금 상태, 브리프는 과정).

## 5. 결정

| # | 질문 | 기본값 |
| --- | --- | --- |
| D1 | 길이 | 지금과 비슷하거나 조금 긴 정도(350줄 안팎). 환경 변수, 마이그레이션, 390 스크린숏은 `<details>`로 접어 첫 인상은 짧게 |
| D2 | 문체 | 합니다체(운영진 문서). 사이트 판 해요체 문장은 인용하지 않음 |
| D3 | 스크린숏 갱신 | 화면이 크게 바뀔 때만 다시 찍음. README에 찍은 날짜 한 줄 |
| D4 | EN | 장 머리 한 줄과 끝의 요약 문단. 전체 영문판은 두지 않음 |
| D5 | 기여 안내(CONTRIBUTING) | 따로 만들지 않고 15장 "일하는 규칙"으로 끝. 외부 PR을 받는 레포가 아님 |

## 6. 검증

| # | 기준 |
| --- | --- |
| 1 | 0장 F1~F11 하나하나 README의 문장과 레포(코드, brand.md)가 같음을 표로 보고 |
| 2 | 스크린숏 8장이 `docs/readme/`에 있고 README에서 모두 링크됨. GitHub 미리 보기(또는 `npx markdown-it`)에서 Mermaid 셋이 그려짐 |
| 3 | README에 사람 이름 0, em dash 0, 가운뎃점 새로 0, 숫자 약속 0, 환경 변수 값 0. "빌더"는 제로백 빌더톤과 student builders에만 |
| 4 | 깨진 링크 0(`docs/`, `public/`, 사이트 주소). 주소 표의 경로가 `app/`과 일치 |
| 5 | `npm run build` 통과(README는 빌드와 무관하지만 체인지로그 검사 때문에) |

## 7. 커밋

`docs(readme): 읽는 사람 셋으로 다시 짜고, 낡은 사실 열한 곳을 고치고, 화면 여덟 장과 그림 셋` 하나 / changelog는 CHANGELOG.md에만. `main` 푸시는 사용자 확인 뒤.

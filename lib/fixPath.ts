// ─────────────────────────────────────────────────────────────────────────────
// 망가진 링크 고치기. DECIDED 2026-11-06 (사용자: "링크에 이상이 있어도 왠만하면 올 수 있도록 가능한 경우의 수들을 다 반영해줘").
//
// middleware.ts가 없는 주소를 받으면 이 함수로 고쳐 봅니다. 고친 주소가 실제 페이지면 308로 보내고, 못 고치면 null(그대로 404 화면).
// 다루는 경우:
//  - 끝에 따라붙은 문장부호, 괄호, 따옴표(메신저가 "(링크)."까지 잡은 경우). 한글, 전각 부호와 %29 같은 인코딩 포함.
//  - 앞에 붙은 괄호, 따옴표. 공백, 보이지 않는 글자(제로폭, NBSP), 전각 글자(NFKC), 대문자, 겹친 슬래시, index.html 같은 꼬리.
//  - 주소 안에 다시 붙여 넣은 전체 URL(/https://naru-crossing-seoul.vercel.app/crossing), 도메인이 경로에 들어간 경우.
//  - ? 대신 &로 시작한 쿼리(/crossing&lang=en), 쿼리 마지막 값 끝의 부호(?lang=en), ?k=...).
//  - 별칭과 한글 이름(/크로싱, /december, /8월, /시간표 등)과 오타(/crosing, /corssing: 편집 거리 1~2).
//  - 알 수 없는 하위 경로는 가장 가까운 상위 페이지로(/crossing/abc → /crossing).
// /en, /en/... 은 영어 표시(lang=en)로 바꿔 고친 뒤 원래 미들웨어 규칙이 받습니다.
// ─────────────────────────────────────────────────────────────────────────────

/** 실제로 있는 페이지(한국어 주소 기준). 영문 사본(/en/...)은 미들웨어가 ?lang=en으로 다룹니다. */
export const KNOWN = ["/", "/crossing", "/crossing/team", "/crossing/mentor", "/crossing/vote", "/2026-08", "/match", "/quiz"] as const;
const KNOWN_SET = new Set<string>(KNOWN);

// 별칭(소문자, 앞 슬래시 없이). 값은 보낼 곳. "#register"처럼 조각이 붙을 수 있습니다.
const ALIASES: Record<string, string> = {};
const alias = (to: string, ...names: string[]) => names.forEach((n) => (ALIASES[n] = to));
alias("/", "home", "index", "main", "naru", "나루", "홈");
alias("/crossing", "crossing", "crossing-seoul", "crossingseoul", "crossing_seoul", "crossing seoul", "seoul", "서울", "december", "dec", "12", "2026-12", "202612", "2026_12", "12월", "크로싱", "크로싱서울", "크로싱-서울", "크로싱_서울", "event", "program", "프로그램");
alias("/crossing#register", "register", "registration", "signup", "sign-up", "apply", "application", "join", "등록", "신청", "참가", "지원");
alias("/crossing/team", "team", "teams", "timetable", "schedule", "booking", "book", "mentoring", "시간표", "예약", "멘토링", "일정");
alias("/crossing/mentor", "mentor", "mentors", "멘토");
alias("/crossing/vote", "vote", "voting", "poll", "투표", "인기투표");
alias("/2026-08", "2026-8", "202608", "2026_08", "2608", "08", "8", "aug", "august", "8월", "zero100", "zerobaek", "zero-100", "제로백", "builderthon", "빌더톤", "record", "기록");
alias("/match", "matching", "team-match", "teammatch", "test", "type", "types", "유형", "테스트", "매칭", "팀매칭", "ai-test");

// 끝(과 앞)에서 벗겨 낼 글자: 괄호, 따옴표, 문장부호, 한글과 전각 부호. NFKC 뒤라 전각 ASCII는 이미 반각입니다.
const JUNK = `)]}>'"\`.,;:!?~*|\\^-_ 。、，．）」』】〉》！？：；…·“”‘’«»(`;
const LEAD_JUNK = `([{<'"\`“‘«「『【〈《 `;
const INVISIBLE = /[\s ​-‏⁠﻿]/g;

function safeDecode(s: string): string {
  let out = s;
  for (let i = 0; i < 3; i++) {
    try {
      const d = decodeURIComponent(out);
      if (d === out) break;
      out = d;
    } catch {
      // 깨진 %가 있으면 바로 앞까지만 풀린 값으로 둡니다.
      out = out.replace(/%(?![0-9a-fA-F]{2})/g, "");
    }
  }
  return out;
}

function trimEnds(s: string): string {
  let a = 0;
  let b = s.length;
  while (b > a && JUNK.includes(s[b - 1])) b--;
  while (a < b && LEAD_JUNK.includes(s[a])) a++;
  return s.slice(a, b);
}

function lev(a: string, b: string): number {
  // 다메라우-레벤슈타인(인접 두 글자 바꿈도 1). 짧은 문자열만 비교합니다.
  const d: number[][] = Array.from({ length: a.length + 1 }, (_, i) => [i, ...Array(b.length).fill(0)]);
  for (let j = 1; j <= b.length; j++) d[0][j] = j;
  for (let i = 1; i <= a.length; i++)
    for (let j = 1; j <= b.length; j++) {
      const c = a[i - 1] === b[j - 1] ? 0 : 1;
      d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + c);
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) d[i][j] = Math.min(d[i][j], d[i - 2][j - 2] + 1);
    }
  return d[a.length][b.length];
}

// 오타 비교 대상: 실제 경로(슬래시 없이)와 영문 별칭. 너무 짧은 것(8, 12, dec)은 오타로 맞추지 않습니다.
const FUZZY: [string, string][] = [
  ...KNOWN.filter((k) => k !== "/").map((k) => [k.slice(1), k] as [string, string]),
  ...Object.entries(ALIASES).filter(([n]) => /^[a-z0-9-]{4,}$/.test(n)),
];

function resolve(path: string): string | null {
  // path: 소문자, 앞 슬래시 없음, 끝 슬래시 없음.
  if (KNOWN_SET.has(`/${path}`)) return `/${path}`;
  if (path === "") return "/";
  if (ALIASES[path]) return ALIASES[path];
  const nospace = path.replace(/[\s_]+/g, "-");
  if (ALIASES[nospace]) return ALIASES[nospace];
  // 오타.
  let best: string | null = null;
  let bestD = 99;
  for (const [name, to] of FUZZY) {
    const limit = name.length >= 7 ? 2 : 1;
    const dd = lev(path, name);
    if (dd <= limit && dd < bestD) {
      best = to;
      bestD = dd;
    }
  }
  return best;
}

export type Fixed = { pathname: string; search: string; hash: string };

/**
 * 고칠 수 있으면 보낼 곳을, 이미 맞거나 못 고치면 null을 돌려줍니다.
 * pathname은 req.nextUrl.pathname(인코딩된 그대로), search는 "?..."(없으면 "").
 */
export function fixUrl(pathname: string, search: string): Fixed | null {
  let raw = safeDecode(pathname).normalize("NFKC").replace(INVISIBLE, "");
  let query = search.startsWith("?") ? search.slice(1) : search;

  // 쿼리가 경로에 섞인 경우: /crossing&lang=en, /crossing?lang=en(인코딩된 ?).
  const qi = raw.search(/[?&]/);
  if (qi >= 0) {
    const extra = raw.slice(qi + 1);
    raw = raw.slice(0, qi);
    query = [extra, query].filter(Boolean).join("&");
  }

  // 경로 안에 다시 붙은 전체 URL이나 도메인: 도메인 뒤만 씁니다.
  raw = raw.replace(/^.*?(?:https?:\/+)?(?:www\.)?[a-z0-9-]+(?:\.[a-z0-9-]+)*\.(?:app|com|kr|io|co|net|org|dev|sg)(?=\/|$)/i, "");

  let p = raw.toLowerCase();
  p = p.replace(/\/+/g, "/");
  p = p.replace(/\/(index|default)(\.(html?|php|aspx?))?$/, "/").replace(/\.(html?|php|aspx?)$/, "");
  // 경로 조각마다 앞뒤 부호를 벗깁니다.
  const segs = p.split("/").map(trimEnds).filter(Boolean);

  // 영문 사본 접두.
  let en = false;
  if (segs[0] === "en") {
    en = true;
    segs.shift();
  } else if (segs[0] === "ko" || segs[0] === "kr") {
    segs.shift();
  }

  let target = resolve(segs.join("/"));
  // 마지막 조각만으로(/crossing/시간표 → /crossing/team), 그다음 가장 가까운 상위 페이지로.
  if (!target && segs.length > 1) {
    const last = resolve(segs[segs.length - 1]);
    if (last && last !== "/") target = last;
  }
  for (let n = segs.length - 1; !target && n >= 1; n--) {
    const up = resolve(segs.slice(0, n).join("/"));
    if (up) target = up;
  }
  if (!target) return null;

  const [tPath, tHash = ""] = target.split("#");

  // 쿼리: 마지막 값 끝의 부호를 벗기고, lang 값은 소문자로.
  const params = new URLSearchParams(query);
  const entries = [...params.entries()].map(([k, v], i, all) => {
    let val = safeDecode(v).normalize("NFKC").replace(INVISIBLE, "");
    if (i === all.length - 1) val = trimEnds(val);
    const key = trimEnds(k.toLowerCase().replace(INVISIBLE, ""));
    if (key === "lang") val = val.toLowerCase();
    return [key, val] as [string, string];
  }).filter(([k]) => k);
  const out = new URLSearchParams(entries);
  if (en) out.set("lang", "en");
  const qs = out.toString();
  const fixed: Fixed = { pathname: tPath, search: qs ? `?${qs}` : "", hash: tHash ? `#${tHash}` : "" };

  // 바뀐 것이 없으면 null(무한 리다이렉트 방지). 영문 접두는 원래 미들웨어 규칙이 처리합니다.
  const sameQuery = new URLSearchParams(search).toString() === qs;
  if (!en && fixed.pathname === pathname && sameQuery && !fixed.hash) return null;
  return fixed;
}

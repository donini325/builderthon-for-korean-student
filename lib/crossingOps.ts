// ─────────────────────────────────────────────────────────────────────────────
// 크로싱 서울 현장 도구(멘토 시간표, 미션 인증)의 값과 계산. 서버와 브라우저가 함께 씁니다.
// 표는 supabase/migrations/0008_crossing_teams_and_mentor_timetable.sql.
//
// DECIDED 2026-10-17 (사용자): 멘토링은 예약제이고, 예약 하나가 그 앞뒤 10분을 막습니다(같은 날 15분에서 10분으로).
// DECIDED 2026-10-17 (사용자: "10분씩 보여주니까 너무 정신이 없음, 30분 간격으로, 어짜피 앞뒤 10분하면 1시간"): 줄은 30분이었습니다.
// DECIDED 2026-11-02 (사용자): 칸은 정각에만 시작하고 줄은 한 시간입니다(GRID_MINUTES). 칸 하나(40분)가 한 줄입니다.
// DECIDED 2026-11-03 (사용자): 한 팀은 한 번에 한 칸(이틀 통틀어), 넣은 멘토링이 끝나면 다음 칸. 2시간 규칙과 당일 오후 규칙은 없앴습니다(마이그레이션 0018).
// DECIDED 2026-11-08 (사용자, docs/booking-cutoff-brief.md): 위 "한 번에 한 칸"을 없애고 칸 수는 제한 없이, 같은 팀의 칸끼리 2시간 띄웁니다(TEAM_GAP_MINUTES).
//   오전 칸은 전날에, 오후 칸은 그날 12:00에 닫힙니다(slotClosed). DB는 마이그레이션 0022(team_overlap 120분, 트리거 crossing_bookings_cutoff).
// DECIDED 2026-11-03 (사용자): 멘토 한 분은 Day 2 또는 Day 3 중 하루의 반나절(오전 10:00~13:00 또는 오후 13:00~16:00)만 맡습니다(마이그레이션 0017, 0019). 점심시간은 없고 13:00에 오후 멘토로 이어집니다.
// 막는 규칙의 정본은 DB의 exclude 제약입니다. 여기의 계산은 화면에 칸을 그리고 미리 거절하는 용도이고,
// BUFFER_MINUTES를 바꾸면 마이그레이션 0008의 crossing_plus_minutes(ends_at, 10)도 같이 바꿔야 합니다.
// ─────────────────────────────────────────────────────────────────────────────

import { DECEMBER_STARTS_AT } from "@/lib/naruDates";

/** 예약 한 번의 길이(분). TODO: confirm. 멘토와 정해지면 바꿉니다. */
// DECIDED 2026-10-17 (사용자: "멘토링 40분, 전후 10분씩"). 그 전 30분.
export const SESSION_MINUTES = 40;
/** 예약 앞뒤로 막히는 시간(분). 마이그레이션 0008과 같아야 합니다. */
export const BUFFER_MINUTES = 10;
/** 시작 시각을 고르는 칸의 간격(분).
 * DECIDED 2026-11-02 (사용자: "9시 20분 30분 이런식으로 넣지 못하고, 무조건 9시, 10시", "다음 시 정각에 시작"): 칸은 정각에만 시작합니다.
 * 한 칸이 한 시간입니다: 멘토링 40분(9:00~9:40)과 그 뒤 10분, 다음 칸의 앞 10분(9:50~10:00). 사용자가 고른 안은 멘토링이 정각에 시작하는 쪽입니다.
 * 앞뒤 10분 규칙(DB 0008)은 그대로 맞습니다. 그 전 30분(2026-10-17). */
export const GRID_MINUTES = 60;
/**
 * 같은 팀의 두 칸은 시작 시각이 이만큼(분) 떨어져야 합니다. 멘토가 계신 곳까지 가는 시간입니다.
 * DECIDED 2026-11-08 (사용자: "한 번 넣으면 바로 다음 칸은 넣을 수 없다", "원하는 만큼, 단지 back to back은 안 됨"): 10:00을 넣으면 9:00과 11:00이 막히고 12:00부터.
 * 칸 수 제한(2026-11-03 teamHasPending, 0018 트리거)은 없앴습니다. DB 0022의 crossing_bookings_team_overlap(120분)과 같아야 합니다.
 */
export const TEAM_GAP_MINUTES = 120;
/**
 * 칸 마감(KST). 오전 칸은 시작이 MORNING_END 전인 칸(9:00 칸 포함, D6)이고 전날에 닫힙니다. 오후 칸은 그날 AFTERNOON_CUTOFF에 닫힙니다.
 * DECIDED 2026-11-08 (사용자): 멘토가 갑자기 튀어나온 예약에 놀라지 않게. Day 2 오전은 Day 1 17:00, Day 3 오전은 Day 2 14:00(D7 그대로),
 * 오후는 그날 오전 중(D1, 12:00). 닫힌 칸은 비어 있어도 넣지 못하고 "닫힘"으로 보입니다. DB 0022 트리거 crossing_bookings_cutoff와 같아야 합니다.
 */
export const MORNING_END = "13:00";
export const MORNING_CUTOFF: Record<2 | 3, [number, string]> = { 2: [1, "17:00"], 3: [2, "14:00"] };
export const AFTERNOON_CUTOFF = "12:00";
/** 시작 시각 t의 칸이 닫혔는지. day는 그 칸의 Day(2, 3). */
export function slotClosed(day: 2 | 3, t: number, now = Date.now()): boolean {
  const at = fmtKst(t) < MORNING_END ? kstTime(...MORNING_CUTOFF[day]) : kstTime(day, AFTERNOON_CUTOFF);
  return !!at && now >= at.getTime();
}
/** 시각 t가 들어 있는 Day(2, 3). 아니면 null. */
export function opsDayOf(t: number): 2 | 3 | null {
  const d = new Date(t + 9 * 60 * MIN).toISOString().slice(0, 10);
  return d === dayDate(2) ? 2 : d === dayDate(3) ? 3 : null;
}
/**
 * 홈의 Day 2, Day 3 카드 버튼이 눌리는지. false면 버튼이 보이되 잠겨 있습니다.
 * DECIDED 2026-10-17 (사용자: "production에도 열어줘, 그런데 당장은 이용자들이 바로면 안되서, 일단 button은 disable").
 * 열 때 true로 바꿉니다. /crossing/team 페이지 자체는 주소로 열립니다.
 */
// DECIDED 2026-11-06 (사용자, 스크린숏: "이거 들어갈 수 있게 해줘"): 버튼을 엽니다. 칸 넣기는 그대로 서버의 bookingGate가 Day 1 12:00까지 막습니다.
export const TIMETABLE_OPEN = true;
/** 예약과 인증이 있는 날. */
export const OPS_DAYS = [2, 3] as const;
export type OpsDay = (typeof OPS_DAYS)[number];

/**
 * 트랙 색. 키는 crossing_tracks.color(마이그레이션 0012), 값은 brand 10장 크로싱 워드마크 그라데이션의 화면용 네 색입니다.
 * DECIDED 2026-10-18 (사용자: "무슨 트랙인지에 따라서 슬롯 색깔이 달라졌으면"): 시간표의 칸이 그 팀의 트랙 색으로 칠해집니다.
 * 잉크 바탕 위에 틴트로만 씁니다(밝은 판 금지).
 */
// DECIDED 2026-11-05 (사이트 점검, 종이): 트랙 색 넷을 brand 10장 종이 팔레트(남색, 보라, 마젠타, 테라코타)로. 그 전 어두운 바탕용 파스텔 #9AA8EE, #A99AD6, #C99ACB, #E08A76.
// 키(blue, violet, plum, orange)는 DB의 트랙 값이라 그대로 둡니다.
export const TRACK_TINTS = { blue: "#12246B", violet: "#4B3A8C", plum: "#845185", orange: "#9A3324" } as const;
export type TrackColor = keyof typeof TRACK_TINTS;
export type Track = { id: string; label: { ko: string; en: string }; color: TrackColor };
export const trackTint = (c: string | undefined): string => (c && c in TRACK_TINTS ? TRACK_TINTS[c as TrackColor] : "#141418");

export const PROOF_KINDS = ["photo", "pdf"] as const;
export type ProofKind = (typeof PROOF_KINDS)[number];
/**
 * 파일 하나의 크기 한도(종류마다). DECIDED 2026-10-26 (사용자: "사진의 용량이 pdf 파일과 같으면 좀 그렇지 않나?"):
 * 사진은 올리기 전에 긴 변 2000px JPEG(보통 1MB 안팎)로 줄어 10MB, PDF(1장, 발표 자료)는 20MB.
 * 버킷 crossing-proofs의 file_size_limit(20MB, 마이그레이션 0008)이 위의 바닥이라, PDF를 올리면 버킷도 같이 올려야 합니다.
 */
export const PROOF_MAX_BYTES: Record<"photo" | "pdf", number> = { photo: 10 * 1024 * 1024, pdf: 20 * 1024 * 1024 };
export const PROOF_TYPES: Record<ProofKind, string[]> = {
  photo: ["image/jpeg", "image/png", "image/webp", "image/heic", "image/heif"],
  pdf: ["application/pdf"],
};

const MIN = 60_000;

export const isOpsDay = (v: unknown): v is OpsDay => v === 2 || v === 3;

/**
 * 미션 인증을 올리는 날. Day 1도 올립니다. 시간표 칸은 여전히 Day 2, 3뿐입니다(OPS_DAYS).
 * DECIDED 2026-10-17 (사용자: "1일차에도 미션인증은 해야해서", "Day 1에는 PDF 하나만"). Day 1은 PDF만 받습니다.
 */
// 2026-10-19 (사용자: Day 1, Day 4 미션 뺌): Day 1 올리기는 남지만 미션이 아닙니다(선택). DB의 mission 열과 crossing_mission_progress 뷰가 Day 2, 3만 셉니다(0013).
export const PROOF_DAYS = [1, 2, 3] as const;
export type ProofDay = (typeof PROOF_DAYS)[number];
export const isProofDay = (v: unknown): v is ProofDay => v === 1 || v === 2 || v === 3;
export const proofKindsFor = (day: ProofDay): readonly ("photo" | "pdf")[] => (day === 1 ? ["pdf"] : ["photo", "pdf"]);

/** Day n의 날짜(KST) "YYYY-MM-DD". Day 0이 DECEMBER_STARTS_AT입니다. */
export function dayDate(day: number): string {
  const d = new Date(`${DECEMBER_STARTS_AT}T00:00:00+09:00`);
  d.setUTCDate(d.getUTCDate() + day);
  return new Date(d.getTime() + 9 * 60 * MIN).toISOString().slice(0, 10);
}

/** Day n의 "HH:MM"(KST)을 시각으로. */
export function kstTime(day: number, hhmm: string): Date | null {
  if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(hhmm)) return null;
  return new Date(`${dayDate(day)}T${hhmm}:00+09:00`);
}

/** 시각을 "HH:MM"(KST)으로. */
export function fmtKst(iso: string | number | Date): string {
  const d = new Date(new Date(iso).getTime() + 9 * 60 * MIN);
  return d.toISOString().slice(11, 16);
}

export type Window = { startsAt: string; endsAt: string };
export type Booking = { startsAt: string; endsAt: string; mine?: boolean };

export type SlotState = "open" | "booked" | "buffer" | "mine" | "closed" | "past" | "teamBusy";

const overlap = (a0: number, a1: number, b0: number, b1: number) => a0 < b1 && b0 < a1;

/**
 * 시작 시각 t에 예약할 수 있는지. 같은 멘토의 다른 예약과 BUFFER_MINUTES 이상 떨어져야 하고(DB 제약과 같은 규칙),
 * 닫힌 칸(slotClosed)이 아니어야 하고, 우리 팀의 다른 예약과 TEAM_GAP_MINUTES 이상 떨어져야 합니다.
 */
export function slotState(t: number, mentorBookings: Booking[], teamBookings: Booking[], now = Date.now()): SlotState {
  const end = t + SESSION_MINUTES * MIN;
  const buf = BUFFER_MINUTES * MIN;
  for (const b of mentorBookings) {
    const b0 = Date.parse(b.startsAt), b1 = Date.parse(b.endsAt);
    if (b.mine && b0 === t) return "mine";
    if (overlap(t, end, b0, b1)) return "booked";
    if (overlap(t, end, b0 - buf, b1 + buf)) return "buffer";
  }
  // 2026-11-08: 마감은 지남보다 먼저 봅니다(브리프 C1). 마감이 늘 시작보다 앞이라 지난 칸도 여기서 "closed"입니다.
  // 화면(TeamTool)과 서버(POST)는 지난 칸을 따로 먼저 걸러 "지남"으로 말합니다.
  const day = opsDayOf(t);
  if (day && slotClosed(day, t, now)) return "closed";
  if (t < now) return "past";
  // 2026-11-08: 우리 팀의 다른 칸과 시작이 2시간 이상(DB 0022 team_overlap, 120분). 그 전 60분(겹치지만 않으면, 2026-11-03).
  for (const b of teamBookings) {
    if (Math.abs(t - Date.parse(b.startsAt)) < TEAM_GAP_MINUTES * MIN) return "teamBusy";
  }
  return "open";
}

// 2026-11-02: 멘토 페이지도 같은 시간을 쓰려고 app/api/crossing/mentoring/route.ts에서 옮겼습니다.
// 멘토 시간은 표에 Day와 한국 시각("14:00:00")으로 들어 있습니다(운영진이 표 편집기에 바로 적음). 화면과 판정에는 시각으로 바꿔 씁니다.
export function toWindow(day: number, start: string, end: string): Window | null {
  const a = kstTime(day, String(start).slice(0, 5)), b = kstTime(day, String(end).slice(0, 5));
  return a && b && b > a ? { startsAt: a.toISOString(), endsAt: b.toISOString() } : null;
}
// DECIDED 2026-11-03 (사용자): 멘토는 맡은 날의 반나절(10:00~13:00 또는 13:00~16:00)만 받습니다(마이그레이션 0017, 0019). 점심시간은 없고 13:00에 오후 멘토로 이어집니다.
// 그날 행이 없으면 그날은 맡지 않는 것이라 칸이 없습니다. 그 전(2026-10-17)에는 임시 기본값 10:00~22:00으로 채웠습니다.
export function windowsFor(day: number, rows: { start_time: string; end_time: string }[]): Window[] {
  return rows.map((w) => toWindow(day, w.start_time, w.end_time)).filter((w): w is Window => !!w);
}

/** t 이상인 첫 칸 경계(GRID_MINUTES의 배수, 정각). KST는 UTC+9 정수 시간이라 UTC 기준으로 나눠도 한국 정각입니다. */
export function gridCeil(t: number): number {
  const g = GRID_MINUTES * MIN;
  return Math.ceil(t / g) * g;
}

/** 구간들 안에서 예약이 들어갈 수 있는 시작 시각(정각, GRID_MINUTES 간격). 멘토가 14:30부터면 첫 칸은 15:00입니다. */
export function slotStarts(windows: Window[]): number[] {
  const out = new Set<number>();
  for (const w of windows) {
    const w0 = gridCeil(Date.parse(w.startsAt)), w1 = Date.parse(w.endsAt);
    for (let t = w0; t + SESSION_MINUTES * MIN <= w1; t += GRID_MINUTES * MIN) out.add(t);
  }
  return [...out].sort((a, b) => a - b);
}

/** 시작 시각이 그 멘토의 구간 안에 온전히 들어가고 칸 간격에 맞는지. */
export function fitsWindow(t: number, windows: Window[]): boolean {
  return slotStarts(windows).includes(t);
}

/**
 * 언제 칸을 넣을 수 있는지. 서버(POST)와 화면이 같은 판정을 씁니다.
 * DECIDED 2026-10-26 (사용자: "day 2,3 둘다 choose 할 수 있도록 at day 1 에 할 수 있도록. 그리고 day 2 에는 오전 시간대는 오후 1시 이상
 * and day 3, 그리고 시간이 지나면 그 지나간 시간은 block. do the same for the day 3"):
 * - Day 1(12.18) 12:00 KST부터 Day 2, 3 칸을 넣을 수 있습니다. 그 전에는 닫혀 있습니다.
 *   (같은 날 사용자: "Day 1(12.18) 에는 12시 부터 열어줘". 그 전 00:00.)
 * - 지난 시간은 막힙니다(slotState의 past, 서버의 past).
 * DECIDED 2026-11-03 (사용자): "당일은 오후 칸만"(SAME_DAY_FROM)을 없앴습니다. 예약이 Day 1에 열려 대부분 미리 넣고, 규칙만 늘어서.
 */
export const BOOKING_OPENS_DAY = 1;
export const BOOKING_OPENS_AT = "12:00";
export type BookingGate = "ok" | "not_yet";
export function bookingGate(now = Date.now()): BookingGate {
  return now < kstTime(BOOKING_OPENS_DAY, BOOKING_OPENS_AT)!.getTime() ? "not_yet" : "ok";
}

/**
 * 폰인가(user agent). 화면(TeamTool)과 서버(app/api/crossing/mentoring)가 같은 기준을 씁니다. 태블릿과 노트북은 아닙니다.
 * DECIDED 2026-10-26 (사용자: "여기에 있는 기능들은 폰으로는 할 수 없도록 for the participants"): 폰에서는 칸을 넣지 않습니다.
 * 인증 사진과 PDF 올리기는 폰에서도 됩니다(같은 날 사용자: 사진은 갤러리에서 바로).
 */
export function isPhoneUA(ua: string): boolean {
  return /iPhone|iPod|Android.+Mobile|Mobile Safari|Windows Phone|Mobi/i.test(ua) && !/iPad|Tablet/i.test(ua);
}

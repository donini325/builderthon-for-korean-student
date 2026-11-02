// ─────────────────────────────────────────────────────────────────────────────
// 크로싱 서울 현장 도구(멘토 시간표, 미션 인증)의 값과 계산. 서버와 브라우저가 함께 씁니다.
// 표는 supabase/migrations/0008_crossing_teams_and_mentor_timetable.sql.
//
// DECIDED 2026-10-17 (사용자): 멘토링은 예약제이고, 예약 하나가 그 앞뒤 10분을 막습니다(같은 날 15분에서 10분으로).
// DECIDED 2026-10-17 (사용자: "10분씩 보여주니까 너무 정신이 없음, 30분 간격으로, 어짜피 앞뒤 10분하면 1시간"): 줄은 30분이었습니다.
// DECIDED 2026-11-02 (사용자): 칸은 정각에만 시작하고 줄은 한 시간입니다(GRID_MINUTES). 칸 하나(40분)가 한 줄입니다.
// DECIDED 2026-11-03 (사용자): 멘토 한 분은 Day 2 또는 Day 3 중 하루의 반나절(오전 10:00~13:00 또는 오후 14:00~17:00)만 맡습니다(마이그레이션 0017). 13:00~14:00은 점심이라 칸이 없습니다.
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
 * 한 팀이 칸을 하나 넣으면 그 칸의 시작부터 이만큼은 어느 멘토의 칸도 넣지 못합니다. 하루 횟수 제한은 없습니다(2026-11-02).
 * DECIDED 2026-10-17 (사용자: "한번 slot booking을 하면, 그 이후 2시간 동안은 같은 멘토던 다른 멘토던 booking 못하고").
 * 앞뒤 대칭입니다(16:00을 먼저 넣었으면 14:10~17:50 시작도 막힘). 마이그레이션 0008의 crossing_plus_minutes(starts_at, 120)과 같아야 합니다.
 */
export const TEAM_COOLDOWN_MINUTES = 120;
/**
 * 같은 날의 다음 칸은 그 날 넣은 칸이 끝난 뒤에 넣습니다. 끝은 칸의 시작에서 한 줄(GRID_MINUTES) 뒤입니다.
 * DECIDED 2026-11-02 (사용자: "하루 한도는 없음", "3시로 booking 을 하면, 4시에 마무리가 되니까, 4시 이후에 booking"):
 * 하루 두 칸(2026-10-17)을 없앴습니다. 날마다 따로 셉니다(사용자가 고른 안 "날마다 하나씩 미리"): Day 1에 Day 2, 3 칸을 하나씩 넣을 수 있습니다.
 * 2시간 규칙(TEAM_COOLDOWN_MINUTES)은 그대로라 15:00 칸 뒤의 다음 칸은 16:00부터 넣고, 17:00 이후입니다.
 * DB 트리거(0016 crossing_bookings_one_pending)와 같아야 합니다.
 */
export const teamHasPending = (teamBookingsThatDay: Booking[], now = Date.now()): boolean =>
  teamBookingsThatDay.some((b) => Date.parse(b.startsAt) + GRID_MINUTES * MIN > now);
/**
 * 홈의 Day 2, Day 3 카드 버튼이 눌리는지. false면 버튼이 보이되 잠겨 있습니다.
 * DECIDED 2026-10-17 (사용자: "production에도 열어줘, 그런데 당장은 이용자들이 바로면 안되서, 일단 button은 disable").
 * 열 때 true로 바꿉니다. /crossing/team 페이지 자체는 주소로 열립니다.
 */
export const TIMETABLE_OPEN = false;
/** 예약과 인증이 있는 날. */
export const OPS_DAYS = [2, 3] as const;
export type OpsDay = (typeof OPS_DAYS)[number];

/**
 * 트랙 색. 키는 crossing_tracks.color(마이그레이션 0012), 값은 brand 10장 크로싱 워드마크 그라데이션의 화면용 네 색입니다.
 * DECIDED 2026-10-18 (사용자: "무슨 트랙인지에 따라서 슬롯 색깔이 달라졌으면"): 시간표의 칸이 그 팀의 트랙 색으로 칠해집니다.
 * 잉크 바탕 위에 틴트로만 씁니다(밝은 판 금지).
 */
export const TRACK_TINTS = { blue: "#9AA8EE", violet: "#A99AD6", plum: "#C99ACB", orange: "#E08A76" } as const;
export type TrackColor = keyof typeof TRACK_TINTS;
export type Track = { id: string; label: { ko: string; en: string }; color: TrackColor };
export const trackTint = (c: string | undefined): string => (c && c in TRACK_TINTS ? TRACK_TINTS[c as TrackColor] : "#FFFFFF");

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

export type SlotState = "open" | "booked" | "buffer" | "mine" | "past" | "teamBusy";

const overlap = (a0: number, a1: number, b0: number, b1: number) => a0 < b1 && b0 < a1;

/**
 * 시작 시각 t에 예약할 수 있는지. 같은 멘토의 다른 예약과 BUFFER_MINUTES 이상 떨어져야 하고(DB 제약과 같은 규칙),
 * 팀의 다른 예약과 겹치면 안 됩니다.
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
  if (t < now) return "past";
  const cool = TEAM_COOLDOWN_MINUTES * MIN;
  for (const b of teamBookings) {
    if (Math.abs(t - Date.parse(b.startsAt)) < cool) return "teamBusy";
  }
  return "open";
}

// 2026-11-02: 멘토 페이지도 같은 시간을 쓰려고 app/api/crossing/mentoring/route.ts에서 옮겼습니다.
// 멘토 시간은 표에 Day와 한국 시각("14:00:00")으로 들어 있습니다(운영진이 표 편집기에 바로 적음). 화면과 판정에는 시각으로 바꿔 씁니다.
export function toWindow(day: number, start: string, end: string): Window | null {
  const a = kstTime(day, String(start).slice(0, 5)), b = kstTime(day, String(end).slice(0, 5));
  return a && b && b > a ? { startsAt: a.toISOString(), endsAt: b.toISOString() } : null;
}
// DECIDED 2026-11-03 (사용자): 멘토는 맡은 날의 반나절(10:00~13:00 또는 14:00~17:00)만 받습니다(마이그레이션 0017).
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
 * - Day 1(12.18) 12:00 KST부터 Day 2, 3 칸을 함께 넣을 수 있습니다. 그 전에는 닫혀 있습니다.
 *   (같은 날 사용자: "Day 1(12.18) 에는 12시 부터 열어줘". 그 전 00:00.)
 * - 그날이 되면 그날의 칸은 SAME_DAY_FROM 이후만 넣습니다.
 * - 지난 시간은 막힙니다(slotState의 past, 서버의 past).
 */
export const BOOKING_OPENS_DAY = 1;
export const BOOKING_OPENS_AT = "12:00";
// DECIDED 2026-11-03 (사용자): 당일에는 오후 칸(14:00부터)만. 오전 칸은 전날까지 넣어야 멘토가 1장을 미리 봅니다(그 전 13:00).
export const SAME_DAY_FROM = "14:00";
export type BookingGate = "ok" | "not_yet" | "same_day_morning";
export function bookingGate(day: number, t: number, now = Date.now()): BookingGate {
  if (now < kstTime(BOOKING_OPENS_DAY, BOOKING_OPENS_AT)!.getTime()) return "not_yet";
  if (now >= kstTime(day, "00:00")!.getTime() && t < kstTime(day, SAME_DAY_FROM)!.getTime()) return "same_day_morning";
  return "ok";
}

/**
 * 폰인가(user agent). 화면(TeamTool)과 서버(app/api/crossing/mentoring)가 같은 기준을 씁니다. 태블릿과 노트북은 아닙니다.
 * DECIDED 2026-10-26 (사용자: "여기에 있는 기능들은 폰으로는 할 수 없도록 for the participants"): 폰에서는 칸을 넣지 않습니다.
 * 인증 사진과 PDF 올리기는 폰에서도 됩니다(같은 날 사용자: 사진은 갤러리에서 바로).
 */
export function isPhoneUA(ua: string): boolean {
  return /iPhone|iPod|Android.+Mobile|Mobile Safari|Windows Phone|Mobi/i.test(ua) && !/iPad|Tablet/i.test(ua);
}

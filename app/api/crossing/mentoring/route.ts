// ─────────────────────────────────────────────────────────────────────────────
// /api/crossing/mentoring. 멘토 시간표(2026-10-17). 모든 팀이 같은 시간표를 봅니다.
//
//   GET    ?day=2                          트랙, 팀 목록(팀마다 트랙), 그날의 멘토와 받는 구간, 예약(팀 이름과 트랙 포함)
//   POST   {team, mentorId, startsAt}       칸에 팀 넣기. 길이는 SESSION_MINUTES
//   (빼기 없음) DECIDED 2026-10-17 (사용자: "once they put in, they cannot change it"). 운영진은 표 편집기에서 지웁니다.
//
// DECIDED 2026-10-17 (사용자: "그냥 timetable where team can put in their available, 다른 팀과 공유"): 팀 코드 없이
// 팀을 골라 넣습니다. 같은 멘토의 앞뒤 10분과 한 팀의 시간 겹침은 DB의 exclude 제약이 지킵니다(23P01).
// ─────────────────────────────────────────────────────────────────────────────

import { NextResponse } from "next/server";
import { tooMany } from "@/lib/memThrottle";
import { clientIp } from "@/lib/register/shared";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";
import { CURRENT_EVENT } from "@/lib/registrationWindow";
import { findTeam, listTracks, publicMentorName } from "@/lib/crossingOpsServer";
import { OPS_DAYS, GRID_MINUTES, teamHasPending, windowsFor, SESSION_MINUTES, bookingGate, fitsWindow, isPhoneUA, isOpsDay, isProofDay } from "@/lib/crossingOps";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const db = getSupabaseAdmin();
  if (!db) return NextResponse.json({ error: "not_configured" }, { status: 503 });
  const day = Number(new URL(req.url).searchParams.get("day"));
  // Day 1도 읽습니다(팀 목록과 잠긴 시간표를 그리려고, 2026-10-17). Day 1에는 칸이 없고 POST도 받지 않습니다.
  if (!isProofDay(day)) return NextResponse.json({ error: "invalid_day" }, { status: 400 });

  // 멘토 열 순서는 sort(0012, 자리 10개가 01~10). 이름을 바꿔도 순서가 흔들리지 않습니다.
  const [teams, mentors, tracks] = await Promise.all([
    db.from("crossing_teams").select("name, track").eq("event_slug", CURRENT_EVENT).order("name"),
    db.from("crossing_mentors").select("id, name, field").eq("event_slug", CURRENT_EVENT).eq("active", true).order("sort").order("name"),
    listTracks(db),
  ]);
  if (teams.error || mentors.error || !tracks) return NextResponse.json({ error: "db" }, { status: 500 });
  const ids = (mentors.data ?? []).map((m) => m.id);
  const none = ["00000000-0000-0000-0000-000000000000"];
  const [{ data: windows }, { data: bookings }, { data: pending }] = await Promise.all([
    db.from("crossing_mentor_windows").select("mentor_id, start_time, end_time").eq("day", isOpsDay(day) ? day : -1).in("mentor_id", ids.length ? ids : none).order("start_time"),
    db.from("crossing_mentor_bookings").select("id, mentor_id, team_name, track, starts_at, ends_at").eq("day", isOpsDay(day) ? day : -1).in("mentor_id", ids.length ? ids : none).order("starts_at"),
    db.from("crossing_mentor_bookings").select("team_name").in("mentor_id", ids.length ? ids : none).gt("starts_at", new Date(Date.now() - GRID_MINUTES * 60_000).toISOString()),
  ]);
  return NextResponse.json({
    // DECIDED 2026-10-18 (사용자: "트랙에 따라서 슬롯 색깔이 달라졌으면"): 화면이 팀과 칸을 트랙 색으로 칠합니다.
    tracks,
    teams: (teams.data ?? []).map((t) => t.name),
    teamTracks: Object.fromEntries((teams.data ?? []).map((t) => [t.name, t.track])),
    // DECIDED 2026-11-03 (사용자): 그날 맡은 멘토만 내보냅니다(구간이 없는 멘토는 빈 열이 되므로). Day 1은 구간을 읽지 않아 비어 있습니다.
    mentors: (mentors.data ?? []).map((m) => ({
      id: m.id, ...publicMentorName(m.id, m.name), field: m.field,
      windows: windowsFor(day, (windows ?? []).filter((w) => w.mentor_id === m.id)),
      bookings: (bookings ?? []).filter((b) => b.mentor_id === m.id).map((b) => ({
        id: b.id, team: b.team_name, track: b.track, startsAt: b.starts_at, endsAt: b.ends_at,
      })),
    })).filter((m) => m.windows.length > 0),
    // 2026-11-03: 넣은 멘토링이 아직 끝나지 않은 팀(이틀 통틀어, lib/crossingOps.ts teamHasPending). 그 팀은 다음 칸을 넣지 못합니다.
    pendingTeams: [...new Set((pending ?? []).map((b) => b.team_name))],
  });
}

export async function POST(req: Request) {
  const db = getSupabaseAdmin();
  if (!db) return NextResponse.json({ error: "not_configured" }, { status: 503 });
  // 2026-10-26: 폰에서는 칸을 넣지 않습니다(lib/crossingOps.ts isPhoneUA). 화면이 막고, 여기서도 막습니다.
  if (isPhoneUA(req.headers.get("user-agent") ?? "")) return NextResponse.json({ error: "phone" }, { status: 403 });
  // 2026-11-05 (사이트 점검): 한 IP가 10분에 예약 시도 30번까지.
  if (tooMany("mentoring-post", clientIp(req), 30, 10 * 60_000)) return NextResponse.json({ error: "rate" }, { status: 429 });
  const body = await req.json().catch(() => null);
  const team = await findTeam(db, body?.team);
  const mentorId = typeof body?.mentorId === "string" ? body.mentorId : "";
  const t = Date.parse(typeof body?.startsAt === "string" ? body.startsAt : "");
  if (!team || !mentorId || Number.isNaN(t)) return NextResponse.json({ error: "invalid" }, { status: 400 });
  if (t < Date.now()) return NextResponse.json({ error: "past" }, { status: 400 });

  const { data: mentor } = await db.from("crossing_mentors").select("id").eq("id", mentorId).eq("event_slug", CURRENT_EVENT).eq("active", true).maybeSingle();
  if (!mentor) return NextResponse.json({ error: "invalid" }, { status: 400 });
  const { data: windows } = await db.from("crossing_mentor_windows").select("day, start_time, end_time").eq("mentor_id", mentorId);
  const hit = OPS_DAYS.map((d) => ({ day: d, ws: windowsFor(d, (windows ?? []).filter((w) => w.day === d)) })).find((x) => fitsWindow(t, x.ws));
  if (!hit) return NextResponse.json({ error: "outside_window" }, { status: 400 });
  // 2026-10-26: Day 1 12:00부터 열립니다(lib/crossingOps.ts bookingGate). 당일 오후 규칙은 2026-11-03에 없앴습니다.
  const gate = bookingGate();
  if (gate !== "ok") return NextResponse.json({ error: gate }, { status: 400 });

  // 2026-11-03: 넣은 칸이 끝나야 다음 칸, 이틀 통틀어(lib/crossingOps.ts teamHasPending). 미리 보고 알맞은 말로 거절하고,
  // 동시에 들어온 요청은 DB 트리거가 막습니다(P0001 team_pending).
  const { data: ours } = await db.from("crossing_mentor_bookings").select("starts_at, ends_at").eq("team_name", team.name);
  if (teamHasPending((ours ?? []).map((b) => ({ startsAt: b.starts_at, endsAt: b.ends_at })))) return NextResponse.json({ error: "team_pending" }, { status: 409 });

  const { error } = await db.from("crossing_mentor_bookings").insert({
    mentor_id: mentorId, team_name: team.name, day: hit.day,
    starts_at: new Date(t).toISOString(), ends_at: new Date(t + SESSION_MINUTES * 60_000).toISOString(),
  });
  if (error) {
    if (error.code === "P0001" && (error.message ?? "").includes("team_pending")) return NextResponse.json({ error: "team_pending" }, { status: 409 });
    if (error.code === "23P01") return NextResponse.json({ error: (error.message ?? "").includes("team_overlap") ? "team_busy" : "taken" }, { status: 409 });
    console.error("[crossing/mentoring] insert failed", error.code);
    return NextResponse.json({ error: "db" }, { status: 500 });
  }
  return NextResponse.json({ ok: true }, { status: 201 });
}

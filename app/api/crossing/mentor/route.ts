// ─────────────────────────────────────────────────────────────────────────────
// /api/crossing/mentor. 멘토 페이지(2026-10-26).
//
//   GET ?k=<멘토 열쇠>   그 멘토의 Day 2, 3 칸과, 칸을 넣은 팀이 올린 PDF(30분짜리 보기 URL)
//                        board: 그 멘토가 맡은 날의 멘토 전원 칸과 들어온 팀 이름(2026-11-03)
//
// DECIDED 2026-10-26 (사용자: "올리면 팀이 멘토분들에게 사전에 공유줄 수 있도록", "멘토 전용 페이지"): 멘토는 찾아올 팀의
// 이슈에 대한 생각 1장(Day 1 PDF)을 미리 봅니다. 2026-10-26부터 칸마다 그 팀이 올린 PDF 전부(Day 1 1장, Day 2 고친 1장, Day 3 발표 자료). 사진은 내보내지 않습니다.
// 열쇠는 lib/crossingOpsServer.ts mentorKey. 맞는 멘토가 없으면 404입니다.
// ─────────────────────────────────────────────────────────────────────────────

import { NextResponse } from "next/server";
import { timingSafeEqual } from "node:crypto";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";
import { CURRENT_EVENT } from "@/lib/registrationWindow";
import { BRIEF_BUCKET, PROOF_BUCKET, listTracks, mentorKey } from "@/lib/crossingOpsServer";
import { OPS_DAYS, slotStarts, windowsFor } from "@/lib/crossingOps";

export const dynamic = "force-dynamic";

const same = (a: string, b: string) => a.length === b.length && timingSafeEqual(Buffer.from(a), Buffer.from(b));

export async function GET(req: Request) {
  const db = getSupabaseAdmin();
  if (!db) return NextResponse.json({ error: "not_configured" }, { status: 503 });
  const k = new URL(req.url).searchParams.get("k") ?? "";
  if (!/^[0-9a-f]{20}$/.test(k)) return NextResponse.json({ error: "unknown_mentor" }, { status: 404 });

  const { data: mentors, error } = await db.from("crossing_mentors").select("id, name, field").eq("event_slug", CURRENT_EVENT).eq("active", true).order("sort").order("name");
  if (error) return NextResponse.json({ error: "db" }, { status: 500 });
  const mentor = (mentors ?? []).find((m) => { const mk = mentorKey(m.id); return !!mk && same(mk, k); });
  if (!mentor) return NextResponse.json({ error: "unknown_mentor" }, { status: 404 });

  const [{ data: bookings, error: bErr }, tracks, { data: windows }] = await Promise.all([
    db.from("crossing_mentor_bookings").select("id, day, team_name, track, starts_at, ends_at").eq("mentor_id", mentor.id).order("starts_at"),
    listTracks(db),
    db.from("crossing_mentor_windows").select("day, start_time, end_time").eq("mentor_id", mentor.id).order("start_time"),
  ]);
  if (bErr || !tracks) return NextResponse.json({ error: "db" }, { status: 500 });

  // 칸을 넣은 팀의 PDF 중 날마다 가장 최근 것 하나. Day 1은 이슈에 대한 생각 1장, Day 2는 진척.
  const teams = [...new Set((bookings ?? []).map((b) => b.team_name))];
  const latest = new Map<string, string>(); // `${team}|${day}` → storage_path
  if (teams.length) {
    const { data: proofs } = await db.from("crossing_mission_proofs").select("team_name, day, storage_path, created_at")
      .in("team_name", teams).eq("kind", "pdf").in("day", [1, 2, 3]).order("created_at", { ascending: false });
    for (const p of proofs ?? []) { const key = `${p.team_name}|${p.day}`; if (!latest.has(key)) latest.set(key, p.storage_path); }
  }
  const paths = [...latest.values()];
  const signed = paths.length ? (await db.storage.from(PROOF_BUCKET).createSignedUrls(paths, 1800)).data ?? [] : [];
  const urlOf = new Map(paths.map((p, i) => [p, signed[i]?.signedUrl ?? null]));
  const file = (team: string, day: number) => { const p = latest.get(`${team}|${day}`); return p ? urlOf.get(p) ?? null : null; };

  // DECIDED 2026-11-03 (사용자: "본인 파트만 보이지 말고, 다른 분들 파트도 보일 수 있게 for those assigned at the same date"):
  // 맡은 날의 표 전체(그날 맡은 멘토 넷의 칸과 넣은 팀)를 학생 시간표처럼 보냅니다. 팀 이름은 학생 시간표에서도 모두에게 보이는 값입니다.
  // 파일(PDF)은 그대로 내 칸에 들어온 팀 것만 보냅니다. 멘토 id는 내보내지 않습니다.
  const myDays = OPS_DAYS.filter((d) => (windows ?? []).some((w) => w.day === d) || (bookings ?? []).some((b) => b.day === d));
  const ids = (mentors ?? []).map((m) => m.id);
  const [{ data: allWindows }, { data: allBookings }] = myDays.length && ids.length ? await Promise.all([
    db.from("crossing_mentor_windows").select("mentor_id, day, start_time, end_time").in("day", myDays).in("mentor_id", ids).order("start_time"),
    db.from("crossing_mentor_bookings").select("mentor_id, day, team_name, track, starts_at, ends_at").in("day", myDays).in("mentor_id", ids).order("starts_at"),
  ]) : [{ data: [] }, { data: [] }];
  const board = Object.fromEntries(myDays.map((d) => [d, (mentors ?? []).map((m) => ({
    name: m.name, field: m.field, me: m.id === mentor.id,
    slots: slotStarts(windowsFor(d, (allWindows ?? []).filter((w) => w.mentor_id === m.id && w.day === d))).map((t) => new Date(t).toISOString()),
    bookings: (allBookings ?? []).filter((b) => b.mentor_id === m.id && b.day === d).map((b) => ({ team: b.team_name, track: b.track, startsAt: b.starts_at, endsAt: b.ends_at })),
  })).filter((m) => m.slots.length || m.bookings.length)]));

  // DECIDED 2026-11-05 (사용자: 출제사와 정리한 PDF를 멘토는 자기 페이지에서, 참가자는 절대 접근 못 하게): 멘토 열쇠를 확인한 이 자리에서만
  // 비공개 버킷(BRIEF_BUCKET)의 30분짜리 보기 URL을 만듭니다. 자료가 없거나 읽지 못하면 빈 목록이고, 페이지의 나머지는 그대로 뜹니다.
  const briefs = await listBriefs(db);

  return NextResponse.json({
    mentor: { name: mentor.name, field: mentor.field },
    briefs,
    board,
    tracks,
    // DECIDED 2026-11-02 (사용자: "팀이 없습니다 이런식으로 말고 뭔가 좀 더 visual"): 날마다 이 멘토가 받는 칸의 시작 시각(정각).
    // 화면이 이 시각들로 하루 띠를 그리고, 넣은 팀은 그 칸에 이름으로 뜹니다. 학생 시간표와 같은 계산(windowsFor, slotStarts)입니다.
    slots: Object.fromEntries(OPS_DAYS.map((d) => [d, slotStarts(windowsFor(d, (windows ?? []).filter((w) => w.day === d))).map((t) => new Date(t).toISOString())])),
    bookings: (bookings ?? []).map((b) => ({
      id: b.id, day: b.day, team: b.team_name, track: b.track, startsAt: b.starts_at, endsAt: b.ends_at,
      // 2026-10-26 (사용자: "멘토가 본인의 링크에 들어가서 클릭했을 때 그 파일들을 볼 수 있게"): 그 팀이 지금까지 올린 PDF 전부(날마다 하나).
      files: [1, 2, 3].map((d) => ({ day: d, url: file(b.team_name, d) })).filter((f) => f.url),
    })),
  });
}

type BriefEntry = { path: string; title: { ko: string; en: string } };

/** 출제사 이슈 정리 PDF 목록과 30분짜리 보기 URL. 멘토 열쇠를 확인한 뒤에만 부릅니다. */
async function listBriefs(db: NonNullable<ReturnType<typeof getSupabaseAdmin>>) {
  try {
    const { data: idx } = await db.storage.from(BRIEF_BUCKET).download("index.json");
    if (!idx) return [];
    const entries = (JSON.parse(await idx.text()) as BriefEntry[]).filter((e) => typeof e?.path === "string" && e.path.endsWith(".pdf"));
    if (!entries.length) return [];
    const { data: signed } = await db.storage.from(BRIEF_BUCKET).createSignedUrls(entries.map((e) => e.path), 1800);
    return entries.map((e, i) => ({ title: e.title, url: signed?.[i]?.signedUrl ?? null })).filter((b) => b.url);
  } catch {
    return [];
  }
}

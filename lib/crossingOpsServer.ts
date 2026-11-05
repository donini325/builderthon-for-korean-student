// ─────────────────────────────────────────────────────────────────────────────
// 현장 도구 라우트의 서버 공통(2026-10-17). 팀 찾기.
//
// DECIDED 2026-10-17 (사용자: "너무 뭐가 많은데? 그냥 timetable where team can put in their available"):
// 팀 코드를 뺐습니다. 시간표는 모든 팀이 같이 보고, 팀은 목록에서 자기 팀을 골라 칸에 넣습니다(wejoinin처럼).
// 대가: 주소를 아는 사람은 어느 팀으로든 넣고 뺄 수 있습니다. 현장에서만 쓰는 도구라 받아들입니다.
// ─────────────────────────────────────────────────────────────────────────────

import "server-only";
import { createHash, createHmac } from "node:crypto";
import type { SupabaseClient } from "@supabase/supabase-js";
import { CURRENT_EVENT } from "@/lib/registrationWindow";

// 팀에는 따로 만드는 ID가 없습니다. 운영진이 Supabase에 적은 팀 이름이 곧 키입니다(2026-10-17).
// 트랙은 팀마다 하나이고 비울 수 없습니다(0012). 칸과 인증의 track 열은 DB 트리거가 팀에서 채웁니다.
export type Team = { name: string; track: string };

/** 이름으로 이번 회차의 팀을 찾습니다. 없으면 null. */
export async function findTeam(db: SupabaseClient, name: unknown): Promise<Team | null> {
  if (typeof name !== "string" || !name.trim() || name.length > 40) return null;
  const { data } = await db.from("crossing_teams").select("name, track").eq("event_slug", CURRENT_EVENT).eq("name", name).maybeSingle();
  return (data as Team | null) ?? null;
}

/** 이번 회차의 트랙(순서대로). 화면은 이름과 색을 여기서 받습니다. */
export async function listTracks(db: SupabaseClient) {
  const { data, error } = await db.from("crossing_tracks").select("id, label_ko, label_en, color").eq("event_slug", CURRENT_EVENT).order("sort");
  if (error) return null;
  return (data ?? []).map((r) => ({ id: r.id as string, label: { ko: r.label_ko as string, en: r.label_en as string }, color: r.color as string }));
}

/** 저장소 폴더 이름. 팀 이름(한글)은 경로에 못 써서 해시 16자로 씁니다. */
export const teamFolder = (name: string) => createHash("sha256").update(name).digest("hex").slice(0, 16);

export const PROOF_BUCKET = "crossing-proofs";

/**
 * 출제사와 정리한 이슈 PDF(멘토 전용). DECIDED 2026-11-05 (사용자: "맨토들은 본인 페이지에서 볼 수 있도록, but make sure the 일반 참여자들은
 * 절대 pdf 에 access 가 없도록"). 출제사 미팅 전사록 11/05: 자세한 정리는 멘토에게만, 학생은 Day 1에 출제사의 말로 듣는다.
 * - 팀 증빙(PROOF_BUCKET)과 다른 비공개(public=false) 버킷입니다. 참가자 API(/api/crossing/proofs)는 이 버킷을 모릅니다.
 * - 이 상수를 쓰는 곳은 /api/crossing/mentor 하나뿐이고, 멘토 열쇠(mentorKey)를 확인한 뒤에만 30분짜리 보기 URL을 만듭니다.
 * - 파일은 레포(public/ 포함)에 두지 않습니다. 올리기는 scripts/issue-briefs.mjs(버킷이 비공개인지 확인한 뒤 올림).
 * - 버킷 안의 index.json이 목록(경로와 제목)입니다.
 */
export const BRIEF_BUCKET = "crossing-issue-briefs";

/**
 * 멘토 페이지(/crossing/mentor?k=)의 열쇠. 멘토 ID를 서버 비밀로 서명한 20자입니다. 표에 따로 적지 않습니다.
 * DECIDED 2026-10-26 (사용자: 멘토가 팀의 1장을 미리 보는 방법으로 "멘토 전용 페이지"): 멘토마다 자기 링크가 있고,
 * 링크가 없으면 다른 멘토나 팀의 칸은 볼 수 없습니다. 링크는 scripts/mentor-links.mjs가 뽑습니다(같은 계산).
 * 비밀은 MENTOR_LINK_SECRET, 없으면 SUPABASE_SERVICE_ROLE_KEY. 비밀을 바꾸면 모든 링크가 바뀝니다.
 */
export function mentorKey(mentorId: string): string | null {
  const secret = process.env.MENTOR_LINK_SECRET || process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!secret) return null;
  return createHmac("sha256", secret).update(`crossing-mentor:${mentorId}`).digest("hex").slice(0, 20);
}

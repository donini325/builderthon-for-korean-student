"use client";

// ─────────────────────────────────────────────────────────────────────────────
// /crossing/mentor?k=. 멘토 한 사람의 페이지(2026-10-26).
//
// DECIDED 2026-10-26 (사용자: "올리면 팀이 멘토분들에게 사전에 공유줄 수 있도록", "멘토 전용 페이지"): 멘토는 자기 링크로 들어와
// Day 2, 3에 자기 칸을 넣은 팀과 그 팀이 올린 PDF 전부(Day 1 1장, Day 2 고친 1장, Day 3 발표 자료)를 눌러 엽니다(2026-10-26).
// 인증 사진과 다른 멘토 칸의 파일은 보이지 않습니다. 보기 URL은 30분짜리라 1분마다 다시 읽습니다.
// DECIDED 2026-11-03 (사용자): 맡은 날의 표 전체(같은 날 멘토 넷의 칸과 팀 이름)를 보여 주고 내 열을 블루 테두리로 감쌉니다. 그 전(2026-10-26)에는 내 칸만.
// 머리와 글자 크기는 /crossing/team과 같습니다(BODY, META 둘).
// DECIDED 2026-10-27 (사용자: 멘토 링크도 kwan-design을 따르게): 머리는 사이트 바와 같은 ToolHeader(워드마크, 가는 선, EN/KR).
// Day 제목은 /crossing/team의 구획 제목처럼 SUBTITLE 굵게 흰색, 날짜는 META. 블루는 칸 안의 파일 타일에만 남깁니다.
// ─────────────────────────────────────────────────────────────────────────────

import { useCallback, useEffect, useState } from "react";
import { useLocale } from "@/lib/LocaleContext";
import { BODY, META, SUBTITLE, TITLE } from "@/components/ui/typography";
import ToolHeader from "@/components/crossing/ToolHeader";
import { mentorCopy as c, mentorTitle } from "@/data/crossingTeam";
import { OPS_DAYS, dayDate, fmtKst, trackTint, type Track } from "@/lib/crossingOps";

type Row = { id: string; day: number; team: string; track: string; startsAt: string; endsAt: string; files: { day: number; url: string }[] };
type BoardMentor = { name: string; nameEn?: string; field: string | null; me: boolean; slots: string[]; bookings: { team: string; track: string; startsAt: string; endsAt: string }[] };
type Brief = { title: { ko: string; en: string }; url: string };
type Data = { mentor: { name: string; nameEn?: string; field: string | null }; briefs?: Brief[]; tracks: Track[]; slots?: Record<string, string[]>; board?: Record<string, BoardMentor[]>; bookings: Row[] };
const HOUR = 3_600_000;

export default function MentorTool() {
  const { t, locale } = useLocale();
  const [data, setData] = useState<Data | null>(null);
  const [err, setErr] = useState<"bad" | "generic" | null>(null);

  const refresh = useCallback(async () => {
    const k = new URLSearchParams(window.location.search).get("k") ?? "";
    // 2026-11-05 (사이트 점검): 링크 열쇠 없이 들어오면 빈 화면 대신 "링크가 맞지 않습니다" 안내.
    if (!k) { setErr("bad"); return; }
    const r = await fetch(`/api/crossing/mentor?k=${encodeURIComponent(k)}`, { cache: "no-store" });
    if (r.status === 404) { setErr("bad"); return; }
    if (!r.ok) { setErr("generic"); return; }
    setErr(null); setData(await r.json());
  }, []);
  useEffect(() => { void refresh(); const id = setInterval(refresh, 60_000); return () => clearInterval(id); }, [refresh]);

  const trackOf = (id: string) => data?.tracks.find((x) => x.id === id);
  // DECIDED 2026-10-26 (사용자, 스크린숏: "뭔가 더 visually catchy 했으면"): 칸 카드는 트랙 색 그라데이션 위에 시간 칩, 팀, 트랙 점,
  // 그리고 파일 타일. 파일은 그 칸의 날까지(Day 2 칸은 Day 1, 2, Day 3 칸은 Day 1~3) 자리를 모두 두고, 올라온 것은 채운 타일(누르면 새 창),
  // 아직이면 점선 타일입니다. 색은 트랙 네 색과 보라(accent)만, 글자 크기는 BODY와 META 둘.
  // DECIDED 2026-10-26 (사용자: "12월 이벤트의 모든 부분을 새 UI/UX로"): kwan-design 문법으로. 카드는 card-base, 굵은 트랙 색 왼쪽 띠와
  // 트랙 그라데이션은 뺐습니다(UI Craft가 꼽는 색 띠 카드). 트랙은 시간 칩의 옅은 틴트와 점으로만, 올라온 파일은 블루(강조 하나) 타일.
  const fileLabel = (d: number) => t(d === 1 ? c.file1 : d === 2 ? c.file2 : c.file3);
  const tile = (d: number, url: string | undefined, tint: string) => url ? (
    <a key={d} href={url} target="_blank" rel="noreferrer"
      className="card-raised group flex min-h-[52px] items-center gap-[10px] rounded-xl px-[12px] py-[8px] transition-[transform,border-color] duration-150 hover:-translate-y-0.5 hover:border-accent/40">
      <span aria-hidden className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent/15 text-accent">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" /><path d="M14 3v5h5M9 13h6M9 17h4" /></svg>
      </span>
      <span className={`flex-1 ${META} font-semibold text-white`}>{fileLabel(d)}</span>
      <span aria-hidden className={`${META} text-naru-muted transition-[transform,color] group-hover:translate-x-0.5 group-hover:text-accent`}>↗</span>
    </a>
  ) : (
    <div key={d} className="card-sunken flex min-h-[52px] items-center gap-[10px] rounded-xl border-dashed px-[12px] py-[8px]">
      <span aria-hidden className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/[0.04] text-white/25">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" /><path d="M14 3v5h5" /></svg>
      </span>
      <span className={`flex-1 ${META} text-naru-muted`}>{fileLabel(d)}</span>
      <span className={`${META} text-naru-muted/70`}>{t(c.notYet)}</span>
    </div>
  );

  return (
    <div className="min-h-screen bg-naru-ink text-naru-text">
    <ToolHeader />
    <main id="main" className="px-4 pb-24 pt-[40px] sm:pt-[56px]">
      {/* DECIDED 2026-11-03 (사용자: "너무 비쥬얼적으로 뭐가 없다. 좀 더 크게크게"): 이름은 TITLE, 맡은 시간은 BODY로 크게. 표가 넓어 폭을 5xl로. */}
      <div className="mx-auto flex max-w-5xl flex-col gap-[40px]">
        <div className="flex flex-col gap-[10px]">
          <p className={`${META} font-semibold text-naru-muted`}>{t(c.title)}</p>
          <h1 className={`${TITLE} font-bold leading-[1.1] tracking-[-0.03em] text-white`}>{data ? mentorTitle(data.mentor.name, locale, data.mentor.nameEn) : t(c.title)}</h1>
          {data?.mentor.field && <p className={`${BODY} text-naru-muted`}>{data.mentor.field}</p>}
          {data && OPS_DAYS.map((d) => {
            const mine = data.slots?.[String(d)] ?? [];
            if (!mine.length) return null;
            const from = fmtKst(mine[0]), to = fmtKst(Date.parse(mine[mine.length - 1]) + HOUR);
            return (
              <p key={d} className={`flex flex-wrap items-baseline gap-x-[10px] ${BODY} text-white`}>
                <span className="text-naru-muted">{t(c.assigned)}</span>
                <span className="font-semibold">{t(c.day)} {d} <span className="tabular-nums">{dayDate(d).slice(5).replace("-", ".")}</span></span>
                <span className="font-semibold tabular-nums text-accent">{from}~{to}</span>
              </p>
            );
          })}
        </div>
        {err === "bad" && <p role="alert" className={`card-sunken rounded-xl px-[16px] py-[14px] ${BODY} text-white`}>{t(c.badLink)}</p>}
        {err === "generic" && <p role="alert" className={`${META} text-rose-300`}>{t(c.errGeneric)}</p>}

        {data && (
          <>
            {/* DECIDED 2026-11-05 (사용자: 출제사와 정리한 PDF는 멘토 페이지에서만): 멘토 열쇠로 받은 30분짜리 URL만 그립니다. 참가자 화면에는 이 묶음이 없습니다. */}
            <section aria-labelledby="mentor-briefs" className="flex flex-col gap-[12px]">
              <h2 id="mentor-briefs" className={`${SUBTITLE} font-bold tracking-[-0.02em] text-white`}>{t(c.briefsTitle)}</h2>
              <p className={`${META} leading-relaxed text-naru-muted`}>{t(c.briefsLead)}</p>
              {data.briefs?.length ? (
                <div className="grid gap-[8px] sm:grid-cols-2">
                  {data.briefs.map((b) => (
                    <a key={b.url} href={b.url} target="_blank" rel="noreferrer"
                      className="card-raised group flex min-h-[52px] items-center gap-[10px] rounded-xl px-[12px] py-[8px] transition-[transform,border-color] duration-150 hover:-translate-y-0.5 hover:border-accent/40">
                      <span aria-hidden className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent/15 text-accent">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" /><path d="M14 3v5h5M9 13h6M9 17h4" /></svg>
                      </span>
                      <span className={`flex-1 ${META} font-semibold text-white`}>{t(b.title)}</span>
                      <span aria-hidden className={`${META} text-naru-muted transition-[transform,color] group-hover:translate-x-0.5 group-hover:text-accent`}>↗</span>
                    </a>
                  ))}
                </div>
              ) : (
                <p className={`card-sunken rounded-xl border-dashed px-[14px] py-[12px] ${META} text-naru-muted`}>{t(c.briefsEmpty)}</p>
              )}
            </section>
            <p className={`${BODY} leading-relaxed text-naru-muted`}>{t(c.lead)} <span className={`${META} text-naru-muted/80`}>{t(c.refresh)}</span></p>
            {/* DECIDED 2026-11-08 (docs/booking-cutoff-brief.md C5): 표가 언제 굳는지 한 줄. 팀 쪽 마감(lib/crossingOps.ts slotClosed)과 같은 시각입니다. */}
            <p className={`${META} leading-relaxed text-white/85`}>{t(c.mentorCutoffLine)}</p>
            {/* DECIDED 2026-11-03 (사용자: "본인이 맡지 않는 날은 그냥 없애는 걸로"): 칸도 팀도 없는 날은 구획째 뺍니다. */}
            {!OPS_DAYS.some((d) => (data.slots?.[String(d)] ?? []).length || data.bookings.some((b) => b.day === d)) && <p className={`${META} text-naru-muted`}>{t(c.offDay)}</p>}
            {OPS_DAYS.map((d) => {
              const rows = data.bookings.filter((b) => b.day === d);
              const slots = data.slots?.[String(d)] ?? [];
              if (!slots.length && !rows.length) return null;
              return (
                <section key={d} aria-labelledby={`mentor-day-${d}`} className="flex flex-col gap-[12px]">
                  <h2 id={`mentor-day-${d}`} className={`flex items-baseline gap-[10px] ${SUBTITLE} font-bold tracking-[-0.02em] text-white`}>
                    <span>{t(c.day)} {d}</span> <span className={`${META} font-normal text-naru-muted`}>{dayDate(d).slice(5).replace("-", ".")}</span>
                    {slots.length > 0
                      ? <span className={`ml-auto ${META} font-semibold tabular-nums text-naru-muted`}>{t(c.slotCount).replace("{n}", String(slots.length)).replace("{b}", String(rows.length))}</span>
                      : rows.length > 0 && <span className={`ml-auto ${META} font-semibold tabular-nums text-naru-muted`}>{t(c.teamCount).replace("{n}", String(rows.length))}</span>}
                  </h2>
                  {/* DECIDED 2026-11-03 (사용자: "본인 파트만 보이지 말고, 다른 분들 파트도 보일 수 있게 for those assigned at the same date"):
                      그 날의 표 전체입니다. 학생 시간표(TeamTool)와 같은 모양으로 줄은 칸 시작 시각, 열은 그날 맡은 멘토.
                      내 열은 블루 테두리로 위에서 아래까지 감쌉니다(강조 블루는 이 열에만). 넣은 칸은 그 팀 트랙의 틴트에 팀 이름. */}
                  {(() => {
                    const board = data.board?.[String(d)] ?? [];
                    if (!board.length) return null;
                    const times = [...new Set(board.flatMap((m) => m.slots))].sort();
                    // 내 열의 테두리: 양옆은 모든 칸, 위는 머리, 아래는 마지막 줄. 그림자 클래스는 칸마다 하나만 씁니다(겹치면 하나가 지워짐).
                    // 2026-11-05 (docs/merge-paper-brief.md T4, D2): 내 칸 열은 남색 2px 테두리(운영진 문서의 "파란 테두리"와 맞춤).
                    const ME_SIDES = "bg-accent/[0.06] shadow-[inset_2px_0_0_rgb(18,36,107),inset_-2px_0_0_rgb(18,36,107)]";
                    const ME_TOP = "bg-accent/[0.06] shadow-[inset_2px_0_0_rgb(18,36,107),inset_-2px_0_0_rgb(18,36,107),inset_0_2px_0_rgb(18,36,107)]";
                    const ME_BOTTOM = "bg-accent/[0.06] shadow-[inset_2px_0_0_rgb(18,36,107),inset_-2px_0_0_rgb(18,36,107),inset_0_-2px_0_rgb(18,36,107)]";
                    return (
                      <div className="card-base overflow-x-auto rounded-2xl max-sm:[mask-image:linear-gradient(to_right,#000_calc(100%_-_32px),transparent)]">
                        <table className="w-full min-w-max border-collapse">
                          <thead>
                            <tr className="bg-naru-surface-2">
                              <th className={`sticky left-0 z-10 w-[84px] bg-naru-surface-2 px-[16px] py-[16px] text-left ${META} font-semibold text-naru-muted`}>{t(c.time)}</th>
                              {board.map((m, i) => (
                                <th key={i} className={`min-w-[160px] border-l border-white/5 px-[14px] py-[16px] text-left align-bottom ${m.me ? ME_TOP : ""}`}>
                                  {m.me && <span className={`mb-[4px] block ${META} font-semibold text-accent`}>{t(c.me)}</span>}
                                  <span className={`block ${BODY} font-bold ${m.me ? "text-white" : "text-white/85"}`}>{mentorTitle(m.name, locale, m.nameEn)}</span>
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {times.map((s, ri) => (
                              <tr key={s} className="border-t border-white/5">
                                <td className={`sticky left-0 z-10 bg-naru-surface px-[16px] py-[10px] ${BODY} font-semibold tabular-nums text-white/80`}>{fmtKst(s)}</td>
                                {board.map((m, i) => {
                                  const b = m.bookings.find((x) => Date.parse(x.startsAt) === Date.parse(s));
                                  const open = m.slots.includes(s);
                                  const last = ri === times.length - 1;
                                  const me = m.me ? (last ? ME_BOTTOM : ME_SIDES) : "";
                                  if (b) {
                                    const tint = trackTint(trackOf(b.track)?.color);
                                    return (
                                      <td key={i} className={`border-l border-white/5 p-[6px] ${me}`}>
                                        <div className="flex min-h-[64px] flex-col justify-center gap-[2px] rounded-lg px-[12px] py-[8px]"
                                          style={{ background: `${tint}1F`, boxShadow: `inset 4px 0 0 ${tint}` }}>
                                          <span className={`truncate ${BODY} font-bold text-white`}>{b.team}</span>
                                          <span className={`${META} tabular-nums text-white/75`}>{fmtKst(b.startsAt)}~{fmtKst(b.endsAt)}</span>
                                        </div>
                                      </td>
                                    );
                                  }
                                  if (!open) return <td key={i} className={`border-l border-white/5 bg-naru-ink/60 ${me}`} />;
                                  return (
                                    <td key={i} className={`border-l border-white/5 p-[6px] ${me}`}>
                                      <div className={`flex min-h-[64px] items-center rounded-lg px-[12px] ${META} ${m.me ? "border border-dashed border-accent/35 text-naru-muted" : "border border-dashed border-white/[0.07] text-white/30"}`}>{t(c.openSlot)}</div>
                                    </td>
                                  );
                                })}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    );
                  })()}
                  {!rows.length && <p className={`${META} text-naru-muted`}>{t(c.empty)}</p>}
                  {rows.map((b) => {
                    const tint = trackTint(trackOf(b.track)?.color);
                    const tr = trackOf(b.track);
                    return (
                      <div key={b.id} className="card-base flex flex-col gap-[16px] rounded-2xl p-[20px] sm:flex-row sm:items-center sm:gap-[24px] sm:p-[24px]">
                        <div className="flex shrink-0 flex-col gap-[8px] sm:w-[11rem]">
                          <span className={`w-fit rounded-md px-[8px] py-[3px] ${META} font-semibold tabular-nums text-white`} style={{ background: `${tint}2E` }}>
                            {fmtKst(b.startsAt)}~{fmtKst(b.endsAt)}
                          </span>
                          <span className={`${BODY} font-bold text-white`}>{b.team}</span>
                          {tr && <span className={`flex items-center gap-[6px] ${META} text-naru-muted`}><span aria-hidden className="h-2 w-2 rounded-full" style={{ background: tint }} />{t(tr.label)}</span>}
                        </div>
                        <div className="grid flex-1 gap-[8px]">
                          {Array.from({ length: b.day }, (_, i) => i + 1).map((fd) => tile(fd, b.files.find((f) => f.day === fd)?.url, tint))}
                        </div>
                      </div>
                    );
                  })}
                </section>
              );
            })}
            {/* DECIDED 2026-11-07 (사용자: "비슷한 내용대로 맨토 페이지도 update, 현업의 감각이라고 했을때 나의 의도를 맨토들에게 전달"):
                멘토링 안내 PDF 2장과 같은 말. 시간표가 먼저라 맨 아래에 둡니다. 카드는 /crossing 멘토 모달과 같은 모양. */}
            <section aria-labelledby="mentor-guide" className="flex flex-col gap-[14px] border-t border-white/10 pt-[32px]">
              <h2 id="mentor-guide" className={`${SUBTITLE} font-bold tracking-[-0.02em] text-white`}>{t(c.guideTitle)}</h2>
              <p className={`break-keep ${BODY} leading-relaxed text-white/85`}>{t(c.guideLead)}</p>
              <div className="card-raised flex flex-col gap-[6px] rounded-xl px-[18px] py-[16px]">
                <p className={`${META} font-bold text-accent`}>{t(c.senseLabel)}</p>
                <p className={`break-keep ${META} leading-[1.7] text-white/85`}>{t(c.senseBody)}</p>
              </div>
              <p className={`mt-[6px] ${META} font-bold text-white/85`}>{t(c.guideCardsLabel)}</p>
              <ol className="grid gap-[10px] sm:grid-cols-2">
                {c.guideCards.map((x, j) => (
                  <li key={j} className="card-sunken flex flex-col gap-[6px] rounded-xl px-[16px] py-[14px]">
                    <p className={`flex items-baseline gap-[8px] ${BODY} font-bold leading-snug text-white`}>
                      <span className={`${META} font-bold tabular-nums text-accent`}>{j + 1}</span>{t(x.title)}
                    </p>
                    <p className={`break-keep ${META} font-semibold leading-[1.5] text-accent`}>{t(x.quote)}</p>
                    <p className={`break-keep ${META} leading-[1.6] text-naru-muted`}>{t(x.body)}</p>
                  </li>
                ))}
              </ol>
              <p className={`break-keep ${META} leading-[1.7] text-naru-muted`}><span className="font-bold text-white/85">{t(c.noJudgeLabel)}</span>{"  "}{t(c.noJudge)}</p>
            </section>
          </>
        )}
      </div>
    </main>
    </div>
  );
}

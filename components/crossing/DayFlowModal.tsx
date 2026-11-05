"use client";

// DECIDED 2026-11-05 (사용자, 스크린숏: "이런식으로 싫음. 클릭하면 보이는 식으로 like 8월 처럼"): docs/day-flow-brief.md 안 B.
// /crossing Day 카드의 "하루의 흐름 →"을 누르면 그날의 줄이 이 모달에 열립니다. 껍데기(포털, 배경, 포커스 가둠, 뒤 화면 inert,
// 스크롤 잠금, 폰에서는 아래에서 올라오는 시트)는 8월 DayModal(components/journey/Journey.tsx)과 같고, 줄 목록은 8월 RunOfShow의
// 모양(폰은 시각을 위에, sm부터 시각 칸 + 무엇)입니다. 필참은 ★ 하나(D7). 시각이 정해지지 않은 줄은 시각을 그리지 않습니다(D2).
// 같은 날 앞선 카드 안 접는 띠(안 A)는 이 모달이 대신합니다.

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useBodyScrollLock } from "@/lib/useBodyScrollLock";
import { META, BODY, ROW_HEADING } from "@/components/ui/typography";

export type DayFlowRow = { time?: string; what: string; where?: string; must?: boolean };
export type DayFlowContent = { dayLabel: string; date: string; title: string; lead: string; rows: DayFlowRow[] };

const FOCUSABLE = 'a[href],button:not([disabled]),input,select,textarea,[tabindex]:not([tabindex="-1"])';

export default function DayFlowModal({
  day,
  onClose,
  heading,
  mustLabel,
  closeLabel,
}: {
  day: DayFlowContent | null;
  onClose: () => void;
  heading: string;
  mustLabel: string;
  closeLabel: string;
}) {
  const reduce = useReducedMotion();
  const closeRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const open = day != null;
  useBodyScrollLock(open);

  useEffect(() => {
    if (!open) return;
    const opener = document.activeElement as HTMLElement | null;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") return onCloseRef.current();
      if (e.key === "Tab" && dialogRef.current) {
        const nodes = Array.from(dialogRef.current.querySelectorAll<HTMLElement>(FOCUSABLE));
        if (nodes.length === 0) return e.preventDefault();
        const first = nodes[0];
        const last = nodes[nodes.length - 1];
        const active = document.activeElement;
        if (e.shiftKey && (active === first || !dialogRef.current.contains(active))) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && (active === last || !dialogRef.current.contains(active))) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    const inerted = Array.from(document.querySelectorAll<HTMLElement>("header, main, footer"));
    inerted.forEach((el) => el.setAttribute("inert", ""));
    const id = window.setTimeout(() => closeRef.current?.focus(), 50);
    return () => {
      document.removeEventListener("keydown", onKey);
      inerted.forEach((el) => el.removeAttribute("inert"));
      window.clearTimeout(id);
      opener?.focus?.();
    };
  }, [open]);

  if (!mounted) return null;
  const hasMust = day?.rows.some((r) => r.must);

  return createPortal(
    <AnimatePresence>
      {day && (
        <motion.div
          className="fixed inset-0 z-[55] flex items-end justify-center sm:items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduce ? 0 : 0.2 }}
        >
          <div aria-hidden onClick={onClose} className="absolute inset-0 cursor-default touch-none bg-black/50" />
          <motion.div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="day-flow-title"
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 40, scale: 0.985 }}
            animate={reduce ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: 24, scale: 0.985 }}
            transition={{ duration: reduce ? 0 : 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10 flex max-h-[88dvh] w-full max-w-[640px] flex-col overflow-hidden rounded-t-3xl border border-white/15 bg-naru-surface shadow-2xl sm:rounded-3xl"
          >
            <button
              ref={closeRef}
              type="button"
              onClick={onClose}
              aria-label={closeLabel}
              className="absolute right-5 top-5 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white/70 transition hover:bg-white/10 hover:text-white active:scale-95"
            >
              <svg aria-hidden width="16" height="16" viewBox="0 0 15 15" fill="none">
                <path d="M1 1l13 13M14 1L1 14" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
              </svg>
            </button>
            <div className="overflow-y-auto overscroll-contain px-6 pt-7 pb-[max(1.75rem,env(safe-area-inset-bottom))] text-left sm:px-8 sm:py-8">
              <p className={`flex flex-wrap items-baseline gap-x-2.5 pr-12 ${META}`}>
                <span lang="en" className="font-bold text-accent">{day.dayLabel}</span>
                <span className="text-caption">{day.date}</span>
              </p>
              <h3 id="day-flow-title" className={`mt-2 ${ROW_HEADING}`}>{day.title}</h3>
              <p className={`mt-2 break-keep ${BODY} leading-[1.65] text-white/85`}>{day.lead}</p>
              <div className="mt-6 rounded-2xl card-base p-4 sm:p-5">
                <p className={`flex items-baseline justify-between gap-3 ${META} font-bold text-accent`}>
                  <span>{heading}</span>
                  {hasMust && <span className="font-semibold text-caption">{mustLabel}</span>}
                </p>
                <ol className="mt-3">
                  {day.rows.map((r, j) => (
                    <li key={j} className="flex flex-col gap-1 border-t border-white/10 px-1.5 py-2.5 first:border-t-0 sm:flex-row sm:gap-3">
                      {r.time ? (
                        <span className={`shrink-0 pt-[1px] ${META} font-semibold tabular-nums text-white/85 sm:w-[6.5rem]`}>{r.time}</span>
                      ) : (
                        <span aria-hidden className="hidden shrink-0 sm:block sm:w-[6.5rem]" />
                      )}
                      <span className="min-w-0 flex-1">
                        <span className={`block break-keep ${META} font-semibold leading-snug text-white/85`}>
                          {r.must && <span aria-hidden className="mr-1">★</span>}
                          {r.must && <span className="sr-only">{mustLabel}: </span>}
                          {r.what}
                        </span>
                        {r.where && <span className={`mt-1 block break-keep ${META} leading-[1.6] text-caption`}>{r.where}</span>}
                      </span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}

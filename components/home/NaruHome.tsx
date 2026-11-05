"use client";

import Image from "next/image";
import Link from "next/link";
import { track } from "@vercel/analytics";
import { useLocale } from "@/lib/LocaleContext";
import { naru, naruLinks, openChatLabels, register as registerCopy, registerNoteShort, registerNoteOpen, decemberPartners, type RecordPhoto } from "@/data/naru";
import { useCrossingRegisterOptional } from "@/components/crossing/RegisterProvider";
import { type Phrase } from "@/data/dictionaryCore";
import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  DECEMBER_EVENT_NAME,
  decemberEventLabel,
  formatDecemberDateLine,
  formatDecemberDayWithWeekday,
} from "@/lib/naruDates";
import { buttonClass, ARROW_CLASS } from "@/components/ui/Button";
import { TIMETABLE_OPEN } from "@/lib/crossingOps";
import { VOTE_BUTTON_OPEN } from "@/lib/crossingVote";
import PhotoLightbox, { warmPhoto } from "@/components/shared/PhotoLightbox";
import DayFlowModal from "@/components/crossing/DayFlowModal";
import MobileChatBar from "@/components/shared/MobileChatBar";
import Chapter from "@/components/journey/Chapter";
import Reveal from "@/components/shared/Reveal";
import Eyebrow from "@/components/ui/Eyebrow";
import OpenChatLink from "@/components/ui/OpenChatLink";
// RecordTabs: 2026-09-17에 뺐다가(사용자: 바로 아카이브로) 2026-09-18 감사 반영 브리프 5.2로
// 다시 넣었습니다. 멘토 / 연사와 피드백 패널 둘만.
// (2026-09-19: RecordTabs·PressRows·Funnel은 화면에서 내려가 import도 뺐습니다. 파일은 그대로.)
import { TITLE, SUBTITLE, BODY, META, H2, ROW_HEADING } from "@/components/ui/typography";
import SeoulCampuses from "@/components/home/SeoulCampuses";
import {
  READ, WIDE, HERO_BUTTON_GROUND,
  latinTrack, eyebrowTrack, PlateSegment, SiteFooter, usePlateLite, PreparingButton,
} from "./shared";

// ─────────────────────────────────────────────────────────────────────────────
// 나루 홈 (/).
//
// DECIDED 2026-09-17 (2차): 이벤트와 그룹을 나눕니다.
//
// 사용자의 지시: "이벤트와 그룹 설명은 분리. 맨 아래에 그룹 로고와 존재 목적,
// 그 위에는 8월 이벤트 recap과 12월 이벤트 설명. 12월은 8월 사이트와 같은
// 격식으로(빌더톤_2회차_기획.pdf)."
//
//   #top       크로싱 서울 히어로 (이름, 기간, 도시, 포지션, 오픈채팅)
//   #record    8월의 기록 (숫자 다섯, 사진 열둘)
//   #december  프로그램 (모양, 왜 서울인가, 아쉬웠던 넷과 답, 일정, 멘토링, 미정)
//   #naru      나루 (로고, 태그라인, 변하지 않는 두 개, 어떻게 일하는가)   ← 그룹은 여기서 시작
//   #join      왜 이 자리가 필요한가 (세 곳의 결핍, 안전장치 둘, 들어오는 길 #join-ways)
//   #people    (조건부)
//
// 아래 2026-09-15 주석의 "홈은 이벤트가 아니라 그룹"은 이제 반만 맞습니다.
// 홈은 이벤트로 열고 그룹으로 닫습니다. 그래도 그 주석을 지우지 않은 이유는
// 1~4번(등록 없음, 2회차 아님, 다리 은유 없음)이 여전히 유효하기 때문입니다.
// 3번(12월 상세 없음)만 뒤집혔습니다: 기획이 나와서 초안 표시를 달고 싣습니다.
//
// DECIDED 2026-09-15: 홈은 이벤트가 아니라 그룹입니다.
//
// 8월까지 이 자리에는 제로백 빌더톤이 있었습니다. 그건 나루가 학생회와
// 기업을 잇는 "지금의 방식"이고, 방식은 바뀝니다(매니페스토 IV). 홈이 회차
// 하나이면, 그 회차가 끝나는 날 홈도 같이 끝납니다. 8월 페이지는 /2026-08로
// 내려가 기록으로 남았고, 이 자리는 나루가 무엇이고 왜 존재하는지를 말합니다.
//
// ── 이 페이지에 없는 것 셋, 그리고 그 이유 ─────────────────────────────────
//
// 1. 등록이 없습니다.
//    12월 이벤트의 등록은 아직 열리지 않았고, 나루는 가입 폼 자체를 두지
//    않습니다(Overview 06). 들어오는 길은 회차 하나예요. 그래서 이 파일은
//    RegisterProvider를 쓰지 않고, 홈의 CTA는 셋뿐입니다: 회차 알아보기,
//    소식 받기(오픈채팅), 문의(메일). 8월 페이지가 마감 뒤에 배운 것을 그대로
//    따릅니다. 누를 수 없는 버튼을 회색으로 남기지 않습니다.
//
// 2. 12월을 "제로백 빌더톤 2회차"라고 부르지 않습니다.
//    제로백 빌더톤은 2026년 8월 싱가포르에서 한 이벤트의 이름입니다. 12월은
//    그 이벤트에서 나온 코어 2개를 잇는 다른 이벤트이고, 이름이 아직 없어요.
//    속편으로 부르면 12월에 오는 사람은 8월을 모르면 늦었다고 느끼고, 기업은
//    같은 문제를 또 여는 자리로 읽습니다. 둘 다 사실이 아닙니다.
//    #december 챕터의 첫 문장이 그 오해를 먼저 끊는 이유입니다. 이름은
//    lib/naruDates.ts의 DECEMBER_EVENT_NAME에서만 옵니다.
//
// 3. 12월 상세가 없습니다.
//    장소, 일정표, 출제사, 멘토, 등록 마감은 11월까지 확정됩니다. 지금 여기에
//    쓰면 전부 다시 고쳐야 하고, 참가자는 고치기 전의 문장을 보고 항공권을
//    끊습니다. 홈은 확정된 사실만 싣고, 상세는 확정된 뒤 /seoul로 붙입니다.
//    이 페이지의 12월 챕터가 말하는 것은 날짜 하나, 달라지는 것 둘, 그리고
//    이벤트가 끝난 뒤에 할 일 셋입니다.
//
// 4. 다리(bridge) 은유가 없습니다.
//    8월 사이트의 "우리가 있었으면 했던 다리를 직접 만듭니다"는 아카이브에
//    그대로 있습니다. 여기서는 나루터만 씁니다. 다리는 건너는 일을 대신해
//    주지만, 나루는 그러지 않아요. 건너는 건 각자가 합니다.
//
// ── DECIDED 2026-09-16: 코어만 남깁니다 ─────────────────────────────────────
// 글이 너무 많았습니다. 이 페이지를 처음 여는 사람이 나루가 무엇인지 알기까지
// 문단 서른 개를 읽어야 했고, 그건 열린 페이지가 아니라 잘 쓴 문서입니다.
//
// 규칙 하나로 걷었습니다: 챕터마다 그 챕터가 아니면 말할 수 없는 것 하나만
// 남기고 나머지는 근거가 있는 곳으로 보냅니다.
//
//  · #record 8월을 설명하지 않습니다. 숫자 다섯과 사진 열둘, 그리고 /2026-08로
//    가는 버튼 하나. 형식·멘토·연사 탭(RecordTabs)과 아쉬웠던 네 가지는
//    내려갔습니다. 전자는 8월 페이지에 정본이 있고, 후자는 12월의 근거라
//    그쪽에서 "모양"으로 다시 나타납니다.
//  · #why 코어 카드가 두 줄에서 한 줄로. 두 번째 줄은 첫 줄의 부연이었습니다.
//  · #how "이름의 두 겹" 두 문단이 내려갔습니다. 로고 가이드에 있습니다.
//  · #december 문단 여덟 개 → 숫자 여섯 + 스테이지 다섯(data/naru.ts의 shape,
//    stages). 12월 기획 초안의 엑기스입니다.
//  · #join 카드마다 두 줄에서 한 줄로.
//
// 키는 하나도 지우지 않았습니다. 화면에서만 내려온 것이라, 되살릴 때
// data/naru.ts에서 그대로 꺼내 쓰면 됩니다.
//
// ── 재사용 ───────────────────────────────────────────────────────────────────
// Chapter, Eyebrow, OpenChatLink, BackgroundMount, JourneyNav를 8월 페이지와
// 함께 씁니다. 두 페이지가 한 사이트로 읽혀야 하고, 같은 일을 하는 컴포넌트가
// 둘이 되면 한쪽만 고쳐지기 시작합니다.
// ─────────────────────────────────────────────────────────────────────────────

// 챕터 <h2>의 크기. 8월 페이지가 아홉 개의 h2에 쓰는 값과 같습니다
// (Journey.tsx의 CHAPTER HEADING SIZE 주석). 두 페이지의 제목이 같은 크기로
// 읽혀야 한 사이트입니다.
// 제목 스케일은 components/ui/typography.ts가 갖습니다. RecordTabs가 같은 값을
// 읽어야 하는데 이 파일이 그쪽을 import 하고 있어서, 여기 두면 순환이 됩니다.

// ─────────────────────────────────────────────────────────────────────────────
// 세로 리듬. 이 페이지의 모든 간격은 여기 있는 값 중 하나여야 합니다.
//
// DECIDED 2026-09-16. 그 전에는 블록 간격에 mt-4·5·6·7·10·12·14·16·24·32 열
// 가지가 쓰이고 있었습니다. 하는 일은 셋뿐인데요. 챕터 이음매도 162px과 171px이
// 나란히 있었는데, 9px 차이는 아무도 알아보지 못하면서 "여기는 다르다"고
// 주장만 합니다. 뜻이 없는 차이는 리듬을 만들지 않고 리듬을 지웁니다.
//
// root가 18px이라 Tailwind 한 칸은 4.5px입니다.
//
// ── 챕터 이음매 (Chapter의 기본 py-24 = 108px 위에 얹습니다) ────────────────
//   (오버라이드 없음)              216px  기본. 다음 이야기로 넘어갑니다.
//   pt-20 sm:pt-28 lg:pt-36      270px  장이 바뀝니다. #naru 하나뿐(이벤트 → 그룹).
//   pt-24 sm:pt-32 lg:pt-44      306px  (2026-09-17 2차: 비어 있습니다. #why가
//                                       #naru 안으로 들어가면서 결론 이음매가
//                                       270px 자리와 합쳐졌습니다. 필요하면 씁니다.)
//
// 세 단계 말고 네 번째를 만들지 마세요. 이음매의 크기가 뜻을 나르려면 서로
// 명백히 달라야 하고, 세 개가 그 조건을 만족하는 최대입니다.
//
// ── 챕터 안 (Chapter의 직계 자식) ──────────────────────────────────────────
//   mt-4    18px  바로 위 블록에 딸린 주석 한 줄. 붙어 있어야 뜻이 통합니다.
//   mt-6    27px  제목 → 리드 문장. 그리고 앞 블록에 붙는 띠.
//   mt-12   54px  블록 → 블록. 기본값입니다. 의심스러우면 이것.
//   mt-24 sm:mt-32  108/144px  부속으로 강등. #why의 exec 하나뿐.
//
// 카드나 다이어그램 **안쪽**의 간격은 이 스케일을 따르지 않아도 됩니다. 저긴
// 한 덩어리의 내부 조판이고, 여기 있는 값은 덩어리와 덩어리 사이의 것입니다.
// ─────────────────────────────────────────────────────────────────────────────

// ─────────────────────────────────────────────────────────────────────────────
// 카운트다운 패널. 8월 히어로 오른쪽 단의 Glass 패널 문법 (2026-09-17).
//
// 숫자는 마운트 뒤에만 채웁니다. 서버는 시각을 모르고(홈은 정적), 첫 페인트에
// 서버 시각을 박으면 클라이언트에서 다시 계산할 때 숫자가 바뀌며 화면이 튑니다.
// 패널의 높이는 숫자가 있든 없든 같습니다(빈 자리에 "--"). 8월이 겪은 하이드레이션
// 밀림(app/2026-08/page.tsx 상단 주석)을 그대로 물려받지 않으려는 것입니다.
// 0이 되면 "시작했습니다". 아래 미정 칩 셋은 tbd 목록의 앞 둘과 마지막(등록이
// 열리는 날)입니다. 나머지는 프로그램 챕터의 목록이 갖습니다.
// ─────────────────────────────────────────────────────────────────────────────
// 도시 스위치를 눌러 실제 값이 달라진 칸만 한 번 위아래로 교체합니다.


// ─────────────────────────────────────────────────────────────────────────────
// #gains의 노선(DECIDED 2026-10-19, 사용자, 스크린숏: "너무 평면적으로 보여주는거 같고, visually 의미 있게
// 다가오지 않음", 이어서 "노선하나를 5개가 공유를 하면 좋을거 같은데"). 다섯 카드가 같은 모양의 글 상자라 무엇이 언제
// 오는지가 보이지 않았습니다. 노선도와 같은 그림으로 Day 0~4 노선을 판 맨 위에 한 번 긋고, 다섯 행이 그 칸 위에 막대를 긋습니다.
// 날짜는 data/naru.ts gains.items[].days. 글자는 META 하나라 화면의 크기 셋을 넘지 않습니다.
// 근거: brand 5장 "추상적인 문장 옆에는 구체적인 한 줄", brand 7장 닷새.
// ─────────────────────────────────────────────────────────────────────────────
// DECIDED 2026-10-19 (사용자: 노선 하나를 같이 쓰는 생각은 좋지만 "initial version 진짜 이상함", 디자인 서브에이전트 셋의 검토):
// 첫 판은 막대 끝의 큰 점이 노선보다 무거워 스위치 다섯 개처럼 읽혔고, 막대가 행 가운데에 떠 글과 멀었고, 날 이름이 없었고,
// 폰에서는 머리가 스크롤로 사라졌습니다. 이제 머리와 다섯 행이 같은 칸 틀(GAIN_COLS) 하나를 씁니다: 왼쪽 글 칸 + 날 다섯 칸.
// 머리는 "Day N / 날 이름"과 정거장, Day 4 정거장에만 주황 점(도착, 성과 공유회). 막대는 점 없는 얇은 띠이고 제목 줄 높이에 섭니다.
// split인 행(04)은 날마다 끊어 그립니다.
// DECIDED 2026-10-23 (사용자: "와서 얻는 것 at 12월 이벤트 디자인만 맞추어줘", 데스크톱이 기준): 폰도 데스크톱과 같은 그림입니다.
// 판 맨 위에 Day 0~4 머리(이름과 정거장) 하나, 날마다의 옅은 세로 띠, 행마다 같은 다섯 칸 위의 막대. 그 전의 폰 전용
// 행마다 0~4 작은 노선(GainStrip)은 뺐습니다. 폰은 글 칸이 없어 다섯 칸이 판 너비를 다 쓰고(grid-cols-5), 글은 그 위에 가운데,
// 막대는 글 아래 섭니다. sm부터는 전과 같이 왼쪽 글 칸 + 다섯 칸.
// DECIDED 2026-10-24 (밀도 브리프 1.3, D1): lg에서 막대 격자는 날마다 3rem(54px, META 네 글자 "확인받기"의 폭)으로 좁히고 글 칸이 나머지를 씁니다.
// 브리프의 30%는 날 이름이 META로 들어가는 최소 폭이라 39%(270/688px)에서 멈췄습니다. 표는 유지(D1).
// DECIDED 2026-10-25 (사용자: 줄 수를 같게): 날 칸을 4.5rem으로. "컨텍스트 열기"가 한 줄로 들고 옆 "찾기"와 붙지 않습니다.
// 같은 날 뒤(사용자, 스크린숏: "이부분이 짧은거 같음"): 날 칸을 최대 8rem까지 넓힙니다. 제목 칸은 18rem(가장 긴 "이슈를 낸 기업의 질문")을 지키고 남는 폭을 씁니다.
const GAIN_COLS = "grid-cols-5 sm:grid-cols-[minmax(0,18rem)_repeat(5,minmax(0,1fr))] lg:grid-cols-[minmax(18rem,1fr)_repeat(5,minmax(4.5rem,8rem))]";
// DECIDED 2026-10-20 (사용자, hwang 브리프 3.6, 감사 W2): 막대의 그라데이션을 accent 단색으로.
// 2026-10-26: 날 막대는 7:3 블루 그라데이션. DECIDED 2026-11-04 (site-tells A4): 단색(globals.css .bg-cta).
const GAIN_BAR = "h-2 rounded-full bg-cta";

/** 머리: 왼쪽에 "닷새"(sm부터), 날마다 번호와 이름과 정거장. */
function GainRouteHead({ label, names }: { label: string; names: string[] }) {
  return (
    <div className={`grid ${GAIN_COLS}`}>
      <p className={`hidden self-end pr-6 ${META} font-bold text-accent sm:block`}>{label}</p>
      {[0, 1, 2, 3, 4].map((d) => (
        <div key={d} className="flex flex-col items-center text-center">
          <span className={`${META} font-bold tabular-nums text-white/85`}>Day {d}</span>
          {/* DECIDED 2026-10-25 (사용자: "각 파트마다 서로 줄 숫자가 똑같이"): 다섯 이름 모두 한 줄. 칸(lg 3rem)보다 긴 "컨텍스트 열기",
              "Context Open"은 꺾지 않고 칸 가운데에서 양옆으로 조금 넘칩니다(w-max). 그 전: lg:max-w-[4rem]로 두 줄. */}
          <span className={`${META} w-max whitespace-nowrap text-caption`}>{names[d]}</span>
          {/* mt-auto: 이름이 두 줄로 접히는 칸(폰의 "컨텍스트 열기")에서도 정거장 다섯이 한 선에 섭니다. */}
          <div className="relative mt-auto h-3 w-full pt-2.5 box-content">
            <div className={`absolute top-1/2 h-px -translate-y-1/2 bg-white/25 ${d === 0 ? "left-1/2 right-0" : d === 4 ? "left-0 right-1/2" : "inset-x-0"}`} />
            <span className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full ${d === 4 ? "h-3 w-3 bg-[#EE8A4F]" : "h-2.5 w-2.5 border border-white/50 bg-naru-surface"}`} />
          </div>
        </div>
      ))}
    </div>
  );
}

/** 한 행의 막대들. 이어진 날은 한 띠, split이면 날마다 한 칸. sm부터는 제목 줄(28px, 2026-11-04 전에는 번호 배지의 높이)의 가운데에 섭니다.
 *  폰에서는 글 아래 자기 다섯 칸 격자(grid-cols-5) 안에 같은 막대를 긋습니다. 두 폭이 칸 하나씩 다릅니다(sm은 글 칸이 1열). */
function GainBars({ days, split }: { days: number[]; split?: boolean }) {
  const lo = Math.min(...days);
  const hi = Math.max(...days);
  const spans = split ? days.map((d) => [d, d]) : [[lo, hi]];
  return (
    <>
      {spans.map(([a, b]) => (
        <div key={a} aria-hidden className="mt-2.5 hidden px-2 sm:block" style={{ gridColumn: `${a + 2} / span ${b - a + 1}`, gridRow: 1 }}>
          <div className={GAIN_BAR} />
        </div>
      ))}
      {/* 2026-11-05 (폰 점검: 라벨 없는 막대가 진행 막대처럼 읽힘): 폰은 막대 대신 날을 글자로. */}
      <p className={`mt-[10px] ${META} font-semibold text-accent sm:hidden`}>
        {spans.map(([a, b]) => (a === b ? `Day ${a}` : `Day ${a}–${b}`)).join(", ")}
      </p>
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 히어로 사진 넷 (DECIDED 2026-09-17, 사용자). 오른쪽 단(폰은 카피 아래)에 8월 행사
// 사진을 2×2로. 형상 무대(싱가포르·서울 점)는 이날 걷었습니다. 사진은 전부 4:3이라
// 칸도 4:3, fill + cover가 실제로는 아무것도 자르지 않습니다(PhotoWall과 같음).
// 오른쪽 열을 조금 내려(lg:mt-10) 한 덩어리로 읽히게 합니다.
// ─────────────────────────────────────────────────────────────────────────────
// 2026-09-18 (감사 반영 브리프 1.3): 사진 묶음 아래 한 줄 캡션("제로백 빌더톤 · 2026.08 싱가포르").
// 캡션이 없으면 12월 사진으로 읽혔습니다. 데스크톱은 호버 시 각 사진 하단에 "Day 1" 캡션이
// 올라옵니다(photos[].day). 폰은 정적 한 줄만. sizes는 실측 렌더 폭(폰 45vw, 데스크톱 약
// 280px)에 맞춰 dpr 3 기기에서 흐리지 않게(브리프 9.3). src가 없는 사진은 그리지 않습니다.
function HeroPhotos({ photos, t, className = "", desktopOnly = false, single = false }: {
  photos: RecordPhoto[];
  t: (p: Phrase) => string;
  className?: string;
  /**
   * 이 묶음이 `hidden lg:block` 안에 있는가 (2026-09-19, 접근성 감사 22).
   * 그러면 폰은 이것을 그리지 않으므로 priority를 걸지 않습니다. 전에는 같은
   * 사진 넷이 DOM에 두 번 있고 양쪽 다 priority여서, 폰이 보지도 않을 이미지
   * 둘을 preload 했습니다. 폰용 묶음(className으로 오는 쪽)이 priority를 맡습니다.
   */
  desktopOnly?: boolean;
  /** 2026-11-04 (site-tells 목업): 사진 한 장을 단 폭 전체로. */
  single?: boolean;
}) {
  const shown = photos.filter((p) => !!p.src).slice(0, 4);
  // DECIDED 2026-10-11 (사용자, 스크린숏: "이거 클릭하면 더 큰 이미지로 볼 수 있도록"): 칸은 누르는 것이고, 누르면 그 사진이 크게 열립니다.
  const [openPhoto, setOpenPhoto] = useState<number | null>(null);
  // 2026-10-19: 칸에 이미 받아 둔 작은 판의 주소. 큰 사진이 오는 동안 상자에 늘려 보여 줍니다(PhotoLightbox의 thumb).
  const [thumbs, setThumbs] = useState<Record<string, string>>({});
  // DECIDED 2026-11-04 (사용자, 미리 보기 스크린숏: "main에 있는 사진 여러 장, 한 장씩 넘길 수 있게"): single이면 사진 칸 하나에 넷을 가로로 붙여
  // 한 장씩 넘깁니다. 화살표 버튼, 손가락 밀기(스크롤 스냅), 캡션 옆의 "1 / 4". 페이지 스와이프는 이 칸에서 듣지 않습니다(data-no-page-swipe).
  const photoTrack = useRef<HTMLDivElement | null>(null);
  const [cur, setCur] = useState(0);
  // 2026-11-05 (사이트 점검, 접근성): 화살표로 넘길 때만 읽어 주는 문장. 손으로 밀 때는 읽지 않습니다.
  const [announce, setAnnounce] = useState("");
  const go = (i: number) => {
    const el = photoTrack.current;
    if (!el) return;
    const next = Math.max(0, Math.min(shown.length - 1, i));
    if (next !== cur) setAnnounce(`${next + 1} / ${shown.length}: ${t(shown[next].alt)}`);
    el.scrollTo({ left: next * el.clientWidth, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
  };
  if (shown.length === 0) return null;
  return (
    <figure className={className}>
      {/* DECIDED 2026-11-05 (사이트 점검, 접근성): 캐러셀임을 알리는 region. 지금 보이지 않는 사진은 Tab에서 빠지고, 끝의 화살표는 숨지 않고 흐려져 포커스가 남습니다. */}
      <div className={single ? "relative" : ""} {...(single ? { role: "region", "aria-roledescription": "carousel", "aria-label": t(naru.eventHero.photosCaption) } : {})}>
      <div
        ref={single ? photoTrack : undefined}
        {...(single ? { "data-no-page-swipe": "" } : {})}
        onScroll={single ? (e) => { const el = e.currentTarget; const n = Math.round(el.scrollLeft / Math.max(1, el.clientWidth)); setCur((v) => (v === n ? v : n)); } : undefined}
        className={single ? "flex snap-x snap-mandatory overflow-x-auto overscroll-x-contain rounded-2xl [scrollbar-width:none] [&::-webkit-scrollbar]:hidden" : "grid grid-cols-2 gap-3 sm:gap-4"}
      >
        {shown.map((photo, i) => (
          <button
            key={photo.src}
            type="button"
            aria-haspopup="dialog"
            title={t(naru.eventHero.photoOpen)}
            onPointerEnter={() => warmPhoto(photo.src)}
            onTouchStart={() => warmPhoto(photo.src)}
            onFocus={() => warmPhoto(photo.src)}
            onClick={(e) => {
              const imgs = e.currentTarget.parentElement?.querySelectorAll("img") ?? [];
              const next: Record<string, string> = {};
              imgs.forEach((img, k) => { if (img.currentSrc && shown[k]) next[shown[k].src] = img.currentSrc; });
              setThumbs(next);
              setOpenPhoto(i);
            }}
            tabIndex={single && i !== cur ? -1 : undefined}
            aria-hidden={single && i !== cur ? true : undefined}
            className={`group relative block aspect-[4/3] w-full cursor-zoom-in overflow-hidden ${single ? "shrink-0 snap-center" : "rounded-2xl ring-1 ring-white/5 transition-shadow hover:ring-white/20"}`}
          >
            <Image src={photo.src} alt={t(photo.alt)} fill sizes={single ? "(max-width: 1023px) 100vw, 560px" : "(max-width: 1023px) 45vw, 280px"} priority={!desktopOnly && i < (single ? 1 : 2)} className="object-cover object-center" />
            {photo.day && (
              <span
                aria-hidden
                className={`pointer-events-none absolute inset-x-0 bottom-0 hidden translate-y-full bg-black/70 px-3 py-2 ${META} font-bold text-[#fff] transition-transform duration-300 group-hover:translate-y-0 motion-reduce:transition-none lg:block`}
              >
                {/* 2026-11-05 (사이트 점검, UX): 12월 일정(Day 0~4)과 섞이지 않게 8월임을 붙입니다. */}
                {`${t({ ko: "8월", en: "Aug" })} ${t(photo.day)}`}
              </span>
            )}
          </button>
        ))}
      </div>
      {single && shown.length > 1 && (
        <>
          {(["prev", "next"] as const).map((dir) => {
            const off = dir === "prev" ? cur === 0 : cur === shown.length - 1;
            return (
              <button
                key={dir}
                type="button"
                onClick={() => { if (!off) go(cur + (dir === "prev" ? -1 : 1)); }}
                aria-disabled={off || undefined}
                aria-label={t(dir === "prev" ? naru.eventHero.photoPrev : naru.eventHero.photoNext)}
                className={`absolute top-1/2 ${dir === "prev" ? "left-3" : "right-3"} flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-[#E3E0D8] bg-[#FFFFFF] text-naru-navy shadow-[0_1px_4px_rgba(20,20,24,0.18)] transition hover:bg-[#FCFBF8] aria-disabled:cursor-default aria-disabled:opacity-40`}
              >
                <svg aria-hidden viewBox="0 0 12 12" className={`h-4 w-4 ${dir === "prev" ? "rotate-180" : ""}`}><path d="M4.5 2l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </button>
            );
          })}
        </>
      )}
      </div>
      {/* lg에서는 홀수 칸이 36px 내려가 있어 그만큼 더 띄웁니다. */}
      {/* DECIDED 2026-10-12 (등록 브리프 1.5, 리뷰 S10): 캡션이 8월 기록으로 갑니다. 밑줄은 본문 인라인 링크의 문법입니다.
          같이 붙였던 8월 숫자 문장은 2026-10-13에 뺐습니다(사용자: "이렇게 디테일한 설명은 필요 없음"). */}
      <figcaption className={`mt-3 flex items-center justify-between gap-3 text-left ${META} text-white/85`}>
        <Link href={naruLinks.archive} onClick={() => track("naru_cta", { src: "hero-caption", to: "archive" })} className="-my-3.5 inline-flex min-h-[44px] items-center break-keep underline underline-offset-4 transition hover:text-white">
          {t(naru.eventHero.photosCaption)}
        </Link>
        {single && shown.length > 1 && <span aria-hidden className="shrink-0 tabular-nums text-naru-muted">{`${cur + 1} / ${shown.length}`}</span>}
        {single && <span aria-live="polite" className="sr-only">{announce}</span>}
      </figcaption>
      <PhotoLightbox
        photos={shown.map((p) => ({ src: p.src, alt: t(p.alt), width: p.width, height: p.height, caption: p.day && `${t(naru.eventHero.photosCaption)} · ${t(p.day)}`, thumb: thumbs[p.src] }))}
        index={openPhoto}
        onIndex={setOpenPhoto}
        onClose={() => setOpenPhoto(null)}
        labels={{ close: t(naru.eventHero.photoClose), prev: t(naru.eventHero.photoPrev), next: t(naru.eventHero.photoNext) }}
      />
    </figure>
  );
}

// DECIDED 2026-10-11 (사용자, 스크린숏: "마일스톤에 대한 자세한 설명이 클릭하면 보여지도록"): 일정 카드 바닥의 마일스톤 띠는 누르는 것입니다.
// 누르면 같은 띠 안에 설명이 열리고 다시 누르면 닫힙니다. 띠마다 따로 열립니다. 설명이 없으면 전처럼 글만 있는 띠입니다.
// DECIDED 2026-10-11 (리뷰 A3, A5): id는 useId가 아니라 부르는 쪽이 주는 안정된 값입니다(서버와 클라이언트의 useId가 어긋나
// aria-controls가 없는 id를 가리켰습니다). 설명 문단은 닫혀 있어도 hidden으로 마운트해 둡니다.
// DECIDED 2026-10-22 (사용자: 스와이프할 때 상자 크기가 너무 달라 어색함): 폰 카드에서도 띠를 접어 둡니다(expanded={false}). 다섯 카드가 같은 높이라
// 가장 긴 카드가 짧아야 빈칸이 줄어듭니다. 아래는 그 전의 이유입니다.
// expanded: 폰의 노선도 카드에서는 띠를 누르지 않습니다. 날짜를 눌러 연 카드 안에서 한 번 더 접혀 있던 것(2단 접힘)을 없애고
// 설명 한 문장을 펼쳐 둡니다. 데스크톱 일정 카드의 띠는 전과 같이 누르는 것입니다.
// tone: "plain"은 미션이 아닌 띠입니다(Day 1의 "Day 2에 들고 갈 것"). 같은 자리와 같은 문법이고, 호박색과 ★는 미션에만 씁니다.
// DECIDED 2026-10-17 (사용자: "문장으로 말고, bullet point로, 그리고 제출하는 방법으로"): detail은 문단 하나가 아니라 라벨이 붙은 목록 둘입니다.
// 카드는 가운데 정렬이지만 목록은 글머리가 한 줄로 서야 읽히므로, 목록 묶음만 가운데에 두고 그 안은 왼쪽 정렬입니다.
// 2026-10-19 (시각 감사 6): 열기 전의 시간표 버튼. 흐린 글자만 있는 큰 알약이 고장 난 버튼처럼 보여, 현장 멘토링 상자와 같은
// "아직" 문법(점선 테두리)에 자물쇠를 붙입니다. 새 색과 새 글자 크기는 없습니다.
// DECIDED 2026-10-24 (사용자: "이 button을 더 visually engaging하게"): 점선 투명 필이 고장 난 버튼처럼 보여, 실선 테두리와 옅은 면, 밝은 글자로.
// 잠김은 자물쇠와 cursor-not-allowed가 말합니다. 그 전: !border-dashed !border-white/25 !bg-transparent text-white/70.
// 2026-11-05 (폰 점검: 보조 버튼 모양이 셋): 잠긴 버튼도 다른 보조 버튼처럼 흰 면에 선 하나. 잠김은 자물쇠와 아래 캡션이 말합니다.
const LOCKED_CLASS = `w-full cursor-not-allowed justify-center gap-2 !border-white/15 !bg-naru-surface font-semibold text-white/90 ${buttonClass("secondary")} hover:!translate-y-0`;
const LOCK_ICON = (
  <svg aria-hidden width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
    <rect x="5" y="11" width="14" height="9" rx="2" /><path d="M8 11V8a4 4 0 0 1 8 0v3" />
  </svg>
);
type MilestoneDetail = { label: string; items: string[] }[];
// open, onToggle(2026-10-17): 데스크톱 Day 1~3 판의 세 띠는 함께 열리고 닫힙니다. 한 칸만 열리면 그 줄의 높이가 크게 어긋났습니다.
function MilestoneStrip({ id, label, title, detail, center = false, expanded = false, tone = "amber", open: openProp, onToggle, fill = false, narrow = false, compact = false }: { compact?: boolean; id: string; label: string; title: string; detail?: MilestoneDetail; center?: boolean; expanded?: boolean; tone?: "amber" | "plain"; open?: boolean; onToggle?: () => void; fill?: boolean; narrow?: boolean }) {
  const [openSelf, setOpenSelf] = useState(false);
  const open = openProp ?? openSelf;
  const setOpen = (f: (v: boolean) => boolean) => (onToggle ? onToggle() : setOpenSelf(f));
  // DECIDED 2026-10-20 (사용자, hwang 브리프 2.11, 감사 W5, 시각 리뷰 C4): 호박색(amber) 분기를 걷고 모든 띠가 기본 톤입니다. 미션 띠는 ★ 하나로 구별합니다.
  const amber = tone === "amber";
  // DECIDED 2026-10-13 (사용자, 스크린숏: "별, 미션, 이후 공개 이게 다 고려가 되어야 함"): 가운데에 서는 것은 제목 하나가 아니라
  // ★, 라벨, 제목 묶음 전체입니다. 같은 날 앞서 제목만 가운데에 세웠던 것(1fr auto 1fr)을 되돌렸습니다.
  // 위아래는 글자의 잉크로 맞춥니다. 한글은 줄 상자 안에서 위로 붙어 앉고(실측 0.6px) ★의 왼쪽 여백 때문에 묶음이 왼쪽으로 0.75px 치우쳐, 설명이 없는 띠에서는 묶음을 1px 내리고 1px 오른쪽으로 둡니다.
  const head = (
    <>
      <span className={`inline-flex shrink-0 items-center gap-1 ${META} font-bold text-caption`}>
        {amber && <span aria-hidden>★</span>}{label}
      </span>
      <span className={`${compact ? META : BODY} font-bold leading-snug text-white`}>{title}</span>
    </>
  );
  // DECIDED 2026-11-05 (사용자: "상자의 vertical length를 줄여줘"): /crossing Day 카드 안(compact)에서는 제목을 META 굵게, 라벨과 화살표를 한 줄에,
  // 안쪽 여백을 줄여 띠 높이를 약 절반으로. 다른 자리(폰 패널, 데스크톱 판)는 그대로입니다.
  if (compact) {
    return (
      <div className={`flex w-full flex-col rounded-xl card-sunken ${fill ? "flex-1" : ""}`}>
        {detail ? (
          <button type="button" aria-expanded={open} aria-controls={id} onClick={() => setOpen((v) => !v)} className="flex w-full flex-col items-start gap-1 rounded-xl px-3 py-2.5 text-left transition-colors hover:bg-white/[0.06]">
            <span className="flex w-full items-center justify-between gap-2">
              <span className={`inline-flex items-center gap-1 ${META} font-bold text-caption`}>{amber && <span aria-hidden>★</span>}{label}</span>
              <svg aria-hidden width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={`shrink-0 text-naru-muted transition-transform ${open ? "rotate-180" : ""}`}><path d="m6 9 6 6 6-6" /></svg>
            </span>
            <span className={`break-keep ${META} font-bold leading-snug text-white`}>{title}</span>
          </button>
        ) : (
          <p className="flex flex-col gap-1 px-3 py-2.5 text-left">{head}</p>
        )}
        {detail && (
          <div id={id} hidden={!open} className="break-keep border-t border-white/10 px-3 py-3">
            <div className="flex flex-col gap-2.5 text-left">
              {detail.map((g) => (
                <div key={g.label}>
                  <p className={`${META} font-bold text-white/85`}>{g.label}</p>
                  <ul className={`mt-1 ${META} leading-[1.6] text-white/85`}>
                    {g.items.map((it) => (
                      <li key={it} className="flex gap-2"><span aria-hidden className="text-white/50">•</span><span>{it}</span></li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }
  // 2026-10-19 (시각 감사 5): 가운데 띠는 늘 쌓습니다(★ 미션 / 제목 / 화살표). 제목 길이와 카드 폭에 따라 한 줄로 서던 띠(Day 1, 넓은 Day 4)가 있었습니다.
  const row = `flex w-full items-center gap-x-2.5 gap-y-1 break-keep px-3 py-2 ${center ? "flex-col justify-center" : "flex-wrap text-left"}`;
  return (
    // fill(2026-10-19): 데스크톱 Day 1~3 격자의 띠는 행 높이를 채웁니다. 제목 길이 때문에 화살표가 한 줄에 들어가는 띠만 낮아지던 것.
    <div className={`mt-auto flex w-full flex-col ${expanded ? "border-t border-white/15" : "rounded-xl card-sunken"} ${fill ? "md:mt-[16px]" : ""} ${narrow ? "md:mx-auto md:max-w-[17rem]" : ""}`}>
      {detail && !expanded ? (
        // DECIDED 2026-10-26 (사용자, 스크린숏: "상자 각 파트별로 사이즈가 다름. 통일해줘"): 열린 띠는 제목 칸이 늘어나지 않고 아래 목록 칸이 남는 높이를 받습니다.
        // 그 전에는 버튼이 늘 flex-1이라, 목록이 짧은 상자(Day 1)일수록 제목 칸이 커져 세 상자의 구분선 높이가 달랐습니다. 닫힌 띠는 전처럼 버튼이 채웁니다.
        <button type="button" aria-expanded={open} aria-controls={id} onClick={() => setOpen((v) => !v)} className={`${row} min-h-[44px] ${open ? "" : "flex-1"} rounded-xl transition-colors hover:bg-white/[0.06]`}>
          {/* DECIDED 2026-10-26 (같은 날 왼쪽 정렬 뒤 다시 어긋남): 데스크톱 Day 1~3 격자(fill)에서는 라벨을 늘 제목 위 한 줄로 쌓습니다.
              한 줄에 서던 라벨과 제목이 Day 3의 긴 제목에서만 꺾여 세 머리의 높이가 달랐습니다. */}
          {fill && !center ? <span className="flex min-w-0 flex-col items-start gap-0.5 md:flex-nowrap">{head}</span> : head}
          <svg aria-hidden width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={`shrink-0 text-naru-muted transition-transform ${center ? "" : "ml-auto"} ${open ? "rotate-180" : ""}`}><path d="m6 9 6 6 6-6" /></svg>
        </button>
      ) : (
        <p className={`${row} min-h-[44px] pb-[7px] pl-[13px] pr-[11px] pt-[9px]`}>{head}</p>
      )}
      {detail && (
        <div id={expanded ? undefined : id} hidden={!expanded && !open} className={`flex-1 break-keep border-t border-white/10 px-3 py-3`}>
          <div className={`flex w-fit flex-col gap-2.5 text-left ${center ? "mx-auto" : ""}`}>
            {detail.map((g) => (
              <div key={g.label}>
                <p className={`${META} font-bold text-white/85`}>{g.label}</p>
                <ul className={`mt-1 ${BODY} leading-[1.65] text-white/85`}>
                  {g.items.map((it) => (
                    <li key={it} className="flex gap-2"><span aria-hidden className="text-white/50">•</span><span>{it}</span></li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// 함께하는 곳 로고의 높이(2026-10-21). 같은 높이면 가로로 긴 워드마크(DRIMAES, Lovable)가 커 보이고 두 줄짜리 마크(팝업스튜디오, Wilt)가
// 작아 보여서, 가로세로 비율로 높이를 나눕니다. 눈에 보이는 면적이 비슷해지는 값입니다.
function partnerLogoHeight(l: { w: number; h: number; square?: boolean }): string {
  if (l.square) return "h-12 sm:h-14"; // 2026-10-21: 크라이치즈버거가 얼굴 아래 글자 두 줄인 판으로 바뀌어 글자가 읽히는 높이로.
  const r = l.w / l.h;
  if (r > 5) return "h-4 sm:h-[1.15rem]";
  if (r > 3.6) return "h-5 sm:h-[1.35rem]";
  if (r > 2.4) return "h-6 sm:h-7";
  return "h-7 sm:h-8";
}

/** 함께하는 곳의 로고 하나. 링크가 있으면 새 탭 링크입니다. h를 주면 비율 높이 대신 그 높이(AXMOS 머리). */
function partnerLogo(l: { name: string; src: string; w: number; h: number; url?: string; square?: boolean }, h?: string) {
  const img = (
    <Image src={l.src} alt={l.name} width={l.w} height={l.h} unoptimized className={`block w-auto ${h ?? partnerLogoHeight(l)} opacity-90`} />
  );
  return l.url ? (
    <a key={l.name} href={l.url} target="_blank" rel="noopener noreferrer" aria-label={l.name} className="inline-flex min-h-[44px] items-center rounded-sm transition-opacity hover:opacity-100 [&>img]:hover:opacity-100">
      {img}
    </a>
  ) : (
    <span key={l.name}>{img}</span>
  );
}

/**
 * 함께하는 곳의 로고 띠(메인 후원을 뺀 줄들). DECIDED 2026-10-26 (사용자: "함께한 곳 로고 ticker slide효과", 이어서 "티커는 절제를 원했지 모두 삭제를
 * 지시하진 않았어", "pc에서 스폰서 로고 하나만 아래로 내려가서 불편"): 같은 날 정지 격자(4열에 다섯 개라 하나가 아래 줄로 떨어짐)로 바꾼 것을 되돌립니다.
 * 한 줄 띠, 90초 한 바퀴(globals.css .marquee-left), 호버해도 멈추지 않음(같은 날 사용자). 2026-11-05부터 모션 줄이기에서도 멈추지 않음(globals.css). 칸 이름은 로고 아래 캡션.
 * 네 벌을 이어 반(두 벌)만큼 흘러 이음매가 없습니다. 처음 한 벌만 링크와 읽기 대상이고 나머지는 aria-hidden입니다.
 */
function PartnerTicker({ t }: { t: (p: Phrase) => string }) {
  const items = decemberPartners.groups.filter((group) => !group.lead).flatMap((group) => group.logos.map((logo) => ({ logo, role: t(group.label) })));
  const track = [...items, ...items, ...items, ...items];
  return (
    // DECIDED 2026-10-26 (사용자: "pc에선 티커 로고가 더 넓게 보여도 돼"): lg부터 띠가 글 기둥 밖 챕터 여백까지(64px, 2xl 144px) 넓어지고 로고와 칸이 한 단 커집니다.
    <div className="group relative w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,#000_12%,#000_88%,transparent)] lg:-mx-16 lg:w-[calc(100%+8rem)] 2xl:-mx-32 2xl:w-[calc(100%+16rem)]">
      <ul role="list" className="marquee-track marquee-left">
        {track.map(({ logo, role }, i) => {
          const dup = i >= items.length;
          const img = <Image src={logo.src} alt={dup ? "" : logo.name} width={logo.w} height={logo.h} unoptimized className={`block w-auto ${partnerLogoHeight(logo)} lg:origin-center lg:scale-125`} />;
          return (
            <li key={i} aria-hidden={dup || undefined} className="flex shrink-0 flex-col items-center gap-3 px-[32px] py-[12px] sm:px-[48px] lg:gap-4 lg:px-[72px] lg:py-[20px]">
              <span className="flex h-14 items-center lg:h-20">
                {logo.url && !dup ? <a href={logo.url} target="_blank" rel="noopener noreferrer" aria-label={logo.name} className="inline-flex min-h-[44px] items-center">{img}</a> : img}
              </span>
              <span className={`${META} whitespace-nowrap text-caption`}>{role}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default function NaruHome() {
  const { t, locale } = useLocale();
  // 크로싱 서울 등록 상태(2026-09-18). 프로바이더가 없거나 창이 닫혀 있으면 "not_open"이고
  // 화면은 그 전과 같습니다. open이면 CTA 셋이 "등록하기"로, closed면 "등록이 마감됐습니다".
  const reg = useCrossingRegisterOptional();
  const regState = reg?.state ?? "not_open";
  // ── 히어로는 정지 레이아웃입니다 (DECIDED 2026-09-20, 사용자: "undo the
  //    animation that i tried to put at the top") ───────────────────────────
  //
  // 스크롤에 물린 히어로 효과를 두 번 시도했고 두 번 다 걷었습니다.
  //
  //   2026-09-19  8월의 useHeroSplit(두 단이 좌우로 ±500px 벌어지며 사라짐)을
  //               그대로 가져왔습니다. 사용자: "8월 페이지와 같은 효과, 마음에 안 듦."
  //   2026-09-20  다른 축으로 다시 만들었습니다(useHeroRecede, 제목 묶음이 위로
  //               물러나고 사진 단이 느리게 따라오는 깊이). 사용자가 셋 중에 고른
  //               안이었고, 구간을 제목이 보이는 동안으로 옮겨 계측까지 통과했는데,
  //               실제 화면에서 원하는 것이 아니었습니다.
  //
  // 두 번의 결론이 같습니다. 이 히어로에는 스크롤 효과를 걸지 마세요. 세 번째
  // 안을 만들기 전에 사용자에게 먼저 물어보세요. 그동안의 값과 계측은
  // CHANGELOG.md 2026-09-20 항목과
  // docs/hero-recede-fix-brief.md에 남아 있습니다. 되살릴 일이 생기면 거기서
  // 꺼내 쓰면 되고, 코드는 지웁니다. 쓰지 않는 코드가 남아 있으면 다음 사람이
  // "왜 안 걸려 있지"부터 묻게 됩니다.
  //
  // 챕터 리빌(Chapter/Reveal의 data-chapter-reveal)은 이것과 별개이고 그대로
  // 돌아갑니다. 그건 히어로 아래 블록들이 올라오며 나타나는 효과입니다.
  // 노선도의 현재 위치 점(감사 반영 브리프 3.6). 호버한 일정 행으로 점이 옮겨 갑니다.
  // 2026-09-20 (표현 방식 브리프 4): openDay(폰 Day 카드 아코디언)는 카드와 함께
  // 사라졌습니다. 행은 처음부터 전부 펼쳐져 있어 접었다 펼 것이 없습니다.
  usePlateLite();
  // DECIDED 2026-10-11 (사용자: "button으로 말고, 여기(노선도)를 클릭하면 나오는 구조가 더 자연스러운듯"): 폰의 접힘 단추를 뺐습니다.
  // 폰에서 노선도의 정거장을 누르면 그날의 카드가 노선도 바로 아래에 열립니다(다시 누르면 닫힘).
  // DECIDED 2026-10-11 (사용자, 같은 날 뒤: "여기 클릭하게 하는 건 빼주면 될 것 같고"): sm부터는 정거장이 눌리지 않습니다.
  // 일정 카드가 다 보이는 화면에서 누르면 표시만 남고 하는 일이 없었습니다. 폰은 그대로입니다(카드 다섯을 한 번에 펴면 길어서).
  // 멘토링 필 둘은 뺐고(아래 상자가 같은 말을 합니다), 멘토링 상자는 폰에서도 처음부터 보입니다.
  // DECIDED 2026-10-11 (리뷰 A3): 폰의 첫 진입에는 DAY 1(인덱스 1)이 열려 있습니다. 날짜를 눌러 카드가 열릴 때 카드 하단이
  // 화면 하단에서 63px 위보다 아래에 있으면 그만큼만 스크롤합니다(전에는 점 행이 화면 아래쪽에 있으면 카드가 화면 밖에 열려
  // 아무 일도 일어나지 않은 것처럼 보였습니다). 처음부터 열려 있는 DAY 1에는 스크롤하지 않습니다. 누른 때만입니다.
  // phone: 정거장이 눌리는 폭(sm 아래)인가. sm부터는 정거장이 버튼이 아니고(전에는 눌리지 않는 버튼이었습니다),
  // 노선도의 현재 위치 점도 전처럼 Day 0에서 시작합니다.
  // DECIDED 2026-10-11 (사용자, 스크린숏: "너무 한 줄이어서 가독성이 없음. Day 0, 그 아래에 2x2 테이블로"): 일정은 다섯 행 한 기둥이
  // 아니라 Day 0 한 장과 그 아래 Day 1부터 Day 4의 두 칸 두 줄입니다(md부터 두 칸).
  // DECIDED 2026-10-11 (사용자, 같은 날 뒤: "visually 눈에 잘 들어오지 않음"): 헤어라인 칸을 카드로 바꿨습니다. 글자 크기는 그대로 셋이고
  // (2026-10-07), 눈에 걸리는 자리를 둘로 줄였습니다: 위의 DAY 알약과 제목, 아래 끝의 마일스톤 띠. 그날의 한 줄은 굵기를 내렸습니다.
  // 마일스톤 띠는 카드 바닥에 붙어(mt-auto) 옆 카드와 같은 높이에 섭니다. Day 1의 /match 버튼은 히어로로 갔습니다.
  // DECIDED 2026-10-21 (2차): 일정 h3 아래 날짜별 제목은 h4입니다. 폰 패널의 기존 펼침 동작은 유지합니다.
  // Day 1~3이 함께 쓰는 버튼 하나(2026-10-17). 페이지 안에서 날을 고릅니다. 열기 전에는 잠겨 있습니다(TIMETABLE_OPEN).
  // 하루의 흐름 모달에 열린 날(stages 인덱스). null이면 닫힘.
  const [flowDay, setFlowDay] = useState<number | null>(null);
  // DECIDED 2026-11-05 (사용자, 스크린숏: "너무 길이의 차이가 남"): Day 1~3 띠 셋은 함께 열리고 닫히며(10/17 데스크톱 판과 같은 이유), 같은 행 높이를 채웁니다.
  // 띠 안의 "세션"과 "멘토 찾아가기" 묶음은 뺐습니다. 세션 이름은 띠 바로 위에, 세션 설명과 멘토를 찾아가는 곳은 하루의 흐름 모달에 있습니다.
  const [stripsOpen, setStripsOpen] = useState(false);
  const sharedCta = naru.december.stages[1].timetableCta;
  const timetableButton = sharedCta && (
    <div>
      {TIMETABLE_OPEN ? (
        <Link href="/crossing/team" className={`group w-full justify-center ${buttonClass("secondary")}`}>
          {t(sharedCta.label)}<span aria-hidden className={ARROW_CLASS}>→</span>
        </Link>
      ) : (
        <span role="link" aria-disabled="true" className={LOCKED_CLASS}>{LOCK_ICON}
          {t(sharedCta.label)}
        </span>
      )}
    </div>
  );
  // DECIDED 2026-10-21: 패딩은 그룹이 맡고 단계는 행 간격만 둡니다. 열 사이 gap 32px + 선 안쪽 16px = 기존 48px.
  // DECIDED 2026-10-21: 글 행 24px, 미션 앞 24+16px, 공통 버튼 앞 48px로 서로 다른 묶음을 구분합니다.
  // sub: 데스크톱 Day 1~3 줄의 카드(2026-10-19). 카드가 부모 격자의 행을 나눠 써서(subgrid) 한 줄, 세션, 칩, 미션이 세 카드에서 같은 높이에 섭니다.
  // lgSub (2026-10-24, 밀도 브리프 1.2): 데스크톱 Day 0. md까지는 전폭 카드(전과 같음), lg부터 Day 1~3과 같은 subgrid 네 칸 중 첫 칸.
  // DECIDED 2026-11-05 (사용자, 스크린숏: "내용이 너무 삐뚤빼뚤함"): /crossing 닷새 장의 다섯 칸 카드. 칸마다 일곱 자리(머리, 날짜, 그날 한 줄, 세션,
  // 팀 구성과 링크, 띠, 버튼)를 두고 lg부터 다섯 칸이 같은 행 격자(subgrid)를 나눠 써 같은 종류가 같은 높이에 섭니다. 없는 자리는 lg에서만 빈칸.
  // 글과 띠, 버튼은 stageCard의 폰 패널과 같은 데이터와 부품입니다. Day 0의 둘째 문단(panelBody)은 칸 높이를 맞추려 그리지 않습니다.
  // DECIDED 2026-11-05 (사용자, 스크린숏 둘: "같은 공간을 쓰되, 이 상자들이 5 columns가 아니고, main처럼"): 날마다의 부품(머리, 한 줄, 세션,
  // 팀 구성 줄, 띠, 인기투표)을 만들고, 배치는 아래 일정 판이 main처럼 정합니다(Day 0 위, Day 1~3 세 칸과 공용 시간표 버튼, Day 4 아래).
  const dayParts = (stage: (typeof naru.december.stages)[number], i: number) => {
    const strip = !stage.milestone && stage.submit ? (
      <MilestoneStrip id={`carry-day-${stage.dayOffset}-card`} tone="plain" label={t(naru.december.carryLabel)} title={t(stage.submit)} center={false} expanded={false} compact
        detail={[
          { label: t(naru.december.carryDetail.todoLabel), items: naru.december.carryDetail.todo.map(t) },
          // 2026-11-05 (사용자, 스크린숏: 첫 띠의 "내용이 너무 없다"): 10/17에 정한 올려 두기(선택) 세 줄을 함께 그려 Day 2, 3 띠와 같은 두 묶음으로.
          { label: t(naru.december.carrySubmitLabel), items: naru.december.carryDetail.submit.map(t) },
        ]} open={stripsOpen} onToggle={() => setStripsOpen((v) => !v)} fill />
    ) : stage.milestone ? (
      <MilestoneStrip id={`milestone-day-${stage.dayOffset}-card`} label={t(naru.december.milestoneLabel)} title={t(stage.milestone)} detail={stage.milestoneDetail && [
        { label: t(naru.december.milestoneConditionsLabel), items: stage.milestoneDetail.conditions.map(t) },
        // 2026-11-05 (사이트 점검, UX): 올리는 것(Day 3는 발표 자료 PDF)과 멘토를 찾아간다는 것을 함께 보입니다.
        ...(stage.milestoneDetail.submit ? [{ label: t(naru.december.milestoneSubmitLabel), items: stage.milestoneDetail.submit.map(t) }] : []),
      ]} center={false} expanded={false} compact open={stripsOpen} onToggle={() => setStripsOpen((v) => !v)} fill />
    ) : null;
    const vote = stage.voteCta ? (
      VOTE_BUTTON_OPEN ? (
        <Link href={stage.voteCta.href} className={`group w-full justify-center ${buttonClass("secondary")}`}>
          {t(stage.voteCta.label)}<span aria-hidden className={ARROW_CLASS}>→</span>
        </Link>
      ) : (
        <>
          <span role="link" aria-disabled="true" className={LOCKED_CLASS}>{LOCK_ICON}{t(stage.voteCta.label)}</span>
          {stage.voteCta.lockedNote && <p className={`mt-[8px] ${META} text-caption`}>{t(stage.voteCta.lockedNote)}</p>}
        </>
      )
    ) : null;
    const chips = stage.chips.length > 0 || stage.matchCta ? (
      <p className={`flex flex-wrap gap-x-3 gap-y-1 ${META} text-caption`}>
        {stage.chips.map((c, j) => <span key={j}>{t(c)}</span>)}
        {stage.matchCta && (
          <Link href={stage.matchCta.href} onClick={() => track("naru_cta", { src: "day1", to: "match" })}
            className="tap-44 font-semibold text-accent underline decoration-accent/40 underline-offset-4 transition-colors hover:text-white">
            {t(stage.matchCta.label)} <span aria-hidden>→</span>
          </Link>
        )}
      </p>
    ) : null;
    const head = (center: boolean) => (
      <h3 className={`flex flex-wrap items-baseline gap-x-2.5 gap-y-1 ${center ? "justify-center" : ""}`}>
        <span lang="en" className={`${META} font-bold text-accent`}>{`${t(naru.december.dayLabel)} ${stage.dayOffset}`}</span>
        <span className={ROW_HEADING}>{t(stage.title)}</span>
        <span className={`${META} text-caption`}>{formatDecemberDayWithWeekday(locale, stage.dayOffset)}</span>
        {/* DECIDED 2026-11-05 (사용자: "각 날마다 어디서 하는지를 보여주면 좋을거 같은데, 1일차는 페스트파이브, 그리고 4일차는 마루180. 로고들이 보였으면"):
            날짜 옆에 그날 장소의 로고(stage.logo, 노선도와 같은 데이터). 흰 실루엣은 globals.css가 크림 위에서 잉크로 바꿉니다. 장소가 정해지지 않은 날은 그리지 않습니다. */}
        {stage.logo && (
          <a href={stage.logo.url} target="_blank" rel="noopener noreferrer" aria-label={stage.logo.name}
            className="tap-44 inline-flex items-center gap-1.5 self-center opacity-90 transition-opacity hover:opacity-100">
            <svg aria-hidden width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 text-caption"><path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21Z" /><circle cx="12" cy="9.5" r="2.5" /></svg>
            <Image src={stage.logo.src} alt="" width={stage.logo.w} height={stage.logo.h} className="h-[14px] w-auto" />
          </a>
        )}
      </h3>
    );
    const line = <p className={`break-keep ${BODY} leading-[1.65] text-white/85`}>{t(stage.line)}</p>;
    const session = stage.session ? (
      <p className={`break-keep ${META} text-naru-muted`}>
        <span className="mr-1.5">{t(naru.december.sessionLabel)}</span>
        <span lang="en" className={`${BODY} font-semibold text-white/85`}>{t(stage.session.title)}</span>
      </p>
    ) : null;
    // DECIDED 2026-11-05 (사용자: "클릭하면 보이는 식으로 like 8월 처럼"): 하루의 흐름은 카드 안에서 펼치지 않고, 8월 카드의 "자세히 보기 →"처럼
    // 글자 링크 하나를 눌러 모달(components/crossing/DayFlowModal)에서 봅니다. 같은 날 앞선 접는 띠(안 A)를 대신합니다.
    const flow = stage.flow && stage.flow.length > 0 ? (
      <button type="button" onClick={() => setFlowDay(i)} aria-haspopup="dialog"
        className={`tap-44 group inline-flex items-center gap-1 self-start ${META} font-semibold text-accent underline decoration-accent/40 underline-offset-4 transition-colors hover:decoration-accent`}>
        {t(naru.december.dayFlowLabel)} <span aria-hidden className="transition-transform group-hover:translate-x-0.5">→</span>
      </button>
    ) : null;
    void i;
    return { head, line, session, chips, strip, vote, flow };
  };
  // DECIDED 2026-10-10 (구조 브리프 3.2): 옛 주소. 홈에 있던 #join, #how, #why, #record, #join-ways는 /naru로 갔습니다.
  // 해시는 서버에 오지 않아 redirects로 잡을 수 없으므로, 마운트 때 한 번 보고 /naru의 같은 자리로 바꿉니다.
  // /naru에서 id가 바뀐 둘은 여기서 맞춥니다: 전의 #why(변하지 않는 두 개)는 #core, 전의 #join(왜 이 자리가 필요한가)은 #why.
  // 그 밖의 해시(#december, #gains, #naru 등)는 손대지 않습니다. #naru는 홈 끝의 티저에 내려앉습니다.
  useEffect(() => {
    const moved: Record<string, string> = { "#join": "why", "#how": "how", "#why": "core", "#record": "record", "#join-ways": "join-ways" };
    const to = moved[window.location.hash];
    // 2026-10-26 (naru-first): 나루는 이제 홈(/)입니다. /naru를 거치지 않고 바로.
    if (to) window.location.replace(`/#${to}`);
  }, []);

  return (
    <>
    {/* tabIndex=-1: skip link가 여기로 보낼 때 브라우저가 실제로 포커스를
        옮기도록 합니다. Tab 순서에는 들어가지 않습니다. */}
    {/* naru-min12: 홈의 글자 하한(app/globals.css). 2026-09-20에 폰 전용에서 모든 폭으로. */}
    <main id="main" tabIndex={-1} className="naru-min12 naru-home-v2 focus:outline-none">
      {/* ── CH0 · 크로싱 서울 히어로 (DECIDED 2026-09-17 2차) ──────────────
          홈의 첫 화면이 그룹에서 이벤트로 바뀌었습니다. 8월 사이트의 히어로가
          8월 이벤트였듯이, 여기는 크로싱 서울입니다. 나루 로고는 헤더에만 있고
          큰 로고는 맨 아래 #naru로 내려갔습니다(로고 가이드: 배경 위에 얹지
          않는다는 규칙은 그대로, WebGL 필드 위에는 글자만 있습니다).

          이름, 기간, 도시는 전부 lib/naruDates.ts에서 옵니다. 이 파일에 날짜를
          쓰지 마세요.

          주황 원장(2026-09-18, 감사 반영 브리프 0·8, 사용자 결정): 주황은 점으로만.
            로고의 나루 점(헤더·푸터·#naru 인장), 배경 등불, 노선도의 현재 위치 점,
            카운트다운 옆 점, #naru 코어 제목 앞 점. 이 다섯뿐입니다. (2026-10-24 사용자: 코어 제목 앞 점은 뺐습니다. 이제 넷.)
            면·줄·글자색·그라데이션 끝의 주황은 전부 뺐습니다(제목 2행은 보라 → 자주).
          늘리지 마세요. */}
      {/* DECIDED 2026-09-17 (8월 문법 브리프): 두 단입니다. 8월 히어로의 그리드와
          같은 클래스이고 패럴랙스도 같은 훅(useHeroSplit)입니다. 왼쪽이 아이브로,
          두 줄 제목(1행 흰색, 2행 그라데이션), 굵은 기간 줄, 포지션, 서술, CTA 둘.
          오른쪽(lg부터)이 카운트다운 패널. 파트너 로고 띠는 2026-11-04부터 카운트다운 아래에 있습니다(사용자 요청, 8월처럼).

          2026-09-18: 그라데이션 끝·12월 아이브로 글자색·기간 줄 틴트의 주황도 뺐습니다.
          위의 주황 원장이 정본입니다. */}
      {/* labelledBy (2026-09-19, 접근성 감사 5): 이름 없는 <section>은 region
          랜드마크로 노출되지 않습니다. 그래서 폰 로터의 랜드마크 목록에 main과
          contentinfo만 남고, 18,000px짜리 한 장에서 챕터 단위 이동 수단이 레일
          하나뿐이었습니다. 각 챕터가 자기 제목을 이름으로 씁니다. */}
      {/* 2026-10-13 (등록 브리프 2.2): xl 아래에서는 레일이 스크롤 0부터 헤더의 둘째 줄로 서므로 그 높이(54px)만큼 위 여백을 더합니다.
          xl부터는 전과 같습니다(pt-28). */}
      {/* 2026-10-08 (사용자: "크로싱 서울이 너무 위에 있다"): lg의 위 여백을 한 단 늘렸습니다(pt-20 → pt-28). 로고가 헤더에
          바로 붙어 있었습니다. 카운트다운 띠까지 1440×900 한 화면에 들어오는 선에서입니다. */}
      {/* DECIDED 2026-10-22 (사용자, 스크린숏: "여기는 kwan 전의 version으로 되돌려줘"): 히어로(이 챕터, CountdownPanel, HeroPhotos)는
          kwan-design 합치기(a032318) 전의 8784ca1 그대로입니다. 아래 챕터의 kwan 간격 정리는 그대로 둡니다. */}
      <Chapter id="top" labelledBy="hero-title" align="center" wide className="!pt-[calc(var(--site-header-height,116px)+48px)] sm:!pt-[calc(var(--site-header-height,116px)+64px)]">
        {/* relative는 2026-09-17에 framer-motion의 useScroll target 경고 때문에
            붙었습니다. 그 훅은 2026-09-20에 사라졌지만 클래스는 둡니다. 히어로가
            앉는 쌓임 맥락이고, 빼는 것은 아무도 요청하지 않은 레이아웃 변경입니다. */}
        {/* DECIDED 2026-10-08 (사용자, 스크린숏: "로고, 타이머, 사진, 설명이 display 되어 있는 방식이 모두 어색함"): 히어로 정리.
            ① 두 단의 윗선을 맞춥니다(가운데 정렬이라 사진 단이 로고보다 아래에서 시작했습니다).
            ② 사진 넷은 엇갈림 없이 반듯한 2×2, 캡션은 바로 아래.
            ③ 버튼 둘은 한 줄에 붙이고, 안내 한 줄은 버튼 줄 아래에(전에는 첫 버튼 아래라 둘째 버튼이 밀렸습니다).
            ④ 카운트다운은 왼쪽 단에서 꺼내 두 단 아래의 가로 띠 하나로. 숫자 옆에 단위, xl부터 서울과 싱가포르가
               한 줄에 나란히. 왼쪽 단 안에서는 TITLE 숫자 두 줄이 단을 다 차지해 설명보다 무거웠습니다.
            폰은 순서 그대로입니다(카피, 버튼, 카운트다운, 사진). */}
        {/* DECIDED 2026-10-26 (사용자: "히어로도 pc에서 가운데 간격이 너무 넓은데 좀 더 좁혀줘. 이미지랑 타이틀이 너무 멀어"): 화면 양끝에 붙던 두 단을
            가운데 72rem 판 안에 두고, 글 단은 글 폭만큼(auto), 사진 단이 나머지를 씁니다. 사이 간격 64px. */}
        {/* DECIDED 2026-11-04 (사용자, site-tells 목업 "종이"): 글 단과 사진 단이 반씩. 사진은 한 장. */}
        <div className="relative grid items-center gap-12 px-6 sm:px-10 lg:mx-auto lg:max-w-6xl lg:grid-cols-2 lg:gap-16 lg:px-10">
          {/* DECIDED 2026-10-08 (사용자, 스크린숏: "여기를 이 공간에서 centralize, 그 아래 버튼들도 같이"): 왼쪽 단의 글 묶음
              (알약, 로고, 날짜, 한 줄, 설명, 버튼 둘, 안내)은 그 단 안에서 가운데입니다. 폰에서도 가운데입니다
              (가운데인 블록은 폰에서도 가운데, 2026-10-02). 9월 29일의 "글은 하나의 왼쪽 끝"에서 히어로 왼쪽 단은 예외가 됩니다. */}
          {/* 같은 날 (사용자, 스크린숏: "크로싱 서울이 너무 위에 있다", "내용이 저 공간들을 좀 더 채워줄 수 있으면", "영어 버전은
              더 비워져 있음"): lg부터 이 단은 사진 단의 세로 가운데에 섭니다(lg:self-center). 그리고 묶음 사이(로고와
              날짜, 설명과 버튼)를 벌려 사진 단의 높이를 채웁니다. 글자 크기는 셋 그대로라 크기로 채우지 않습니다.
              그 전에는 윗선에 붙어 있어 로고가 화면 꼭대기에 닿고 아래가 비었습니다. */}
          {/* DECIDED 2026-10-26 (사용자: "글들이 레이아웃 따라 좌측 정렬이나 중앙 정렬이 유연히"): 한 기둥(lg 아래)에서는 가운데, 두 단(lg부터)에서는 왼쪽. */}
          <div className="text-center lg:text-left">
            {/* DECIDED 2026-10-08 (사용자: "나루 2026 서울이라는 내용을 그냥 빼줘"): 히어로의 알약 라벨(eventHero.eyebrow)은
                그리지 않습니다. 로고가 첫 줄입니다. 키는 data/naru.ts에 그대로 둡니다. */}
            {/* 2행은 그라데이션 토큰(GRADIENT_TEXT). ko는 "크로싱 서울" / "CROSSING SEOUL", en은 "CROSSING" / "SEOUL".
                DECIDED 2026-10-07 (이슈 브리프 4.1): 크기는 TITLE 하나입니다. 챕터 h2, 카운트다운 숫자와 같은 값이고,
                그 전의 히어로 전용 clamp(최대 86.4px)와 2행의 0.82em은 없습니다. 한 화면의 글자 크기가 셋을 넘지
                않게 하려는 것입니다(components/ui/typography.ts). 390px에서 두 줄 모두 한 줄에 들어갑니다. */}
            {/* DECIDED 2026-10-11 (사용자, 스크린숏: "좀 더 로고가 크면 좋겠어", 이어서 "둘다 사이즈가 동일해야함"): 히어로의 로고는 TITLE의 1.25배입니다
                (폰 45px, 데스크톱 84px). 한국어 화면과 영문 화면이 같은 크기입니다. 영문은 글자가 길어 이 크기에서 두 줄로 접힙니다.
                한 화면의 글자 크기는 셋이라는 규칙(2026-10-07)에서 이 로고 하나만 예외입니다. 글이 아니라 표식입니다. 다른 자리에 이 크기를 쓰지 마세요. */}
            <h1 id="hero-title" className="text-[clamp(2.5rem,6.875vw,4.6875rem)] max-sm:text-[40px] font-black leading-[1.05] tracking-tight">
              {/* DECIDED 2026-10-08 (사용자: "영문 화면에도 같은 로고로", 이어서 "영어 crossing seoul 로고로 바꿨으면"):
                  영문 화면의 로고는 영문입니다. 큰 글자가 "CROSSING SEOUL"이고 같은 그라데이션을 씁니다. 한글 줄은
                  영문 화면에 보이지 않습니다(나루 락업의 규칙과 같아졌습니다). 영문 로고 파일이 따로 없어서 한국어
                  로고의 큰 줄 문법(굵기, 자간, 그라데이션)을 그대로 옮긴 것이고, 작은 둘째 줄은 두지 않습니다.
                  글자 크기가 TITLE 하나라 좁은 기둥에서는 두 줄로 접힙니다. */}
              {/* DECIDED 2026-11-04 (사용자, site-tells 목업 "종이"): 워드마크는 남색 단색 글자에 주황 점 하나(로고의 접안점과 같은 색).
                  그 전의 네 색 그라데이션과 아래 영문 줄은 걷었습니다(brand 10장, 같은 날). 영문 화면은 "CROSSING SEOUL."입니다. */}
              <span lang={locale === "en" ? "en" : "ko"} className="block break-keep text-naru-navy">
                {locale === "en" ? (DECEMBER_EVENT_NAME?.en ?? decemberEventLabel(locale)) : (DECEMBER_EVENT_NAME?.ko ?? decemberEventLabel(locale))}
                <span aria-hidden className="text-naru-orange">.</span>
              </span>
            </h1>
            {/* 굵은 기간 줄. 8월의 "2026.08.22 – 08.29 8일" 자리. */}
            {/* 2026-09-18 (감사 반영 브리프 1.5): 주황 틴트 → 흰색 볼드. 주황은 점으로만. */}
            {/* DECIDED 2026-10-11 (사용자: "로고랑 아래 내용의 gap이 조금 더 줄어들어도"): 로고와 날짜 줄 사이를 36/63px에서 27/36px로.
                로고가 커진 만큼 간격이 줄어 아래 버튼과 카운트다운의 자리는 거의 그대로입니다. */}
            {/* DECIDED 2026-10-26 (사용자: "핸드폰으로 들어갈 때 interaction들이 너무 반응이 느릴 때가 있음"): 히어로 문단 셋의 그림자는
                drop-shadow 필터가 아니라 text-shadow입니다(같은 값). 필터는 움직이는 WebGL 배경 위에서 아이폰 사파리가 매 프레임 다시 그려,
                Speed Insights의 느린 탭(0.4~1.7초)이 바로 이 문단들을 가리켰습니다. */}
            {/* 2026-11-05 (폰 점검: 히어로에 중심이 없음): 날짜 줄은 META 보통 굵기, 캡션 색. 굵은 문단은 캐치프레이즈 하나. 폰 워드마크는 40px(표식 예외). */}
            <p className={`mt-6 ${META} text-caption lg:mt-8`}>
              {formatDecemberDateLine(locale)}
            </p>
            {/* DECIDED 2026-11-04 (docs/catchphrase-brief.md C1, D2, 사용자: 이슈는 아직 손으로 하는 일이 있다는 것 자체, 빌더는 만들기 전에 왜부터 묻는다):
                이 굵은 한 줄이 december.heading 대신 캐치프레이즈를 그립니다. 그 전 문장은 git e1bed3f. 크기는 lg부터 SUBTITLE(22px), 그 아래는 BODY와 같습니다.
                굵기, 색, 그림자, 간격은 그대로입니다. */}
            {/* DECIDED 2026-11-04 (docs/catch-answer-brief.md K2, D1): 캐치프레이즈는 질문과 답 두 줄. 같은 크기, 같은 흰색. 그 전은 한 줄(git 206f1a2). */}
            <p className={`mx-auto mt-4 max-w-xl break-keep ${SUBTITLE} font-bold leading-snug lg:mx-0 text-white`}>
              <span className="block">{t(naru.eventHero.catch)}</span>{" "}
              <span className="block">{t(naru.eventHero.catchAnswer)}</span>
            </p>
            <p className={`mx-auto mt-3 max-w-xl text-balance break-keep ${BODY} leading-[1.65] lg:mx-0 text-white/85`}>
              {/* 나루 한 문장이 서술 첫 줄(감사 반영 브리프 1.2). TODO: confirm(문구는 사용자가). */}
              {/* DECIDED 2026-10-13 (등록 브리프 2.3): 이 문장의 "나루"는 링크가 아닙니다. 2026-10-10에는 색만 다른 인라인 링크였는데,
                  /naru로 가는 길은 헤더의 페이지 칩과 홈 끝의 티저 버튼이 맡습니다. 본문 인라인 링크는 밑줄 하나로 통일합니다. */}
              <span className="text-white">{t(naru.eventHero.naruLine)}              </span>{" "}
              {t(naru.eventHero.sub)}
            </p>
            {/* DECIDED 2026-10-11 (사용자, 스크린숏: "여기에 있으면 좋겠음. 2x2, 버튼 별 사이즈는 똑같이"): AI 유형 테스트 버튼이 일정표의
                Day 1에서 여기로 왔습니다. 버튼 넷이 두 칸 두 줄로 서고, 격자가 칸을 늘려 넷의 크기가 같습니다(글은 가운데).
                폰은 한 칸이고 "프로그램 보기"는 전처럼 폰에서 숨깁니다. */}
            <div className={`mx-auto mt-10 grid w-fit max-w-full max-sm:w-full lg:mx-0 grid-cols-1 gap-3 sm:grid-cols-2 lg:mt-14 [&>*]:justify-center [&>*]:whitespace-nowrap max-sm:[&>*]:whitespace-normal`}>
              {regState === "open" ? (
                // DECIDED 2026-11-02 (docs/register-ux-brief.md O1, D4): 이 기기에서 등록했으면 "등록했습니다"(유령 필). 누르면 완료 화면이 다시 열립니다.
                <button type="button" onClick={() => { track("naru_cta", { src: "hero", to: reg?.registered ? "registered" : "register" }); reg?.openRegister(); }} className={`group ${reg?.registered ? `${buttonClass("secondary")} ${HERO_BUTTON_GROUND}` : buttonClass("primary", "naru")}`}>
                  {t(reg?.registered ? registerCopy.registered : registerCopy.cta)}
                  <span aria-hidden className={ARROW_CLASS}>→</span>
                </button>
              ) : regState === "closed" ? (
                <span className={`${buttonClass("secondary")} cursor-default !text-naru-muted`}>{t(registerCopy.closed)}</span>
              ) : null
                // DECIDED 2026-10-20 (사용자, hwang 브리프 3.7, 감사 W11): 열리기 전의 "등록 폼 미리 보기"(제출할 수 없는 폼)를 내렸습니다.
                // 열리기 전에 알릴 것(혼자 등록, 조건 없음)은 아래 한 줄이 말하고, 버튼은 오픈채팅 하나입니다.
                // PreparingButton과 모달의 미리 보기 분기, registerCopy.preview* 키는 남깁니다.
              }
              {/* DECIDED 2026-10-08 (사용자: "오픈채팅 - 열어줘"): 등록이 열리기 전에도 학생이 지금 할 수 있는 일이
                  히어로에 하나 있어야 합니다. 미리 보기 버튼은 제출이 막혀 있어 흔적을 남길 수 없었습니다.
                  links.openChat이 비어 있으면 OpenChatLink가 스스로 숨습니다. 마감 뒤에는 그리지 않습니다. */}
              {regState !== "closed" && (
                // 등록이 열리기 전에는 이 링크가 히어로의 주 CTA입니다(그라데이션 필). 히어로의 주 CTA는 언제나
                // 하나라는 규칙대로, 등록이 열리면 등록 버튼이 그 면을 받고 이 링크는 유령 필로 내려갑니다.
                regState === "open"
                  ? <OpenChatLink t={t} src="naru-hero" label={openChatLabels.join} variant="secondary" className={HERO_BUTTON_GROUND} />
                  : <OpenChatLink t={t} src="naru-hero" label={openChatLabels.december} variant="hero" />
              )}
              {/* DECIDED 2026-11-02 (사용자: "이제 신청 button을 display 해도 될 거 같음, will be open at the end of second week of november"):
                  열리기 전에도 등록 버튼이 다시 섭니다. 누르면 폼이 미리 보기로 열리고 제출만 꺼져 있습니다(2026-10-08 규칙).
                  kwan-design의 버튼 순서(주 필 먼저, 유령 필 다음)대로 오픈채팅 필 뒤에 유령 필로 섭니다. 2026-10-20에 내린 결정을 이 결정이 대신합니다. */}
              {regState === "not_open" && (
                <PreparingButton t={t} noteId="hero-register-note" onOpen={() => reg?.openRegister()} className={HERO_BUTTON_GROUND} />
              )}
              {/* DECIDED 2026-10-18 (사용자, 스크린숏: "중요한 버튼 2개만 남겨줘"): "프로그램 보기"(#december)와 "AI 유형 테스트"(/match)를 뺐습니다.
                  남는 둘은 등록과 소식 받기, 신청으로 가는 길입니다. /match는 등록 완료 화면과 Day 1 카드의 matchCta가 잇고,
                  #december는 스크롤 바로 아래입니다. 아래 matchNote 줄도 버튼과 함께 내렸습니다. 키(ctaProgram, ctaMatch, matchNote)는 둡니다. */}
            </div>
            {/* DECIDED 2026-10-12 (등록 브리프 1.2, 리뷰 S1 S3): 언제 열리는지, 혼자 등록해도 되는지, 전공과 코딩 경험이 조건인지가
                첫 화면 안에서 답해집니다. DECIDED 2026-10-13 (사용자: "너무 길어"): 한 줄(registerNoteShort)입니다. 전부는 모달에(2026-10-13부터 등록 블록은 스크리닝 한 줄만). */}
            {/* DECIDED 2026-11-02 (브리프 O3): 열리면 여는 때만 빠지고 혼자 등록과 조건 없음은 같은 자리에 남습니다(registerNoteOpen). */}
            {regState !== "closed" && (
              <p id="hero-register-note" className={`mt-3 text-balance break-keep ${META} leading-snug text-white/85`}>{t(regState === "open" ? registerNoteOpen : registerNoteShort)}</p>
            )}
          </div>
          {/* 오른쪽 단 = 8월 행사 사진 넷 (DECIDED 2026-09-17, 사용자). 8월 히어로의
              메탈 휴먼 자리입니다. 사람이 많이 나온 장면만, 같은 사진은 사이트에 한 번.
              그 전의 형상 무대(싱가포르·서울 점, 배경 수정 브리프)는 같은 날 걷었습니다.
              lg부터만. */}
          {/* desktopOnly: 이 묶음은 hidden lg:block이라 폰에서는 그리지 않는데,
              priority가 걸려 있어 폰이 보지도 않을 이미지 둘을 preload 했습니다
              (2026-09-19, 접근성 감사 22). 느린 회선에서 히어로가 늦게 뜨면
              접근성 체감에도 영향이 있습니다. 아래 폰용 묶음이 priority를 맡습니다. */}
          <HeroPhotos photos={naru.eventHero.photos} t={t} single />
        </div>
        {/* DECIDED 2026-11-05 (사용자, 스크린숏: "이거는 빼도 될 거 같음"): 히어로 아래 숫자 넷 띠(닷새, 74명, 21팀, 14명)를 뺍니다.
            같은 날 앞서 목업대로 넣었던 것입니다. 데이터 키 eventHero.facts는 남겨 둡니다. */}
      </Chapter>

      {/* ── CH1 · 닷새의 모양 (DECIDED 2026-09-17, 홈 흐름 재배치 브리프) ──
          히어로 바로 아래로 올라왔습니다. 히어로의 주 CTA "프로그램 보기"가 여기에
          착지합니다. 내용과 순서는 그대로, 자리만 바뀌었습니다. 아래는 그 전의 주석.
          ── CH2 · 프로그램 (DECIDED 2026-09-17 2차) ────────────────────────
          12월 상세. 8월 사이트의 격식(프로그램 · 멘토링 · 달라지는 것)을
          따릅니다. 출처는 빌더톤_2회차_기획.pdf. 카피 위치와 출처 매핑은
          data/naru.ts의 december 블록 주석에 있습니다.

          순서: 모양(숫자 여섯) → 왜 서울인가 → 아쉬웠던 넷과 답 → 일정 →
          멘토링(+ 약속이 지켜지는 지점, 재는 것) → 미정 → 문. 8월 사이트가
          소개 → 프로그램 → 멘토링 → FAQ 순이었던 것과 같은 호흡입니다.

          ⚠️ draftNote를 떼지 마세요. 확정된 것은 이름, 기간, 도시뿐입니다.
          기본 이음매(216px). 장이 바뀌는 자리는 #naru입니다. */}
      {/* 8월 프로그램 챕터의 격식(2026-09-17, 8월 문법 브리프): 섹션 띠(BAND_TINT),
          주황 글자 아이브로 + 발광 H2 + 리드, 숫자 둘, 노선도, 데이 카드 다섯,
          강조 상자(초록·호박), 번호 배지 카드, 플로우 스트립, CTA. 내용과 순서는
          5차 그대로이고 바뀐 것은 보이는 문법입니다.
          DECIDED 2026-09-28 (사용자: 서울과 싱가포르가 보일 때 "너무 어두워서 잘 안보이는 때가 있음"):
          섹션 띠(BAND_TINT)를 걷습니다. 50% 막이라 #december 안의 틈(데스크톱에서 서울이 보이는 유일한
          틈)에서 서울이 절반 밝기였습니다(실측: 캔버스 대비 0.55). 글 뒤는 읽기 판이 가라앉히므로 띠가
          맡던 가독성은 판이 대신합니다. /2026-08의 띠는 그대로입니다(components/shared/Band.tsx). */}
      {/* 2026-10-24 (밀도 브리프 1.6, D4): lg에서 판 안쪽 바닥 여백만 96px → 56px. 챕터 틈(naru-content-chapter 120px, 형상이 보이는 자리)은 그대로. */}
      {/* DECIDED 2026-10-26 (사용자: "스크롤 섹션마다 레이아웃이 제각각"): 홈의 세 챕터(#december, #gains, #partners)는 같은 폭과 같은 세로 리듬입니다.
          머리는 READ, 본문과 판은 WIDE, 위아래는 Chapter 기본 여백(lg 108px). 판끼리의 형상 틈은 120px(108 - 48 판 확장, 두 번)로 모두 같습니다.
          위의 lg:!pb-[56px](2026-10-24)와 챕터 사이 120px 바깥 여백은 이 결정이 대신합니다(globals.css .naru-home-v2 .naru-content-chapter). */}
      <Chapter id="december" labelledBy="december-title" align="center" contentSized>
        <PlateSegment id="december">
        {/* DECIDED 2026-10-21 (2차, brand 2장): 짧은 소개 다음에 전체 일정이 오고, 운영 설명은 일정 뒤 한 묶음으로 읽습니다. */}
        {/* DECIDED 2026-11-05 (사용자: "그 원래 느낌 좋았는데", "상자 5개가 있었잖아 원래 저 부분에", 앞서 "상자들의 내용이 main에 비해 너무 부족"):
            목업의 Day 카드 다섯 칸 모양에 main 일정 판의 내용을 담습니다. 칸마다 stageCard(폰 패널과 같은 왼쪽 정렬 카드): 그날 한 줄, 세션,
            Day 1의 "Day 2에 들고 갈 것"과 AI 유형 테스트 링크, Day 2, 3 미션 띠(누르면 인증 방법)와 시간표 버튼, Day 4 인기투표. 위에 제목과 리드.
            노선도와 폰의 날짜 넘기기는 그리지 않습니다(부품은 남김). 2026-11-04의 한 줄 카드와 main 판 복원은 이 결정이 대신합니다. */}
        {/* DECIDED 2026-11-05 (사용자, 스크린숏 둘: "여기가 왼쪽에, 여기가 오른쪽에"): 제목과 리드는 왼쪽 단, Day 카드 다섯은 오른쪽 단(lg부터). 목업의 배치.
            폭은 히어로, 숫자 띠와 같은 양 끝선(max-w-6xl 안 좌우 40px). 같은 날 앞서 챕터 여백까지 넓혔다가 "너무 넓음"으로 되돌림. 카드 안 버튼은 모서리 둥근 사각형(globals.css [data-schedule]).
            lg 아래는 제목 아래 카드(sm 두 칸, 폰 한 칸). */}
        <div id="schedule" className="mx-auto grid w-full max-w-6xl gap-8 text-left lg:grid-cols-[minmax(0,15rem)_minmax(0,1fr)] lg:gap-10 lg:px-10">
          {/* DECIDED 2026-11-05 (사용자, 스크린숏: 왼쪽 단 "여기가 너무... 또 적어"): 리드 아래에 main의 "팀 구성 / 공간 / 미션" 세 줄(december.facts)을 둡니다.
              lg부터 왼쪽 단은 스크롤 동안 판 옆에 머뭅니다(sticky). */}
          <div className="lg:sticky lg:top-[calc(var(--site-header-height,96px)+24px)] lg:self-start">
            <h2 id="december-title" className={`${H2} max-sm:text-[28px] !mx-0 text-balance`}>{t(naru.december.programHeading)}</h2>
            <p id="mentoring" className={`mt-4 break-keep ${BODY} leading-[1.65] text-naru-muted`}>{t(naru.december.scheduleLead)}</p>
            <dl className="mt-8 flex flex-col">
              {naru.december.facts.map((f) => (
                <div key={f.k.en} className="flex flex-col gap-1.5 border-t border-white/10 py-4">
                  <dt className={`${META} font-bold text-accent`}>{t(f.k)}</dt>
                  <dd className={`break-keep ${BODY} leading-[1.65] text-white/85`}>{t(f.v)}</dd>
                </div>
              ))}
            </dl>
          </div>
          {/* 일정 판(main 배치): Day 0 위 전폭, Day 1~3 세 칸(같은 행 격자: 머리, 한 줄, 세션, 띠, 팀 구성 줄)과 공용 시간표 버튼, Day 4 아래 전폭. */}
          {(() => {
            const P = naru.december.stages.map((st, i) => dayParts(st, i));
            const wide = (k: number, last = false) => (
              // 2026-11-05 (폰 점검: 판 안에서 가운데와 왼쪽이 섞임): Day 0, 4도 Day 1~3처럼 왼쪽.
              <div className={`flex flex-col items-start gap-3 px-4 py-6 text-left sm:px-6 ${last ? "border-t border-white/10" : "border-b border-white/10"}`}>
                {P[k].head(false)}
                <div className="max-w-2xl">{P[k].line}</div>
                {P[k].chips}
                {P[k].flow}
                {P[k].vote && <div className="mt-1 w-full max-w-sm">{P[k].vote}</div>}
              </div>
            );
            return (
              <div data-schedule className="overflow-hidden rounded-2xl card-base text-left">
                {wide(0)}
                <div className="px-4 py-6 sm:px-6">
                  <div className="grid grid-cols-1 gap-y-8 md:grid-cols-3 md:gap-x-6 md:gap-y-3">
                    {[1, 2, 3].map((k) => (
                      <div key={k} className={`flex min-w-0 flex-col gap-3 md:row-span-5 md:grid md:grid-rows-subgrid ${k > 1 ? "max-md:border-t max-md:border-white/10 max-md:pt-8 md:border-l md:border-white/10 md:pl-6" : ""}`}>
                        {P[k].head(false)}
                        {P[k].line}
                        {P[k].session ?? <span aria-hidden className="hidden md:block" />}
                        <div className="flex min-w-0 w-full flex-col gap-1 self-stretch">{P[k].strip}{P[k].flow}</div>
                        {P[k].chips ?? <span aria-hidden className="hidden md:block" />}
                      </div>
                    ))}
                  </div>
                  {timetableButton && (
                    <div className="mt-6 text-center">
                      {timetableButton}
                      {/* 2026-11-05 (사이트 점검, UX): 잠긴 버튼이 언제 열리는지. */}
                      {!TIMETABLE_OPEN && <p className={`mt-[8px] ${META} text-caption`}>{t(naru.december.timetableNote)}</p>}
                    </div>
                  )}
                </div>
                {wide(4, true)}
              </div>
            );
          })()}
          {(() => {
            const st = flowDay != null ? naru.december.stages[flowDay] : null;
            return (
              <DayFlowModal onClose={() => setFlowDay(null)} heading={t(naru.december.dayFlowLabel)} closeLabel={t(naru.december.dayFlowClose)}
                day={st && st.flow ? {
                  dayLabel: `${t(naru.december.dayLabel)} ${st.dayOffset}`,
                  date: formatDecemberDayWithWeekday(locale, st.dayOffset),
                  title: t(st.title),
                  lead: t(st.line),
                  venue: st.logo,
                  rows: st.flow.map((r) => ({ time: r.time, what: t(r.what), where: r.where && t(r.where) })),
                } : null} />
            );
          })()}
        </div>
        {/* DECIDED 2026-11-05 (사용자, 스크린숏: "이 부분 빼줘"): 닷새 장 아래의 등록 블록(스크리닝 한 줄, 여는 날, 버튼 둘, 휴대폰 안내, 기업 출제/후원 문의)을 뺍니다.
            같은 버튼 둘과 여는 날, 조건 없음은 히어로가 말합니다. 헤더 "등록"과 밖의 #register 링크는 페이지 맨 끝 등록 줄(id="register")에 착지합니다.
            기업 문의 메일은 푸터와 나루 홈에 있습니다. 그 전 코드는 git 3905a76. */}
        </PlateSegment>
        {/* DECIDED 2026-10-10 (사용자: "객관적으로 너무 내용이 많다", 중복 브리프 B3): #december의 둘째 판 조각을 홈에서
            내렸습니다. "8월이 남기지 못한 두 가지, 그리고 12월의 답"(카드 둘)과 "그 밖에 바꾼 것"은 8월 페이지 맨 아래의
            #gaps로 갔습니다(2026-10-25에 그 판째 내림). 홈에는 위의 한 줄 링크만 남습니다. 폰의 접힘 단추 하나가
            같이 사라졌습니다. 이 챕터의 판은 이제 하나라 틈도 하나 줄었고, 배경은 판을 DOM에서 읽어 다시 계산합니다
            (BackgroundScene.readAnchors). 같은 자리에 있던 "문제를 찾는 방식" 두 칸 비교는 2026-10-10 앞선 정리에서 내렸습니다.
            december.find, findLabel, gapsHeading, gapsNote, alsoLabel, also 키는 data/naru.ts에 그대로 있습니다. */}

        {/* 끝나면 할 일 (DECIDED 2026-09-18, 사용자: "챕터를 만들지는 말고 기존 포맷에 몇 줄 더").
            팔로업 브리프는 #after 챕터를 제안했지만 사용자가 챕터를 원하지 않아, 아쉬웠던 넷과 같은
            행 형식으로 뒀습니다. 8월에 이 줄이 없어서 이벤트 뒤에 멘토에게 먼저 연락한 팀이
            한 팀이었습니다. after.lead·statement·cadence·weDo 키는 data/naru.ts에 있고 그리지 않습니다.

            2026-09-19 (사용자): **첫 줄 하나만 그립니다.** steps 02(기업이 마지막 날 여는
            기회)와 03(다음 회차에 멘토로 돌아옵니다)은 data/naru.ts에 그대로 있고 화면에서
            내렸습니다. 지우지 않은 이유는 이 레포의 규칙입니다. 되살릴 때 번역을 다시
            쓰지 않아도 되게 둡니다.

            번호 배지와 ol을 함께 뺐습니다. 항목이 하나면 "01"은 셀 것이 없고, 하나짜리
            목록은 목록이 아닙니다. 상자 문법(sm부터 테두리 + 면)은 그대로 두되 폭을
            한 칸이 아니라 전체로 씁니다. 3열 격자에 카드 하나가 남으면 빠진 자리처럼
            읽힙니다. */}
        {/* DECIDED 2026-09-30 (사용자): "끝나면 할 일" 블록은 그리지 않습니다. 그 내용(멘토에게 먼저 연락합니다)은
            위 다섯째 카드 "끝난 뒤 이어지지 않았습니다"의 12월 답이 됐습니다(data/naru.ts record.gaps[4].answer.
            2026-10-07부터는 둘째 카드 record.gaps[1].answer).
            같은 사실을 두 번 말하던 자리였습니다. after.stepsLabel과 steps는 데이터에 그대로 둡니다. */}

        {/* 다음 건너기 (DECIDED 2026-09-29, 9/28 자문): 끝나면 할 일 바로 뒤. 이벤트가 끝나는 곳이 아니라 다음에
            건너갈 곳을 말합니다. 시기가 정해지지 않아 날짜는 쓰지 않습니다(data/naru.ts december.next의 TODO). */}
        {/* DECIDED 2026-09-30 (사용자: "다음 건너기 내용을 넣어줘"): 리드 한 줄 아래에 행 넷(건너는 사람, 맞이하는
            사람, 건너는 이유, 아직). "이렇게 굴립니다"와 같은 행 문법이고 상자가 아닙니다. 라벨은 dl 밖(접근성 감사 9). */}
        {/* DECIDED 2026-09-30 (사용자, 스크린숏: "이부분은 빼줘"): "다음 건너기" 블록은 그리지 않습니다.
            december.nextLabel, next, nextFacts 키는 data/naru.ts에 그대로 둡니다. */}

        {/* DECIDED 2026-09-18 (사용자): "아직 정해지지 않은 것" 상자를 뺐습니다. 미정 목록
            대신 위 draftNote 한 줄("새로 정해지는 것은 이 자리에 업데이트합니다")이 그 말을
            합니다. december.tbd 키는 그대로. */}

        {/* 참여 플로우 스트립(등록 → 팀 본딩 → 닷새 → 결과 공유회)은 뺐습니다(2026-09-18, 감사 반영
            브리프 3.2). 노선도가 데스크톱에서 렌더되는 것을 확인했고, 같은 시간축을 두 번 그리고
            있었습니다. FlowStrip 컴포넌트와 december.flow 키는 그대로. */}

      </Chapter>

      {/* ── CH2 · 오면 무엇이 남는가 (DECIDED 2026-09-17, 홈 흐름 재배치 브리프) ──
          8월 사이트의 "참가하면 무엇을 얻나요?" 자리. 카드 다섯, 제목만(8월 BenefitCard의
          번호 배지 + 제목 문법, 본문 없음). 데스크톱 한 줄 다섯(숫자 스탯 행과 같은
          그리드), 폰은 두 열 + 마지막 한 장 전폭. 아래 한 줄이 "왜 제목뿐인가"의 답.
          8월 참가 혜택 필과 같은 emerald. 기본 이음매. */}
      <Chapter id="gains" labelledBy="gains-title" align="center" contentSized>
        <PlateSegment id="gains">
        {/* DECIDED 2026-09-30 (사용자, 스크린숏): 이 챕터의 머리(알약, h2, 바로 아래 한 줄)는 가운데입니다.
            #december와 #naru의 머리와 같은 축입니다. 아래 다섯 행부터는 왼쪽 끝. */}
        <div className={`${READ} text-center`}><Eyebrow color="purple" className={`${eyebrowTrack(locale)} !mb-0`}>{t(naru.gains.eyebrow)}</Eyebrow></div>
        <h2 id="gains-title" className={`${H2} max-sm:text-[28px] ${READ} mt-[18px] text-balance text-center`}>{t(naru.gains.heading)}</h2>
        {/* 제목 옆의 구체적인 한 줄(가독성 브리프 5, 2026-09-25 사용자 승인). 챕터 머리의 문단. */}
        {/* DECIDED 2026-10-11 (사용자, 스크린숏 둘: "이거 말고, 8월에 display 방식 차용해서"): 다섯 행 목록을 8월 페이지 "참가하면 무엇을
            얻나요?"의 문법으로 바꿨습니다(components/journey/Journey.tsx의 #benefits): 맨 위에 "남기는 단 하나" 판과 ✓ 칩, 그 아래 한 줄,
            그 아래 번호 카드. 2026-09-20에 카드를 행으로 바꾼 결정은 이 요청으로 되돌립니다.
            8월과 다른 점: 색은 cyan이 아니라 홈의 accent(보라), 글자 크기는 홈의 셋(TITLE, BODY, META)만, 카드 안은 가운데입니다
            (같은 날 "뭐는 중간에, 뭐는 left에" 결정). 카드 본문은 불릿이 아니라 한 문장입니다(항목마다 문장이 하나뿐). */}
        <Reveal className={WIDE}>
          {/* DECIDED 2026-10-26: 핵심 문장은 모든 화면에서 보라색 채움 카드로 본문과 구분합니다. */}
          <div className="mt-[32px] rounded-2xl card-tint px-5 py-5 text-center sm:mt-[40px] sm:px-6 sm:py-6">
            {/* 2026-11-05 (폰 점검: "남는 것"이 세 겹, 강조 색 둘): 상자 안 태그("이 닷새에 남는 것")를 빼고 문장은 잉크 한 색. 키(spine.tag, marks)는 남깁니다. */}
            <p className={`mx-auto max-w-[34rem] text-balance break-keep ${BODY} font-bold leading-[1.65] text-white`}>{t(naru.gains.spine.heading)}</p>
            {/* DECIDED 2026-10-20 (hwang 브리프 1.2, 2.6, 감사 W3, W4): ✓칩 셋(알약)을 걷고 한 문장으로. tangibles 키는 남깁니다. */}
            {/* DECIDED 2026-10-23 (사용자: 남는 것 다섯 칸 개편): tangiblesLine(팀의 생각 한 장, 코드로 옮긴 결과물)은 그리지 않습니다.
                바로 아래 02와 04가 같은 말을 합니다. 키는 data/naru.ts에 남깁니다. */}
          </div>
          {/* DECIDED 2026-10-11 (사용자, 스크린숏: "이거 빼줘"): 판 아래의 8월 숫자 한 줄(naru.gains.concrete)은 그리지 않습니다.
              키는 data/naru.ts에 그대로 둡니다. */}
          {/* DECIDED 2026-10-19 (사용자, 스크린숏: "노선하나를 5개가 공유를 하면 좋을거 같은데"): 카드마다 따로 긋던 노선을
              하나로 합쳤습니다. 판 하나의 맨 위에 Day 0~4 노선이 한 번 서고, 다섯 혜택은 그 아래 행이 되어 같은 다섯 칸 위에
              자기 날짜만큼 막대를 긋습니다. 정거장에서 내려오는 옅은 세로줄이 다섯 행을 꿰어 같은 노선이라는 것이 보입니다.
              폰은 행 안에서 글 아래에 막대(가운데 정렬), sm부터는 왼쪽에 글, 오른쪽에 막대. 글자는 BODY와 META만.
              role="list" (2026-09-19, 접근성 감사 10): Safari/VoiceOver가 list-style:none인 목록의 역할을 떼어 냅니다. */}
          {/* DECIDED 2026-10-26 (사용자: "오면 무엇이 남는가 섹션 개박살남. 선택적 좌측단락, 사이즈, 패딩, 간격, 여백"): 핵심 문장 판(가운데) 아래 다섯 행은 모든 폭에서 왼쪽 정렬
              (폰도. 그 전에는 폰만 가운데라 긴 본문이 가운데로 흘렀습니다). 판 안쪽 20/32/48px, 행 위아래 20/24/28px, 제목과 본문 사이 8/10px.
              날마다 옅게 칠하던 세로 띠는 걷었습니다(카드 면 위에서 줄무늬로 읽힘). 폰의 붙는 날 머리는 카드 면 색. */}
          <div className="relative mt-[48px] rounded-2xl card-base px-4 py-1 sm:px-5 sm:py-2 lg:mt-12 lg:px-6 lg:py-2">
            <div className="relative">
              {/* 날마다의 옅은 세로 띠(Day 0, 2, 4). 가는 안내선 대신 칸이 보이게. 머리와 행과 같은 칸 틀입니다. */}
              {/* DECIDED 2026-10-25 (사용자, 폰 스크린숏: "스크롤할때 몇일인지가 모를거 같은데"): 폰에서는 Day 머리가 접힌 헤더(탭 줄 48px)
                  바로 아래에 붙어 01~05를 내리는 동안 남습니다. 판이 끝나면 같이 올라갑니다. 뒤로 막대가 비치지 않게 불투명 바탕을
                  판 가장자리까지(-mx) 깝니다. sm부터는 머리와 행이 한 화면에 들어 그대로입니다. */}
              <div aria-hidden className="relative pb-4 pt-[12px] max-sm:hidden sm:pt-0">
                <GainRouteHead label={t({ ko: "닷새", en: "Five days" })} names={naru.december.stages.map((st) => t(st.title))} />
              </div>
              <ol role="list" className="relative">
                {naru.gains.items.map((item, i) => (
                  <li
                    key={item.num}
                    className={`border-t border-white/[0.08] py-[20px] text-left max-sm:first:border-t-0 max-sm:first:pt-0 sm:grid sm:items-start sm:py-[24px] lg:py-[28px] ${GAIN_COLS}`}
                  >
                    <div className="min-w-0 sm:pr-6" style={{ gridColumn: 1, gridRow: 1 }}>
                      {/* DECIDED 2026-11-04 (site-tells A3): "01~05" 번호 배지를 뺍니다. 줄 높이(min-h-7, 28px)는 남겨 날 막대가 제목 줄 가운데에 그대로 섭니다. */}
                      <div className="flex min-h-7 items-center">
                        <h3 className={ROW_HEADING}>{t(item.title)}</h3>
                      </div>
                      <span className="sr-only">{item.days.map((d) => `Day ${d}`).join(", ")}</span>
                    </div>
                    {/* DECIDED 2026-10-25 (사용자: "그렇다고 이런식으로 침범이 되면 안됨"): 본문은 왼쪽 글 칸(1열) 안에만 둡니다. 날 칸 아래로 넘어가지 않습니다.
                        줄 수는 문장 길이로 맞춥니다(data/naru.ts gains.items). */}
                    <p className={`mt-[8px] break-keep ${BODY} leading-[1.65] text-naru-muted sm:mt-[10px] sm:pr-8`} style={{ gridColumn: 1, gridRow: 2 }}>{t(item.body)}</p>
                    <GainBars days={item.days} split={item.split} />
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </Reveal>
        {/* 2026-09-29 (9/28 자문): 결과물의 두 갈래. 창업만이 끝이 아니라는 한 줄(data/naru.ts gains.uses). */}
        {/* DECIDED 2026-09-30 (사용자, 스크린숏): 다섯 행 아래의 두 줄(gains.uses "만든 것은 두 갈래로 쓰입니다…",
            gains.note "각 항목을 어떻게 운영하는지는…")은 그리지 않습니다. 챕터는 다섯 행에서 끝납니다.
            키는 data/naru.ts에 그대로 둡니다. */}

        </PlateSegment>
      </Chapter>

      {/* ── 함께하는 곳 (DECIDED 2026-10-21, 사용자: 후원 현황 스크린숏과 "이렇게 로고 반영해줘") ──────────────
          현황표의 네 줄(메인 후원, 장소, 기술과 크레딧, 커뮤니티와 홍보)을 그대로 옮겼습니다. 이벤트가 먼저, 나루는 그 뒤라
          나루 티저 바로 앞입니다(brand 3장 원칙 2). 분류, 로고 줄, 한 줄 설명을 모든 폭에서 가운데로 쌓습니다
          (같은 날 사용자: "put the logo at the center". 그 전은 lg에서 왼쪽 분류, 오른쪽 로고).
          로고는 원래 색이고(data/naru.ts decemberPartners) 비율로 높이를 맞춥니다. 링크가 확실한 곳만 새 탭 링크입니다. */}
      {/* 2026-10-26: 위아래 여백은 Chapter contentSized와 같은 값입니다(위 #december 주석). 휘장이 fixed라 Chapter의 isolate 안에 넣지 않고 section 그대로 둡니다. */}
      <section id="partners" aria-labelledby="partners-title" className="naru-content-chapter relative w-full px-6 py-14 sm:px-12 sm:py-20 lg:px-16 lg:py-24">
        {/* DECIDED 2026-10-22 (사용자): 서울 안에서 빛이 비추면 대학교 휘장이 보입니다(학회 로고는 쓰지 않음). 표보다 먼저 두어 표 아래에 깔립니다. */}
        <SeoulCampuses />
        <div className={WIDE}>
          <h2 id="partners-title" className={`${H2} max-sm:text-[28px] text-center`}>{t(decemberPartners.heading)}</h2>
          {/* DECIDED 2026-10-24 (밀도 브리프 1.4, D3): lg에서 다섯 줄을 줄였습니다. 1줄 = 메인 후원(AXMOS + 코어 5개사, 전과 같음), 2줄 = 장소 / 기술, 크레딧 /
              커뮤니티, 홍보 세 묶음이 한 줄(묶음마다 META 라벨 위, 로고 아래, 사이 세로 선). 섹션 위아래 108/126px → 72px. 로고와 글은 그대로. 폰은 그대로.
              같은 날 뒤(사용자, 스크린숏: "주최는 따로 빼주면 좋겠음"): 브리프 D3의 네 묶음에서 주최를 빼 셋째 줄에 따로 둡니다(전처럼 라벨, 로고, 링크 한 줄). */}
          {/* DECIDED 2026-10-24 (폰 밀도 브리프 1.1~1.7, 사용자: "폰도 이렇게 깔끔하면 좋겠다"): 폰(sm 미만)만 묶음 패딩 32 → 20, 로고 사이 45 → 24(코어 상자는 28),
              주최는 sm처럼 한 줄. 전부 max-sm: 추가이고 sm 이상은 그대로. 로고와 글은 그대로. */}
          <ul className="mt-[45px] max-sm:mt-[32px] border-t border-white/10 lg:mt-[48px] lg:grid lg:grid-cols-3">
            {decemberPartners.groups.map((g, gi) => g.lead && (
              <li key={g.label.en} className={`flex flex-col items-center gap-5 border-b border-white/10 py-[40px] text-center max-sm:gap-4 max-sm:py-[32px] ${g.lead ? "lg:col-span-3 lg:py-[64px]" : `lg:px-[16px] lg:py-[32px] ${gi > 1 ? "lg:border-l lg:border-white/10" : ""}`}`}>
                {/* DECIDED 2026-10-21 (사용자: "그냥 로고만 보여줘"): 설명 줄은 없앴습니다.
                    같은 날 (사용자, 스크린숏: "role 도 각 row 마다 넣어줘"): 분류 이름을 다시 보이게. 주최 줄과 같은 META, 로고 위 가운데.
                    같은 날 (사용자: "글자가 더 잘보이게"): white/50 → white/85, 굵게. 크기는 META 그대로. */}
                <p className={`${META} font-semibold text-white/85`}>{t(g.label)}</p>
                {g.lead ? (
                  // DECIDED 2026-10-22 (사용자: "AXMOS라는 컨소시엄 안에 이 5개의 회사가 있다는 느낌을 더 보여줘"): AXMOS가 위, 짧은 선으로
                  // 이어진 테두리 안에 코어 5개사. 테두리는 선만이고 바탕을 칠하지 않습니다(어두운 바탕에 밝은 판 금지).
                  <div className="flex flex-col items-center">
                    {partnerLogo(g.lead, "h-8 sm:h-10")}
                    <p className={`mt-3 ${META} text-caption`}>{t(g.lead.note)}</p>
                    <span aria-hidden className="h-6 w-px bg-white/25 max-sm:h-4" />
                    <div className="flex flex-wrap items-center justify-center gap-x-[45px] gap-y-[22.5px] lg:gap-x-[48px] rounded-2xl card-sunken px-4 py-4 max-sm:gap-x-[28px] max-sm:gap-y-[16px] sm:px-6 sm:py-5">
                      {g.logos.map((l) => partnerLogo(l))}
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-wrap items-center justify-center gap-x-[45px] gap-y-[22.5px] max-sm:gap-x-[24px] max-sm:gap-y-[16px] lg:gap-x-[24px] lg:gap-y-[16px]">
                    {g.logos.map((l) => partnerLogo(l))}
                  </div>
                )}
                {/* 2026-10-24 (사용자: "1일차에 lovable 현장 워크샵 진행"): 줄에 note가 있으면 로고 아래 한 줄. lead의 note와 같은 META, 같은 색. */}
                {g.note && <p className={`${META} text-caption`}>{t(g.note)}</p>}
              </li>
            ))}
            {/* 2026-10-26: 메인 후원 아래 나머지 줄은 로고 띠 하나. 줄의 한 줄 설명(note, Lovable 워크숍)은 띠 아래에 그대로. */}
            {/* 2026-10-26 (사용자: "로고쪽 상하간격 더 줘"): 메인 후원 줄 위아래 lg 48 → 64px, 띠 줄 32 → 56px, 띠 안 로고 칸 위아래 12/20px. */}
            <li className="flex flex-col items-center gap-5 border-b border-white/10 py-[40px] text-center max-sm:py-[32px] lg:col-span-3 lg:py-[56px]">
              <PartnerTicker t={t} />
              {decemberPartners.groups.map((g) => g.note && <p key={g.label.en} className={`${META} text-caption`}>{t(g.note)}</p>)}
            </li>
            {/* DECIDED 2026-10-21 (사용자, 스크린숏: "따로 아래에 주최 박스를 넣지 말고, 나루 로고를 주최에 넣어줘 at the table, 로고 옆에 learn more"):
                아래에 있던 나루 티저 상자를 없애고 이 표의 마지막 줄로. 이벤트가 먼저, 나루는 그 안에서 드러납니다(brand 3장 원칙 2, 6장 나루 = 주최).
                id="naru"는 옛 링크 /#naru와 목차 칩이 여기에 내려앉게 이 줄로 옮겼습니다. */}
            <li id="naru" className="flex flex-col items-center gap-4 border-b border-white/10 py-[32px] text-center max-sm:flex-row max-sm:flex-wrap max-sm:justify-center max-sm:gap-x-[20px] max-sm:gap-y-[12px] max-sm:py-[20px] sm:flex-row sm:justify-center sm:gap-8 lg:col-span-3">
              <p className={`${META} font-semibold text-white/85`}>{t(naru.teaser.eyebrow)}</p>
              <Image
                src={locale === "en" ? "/naru/naru-name-en-paper.svg" : "/naru/naru-name-paper.png"}
                alt={t({ ko: "나루", en: "NARU" })}
                width={604}
                height={168}
                unoptimized={locale === "en"}
                className="block h-8 w-auto sm:h-9"
              />
              <Link
                href={naru.teaser.cta.href}
                onClick={() => track("naru_cta", { src: "partners", to: "naru-page" })}
                className={`tap-44 group inline-flex items-center gap-1.5 ${BODY} font-semibold text-accent transition-colors hover:text-white`}
              >
                {t(naru.teaser.cta.label)}
                <span aria-hidden className={ARROW_CLASS}>→</span>
              </Link>
            </li>
          </ul>
        </div>
      </section>

      {/* DECIDED 2026-11-05 (사이트 점검, UX 치명: 끝까지 읽은 학생이 누를 등록이 없음): 페이지 끝에 히어로와 같은 버튼 줄과 안내 한 줄.
          닷새 장 아래의 큰 등록 블록(같은 날 사용자가 뺌)은 되살리지 않고, 맨 끝 한 줄만 둡니다. */}
      {regState !== "closed" && (
        // 2026-11-05 (사용자: 목차 다시): 목차 "등록"과 밖의 #register 링크가 여기 착지합니다(그 전 같은 날: 히어로 버튼 줄).
        <section id="register" aria-label={t({ ko: "등록", en: "Register" })} className="w-full px-6 pb-16 pt-4 sm:px-12 lg:px-16 lg:pb-24">
          <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 pt-6 text-center lg:px-10">
            <p id="end-register-note" className={`break-keep ${BODY} font-semibold text-white/85`}>{t(regState === "open" ? registerNoteOpen : registerNoteShort)}</p>
            <div className="grid w-fit max-w-full grid-cols-1 gap-3 sm:grid-cols-2 [&>*]:justify-center [&>*]:whitespace-nowrap max-sm:w-full max-sm:[&>*]:whitespace-normal">
              {regState === "open" ? (
                <button type="button" onClick={() => { track("naru_cta", { src: "end", to: reg?.registered ? "registered" : "register" }); reg?.openRegister(); }} className={`group ${buttonClass("primary", "naru")}`}>
                  {t(reg?.registered ? registerCopy.registered : registerCopy.cta)}
                  <span aria-hidden className={ARROW_CLASS}>→</span>
                </button>
              ) : null}
              {regState === "open"
                ? <OpenChatLink t={t} src="naru-december" label={openChatLabels.join} variant="secondary" className={HERO_BUTTON_GROUND} />
                : <OpenChatLink t={t} src="naru-december" label={openChatLabels.december} variant="hero" />}
              {regState === "not_open" && (
                <PreparingButton t={t} noteId="end-register-note" onOpen={() => reg?.openRegister()} className={HERO_BUTTON_GROUND} />
              )}
            </div>
          </div>
        </section>
      )}

      {/* DECIDED 2026-10-21 (사용자): 여기 있던 나루 티저 상자(#naru)는 없앴습니다. 주최는 위 함께하는 곳 표의 마지막 줄입니다. */}
      {/* DECIDED 2026-10-10 (사용자: "나루와 크로싱 서울이 한 페이지에 있어 혼동된다", 구조 브리프 2.2): 여기 있던 #naru, #join,
          (조건부) #people 챕터는 /naru로 옮겼습니다(components/naru/NaruPage.tsx). 삭제가 아니라 이동입니다. */}

      {/* 2026-10-10 (구조 브리프): #record가 /naru로 가서, 홈에서는 #gains가 지나면 나타납니다. */}
      {/* 하단 오픈채팅 바(8월과 같은 것). #record가 지나면 나타나고 푸터가 보이면
          물러납니다. 홈에는 폰 전용 바가 없어서 폰까지 맡습니다(phone).

          main의 **끝**입니다 (2026-09-19, 접근성 감사 21). position: fixed로 화면
          맨 아래에 뜨는 바가 DOM에서는 본문 맨 앞이었습니다. 오픈채팅을 되살리면
          폰에서 main에 들어선 첫 Tab이 화면 아래 끝의 버튼으로 뜁니다. 보이는
          순서와 포커스 순서가 어긋나면 안 됩니다(2.4.3). 지금은 links.openChat이
          빈 문자열이라 렌더되지 않는 잠복 상태였어요. */}
      <MobileChatBar afterId="gains" endId="site-footer" phone />
      </main>

      <SiteFooter page="crossing" />
    </>
  );
}

/**
 * DECIDED 2026-10-26: 문장 안의 구절은 UI 링크 블루로, 로고의 그라데이션은 워드마크에만 씁니다.
 * 새 글자 크기는 만들지 않습니다(한 화면 셋). 구절이 문장에 없으면 칠하지 않고 그대로 둡니다.
 */
function markPhrases(text: string, marks: string[]) {
  const out: ReactNode[] = [];
  let rest = text;
  let k = 0;
  for (const m of marks) {
    const i = rest.indexOf(m);
    if (!m || i < 0) continue;
    if (i > 0) out.push(rest.slice(0, i));
    out.push(
      <span key={k++} className="text-accent">{m}</span>
    );
    rest = rest.slice(i + m.length);
  }
  if (rest) out.push(rest);
  return out;
}

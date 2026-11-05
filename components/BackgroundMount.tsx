"use client";

import dynamic from "next/dynamic";

// WebGL 배경은 클라이언트 전용입니다(ssr: false).
//
// DECIDED 2026-08-24: 히어로 라이브 스트립 하이드레이션 밀림 제거 - 서버가
// 자기 시각을 내려보내고(serverNow) 클라이언트가 그대로 그린 뒤 보정한다.
// / 는 정적 프리렌더에서 ISR(revalidate 300)로 바뀐다.
//
// 이 파일이 생긴 이유가 그것입니다. `dynamic(..., { ssr: false })`는 App Router에서
// 클라이언트 컴포넌트 안에서만 쓸 수 있어서, app/page.tsx 전체가 "use client"였어요.
// 그러면 페이지가 서버에서 자기 시각을 읽을 방법이 없습니다. 이 한 줄만 클라이언트로
// 떼어내면 page.tsx가 서버 컴포넌트가 되고, 나머지 클라이언트 컴포넌트들은 그대로
// 자식으로 들어갑니다.
const Background = dynamic(() => import("@/components/Background"), { ssr: false });

// 8월 페이지는 기본값(입자 필드)을 씁니다. 그 배경은 그 회차의 것입니다.
// 나루 홈은 "water"를 넘겨 나루터 수면을 받습니다.
export type { BackgroundVariant } from "@/lib/background/scene/BackgroundScene";

// still (2026-10-10, 구조 브리프 4): /naru의 정지 장면. water 변형에서만 뜻이 있습니다(BackgroundScene의 still 주석).
// DECIDED 2026-11-04 (사용자, site-tells 2장 안 1 종이, 목업대로): 크림 바탕에서는 WebGL 배경을 그리지 않습니다.
// 장면은 어두운 하늘용이라 밝은 바탕에 맞지 않습니다. 다시 켜려면 PAPER를 false로.
const PAPER = true;
export default function BackgroundMount({ variant, still }: { variant?: "field" | "water" | "crossing"; still?: boolean }) {
  if (PAPER) return null;
  return <Background variant={variant} still={still} />;
}

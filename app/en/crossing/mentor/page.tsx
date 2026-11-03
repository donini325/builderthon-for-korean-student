import type { Metadata } from "next";
import { EN_OG_TITLE, EN_OG_DESCRIPTION, EN_OG_IMAGE } from "@/lib/crossingMeta";
export { default } from "../../../crossing/mentor/page";

// /crossing/mentor의 영문 공유용 사본(2026-11-03, 사용자: "그 영어 링크로 공유를 했을때, 여기가 영어가 아니던데?").
// 화면은 원래 페이지와 같고, 바뀌는 것은 공유 카드의 글뿐입니다. 이유와 구조는 app/en/crossing/page.tsx, middleware.ts.
export const metadata: Metadata = {
  title: "크로싱 서울 멘토 페이지",
  other: { "naru:title-en": "CROSSING SEOUL mentor page | NARU" },
  robots: { index: false, follow: false },
  openGraph: {
    title: EN_OG_TITLE,
    description: EN_OG_DESCRIPTION,
    url: "/crossing/mentor?lang=en",
    siteName: "나루 NARU",
    type: "website",
    locale: "en_US",
    images: [EN_OG_IMAGE],
  },
  twitter: { card: "summary_large_image", title: EN_OG_TITLE, description: EN_OG_DESCRIPTION, images: [EN_OG_IMAGE] },
};

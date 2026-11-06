import { NextResponse, type NextRequest } from "next/server";
import { fixUrl } from "@/lib/fixPath";

// ─────────────────────────────────────────────────────────────────────────────
// 언어별 공유 카드(DECIDED 2026-10-14, 사용자: "영어로 바꾼 뒤 공유하면 받는 사람에게도 영어로, 이미지와 설명도").
//
// ?lang=en으로 온 /, /naru, /2026-08 요청을 app/en/ 아래의 정적 사본으로 다시 씁니다(rewrite). 사본은 같은 화면에
// 영문 og:title, og:description, og:image를 답니다. 주소창의 주소는 바뀌지 않습니다.
// /en, /en/naru, /en/2026-08로 직접 오면 ?lang=en이 붙은 원래 주소로 보냅니다. 같은 화면의 주소를 둘로 만들지 않습니다.
// 카드 그림(/en/**/opengraph-image)은 matcher에 없어서 그대로 나갑니다.
// ─────────────────────────────────────────────────────────────────────────────
// DECIDED 2026-10-26 (naru-first, docs/naru-first-brief.md 1.1): 홈(/)은 나루, 크로싱 서울은 /crossing. /naru는 /로 308(쿼리 그대로).
// /en/naru는 /?lang=en으로 바로. 그 전 홈의 /?register=1은 /crossing?register=1로(등록 프로바이더가 그 페이지에 있습니다).
// 2026-11-03 (사용자: "그 영어 링크로 공유를 했을때, 여기가 영어가 아니던데?"): 시간표, 멘토, 투표, 팀 매칭도 영문 사본으로.
const PAGES = new Set(["/", "/crossing", "/2026-08", "/crossing/team", "/crossing/mentor", "/crossing/vote", "/match"]);

export function middleware(req: NextRequest) {
  const { pathname, searchParams } = req.nextUrl;

  // DECIDED 2026-11-06 (사용자: "링크에 이상이 있어도 왠만하면 올 수 있도록"): 망가진 주소를 먼저 고쳐 봅니다(lib/fixPath.ts).
  // 고칠 것이 없거나 못 고치면 null이라 아래 원래 규칙과 404가 그대로입니다.
  const fixed = fixUrl(pathname, req.nextUrl.search);
  if (fixed) {
    const url = req.nextUrl.clone();
    url.pathname = fixed.pathname;
    url.search = fixed.search;
    url.hash = fixed.hash;
    return NextResponse.redirect(url, 308);
  }

  if (pathname === "/naru" || pathname === "/en/naru") {
    const url = req.nextUrl.clone();
    url.pathname = "/";
    if (pathname === "/en/naru") url.searchParams.set("lang", "en");
    return NextResponse.redirect(url, 308);
  }

  if (pathname === "/" && searchParams.has("register")) {
    const url = req.nextUrl.clone();
    url.pathname = "/crossing";
    return NextResponse.redirect(url, 307);
  }

  if (pathname === "/en" || pathname.startsWith("/en/")) {
    const url = req.nextUrl.clone();
    url.pathname = pathname.slice(3) || "/";
    url.searchParams.set("lang", "en");
    return NextResponse.redirect(url, 308);
  }

  if (PAGES.has(pathname) && searchParams.get("lang") === "en") {
    const url = req.nextUrl.clone();
    url.pathname = pathname === "/" ? "/en" : `/en${pathname}`;
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

export const config = {
  // 2026-11-06: 망가진 주소를 고치려고 페이지 주소 전부를 받습니다. Next 내부, API, 오픈채팅 세기(/go), 공유 카드와 아이콘,
  // 확장자가 있는 파일(이미지, 폰트, PDF 등)은 받지 않습니다. 끝에 "."만 붙은 주소(/crossing.)는 확장자가 아니라 받습니다.
  matcher: [
    "/((?!_next/|api/|go/|.*opengraph-image|.*twitter-image|icon|apple-icon|favicon|sitemap|robots|.*\\.(?:png|jpe?g|svg|webp|gif|avif|ico|woff2?|ttf|otf|mp4|webm|mov|pdf|txt|xml|json|js|mjs|css|map|webmanifest|csv|zip)$).*)",
  ],
};

import "server-only";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

// 공유 카드(app/**/opengraph-image.tsx) 세 장이 같이 쓰는 바탕과 서체.
// DECIDED 2026-10-14 (사용자: "공유했을 때의 설명과 이미지가 정말 수준이 높으면"): 홈, /naru, /2026-08 카드가
// 같은 바탕, 같은 서체, 같은 여백으로 한 벌처럼 보이게 합니다. 전에는 /2026-08만 시스템 서체와 무지개 그라데이션이었습니다.

export const OG_SIZE = { width: 1200, height: 630 };

// DECIDED 2026-11-06 (사용자: "링크를 외부에 공유할떄 나오는 이미지가 tone and manner of the previous version"): 공유 카드를 사이트와 같은
// 종이 팔레트로(brand 10장 2026-11-04). 크림 바탕 하나, 그라데이션과 후광 없음. 그 전: 잉크 #070B1F 위 보라, 자주 후광과 네 색 워드마크(git 6c51071).
export const OG_BACKGROUND = { backgroundColor: "#FCFBF8" } as const;
export const OG_INK = "#141418";
export const OG_MUTED = "#4A4A52";
export const OG_CAPTION = "#6B6964";
export const OG_LINE = "#E3E0D8";
export const OG_NAVY = "#12246B";
export const OG_ORANGE = "#EE8A4F";
export const OG_MAGENTA = "#845185";

// satori는 woff2를 읽지 못해 ttf입니다. 라틴 + 카드 파일에 적힌 한글만 든 서브셋(scripts/build-og-fonts.py).
// 카드에 한글을 새로 쓰면 그 스크립트를 다시 돌리세요. 빠진 글자는 두부로 나옵니다.
export async function loadOgFonts() {
  const dir = join(process.cwd(), "public/fonts");
  const [regular, bold, black] = await Promise.all([
    readFile(join(dir, "Pretendard-OG-Regular.ttf")),
    readFile(join(dir, "Pretendard-OG-Bold.ttf")),
    readFile(join(dir, "Pretendard-OG-Black.ttf")),
  ]);
  return [
    { name: "Pretendard", data: regular, weight: 400 as const, style: "normal" as const },
    { name: "Pretendard", data: bold, weight: 700 as const, style: "normal" as const },
    { name: "Pretendard", data: black, weight: 900 as const, style: "normal" as const },
  ];
}

// /public의 PNG를 data URI로. ImageResponse는 상대 경로를 가져오지 못합니다.
export async function publicPngDataUri(path: string) {
  const buf = await readFile(join(process.cwd(), "public", path));
  return `data:image/png;base64,${buf.toString("base64")}`;
}

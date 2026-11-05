import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./data/**/*.{ts,tsx}",
  ],
  darkMode: "class",
  // DECIDED 2026-10-20 (hwang 브리프 3.3, 시각 브리프 3.5): hover: 변형을 (hover: hover) 미디어 안에서만 만듭니다. 폰에서 누른 뒤 호버 모양이 남지 않게.
  future: { hoverOnlyWhenSupported: true },
  theme: {
    extend: {
      fontFamily: {
        // DECIDED 2026-11-05 (사이트 점검, 실측: 불러온 웹 서체 0개): next/font가 만든 --font-pretendard를 먼저 읽습니다.
        // 그 전에는 "Pretendard Variable"이라는 이름만 있어, 설치하지 않은 기기는 시스템 서체로 그려졌습니다.
        sans: ["var(--font-pretendard)", "Pretendard Variable", "Pretendard", "-apple-system", "sans-serif"],
      },
      // DECIDED 2026-10-26: UI 값은 globals.css가 소유하고 Tailwind는 같은 채널을 읽습니다.
      colors: {
        // DECIDED 2026-11-04 (site-tells 2장 안 1, 종이): white는 글자 잉크(--ui-fg)입니다. 어두운 바탕에서 쓰던 white/NN 반투명이
        // 크림 바탕에서 같은 위계의 잉크 반투명이 됩니다. 진짜 흰색이 필요한 자리(남색 버튼 위 글자)는 #fff를 직접 씁니다.
        white: "rgb(var(--ui-fg) / <alpha-value>)",
        // 밝은 링크 색과 흰 글자를 얹는 버튼 면을 구분합니다.
        accent: "rgb(var(--ui-link) / <alpha-value>)",
        // 모달의 2px 헤어라인은 밝은 블루에서 버튼 블루로 이어집니다.
        "accent-strong": "rgb(var(--ui-primary) / <alpha-value>)",
        action: {
          DEFAULT: "rgb(var(--ui-primary) / <alpha-value>)",
          hover: "rgb(var(--ui-primary-hover) / <alpha-value>)",
        },
        gold: "#fcd34d",
        // 브랜드 원색은 로고용으로 유지합니다. ink/surface/text는 공통 UI 토큰입니다.
        naru: {
          navy: "#12246B",
          purple: "#4B3A8C",
          plum: "#9A5A82",
          // DECIDED 2026-10-08 (사용자 승인, 브랜드 감사 11): 손으로 적던 색 셋에 이름을 붙입니다.
          // plum-tint는 GRADIENT_TEXT의 끝 색이자 자주 글자색(바탕 위 8.15:1). logo-from, logo-to는
          // 히어로 워드마크의 그라데이션(로고 v2)입니다. 값은 그 전과 같습니다.
          // DECIDED 2026-11-04 (사용자, site-tells 2장 안 1 "종이"): 어두운 바탕용 틴트 셋을 brand 10장 종이 팔레트의 짝으로.
          // plum-tint #C79BB4 → 마젠타 #845185, logo-from #9AA8EE → 남색 #12246B, logo-to #C99ACB → 마젠타 #845185.
          "plum-tint": "#845185",
          "logo-from": "#12246B",
          "logo-to": "#845185",
          orange: "#EE8A4F",
          ink: "rgb(var(--ui-ink) / <alpha-value>)",
          surface: "rgb(var(--ui-surface) / <alpha-value>)",
          "surface-2": "rgb(var(--ui-raised) / <alpha-value>)",
          text: "rgb(var(--ui-text) / <alpha-value>)",
          muted: "rgb(var(--ui-muted) / <alpha-value>)",
        },
      },
      maxWidth: {
        wide: "1180px",
        board: "1760px",
      },
    },
  },
  plugins: [],
};

export default config;

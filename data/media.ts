import type { Phrase } from "./dictionaryCore";

// DECIDED 2026-11-13 (사용자: "각 페이지에 미디어 라는 새로운 섹션을 만들어서 각 이벤트 기사 두고, 나루 메인 페이지에 모든 기사 다 놓자"):
// 세 페이지가 같이 읽는 기사 목록입니다. 크로싱 서울은 event "2026-12", 8월 기록은 "2026-08"만, 나루 홈은 전부 그립니다.
// 최신순이고 새 기사는 맨 위에 넣습니다. 제목은 매체가 실은 그대로이고 영어 제목만 옮겨 적었습니다.
// 8월의 셋은 data/naru.ts의 record.press와 같은 내용입니다. CNA와 ST는 보도자료 면에 실린 같은 글이라 한 줄에 링크 둘입니다.

export type MediaEvent = "2026-12" | "2026-08";

export type MediaItem = {
  event: MediaEvent;
  date: Phrase;
  title: Phrase;
  links: { outlet: Phrase; url: string }[];
};

export const mediaEventName: Record<MediaEvent, Phrase> = {
  "2026-12": { ko: "크로싱 서울", en: "CROSSING SEOUL" },
  "2026-08": { ko: "제로백 빌더톤", en: "Zero100 Builderthon" },
};

export const mediaCopy = {
  heading: { ko: "미디어", en: "Media" },
  open: { ko: "새 창에서 열림", en: "opens in a new tab" },
};

export const media: MediaItem[] = [
  {
    event: "2026-12",
    date: { ko: "2026.11.13", en: "13 Nov 2026" },
    title: {
      ko: "기업현장 고민, 싱가포르 한인 유학생과 국내 대학생 함께 푼다···'크로싱 서울' 개최",
      en: "Korean students in Singapore and Korea take on real company problems together at 'CROSSING SEOUL'",
    },
    links: [{ outlet: { ko: "이넷뉴스", en: "enetnews" }, url: "https://www.enetnews.co.kr/news/articleView.html?idxno=56332" }],
  },
  {
    event: "2026-08",
    date: { ko: "2026.09.15", en: "15 Sep 2026" },
    title: {
      ko: "Codepresso Successfully Concludes 'Zero100 AI Builderthon' in Singapore, Forging Strategic Ties with Top Universities",
      en: "Codepresso Successfully Concludes 'Zero100 AI Builderthon' in Singapore, Forging Strategic Ties with Top Universities",
    },
    links: [
      { outlet: { ko: "CNA", en: "CNA" }, url: "https://www.channelnewsasia.com/media-release/codepresso-successfully-concludes-zero100-ai-builderthon-in-singapore-forging-strategic-ties-top-universities-6385241" },
      { outlet: { ko: "The Straits Times", en: "The Straits Times" }, url: "https://www.straitstimes.com/paid-press-releases/codepresso-successfully-concludes-zero100-ai-builderthon-in-singapore-forging-strategic-ties-with-top-universities-20260915" },
    ],
  },
  {
    event: "2026-08",
    date: { ko: "2026.08.04", en: "4 Aug 2026" },
    title: { ko: "‘취업 안되면 만든다’ 스물세살의 바이브 코딩", en: "“If I can't get hired, I'll build it”: vibe coding at 23" },
    links: [{ outlet: { ko: "경인일보", en: "Kyeongin Ilbo" }, url: "https://www.kyeongin.com/article/1768469" }],
  },
  {
    event: "2026-08",
    date: { ko: "2026.07.05", en: "5 Jul 2026" },
    title: { ko: "세계는 넓고 할 일은 많다", en: "“The world is wide, and there's much to do”" },
    links: [{ outlet: { ko: "BZCF 비즈까페", en: "BZCF" }, url: "https://bzcf.io/segyeneun-neolbgo-hal-ileun-manhda/" }],
  },
];

import { type Phrase } from "@/data/dictionaryCore";

// DECIDED 2026-11-13 (사용자: "8월 기록 웹사이트에 모든 디자인 스킬 잘 사용하고 표현도 ai 티 안나게. 필요 없으면 지우고"):
// 8월 기록(/2026-08)의 새 화면 문구. 나루 홈, 크로싱 서울과 같은 해요체이고, 끝난 행사라 지난 일로 적습니다.
// 모집하던 때의 안내(참가 대상, 혜택, FAQ, 체크인, 시간표)는 이제 할 일이 없는 문장이라 이 화면에서 뺐습니다. 옛 화면은 components/journey/Journey.tsx에 그대로 있습니다.
// 숫자는 data/naru.ts의 record.stats와 같습니다. Day 1 참석 수(58/59)는 자료마다 달라 쓰지 않습니다(brand 8장).
// 한국어의 \n은 데스크톱에서 줄을 나누는 자리입니다(Lines).

export const copy = {
  dateLine: { ko: "2026년 8월 22일부터 29일까지, 싱가포르", en: "22 to 29 August 2026, Singapore" } as Phrase,
  title: { ko: "제로백 빌더톤", en: "Zero100 Builderthon" } as Phrase,
  lead: {
    ko: "나루는 이 8일에서 시작했어요.\n스크리닝 없이 들어온 학생들이 실제 회사의 문제를 받아 풀고 마지막 날 그 회사 앞에서 발표했어요.",
    en: "NARU started with these eight days.\nStudents came in with no screening, took a real company's problem, and presented to that company on the last day.",
  } as Phrase,
  host: {
    ko: "Zero100 커뮤니티의 AXMOS 소속 회사들이 주최했고 문제는 그중 코드프레소가 냈어요.",
    en: "Hosted by AXMOS member companies of the Zero100 community. Codepresso, one of them, set the problem.",
  } as Phrase,

  numbersHeading: { ko: "74명이 신청했고 21팀이 끝까지 왔어요", en: "74 applied, and 21 teams made it to the end" } as Phrase,
  numbers: [
    { value: { ko: "74명", en: "74" }, label: { ko: "신청", en: "applied" } },
    { value: { ko: "25팀", en: "25" }, label: { ko: "첫날 팀을 꾸림", en: "teams formed on Day 1" } },
    { value: { ko: "21팀", en: "21" }, label: { ko: "마지막 날 발표", en: "presented on the last day" } },
    { value: { ko: "9팀", en: "9" }, label: { ko: "출제사에 직접 자료를 요청", en: "asked the problem owner for data" }, note: { ko: "아무도 시키지 않았어요", en: "Nobody told them to" } },
  ] as { value: Phrase; label: Phrase; note?: Phrase }[],

  daysHeading: { ko: "8일", en: "Eight days" } as Phrase,
  daysLead: {
    ko: "첫 이틀은 문제를 받고 배웠고 가운데 닷새는 멘토를 만나며 만들었어요.\n마지막 날에는 문제를 낸 회사 앞에 섰고요.",
    en: "The first two days were for the problem and the basics, the middle five for building with mentors.\nOn the last day, teams stood in front of the company that set the problem.",
  } as Phrase,
  // 날마다 한 줄. data/schedule.ts의 theme은 모집 때 카드 라벨이라 낱말이 붙어 있어 여기서 문장으로 다시 적었습니다(영어는 schedule.ts 그대로).
  dayThemes: {
    1: { ko: "오프닝, 문제 공개", en: "Opening, problem release" },
    2: { ko: "크래시코스", en: "Crash course" },
    3: { ko: "만들면서 1:1 멘토링", en: "Build, with 1:1 mentoring" },
    4: { ko: "만들면서 1:1 멘토링", en: "Build, with 1:1 mentoring" },
    5: { ko: "중간 점검", en: "Mid-point check" },
    6: { ko: "각자 만드는 날", en: "Self-paced build" },
    7: { ko: "파이널 리허설", en: "Final rehearsal" },
    8: { ko: "결과 공유회", en: "Showcase" },
  } as Record<number, Phrase>,

  photosHeading: { ko: "사진", en: "Photos" } as Phrase,
  photosCaption: { ko: "제로백 빌더톤", en: "Zero100 Builderthon" } as Phrase,

  awardsHeading: { ko: "순위 대신 부문으로", en: "Categories, not rankings" } as Phrase,
  awardsLead: { ko: "1등, 2등을 가리지 않았어요. 네 부문에서 열 팀이 상을 받았어요.", en: "No first or second place. Ten teams were recognised across four categories." } as Phrase,

  peopleHeading: { ko: "함께한 사람들", en: "The people" } as Phrase,
  peopleLead: {
    ko: "소속과 상관없이, 개인 시간을 내서 와 준 분들이에요.",
    en: "They came on their own time, separately from where they work.",
  } as Phrase,
  speakersLabel: { ko: "연사", en: "Speakers" } as Phrase,
  judgesLabel: { ko: "피드백 패널", en: "Feedback panel" } as Phrase,
  mentorsLabel: { ko: "멘토", en: "Mentors" } as Phrase,

  partnersHeading: { ko: "함께한 곳", en: "Partners" } as Phrase,
  partnersNote: { ko: "2026년 8월 행사 당시의 표기 그대로예요.", en: "As credited at the time, August 2026." } as Phrase,
  hostLabel: { ko: "주최", en: "Host" } as Phrase,
  organizersLabel: { ko: "주관", en: "Organizers" } as Phrase,
  sponsorsLabel: { ko: "후원", en: "Sponsors" } as Phrase,

  thanksHeading: { ko: "고마운 이름들", en: "Thank you" } as Phrase,
  thanks: [
    { ko: "문제를 낸 회사", en: "The company that set the problem" },
    { ko: "저녁 시간을 내 준 멘토들", en: "The mentors who gave their evenings" },
    { ko: "무대에 선 연사와 전문가들", en: "The speakers and expert reviewers" },
    { ko: "1:1 멘토링에 회관을 내어 준 싱가포르 한인회", en: "The Korean Association in Singapore, for its hall" },
    { ko: "각 학교 한인 학생회 운영진", en: "The student associations at each school" },
    { ko: "그리고 마지막 날 무대에 선 21팀", en: "And the 21 teams on the final day" },
  ] as Phrase[],
  thanksClose: { ko: "이 이름들이 지금의 나루를 만들었어요.", en: "Those names are what NARU is made of." } as Phrase,

  nextLine: { ko: "다음 자리는 12월, 서울이에요.", en: "Next up: December, in Seoul." } as Phrase,
  nextCta: { ko: "크로싱 서울 보기", en: "See CROSSING SEOUL" } as Phrase,
};

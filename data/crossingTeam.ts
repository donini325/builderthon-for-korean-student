// ─────────────────────────────────────────────────────────────────────────────
// 현장 도구(/crossing/team)의 글(2026-10-17). 모든 팀이 같이 보는 멘토 시간표와 Day 2, Day 3 미션 인증.
// 쓰는 말은 docs/brand.md 5장, 7장을 따릅니다(미션, 성과 공유회. 심사, 과제는 쓰지 않음).
// ─────────────────────────────────────────────────────────────────────────────

import type { Phrase } from "@/data/dictionaryCore";

// 2026-11-06 (사용자: 한국어와 영어 문장 길이를 같게, 한국어가 정본): 영문만 줄임.
export const teamCopy = {
  title: { ko: "멘토 시간표와 미션 인증", en: "Mentors and check-in" },
  // 2026-10-23 (모바일 점검): /match처럼 돌아가기와 EN/KR이 있는 머리를 둡니다. 그 전에는 제목으로 바로 시작했습니다.
  back: { ko: "크로싱 서울", en: "Crossing Seoul" },
  swipeHint: { ko: "옆으로 밀면 다른 멘토의 칸이 보입니다.", en: "Swipe sideways for the other mentors' slots." },
  timetableHeading: { ko: "멘토 시간표", en: "Mentor timetable" },
  teamLabel: { ko: "우리 팀", en: "Your team" },
  teamPick: { ko: "팀을 고르세요", en: "Pick your team" },
  // DECIDED 2026-11-06 (docs/first-click-brief.md F5): 팀이 아직 0이면 select를 끄고 이 한 줄. 열어 봐도 고를 것이 없고 왜 없는지 말이 없었습니다.
  teamsLater: { ko: "팀은 Day 1 현장에서 맺고, 그날 이 목록에 생깁니다.", en: "Teams form on site on Day 1 and appear here that day." },
  pickFirst: { ko: "팀을 고르면 인증 올리기와 시간표 칸 넣기가 열립니다.", en: "Pick your team to unlock uploads and timetable slots." },
  // 2026-10-26: Day 1 탭에는 시간표가 없어(TeamTool) 안내에서 시간표를 뺍니다.
  pickFirstDay1: { ko: "팀을 고르면 인증 올리기가 열립니다.", en: "Pick your team to unlock uploads." },
  dayTab: { ko: "Day", en: "Day" },
  // 2026-10-26 (사용자: "업로드 한 파일을 멘토들이 볼 수 있도록 이라고 워딩을 바꿔줘"): 멘토마다 자기 링크(/crossing/mentor)에서 자기 칸에 들어온 팀의 파일을 엽니다.
  carry: { ko: "우리 팀이 올린 파일은 칸을 넣은 멘토가 각자의 멘토 링크에서 열어 볼 수 있습니다.", en: "The mentors you book can open the files your team uploaded from their own mentor link." },
  notYet: { ko: "아직 열리지 않았습니다. Day 1(12.18) 12:00부터 넣을 수 있습니다.", en: "Not open yet. You can add slots from Day 1 (Dec 18) at 12:00." },
  day1BookHint: { ko: "Day 2, 3 멘토 칸은 Day 1(12.18) 12:00부터 Day 2, Day 3 탭에서 넣습니다.", en: "From Day 1 (Dec 18) at 12:00, add your Day 2 and 3 mentor slots in the Day 2 and Day 3 tabs." },
  // 2026-10-18 (사용자: "트랙에 따라서 슬롯 색깔이 달라졌으면"). 2026-11-05 (docs/merge-paper-brief.md T2): 종이에서 우리 팀 칸은 남색 테두리.
  trackLegend: { ko: "칸의 색은 그 팀의 트랙입니다. 남색 테두리는 우리 팀입니다.", en: "Colour is the track. Navy outline is your team." },
  time: { ko: "시간", en: "Time" },
  gap: { ko: "쉬는 10분", en: "10-minute gap" },
  past: { ko: "지남", en: "Past" },
  confirmPut: { ko: "넣기?", en: "Put in?" },
  noMentors: { ko: "이 날 시간을 연 멘토가 아직 없습니다.", en: "No mentors have opened times on this day yet." },
  errTaken: { ko: "방금 다른 팀이 들어간 칸입니다.", en: "Another team just took that cell." },
  errTeamBusy: { ko: "우리 팀의 다른 칸과 시간이 겹칩니다.", en: "This overlaps another of your team's slots." },
  // 2026-11-03: 이틀 통틀어 한 번에 한 칸. 시간표 위 안내로도 씁니다.
  errPending: { ko: "우리 팀이 넣은 멘토링이 끝나면 다음 칸을 넣을 수 있습니다.", en: "Your team can add the next slot once its booked session is over." },
  errPast: { ko: "지난 시간입니다.", en: "That time has passed." },
  errNotYet: { ko: "Day 1(12.18) 12:00부터 넣을 수 있습니다.", en: "Slots open on Day 1 (Dec 18) at 12:00." },
  errGeneric: { ko: "잠시 뒤 다시 해 주세요.", en: "Try again in a moment." },

  proofHeading: { ko: "미션 인증", en: "Mission check-in" },
  proofLead: {
    // DECIDED 2026-10-26 (사용자): 멘토 찾아가기는 Day 2, 3 날마다 팀이 함께. 10/17의 "하루 이상" 완화를 되돌립니다.
    // DECIDED 2026-10-26 (사용자: "진척 pdf가 새로운 pdf를 만드는 것이 아니고, 기존 내용을 멘토의 피드백과 팀들의 progress에 맞추어 updated 된 pdf"):
    ko: "멘토의 피드백과 그날의 진척에 맞춰 고친 1장(PDF)과, 팀이 함께 멘토와 찍은 사진을 올립니다. 현장 출석은 운영진이 체크합니다.",
    en: "Upload your updated page (PDF) and a team photo with the mentor. Organisers check attendance.",
  },
  proofPhoto: { ko: "멘토와 함께 찍은 인증 사진", en: "Photo with the mentor" },
  // 2026-10-26: 진척 PDF는 새 문서가 아니라 고쳐 올린 1장입니다.
  proofPdf: { ko: "고쳐 올린 1장 (PDF)", en: "Your updated one page (PDF)" },
  // DECIDED 2026-10-26 (사용자: "day 3에는 pdf를 제출하는 것이 아니고, 발표자료를 제출하는 걸로, slide in pdf"): Day 3의 PDF는 발표 자료입니다.
  proofLeadDay3: { ko: "발표 자료(슬라이드 PDF)와, 팀이 함께 멘토와 찍은 사진을 올립니다. 현장 출석은 운영진이 체크합니다.", en: "Upload your presentation (slides as a PDF) and a photo of the team with the mentor. The organisers check who is on site." },
  proofPdfDay3: { ko: "발표 자료 (슬라이드 PDF)", en: "Presentation (slides as PDF)" },
  proofPdfHintDay3: { ko: "성과 공유회에서 발표할 슬라이드를 PDF로 내보내 올립니다.", en: "Export the slides you will present at the showcase as a PDF." },
  proofPdfHint: { ko: "새로 만들지 않습니다. 지금까지의 1장을 멘토의 피드백과 그날의 진척에 맞춰 고쳐 올립니다.", en: "Not a new document. Update the one page you have with the mentor's feedback and the day's progress." },
  // Day 1은 PDF 하나(2026-10-17 사용자). 홈 Day 1 카드의 "Day 2에 들고 갈 것"과 같은 물건입니다.
  proofPdfDay1: { ko: "이슈에 대한 팀의 생각 1장 (PDF)", en: "One page of the team's take on the issue (PDF)" },
  // 2026-10-19 (사용자: Day 1 미션 뺌): Day 1 올리기는 선택입니다.
  // DECIDED 2026-10-26 (사용자: "올리면 팀이 멘토분들에게 사전에 공유줄 수 있도록"): 올린 1장은 우리 팀이 칸을 넣은 멘토가 멘토 페이지(/crossing/mentor)에서 미리 봅니다.
  proofLeadDay1: { ko: "Day 1은 미션이 없습니다. 이슈에 대한 팀의 생각 1장을 PDF로 올려 두면, 우리 팀이 칸을 넣은 멘토가 찾아가기 전에 미리 봅니다.", en: "There is no mission on Day 1. Upload one page of your team's take on the issue as a PDF, and the mentors you book will read it before you visit." },
  proofPick: { ko: "파일 고르기", en: "Choose a file" },
  // DECIDED 2026-10-26 (사용자: "폰에서는 사진이 바로 갤러리에서 올릴 수 있으면 좋겠고, 파일은 폰의 파일이나 노트북에서 바로, either choose or by dragging"):
  // 노트북은 상자에 끌어다 놓거나 고르기, 폰은 갤러리(사진)와 파일 앱(PDF)에서 바로 고르기.
  proofDrop: { ko: "여기로 끌어다 놓거나", en: "Drag a file here, or" },
  // DECIDED 2026-11-06 (docs/first-click-brief.md F7): 팀을 고르기 전 업로드 상자의 글. 파일 고르기 알약은 숨깁니다(눌러도 조용했음).
  proofNeedTeam: { ko: "팀을 고르면 올릴 수 있습니다", en: "Pick your team to upload" },
  proofDropActive: { ko: "놓으면 골라집니다", en: "Drop to choose" },
  proofPickPhotoPhone: { ko: "갤러리에서 사진 고르기", en: "Choose from your photos" },
  proofPickPdfPhone: { ko: "파일에서 PDF 고르기", en: "Choose a PDF from Files" },
  // 같은 날(사용자: "여기에 있는 기능들은 폰으로는 할 수 없도록 for the participants"): 칸 넣기는 노트북이나 PC에서. 폰은 시간표 보기만.
  phoneNotice: { ko: "칸 넣기는 노트북이나 PC에서 합니다. 폰에서는 시간표를 보기만 할 수 있습니다. 인증 사진과 PDF는 폰에서도 올릴 수 있습니다.", en: "Book slots from a laptop or PC. On a phone you can only view the timetable. Photos and PDFs can be uploaded from a phone." },
  errPhone: { ko: "칸 넣기는 노트북이나 PC에서 합니다.", en: "Please book from a laptop or PC." },
  rulesHeading: { ko: "넣는 규칙", en: "How booking works" },
  // 시간표 넣는 규칙(2026-10-26 카드 여섯 장). DECIDED 2026-11-03 (사용자): 규칙의 목적은 모든 팀이 한 번은 멘토님을 만나는 것과
  // 멘토님께 무리가 가지 않는 것이라, 남길 규칙만 한 줄로 씁니다. 정본은 lib/crossingOps.ts(SESSION_MINUTES, teamHasPending, BOOKING_OPENS_AT).
  // 같은 날 사용자: 이동 시간을 생각해 무리하게 붙여 잡지 않게 하는 한 줄을 더합니다(멘토는 오피스, 카페에 계시고 팀이 찾아감, brand 7장).
  rulesLine: { ko: "팀마다 한 번에 한 칸, 40분입니다. 넣은 멘토링이 끝나면 다음 칸을 넣을 수 있습니다. 12.18 12:00에 열리고, 넣은 칸은 바꿀 수 없습니다.", en: "One 40-minute slot per team at a time; book the next once it ends. Opens Dec 18, 12:00. No changes." },
  travelLine: { ko: "멘토님이 계신 곳(오피스, 카페)까지 가는 시간을 생각해, 다른 일정과 바로 붙여 무리하게 잡지 마세요.", en: "Allow travel time to the mentor's office or café; don't book back-to-back." },
  // 2026-10-26 (사용자: 한 번만 올리기, 하루가 끝나기 전에 신중하게): 고른 뒤 한 번 더 묻고 올립니다.
  // 같은 날 이어서(사용자: "잘못 업로드 하면 운영진에게 알려달라"): 운영진이 crossing_mission_proofs의 그 행을 지우면 다시 올릴 수 있습니다.
  proofOnce: { ko: "사진과 PDF는 날마다 한 번씩만 올릴 수 있고, 올린 뒤에는 바꿀 수 없습니다. 그날이 끝나기 전에 확인하고 올려 주세요. 잘못 올렸다면 운영진에게 알려 주세요.", en: "One photo and PDF a day, no changes after. Check before the day ends. Wrong file? Tell the organisers." },
  proofConfirm: { ko: "이 파일로 올리기", en: "Upload this file" },
  proofTeamCheck: { ko: "{team} 팀으로 올립니다. 올린 뒤에는 바꿀 수 없습니다.", en: "Uploading as team {team}. You cannot change it afterwards." },
  proofCancel: { ko: "다시 고르기", en: "Choose again" },
  proofLocked: { ko: "제출한 파일은 이 페이지에서 보이지 않고 바꿀 수 없습니다. 칸을 넣은 멘토만 열어 봅니다. 잘못 올렸다면 운영진에게 알려 주세요.", en: "A submitted file is not shown here and cannot be changed. Only the mentors you book can open it. If it was the wrong file, tell the organisers." },
  proofAlready: { ko: "이 날은 이미 제출했습니다. 바꿔야 하면 운영진에게 알려 주세요.", en: "Already submitted for this day. Tell the organisers if it needs to change." },
  proofUploading: { ko: "올리는 중", en: "Uploading" },
  proofDone: { ko: "제출되었습니다", en: "Submitted" },
  proofDoneChip: { ko: "제출 완료", en: "Done" },
  proofNone: { ko: "아직 없음", en: "Not yet" },
  // 2026-10-26 (사용자: 올리는 상자마다 용량 한도를 표시): {mb}는 lib/crossingOps.ts PROOF_MAX_BYTES에서 채웁니다.
  proofLimitPhoto: { ko: "JPG, PNG, HEIC 사진, {mb}MB까지", en: "JPG, PNG or HEIC photo, up to {mb} MB" },
  proofLimitPdf: { ko: "PDF 파일, {mb}MB까지", en: "PDF file, up to {mb} MB" },
  proofTooBig: { ko: "이 파일은 {mb}MB까지 올릴 수 있습니다.", en: "This file can be up to {mb} MB." },
  proofBadType: { ko: "사진은 JPG, PNG, HEIC, 문서는 PDF로 올립니다.", en: "Photos as JPG, PNG or HEIC. Documents as a PDF." },
} satisfies Record<string, Phrase>;

// 멘토를 부르는 말. DECIDED 2026-11-03 (사용자: "정확히 성함이 있어야지", "맨토님"): 이름은 DB crossing_mentors.name에만 두고
// (레포에 쓰지 않음, 운영진 문서 크로싱서울_멘토링크 기준), 화면에서 한국어는 "OOO 멘토님"으로 부릅니다. 아직 자리 이름("멘토 01")이면 붙이지 않습니다.
// 2026-11-06: 이름을 밝힐 수 없는 멘토는 서버가 이름 대신 하는 일을 보냅니다(lib/crossingOpsServer.ts publicMentorName). 영문 화면은 nameEn.
export const mentorTitle = (name: string, locale: string, nameEn?: string): string =>
  locale === "en" && nameEn ? nameEn : locale === "ko" && !name.startsWith("멘토") ? `${name} 멘토님` : name;

// 멘토 페이지(/crossing/mentor?k=)의 글(2026-10-26). 멘토가 찾아올 팀과 그 팀의 1장을 미리 봅니다.
// 2026-11-06 (사용자: 한국어와 영어 문장 길이를 같게, 한국어가 정본): 영문만 줄임.
export const mentorCopy = {
  title: { ko: "멘토 페이지", en: "Mentor page" },
  lead: {
    ko: "같은 날 맡은 멘토님들의 칸이 함께 보입니다. 내 칸에 들어온 팀의 파일은 표 아래에서 누르면 새 창에서 열립니다.",
    en: "You can see every mentor's slots on your day. Files from the teams that booked you are below the table and open in a new tab.",
  },
  refresh: { ko: "1분마다 새로 읽습니다.", en: "Refreshes every minute." },
  day: { ko: "Day", en: "Day" },
  // DECIDED 2026-11-02 (사용자: "팀이 없습니다 이런식으로 말고 뭔가 좀 더 visual"): 빈 날도 그 멘토의 칸 띠를 그리고, 아래 한 줄로 무엇이 뜰지 말합니다.
  empty: { ko: "팀이 칸을 넣으면 그 시간에 팀 이름이 뜨고, 아래에 그 팀의 파일이 붙습니다.", en: "When a team books a slot, its name appears at that hour and its files show up below." },
  // DECIDED 2026-11-03 (사용자: "본인이 맡지 않는 날은 그냥 없애는 걸로"): 맡지 않은 날은 구획째 그리지 않습니다.
  // 이 한 줄은 맡은 날이 하나도 없을 때(보류, 예비 자리)만 뜹니다.
  offDay: { ko: "아직 맡은 날이 없습니다.", en: "No day assigned to you yet." },
  openSlot: { ko: "빈 칸", en: "Open" },
  // 2026-11-03 (사용자: 같은 날 맡은 다른 멘토의 칸도 보이게): 표의 머리와 맡은 시간 줄.
  me: { ko: "내 칸", en: "You" },
  time: { ko: "시간", en: "Time" },
  assigned: { ko: "맡은 시간", en: "Your session" },
  slotCount: { ko: "{n}칸 중 {b}팀", en: "{b} of {n} slots booked" },
  // 2026-10-26: 팀이 올린 PDF를 날마다 하나씩(Day 1 1장, Day 2 고친 1장, Day 3 발표 자료). 인증 사진은 내보내지 않습니다.
  file1: { ko: "Day 1 이슈에 대한 생각 1장", en: "Day 1 one page on the issue" },
  file2: { ko: "Day 2 고친 1장", en: "Day 2 updated page" },
  file3: { ko: "Day 3 발표 자료", en: "Day 3 slides" },
  notYet: { ko: "아직", en: "Not yet" },
  teamCount: { ko: "{n}팀", en: "{n} teams" },
  // DECIDED 2026-11-05 (사용자: 출제사와 정리한 PDF를 멘토 페이지에서. 참가자에게는 공개하지 않음): 멘토 페이지 맨 위 묶음.
  briefsTitle: { ko: "출제사와 정리한 이슈", en: "Company issue write-ups" },
  briefsLead: {
    ko: "멘토님만 보시는 자료입니다. 참가자에게는 공개하지 않으니 파일과 링크를 전달하지 말아 주세요. 링크는 30분 뒤 닫히고, 이 페이지가 1분마다 새로 엽니다.",
    en: "These are for mentors only and are not shared with participants, so please don't forward the files or links. Links expire after 30 minutes; this page renews them every minute.",
  },
  briefsEmpty: { ko: "출제사와 정리한 자료가 올라오면 여기에 뜹니다.", en: "Write-ups will appear here once they are ready." },
  badLink: { ko: "링크가 맞지 않습니다. 운영진에게 다시 받아 주세요.", en: "Wrong link. Ask the organisers for a new one." },
  errGeneric: { ko: "잠시 뒤 다시 열어 주세요.", en: "Reopen in a moment." },
  // DECIDED 2026-11-07 (사용자: /crossing 멘토 모달 스크린숏과 함께 "비슷한 내용대로 맨토 페이지도 update, 현업의 감각이라고 했을때 나의 의도를 맨토들에게 전달"):
  // 멘토링 안내 PDF 2장(현업의 감각을 들려주세요)과 같은 말. 학생 쪽 모달의 넷을 멘토에게 부탁하는 말로 씁니다.
  // "현업의 감각"의 뜻은 brand 7장(멘토는 도메인 지식이 아니라 일을 해 본 사람의 감각으로 반박)과 멘토 브리프 4장("실제로는 그렇게 안 돌아간다")에서.
  guideTitle: { ko: "현업의 감각을 들려주세요", en: "Share your sense of the work" },
  guideLead: {
    ko: "멘토링은 도메인 지식보다 현업의 감각을 전하는 자리입니다. 좋은 것을 만드는 것과 팔 수 있는 것은 다르고, 그 차이를 만드는 감각을 일해 본 분께 듣고 싶습니다.",
    en: "Mentoring is about the sense of the work more than domain knowledge. Making something good and being able to sell it are different, and we want students to hear what makes that difference from people who have done the work.",
  },
  senseLabel: { ko: "현업의 감각이라고 할 때", en: "What we mean by the sense of the work" },
  // 같은 날 뒤(사용자, 시각 점검 뒤 "반영해줘"): 넷이던 문장을 둘로. "도메인 지식이 아니라"는 바로 위 리드가 말하고, "충분"은 아래 머리와 겹쳐 뺍니다.
  senseBody: {
    ko: "누가 값을 치르고 결재하는지, 이 일이 실제로 누구 책상에서 어떻게 돌아가는지, 새 도구가 왜 현장에서 안 쓰이는지. 학생들은 AI로 무엇이든 금방 만들지만 이 감각은 일해 봐야 생기니, 팀이 들고 온 1장과 시안에 \"실제로는 그렇게 안 돌아간다\"를 그대로 말씀해 주세요.",
    en: "Who pays and who signs off, how the task really runs on someone's desk, why a new tool goes unused on the floor. Students can build almost anything quickly with AI, but this sense only comes from working, so tell a team, about its one page and draft, \"that is not how it works in practice.\"",
  },
  guideCardsLabel: { ko: "이런 이야기면 충분합니다", en: "This kind of thing is enough" },
  guideCards: [
    { title: { ko: "솔직한 첫 반응", en: "An honest first reaction" }, quote: { ko: "\"나라면 안 샀을 것 같아요\"", en: "\"I don't think I would have bought it.\"" }, body: { ko: "이해가 안 된다, 안 살 것 같다는 말이 오히려 가장 도움이 됩니다.", en: "\"I don't get it\" or \"I wouldn't buy it\" helps most." } },
    { title: { ko: "누구에게 가져가나", en: "Who they take it to" }, quote: { ko: "\"과장님께 어떻게 발표할래요?\"", en: "\"How would you present this to your manager?\"" }, body: { ko: "누구에게 먼저 말하고, 그다음 누구를 설득할지 짚어 주세요.", en: "Point out who to tell first, and who to win over next." } },
    { title: { ko: "하나만 남기기", en: "Keep just one" }, quote: { ko: "\"하나만 풀면 되지 않을까요?\"", en: "\"Couldn't you solve just one?\"" }, body: { ko: "모든 걸 해결하려는 팀에게 막힌 곳 하나를 고르도록 도와주세요.", en: "Help a team that wants to solve everything pick the one place it is stuck." } },
    { title: { ko: "일하며 겪은 이야기", en: "Stories from the work" }, quote: { ko: "\"제가 처음 일할 때는요\"", en: "\"When I first started working...\"" }, body: { ko: "꼭 제품 조언이 아니어도 됩니다. 커리어 이야기도 큰 도움이 됩니다.", en: "It need not be product advice. Career stories help a lot too." } },
  ] as { title: Phrase; quote: Phrase; body: Phrase }[],
  noJudgeLabel: { ko: "판단하지 않는 자리", en: "No judging" },
  noJudge: {
    ko: "반박은 솔직하게 해 주시되, 점수는 매기지 않습니다. 8월 학생들이 끝까지 남은 건 판단받지 않고 자기 이야기를 할 수 있어서였습니다.",
    en: "Push back honestly, but no scores. In August, students stayed to the end because they could tell their own story without being judged.",
  },
};

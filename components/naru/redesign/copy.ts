import { naru, partnerContact } from "@/data/naru";
import { type Phrase } from "@/data/dictionaryCore";

// DECIDED 2026-11-07 (redesign/crossing 브랜치): 나루 홈 전용 한국어 문구. 크로싱 서울(components/crossing/redesign/copy.ts)과 같은 해요체입니다.
// 영어는 data/naru.ts의 원문 그대로입니다. 태그라인 두 줄, 매니페스토 표지의 한 줄, 역할 이름(주관, 주최, 후원)은 바꾸지 않았습니다.
// 한국어의 \n은 데스크톱에서 줄을 나누는 자리입니다(Lines). 폰에서는 이어서 흐릅니다.

const ko = (text: string, from: Phrase): Phrase => ({ ko: text, en: from.en });
const kos = (texts: string[], from: readonly Phrase[]): Phrase[] =>
  from.length === texts.length ? texts.map((x, i) => ko(x, from[i])) : [...from];

// 층의 순서는 data/naru.ts 그대로입니다: 나루(주최), 학생회(주관), 기업(후원).
const [naruLayer, school, company] = naru.how.layers;

export const copy = {
  groupName: ko("나루는 한국에 뿌리를 둔 학생 그룹이에요. 학생이 직접 꾸리고, 돈을 벌려는 곳이 아니죠.\n이벤트로 학생을 모으는 데서 끝내지 않고, 모인 사람들이 그 뒤로도 이어지게 하는 게 나루의 일이에요.", naru.group.name),
  groupConcrete: ko("건너는 건 각자의 몫이에요. 나루는 그 전에 연습할 자리를 열 뿐이죠.\n먼저 건넌 사람이 돌아와, 다음 사람에게 노 젓는 법을 알려 주는 곳.", naru.group.concrete),

  eventsHeading: ko("함께한 곳, 함께할 곳", naru.events.label),
  decemberLine: ko("어느 나라에 있든, 한인 학생이 모여 먼저 생각해 보는 닷새예요.", naru.december.heading),
  recordLine: ko("나루는 2026년 8월, 싱가포르의 제로백 빌더톤에서 시작했어요.", naru.record.lead2),
  recordCta: ko("8월 기록 보기", naru.record.cta),
  next: ko("다음 자리도 열릴 거예요. 장소는 그때 함께하는 학생회와 회사가 정하기로 했어요.", naru.events.next),

  coreHeading: ko("우리가 만들려는 건 두 가지예요", naru.why.heading),
  coreTitles: kos(["안전하게 도전해 보는 자리", "내가 할 수 있는 걸 보여 주는 경험"], naru.why.cores.map((c) => c.title)),
  coreLines: kos(
    [
      "아이디어가 없어서 말을 못 하는 게 아니에요.\n평가받지 않고 말해 볼 자리가 없었을 뿐이죠.\n그래서 여기선 점수를 매기지 않아요. 대신 끝까지 들어 줄 현업이 곁에 있어요.",
      "회사는 증명해 보라는데, 학생은 내밀 게 없어요.\n혼자 만든 걸로는 증명이 잘 안 되거든요.\n여기선 회사의 실제 이슈로 만들고, 멘토와 같이 고쳐서, 보여 줄 걸 들고 나가요.",
    ],
    naru.why.cores.map((c) => c.lines[0]),
  ),
  coreKeeps: kos(["학점도 이력서도 안 봐요.\n상은 부문별로, 기준은 결과물보다 과정.", "모든 팀이 실제 회사의 이슈를 받아요."], naru.why.cores.map((c) => c.keeps)),
  note: ko("문턱이 낮아야 사람이 모이고, 롤모델이 있어야 자라요.", naru.why.note),
  noteBody: ko("문턱만 낮으면 친목 모임이 되고, 롤모델만 있으면 몇 사람만의 클럽이 되고 말죠. 그래서 둘 다 지켜요.", naru.why.noteBody),
  agendaLabel: ko("방법은 바뀌어요", naru.why.agendaLabel),
  agenda: ko("AI도 기간도 방법일 뿐이라, 8일이던 행사가 이번에는 닷새가 됐어요.\n지금 익히는 노 젓는 법이 바로 AI를 쓰는 법이죠.", naru.why.agenda),

  howHeading: ko("이렇게 일해요", naru.how.heading),
  brings: kos(["학생회와 회사를 잇고,\n먼저 건넌 선배가 후배의 연습 자리를 열어요.", "소속 학생, 공간, 학교 안의 이름", "아직 손으로 하는 일 하나, 자금, 멘토"], [naruLayer.brings, school.brings, company.brings]),
  gets: kos(
    [
      "회차마다 기록이 쌓이고,\n다음 자리를 열 사람이 생겨요.",
      "학교 안에서는 못 하는 닷새를 부원들에게 줄 수 있어요.\n임원에게는 임기가 끝나도 이어지는 동료가 생기죠.",
      "두 나라 학교에서 온 학생들이\n한 이슈를 서로 다르게 푸는 모습을, 닷새 만에.",
    ],
    [naruLayer.gets, school.gets, company.gets],
  ),
  companyLabel: ko("이슈를 내는 회사가 얻는 것", naru.how.companyLabel),
  companyBodies: kos(
    [
      "이력서가 아니라 반박받고 고치는 모습으로 만나는, 한국과 싱가포르 학생들.",
      "팀마다 다른 병목과 툴을 들고 와요. 안에서는 묻지 않던 전제가 드러나요.",
      "첫날의 생각이 반박을 거쳐 마지막 날의 툴이 되기까지, 처음부터 지켜보실 수 있어요.",
      "더 얘기하고 싶은 팀 하나와 자리를 만들어 드려요. 꼭 도입하실 필요는 없어요.",
    ],
    naru.how.company.map((c) => c.body),
  ),
  ask: ko("회사에 먼저 부탁드리는 건 두 가지예요. 아직 손으로 하는 일 하나를 들려주실 30분, 그리고 멘토로 와 주실 반나절.", partnerContact.ask),

  whyHeading: ko("왜 이런 자리가 필요할까요?", naru.join.heading),
  whyLead: ko("한인 학생은 어디에나 있는데, 서로 만날 일이 없어요.", naru.join.lead),
  lacks: kos(
    [
      "학교마다 한인 학생은 있죠. 없었던 건 다른 학교와도, 한국과도 이어질 자리예요.",
      "학교가 다르거나 나라가 다르면, 같은 문제를 놓고 만날 자리가 없었어요.",
      "한국말을 쓰는 또래가 여러 나라에 흩어져 있는데, 서로 있는 줄도 몰라요.",
    ],
    naru.join.needs.map((n) => n.lack),
  ),
  milestones: ko("세 곳 모두 경쟁이 치열해요. 학점, 인턴, 졸업, 오퍼 같은 눈앞의 칸부터 채우느라\n'나는 어디로 갈 수 있지?'를 물어볼 시간이 없는 거예요.", naru.join.milestones),
  closingStatement: ko("절박하지 않아도\n시작할 수 있도록.", naru.join.closingStatement),
  closingBody: kos(["문 두드리는 법은 보통 절박해진 다음에야 배워요.\n연습도 안 시켜 놓고 왜 못 하냐고 물을 수는 없잖아요. 그래서 그 연습을 미리 열어요."], naru.join.closingBody),
  manifestoBody: ko("왜 모였는지, 그리고 무엇이 바뀌어도\n그대로 둘 게 뭔지 적어 둔 문서예요.", naru.join.manifesto.body),
};

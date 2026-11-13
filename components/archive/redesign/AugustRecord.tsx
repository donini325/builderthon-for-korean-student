"use client";

// DECIDED 2026-11-13 (사용자: "8월 기록 웹사이트에 모든 디자인 스킬 잘 사용하고 표현도 ai 티 안나게. 필요 없으면 지우고"):
// /2026-08의 새 화면. 나루 홈, 크로싱 서울과 같은 종이 바탕과 글자 다섯 단(components/shared/redesign.tsx)입니다.
// 이 페이지는 이제 기록이라, 모집하던 때의 장(취지, 참가 대상, 혜택, 체크인, 시간표, FAQ)은 뺐고 남은 일을 순서대로 적습니다.
//   #top       날짜, 이름, 무엇이었는지, 첫날 사진
//   #numbers   신청에서 발표까지 줄어든 순서(깔때기라 순서가 곧 정보)
//   #days      8일, 크로싱 서울의 노선과 같은 점과 선
//   #photos    사진 열두 장
//   #awards    네 부문
//   #people    연사, 피드백 패널, 멘토
//   #partners  당시 표기 그대로의 주최, 주관, 후원
//   #media     기사(data/media.ts의 2026-08)
//   #thanks    고마운 이름들, 다음 자리
// 옛 화면은 components/journey/Journey.tsx에 그대로 있습니다.

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useLocale } from "@/lib/LocaleContext";
import { naru } from "@/data/naru";
import { dict } from "@/data/dictionary";
import { days } from "@/data/schedule";
import PhotoLightbox, { warmPhoto } from "@/components/shared/PhotoLightbox";
import MediaList from "@/components/shared/MediaList";
import { mediaCopy } from "@/data/media";
import { SiteFooter } from "@/components/home/shared";
import { copy as C } from "./copy";
import { DISPLAY, TITLE, HEADING, BODY, META, INK, SOFT, NAVY, RULE, FRAME, BTN_PRIMARY, Lines } from "@/components/shared/redesign";

type Logo = { src: string; alt: string; w: number; h: number };

const HOSTS: Logo[] = [
  { src: "/partners/logos/white/trimmed/translink.png", alt: "Translink Investment", w: 330, h: 91 },
  { src: "/partners/logos/white/trimmed/wilt.png", alt: "Wilt Venture Builder", w: 309, h: 148 },
  { src: "/partners/logos/white/trimmed/codepresso.png", alt: "Codepresso", w: 456, h: 91 },
  { src: "/partners/logos/white/trimmed/popup-studio.png", alt: "Popup Studio", w: 512, h: 245 },
  { src: "/partners/logos/white/trimmed/drimaes.png", alt: "Drimaes", w: 332, h: 50 },
];
const ORGANIZERS: Logo[] = [
  { src: "/partners/logos/white/trimmed/smu-lion.png", alt: "SMU KSA", w: 292, h: 173 },
  { src: "/partners/logos/white/trimmed/nus.png", alt: "NUS Korea Society", w: 512, h: 512 },
  { src: "/partners/logos/white/trimmed/ntu-ksa.png", alt: "NTU KSA", w: 318, h: 382 },
];
const SPONSORS: string[] = [
  "aws:AWS", "innovate360:INNOVATE 360", "life:L^IFE", "bzcf:BZCF", "korean-association:Korean Association in Singapore", "nuldam:Nuldam",
  "haenyeo-kitchen:Jeju Haenyeo", "onword-lab:Onword Lab", "remited:REmited", "brandboost:Brand Boost", "hashed:Hashed",
];

/** 로고 한 칸. 흰 카드 가운데에 높이를 맞춰 둡니다(크로싱 서울의 후원 칸과 같은 카드).
 *  8월 로고는 어두운 배경용 흰 파일(white/trimmed)뿐이라 brightness-0으로 먹색 한 색이 되게 합니다. */
function LogoCard({ src, alt, w, h }: { src: string; alt: string; w?: number; h?: number }) {
  return (
    <li className="flex h-[5.5rem] items-center justify-center rounded-2xl bg-[#FFFFFF] px-4 ring-1 ring-[#E3E0D8] lg:h-24">
      <Image src={src} alt={alt} width={w ?? 300} height={h ?? 120} unoptimized className="block h-auto max-h-10 w-auto max-w-[8.5rem] object-contain brightness-0 opacity-75" />
    </li>
  );
}

/** 이름 목록 한 묶음. 사람마다 이름과 소속 한 줄. */
function People({ label, people }: { label: string; people: { name: string; org: string }[] }) {
  return (
    <div>
      <h3 className={`text-[1.125rem] font-bold leading-[1.4] lg:text-[1.25rem] ${INK}`}>{label}</h3>
      <ul className={`mt-3 border-t ${RULE}`}>
        {people.map((p) => (
          <li key={p.name} className={`flex flex-wrap items-baseline justify-between gap-x-4 gap-y-0.5 border-b ${RULE} py-3`}>
            <span className={`${BODY} font-semibold ${INK}`}>{p.name}</span>
            <span className={`break-keep text-right ${META} ${SOFT}`}>{p.org}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Section({ id, title, lead, children, className = "" }: { id: string; title: string; lead?: string; children: React.ReactNode; className?: string }) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className={`mt-14 lg:mt-20 ${className}`}>
      <div className={FRAME}>
        <div className="grid gap-4 lg:grid-cols-12 lg:gap-12">
          <h2 id={`${id}-title`} className={`break-keep ${TITLE} ${NAVY} lg:col-span-5`}>{title}</h2>
          {lead && <p className={`break-keep ${BODY} ${SOFT} lg:col-span-7 lg:pt-2`}><Lines text={lead} /></p>}
        </div>
        <div className="mt-6 lg:mt-8">{children}</div>
      </div>
    </section>
  );
}

export default function AugustRecord() {
  const { t } = useLocale();
  const rec = naru.record;
  const photos = rec.photos;
  const [photoOpen, setPhotoOpen] = useState<number | null>(null);
  const hero = photos[0];

  const speakers = dict.speakers.people.map((p) => ({ name: t(p.name), org: t(p.role) }));
  const judges = dict.judges.people.map((p) => ({ name: t(p.name), org: t(p.org) }));
  const mentors = dict.mentoring.mentors.map((p) => ({ name: t(p.name), org: t(p.org) }));

  return (
    <>
      <main id="main" tabIndex={-1} className="naru-min12 bg-[#FCFBF8] focus:outline-none">
        {/* ── 히어로 ─────────────────────────────────────────────── */}
        <section id="top" aria-labelledby="aug-title" className="pt-[calc(var(--site-header-height,96px)+28px)] lg:pt-[calc(var(--site-header-height,96px)+40px)]">
          <div className={FRAME}>
            <p className={`${HEADING} ${INK}`}>{t(C.dateLine)}</p>
            <h1 id="aug-title" className={`mt-2 break-keep ${DISPLAY} ${NAVY}`}>
              {t(C.title)}<span aria-hidden className="text-naru-orange">.</span>
            </h1>
            <div className="mt-6 grid gap-8 lg:mt-8 lg:grid-cols-12 lg:gap-12">
              <div className="lg:col-span-6 lg:pt-1">
                <p className={`break-keep ${HEADING} ${INK}`}><Lines text={t(C.lead)} /></p>
                <p className={`mt-5 max-w-[34rem] break-keep ${BODY} ${SOFT}`}>{t(C.host)}</p>
              </div>
              <figure className="lg:col-span-6">
                <button
                  type="button"
                  aria-haspopup="dialog"
                  onPointerEnter={() => warmPhoto(hero.src)}
                  onClick={() => setPhotoOpen(0)}
                  className="relative block aspect-[4/3] w-full cursor-zoom-in overflow-hidden rounded-[18px] bg-[#F6F4EE] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-naru-navy"
                >
                  <Image src={hero.src} alt={t(hero.alt)} fill priority sizes="(max-width: 1023px) 100vw, 560px" className="object-cover" />
                </button>
              </figure>
            </div>
          </div>
        </section>

        {/* ── 숫자: 신청에서 발표까지 ─────────────────────────────── */}
        <Section id="numbers" title={t(C.numbersHeading)}>
          <ol className={`grid border-t ${RULE} sm:grid-cols-2 lg:grid-cols-4`}>
            {C.numbers.map((n, i) => (
              <li key={i} className={`border-b ${RULE} py-5 sm:pr-6 lg:border-b-0 lg:py-6 ${i > 0 ? "lg:border-l lg:pl-6" : ""}`}>
                <p className={`${TITLE} tabular-nums ${i === 3 ? "text-naru-orange" : NAVY}`}>{t(n.value)}</p>
                <p className={`mt-1 break-keep ${BODY} font-semibold ${INK}`}>{t(n.label)}</p>
                {n.note && <p className={`mt-0.5 ${META} ${SOFT}`}>{t(n.note)}</p>}
              </li>
            ))}
          </ol>
        </Section>

        {/* ── 8일 ─────────────────────────────────────────────── */}
        <Section id="days" title={t(C.daysHeading)} lead={t(C.daysLead)}>
          <ol className="relative">
            <span aria-hidden className="absolute bottom-6 left-[5px] top-6 w-px bg-naru-navy/25" />
            {days.map((d) => (
              <li key={d.day} className={`relative grid gap-x-8 border-b ${RULE} py-4 pl-8 sm:grid-cols-[9rem_minmax(0,1fr)] lg:grid-cols-[11rem_minmax(0,1fr)]`}>
                <span aria-hidden className={`absolute left-0 top-[24px] z-10 block h-3 w-3 rounded-full ${d.day === 8 ? "bg-naru-orange" : "border-[1.5px] border-naru-navy bg-[#FCFBF8]"}`} />
                <p className={`${BODY} font-bold tabular-nums ${NAVY}`}>
                  Day {d.day} <span className={`ml-2 font-semibold ${SOFT}`}>{d.date.replace(".", "/")} {t(d.weekday)}</span>
                </p>
                <p className={`break-keep ${BODY} ${INK}`}>{t(C.dayThemes[d.day])}</p>
              </li>
            ))}
          </ol>
        </Section>

        {/* ── 사진 ─────────────────────────────────────────────── */}
        <Section id="photos" title={t(C.photosHeading)}>
          <ul className="grid grid-cols-2 gap-2 sm:gap-3 lg:grid-cols-3">
            {photos.map((p, i) => (
              <li key={p.src}>
                <button
                  type="button"
                  aria-haspopup="dialog"
                  onPointerEnter={() => warmPhoto(p.src)}
                  onClick={() => setPhotoOpen(i)}
                  className="relative block aspect-[4/3] w-full cursor-zoom-in overflow-hidden rounded-xl bg-[#F6F4EE] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-naru-navy"
                >
                  <Image src={p.src} alt={t(p.alt)} fill sizes="(max-width: 1023px) 50vw, 360px" className="object-cover" />
                </button>
              </li>
            ))}
          </ul>
        </Section>

        {/* ── 어워드 ─────────────────────────────────────────────── */}
        <Section id="awards" title={t(C.awardsHeading)} lead={t(C.awardsLead)}>
          <ul className={`grid border-t ${RULE} lg:grid-cols-2 lg:gap-x-12`}>
            {dict.program.awards.items.map((a) => (
              <li key={a.name.en} className={`border-b ${RULE} py-5`}>
                <p className={`${HEADING} ${INK}`}>{t(a.name)}</p>
                <p className={`mt-1 break-keep ${BODY} ${SOFT}`}>{t(a.desc)}</p>
              </li>
            ))}
          </ul>
        </Section>

        {/* ── 사람 ─────────────────────────────────────────────── */}
        <Section id="people" title={t(C.peopleHeading)} lead={t(C.peopleLead)}>
          <div className="grid gap-10 lg:grid-cols-3 lg:gap-12">
            <People label={t(C.speakersLabel)} people={speakers} />
            <People label={t(C.judgesLabel)} people={judges} />
            <People label={t(C.mentorsLabel)} people={mentors} />
          </div>
        </Section>

        {/* ── 함께한 곳 ─────────────────────────────────────────────── */}
        <Section id="partners" title={t(C.partnersHeading)} lead={t(C.partnersNote)}>
          <div className="flex flex-col gap-8">
            <div>
              <h3 className={`text-[1.125rem] font-bold leading-[1.4] lg:text-[1.25rem] ${INK}`}>{t(C.hostLabel)}</h3>
              <div className="mt-3 flex items-center gap-5 rounded-2xl bg-[#F0EEE8] px-5 py-4 lg:px-7">
                <Image src="/partners/logos/paper/axmos-wordmark.png" alt="AXMOS" width={600} height={120} unoptimized className="block h-7 w-auto shrink-0" />
                <span className={`min-w-0 break-keep ${META} ${SOFT}`}>{t(dict.partners.axmosTagline)}</span>
              </div>
              <ul className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-5">{HOSTS.map((l) => <LogoCard key={l.alt} {...l} />)}</ul>
            </div>
            <div className={`border-t ${RULE} pt-6`}>
              <h3 className={`text-[1.125rem] font-bold leading-[1.4] lg:text-[1.25rem] ${INK}`}>{t(C.organizersLabel)}</h3>
              <ul className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">{ORGANIZERS.map((l) => <LogoCard key={l.alt} {...l} />)}</ul>
            </div>
            <div className={`border-t ${RULE} pt-6`}>
              <h3 className={`text-[1.125rem] font-bold leading-[1.4] lg:text-[1.25rem] ${INK}`}>{t(C.sponsorsLabel)}</h3>
              <ul className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                {SPONSORS.map((s) => {
                  const [file, alt] = s.split(":");
                  return <LogoCard key={file} src={`/partners/logos/white/trimmed/${file}.png`} alt={alt} />;
                })}
              </ul>
            </div>
          </div>
        </Section>

        {/* ── 미디어 ─────────────────────────────────────────────── */}
        <Section id="media" title={t(mediaCopy.heading)}>
          <MediaList event="2026-08" src="aug" />
        </Section>

        {/* ── 고마운 이름들 ─────────────────────────────────────────────── */}
        <Section id="thanks" title={t(C.thanksHeading)} className="pb-16 lg:pb-20">
          <ul className={`border-t ${RULE}`}>
            {C.thanks.map((x, i) => (
              <li key={i} className={`border-b ${RULE} py-3 break-keep ${BODY} ${INK}`}>{t(x)}</li>
            ))}
          </ul>
          <p className={`mt-6 break-keep ${HEADING} ${NAVY}`}>{t(C.thanksClose)}</p>
          <div className="mt-10 flex flex-col gap-4 rounded-2xl bg-[#F0EEE8] px-5 py-5 sm:flex-row sm:items-center sm:justify-between lg:px-7">
            <p className={`break-keep ${HEADING} ${INK}`}>{t(C.nextLine)}</p>
            <Link href="/crossing" className={`${BTN_PRIMARY} shrink-0`}>{t(C.nextCta)}</Link>
          </div>
        </Section>
      </main>

      <PhotoLightbox
        photos={photos.map((p) => ({ src: p.src, alt: t(p.alt), width: p.width, height: p.height, caption: p.day && `${t(C.photosCaption)} ${t(p.day)}` }))}
        index={photoOpen}
        onIndex={setPhotoOpen}
        onClose={() => setPhotoOpen(null)}
        labels={{ close: t(naru.eventHero.photoClose), prev: t(naru.eventHero.photoPrev), next: t(naru.eventHero.photoNext) }}
      />
      <SiteFooter page="aug" />
    </>
  );
}

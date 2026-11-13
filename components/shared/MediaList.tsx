"use client";

import { track } from "@vercel/analytics";
import { useLocale } from "@/lib/LocaleContext";
import { media, mediaCopy, mediaEventName, type MediaEvent } from "@/data/media";
import { HEADING, META, INK, SOFT, NAVY, RULE } from "@/components/shared/redesign";

/**
 * DECIDED 2026-11-13 (사용자: 각 페이지에 미디어 섹션): 기사 목록. 줄마다 매체와 날짜, 그 아래 제목이 링크입니다.
 * event를 주면 그 행사의 기사만, 주지 않으면 전부(나루 홈)이고 그때는 줄마다 어느 행사의 기사인지 붙입니다.
 * 같은 글이 두 매체에 실렸으면 제목은 한 번, 매체 이름이 각각 링크입니다.
 */
export default function MediaList({ event, src }: { event?: MediaEvent; src: string }) {
  const { t } = useLocale();
  const items = event ? media.filter((m) => m.event === event) : media;
  const ext = { target: "_blank", rel: "noopener noreferrer" } as const;
  const linkCls = `underline decoration-naru-navy/25 underline-offset-[5px] transition-colors hover:decoration-naru-navy focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-naru-navy`;
  return (
    <ul className={`border-t ${RULE}`}>
      {items.map((m) => {
        const one = m.links.length === 1 ? m.links[0] : null;
        return (
          <li key={m.links[0].url} className={`grid gap-1.5 border-b ${RULE} py-5 lg:grid-cols-[11rem_minmax(0,1fr)] lg:gap-8 lg:py-6`}>
            <p className={`${META} tabular-nums ${SOFT} lg:pt-1`}>
              {!event && <span className={`block font-semibold ${INK}`}>{t(mediaEventName[m.event])}</span>}
              {t(m.date)}
            </p>
            <div className="min-w-0">
              <p className={`${META} font-semibold ${SOFT}`}>
                {m.links.map((l, i) => (
                  <span key={l.url}>
                    {i > 0 && ", "}
                    {one ? t(l.outlet) : (
                      <a href={l.url} {...ext} onClick={() => track("naru_media", { src, to: t(l.outlet) })} className={`${NAVY} ${linkCls}`}>
                        {t(l.outlet)}<span className="sr-only"> ({t(mediaCopy.open)})</span>
                      </a>
                    )}
                  </span>
                ))}
              </p>
              {one ? (
                <a href={one.url} {...ext} onClick={() => track("naru_media", { src, to: t(one.outlet) })} className={`mt-1 inline break-keep ${HEADING} ${INK} ${linkCls}`}>
                  {t(m.title)}<span aria-hidden className={`ml-1.5 ${META} ${SOFT}`}>↗</span><span className="sr-only"> ({t(mediaCopy.open)})</span>
                </a>
              ) : (
                <p className={`mt-1 break-keep ${HEADING} ${INK}`}>{t(m.title)}</p>
              )}
            </div>
          </li>
        );
      })}
    </ul>
  );
}

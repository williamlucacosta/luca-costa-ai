"use client"

import { SectionLabel } from "@/components/section-label"
import Link from "next/link"
import { useRef } from "react"
import { ArrowUpRight } from "lucide-react"
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap"
import { Counter } from "@/components/gsap-text"
import { CaseVisual } from "@/components/work/case-visual"
import { localePath } from "@/content/profile"
import { useContent } from "@/content/locale-context"

/**
 * Case studies on a horizontal track: on desktop the section pins and vertical scroll
 * drives the track sideways; each card's artwork parallaxes against it. On small screens
 * it degrades to a plain vertical list.
 */
export function CaseGallery() {
  const root = useRef<HTMLElement>(null)
  const track = useRef<HTMLDivElement>(null)
  const c = useContent()
  const t = c.ui.work

  useGSAP(
    () => {
      if (prefersReducedMotion()) return
      const mm = gsap.matchMedia()
      mm.add("(min-width: 1024px)", () => {
        const el = track.current!
        const distance = () => el.scrollWidth - window.innerWidth + 80
        const tween = gsap.to(el, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 0.6,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              const bar = root.current?.querySelector<HTMLElement>(".cg-progress")
              if (bar) bar.style.transform = `scaleX(${self.progress})`
            },
          },
        })
        // inner parallax + gentle tilt as each card crosses the viewport
        gsap.utils.toArray<HTMLElement>(".cg-art").forEach((art) => {
          gsap.fromTo(
            art,
            { xPercent: 3, scale: 1.06 },
            {
              xPercent: -3,
              scale: 1,
              ease: "none",
              scrollTrigger: { trigger: art, containerAnimation: tween, start: "left right", end: "right left", scrub: true },
            }
          )
        })
      })
      return () => mm.revert()
    },
    { scope: root }
  )

  return (
    <section ref={root} id="work" aria-labelledby="work-title" className="relative overflow-hidden lg:h-svh">
      <div className="flex h-full flex-col justify-center py-24 lg:py-0">
        <div className="mx-auto w-full max-w-[1360px] px-5 md:px-10">
          <SectionLabel label={t.label} id="work-title" className="mb-4 md:mb-5" />
        </div>
        <div className="mx-auto mb-10 flex w-full max-w-[1360px] flex-wrap items-end justify-between gap-6 px-5 md:px-10 lg:mb-12">
          <div>
            <p className="font-display text-2xl font-medium text-foreground/70 md:text-4xl">
              {t.sub[0]} <span className="text-gradient">{t.sub[1]}</span>
            </p>
          </div>
          <div className="w-full max-w-xs lg:w-64">
            <p className="text-sm text-muted-foreground">{t.intro}</p>
            <div className="mt-4 hidden h-px overflow-hidden bg-border lg:block">
              <div className="cg-progress h-full origin-left scale-x-0 bg-signal" />
            </div>
          </div>
        </div>

        <div ref={track} className="flex flex-col gap-5 px-5 md:px-10 lg:w-max lg:flex-row lg:gap-6 lg:pl-[max(2.5rem,calc((100vw-1360px)/2+2.5rem))]">
          {c.caseStudies.map((cs, i) => (
            <Link
              key={cs.slug}
              href={localePath(c.locale, `/work/${cs.slug}/`)}
              className="group relative grid shrink-0 gap-6 overflow-hidden rounded-3xl border border-border bg-card/55 p-5 backdrop-blur-xl transition-colors hover:border-foreground/20 md:p-7 lg:h-[min(58svh,540px)] lg:w-[min(78vw,1080px)] lg:grid-cols-[1fr_1.15fr]"
            >
              <div className="flex flex-col">
                <div className="flex items-center justify-between font-mono text-[11px] tracking-wider text-muted-foreground uppercase">
                  <span>
                    <span className="text-signal">{String(i + 1).padStart(2, "0")}</span> · {cs.kind}
                  </span>
                  <span>{cs.period}</span>
                </div>

                <h3 className="mt-6 font-display text-5xl font-semibold tracking-[-0.05em] md:text-7xl lg:mt-auto">{cs.name}</h3>
                <p className="mt-4 max-w-md text-muted-foreground md:text-lg">{cs.oneLiner}</p>

                <dl className="mt-8 grid grid-cols-2 gap-6 border-t border-border pt-6">
                  {cs.metrics.slice(0, 2).map((m) => (
                    <div key={m.label}>
                      <dd className="font-display text-2xl font-semibold md:text-3xl">
                        <Counter value={m.value} decimals={m.decimals} prefix={m.prefix} suffix={m.suffix} />
                      </dd>
                      <dt className="mt-1 text-xs text-muted-foreground">{m.label}</dt>
                    </div>
                  ))}
                </dl>

                <span className="mt-7 inline-flex w-fit items-center gap-2 text-sm font-medium">
                  {t.read}
                  <span className="grid size-8 place-items-center rounded-full bg-foreground text-background transition-all duration-500 ease-expo group-hover:rotate-45 group-hover:bg-signal group-hover:text-signal-foreground">
                    <ArrowUpRight className="size-4" />
                  </span>
                </span>
              </div>

              <div className="relative min-h-80 overflow-hidden rounded-2xl">
                <div className="cg-art absolute -inset-x-[4%] inset-y-0">
                  <CaseVisual slug={cs.slug} hue={cs.hue} className="size-full rounded-none border-0" />
                </div>
              </div>
            </Link>
          ))}
          <div aria-hidden className="hidden w-[10vw] shrink-0 lg:block" />
        </div>
      </div>
    </section>
  )
}

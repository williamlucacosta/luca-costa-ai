"use client"

import { SectionLabel } from "@/components/section-label"
import { useRef } from "react"
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap"
import { RevealGroup, ScrubWords, SplitReveal } from "@/components/gsap-text"
import { SpotlightCard } from "@/components/spotlight-card"
import { useContent } from "@/content/locale-context"

/* ── Statement ─────────────────────────────────────────────── */

export function Statement() {
  const c = useContent()
  return (
    <section aria-label={c.ui.statement} className="mx-auto max-w-[1360px] px-5 py-40 md:px-10 md:py-56">
      <ScrubWords
        text={c.statement}
        className="max-w-5xl font-display text-[clamp(2.4rem,6vw,5.6rem)] leading-[1.02] font-semibold tracking-[-0.05em]"
      />
      <RevealGroup className="mt-14 max-w-xl md:ml-[30%]">
        <p data-reveal className="text-lg leading-relaxed text-muted-foreground">
          {c.about}
        </p>
      </RevealGroup>
    </section>
  )
}

/* ── Principles ────────────────────────────────────────────── */

function Glyph({ i }: { i: number }) {
  return (
    <svg viewBox="0 0 64 64" className="size-14" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" aria-hidden>
      {i === 0 && (
        <>
          <rect className="pr-draw" x="14" y="8" width="36" height="48" rx="6" />
          <path className="pr-draw" d="M22 22h20M22 30h20M22 38h12" />
        </>
      )}
      {i === 1 && (
        <>
          <path className="pr-draw" d="M10 18h44M10 32h44M10 46h44" />
          <circle className="pr-dot" cx="18" cy="18" r="3" fill="currentColor" />
          <circle className="pr-dot" cx="32" cy="32" r="3" fill="currentColor" />
          <circle className="pr-dot" cx="46" cy="46" r="3" fill="currentColor" />
        </>
      )}
      {i === 2 && (
        <>
          <circle className="pr-draw" cx="32" cy="32" r="22" />
          <path className="pr-draw" d="M22 33l7 7 13-15" />
        </>
      )}
    </svg>
  )
}

export function Principles() {
  const root = useRef<HTMLElement>(null)
  const c = useContent()
  useGSAP(
    () => {
      if (prefersReducedMotion()) return
      gsap.from(".pr-draw", { drawSVG: "0%", duration: 1.4, ease: "power2.inOut", stagger: 0.12, scrollTrigger: { trigger: root.current, start: "top 75%", once: true } })
      gsap.to(".pr-dot", { x: 6, duration: 1.2, ease: "sine.inOut", yoyo: true, repeat: -1, stagger: 0.25 })
    },
    { scope: root }
  )

  return (
    <section ref={root} id="method" aria-labelledby="method-title" className="mx-auto max-w-[1360px] scroll-mt-24 px-5 py-32 md:px-10">
      <SectionLabel label={c.ui.method.label} id="method-title" />
      <SplitReveal as="p" className="max-w-3xl font-display text-2xl font-medium text-foreground/70 md:text-4xl">
        {c.ui.method.sub}
      </SplitReveal>
      <RevealGroup className="mt-20 grid gap-14 md:grid-cols-3 md:gap-10">
        {c.principles.map((p, i) => (
          <div key={p.title} data-reveal className="relative">
            <span className="text-signal">
              <Glyph i={i} />
            </span>
            <h3 className="mt-8 font-display text-2xl font-semibold md:text-3xl">{p.title}</h3>
            <p className="mt-3 max-w-xs text-muted-foreground">{p.body}</p>
          </div>
        ))}
      </RevealGroup>
    </section>
  )
}

/* ── More work (light list) ────────────────────────────────── */

export function MoreWork() {
  const c = useContent()
  return (
    <section aria-labelledby="more-title" className="mx-auto max-w-[1360px] px-5 py-32 md:px-10">
      <SectionLabel label={c.ui.more.label} id="more-title" />
      <div className="grid gap-10 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <SplitReveal as="p" className="font-display text-2xl font-medium text-foreground/70 md:text-3xl">
            {c.ui.more.sub}
          </SplitReveal>
        </div>
        <RevealGroup className="grid gap-4 sm:grid-cols-2 lg:col-span-8" stagger={0.07}>
          {c.moreWork.map((p) => (
            <div key={p.name} data-reveal>
              <SpotlightCard tilt className="flex h-full flex-col p-7 md:p-8">
                <span className="eyebrow">{p.kind}</span>
                <h3 className="mt-10 font-display text-2xl font-semibold md:text-3xl">{p.name}</h3>
                <p className="mt-3 text-muted-foreground">{p.body}</p>
              </SpotlightCard>
            </div>
          ))}
        </RevealGroup>
      </div>
    </section>
  )
}

/* ── Toolbox ───────────────────────────────────────────────── */

export function Toolbox() {
  const c = useContent()
  return (
    <section id="capabilities" aria-labelledby="cap-title" className="mx-auto max-w-[1360px] scroll-mt-24 px-5 py-32 md:px-10">
      <SectionLabel label={c.ui.toolbox.label} id="cap-title" />
      <SplitReveal as="p" className="max-w-3xl font-display text-2xl font-medium text-foreground/70 md:text-4xl">
        {c.ui.toolbox.sub}
      </SplitReveal>
      <RevealGroup className="mt-16 grid gap-px overflow-hidden rounded-3xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-3" stagger={0.05}>
        {c.capabilities.map((cap) => (
          <div key={cap.area} data-reveal className="group bg-background/70 p-7 backdrop-blur-md transition-colors hover:bg-card/80 md:p-8">
            <h3 className="font-display text-xl font-semibold transition-colors group-hover:text-signal">{cap.area}</h3>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{cap.skills.slice(0, 4).join(" · ")}</p>
          </div>
        ))}
      </RevealGroup>
    </section>
  )
}

/* ── Experience ────────────────────────────────────────────── */

export function Experience() {
  const c = useContent()
  const x = c.experience[0]
  return (
    <section id="experience" aria-labelledby="xp-title" className="mx-auto max-w-[1360px] scroll-mt-24 px-5 py-32 md:px-10">
      <SectionLabel label={c.ui.xp.label} id="xp-title" />
      <div className="grid gap-16 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <SplitReveal as="p" className="font-display text-2xl font-medium text-foreground/70 md:text-3xl">
            {c.ui.xp.sub}
          </SplitReveal>
        </div>

        <RevealGroup className="lg:col-span-7">
          <div data-reveal className="border-l border-signal pl-6">
            <p className="font-mono text-xs text-signal">{x.period}</p>
            <h3 className="mt-2 font-display text-2xl font-semibold md:text-3xl">
              {x.title} <span className="text-muted-foreground">· {x.org}</span>
            </h3>
            <p className="mt-4 max-w-xl text-muted-foreground">{x.summary}</p>
          </div>

          <ul data-reveal className="mt-14 divide-y divide-border border-y border-border text-sm">
            {c.education.map((e) => (
              <li key={e.title} className="flex flex-wrap justify-between gap-2 py-4">
                <span>
                  {e.title} <span className="text-muted-foreground">· {e.org}</span>
                </span>
                <span className="font-mono text-xs text-muted-foreground">{e.period}</span>
              </li>
            ))}
          </ul>

          <div data-reveal className="mt-10">
            <h3 className="eyebrow">
              {c.ui.xp.certs} · {c.certifications.issuer} · {c.certifications.year}
            </h3>
            <ul className="mt-4 flex flex-wrap gap-2">
              {c.certifications.names.map((n) => (
                <li key={n} className="rounded-full border border-border bg-foreground/[0.03] px-3.5 py-1.5 text-sm">
                  {n}
                </li>
              ))}
            </ul>
            <p className="mt-6 text-sm text-muted-foreground">{c.languages.map((l) => `${l.name} ${l.level}`).join(" · ")}</p>
          </div>
        </RevealGroup>
      </div>
    </section>
  )
}

/* ── Beyond code ───────────────────────────────────────────── */

export function BeyondCode() {
  const c = useContent()
  const [lead, ...rest] = c.beyondCode.items
  return (
    <section aria-labelledby="beyond-title" className="mx-auto max-w-[1360px] px-5 py-24 md:px-10">
      <SectionLabel label={c.ui.beyond.label} id="beyond-title" />
      <SplitReveal as="p" className="max-w-3xl font-display text-2xl font-medium text-foreground/70 md:text-4xl">
        {c.beyondCode.lead}
      </SplitReveal>
      <RevealGroup className="mt-14 grid gap-4 lg:grid-cols-12" stagger={0.07}>
        <article data-reveal className="rounded-3xl border border-border bg-card/40 p-7 backdrop-blur-md md:p-10 lg:col-span-7">
          <span className="eyebrow">{lead.meta}</span>
          <h3 className="mt-8 font-display text-4xl font-semibold tracking-[-0.04em] md:text-6xl">{lead.name}</h3>
          <p className="mt-4 max-w-lg text-muted-foreground md:text-lg">{lead.body}</p>
        </article>
        <div className="grid gap-4 lg:col-span-5">
          {rest.map((b) => (
            <article key={b.name} data-reveal className="rounded-3xl border border-border bg-card/40 p-7 backdrop-blur-md">
              <span className="eyebrow">{b.meta}</span>
              <h3 className="mt-5 font-display text-2xl font-semibold">{b.name}</h3>
              <p className="mt-2 text-muted-foreground">{b.body}</p>
            </article>
          ))}
        </div>
      </RevealGroup>
    </section>
  )
}

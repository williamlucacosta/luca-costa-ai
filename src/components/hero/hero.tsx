"use client"

import Link from "next/link"
import { useRef } from "react"
import { ArrowRight } from "lucide-react"
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap"
import { CharReveal } from "@/components/char-reveal"
import { person } from "@/content/profile"
import { useContent } from "@/content/locale-context"

/** Clean hero: the entangled field behind does the talking. */
export function Hero() {
  const root = useRef<HTMLElement>(null)
  const word = useRef<HTMLSpanElement>(null)
  const c = useContent()
  const CYCLE = c.hero.cycle

  useGSAP(
    () => {
      if (prefersReducedMotion()) return
      const q = gsap.utils.selector(root)
      // on scroll the content drifts up and dissolves into the field
      gsap.to(q(".hero-content"), {
        yPercent: -22,
        opacity: 0,
        filter: "blur(12px)",
        ease: "none",
        scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true },
      })

      const tl = gsap.timeline({ repeat: -1, delay: 2.4 })
      CYCLE.slice(1)
        .concat(CYCLE[0])
        .forEach((w) => tl.to(word.current, { duration: 0.9, scrambleText: { text: w, chars: "01<>/{}#*", speed: 0.6 } }, "+=2.4"))
    },
    { scope: root, dependencies: [CYCLE] }
  )

  return (
    <section ref={root} className="relative flex min-h-svh flex-col">
      <div className="hero-content relative z-10 mx-auto flex w-full max-w-[1360px] flex-1 flex-col justify-center px-5 pt-24 md:px-10">
        <p className="hero-in eyebrow flex items-center gap-3" style={{ animationDelay: "150ms" }}>
          <span className="h-px w-8 bg-signal" />
          {person.title} · {c.qualifier}
        </p>

        <CharReveal
          text={person.name}
          className="mt-8 -ml-[0.0625em] font-display text-[clamp(3.75rem,16.5vw,13.5rem)] leading-[0.86] font-semibold tracking-[-0.055em]"
        />

        <p className="hero-in mt-10 max-w-xl text-xl leading-snug text-balance text-foreground/75 md:text-2xl" style={{ animationDelay: "250ms" }}>
          {c.hero.lead}
          <br />
          {c.hero.cyclePrefix}{" "}
          <span ref={word} className="text-gradient font-medium">
            {CYCLE[0]}
          </span>
        </p>

        <div className="hero-in mt-12 flex flex-wrap items-center gap-3" style={{ animationDelay: "350ms" }}>
          <Link
            href="#work"
            className="group inline-flex h-12 items-center gap-2 rounded-full bg-foreground px-7 text-sm font-medium text-background shadow-[0_0_60px_-12px_var(--signal)] transition-shadow hover:shadow-[0_0_80px_-6px_var(--signal)]"
          >
            {c.ui.seeWork}
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
          <a
            href={`mailto:${person.email}`}
            className="inline-flex h-12 items-center rounded-full border border-foreground/15 bg-background/30 px-7 text-sm backdrop-blur-md transition-colors hover:border-foreground/35"
          >
            {c.ui.getInTouch}
          </a>
        </div>
      </div>

      <div className="hero-in hero-content relative z-10 mx-auto flex w-full max-w-[1360px] items-end justify-between px-5 pb-8 font-mono text-[11px] text-muted-foreground md:px-10" style={{ animationDelay: "450ms" }}>
        <span>{c.location}</span>
        <span className="flex items-center gap-3">
          {c.ui.scroll}
          <span className="relative h-8 w-px overflow-hidden bg-foreground/15">
            <span className="absolute inset-x-0 top-0 h-3 animate-[drip_1.8s_ease-in-out_infinite] bg-signal" />
          </span>
        </span>
      </div>
    </section>
  )
}

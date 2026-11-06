"use client"

import { useRef, useState } from "react"
import { gsap, ScrollTrigger, SplitText, useGSAP, prefersReducedMotion } from "@/lib/gsap"
import { SectionLabel } from "@/components/section-label"
import { useContent } from "@/content/locale-context"
import { cn } from "@/lib/utils"

/**
 * Soft skills, driven by scroll. The section pins and each word takes its turn:
 * its letters ride a soft wave with a brief chromatic split, and its sentence appears below.
 */
export function Mindset() {
  const root = useRef<HTMLElement>(null)
  const pin = useRef<HTMLDivElement>(null)
  const splits = useRef<SplitText[]>([])
  const current = useRef(-1)
  const [active, setActive] = useState(0)
  const c = useContent()
  const mindset = c.mindset

  useGSAP(
    () => {
      const words = gsap.utils.toArray<HTMLElement>(".ms-word", root.current)
      splits.current = words.map((el) => SplitText.create(el, { type: "chars", charsClass: "ms-char" }))
      const reduce = prefersReducedMotion()

      const wave = (i: number) => {
        const chars = splits.current[i]?.chars
        if (!chars || reduce) return
        gsap.killTweensOf(chars, "y,textShadow")
        gsap
          .timeline()
          .to(chars, {
            y: "-0.12em",
            textShadow: "-0.04em 0 0 rgba(79,107,255,0.75), 0.04em 0 0 rgba(47,211,255,0.75)",
            duration: 0.3,
            ease: "sine.out",
            stagger: 0.02,
          })
          .to(chars, { y: 0, textShadow: "0 0 0 rgba(0,0,0,0)", duration: 0.55, ease: "elastic.out(1, 0.55)", stagger: 0.02 }, 0.15)
      }

      const go = (i: number) => {
        if (i === current.current) return
        current.current = i
        setActive(i)
        wave(i)
      }

      // the whole word set materialises once, then the pinned scroll hands the spotlight from word to word
      if (!reduce) {
        gsap.from(
          splits.current.flatMap((s) => s.chars),
          {
            yPercent: 60,
            opacity: 0,
            filter: "blur(14px)",
            duration: 1.2,
            ease: "expo.out",
            stagger: 0.012,
            clearProps: "filter,opacity",
            scrollTrigger: { trigger: pin.current, start: "top 80%", once: true },
          }
        )
      }

      const st = ScrollTrigger.create({
        trigger: pin.current,
        start: "top top",
        end: () => `+=${mindset.length * 20}%`,
        pin: !reduce,
        onUpdate: (self) => go(Math.min(mindset.length - 1, Math.floor(self.progress * mindset.length))),
      })

      return () => {
        st.kill()
        splits.current.forEach((s) => s.revert())
      }
    },
    { scope: root }
  )

  return (
    <section ref={root} id="mindset" aria-labelledby="mindset-title" className="relative scroll-mt-24">
      <div ref={pin} className="flex min-h-svh flex-col justify-center">
        <div className="mx-auto w-full max-w-[1360px] px-5 py-24 md:px-10">
          <SectionLabel label={c.ui.mind.label} id="mindset-title" />
          <p className="max-w-2xl font-display text-2xl font-medium text-foreground/70 md:text-4xl">
            {c.ui.mind.sub[0]} <span className="text-gradient">{c.ui.mind.sub[1]}</span>
          </p>

          <ul className="mt-14 flex flex-wrap items-baseline gap-x-8 gap-y-1 md:gap-x-14" aria-label={c.ui.mind.aria}>
            {mindset.map((m, i) => (
              <li
                key={m.word}
                aria-current={active === i}
                className={cn(
                  "ms-word font-display text-[clamp(2.4rem,7vw,6.5rem)] leading-[1.08] font-semibold tracking-[-0.05em] transition-colors duration-300",
                  active === i ? "text-foreground" : "text-foreground/20"
                )}
              >
                {m.word}
              </li>
            ))}
          </ul>

          <div className="mt-12 grid gap-6 pt-2 md:grid-cols-12" aria-live="polite">
            <div className="flex items-center gap-1.5 md:col-span-2">
              {mindset.map((m, i) => (
                <span key={m.word} className={cn("h-0.5 rounded-full transition-all duration-500", i === active ? "w-6 bg-signal" : "w-2 bg-foreground/20")} />
              ))}
            </div>
            <p key={active} className="max-w-2xl animate-[fade-up_0.6s_cubic-bezier(0.16,1,0.3,1)] text-xl leading-snug text-foreground/85 md:col-span-8 md:text-2xl">
              {mindset[active].body}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

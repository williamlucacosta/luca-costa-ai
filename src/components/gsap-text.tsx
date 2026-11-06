"use client"

import { useRef } from "react"
import { gsap, ScrollTrigger, SplitText, useGSAP, prefersReducedMotion } from "@/lib/gsap"
import { cn } from "@/lib/utils"

type Tag = "h1" | "h2" | "h3" | "p" | "span" | "div"

/**
 * Heading whose lines slide up out of a mask when it scrolls into view (SplitText, lines + words).
 * `immediate` plays on mount instead of on scroll — for above-the-fold headings.
 */
export function SplitReveal({
  as: Comp = "h2",
  children,
  className,
  immediate = false,
  delay = 0,
  by = "lines",
}: {
  as?: Tag
  children: React.ReactNode
  className?: string
  immediate?: boolean
  delay?: number
  by?: "lines" | "chars"
}) {
  const ref = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const el = ref.current
      if (!el || prefersReducedMotion()) return
      let split: SplitText | undefined
      const run = () => {
        split = SplitText.create(el, {
          type: by === "chars" ? "chars,words,lines" : "words,lines",
          // per-letter reveals use no mask: a clipping box would cut round letters under tight leading
          mask: by === "chars" ? undefined : "lines",
          // a name for the split element is only valid on headings; elsewhere the text nodes speak for themselves
          aria: /^h[1-6]$/.test(Comp) ? "auto" : "none",
          autoSplit: true,
          onSplit(self) {
            const targets = by === "chars" ? self.chars : self.lines
            return gsap.from(targets, {
              yPercent: by === "chars" ? 40 : 115,
              opacity: by === "chars" ? 0 : 1,
              filter: by === "chars" ? "blur(12px)" : "blur(0px)",
              clearProps: "filter",
              duration: by === "chars" ? 1.1 : 1.2,
              ease: "expo.out",
              stagger: by === "chars" ? 0.035 : 0.09,
              delay,
              scrollTrigger: immediate ? undefined : { trigger: el, start: "top 85%", once: true },
            })
          },
        })
      }
      // split lazily, shortly before the heading comes near the screen: no layout work at page load
      if (immediate) run()
      else ScrollTrigger.create({ trigger: el, start: "top bottom+=25%", once: true, onEnter: run })
      return () => split?.revert()
    },
    { scope: ref }
  )

  return (
    // @ts-expect-error — polymorphic ref across intrinsic tags
    <Comp ref={ref} className={cn(className)}>
      {children}
    </Comp>
  )
}

/** Big statement: words go from dim to full as the paragraph is scrubbed through the viewport. */
export function ScrubWords({ text, className }: { text: string; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null)

  useGSAP(
    () => {
      const el = ref.current
      if (!el || prefersReducedMotion()) return
      let split: SplitText | undefined
      // split lazily, before the paragraph reaches the screen: no layout work at page load
      ScrollTrigger.create({
        trigger: el,
        start: "top bottom+=25%",
        once: true,
        onEnter: () => {
          split = SplitText.create(el, { type: "words", aria: "none" })
          gsap.fromTo(
            split.words,
            // starts dim but still readable (3:1 on the dark background), then lights up
            { opacity: 0.38, filter: "blur(2px)" },
            {
              opacity: 1,
              filter: "blur(0px)",
              stagger: 0.1,
              ease: "none",
              scrollTrigger: { trigger: el, start: "top 80%", end: "bottom 45%", scrub: true },
            }
          )
        },
      })
      return () => split?.revert()
    },
    { scope: ref }
  )

  return (
    <p ref={ref} className={className}>
      {text}
    </p>
  )
}

/** Number that counts up when it enters the viewport. Keeps decimals and a suffix ("+", "%", " MB"…). */
export function Counter({ value, decimals = 0, prefix = "", suffix = "", className }: { value: number; decimals?: number; prefix?: string; suffix?: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const format = (n: number) => `${prefix}${n.toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}${suffix}`

  useGSAP(
    () => {
      if (!ref.current || prefersReducedMotion()) return
      // Only start counting on enter, so the final value is shown until then (never a stray "0").
      ScrollTrigger.create({
        trigger: ref.current,
        start: "top 92%",
        once: true,
        onEnter: () => {
          const obj = { n: 0 }
          gsap.to(obj, {
            n: value,
            duration: 1.8,
            ease: "power3.out",
            onUpdate: () => {
              if (ref.current) ref.current.textContent = format(obj.n)
            },
          })
        },
      })
    },
    { scope: ref }
  )

  return (
    <span ref={ref} className={cn("tabular-nums", className)}>
      {format(value)}
    </span>
  )
}

/** Fade/rise group: every direct child with [data-reveal] staggers in on scroll. */
export function RevealGroup({ children, className, stagger = 0.08 }: { children: React.ReactNode; className?: string; stagger?: number }) {
  const ref = useRef<HTMLDivElement>(null)
  useGSAP(
    () => {
      if (!ref.current || prefersReducedMotion()) return
      gsap.from(ref.current.querySelectorAll("[data-reveal]"), {
        y: 40,
        opacity: 0,
        filter: "blur(6px)",
        duration: 1.1,
        ease: "expo.out",
        stagger,
        scrollTrigger: { trigger: ref.current, start: "top 82%", once: true },
      })
    },
    { scope: ref }
  )
  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  )
}

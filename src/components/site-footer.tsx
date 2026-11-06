"use client"

import { SectionLabel } from "@/components/section-label"
import { useState } from "react"
import { ArrowUpRight, Check, Copy } from "lucide-react"
import { SplitReveal } from "@/components/gsap-text"
import { LocalTime } from "@/components/local-time"
import { person } from "@/content/profile"
import { useContent } from "@/content/locale-context"

export function SiteFooter() {
  const [copied, setCopied] = useState(false)
  const c = useContent()
  const t = c.ui.contact
  const KEYWORDS = c.keywords

  return (
    <footer id="contact" className="relative z-10 mt-16 overflow-hidden border-t border-border">
      <div aria-hidden className="pointer-events-none absolute inset-x-0 -top-40 h-80 bg-[radial-gradient(closest-side,oklch(0.7_0.18_240/0.28),transparent)] blur-2xl" />

      <div className="border-b border-border py-6">
        <div className="flex overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_10%,#000_90%,transparent)]">
          <div className="marquee-track flex w-max" style={{ animationDuration: "50s" }}>
            {[0, 1].map((k) => (
              <div key={k} aria-hidden={k === 1} className="flex shrink-0 items-center">
                {KEYWORDS.map((w) => (
                  <span key={w} className="flex items-center gap-8 pr-8 font-display text-2xl text-foreground/30 md:text-4xl">
                    {w}
                    <span className="size-1.5 rounded-full bg-signal" />
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="relative mx-auto max-w-[1360px] px-5 pt-24 pb-12 md:px-10">
        <SectionLabel label={t.label} />
        <SplitReveal as="p" className="max-w-3xl font-display text-2xl font-medium text-foreground/70 md:text-4xl">
          {t.sub}
        </SplitReveal>

        <div className="mt-12 flex flex-wrap items-center gap-3">
          <a
            href={`mailto:${person.email}`}
            className="group inline-flex h-14 items-center gap-3 rounded-2xl bg-signal px-6 text-base font-medium text-signal-foreground md:text-lg"
          >
            {person.email}
            <ArrowUpRight className="size-5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
          <button
            onClick={() => {
              navigator.clipboard?.writeText(person.email).then(() => {
                setCopied(true)
                setTimeout(() => setCopied(false), 1800)
              })
            }}
            className="inline-flex h-14 items-center gap-2 rounded-2xl border border-border px-5 text-sm transition-colors hover:border-foreground/30"
            aria-live="polite"
          >
            {copied ? <Check className="size-4 text-ok" /> : <Copy className="size-4" />}
            {copied ? t.copied : t.copy}
          </button>
          <a
            href={person.linkedin}
            target="_blank"
            rel="noopener"
            className="inline-flex h-14 items-center gap-2 rounded-2xl border border-border px-5 text-sm transition-colors hover:border-foreground/30"
          >
            LinkedIn <ArrowUpRight className="size-4" />
          </a>
          <a
            href={person.github}
            target="_blank"
            rel="noopener"
            className="inline-flex h-14 items-center gap-2 rounded-2xl border border-border px-5 text-sm transition-colors hover:border-foreground/30"
          >
            GitHub <ArrowUpRight className="size-4" />
          </a>
        </div>

        <div className="mt-24 flex flex-col justify-between gap-3 border-t border-border pt-6 font-mono text-[11px] text-muted-foreground sm:flex-row">
          <span>
            © {new Date().getFullYear()} {person.fullName}
          </span>
          <span>
            {c.location} · <LocalTime /> CET
          </span>
          <span>{t.built}</span>
        </div>
      </div>
    </footer>
  )
}

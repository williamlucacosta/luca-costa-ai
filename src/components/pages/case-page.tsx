import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react"
import { Counter, RevealGroup } from "@/components/gsap-text"
import { CharReveal } from "@/components/char-reveal"
import { CaseVisual } from "@/components/work/case-visual"
import { JsonLd } from "@/components/site-shell"
import { getContent, localePath, type Locale } from "@/content/profile"
import { pageMetadata } from "@/lib/seo"
import { caseGraph } from "@/lib/structured-data"

export function caseParams() {
  return getContent("en").caseStudies.map((c) => ({ slug: c.slug }))
}

export function caseMetadata(locale: Locale, slug: string): Metadata {
  const cs = getContent(locale).caseStudies.find((x) => x.slug === slug)
  if (!cs) return {}
  return pageMetadata({ locale, path: `/work/${cs.slug}/`, title: cs.seo.title, description: cs.seo.description, type: "article", absoluteTitle: true })
}

const METRIC_COLS: Record<number, string> = { 2: "md:grid-cols-2", 3: "md:grid-cols-3", 4: "md:grid-cols-4" }

function Block({ index, title, children }: { index: string; title: string; children: React.ReactNode }) {
  return (
    <RevealGroup className="grid gap-6 border-t border-border py-12 md:grid-cols-12 md:py-14">
      <div data-reveal className="md:col-span-4">
        <span className="font-mono text-xs text-signal">{index}</span>
        <h2 className="mt-2 font-display text-2xl font-semibold md:text-3xl">{title}</h2>
      </div>
      <div data-reveal className="md:col-span-8">
        {children}
      </div>
    </RevealGroup>
  )
}

export function CasePage({ locale, slug }: { locale: Locale; slug: string }) {
  const c = getContent(locale)
  const t = c.ui.caseStudy
  const all = c.caseStudies
  const i = all.findIndex((x) => x.slug === slug)
  if (i < 0) notFound()
  const cs = all[i]
  const next = all[(i + 1) % all.length]

  return (
    <article className="mx-auto max-w-[1360px] px-5 pt-28 md:px-10 md:pt-40">
      <JsonLd data={caseGraph(locale, cs)} />
      <nav aria-label="Breadcrumb">
        <Link
          href={localePath(locale, "/#work")}
          className="group inline-flex min-h-11 items-center gap-2 font-mono text-xs tracking-wider text-muted-foreground uppercase hover:text-foreground"
        >
          <ArrowLeft className="size-3.5 transition-transform group-hover:-translate-x-0.5" /> {t.all}
        </Link>
      </nav>

      <header className="mt-8 grid gap-10 md:mt-10 lg:grid-cols-12 lg:items-end">
        <div className="lg:col-span-7">
          <p className="eyebrow">
            <span className="text-signal">{String(i + 1).padStart(2, "0")}</span> · {cs.kind} · {cs.period}
          </p>
          <CharReveal text={cs.name} className="mt-5 font-display text-[clamp(3.25rem,11vw,9.5rem)] leading-[0.88] font-semibold tracking-[-0.055em]" />
          <p className="mt-8 max-w-2xl text-lg leading-snug text-foreground/80 md:text-2xl">{cs.summary}</p>
        </div>
        <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-border bg-border text-sm lg:col-span-5">
          <div className="bg-background p-4">
            <dt className="eyebrow">{t.role}</dt>
            <dd className="mt-1">{cs.role}</dd>
          </div>
          <div className="bg-background p-4">
            <dt className="eyebrow">{t.period}</dt>
            <dd className="mt-1">{cs.period}</dd>
          </div>
          <div className="col-span-2 bg-background p-4">
            <dt className="eyebrow">{t.stack}</dt>
            <dd className="mt-2 flex flex-wrap gap-1.5">
              {cs.stack.map((s) => (
                <span key={s} className="rounded-full bg-foreground/[0.06] px-2.5 py-1 font-mono text-[11px]">
                  {s}
                </span>
              ))}
            </dd>
          </div>
        </dl>
      </header>

      {cs.link && (
        <a
          href={cs.link.href}
          target="_blank"
          rel="noopener"
          className="group mt-6 flex min-h-12 items-center justify-between rounded-2xl border border-border bg-background/60 p-4 text-signal lg:ml-auto lg:w-[calc(5/12*100%-0.75rem)]"
        >
          {cs.link.label}
          <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </a>
      )}

      <CaseVisual slug={cs.slug} hue={cs.hue} className="mt-12 aspect-[16/8] w-full max-md:aspect-square md:mt-16" />

      <RevealGroup className={`mt-6 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-border bg-border ${METRIC_COLS[cs.metrics.length] ?? "md:grid-cols-4"}`}>
        {cs.metrics.map((m) => (
          // an odd last tile spans the row on phones, so the grid never shows an empty cell
          <div key={m.label} data-reveal className="bg-background p-5 last:odd:col-span-2 md:p-6 md:last:odd:col-span-1">
            <div className="font-display text-3xl font-semibold tracking-[-0.04em] md:text-5xl">
              <Counter value={m.value} decimals={m.decimals} prefix={m.prefix} suffix={m.suffix} />
            </div>
            <p className="mt-2 text-sm text-muted-foreground">{m.label}</p>
          </div>
        ))}
      </RevealGroup>

      <div className="mt-16 md:mt-20">
        <Block index="01" title={t.problem}>
          <p className="text-lg leading-relaxed text-muted-foreground">{cs.problem}</p>
        </Block>
        <Block index="02" title={t.approach}>
          <ul className="space-y-4">
            {cs.approach.map((a) => (
              <li key={a} className="flex gap-4 text-base leading-relaxed text-muted-foreground md:text-lg">
                <span className="mt-3 h-px w-4 shrink-0 bg-signal" />
                {a}
              </li>
            ))}
          </ul>
        </Block>
        <Block index="03" title={t.verified}>
          <ul className="space-y-4">
            {cs.verification.map((v) => (
              <li key={v} className="flex gap-4 text-base leading-relaxed text-foreground/85 md:text-lg">
                <span aria-hidden className="mt-1 grid size-5 shrink-0 place-items-center rounded-full bg-ok/15 text-[11px] text-ok">
                  ✓
                </span>
                {v}
              </li>
            ))}
          </ul>
        </Block>
      </div>

      <Link
        href={localePath(locale, `/work/${next.slug}/`)}
        className="group mt-10 flex items-center justify-between gap-6 rounded-3xl border border-border bg-card/50 p-6 transition-colors hover:border-foreground/20 md:p-10"
      >
        <span className="min-w-0">
          <span className="eyebrow">{t.next}</span>
          <span className="mt-2 block font-display text-3xl font-semibold tracking-[-0.04em] md:text-6xl">{next.name}</span>
        </span>
        <span className="grid size-12 shrink-0 place-items-center rounded-full bg-foreground text-background transition-all duration-500 ease-expo group-hover:translate-x-1 group-hover:bg-signal group-hover:text-signal-foreground md:size-14">
          <ArrowRight className="size-5" />
        </span>
      </Link>
    </article>
  )
}

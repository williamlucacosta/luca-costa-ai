"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"
import { localePath, person, type Locale } from "@/content/profile"
import { useContent } from "@/content/locale-context"

/** The same page in the other language: English at the root, Italian under /it */
function swapLocale(pathname: string, to: Locale) {
  const neutral = pathname.replace(/^\/it(?=\/|$)/, "") || "/"
  return localePath(to, neutral)
}

/** EN / IT switch. Plain links: each language is its own document, so search engines see both. */
function LangSwitch({ className }: { className?: string }) {
  const c = useContent()
  const pathname = usePathname() || "/"
  return (
    <nav aria-label={c.ui.language} className={cn("flex items-center rounded-lg border border-border p-0.5 font-mono text-[11px]", className)}>
      {(["en", "it"] as Locale[]).map((l) => (
        <a
          key={l}
          href={swapLocale(pathname, l)}
          hrefLang={l}
          lang={l}
          aria-current={l === c.locale ? "true" : undefined}
          className={cn(
            "grid h-9 min-w-10 place-items-center rounded-md px-2 uppercase transition-colors",
            l === c.locale ? "bg-foreground/10 text-foreground" : "text-muted-foreground hover:text-foreground"
          )}
        >
          {l}
        </a>
      ))}
    </nav>
  )
}

export function SiteHeader() {
  const [open, setOpen] = useState(false)
  const bar = useRef<HTMLDivElement>(null)
  const c = useContent()
  const NAV = [
    { href: localePath(c.locale, "/#work"), label: c.ui.nav.work },
    { href: localePath(c.locale, "/#mindset"), label: c.ui.nav.mindset },
    { href: localePath(c.locale, "/#capabilities"), label: c.ui.nav.toolbox },
    { href: localePath(c.locale, "/#experience"), label: c.ui.nav.experience },
  ]

  // the glass backing fades in progressively over the first 220px of scroll, never in one step
  useEffect(() => {
    const onScroll = () => {
      const k = Math.min(1, Math.max(0, (window.scrollY - 8) / 220))
      bar.current?.style.setProperty("--nav", String(k * k * (3 - 2 * k)))
    }
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])


  return (
    <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 md:px-6 md:pt-4" style={{ viewTransitionName: "site-header" }}>
      <div ref={bar} className="relative mx-auto flex h-14 max-w-[1360px] items-center justify-between rounded-2xl px-3 md:px-4">
        <div
          aria-hidden
          className={cn(
            "pointer-events-none absolute inset-0 -z-10 rounded-2xl border border-border bg-background/70 backdrop-blur-xl transition-opacity duration-300",
            open ? "opacity-100" : "opacity-[var(--nav,0)]"
          )}
        />
        <Link href={localePath(c.locale, "/")} className="group flex items-center gap-2.5" aria-label={`${person.name}, ${c.ui.home}`}>
          {/* eslint-disable-next-line @next/next/no-img-element -- static export */}
          <img src="/icon-192.png" alt="" width={32} height={32} className="size-9 transition-transform duration-500 ease-expo group-hover:scale-105" />
          <span className="hidden text-sm leading-tight sm:block">
            <span className="block font-medium">{person.name}</span>
            <span className="block font-mono text-[10px] tracking-wider text-muted-foreground uppercase">{person.title}</span>
          </span>
        </Link>

        <nav aria-label="Primary" className="hidden md:block">
          <ul className="flex items-center gap-1">
            {NAV.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="rounded-lg px-3 py-2 text-[13px] text-muted-foreground transition-colors hover:bg-foreground/5 hover:text-foreground">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <LangSwitch />
          <a
            href={`mailto:${person.email}`}
            className="hidden h-9 items-center gap-2 rounded-lg bg-signal px-4 text-[13px] font-medium text-signal-foreground transition-[filter] hover:brightness-110 md:inline-flex"
          >
            {c.ui.letsTalk}
          </a>
          <button
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? c.ui.closeMenu : c.ui.openMenu}
            className="grid size-10 place-items-center rounded-lg border border-border md:hidden"
          >
            <span className="relative block h-3 w-4">
              <span className={cn("absolute left-0 h-px w-4 bg-foreground transition-all duration-300", open ? "top-1.5 rotate-45" : "top-0")} />
              <span className={cn("absolute left-0 h-px w-4 bg-foreground transition-all duration-300", open ? "top-1.5 -rotate-45" : "top-3")} />
            </span>
          </button>
        </div>
      </div>

      <div
        id="mobile-nav"
        className={cn(
          "mx-auto mt-2 max-w-[1360px] overflow-hidden rounded-2xl border border-border bg-background/90 backdrop-blur-xl transition-all duration-500 ease-expo md:hidden",
          open ? "max-h-96 opacity-100" : "pointer-events-none max-h-0 border-transparent opacity-0"
        )}
      >
        <ul className="p-2">
          {NAV.map((item, i) => (
            <li key={item.href}>
              <Link href={item.href} onClick={() => setOpen(false)} className="flex items-baseline gap-3 rounded-xl px-3 py-3 font-display text-2xl">
                <span className="font-mono text-xs text-signal">{String(i + 1).padStart(2, "0")}</span>
                {item.label}
              </Link>
            </li>
          ))}
          <li className="p-2">
            <a href={`mailto:${person.email}`} className="flex h-12 items-center justify-center rounded-xl bg-signal text-sm font-medium text-signal-foreground">
              {c.ui.letsTalk}
            </a>
          </li>
        </ul>
      </div>
    </header>
  )
}

"use client"

import { useEffect } from "react"
import { gsap, ScrollTrigger, prefersReducedMotion } from "@/lib/gsap"
import { scroller, warp } from "@/lib/warp"

/**
 * In-page links don't scroll, they warp. With the View Transitions API the browser snapshots
 * the page, we jump while it is frozen, and CSS flies the camera through (see `html.warping`
 * in globals.css). Meanwhile the WebGL field rushes forward via `warp.v`.
 * Without the API, Lenis glides there instead.
 */
export function WarpNav() {
  useEffect(() => {
    let busy = false

    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
      const a = (e.target as Element | null)?.closest?.("a")
      if (!a) return
      const url = new URL(a.href, location.href)
      if (url.origin !== location.origin || url.pathname !== location.pathname || !url.hash || url.hash === "#main") return
      const el = document.getElementById(decodeURIComponent(url.hash.slice(1)))
      if (!el) return
      // a pinned section is position: fixed while pinned, so its rect lies about where it starts:
      // aim at its pin spacer instead (Work then always opens on the first case, not mid-track)
      const target = el.parentElement?.classList.contains("pin-spacer") ? el.parentElement : el

      // no history.pushState: Next patches it, and the router update would start a second view transition
      e.preventDefault()
      const lenis = scroller.lenis
      if (!lenis || prefersReducedMotion()) {
        target.scrollIntoView()
        return
      }
      if (busy) return

      if (!document.startViewTransition) {
        lenis.scrollTo(target, { duration: 1.4, easing: (t) => 1 - Math.pow(1 - t, 4) })
        return
      }

      busy = true
      const root = document.documentElement
      root.classList.add("warping")
      gsap.killTweensOf(warp)
      gsap
        .timeline()
        .to(warp, { v: 1, duration: 0.5, ease: "power2.in" })
        .to(warp, { v: 0, duration: 1.2, ease: "power3.out" })

      const vt = document.startViewTransition(() => {
        lenis.scrollTo(target, { immediate: true, force: true })
        ScrollTrigger.update()
        // land with every scrubbed scene already settled, not still catching up behind the reveal
        ScrollTrigger.getAll().forEach((st) => {
          const scrub = st.getTween() as gsap.core.Tween | false | undefined // false when the trigger has no scrub
          if (scrub) scrub.progress(1)
        })
      })
      vt.finished.finally(() => {
        root.classList.remove("warping")
        busy = false
      })
    }

    // on window, capture phase: runs before React (whose root is the document) lets next/link navigate
    window.addEventListener("click", onClick, true)
    return () => {
      window.removeEventListener("click", onClick, true)
      gsap.killTweensOf(warp)
      warp.v = 0
    }
  }, [])

  return null
}

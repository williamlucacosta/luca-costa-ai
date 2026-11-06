"use client"

import Lenis from "lenis"
import { usePathname } from "next/navigation"
import { useEffect, useRef } from "react"
import { gsap, ScrollTrigger, prefersReducedMotion } from "@/lib/gsap"
import { scroller } from "@/lib/warp"

/**
 * Lenis smooth scroll driven by GSAP's ticker, so ScrollTrigger scenes, WebGL and
 * parallax all read the same scroll position on the same frame.
 */
export function SmoothScroll() {
  const lenisRef = useRef<Lenis | null>(null)
  const pathname = usePathname()

  useEffect(() => {
    if (prefersReducedMotion()) return
    const lenis = new Lenis({ duration: 1.15 })
    lenisRef.current = lenis
    scroller.lenis = lenis
    lenis.on("scroll", ScrollTrigger.update)
    const tick = (time: number) => lenis.raf(time * 1000)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)
    return () => {
      gsap.ticker.remove(tick)
      lenis.destroy()
      lenisRef.current = null
      scroller.lenis = null
    }
  }, [])

  // New page → start at the top and re-measure every pinned scene.
  useEffect(() => {
    if (!window.location.hash) lenisRef.current?.scrollTo(0, { immediate: true })
    const id = requestAnimationFrame(() => ScrollTrigger.refresh())
    return () => cancelAnimationFrame(id)
  }, [pathname])

  return null
}

"use client"

import { useEffect } from "react"

/**
 * Endless CSS loops cost a repaint every frame even when nobody can see them.
 * Every element marked [data-pause-offscreen] gets [data-offscreen] while it is out of view,
 * which pauses its animations (see globals.css). One observer for the whole page.
 */
export function OffscreenPauser() {
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.target.toggleAttribute("data-offscreen", !e.isIntersecting)),
      { rootMargin: "100px" }
    )
    const watch = () => document.querySelectorAll("[data-pause-offscreen]").forEach((el) => io.observe(el))
    watch()
    // client navigations (case study pages) bring new diagrams
    const mo = new MutationObserver(watch)
    mo.observe(document.getElementById("main") ?? document.body, { childList: true, subtree: true })
    return () => {
      io.disconnect()
      mo.disconnect()
    }
  }, [])
  return null
}

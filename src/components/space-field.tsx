"use client"

import { useEffect, useRef } from "react"
import { warp } from "@/lib/warp"

/**
 * "Space": the background from williamlucacosta.it, ported.
 * A low-res aurora (blurred by CSS), a drifting nebula and a three-depth starfield with twinkle.
 * Moving stars get true motion blur from their own parallax speed, so they stretch into light
 * trails while the page moves and fold back into points when it stops. The nav warp leaves them
 * alone (its jump is not motion). It does not react to the cursor.
 */

type Star = {
  x: number
  y: number
  depth: number
  base: number
  tw: number
  ph: number
  sz: number
  sprite: HTMLCanvasElement
}

// [hue, sat, light, radius, speed, phase, orbit x, orbit y, centre x, centre y, alpha]
const BLOBS = [
  { h: 207, s: 100, l: 60, r: 0.16, sp: 0.06, ph: 0.0, ox: 0.07, oy: 0.06, cx: 0.46, cy: 0.24, a: 0.34 },
  { h: 218, s: 100, l: 50, r: 0.3, sp: 0.045, ph: 2.1, ox: 0.1, oy: 0.08, cx: 0.4, cy: 0.3, a: 0.14 },
  { h: 272, s: 95, l: 56, r: 0.2, sp: 0.055, ph: 4.0, ox: 0.07, oy: 0.06, cx: 0.8, cy: 0.06, a: 0.34 },
  { h: 250, s: 95, l: 48, r: 0.28, sp: 0.04, ph: 1.2, ox: 0.09, oy: 0.08, cx: 0.88, cy: 0.2, a: 0.16 },
  { h: 232, s: 100, l: 45, r: 0.3, sp: 0.038, ph: 5.0, ox: 0.12, oy: 0.09, cx: 0.78, cy: 0.6, a: 0.12 },
  { h: 196, s: 100, l: 58, r: 0.14, sp: 0.08, ph: 5.2, ox: 0.09, oy: 0.06, cx: 0.05, cy: 0.82, a: 0.16 },
  { h: 248, s: 92, l: 42, r: 0.32, sp: 0.034, ph: 3.0, ox: 0.13, oy: 0.1, cx: 0.55, cy: 1.02, a: 0.1 },
]

// pre-rendered star disc per hue: drawImage is far cheaper than arc + fill per star
function starSprite(hue: number) {
  const S = 16
  const c = document.createElement("canvas")
  c.width = c.height = S
  const x = c.getContext("2d")!
  const g = x.createRadialGradient(S / 2, S / 2, 0, S / 2, S / 2, S / 2)
  g.addColorStop(0, `hsla(${hue},92%,93%,1)`)
  g.addColorStop(0.4, `hsla(${hue},90%,80%,.55)`)
  g.addColorStop(1, `hsla(${hue},90%,72%,0)`)
  x.fillStyle = g
  x.fillRect(0, 0, S, S)
  return c
}

export function SpaceField() {
  const box = useRef<HTMLDivElement>(null)
  const auroraRef = useRef<HTMLCanvasElement>(null)
  const starsRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const el = box.current!
    const aurora = auroraRef.current!
    const canvas = starsRef.current!
    const actx = aurora.getContext("2d")!
    const ctx = canvas.getContext("2d")!
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches

    const A_W = 260, A_H = 150 // the CSS blur does the rest
    aurora.width = A_W
    aurora.height = A_H

    const sprites: Record<number, HTMLCanvasElement> = { 225: starSprite(225), 195: starSprite(195), 265: starSprite(265) }
    const DPR = Math.min(devicePixelRatio || 1, 1.5)
    // adaptive quality: start from the core count, then a watchdog may step down once
    let tier = (navigator.hardwareConcurrency || 4) <= 4 ? 1 : 0
    let W = 0, H = 0
    let stars: Star[] = []
    let scrollY = 0
    let vel = 0 // eased scroll speed, px per rendered frame
    const SHUTTER = 7 // "exposure" in frames: how long a moving star's trail is

    const target = () => {
      const div = tier >= 2 ? 7200 : tier === 1 ? 5600 : 4200
      const cap = tier >= 2 ? 170 : tier === 1 ? 260 : 360
      return Math.min(cap, Math.floor((W * H) / div))
    }
    const populate = () => {
      stars = Array.from({ length: target() }, () => {
        const depth = Math.random() // 0 far, 1 near
        const r = 0.3 + depth * 1.3
        const hue = Math.random() < 0.12 ? 265 : Math.random() < 0.3 ? 195 : 225
        return {
          x: Math.random() * W,
          y: Math.random() * H,
          depth,
          base: 0.25 + Math.random() * 0.65,
          tw: 0.5 + Math.random() * 2,
          ph: Math.random() * Math.PI * 2,
          sprite: sprites[hue],
          sz: r * 3.4 + (depth > 0.85 ? 5 : 1.6),
        }
      })
    }
    // size from the element (100lvh): a phone's collapsing address bar never resizes it
    const resize = () => {
      const w = el.clientWidth, h = el.clientHeight
      if (w === W && h === H) return
      W = w
      H = h
      canvas.width = W * DPR
      canvas.height = H * DPR
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0)
      populate()
    }

    const drawAurora = (t: number) => {
      const time = t * 0.001
      actx.globalCompositeOperation = "source-over"
      actx.fillStyle = "#030409"
      actx.fillRect(0, 0, A_W, A_H)
      actx.globalCompositeOperation = "lighter"
      for (const b of BLOBS) {
        const x = (b.cx + Math.sin(time * b.sp * 7 + b.ph) * b.ox) * A_W
        const y = (b.cy + Math.cos(time * b.sp * 5 + b.ph * 1.7) * b.oy) * A_H - scrollY * 0.00003 * A_H
        const rad = b.r * A_H * (1 + Math.sin(time * b.sp * 9 + b.ph * 2.3) * 0.18)
        const g = actx.createRadialGradient(x, y, 0, x, y, rad)
        g.addColorStop(0, `hsla(${b.h},${b.s}%,${b.l}%,${b.a})`)
        g.addColorStop(0.55, `hsla(${b.h},${b.s}%,${Math.max(b.l - 18, 20)}%,${b.a * 0.45})`)
        g.addColorStop(1, "hsla(230,100%,40%,0)")
        actx.fillStyle = g
        actx.beginPath()
        actx.arc(x, y, rad, 0, Math.PI * 2)
        actx.fill()
      }
    }

    /*
     * Real motion blur, one primitive: each star is its glow sprite stretched along its own
     * on-screen motion (parallax speed x shutter). At rest the stretch is 0 and it is a point;
     * as the page moves it lengthens continuously, so stopping and starting never "switches".
     * The light is spread over the length (alpha falls as it stretches), like a long exposure.
     */
    const drawStars = (t: number) => {
      ctx.clearRect(0, 0, W, H)
      ctx.globalCompositeOperation = "lighter"
      for (const s of stars) {
        const par = s.depth * 0.35
        let y = (s.y - scrollY * par) % H // parallax: near stars move faster
        if (y < 0) y += H
        const a = s.base * (0.6 + 0.4 * Math.sin(t * 0.001 * s.tw + s.ph))
        const v = vel * par // this star's speed on screen, px per frame (+ = moving up)
        const len = Math.min(H * 0.6, Math.abs(v) * SHUTTER)
        const w = s.sz * (1 - 0.4 * Math.min(1, len / (s.sz * 6))) // thins into a thread
        const h = s.sz + len
        ctx.globalAlpha = Math.min(1, a * (1 / (1 + len / (s.sz * 6))) * (1 + Math.min(1, len / 40) * 0.6))
        // the trail lies behind the motion: below when the star rises, above when it falls
        const top = v >= 0 ? y - s.sz * 0.5 : y + s.sz * 0.5 - h
        ctx.drawImage(s.sprite, s.x - w * 0.5, top, w, h)
      }
      ctx.globalAlpha = 1
      ctx.globalCompositeOperation = "source-over"
    }

    let raf = 0, last = 0, auroraLast = -1e9
    let wdT0 = 0, wdFrames = 0, wdSlow = 0, adapted = false, prevT = 0
    const RENDER_MS = 1000 / 62 // cap the work at ~60fps even on 120/144Hz screens

    const frame = (t: number) => {
      raf = requestAnimationFrame(frame)
      if (t - last < RENDER_MS) return
      last = t
      const y = window.scrollY
      // the nav warp jumps the page: that jump is not motion, so it never smears the stars
      const dy = warp.v > 0.01 ? 0 : y - scrollY
      scrollY = y
      vel += (Math.max(-120, Math.min(120, dy)) - vel) * 0.35

      // the aurora is blurred anyway: ~15fps is imperceptible
      if (t - auroraLast >= (tier >= 1 ? 75 : 64)) {
        drawAurora(t)
        auroraLast = t
      }
      drawStars(t)

      // watchdog: if the first ~2.6s run slow, drop one quality tier, once
      if (!adapted) {
        if (!wdT0) wdT0 = t
        if (prevT && t - prevT > 26) wdSlow++
        wdFrames++
        if (t - wdT0 > 2600 && wdFrames > 20) {
          adapted = true
          if (wdSlow / wdFrames > 0.25 && tier < 2) {
            tier++
            populate()
          }
        }
      }
      prevT = t
    }

    // start once the browser is idle: the first paint and the hero come first, the sky fades in after
    const ro = new ResizeObserver(resize)
    const begin = () => {
      resize()
      ro.observe(el)
      el.style.opacity = "1"
      if (reduce) {
        drawAurora(0)
        drawStars(0)
      } else {
        raf = requestAnimationFrame(frame)
      }
    }
    const idle = window.requestIdleCallback ? window.requestIdleCallback(begin, { timeout: 1500 }) : window.setTimeout(begin, 400)
    const onVis = () => {
      cancelAnimationFrame(raf)
      raf = 0
      if (!document.hidden && !reduce) {
        auroraLast = -1e9
        raf = requestAnimationFrame(frame)
      }
    }
    document.addEventListener("visibilitychange", onVis)
    return () => {
      if (window.cancelIdleCallback) window.cancelIdleCallback(idle)
      else window.clearTimeout(idle)
      cancelAnimationFrame(raf)
      ro.disconnect()
      document.removeEventListener("visibilitychange", onVis)
    }
  }, [])

  return (
    <div
      ref={box}
      aria-hidden
      className="pointer-events-none fixed inset-x-0 top-0 z-0 h-lvh overflow-hidden bg-[#030409] opacity-0 transition-opacity duration-[1200ms]"
    >
      <canvas ref={auroraRef} className="absolute -top-[6%] -left-[6%] h-[112%] w-[112%] blur-[34px] saturate-[1.12]" />
      <div className="nebula absolute -inset-[10%] bg-[url('/nebula.webp')] bg-cover bg-center opacity-20 mix-blend-screen" />
      <canvas ref={starsRef} className="absolute inset-0 size-full" />
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 90% 70% at 50% 45%, transparent 35%, rgba(2,3,8,.72) 100%), linear-gradient(180deg, rgba(2,3,8,.5), transparent 20%, transparent 80%, rgba(2,3,8,.65))",
        }}
      />
    </div>
  )
}

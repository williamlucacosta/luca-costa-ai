"use client"

import { useRef } from "react"
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap"
import { cn } from "@/lib/utils"

const MASK: React.CSSProperties = {
  WebkitMask: "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
  WebkitMaskComposite: "xor",
  maskComposite: "exclude",
}

/**
 * Card with a cursor-following glow on its surface and border, plus an optional gentle 3D tilt.
 * The border glow is a masked gradient layer, so only the 1px edge near the pointer lights up.
 * The pointer position travels as two CSS variables; the tilt eases with gsap.quickTo
 * (GSAP is already on the page, so no extra animation library).
 */
export function SpotlightCard({
  children,
  className,
  tilt = false,
}: {
  children: React.ReactNode
  className?: string
  tilt?: boolean
}) {
  const ref = useRef<HTMLDivElement>(null)
  const tiltTo = useRef<{ x: gsap.QuickToFunc; y: gsap.QuickToFunc } | null>(null)

  useGSAP(
    () => {
      if (!tilt || !ref.current || prefersReducedMotion()) return
      gsap.set(ref.current, { transformPerspective: 1200 })
      tiltTo.current = {
        x: gsap.quickTo(ref.current, "rotationX", { duration: 0.6, ease: "power3.out" }),
        y: gsap.quickTo(ref.current, "rotationY", { duration: 0.6, ease: "power3.out" }),
      }
    },
    { scope: ref }
  )

  return (
    <div
      ref={ref}
      onPointerMove={(e) => {
        const el = e.currentTarget
        const r = el.getBoundingClientRect()
        el.style.setProperty("--mx", `${e.clientX - r.left}px`)
        el.style.setProperty("--my", `${e.clientY - r.top}px`)
        if (tiltTo.current && e.pointerType === "mouse") {
          tiltTo.current.x(((e.clientY - r.top) / r.height - 0.5) * -5)
          tiltTo.current.y(((e.clientX - r.left) / r.width - 0.5) * 5)
        }
      }}
      onPointerLeave={() => {
        tiltTo.current?.x(0)
        tiltTo.current?.y(0)
      }}
      className={cn(
        "group/spot relative isolate overflow-hidden rounded-3xl border border-border bg-card/70 backdrop-blur-md [--mx:-1000px] [--my:-1000px]",
        className
      )}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-0 transition-opacity duration-500 group-hover/spot:opacity-100"
        style={{ background: "radial-gradient(480px circle at var(--mx) var(--my), oklch(0.75 0.16 230 / 0.14), transparent 65%)" }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-20 rounded-[inherit] p-px opacity-0 transition-opacity duration-500 group-hover/spot:opacity-100"
        style={{ background: "radial-gradient(280px circle at var(--mx) var(--my), oklch(0.85 0.14 215 / 0.8), transparent 70%)", ...MASK }}
      />
      {children}
    </div>
  )
}

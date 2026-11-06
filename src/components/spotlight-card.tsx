"use client"

import { motion, useMotionTemplate, useMotionValue, useReducedMotion, useSpring } from "motion/react"
import { cn } from "@/lib/utils"

/**
 * Card with a cursor-following glow on its surface and border, plus an optional gentle 3D tilt.
 * The border glow is a masked gradient layer, so only the 1px edge near the pointer lights up.
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
  const reduce = useReducedMotion()
  const mx = useMotionValue(-1000)
  const my = useMotionValue(-1000)
  const rx = useSpring(0, { stiffness: 160, damping: 18 })
  const ry = useSpring(0, { stiffness: 160, damping: 18 })
  const surface = useMotionTemplate`radial-gradient(480px circle at ${mx}px ${my}px, oklch(0.75 0.16 230 / 0.14), transparent 65%)`
  const edge = useMotionTemplate`radial-gradient(280px circle at ${mx}px ${my}px, oklch(0.85 0.14 215 / 0.8), transparent 70%)`

  return (
    <motion.div
      onPointerMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect()
        mx.set(e.clientX - r.left)
        my.set(e.clientY - r.top)
        if (tilt && !reduce && e.pointerType === "mouse") {
          rx.set(((e.clientY - r.top) / r.height - 0.5) * -5)
          ry.set(((e.clientX - r.left) / r.width - 0.5) * 5)
        }
      }}
      onPointerLeave={() => {
        mx.set(-1000)
        my.set(-1000)
        rx.set(0)
        ry.set(0)
      }}
      style={tilt ? { rotateX: rx, rotateY: ry, transformPerspective: 1200 } : undefined}
      className={cn(
        "group/spot relative isolate overflow-hidden rounded-3xl border border-border bg-card/70 backdrop-blur-md",
        className
      )}
    >
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-0 transition-opacity duration-500 group-hover/spot:opacity-100"
        style={{ background: surface }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-20 rounded-[inherit] p-px opacity-0 transition-opacity duration-500 group-hover/spot:opacity-100"
        style={{
          background: edge,
          WebkitMask: "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
          WebkitMaskComposite: "xor",
          maskComposite: "exclude",
        }}
      />
      {children}
    </motion.div>
  )
}

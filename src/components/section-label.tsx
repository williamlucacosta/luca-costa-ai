"use client"

import { SplitReveal } from "@/components/gsap-text"
import { cn } from "@/lib/utils"

/** Opens a section with its name, written large. No numbers, no rules: the type does the separating. */
export function SectionLabel({ label, className, id }: { label: string; className?: string; id?: string }) {
  return (
    <div id={id} className={cn("mb-6 md:mb-8", className)}>
      <SplitReveal as="h2" className="font-display text-[clamp(3rem,8vw,7rem)] leading-[0.95] font-semibold tracking-[-0.055em]">
        {label}
      </SplitReveal>
    </div>
  )
}

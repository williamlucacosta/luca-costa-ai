"use client"

import { useEffect, useState } from "react"
import { person } from "@/content/profile"

const fmt = new Intl.DateTimeFormat("en-GB", { timeZone: person.timeZone, hour: "2-digit", minute: "2-digit" })

/** Current time in Italy — client-only so the static HTML never mismatches. */
export function LocalTime() {
  const [now, setNow] = useState<string | null>(null)
  useEffect(() => {
    const tick = () => setNow(fmt.format(new Date()))
    tick()
    const id = setInterval(tick, 15_000)
    return () => clearInterval(id)
  }, [])
  return <time suppressHydrationWarning>{now ?? "--:--"}</time>
}

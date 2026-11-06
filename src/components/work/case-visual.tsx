import { cn } from "@/lib/utils"

/**
 * Generated, on-brand artwork for each case study: a small diagram of what the system does.
 * Pure SVG, one shared vocabulary (glass nodes, a tinted hub, flowing dashed links).
 */
export function CaseVisual({ slug, hue, className }: { slug: string; hue: number; className?: string }) {
  const tint = `oklch(0.72 0.16 ${hue})`
  return (
    <div className={cn("relative overflow-hidden rounded-2xl border border-foreground/[0.07] bg-foreground/[0.02]", className)}>
      {/* a single soft light, tinted per project; the card's glass shows through everywhere else */}
      <div aria-hidden className="absolute inset-0" style={{ background: `radial-gradient(70% 60% at 50% 50%, oklch(0.6 0.14 ${hue} / 0.16), transparent 70%)` }} />
      <svg viewBox="0 0 400 260" className="absolute inset-0 size-full" preserveAspectRatio="xMidYMid meet" aria-hidden>
        {slug === "nagiren" && <Merge tint={tint} />}
        {slug === "unigent" && <Graph tint={tint} />}
        {slug === "agent-flows" && <Ladder tint={tint} />}
      </svg>
    </div>
  )
}

const LABEL = "fill-foreground/60 font-mono text-[7px] tracking-[0.14em] uppercase"
const TITLE = "fill-foreground font-display text-[11px] font-semibold"

/** Rounded glass node; solid fill so links end cleanly under it */
function Node({ x, y, w = 64, h = 26, label, tint, lit }: { x: number; y: number; w?: number; h?: number; label: string; tint: string; lit?: boolean }) {
  return (
    <g>
      <rect x={x - w / 2} y={y - h / 2} width={w} height={h} rx={8} className="fill-card" stroke={lit ? tint : "rgb(255 255 255 / 0.14)"} strokeOpacity={lit ? 0.8 : 1} />
      <circle cx={x - w / 2 + 10} cy={y} r={2} fill={tint} fillOpacity={lit ? 1 : 0.6} />
      <text x={x + 5} y={y + 2.5} textAnchor="middle" className={LABEL}>
        {label}
      </text>
    </g>
  )
}

/** Central hub: tinted ring, faint halo, title and caption */
function Hub({ x, y, r = 32, title, caption, tint }: { x: number; y: number; r?: number; title: string; caption: string; tint: string }) {
  return (
    <g>
      <circle cx={x} cy={y} r={r + 12} fill="none" stroke={tint} strokeOpacity={0.14} />
      <circle cx={x} cy={y} r={r} className="fill-card" stroke={tint} strokeOpacity={0.8} strokeWidth={1.5} />
      <text x={x} y={y - 1} textAnchor="middle" className={TITLE}>
        {title}
      </text>
      <text x={x} y={y + 11} textAnchor="middle" className={LABEL}>
        {caption}
      </text>
    </g>
  )
}

function Link({ d, tint, faint }: { d: string; tint: string; faint?: boolean }) {
  return faint ? (
    <path d={d} fill="none" stroke="rgb(255 255 255 / 0.08)" />
  ) : (
    <path d={d} fill="none" stroke={tint} strokeOpacity={0.5} strokeDasharray="2 4" className="flow-dash" />
  )
}

/** Unigent: a supervisor coordinating six agents */
function Graph({ tint }: { tint: string }) {
  const pts = Array.from({ length: 6 }, (_, i) => {
    const a = (i / 6) * Math.PI * 2 - Math.PI / 2
    return [Math.round(200 + Math.cos(a) * 128), Math.round(130 + Math.sin(a) * 88)] as const
  })
  return (
    <g>
      {pts.map(([x, y], i) => {
        const [nx, ny] = pts[(i + 1) % 6]
        return <Link key={`r${i}`} d={`M${x},${y} L${nx},${ny}`} tint={tint} faint />
      })}
      {pts.map(([x, y], i) => (
        <Link key={`l${i}`} d={`M200,130 L${x},${y}`} tint={tint} />
      ))}
      {pts.map(([x, y], i) => (
        <Node key={`n${i}`} x={x} y={y} label={`Agent ${i + 1}`} tint={tint} lit={i === 0} />
      ))}
      <Hub x={200} y={130} title="Supervisor" caption="MCP" tint={tint} />
    </g>
  )
}

/** Nagiren: many sources normalised into one library, then served */
function Merge({ tint }: { tint: string }) {
  const src = ["TMDB", "AniList", "IGDB", "MusicBrainz", "OpenLibrary"]
  const out = ["Library", "Imports", "Alerts"]
  const hx = 210
  const hy = 130
  return (
    <g>
      {src.map((_, i) => {
        const y = 42 + i * 44
        return <Link key={`s${i}`} d={`M80,${y} C140,${y} 150,${hy} ${hx},${hy}`} tint={tint} />
      })}
      {out.map((_, i) => {
        const y = 74 + i * 56
        return <Link key={`o${i}`} d={`M${hx},${hy} C280,${hy} 280,${y} 330,${y}`} tint={tint} />
      })}
      {src.map((s, i) => (
        <Node key={s} x={64} y={42 + i * 44} w={84} label={s} tint={tint} />
      ))}
      {out.map((s, i) => (
        <Node key={s} x={340} y={74 + i * 56} w={72} label={s} tint={tint} lit={i === 0} />
      ))}
      <Hub x={hx} y={hy} title="Nagiren" caption="10+ sources" tint={tint} r={36} />
    </g>
  )
}

/** Agent Flows: the escalation ladder, cheapest step first */
function Ladder({ tint }: { tint: string }) {
  const steps = [
    { t: "Code", c: "Deterministic" },
    { t: "Refine", c: "Sonnet" },
    { t: "Redo", c: "Opus" },
    { t: "Human", c: "Review" },
  ]
  const at = (i: number) => [62 + i * 92, 196 - i * 46] as const
  return (
    <g>
      {steps.slice(0, -1).map((_, i) => {
        const [x, y] = at(i)
        const [nx, ny] = at(i + 1)
        return <Link key={`l${i}`} d={`M${x},${y} L${x},${ny} L${nx},${ny}`} tint={tint} />
      })}
      {steps.map((s, i) => {
        const [x, y] = at(i)
        return (
          <g key={s.t}>
            <Node x={x} y={y} w={72} label={s.t} tint={tint} lit={i === 0} />
            <text x={x} y={y + 26} textAnchor="middle" className="font-mono text-[8px]" fill={tint} fillOpacity={1 - i * 0.18}>
              {s.c}
            </text>
          </g>
        )
      })}
      <text x={30} y={40} className={TITLE}>
        Escalate only when needed
      </text>
      <text x={30} y={54} className={LABEL}>
        Code first · AI second · People last
      </text>
    </g>
  )
}

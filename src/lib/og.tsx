import { readFile } from "node:fs/promises"
import { join } from "node:path"
import { ImageResponse } from "next/og"

export const ogSize = { width: 1200, height: 630 }
export const ogContentType = "image/png"

// a fixed, hand-placed starfield so every card is identical from build to build
const STARS = Array.from({ length: 70 }, (_, i) => {
  const r = (n: number) => ((Math.sin(i * 12.9898 + n * 78.233) * 43758.5453) % 1 + 1) % 1
  return { x: r(1) * 1200, y: r(2) * 630, s: 1 + r(3) * 2.4, o: 0.25 + r(4) * 0.6 }
})

/** Social / search preview card (1200x630), rendered to PNG at build time */
export async function ogImage({ eyebrow, title, subtitle }: { eyebrow: string; title: string; subtitle: string }) {
  const logo = `data:image/png;base64,${(await readFile(join(process.cwd(), "public/icon-192.png"))).toString("base64")}`
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: "radial-gradient(120% 90% at 75% 10%, #1a1f5c 0%, #070a1c 45%, #030409 100%)",
          color: "#eef2f8",
          position: "relative",
        }}
      >
        {STARS.map((s, i) => (
          <div key={i} style={{ position: "absolute", left: s.x, top: s.y, width: s.s, height: s.s, borderRadius: 9999, background: "#cfe3ff", opacity: s.o }} />
        ))}
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          {/* eslint-disable-next-line @next/next/no-img-element -- rendered by Satori, not the browser */}
          <img src={logo} width={64} height={64} alt="" />
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontSize: 28, fontWeight: 600 }}>Luca Costa</span>
            <span style={{ fontSize: 18, letterSpacing: 4, color: "#9aa6bd" }}>AI ENGINEER</span>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <span style={{ fontSize: 22, letterSpacing: 4, color: "#4fd6ff", textTransform: "uppercase" }}>{eyebrow}</span>
          <span style={{ marginTop: 18, fontSize: title.length > 26 ? 76 : 104, fontWeight: 700, letterSpacing: -3, lineHeight: 1 }}>{title}</span>
          <span style={{ marginTop: 26, fontSize: 32, color: "#b9c3d6", maxWidth: 980, lineHeight: 1.3 }}>{subtitle}</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 20, color: "#7d89a3" }}>
          <span>williamlucacosta.it</span>
          <div style={{ display: "flex", width: 220, height: 4, borderRadius: 4, background: "linear-gradient(90deg, #3b6bff, #2fd3ff)" }} />
        </div>
      </div>
    ),
    ogSize
  )
}

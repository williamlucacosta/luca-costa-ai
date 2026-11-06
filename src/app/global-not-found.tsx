import type { Metadata } from "next"
import { Funnel_Display, Geist } from "next/font/google"
import { getContent, localePath } from "@/content/profile"
import "./globals.css"

const funnel = Funnel_Display({ variable: "--font-funnel", subsets: ["latin"] })
const geist = Geist({ variable: "--font-geist", subsets: ["latin"] })

export const metadata: Metadata = { title: "404 · Luca Costa", robots: { index: false, follow: true } }

/** One 404 for both languages: it is served for any unknown URL, so it speaks both. */
export default function GlobalNotFound() {
  const en = getContent("en").ui.notFound
  const it = getContent("it").ui.notFound
  return (
    <html lang="en" className={`${funnel.variable} ${geist.variable}`}>
      <body className="grain grid min-h-dvh place-items-center bg-background px-5 text-foreground antialiased">
        <main className="max-w-xl text-center">
          <p className="font-mono text-xs tracking-widest text-signal">404</p>
          <h1 className="mt-6 font-display text-5xl font-semibold tracking-[-0.05em] md:text-7xl">{en.title}</h1>
          <p className="mt-4 text-muted-foreground">{en.body}</p>
          <p lang="it" className="mt-1 text-muted-foreground">
            {it.body}
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <a href={localePath("en", "/")} className="inline-flex h-12 items-center rounded-full bg-foreground px-7 text-sm font-medium text-background">
              {en.back}
            </a>
            <a href={localePath("it", "/")} lang="it" className="inline-flex h-12 items-center rounded-full border border-foreground/15 px-7 text-sm">
              {it.back}
            </a>
          </div>
        </main>
      </body>
    </html>
  )
}

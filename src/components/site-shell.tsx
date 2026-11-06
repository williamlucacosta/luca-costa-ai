import type { Viewport } from "next"
import { ViewTransition } from "react"
import { Funnel_Display, Geist, Geist_Mono } from "next/font/google"
import { WarpNav } from "@/components/warp-nav"
import { SmoothScroll } from "@/components/smooth-scroll"
import { SpaceField } from "@/components/space-field"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { LocaleProvider } from "@/content/locale-context"
import { getContent, type Locale } from "@/content/profile"
import "@/app/globals.css"

const funnel = Funnel_Display({ variable: "--font-funnel", subsets: ["latin"] })
const geist = Geist({ variable: "--font-geist", subsets: ["latin"] })
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] })

export const viewport: Viewport = {
  themeColor: "#030409",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
}

/** The document for one language. Each language is its own root layout (/ and /it), sharing this shell. */
export function SiteShell({ locale, children }: { locale: Locale; children: React.ReactNode }) {
  const c = getContent(locale)
  return (
    <html lang={locale} className={`${funnel.variable} ${geist.variable} ${geistMono.variable}`}>
      <body className="grain relative min-h-dvh overflow-x-clip bg-background text-foreground antialiased">
        <LocaleProvider locale={locale}>
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:rounded-lg focus:bg-foreground focus:px-3 focus:py-2 focus:text-background"
          >
            {c.ui.skip}
          </a>
          <SmoothScroll />
          <SpaceField />
          <SiteHeader />
          <ViewTransition>
            <main id="main" className="relative z-10">
              {children}
            </main>
          </ViewTransition>
          <SiteFooter />
          <WarpNav />
        </LocaleProvider>
      </body>
    </html>
  )
}

/** Structured data, rendered as a JSON-LD script tag */
export function JsonLd({ data }: { data: object }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }} />
}

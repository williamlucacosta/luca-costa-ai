import type { Metadata } from "next"
import { getContent, localePath, person, type Locale } from "@/content/profile"

const OG_LOCALE: Record<Locale, string> = { en: "en_US", it: "it_IT" }

/**
 * Per-page metadata with the full SEO set: canonical URL, hreflang alternates (en, it, x-default),
 * Open Graph and Twitter cards. `path` is the language-neutral path, e.g. "/" or "/work/nagiren/".
 */
export function pageMetadata({
  locale,
  path,
  title,
  description,
  type = "website",
  absoluteTitle = false,
}: {
  locale: Locale
  path: string
  title: string
  description: string
  type?: "website" | "profile" | "article"
  absoluteTitle?: boolean
}): Metadata {
  const url = localePath(locale, path)
  const other: Locale = locale === "en" ? "it" : "en"
  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: {
      canonical: url,
      languages: { en: localePath("en", path), it: localePath("it", path), "x-default": localePath("en", path) },
    },
    openGraph: {
      type,
      url,
      title,
      description,
      siteName: person.name,
      locale: OG_LOCALE[locale],
      alternateLocale: [OG_LOCALE[other]],
    },
    twitter: { card: "summary_large_image", title, description },
  }
}

/** Metadata shared by every page of one language (icons, robots, defaults) */
export function siteMetadata(locale: Locale): Metadata {
  const c = getContent(locale)
  return {
    metadataBase: new URL(person.url),
    title: { default: c.seo.title, template: `%s · ${person.name}` },
    description: c.seo.description,
    applicationName: person.name,
    authors: [{ name: person.fullName, url: person.url }],
    creator: person.fullName,
    keywords: [
      "AI Engineer",
      "Luca Costa",
      "William Luca Costa",
      "AI agents",
      "multi-agent systems",
      "agentic engineering",
      "Claude Code",
      "MCP",
      "LangGraph",
      "full-stack developer",
      "TypeScript",
      "Next.js",
      "Catania",
      ...(locale === "it" ? ["sviluppatore full-stack", "ingegnere informatico", "agenti AI", "sistemi multi-agente"] : []),
    ],
    formatDetection: { telephone: false, address: false, email: false },
    robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 } },
    icons: {
      icon: [
        { url: "/favicon.ico", sizes: "any" },
        { url: "/favicon-32.png", type: "image/png", sizes: "32x32" },
        { url: "/icon-192.png", type: "image/png", sizes: "192x192" },
      ],
      apple: "/apple-touch-icon.png",
    },
    manifest: "/site.webmanifest",
  }
}

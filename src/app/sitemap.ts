import type { MetadataRoute } from "next"
import { getContent, localePath, locales, person } from "@/content/profile"

export const dynamic = "force-static"

/** Every page in both languages, each listing its translation (hreflang) for Google */
export default function sitemap(): MetadataRoute.Sitemap {
  const abs = (p: string) => new URL(p, person.url).toString()
  const paths = ["/", ...getContent("en").caseStudies.map((c) => `/work/${c.slug}/`)]
  const lastModified = new Date()
  return paths.flatMap((path) =>
    locales.map((l) => ({
      url: abs(localePath(l, path)),
      lastModified,
      changeFrequency: "monthly" as const,
      priority: path === "/" ? 1 : 0.8,
      alternates: { languages: { en: abs(localePath("en", path)), it: abs(localePath("it", path)), "x-default": abs(localePath("en", path)) } },
    }))
  )
}

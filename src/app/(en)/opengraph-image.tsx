import { person, getContent } from "@/content/profile"
import { ogImage, ogSize, ogContentType } from "@/lib/og"

export const dynamic = "force-static"
export const size = ogSize
export const contentType = ogContentType
export const alt = getContent("en").seo.title

export default function Image() {
  const c = getContent("en")
  return ogImage({ eyebrow: `${person.title} · ${c.qualifier}`, title: person.name, subtitle: c.hero.lead })
}

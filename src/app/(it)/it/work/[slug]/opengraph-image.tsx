import { getContent } from "@/content/profile"
import { ogImage, ogSize, ogContentType } from "@/lib/og"

export const dynamic = "force-static"
export const dynamicParams = false
export const generateStaticParams = () => getContent("en").caseStudies.map((c) => ({ slug: c.slug }))
export const size = ogSize
export const contentType = ogContentType
export const alt = "Caso studio · Luca Costa, AI Engineer"

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const c = getContent("it")
  const cs = c.caseStudies.find((x) => x.slug === slug)!
  return ogImage({ eyebrow: `${c.seo.caseTitle(cs.name).split(" · ")[1]} · ${cs.kind}`, title: cs.name, subtitle: cs.oneLiner })
}

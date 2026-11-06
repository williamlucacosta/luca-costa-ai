import type { Metadata } from "next"
import { HomePage } from "@/components/pages/home-page"
import { getContent } from "@/content/profile"
import { pageMetadata } from "@/lib/seo"

const c = getContent("en")

export const metadata: Metadata = pageMetadata({ locale: "en", path: "/", title: c.seo.title, description: c.seo.description, type: "profile", absoluteTitle: true })

export default function Page() {
  return <HomePage locale="en" />
}

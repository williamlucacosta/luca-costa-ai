import { SiteShell } from "@/components/site-shell"
import { siteMetadata } from "@/lib/seo"

export { viewport } from "@/components/site-shell"
export const metadata = siteMetadata("it")

export default function Layout({ children }: { children: React.ReactNode }) {
  return <SiteShell locale="it">{children}</SiteShell>
}

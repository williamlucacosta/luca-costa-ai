import { Hero } from "@/components/hero/hero"
import { CaseGallery } from "@/components/work/case-gallery"
import { Mindset } from "@/components/sections/mindset"
import { BeyondCode, Experience, MoreWork, Principles, Statement, Toolbox } from "@/components/sections/sections"
import { JsonLd } from "@/components/site-shell"
import { homeGraph } from "@/lib/structured-data"
import type { Locale } from "@/content/profile"

export function HomePage({ locale }: { locale: Locale }) {
  return (
    <>
      <JsonLd data={homeGraph(locale)} />
      <Hero />
      <Statement />
      <Principles />
      <CaseGallery />
      <Mindset />
      <MoreWork />
      <Toolbox />
      <Experience />
      <BeyondCode />
    </>
  )
}

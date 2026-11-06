import { CasePage, caseMetadata, caseParams } from "@/components/pages/case-page"

export const dynamicParams = false
export const generateStaticParams = caseParams

export async function generateMetadata({ params }: PageProps<"/it/work/[slug]">) {
  return caseMetadata("it", (await params).slug)
}

export default async function Page({ params }: PageProps<"/it/work/[slug]">) {
  return <CasePage locale="it" slug={(await params).slug} />
}

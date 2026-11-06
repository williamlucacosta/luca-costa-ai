import { CasePage, caseMetadata, caseParams } from "@/components/pages/case-page"

export const dynamicParams = false
export const generateStaticParams = caseParams

export async function generateMetadata({ params }: PageProps<"/work/[slug]">) {
  return caseMetadata("en", (await params).slug)
}

export default async function Page({ params }: PageProps<"/work/[slug]">) {
  return <CasePage locale="en" slug={(await params).slug} />
}

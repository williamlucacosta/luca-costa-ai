import { getContent, localePath, person, type CaseStudy, type Locale } from "@/content/profile"

const abs = (path: string) => new URL(path, person.url).toString()
const PERSON_ID = `${person.url}/#person`
const SITE_ID = `${person.url}/#website`

function personNode(locale: Locale) {
  const c = getContent(locale)
  return {
    "@type": "Person",
    "@id": PERSON_ID,
    name: person.fullName,
    alternateName: person.name,
    givenName: "William Luca",
    familyName: "Costa",
    jobTitle: `${person.title}, ${c.qualifier}`,
    description: c.seo.description,
    url: abs(localePath(locale, "/")),
    image: abs("/icon-512.png"),
    email: `mailto:${person.email}`,
    address: { "@type": "PostalAddress", addressLocality: "Catania", addressRegion: "Sicilia", addressCountry: "IT" },
    nationality: { "@type": "Country", name: "Italy" },
    alumniOf: { "@type": "CollegeOrUniversity", name: "Università degli Studi di Catania", sameAs: "https://www.unict.it" },
    hasCredential: c.certifications.names.map((n) => ({
      "@type": "EducationalOccupationalCredential",
      name: n,
      credentialCategory: "certification",
      recognizedBy: { "@type": "Organization", name: c.certifications.issuer },
    })),
    knowsAbout: [
      "Artificial intelligence",
      "AI agents",
      "Multi-agent systems",
      "Claude Code",
      "Model Context Protocol",
      "LangGraph",
      "TypeScript",
      "React",
      "Next.js",
      "Vue.js",
      "PostgreSQL",
      "Rust",
      "Unity",
    ],
    knowsLanguage: [
      { "@type": "Language", name: "Italian", alternateName: "it" },
      { "@type": "Language", name: "English", alternateName: "en" },
    ],
    sameAs: [person.linkedin, person.github],
  }
}

/** Home: a ProfilePage about the person, inside the website */
export function homeGraph(locale: Locale) {
  const c = getContent(locale)
  const url = abs(localePath(locale, "/"))
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": SITE_ID,
        url: abs("/"),
        name: person.name,
        alternateName: person.fullName,
        inLanguage: ["en", "it"],
        publisher: { "@id": PERSON_ID },
      },
      {
        "@type": "ProfilePage",
        "@id": `${url}#page`,
        url,
        name: c.seo.title,
        description: c.seo.description,
        inLanguage: locale,
        isPartOf: { "@id": SITE_ID },
        mainEntity: { "@id": PERSON_ID },
        dateModified: new Date().toISOString().slice(0, 10),
      },
      personNode(locale),
    ],
  }
}

/** Case study: an article about the project, with breadcrumbs back home */
export function caseGraph(locale: Locale, cs: CaseStudy) {
  const c = getContent(locale)
  const home = abs(localePath(locale, "/"))
  const url = abs(localePath(locale, `/work/${cs.slug}/`))
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        "@id": `${url}#article`,
        url,
        headline: cs.seo.title,
        description: cs.seo.description,
        inLanguage: locale,
        author: { "@id": PERSON_ID },
        publisher: { "@id": PERSON_ID },
        isPartOf: { "@id": SITE_ID },
        about: {
          "@type": "SoftwareApplication",
          name: cs.name,
          applicationCategory: "DeveloperApplication",
          description: cs.summary,
          ...(cs.link ? { url: cs.link.href } : {}),
          creator: { "@id": PERSON_ID },
        },
        keywords: cs.stack.join(", "),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: person.name, item: home },
          { "@type": "ListItem", position: 2, name: c.ui.work.label, item: `${home}#work` },
          { "@type": "ListItem", position: 3, name: cs.name, item: url },
        ],
      },
      personNode(locale),
    ],
  }
}

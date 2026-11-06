/**
 * Single source of truth for the site's copy, in English and Italian.
 * Facts come from Luca's CV (Jun 2026) and professional profile (Oct 2026), confirmed by him on 2026-10-25,
 * and were cross-checked against the project folders on disk.
 * Voice: short, declarative sentences. One idea per sentence. No em dashes in visible copy.
 * Work at Flazio is described generically on purpose (confidentiality).
 */

export type Locale = "en" | "it"
export const locales: Locale[] = ["en", "it"]

/** Facts that do not change with the language */
export const person = {
  name: "Luca Costa",
  fullName: "William Luca Costa",
  title: "AI Engineer",
  timeZone: "Europe/Rome",
  email: "williamlucacosta17@gmail.com",
  linkedin: "https://www.linkedin.com/in/luca-costa-535b5a172",
  github: "https://github.com/williamlucacosta",
  url: "https://williamlucacosta.it",
}

/** Path of a page in a given language: English lives at the root, Italian under /it */
export function localePath(locale: Locale, path = "/") {
  const p = path.startsWith("/") ? path : `/${path}`
  return locale === "it" ? `/it${p === "/" ? "/" : p}` : p
}

export type Metric = { value: number; decimals?: number; prefix?: string; suffix?: string; label: string }

export type CaseStudy = {
  slug: string
  name: string
  kind: string
  period: string
  role: string
  oneLiner: string
  summary: string
  problem: string
  approach: string[]
  verification: string[]
  metrics: Metric[]
  stack: string[]
  link?: { label: string; href: string }
  /** Visual identity used for the generated cover */
  hue: number
  seo: { title: string; description: string }
}

export type Project = { name: string; kind: string; year: string; body: string }

const en = {
  locale: "en" as Locale,
  qualifier: "Full-Stack & Agentic Systems",
  location: "Catania, Italy",
  languages: [
    { name: "Italian", level: "Native" },
    { name: "English", level: "C1" },
  ],
  seo: {
    title: "Luca Costa · AI Engineer, Full-Stack & Agentic Systems",
    description:
      "AI Engineer in Catania, Italy. I design products and build them with teams of AI agents: multi-agent systems, Claude Code and MCP, full-stack TypeScript. Every result verified.",
    caseTitle: (name: string) => `${name} · Case study`,
  },
  hero: {
    lead: "I design products and build them with teams of AI agents.",
    cyclePrefix: "Every result,",
    cycle: ["verified.", "tested.", "measured.", "shipped."],
  },
  statement: "Generating code is easy. Knowing when it's right is the job.",
  about: "Computer engineer. Full-stack developer. I write the spec, run the agents in parallel and keep the final say.",
  caseStudies: [
    {
      slug: "nagiren",
      name: "Nagiren",
      kind: "SaaS · In production",
      period: "Mar to Oct 2026",
      role: "Solo. Product, engineering and infrastructure.",
      oneLiner: "Everything you watch, play and read. One library.",
      summary:
        "A full-stack SaaS that brings films, series, anime, manga, games, books, music and board games together. Designed, built and run by one person.",
      problem:
        "Every medium lives in its own app, with its own catalogue. Nagiren unifies more than ten sources into one consistent library, with imports, notifications and paid plans.",
      approach: [
        "Vue 3 and TypeScript on the front end. An Express API on PostgreSQL. Stripe Checkout, web push and scheduled jobs.",
        "TMDB, AniList, IGDB, MusicBrainz, OpenLibrary and more, normalised into a single catalogue model with fallbacks for each medium.",
        "One-step imports from TV Time, MyAnimeList, AniList and CSV, so people can bring their history with them.",
        "Architecture and decisions written down first. The agents build from those documents.",
      ],
      verification: [
        "424 automated tests. 341 on the server, 83 on the client. All of them run before every release.",
        "Versioned database migrations and validated input at every API boundary.",
        "Continuous deployment to Oracle Cloud with Coolify, and automatic backups.",
      ],
      metrics: [
        { value: 424, label: "automated tests" },
        { value: 10, suffix: "+", label: "data sources" },
        { value: 132, label: "commits to v1.20" },
        { value: 7, label: "media categories" },
      ],
      stack: ["Vue 3", "TypeScript", "Express", "PostgreSQL", "Zod", "Stripe", "Vitest", "Coolify", "Oracle Cloud"],
      link: { label: "nagiren.com", href: "https://nagiren.com" },
      hue: 225,
      seo: {
        title: "Nagiren, a full-stack SaaS built solo · Case study",
        description:
          "How Luca Costa built Nagiren alone: one library for films, anime, games, books and music from 10+ sources. Vue 3, PostgreSQL, Stripe and 424 automated tests.",
      },
    },
    {
      slug: "unigent",
      name: "Unigent",
      kind: "Native desktop · Agent orchestration",
      period: "Oct 2026",
      role: "Design and engineering.",
      oneLiner: "One supervisor. Many agents. One map.",
      summary:
        "A native desktop app that coordinates many Claude Code agents as a graph, not a wall of terminals. No browser. No Node. No Electron.",
      problem:
        "Run several coding agents at once and chaos follows. Who is doing what? Who is waiting on whom? Are two agents stuck on each other?",
      approach: [
        "Every project is a node on a map. A supervisor agent coordinates the rest.",
        "Agents talk through an MCP server on authorised channels only.",
        "Seven ready-made flows, from spec and build to review gates and debugging. A git panel built in.",
        "Rebuilt from an Electron prototype into Rust and egui. One executable of about 6.5 MB, built for Windows, macOS and Linux.",
      ],
      verification: [
        "Deadlock detection and a four-hop delegation limit keep agents from looping on each other.",
        "Runs on the Claude plan and removes API keys from the agents' environment. No surprise bills.",
      ],
      metrics: [
        { value: 6.5, decimals: 1, prefix: "~", suffix: " MB", label: "single native binary" },
        { value: 7, label: "flow templates" },
        { value: 3, label: "operating systems" },
      ],
      stack: ["Rust", "egui", "MCP", "Claude Code", "GitHub Actions"],
      hue: 205,
      seo: {
        title: "Unigent, multi-agent orchestration for Claude Code · Case study",
        description:
          "Unigent coordinates many Claude Code agents as a graph: a supervisor, MCP channels, deadlock detection. A native Rust app of about 6.5 MB for Windows, macOS and Linux.",
      },
    },
    {
      slug: "agent-flows",
      name: "Agent Flows",
      kind: "AI automation · Side project",
      period: "2026",
      role: "Side project. Design and engineering.",
      oneLiner: "Code first. AI when it helps. People last.",
      summary:
        "A platform concept that automates services for real-estate agencies. A visual flow editor, a white-label client portal and floor-plan redrawing.",
      problem:
        "Most automation either hands everything to AI or nothing at all. Agent Flows always takes the cheapest step that can do the job, and shows what each step costs.",
      approach: [
        "A visual flow editor with eleven node types. AI, checks, branches, loops, client questions, human review and delivery.",
        "An escalation ladder. Deterministic code runs first. A model steps in only when needed. A person reviews as the last resort.",
        "A white-label client portal and floor-plan redrawing as complete, end-to-end use cases.",
      ],
      verification: [
        "Each step costs more than the one before it, so a step only runs when the cheaper one could not finish the job.",
        "Claude Sonnet for routine steps. Opus only where the extra reasoning pays for itself.",
      ],
      metrics: [
        { value: 11, label: "node types" },
        { value: 4, label: "escalation steps" },
      ],
      stack: ["React 19", "TypeScript", "Vite", "React Flow", "Zustand", "Claude Sonnet", "Claude Opus"],
      hue: 185,
      seo: {
        title: "Agent Flows, AI automation with an escalation ladder · Case study",
        description:
          "Agent Flows automates real-estate services with a visual flow editor: code first, Claude when it helps, a person last. Eleven node types and a white-label client portal.",
      },
    },
  ] as CaseStudy[],
  moreWork: [
    {
      name: "Multi-Agent Platform",
      kind: "LLM orchestration · Python",
      year: "2025",
      body: "Agents organised like a company: agents, teams and a supervisor above them, on LangGraph. Local and cloud models, with automatic fallback.",
    },
    {
      name: "Gravity Desktop",
      kind: "Desktop concept · Rust",
      year: "2026",
      body: "A calmer desktop. Apps, files and folders fall into gravity wells instead of piling up. Rebuilt natively on the GPU, from 426 MB of memory at rest to 93.",
    },
    {
      name: "Always in Time",
      kind: "Game · Unity 6",
      year: "2026",
      body: "A narrative platformer with 20 levels and 41 combat arenas. An automated harness replays the full route before every build.",
    },
    {
      name: "Name Finder",
      kind: "Tooling · Python",
      year: "2026",
      body: "Seven naming strategies, a quality score from 0 to 100 and live availability checks against DNS and RDAP.",
    },
  ] as Project[],
  principles: [
    { title: "Spec first.", body: "Every feature begins as a clear, written spec. Agents build from intent, not guesswork." },
    { title: "Parallel by design.", body: "Several agents build and review at the same time. I stay the architect." },
    { title: "Verified before it ships.", body: "Tests, visual checks and review gates decide. Not confidence." },
  ],
  mindset: [
    { word: "Creativity", body: "Code, games, 3D and music. Ideas move freely between them." },
    { word: "Lateral thinking", body: "When the obvious path is costly, I find another one. Code before AI. AI before people." },
    { word: "Ownership", body: "From the first spec to the server it runs on." },
    { word: "Curiosity", body: "New stack, new domain. I learn it by building something real." },
    { word: "Craft", body: "The details nobody asks for are the ones everybody feels." },
    { word: "Clarity", body: "Decisions written down. Trade-offs explained. Easy to follow, easy to challenge." },
  ],
  capabilities: [
    { area: "Agentic engineering", skills: ["Multi-agent orchestration", "Claude Code and MCP", "LangGraph", "Spec, build and review pipelines"] },
    { area: "AI in business", skills: ["Code, model, human escalation", "Cost per step", "Human in the loop"] },
    { area: "Full-stack product", skills: ["React 19", "Next.js", "Vue 3", "TypeScript", "PostgreSQL", "Stripe"] },
    { area: "Infrastructure", skills: ["Docker", "Coolify and Traefik", "Oracle Cloud", "CI/CD"] },
    { area: "Desktop and systems", skills: ["Rust", "egui and Tauri", "Direct3D 11", "Electron"] },
    { area: "Games and 3D", skills: ["Unity 6", "Unreal Engine 5", "Three.js and WebGL", "Blender"] },
  ],
  experience: [
    {
      period: "Nov 2025 to now",
      title: "Full-Stack Developer",
      org: "Flazio S.r.l.",
      summary: "I build and maintain features across the full stack of a web platform used by businesses.",
    },
  ],
  education: [
    { period: "2017 to 2024", title: "B.Sc. Computer Engineering", org: "University of Catania" },
    { period: "2024 to now", title: "Unreal Engine 5 in C++", org: "Udemy" },
    { period: "2021 to 2022", title: "Nand to Tetris I and II", org: "Coursera" },
  ],
  certifications: {
    issuer: "Palo Alto Networks",
    year: "2026",
    names: ["Cybersecurity Fundamentals", "Network Security Fundamentals", "Cloud Security Fundamentals"],
  },
  beyondCode: {
    lead: "Games, 3D and original music. Where the eye for detail comes from.",
    items: [
      {
        name: "Redshift",
        meta: "2D game · Unity · 2020",
        body: "Built entirely on my own. Game logic, level design, sprites, soundtrack and difficulty balancing, from concept to release.",
      },
      { name: "Original soundtracks", meta: "Music", body: "Composed for my own games and projects." },
      { name: "3D characters", meta: "Blender · Substance Painter", body: "Modelled, textured and rendered from scratch." },
    ],
  },
  keywords: [
    "AI Engineer",
    "Multi-agent systems",
    "Claude Code",
    "MCP",
    "LangGraph",
    "Review gates",
    "Full-stack TypeScript",
    "Self-hosted infrastructure",
    "Rust",
    "Unity",
  ],
  ui: {
    nav: { work: "Work", mindset: "Mindset", toolbox: "Toolbox", experience: "Experience" },
    letsTalk: "Let's talk",
    openMenu: "Open menu",
    closeMenu: "Close menu",
    home: "home",
    skip: "Skip to content",
    language: "Language",
    seeWork: "See the work",
    getInTouch: "Get in touch",
    scroll: "Scroll",
    statement: "Statement",
    method: { label: "How I work", sub: "One person. A whole team's output." },
    work: { label: "Selected work", sub: ["Shipped.", "Not demoed."], intro: "Three systems. The decisions and the numbers behind them.", read: "Read the case study" },
    mind: { label: "How I think", sub: ["Ideas,", "entangled."], aria: "Soft skills" },
    more: { label: "Also built", sub: "Same method. Other worlds." },
    toolbox: { label: "Toolbox", sub: "Wide range. One way of working." },
    xp: { label: "Experience", sub: "A team by day. Systems by night.", certs: "Certifications" },
    beyond: { label: "Beyond code" },
    contact: {
      label: "Contact",
      sub: "Let's build something that ships.",
      copy: "Copy email",
      copied: "Copied",
      built: "Built with Next.js, GSAP and WebGL. Specced, reviewed and shipped with agents.",
    },
    caseStudy: {
      all: "All case studies",
      role: "Role",
      period: "Period",
      stack: "Stack",
      problem: "The problem",
      approach: "Approach",
      verified: "How it is verified",
      next: "Next case study",
    },
    notFound: { title: "Page not found", body: "This page drifted out of orbit.", back: "Back home" },
  },
}

export type Content = typeof en

const it: Content = {
  locale: "it",
  qualifier: "Sistemi full-stack e agentici",
  location: "Catania, Italia",
  languages: [
    { name: "Italiano", level: "madrelingua" },
    { name: "Inglese", level: "C1" },
  ],
  seo: {
    title: "Luca Costa · AI Engineer, sistemi full-stack e agentici",
    description:
      "AI Engineer a Catania. Progetto prodotti e li costruisco con team di agenti AI: sistemi multi-agente, Claude Code e MCP, TypeScript full-stack. Ogni risultato verificato.",
    caseTitle: (name: string) => `${name} · Caso studio`,
  },
  hero: {
    lead: "Progetto prodotti e li costruisco con team di agenti AI.",
    cyclePrefix: "Ogni risultato,",
    cycle: ["verificato.", "testato.", "misurato.", "rilasciato."],
  },
  statement: "Generare codice è facile. Il lavoro è capire quando è giusto.",
  about: "Ingegnere informatico. Sviluppatore full-stack. Scrivo le specifiche, faccio lavorare gli agenti in parallelo e l'ultima parola resta mia.",
  caseStudies: [
    {
      ...en.caseStudies[0],
      kind: "SaaS · In produzione",
      period: "Marzo a ottobre 2026",
      role: "Da solo. Prodotto, sviluppo e infrastruttura.",
      oneLiner: "Tutto ciò che guardi, giochi e leggi. Una sola libreria.",
      summary:
        "Un SaaS full-stack che riunisce film, serie, anime, manga, videogiochi, libri, musica e giochi da tavolo. Progettato, costruito e gestito da una sola persona.",
      problem:
        "Ogni medium vive nella sua app, con il suo catalogo. Nagiren unisce più di dieci fonti in un'unica libreria coerente, con importazioni, notifiche e piani a pagamento.",
      approach: [
        "Vue 3 e TypeScript sul front-end. Un'API Express su PostgreSQL. Stripe Checkout, notifiche push e job pianificati.",
        "TMDB, AniList, IGDB, MusicBrainz, OpenLibrary e altre fonti, normalizzate in un unico modello di catalogo con fallback per ogni medium.",
        "Importazioni in un passaggio da TV Time, MyAnimeList, AniList e CSV, così ognuno porta con sé la propria storia.",
        "Architettura e decisioni messe per iscritto prima. Gli agenti costruiscono a partire da quei documenti.",
      ],
      verification: [
        "424 test automatici. 341 sul server, 83 sul client. Girano tutti prima di ogni rilascio.",
        "Migrazioni del database versionate e input validato a ogni confine dell'API.",
        "Deploy continuo su Oracle Cloud con Coolify e backup automatici.",
      ],
      metrics: [
        { value: 424, label: "test automatici" },
        { value: 10, suffix: "+", label: "fonti di dati" },
        { value: 132, label: "commit fino alla v1.20" },
        { value: 7, label: "categorie di media" },
      ],
      seo: {
        title: "Nagiren, un SaaS full-stack costruito da solo · Caso studio",
        description:
          "Come Luca Costa ha costruito Nagiren da solo: una libreria per film, anime, videogiochi, libri e musica da oltre 10 fonti. Vue 3, PostgreSQL, Stripe e 424 test automatici.",
      },
    },
    {
      ...en.caseStudies[1],
      kind: "Desktop nativo · Orchestrazione di agenti",
      period: "Ottobre 2026",
      role: "Progettazione e sviluppo.",
      oneLiner: "Un supervisore. Tanti agenti. Una mappa.",
      summary:
        "Un'app desktop nativa che coordina molti agenti Claude Code come un grafo, non come un muro di terminali. Niente browser. Niente Node. Niente Electron.",
      problem:
        "Fai lavorare più agenti di sviluppo insieme e arriva il caos. Chi sta facendo cosa? Chi aspetta chi? Due agenti si stanno bloccando a vicenda?",
      approach: [
        "Ogni progetto è un nodo su una mappa. Un agente supervisore coordina gli altri.",
        "Gli agenti comunicano attraverso un server MCP, solo su canali autorizzati.",
        "Sette flussi pronti, dalle specifiche e lo sviluppo fino alle review gate e al debug. Un pannello git integrato.",
        "Ricostruita da un prototipo Electron in Rust ed egui. Un solo eseguibile di circa 6,5 MB, per Windows, macOS e Linux.",
      ],
      verification: [
        "Il rilevamento dei deadlock e un limite di quattro passaggi di delega impediscono agli agenti di girare in tondo.",
        "Funziona con il piano Claude e rimuove le chiavi API dall'ambiente degli agenti. Nessuna bolletta a sorpresa.",
      ],
      metrics: [
        { value: 6.5, decimals: 1, prefix: "~", suffix: " MB", label: "un solo binario nativo" },
        { value: 7, label: "flussi pronti" },
        { value: 3, label: "sistemi operativi" },
      ],
      seo: {
        title: "Unigent, orchestrazione multi-agente per Claude Code · Caso studio",
        description:
          "Unigent coordina molti agenti Claude Code come un grafo: un supervisore, canali MCP, rilevamento dei deadlock. Un'app nativa in Rust di circa 6,5 MB per Windows, macOS e Linux.",
      },
    },
    {
      ...en.caseStudies[2],
      kind: "Automazione AI · Progetto personale",
      role: "Progetto personale. Progettazione e sviluppo.",
      oneLiner: "Prima il codice. L'AI quando serve. Le persone per ultime.",
      summary:
        "Il concept di una piattaforma che automatizza i servizi per le agenzie immobiliari. Un editor visuale di flussi, un portale clienti white-label e il ridisegno delle planimetrie.",
      problem:
        "Quasi sempre l'automazione affida tutto all'AI oppure niente. Agent Flows sceglie sempre il passaggio più economico in grado di fare il lavoro, e mostra quanto costa ogni passaggio.",
      approach: [
        "Un editor visuale di flussi con undici tipi di nodo. AI, controlli, rami, cicli, domande al cliente, revisione umana e consegna.",
        "Una scala di escalation. Prima gira il codice deterministico. Un modello interviene solo quando serve. Una persona rivede come ultima istanza.",
        "Un portale clienti white-label e il ridisegno delle planimetrie come casi d'uso completi, dall'inizio alla fine.",
      ],
      verification: [
        "Ogni passaggio costa più del precedente, quindi parte solo quando quello più economico non è riuscito a finire il lavoro.",
        "Claude Sonnet per i passaggi di routine. Opus solo dove il ragionamento in più vale la spesa.",
      ],
      metrics: [
        { value: 11, label: "tipi di nodo" },
        { value: 4, label: "livelli di escalation" },
      ],
      seo: {
        title: "Agent Flows, automazione AI con scala di escalation · Caso studio",
        description:
          "Agent Flows automatizza i servizi immobiliari con un editor visuale di flussi: prima il codice, Claude quando serve, una persona per ultima. Undici tipi di nodo e un portale white-label.",
      },
    },
  ],
  moreWork: [
    {
      name: "Multi-Agent Platform",
      kind: "Orchestrazione LLM · Python",
      year: "2025",
      body: "Agenti organizzati come un'azienda: agenti, team e un supervisore sopra di loro, su LangGraph. Modelli locali e cloud, con fallback automatico.",
    },
    {
      name: "Gravity Desktop",
      kind: "Concept desktop · Rust",
      year: "2026",
      body: "Un desktop più calmo. App, file e cartelle cadono in pozzi gravitazionali invece di ammucchiarsi. Ricostruito in nativo sulla GPU: da 426 MB di memoria a riposo a 93.",
    },
    {
      name: "Always in Time",
      kind: "Videogioco · Unity 6",
      year: "2026",
      body: "Un platform narrativo con 20 livelli e 41 arene di combattimento. Un harness automatico ripercorre tutto il percorso prima di ogni build.",
    },
    {
      name: "Name Finder",
      kind: "Tooling · Python",
      year: "2026",
      body: "Sette strategie per generare nomi, un punteggio di qualità da 0 a 100 e controlli di disponibilità in tempo reale su DNS e RDAP.",
    },
  ],
  principles: [
    { title: "Prima le specifiche.", body: "Ogni funzionalità nasce da specifiche chiare e scritte. Gli agenti costruiscono dall'intenzione, non a tentativi." },
    { title: "In parallelo, per scelta.", body: "Più agenti costruiscono e revisionano nello stesso momento. Io resto l'architetto." },
    { title: "Verificato prima del rilascio.", body: "Decidono i test, i controlli visivi e le review gate. Non la sicurezza di sé." },
  ],
  mindset: [
    { word: "Creatività", body: "Codice, videogiochi, 3D e musica. Le idee passano liberamente dall'uno all'altro." },
    { word: "Pensiero laterale", body: "Quando la strada ovvia costa troppo, ne trovo un'altra. Il codice prima dell'AI. L'AI prima delle persone." },
    { word: "Responsabilità", body: "Dalla prima specifica al server su cui gira." },
    { word: "Curiosità", body: "Nuovo stack, nuovo dominio. Lo imparo costruendo qualcosa di vero." },
    { word: "Cura", body: "I dettagli che nessuno chiede sono quelli che tutti sentono." },
    { word: "Chiarezza", body: "Decisioni scritte. Compromessi spiegati. Facile da seguire, facile da mettere in discussione." },
  ],
  capabilities: [
    { area: "Agentic engineering", skills: ["Orchestrazione multi-agente", "Claude Code e MCP", "LangGraph", "Pipeline di specifiche, sviluppo e review"] },
    { area: "AI in azienda", skills: ["Escalation codice, modello, persona", "Costo per passaggio", "Human in the loop"] },
    { area: "Prodotto full-stack", skills: ["React 19", "Next.js", "Vue 3", "TypeScript", "PostgreSQL", "Stripe"] },
    { area: "Infrastruttura", skills: ["Docker", "Coolify e Traefik", "Oracle Cloud", "CI/CD"] },
    { area: "Desktop e sistemi", skills: ["Rust", "egui e Tauri", "Direct3D 11", "Electron"] },
    { area: "Videogiochi e 3D", skills: ["Unity 6", "Unreal Engine 5", "Three.js e WebGL", "Blender"] },
  ],
  experience: [
    {
      period: "Da novembre 2025 a oggi",
      title: "Full-Stack Developer",
      org: "Flazio S.r.l.",
      summary: "Sviluppo e mantengo funzionalità su tutto lo stack di una piattaforma web usata dalle aziende.",
    },
  ],
  education: [
    { period: "Dal 2017 al 2024", title: "Laurea in Ingegneria Informatica", org: "Università di Catania" },
    { period: "Dal 2024 a oggi", title: "Unreal Engine 5 in C++", org: "Udemy" },
    { period: "Dal 2021 al 2022", title: "Nand to Tetris I e II", org: "Coursera" },
  ],
  certifications: en.certifications,
  beyondCode: {
    lead: "Videogiochi, 3D e musica originale. È da qui che nasce l'occhio per il dettaglio.",
    items: [
      {
        name: "Redshift",
        meta: "Videogioco 2D · Unity · 2020",
        body: "Realizzato interamente da solo. Logica di gioco, level design, sprite, colonna sonora e bilanciamento della difficoltà, dal concept alla pubblicazione.",
      },
      { name: "Colonne sonore originali", meta: "Musica", body: "Composte per i miei videogiochi e progetti." },
      { name: "Personaggi 3D", meta: "Blender · Substance Painter", body: "Modellati, texturizzati e renderizzati da zero." },
    ],
  },
  keywords: [
    "AI Engineer",
    "Sistemi multi-agente",
    "Claude Code",
    "MCP",
    "LangGraph",
    "Review gate",
    "TypeScript full-stack",
    "Infrastruttura self-hosted",
    "Rust",
    "Unity",
  ],
  ui: {
    nav: { work: "Progetti", mindset: "Mindset", toolbox: "Competenze", experience: "Esperienza" },
    letsTalk: "Parliamone",
    openMenu: "Apri il menu",
    closeMenu: "Chiudi il menu",
    home: "home",
    skip: "Vai al contenuto",
    language: "Lingua",
    seeWork: "Guarda i progetti",
    getInTouch: "Contattami",
    scroll: "Scorri",
    statement: "Manifesto",
    method: { label: "Come lavoro", sub: "Una persona. Il lavoro di un intero team." },
    work: { label: "Progetti scelti", sub: ["Rilasciati.", "Non solo demo."], intro: "Tre sistemi. Le decisioni e i numeri dietro ognuno.", read: "Leggi il caso studio" },
    mind: { label: "Come penso", sub: ["Idee,", "intrecciate."], aria: "Soft skill" },
    more: { label: "Altri progetti", sub: "Stesso metodo. Altri mondi." },
    toolbox: { label: "Competenze", sub: "Ampio raggio. Un solo modo di lavorare." },
    xp: { label: "Esperienza", sub: "Un team di giorno. Sistemi di notte.", certs: "Certificazioni" },
    beyond: { label: "Oltre il codice" },
    contact: {
      label: "Contatti",
      sub: "Costruiamo qualcosa che arrivi in produzione.",
      copy: "Copia l'email",
      copied: "Copiata",
      built: "Costruito con Next.js, GSAP e WebGL. Specificato, revisionato e rilasciato con gli agenti.",
    },
    caseStudy: {
      all: "Tutti i casi studio",
      role: "Ruolo",
      period: "Periodo",
      stack: "Stack",
      problem: "Il problema",
      approach: "L'approccio",
      verified: "Come è verificato",
      next: "Prossimo caso studio",
    },
    notFound: { title: "Pagina non trovata", body: "Questa pagina è uscita dall'orbita.", back: "Torna alla home" },
  },
}

const content: Record<Locale, Content> = { en, it }

export function getContent(locale: Locale): Content {
  return content[locale]
}

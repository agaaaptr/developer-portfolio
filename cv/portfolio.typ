// Portfolio companion document for Gagah Putra Anugrah.
//
// This is a design-facing supplement to the ATS CV (Gagah-Putra-Anugrah-Software-Engineer-EN/ID),
// not a replacement for it: it carries more depth per project, screenshots, and live links.
// RenderCV is the wrong tool here (its schema is a fixed CV layout with no room for images or
// per-project narrative blocks), so this document is plain Typst compiled by
// cv/render-portfolio.py. Run `npm run portfolio:render` to rebuild.
//
// Source of truth for all content: src/data/{projects,experience,expertise,skills,personal}.json.
// Only numbers that appear in that data are used here.

#let body-font = ("Source Sans 3", "Open Sans", "Noto Sans", "Libertinus Serif")
#let head-font = ("XCharter", "EB Garamond", "Gentium Book Plus", "Libertinus Serif")

#let ink = rgb("#1a1a1a")
#let accent = rgb("#2a3a6e")
#let accent-soft = rgb("#edf0f7")
#let muted = rgb("#6b7280")
#let hair = rgb("#d9dee8")

#set page(
  paper: "a4",
  margin: (x: 1.4cm, top: 1.05cm, bottom: 0.9cm),
  footer: context [
    #set text(font: body-font, size: 7.2pt, fill: muted, hyphenate: false)
    #v(-0.28cm)
    #line(length: 100%, stroke: 0.5pt + hair)
    #v(3.4pt)
    #grid(
      columns: (1fr, auto),
      align: (left, right),
      [Gagah Putra Anugrah · Project Portfolio],
      [Page #counter(page).display()],
    )
  ],
)

#set text(font: body-font, size: 9.5pt, fill: ink, hyphenate: false)
#set par(justify: false, leading: 0.6em)

// ---- building blocks -------------------------------------------------------

#let section-head(title, note: none) = {
  v(0.55em)
  block(width: 100%, breakable: false)[
    #text(font: head-font, weight: "bold", size: 13.2pt, fill: accent)[#title]
    #if note != none [
      #h(7pt)
      #text(font: body-font, size: 8.2pt, fill: muted)[#note]
    ]
    #v(2.4pt)
    #line(length: 100%, stroke: 0.8pt + accent)
  ]
  v(0.32em)
}

#let chip(t) = box(
  fill: accent-soft,
  inset: (x: 4pt, y: 1.5pt),
  radius: 1.5pt,
  text(font: body-font, size: 7.3pt, fill: accent, t),
)

#let chips(items) = items.map(chip).join(h(2.6pt))

#let url(u) = link("https://" + u)[#text(fill: accent, u)]

#let bullets(items) = list(
  marker: text(fill: accent)[•],
  indent: 0.4em,
  body-indent: 0.4em,
  spacing: 0.3em,
  ..items,
)

#let shot(path, caption) = block(width: 100%, breakable: false)[
  #box(width: 100%, stroke: 0.5pt + hair, inset: 0pt, image(path, width: 100%))
  #v(1.4pt)
  #text(font: body-font, size: 7pt, fill: muted)[#caption]
]

// A project entry: title + role on one line, stack chips, then narrative/bullets
// beside a screenshot.
#let project(title, role, stack, image: none, caption: none, links: none, body) = {
  block(width: 100%, breakable: false)[
    #grid(
      columns: (1fr, auto),
      align: (left + horizon, right + horizon),
      text(font: body-font, weight: "bold", size: 11.4pt, fill: ink)[#title],
      text(font: body-font, size: 8.1pt, fill: muted)[#role],
    )
    #v(1.6pt)
    #chips(stack)
    #v(3pt)
    #if image != none [
      #grid(
        columns: (1fr, 5.7cm),
        column-gutter: 0.5cm,
        align: (left + top, left + top),
        body,
        shot(image, caption),
      )
    ] else [
      #body
    ]
    #if links != none [
      #v(3pt)
      #text(font: body-font, size: 8.2pt)[#links]
    ]
  ]
  v(0.45em)
}

// ---- header ----------------------------------------------------------------

#grid(
  columns: (1fr, auto),
  align: (left + bottom, right + bottom),
  [
    #text(font: head-font, weight: "bold", size: 24pt, fill: ink)[Gagah Putra Anugrah]
    #v(1pt)
    #text(font: body-font, size: 10.2pt, fill: accent)[Software Engineer, Full-Stack · Angular · TypeScript · Go]
  ],
  [
    #set align(right)
    #text(font: body-font, size: 8.4pt, fill: ink)[#link("mailto:gagah.p.412@gmail.com")[gagah.p.412\@gmail.com]]
    #linebreak()
    #text(font: body-font, size: 8.4pt, fill: ink)[#link("https://wa.me/6281293309095")[+62 812-9330-9095]]
    #linebreak()
    #text(font: body-font, size: 8.4pt, fill: accent)[#link("https://aga-putra.vercel.app")[aga-putra.vercel.app]]
  ],
)

#v(4pt)
#line(length: 100%, stroke: 0.8pt + accent)
#v(4.5pt)

#text(font: body-font, size: 8.6pt, fill: ink)[
  Yogyakarta, Indonesia · #url("linkedin.com/in/agaaaptr") · #url("github.com/agaaaptr")
]

#v(0.5em)

#text(font: body-font, size: 9.5pt)[
  I build and maintain production software for universities and client businesses, mostly in
  Angular, TypeScript, and Go. This is the long-form companion to my CV: what each project does,
  the decisions behind it, and where you can see it running.
]

// ---- selected projects -----------------------------------------------------

#section-head("Selected Projects", note: "four builds in depth, then five client sites")

#project(
  "Noir",
  "Developer · Open source",
  ("TypeScript", "Node.js", "pnpm", "SQLite", "Ink", "React", "MCP"),
  image: "images/noir.png",
  caption: "Noir terminal dashboard",
  links: [#url("github.com/agaaaptr/noir") · npm package #link("https://www.npmjs.com/package/@noir-ai/cli")[#text(fill: accent, "@noir-ai/cli")]],
)[
  Noir is an orchestration and memory layer for AI coding agents, built as an #box("11-package")
  pnpm monorepo and published to npm. It started from a practical problem: agent sessions lose
  context, and most surrounding tooling locks you into a single host.

  #v(2.5pt)
  #bullets((
    [A spec-driven workflow: idea, spec, plan, implement, verify],
    [Hybrid retrieval combining BM25 and vector kNN with Reciprocal Rank Fusion],
    [Cross-session memory with governance: audit trail and governed deletion],
    [27 built-in skills, adapters for 5 AI coding hosts, and a persistent MCP daemon],
  ))
  #v(2.5pt)
  It runs local-first and privacy-by-construction, with native installers for macOS, Linux, and
  Windows, and 57 npm releases to date.
]

#project(
  "TembusIn",
  "Front-End Developer · Freelance",
  ("React", "Vite", "TypeScript", "Tailwind CSS", "REST API"),
  image: "images/tembusin.png",
  caption: "Student-side course view",
  links: [#url("fe-tembusin.deecodesoftware.com")],
)[
  A learning management system for Indonesian exam preparation, covering four tracks: SNBT, TKA,
  CPNS, and PPPK. I built the frontend for both the admin and the student side from the Figma
  specifications and integrated the REST API.

  #v(2.5pt)
  #bullets((
    [Typed API clients and skeleton loading states],
    [Profiled and reduced animation cost to keep navigation responsive],
    [Shipped the production build to a VPS],
  ))
]

#project(
  "OWOW",
  "UI/UX Design · Client work",
  ("Figma", "Prototyping", "UI Design"),
  image: "images/owow.png",
  caption: "Service and engagement pages",
  links: [#url("owow.io")],
)[
  The platform a software development services company uses to present its offering and start
  client conversations. I worked the design side, from research and wireframes to the interfaces
  the site ships with.

  #v(2.5pt)
  #bullets((
    [Wireframes and high-fidelity prototypes for service pages and the engagement flow],
    [Layout grid, type scale, and component states defined in Figma],
  ))
]

#project(
  "Diet Pro",
  "UI/UX Design · University project",
  ("Figma", "Android", "Kotlin"),
  image: "images/dietpro.png",
  caption: "Calorie tracker and progress views",
)[
  A health tracking application designed during university: a daily calorie tracker, a curated
  health and fitness feed, and progress tracking toward diet goals. I designed the Android
  interface in Figma, from low-fidelity flows to the final screens handed to developers.

  #v(2.5pt)
  #bullets((
    [Calorie tracking, informational feed, and progress views designed end to end],
    [Android layouts and interaction flows prepared for a Kotlin build],
  ))
]

// ---- client websites -------------------------------------------------------

#section-head("Client Websites", note: "WordPress and Elementor, 2023 to 2024")

Five client sites delivered in WordPress and Elementor across Indonesian, Vietnamese, and
European markets.

#v(4pt)

#let client(name, what, site) = {
  [
    #text(font: body-font, weight: "bold", size: 9.2pt, fill: ink)[#name]
    #text(font: body-font, size: 8.8pt)[ · #what · #url(site)]
  ]
  v(2.2pt)
}

#client("Salsation Cruise", "WPML multilingual build and booking integration", "salsationcruise.com")
#client("CG-Carworks", "service pages and on-page SEO for local search", "cg-carworks.com")
#client("DeResto", "service showcase pages and value-proposition copy", "deresto.eu")
#client("The Extra Mile", "mobile-first layouts for on-the-go booking", "theextramile.co")
#client("Pelan Pelan Bali", "SEO and content for international visitors", "pelanbali.com")

// ---- experience and expertise ----------------------------------------------

#section-head("Experience", note: "full metrics and history are in the CV")

#let role(title, company, period, where) = {
  block(width: 100%, breakable: false)[
    #grid(
      columns: (1fr, auto),
      align: (left, right),
      [
        #text(font: body-font, weight: "bold", size: 9.4pt, fill: ink)[#title]
        #h(5pt)
        #text(font: body-font, size: 8.8pt, fill: muted)[#company]
      ],
      text(font: body-font, size: 8pt, fill: muted)[#period · #where],
    )
  ]
}

#role("Software Engineer", "Badan Sistem Informasi, Universitas Islam Indonesia", "Oct 2024 – Present", "Yogyakarta")
#v(2.4pt)
#text(font: body-font, size: 8.8pt)[
  Rebuilt the GitLab CI deployment pipeline for a 20+ module Angular platform backed by 13 REST
  endpoints, cutting release time from 20–30 minutes to 1–3 minutes. Cut MySQL queries that timed
  out from up to a minute to under 10 seconds. Converted a 66,000-line Angular library to full
  Indonesian and English support: 53 templates, 1,718 bindings, and 619 dictionary keys.
]
#v(6pt)

#role("Front-End Developer (Freelance)", "Softwaredeecode", "Nov 2025 – Apr 2026", "Remote")
#v(6pt)
#role("Web Developer", "TerraCode", "Oct 2023 – Jan 2024", "Remote")

#section-head("Areas of Expertise")

#grid(
  columns: (1fr, 1fr, 1fr),
  column-gutter: 0.5cm,
  align: (left + top, left + top, left + top),
  [
    #text(font: body-font, weight: "bold", size: 9.2pt, fill: accent)[Frontend Development]
    #v(1.5pt)
    #text(font: body-font, size: 8.6pt)[React, Next.js, Angular, TypeScript, HTML5, CSS3]
  ],
  [
    #text(font: body-font, weight: "bold", size: 9.2pt, fill: accent)[Backend Development]
    #v(1.5pt)
    #text(font: body-font, size: 8.6pt)[Go, Gin, MySQL, REST API, SQL]
  ],
  [
    #text(font: body-font, weight: "bold", size: 9.2pt, fill: accent)[UI/UX Design]
    #v(1.5pt)
    #text(font: body-font, size: 8.6pt)[Figma, Prototyping, User Research, Wireframing, Android Design]
  ],
)

#v(0.8em)
#line(length: 100%, stroke: 0.5pt + hair)
#v(4pt)
#text(font: body-font, size: 8.2pt, fill: muted)[
  Live project links, screenshots, and the interactive version of this portfolio are at
  #url("aga-putra.vercel.app") · #url("github.com/agaaaptr")
]

# Portfolio implementation plan

## Product and implementation

Build a single-page responsive portfolio for Mubashir Ahmed using React, TypeScript, Vite, Tailwind CSS 4, Lucide React, and the existing Express server. Preserve the current server-only `invokeLLM` integration, concise profile-grounded personal answers, general AI conversation, contact validation, project filtering, and all existing sections. The hero's developer terminal is a static, read-only profile summary populated from the editable profile data—not a fake interactive shell. Remove the generated neural artwork from the visible experience; the terminal and truthful written copy are the primary hero visual.

Use `src/theme.css` after the base stylesheet to apply a cohesive dark editorial visual system without changing application behavior. Increase small text sizes across navigation, cards, forms, project tags, chatbot, and metadata for comfortable use on Mac Retina displays. Add no new runtime dependencies; load DM Sans, Newsreader, and DM Mono with sensible system fallbacks. The Express API continues to serve Vite middleware in development and the production `dist/` build after compilation.

Keep profile details in `shared/profileData.js`, with the existing profile/generic-question router in `shared/chat.js`. General LLM requests remain in `server/llm.js`; the endpoint validates payload size and rate, uses server-only platform credentials, filters profile-only turns from bounded model history, and returns the exact missing-personal-fact response when needed. The contact form validates accessible fields and prepares a `mailto:` draft only after a real address is configured; otherwise it explains that delivery is not configured. Do not imply messages were sent or stored.

## Project structure

```text
.
├── public/
│   ├── favicon.svg             # MA monogram in the refreshed dark/olive palette
│   ├── manus-routes.json       # Single-page route manifest
│   └── resume/Mubashir-Ahmed-Resume.pdf  # One-page resume with supplied profile facts
├── resume-source/
│   ├── .typst-content-manifest.json
│   ├── .typst-build-plan.json
│   └── basic-resume-template/main.typ  # Editable content using the pinned base
├── server/
│   ├── index.js                # Express API limits, Vite/static serving
│   └── llm.js                  # Server-only invokeLLM wrapper
├── shared/
│   ├── chat.js                 # Personal-fact guard and offline general FAQ
│   └── profileData.js          # Editable profile, projects, skills and links
├── src/
│   ├── components/             # Navigation, assistant, terminal, headings and cards
│   ├── data/index.ts           # TypeScript-facing data exports
│   ├── sections/               # Hero, About, Skills, Projects, Journey, Coding, Resume, Contact
│   ├── App.tsx                 # Page assembly and shared UI state
│   ├── main.tsx                # React entry point and ordered CSS imports
│   ├── index.css               # Tailwind base reset
│   ├── theme.css               # Current dark editorial tokens and component refinements
├── Dockerfile                  # Production container
├── app.config.ts               # Durable HTTPS project-logo URL
├── README.md                   # Setup and owner replacement instructions
├── plan.md
└── TODO.md
```

The assistant is intentionally restricted to Mubashir’s profile facts, simple greetings, and basic arithmetic; it does not answer complex outside-topic questions. The `public/manus-routes.json` manifest declares the single current page. The old generated hero illustration is no longer referenced by the page; do not reintroduce it into the visible design.

## Design direction

- **Design Movement:** Contemporary editorial portfolio—Swiss-inspired clarity with the warmth of an independent developer's personal website, not a futuristic AI dashboard.
- **Core Principles:** (1) Make every line comfortable to read at ordinary Mac display scaling. (2) Show an honest learner and builder, not a fictional AI product. (3) Use color to distinguish real information, never as decoration that competes with it. (4) Prefer tangible paper-like surfaces and crisp borders to glows and glass.
- **Color Philosophy:** Near-black `#0A0B0D` and warm off-white `#EEE9DF` create the reference-inspired editorial base. Muted olive-green `#9FC77D` is the signature interaction color, while amber `#D1A362` marks labels and moments of emphasis. Charcoal surfaces, low-contrast gray borders, and restrained green/amber accents keep the page calm and readable; the assistant remains a darker terminal surface within the system.
- **Layout Paradigm:** An asymmetric editorial split hero, with the copy on the left and a practical profile terminal on the right. Sections alternate among warm-white and pale tinted canvases with offset headings, readable columns, and solid cards. The assistant floats as a generously sized panel with a scrollable conversation, curated prompt grid, and pinned composer; on mobile it expands nearly to the available screen height above its launcher.
- **Signature Elements:** (1) A compact read-only terminal with accurate, editable profile lines. (2) The `MA` monogram in olive green with a small amber accent. (3) A numbered section rail, restrained dark cards, and a terminal-style AI chatbot panel.
- **Interaction Philosophy:** Keep links, focus states, filters, quick prompts, assistant controls, and the pinned composer obvious and familiar. The assistant reads as a real terminal command surface; hover changes color or border subtly, and the floating page-top button is intentionally omitted.
- **Animation:** Present the read-only profile lines using the earlier character-by-character typewriter sequence with a blinking cursor and repeating cycle. Reveal section headings, cards, timeline items, resume, and contact blocks with a subtle upward fade as they enter the viewport, using restrained staggered timing. Keep a thin fixed scroll-progress line without a text label or percentage. The assistant panel may enter with a short transition and use a restrained query indicator. Under `prefers-reduced-motion`, show terminal lines immediately, omit its cursor, disable scroll reveals, and minimize assistant motion.
- **Typography System:** DM Sans for body/UI, Newsreader for large editorial section headings, and DM Mono only for terminal text and compact metadata. Target 17px body copy on desktop and at least 16px on mobile, 14px or larger for controls/chips, 12px or larger for metadata, and a responsive 58–82px hero heading.
- **Brand Essence:** “A thoughtful learning-in-public portfolio for an aspiring AI/ML, IoT, and full-stack developer who values useful software and honest progress.” Personality: curious, grounded, practical.
- **Brand Voice:** Specific, personal, and optimistic without inflated claims. Examples: “Building, learning, and exploring the future of intelligent software.” “Ideas become useful when you keep working on them.”
- **Wordmark & Logo:** A clear `MA` mark on an olive-green square with a small amber accent, paired with the full name in a clean text lockup.
- **Signature Brand Color:** Muted olive green `#9FC77D`.

## Information architecture and serving

The sticky header links About, Skills, Projects, Experience, Coding, Resume, and Contact; a responsive mobile menu, resume action, contact action, and visible terminal-style assistant launcher remain available. The page contains Mubashir’s IoT education, supplied skills, five supplied projects without repo/demo controls, two prominent achievements, six categorized skill groups, All/AI/ML/Full Stack/Academic/Experiments filters, a truthful learning timeline, coding interests, active GitHub, LinkedIn, and LeetCode links, a one-page resume at `/resume/Mubashir-Ahmed-Resume.pdf`, the restricted assistant, the validated contact form, and the requested footer. Resume chatbot answers briefly summarize the document, offer a scroll-to-resume action, and provide separate View PDF and Download PDF actions. The floating go-to-top control is omitted; only a thin unlabelled page-progress line remains visible at the top.

Personal answers come only from editable local profile facts and end with a brief note that they are specific to Mubashir’s profile; missing personal information uses exactly “That information has not been added to Mubashir’s portfolio yet.” Outside-profile questions receive a short scope reminder, while simple arithmetic is answered directly. Repeated answers in one chat are replaced with a concise prompt to ask about another profile area. No employment history, coding scores, or unsupported results have been fabricated.

The resume uses only the supplied Mubashir Ahmed profile facts: VNR VJIET, expected graduation 2029, the supplied email and social URLs, five supplied projects, and two supplied achievements. The approved dark editorial palette is applied across the whole portfolio, not only the resume component.

Initial HTML retains the required SEO title/description and uses a dark `theme-color` matching the new palette. Browser-facing paths remain relative. Setup and owner-editable placeholders are documented in `README.md`. The website continues to serve on port 3000 for Preview; the project runtime supplies the stable preview proxy origin. The project-level logo remains a durable HTTPS asset matching the updated favicon.

## Deployment follow-up

The project already has `features.server:true`, an Express production entry point, a same-origin chat API, and an unauthenticated health route at `/api/healthz`. Publish it as a container-only site through the existing root `Dockerfile` and deploy configuration; do not add a static build split or database. Preserve the existing auto-publish setting, and do not submit a duplicate manual publish for a checkpoint that auto-publish already handles.

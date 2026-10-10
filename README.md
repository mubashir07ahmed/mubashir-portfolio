# Mubashir Ahmed — Portfolio

## **Visit the live website: [mubashirr.in](https://mubashirr.in)**

Hello, I’m **Mubashir Ahmed**. I’m currently pursuing my **2nd year of B.Tech in Internet of Things (IoT) at VNR VJIET**, Hyderabad. I enjoy taking an idea, understanding how it works behind the scenes, and turning it into a useful software or IoT experience.

This repository contains the source code for my personal portfolio: [github.com/mubashir07ahmed/mubashir-portfolio](https://github.com/mubashir07ahmed/mubashir-portfolio). The finished website is live at [**mubashirr.in**](https://mubashirr.in).

> If you are reading this as a recruiter, collaborator, or fellow developer, the quickest path is: visit the live site first, then open the source repository to see how the interface, chatbot, data model, and server fit together.

## A little about me

I am interested in **Artificial Intelligence, Machine Learning, full-stack development, chatbot development, software engineering, IoT, automation, and problem solving**. I am still learning, so this portfolio intentionally describes my work honestly rather than assigning inflated proficiency ratings.

My current goal is to grow into an **AI/ML, full-stack, and IoT developer** while building practical applications that solve real problems.

## What I have built

The portfolio currently presents these projects:

- **AI Full-Stack Chatbot** — an AI-powered chatbot built through the AI Full Stack Course at VNR VJIET, covering frontend, backend, API integration, and chatbot functionality.
- **Local AI Question Solver** — a local system that extracts questions from webpages and generates and inserts answers through a backend API and browser automation.
- **AI Answer Generator** — a tool that accepts question PDFs, generates structured answers, and creates clean answer PDFs for study material.
- **Python To-Do App** — a practical task-management application for adding, viewing, updating, and managing daily tasks.
- **Campus Lost & Found Match Desk** — a full-stack platform in development for students to report, search, and match lost and found items.

I have also participated in **Prompt Craft**, where I was a winner, and the **SynthVision Hackathon**, where I was a finalist through the Krithomedh AI/ML & IoT Club at VNR VJIET.

## What the website feels like

The site uses a **dark editorial interface** with terminal-inspired details, warm off-white text, olive-green actions, amber highlights, and a calm, readable rhythm. The hero section includes a responsive developer terminal that reveals verified profile facts from the shared portfolio data with a restrained type-on effect.

The site includes:

- About section and personal background
- Learning domains and skills
- Project filtering and project details
- Learning journey and achievements
- Coding interests and public profiles
- Resume view and download actions
- Contact form and social links
- AI chatbot with portfolio knowledge
- Responsive navigation with reduced-motion support

## Novaa: Mubashir’s AI portfolio guide

Novaa is the AI agent on Mubashir Ahmed’s portfolio. Her role is to tell visitors about Mubashir—his verified background, education, skills, projects, interests, achievements, and learning journey—and help them explore the portfolio. She is not Mubashir and does not invent personal facts. Novaa stays focused on the verified portfolio rather than acting as a general-purpose assistant:

1. **Portfolio knowledge always works locally.** Questions about education, skills, projects, achievements, resume, contact details, coding profiles, and the ideas behind the website use verified shared portfolio data and do not require an API key.
2. **Semantic search works locally.** If Groq is unavailable, Novaa first tries deterministic local answers and then uses a local `all-MiniLM-L6-v2` embedding index to understand paraphrased questions and retrieve the closest verified personal knowledge document.
3. **The vector store covers the full profile.** It includes identity, headline, introduction, education, college, location, interests, learning style, career direction, languages, technologies, skills, projects, learning journey, achievements, resume, contact details, public profiles, website content, and assistant behavior.
4. **Unrelated questions are declined clearly.** Calculations, general knowledge, programming help, and everyday questions receive a short explanation that Novaa is here to tell visitors about Mubashir and his portfolio.

### Groq integration

Groq is the only remote text-generation provider. `server/llm.js` reads the protected `GROQ_API_KEY` at runtime, and the server uses it for both Novaa’s portfolio answers and her contextual speech. Novaa’s system instructions explicitly identify her as Mubashir’s AI agent and ground her answers in the verified portfolio context. If the key is missing or Groq is unavailable, Novaa uses deterministic answers and local semantic retrieval; she never falls back to another remote provider. The production container builds the existing local semantic index automatically.

### Interactive portfolio mascot

Novaa uses the procedural **Strobi** avatar definition and React renderer from [Bible Strong Avatar Lab](https://github.com/smontlouis/bible-strong-avatar-lab). On fine-pointer devices, Novaa follows the visitor within a viewport-safe area and responds to the section or content under the pointer; clicking her opens chat with a contextual question that is automatically sent. The server uses the same Groq-only `GROQ_API_KEY` path for Novaa's contextual speech as it does for portfolio chat. Idle lines rotate locally, while contextual requests are debounced and rate-spaced instead of being sent for every pointer movement. The key stays in the protected server runtime environment and is never sent to the browser.

Each new speech-bubble line appears in the existing DM Mono terminal style, one Unicode character at a time, with a blinking sage block cursor. The full prompt is exposed to assistive technology as one announcement rather than character-by-character updates; reduced-motion users see the complete line immediately. Pointer-driven movement is disabled for touch and reduced-motion preferences. If Groq is unavailable or rate-limited, Novaa uses the local fallback. The Avatar Lab components and definition are used under their **GNU AGPL v3.0** license; see the upstream project for the authoritative terms and source.

For local development, `pnpm semantic:index` is **recommended but not required**. It downloads and caches `all-MiniLM-L6-v2` and prepares the vector store before the first question:

```bash
pnpm install
pnpm semantic:index
pnpm dev
```

If you skip `pnpm semantic:index`, the committed vector store is still available and the model/index can initialize automatically when the first semantic-search question is asked. The first initialization needs internet access; after the model is cached, offline retrieval works without an API key.

### Environment variables

Set keys only on the server or hosting provider. Never put them in React code, `VITE_*` variables, GitHub, or public files.

| Variable | Purpose | Default |
| --- | --- | --- |
| `GROQ_API_KEY` | Sole remote provider for chat and Novaa prompts; set only in the server environment | `openai/gpt-oss-20b` |
| `GROQ_MODEL` | Optional Groq model override | `openai/gpt-oss-20b` |
| `RESEND_API_KEY` | Server-only credential for contact-form email delivery | None |
| `CONTACT_EMAIL_ENABLED` | Server-side release gate; actual sends also require `NODE_ENV=production` | `false` |

For local development, set the recommended key in the server environment:

```bash
export GROQ_API_KEY="your_groq_key_here"
pnpm install
pnpm dev
```

On Windows PowerShell:

```powershell
$env:GROQ_API_KEY="your_groq_key_here"
pnpm dev
```

The browser calls `/api/chat` and `/api/mascot-prompt`; the Groq key remains inside `server/llm.js` on the server. The browser never receives either API key.

## Contact form delivery

The contact form posts to the same-origin `/api/contact` endpoint. The server validates and rate-limits submissions, checks a honeypot field, then sends a plain-text email through Resend to the contact address in `shared/profileData.js`; replies go to the visitor's submitted email. Submission content is not stored in the portfolio's database, and the visible direct-email link remains available if sending fails.

The protected `RESEND_API_KEY` must have send permission. The sender is fixed server-side as `Mubashir Ahmed <contact@mail.mubashirr.in>`; it is not user-controlled or overridden by another environment value. The sending domain `mail.mubashirr.in` is verified in the [Resend Dashboard](https://resend.com/domains). For a future domain setup, publish the exact SPF/DKIM DNS records shown in its Records tab; Resend recommends a sending subdomain, existing root-domain mail records should remain intact, and Resend CNAME records should not be proxied. Sending requires both `CONTACT_EMAIL_ENABLED=true` and `NODE_ENV=production`; the production value is stored in the protected Production environment, while the additional server-side mode check prevents Development/Preview from sending. The current send-only key cannot list or manage domains, so domain configuration is managed in the Resend Dashboard.

## Production deployment and delivery status

- **Published deployment:** [mubashir-g2xxpp4s.manus.space](https://mubashir-g2xxpp4s.manus.space). The existing custom-domain link, [mubashirr.in](https://mubashirr.in), is retained separately.
- **Health endpoint:** `GET /api/healthz` returns `{"ok":true}` when the production API is healthy.
- **Production email gate:** `CONTACT_EMAIL_ENABLED` is set to the exact string `true` in the protected Production environment. Contact delivery also requires `NODE_ENV=production`; keep the Resend and Groq keys in protected server-side settings, never in source or browser bundles.
- **Test result:** On 2026-10-09, one production contact-form test returned HTTP `202 Accepted`. This confirms the Resend API accepted the request; it does not independently confirm final inbox placement.

## Run the project locally

Requirements:

- Node.js 22 or newer
- pnpm 11.25.0 or newer

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

For a production build:

```bash
pnpm test
pnpm build
pnpm start
```

## Project structure

```text
src/
  components/TerminalPanel.tsx    # Animated profile terminal
  sections/HeroSection.tsx        # Hero layout and terminal placement
  theme.css                      # Editorial theme and responsive styles
shared/
  profileData.js                 # Shared source of truth for portfolio facts
  chat.js                        # Local chatbot knowledge and safe fallbacks
server/
  index.js                       # Express API and chat route
  llm.js                         # Groq-only server-side provider wrapper
public/
  resume/                        # Resume PDF
  manus-routes.json              # Website route manifest
```

## Safety and hosting notes

- Keep the Groq key in hosting-platform secrets or a local server environment only.
- Keep the Resend key in hosting-platform secrets or a local server environment only; do not put it in React code or `VITE_*` variables.
- Never commit `.env`, API keys, or `VITE_*` provider keys.
- Users can call the public `/api/chat` and `/api/mascot-prompt` endpoints, but cannot see the Groq key when the server-side setup is used.
- The public `/api/contact` endpoint limits submissions, validates all fields, and never logs message contents.
- The endpoint already limits message length and request frequency.
- If the Groq key is unavailable, the portfolio still works through its local knowledge and deterministic fallback.

## Checks

```bash
pnpm test
pnpm build
```

The tests cover profile grounding, detailed project answers, skill categories, learning journey, page sections, and concise achievement answers.

## Links

- **Live website:** [mubashirr.in](https://mubashirr.in)
- **Manus deployment:** [mubashir-g2xxpp4s.manus.space](https://mubashir-g2xxpp4s.manus.space)
- **Source code:** [GitHub](https://github.com/mubashir07ahmed/mubashir-portfolio)
- **GitHub profile:** [@mubashir07ahmed](https://github.com/mubashir07ahmed)
- **LinkedIn:** [Mubashir Ahmed](https://www.linkedin.com/in/mubashir-ahmed-604145339/)
- **Email:** [mubashir07ahmed@gmail.com](mailto:mubashir07ahmed@gmail.com)

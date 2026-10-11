# Mubashir Ahmed — Portfolio

## **Visit the live website: [mubashirr.in](https://mubashirr.in)**

Hello, I’m **Mubashir Ahmed**. I’m currently pursuing my **2nd year of B.Tech in Internet of Things (IoT) at VNR VJIET**, Hyderabad. I enjoy taking an idea, understanding how it works behind the scenes, and turning it into a useful software or IoT experience.

This repository contains the source code for my personal portfolio: [github.com/mubashir07ahmed/mubashir-portfolio](https://github.com/mubashir07ahmed/mubashir-portfolio). The finished website is live at [**mubashirr.in**](https://mubashirr.in).

> If you are reading this as a recruiter, collaborator, or fellow developer, the quickest path is: visit the live site first, then open the source repository to see how the interface, chatbot, data model, and server fit together.

## A little about me

I am interested in **Artificial Intelligence, Machine Learning, full-stack development, chatbot development, software engineering, IoT, automation, and problem solving**. I am still learning, so this portfolio intentionally describes my work honestly rather than assigning inflated proficiency ratings.

My current goal is to grow into an **AI/ML, full-stack, and IoT developer** while building practical applications that solve real problems.

## What the website feels like

The site uses a **dark editorial interface** with terminal-inspired details, warm off-white text, olive-green actions, amber highlights, and a calm reading rhythm. A responsive hero terminal reveals verified profile facts with a restrained type-on effect.

The site includes:

- About section and personal background
- Learning domains and skills
- Project filtering and project details
- Learning journey and achievements
- Coding interests and public profiles
- Resume view and download actions
- Contact form and social links
- **AI chatbot with portfolio knowledge**
- **Responsive navigation with reduced-motion support**

## Special features

This is more than a static portfolio page. It is designed as an interactive way to explore Mubashir’s work:

- **Hover-aware Novaa mascot:** On desktop pointer devices, Novaa follows the visitor within a safe area, detects the section or card being explored, and changes her speech bubble with relevant context.
- **Contextual AI chat:** Clicking Novaa opens a question based on the current section or hovered content. Answers are grounded in verified portfolio data, short by default, and supported by local fallback answers and semantic search.
- **Animated technology marquee:** The Skills section uses original technology icons in two continuously moving rows with different directions and staggered ordering.
- **Accessible terminal-style interface:** The hero terminal and Novaa use restrained type-on effects; touch devices and reduced-motion preferences avoid pointer-driven movement.
- **Practical portfolio actions:** Visitors can filter projects, explore the learning journey, view or download the resume, submit the contact form, and open verified profile links.

## Novaa: Mubashir’s AI portfolio guide

Novaa is Mubashir Ahmed’s AI portfolio guide. She explains his verified background, education, skills, projects, interests, achievements, learning journey, and website without impersonating him or inventing facts.

- **Local-first knowledge:** Portfolio questions use shared verified data and do not require an API key.
- **Semantic fallback:** If the AI API is unavailable, deterministic answers and a local `all-MiniLM-L6-v2` index handle paraphrased questions across the full profile.
- **Clear scope:** Unrelated questions receive a brief explanation that Novaa is focused on Mubashir and his portfolio.

### AI integration

The configured AI API provides remote text generation for Novaa’s portfolio answers and contextual speech. `server/llm.js` reads its protected credential at runtime, while unavailable services fall back to deterministic answers and local semantic retrieval. The production container builds the semantic index automatically.

### Interactive portfolio mascot

Novaa uses the procedural **Strobi** avatar definition and React renderer from [Bible Strong Avatar Lab](https://github.com/smontlouis/bible-strong-avatar-lab). On fine-pointer devices she follows the visitor within a safe area, responds to the content under the pointer, and opens chat with a contextual question. Requests are debounced and rate-spaced, while the credential stays server-side.

Speech uses the DM Mono terminal style with a character reveal and blinking sage cursor. Touch and reduced-motion users receive the complete prompt without pointer-driven movement; AI failures use the local fallback. The Avatar Lab components are used under their **GNU AGPL v3.0** license; see the upstream project for authoritative terms.

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
| AI API credential | Server-only credential for chat and Novaa prompts | Configure in the hosting provider |
| AI model setting | Optional server-side model override | Provider default |
| `RESEND_API_KEY` | Server-only credential for contact-form email delivery | None |
| `CONTACT_EMAIL_ENABLED` | Server-side release gate; actual sends also require `NODE_ENV=production` | `false` |

For local development, set an API key in the server environment. **Groq is one free-tier example**, but you can use another compatible AI API/provider by updating the server-side provider wrapper and its endpoint/model settings.

```bash
# Example free-tier provider: Groq
export GROQ_API_KEY="your_groq_api_key_here"
pnpm install
pnpm dev
```

On Windows PowerShell:

```powershell
# Example free-tier provider: Groq
$env:GROQ_API_KEY="your_groq_api_key_here"
pnpm dev
```

The browser calls `/api/chat` and `/api/mascot-prompt`; the AI API credential remains inside `server/llm.js` on the server. The browser never receives either API key. Any provider used here should support the server wrapper’s OpenAI-compatible chat-completions request shape.

## Contact form delivery

The contact form posts to the same-origin `/api/contact` endpoint. The server validates and rate-limits submissions, checks a honeypot field, then sends a plain-text email through Resend to the contact address in `shared/profileData.js`; replies go to the visitor's submitted email. Submission content is not stored in the portfolio's database, and the visible direct-email link remains available if sending fails.

The protected `RESEND_API_KEY` must have send permission. The sender is fixed server-side as `Mubashir Ahmed <contact@mail.mubashirr.in>`; it is not user-controlled or overridden by another environment value. The sending domain `mail.mubashirr.in` is verified in the [Resend Dashboard](https://resend.com/domains). For a future domain setup, publish the exact SPF/DKIM DNS records shown in its Records tab; Resend recommends a sending subdomain, existing root-domain mail records should remain intact, and Resend CNAME records should not be proxied. Production enables `CONTACT_EMAIL_ENABLED=true` in the container, while the additional `NODE_ENV=production` check prevents Development/Preview from sending. The current send-only key cannot list or manage domains, so domain configuration is managed in the Resend Dashboard.

## Production deployment and delivery status

- **Published deployment:** [mubashirr.in](https://mubashirr.in).
- **Health endpoint:** `GET /api/healthz` returns `{"ok":true}` when the production API is healthy.
- **Production email gate:** The production container sets `CONTACT_EMAIL_ENABLED=true`; contact delivery also requires `NODE_ENV=production`. Keep the Resend and AI API credentials in protected server-side settings, never in source or browser bundles.
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
  llm.js                         # Server-side AI API provider wrapper
public/
  resume/                        # Resume PDF
  manus-routes.json              # Website route manifest
```

## Safety and hosting notes

- Keep the AI API credential in hosting-platform secrets or a local server environment only.
- Keep the Resend key in hosting-platform secrets or a local server environment only; do not put it in React code or `VITE_*` variables.
- Never commit `.env`, API keys, or `VITE_*` provider keys.
- Users can call the public `/api/chat` and `/api/mascot-prompt` endpoints, but cannot see the AI API credential when the server-side setup is used.
- The public `/api/contact` endpoint limits submissions, validates all fields, and never logs message contents.
- The endpoint already limits message length and request frequency.
- If the AI API credential is unavailable, the portfolio still works through its local knowledge and deterministic fallback.

## Checks

```bash
pnpm test
pnpm build
```

The tests cover profile grounding, detailed project answers, skill categories, learning journey, page sections, and concise achievement answers.

## Links

- **Live website:** [mubashirr.in](https://mubashirr.in)
- **Source code:** [GitHub](https://github.com/mubashir07ahmed/mubashir-portfolio)
- **GitHub profile:** [@mubashir07ahmed](https://github.com/mubashir07ahmed)
- **LinkedIn:** [Mubashir Ahmed](https://www.linkedin.com/in/mubashir-ahmed-604145339/)
- **Email:** [mubashir07ahmed@gmail.com](mailto:mubashir07ahmed@gmail.com)

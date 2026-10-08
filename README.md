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

## AI chatbot: portfolio-only by design

The chatbot is intentionally focused on Mubashir’s portfolio rather than acting as a general-purpose assistant:

1. **Portfolio knowledge always works locally.** Questions about education, skills, projects, achievements, resume, contact details, coding profiles, and the ideas behind the website use verified shared portfolio data and do not require an API key.
2. **Semantic search works offline.** If no API provider is configured, the assistant first tries deterministic local answers and then uses a local `all-MiniLM-L6-v2` embedding index to understand paraphrased questions and retrieve the closest verified personal knowledge document.
3. **The vector store covers the full profile.** It includes identity, headline, introduction, education, college, location, interests, learning style, career direction, languages, technologies, skills, projects, learning journey, achievements, resume, contact details, public profiles, website content, and assistant behavior.
4. **Unrelated questions are declined clearly.** Calculations, general knowledge, programming help, and everyday questions receive a short explanation that this assistant is limited to the portfolio.

### Optional provider infrastructure

The repository includes secure provider wrappers for Groq, OpenAI, Gemini, and the managed Manus provider in `server/llm.js`. When a provider is configured, it can answer portfolio questions using the verified context; when no provider is available, local semantic search takes over automatically.

Groq remains the recommended provider for a future controlled expansion because it is fast and offers a free developer option subject to its current account limits and model availability.

The provider priority is:

1. Groq
2. OpenAI
3. Gemini
4. Manus managed provider
5. Local deterministic answers and semantic search

Without any API key, the website still works for supported portfolio questions and paraphrases. The production container builds the semantic index automatically.

For local development, `pnpm semantic:index` is **recommended but not required**. It downloads and caches `all-MiniLM-L6-v2` and prepares the vector store before the first question:

```bash
pnpm install
pnpm semantic:index
pnpm dev
```

If you skip `pnpm semantic:index`, the committed vector store is still available and the model/index can initialize automatically when the first semantic-search question is asked. The first initialization needs internet access; after the model is cached, offline retrieval works without an API key.

### Environment variables

Set keys only on the server or hosting provider. Never put them in React code, `VITE_*` variables, GitHub, or public files.

| Variable | Purpose | Default model |
| --- | --- | --- |
| `GROQ_API_KEY` | Recommended low-cost/free-tier provider | `openai/gpt-oss-20b` |
| `GROQ_MODEL` | Optional Groq model override | `openai/gpt-oss-20b` |
| `OPENAI_API_KEY` | OpenAI fallback/provider option | `gpt-4o-mini` |
| `OPENAI_MODEL` | Optional OpenAI model override | `gpt-4o-mini` |
| `GEMINI_API_KEY` | Gemini fallback/provider option | `gemini-2.0-flash` |
| `GEMINI_MODEL` | Optional Gemini model override | `gemini-2.0-flash` |

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

The browser only calls `/api/chat`; the provider key remains inside `server/llm.js` on the server.

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
  llm.js                         # Groq/OpenAI/Gemini/Manus provider wrapper
public/
  resume/                        # Resume PDF
  manus-routes.json              # Website route manifest
```

## Safety and hosting notes

- Keep all provider keys in hosting-platform secrets or local environment variables.
- Never commit `.env`, API keys, or `VITE_*` provider keys.
- Users can call the public `/api/chat` endpoint, but they cannot see the provider key when the server-side setup is used.
- The endpoint already limits message length and request frequency.
- If no provider key is configured, the portfolio still works through its local knowledge and deterministic fallback.

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

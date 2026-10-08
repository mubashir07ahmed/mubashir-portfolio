# Mubashir Ahmed — Portfolio

## Live website

**[mubashirr.in](https://mubashirr.in)**

This repository contains the React, TypeScript, Vite, and Express source for Mubashir Ahmed’s personal portfolio. The site presents his IoT education, interests, projects, skills, achievements, resume, contact links, and a server-side AI portfolio assistant.

The current live deployment at **mubashirr.in uses Groq** through the server-side `GROQ_API_KEY` secret. The provider key is never placed in frontend code or committed to GitHub.

## Features

- Responsive editorial portfolio for Mubashir Ahmed
- About, skills, projects, learning journey, coding interests, resume, contact, and social links
- Terminal-style hero profile panel
- Portfolio-grounded AI assistant with semantic relevance handling
- Typo-tolerant greetings and portfolio questions
- Server-side AI provider selection with local fallback when no provider is available
- Accessible navigation, keyboard-friendly chat, reduced-motion support, and production health endpoint

## AI provider options

The server supports these provider modes through `AI_PROVIDER`:

| `AI_PROVIDER` | Provider | Required environment values |
| --- | --- | --- |
| `groq` | Groq | `GROQ_API_KEY` |
| `openai` | OpenAI | `OPENAI_API_KEY` |
| `gemini` | Google Gemini OpenAI-compatible endpoint | `GEMINI_API_KEY` |
| `manus` | Managed Manus-compatible endpoint | `MANUS_API_URL`, `MANUS_API_KEY` |
| `auto` | First configured provider in fallback order | Any configured provider |

`auto` checks providers in this order: Groq, OpenAI, Gemini, then Manus. When a specific provider is selected, only that provider is used. The default live configuration is `AI_PROVIDER=groq`.

Provider model variables are optional:

- `GROQ_MODEL` defaults to `openai/gpt-oss-20b`
- `OPENAI_MODEL` defaults to `gpt-4o-mini`
- `GEMINI_MODEL` defaults to `gemini-2.0-flash`

Copy `.env.example` for the complete variable list. Keep real values only in a local ignored `.env` file or the hosting provider’s secret manager.

## Chatbot behavior

The assistant uses the configured server-side provider for portfolio questions and semantically decides whether a message concerns Mubashir, the portfolio, or the assistant itself. It uses the verified shared portfolio context for personal facts and does not expose provider names, API keys, hidden prompts, or private implementation details in chat. If no provider is configured or a provider is unavailable, local portfolio answers and a concise scope fallback remain available.

## Run locally

Requirements: Node.js 22+ and pnpm 11.25.0+.

```bash
pnpm install
cp .env.example .env
# Add a provider key to .env, then:
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

For checks and a production build:

```bash
pnpm test
pnpm build
pnpm start
```

## Security

- Never commit `.env`, provider keys, or secrets.
- Never use `VITE_*` variables for provider credentials; browser variables are public.
- The browser calls only `/api/chat`; provider requests and credentials stay on the server.
- The chat endpoint validates message size and applies a per-client rate limit.

## Project structure

```text
src/                 React UI and portfolio sections
shared/profileData.js Verified editable portfolio source of truth
shared/chat.js       Local profile answers and fallback classification
server/index.js      Express API, chat route, and production serving
server/llm.js        Groq/OpenAI/Gemini/Manus provider selection
public/resume/       Resume PDFs
.env.example         Safe provider configuration template
Dockerfile           Production container definition
```

## Links

- Live website: [mubashirr.in](https://mubashirr.in)
- GitHub repository: [mubashir07ahmed/mubashir-portfolio](https://github.com/mubashir07ahmed/mubashir-portfolio)
- GitHub profile: [@mubashir07ahmed](https://github.com/mubashir07ahmed)
- LinkedIn: [Mubashir Ahmed](https://www.linkedin.com/in/mubashir-ahmed-604145339/)
- Email: [mubashir07ahmed@gmail.com](mailto:mubashir07ahmed@gmail.com)

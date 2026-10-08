# Mubashir Ahmed — Portfolio

A responsive dark editorial-style personal portfolio built with React, TypeScript, Tailwind CSS, Vite, Express, and Lucide React. Its typography and controls are sized for comfortable Mac readability, and its assistant can answer general questions as well as concise questions about Mubashir’s portfolio. Personal details stay grounded in editable profile facts; general questions use the server-side Manus LLM.

## Run locally

Requirements: Node.js 22 or newer and pnpm 11.25.0 (pinned in `package.json`).

```bash
pnpm install
pnpm dev
```

Open `http://localhost:3000`. The Express app serves Vite in middleware mode for development, so the chat endpoint and frontend share one origin. To create a production bundle, run `pnpm build`; run it with `pnpm start` after the build.

## Checks

Run `pnpm test` to verify that explicit Mubashir-profile questions stay profile-grounded and general questions remain available. Run `pnpm build` for the TypeScript check and production bundle.

## Update portfolio details

Edit `shared/profileData.js` to update the name, profile copy, education, skills, project cards, achievements, coding interests, social URLs, contact email, chatbot welcome/suggestions, and resume path. The same profile file is used by the site and the server-side assistant. Project cards currently contain the supplied Mubashir Ahmed project work; add repository links, demos, and further factual technical details when available. Cards support project images with project-specific alt text; only safe HTTP(S) URLs and local root-relative preview paths are accepted.

Set real `codingProfiles`, GitHub, and LinkedIn URLs in that file. A one-page resume is included at `public/resume/Mubashir-Ahmed-Resume.pdf` and linked from the page. It uses the supplied education, contact, skills, projects, achievements, and interests. Its editable Typst source and the pinned build plan live in `resume-source/`.

The first-page hero pairs the profile copy with a static, read-only developer terminal populated from `shared/profileData.js`. It does not simulate a live shell, and the earlier abstract hero art is no longer shown. The theme uses a near-black editorial base, warm off-white text, muted olive-green actions, and amber highlights across solid, readable surfaces.

## Chatbot and contact form

The assistant is restricted to Mubashir’s profile, simple greetings, and basic arithmetic. Complex outside-profile questions receive a short scope reminder rather than an AI-generated answer. Profile answers are brief and include a reminder that they are specific to his profile. Repeated answers in one conversation are replaced with a prompt for another profile area. Resume questions offer a scroll-to-resume action plus View PDF and Download PDF actions.

For questions that identify Mubashir or request the resume, the assistant uses only `shared/profileData.js`. It does not invent employment history, coding ratings, or unsupported personal details. If a personal detail has not been provided, it replies exactly: “That information has not been added to Mubashir’s portfolio yet.” `shared/chat.js` contains the profile-answer rules and simple-question handling. The `/api/chat` endpoint bounds message size and request rate. The app does not persist chat history.

The contact form validates required name, email, and message fields. With Mubashir’s configured email, submit opens a prefilled `mailto:` draft for the visitor to review and send; the demo does not store or transmit messages.

## Project structure

- `src/sections/` — hero, about, skills, projects, learning journey, coding, resume, and contact sections.
- `src/components/` — navigation, chatbot, section headings, terminal panel, project cards, and social links.
- `src/index.css` — Tailwind base reset. `src/theme.css` — responsive layout, warm editorial palette, readable type scale, and reduced-motion handling.
- `shared/profileData.js` — editable facts and explicit placeholders shared across client and server.
- `shared/chat.js` — personal-profile answer rules and general-topic fallback answers.
- `server/index.js` — Express API, request limits, dev middleware, and production static server.
- `server/llm.js` — server-only `invokeLLM` helper for the platform chat-completions API.
- `public/manus-routes.json` — public route manifest for the single-page site.
- `app.config.ts` — durable project-logo metadata.

In the managed deployment, the platform supplies its LLM credentials at runtime; there is no need to commit an `.env` file or a secret. Never put provider keys or tokens in client code or the repository.

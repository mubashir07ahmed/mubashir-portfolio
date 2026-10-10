# Mubashir Ahmed Portfolio — Implementation Plan

## Scope
Clone the selected `mubashir07ahmed/mubashir-portfolio` repository into the managed Webdev project, preserve the existing React/Vite frontend and Express server, validate the existing behavior, and publish the verified website.

## Implementation approach
- Reuse the repository as the source of truth rather than replacing its interface or architecture.
- Run the existing pnpm-based typecheck, tests, and production build.
- Keep `/api/*` behavior on the Express server and the browser-facing portfolio as the Vite-built frontend.
- Preserve `public/manus-routes.json` as the complete page-route manifest.
- Keep Groq/Resend credentials server-only and absent from browser bundles and source control.
- Configure managed Webdev container publishing against the committed `Dockerfile`, with an unauthenticated health endpoint.

## Project structure
- `src/`: React entrypoint, components, sections, theme, and interaction styles.
- `shared/`: verified portfolio facts and local chatbot knowledge/fallbacks.
- `server/`: Express server, API routes, semantic retrieval, contact handling, and LLM wrapper.
- `public/`: favicon, social/logo assets, resumes, and route manifest.
- `scripts/`: semantic-index build helper.
- `Dockerfile`: production dependency installation, frontend build, and server entrypoint.

## Design
- **Design movement:** dark editorial developer portfolio with terminal-inspired interface details.
- **Core principles:** honest personal storytelling, calm readability, tactile terminal cues, and purposeful motion.
- **Color philosophy:** warm off-white text and deep charcoal create an editorial canvas; olive/sage actions signal growth and craft; amber accents add energy to milestones and interactive focus states.
- **Layout paradigm:** a scroll-led narrative with asymmetric hero composition, anchored navigation, section markers, and content panels rather than a generic centered grid.
- **Signature elements:** terminal panels, restrained sage/amber status accents, and Novaa’s responsive mascot/chat interaction.
- **Interaction philosophy:** progressive disclosure and contextual affordances; project filtering, resume actions, chatbot prompts, and navigation should feel direct and lightweight.
- **Animation:** use the existing restrained type-on and pointer-responsive motion; respect reduced-motion preferences and avoid decorative motion that competes with content.
- **Typography system:** retain the repository’s editorial display/body pairing with DM Mono-style terminal text for technical UI and readable sans/serif hierarchy for portfolio content.
- **Brand essence:** an honest, hands-on IoT and AI/ML learner sharing practical software work; personality: curious, grounded, inventive.
- **Brand voice:** direct, reflective, and evidence-led. Example lines: “I build practical AI and IoT experiences while learning in public.” and “Ask Novaa about the work, the tools, or the path behind it.”
- **Wordmark & logo:** preserve the existing favicon/wordmark treatment and project identity rather than introducing a new mark during this publish pass.
- **Signature brand color:** the portfolio’s sage/olive green action color.

## Hosting
- Managed Webdev server capability is enabled for the Express API.
- Publish with the repository Dockerfile, serving on `PORT` with a default of `3000`.
- Health check uses the existing unauthenticated `/api/healthz` route.

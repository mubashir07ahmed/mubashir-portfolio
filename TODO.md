# Portfolio outcome tracker

## 1. Navigation and hero — Complete
- Create a sticky navigation bar with Mohammed Mubashir Ahmed logo/name, About, Skills, Projects, Experience, Coding, Resume, Contact, a chatbot button, and a prominent “Let’s Connect” or “Contact Me” button.
- Add a responsive mobile menu and working smooth-scroll anchor links.
- Display “Hi, I’m Mohammed Mubashir Ahmed”; headline “B.Tech CSE Student building intelligent and practical digital solutions.”; supporting text “I’m passionate about Artificial Intelligence, Machine Learning, full-stack development, software engineering, and problem solving. I enjoy transforming ideas into useful applications and continuously learning how technology works behind the scenes.”
- Add View My Projects, Download Resume, and Ask My AI Assistant buttons; include a professional abstract AI-themed visual without an AI-generated human face, code/neural/terminal motif, and AI/ML Enthusiast, Full-Stack Developer, and Problem Solver badges.

## 2. About and skills — Complete
- Use the supplied biography: Mohammed is a B.Tech CSE student interested in AI, ML, software development and problem solving; he enjoys practical applications combining AI with full-stack development, understanding technology behind the scenes and turning ideas into working projects; his goal is to grow into an AI/ML and software developer and build meaningful real-world applications.
- Reflect experience with Java, Python, C, JavaScript, React, Node.js, Flask, REST APIs, Git and GitHub, and active DSA practice covering arrays, hashing, sliding windows, binary search, stacks, queues, linked lists, trees, graphs, sorting and bit manipulation.
- Add highlight cards: AI & Machine Learning, Full-Stack Development, Data Structures & Algorithms, Continuous Learning.
- Organize skills as: Programming Languages (Java, Python, C, JavaScript); Frontend (React, HTML, CSS, Responsive UI Development); Backend (Node.js, Flask, REST APIs); Tools and Platforms (Git, GitHub, Local Servers, APIs, Automation Tools); Computer Science (Data Structures, Algorithms, Problem Solving, Object-Oriented Programming, Software Engineering Concepts); AI and Emerging Technologies (Artificial Intelligence, Machine Learning, Generative AI, AI-powered Applications, Automation).
- Use skill cards, progress indicators, badges or categorized technology chips; do not show fake skill percentages.

## 3. Projects and learning journey — Complete
- Showcase editable, clearly marked placeholders for: AI-Powered Problem-Solving Application (Python, AI/ML, REST APIs); Full-Stack Web Application (React, Node.js, Flask, REST APIs); Academic or Productivity Application (JavaScript, React, Backend APIs); AI/Generative AI Experiment (Python, APIs, Generative AI). Do not invent project names, links, awards, companies, or measurable results.
- Provide filters All, AI/ML, Full Stack, Academic, Experiments. Each card must support editable project name, description, GitHub URL, live demo URL, technologies and image/preview, with replacement comments and clear placeholder state.
- Create a “My Learning Journey” timeline containing B.Tech in Computer Science and Engineering — Current; practicing DSA; building AI-powered and full-stack applications; exploring Generative AI and automation; continuously improving software development skills. Do not describe academic learning as employment.

## 4. Coding interests and profile links — Complete
- Show Arrays and Hashing, Sliding Window Problems, Binary Search, Stacks and Queues, Linked Lists, Trees and Graphs, Sorting Algorithms, Bit Manipulation, Artificial Intelligence, Machine Learning, Generative AI, Full-Stack Development, Automation, and Emerging Technologies.
- Include editable GitHub, LeetCode, HackerRank, CodeChef and LinkedIn URLs, but only display a profile when its URL is valid.

## 5. Resume and chatbot — Complete with sample PDF included; personal details still need editing
- Provide resume preview/document icon, “Download Resume” and “View Resume” actions, opening the resume in a new tab, all using `/resume/Mohammed-Mubashir-Ahmed-Resume.pdf`; make the path replaceable and accessible from hero, navbar, dedicated Resume section and chatbot response.
- Provide a bottom-right floating chatbot icon and expandable, mobile-friendly window with this welcome: “Hi! I’m Mubashir’s AI portfolio assistant. Ask me about his profile, or explore AI, programming, technology, and other general topics.”
- Include suggested questions: Who is Mohammed Mubashir Ahmed? What technologies does Mohammed know? What are Mohammed’s main areas of interest? What projects has Mohammed worked on? Does Mohammed know React and Node.js? What data structures and algorithms does Mohammed practice? Can I view Mohammed’s resume? What are Mohammed’s career goals? How can I contact Mohammed? What is the difference between AI and machine learning? Explain binary search in simple terms.
- Store the chatbot knowledge base in an editable separate file. Answer personal questions clearly and professionally, consistently in first or third person, concisely, using only supplied facts. Never invent projects, achievements, internships, job experience, coding ratings or social links. For unavailable personal information, say exactly “That information has not been added to Mohammed’s portfolio yet.” For a resume question, provide a clickable link to `/resume/Mohammed-Mubashir-Ahmed-Resume.pdf`. For missing contact details, direct visitors to the contact form.
- Also answer general questions—especially about AI, programming, technology, and broader topics—through the built-in Manus LLM. Keep the LLM call and platform credentials server-side; pass only bounded, sanitized general-topic conversation history, exclude the welcome and profile-only turns, and do not assume an unspecified person or generic pronoun means Mohammed. Keep a local profile and common-topic fallback if the LLM is unavailable.
- Support Enter to send, loading/typing indicator, clear chat and basic error handling. Keep any API key out of frontend code; use a secure server/serverless route where practical, or the profile knowledge-base fallback if an AI API is unavailable.

## 6. Contact and footer — Complete with owner-provided contact details still needed
- Create a contact section with accessible Name, Email, Message fields, validation and Send Message button. Use editable placeholders email `your-email@example.com`, GitHub `https://github.com/your-username`, LinkedIn `https://linkedin.com/in/your-profile`; do not invent contact information.
- Add footer with Mohammed Mubashir Ahmed, “Building, learning, and exploring the future of intelligent software.”, social placeholders, resume link, copyright, and “Built with React and curiosity.”

## 7. Project quality and documentation — Complete
- Use React, Tailwind CSS, reusable component-based architecture, smooth scrolling, subtle animations and a clean icon library. Keep the result professional and responsive on mobile/tablet/desktop; do not use an AI-generated human face. The later approved warm editorial palette and reduced-decoration direction in item 12 supersede the original dark-palette and futuristic-decoration preference.
- Ensure working navigation, chatbot open/send/profile-based and general answers, correct resume path, contact-form validation, project filtering, accessible buttons and labels, keyboard navigation, good contrast, loading/error states, SEO title “Mohammed Mubashir Ahmed | AI/ML and Full-Stack Developer” and meta description “Explore the portfolio of Mohammed Mubashir Ahmed, a B.Tech Computer Science student interested in Artificial Intelligence, Machine Learning, full-stack development, software engineering, and problem solving.” Include a favicon or simple developer-themed logo, clean organized folders and a README with local setup/run instructions.
- Include `.env.example` if an API key is required; never commit API keys or secrets. Add comments showing where to replace project links, profile URLs, resume and contact details.
- Verify mobile and desktop behavior; all navigation links; chatbot open/send/profile and general answers; correct resume path; no unsupported achievements or experience; clearly marked placeholders; and no exposed API keys.

## 8. Container deployment configuration — Complete
- Configure the bound project for container serving with its already-enabled server feature. Point `deploy.dockerfilePath` to the root `Dockerfile` and `deploy.healthPath` to the unauthenticated success endpoint `/api/healthz`; preserve runtime port 3000, do not enable a database, and do not add static split-routing for this single-server container.
- Add a production Dockerfile that installs dependencies from the pinned lockfile, builds the frontend into `dist/`, starts the existing production server, exposes port 3000, and allows the application to honor `PORT` when supplied. Do not depend on credentials during image compilation or put secrets into the image.

## 9. Corrected publication — In progress
- Fix the missing `deploy` configuration for the currently bound project and publish only a checkpoint that contains the Dockerfile and deployment settings. Do not look up or claim a deployment that was never started. If a manual retry is needed, use `webdev.config` with `POST publish`, which handles confirmation.
- Preserve the existing `publishing.auto_publish:true` setting and avoid submitting a duplicate manual publication for the same checkpoint if checkpoint-triggered auto-publish runs.

## 10. Reference-style AI integration and modern assistant UI — Complete
- Use the attached example as an integration pattern only: make general chat requests through a server-side messages-based `invokeLLM` helper with a bounded output-token setting and a bounded recent conversation history. Keep the platform URL/key on the server, and do not copy unrelated tRPC scaffolding or the example’s placeholder portfolio facts.
- Keep this site’s portfolio questions deterministic from its own editable facts. Do not assume generic pronouns refer to Mohammed; for a clearly Mohammed-specific fact not supplied, use exactly “That information has not been added to Mohammed’s portfolio yet.” Allow general AI, programming, and broader questions to reach the LLM.
- Present the assistant in a polished, responsive panel aligned with the warm editorial portfolio: a clear branded header, concise welcome and quick-start prompts, distinct readable assistant/user messages, clear/minimize/close controls, a typing state, and a pinned composer with send action. Keep the composer accessible on narrow screens and preserve the existing profile-grounded safeguards and general-topic behavior.

## 11. Hero terminal, progress indicator removal, and color refresh — Complete
- Add a responsive read-only terminal-style panel to the first-page hero, following the supplied visual reference: a terminal window with shell prompts and factual outputs for the portfolio/profile. Animate commands and outputs character by character with a blinking cursor, then repeat the sequence; keep the content profile-sourced and do not execute commands or change facts. Under `prefers-reduced-motion`, show all lines immediately and omit the cursor.
- Remove the animation that indicates how much of the page has been viewed, including its page scroll-percentage behavior and progress-bar styling. Keep ordinary section scrolling and unrelated navigation controls.
- Change the color theme and add more colors, applying a richer set of coordinated accents to section markers, cards, icons, chips, and labels while maintaining readable contrast across the site.

## 14. Terminal assistant, reading progress, and skills refinement — Complete
- Remove the generic assistant note “Built for this site · also for AI, code & tech.” and replace the assistant presentation with a clearly visible terminal-themed launcher and panel, including command-style labels, a terminal icon, readable assistant/user output, clear controls, and the existing safe profile/general answering behavior.
- Add a thin top-of-page reading progress indicator that updates to the percentage of the document scrolled and remains understandable on desktop and mobile; remove the floating go-to-top button.
- Optimize “Skills in progress” with clearer learning-stage labels, a domain/topic summary, and useful visual hierarchy without inventing proficiency percentages or unsupported expertise claims.

## 12. Mac readability and realistic visual refinement — Complete
- The text is looking very small on my Mac; enlarge body copy, navigation, project details, controls, forms, chatbot text, and metadata so they remain comfortable at ordinary Mac display scaling. Use at least 17px body copy on desktop, 16px on mobile, 14px controls/chips, and 12px metadata, with responsive larger headings.
- Make the site look like a real personal developer portfolio and less like an AI-generated showcase. Change to a warm light editorial palette: ivory and ink base, cobalt as the signature color, with coordinated teal, persimmon, marigold, lavender, and sky-blue accents. Distribute soft tints and accents across sections, cards, forms, buttons, and information chips while keeping strong text contrast.
- Simplify decorative treatment: remove the neural-network hero artwork, text-gradient headline, neon glow, glass-like surfaces, orbital rings, and pulsing status effect. Keep the factual profile terminal readable and read-only; its line reveal is a visual entrance only, not fabricated shell activity, project outcomes, or metrics.
- Refine spacing, surfaces, navigation, cards, project placeholders, resume, contact form, footer, and chatbot to fit the new theme without changing their existing content or behavior; maintain responsive layouts and accessible focus states.

## 13. One-page ATS sample résumé — Complete with editable placeholders
- Add a professional A4, one-page ATS résumé PDF at `public/resume/Mohammed-Mubashir-Ahmed-Resume.pdf` and link it to the existing view/download actions and resume-chat answer.
- Use only the supplied name, current B.Tech CSE study, interests, skills, and DSA practice. Clearly label the college/university, expected graduation year, email/social links, and project work as editable placeholders; do not invent employment, dates, GPA, awards, achievements, completed projects, or contact identity.
- Keep the editable Typst source and its selected build plan alongside the project; document which placeholders need replacement before applying to jobs.

## Verification notes
- Production build/typecheck passed. The actual platform LLM accepted the example-style `invokeLLM({ messages, maxTokens: 320 })` call; no server credential marker was found in browser assets.
- The live Preview answered general programming questions and a contextual follow-up. API checks confirmed general responses use the LLM route, Mohammed-specific unknowns retain the exact response and profile scope, and overlong input is rejected.
- Prior portfolio validation passed: production server smoke tests, route manifest, metadata, health route, resume/profile answers, project filtering, contact validation, mobile/desktop rendering, chatbot keyboard/focus behavior, and secret scan.
- The included sample PDF is not a finished personal résumé: education institution and expected graduation year, personal email/social URLs, and completed project descriptions remain explicit editable placeholders. The contact form validates and does not claim delivery or storage.
- The terminal-led hero and warm editorial palette apply across the entire portfolio; 1280×800 and 375×812 viewports were reviewed, and the page-view progress strip and scroll-percentage code are absent.
- The final A4 PDF passes deterministic text-document verification (6 pass, 0 warnings, 0 failures, 0 unknowns); the production resume path returned HTTP 200 with `Content-Type: application/pdf`.

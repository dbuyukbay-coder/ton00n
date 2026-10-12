# n00n MVP — Noise to Direction

## Product purpose

n00n is a strategic working environment for a brand, product, or business that has too much output pressure and too little direction. It is not an AI strategist, a generic marketing chatbot, or a content generator.

The product promise stays:

> **More output isn’t the answer. Better direction is.**

The prototype must feel like an extension of n00n’s existing studio language at [ton00n.com](https://ton00n.com/): start with the real context, separate noise from signal, choose a direction, and connect strategy to an action that can teach the team something.

## Brand-aligned method

The experience now follows a visible but lightweight sequence:

1. **Idea understanding** — ask what the person is building, without asking for a marketing goal.
2. **Brand context** — ask what the project or brand is called and keep it attached to the work.
3. **Founder view** — ask, in the founder’s own words, what they believe is different. Treat this as a claim to examine, not a fact.
4. **Adaptive interview** — ask one question at a time. Select the next question by decision impact and unresolved marketing coverage, not by a visible checklist.
5. **Similarity scan** — compare the category’s public language and distinguish repeated claims from a meaningful opening.
6. **Direction** — give a behavioural lens, a strategic choice, a short plan, and a measurable action list.
7. **Daily desk** — open only after a direction exists, and keep the selected moves tied to the project rather than showing a generic dashboard.

The visual progression echoes n00n’s site language: **NOISE → SIGNAL → DIRECTION → CLARITY**. The method is visible enough to create trust but does not expose academic frameworks as a lecture.

## MVP scenario

The primary demo uses a fictional brand called **Luma**. It is a technical founder’s AI astrology app that combines a person’s birth chart and current transits into one short daily reflection and a practical prompt for the decision they are facing.

The founder starts from a feature-led position: “We built an AI astrology app with personalised readings. We need a launch plan.” n00n keeps the feature, but asks what situation brings someone to the app, what they do today, what friction keeps the current behaviour in place, and whether the category already owns the claim.

## Interaction model

The first screen asks exactly one thing: **What are you building?** The next screen asks exactly one thing: **What do you call the brand or project?** The third context step asks exactly one thing: **What do you believe is different about it?** The product then asks one adaptive question at a time.

The user sees:

- a short reflection,
- one question,
- one answer field,
- a small reason for the question,
- the brand name and idea attached to the thread,
- a lightweight visual rail for idea, brand, founder view, interview, scan, and direction using the n00n number rhythm.

The user does not receive a long brief, a persona template, a 20-page report, or a generic GTM recommendation.

## Direction output

The direction screen is deliberately layered instead of a large six-field report. It presents:

- **The strategic choice** — one highlighted sentence.
- **Behaviour lens** — the current behaviour and the behavioural friction behind it.
- **Category read** — what comparable products already claim and where the strategic opening may be.
- **Not yet** — the premature moves to avoid.
- **Working plan** — three checkpoints: now, next, review.
- **Action list** — three actions, each with timing, status, and a measure.

The behavioural layer is internalised from behavioural marketing and consumer psychology: friction, uncertainty, motivation, trust, decision risk, and the behaviour required for the product to matter. The user receives plain language rather than a framework dump.

## Similarity scan and research honesty

The sample project uses a clearly labelled comparison set based on official public product pages:

- Co–Star: hyper-personalised birth-chart readings, real-time insights, and relationship context.
- The Pattern: life patterns, relationship dynamics, timing, and daily guidance.
- CHANI: astrology combined with mindfulness, reflection, healing, and daily guidance.

These sources are used to make a category observation, not to claim a complete competitor analysis. For custom ideas, the UI shows **scan pending** and **comparable pages are still open** until a connected research adapter exists. No sample competitors are shown as facts for an unrelated idea.

The next research integration is Apify Website Content Crawler plus focused search. Apify should return source-backed claims and category language; it should not make the strategic decision.

## Daily Desk

The Daily Desk is not reachable as a generic finished dashboard. If no project direction exists, it shows an honest empty state: **The desk opens after the choice.**

Once a direction is created, the project is persisted in session storage for the prototype and the desk shows:

- the unresolved behavioural question,
- the current strategic choice,
- research state and attached sources,
- the three selected actions,
- a review frame for each action,
- signals to notice,
- the next review point.

The desk never displays a hardcoded “7-Day Clarity Ritual” for an unrelated user idea.

## Technical architecture

### Frontend

- React, TypeScript, Vite, Wouter, Tailwind, and the initialized `web-db-user` starter.
- `/` contains brand context, idea understanding, adaptive interview, research checkpoint, and direction.
- `/desk` reads the current prototype project from session storage and renders only the project’s direction and actions.
- `client/src/lib/noon-demo.ts` owns the Luma sample, official comparison links, category read, plan, action list, and demo-safe fallback data.

### Server

- Express/tRPC remains enabled.
- `noon.nextQuestion` receives `brandName`, `idea`, `founderDifference`, and interview turns. Its internal policy covers audience situation, current behaviour, consequence, alternatives, readiness, discovery, trust, barriers, constraints, and evidence; it returns one adaptive question plus hidden coverage and research-readiness metadata.
- `noon.buildDirection` receives the same context and returns a Strategy Spine, behavioural insight, category state, three plan checkpoints, and three actions.
- The LLM is server-side only. Structured parsing and deterministic fallback remain in place.
- The server explicitly instructs the model not to invent competitor research, customer proof, or market facts.

### Persistence

- No database is required for the hackathon prototype.
- The current brand, idea, founder view, direction, plan, and actions are stored in local storage so the Daily Desk can remain connected after leaving and returning to the prototype.

## Design system

### Design movement

An editorial strategy studio meets an internal signal desk. It borrows n00n’s typographic confidence, number rhythm, quiet paper background, black fields, and signal-lime decisions rather than looking like a generic AI SaaS dashboard.

### Core principles

1. **Name the context before interpreting the idea.**
2. **One question, one decision, one layer at a time.**
3. **Make evidence and assumptions visibly different.**
4. **Turn direction into an action that can teach the team something.**

### Palette and typography

The palette uses warm paper (`#F6F3EB`), ink black (`#111111`), signal lime (`#D8FF2F`), muted stone, and coral for unresolved or not-yet states. `Manrope` carries the voice and questions; `DM Mono` carries labels, evidence status, number markers, and the `00 → n00n` rhythm.

### Layout and interaction

The main work area is asymmetric and editorial. The dark left rail anchors the n00n identity; the content uses large typographic questions, thin rules, compact signal panels, and restrained cards. The direction page avoids a single long report by splitting the result into a highlight, three signal panels, three plan checkpoints, and a short action list.

Transitions are quiet and purposeful: 160–250ms, low-distance, no assistant theatrics. The Daily Desk is a consequence of a direction, not a default home screen.

## Project structure

- `client/src/pages/Home.tsx` — brand-first flow, adaptive interview, research checkpoint, layered direction.
- `client/src/pages/Desk.tsx` — project-aware Daily Desk and action review frame.
- `client/src/lib/noon-demo.ts` — Luma sample evidence, sources, category read, plan, actions.
- `client/src/index.css` — n00n visual system and responsive layout.
- `server/routers.ts` — brand-aware tRPC input contract.
- `server/noon.ts` — adaptive interview, direction generation, category honesty, plan/action composition, and fallback logic.
- `client/public/manus-routes.json` — `/` and `/desk` route manifest.

## Build workflow

1. Keep the brand-first, one-question interaction stable.
2. Validate that the product-description question is not repeated.
3. Validate Luma’s source-backed category read, behavioural insight, plan, and actions.
4. Validate custom ideas show a pending scan rather than invented competitor claims.
5. Validate the Daily Desk opens only after a stored direction exists.
6. Run TypeScript, production build, API smoke tests, browser click-through, and visual checks before the next checkpoint.

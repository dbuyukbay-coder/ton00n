# n00n MVP Brief v2 — Gap Analysis

## Overall verdict

The current prototype is a strong **direction scaffold**: it has a brand-aware working space, one-question adaptive interview, evidence states, a source-linked sample scan, a compact Strategy Spine, a three-step plan, measurable actions, and a project-aware Daily Desk. The demonstration sample is now the simpler Luma astrology app rather than the earlier industrial Kiln example.

The new brief raises the bar from a direction tool to a **connected marketing working product**. The required lifecycle is now:

> Product or idea → adaptive understanding → targeted research → credible alternatives → explicit user choice → selected move → complete working materials → review against behaviour and evidence.

The current prototype covers the first half of this lifecycle. It does not yet satisfy the second half because it chooses one direction implicitly, does not let the user choose a direction or move, does not produce a complete asset pack, and does not close the review loop with actual or manually entered outcomes.

## What is already aligned

The current build already satisfies several important brief decisions:

- It asks one focused question at a time and keeps a short reflection.
- It avoids repeating the product-description question.
- It separates known, observed, and unresolved evidence in the Signalroom sample.
- It does not invent competitor sources for custom ideas.
- It keeps research language connected to a strategic choice instead of presenting a generic trend report.
- It separates behaviour from channel selection and explicitly shows a “not yet” state.
- It gives a short working plan and measurable actions instead of a long report.
- It opens the Daily Desk only after a direction exists and keeps the desk connected to the current project.
- Apify Actors and fal.ai are now enabled for the next implementation pass, but the app does not yet call them from the product flow.

## Critical changes required by Brief v2

### 1. Opening context must return to the product or idea

The brief says the opening experience should be **“What are you building?”** and should accept a URL or relevant material when available. The current app starts with **“What should we call this?”** and requires a brand name before the idea.

This was a reasonable response to the previous test feedback, but Brief v2 now takes precedence. The correct compromise is:

- Make the idea or product the primary first input.
- Make brand/project name optional but immediately available as a second context field.
- Accept an optional product URL or uploaded/reference material.
- Keep the brand name attached to the project once supplied.

This preserves the user’s earlier concern about losing the brand context without violating the brief’s “start with the idea” instruction.

### 2. The interview cannot be a fixed three-question gate

The current flow advances to research after exactly three answers. Brief v2 says the interview must select the next question most likely to change the eventual marketing choice, and must move forward when the relevant audience situation and behavioural difference are sufficiently understood.

The interview needs an internal coverage model, not a visible checklist. It should be able to ask about:

- intended user and relevant decision makers;
- the problem and its consequence;
- current alternatives and workarounds;
- whether the audience is actively seeking a solution or living with the current method;
- discovery and trust sources;
- barriers to trying or changing;
- time, budget, and delivery constraints when these affect the available choices.

The important change is not “ask more questions.” It is **stop asking when the next answer would not change the choice, and ask again when one missing answer could reverse it**.

### 3. Research must influence the choice and be able to reopen it

The current research screen is a one-way checkpoint. Brief v2 requires research to be able to reopen a question or alter the options. The live Apify layer should therefore return structured evidence with:

- source URL;
- source title;
- publication date and observation date when available;
- relevant excerpt;
- evidence status;
- what strategic question the source informs;
- whether it supports, weakens, or leaves an option unresolved.

The current UI has a source-linked sample set, but custom ideas still show “scan pending.” The next implementation must connect the Apify Actors connector for focused site and category retrieval, then allow the user to inspect findings before direction options are presented.

### 4. n00n must present alternatives; it must not silently choose one direction

This is the largest product gap. The current Direction screen presents one strategic choice and routes to its plan. Brief v2 explicitly requires two or three credible directions where they are genuinely different, with reasons, uncertainty, resource implications, and what each option leaves out.

The new flow should show direction cards with:

- audience situation;
- underlying tension;
- behaviour to support;
- strategic meaning;
- evidence and assumptions;
- resource implications;
- what the option excludes;
- why it is plausible now;
- what would make it unsuitable.

The user must click **Choose this direction**. If the user asks a question, edits context, or requests another option, the working context should update without silently replacing the previous version.

### 5. Direction and execution must be separated

The current action list is already more useful than a generic content list, but it is still effectively prescribed. Brief v2 requires n00n to propose a move and let the user select or adjust it before production.

The correct sequence is:

> Direction choice → proposed moves → user selects or adjusts one move → production pack.

Available moves should remain open when justified: workshop, partnership, PR, product experience, event, webcast, sales material, search, outreach, paid media, or another move. The category must not decide the channel automatically.

### 6. One selected move must produce a complete working pack

The brief does not consider a recommendation or creative brief a finished output. For the hackathon, one demonstration route should be deeply implemented.

Recommended demonstration move for Luma:

> **7-Day Clarity Ritual** — a focused guided experience where a person in the middle of a decision receives one short reading and one reflection prompt each day, then reviews what became clearer.

The selected move should generate:

- purpose, audience situation, intended change, format, duration, and why the experience fits the direction;
- timed run of show;
- host opening and discussion prompts;
- product demonstration moment;
- invitation copy;
- registration or landing-page copy;
- a finished visual asset;
- attendee follow-up;
- learning or interest capture method;
- behavioural measurement and review timing.

This is where the product stops looking like a strategy chatbot and starts proving that strategy controls production.

### 7. fal.ai belongs after direction and move selection

The brief confirms the correct role for fal.ai: it can produce relevant visuals after the user selects a direction and move. It must not produce the strategy.

The prototype should add a production step with:

- project brand assets and creative constraints;
- selected format and placement;
- generated preview;
- downloadable finished asset;
- editable copy kept separate from the image;
- regenerate-this-asset behavior without changing the chosen direction.

For n00n’s own identity, use supplied logo assets exactly. Do not regenerate or redraw the logo. For Luma, the visual should follow Luma’s selected creative direction rather than inherit n00n’s app identity.

### 8. The Daily Desk needs actual review, not only a static action view

The current Desk shows the open question, direction, action cards, and review frame. Brief v2 requires the Desk to assess what happened against the direction.

The next review implementation should allow:

- manual result input when no analytics connection exists;
- explicit distinction between output, attention, and behaviour;
- source or result attached to the review;
- interpretation of how the result relates to the chosen direction;
- uncertainty and coverage;
- user choice to continue, adjust the move, or reconsider the direction;
- revision impact on approved assets.

Demo or simulated outcomes must carry a visible **Demo data** label. Unconnected data must remain unconnected, never appear as zero.

### 9. The Desk needs signals and history

The brief expands oversight to relevant public brand mentions, references, backlinks, category conversations, competitor developments, and AI-answer checks when actually performed. This does not mean building a news dashboard or collecting generic trends.

The first useful MVP version can be a focused signal review card with:

- source;
- publication date;
- observation date;
- owned vs third-party classification;
- relevant excerpt;
- relation to the chosen direction;
- choice raised: reinforce, expose a gap, timing opportunity, or insufficient evidence.

The user must be able to keep the direction unchanged when a signal is not strong enough.

### 10. Persistence must preserve relationships

The current build uses `sessionStorage`, which is enough for a same-tab demo but does not satisfy the brief’s requirement to save progress and restore it on return. The next pass should use local persistence at minimum, with records for:

- project and interview;
- evidence and source excerpts;
- direction alternatives and selected choice;
- move and generated assets;
- results and review decisions.

For the hackathon this can remain local-first, but the relationships must be explicit in the data model. A later database migration should not require redesigning the product logic.

## Recommended implementation order

### Pass 1 — choice architecture

Replace the brand-only opening with idea-first entry plus optional brand name, URL, and material. Expand the adaptive interview policy. Add direction alternatives and an explicit **Choose this direction** checkpoint.

### Pass 2 — live research

Use the enabled Apify Actors connector for the product site, two or three relevant alternatives, focused category queries, and selected public discussions or reviews. Store source, excerpt, date, status, and strategic question. Allow research to update or reopen the direction options.

### Pass 3 — selected move

Implement the Luma 7-Day Clarity Ritual as the deep demonstration route. Let the user choose the move and then generate the complete execution pack.

### Pass 4 — visual production

Call fal.ai only after move selection. Produce a previewable and downloadable invitation or announcement visual. Keep copy, prompt, image, and export as separate project records.

### Pass 5 — review loop

Add manual result entry, demo labels, output/attention/behaviour distinction, review interpretation, and the three user decisions: continue, adjust move, reconsider direction.

### Pass 6 — demo compression

Keep the full lifecycle available, but make the judge-facing path fit the brief’s two-minute timing:

- 0–15 seconds: idea and premature request;
- 15–35 seconds: one meaningful answer changes the next question;
- 35–55 seconds: source-linked research finding;
- 55–75 seconds: two credible directions and user choice;
- 75–100 seconds: complete selected asset pack and finished visual;
- 100–120 seconds: labelled review result and user choice.

## Final assessment

The current MVP should not be thrown away. Its best parts are the tone, one-question interaction, evidence labels, source honesty, behavioural direction, and project-aware Desk. The build now needs to move from **“n00n tells me one good direction”** to **“n00n helps me compare, choose, produce, and learn without losing the strategic reason.”**

That is the difference between a polished strategy interface and the connected product described in Brief v2.

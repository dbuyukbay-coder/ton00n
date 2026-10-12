export type NoonSource = {
  name: string;
  url: string;
  note: string;
  quote: string;
  checkedAt: string;
  scope: string;
};

export type NoonCategory = {
  category: string;
  repeatedClaim: string;
  strategicOpening: string;
  sources: NoonSource[];
};

export type NoonPlanStep = {
  phase: string;
  title: string;
  detail: string;
  output: string;
};

export type NoonAction = {
  id?: string;
  label: string;
  title: string;
  detail: string;
  when: string;
  measure: string;
  status: string;
};

export type NoonDirectionOption = {
  id: string;
  title: string;
  audienceSituation: string;
  tension: string;
  strategicMeaning: string;
  tradeoffs: string[];
  resourceNeeds: string[];
  excludesForNow: string[];
  reviewCondition: string;
  recommended?: boolean;
};

export type NoonMaterial = {
  key: string;
  title: string;
  format: string;
  content: string;
  status: "ready" | "needs_input";
  mode: "sample" | "live";
  downloadUrl?: string;
};

export type NoonProductionPack = {
  moveId: string;
  title: string;
  purpose: string;
  format: string;
  materials: NoonMaterial[];
  measurement: string;
  externalActionsRequired: string[];
};

export const sampleBrand = "Luma";

export const sampleIdea =
  "A technical founder is building an AI astrology app that combines a person’s birth chart and current transits into one short daily reflection and a practical prompt for the decision they are facing.";

export const sampleAnswers = [
  "People open astrology apps when they feel uncertain about a relationship, a transition, or what the day is asking of them. Most read a horoscope, feel seen for a moment, and leave.",
  "They compare apps, follow astrologers on TikTok, or ask friends. They do not want more predictions; they want language for a feeling they already have, because the current reading disappears without changing a decision.",
  "They are not actively searching for another astrology product. They usually arrive through a friend, a creator, or a moment when a decision feels emotionally loaded.",
  "The biggest barrier is trust: they do not want an app to tell them what will happen. They need a low-risk way to see whether a reflection helps.",
  "We have a prototype and ten early conversations. People like the grounded tone but are still skeptical of AI predictions. We do not know whether the prompt changes what they do next. We can run a small founder-led test this week, but we do not have a paid media budget.",
];

export const sampleEvidence = [
  { label: "Founder claim", title: "AI birth-chart reading", text: "The product combines birth-chart data and current transits into a short reflection and prompt.", status: "known" },
  { label: "Category signal", title: "The category already promises personal meaning", text: "Comparable products own personalised horoscopes, relationship patterns, timing, mindfulness, and self-discovery.", status: "observed" },
  { label: "Behaviour gap", title: "The moment of use is still unclear", text: "The audience may not need another prediction. They may need language and a small ritual before a real-life decision.", status: "unresolved" },
];

export const sampleSources: NoonSource[] = [
  { name: "Co–Star", url: "https://www.costarastrology.com/", note: "Personalised birth-chart readings, relationships, and real-time insights.", quote: "The astrology app that deciphers the mystery of human relations through NASA data and biting truth.", checkedAt: "12 Oct 2026", scope: "Official homepage only" },
  { name: "The Pattern", url: "https://www.thepattern.com/", note: "Personalised patterns, relationships, timing, and daily guidance.", quote: "The Pattern is a personalized astrology app that helps you understand the patterns shaping your life and influencing your relationships.", checkedAt: "12 Oct 2026", scope: "Official homepage only" },
  { name: "CHANI", url: "https://www.chani.com/app", note: "Manifestation, self-discovery, mindfulness, healing, and reflection practices.", quote: "The #1 astrology app for manifestation, self-discovery, mindfulness, and healing.", checkedAt: "12 Oct 2026", scope: "Official app page only" },
];

export const sampleCategory: NoonCategory = {
  category: "Astrology apps / daily self-reflection",
  repeatedClaim: "The category already owns personalised readings, relationships, timing, daily guidance, and self-discovery.",
  strategicOpening: "Do not compete on another horoscope feed. Test whether Luma can own the five-minute reflection before a real-life decision or transition.",
  sources: sampleSources,
};

export const samplePlan: NoonPlanStep[] = [
  { phase: "NOW", title: "Find the moment", detail: "Invite people facing one real decision into a seven-day Clarity Ritual instead of asking them to download another horoscope feed.", output: "A clear before-and-after reflection moment." },
  { phase: "NEXT", title: "Capture the language of change", detail: "Learn whether Luma gives people words for what they already feel, and whether that makes one next step easier.", output: "A message built around clarity, not prediction." },
  { phase: "REVIEW", title: "Choose the next experience", detail: "Use the evidence to choose between a guided audio ritual, a live new-moon session, or a deeper in-app experience.", output: "One format decision with a reason." },
];

export const sampleActions: NoonAction[] = [
  { id: "clarity-ritual", label: "PROOF", title: "Run a 7-Day Clarity Ritual", detail: "Invite ten people who are in the middle of a decision. Give them one short reading and one reflection prompt each day.", when: "This week", measure: "10 invited; 7-day completion; one decision named", status: "next" },
  { id: "clarity-language", label: "LEARN", title: "Capture what became clearer", detail: "Ask what the person came in feeling, what they wrote down, and whether the prompt changed their next step.", when: "After each ritual", measure: "The words behind clarity, hesitation, and action", status: "queued" },
  { id: "next-experience", label: "REVIEW", title: "Choose the next experience", detail: "Only after the ritual, decide whether the next move is an audio practice, a live session, or an in-app feature.", when: "After 10 rituals", measure: "One experience decision with evidence", status: "queued" },
];

export const sampleDirectionOptions: NoonDirectionOption[] = [
  {
    id: "decision-ritual",
    title: "Own the reflection before the decision",
    audienceSituation: "A person feels uncertain about a relationship, transition, or next step and opens an astrology app for meaning.",
    tension: "They receive a personalised reading but leave without naming what they will do with it.",
    strategicMeaning: "Luma becomes a five-minute reflection ritual that turns a feeling into one clearer next step.",
    tradeoffs: ["Narrower moment than a daily horoscope app", "Needs a behaviour test before broad positioning"],
    resourceNeeds: ["A short ritual flow", "Ten participants", "One simple follow-up"],
    excludesForNow: ["Generic zodiac content", "Influencer seeding", "Broad launch campaign"],
    reviewCondition: "Continue if people complete the ritual and can name a clearer next step.",
    recommended: true,
  },
  {
    id: "guided-daily-practice",
    title: "Build a trusted daily reflection practice",
    audienceSituation: "A person wants a consistent check-in and returns to astrology as a gentle daily routine.",
    tension: "The category already offers daily guidance, so Luma needs a reason to become a habit without adding more content volume.",
    strategicMeaning: "Luma becomes a calm daily practice that connects current transits to the user’s own language.",
    tradeoffs: ["Broader habit promise", "Harder to distinguish from established daily guidance products"],
    resourceNeeds: ["A repeatable daily prompt", "Retention observation", "Clear boundaries for AI interpretation"],
    excludesForNow: ["Claims of prediction accuracy", "High-frequency notifications", "Social feed mechanics"],
    reviewCondition: "Continue if people return without being pushed and use their own words in the reflection.",
  },
];

export const sampleProductionPack: NoonProductionPack = {
  moveId: "clarity-ritual",
  title: "7-Day Clarity Ritual — complete working pack",
  purpose: "Test whether a short reflection changes what someone can name or do before a real-life decision.",
  format: "Founder-led 7-day participant experience",
  materials: [
    { key: "invitation", title: "Participant invitation copy", format: "Editable text", content: "You do not need another prediction. For seven days, Luma will give you one short reflection prompt for a decision or feeling already on your mind. At the end, we will ask what became clearer.", status: "ready", mode: "sample" },
    { key: "run-of-show", title: "Daily prompt script", format: "7-day script", content: "Day 1: Name the decision. Day 2: Name the feeling. Day 3: Notice the current story. Day 4: Ask what would make the next step easier. Day 5: Write the option you are avoiding. Day 6: Choose one small action. Day 7: Compare what is clearer now.", status: "ready", mode: "sample" },
    { key: "follow-up", title: "Follow-up questions", format: "Editable text", content: "What did you come in feeling? What did you write down? Did the reflection change your next step? What would make you return?", status: "ready", mode: "sample" },
    { key: "visual", title: "Announcement visual", format: "Downloadable SVG preview", content: "A neutral Luma 7-Day Clarity Ritual visual is available as a preview asset. It is not a published campaign.", status: "ready", mode: "sample", downloadUrl: "/luma-clarity-ritual.svg" },
    { key: "measurement", title: "Measurement sheet", format: "Manual review", content: "Track invited, started, completed, decision named, return within seven days, and reported clarity. Sample values stay separate from live results.", status: "ready", mode: "sample" },
    { key: "missing-date", title: "Date and participant details", format: "Editable fields", content: "Add the actual date, participant invitation method, and consent/retention wording before use.", status: "needs_input", mode: "sample" },
  ],
  measurement: "Primary signal: completed reflection with one decision named. Review after seven days; do not treat completion as purchase or commercial validation.",
  externalActionsRequired: ["Invite participants manually", "Confirm date and consent wording", "Collect results manually"],
};

export const sampleDailyPracticePlan: NoonPlanStep[] = [
  { phase: "NOW", title: "Define the nightly ritual", detail: "Give a small group one calm, private reflection at the same time each evening. The promise is a consistent moment of language, not a prediction.", output: "A seven-night ritual with an explicit privacy boundary." },
  { phase: "NEXT", title: "Observe voluntary return", detail: "Watch whether people return on their own and whether the reflection becomes part of an existing bedtime routine.", output: "A habit signal separate from notification-driven opens." },
  { phase: "REVIEW", title: "Choose the habit design", detail: "Use return language, privacy feedback, and routine fit to decide whether to deepen the nightly practice or stop it.", output: "A continue, adjust, or stop decision with evidence." },
];

export const sampleDailyPracticeActions: NoonAction[] = [
  { id: "nightly-practice", label: "PROOF", title: "Run a 7-Night Reflection Practice", detail: "Invite ten people who already journal or unwind before sleep. Send one private prompt each evening without a social feed or prediction claim.", when: "This week", measure: "10 invited; voluntary return across 7 nights; privacy objections named", status: "next" },
  { id: "return-language", label: "LEARN", title: "Capture the language of return", detail: "Ask what made the practice worth opening again, what felt intrusive, and what belonged in a private nightly ritual.", when: "After night 3 and night 7", measure: "Reasons for return, non-return, and privacy concerns", status: "queued" },
  { id: "habit-review", label: "REVIEW", title: "Choose the habit design", detail: "Use evidence to keep the ritual, alter its rhythm, or stop before adding notification, content, or growth mechanics.", when: "After 7 nights", measure: "A documented continue, adjust, or stop decision", status: "review" },
];

export const sampleDailyPracticePack: NoonProductionPack = {
  moveId: "nightly-practice",
  title: "7-Night Reflection Practice — complete working pack",
  purpose: "Test whether Luma can earn a voluntary, private place in an existing nightly reflection routine without relying on prediction or social content.",
  format: "Founder-led private nightly practice",
  materials: [
    { key: "invitation", title: "Participant invitation copy", format: "Editable text", content: "Luma is testing a quieter way to end the day. For seven nights, you will receive one short private reflection based on your chart and the current sky. No predictions. No social feed. At the end, we will ask whether it became a moment you wanted to return to.", status: "ready", mode: "sample" },
    { key: "landing", title: "One-page practice copy", format: "Editable text", content: "A small nightly ritual for people who already pause before sleep. Luma gives you one grounded reflection and one place to name what the day left with you. Your entries are private. This is not therapy, advice, or a prediction of what comes next.", status: "ready", mode: "sample" },
    { key: "run-of-show", title: "Seven-night prompt sequence", format: "7-night script", content: "Night 1: What is still with you from today? Night 2: What did you avoid naming? Night 3: What felt heavier than it needed to? Night 4: What would you like to protect tomorrow? Night 5: What does your body already know? Night 6: What can stay unresolved? Night 7: What became easier to hold?", status: "ready", mode: "sample" },
    { key: "privacy", title: "Privacy boundary copy", format: "Editable text", content: "Your reflection is for you. Luma does not turn personal entries into a public profile or social feed. For this test, the founder only reviews the optional end-of-week feedback you choose to submit.", status: "ready", mode: "sample" },
    { key: "visual", title: "Practice announcement visual", format: "Downloadable SVG preview", content: "A sample visual for the private nightly practice is ready to download. It is a demo asset, not a published campaign.", status: "ready", mode: "sample", downloadUrl: "/luma-nightly-practice.svg" },
    { key: "measurement", title: "Review sheet", format: "Editable review prompt", content: "Record: invitation accepted, night 1 started, voluntary return on nights 2–7, privacy concern, reason for return, reason for non-return, and one exact phrase the participant uses to describe the ritual.", status: "ready", mode: "sample" },
  ],
  measurement: "Primary signal: voluntary return without a high-frequency notification. Secondary signal: participants describe the practice as private, grounding, or worth repeating in their own words.",
  externalActionsRequired: ["Invite participants manually", "Show the privacy boundary before the first prompt", "Collect optional feedback after night 3 and night 7"],
};

export const sampleDirection = {
  brandName: sampleBrand,
  tension: "The product starts from an AI horoscope feature, while the audience may be looking for language and confidence in a specific moment of uncertainty.",
  behaviour: "Move from consuming a prediction and leaving to naming one feeling or decision and returning to it with more clarity.",
  behaviouralInsight: "The working hypothesis is that people do not lack astrology content. The friction is turning a fleeting feeling of being seen into a small action they can take.",
  direction: "Own the five-minute reflection before a real-life decision or transition, not another daily horoscope feed.",
  notYet: "Do not start with generic zodiac content, horoscope spam, influencer seeding, or a broad launch before one reflection ritual changes what someone does.",
  measure: "Measure reflection completion, the number of decisions named, return within seven days, and whether people report a clearer next step.",
  category: sampleCategory,
  plan: samplePlan,
  actions: sampleActions,
};

export type SampleExecution = {
  direction: Pick<typeof sampleDirection, "tension" | "behaviour" | "behaviouralInsight" | "direction" | "notYet" | "measure">;
  plan: NoonPlanStep[];
  actions: NoonAction[];
  packs: Record<string, NoonProductionPack>;
};

export const sampleExecutionByOption: Record<string, SampleExecution> = {
  "decision-ritual": {
    direction: { tension: sampleDirection.tension, behaviour: sampleDirection.behaviour, behaviouralInsight: sampleDirection.behaviouralInsight, direction: sampleDirection.direction, notYet: sampleDirection.notYet, measure: sampleDirection.measure },
    plan: samplePlan,
    actions: sampleActions,
    packs: { "clarity-ritual": sampleProductionPack },
  },
  "guided-daily-practice": {
    direction: {
      tension: "The category already offers daily astrology, while Luma still needs a credible reason to become a private, voluntary nightly practice.",
      behaviour: "Move from opening astrology only in a moment of uncertainty to returning voluntarily to one private reflection at the end of the day.",
      behaviouralInsight: "The working hypothesis is not that people need more daily content. It is that a calm ritual earns return when it respects privacy and fits an existing bedtime routine.",
      direction: "Build a trusted daily reflection practice that connects current transits to the user’s own language, without prediction claims or social mechanics.",
      notYet: "Do not add high-frequency notifications, a social feed, influencer seeding, or a prediction-accuracy promise before voluntary return and privacy trust are observed.",
      measure: "Measure voluntary return across seven nights, privacy objections, and the participant’s own language for why the ritual was worth repeating.",
    },
    plan: sampleDailyPracticePlan,
    actions: sampleDailyPracticeActions,
    packs: { "nightly-practice": sampleDailyPracticePack },
  },
};

export const deskItems = { nextReview: "After the first 7-Day Clarity Ritual" };

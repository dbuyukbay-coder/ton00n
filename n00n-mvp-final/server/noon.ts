import { invokeLLM } from "./_core/llm";

export type InterviewTurn = {
  question: string;
  answer: string;
};

export type InterviewInput = {
  brandName: string;
  idea: string;
  founderDifference: string;
  turns: InterviewTurn[];
};

export type NextQuestionResult = {
  reflection: string;
  question: string;
  stage: "idea" | "behaviour" | "market" | "decision";
  why: string;
  coverage?: string[];
  decisionImpact?: string;
  hypotheses?: string[];
  readiness?: "continue" | "research";
};

export type DirectionSource = {
  name: string;
  url: string;
  note: string;
};

export type DirectionCategory = {
  category: string;
  repeatedClaim: string;
  strategicOpening: string;
  sources: DirectionSource[];
};

export type DirectionPlanStep = {
  phase: string;
  title: string;
  detail: string;
  output: string;
};

export type DirectionAction = {
  label: string;
  title: string;
  detail: string;
  when: string;
  measure: string;
  status: "next" | "queued" | "review";
};

export type DirectionResult = {
  brandName: string;
  tension: string;
  behaviour: string;
  behaviouralInsight: string;
  direction: string;
  notYet: string;
  measure: string;
  category: DirectionCategory;
  plan: DirectionPlanStep[];
  actions: DirectionAction[];
};

type DirectionCore = Omit<DirectionResult, "brandName" | "category" | "plan" | "actions">;

const demoDirection: DirectionResult = {
  brandName: "Luma",
  tension:
    "The product starts from an AI horoscope feature, while the audience may be looking for language and confidence in a specific moment of uncertainty.",
  behaviour:
    "Move from consuming a prediction and leaving to naming one feeling or decision and returning to it with more clarity.",
  behaviouralInsight:
    "The working hypothesis is that people do not lack astrology content. The friction is turning a fleeting feeling of being seen into a small action they can take.",
  direction:
    "Own the five-minute reflection before a real-life decision or transition, not another daily horoscope feed.",
  notYet:
    "Do not start with generic zodiac content, horoscope spam, influencer seeding, or a broad launch before one reflection ritual changes what someone does.",
  measure:
    "Measure reflection completion, the number of decisions named, return within seven days, and whether people report a clearer next step.",
  category: {
    category: "Astrology apps / daily self-reflection",
    repeatedClaim: "The category already owns personalised readings, relationships, timing, daily guidance, and self-discovery.",
    strategicOpening: "Do not compete on another horoscope feed. Test whether Luma can own the five-minute reflection before a real-life decision or transition.",
    sources: [
      { name: "Co–Star", url: "https://www.costarastrology.com/", note: "Hyper-personalised birth-chart readings, real-time insights, and relationships" },
      { name: "The Pattern", url: "https://www.thepattern.com/", note: "Life patterns, relationship dynamics, timing, and daily guidance" },
      { name: "CHANI", url: "https://www.chani.com/app", note: "Astrology combined with mindfulness, reflection, healing, and daily guidance" },
    ],
  },
  plan: [
    { phase: "NOW", title: "Find the moment", detail: "Invite people facing one real decision into a seven-day Clarity Ritual instead of asking them to download another horoscope feed.", output: "A clear before-and-after reflection moment." },
    { phase: "NEXT", title: "Capture the language of change", detail: "Learn whether Luma gives people words for what they already feel, and whether that makes one next step easier.", output: "A message built around clarity, not prediction." },
    { phase: "REVIEW", title: "Choose the next experience", detail: "Use the evidence to choose between a guided audio ritual, a live new-moon session, or a deeper in-app experience.", output: "One format decision with a reason." },
  ],
  actions: [
    { label: "PROOF", title: "Run a 7-Day Clarity Ritual", detail: "Invite ten people who are in the middle of a decision. Give them one short reading and one reflection prompt each day.", when: "This week", measure: "10 invited; 7-day completion; one decision named", status: "next" },
    { label: "LEARN", title: "Capture what became clearer", detail: "Ask what the person came in feeling, what they wrote down, and whether the prompt changed their next step.", when: "After each ritual", measure: "The words behind clarity, hesitation, and action", status: "queued" },
    { label: "REVIEW", title: "Choose the next experience", detail: "Only after the ritual, decide whether the next move is an audio practice, a live session, or an in-app feature.", when: "After 10 rituals", measure: "One experience decision with evidence", status: "review" },
  ],
};

function selectFallbackQuestion(input: InterviewInput): NextQuestionResult {
  const text = input.turns.map(turn => turn.answer).join(" ").toLowerCase();
  const useTurkish = /[çğıöşü]/i.test(`${input.idea} ${input.founderDifference} ${text}`) || /\b(ve|bir|insanlar|uygulama|fark|karar|belirsizlik)\b/i.test(text);
  const has = (...terms: string[]) => terms.some(term => text.includes(term));
  const hasAudience = has("people", "person", "user", "customer", "team", "founder", "insan", "kişi", "kullanıcı", "müşteri", "ekip", "kurucu");
  const hasBehaviour = has("read", "open", "use", "follow", "ask", "compare", "leave", "today", "currently", "do instead", "okuyor", "açıyor", "kullanıyor", "takip", "çıkıyor", "bugün", "şu an", "yerine");
  const hasConsequence = has("because", "result", "cost", "risk", "worry", "uncertain", "friction", "impact", "so ", "sonuç", "maliyet", "belirsiz", "risk", "engel", "zorlaşı", "bu yüzden", "gerekiyor");
  const hasDiscovery = has("search", "looking", "google", "tiktok", "instagram", "friend", "community", "word of mouth", "creator", "arıyor", "arama", "arkadaş", "topluluk", "keşfet", "içerik üretic");
  const hasReadiness = has("try", "download", "need", "want", "ready", "actively", "not looking", "denemek", "indirmek", "istiyor", "hazır", "aktif", "aramıyor", "yaşıyor");
  const hasTrustBarrier = has("trust", "worry", "hesitat", "price", "time", "privacy", "private writing", "sharing", "skeptic", "barrier", "güven", "çekin", "fiyat", "zaman", "mahrem", "gizlilik", "özel", "paylaş", "şüphe", "engel", "zor");
  const hasEvidence = has("prototype", "tested", "test", "customer", "said", "data", "proof", "evidence", "pilot", "prototip", "görüşme", "veri", "kanıt", "ölç", "gözlem");
  const hasConstraints = has("budget", "time", "team", "resource", "constraint", "30 days", "bütçe", "zaman", "ekip", "kaynak", "kısıt", "30 gün");
  const hasJournalRoutine = has("journal", "journaling", "notebook", "bedtime", "before sleep", "nightly", "günlük", "defter", "yatmadan", "uyumadan", "gece rutini");
  const hasLowIncrementalValue = has("good enough", "not enough value", "no loss", "would not replace", "doesn't replace", "defter işe yarıyor", "kayıp yaratmıyor", "ek değer", "yeterli değil", "değiştirmemek");
  const hasCounterfactualAnswer = has("no personal information", "nothing personal", "even if", "still wouldn't", "still would", "hiçbir kişisel bilgi", "paylaşılmasa", "paylaşmasam", "olsa bile", "yine de");
  const make = (tr: [string, string, string, string], en: [string, string, string, string], stage: NextQuestionResult["stage"], coverage: string[], impact: [string, string], readiness: "continue" | "research" = "continue"): NextQuestionResult => ({
    reflection: useTurkish ? tr[0] : en[0], question: useTurkish ? tr[1] : en[1], why: useTurkish ? tr[2] : en[2], stage, coverage, decisionImpact: useTurkish ? impact[0] : impact[1], readiness,
  });

  if (hasTrustBarrier && hasJournalRoutine && (hasLowIncrementalValue || hasConsequence) && !hasCounterfactualAnswer) {
    const result = make(
      ["İki açıklama var: özel yazıların paylaşılması denemeyi engelliyor olabilir; ya da mevcut defter zaten yeterince iyi olabilir.", "Hiçbir kişisel bilgi paylaşmaları gerekmese, Luma’yı denemek için yeterli bir neden olur mu? Olmazsa, defterin üstüne hangi somut değeri koyması gerekir?", "Bu karşı-olgusal soru, gizlilik bariyeri ile yetersiz ek değer ihtimalini birbirinden ayırır.", "decision"],
      ["There are two explanations: sharing private writing may block trial, or the current notebook may already be good enough.", "If no personal information had to be shared, would there be enough reason to try Luma? If not, what concrete value would it need to add beyond the notebook?", "This counterfactual separates a privacy barrier from a weak incremental-value proposition.", "decision"], "decision", ["privacy_barrier", "incremental_value"], ["Bu cevap, önce güven sınırını mı yoksa ürün değerini mi test etmemiz gerektiğini değiştirir.", "This changes whether the next test should focus on a trust boundary or product value."], "continue");
    return { ...result, hypotheses: useTurkish ? ["Gizlilik: özel yazıların paylaşılması denemeyi engelliyor olabilir.", "Ek değer: mevcut defter yeterince iyi olduğu için yeni araç gerekli olmayabilir."] : ["Privacy: sharing private writing may block trial.", "Incremental value: the current notebook may already be good enough."] };
  }

  if (!hasAudience || !hasBehaviour) return make(
    ["Ürün şeklini ve kurucunun fark iddiasını aldım. Şimdi bu farkın içindeki gerçek duruma bakıyorum.", "Bu fark önemli olduğunda kim o durumda oluyor ve bugün ne yapıyor?", "Özellik etiketinden önce mevcut davranışı anlamamız gerekiyor.", "behaviour"],
    ["I have the product shape and the founder’s claim. Now I’m checking the situation around it.", "When this difference matters, who is in that situation, and what are they doing today?", "The current behaviour matters more than the feature label.", "behaviour"], "behaviour", ["audience_situation", "current_behaviour"], ["Bu, yönü kimin etrafında kuracağımızı değiştirebilir.", "This can change who the direction is for."], "continue");
  if (!hasConsequence) return make(
    ["Mevcut davranışı gördüm. Şimdi bunun neden değişmesi gerektiğini netleştiriyorum.", "Bu mevcut davranış devam edince ne oluyor; neden bunun değişmesi gerekiyor?", "Pazarlama yönü yalnızca problemi değil, onun sonucunu da taşımalı.", "behaviour"],
    ["I can see the current behaviour. Now I’m checking why it needs to change.", "What happens when the current behaviour continues, and why would that make someone consider changing it?", "A direction needs a meaningful consequence, not only an interesting problem.", "behaviour"], "behaviour", ["consequence", "decision_friction"], ["Bu, ilk hareketin aciliyet mi, güven mi üretmesi gerektiğini değiştirebilir.", "This can change whether the first move needs urgency or reassurance."], "continue");
  if (!hasDiscovery || !hasReadiness) return make(
    ["Şimdi bu kişinin çözüm arayıp aramadığını ve nasıl keşfettiğini ayırıyorum.", "Bu kişi çözümü aktif olarak mı arıyor, yoksa değişimi değerli kılacak bir an gelene kadar mevcut yöntemle mi yaşıyor?", "Hazır olma ve keşif durumu, kanal varsayımından önce anlaşılmalı.", "market"],
    ["Now I’m separating active seeking from living with the current way.", "Are they actively looking for a solution, or living with the current way until something makes change feel worth it?", "Readiness and discovery should be understood before choosing a channel.", "market"], "market", ["readiness", "discovery", "alternatives"], ["Bu, ilk hareketin aramaya mı yoksa güven oluşturan bir deneyime mi dayanacağını değiştirir.", "This can change whether the first move helps people find an answer or recognise a reason to change."], "continue");
  if (!hasTrustBarrier) return make(
    ["Şimdi değişimin önündeki güven ve deneme bariyerine bakıyorum.", "Bunun denenmesini veya bu markaya güvenilmesini şu anda ne engelliyor?", "Bariyer, hangi deneyimin ve hangi kanıtın gerekli olduğunu belirler.", "behaviour"],
    ["Now I’m checking the trust and trial barrier around the decision.", "What would make trying or changing feel risky, difficult, or not worth it for them?", "The barrier often matters more than the audience label when choosing a first move.", "behaviour"], "behaviour", ["trust", "barrier_to_try", "constraints"], ["Bu, move’un insandan ne kadar taahhüt isteyebileceğini değiştirir.", "This can change the proof, format, and commitment the first move should ask for."], "continue");
  if (!hasEvidence || !hasConstraints) return make(
    ["Yön karşılaştırılabilir hale geldi. Şimdi iddianın hangi kısmının test edildiğini ve hangi kısıtlarla hareket edebileceğimizi ayırıyorum.", "Bu farkın gerçekten önemli olduğuna dair ne gözlemledin; hangi kısıtlar ilk hareketi etkiler?", "Kurucunun fark iddiası değerlidir ama henüz pazar gerçeği değildir.", "decision"],
    ["The direction is comparable now. I’m separating founder belief from what has been tested and what the move must respect.", "What evidence do you have that this difference matters, and which constraints should shape the first move?", "A founder’s difference is a useful claim, not yet a market fact.", "decision"], "decision", ["evidence", "constraints"], ["Bu, hangi yönün ve ilk move’un gerçekten seçilebilir olduğunu belirler.", "This determines which direction and first move are ready to compare."], "continue");
  return make(
    ["Gerekli bağlamlar oluştu. Şimdi cevapları araştırma ve anlamlı yön seçenekleriyle karşılaştırabiliriz.", "Bu bağlamla hangi yönleri karşılaştırmamı istersin?", "Araştırmaya geçmek için yeterli çalışma bağlamı var; açık varsayımlar görünür kalacak.", "decision"],
    ["The decision-critical context is present. We can now compare research and meaningful direction options.", "Which direction should we compare first?", "There is enough working context to move into research without pretending the unknowns are solved.", "decision"], "decision", ["context_complete"], ["Şimdi seçenekler araştırma ve kanıtla kurulabilir.", "Options can now be built against the research and evidence."], "research");
}

const fallbackCore: DirectionCore = {
  tension: "The product description is clear, but the decision it should change is not clear yet.",
  behaviour: "Move the person from the current workaround toward one concrete decision the product can make easier.",
  behaviouralInsight: "The main friction is likely decision uncertainty, not a lack of information. This needs evidence before it becomes a claim.",
  direction: "Test a direction grounded in the decision the product can improve, not in the feature that makes it possible.",
  notYet: "Do not choose a channel or promise a market difference before a focused category scan and one real behaviour test.",
  measure: "Measure the target decision, the time it takes, and whether the person changes what they do after the first test.",
};

function deriveCoreFromEvidence(input: InterviewInput): DirectionCore {
  const evidence = `${input.idea} ${input.founderDifference} ${input.turns.map(turn => turn.answer).join(" ")}`.toLowerCase();
  const has = (...terms: string[]) => terms.some(term => evidence.includes(term));
  const nightlyRoutine = has("journal", "journaling", "bedtime", "before sleep", "nightly", "sleep", "günlük", "yatmadan", "uyumadan", "gece rutini");
  const privacy = has("privacy", "private", "data", "personal data", "gizlilik", "mahrem", "veri");
  const noDecision = has("not a decision", "not important decision", "no important decision", "karar aramıyor", "önemli karar değil", "karar vermiyor");

  if (nightlyRoutine) {
    return {
      tension: privacy ? "The user already has a nightly reflection habit, but the product must earn a place in it without making personal reflection feel exposed." : "The user already has a nightly reflection habit, but the product has not earned a reason to become part of it.",
      behaviour: "Move from an existing private bedtime journal habit to a voluntary, grounded reflection that adds language without replacing the user’s own practice.",
      behaviouralInsight: privacy ? "The friction is not a missing decision prompt. It is whether a personal reflection tool can feel private enough to be invited into an existing routine." : "The friction is not a lack of content. It is whether a new reflection can fit an existing private ritual without adding noise.",
      direction: "Test a private nightly reflection practice that helps users name the day in their own words, without prediction claims or social mechanics.",
      notYet: privacy ? "Do not use a public feed, social sharing, high-frequency notifications, or vague data language before the privacy boundary is explicit and trusted." : "Do not add a social feed, high-frequency notifications, or broad daily-content promise before voluntary nightly return is observed.",
      measure: "Measure voluntary return across seven nights, explicit privacy objections, and the participant’s own description of whether the ritual was worth repeating.",
    };
  }

  if (privacy || noDecision) {
    return {
      tension: privacy ? "The product may be useful, but a personal-data concern is blocking trust before the user has reason to try it." : "The product is being framed around a decision moment the user has not said they are trying to solve.",
      behaviour: noDecision ? "Move from a generic feature claim to one observed recurring situation the user actually recognises." : "Move from hesitation caused by privacy uncertainty to a small, consent-led experience with a clear data boundary.",
      behaviouralInsight: privacy ? "The barrier is trust in the handling of personal reflection, not a shortage of another benefit statement." : "The missing evidence is the user’s actual recurring situation, not a channel or persona.",
      direction: privacy ? "Test a privacy-first, low-commitment reflection experience before making a broader value promise." : "Pause directional claims and observe one recurring use situation before choosing a marketing move.",
      notYet: privacy ? "Do not ask for broad personal data, social proof, or public sharing before the privacy boundary is meaningful to the user." : "Do not turn an assumed decision moment into positioning before users recognise it themselves.",
      measure: privacy ? "Measure whether people understand the data boundary, feel safe enough to try, and name what would increase trust." : "Measure whether the observed situation repeats and whether the product changes what the user does in it.",
    };
  }
  return fallbackCore;
}

function extractText(content: unknown): string {
  if (typeof content === "string") return content;
  if (content && typeof content === "object" && "text" in content) return String((content as { text?: unknown }).text ?? "");
  if (Array.isArray(content)) {
    return content
      .map(part => (typeof part === "string" ? part : "text" in (part as object) ? String((part as { text?: unknown }).text ?? "") : ""))
      .join("\n");
  }
  return "";
}

function parseJsonObject(value: string): Record<string, unknown> | null {
  const cleaned = value.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "").trim();
  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}");
  if (start < 0 || end <= start) return null;
  try {
    const parsed = JSON.parse(cleaned.slice(start, end + 1).replace(/\r?\n/g, " "));
    return parsed && typeof parsed === "object" ? parsed as Record<string, unknown> : null;
  } catch {
    return null;
  }
}

function parseResult(value: string): NextQuestionResult | null {
  const parsed = parseJsonObject(value) as Partial<NextQuestionResult> | null;
  if (!parsed) return null;
  if (
    typeof parsed.reflection !== "string" ||
    typeof parsed.question !== "string" ||
    typeof parsed.why !== "string" ||
    !["idea", "behaviour", "market", "decision"].includes(parsed.stage ?? "")
  ) return null;
  return {
    ...parsed,
    coverage: Array.isArray(parsed.coverage) ? parsed.coverage.filter(item => typeof item === "string") : [],
    decisionImpact: typeof parsed.decisionImpact === "string" ? parsed.decisionImpact : "",
    hypotheses: Array.isArray(parsed.hypotheses) ? parsed.hypotheses.filter(item => typeof item === "string") : [],
    readiness: parsed.readiness === "research" ? "research" : "continue",
  } as NextQuestionResult;
}

function parseDirectionCore(value: string): DirectionCore | null {
  const parsed = parseJsonObject(value);
  if (!parsed) return null;
  const pick = (...keys: string[]) => keys.map(key => parsed[key]).find(item => typeof item === "string" && item.trim()) as string | undefined;
  const result: DirectionCore = {
    tension: pick("tension", "problem_observed", "problem", "goal") ?? fallbackCore.tension,
    behaviour: pick("behaviour", "behavior", "change_required_observed", "target_behavior", "target_user_observed") ?? fallbackCore.behaviour,
    behaviouralInsight: pick("behaviouralInsight", "behavioralInsight", "behavioural_insight", "behavioral_insight", "decision_friction", "friction") ?? fallbackCore.behaviouralInsight,
    direction: pick("direction", "differentiator_observed", "strategic_direction", "goal") ?? fallbackCore.direction,
    notYet: pick("notYet", "not_yet", "assumptions_to_test", "assumptions", "risks") ?? fallbackCore.notYet,
    measure: pick("measure", "measurement", "measurement_plan", "success_metric", "metrics") ?? fallbackCore.measure,
  };
  return result;
}

function composeDirection(input: InterviewInput, core: DirectionCore): DirectionResult {
  return {
    brandName: input.brandName,
    ...core,
    category: {
      category: "Focused category scan pending",
      repeatedClaim: "No comparable product pages have been connected for this idea yet. n00n will not present a category claim as fact before that scan.",
      strategicOpening: "The next research pass should test whether the proposed direction is recognisable, repeated, or genuinely open in the category.",
      sources: [],
    },
    plan: [
      { phase: "NOW", title: "Name the observed situation", detail: core.behaviour, output: "One observed use situation the team can recognise." },
      { phase: "NEXT", title: "Run the smallest proof", detail: core.direction, output: core.measure },
      { phase: "REVIEW", title: "Review the behaviour shift", detail: "Compare what the person did before the test with what they did after it.", output: "Keep, change, or stop the direction." },
    ],
    actions: [
      { label: "DEFINE", title: "Write the observed situation in one sentence", detail: core.behaviour, when: "Today", measure: "The founder can name the situation without naming a channel", status: "next" },
      { label: "TEST", title: "Run the smallest proof", detail: core.direction, when: "This week", measure: core.measure, status: "queued" },
      { label: "REVIEW", title: "Review what changed", detail: "Use the evidence from the first test before choosing a broader marketing move.", when: "After the first test", measure: "A keep, change, or stop decision", status: "review" },
    ],
  };
}

export async function nextQuestion(input: InterviewInput): Promise<NextQuestionResult> {
  const fallback = selectFallbackQuestion(input);
  if (fallback.hypotheses?.length) return fallback;
  const transcript = input.turns.map((turn, index) => `Q${index + 1}: ${turn.question}\nA${index + 1}: ${turn.answer}`).join("\n\n");

  try {
    const response = await invokeLLM({
      model: "gpt-5-mini",
      maxTokens: 700,
      responseFormat: {
        type: "json_schema",
        json_schema: {
          name: "noon_next_question",
          strict: true,
          schema: {
            type: "object",
            properties: {
              reflection: { type: "string" },
              question: { type: "string" },
              stage: { type: "string", enum: ["idea", "behaviour", "market", "decision"] },
              why: { type: "string" },
              coverage: { type: "array", items: { type: "string" } },
              decisionImpact: { type: "string" },
              hypotheses: { type: "array", items: { type: "string" } },
              readiness: { type: "string", enum: ["continue", "research"] },
            },
            required: ["reflection", "question", "stage", "why", "coverage", "decisionImpact", "hypotheses", "readiness"],
            additionalProperties: false,
          },
        },
      },
      messages: [
        {
          role: "system",
          content: `You are n00n’s adaptive interview layer for the brand ${input.brandName}. You are not a strategist in this turn and you never produce a plan. Ask exactly ONE short question based on the conversation so far. Never repeat the product-description question because the idea and founder’s claimed difference have already been captured. Treat that difference as a claim to examine, not a fact. Do not ask for a persona. Do not assume GTM, SEO, social, advertising, content, or any channel. Internally choose the next question by decision impact, not by a fixed questionnaire. Cover only what is still capable of changing the marketing choice: audience situation, current behaviour, consequence, alternatives, readiness to seek a solution, discovery, trust, barrier to trying, constraints, and evidence. Before choosing a question, write 0–2 short competing explanations in hypotheses. When two explanations can plausibly explain the same answer, ask a counterfactual question that separates them. Example: privacy may block trial, but an existing tool may also be good enough; ask whether there would be enough reason to try if no personal data were shared. Distinguish actively seeking a solution from living with the current method without seeking change. If research would be more useful than another answer, mark readiness as research. Respond in the dominant language of the idea and latest answers; if the user writes Turkish, write the reflection, question, why, and hypotheses in Turkish while keeping JSON keys and enum values in English. Keep the reflection to one short sentence. Return JSON only.`,
        },
        {
          role: "user",
          content: `Brand: ${input.brandName}\nIdea or product:\n${input.idea}\nFounder’s claimed difference:\n${input.founderDifference}\n\nConversation so far:\n${transcript || "No answers yet."}\n\nReturn exactly one next question, the internal coverage areas it touches, why the answer could change the choice, and whether the interview is ready for research.`,
        },
      ],
    });
    const candidate = parseResult(extractText(response.choices?.[0]?.message?.content));
    if (candidate && candidate.readiness === fallback.readiness && candidate.coverage?.some(area => fallback.coverage?.includes(area))) return candidate;
    return fallback;
  } catch (error) {
    console.warn("[n00n] Falling back to deterministic interview question:", error instanceof Error ? error.message : error);
    return fallback;
  }
}

export async function buildDirection(input: InterviewInput): Promise<DirectionResult> {
  const transcript = input.turns.map((turn, index) => `Q${index + 1}: ${turn.question}\nA${index + 1}: ${turn.answer}`).join("\n\n");
  try {
    const response = await invokeLLM({
      model: "gpt-5-mini",
      maxTokens: 2200,
      reasoning: { effort: "low" },
      messages: [
        {
          role: "system",
          content: `You are n00n’s direction layer for ${input.brandName}. Turn only the evidence in this conversation into six compact fields. You must not invent competitors, research findings, customer facts, proof, or market claims. The category is not scanned in this call, so do not pretend it is. Never treat a feature as strategy. Never assume a marketing channel. The behavioural insight must name the friction, uncertainty, motivation, or decision risk actually described by the user. Treat explicit user evidence as binding: if they say the person journals before sleep, build around a nightly reflection routine; if they say people are not making an important decision, do not invent a decision-led direction; if they name privacy as a barrier, put privacy in the tension, notYet, and measure. Keep each field plain and under 42 words. Return exactly one JSON object with exactly these keys: tension, behaviour, behaviouralInsight, direction, notYet, measure.`,
        },
        {
          role: "user",
          content: `Brand: ${input.brandName}\nIdea or product:\n${input.idea}\nFounder’s claimed difference:\n${input.founderDifference}\n\nInterview evidence:\n${transcript}\n\nCreate the compact direction spine.`,
        },
      ],
    });
    const core = parseDirectionCore(extractText(response.choices?.[0]?.message?.content));
    return composeDirection(input, core ?? deriveCoreFromEvidence(input));
  } catch (error) {
    console.warn("[n00n] Falling back to deterministic direction:", error instanceof Error ? error.message : error);
    return composeDirection(input, deriveCoreFromEvidence(input));
  }
}

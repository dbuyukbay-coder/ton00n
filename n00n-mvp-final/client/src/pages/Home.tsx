import { useMemo, useState } from "react";
import { Link } from "wouter";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Check,
  ChevronRight,
  CircleDot,
  ExternalLink,
  FlaskConical,
  LockKeyhole,
  Menu,
  Search,
  Sparkles,
  Target,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { trpc } from "@/lib/trpc";
import {
  sampleAnswers,
  sampleBrand,
  sampleDirection,
  sampleDirectionOptions,
  sampleEvidence,
  sampleExecutionByOption,
  sampleIdea,
  type NoonAction,
  type NoonDirectionOption,
  type NoonPlanStep,
  type NoonProductionPack,
  type NoonSource,
} from "@/lib/noon-demo";

type Stage = "idea" | "brand" | "difference" | "interview" | "research" | "direction" | "production";
type Turn = { question: string; answer: string };
type Direction = typeof sampleDirection;

function buildCustomDirectionSelection(base: Direction, optionId: string): Direction {
  const context = `${base.tension} ${base.behaviour} ${base.behaviouralInsight} ${base.measure}`.toLowerCase();
  const isReturnOperations = /return|returns|storage|logistics|purchase|approval|iade|depo|lojistik|onay|satın/.test(context);
  const boundedBudget = context.match(/(?:€\s?\d{2,5}|\d{2,5}\s?(?:euro|eur))/i)?.[0] ?? "a bounded test budget";

  if (!isReturnOperations || optionId === "operational-certainty") {
    return {
      ...base,
      tension: isReturnOperations ? "The buyer is not only deciding whether the product works; they are deciding who carries storage, return, and logistics responsibility after approval." : base.tension,
      behaviour: isReturnOperations ? "Move from evaluating the feature in isolation to approving a bounded operational promise with responsibilities visible." : base.behaviour,
      behaviouralInsight: isReturnOperations ? "The adoption barrier is perceived operational exposure: a buyer may agree with the idea and still avoid approval if the after-purchase burden is unclear." : base.behaviouralInsight,
      direction: isReturnOperations ? "Compete on operational certainty: make storage, return responsibility, and trusted logistics partners part of the product promise." : base.direction,
      notYet: isReturnOperations ? "Do not lead with broad demand generation before the buyer can see who owns the return, what happens to inventory, and which logistics partner carries the work." : base.notYet,
      measure: isReturnOperations ? "Measure whether a qualified buyer can approve the bounded operational promise, name the responsibility split, and accept the first test within the available budget." : base.measure,
      plan: [
        { phase: "NOW", title: "Make responsibility visible", detail: "Map storage, return, approval, and logistics responsibility into one buyer-readable promise.", output: "A responsibility map a buyer can approve." },
        { phase: "NEXT", title: "Run a partner-backed proof", detail: "Use one trusted logistics partner and a bounded test to show what happens after the purchase is approved.", output: "A proof of operational certainty, not a feature demo." },
        { phase: "REVIEW", title: "Review approval confidence", detail: "Learn which responsibility or cost still blocks approval before scaling the promise.", output: "A keep, change, or stop decision." },
      ],
      actions: [
        { id: "responsibility-map", label: "CLARIFY", title: "Build the responsibility map", detail: "Show storage, return ownership, approval step, trusted logistics partner, and the cost boundary in one page.", when: "Today", measure: "A buyer can repeat who owns each responsibility", status: "next" },
        { id: "partner-proof", label: "PROOF", title: "Run one partner-backed test", detail: `Use ${boundedBudget} to test the operational promise with one qualified buyer and one trusted logistics partner.`, when: "This week", measure: "Approval decision, responsibility objections, and partner handoff recorded", status: "queued" },
        { id: "approval-review", label: "REVIEW", title: "Review the approval barrier", detail: "Compare what blocked approval: cost, storage, return liability, logistics trust, or product value.", when: "After the first test", measure: "One documented reason to continue, adjust, or stop", status: "review" },
      ],
    };
  }

  return {
    ...base,
    tension: isReturnOperations ? "The buyer may understand the operational problem but still need a low-risk reason to approve a first purchase under a constrained budget." : base.tension,
    behaviour: isReturnOperations ? "Move from agreeing with the problem to authorising a contained first purchase that does not create an open-ended liability." : base.behaviour,
    behaviouralInsight: isReturnOperations ? "The alternative explanation is not only operational complexity; it may be that the perceived downside of approving a new vendor is larger than the expected value of trying it." : base.behaviouralInsight,
    direction: isReturnOperations ? "Compete on approval confidence: make the first purchase easy to authorise by bounding cost, responsibility, and the exit from the test." : "Make the first purchase easy to approve by bounding the risk before expanding the promise.",
    notYet: isReturnOperations ? "Do not claim operational superiority or scale through broad demand generation until a buyer can approve the first test without unresolved budget or liability questions." : base.notYet,
    measure: isReturnOperations ? `Measure whether a qualified buyer approves a first test within ${boundedBudget}, can name the exit condition, and still sees enough value after the risk is made explicit.` : base.measure,
    plan: [
      { phase: "NOW", title: "Bound the approval", detail: "Define the first purchase cost, exit condition, responsibility split, and what the buyer is allowed to say no to.", output: "A purchase decision with a clear ceiling and exit." },
      { phase: "NEXT", title: "Test approval language", detail: "Put the bounded offer in front of qualified buyers and listen for the exact reason they approve or decline.", output: "The language behind approval, hesitation, and refusal." },
      { phase: "REVIEW", title: "Choose the entry promise", detail: "Decide whether operational certainty or approval confidence is the stronger entry point based on what blocked the decision.", output: "One strategic entry promise with evidence." },
    ],
    actions: [
      { id: "approval-one-pager", label: "CLARIFY", title: "Write the bounded approval one-pager", detail: `State the first purchase, the ${boundedBudget} ceiling, the exit condition, and who owns return and logistics responsibility.`, when: "Today", measure: "A buyer can approve or decline without requesting missing risk information", status: "next" },
      { id: "buyer-approval-test", label: "TEST", title: "Run five approval conversations", detail: "Ask qualified buyers to approve, decline, or revise the bounded first purchase. Do not pitch a broad rollout.", when: "This week", measure: "Approval reason, refusal reason, and unresolved risk captured", status: "queued" },
      { id: "entry-promise-review", label: "REVIEW", title: "Choose the entry promise", detail: "Use the approval conversations to decide whether the product should lead with operational certainty or approval confidence.", when: "After five conversations", measure: "One entry promise tied to observed decision language", status: "review" },
    ],
  };
}

function buildCustomProductionPack(brandName: string, action: NoonAction, direction: Direction): NoonProductionPack {
  const context = `${direction.tension} ${direction.behaviour} ${direction.behaviouralInsight} ${direction.direction} ${direction.measure}`;
  const isReturnOperations = /return|returns|storage|logistics|purchase|approval|iade|depo|lojistik|onay|satın/i.test(context);
  const boundedBudget = context.match(/(?:€\s?\d{2,5}|\d{2,5}\s?(?:euro|eur))/i)?.[0] ?? "the agreed test budget";
  const audience = isReturnOperations ? "a qualified buyer" : "a small group who already experiences the described situation";
  return {
    moveId: action.id ?? action.title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
    title: `${action.title} — complete working pack`,
    purpose: direction.direction,
    format: isReturnOperations ? "Founder-led buyer proof" : "Founder-led behaviour proof",
    materials: [
      { key: "invitation", title: isReturnOperations ? "Buyer invitation copy" : "Participant invitation copy", format: "Editable text", content: isReturnOperations ? `${brandName} is testing a bounded first purchase for teams carrying storage, returns, and logistics responsibility. We will make the responsibility split, partner handoff, and ${boundedBudget} test boundary explicit before asking you to approve anything. Would you be willing to review the one-page offer and tell us what would still block approval?` : `${brandName} is testing a small first experience around this situation: ${direction.behaviour} We are not asking for a broad commitment. We want to learn what would make the first step useful, safe, and worth repeating.`, status: "ready", mode: "live" },
      { key: "one-pager", title: isReturnOperations ? "Approval one-pager" : "One-page experience copy", format: "Editable text", content: isReturnOperations ? `THE FIRST TEST\n\nPromise: ${direction.direction}\n\nWhat the buyer approves: one bounded test within ${boundedBudget}.\n\nResponsibility: storage, returns, and logistics ownership are named before approval.\n\nPartner boundary: the trusted logistics partner and handoff are listed.\n\nExit: the test ends with a review of approval confidence, operational burden, and return responsibility.\n\nThe buyer can decline any unresolved responsibility without being pushed into a broader rollout.` : `${direction.direction}\n\nThis first experience is designed to test the behaviour before scaling. It asks for one small action, names the barrier, and makes clear what will be learned before a broader marketing move.`, status: "ready", mode: "live" },
      { key: "run-of-show", title: "Execution flow", format: "Editable sequence", content: isReturnOperations ? `1. Send the approval one-pager to ${audience}. 2. Ask the buyer to mark the responsibility they would not approve. 3. Walk through the storage, return, logistics, and ${boundedBudget} boundary. 4. Record the exact approval or refusal language. 5. End with a clear continue, adjust, or stop decision.` : `1. Invite ${audience}. 2. Deliver the first experience. 3. Capture the response in the person’s own words. 4. Compare what changed against: ${direction.measure}. 5. Decide whether to continue, adjust, or stop.`, status: "ready", mode: "live" },
      { key: "measurement", title: "Measurement and review sheet", format: "Editable review prompt", content: isReturnOperations ? `Record: invited, reviewed, approved, declined, budget objection, storage objection, return-liability objection, logistics-trust objection, exact reason for approval or refusal, and whether the buyer would approve a next step within ${boundedBudget}.` : `Record: invited, started, completed, the intended behaviour, the person’s exact words, the main barrier, what changed, what stayed uncertain, and whether to continue, adjust, or stop.\n\nTarget signal: ${direction.measure}`, status: "ready", mode: "live" },
      { key: "visual-brief", title: isReturnOperations ? "Approval map visual" : "Visual direction brief", format: isReturnOperations ? "Generated visual preview" : "Ready creative brief", content: isReturnOperations ? `A generated approval-map visual shows the responsibility split, the partner handoff, and the bounded test as one buyer-readable decision.` : `Create a visual that shows the described situation, the behaviour shift, and the smallest first move. Avoid generic product screenshots and channel-first campaign language. CTA: Review the first test.`, status: "ready", mode: "live", downloadUrl: isReturnOperations ? "/manus-storage/async-images/ji0bLPbLNleWcNlfREonmZ/image-1.webp" : undefined },
    ],
    measurement: isReturnOperations ? `Primary signal: a qualified buyer can approve or decline the bounded test while naming the responsibility split. Secondary signals: budget, storage, return-liability, and logistics-trust objections.` : direction.measure,
    externalActionsRequired: isReturnOperations ? ["Confirm the logistics partner", `Confirm the ${boundedBudget} test boundary`, "Collect buyer approval language manually"] : ["Confirm the participant or buyer group", "Confirm owner and timing", "Collect results manually before scaling"],
  };
}

type StoredProject = {
  brandName: string;
  idea: string;
  founderDifference: string;
  direction: Direction;
  isSample: boolean;
  selectedOptionId?: string;
  selectedMoveId?: string;
  productionPack?: NoonProductionPack | null;
  selectedDirection?: Direction | null;
};

const stages = [
  { id: "idea", marker: "00", label: "Idea" },
  { id: "brand", marker: "01", label: "Brand" },
  { id: "difference", marker: "02", label: "Founder view" },
  { id: "interview", marker: "03", label: "Interview" },
  { id: "scan", marker: "04", label: "Scan" },
  { id: "direction", marker: "n00n", label: "Direction" },
  { id: "production", marker: "05", label: "Materials" },
];

function readStoredProject(): StoredProject | null {
  try {
    const raw = window.localStorage.getItem("noonProject");
    return raw ? JSON.parse(raw) as StoredProject : null;
  } catch {
    return null;
  }
}

function Wordmark() {
  return <Link href="/" className="noon-wordmark" aria-label="n00n home"><img src="/noon-logo.png" alt="n00n" /></Link>;
}

function StageRail({ stage }: { stage: Stage }) {
  const activeIndex = stage === "idea" ? 0 : stage === "brand" ? 1 : stage === "difference" ? 2 : stage === "interview" ? 3 : stage === "research" ? 4 : stage === "direction" ? 5 : 6;
  return (
    <div className="stage-rail">
      {stages.map((item, index) => {
        const completed = index < activeIndex;
        const current = index === activeIndex;
        return (
          <div className={`stage-item ${completed ? "is-complete" : ""} ${current ? "is-current" : ""}`} key={item.id}>
            <span className="stage-dot">{completed ? <Check size={11} strokeWidth={3} /> : item.marker}</span>
            <span>{item.label}</span>
          </div>
        );
      })}
    </div>
  );
}

function AppShell({ children, stage, brandName }: { children: React.ReactNode; stage: Stage; brandName: string }) {
  return (
    <div className="noon-app-shell">
      <aside className="noon-sidebar">
        <div>
          <Wordmark />
          <div className="sidebar-kicker">NOISE / SIGNAL / DIRECTION</div>
        </div>
        <nav className="sidebar-nav" aria-label="Main navigation">
          <Link href="/" className="sidebar-link is-active"><CircleDot size={14} /> Direction work</Link>
          <Link href="/desk" className="sidebar-link"><CalendarDays size={14} /> Daily desk</Link>
        </nav>
        <div className="sidebar-bottom">
          <div className="sidebar-signal"><span /> {brandName || "No working brand yet"}</div>
          <div className="sidebar-meta">n00n / private prototype<br />more output is not the answer</div>
        </div>
      </aside>
      <main className="noon-main">
        <header className="noon-topbar">
          <div className="mobile-wordmark"><Wordmark /></div>
          <div className="topbar-project"><span className="mono-label">WORKING PROJECT</span><span>{brandName || "unnamed"}</span></div>
          <div className="topbar-actions">
            <Link href="/desk" className="topbar-desk-link">Open desk <ArrowRight size={14} /></Link>
            <button className="mobile-menu" aria-label="Open menu"><Menu size={18} /></button>
          </div>
        </header>
        <div className="noon-content">
          <StageRail stage={stage} />
          {children}
        </div>
      </main>
    </div>
  );
}

function SourceCard({ source }: { source: NoonSource }) {
  return (
    <a className="source-card" href={source.url} target="_blank" rel="noreferrer">
      <div className="source-card-top"><span className="source-favicon">↗</span><span className="mono-label">COMPARABLE</span><ExternalLink size={13} /></div>
      <strong>{source.name}</strong>
      <span>{source.note}</span>
      <blockquote>“{source.quote}”</blockquote>
      <small>{source.scope} · checked {source.checkedAt}</small>
    </a>
  );
}

function EvidenceCard({ item }: { item: (typeof sampleEvidence)[number] }) {
  return (
    <article className="evidence-card">
      <div className="evidence-card-top"><span className="mono-label">{item.label}</span><Badge className={`evidence-badge ${item.status}`}>{item.status}</Badge></div>
      <h3>{item.title}</h3>
      <p>{item.text}</p>
    </article>
  );
}

function ActionRow({ action, index, onSelect, isSelected }: { action: NoonAction; index: number; onSelect?: (action: NoonAction) => void; isSelected?: boolean }) {
  return (
    <article className="action-row">
      <span className="action-index">0{index + 1}</span>
      <div className="action-main"><span className="mono-label">{action.label}</span><h3>{action.title}</h3><p>{action.detail}</p></div>
      <div className="action-meta"><span>{action.when}</span><strong>{action.measure}</strong><Badge className={`action-status ${action.status}`}>{action.status}</Badge>{onSelect && <button className={`choose-move-button ${isSelected ? "is-selected" : ""}`} onClick={() => onSelect(action)}>{isSelected ? "Selected" : "Build this move"} <ArrowRight size={14} /></button>}</div>
    </article>
  );
}

function PlanStep({ step }: { step: NoonPlanStep }) {
  return (
    <div className="plan-step"><span className="plan-phase">{step.phase}</span><div><strong>{step.title}</strong><p>{step.detail}</p><small>{step.output}</small></div></div>
  );
}

function DirectionLine({ label, value }: { label: string; value: string }) {
  return <div className="direction-line"><span className="mono-label">{label}</span><p>{value}</p></div>;
}

export default function Home() {
  const stored = useMemo(readStoredProject, []);
  const requestedStage = new URLSearchParams(window.location.search).get("stage");
  const initialStage: Stage = stored && (requestedStage === "direction" || requestedStage === "production") ? requestedStage : "idea";
  const [stage, setStage] = useState<Stage>(initialStage);
  const [brandName, setBrandName] = useState(stored?.brandName ?? "");
  const [idea, setIdea] = useState(stored?.idea ?? "");
  const [founderDifference, setFounderDifference] = useState(stored?.founderDifference ?? "");
  const [answer, setAnswer] = useState("");
  const [question, setQuestion] = useState("When the difference you believe in matters, who is in that situation, and what are they doing today?");
  const [reflection, setReflection] = useState("I have the product shape. I’m not going to turn the feature into a campaign yet.");
  const [why, setWhy] = useState("The current behaviour matters more than the feature label.");
  const [hypotheses, setHypotheses] = useState<string[]>([]);
  const [turns, setTurns] = useState<Turn[]>([]);
  const [direction, setDirection] = useState<Direction>(stored?.direction ?? sampleDirection);
  const [selectedOptionId, setSelectedOptionId] = useState(stored?.selectedOptionId ?? "");
  const [selectedMoveId, setSelectedMoveId] = useState(stored?.selectedMoveId ?? "");
  const [productionPack, setProductionPack] = useState<NoonProductionPack | null>(stored?.productionPack ?? null);
  const [selectedDirection, setSelectedDirection] = useState<Direction | null>(stored?.selectedDirection ?? null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSample, setIsSample] = useState(stored?.isSample ?? false);

  const nextQuestionMutation = trpc.noon.nextQuestion.useMutation();
  const directionMutation = trpc.noon.buildDirection.useMutation();

  const currentPrompt = useMemo(() => sampleAnswers[turns.length] ?? "Tell n00n what would make this worth choosing.", [turns.length]);
  const options = useMemo<NoonDirectionOption[]>(() => {
    if (isSample) return sampleDirectionOptions;
    const operational = buildCustomDirectionSelection(direction, "operational-certainty");
    const approval = buildCustomDirectionSelection(direction, "approval-confidence");
    return [
      { id: "operational-certainty", title: "Compete on operational certainty", audienceSituation: "The buyer is weighing the product against storage, return, logistics, and responsibility exposure.", tension: operational.tension, strategicMeaning: operational.direction, tradeoffs: ["Requires a trusted partner proof", "Narrower promise with clearer ownership"], resourceNeeds: ["One responsibility map", "One logistics partner", "One bounded test"], excludesForNow: ["Broad demand generation", "Unbounded rollout promises"], reviewCondition: operational.measure, recommended: true },
      { id: "approval-confidence", title: "Compete on approval confidence", audienceSituation: "The buyer agrees with the problem but still needs a low-risk, budget-bounded reason to approve the first purchase.", tension: approval.tension, strategicMeaning: approval.direction, tradeoffs: ["Requires direct buyer conversations", "May reveal the product value is not yet enough"], resourceNeeds: ["A bounded offer", "Five approval conversations", "A clear exit condition"], excludesForNow: ["Performance claims", "Scale before approval evidence"], reviewCondition: approval.measure },
    ];
  }, [direction, isSample]);
  const selectedExecution = isSample && selectedOptionId ? sampleExecutionByOption[selectedOptionId] : undefined;
  const workingDirection = selectedExecution ? { ...direction, ...selectedExecution.direction, plan: selectedExecution.plan, actions: selectedExecution.actions } : (selectedDirection ?? direction);

  const persistProject = (nextDirection: Direction, overrides: Partial<StoredProject> = {}) => {
    try {
      window.localStorage.setItem("noonProject", JSON.stringify({ brandName, idea, founderDifference, direction: nextDirection, isSample, selectedOptionId, selectedDirection, selectedMoveId, productionPack, ...overrides } satisfies StoredProject));
    } catch {
      // The prototype can continue without persistence if storage is unavailable.
    }
  };

  const continueFromIdea = (useSample = false) => {
    const nextIdea = useSample ? sampleIdea : idea.trim();
    if (!nextIdea) return;
    setIdea(nextIdea);
    setIsSample(useSample);
    setStage("brand");
  };

  const runLumaDemo = () => {
    const seededTurns: Turn[] = [
      { question: "When this difference matters, who is in that situation, and what are they doing today?", answer: sampleAnswers[0] },
      { question: "What happens when the current behaviour continues, and why would that make someone consider changing it?", answer: sampleAnswers[1] },
      { question: "Are they actively looking for a solution, or living with the current way until something makes change feel worth it?", answer: sampleAnswers[2] },
      { question: "What would make trying or changing feel risky, difficult, or not worth it for them?", answer: sampleAnswers[3] },
      { question: "What evidence do you have that this difference matters, and what is still an assumption?", answer: sampleAnswers[4] },
    ];
    setIdea(sampleIdea);
    setBrandName(sampleBrand);
    setFounderDifference("It turns astrology into a short practical reflection before a decision, not another horoscope feed.");
    setTurns(seededTurns);
    setAnswer("");
    setDirection(sampleDirection);
    setIsSample(true);
    setSelectedOptionId("");
    setSelectedDirection(null);
    setSelectedMoveId("");
    setProductionPack(null);
    try {
      window.localStorage.setItem("noonProject", JSON.stringify({ brandName: sampleBrand, idea: sampleIdea, founderDifference: "It turns astrology into a short practical reflection before a decision, not another horoscope feed.", direction: sampleDirection, isSample: true, selectedOptionId: "", selectedMoveId: "", selectedDirection: null, productionPack: null } satisfies StoredProject));
    } catch {
      // The visible demo remains usable when storage is unavailable.
    }
    setStage("research");
  };

  const continueFromBrand = () => {
    if (!brandName.trim()) return;
    setBrandName(brandName.trim());
    setStage("difference");
  };

  const chooseDirection = (optionId: string) => {
    const nextDirection = isSample ? direction : buildCustomDirectionSelection(direction, optionId);
    setSelectedOptionId(optionId);
    setSelectedDirection(nextDirection);
    setSelectedMoveId("");
    setProductionPack(null);
    persistProject(direction, { selectedOptionId: optionId, selectedDirection: nextDirection, selectedMoveId: "", productionPack: null });
  };

  const chooseMove = (action: NoonAction) => {
    const moveId = action.id ?? action.title.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const samplePack = isSample && selectedOptionId ? sampleExecutionByOption[selectedOptionId]?.packs[moveId] : undefined;
    const pack = samplePack ?? buildCustomProductionPack(brandName, action, workingDirection);
    setSelectedMoveId(moveId);
    setProductionPack(pack);
    persistProject(direction, { selectedOptionId, selectedDirection: workingDirection, selectedMoveId: moveId, productionPack: pack });
    setStage("production");
  };

  const updateMaterial = (key: string, content: string) => {
    if (!productionPack) return;
    const updated = { ...productionPack, materials: productionPack.materials.map(material => material.key === key ? { ...material, content } : material) };
    setProductionPack(updated);
    persistProject(direction, { selectedOptionId, selectedMoveId, productionPack: updated });
  };

  const beginInterview = () => {
    if (!idea.trim() || !brandName.trim() || !founderDifference.trim()) return;
    setTurns([]);
    setAnswer("");
    setReflection(/[çğıöşü]/i.test(`${idea} ${founderDifference}`) ? "Ürün şeklini aldım. Özelliği hemen kampanyaya çevirmeyeceğim." : "I have the product shape. I’m not going to turn the feature into a campaign yet.");
    setQuestion(/[çğıöşü]/i.test(`${idea} ${founderDifference}`) ? "Bu fark önemli olduğunda kim o durumda oluyor ve bugün ne yapıyor?" : "When the difference you believe in matters, who is in that situation, and what are they doing today?");
    setWhy("The current behaviour matters more than the feature label.");
    setHypotheses([]);
    setStage("interview");
  };

  const submitAnswer = async (overrideAnswer?: string) => {
    const cleanAnswer = (overrideAnswer ?? answer).trim();
    if (!cleanAnswer || isLoading) return;
    const nextTurns = [...turns, { question, answer: cleanAnswer }];
    setTurns(nextTurns);
    setAnswer("");
    setIsLoading(true);

    try {
      const result = await nextQuestionMutation.mutateAsync({ brandName, idea, founderDifference, turns: nextTurns });
      if (result.readiness === "research" || nextTurns.length >= 6) {
        const directionResult = await directionMutation.mutateAsync({ brandName, idea, founderDifference, turns: nextTurns });
        const nextDirection = directionResult as Direction;
        setDirection(nextDirection);
        persistProject(nextDirection);
        setStage("research");
        return;
      }
      setReflection(result.reflection);
      setQuestion(result.question);
      setWhy(result.why);
      setHypotheses(result.hypotheses ?? []);
    } finally {
      setIsLoading(false);
    }
  };

  const reset = () => {
    setStage("idea");
    setBrandName("");
    setIdea("");
    setFounderDifference("");
    setAnswer("");
    setTurns([]);
    setSelectedOptionId("");
    setSelectedMoveId("");
    setSelectedDirection(null);
    setProductionPack(null);
    setHypotheses([]);
    setIsSample(false);
    setReflection("I have the product shape. I’m not going to turn the feature into a campaign yet.");
    setQuestion("When the difference you believe in matters, who is in that situation, and what are they doing today?");
    try { window.localStorage.removeItem("noonProject"); } catch { /* no-op */ }
  };

  return (
    <AppShell stage={stage} brandName={brandName}>
      {stage === "idea" && (
        <section className="idea-layout">
          <div className="idea-copy"><div className="eyebrow"><span className="eyebrow-mark">00</span> Idea understanding</div><div className="brand-manifesto"><span>NOISE</span><i>→</i><span>SIGNAL</span><i>→</i><span>DIRECTION</span><i>→</i><b>CLARITY</b></div><h1>What are you<br /><em>building?</em></h1><p className="lead">Start with the idea. You don’t need a marketing plan yet.</p></div>
          <div className="entry-panel idea-entry-panel"><div className="panel-header"><span className="mono-label">00 / IDEA UNDERSTANDING</span><span className="panel-status"><span /> one answer</span></div><label htmlFor="idea">What are you building?</label><Textarea id="idea" value={idea} onChange={event => setIdea(event.target.value)} placeholder="Describe the product, idea, or problem you are solving..." className="idea-textarea" autoFocus /><div className="entry-actions"><Button onClick={() => continueFromIdea()} disabled={!idea.trim()} className="noon-button primary-button">Start with the idea <ArrowRight size={16} /></Button><button className="sample-link" onClick={runLumaDemo}><Sparkles size={14} /> Run the Luma demo <ChevronRight size={15} /></button></div><div className="entry-footnote"><Sparkles size={13} /> Luma loads a complete sample interview, source-linked scan, and direction choices.</div></div>
        </section>
      )}

      {stage === "brand" && (
        <section className="brand-entry-layout">
          <div className="brand-entry-copy"><div className="eyebrow"><span className="eyebrow-mark">01</span> Brand context</div><div className="context-chip"><span className="mono-label">IDEA CAPTURED</span><strong>{idea.slice(0, 54)}{idea.length > 54 ? "…" : ""}</strong></div><h1>What do you<br /><em>call it?</em></h1><p className="lead">The name stays attached to every question, scan, and decision.</p></div>
          <div className="entry-panel brand-entry-panel"><div className="panel-header"><span className="mono-label">01 / BRAND CONTEXT</span><span className="panel-status"><span /> one answer</span></div><label htmlFor="brand">What do you call the brand or project?</label><input id="brand" value={brandName} onChange={event => setBrandName(event.target.value)} onKeyDown={event => { if (event.key === "Enter") continueFromBrand(); }} placeholder="e.g. Luma" className="brand-input" autoFocus /><div className="entry-actions"><Button onClick={continueFromBrand} disabled={!brandName.trim()} className="noon-button primary-button">Keep the context <ArrowRight size={16} /></Button><button className="quiet-action" onClick={() => setStage("idea")}><ArrowLeft size={14} /> Edit the idea</button></div><div className="entry-footnote"><LockKeyhole size={13} /> This is context, not a marketing brief.</div></div>
        </section>
      )}

      {stage === "difference" && (
        <section className="idea-layout">
          <div className="idea-copy"><div className="eyebrow"><span className="eyebrow-mark">02</span> Founder’s view</div><div className="context-chip"><span className="mono-label">WORKING ON</span><strong>{brandName}</strong></div><h1>Why is it<br /><em>different?</em></h1><p className="lead">Say it in your own words. n00n will examine the claim instead of accepting it as strategy.</p></div>
          <div className="entry-panel idea-entry-panel"><div className="panel-header"><span className="mono-label">02 / FOUNDER VIEW</span><span className="panel-status"><span /> one answer</span></div><label htmlFor="difference">What do you believe is different about it?</label><Textarea id="difference" value={founderDifference} onChange={event => setFounderDifference(event.target.value)} placeholder="Describe the difference as you see it. What does it do, feel, or make possible?" className="idea-textarea" autoFocus /><div className="entry-actions"><Button onClick={beginInterview} disabled={!founderDifference.trim()} className="noon-button primary-button">Open the interview <ArrowRight size={16} /></Button><button className="quiet-action" onClick={() => setStage("brand")}><ArrowLeft size={14} /> Edit the brand</button></div><div className="entry-footnote"><Target size={13} /> The next question will test when this difference actually matters.</div></div>
        </section>
      )}

      {stage === "interview" && (
        <section className="interview-layout">
          <div className="interview-main">
            <div className="eyebrow"><span className="eyebrow-mark">03</span> Adaptive interview</div>
            <div className="interview-context"><span className="mono-label">{brandName}</span><p>{idea}</p></div>
            <div className="reflection-block"><span className="reflection-marker">n00n</span><p>{reflection}</p></div>
            <div className="question-block"><div className="question-kicker"><span className="mono-label">ONE QUESTION / {String(turns.length + 1).padStart(2, "0")}</span><span className="question-count">{brandName}</span></div><h1>{question}</h1><div className="answer-wrap"><Textarea value={answer} onChange={event => setAnswer(event.target.value)} onKeyDown={event => { if ((event.metaKey || event.ctrlKey) && event.key === "Enter") void submitAnswer(); }} placeholder="Write your answer here..." className="answer-textarea" autoFocus /><div className="answer-bottom"><span className="answer-hint">⌘ + Enter to continue</span><Button onClick={() => void submitAnswer()} disabled={!answer.trim() || isLoading} className="noon-button primary-button">{isLoading ? "Listening..." : "Continue"} <ArrowRight size={16} /></Button></div></div>{isSample && turns.length < sampleAnswers.length && <button className="sample-answer" onClick={() => void submitAnswer(currentPrompt)} disabled={isLoading}><Sparkles size={14} /> {isLoading ? "Listening..." : "Use sample + continue"}</button>}</div>
          </div>
          <aside className="interview-aside"><div className="aside-block"><span className="mono-label">WHY THIS QUESTION</span><p>{why}</p></div>{hypotheses.length > 0 && <div className="aside-block hypothesis-ledger"><span className="mono-label">WORKING HYPOTHESES</span><p>n00n is separating these explanations before it recommends a direction.</p>{hypotheses.map((hypothesis, index) => <div className="hypothesis-item" key={hypothesis}><span>0{index + 1}</span><strong>{hypothesis}</strong></div>)}</div>}<div className="aside-block transcript-block"><span className="mono-label">THREAD / {brandName}</span>{turns.length === 0 ? <p className="muted">Your answers stay attached to the brand as the direction takes shape.</p> : turns.map((turn, index) => <div className="thread-item" key={`${turn.question}-${index}`}><span>0{index + 1}</span><p>{turn.answer}</p></div>)}</div><button className="quiet-action" onClick={reset}><ArrowLeft size={14} /> Start over</button></aside>
        </section>
      )}

      {stage === "research" && (
        <section className="research-layout">
            <div className="research-heading"><div><div className="eyebrow"><span className="eyebrow-mark">04</span> Similarity scan / research plan</div><div className="context-chip"><span className="mono-label">PROJECT</span><strong>{brandName}</strong></div><h1>Before we choose<br /><em>a direction.</em></h1></div><p>n00n is not filling in missing facts. It is separating what is known, what the category already says, and what still needs proof.<br /><span className="research-capture-note">Decision-critical context captured; open assumptions remain visible.</span></p></div>
          <div className="research-grid"><div className="research-plan-card"><div className="panel-header"><span className="mono-label">WHAT I’M CHECKING</span><span className="research-live"><span /> {direction.category.sources.length ? "source set read" : "scan pending"}</span></div><div className="research-step is-done"><span className="research-number"><Check size={13} /></span><div><strong>What {brandName} claims</strong><p>Feature, value, and the belief behind the product.</p></div></div><div className={`research-step ${direction.category.sources.length ? "is-done" : "is-next"}`}><span className="research-number">{direction.category.sources.length ? <Check size={13} /> : "02"}</span><div><strong>What the category already claims</strong><p>Comparable product language and repeated promises.</p></div></div><div className="research-step is-next"><span className="research-number">03</span><div><strong>What decision should change</strong><p>The behaviour that would make this product matter.</p></div></div><div className="research-rule"><FlaskConical size={15} /><span>Research is material for a choice. It is not the choice.</span></div></div><div className="evidence-column"><div className="column-label"><span className="mono-label">EVIDENCE / FIRST PASS</span><span className="muted">{direction.category.sources.length ? "3 signals" : "2 signals + open scan"}</span></div>{(direction.category.sources.length ? sampleEvidence : [{ label: "Founder claim", title: "What exists today", text: idea, status: "known" }, { label: "Open scan", title: "Category comparison is pending", text: "n00n will not present competitor language until a focused source scan is connected.", status: "unresolved" }, { label: "Behaviour gap", title: "The decision still needs proof", text: direction.behaviouralInsight, status: "unresolved" }]).map((item, index) => <EvidenceCard item={item} key={`${item.title}-${index}`} />)}</div></div>
          <div className="category-analysis"><div className="section-heading"><div><span className="mono-label">CATEGORY ANALYSIS</span><h2>{direction.category.category}</h2></div><span className="muted">{direction.category.sources.length ? "3 comparable pages" : "not scanned yet"}</span></div><div className="category-read"><div><span className="mono-label">REPEATED CLAIM</span><p>{direction.category.repeatedClaim}</p></div><div><span className="mono-label">STRATEGIC OPENING</span><p>{direction.category.strategicOpening}</p></div></div>{direction.category.sources.length > 0 && <div className="source-cards">{direction.category.sources.map(source => <SourceCard source={source} key={source.name} />)}</div>}</div>
          <div className="research-continue"><Button onClick={() => setStage("direction")} className="noon-button primary-button">Build the direction <ArrowRight size={16} /></Button><span>This is a checkpoint, not a report.</span></div>
        </section>
      )}

      {stage === "direction" && (
        <section className="direction-layout">
          <div className="direction-heading"><div><div className="eyebrow"><span className="eyebrow-mark">n00n</span> Working direction</div><div className="context-chip"><span className="mono-label">DIRECTION FOR</span><strong>{brandName || direction.brandName}</strong></div><h1>Less noise.<br /><em>Choose the meaning.</em></h1></div><p>n00n can recommend a direction, but only your choice unlocks the selected move and its materials.</p></div>
          <div className="direction-options-section"><div className="section-heading"><div><span className="mono-label">OPTIONS / USER CHOICE</span><h2>Two ways to make this matter.</h2></div><span className="muted">choose one direction</span></div><div className="direction-option-grid">{options.map(option => <article className={`direction-option-card ${selectedOptionId === option.id ? "is-selected" : ""}`} key={option.id}><div className="option-top"><span className="option-number">0{options.indexOf(option) + 1}</span>{option.recommended && <Badge className="option-badge">n00n recommendation</Badge>}</div><h3>{option.title}</h3><p className="option-situation">{option.audienceSituation}</p><div className="option-detail"><div><span className="mono-label">TENSION</span><p>{option.tension}</p></div><div><span className="mono-label">MEANING</span><p>{option.strategicMeaning}</p></div></div><div className="option-tradeoffs"><span><strong>Tradeoff</strong> {option.tradeoffs.join(" · ")}</span><span><strong>Review</strong> {option.reviewCondition}</span></div><Button onClick={() => chooseDirection(option.id)} className={`noon-button ${selectedOptionId === option.id ? "secondary-button" : "primary-button"}`}>{selectedOptionId === option.id ? "Direction selected" : "Choose this direction"} <ArrowRight size={15} /></Button></article>)}</div>{!selectedOptionId && <div className="selection-note"><Target size={15} /> Nothing moves into production until you choose a direction.</div>}</div>
          {selectedOptionId && <>
          <div className="direction-highlight"><span className="mono-label">THE SELECTED STRATEGIC CHOICE</span><h2>{workingDirection.direction}</h2></div>
          <div className="direction-signal-grid"><div className="signal-panel"><span className="mono-label">BEHAVIOUR LENS</span><h3>What has to change</h3><p>{workingDirection.behaviour}</p><div className="signal-note"><Target size={14} /><span>{workingDirection.behaviouralInsight}</span></div></div><div className="signal-panel"><span className="mono-label">CATEGORY READ</span><h3>{direction.category.category}</h3><p>{direction.category.strategicOpening}</p><div className="signal-note"><Search size={14} /><span>{direction.category.sources.length ? `${direction.category.sources.length} comparable product pages attached` : "Comparable pages are still pending"}</span></div></div><div className="signal-panel not-yet-panel"><span className="mono-label">NOT YET</span><h3>Protect the direction</h3><p>{workingDirection.notYet}</p></div></div>
          <div className="plan-section"><div className="section-heading"><div><span className="mono-label">WORKING PLAN</span><h2>From direction to evidence.</h2></div><span className="muted">3 checkpoints</span></div><div className="plan-grid">{workingDirection.plan.map(step => <PlanStep step={step} key={`${step.phase}-${step.title}`} />)}</div></div>
          <div className="actions-section"><div className="section-heading"><div><span className="mono-label">MOVE SELECTION</span><h2>Choose the first move to produce.</h2></div><span className="muted">selection unlocks materials</span></div><div className="action-list">{workingDirection.actions.map((action, index) => <ActionRow action={action} index={index} onSelect={chooseMove} isSelected={selectedMoveId === (action.id ?? "")} key={`${action.label}-${action.title}`} />)}</div></div>
          <div className="direction-footer"><div className="measure-note"><span className="mono-label">HOW WE’LL KNOW</span><p>{workingDirection.measure}</p></div>{productionPack ? <Link href="/desk" className="noon-button primary-button small-button">Open the daily desk <ArrowRight size={15} /></Link> : <span className="direction-next-note">Choose a move above to open its production pack.</span>}</div>
          <div className="direction-bottom"><button className="quiet-action" onClick={() => setStage("research")}><ArrowLeft size={14} /> Back to the evidence</button><button className="quiet-action" onClick={reset}>Start another project <ArrowRight size={14} /></button></div>
          </>}
        </section>
      )}

      {stage === "production" && productionPack && (
        <section className="production-layout">
          <div className="production-heading"><div><div className="eyebrow"><span className="eyebrow-mark">05</span> Production studio</div><div className="context-chip"><span className="mono-label">SELECTED MOVE</span><strong>{productionPack.title}</strong></div><h1>Make the move<br /><em>usable.</em></h1></div><p>This pack follows the selected direction. It is a draft workspace, not a published campaign or scheduled event.</p></div>
          <div className="production-summary"><div><span className="mono-label">PURPOSE</span><h2>{productionPack.purpose}</h2></div><div><span className="mono-label">FORMAT</span><strong>{productionPack.format}</strong><span className="production-status"><span /> materials generated</span></div></div>
          <div className="material-grid">{productionPack.materials.map(material => <article className={`material-card ${material.status}`} key={material.key}><div className="material-top"><span className="mono-label">{material.format}</span><Badge className={`material-status ${material.status}`}>{material.status === "ready" ? `${material.mode} / ready` : "needs input"}</Badge></div><h3>{material.title}</h3><Textarea value={material.content} onChange={event => updateMaterial(material.key, event.target.value)} className="material-editor" aria-label={`Edit ${material.title}`} />{material.downloadUrl && <a href={material.downloadUrl} download className="material-download">Download visual <ArrowRight size={14} /></a>}</article>)}</div>
          <div className="production-review"><div><span className="mono-label">MEASUREMENT</span><p>{productionPack.measurement}</p></div><div><span className="mono-label">EXTERNAL ACTIONS</span><p>{productionPack.externalActionsRequired.join(" · ")}</p></div></div>
          <div className="production-footer"><button className="quiet-action" onClick={() => setStage("direction")}><ArrowLeft size={14} /> Back to move choice</button><Link href="/desk" className="noon-button primary-button">Open the Daily Desk <ArrowRight size={16} /></Link></div>
        </section>
      )}
    </AppShell>
  );
}

import { useState } from "react";
import { Link } from "wouter";
import { ArrowLeft, ArrowRight, BarChart3, CalendarClock, Check, CircleDot, ExternalLink, Search, Target, RotateCcw } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { sampleDirection, sampleExecutionByOption, type NoonAction, type NoonProductionPack } from "@/lib/noon-demo";

type Direction = typeof sampleDirection;

type StoredProject = {
  brandName: string;
  idea: string;
  direction: Direction;
  isSample: boolean;
  selectedOptionId?: string;
  selectedMoveId?: string;
  productionPack?: NoonProductionPack | null;
  selectedDirection?: Direction | null;
  review?: { result: string; decision: "continue" | "adjust_move" | "reconsider_direction" | null };
};

function readProject(): StoredProject | null {
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

function SideNav() {
  return (
    <aside className="noon-sidebar">
      <div><Wordmark /><div className="sidebar-kicker">NOISE / SIGNAL / DIRECTION</div></div>
      <nav className="sidebar-nav" aria-label="Main navigation"><Link href="/" className="sidebar-link"><CircleDot size={14} /> Direction work</Link><Link href="/desk" className="sidebar-link is-active"><CalendarClock size={14} /> Daily desk</Link></nav>
      <div className="sidebar-bottom"><div className="sidebar-signal"><span /> Research loop ready</div><div className="sidebar-meta">n00n / private prototype<br />from direction to evidence</div></div>
    </aside>
  );
}

function ActionCard({ action, index, onReview }: { action: NoonAction; index: number; onReview: (action: NoonAction) => void }) {
  return <article className={`desk-action-card ${action.status}`}><div className="desk-action-top"><span className="action-index">0{index + 1}</span><span className="mono-label">{action.label}</span><Badge className={`action-status ${action.status}`}>{action.status}</Badge></div><h3>{action.title}</h3><p>{action.detail}</p><div className="desk-action-meta"><span>{action.when}</span><strong>{action.measure}</strong></div><button className="card-action" onClick={() => onReview(action)}>Review this move <ArrowRight size={15} /></button></article>;
}

export default function Desk() {
  const project = readProject();
  const [reviewAction, setReviewAction] = useState<NoonAction | null>(null);
  const [reviewResult, setReviewResult] = useState(project?.review?.result ?? "");
  const [reviewStance, setReviewStance] = useState<"continue" | "adjust_move" | "reconsider_direction" | null>(project?.review?.decision ?? null);

  if (!project) {
    return <div className="noon-app-shell desk-page"><SideNav /><main className="noon-main"><header className="noon-topbar"><div className="mobile-wordmark"><Wordmark /></div><div className="topbar-project"><span className="mono-label">DAILY DESK</span><span>no direction yet</span></div><div className="topbar-actions"><Link href="/" className="topbar-desk-link"><ArrowLeft size={14} /> Start with a brand</Link></div></header><div className="noon-content empty-desk"><div className="eyebrow"><span className="eyebrow-mark">00</span> No working direction</div><h1>The desk opens<br /><em>after the choice.</em></h1><p>n00n does not generate a generic daily plan before it knows the brand, the product, the behaviour, and the evidence still missing.</p><Link href="/" className="noon-button primary-button empty-desk-button">Start with the brand <ArrowRight size={15} /></Link></div></main></div>;
  }

  const { brandName, direction: baseDirection, productionPack, selectedOptionId, selectedDirection, isSample } = project;
  const selectedExecution = isSample && selectedOptionId ? sampleExecutionByOption[selectedOptionId] : undefined;
  const direction = selectedExecution ? { ...baseDirection, ...selectedExecution.direction, plan: selectedExecution.plan, actions: selectedExecution.actions } : (selectedDirection ?? baseDirection);
  const persistReview = (result: string, decision: "continue" | "adjust_move" | "reconsider_direction" | null) => {
    try { window.localStorage.setItem("noonProject", JSON.stringify({ ...project, review: { result, decision } })); } catch { /* The desk remains usable without persistence. */ }
  };
  const chooseReviewDecision = (decision: "continue" | "adjust_move" | "reconsider_direction") => {
    setReviewStance(decision);
    persistReview(reviewResult, decision);
  };

  return (
    <div className="noon-app-shell desk-page">
      <SideNav />
      <main className="noon-main">
        <header className="noon-topbar"><div className="mobile-wordmark"><Wordmark /></div><div className="topbar-project"><span className="mono-label">DAILY DESK</span><span>{brandName}</span></div><div className="topbar-actions"><Link href="/?stage=direction" className="topbar-desk-link"><ArrowLeft size={14} /> Back to direction</Link></div></header>
        <div className="noon-content desk-content">
          <section className="desk-heading"><div><div className="eyebrow"><span className="eyebrow-mark">10</span> Daily n00n desk</div><div className="context-chip"><span className="mono-label">WORKING ON</span><strong>{brandName}</strong></div><h1>Keep the direction<br /><em>in motion.</em></h1><p>Not a feed of tasks. A small working loop around the decision, the move, and what the market teaches next.</p></div><div className="desk-date"><span className="mono-label">NEXT REVIEW</span><strong>{direction.plan[2]?.title ?? "Review the move"}</strong><span>{direction.actions[0]?.when ?? "After the first move"}</span></div></section>
          {productionPack && <section className="desk-production-banner"><div><span className="mono-label">SELECTED MOVE / MATERIALS</span><h2>{productionPack.title}</h2><p>{productionPack.purpose}</p></div><div className="desk-material-status">{productionPack.materials.map(material => <span key={material.key} className={material.status}><Check size={12} /> {material.title}</span>)}</div><Link href="/?stage=production" className="quiet-action">Open production pack <ArrowRight size={14} /></Link></section>}
          <section className="desk-overview"><article className="desk-overview-card open-question-card"><div className="desk-card-top"><span className="mono-label">OPEN QUESTION</span><Badge className="open-badge">needs evidence</Badge></div><h2>{direction.behaviour}</h2><p>The desk keeps this question open until the first move gives you a reason to keep, change, or stop the direction.</p><Link href="/?stage=direction" className="card-action">Revisit the direction <ArrowRight size={15} /></Link></article><article className="desk-overview-card direction-mini-card"><div className="desk-card-top"><span className="mono-label">CURRENT DIRECTION</span><span className="status-dot"><span /> in motion</span></div><div className="direction-mini-mark">n00n</div><h2>{direction.direction}</h2><div className="mini-footer"><span><Target size={14} /> behaviour-led</span><span>1 direction</span></div></article><article className="desk-overview-card research-mini-card"><div className="desk-card-top"><span className="mono-label">RESEARCH STATE</span><Search size={15} /></div><h2>{direction.category.category}</h2><div className="research-check-list"><div><Check size={14} /> Brand and idea understood</div><div>{direction.category.sources.length ? <><Check size={14} /> Comparable language attached</> : <><span className="pending-dot" /> Comparable scan still open</>}</div><div><span className="pending-dot" /> Behaviour proof still open</div></div><div className="mini-footer"><span>{direction.category.sources.length} sources</span><span>next review: evidence</span></div></article></section>
          <section className="desk-plan-section"><div className="section-heading"><div><span className="mono-label">WORKING PLAN</span><h2>Three moves, then a decision.</h2></div><span className="muted">{direction.actions.length} actions</span></div><div className="desk-action-grid">{direction.actions.map((action, index) => <ActionCard action={action} index={index} onReview={setReviewAction} key={`${action.label}-${action.title}`} />)}</div></section>
          {reviewAction && <section className="desk-review-panel review-workspace"><div><span className="mono-label">RESULT REVIEW / {reviewAction.label}</span><h2>{reviewAction.title}</h2><p>Record what happened in the participant’s own words, then decide what should change. n00n will keep the result as evidence; it will not treat it as automatic proof.</p></div><div className="review-measure"><span className="mono-label">MEASURE</span><strong>{reviewAction.measure}</strong><span>{reviewAction.when}</span></div><textarea className="review-result-input" value={reviewResult} onChange={event => { setReviewResult(event.target.value); persistReview(event.target.value, reviewStance); }} placeholder="What happened? Include the result, the participant language, and what stayed uncertain." /><div className="review-choices"><span className="mono-label">YOUR DECISION</span><div>{(["continue", "adjust_move", "reconsider_direction"] as const).map(stance => <button key={stance} className={reviewStance === stance ? "is-selected" : ""} onClick={() => chooseReviewDecision(stance)}>{stance === "continue" ? "Continue the move" : stance === "adjust_move" ? "Adjust the move" : "Reconsider direction"}</button>)}</div>{reviewStance && <p><RotateCcw size={14} /> <strong>{reviewStance === "continue" ? "Continue" : reviewStance === "adjust_move" ? "Adjust the move" : "Reconsider direction"}</strong> is saved. The next direction remains a founder choice, not an automatic AI change.</p>}</div><button className="quiet-action" onClick={() => setReviewAction(null)}>Close review <ArrowRight size={14} /></button></section>}
          {productionPack && <section className="review-decision-section"><div className="section-heading"><div><span className="mono-label">REVIEW DISCIPLINE</span><h2>What a real result would change.</h2></div>{isSample && <Badge className="sample-badge">sample fixture, not live data</Badge>}</div><div className="review-result-grid"><article><span className="mono-label">INTENDED SIGNAL</span><strong>{productionPack.measurement}</strong><p>The field above is where real observed results belong. Sample data never substitutes for this input.</p></article><article><span className="mono-label">INTERPRET WITH CARE</span><strong>One result is not a strategy proof.</strong><p>Compare what happened against the selected behaviour, then retain alternative explanations that the result cannot rule out.</p></article><article><span className="mono-label">NEXT DECISION</span><strong>{reviewStance ? (reviewStance === "continue" ? "Continue the selected move" : reviewStance === "adjust_move" ? "Adjust the selected move" : "Reconsider the selected direction") : "Record a result, then choose"}</strong><p>{reviewResult ? "A result has been saved to this project’s review loop." : "No outcome has been entered yet."}</p></article></div></section>}
          <section className="signals-section"><div className="section-heading"><div><span className="mono-label">SIGNALS TO NOTICE</span><h2>Only change direction when the evidence changes.</h2></div><span className="muted">attached to {brandName}</span></div><div className="signals-row"><div className="signal-card"><span className="signal-index">01</span><div><strong>Behaviour</strong><p>{direction.behaviouralInsight}</p></div><span className="signal-state">watch</span></div><div className="signal-card"><span className="signal-index">02</span><div><strong>Category</strong><p>{direction.category.repeatedClaim}</p></div><span className="signal-state">read</span></div><div className="signal-card"><span className="signal-index">03</span><div><strong>Decision</strong><p>{direction.measure}</p></div><span className="signal-state lime">measure</span></div></div></section>
          <div className="desk-footer-note"><span><ExternalLink size={14} /> Evidence stays attached to the move.</span><Link href="/?stage=direction" className="quiet-action">Return to direction <ArrowRight size={14} /></Link></div>
        </div>
      </main>
    </div>
  );
}

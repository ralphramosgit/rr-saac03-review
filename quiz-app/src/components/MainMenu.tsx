import type { Topic } from "../types";
import { allQuestions } from "../types";
import { TOPICS } from "../data";
import { getWrong, clearWrong } from "../utils";
import { useState } from "react";

type Props = {
  onPick: (t: Topic) => void;
  onOpenNotes: () => void;
  onOpenDomains: () => void;
};

const weightColor: Record<Topic["weight"], string> = {
  Critical: "bg-red-500/20 text-red-200 border-red-400/30",
  High: "bg-amber-500/20 text-amber-200 border-amber-400/30",
  Medium: "bg-sky-500/20 text-sky-200 border-sky-400/30",
  Low: "bg-slate-500/20 text-slate-200 border-slate-400/30",
  Foundation: "bg-emerald-500/20 text-emerald-200 border-emerald-400/30",
  Important: "bg-amber-500/20 text-amber-200 border-amber-400/30",
  Useful: "bg-sky-500/20 text-sky-200 border-sky-400/30",
};

export default function MainMenu({
  onPick,
  onOpenNotes,
  onOpenDomains,
}: Props) {
  const [, force] = useState(0);
  const wrongMap = getWrong();
  const totalFlagged = Object.values(wrongMap).reduce(
    (s, a) => s + a.length,
    0,
  );

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <button
          onClick={onOpenNotes}
          className="card p-5 w-full text-left active:scale-[0.995] hover:bg-ink-700/60 transition ring-2 ring-brand-500/40 bg-gradient-to-br from-brand-500/10 to-transparent"
        >
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <div className="text-xs uppercase tracking-wider text-brand-500 font-semibold">
                📚 Study Notes
              </div>
              <div className="text-lg sm:text-xl font-bold mt-1">
                Open All Module Notes
              </div>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                Full README, Ultra-Fast-Learn, Fast-Learn, Diagrams & Practice
                Questions for every SAA-C03 module — organized and searchable.
              </p>
            </div>
            <div className="text-2xl text-brand-500 shrink-0">›</div>
          </div>
        </button>

        <button
          onClick={onOpenDomains}
          className="card p-5 w-full text-left active:scale-[0.995] hover:bg-ink-700/60 transition ring-2 ring-fuchsia-400/40 bg-gradient-to-br from-fuchsia-500/15 via-amber-500/5 to-transparent"
        >
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <div className="text-xs uppercase tracking-wider text-fuchsia-300 font-semibold">
                🎯 Domain Notes
              </div>
              <div className="text-lg sm:text-xl font-bold mt-1">
                4 Exam Domains · Consolidated
              </div>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                Secure · Resilient · High-Performing · Cost-Optimized. Each with
                In-Depth, Concise, Exam Prep, and Comparisons & Scenarios.
              </p>
            </div>
            <div className="text-2xl text-fuchsia-300 shrink-0">›</div>
          </div>
        </button>
      </div>

      <div className="card p-5">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs uppercase tracking-wider text-brand-500 font-semibold">
              AWS SAA-C03
            </div>
            <h1 className="text-2xl font-bold">Quiz & Drill</h1>
          </div>
          <div className="text-right">
            <div className="text-xs text-slate-400">Flagged</div>
            <div
              className={`text-xl font-bold ${totalFlagged ? "text-red-300" : "text-emerald-300"}`}
            >
              {totalFlagged}
            </div>
          </div>
        </div>
        <p className="text-sm text-slate-400 mt-2">
          Pick a topic. Choose a mode. Get immediate feedback. Wrong answers are
          remembered for a focused
          <span className="text-brand-500 font-semibold"> Review</span> session.
        </p>
        {totalFlagged > 0 && (
          <button
            className="text-xs text-slate-400 hover:text-white mt-3 underline"
            onClick={() => {
              if (
                confirm("Clear ALL flagged wrong answers across every topic?")
              ) {
                clearWrong();
                force((n) => n + 1);
              }
            }}
          >
            Reset all progress
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        {TOPICS.map((t) => {
          const flagged = (wrongMap[t.id] || []).length;
          const isCritical =
            t.id === "00-critical" || t.id === "00-master-core";
          const isMasterCore = t.id === "00-master-core";
          return (
            <button
              key={t.id}
              onClick={() => onPick(t)}
              className={`card p-4 text-left active:scale-[0.99] hover:bg-ink-700/60 transition h-full flex flex-col ${
                isCritical ? "ring-2 ring-brand-500/50 bg-brand-500/5" : ""
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs text-slate-400 tabular-nums">
                      #{t.number}
                    </span>
                    <span
                      className={`text-[10px] border px-1.5 py-0.5 rounded-full uppercase tracking-wider ${weightColor[t.weight]}`}
                    >
                      {t.weight}
                    </span>
                  </div>
                  <div className="font-semibold mt-1 leading-snug">
                    {isMasterCore ? "★ " : isCritical ? "🎯 " : ""}
                    {t.title}
                  </div>
                </div>
                {flagged > 0 && (
                  <div className="text-xs text-red-300 shrink-0">
                    ⚑ {flagged}
                  </div>
                )}
              </div>
              <div className="text-xs text-slate-400 mt-2 line-clamp-3 flex-1">
                {t.blurb}
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-500 mt-3 pt-2 border-t border-white/5">
                <span>{allQuestions(t).length} questions</span>
                <span>{t.sections.length} tables</span>
              </div>
            </button>
          );
        })}
      </div>

      <p className="text-center text-xs text-slate-500 pt-2 pb-4">
        Built for SAA-C03 retention ·{" "}
        {TOPICS.reduce((s, t) => s + allQuestions(t).length, 0)} questions
      </p>
    </div>
  );
}

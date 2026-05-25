import type { Topic } from "../types";
import { allQuestions } from "../types";
import { TOPICS } from "../data";
import { getWrong, clearWrong } from "../utils";
import { useState } from "react";

type Props = {
  onPick: (t: Topic) => void;
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

export default function MainMenu({ onPick }: Props) {
  const [, force] = useState(0);
  const wrongMap = getWrong();
  const totalFlagged = Object.values(wrongMap).reduce(
    (s, a) => s + a.length,
    0,
  );

  return (
    <div className="space-y-4">
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

      <div className="grid gap-2.5">
        {TOPICS.map((t) => {
          const flagged = (wrongMap[t.id] || []).length;
          return (
            <button
              key={t.id}
              onClick={() => onPick(t)}
              className="card p-4 text-left active:scale-[0.99] hover:bg-ink-700/60 transition"
            >
              <div className="flex items-start justify-between gap-3">
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
                  <div className="font-semibold mt-0.5 truncate">{t.title}</div>
                  <div className="text-xs text-slate-400 mt-0.5 line-clamp-2">
                    {t.blurb}
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-xs text-slate-400">
                    {allQuestions(t).length} q
                  </div>
                  <div className="text-[10px] text-slate-500">
                    {t.sections.length} tables
                  </div>
                  {flagged > 0 && (
                    <div className="text-xs text-red-300 mt-0.5">
                      ⚑ {flagged}
                    </div>
                  )}
                </div>
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

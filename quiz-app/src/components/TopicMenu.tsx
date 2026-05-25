import { useMemo, useState } from "react";
import type { Mode, Topic, Question, TableSection } from "../types";
import { allQuestions } from "../types";
import SessionRunner from "./SessionRunner";
import { getWrong, clearWrong } from "../utils";

type Props = {
  topic: Topic;
  onBack: () => void;
};

type Selection =
  | { kind: "mode"; mode: Mode }
  | { kind: "section"; section: TableSection };

const MODE_LABEL: Record<Mode, string> = {
  mixed: "Mixed (all questions, random)",
  mcq: "Multiple choice only",
  match: "Matching only (drag & drop)",
  flash: "Flashcards only",
  review: "Review wrong answers",
};

const MODE_DESC: Record<Mode, string> = {
  mixed: "Every question from every table, shuffled. General drill.",
  mcq: "Multiple choice + true/false from every table.",
  match: "Drag-and-drop matching for every table.",
  flash: "Flashcards for active recall.",
  review: "Only questions you previously got wrong.",
};

export default function TopicMenu({ topic, onBack }: Props) {
  const [selection, setSelection] = useState<Selection | null>(null);
  const wrongIds = useMemo(
    () => getWrong()[topic.id] || [],
    [topic.id, selection],
  );
  const allQs = useMemo(() => allQuestions(topic), [topic]);

  const filteredByMode = (m: Mode): Question[] => {
    switch (m) {
      case "mcq":
        return allQs.filter((q) => q.type === "mcq" || q.type === "tf");
      case "match":
        return allQs.filter((q) => q.type === "match");
      case "flash":
        return allQs.filter((q) => q.type === "flash");
      case "review":
        return allQs.filter((q) => wrongIds.includes(q.id));
      default:
        return allQs;
    }
  };

  if (selection) {
    const pool =
      selection.kind === "mode"
        ? filteredByMode(selection.mode)
        : selection.section.questions;
    const mode: Mode = selection.kind === "mode" ? selection.mode : "mixed";
    return (
      <SessionRunner
        key={
          selection.kind === "mode"
            ? "m-" + selection.mode + "-" + Date.now()
            : "s-" + selection.section.id + "-" + Date.now()
        }
        topic={topic}
        mode={mode}
        pool={pool}
        sectionTitle={
          selection.kind === "section" ? selection.section.title : undefined
        }
        onExit={() => setSelection(null)}
      />
    );
  }

  const wrongCount = wrongIds.length;

  return (
    <div className="space-y-4">
      <div className="card p-5">
        <button
          className="text-sm text-slate-300 hover:text-white mb-3"
          onClick={onBack}
        >
          ← All topics
        </button>
        <div className="flex items-baseline gap-2">
          <span className="text-xs text-slate-400">#{topic.number}</span>
          <span className="chip">{topic.weight}</span>
        </div>
        <h1 className="text-2xl font-bold mt-1">{topic.title}</h1>
        <p className="text-slate-400 mt-2">{topic.blurb}</p>
        <div className="mt-3 text-sm text-slate-300">
          {allQs.length} questions · {topic.sections.length} tables ·{" "}
          <span className={wrongCount ? "text-red-300" : "text-emerald-300"}>
            {wrongCount} flagged
          </span>
        </div>
        {wrongCount > 0 && (
          <button
            className="text-xs text-slate-400 hover:text-white mt-2 underline"
            onClick={() => {
              if (confirm("Clear all flagged wrong answers for this topic?")) {
                clearWrong(topic.id);
                setSelection(null);
              }
            }}
          >
            Clear flagged
          </button>
        )}
      </div>

      {/* TABLE DRILLS — one per note table, separate from random mode */}
      <div>
        <div className="px-2 mb-2 flex items-baseline justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-brand-500">
            Table drills
          </h2>
          <span className="text-xs text-slate-500">
            test every row in each table
          </span>
        </div>
        <div className="grid gap-2.5">
          {topic.sections.map((s) => {
            const flagged = s.questions.filter((q) =>
              wrongIds.includes(q.id),
            ).length;
            return (
              <button
                key={s.id}
                className="card p-4 text-left active:scale-[0.99] hover:bg-ink-700/60 transition"
                onClick={() => setSelection({ kind: "section", section: s })}
              >
                <div className="flex justify-between items-center gap-3">
                  <div className="min-w-0">
                    <div className="font-semibold truncate">{s.title}</div>
                    <div className="text-xs text-slate-400 mt-0.5">
                      {s.questions.length} questions in this table
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="chip">{s.questions.length} q</div>
                    {flagged > 0 && (
                      <div className="text-xs text-red-300 mt-1">
                        ⚑ {flagged}
                      </div>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* GENERAL MODES — random, by type, review */}
      <div>
        <div className="px-2 mb-2 mt-2">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400">
            General modes
          </h2>
        </div>
        <div className="grid gap-2.5">
          {(["mixed", "mcq", "match", "flash", "review"] as Mode[]).map((m) => {
            const count = filteredByMode(m).length;
            const disabled = count === 0;
            return (
              <button
                key={m}
                disabled={disabled}
                className={`card p-4 text-left active:scale-[0.99] transition ${
                  disabled ? "opacity-40" : "hover:bg-ink-700/60"
                }`}
                onClick={() =>
                  !disabled && setSelection({ kind: "mode", mode: m })
                }
              >
                <div className="flex justify-between items-center">
                  <div className="font-semibold">{MODE_LABEL[m]}</div>
                  <div className="chip">{count} q</div>
                </div>
                <div className="text-sm text-slate-400 mt-1">
                  {MODE_DESC[m]}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

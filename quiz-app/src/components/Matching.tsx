import type { Matching as M } from "../types";
import { useEffect, useMemo, useState } from "react";
import { shuffle } from "../utils";

type Props = {
  q: M;
  onAnswer: (correct: boolean) => void;
  onNext: () => void;
};

export default function Matching({ q, onAnswer, onNext }: Props) {
  const lefts = useMemo(() => q.pairs.map((p) => p.left), [q.id]);
  const rights = useMemo(() => q.pairs.map((p) => p.right), [q.id]);
  // Stable shuffled order for the option list shown on the side / dropdowns.
  const optionOrder = useMemo(() => shuffle(rights), [q.id]);

  const [assigned, setAssigned] = useState<Record<string, string>>({});
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    setAssigned({});
    setChecked(false);
  }, [q.id]);

  const allFilled = lefts.every((l) => assigned[l]);
  const correctCount = q.pairs.filter(
    (p) => assigned[p.left] === p.right,
  ).length;
  const allCorrect = correctCount === q.pairs.length;

  const onPick = (left: string, value: string) => {
    if (checked) return;
    setAssigned((prev) => ({ ...prev, [left]: value }));
  };

  return (
    <div className="card p-5 sm:p-6">
      <div className="chip mb-3">Matching · pick from dropdown</div>
      <h2 className="text-lg sm:text-xl font-semibold leading-snug mb-2">
        {q.prompt}
      </h2>
      <p className="text-xs text-slate-400 mb-4">
        For each item on the left, choose its match from the dropdown. All
        possible answers are listed on the side for reference.
      </p>

      <div className="grid lg:grid-cols-[1fr_260px] gap-4">
        {/* MAIN: left items + dropdowns */}
        <div className="space-y-2.5">
          {lefts.map((l) => {
            const val = assigned[l];
            const correctPair = q.pairs.find((p) => p.left === l)!.right;
            const status: "correct" | "wrong" | "idle" = !checked
              ? "idle"
              : val === correctPair
                ? "correct"
                : "wrong";
            const ring =
              status === "correct"
                ? "border-emerald-400 bg-emerald-500/10"
                : status === "wrong"
                  ? "border-red-400 bg-red-500/10"
                  : "border-white/10 bg-ink-900/40";

            return (
              <div
                key={l}
                className={`rounded-xl px-3 py-2.5 border transition ${ring}`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <span className="font-medium text-sm sm:text-base">{l}</span>
                  <select
                    disabled={checked}
                    value={val ?? ""}
                    onChange={(e) => onPick(l, e.target.value)}
                    className="w-full sm:w-72 rounded-lg bg-ink-900/80 border border-white/10 px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-brand-500 disabled:opacity-80"
                  >
                    <option value="" disabled>
                      — select match —
                    </option>
                    {optionOrder.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                </div>
                {checked && status === "wrong" && (
                  <div className="text-xs text-emerald-300 mt-1">
                    Correct: {correctPair}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* SIDE: all options list */}
        <aside className="rounded-xl border border-white/10 bg-white/5 p-3 h-fit">
          <div className="text-xs uppercase tracking-wider text-slate-400 mb-2 font-semibold">
            All options
          </div>
          <ul className="space-y-1.5">
            {optionOrder.map((r) => {
              const used = Object.values(assigned).includes(r);
              return (
                <li
                  key={r}
                  className={`text-xs leading-snug px-2 py-1.5 rounded-md border ${
                    used
                      ? "border-brand-500/40 bg-brand-500/10 text-slate-200"
                      : "border-white/10 bg-ink-900/40 text-slate-300"
                  }`}
                >
                  {r}
                </li>
              );
            })}
          </ul>
        </aside>
      </div>

      {!checked && (
        <button
          disabled={!allFilled}
          className={`btn-primary w-full mt-4 ${!allFilled ? "opacity-40" : ""}`}
          onClick={() => {
            setChecked(true);
            onAnswer(allCorrect);
          }}
        >
          Check answers
        </button>
      )}

      {checked && (
        <div className="mt-4 rounded-xl border border-white/10 bg-white/5 p-3 text-sm">
          <div className="font-semibold mb-1">
            {allCorrect
              ? "✅ All correct!"
              : `❌ ${correctCount} / ${q.pairs.length} correct`}
          </div>
          {!allCorrect && (
            <ul className="text-slate-300 list-disc pl-5 space-y-0.5">
              {q.pairs.map((p) => (
                <li key={p.left}>
                  <span className="font-medium">{p.left}</span> →{" "}
                  <span className="text-emerald-300">{p.right}</span>
                </li>
              ))}
            </ul>
          )}
          {q.explanation && (
            <p className="text-slate-400 mt-2">{q.explanation}</p>
          )}
          <button className="btn-primary mt-3 w-full" onClick={onNext}>
            Next →
          </button>
        </div>
      )}
    </div>
  );
}

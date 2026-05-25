import type { TrueFalse as TF } from "../types";
import { useEffect, useState } from "react";

type Props = {
  q: TF;
  onAnswer: (correct: boolean) => void;
  onNext: () => void;
};

export default function TrueFalse({ q, onAnswer, onNext }: Props) {
  const [picked, setPicked] = useState<boolean | null>(null);
  useEffect(() => setPicked(null), [q.id]);
  const reveal = picked !== null;

  const optClass = (val: boolean) => {
    if (!reveal) return "option text-center text-lg font-bold";
    if (val === q.answer)
      return "option text-center text-lg font-bold option-correct";
    if (val === picked)
      return "option text-center text-lg font-bold option-wrong";
    return "option text-center text-lg font-bold option-faded";
  };

  return (
    <div className="card p-5 sm:p-6">
      <div className="chip mb-3">True / False</div>
      <h2 className="text-lg sm:text-xl font-semibold leading-snug mb-4">
        {q.prompt}
      </h2>
      <div className="grid grid-cols-2 gap-3">
        <button
          className={optClass(true)}
          disabled={reveal}
          onClick={() => {
            setPicked(true);
            onAnswer(true === q.answer);
          }}
        >
          TRUE
        </button>
        <button
          className={optClass(false)}
          disabled={reveal}
          onClick={() => {
            setPicked(false);
            onAnswer(false === q.answer);
          }}
        >
          FALSE
        </button>
      </div>
      {reveal && (
        <div className="mt-4 rounded-xl border border-white/10 bg-white/5 p-3 text-sm">
          <div className="font-semibold mb-1">
            {picked === q.answer ? "✅ Correct" : "❌ Incorrect"}
          </div>
          <p className="text-slate-300 whitespace-pre-line">{q.explanation}</p>
          <button className="btn-primary mt-3 w-full" onClick={onNext}>
            Next →
          </button>
        </div>
      )}
    </div>
  );
}

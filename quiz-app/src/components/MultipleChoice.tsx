import type { MCQ } from "../types";
import { useEffect, useState } from "react";

type Props = {
  q: MCQ;
  onAnswer: (correct: boolean) => void;
  onNext: () => void;
};

export default function MultipleChoice({ q, onAnswer, onNext }: Props) {
  const [picked, setPicked] = useState<number | null>(null);

  useEffect(() => {
    setPicked(null);
  }, [q.id]);

  const reveal = picked !== null;

  return (
    <div className="card p-5 sm:p-6">
      <div className="chip mb-3">Multiple Choice</div>
      <h2 className="text-lg sm:text-xl font-semibold leading-snug mb-4">
        {q.prompt}
      </h2>
      <div className="space-y-2.5">
        {q.options.map((opt, i) => {
          const isCorrect = i === q.answer;
          const isPicked = i === picked;
          const cls = !reveal
            ? "option"
            : isCorrect
              ? "option option-correct"
              : isPicked
                ? "option option-wrong"
                : "option option-faded";
          return (
            <button
              key={i}
              className={cls}
              disabled={reveal}
              onClick={() => {
                setPicked(i);
                onAnswer(i === q.answer);
              }}
            >
              <span className="inline-block w-6 font-bold text-slate-400 mr-2">
                {String.fromCharCode(65 + i)}.
              </span>
              {opt}
            </button>
          );
        })}
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

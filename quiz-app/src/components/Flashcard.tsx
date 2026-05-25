import type { Flashcard as FC } from "../types";
import { useEffect, useState } from "react";

type Props = {
  q: FC;
  onAnswer: (correct: boolean) => void;
  onNext: () => void;
};

export default function Flashcard({ q, onAnswer, onNext }: Props) {
  const [flipped, setFlipped] = useState(false);
  const [rated, setRated] = useState(false);

  useEffect(() => {
    setFlipped(false);
    setRated(false);
  }, [q.id]);

  return (
    <div className="card p-5 sm:p-6">
      <div className="chip mb-3">Flashcard</div>
      <div
        className="min-h-[180px] sm:min-h-[220px] rounded-xl border border-white/10 bg-ink-900/60 p-5 flex items-center justify-center text-center cursor-pointer select-none"
        onClick={() => setFlipped((f) => !f)}
      >
        <div>
          <div className="text-xs uppercase tracking-wider text-slate-400 mb-2">
            {flipped ? "Answer" : "Question"}
          </div>
          <div className="text-base sm:text-lg whitespace-pre-line">
            {flipped ? q.back : q.front}
          </div>
          {!flipped && (
            <div className="mt-4 text-xs text-slate-400">
              Tap card to reveal
            </div>
          )}
        </div>
      </div>

      {flipped && !rated && (
        <div className="mt-4 grid grid-cols-2 gap-3">
          <button
            className="btn-danger"
            onClick={() => {
              setRated(true);
              onAnswer(false);
            }}
          >
            😣 Forgot
          </button>
          <button
            className="btn-primary"
            onClick={() => {
              setRated(true);
              onAnswer(true);
            }}
          >
            ✅ Got it
          </button>
        </div>
      )}

      {rated && (
        <button className="btn-primary w-full mt-4" onClick={onNext}>
          Next →
        </button>
      )}
    </div>
  );
}

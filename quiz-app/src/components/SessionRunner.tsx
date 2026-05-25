import type { Question, Topic, Mode } from "../types";
import { useMemo, useState } from "react";
import MultipleChoice from "./MultipleChoice";
import TrueFalse from "./TrueFalse";
import Flashcard from "./Flashcard";
import Matching from "./Matching";
import { shuffle, addWrong, removeWrong } from "../utils";

type Props = {
  topic: Topic;
  mode: Mode;
  pool: Question[]; // pre-filtered subset
  sectionTitle?: string;
  onExit: () => void;
};

export default function SessionRunner({
  topic,
  mode,
  pool,
  sectionTitle,
  onExit,
}: Props) {
  // SHUFFLE on session start (each new session = new order). Reset by remounting.
  // Topics flagged noShuffle (e.g. Critical Cram) keep authored order.
  const [questions] = useState<Question[]>(() =>
    topic.noShuffle ? [...pool] : shuffle(pool),
  );
  const [index, setIndex] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [wrong, setWrong] = useState(0);
  const [done, setDone] = useState(false);
  const [exitConfirm, setExitConfirm] = useState(false);

  const total = questions.length;
  const q = questions[index];

  const handleAnswer = (isCorrect: boolean) => {
    if (isCorrect) {
      setCorrect((c) => c + 1);
      // remove from wrong list (mastered)
      if (q) removeWrong(topic.id, q.id);
    } else {
      setWrong((w) => w + 1);
      if (q) addWrong(topic.id, q.id);
    }
  };

  const handleNext = () => {
    if (index + 1 >= total) setDone(true);
    else setIndex(index + 1);
  };

  if (total === 0) {
    return (
      <div className="card p-6 text-center">
        <div className="text-lg font-semibold mb-2">
          No questions in this mode 🎉
        </div>
        <p className="text-slate-400 mb-4">
          {mode === "review"
            ? "You've mastered all the wrong answers in this topic. Try Mixed mode!"
            : "No questions of that type for this topic."}
        </p>
        <button className="btn-primary w-full" onClick={onExit}>
          Back to topic
        </button>
      </div>
    );
  }

  if (done) {
    const pct = Math.round((correct / total) * 100);
    return (
      <div className="card p-6 text-center">
        <div className="chip mb-3">Session complete</div>
        <div className="text-4xl font-extrabold mb-1">{pct}%</div>
        <div className="text-slate-400 mb-5">
          {correct} correct · {wrong} wrong · {total} total
        </div>
        <div className="grid grid-cols-2 gap-3">
          <button className="btn-ghost" onClick={onExit}>
            Topic menu
          </button>
          <button className="btn-primary" onClick={() => location.reload()}>
            Restart app
          </button>
        </div>
        {wrong > 0 && (
          <p className="text-xs text-slate-500 mt-4">
            Wrong answers saved. Use{" "}
            <span className="text-brand-500 font-semibold">Review wrong</span>{" "}
            to drill them.
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <div className="flex items-center justify-between gap-3 mb-2">
          <button
            className="text-sm text-slate-300 hover:text-white"
            onClick={() => setExitConfirm(true)}
          >
            ← Exit
          </button>
          <div className="text-xs text-slate-400 truncate max-w-[50%]">
            {sectionTitle
              ? `${topic.title} · ${sectionTitle}`
              : `${topic.title} · ${mode.toUpperCase()}`}
          </div>
          <div className="text-xs text-slate-400 tabular-nums">
            {index + 1} / {total}
          </div>
        </div>
        <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
          <div
            className="h-full bg-brand-500 transition-all"
            style={{ width: `${(index / total) * 100}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-slate-400 mt-2 tabular-nums">
          <span>✅ {correct}</span>
          <span>❌ {wrong}</span>
        </div>
      </div>

      {q.type === "mcq" && (
        <MultipleChoice q={q} onAnswer={handleAnswer} onNext={handleNext} />
      )}
      {q.type === "tf" && (
        <TrueFalse q={q} onAnswer={handleAnswer} onNext={handleNext} />
      )}
      {q.type === "flash" && (
        <Flashcard q={q} onAnswer={handleAnswer} onNext={handleNext} />
      )}
      {q.type === "match" && (
        <Matching q={q} onAnswer={handleAnswer} onNext={handleNext} />
      )}

      {exitConfirm && (
        <div
          className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
          onClick={() => setExitConfirm(false)}
        >
          <div
            className="card p-5 w-full max-w-sm"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="font-semibold mb-2">Exit session?</div>
            <p className="text-sm text-slate-400 mb-4">
              Your progress in this session will be lost. Wrong answers you
              already submitted are saved.
            </p>
            <div className="grid grid-cols-2 gap-3">
              <button
                className="btn-ghost"
                onClick={() => setExitConfirm(false)}
              >
                Stay
              </button>
              <button className="btn-danger" onClick={onExit}>
                Exit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

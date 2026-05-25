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
  // Track answer status per question index: true=correct, false=wrong, undefined=unanswered.
  // Lets us jump freely between questions without double-counting.
  const [answers, setAnswers] = useState<Record<number, boolean>>({});
  const [done, setDone] = useState(false);
  const [exitConfirm, setExitConfirm] = useState(false);

  const total = questions.length;
  const q = questions[index];

  const correct = Object.values(answers).filter((v) => v === true).length;
  const wrong = Object.values(answers).filter((v) => v === false).length;
  const answered = correct + wrong;

  const handleAnswer = (isCorrect: boolean) => {
    setAnswers((prev) => ({ ...prev, [index]: isCorrect }));
    if (!q) return;
    if (isCorrect) removeWrong(topic.id, q.id);
    else addWrong(topic.id, q.id);
  };

  const handleNext = () => {
    if (index + 1 >= total) {
      // Only mark done if everything is answered, otherwise jump to the first unanswered.
      const firstUnanswered = questions.findIndex(
        (_, i) => answers[i] === undefined,
      );
      if (firstUnanswered === -1) setDone(true);
      else setIndex(firstUnanswered);
    } else {
      setIndex(index + 1);
    }
  };

  const handlePrev = () => {
    if (index > 0) setIndex(index - 1);
  };

  const jumpTo = (i: number) => {
    if (i >= 0 && i < total) setIndex(i);
  };

  const finishNow = () => setDone(true);

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
            style={{ width: `${(answered / total) * 100}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-slate-400 mt-2 tabular-nums">
          <span>✅ {correct}</span>
          <span>
            {answered} / {total} answered
          </span>
          <span>❌ {wrong}</span>
        </div>

        {/* Question navigator — click any number to jump */}
        <div className="mt-3 pt-3 border-t border-white/5">
          <div className="flex items-center justify-between mb-2">
            <div className="text-[11px] uppercase tracking-wider text-slate-500">
              Questions
            </div>
            <div className="flex gap-2">
              <button
                className="text-[11px] px-2 py-1 rounded-md bg-white/5 hover:bg-white/10 disabled:opacity-40"
                disabled={index === 0}
                onClick={handlePrev}
              >
                ← Prev
              </button>
              <button
                className="text-[11px] px-2 py-1 rounded-md bg-white/5 hover:bg-white/10 disabled:opacity-40"
                disabled={index >= total - 1}
                onClick={() => jumpTo(index + 1)}
              >
                Next →
              </button>
              <button
                className="text-[11px] px-2 py-1 rounded-md bg-brand-500/20 text-brand-200 hover:bg-brand-500/30"
                onClick={finishNow}
                title="End session and see your score"
              >
                Finish
              </button>
            </div>
          </div>
          <div className="grid grid-cols-8 sm:grid-cols-10 md:grid-cols-12 lg:grid-cols-14 gap-1.5">
            {questions.map((qq, i) => {
              const status = answers[i];
              const isCurrent = i === index;
              const base =
                "text-[11px] tabular-nums rounded-md border h-7 flex items-center justify-center transition";
              const color =
                status === true
                  ? "bg-emerald-500/20 border-emerald-400/40 text-emerald-100"
                  : status === false
                    ? "bg-red-500/20 border-red-400/40 text-red-100"
                    : "bg-white/5 border-white/10 text-slate-300 hover:bg-white/10";
              const current = isCurrent
                ? " ring-2 ring-brand-400 ring-offset-1 ring-offset-ink-900"
                : "";
              return (
                <button
                  key={qq.id}
                  className={`${base} ${color}${current}`}
                  onClick={() => jumpTo(i)}
                  title={`Q${i + 1}${
                    status === true
                      ? " — correct"
                      : status === false
                        ? " — wrong"
                        : " — unanswered"
                  }`}
                >
                  {i + 1}
                </button>
              );
            })}
          </div>
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

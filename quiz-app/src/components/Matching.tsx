import type { Matching as M } from "../types";
import { useEffect, useMemo, useState } from "react";
import { shuffle } from "../utils";
import {
  DndContext,
  type DragEndEvent,
  type DragStartEvent,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  useDraggable,
  useDroppable,
  DragOverlay,
} from "@dnd-kit/core";

type Props = {
  q: M;
  onAnswer: (correct: boolean) => void;
  onNext: () => void;
};

const POOL_ID = "__pool__";

function DraggableChip({ id, label }: { id: string; label: string }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id,
  });
  return (
    <button
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={`rounded-xl px-3 py-2 text-sm border touch-none select-none cursor-grab active:cursor-grabbing transition ${
        isDragging
          ? "border-brand-500 bg-brand-500/20 text-brand-500 opacity-40"
          : "border-white/10 bg-white/5 hover:bg-white/10"
      }`}
    >
      {label}
    </button>
  );
}

function DropSlot({
  id,
  filled,
  status,
  onClear,
  children,
}: {
  id: string;
  filled: boolean;
  status: "correct" | "wrong" | "idle";
  onClear?: () => void;
  children: React.ReactNode;
}) {
  const { isOver, setNodeRef } = useDroppable({ id });
  const ring =
    status === "correct"
      ? "border-emerald-400 bg-emerald-500/15"
      : status === "wrong"
        ? "border-red-400 bg-red-500/15"
        : isOver
          ? "border-brand-500 bg-brand-500/10"
          : "border-white/10 bg-ink-900/40";
  return (
    <div
      ref={setNodeRef}
      onClick={filled && onClear ? onClear : undefined}
      className={`w-full text-left rounded-xl px-4 py-3 border transition ${ring} ${
        filled ? "cursor-pointer" : ""
      }`}
    >
      {children}
    </div>
  );
}

function PoolArea({ children }: { children: React.ReactNode }) {
  const { isOver, setNodeRef } = useDroppable({ id: POOL_ID });
  return (
    <div
      ref={setNodeRef}
      className={`flex flex-wrap gap-2 min-h-[3rem] rounded-xl p-2 border-2 border-dashed transition ${
        isOver ? "border-brand-500 bg-brand-500/5" : "border-white/10"
      }`}
    >
      {children}
    </div>
  );
}

export default function Matching({ q, onAnswer, onNext }: Props) {
  const lefts = useMemo(() => q.pairs.map((p) => p.left), [q.id]);
  const rightsCorrect = useMemo(() => q.pairs.map((p) => p.right), [q.id]);
  const [pool, setPool] = useState<string[]>([]);
  const [assigned, setAssigned] = useState<Record<string, string | null>>({});
  const [checked, setChecked] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    setPool(shuffle(rightsCorrect));
    setAssigned(Object.fromEntries(lefts.map((l) => [l, null])));
    setChecked(false);
    setActiveId(null);
  }, [q.id]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 120, tolerance: 8 },
    }),
  );

  const allFilled = Object.values(assigned).every((v) => v !== null);
  const correctCount = q.pairs.filter(
    (p) => assigned[p.left] === p.right,
  ).length;
  const allCorrect = correctCount === q.pairs.length;

  const handleDragStart = (e: DragStartEvent) =>
    setActiveId(String(e.active.id));

  const handleDragEnd = (e: DragEndEvent) => {
    setActiveId(null);
    if (checked) return;
    const item = String(e.active.id);
    const target = e.over ? String(e.over.id) : null;
    if (!target) return;

    let fromLeft: string | null = null;
    for (const l of lefts) if (assigned[l] === item) fromLeft = l;

    const next = { ...assigned };

    if (target === POOL_ID) {
      if (fromLeft) {
        next[fromLeft] = null;
        setAssigned(next);
        setPool((p) => (p.includes(item) ? p : [...p, item]));
      }
      return;
    }

    if (!lefts.includes(target)) return;
    const displaced = next[target];
    next[target] = item;
    if (fromLeft) {
      next[fromLeft] = displaced; // swap between slots
      setAssigned(next);
    } else {
      // came from pool
      setPool((p) => {
        const rest = p.filter((x) => x !== item);
        return displaced ? [...rest, displaced] : rest;
      });
      setAssigned(next);
    }
  };

  const clearSlot = (l: string) => {
    if (checked) return;
    const val = assigned[l];
    if (!val) return;
    setAssigned({ ...assigned, [l]: null });
    setPool((p) => [...p, val]);
  };

  return (
    <div className="card p-5 sm:p-6">
      <div className="chip mb-3">Matching · drag &amp; drop</div>
      <h2 className="text-lg sm:text-xl font-semibold leading-snug mb-2">
        {q.prompt}
      </h2>
      <p className="text-xs text-slate-400 mb-4">
        Drag an item from the pool onto its matching row. Tap a filled row to
        clear it.
      </p>

      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="space-y-2.5 mb-4">
          {lefts.map((l) => {
            const val = assigned[l];
            const correctPair = q.pairs.find((p) => p.left === l)!.right;
            const status: "correct" | "wrong" | "idle" = !checked
              ? "idle"
              : val === correctPair
                ? "correct"
                : "wrong";
            return (
              <DropSlot
                key={l}
                id={l}
                filled={!!val}
                status={status}
                onClear={() => clearSlot(l)}
              >
                <div className="flex justify-between items-center gap-3">
                  <span className="font-medium">{l}</span>
                  <span
                    className={`text-sm ${val ? "text-emerald-300" : "text-slate-500"}`}
                  >
                    {val ?? "— drop here —"}
                  </span>
                </div>
              </DropSlot>
            );
          })}
        </div>

        {!checked && (
          <>
            <div className="text-xs uppercase tracking-wider text-slate-400 mb-2">
              Items (drag from here)
            </div>
            <PoolArea>
              {pool.length === 0 ? (
                <div className="text-sm text-slate-500">All assigned.</div>
              ) : (
                pool.map((r) => <DraggableChip key={r} id={r} label={r} />)
              )}
            </PoolArea>

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
          </>
        )}

        <DragOverlay>
          {activeId ? (
            <div className="rounded-xl px-3 py-2 text-sm border border-brand-500 bg-brand-500/30 text-brand-500 shadow-xl">
              {activeId}
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

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

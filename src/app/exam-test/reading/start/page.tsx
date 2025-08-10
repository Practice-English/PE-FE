"use client";
import AppHeader from "@/components/common/app-header";
import { useExamStore } from "@/stores/examStore";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

function formatTime(sec: number) {
  const m = String(Math.floor(sec / 60)).padStart(2, "0");
  const s = String(sec % 60).padStart(2, "0");
  return `${m}:${s}`;
}

export default function ReadingStart() {
  const router = useRouter();
  const {
    exam,
    timeRemainingSec,
    loadReadingExam,
    startTimer,
    setAnswer,
    currentIndex,
    setIndex,
    next,
    prev,
    bookmarks,
    toggleBookmark,
    seen,
    markSeen,
    answers,
  } = useExamStore();
  const question = useMemo(
    () => exam?.questions?.[currentIndex],
    [exam, currentIndex]
  );
  const [showReview, setShowReview] = useState(false);

  useEffect(() => {
    if (!exam) void loadReadingExam();
  }, [exam, loadReadingExam]);

  useEffect(() => {
    if (exam) startTimer();
  }, [exam, startTimer]);

  useEffect(() => {
    if (question?.id) markSeen(question.id);
  }, [question?.id, markSeen]);

  if (!exam || !question) {
    return (
      <div className="min-h-screen">
        <AppHeader />
        <div className="mx-auto max-w-4xl p-6">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary/40">
      <AppHeader />
      <main className="mx-auto max-w-6xl px-4 py-8">
        <div className="mb-4 flex items-center justify-between gap-3">
          <QuestionDrawer
            questions={exam.questions}
            currentIndex={currentIndex}
            seen={seen}
            bookmarks={bookmarks}
            attempted={answers}
            onJump={(i) => setIndex(i)}
          />
          <Timer
            totalMin={exam.timeAllowedMinutes}
            remainingSec={timeRemainingSec}
          />
        </div>

        <section className="rounded-xl border bg-card text-card-foreground shadow-sm p-6 md:p-8">
          <div className="flex items-start justify-between gap-4">
            <h2 className="text-xl font-semibold">{question.title}</h2>
            <button
              className={`rounded-md border px-3 py-1.5 text-sm ${
                bookmarks[question.id] ? "bg-yellow-100" : ""
              }`}
              onClick={() => toggleBookmark(question.id)}
            >
              {bookmarks[question.id] ? "Bookmarked" : "Bookmark"}
            </button>
          </div>

          <div className="mt-5 text-sm">
            <p className="font-medium mb-3">{question.prompt}</p>

            {question.type === "cloze" && (
              <Cloze
                content={question.content}
                selects={question.selects}
                onChange={(pos, val) => setAnswer(`${question.id}:${pos}`, val)}
              />
            )}

            {question.type === "order" && (
              <Order
                items={question.items}
                slots={question.slots}
                onChange={(payload) => setAnswer(question.id, payload)}
              />
            )}

            {question.type === "multi-select" && (
              <MultiSelect
                sub={question.subQuestions}
                onChange={(i, val) => setAnswer(`${question.id}:${i}`, val)}
              />
            )}

            {question.type === "headings" && (
              <Headings
                paragraphs={question.paragraphs}
                headings={question.headings}
                onChange={(i, val) => setAnswer(`${question.id}:${i}`, val)}
              />
            )}
          </div>
        </section>
      </main>
      <BottomBar
        onPrev={prev}
        onNext={
          currentIndex < (exam?.questions?.length ?? 1) - 1
            ? next
            : () => setShowReview(true)
        }
      />

      {showReview && exam && (
        <ReviewModal
          onClose={() => setShowReview(false)}
          onSubmit={() => router.push("/exam-test/reading/review")}
          questions={exam.questions}
          bookmarks={bookmarks}
          answers={answers}
        />
      )}
    </div>
  );
}

function Cloze({
  content,
  selects,
  onChange,
}: {
  content: string;
  selects: { options: string[] }[];
  onChange: (index: number, value: string) => void;
}) {
  const parts = content.split(/\[\[select:(\d+)\]\]/g);
  const nodes: React.ReactNode[] = [];
  for (let i = 0; i < parts.length; i++) {
    if (i % 2 === 0) {
      nodes.push(<span key={`t-${i}`}>{parts[i]}</span>);
    } else {
      const selectIndex = Number(parts[i]);
      nodes.push(
        <select
          key={`s-${i}`}
          className="mx-2 rounded-md border px-2 py-1"
          onChange={(e) => onChange(selectIndex, e.target.value)}
        >
          <option value="">Select…</option>
          {selects[selectIndex]?.options.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      );
    }
  }
  return <div className="prose max-w-none whitespace-pre-wrap">{nodes}</div>;
}

function Order({
  items,
  slots,
  onChange,
}: {
  items: string[];
  slots: number;
  onChange: (payload: { slot: number; value: string }[]) => void;
}) {
  const [picked, setPicked] = useState<(string | null)[]>(
    Array.from({ length: slots }, () => null)
  );
  const [pool, setPool] = useState(items);
  const [dragOverSlot, setDragOverSlot] = useState<number | null>(null);
  const [isOverPool, setIsOverPool] = useState(false);
  useEffect(() => {
    onChange(picked.map((v, i) => ({ slot: i, value: v ?? "" })));
    // Intentionally exclude onChange from deps to avoid infinite loop
    // when parent recreates the callback every render
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [picked]);

  type DragData = { from: "pool" | "slot"; index: number; value: string };

  function getDragData(e: React.DragEvent) {
    try {
      const raw = e.dataTransfer.getData("text/plain");
      return JSON.parse(raw) as DragData;
    } catch {
      return undefined;
    }
  }

  function onDragStartFromPool(index: number) {
    const value = pool[index];
    return (e: React.DragEvent) => {
      e.dataTransfer.effectAllowed = "move";
      e.dataTransfer.setData(
        "text/plain",
        JSON.stringify({ from: "pool", index, value } as DragData)
      );
    };
  }

  function onDragStartFromSlot(index: number) {
    const value = picked[index];
    if (!value) return () => {};
    return (e: React.DragEvent) => {
      e.dataTransfer.effectAllowed = "move";
      e.dataTransfer.setData(
        "text/plain",
        JSON.stringify({ from: "slot", index, value } as DragData)
      );
    };
  }

  function onDropToSlot(slotIndex: number, e: React.DragEvent) {
    e.preventDefault();
    setDragOverSlot(null);
    const data = getDragData(e);
    if (!data) return;

    if (data.from === "pool") {
      const moved = data.value;
      setPicked((prev) => {
        const next = [...prev];
        const replaced = next[slotIndex];
        next[slotIndex] = moved;
        if (replaced) setPool((p) => [...p, replaced]);
        return next;
      });
      setPool((p) => p.filter((_, i) => i !== data.index));
    } else if (data.from === "slot") {
      const fromIdx = data.index;
      if (fromIdx === slotIndex) return;
      setPicked((prev) => {
        const next = [...prev];
        const tmp = next[slotIndex];
        next[slotIndex] = next[fromIdx];
        next[fromIdx] = tmp ?? null;
        return next;
      });
    }
  }

  function onDropToPool(e: React.DragEvent) {
    e.preventDefault();
    setIsOverPool(false);
    const data = getDragData(e);
    if (!data) return;
    if (data.from === "slot") {
      const fromIdx = data.index;
      const val = picked[fromIdx];
      if (!val) return;
      setPicked((prev) => prev.map((v, i) => (i === fromIdx ? null : v)));
      setPool((p) => [...p, val]);
    }
  }
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="rounded-md border p-4">
        <div className="text-sm font-medium mb-3">
          Drop sentences in correct order:
        </div>
        <div className="space-y-3">
          {picked.map((v, i) => (
            <div
              key={i}
              onDragOver={(e) => {
                e.preventDefault();
                setDragOverSlot(i);
              }}
              onDragLeave={() => setDragOverSlot((s) => (s === i ? null : s))}
              onDrop={(e) => onDropToSlot(i, e)}
              className={`rounded-md border-2 border-dashed p-3 min-h-12 flex items-center ${
                v ? "text-foreground" : "text-muted-foreground"
              } ${dragOverSlot === i ? "border-blue-500 bg-blue-50" : ""}`}
              draggable={!!v}
              onDragStart={onDragStartFromSlot(i)}
            >
              {v ?? `Drop sentence ${i + 1} here`}
            </div>
          ))}
        </div>
      </div>
      <div
        className={`rounded-md border p-4 ${
          isOverPool ? "ring-2 ring-blue-400" : ""
        }`}
        onDragOver={(e) => {
          e.preventDefault();
          setIsOverPool(true);
        }}
        onDragLeave={() => setIsOverPool(false)}
        onDrop={onDropToPool}
      >
        <div className="text-sm font-medium mb-3">
          Drag sentences from here:
        </div>
        <div className="space-y-3">
          {pool.map((it, idx) => (
            <div
              key={it}
              className="w-full rounded-md border bg-white p-3 text-left hover:bg-secondary cursor-move"
              draggable
              onDragStart={onDragStartFromPool(idx)}
              onClick={() => {
                const emptyIdx = picked.findIndex((s) => s === null);
                if (emptyIdx !== -1) {
                  setPicked((arr) =>
                    arr.map((s, j) => (j === emptyIdx ? it : s))
                  );
                  setPool((p) => p.filter((x) => x !== it));
                }
              }}
            >
              {it}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function MultiSelect({
  sub,
  onChange,
}: {
  sub: { label: string; options: string[] }[];
  onChange: (index: number, value: string) => void;
}) {
  return (
    <div className="space-y-4">
      {sub.map((q, i) => (
        <div key={i} className="flex items-center gap-3">
          <div className="min-w-64">{q.label}</div>
          <select
            className="rounded-md border px-2 py-1"
            onChange={(e) => onChange(i, e.target.value)}
            defaultValue=""
          >
            <option value="">Select…</option>
            {q.options.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </select>
        </div>
      ))}
    </div>
  );
}

function Headings({
  paragraphs,
  headings,
  onChange,
}: {
  paragraphs: string[];
  headings: string[];
  onChange: (index: number, value: string) => void;
}) {
  return (
    <div className="space-y-6">
      {paragraphs.map((p, i) => (
        <div key={i} className="space-y-2">
          <select
            className="rounded-md border px-2 py-1"
            onChange={(e) => onChange(i, e.target.value)}
          >
            <option value="">Select header…</option>
            {headings.map((h) => (
              <option key={h} value={h}>
                {h}
              </option>
            ))}
          </select>
          <p className="text-sm leading-6">{p}</p>
        </div>
      ))}
    </div>
  );
}

function QuestionDrawer({
  questions,
  currentIndex,
  bookmarks,
  seen,
  attempted,
  onJump,
}: {
  questions: { id: string }[];
  currentIndex: number;
  bookmarks: Record<string, boolean>;
  seen: Record<string, boolean>;
  attempted: Record<string, unknown>;
  onJump: (index: number) => void;
}) {
  const [open, setOpen] = useState(false);
  const status = (q: { id: string }) => {
    const attemptedKeys = Object.keys(attempted).filter((k) =>
      k.startsWith(q.id)
    );
    if (attemptedKeys.length > 0) return "Attempted";
    if (seen[q.id]) return "Seen";
    return "Not Attempt";
  };
  return (
    <div className="relative">
      <button
        className="rounded-md border px-3 py-2 text-sm"
        onClick={() => setOpen(true)}
      >
        Question List
      </button>
      <div
        className={`fixed inset-0 z-50 ${open ? "" : "pointer-events-none"}`}
      >
        <div
          className={`absolute inset-0 bg-black/50 transition-opacity duration-200 ${
            open ? "opacity-100" : "opacity-0"
          }`}
          onClick={() => setOpen(false)}
        />
        <aside
          className={`absolute left-0 top-0 h-full w-[320px] bg-white shadow-xl border-r p-4 overflow-y-auto transition-transform duration-300 ${
            open ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold">
              Questions: {questions.length}
            </h3>
            <button className="text-sm" onClick={() => setOpen(false)}>
              ✕
            </button>
          </div>
          <div className="mt-4 space-y-2">
            {questions.map((q, i) => (
              <button
                key={q.id}
                onClick={() => {
                  onJump(i);
                  setOpen(false);
                }}
                className={`w-full rounded-md border p-3 text-left text-sm ${
                  i === currentIndex ? "border-blue-500" : ""
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span>{i + 1}</span>
                    <span className="text-muted-foreground">{status(q)}</span>
                  </div>
                  {bookmarks[q.id] && (
                    <span className="text-yellow-600">★</span>
                  )}
                </div>
              </button>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
}

/* Sidebar variant retained for potential future use (currently drawer is default)
function QuestionSidebar({
  questions,
  currentIndex,
  bookmarks,
  seen,
  attempted,
  onJump,
}: {
  questions: { id: string }[];
  currentIndex: number;
  bookmarks: Record<string, boolean>;
  seen: Record<string, boolean>;
  attempted: Record<string, unknown>;
  onJump: (index: number) => void;
}) {
  const status = (q: { id: string }) => {
    const attemptedKeys = Object.keys(attempted).filter((k) =>
      k.startsWith(q.id)
    );
    if (attemptedKeys.length > 0) return "Attempted";
    if (seen[q.id]) return "Seen";
    return "Not Attempt";
  };
  return (
    <div className="sticky top-24">
      <div className="rounded-xl border bg-white p-4 shadow-sm">
        <div className="text-sm font-semibold mb-2">
          Questions: {questions.length}
        </div>
        <div className="space-y-2 max-h-[60vh] overflow-auto pr-1">
          {questions.map((q, i) => (
            <button
              key={q.id}
              onClick={() => onJump(i)}
              className={`w-full rounded-md border p-3 text-left text-sm transition-colors ${
                i === currentIndex
                  ? "border-blue-500 bg-blue-50"
                  : "hover:bg-secondary"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-6 text-right">{i + 1}</span>
                  <span className="text-muted-foreground">{status(q)}</span>
                </div>
                {bookmarks[q.id] && <span className="text-yellow-600">★</span>}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
*/

function Timer({
  totalMin,
  remainingSec,
}: {
  totalMin: number;
  remainingSec: number;
}) {
  const total = totalMin * 60;
  const pct = Math.max(0, Math.min(100, (remainingSec / total) * 100));
  return (
    <div className="w-40 sm:w-48 rounded-xl border bg-white/90 backdrop-blur p-3 text-right shadow-sm">
      <div className="text-lg font-semibold tabular-nums">
        {formatTime(remainingSec)}
      </div>
      <div className="text-[11px] text-muted-foreground">Time remaining</div>
      <div className="mt-2 h-1.5 w-full rounded bg-secondary">
        <div
          className="h-1.5 rounded bg-blue-600"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

function BottomBar({
  onPrev,
  onNext,
}: {
  onPrev: () => void;
  onNext: () => void;
}) {
  return (
    <div className="fixed left-0 right-0 bottom-0 border-t bg-background/80 backdrop-blur p-3">
      <div className="mx-auto max-w-6xl flex items-center justify-between">
        {/* <button className="rounded-full border px-3 py-1 text-xs">
          Click to Translate
        </button> */}
        <div className=""></div>
        <div className="flex items-center gap-3">
          <button
            className="rounded-md border px-4 py-2 text-sm"
            onClick={onPrev}
          >
            Previous
          </button>
          <button
            className="rounded-md bg-blue-600 text-white px-4 py-2 text-sm"
            onClick={onNext}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

function ReviewModal({
  onClose,
  onSubmit,
  questions,
  bookmarks,
  answers,
}: {
  onClose: () => void;
  onSubmit: () => void;
  questions: { id: string }[];
  bookmarks: Record<string, boolean>;
  answers: Record<string, unknown>;
}) {
  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[520px] max-w-full rounded-xl border bg-white p-6 shadow-xl">
        <h3 className="text-lg font-semibold">Question Review</h3>
        <div className="mt-4 max-h-[50vh] overflow-auto divide-y">
          {questions.map((q, i) => {
            const attempted = Object.keys(answers).some((k) =>
              k.startsWith(q.id)
            );
            return (
              <div
                key={q.id}
                className="py-3 text-sm flex items-center justify-between"
              >
                <div className="font-medium">Q{i + 1}</div>
                <div className="text-muted-foreground flex items-center gap-3">
                  {bookmarks[q.id] && (
                    <span className="text-yellow-600">★</span>
                  )}
                  <span>{attempted ? "Attempted" : "Seen"}</span>
                </div>
              </div>
            );
          })}
        </div>
        <div className="mt-6 flex gap-3 justify-end">
          <button
            className="rounded-md border px-4 py-2 text-sm"
            onClick={onClose}
          >
            Review Questions
          </button>
          <button
            className="rounded-md bg-blue-600 text-white px-4 py-2 text-sm"
            onClick={onSubmit}
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}

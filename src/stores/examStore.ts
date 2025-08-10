import { create } from "zustand";

export type ReadingExam = {
  id: string;
  title: string;
  timeAllowedMinutes: number;
  description: string;
  formDescription: string;
  instructions: string[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  questions: any[];
};

type ExamState = {
  exam?: ReadingExam;
  isLoading: boolean;
  error?: string;
  currentStep: "overview" | "instructions" | "test" | "review";
  timeRemainingSec: number;
  answers: Record<string, unknown>;
  currentIndex: number;
  bookmarks: Record<string, boolean>;
  seen: Record<string, boolean>;
  setStep: (step: ExamState["currentStep"]) => void;
  loadReadingExam: () => Promise<void>;
  startTimer: () => void;
  tick: () => void;
  setAnswer: (questionId: string, value: unknown) => void;
  setIndex: (index: number) => void;
  next: () => void;
  prev: () => void;
  toggleBookmark: (questionId: string) => void;
  markSeen: (questionId: string) => void;
  reset: () => void;
};

export const useExamStore = create<ExamState>((set, get) => ({
  isLoading: false,
  currentStep: "overview",
  timeRemainingSec: 0,
  answers: {},
  currentIndex: 0,
  bookmarks: {},
  seen: {},
  setStep: (step) => set({ currentStep: step }),
  async loadReadingExam() {
    set({ isLoading: true, error: undefined });
    try {
      const res = await fetch("/mock/reading.json", { cache: "no-store" });
      const exam = (await res.json()) as ReadingExam;
      set({
        exam,
        isLoading: false,
        timeRemainingSec: exam.timeAllowedMinutes * 60,
        currentStep: "overview",
        currentIndex: 0,
        answers: {},
        bookmarks: {},
        seen: {},
      });
    } catch (e) {
      set({ isLoading: false, error: (e as Error).message });
    }
  },
  startTimer() {
    if (!get().exam) return;
    if (typeof window === "undefined") return;
    const tick = () => get().tick();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    window.clearInterval((window as any).__examTimer);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).__examTimer = window.setInterval(tick, 1000);
  },
  tick() {
    const next = Math.max(0, get().timeRemainingSec - 1);
    set({ timeRemainingSec: next });
  },
  setAnswer(questionId, value) {
    set((s) => ({ answers: { ...s.answers, [questionId]: value } }));
  },
  setIndex(index) {
    const qid = get().exam?.questions?.[index]?.id;
    if (qid) {
      set((s) => ({ currentIndex: index, seen: { ...s.seen, [qid]: true } }));
    } else {
      set({ currentIndex: index });
    }
  },
  next() {
    const { exam, currentIndex } = get();
    if (!exam) return;
    const nextIndex = Math.min(exam.questions.length - 1, currentIndex + 1);
    get().setIndex(nextIndex);
  },
  prev() {
    const prevIndex = Math.max(0, get().currentIndex - 1);
    get().setIndex(prevIndex);
  },
  toggleBookmark(questionId) {
    set((s) => ({ bookmarks: { ...s.bookmarks, [questionId]: !s.bookmarks[questionId] } }));
  },
  markSeen(questionId) {
    set((s) => ({ seen: { ...s.seen, [questionId]: true } }));
  },
  reset() {
    set({ exam: undefined, answers: {}, timeRemainingSec: 0, currentStep: "overview", currentIndex: 0, bookmarks: {}, seen: {} });
  },
}));



"use client";
import AppHeader from "@/components/common/app-header";
import { useExamStore } from "@/stores/examStore";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ReadingOverview() {
  const { exam, isLoading, loadReadingExam, setStep } = useExamStore();
  const router = useRouter();

  useEffect(() => {
    if (!exam) void loadReadingExam();
  }, [exam, loadReadingExam]);

  if (isLoading || !exam) {
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
      <main className="mx-auto max-w-5xl px-4 py-10">
        <h1 className="text-xl font-semibold mb-6">
          Aptis General Practice Test
        </h1>
        <section className="rounded-xl border bg-card text-card-foreground shadow-sm p-6 md:p-8">
          <h2 className="text-lg font-semibold">{exam.title}</h2>
          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 text-sm">
            <div>
              <div className="text-muted-foreground">Number of Questions:</div>
              <div>{exam.questions.length}</div>
              <div className="mt-4 text-muted-foreground">
                Assessment Description:
              </div>
              <div>{exam.description}</div>
              <div className="mt-4 text-muted-foreground">
                Form Description:
              </div>
              <div>{exam.formDescription}</div>
            </div>
            <div>
              <div className="text-muted-foreground">Time Allowed:</div>
              <div>{exam.timeAllowedMinutes} min</div>
            </div>
          </div>
          <div className="mt-8">
            <button
              onClick={() => {
                setStep("instructions");
                router.push("/exam-test/reading/instructions");
              }}
              className="rounded-md bg-blue-600 text-white px-4 py-2 text-sm font-medium hover:bg-blue-700"
            >
              Start Assessment
            </button>
          </div>
        </section>
        <footer className="mx-auto mt-10 text-center text-xs text-muted-foreground">
          ©2025 AptisPrep
        </footer>
      </main>
    </div>
  );
}

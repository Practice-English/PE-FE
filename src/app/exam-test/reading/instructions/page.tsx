"use client";
import AppHeader from "@/components/common/app-header";
import { useExamStore } from "@/stores/examStore";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ReadingInstructions() {
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
      <main className="mx-auto max-w-6xl px-4 py-10">
        <section className="rounded-xl border bg-card text-card-foreground shadow-sm p-6 md:p-8">
          <h2 className="text-xl font-semibold">
            Aptis General Reading Instructions
          </h2>
          <div className="mt-6 space-y-4 text-sm">
            {exam.instructions.map((item, idx) => (
              <p key={idx}>{item}</p>
            ))}
          </div>
        </section>
      </main>
      <div className="sticky bottom-0 border-t bg-background/70 backdrop-blur p-4">
        <div className="mx-auto max-w-6xl flex justify-end">
          <button
            className="rounded-md bg-blue-600 text-white px-4 py-2 text-sm font-medium hover:bg-blue-700"
            onClick={() => {
              setStep("test");
              router.push("/exam-test/reading/start");
            }}
          >
            Start
          </button>
        </div>
      </div>
    </div>
  );
}

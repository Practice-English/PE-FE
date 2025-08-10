"use client";
import AppHeader from "@/components/common/app-header";
import { useExamStore } from "@/stores/examStore";
import Link from "next/link";

export default function ReadingReview() {
  const { answers } = useExamStore();
  const entries = Object.entries(answers);
  return (
    <div className="min-h-screen bg-secondary/40">
      <AppHeader />
      <main className="mx-auto max-w-3xl px-4 py-10">
        <section className="rounded-xl border bg-card text-card-foreground shadow-sm p-6 md:p-8">
          <h2 className="text-lg font-semibold">Question Review</h2>
          <div className="mt-4 text-sm text-muted-foreground">
            Please review the following questions
          </div>
          <div className="mt-6 divide-y">
            {entries.length === 0 && (
              <div className="py-6">No answers yet.</div>
            )}
            {entries.map(([k, v]) => (
              <div
                key={k}
                className="py-3 text-sm flex items-center justify-between"
              >
                <div className="font-medium">{k}</div>
                <div className="text-muted-foreground">
                  {typeof v === "string" ? v : "Answered"}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 flex gap-3">
            <Link
              href="/exam-test/reading/start"
              className="rounded-md border px-4 py-2 text-sm"
            >
              Review Questions
            </Link>
            <button className="rounded-md bg-blue-600 text-white px-4 py-2 text-sm">
              Submit
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}

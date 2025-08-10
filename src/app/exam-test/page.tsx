"use client";

import { BookOpen, Headphones, Mic, Pencil, Sigma } from "lucide-react";
import AppHeader from "@/components/common/app-header";
import Link from "next/link";
import { useEffect } from "react";
import { useExamStore } from "@/stores/examStore";

type Skill = {
  key: string;
  label: string;
  Icon: React.ComponentType<{ className?: string }>;
};

const skills: Skill[] = [
  { key: "reading", label: "Reading", Icon: BookOpen },
  { key: "listening", label: "Listening", Icon: Headphones },
  { key: "grammar", label: "Grammar", Icon: Sigma },
  { key: "writing", label: "Writing", Icon: Pencil },
  { key: "speaking", label: "Speaking", Icon: Mic },
];

const modules = [
  { id: 1, name: "Free Practice 1" },
  { id: 2, name: "Free Practice 2" },
  { id: 3, name: "Free Practice 3" },
];

export default function ExamTestPage() {
  const { loadReadingExam } = useExamStore();

  useEffect(() => {
    // prefetch mock exam on page view
    loadReadingExam();
  }, [loadReadingExam]);
  return (
    <div className="min-h-screen bg-secondary/40">
      <AppHeader />

      <main className="mx-auto max-w-6xl px-4 py-8">
        <section className="rounded-xl border bg-card text-card-foreground shadow-sm">
          <div className="flex items-center justify-between border-b p-5">
            <h1 className="text-lg font-semibold">
              Online Aptis Practice Test
            </h1>
            <span className="text-xs text-muted-foreground">Updated 2025</span>
          </div>

          {/* header row */}
          <div
            className="grid grid-cols-6 gap-2 border-b bg-gradient-to-r from-secondary to-secondary/40 p-4 text-sm font-medium"
            id="skills"
          >
            <div className="pl-1">Practice Modules</div>
            {skills.map(({ key, label, Icon }) => (
              <div key={key} className="flex items-center gap-2 justify-center">
                <Icon className="size-4" />
                <span className="hidden md:inline">{label}</span>
                <span className="md:hidden">{label.slice(0, 1)}</span>
              </div>
            ))}
          </div>

          {/* body rows */}
          <div className="divide-y">
            {modules.map((mod) => (
              <div
                key={mod.id}
                className="grid grid-cols-6 items-center gap-2 p-4"
              >
                <div className="text-sm font-medium pl-1">{mod.name}</div>
                {skills.map(({ key }) => (
                  <div key={key} className="flex justify-center">
                    {key === "reading" ? (
                      <Link
                        href={`/exam-test/reading`}
                        className="inline-flex items-center gap-2 whitespace-nowrap rounded-md bg-blue-600 px-3 py-1.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-700 active:translate-y-[1px]"
                        aria-label={`Start ${key} for ${mod.name}`}
                      >
                        Start
                      </Link>
                    ) : (
                      <button
                        className="inline-flex cursor-not-allowed items-center gap-2 whitespace-nowrap rounded-md bg-gray-300 px-3 py-1.5 text-sm font-medium text-gray-600"
                        disabled
                      >
                        Coming soon
                      </button>
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>

          {/* pagination */}
          <div className="flex items-center justify-end gap-2 border-t p-4">
            <button className="h-8 rounded-md border px-3 text-sm text-muted-foreground hover:bg-secondary">
              Prev
            </button>
            <button className="h-8 rounded-md border bg-foreground text-background px-3 text-sm">
              1
            </button>
            <button className="h-8 rounded-md border px-3 text-sm text-muted-foreground hover:bg-secondary">
              Next
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

import Link from "next/link";

export default function AppHeader() {
  return (
    <header className="sticky top-0 z-10 bg-background/80 backdrop-blur border-b">
      <div className="mx-auto max-w-6xl px-4 py-3 flex items-center gap-6">
        <div className="flex items-center gap-2 font-semibold tracking-tight">
          <div className="size-6 rounded-md bg-foreground/90 text-background grid place-items-center text-[10px]">
            AP
          </div>
          <span>AptisPrep</span>
        </div>
        <nav className="ml-auto hidden sm:flex items-center gap-6 text-sm">
          <Link href="/" className="hover:underline underline-offset-4">
            Home
          </Link>
          <a href="#skills" className="hover:underline underline-offset-4">
            Skills Overview
          </a>
          <button className="rounded-full bg-primary text-primary-foreground px-3 py-1 text-xs">
            User
          </button>
        </nav>
      </div>
    </header>
  );
}

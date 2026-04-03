import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <div className="max-w-lg rounded-[32px] border border-[var(--border)] bg-[var(--surface)] p-10 text-center shadow-[var(--hero-shadow)]">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--text-secondary)]">
          Page not found
        </p>
        <h1 className="mt-3 font-heading text-5xl font-semibold tracking-[-0.06em]">
          This route hasn&apos;t been rebuilt yet.
        </h1>
        <p className="mt-4 text-base leading-7 text-[var(--text-secondary)]">
          The frontend was reset from scratch. Return to the new landing page and continue from one of the rebuilt routes.
        </p>
        <Link href="/" className="mt-8 inline-flex">
          <Button>Back to home</Button>
        </Link>
      </div>
    </main>
  );
}

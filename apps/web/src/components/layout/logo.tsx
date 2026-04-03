import Link from "next/link";

export function Logo() {
  return (
    <Link href="/" className="inline-flex items-center gap-3">
      <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--brand-600)] text-lg font-bold text-white shadow-[0_14px_34px_rgba(30,94,58,0.26)]">
        O
      </span>
      <span className="font-heading text-lg font-semibold tracking-[-0.04em] text-[var(--text-primary)]">
        ODOP Connect
      </span>
    </Link>
  );
}

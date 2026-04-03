import * as React from "react";
import { cn } from "@/lib/utils";

const toneClasses = {
  brand: "bg-[var(--brand-soft)] text-[var(--brand-700)]",
  amber: "bg-[var(--amber-soft)] text-[var(--amber-700)]",
  ink: "bg-[var(--ink-soft)] text-[var(--text-primary)]",
};

export function Badge({
  className,
  tone = "brand",
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & {
  tone?: keyof typeof toneClasses;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em]",
        toneClasses[tone],
        className,
      )}
      {...props}
    />
  );
}

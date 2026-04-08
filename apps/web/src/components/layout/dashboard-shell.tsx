"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/layout/logo";
import { Badge } from "@/components/ui/badge";

type NavItem = {
  label: string;
  href: string;
};

export function DashboardShell({
  role,
  title,
  subtitle,
  navItems,
  children,
}: {
  role: "farmer" | "buyer";
  title: string;
  subtitle: string;
  navItems: NavItem[];
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-[var(--page)] text-[var(--text-primary)]">
      <div className="mx-auto flex min-h-screen max-w-[1440px] flex-col gap-6 px-4 py-4 lg:flex-row lg:px-6">
        <aside className="glass-panel animate-slide-in-left relative w-full overflow-hidden rounded-[32px] border border-[var(--border)] bg-[var(--sidebar)] p-6 lg:w-[280px]">
          <div className="pointer-events-none absolute inset-x-8 top-0 h-24 rounded-b-full bg-[radial-gradient(circle,rgba(31,106,68,0.16),transparent_70%)]" />
          <div className="flex items-center justify-between lg:block">
            <Logo />
            <Badge tone={role === "farmer" ? "brand" : "amber"}>
              {role} mode
            </Badge>
          </div>
          <nav className="mt-8 grid gap-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "sidebar-nav-item relative rounded-2xl px-4 py-3 text-sm font-medium text-[var(--text-secondary)] transition-all duration-250 hover:bg-white hover:text-[var(--brand-primary)]",
                  pathname === item.href 
                    ? "bg-white text-[var(--brand-primary)] shadow-[inset_3px_0_0_var(--brand-primary),0_0_20px_rgba(34,197,94,0.08)]" 
                    : "hover:translate-x-1",
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </aside>

        <main className="glass-panel animate-fade-up relative flex-1 overflow-hidden rounded-[32px] border border-[var(--border)] bg-[var(--surface)] p-6 lg:p-8">
          <div className="pointer-events-none absolute -right-20 top-8 h-40 w-40 rounded-full bg-[radial-gradient(circle,rgba(212,157,54,0.18),transparent_70%)] blur-2xl" />
          <header className="flex flex-col gap-4 border-b border-[var(--border)] pb-6 md:flex-row md:items-end md:justify-between">
            <div className="space-y-2">
              <Badge tone={role === "farmer" ? "brand" : "amber"}>
                {role === "farmer" ? "Producer workspace" : "Procurement workspace"}
              </Badge>
              <h1 className="font-heading text-4xl font-semibold tracking-[-0.05em]">
                {title}
              </h1>
              <p className="max-w-2xl text-sm leading-6 text-[var(--text-secondary)]">
                {subtitle}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="soft-float hidden rounded-[24px] bg-[var(--card-strong)] px-4 py-3 text-sm text-[var(--text-secondary)] md:block">
                Fresh frontend rebuild in progress
              </div>
            </div>
          </header>
          <div className="pt-8">{children}</div>
        </main>
      </div>
    </div>
  );
}

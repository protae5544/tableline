import { Link, useRouterState } from "@tanstack/react-router";
import {
  FileBarChart,
  FolderOpen,
  Globe,
  MessageCircle,
  PenLine,
} from "lucide-react";
import type { ReactNode } from "react";
import { LineTohMark } from "@/components/logo";
import { cn } from "@/lib/utils";
import type { Workspace } from "@/lib/types";

const TABS = [
  { to: "/", label: "แชท", icon: MessageCircle, match: (p: string) => p === "/" },
  {
    to: "/board",
    label: "บอร์ด",
    icon: PenLine,
    match: (p: string) => p.startsWith("/board"),
  },
  {
    to: "/files",
    label: "ลิ้นชัก",
    icon: FolderOpen,
    match: (p: string) => p.startsWith("/files"),
  },
  {
    to: "/reports",
    label: "รายงาน",
    icon: FileBarChart,
    match: (p: string) => p.startsWith("/reports"),
  },
  {
    to: "/web",
    label: "เว็บ",
    icon: Globe,
    match: (p: string) => p.startsWith("/web"),
  },
] as const;

export function AppShell({
  workspace,
  children,
}: {
  workspace: Workspace | null;
  children: ReactNode;
}) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-lg flex-col bg-page md:max-w-3xl lg:max-w-5xl">
      <header
        className="sticky top-0 z-30 flex items-center gap-3 bg-line px-4 text-on-line"
        style={{ paddingTop: "max(0.75rem, env(safe-area-inset-top))" }}
      >
        <LineTohMark className="size-8" inverse />
        <div className="min-w-0 flex-1 py-2.5">
          <p className="truncate text-[15px] font-semibold leading-tight">
            {workspace?.name ?? "ไลน์โต๊ะ"}
          </p>
          <p className="truncate text-[11px] text-on-line/80">
            {workspace?.partner
              ? `คู่หู ${workspace.partner.name}`
              : workspace
                ? "รอคู่หูเข้าห้อง"
                : "ห้องงานสองคน"}
          </p>
        </div>
        {workspace ? (
          <span className="rounded-full bg-on-line/15 px-2.5 py-1 font-mono text-[11px] tracking-wide">
            {workspace.inviteCode}
          </span>
        ) : null}
      </header>

      <main className="relative min-h-0 flex-1 pb-[calc(4.5rem+env(safe-area-inset-bottom))]">
        {children}
      </main>

      <nav
        className="fixed inset-x-0 bottom-0 z-30 mx-auto flex w-full max-w-lg border-t border-border bg-surface md:max-w-3xl lg:max-w-5xl"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        {TABS.map((tab) => {
          const active = tab.match(pathname);
          const Icon = tab.icon;
          return (
            <Link
              key={tab.to}
              to={tab.to}
              className={cn(
                "flex min-h-14 flex-1 flex-col items-center justify-center gap-0.5 text-[11px] font-medium",
                active ? "text-line" : "text-subtle",
              )}
            >
              <Icon className="size-5" strokeWidth={active ? 2.4 : 1.8} />
              {tab.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

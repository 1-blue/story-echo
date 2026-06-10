"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Archive, Lock, NotebookPen, Settings, Users } from "lucide-react";
import { SHELL_FIXED_CHROME_CLASS } from "@/lib/app-layout";
import { cn } from "@/lib/utils";

const tabs: Array<{
  href: string;
  label: string;
  icon: typeof Archive;
  exact?: boolean;
}> = [
  { href: "/drawer", label: "서랍", icon: Archive },
  { href: "/community", label: "커뮤니티", icon: Users },
  { href: "/", label: "오늘의 질문", icon: NotebookPen, exact: true },
  { href: "/capsule", label: "타임캡슐", icon: Lock },
  { href: "/settings", label: "설정", icon: Settings },
];

function isTabActive(pathname: string, href: string, exact?: boolean) {
  if (exact) {
    return pathname === href;
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function BottomTabBar() {
  const pathname = usePathname();

  return (
    <nav
      className={cn(
        SHELL_FIXED_CHROME_CLASS,
        "bottom-0 z-50 flex min-h-[calc(var(--shell-tab-height)+var(--safe-area-bottom))] items-center justify-around border-t border-hairline bg-white pt-2 pb-[var(--safe-area-bottom)]",
      )}
    >
      {tabs.map(({ href, label, icon: Icon, exact }) => {
        const active = isTabActive(pathname, href, exact);

        return (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex h-full w-1/5 flex-col items-center justify-center transition-all duration-200 active:scale-90",
              active ? "font-bold text-primary" : "text-slate hover:text-primary/80",
            )}
          >
            <Icon className="size-6" strokeWidth={active ? 2.25 : 1.75} />
            <span className="mt-1 text-[11px] leading-tight font-medium tracking-wide">
              {label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}

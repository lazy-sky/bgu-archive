"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  { href: "/learn", label: "소개", match: "exact" as const },
  { href: "/learn/holdem", label: "텍사스 홀덤", match: "prefix" as const },
];

const tabBase =
  "rounded-full border px-4 py-2 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400/50";
const tabActive = "border-amber-800/40 bg-amber-900 text-amber-50 shadow-sm";
const tabIdle =
  "border-amber-900/15 bg-white/70 text-amber-950 hover:bg-amber-50/90";

export function LearnGameNav() {
  const pathname = usePathname();

  return (
    <nav
      className="mb-8 flex flex-wrap gap-2 border-b border-amber-950/10 pb-6"
      aria-label="학습 게임 선택"
    >
      {items.map((item) => {
        const selected =
          item.match === "exact"
            ? pathname === item.href
            : pathname === item.href || pathname.startsWith(`${item.href}/`);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`${tabBase} ${selected ? tabActive : tabIdle}`}
            aria-current={selected ? "page" : undefined}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

import Link from "next/link";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { fetchSupporters } from "@/lib/supporters-api";
import type { SupporterRow } from "@/types/supporter";
import { SupporterThanks } from "@/components/supporter-thanks";

const navLinks = [
  { href: "/", label: "홈" },
  { href: "/games", label: "게임 목록" },
  { href: "/games/recommend", label: "게임 추천" },
  { href: "/members", label: "회원" },
  { href: "/donate", label: "후원" },
] as const;

/** DB 미적용·오류 시 푸터만이라도 동일 명단 표시 */
const FALLBACK_SUPPORTERS: SupporterRow[] = [
  {
    id: "fallback-1",
    display_name: "김범기",
    amount_krw: 0,
    sort_order: 1,
  },
  {
    id: "fallback-2",
    display_name: "조서형",
    amount_krw: 0,
    sort_order: 2,
  },
  {
    id: "fallback-3",
    display_name: "박나현",
    amount_krw: 10000,
    sort_order: 3,
  },
  {
    id: "fallback-4",
    display_name: "장서연",
    amount_krw: 5000,
    sort_order: 4,
  },
  {
    id: "fallback-5",
    display_name: "김종인",
    amount_krw: 5000,
    sort_order: 5,
  },
];

async function loadSupporters(): Promise<SupporterRow[]> {
  try {
    const supabase = await createServerSupabaseClient();
    return await fetchSupporters(supabase);
  } catch {
    return FALLBACK_SUPPORTERS;
  }
}

export async function SiteFooter() {
  const year = new Date().getFullYear();
  const supporters = await loadSupporters();

  return (
    <footer className="mt-auto border-t border-amber-900/10 bg-amber-50/60 backdrop-blur-sm">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div className="max-w-md">
            <p className="font-semibold text-amber-950">BGU Archive</p>
            <p className="mt-1 text-sm leading-relaxed text-amber-900/65">
              BGU의 보드게임 정보를 모아 두는 아카이브입니다.
            </p>
          </div>
          <nav
            className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-amber-900/75"
            aria-label="바닥글 링크"
          >
            {navLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="transition hover:text-amber-950"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <SupporterThanks supporters={supporters} />

        <p className="mt-6 border-t border-amber-900/10 pt-6 text-xs text-amber-800/55">
          © {year} BGU Archive. 김하늘 from BGU.
        </p>
      </div>
    </footer>
  );
}

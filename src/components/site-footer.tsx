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


async function loadSupporters(): Promise<SupporterRow[]> {
  const supabase = await createServerSupabaseClient();
  return await fetchSupporters(supabase);
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

        <div className="mt-6 space-y-3 border-t border-amber-900/10 pt-6 text-xs text-amber-800/55">
          <p>
            © {year} BGU Archive. 김하늘 from BGU.
          </p>
          <p className="leading-relaxed text-amber-800/60">
            회원 아바타는{" "}
            <a
              href="https://www.dicebear.com/"
              className="text-amber-900/80 underline hover:text-amber-950"
              target="_blank"
              rel="noreferrer"
            >
              DiceBear
            </a>{" "}
            (MIT)로 생성하며, Lorelei·Avataaars·Micah·Toon Head·Thumbs·Adventurer
            등 스타일을 사용할 수 있습니다.{" "}
            <a
              href="https://www.dicebear.com/licenses/"
              className="text-amber-900/80 underline hover:text-amber-950"
              target="_blank"
              rel="noreferrer"
            >
              스타일별 라이선스
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}

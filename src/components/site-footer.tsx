import Link from "next/link";

const navLinks = [
  { href: "/", label: "홈" },
  { href: "/games", label: "게임 목록" },
  { href: "/games/recommend", label: "게임 추천" },
  { href: "/members", label: "회원" },
  { href: "/donate", label: "후원" },
] as const;

const specialThanks = [
  "김범기",
  "조서형",
  "박나현",
  "장서연",
  "김종인",
] as const;

export function SiteFooter() {
  const year = new Date().getFullYear();

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

        <div className="mt-8 border-t border-amber-900/10 pt-6">
          <p className="text-xs font-medium tracking-wide text-amber-800/60">
            Special Thanks to
          </p>
          <p className="mt-2 text-sm leading-relaxed text-amber-900/85">
            {specialThanks.join(", ")}
          </p>
        </div>

        <p className="mt-6 border-t border-amber-900/10 pt-6 text-xs text-amber-800/55">
          © {year} BGU Archive. 김하늘 from BGU.
        </p>
      </div>
    </footer>
  );
}

"use client";

import { useAuth, useSupabase } from "@/components/auth-provider";
import { HallOfFameAdminLink } from "@/app/honors/hall-of-fame-client";
import { fetchProfile } from "@/lib/profile-api";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useState } from "react";

const links = [
  { href: "/", label: "홈" },
  { href: "/games", label: "게임 목록" },
  { href: "/games/recommend", label: "게임 추천" },
  { href: "/members", label: "회원" },
  { href: "/members/ranking", label: "랭킹" },
  { href: "/honors", label: "명예의 전당" },
  { href: "/donate", label: "후원" },
] as const;

function MenuIcon({ open }: { open: boolean }) {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      className="shrink-0"
      aria-hidden
    >
      {open ? (
        <path d="M18 6 6 18M6 6l12 12" />
      ) : (
        <path d="M4 6h16M4 12h16M4 18h16" />
      )}
    </svg>
  );
}

function HeaderDisplayName({
  sessionUserId,
  fallback,
}: {
  sessionUserId: string;
  fallback: string;
}) {
  const supabase = useSupabase();
  const { data } = useQuery({
    queryKey: ["profile", sessionUserId],
    queryFn: async () => {
      if (!supabase) return null;
      try {
        return await fetchProfile(supabase, sessionUserId);
      } catch {
        return null;
      }
    },
    enabled: !!supabase,
    staleTime: 30 * 1000,
  });
  const name = data?.display_name?.trim();
  return <>{name || fallback}</>;
}

const mobileNavLinkClass =
  "block px-1 py-2.5 text-base text-amber-950 hover:underline";

const desktopNavLinkClass =
  "text-sm text-amber-950 hover:underline underline-offset-4";

export function SiteHeader() {
  const { session, loading, supabase } = useAuth();
  const pathname = usePathname();
  const menuId = useId();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const id = window.setTimeout(() => setMenuOpen(false), 0);
    return () => clearTimeout(id);
  }, [pathname]);

  useEffect(() => {
    if (!menuOpen) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setMenuOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  useEffect(() => {
    if (menuOpen) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [menuOpen]);

  async function signOut() {
    if (supabase) await supabase.auth.signOut();
    setMenuOpen(false);
  }

  const sessionLinks = session
    ? ([
        { href: "/profile", label: "내 프로필" },
        { href: "/games/new", label: "게임 추가" },
      ] as const)
    : [];

  const btnPrimary =
    "inline-flex items-center justify-center bg-amber-950 px-3 py-2 text-xs font-medium text-amber-50 hover:bg-amber-900";

  return (
    <header className="sticky top-0 z-50 border-b border-amber-950/10 bg-amber-50">
      <div className="relative z-50 mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-5">
        <Link
          href="/"
          className="min-w-0 shrink-0 text-base font-semibold tracking-tight text-amber-950"
        >
          BGU Archive
        </Link>

        <div className="hidden min-w-0 flex-1 items-center justify-end gap-6 sm:flex">
          <nav
            className="flex flex-wrap justify-end gap-x-5 gap-y-2 text-sm"
            aria-label="주요 메뉴"
          >
            {links.map((l) => (
              <Link key={l.href} href={l.href} className={desktopNavLinkClass}>
                {l.label}
              </Link>
            ))}
            {session &&
              sessionLinks.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className={desktopNavLinkClass}
                >
                  {l.label}
                </Link>
              ))}
            <HallOfFameAdminLink />
          </nav>
          <div className="h-4 w-px shrink-0 bg-amber-950/15" aria-hidden />
          <div className="shrink-0 text-sm text-amber-950">
            {!supabase ? (
              <span className="text-xs text-amber-950/60">연결 없음</span>
            ) : loading ? (
              <span className="text-amber-950/60">…</span>
            ) : session ? (
              <span className="flex items-center gap-3">
                <span className="max-w-[180px] truncate text-sm">
                  {supabase ? (
                    <HeaderDisplayName
                      sessionUserId={session.user.id}
                      fallback={String(
                        session.user.user_metadata?.full_name ??
                          session.user.user_metadata?.name ??
                          session.user.email,
                      )}
                    />
                  ) : (
                    String(
                      session.user.user_metadata?.full_name ??
                        session.user.user_metadata?.name ??
                        session.user.email,
                    )
                  )}
                </span>
                <button
                  type="button"
                  onClick={() => void signOut()}
                  className="border border-amber-950/20 bg-amber-50 px-2 py-1 text-xs text-amber-950 hover:bg-amber-950/5"
                >
                  로그아웃
                </button>
              </span>
            ) : (
              <Link href="/auth/login" className={btnPrimary}>
                로그인
              </Link>
            )}
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2 sm:hidden">
          {!session && supabase && !loading && (
            <Link href="/auth/login" className={btnPrimary}>
              로그인
            </Link>
          )}
          <button
            type="button"
            id={`${menuId}-button`}
            aria-expanded={menuOpen}
            aria-controls={menuId}
            aria-label={menuOpen ? "메뉴 닫기" : "메뉴 열기"}
            onClick={() => setMenuOpen((o) => !o)}
            className="inline-flex min-h-11 min-w-11 items-center justify-center border border-amber-950/15 text-amber-950 hover:bg-amber-950/5"
          >
            <MenuIcon open={menuOpen} />
          </button>
        </div>
      </div>

      <div className="sm:hidden" aria-hidden={!menuOpen}>
        <button
          type="button"
          className="fixed inset-0 z-40 bg-black/25 transition-opacity duration-300 ease-out motion-reduce:transition-none motion-reduce:duration-0"
          style={{
            opacity: menuOpen ? 1 : 0,
            pointerEvents: menuOpen ? "auto" : "none",
          }}
          tabIndex={-1}
          aria-hidden
          onClick={() => setMenuOpen(false)}
        />
        <div
          className="relative z-50 grid overflow-hidden transition-[grid-template-rows] duration-300 ease-out motion-reduce:transition-none motion-reduce:duration-0"
          style={{ gridTemplateRows: menuOpen ? "1fr" : "0fr" }}
        >
          <div className="min-h-0 overflow-hidden">
            <div
              className={`border-t border-amber-950/10 bg-amber-50 px-4 pb-5 pt-2 transition-[opacity,transform] duration-300 ease-out motion-reduce:transition-none motion-reduce:duration-0 ${
                menuOpen
                  ? "translate-y-0 opacity-100"
                  : "-translate-y-2 opacity-0"
              }`}
            >
              <div
                id={menuId}
                role="navigation"
                aria-label="주요 메뉴"
                aria-hidden={!menuOpen}
                inert={!menuOpen}
              >
                <nav className="flex flex-col">
                  {links.map((l) => (
                    <Link
                      key={l.href}
                      href={l.href}
                      className={mobileNavLinkClass}
                      onClick={() => setMenuOpen(false)}
                    >
                      {l.label}
                    </Link>
                  ))}
                  {session &&
                    sessionLinks.map((l) => (
                      <Link
                        key={l.href}
                        href={l.href}
                        className={mobileNavLinkClass}
                        onClick={() => setMenuOpen(false)}
                      >
                        {l.label}
                      </Link>
                    ))}
                  <div className="px-1 py-2.5" onClick={() => setMenuOpen(false)}>
                    <HallOfFameAdminLink />
                  </div>
                </nav>

                <div className="mt-4 border-t border-amber-950/10 pt-4">
                  {!supabase ? (
                    <p className="text-sm text-amber-950/60">연결 없음</p>
                  ) : loading ? (
                    <p className="text-sm text-amber-950/60">…</p>
                  ) : session ? (
                    <div>
                      <p className="break-words text-sm font-medium text-amber-950">
                        {supabase ? (
                          <HeaderDisplayName
                            sessionUserId={session.user.id}
                            fallback={String(
                              session.user.user_metadata?.full_name ??
                                session.user.user_metadata?.name ??
                                session.user.email,
                            )}
                          />
                        ) : (
                          String(
                            session.user.user_metadata?.full_name ??
                              session.user.user_metadata?.name ??
                              session.user.email,
                          )
                        )}
                      </p>
                      <button
                        type="button"
                        onClick={() => void signOut()}
                        className="mt-3 w-full border border-amber-950/20 bg-amber-50 py-2.5 text-sm text-amber-950 hover:bg-amber-950/5"
                      >
                        로그아웃
                      </button>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

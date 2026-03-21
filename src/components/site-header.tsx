"use client";

import { useAuth, useSupabase } from "@/components/auth-provider";
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
  "rounded-xl px-3 py-2.5 text-base font-medium text-amber-900/90 transition-colors hover:bg-amber-200/45 hover:text-amber-950 active:bg-amber-200/60";

const desktopNavLinkClass =
  "rounded-full px-3 py-1.5 text-sm font-medium text-amber-900/75 transition-colors hover:bg-amber-200/40 hover:text-amber-950";

const desktopAuthBtnClass =
  "rounded-full border border-amber-900/12 bg-white/70 px-3 py-1.5 text-xs font-medium text-amber-900 shadow-sm transition hover:border-amber-900/25 hover:bg-amber-50";

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

  return (
    <header className="sticky top-0 z-50 border-b border-amber-900/[0.08] bg-amber-50/90 shadow-[0_1px_0_rgba(251,191,36,0.06)] backdrop-blur-md">
      <div className="relative z-50 mx-auto flex max-w-6xl items-center justify-between gap-3 bg-gradient-to-b from-amber-50/98 to-amber-50/85 px-4 py-3.5 sm:px-5">
        <Link
          href="/"
          className="group flex min-w-0 shrink-0 items-center gap-2.5"
        >
          <span
            className="h-2 w-2 shrink-0 rounded-full bg-gradient-to-br from-amber-500 to-amber-700 shadow-sm shadow-amber-600/25"
            aria-hidden
          />
          <span className="bg-gradient-to-r from-amber-950 to-amber-900 bg-clip-text text-lg font-bold tracking-tight text-transparent transition group-hover:from-amber-900 group-hover:to-amber-800">
            BGU Archive
          </span>
        </Link>

        {/* 데스크톱 */}
        <div className="hidden min-w-0 flex-1 items-center justify-end gap-5 sm:flex">
          <nav
            className="flex flex-wrap justify-end gap-x-1 gap-y-1.5 text-sm"
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
          </nav>
          <div className="h-6 w-px shrink-0 bg-amber-900/10" aria-hidden />
          <div className="shrink-0 text-sm text-amber-900/70 sm:text-right">
            {!supabase ? (
              <span className="text-xs text-amber-800/60">연결 없음</span>
            ) : loading ? (
              <span className="tabular-nums text-amber-800/70">…</span>
            ) : session ? (
              <span className="flex items-center gap-2.5">
                <span className="max-w-[180px] truncate rounded-full border border-amber-900/10 bg-white/60 px-3 py-1 text-xs font-medium text-amber-950 shadow-sm">
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
                  className={desktopAuthBtnClass}
                >
                  로그아웃
                </button>
              </span>
            ) : (
              <Link
                href="/auth/login"
                className="rounded-full bg-gradient-to-b from-amber-800 to-amber-900 px-4 py-2 text-xs font-semibold text-amber-50 shadow-sm transition hover:from-amber-900 hover:to-amber-950"
              >
                로그인
              </Link>
            )}
          </div>
        </div>

        {/* 모바일: 비로그인 시에만 로그인 버튼 */}
        <div className="flex shrink-0 items-center gap-2 sm:hidden">
          {!session && supabase && !loading && (
            <Link
              href="/auth/login"
              className="rounded-full bg-gradient-to-b from-amber-800 to-amber-900 px-3.5 py-2 text-xs font-semibold text-amber-50 shadow-sm transition active:scale-[0.98]"
            >
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
            className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-xl border border-amber-900/12 bg-white/70 text-amber-900 shadow-sm transition hover:border-amber-900/22 hover:bg-amber-50 active:scale-[0.98]"
          >
            <MenuIcon open={menuOpen} />
          </button>
        </div>
      </div>

      {/* 모바일 패널 */}
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
              className={`border-t border-amber-900/10 bg-gradient-to-b from-amber-50/98 to-amber-100/30 px-4 pb-6 pt-3 shadow-[0_8px_30px_-12px_rgba(120,53,15,0.15)] transition-[opacity,transform] duration-300 ease-out motion-reduce:transition-none motion-reduce:duration-0 ${
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
                <nav className="flex flex-col gap-0.5">
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
                </nav>

                <div className="mt-5 border-t border-amber-900/10 pt-5">
                  {!supabase ? (
                    <p className="text-sm text-amber-800/60">연결 없음</p>
                  ) : loading ? (
                    <p className="text-sm text-amber-900/70">…</p>
                  ) : session ? (
                    <div className="rounded-2xl border border-amber-900/10 bg-white/70 p-4 shadow-sm">
                      <p className="break-words text-base font-semibold leading-snug text-amber-950">
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
                        className="mt-4 min-h-11 w-full rounded-xl border border-amber-900/15 bg-amber-50/80 px-3 py-2.5 text-sm font-medium text-amber-900 transition hover:bg-amber-100/90 active:scale-[0.99]"
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

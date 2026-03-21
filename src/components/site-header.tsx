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
      width="24"
      height="24"
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
  "rounded-lg px-3 py-2.5 text-base text-amber-900/85 transition hover:bg-amber-100/70 hover:text-amber-950";
const desktopNavLinkClass =
  "text-amber-900/80 transition hover:text-amber-950";

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
    <header className="sticky top-0 z-50 border-b border-amber-900/10 bg-amber-50/90 backdrop-blur-sm">
      <div className="relative z-50 mx-auto flex max-w-6xl items-center justify-between gap-3 bg-amber-50/90 px-4 py-3">
        <Link
          href="/"
          className="min-w-0 shrink-0 font-semibold tracking-tight text-amber-950"
        >
          BGU Archive
        </Link>

        {/* 데스크톱: 가로 메뉴 + 계정 */}
        <div className="hidden min-w-0 flex-1 items-center justify-end gap-4 sm:flex">
          <nav className="flex flex-wrap justify-end gap-x-4 gap-y-2 text-sm">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={desktopNavLinkClass}
              >
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
          <div className="shrink-0 text-sm text-amber-900/70 sm:text-right">
            {!supabase ? (
              <span className="text-xs text-amber-800/60">연결 없음</span>
            ) : loading ? (
              <span>…</span>
            ) : session ? (
              <span className="flex items-center gap-2">
                <span className="max-w-[160px] truncate text-amber-950">
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
                  className="rounded-md border border-amber-900/15 px-2 py-1 text-xs text-amber-900 hover:bg-amber-100/80"
                >
                  로그아웃
                </button>
              </span>
            ) : (
              <Link
                href="/auth/login"
                className="rounded-md bg-amber-900 px-3 py-1.5 text-xs font-medium text-amber-50 hover:bg-amber-800"
              >
                로그인
              </Link>
            )}
          </div>
        </div>

        {/* 모바일: 로그인(비로그인) + 메뉴 토글 */}
        <div className="flex shrink-0 items-center gap-2 sm:hidden">
          {!session && supabase && !loading && (
            <Link
              href="/auth/login"
              className="rounded-full bg-amber-900 px-3 py-2 text-xs font-medium text-amber-50 hover:bg-amber-800"
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
            className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg border border-amber-900/15 text-amber-900 hover:bg-amber-100/80"
          >
            <MenuIcon open={menuOpen} />
          </button>
        </div>
      </div>

      {/* 모바일: 배경 페이드 + 높이·슬라이드 패널 (sm 이상에서는 숨김) */}
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
              className={`border-t border-amber-900/10 bg-amber-50/98 px-4 pb-5 pt-2 shadow-lg transition-[opacity,transform] duration-300 ease-out motion-reduce:transition-none motion-reduce:duration-0 ${
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
                </nav>

                <div className="mt-4 border-t border-amber-900/10 pt-4">
                  {!supabase ? (
                    <p className="text-sm text-amber-800/60">연결 없음</p>
                  ) : loading ? (
                    <p className="text-sm text-amber-900/70">…</p>
                  ) : session ? (
                    <div className="flex flex-col gap-3">
                      <p className="text-sm font-medium text-amber-950">
                        <span className="text-amber-900/55">로그인 </span>
                        <span className="break-all">
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
                      </p>
                      <button
                        type="button"
                        onClick={() => void signOut()}
                        className="min-h-11 w-full rounded-lg border border-amber-900/20 bg-white px-3 py-2.5 text-sm font-medium text-amber-900 hover:bg-amber-50"
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

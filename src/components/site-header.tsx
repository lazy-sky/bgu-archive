"use client";

import { useAuth, useSupabase } from "@/components/auth-provider";
import { fetchProfile } from "@/lib/profile-api";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";

const links = [
  { href: "/", label: "홈" },
  { href: "/games", label: "게임 목록" },
  { href: "/games/recommend", label: "게임 추천" },
  { href: "/members", label: "회원" },
  { href: "/donate", label: "후원" },
];

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

export function SiteHeader() {
  const { session, loading, supabase } = useAuth();

  async function signOut() {
    if (supabase) await supabase.auth.signOut();
  }

  return (
    <header className="border-b border-amber-900/10 bg-amber-50/80 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
        <Link
          href="/"
          className="shrink-0 font-semibold tracking-tight text-amber-950"
        >
          BGU Archive
        </Link>
        <div className="flex min-w-0 flex-col gap-3 border-t border-amber-900/10 pt-3 sm:flex-row sm:items-center sm:justify-end sm:gap-4 sm:border-t-0 sm:pt-0">
          <nav className="flex flex-wrap gap-x-4 gap-y-2 text-sm sm:justify-end">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="text-amber-900/80 transition hover:text-amber-950"
              >
                {l.label}
              </Link>
            ))}
            {session && (
              <>
                <Link
                  href="/profile"
                  className="text-amber-900/80 transition hover:text-amber-950"
                >
                  내 프로필
                </Link>
                <Link
                  href="/games/new"
                  className="text-amber-900/80 transition hover:text-amber-950"
                >
                  게임 추가
                </Link>
              </>
            )}
          </nav>
          <div className="shrink-0 text-sm text-amber-900/70 sm:text-right">
            {!supabase ? (
              <span className="text-xs text-amber-800/60">연결 없음</span>
            ) : loading ? (
              <span>…</span>
            ) : session ? (
              <span className="flex items-center gap-2">
                <span className="max-w-[min(45vw,10rem)] truncate text-amber-950 sm:max-w-[160px]">
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
      </div>
    </header>
  );
}

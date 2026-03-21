"use client";

import { useAuth } from "@/components/auth-provider";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export function LoginForm() {
  const { supabase, session, loading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    if (searchParams.get("error") === "auth") {
      setError("로그인에 실패했습니다. 다시 시도해 주세요.");
    }
  }, [searchParams]);

  useEffect(() => {
    if (!loading && session) {
      router.replace("/games");
    }
  }, [loading, session, router]);

  if (!supabase) {
    return (
      <main className="mx-auto max-w-md px-4 py-12 text-sm text-amber-900 sm:py-16">
        지금은 로그인을 사용할 수 없습니다. 잠시 후 다시 시도해 주세요.
      </main>
    );
  }

  async function signInWithGoogle() {
    if (!supabase) return;
    setError(null);
    setPending(true);
    const { error: err } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (err) {
      setError(err.message);
      setPending(false);
    }
  }

  if (!loading && session) {
    return (
      <main className="mx-auto max-w-md px-4 py-12 text-center text-amber-900/70 sm:py-16">
        이동 중…
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-md px-4 py-10 sm:py-12">
      <h1 className="text-xl font-semibold text-amber-950 sm:text-2xl">로그인</h1>
      <p className="mt-1 text-sm text-amber-900/65">
        Google 계정으로 로그인하면 게임을 추가할 수 있습니다.
      </p>

      <div className="mt-10">
        <button
          type="button"
          disabled={pending}
          onClick={() => void signInWithGoogle()}
          className="flex w-full items-center justify-center gap-3 rounded-full border border-amber-900/15 bg-white py-3 text-sm font-medium text-amber-950 shadow-sm transition hover:bg-amber-50 disabled:opacity-60"
        >
          <GoogleGlyph />
          {pending ? "이동 중…" : "Google로 계속하기"}
        </button>
        {error && (
          <p className="mt-4 text-sm text-red-700" role="alert">
            {error}
          </p>
        )}
      </div>

      <p className="mt-10 text-center">
        <Link href="/games" className="text-sm text-amber-800 underline">
          게임 목록으로
        </Link>
      </p>
    </main>
  );
}

function GoogleGlyph() {
  return (
    <svg width="20" height="20" viewBox="0 0 48 48" aria-hidden>
      <path
        fill="#FFC107"
        d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"
      />
      <path
        fill="#FF3D00"
        d="m6.306 14.691 6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"
      />
      <path
        fill="#4CAF50"
        d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"
      />
      <path
        fill="#1976D2"
        d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"
      />
    </svg>
  );
}

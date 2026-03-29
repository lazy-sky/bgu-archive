"use client";

import { MemberAvatar } from "@/components/member-avatar";
import { useAuth, useSupabase } from "@/components/auth-provider";
import { fetchHallOfFame } from "@/lib/hall-of-fame-api";
import { fetchProfile } from "@/lib/profile-api";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";

export function HallOfFameClient() {
  const supabase = useSupabase();

  const { data: entries = [], isPending, error } = useQuery({
    queryKey: ["hall-of-fame"],
    queryFn: () => {
      if (!supabase) throw new Error("데이터를 불러올 수 없습니다.");
      return fetchHallOfFame(supabase);
    },
    enabled: !!supabase,
    staleTime: 30 * 1000,
  });

  if (!supabase) {
    return (
      <p className="rounded-lg border border-amber-900/15 bg-amber-50/80 px-4 py-3 text-sm text-amber-900">
        지금은 불러올 수 없습니다. 잠시 후 다시 시도해 주세요.
      </p>
    );
  }

  if (isPending) {
    return <p className="text-amber-900/70">불러오는 중…</p>;
  }

  if (error) {
    return (
      <p className="text-red-700" role="alert">
        {(error as Error).message}
      </p>
    );
  }

  if (entries.length === 0) {
    return (
      <p className="rounded-xl border border-amber-900/10 bg-white/70 px-4 py-6 text-sm text-amber-800/85">
        아직 등록된 업적이 없습니다.
      </p>
    );
  }

  return (
    <ul className="space-y-6" role="list">
      {entries.map((entry) => (
        <li
          key={entry.id}
          className="overflow-hidden rounded-2xl border border-amber-900/10 bg-gradient-to-br from-white/95 to-amber-50/40 shadow-sm shadow-amber-900/[0.06]"
        >
          <div className="border-b border-amber-900/10 bg-amber-100/40 px-4 py-3 sm:px-5">
            <h2 className="text-lg font-semibold tracking-tight text-amber-950 sm:text-xl">
              {entry.title}
            </h2>
            {entry.description.trim() ? (
              <p className="mt-1.5 text-sm leading-relaxed text-amber-900/80 whitespace-pre-wrap">
                {entry.description}
              </p>
            ) : null}
          </div>
          <div className="px-4 py-4 sm:px-5 sm:py-5">
            {entry.honorees.length === 0 ? (
              <p className="text-sm text-amber-800/65">아직 달성한 회원이 없습니다.</p>
            ) : (
              <ul className="flex flex-wrap gap-3" role="list">
                {entry.honorees.map((h) => (
                  <li
                    key={h.userId}
                    className="flex min-w-0 max-w-full items-center gap-2 rounded-xl border border-amber-900/10 bg-white/80 px-3 py-2 shadow-sm"
                  >
                    <MemberAvatar
                      config={h.avatarConfig}
                      size={40}
                      seedFallback={h.userId}
                      className="shrink-0 ring-amber-900/10"
                    />
                    <span className="min-w-0 truncate text-sm font-medium text-amber-950">
                      {h.displayName}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}

export function HallOfFameAdminLink() {
  const supabase = useSupabase();
  const { session } = useAuth();
  const userId = session?.user.id;
  const { data: profile } = useQuery({
    queryKey: ["profile", userId],
    queryFn: () => {
      if (!supabase || !userId) return null;
      return fetchProfile(supabase, userId);
    },
    enabled: !!supabase && !!userId,
    staleTime: 60 * 1000,
  });

  if (!profile?.is_admin) return null;

  return (
    <Link
      href="/honors/manage"
      className="text-sm font-medium text-violet-800 underline decoration-violet-800/35 underline-offset-2 hover:text-violet-950"
    >
      업적 관리
    </Link>
  );
}

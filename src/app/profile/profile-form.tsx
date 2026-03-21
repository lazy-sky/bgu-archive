"use client";

import { useAuth, useSupabase } from "@/components/auth-provider";
import { fetchProfile } from "@/lib/profile-api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export function ProfileForm() {
  const { session, loading: authLoading } = useAuth();
  const supabase = useSupabase();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [displayName, setDisplayName] = useState("");
  const [saved, setSaved] = useState(false);

  const userId = session?.user.id;

  const { data: profile, isPending: profileLoading } = useQuery({
    queryKey: ["profile", userId],
    queryFn: async () => {
      if (!supabase || !userId) return null;
      return fetchProfile(supabase, userId);
    },
    enabled: !!supabase && !!userId,
  });

  useEffect(() => {
    if (profile?.display_name != null) {
      setDisplayName(profile.display_name);
    }
  }, [profile?.display_name]);

  const updateMutation = useMutation({
    mutationFn: async (name: string) => {
      if (!supabase || !userId) throw new Error("로그인 필요");
      const trimmed = name.trim();
      if (!trimmed) throw new Error("표시 이름을 입력해 주세요.");
      const { error } = await supabase
        .from("profiles")
        .update({ display_name: trimmed })
        .eq("id", userId);
      if (error) throw error;
    },
    onSuccess: () => {
      setSaved(true);
      queryClient.invalidateQueries({ queryKey: ["profile", userId] });
      queryClient.invalidateQueries({ queryKey: ["members"] });
      setTimeout(() => setSaved(false), 3000);
    },
  });

  if (!supabase) {
    return (
      <p className="text-sm text-amber-900">
        지금은 프로필을 불러올 수 없습니다. 잠시 후 다시 시도해 주세요.
      </p>
    );
  }

  if (authLoading) {
    return <p className="text-amber-900/70">불러오는 중…</p>;
  }

  if (!session) {
    return (
      <div className="rounded-xl border border-amber-900/15 bg-white/70 p-6 text-amber-900">
        <p>로그인이 필요합니다.</p>
        <Link
          href="/auth/login"
          className="mt-3 inline-block text-sm font-medium text-amber-800 underline"
        >
          로그인하기
        </Link>
      </div>
    );
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaved(false);
    updateMutation.mutate(displayName);
  }

  return (
    <form
      onSubmit={onSubmit}
      className="w-full max-w-md space-y-5 rounded-xl border border-amber-900/10 bg-white/80 p-4 shadow-sm sm:p-6"
    >
      <div>
        <label htmlFor="display_name" className="text-sm font-medium text-amber-950">
          표시 이름
        </label>
        <p className="mt-1 text-xs text-amber-800/75">
          동아리 회원 목록·게임 추천 등에 보이는 이름입니다.{" "}
          <strong className="font-medium text-amber-900">본명</strong>으로
          적어 주세요.
        </p>
        <input
          id="display_name"
          type="text"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          placeholder="본명으로 기입해 주세요"
          autoComplete="name"
          className="mt-2 w-full rounded-lg border border-amber-900/15 bg-white px-3 py-2 text-amber-950 outline-none ring-amber-400/30 focus:ring-2"
        />
      </div>

      {updateMutation.isError && (
        <p className="text-sm text-red-700" role="alert">
          {updateMutation.error instanceof Error
            ? updateMutation.error.message
            : "저장에 실패했습니다."}
        </p>
      )}
      {saved && (
        <p className="text-sm text-emerald-800" role="status">
          저장했습니다.
        </p>
      )}

      <div className="flex flex-wrap gap-3">
        <button
          type="submit"
          disabled={profileLoading || updateMutation.isPending}
          className="rounded-full bg-amber-900 px-5 py-2 text-sm font-medium text-amber-50 hover:bg-amber-800 disabled:opacity-60"
        >
          {updateMutation.isPending ? "저장 중…" : "저장"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/games")}
          className="rounded-full border border-amber-900/20 px-5 py-2 text-sm text-amber-950 hover:bg-amber-50"
        >
          취소
        </button>
      </div>
    </form>
  );
}

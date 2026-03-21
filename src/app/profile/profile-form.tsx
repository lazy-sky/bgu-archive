"use client";

import { useAuth, useSupabase } from "@/components/auth-provider";
import { fetchProfile } from "@/lib/profile-api";
import { joinCommaList, splitCommaList } from "@/lib/parse-comma-list";
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
  const [mbti, setMbti] = useState("");
  const [bio, setBio] = useState("");
  const [favoriteGenres, setFavoriteGenres] = useState("");
  const [favoriteGameTypes, setFavoriteGameTypes] = useState("");
  const [ruleMasterGames, setRuleMasterGames] = useState("");
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
    if (!profile) return;
    setDisplayName(profile.display_name);
    setMbti(profile.mbti);
    setBio(profile.bio);
    setFavoriteGenres(joinCommaList(profile.favorite_genres));
    setFavoriteGameTypes(joinCommaList(profile.favorite_game_types));
    setRuleMasterGames(joinCommaList(profile.rule_master_games));
  }, [profile]);

  const updateMutation = useMutation({
    mutationFn: async () => {
      if (!supabase || !userId) throw new Error("로그인 필요");
      const trimmedName = displayName.trim();
      if (!trimmedName) throw new Error("표시 이름을 입력해 주세요.");
      const { error } = await supabase
        .from("profiles")
        .update({
          display_name: trimmedName,
          mbti: mbti.trim(),
          bio: bio.trim(),
          favorite_genres: splitCommaList(favoriteGenres),
          favorite_game_types: splitCommaList(favoriteGameTypes),
          rule_master_games: splitCommaList(ruleMasterGames),
        })
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

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaved(false);
    updateMutation.mutate();
  }

  const inputClass =
    "mt-1.5 w-full rounded-lg border border-amber-900/15 bg-white px-3 py-2 text-amber-950 outline-none ring-amber-400/30 focus:ring-2";
  const labelClass = "text-sm font-medium text-amber-950";

  return (
    <form
      onSubmit={onSubmit}
      className="w-full max-w-xl space-y-5 rounded-xl border border-amber-900/10 bg-white/80 p-4 shadow-sm sm:p-6"
    >
      <div>
        <label htmlFor="display_name" className={labelClass}>
          표시 이름
        </label>
        <p className="mt-1 text-xs text-amber-800/75">
          회원 목록 등에 보이는 이름입니다.{" "}
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
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="mbti" className={labelClass}>
          MBTI
        </label>
        <input
          id="mbti"
          type="text"
          value={mbti}
          onChange={(e) => setMbti(e.target.value)}
          placeholder="예: ENFP"
          className={inputClass}
          maxLength={32}
        />
      </div>

      <div>
        <label htmlFor="bio" className={labelClass}>
          소개
        </label>
        <textarea
          id="bio"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          rows={3}
          placeholder="한 줄 소개를 적어 주세요."
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="favorite_genres" className={labelClass}>
          선호 장르
        </label>
        <p className="mt-1 text-xs text-amber-800/75">
          쉼표로 구분해 주세요. (회원 목록에 그대로 표시됩니다)
        </p>
        <input
          id="favorite_genres"
          type="text"
          value={favoriteGenres}
          onChange={(e) => setFavoriteGenres(e.target.value)}
          placeholder="예: 파티, 블러핑, 카드"
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="favorite_game_types" className={labelClass}>
          플레이 스타일
        </label>
        <p className="mt-1 text-xs text-amber-800/75">
          쉼표로 구분해 주세요.
        </p>
        <input
          id="favorite_game_types"
          type="text"
          value={favoriteGameTypes}
          onChange={(e) => setFavoriteGameTypes(e.target.value)}
          placeholder="예: 단시간, 웃음 위주"
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="rule_master_games" className={labelClass}>
          룰마스터 가능한 게임
        </label>
        <p className="mt-1 text-xs text-amber-800/75">
          설명할 수 있는 게임 이름을 쉼표로 적어 주세요. 게임 목록의 이름과 맞추면
          추천에 반영됩니다.
        </p>
        <textarea
          id="rule_master_games"
          value={ruleMasterGames}
          onChange={(e) => setRuleMasterGames(e.target.value)}
          rows={3}
          placeholder="예: 더 마인드, 라스베가스, 달무티"
          className={inputClass}
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
          저장했습니다. 회원 목록에서 확인할 수 있어요.
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
        <Link
          href="/members"
          className="rounded-full border border-amber-900/20 px-5 py-2 text-sm text-amber-950 hover:bg-amber-50"
        >
          회원 목록 보기
        </Link>
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

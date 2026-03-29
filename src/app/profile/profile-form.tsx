"use client";

import { useAuth, useSupabase } from "@/components/auth-provider";
import { patchGamesMyPlayed, setGamePlayed } from "@/lib/game-plays-api";
import { fetchGames, getGameGenres } from "@/lib/games-api";
import {
  canSaveLoreleiAvatar,
  LORELEI_SAVE_DENIED_MESSAGE,
} from "@/lib/lorelei-eligibility";
import { PLAY_STYLE_OPTIONS } from "@/lib/profile-picklists";
import { fetchSupporters } from "@/lib/supporters-api";
import { AvatarEditor } from "@/components/avatar-editor";
import { PlayedToggle } from "@/components/played-toggle";
import { avatarConfigForSave, DEFAULT_AVATAR } from "@/lib/avatar-config";
import { normalizeMbti } from "@/lib/format-mbti";
import { fetchProfile } from "@/lib/profile-api";
import type { AvatarConfig } from "@/types/avatar";
import type { Game } from "@/types/game";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

export function ProfileForm() {
  const { session, loading: authLoading } = useAuth();
  const supabase = useSupabase();
  const router = useRouter();
  const queryClient = useQueryClient();

  const [displayName, setDisplayName] = useState("");
  const [mbti, setMbti] = useState("");
  const [bio, setBio] = useState("");
  const [genreSelected, setGenreSelected] = useState<Set<string>>(
    () => new Set(),
  );
  const [genreFilter, setGenreFilter] = useState("");
  const [playStyleSelected, setPlayStyleSelected] = useState<Set<string>>(
    () => new Set(),
  );
  const [playStyleFilter, setPlayStyleFilter] = useState("");
  const [ruleMasterSelected, setRuleMasterSelected] = useState<Set<string>>(
    () => new Set(),
  );
  const [ruleGameFilter, setRuleGameFilter] = useState("");
  const [playedGameFilter, setPlayedGameFilter] = useState("");
  const [savedBasic, setSavedBasic] = useState(false);
  const [savedGenres, setSavedGenres] = useState(false);
  const [savedPlayStyles, setSavedPlayStyles] = useState(false);
  const [savedRuleGames, setSavedRuleGames] = useState(false);
  const [avatarSaved, setAvatarSaved] = useState(false);
  const [avatarConfig, setAvatarConfig] =
    useState<AvatarConfig>(DEFAULT_AVATAR);

  const userId = session?.user.id;

  const { data: profile, isPending: profileLoading } = useQuery({
    queryKey: ["profile", userId],
    queryFn: async () => {
      if (!supabase || !userId) return null;
      return fetchProfile(supabase, userId);
    },
    enabled: !!supabase && !!userId,
  });

  const gamesQueryKey = ["games", userId ?? "anon"] as const;

  const { data: games = [], isPending: gamesLoading } = useQuery({
    queryKey: gamesQueryKey,
    queryFn: () => {
      if (!supabase) throw new Error("데이터를 불러올 수 없습니다.");
      return fetchGames(supabase, { viewerUserId: userId });
    },
    enabled: !!supabase && !!session,
    staleTime: 30 * 1000,
  });

  const myRatedGames = useMemo(() => {
    return games
      .filter((g) => g.myRating != null)
      .sort((a, b) => a.name.localeCompare(b.name, "ko"));
  }, [games]);

  const myPlayedGames = useMemo(() => {
    return games
      .filter((g) => g.myPlayed)
      .sort((a, b) => a.name.localeCompare(b.name, "ko"));
  }, [games]);

  const { data: supporters = [], isPending: supportersLoading } = useQuery({
    queryKey: ["supporters"],
    queryFn: () => {
      if (!supabase) throw new Error("데이터를 불러올 수 없습니다.");
      return fetchSupporters(supabase);
    },
    enabled: !!supabase && !!session,
    staleTime: 60 * 1000,
  });

  const orphanedRuleNames = useMemo(() => {
    if (!profile) return [];
    const names = games.map((g) => g.name);
    return profile.rule_master_games.filter(
      (nm) => !names.some((n) => n === nm.trim()),
    );
  }, [profile, games]);

  const genreOptions = useMemo(() => getGameGenres(games), [games]);

  const displayNameForLorelei = useMemo(
    () => (profile?.display_name ?? displayName).trim(),
    [profile?.display_name, displayName],
  );

  const canSaveLorelei = useMemo(
    () => canSaveLoreleiAvatar(displayNameForLorelei, supporters),
    [displayNameForLorelei, supporters],
  );

  const loreleiSaveAllowed = useMemo(
    () =>
      avatarConfig.style !== "lorelei" ||
      supportersLoading ||
      canSaveLorelei,
    [avatarConfig.style, supportersLoading, canSaveLorelei],
  );

  const orphanedGenreNames = useMemo(() => {
    if (!profile) return [];
    const opts = new Set(genreOptions);
    return profile.favorite_genres.filter((nm) => !opts.has(nm.trim()));
  }, [profile, genreOptions]);

  const orphanedPlayStyleNames = useMemo(() => {
    if (!profile) return [];
    const opts = new Set(PLAY_STYLE_OPTIONS);
    return profile.favorite_game_types.filter((nm) => !opts.has(nm.trim()));
  }, [profile]);

  const profileRuleSig = useMemo(
    () => (profile ? profile.rule_master_games.join("|") : ""),
    [profile],
  );
  const gameNamesSig = useMemo(
    () =>
      games
        .map((g) => g.name)
        .sort((a, b) => a.localeCompare(b, "ko"))
        .join("\0"),
    [games],
  );

  const profileGenreSig = useMemo(
    () => (profile ? profile.favorite_genres.join("|") : ""),
    [profile],
  );
  const genreOptionsSig = useMemo(() => genreOptions.join("\0"), [genreOptions]);

  const profilePlayStyleSig = useMemo(
    () => (profile ? profile.favorite_game_types.join("|") : ""),
    [profile],
  );

  useEffect(() => {
    if (!profile) return;
    setDisplayName(profile.display_name);
    setMbti(profile.mbti);
    setBio(profile.bio);
    setAvatarConfig(avatarConfigForSave(profile.avatarConfig));
  }, [profile]);

  useEffect(() => {
    if (!profile || gamesLoading) return;
    const opts = new Set(genreOptions);
    const next = new Set<string>();
    for (const nm of profile.favorite_genres) {
      const t = nm.trim();
      if (opts.has(t)) next.add(t);
    }
    setGenreSelected(next);
  }, [profile, profileGenreSig, gamesLoading, genreOptionsSig]);

  useEffect(() => {
    if (!profile) return;
    const opts = new Set(PLAY_STYLE_OPTIONS);
    const next = new Set<string>();
    for (const nm of profile.favorite_game_types) {
      const t = nm.trim();
      if (opts.has(t)) next.add(t);
    }
    setPlayStyleSelected(next);
  }, [profile, profilePlayStyleSig]);

  useEffect(() => {
    if (!profile || gamesLoading) return;
    const next = new Set<string>();
    for (const nm of profile.rule_master_games) {
      const t = nm.trim();
      if (games.some((g) => g.name === t)) next.add(t);
    }
    setRuleMasterSelected(next);
  }, [profile, profileRuleSig, gamesLoading, gameNamesSig]);

  const filteredGames = useMemo(() => {
    const q = ruleGameFilter.trim().toLowerCase();
    if (!q) return games;
    return games.filter((g) => g.name.toLowerCase().includes(q));
  }, [games, ruleGameFilter]);

  const filteredGamesForPlayed = useMemo(() => {
    const q = playedGameFilter.trim().toLowerCase();
    if (!q) return games;
    return games.filter((g) => g.name.toLowerCase().includes(q));
  }, [games, playedGameFilter]);

  const filteredGenres = useMemo(() => {
    const q = genreFilter.trim().toLowerCase();
    if (!q) return genreOptions;
    return genreOptions.filter((g) => g.toLowerCase().includes(q));
  }, [genreOptions, genreFilter]);

  const filteredPlayStyles = useMemo(() => {
    const q = playStyleFilter.trim().toLowerCase();
    if (!q) return [...PLAY_STYLE_OPTIONS];
    return PLAY_STYLE_OPTIONS.filter((p) => p.toLowerCase().includes(q));
  }, [playStyleFilter]);

  function assertLoggedIn() {
    if (!supabase || !userId) throw new Error("로그인 필요");
    return { supabase, userId };
  }

  const saveBasicMutation = useMutation({
    mutationFn: async () => {
      const { supabase, userId } = assertLoggedIn();
      const trimmedName = displayName.trim();
      if (!trimmedName) throw new Error("표시 이름을 입력해 주세요.");
      const { error } = await supabase
        .from("profiles")
        .update({
          display_name: trimmedName,
          mbti: normalizeMbti(mbti),
          bio: bio.trim(),
        })
        .eq("id", userId);
      if (error) throw error;
    },
    onSuccess: () => {
      setSavedBasic(true);
      queryClient.invalidateQueries({ queryKey: ["profile", userId] });
      queryClient.invalidateQueries({ queryKey: ["members"] });
      setTimeout(() => setSavedBasic(false), 3000);
    },
  });

  const saveGenresMutation = useMutation({
    mutationFn: async () => {
      const { supabase, userId } = assertLoggedIn();
      const genreList = [...genreSelected].sort((a, b) =>
        a.localeCompare(b, "ko"),
      );
      const { error } = await supabase
        .from("profiles")
        .update({ favorite_genres: genreList })
        .eq("id", userId);
      if (error) throw error;
    },
    onSuccess: () => {
      setSavedGenres(true);
      queryClient.invalidateQueries({ queryKey: ["profile", userId] });
      queryClient.invalidateQueries({ queryKey: ["members"] });
      setTimeout(() => setSavedGenres(false), 3000);
    },
  });

  const savePlayStylesMutation = useMutation({
    mutationFn: async () => {
      const { supabase, userId } = assertLoggedIn();
      const playList = [...playStyleSelected].sort((a, b) =>
        a.localeCompare(b, "ko"),
      );
      const { error } = await supabase
        .from("profiles")
        .update({ favorite_game_types: playList })
        .eq("id", userId);
      if (error) throw error;
    },
    onSuccess: () => {
      setSavedPlayStyles(true);
      queryClient.invalidateQueries({ queryKey: ["profile", userId] });
      queryClient.invalidateQueries({ queryKey: ["members"] });
      setTimeout(() => setSavedPlayStyles(false), 3000);
    },
  });

  const saveRuleGamesMutation = useMutation({
    mutationFn: async () => {
      const { supabase, userId } = assertLoggedIn();
      const ruleList = [...ruleMasterSelected].sort((a, b) =>
        a.localeCompare(b, "ko"),
      );
      const { error } = await supabase
        .from("profiles")
        .update({ rule_master_games: ruleList })
        .eq("id", userId);
      if (error) throw error;
    },
    onSuccess: () => {
      setSavedRuleGames(true);
      queryClient.invalidateQueries({ queryKey: ["profile", userId] });
      queryClient.invalidateQueries({ queryKey: ["members"] });
      setTimeout(() => setSavedRuleGames(false), 3000);
    },
  });

  const playedMutation = useMutation({
    mutationFn: async ({
      gameId,
      played,
    }: {
      gameId: string;
      played: boolean;
    }) => {
      const { supabase, userId } = assertLoggedIn();
      await setGamePlayed(supabase, userId, gameId, played);
    },
    onMutate: async ({ gameId, played }) => {
      await queryClient.cancelQueries({ queryKey: ["games"] });
      const snapshots = queryClient.getQueriesData<Game[]>({
        queryKey: ["games"],
      });
      const previous = snapshots.map(([queryKey, data]) => ({
        queryKey,
        data,
      }));
      queryClient.setQueriesData<Game[]>(
        { queryKey: ["games"] },
        (old) => patchGamesMyPlayed(old, gameId, played),
      );
      return { previous };
    },
    onError: (_err, _vars, context) => {
      context?.previous?.forEach(({ queryKey, data }) => {
        queryClient.setQueryData(queryKey, data);
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["games"] });
    },
  });

  const saveAvatarMutation = useMutation({
    mutationFn: async () => {
      if (!supabase || !userId) throw new Error("로그인 필요");
      if (avatarConfig.style === "lorelei") {
        const ok = canSaveLoreleiAvatar(
          (profile?.display_name ?? displayName).trim(),
          supporters,
        );
        if (!ok) throw new Error(LORELEI_SAVE_DENIED_MESSAGE);
      }
      const { error } = await supabase
        .from("profiles")
        .update({ avatar_config: avatarConfigForSave(avatarConfig) })
        .eq("id", userId);
      if (error) throw error;
    },
    onSuccess: () => {
      setAvatarSaved(true);
      queryClient.invalidateQueries({ queryKey: ["profile", userId] });
      queryClient.invalidateQueries({ queryKey: ["members"] });
      setTimeout(() => setAvatarSaved(false), 3000);
    },
  });

  function toggleRuleGame(name: string) {
    setRuleMasterSelected((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  }

  function toggleGenre(name: string) {
    setGenreSelected((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  }

  function togglePlayStyle(name: string) {
    setPlayStyleSelected((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  }

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

  function preventFormSubmit(e: React.FormEvent) {
    e.preventDefault();
  }

  const sectionSaveBtnClass =
    "rounded-full border border-amber-900/25 bg-white px-4 py-2 text-sm font-medium text-amber-950 hover:bg-amber-50 disabled:opacity-60";

  const inputClass =
    "mt-1.5 w-full rounded-lg border border-amber-900/15 bg-white px-3 py-2 text-amber-950 outline-none ring-amber-400/30 focus:ring-2";
  const labelClass = "text-sm font-medium text-amber-950";

  return (
    <form
      onSubmit={preventFormSubmit}
      className="w-full max-w-xl space-y-5 rounded-xl border border-amber-900/10 bg-white/80 p-4 shadow-sm sm:p-6"
    >
      <section className="space-y-4" aria-labelledby="profile-basic-heading">
        <h2
          id="profile-basic-heading"
          className="text-sm font-semibold text-amber-950"
        >
          기본 정보
        </h2>
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
            onChange={(e) => setMbti(e.target.value.toUpperCase())}
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
        <div className="flex flex-wrap items-center gap-2 border-t border-amber-900/10 pt-3">
          <button
            type="button"
            disabled={profileLoading || saveBasicMutation.isPending}
            onClick={() => {
              setSavedBasic(false);
              saveBasicMutation.mutate();
            }}
            className={sectionSaveBtnClass}
          >
            {saveBasicMutation.isPending ? "저장 중…" : "기본 정보 저장"}
          </button>
          {savedBasic ? (
            <p className="text-sm text-emerald-800" role="status">
              저장했습니다. 회원 목록에서 확인할 수 있어요.
            </p>
          ) : null}
          {saveBasicMutation.isError ? (
            <p className="text-sm text-red-700" role="alert">
              {saveBasicMutation.error instanceof Error
                ? saveBasicMutation.error.message
                : "저장에 실패했습니다."}
            </p>
          ) : null}
        </div>
      </section>

      <AvatarEditor
        value={avatarConfig}
        onChange={setAvatarConfig}
        seedFallback={userId}
        loreleiSaveAllowed={loreleiSaveAllowed}
        onSaveAvatar={() => {
          setAvatarSaved(false);
          saveAvatarMutation.mutate();
        }}
        saveAvatarPending={saveAvatarMutation.isPending}
        saveAvatarError={saveAvatarMutation.error}
        saveAvatarSuccess={avatarSaved}
      />

      <section
        className="space-y-3 rounded-xl border border-amber-900/10 bg-amber-50/40 p-4"
        aria-labelledby="my-ratings-heading"
      >
        <h2
          id="my-ratings-heading"
          className="text-sm font-semibold text-amber-950"
        >
          내가 매긴 게임 별점
        </h2>
        {gamesLoading ? (
          <p className="text-sm text-amber-900/70">불러오는 중…</p>
        ) : myRatedGames.length === 0 ? (
          <p className="text-sm text-amber-800/85">
            아직 별점을 남긴 게임이 없습니다.{" "}
            <Link
              href="/games"
              className="font-medium text-amber-900 underline underline-offset-2"
            >
              게임 목록
            </Link>
            에서 별점을 남겨 보세요.
          </p>
        ) : (
          <ul className="space-y-2 text-sm" role="list">
            {myRatedGames.map((g) => (
              <li
                key={g.id}
                className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1 border-b border-amber-900/10 pb-2 last:border-0 last:pb-0"
              >
                <Link
                  href={`/games?q=${encodeURIComponent(g.name)}`}
                  className="min-w-0 font-medium text-amber-950 underline decoration-amber-900/25 underline-offset-2 hover:text-amber-900"
                >
                  {g.name}
                </Link>
                <span
                  className="shrink-0 tabular-nums text-amber-900/90"
                  aria-label={`${g.myRating}점`}
                >
                  {"★".repeat(g.myRating ?? 0)}
                  <span className="ml-1 text-amber-800/70">({g.myRating}/5)</span>
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <fieldset className="min-w-0">
        <legend className={`${labelClass} px-0`}>해 본 게임</legend>
        <p className="mt-1 text-xs text-amber-800/75">
          플레이해 본 게임은 스위치로 표시합니다. 게임 목록과 동일한 기록이에요.
        </p>
        {gamesLoading ? (
          <p className="mt-3 text-sm text-amber-900/70">불러오는 중…</p>
        ) : games.length === 0 ? (
          <p className="mt-3 text-sm text-amber-800/80">
            등록된 게임이 없습니다.{" "}
            <Link href="/games/new" className="font-medium text-amber-900 underline">
              게임 추가
            </Link>
            후 표시할 수 있어요.
          </p>
        ) : (
          <>
            <input
              type="search"
              value={playedGameFilter}
              onChange={(e) => setPlayedGameFilter(e.target.value)}
              placeholder="게임 이름 검색…"
              className={`${inputClass} mt-2`}
              aria-label="해 본 게임 검색"
            />
            <div className="mt-2 max-h-72 overflow-y-auto rounded-lg border border-amber-900/15 bg-white/90 p-2">
              <ul className="space-y-0.5" role="list">
                {filteredGamesForPlayed.map((g) => (
                  <li key={g.id}>
                    <div
                      className={[
                        "flex items-center justify-between gap-3 rounded-lg px-2 py-2 text-sm text-amber-950 transition-colors",
                        g.myPlayed
                          ? "bg-emerald-50/50 ring-1 ring-emerald-600/15"
                          : "hover:bg-amber-50/70",
                      ].join(" ")}
                    >
                      <span className="min-w-0 flex-1 leading-snug">{g.name}</span>
                      <PlayedToggle
                        played={g.myPlayed}
                        onToggle={(next) =>
                          playedMutation.mutate({
                            gameId: g.id,
                            played: next,
                          })
                        }
                        size="sm"
                      />
                    </div>
                  </li>
                ))}
              </ul>
              {filteredGamesForPlayed.length === 0 && (
                <p className="px-2 py-3 text-center text-sm text-amber-800/70">
                  검색 결과가 없습니다.
                </p>
              )}
            </div>
            <p className="mt-2 text-xs tabular-nums text-amber-900/55">
              해 봄 {myPlayedGames.length}개
              {playedGameFilter.trim()
                ? ` · 표시 ${filteredGamesForPlayed.length}개`
                : ""}
            </p>
            {playedMutation.isError ? (
              <p className="mt-2 text-sm text-red-700" role="alert">
                {playedMutation.error instanceof Error
                  ? playedMutation.error.message
                  : "저장에 실패했습니다."}
              </p>
            ) : null}
          </>
        )}
      </fieldset>

      <fieldset className="min-w-0">
        <legend className={`${labelClass} px-0`}>선호 장르</legend>
        <p className="mt-1 text-xs text-amber-800/75">
          현재 게임 목록에 등록된 장르 중에서 고릅니다. (회원 목록에 그대로
          표시됩니다)
        </p>
        {orphanedGenreNames.length > 0 && (
          <p className="mt-2 text-xs text-amber-800/80">
            아래는 예전에 저장됐지만 현재 목록에 없는 항목입니다. 저장하면
            제외됩니다: {orphanedGenreNames.join(", ")}
          </p>
        )}
        <input
          type="search"
          value={genreFilter}
          onChange={(e) => setGenreFilter(e.target.value)}
          placeholder="장르 검색…"
          className={`${inputClass} mt-2`}
          aria-label="선호 장르 검색"
        />
        {gamesLoading ? (
          <p className="mt-3 text-sm text-amber-900/70">게임 목록 불러오는 중…</p>
        ) : genreOptions.length === 0 ? (
          <p className="mt-3 text-sm text-amber-800/80">
            등록된 게임의 장르가 없습니다.{" "}
            <Link href="/games/new" className="font-medium text-amber-900 underline">
              게임 추가
            </Link>
            시 장르를 넣어 주시면 여기서 선택할 수 있어요.
          </p>
        ) : (
          <div className="mt-2 max-h-56 overflow-y-auto rounded-lg border border-amber-900/15 bg-white/90 p-2">
            <ul className="space-y-1" role="list">
              {filteredGenres.map((name) => {
                const checked = genreSelected.has(name);
                return (
                  <li key={name}>
                    <label className="flex cursor-pointer items-start gap-2 rounded-md px-2 py-1.5 text-sm text-amber-950 hover:bg-amber-50/80 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-amber-400/40">
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleGenre(name)}
                        className="mt-0.5 shrink-0 rounded border-amber-900/30"
                      />
                      <span className="leading-snug">{name}</span>
                    </label>
                  </li>
                );
              })}
            </ul>
            {filteredGenres.length === 0 && (
              <p className="px-2 py-3 text-center text-sm text-amber-800/70">
                검색 결과가 없습니다.
              </p>
            )}
          </div>
        )}
        <p className="mt-2 text-xs tabular-nums text-amber-900/55">
          선택 {genreSelected.size}개
          {genreFilter.trim() ? ` · 표시 ${filteredGenres.length}개` : ""}
        </p>
        <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-amber-900/10 pt-3">
          <button
            type="button"
            disabled={gamesLoading || saveGenresMutation.isPending}
            onClick={() => {
              setSavedGenres(false);
              saveGenresMutation.mutate();
            }}
            className={sectionSaveBtnClass}
          >
            {saveGenresMutation.isPending ? "저장 중…" : "선호 장르 저장"}
          </button>
          {savedGenres ? (
            <p className="text-sm text-emerald-800" role="status">
              저장했습니다.
            </p>
          ) : null}
          {saveGenresMutation.isError ? (
            <p className="text-sm text-red-700" role="alert">
              {saveGenresMutation.error instanceof Error
                ? saveGenresMutation.error.message
                : "저장에 실패했습니다."}
            </p>
          ) : null}
        </div>
      </fieldset>

      <fieldset className="min-w-0">
        <legend className={`${labelClass} px-0`}>플레이 스타일</legend>
        <p className="mt-1 text-xs text-amber-800/75">
          자주 플레이하는 분위기·길이 등을 고릅니다.
        </p>
        {orphanedPlayStyleNames.length > 0 && (
          <p className="mt-2 text-xs text-amber-800/80">
            아래는 예전에 저장됐지만 현재 선택지에 없는 항목입니다. 저장하면
            제외됩니다: {orphanedPlayStyleNames.join(", ")}
          </p>
        )}
        <input
          type="search"
          value={playStyleFilter}
          onChange={(e) => setPlayStyleFilter(e.target.value)}
          placeholder="플레이 스타일 검색…"
          className={`${inputClass} mt-2`}
          aria-label="플레이 스타일 검색"
        />
        <div className="mt-2 max-h-56 overflow-y-auto rounded-lg border border-amber-900/15 bg-white/90 p-2">
          <ul className="space-y-1" role="list">
            {filteredPlayStyles.map((name) => {
              const checked = playStyleSelected.has(name);
              return (
                <li key={name}>
                  <label className="flex cursor-pointer items-start gap-2 rounded-md px-2 py-1.5 text-sm text-amber-950 hover:bg-amber-50/80 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-amber-400/40">
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => togglePlayStyle(name)}
                      className="mt-0.5 shrink-0 rounded border-amber-900/30"
                    />
                    <span className="leading-snug">{name}</span>
                  </label>
                </li>
              );
            })}
          </ul>
          {filteredPlayStyles.length === 0 && (
            <p className="px-2 py-3 text-center text-sm text-amber-800/70">
              검색 결과가 없습니다.
            </p>
          )}
        </div>
        <p className="mt-2 text-xs tabular-nums text-amber-900/55">
          선택 {playStyleSelected.size}개
          {playStyleFilter.trim()
            ? ` · 표시 ${filteredPlayStyles.length}개`
            : ""}
        </p>
        <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-amber-900/10 pt-3">
          <button
            type="button"
            disabled={savePlayStylesMutation.isPending}
            onClick={() => {
              setSavedPlayStyles(false);
              savePlayStylesMutation.mutate();
            }}
            className={sectionSaveBtnClass}
          >
            {savePlayStylesMutation.isPending ? "저장 중…" : "플레이 스타일 저장"}
          </button>
          {savedPlayStyles ? (
            <p className="text-sm text-emerald-800" role="status">
              저장했습니다.
            </p>
          ) : null}
          {savePlayStylesMutation.isError ? (
            <p className="text-sm text-red-700" role="alert">
              {savePlayStylesMutation.error instanceof Error
                ? savePlayStylesMutation.error.message
                : "저장에 실패했습니다."}
            </p>
          ) : null}
        </div>
      </fieldset>

      <fieldset className="min-w-0">
        <legend className={`${labelClass} px-0`}>룰마스터 가능한 게임</legend>
        <p className="mt-1 text-xs text-amber-800/75">
          게임 목록에서 설명할 수 있는 게임을 고릅니다. 게임 추천·목록의
          룰마스터 표시에 쓰입니다.
        </p>
        {orphanedRuleNames.length > 0 && (
          <p className="mt-2 text-xs text-amber-800/80">
            아래는 예전에 저장됐지만 현재 목록에 없는 이름입니다. 저장하면
            제외됩니다: {orphanedRuleNames.join(", ")}
          </p>
        )}
        <input
          type="search"
          value={ruleGameFilter}
          onChange={(e) => setRuleGameFilter(e.target.value)}
          placeholder="게임 이름 검색…"
          className={`${inputClass} mt-2`}
          aria-label="룰마스터 게임 검색"
        />
        {gamesLoading ? (
          <p className="mt-3 text-sm text-amber-900/70">게임 목록 불러오는 중…</p>
        ) : games.length === 0 ? (
          <p className="mt-3 text-sm text-amber-800/80">
            등록된 게임이 없습니다.{" "}
            <Link href="/games/new" className="font-medium text-amber-900 underline">
              게임 추가
            </Link>
            후 선택할 수 있어요.
          </p>
        ) : (
          <div className="mt-2 max-h-72 overflow-y-auto rounded-lg border border-amber-900/15 bg-white/90 p-2">
            <ul className="space-y-1" role="list">
              {filteredGames.map((g) => {
                const checked = ruleMasterSelected.has(g.name);
                return (
                  <li key={g.id}>
                    <label className="flex cursor-pointer items-start gap-2 rounded-md px-2 py-1.5 text-sm text-amber-950 hover:bg-amber-50/80 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-amber-400/40">
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleRuleGame(g.name)}
                        className="mt-0.5 shrink-0 rounded border-amber-900/30"
                      />
                      <span className="leading-snug">{g.name}</span>
                    </label>
                  </li>
                );
              })}
            </ul>
            {filteredGames.length === 0 && (
              <p className="px-2 py-3 text-center text-sm text-amber-800/70">
                검색 결과가 없습니다.
              </p>
            )}
          </div>
        )}
        <p className="mt-2 text-xs tabular-nums text-amber-900/55">
          선택 {ruleMasterSelected.size}개
          {ruleGameFilter.trim() ? ` · 표시 ${filteredGames.length}개` : ""}
        </p>
        <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-amber-900/10 pt-3">
          <button
            type="button"
            disabled={gamesLoading || saveRuleGamesMutation.isPending}
            onClick={() => {
              setSavedRuleGames(false);
              saveRuleGamesMutation.mutate();
            }}
            className={sectionSaveBtnClass}
          >
            {saveRuleGamesMutation.isPending ? "저장 중…" : "룰마스터 목록 저장"}
          </button>
          {savedRuleGames ? (
            <p className="text-sm text-emerald-800" role="status">
              저장했습니다.
            </p>
          ) : null}
          {saveRuleGamesMutation.isError ? (
            <p className="text-sm text-red-700" role="alert">
              {saveRuleGamesMutation.error instanceof Error
                ? saveRuleGamesMutation.error.message
                : "저장에 실패했습니다."}
            </p>
          ) : null}
        </div>
      </fieldset>

      <div className="flex flex-wrap gap-3 border-t border-amber-900/10 pt-4">
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

"use client";

import { useAuth } from "@/components/auth-provider";
import { Select } from "@/components/ui/select";
import { GameGenreMultiPicker } from "@/components/game-genre-multi-picker";
import { fetchGameById, fetchGames } from "@/lib/games-api";
import { getGenreOptionsForPicker } from "@/lib/game-genre-tags";
import { parseMinPlayersInput } from "@/lib/parse-min-players";
import { parseMaxPlayersInput } from "@/lib/parse-max-players";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Game } from "@/types/game";
import { useEffect, useMemo, useState } from "react";

type Props = { gameId: string };

function maxDigitsFromGame(game: Game): string {
  if (game.maxPlayersKind === "number" || game.maxPlayersKind === "min_plus") {
    if (game.maxPlayers != null) {
      const n =
        typeof game.maxPlayers === "number"
          ? game.maxPlayers
          : Number(String(game.maxPlayers).replace(/[^\d]/g, ""));
      return Number.isFinite(n) ? String(n) : "";
    }
    return "";
  }
  if (game.maxPlayersKind === "text" && game.maxPlayers != null) {
    return String(game.maxPlayers).replace(/\D/g, "");
  }
  return "";
}

export function EditGameForm({ gameId }: Props) {
  const { supabase, session, loading } = useAuth();
  const router = useRouter();
  const queryClient = useQueryClient();

  const [name, setName] = useState("");
  const [difficulty, setDifficulty] = useState("1");
  const [genres, setGenres] = useState<string[]>([]);
  const [minPlayers, setMinPlayers] = useState("");
  const [maxDigits, setMaxDigits] = useState("");
  const [maxIsMinPlus, setMaxIsMinPlus] = useState(false);
  const [beginner, setBeginner] = useState(true);
  const [notes, setNotes] = useState("");
  const [extraNotes, setExtraNotes] = useState("");

  const viewerKey = session?.user.id ?? "anon";

  const { data: game, isPending } = useQuery({
    queryKey: ["game", gameId, viewerKey],
    queryFn: () => {
      if (!supabase) throw new Error("데이터를 불러올 수 없습니다.");
      return fetchGameById(supabase, gameId, {
        viewerUserId: session?.user.id,
      });
    },
    enabled: !!supabase && !!gameId,
    staleTime: 30 * 1000,
  });

  const { data: allGames = [] } = useQuery({
    queryKey: ["games", viewerKey],
    queryFn: () => {
      if (!supabase) throw new Error("데이터를 불러올 수 없습니다.");
      return fetchGames(supabase, { viewerUserId: session?.user.id });
    },
    enabled: !!supabase,
    staleTime: 30 * 1000,
  });
  const genreOptions = useMemo(
    () => getGenreOptionsForPicker(allGames),
    [allGames],
  );

  useEffect(() => {
    if (!game) return;
    setName(game.name);
    setDifficulty(String(game.difficulty ?? 1));
    setGenres([...game.genres]);
    setMinPlayers(
      game.minPlayers != null ? String(game.minPlayers) : "",
    );
    setMaxDigits(maxDigitsFromGame(game));
    setMaxIsMinPlus(game.maxPlayersKind === "min_plus");
    setBeginner(game.beginnerFriendly);
    setNotes(game.notes);
    setExtraNotes(game.extraNotes);
  }, [game]);

  const updateMutation = useMutation({
    mutationFn: async () => {
      if (!supabase || !session) throw new Error("로그인 필요");
      const maxCombined =
        maxIsMinPlus && maxDigits.trim()
          ? `${maxDigits.trim()}이상`
          : maxDigits.trim();
      const parsed = parseMaxPlayersInput(maxCombined);
      const minP = parseMinPlayersInput(minPlayers);
      const trimmedMax = maxCombined;
      const { error: err } = await supabase
        .from("games")
        .update({
          name: name.trim(),
          difficulty: Number(difficulty),
          genres,
          min_players: minP,
          max_players_raw: trimmedMax || null,
          max_players_kind: parsed.maxPlayersKind,
          max_players_value: parsed.maxPlayersValue,
          beginner_friendly: beginner,
          notes: notes.trim(),
          extra_notes: extraNotes.trim(),
        })
        .eq("id", gameId);
      if (err) throw err;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["games"] });
      await queryClient.invalidateQueries({ queryKey: ["game", gameId] });
      router.push("/games");
      router.refresh();
    },
  });

  if (loading || !supabase) {
    return (
      <p className="text-sm text-amber-900/70">
        {!supabase ? "연결을 확인할 수 없습니다." : "세션 확인 중…"}
      </p>
    );
  }

  if (!session) {
    return (
      <div className="rounded-xl border border-amber-900/15 bg-white/70 p-6 text-amber-900">
        <p>게임을 수정하려면 로그인이 필요합니다.</p>
        <Link
          href="/auth/login"
          className="mt-3 inline-block text-sm font-medium text-amber-800 underline"
        >
          로그인하기
        </Link>
      </div>
    );
  }

  if (isPending) {
    return <p className="text-amber-900/70">불러오는 중…</p>;
  }

  if (!game) {
    return (
      <p className="text-sm text-amber-900">
        게임을 찾을 수 없습니다.{" "}
        <Link href="/games" className="font-medium text-amber-800 underline">
          목록으로
        </Link>
      </p>
    );
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    updateMutation.mutate();
  }

  return (
    <form
      onSubmit={onSubmit}
      className="w-full max-w-xl space-y-4 rounded-xl border border-amber-900/10 bg-white/80 p-4 shadow-sm sm:p-6"
    >
      <label className="block text-sm">
        <span className="text-amber-900/70">게임명 *</span>
        <input
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1 w-full rounded-lg border border-amber-900/15 px-3 py-2 text-amber-950"
        />
      </label>
      <label className="block text-sm sm:max-w-xs">
        <span className="text-amber-900/70">난이도 (1–4)</span>
        <Select
          className="mt-1"
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value)}
        >
          {[1, 2, 3, 4].map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </Select>
      </label>
      <fieldset className="min-w-0">
        <legend className="text-sm text-amber-900/70">장르</legend>
        <p className="mt-1 text-xs text-amber-800/75">
          목록에서 태그를 고릅니다. (여러 개 선택 가능)
        </p>
        <div className="mt-2">
          <GameGenreMultiPicker
            value={genres}
            onChange={setGenres}
            options={genreOptions}
          />
        </div>
      </fieldset>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm">
          <span className="text-amber-900/70">최소 인원</span>
          <input
            inputMode="numeric"
            value={minPlayers}
            onChange={(e) =>
              setMinPlayers(e.target.value.replace(/\D/g, ""))
            }
            className="mt-1 w-full rounded-lg border border-amber-900/15 px-3 py-2 text-amber-950"
            placeholder="비워 두면 미기재"
          />
        </label>
        <div className="space-y-2">
          <label className="block text-sm">
            <span className="text-amber-900/70">최대 인원</span>
            <input
              inputMode="numeric"
              value={maxDigits}
              onChange={(e) =>
                setMaxDigits(e.target.value.replace(/\D/g, ""))
              }
              className="mt-1 w-full rounded-lg border border-amber-900/15 px-3 py-2 text-amber-950"
              placeholder="숫자만. 비우면 미기재"
            />
          </label>
          <label className="flex cursor-pointer items-center gap-2 text-sm text-amber-900/85">
            <input
              type="checkbox"
              checked={maxIsMinPlus}
              onChange={(e) => setMaxIsMinPlus(e.target.checked)}
              className="rounded border-amber-900/30"
            />
            <span>이 숫자를 «N명 이상»으로 저장 (상한 없음)</span>
          </label>
        </div>
      </div>
      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={beginner}
          onChange={(e) => setBeginner(e.target.checked)}
          className="rounded border-amber-900/30"
        />
        <span className="text-amber-900/80">입문용</span>
      </label>
      <label className="block text-sm">
        <span className="text-amber-900/70">비고</span>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={2}
          className="mt-1 w-full rounded-lg border border-amber-900/15 px-3 py-2 text-amber-950"
        />
      </label>
      <label className="block text-sm">
        <span className="text-amber-900/70">추가 메모</span>
        <textarea
          value={extraNotes}
          onChange={(e) => setExtraNotes(e.target.value)}
          rows={2}
          className="mt-1 w-full rounded-lg border border-amber-900/15 px-3 py-2 text-amber-950"
        />
      </label>
      {updateMutation.isError && (
        <p className="text-sm text-red-700" role="alert">
          {updateMutation.error instanceof Error
            ? updateMutation.error.message
            : "저장에 실패했습니다."}
        </p>
      )}
      <div className="flex flex-wrap gap-3 pt-2">
        <button
          type="submit"
          disabled={updateMutation.isPending}
          className="rounded-full bg-amber-900 px-5 py-2 text-sm font-medium text-amber-50 hover:bg-amber-800 disabled:opacity-60"
        >
          {updateMutation.isPending ? "저장 중…" : "저장"}
        </button>
        <Link
          href="/games"
          className="rounded-full border border-amber-900/20 px-5 py-2 text-sm text-amber-950 hover:bg-amber-50"
        >
          취소
        </Link>
      </div>
    </form>
  );
}

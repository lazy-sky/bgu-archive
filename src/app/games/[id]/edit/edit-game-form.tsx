"use client";

import { useAuth } from "@/components/auth-provider";
import { fetchGameById } from "@/lib/games-api";
import { fetchProfile } from "@/lib/profile-api";
import { parseMaxPlayersInput } from "@/lib/parse-max-players";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type Props = { gameId: string };

function maxPlayersFieldValue(raw: string | number | null | undefined): string {
  if (raw == null || raw === "") return "";
  return String(raw);
}

export function EditGameForm({ gameId }: Props) {
  const { supabase, session, loading } = useAuth();
  const router = useRouter();
  const queryClient = useQueryClient();

  const [name, setName] = useState("");
  const [difficulty, setDifficulty] = useState("1");
  const [genre, setGenre] = useState("");
  const [maxPlayers, setMaxPlayers] = useState("");
  const [beginner, setBeginner] = useState(true);
  const [notes, setNotes] = useState("");
  const [extraNotes, setExtraNotes] = useState("");

  const { data: game, isPending } = useQuery({
    queryKey: ["game", gameId],
    queryFn: () => {
      if (!supabase) throw new Error("데이터를 불러올 수 없습니다.");
      return fetchGameById(supabase, gameId);
    },
    enabled: !!supabase && !!gameId,
    staleTime: 30 * 1000,
  });

  const { data: myProfile } = useQuery({
    queryKey: ["profile", session?.user.id],
    queryFn: async () => {
      if (!supabase || !session?.user.id) return null;
      return fetchProfile(supabase, session.user.id);
    },
    enabled: !!supabase && !!session?.user.id,
    staleTime: 30 * 1000,
  });
  const isAdmin = myProfile?.is_admin ?? false;

  useEffect(() => {
    if (!game) return;
    setName(game.name);
    setDifficulty(String(game.difficulty ?? 1));
    setGenre(game.genre);
    setMaxPlayers(maxPlayersFieldValue(game.maxPlayersRaw));
    setBeginner(game.beginnerFriendly);
    setNotes(game.notes);
    setExtraNotes(game.extraNotes);
  }, [game]);

  const updateMutation = useMutation({
    mutationFn: async () => {
      if (!supabase || !session) throw new Error("로그인 필요");
      const parsed = parseMaxPlayersInput(maxPlayers);
      const trimmedMax = maxPlayers.trim();
      const { error: err } = await supabase
        .from("games")
        .update({
          name: name.trim(),
          difficulty: Number(difficulty),
          genre: genre.trim(),
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

  if (!isAdmin && game.addedBy !== session.user.id) {
    return (
      <div className="rounded-xl border border-amber-900/15 bg-amber-50/80 p-6 text-amber-900">
        <p>이 게임은 등록한 사람만 수정할 수 있습니다.</p>
        <Link
          href="/games"
          className="mt-3 inline-block text-sm font-medium text-amber-800 underline"
        >
          게임 목록으로
        </Link>
      </div>
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
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm">
          <span className="text-amber-900/70">난이도 (1–4)</span>
          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            className="mt-1 w-full rounded-lg border border-amber-900/15 px-3 py-2 text-amber-950"
          >
            {[1, 2, 3, 4].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-sm">
          <span className="text-amber-900/70">장르</span>
          <input
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
            className="mt-1 w-full rounded-lg border border-amber-900/15 px-3 py-2 text-amber-950"
            placeholder="예: 파티"
          />
        </label>
      </div>
      <label className="block text-sm">
        <span className="text-amber-900/70">최대 인원</span>
        <input
          value={maxPlayers}
          onChange={(e) => setMaxPlayers(e.target.value)}
          className="mt-1 w-full rounded-lg border border-amber-900/15 px-3 py-2 text-amber-950"
          placeholder="예: 4, 11이상, --"
        />
      </label>
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

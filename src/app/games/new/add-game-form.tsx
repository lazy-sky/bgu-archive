"use client";

import { useAuth } from "@/components/auth-provider";
import { parseMaxPlayersInput } from "@/lib/parse-max-players";
import { useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function AddGameForm() {
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
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  if (loading) {
    return <p className="text-amber-900/70">세션 확인 중…</p>;
  }

  if (!supabase) {
    return (
      <p className="text-sm text-amber-900">
        지금은 게임을 등록할 수 없습니다. 잠시 후 다시 시도해 주세요.
      </p>
    );
  }

  if (!session) {
    return (
      <div className="rounded-xl border border-amber-900/15 bg-white/70 p-6 text-amber-900">
        <p>게임을 추가하려면 로그인이 필요합니다.</p>
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
    if (!supabase || !session) return;
    setError(null);
    const parsed = parseMaxPlayersInput(maxPlayers);
    setPending(true);
    const trimmedMax = maxPlayers.trim();
    const { error: err } = await supabase.from("games").insert({
      name: name.trim(),
      difficulty: Number(difficulty),
      genre: genre.trim(),
      max_players_raw: trimmedMax || null,
      max_players_kind: parsed.maxPlayersKind,
      max_players_value: parsed.maxPlayersValue,
      beginner_friendly: beginner,
      notes: notes.trim(),
      extra_notes: extraNotes.trim(),
      added_by: session.user.id,
    });
    setPending(false);
    if (err) {
      setError(err.message);
      return;
    }
    await queryClient.invalidateQueries({ queryKey: ["games"] });
    router.push("/games");
    router.refresh();
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
      {error && (
        <p className="text-sm text-red-700" role="alert">
          {error}
        </p>
      )}
      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={pending}
          className="rounded-full bg-amber-900 px-5 py-2 text-sm font-medium text-amber-50 hover:bg-amber-800 disabled:opacity-60"
        >
          {pending ? "저장 중…" : "등록"}
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

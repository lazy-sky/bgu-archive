import type { Game, MaxPlayersKind } from "@/types/game";

export type DbGameRow = {
  id: string;
  name: string;
  difficulty: number | null;
  genres: string[];
  /** DB 컬럼명. 과거 오타 `min_player`만 있는 DB는 마이그레이션으로 정리 */
  min_players: number | null;
  min_player?: number | null;
  max_players_raw: string | null;
  max_players_kind: MaxPlayersKind;
  max_players_value: string | null;
  beginner_friendly: boolean;
  notes: string;
  extra_notes: string;
  added_by: string | null;
  profiles?: { display_name: string } | { display_name: string }[] | null;
};

function pickProfile(
  p: DbGameRow["profiles"],
): { display_name: string } | null {
  if (!p) return null;
  return Array.isArray(p) ? p[0] ?? null : p;
}

function parseMaxPlayersValue(row: DbGameRow): number | string | null {
  const { max_players_kind: kind, max_players_value: v } = row;
  if (v == null || v === "") {
    if (kind === "unknown") return null;
    return null;
  }
  if (kind === "number") {
    const n = Number(v);
    return Number.isNaN(n) ? v : n;
  }
  return v;
}

export function mapDbGameToGame(row: DbGameRow): Game {
  return {
    id: row.id,
    name: row.name,
    difficulty: row.difficulty,
    genres: Array.isArray(row.genres) ? row.genres : [],
    minPlayers: row.min_players ?? row.min_player ?? null,
    maxPlayersRaw: row.max_players_raw,
    maxPlayersKind: row.max_players_kind,
    maxPlayers: parseMaxPlayersValue(row),
    beginnerFriendly: row.beginner_friendly,
    notes: row.notes,
    extraNotes: row.extra_notes,
    addedBy: row.added_by ?? null,
    addedByName: pickProfile(row.profiles)?.display_name ?? null,
    ratingAvg: null,
    ratingCount: 0,
    myRating: null,
  };
}

import type { Game } from "@/types/game";

function toNum(v: number | string | null): number | null {
  if (v == null || v === "") return null;
  const x = typeof v === "number" ? v : Number(String(v).replace(",", ""));
  return Number.isNaN(x) ? null : x;
}

/** 플레이 인원 하한: min_players 컬럼과, min_plus(○명 이상) 표기를 함께 반영 */
function lowerBoundPlayers(game: Game): number {
  let lo = game.minPlayers ?? 1;
  if (game.maxPlayersKind === "min_plus") {
    const m = toNum(game.maxPlayers);
    if (m != null) lo = Math.max(lo, m);
  }
  return lo;
}

/**
 * 인원 n명으로 플레이 가능한지
 */
export function canAccommodatePlayerCount(game: Game, n: number): boolean {
  if (!Number.isFinite(n) || n < 1) return false;

  if (n < lowerBoundPlayers(game)) return false;

  switch (game.maxPlayersKind) {
    case "number": {
      const max = toNum(game.maxPlayers);
      if (max == null) return true;
      return n <= max;
    }
    case "min_plus": {
      return true;
    }
    case "unknown":
    case "text":
      return true;
    default:
      return true;
  }
}

import type { Game } from "@/types/game";

/**
 * 인원 n명으로 플레이 가능한지 (엑셀에 최소 인원이 없어 최소는 1로 가정)
 */
export function canAccommodatePlayerCount(game: Game, n: number): boolean {
  if (!Number.isFinite(n) || n < 1) return false;

  switch (game.maxPlayersKind) {
    case "number": {
      const max = toNum(game.maxPlayers);
      if (max == null) return true;
      return n <= max;
    }
    case "min_plus": {
      const min = toNum(game.maxPlayers);
      if (min == null) return true;
      return n >= min;
    }
    case "unknown":
    case "text":
      return true;
    default:
      return true;
  }
}

function toNum(v: number | string | null): number | null {
  if (v == null || v === "") return null;
  const x = typeof v === "number" ? v : Number(String(v).replace(",", ""));
  return Number.isNaN(x) ? null : x;
}

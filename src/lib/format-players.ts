import type { Game } from "@/types/game";

function toNum(v: number | string | null): number | null {
  if (v == null || v === "") return null;
  const x = typeof v === "number" ? v : Number(String(v).replace(",", ""));
  return Number.isNaN(x) ? null : x;
}

/** 우측(최대) 구간만 — `3 ~ 8` 의 `8` 또는 `11명 이상` 등 */
function maxRangePart(game: Game): string {
  switch (game.maxPlayersKind) {
    case "number": {
      const max = toNum(game.maxPlayers);
      return max != null ? String(max) : "";
    }
    case "min_plus": {
      const m = toNum(game.maxPlayers);
      return m != null ? `${m}명 이상` : "";
    }
    case "unknown":
      return "";
    case "text":
      return game.maxPlayers != null ? String(game.maxPlayers) : "";
    default:
      return "";
  }
}

/**
 * 인원 범위 한 줄 표기 (예: `3 ~ 8`, `3 ~`, `~8`, `~11명 이상`).
 * 최소·최대 모두 없으면 `—`.
 */
export function formatPlayerRange(game: Game): string {
  const hasMin =
    game.minPlayers != null && Number.isFinite(game.minPlayers);
  const left = hasMin ? String(game.minPlayers) : "";
  const right = maxRangePart(game);

  if (!left && !right) return "—";
  if (left && right) return `${left} ~ ${right}`;
  if (left && !right) return `${left} ~`;
  return `~${right}`;
}

export function formatMinPlayers(game: Game): string {
  if (game.minPlayers != null && Number.isFinite(game.minPlayers)) {
    return `최소 ${game.minPlayers}명`;
  }
  return "—";
}

export function formatMaxPlayers(game: Game): string {
  switch (game.maxPlayersKind) {
    case "number":
      return game.maxPlayers != null ? `최대 ${game.maxPlayers}명` : "—";
    case "min_plus":
      return game.maxPlayers != null ? `${game.maxPlayers}명 이상` : "—";
    case "unknown":
      return "미기재";
    case "text":
      return game.maxPlayers != null ? String(game.maxPlayers) : "—";
    default:
      return "—";
  }
}

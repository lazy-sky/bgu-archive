import type { Game } from "@/types/game";

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

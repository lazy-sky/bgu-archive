import type { Game } from "@/types/game";

/** 엑셀에 최소 인원 컬럼이 없어 UI에서는 미기재로 둡니다. */
export function formatMinPlayers(): string {
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

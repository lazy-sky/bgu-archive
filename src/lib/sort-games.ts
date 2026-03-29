import type { Game } from "@/types/game";

export type GameSortMode =
  | "name_asc"
  | "difficulty_desc"
  | "difficulty_asc"
  | "players_desc"
  | "players_asc"
  | "rating_desc"
  | "rating_asc"
  | "play_count_desc";

function toNum(v: number | string | null): number | null {
  if (v == null || v === "") return null;
  const x = typeof v === "number" ? v : Number(String(v).replace(",", ""));
  return Number.isNaN(x) ? null : x;
}

/** 인원(많은 순): 고정 상한이 클수록 앞; «N명 이상»은 상한 없음으로 더 앞; 미기재는 뒤 */
function sortKeyPlayersDesc(game: Game): number {
  switch (game.maxPlayersKind) {
    case "number": {
      const m = toNum(game.maxPlayers);
      return m != null ? m : -1;
    }
    case "min_plus": {
      const n = toNum(game.maxPlayers);
      return 1_000_000 + (n ?? 0);
    }
    case "unknown":
    case "text":
      return -1;
    default:
      return -1;
  }
}

/** 인원(적은 순): 고정 상한이 작을수록 앞; 상한 없음·미기재는 뒤 */
function sortKeyPlayersAsc(game: Game): number {
  switch (game.maxPlayersKind) {
    case "number": {
      const m = toNum(game.maxPlayers);
      return m != null ? m : Number.MAX_SAFE_INTEGER;
    }
    case "min_plus":
      return Number.MAX_SAFE_INTEGER - 1;
    case "unknown":
    case "text":
      return Number.MAX_SAFE_INTEGER;
    default:
      return Number.MAX_SAFE_INTEGER;
  }
}

function compareName(a: Game, b: Game): number {
  return a.name.localeCompare(b.name, "ko");
}

export function sortGames(list: Game[], mode: GameSortMode): Game[] {
  const out = [...list];
  out.sort((a, b) => {
    let c = 0;
    switch (mode) {
      case "name_asc":
        c = compareName(a, b);
        break;
      case "difficulty_desc": {
        const da = a.difficulty ?? -1;
        const db = b.difficulty ?? -1;
        c = db - da;
        break;
      }
      case "difficulty_asc": {
        const da = a.difficulty ?? 99;
        const db = b.difficulty ?? 99;
        c = da - db;
        break;
      }
      case "players_desc": {
        c = sortKeyPlayersDesc(b) - sortKeyPlayersDesc(a);
        break;
      }
      case "players_asc": {
        c = sortKeyPlayersAsc(a) - sortKeyPlayersAsc(b);
        break;
      }
      case "rating_desc": {
        const ka = a.ratingAvg ?? -1;
        const kb = b.ratingAvg ?? -1;
        c = kb - ka;
        break;
      }
      case "rating_asc": {
        const ka = a.ratingAvg ?? 999;
        const kb = b.ratingAvg ?? 999;
        c = ka - kb;
        break;
      }
      case "play_count_desc": {
        c = b.playedCount - a.playedCount;
        break;
      }
      default:
        c = 0;
    }
    if (c !== 0) return c;
    return compareName(a, b);
  });
  return out;
}

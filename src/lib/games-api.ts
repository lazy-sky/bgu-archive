import type { DbGameRow } from "@/lib/game-mapper";
import { mapDbGameToGame } from "@/lib/game-mapper";
import { mergeGamePlays } from "@/lib/game-plays-api";
import { mergeGameRatings } from "@/lib/game-ratings-api";
import type { Game } from "@/types/game";
import type { SupabaseClient } from "@supabase/supabase-js";

export type FetchGamesOptions = {
  viewerUserId?: string | null;
};

/** added_by → profiles 만 조인. game_ratings 등으로 games↔profiles 경로가 늘어나면 PostgREST가 FK를 고르지 못함 */
const GAMES_SELECT_WITH_ADDER =
  "*, profiles!games_added_by_fkey(display_name)";

export async function fetchGames(
  supabase: SupabaseClient,
  options?: FetchGamesOptions,
): Promise<Game[]> {
  const { data, error } = await supabase
    .from("games")
    .select(GAMES_SELECT_WITH_ADDER)
    .order("name", { ascending: true });

  if (error) throw error;

  const games = (data ?? []).map((row) =>
    mapDbGameToGame(row as DbGameRow),
  );
  const rated = await mergeGameRatings(supabase, games, options?.viewerUserId);
  return mergeGamePlays(supabase, rated, options?.viewerUserId);
}

export async function fetchGameById(
  supabase: SupabaseClient,
  id: string,
  options?: FetchGamesOptions,
): Promise<Game | null> {
  const { data, error } = await supabase
    .from("games")
    .select(GAMES_SELECT_WITH_ADDER)
    .eq("id", id)
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;
  const game = mapDbGameToGame(data as DbGameRow);
  const [rated] = await mergeGameRatings(supabase, [game], options?.viewerUserId);
  const [merged] = await mergeGamePlays(
    supabase,
    rated ? [rated] : [],
    options?.viewerUserId,
  );
  return merged ?? null;
}

export function getGameGenres(gamesList: Game[]): string[] {
  const set = new Set<string>();
  for (const g of gamesList) {
    for (const x of g.genres) {
      const t = x?.trim();
      if (t) set.add(t);
    }
  }
  return [...set].sort((a, b) => a.localeCompare(b, "ko"));
}

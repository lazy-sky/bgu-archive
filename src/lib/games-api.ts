import type { DbGameRow } from "@/lib/game-mapper";
import { mapDbGameToGame } from "@/lib/game-mapper";
import type { Game } from "@/types/game";
import type { SupabaseClient } from "@supabase/supabase-js";

export async function fetchGames(supabase: SupabaseClient): Promise<Game[]> {
  const { data, error } = await supabase
    .from("games")
    .select("*, profiles(display_name)")
    .order("name", { ascending: true });

  if (error) throw error;

  return (data ?? []).map((row) =>
    mapDbGameToGame(row as DbGameRow),
  );
}

export async function fetchGameById(
  supabase: SupabaseClient,
  id: string,
): Promise<Game | null> {
  const { data, error } = await supabase
    .from("games")
    .select("*, profiles(display_name)")
    .eq("id", id)
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;
  return mapDbGameToGame(data as DbGameRow);
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

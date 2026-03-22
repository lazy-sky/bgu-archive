import type { Game } from "@/types/game";
import type { SupabaseClient } from "@supabase/supabase-js";

export async function fetchGameRatingStats(
  supabase: SupabaseClient,
): Promise<Map<string, { avgRating: number; ratingCount: number }>> {
  const { data, error } = await supabase.rpc("game_rating_stats");
  if (error) throw error;
  const map = new Map<string, { avgRating: number; ratingCount: number }>();
  for (const row of data ?? []) {
    const r = row as {
      game_id: string;
      avg_rating: number | string;
      rating_count: number | string;
    };
    map.set(r.game_id, {
      avgRating: Number(r.avg_rating),
      ratingCount: Number(r.rating_count),
    });
  }
  return map;
}

export async function fetchMyGameRatings(
  supabase: SupabaseClient,
  userId: string,
): Promise<Map<string, number>> {
  const { data, error } = await supabase
    .from("game_ratings")
    .select("game_id, rating")
    .eq("user_id", userId);
  if (error) throw error;
  const map = new Map<string, number>();
  for (const row of data ?? []) {
    map.set(row.game_id as string, row.rating as number);
  }
  return map;
}

export function applyGameRatingsToGames(
  games: Game[],
  stats: Map<string, { avgRating: number; ratingCount: number }>,
  myRatings: Map<string, number> | null,
): Game[] {
  return games.map((g) => ({
    ...g,
    ratingAvg: stats.get(g.id)?.avgRating ?? null,
    ratingCount: stats.get(g.id)?.ratingCount ?? 0,
    myRating: myRatings?.get(g.id) ?? null,
  }));
}

export async function mergeGameRatings(
  supabase: SupabaseClient,
  games: Game[],
  viewerUserId: string | null | undefined,
): Promise<Game[]> {
  const [stats, my] = await Promise.all([
    fetchGameRatingStats(supabase),
    viewerUserId
      ? fetchMyGameRatings(supabase, viewerUserId)
      : Promise.resolve(null as Map<string, number> | null),
  ]);
  return applyGameRatingsToGames(games, stats, my);
}

export async function upsertGameRating(
  supabase: SupabaseClient,
  userId: string,
  gameId: string,
  rating: number,
) {
  if (rating < 1 || rating > 5 || !Number.isInteger(rating)) {
    throw new Error("별점은 1~5 정수만 가능합니다.");
  }
  const { error } = await supabase.from("game_ratings").upsert(
    { user_id: userId, game_id: gameId, rating },
    { onConflict: "user_id,game_id" },
  );
  if (error) throw error;
}

export async function deleteGameRating(
  supabase: SupabaseClient,
  userId: string,
  gameId: string,
) {
  const { error } = await supabase
    .from("game_ratings")
    .delete()
    .eq("user_id", userId)
    .eq("game_id", gameId);
  if (error) throw error;
}

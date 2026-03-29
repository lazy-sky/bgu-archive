import type { Game } from "@/types/game";
import type { SupabaseClient } from "@supabase/supabase-js";

export async function fetchMyPlayedGameIds(
  supabase: SupabaseClient,
  userId: string,
): Promise<Set<string>> {
  const { data, error } = await supabase
    .from("game_plays")
    .select("game_id")
    .eq("user_id", userId);
  if (error) throw error;
  const set = new Set<string>();
  for (const row of data ?? []) {
    set.add(row.game_id as string);
  }
  return set;
}

export async function fetchGamePlayStats(
  supabase: SupabaseClient,
): Promise<Map<string, number>> {
  const { data, error } = await supabase.rpc("game_play_stats");
  if (error) throw error;
  const map = new Map<string, number>();
  for (const row of data ?? []) {
    const r = row as {
      game_id: string;
      play_count: number | string;
    };
    map.set(r.game_id, Number(r.play_count));
  }
  return map;
}

/** React Query 캐시에서 한 게임의 `myPlayed`만 즉시 바꿀 때 사용 */
export function patchGamesMyPlayed(
  games: Game[] | undefined,
  gameId: string,
  myPlayed: boolean,
): Game[] | undefined {
  if (!games) return games;
  return games.map((g) => {
    if (g.id !== gameId) return g;
    const prev = g.myPlayed;
    let nextCount = g.playedCount;
    if (myPlayed && !prev) nextCount += 1;
    else if (!myPlayed && prev) nextCount = Math.max(0, nextCount - 1);
    return { ...g, myPlayed, playedCount: nextCount };
  });
}

export async function mergeGamePlays(
  supabase: SupabaseClient,
  games: Game[],
  viewerUserId: string | null | undefined,
): Promise<Game[]> {
  const [stats, played] = await Promise.all([
    fetchGamePlayStats(supabase),
    viewerUserId
      ? fetchMyPlayedGameIds(supabase, viewerUserId)
      : Promise.resolve(null as Set<string> | null),
  ]);
  return games.map((g) => ({
    ...g,
    playedCount: stats.get(g.id) ?? 0,
    myPlayed: played?.has(g.id) ?? false,
  }));
}

export async function setGamePlayed(
  supabase: SupabaseClient,
  userId: string,
  gameId: string,
  played: boolean,
) {
  if (played) {
    const { error } = await supabase.from("game_plays").upsert(
      { user_id: userId, game_id: gameId },
      { onConflict: "user_id,game_id" },
    );
    if (error) throw error;
  } else {
    const { error } = await supabase
      .from("game_plays")
      .delete()
      .eq("user_id", userId)
      .eq("game_id", gameId);
    if (error) throw error;
  }
}

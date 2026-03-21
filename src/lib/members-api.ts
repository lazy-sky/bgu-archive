import type { Member } from "@/types/member";
import type { SupabaseClient } from "@supabase/supabase-js";

type ProfileRow = {
  id: string;
  display_name: string;
  mbti: string;
  favorite_genres: string[];
  favorite_game_types: string[];
  bio: string;
  rule_master_games: string[];
};

export async function fetchMembers(supabase: SupabaseClient): Promise<Member[]> {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .order("display_name", { ascending: true });

  if (error) throw error;

  return (data as ProfileRow[]).map((row) => ({
    id: row.id,
    displayName: row.display_name,
    mbti: row.mbti,
    favoriteGenres: row.favorite_genres ?? [],
    favoriteGameTypes: row.favorite_game_types ?? [],
    bio: row.bio,
    ruleMasterGames: row.rule_master_games ?? [],
  }));
}

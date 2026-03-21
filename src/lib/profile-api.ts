import type { SupabaseClient } from "@supabase/supabase-js";

export type ProfileRow = {
  display_name: string;
  is_admin: boolean;
  mbti: string;
  favorite_genres: string[];
  favorite_game_types: string[];
  bio: string;
  rule_master_games: string[];
};

export async function fetchProfile(
  supabase: SupabaseClient,
  userId: string,
): Promise<ProfileRow | null> {
  const { data, error } = await supabase
    .from("profiles")
    .select(
      "display_name, is_admin, mbti, favorite_genres, favorite_game_types, bio, rule_master_games",
    )
    .eq("id", userId)
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;

  return {
    display_name: data.display_name,
    is_admin: Boolean(data.is_admin),
    mbti: data.mbti ?? "",
    favorite_genres: data.favorite_genres ?? [],
    favorite_game_types: data.favorite_game_types ?? [],
    bio: data.bio ?? "",
    rule_master_games: data.rule_master_games ?? [],
  };
}

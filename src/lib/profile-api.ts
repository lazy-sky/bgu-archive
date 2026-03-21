import type { SupabaseClient } from "@supabase/supabase-js";

export type ProfileRow = {
  display_name: string;
  is_admin: boolean;
};

export async function fetchProfile(
  supabase: SupabaseClient,
  userId: string,
): Promise<ProfileRow | null> {
  const { data, error } = await supabase
    .from("profiles")
    .select("display_name, is_admin")
    .eq("id", userId)
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;

  return {
    display_name: data.display_name,
    is_admin: Boolean(data.is_admin),
  };
}

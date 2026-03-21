import type { SupporterRow } from "@/types/supporter";
import type { SupabaseClient } from "@supabase/supabase-js";

export async function fetchSupporters(
  supabase: SupabaseClient,
): Promise<SupporterRow[]> {
  const { data, error } = await supabase
    .from("supporters")
    .select("id, display_name, amount_krw, sort_order")
    .order("amount_krw", { ascending: false })
    .order("sort_order", { ascending: true });

  if (error) throw error;
  return (data ?? []) as SupporterRow[];
}

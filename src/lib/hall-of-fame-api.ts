import { parseAvatarConfig } from "@/lib/avatar-config";
import type {
  Achievement,
  AchievementBadge,
  HallOfFameEntry,
  Honoree,
} from "@/types/hall-of-fame";
import type { SupabaseClient } from "@supabase/supabase-js";

type AchievementRow = {
  id: string;
  title: string;
  description: string;
  sort_order: number;
  created_at: string;
};

type AwardRow = {
  achievement_id: string;
  user_id: string;
  awarded_at: string;
  profiles: {
    display_name: string;
    avatar_config?: unknown;
  } | null;
};

function pickNestedAchievement(
  raw: unknown,
): AchievementBadge | null {
  if (raw == null) return null;
  const o = Array.isArray(raw) ? raw[0] : raw;
  if (!o || typeof o !== "object") return null;
  const r = o as { id?: string; title?: string; sort_order?: number };
  if (!r.id || r.title == null) return null;
  return {
    id: r.id,
    title: r.title,
    sortOrder: r.sort_order ?? 0,
  };
}

/** user_id → 해당 회원이 받은 업적 배지 목록(정렬됨) */
export async function fetchAchievementBadgesByUser(
  supabase: SupabaseClient,
): Promise<Map<string, AchievementBadge[]>> {
  const { data, error } = await supabase.from("achievement_awards").select(
    "user_id, achievements ( id, title, sort_order )",
  );

  if (error) throw error;

  const map = new Map<string, AchievementBadge[]>();
  for (const row of data ?? []) {
    const uid = (row as { user_id: string }).user_id;
    const ach = pickNestedAchievement(
      (row as { achievements?: unknown }).achievements,
    );
    if (!ach) continue;
    const list = map.get(uid) ?? [];
    list.push(ach);
    map.set(uid, list);
  }
  for (const [, list] of map) {
    list.sort((a, b) =>
      a.sortOrder !== b.sortOrder
        ? a.sortOrder - b.sortOrder
        : a.title.localeCompare(b.title, "ko"),
    );
  }
  return map;
}

function pickNestedProfile(
  raw: unknown,
): { display_name: string; avatar_config?: unknown } | null {
  if (raw == null) return null;
  if (Array.isArray(raw)) {
    const p = raw[0] as { display_name?: string; avatar_config?: unknown } | undefined;
    if (!p?.display_name) return null;
    return { display_name: p.display_name, avatar_config: p.avatar_config };
  }
  const p = raw as { display_name?: string; avatar_config?: unknown };
  if (!p.display_name) return null;
  return { display_name: p.display_name, avatar_config: p.avatar_config };
}

export async function fetchAchievements(
  supabase: SupabaseClient,
): Promise<Achievement[]> {
  const { data, error } = await supabase
    .from("achievements")
    .select("id, title, description, sort_order, created_at")
    .order("sort_order", { ascending: true })
    .order("title", { ascending: true });

  if (error) throw error;

  return (data ?? []).map((row) => ({
    id: row.id,
    title: row.title,
    description: row.description ?? "",
    sortOrder: row.sort_order ?? 0,
    createdAt: row.created_at,
  }));
}

export async function fetchAchievementAwards(
  supabase: SupabaseClient,
): Promise<AwardRow[]> {
  const { data, error } = await supabase.from("achievement_awards").select(
    "achievement_id, user_id, awarded_at, profiles ( display_name, avatar_config )",
  );

  if (error) throw error;

  const rows = (data ?? []) as {
    achievement_id: string;
    user_id: string;
    awarded_at: string;
    profiles: unknown;
  }[];

  return rows.map((row) => ({
    achievement_id: row.achievement_id,
    user_id: row.user_id,
    awarded_at: row.awarded_at,
    profiles: pickNestedProfile(row.profiles),
  }));
}

function mapAwardToHonoree(row: AwardRow): Honoree | null {
  const p = row.profiles;
  if (!p) return null;
  return {
    userId: row.user_id,
    displayName: p.display_name,
    awardedAt: row.awarded_at,
    avatarConfig: parseAvatarConfig(p.avatar_config),
  };
}

export async function fetchHallOfFame(
  supabase: SupabaseClient,
): Promise<HallOfFameEntry[]> {
  const [achievements, rawAwards] = await Promise.all([
    fetchAchievements(supabase),
    fetchAchievementAwards(supabase),
  ]);

  const byAchievement = new Map<string, Honoree[]>();
  for (const a of rawAwards) {
    const h = mapAwardToHonoree(a);
    if (!h) continue;
    const list = byAchievement.get(a.achievement_id) ?? [];
    list.push(h);
    byAchievement.set(a.achievement_id, list);
  }

  for (const [, list] of byAchievement) {
    list.sort((x, y) =>
      x.displayName.localeCompare(y.displayName, "ko"),
    );
  }

  return achievements.map((ach) => ({
    ...ach,
    honorees: byAchievement.get(ach.id) ?? [],
  }));
}

export async function insertAchievement(
  supabase: SupabaseClient,
  input: { title: string; description: string; sortOrder: number },
): Promise<void> {
  const { error } = await supabase.from("achievements").insert({
    title: input.title.trim(),
    description: input.description.trim(),
    sort_order: input.sortOrder,
  });
  if (error) throw error;
}

export async function updateAchievement(
  supabase: SupabaseClient,
  id: string,
  input: { title: string; description: string; sortOrder: number },
): Promise<void> {
  const { error } = await supabase
    .from("achievements")
    .update({
      title: input.title.trim(),
      description: input.description.trim(),
      sort_order: input.sortOrder,
    })
    .eq("id", id);
  if (error) throw error;
}

export async function deleteAchievement(
  supabase: SupabaseClient,
  id: string,
): Promise<void> {
  const { error } = await supabase.from("achievements").delete().eq("id", id);
  if (error) throw error;
}

export async function insertAward(
  supabase: SupabaseClient,
  achievementId: string,
  userId: string,
): Promise<void> {
  const { error } = await supabase.from("achievement_awards").insert({
    achievement_id: achievementId,
    user_id: userId,
  });
  if (error) throw error;
}

export async function deleteAward(
  supabase: SupabaseClient,
  achievementId: string,
  userId: string,
): Promise<void> {
  const { error } = await supabase
    .from("achievement_awards")
    .delete()
    .eq("achievement_id", achievementId)
    .eq("user_id", userId);
  if (error) throw error;
}

/** 관리자 폼용: 다음 sort_order 제안값 */
export function nextSortOrder(achievements: Achievement[]): number {
  if (achievements.length === 0) return 0;
  return Math.max(...achievements.map((a) => a.sortOrder)) + 1;
}

import type { Member } from "@/types/member";

/** 게임명 → 룰 설명 가능한 회원 display_name 목록 */
export function buildRuleMastersByGameName(
  members: Member[],
): Map<string, string[]> {
  const map = new Map<string, string[]>();
  for (const m of members) {
    for (const raw of m.ruleMasterGames) {
      const name = raw.trim();
      if (!name) continue;
      const list = map.get(name) ?? [];
      if (!list.includes(m.displayName)) {
        list.push(m.displayName);
        list.sort((a, b) => a.localeCompare(b, "ko"));
      }
      map.set(name, list);
    }
  }
  return map;
}

import type { SupporterRow } from "@/types/supporter";

/**
 * 후원 감사 명단(supporters)에 표시 이름이 일치하고 후원 금액이 0보다 큰 경우에만
 * 로렐라이 아바타를 저장할 수 있게 합니다.
 */
export function canSaveLoreleiAvatar(
  displayName: string,
  supporters: SupporterRow[],
): boolean {
  const t = displayName.trim();
  if (!t) return false;
  return supporters.some(
    (s) => s.display_name.trim() === t && s.amount_krw > 0,
  );
}

export const LORELEI_SAVE_DENIED_MESSAGE =
  "해당 스타일은 후원 감사 명단에 이름이 올라가고 금액이 표시된 경우에만 저장할 수 있습니다. 다른 스타일로 바꾸거나, 후원 후 이름을 본명으로 설정해주세요.";

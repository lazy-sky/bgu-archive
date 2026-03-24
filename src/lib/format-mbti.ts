/** 프로필·회원 데이터: 공백 제거 후 대문자, 미입력이면 빈 문자열 */
export function normalizeMbti(raw: string | null | undefined): string {
  const t = String(raw ?? "").trim();
  return t ? t.toUpperCase() : "";
}

/** 목록·카드 표시: 없으면 — */
export function formatMbtiDisplay(raw: string | null | undefined): string {
  const n = normalizeMbti(raw);
  return n || "—";
}

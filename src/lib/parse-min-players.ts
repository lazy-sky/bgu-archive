/** 최소 인원: 양의 정수만 허용. 빈 문자열·잘못된 값 → null */
export function parseMinPlayersInput(input: string): number | null {
  const t = input.trim();
  if (!t) return null;
  const n = Number(String(t).replace(",", ""));
  if (!Number.isFinite(n)) return null;
  const i = Math.floor(n);
  if (i < 1) return null;
  return i;
}

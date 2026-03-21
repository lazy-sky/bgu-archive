/** 쉼표(영문·한글)로 구분된 문자열 → 공백 제거 후 배열 */
export function splitCommaList(s: string): string[] {
  return s
    .split(/[,，]/)
    .map((x) => x.trim())
    .filter(Boolean);
}

export function joinCommaList(arr: string[]): string {
  return arr.join(", ");
}

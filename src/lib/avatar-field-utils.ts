export function hex6FromInput(s: string): string {
  const x = s.trim().replace(/^#/, "");
  if (/^[a-fA-F0-9]{6}$/.test(x)) return x.toLowerCase();
  return "000000";
}

export function hexToInput(s: string | undefined): string {
  const x = (s ?? "").replace(/^#/, "");
  if (/^[a-fA-F0-9]{6}$/.test(x)) return `#${x.toLowerCase()}`;
  return "#000000";
}

export function firstOr<T extends string>(
  arr: readonly T[] | undefined,
  fallback: T,
): T {
  if (arr && arr.length > 0) return arr[0];
  return fallback;
}

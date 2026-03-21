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

export const AVATAR_SELECT_CLASS =
  "mt-1 w-full rounded-lg border border-amber-900/15 bg-white px-2 py-2 text-sm text-amber-950 outline-none focus:ring-2 focus:ring-amber-400/40";

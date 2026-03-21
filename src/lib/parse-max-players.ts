import type { MaxPlayersKind } from "@/types/game";

export type ParsedMaxPlayers = {
  maxPlayersRaw: string;
  maxPlayersKind: MaxPlayersKind;
  maxPlayersValue: string | null;
};

/** 엑셀/폼에서 쓰는 최대 인원 문자열을 DB 컬럼으로 변환 */
export function parseMaxPlayersInput(input: string): ParsedMaxPlayers {
  const raw = input.trim();
  if (!raw) {
    return {
      maxPlayersRaw: "",
      maxPlayersKind: "unknown",
      maxPlayersValue: null,
    };
  }

  if (raw === "--" || raw === "-" || raw === "?") {
    return {
      maxPlayersRaw: raw,
      maxPlayersKind: "unknown",
      maxPlayersValue: null,
    };
  }

  const m = raw.match(/^(\d+)\s*이상$/);
  if (m) {
    return {
      maxPlayersRaw: raw,
      maxPlayersKind: "min_plus",
      maxPlayersValue: m[1],
    };
  }

  const n = Number(String(raw).replace(",", ""));
  if (!Number.isNaN(n)) {
    return {
      maxPlayersRaw: raw,
      maxPlayersKind: "number",
      maxPlayersValue: String(n),
    };
  }

  return {
    maxPlayersRaw: raw,
    maxPlayersKind: "text",
    maxPlayersValue: raw,
  };
}

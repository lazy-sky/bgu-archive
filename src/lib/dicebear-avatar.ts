import { createAvatar } from "@dicebear/core";
import * as adventurer from "@dicebear/adventurer";
import * as avataaars from "@dicebear/avataaars";
import * as lorelei from "@dicebear/lorelei";
import * as micah from "@dicebear/micah";
import * as thumbs from "@dicebear/thumbs";
import * as toonHead from "@dicebear/toon-head";
import type { AvatarConfig } from "@/types/avatar";

/** 인라인 `<svg>` 대신 `<img src>`에 쓰면 viewBox·스타일 충돌 없이 균일하게 스케일됨 */
export function dicebearSvgDataUrl(svg: string): string {
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

/** DiceBear SVG 문자열 (투명 배경). `seed`가 비면 `seedFallback` 사용. */
export function dicebearSvg(
  config: AvatarConfig,
  size: number,
  seedFallback?: string,
): string {
  const seed =
    config.seed.trim() || seedFallback?.trim() || "bgu-archive";
  const base = {
    seed,
    size,
    backgroundColor: ["transparent"] as [string, ...string[]],
  };

  switch (config.style) {
    case "lorelei":
      return createAvatar(lorelei, { ...base, ...config.options }).toString();
    case "avataaars":
      return createAvatar(avataaars, { ...base, ...config.options }).toString();
    case "micah":
      return createAvatar(micah, { ...base, ...config.options }).toString();
    case "toon-head":
      return createAvatar(toonHead, { ...base, ...config.options }).toString();
    case "thumbs":
      return createAvatar(thumbs, { ...base, ...config.options }).toString();
    case "adventurer":
      return createAvatar(adventurer, { ...base, ...config.options }).toString();
    default: {
      const _n: never = config;
      return _n;
    }
  }
}

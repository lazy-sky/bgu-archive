"use client";

import { mergeAvatarConfig } from "@/lib/avatar-config";
import { dicebearSvg, dicebearSvgDataUrl } from "@/lib/dicebear-avatar";
import type { AvatarConfig } from "@/types/avatar";

type Props = {
  config: Partial<AvatarConfig> | AvatarConfig;
  size?: number;
  /** `seed`가 비었을 때 사용 (예: 회원 id) */
  seedFallback?: string;
  className?: string;
};

export function MemberAvatar({
  config,
  size = 48,
  seedFallback,
  className = "",
}: Props) {
  const c = mergeAvatarConfig(config);
  const svg = dicebearSvg(c, size, seedFallback);
  const src = dicebearSvgDataUrl(svg);

  return (
    <div
      className={`relative shrink-0 overflow-hidden rounded-full bg-amber-100/40 ring-1 ring-amber-900/15 ${className}`}
      style={{
        width: size,
        height: size,
        minWidth: size,
        minHeight: size,
      }}
    >
      <img
        src={src}
        alt=""
        width={size}
        height={size}
        className="block h-full w-full max-h-full max-w-full object-contain object-center"
        draggable={false}
      />
    </div>
  );
}

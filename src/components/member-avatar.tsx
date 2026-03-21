"use client";

import { mergeAvatarConfig } from "@/lib/avatar-config";
import { dicebearLoreleiSvg } from "@/lib/dicebear-avatar";
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
  const seed = c.seed.trim() || seedFallback || "bgu-archive";
  const svg = dicebearLoreleiSvg({ seed, size, options: c.options });

  return (
    <div
      role="img"
      aria-hidden
      className={`inline-block shrink-0 overflow-hidden rounded-full bg-amber-100/40 ring-1 ring-amber-900/15 ${className}`}
      style={{ width: size, height: size }}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}

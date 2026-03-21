import { createAvatar } from "@dicebear/core";
import * as lorelei from "@dicebear/lorelei";
import type { AvatarConfig } from "@/types/avatar";

/** DiceBear Lorelei SVG 문자열 (투명 배경) */
export function dicebearLoreleiSvg(args: {
  seed: string;
  size: number;
  options: AvatarConfig["options"];
}): string {
  return createAvatar(lorelei, {
    seed: args.seed,
    size: args.size,
    backgroundColor: ["transparent"],
    ...args.options,
  }).toString();
}

import type { Metadata } from "next";
import { GamesClient } from "./games-client";

export const metadata: Metadata = {
  title: "게임 목록 | BGU Archive",
  description: "BoardGameUnion 보드게임 아카이브",
};

export default function GamesPage() {
  return (
    <main className="mx-auto max-w-6xl flex-1 px-4 py-6 sm:px-6 sm:py-8">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-xl font-semibold tracking-tight text-amber-950 sm:text-2xl">
          게임 목록
        </h1>
        <p className="mt-1 text-sm leading-relaxed text-amber-900/65">
          프로필에 등록된 룰마스터 가능 게임을 기준으로 &quot;룰마스터 가능&quot;과
          아래 추천을 보여 줍니다. 인원·함께 할 사람을 고르면 맞는 게임만 골라
          볼 수 있어요.
        </p>
      </div>
      <GamesClient />
    </main>
  );
}

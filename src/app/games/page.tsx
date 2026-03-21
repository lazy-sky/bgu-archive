import type { Metadata } from "next";
import Link from "next/link";
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
          검색·장르·난이도로 전체 보드게임을 찾습니다. 인원·룰마스터 조건으로
          골라 보기는{" "}
          <Link href="/games/recommend" className="font-medium text-amber-900 underline">
            게임 추천
          </Link>
          페이지를 이용하세요.
        </p>
      </div>
      <GamesClient />
    </main>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { RecommendClient } from "./recommend-client";

export const metadata: Metadata = {
  title: "게임 추천 | BGU Archive",
  description:
    "인원 수와 함께 할 사람을 고르면 맞는 게임만 골라 볼 수 있어요.",
};

export default function RecommendPage() {
  return (
    <main className="mx-auto max-w-6xl flex-1 px-4 py-6 sm:px-6 sm:py-8">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-xl font-semibold tracking-tight text-amber-950 sm:text-2xl">
          게임 추천
        </h1>
        <p className="mt-1 text-sm leading-relaxed text-amber-900/65">
          인원·룰마스터 조건에 맞는 게임만 골라 봅니다. 전체 목록을
          검색·정렬하려면{" "}
          <Link href="/games" className="font-medium text-amber-900 underline">
            게임 목록
          </Link>
          을 이용하세요.
        </p>
      </div>
      <RecommendClient />
    </main>
  );
}

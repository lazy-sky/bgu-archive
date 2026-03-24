import type { Metadata } from "next";
import Link from "next/link";
import { RankingClient } from "./ranking-client";

export const metadata: Metadata = {
  title: "랭킹",
  description: "BGU 회원 겜잘알·플레이 기록 랭킹",
};

export default function MembersRankingPage() {
  return (
    <main className="mx-auto max-w-3xl flex-1 px-4 py-6 sm:px-6 sm:py-8">
      <div className="mb-6 sm:mb-8">
        <p className="text-sm text-amber-900/60">
          <Link
            href="/members"
            className="font-medium text-amber-900 underline decoration-amber-900/30 underline-offset-2 hover:text-amber-950"
          >
            회원
          </Link>
          <span className="mx-1.5 text-amber-800/40" aria-hidden>
            /
          </span>
          <span className="text-amber-900/80">랭킹</span>
        </p>
        <h1 className="mt-2 text-xl font-semibold tracking-tight text-amber-950 sm:text-2xl">
          랭킹
        </h1>
        <p className="mt-1 text-sm leading-relaxed text-amber-900/65">
          태그별로 회원 순위를 볼 수 있어요. 항목은 점차 늘어납니다.
        </p>
      </div>
      <RankingClient />
    </main>
  );
}

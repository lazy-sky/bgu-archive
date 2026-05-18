import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "학습",
  description:
    "보드게임·카드 게임 규칙과 진행 방법을 단계별로 안내합니다. 텍사스 홀덤부터 시작합니다.",
};

export default function LearnIndexPage() {
  return (
    <section
      className="rounded-3xl border border-amber-900/10 bg-white/90 p-6 shadow-sm backdrop-blur-sm sm:p-8"
      aria-labelledby="learn-games-heading"
    >
      <h2
        id="learn-games-heading"
        className="text-lg font-semibold text-amber-950"
      >
        배울 게임
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-amber-900/75">
        항목을 누르면 해당 게임 가이드로 이동합니다. 앞으로 종목을 더 넣을 수
        있도록 구조만 잡아 두었습니다.
      </p>

      <ul className="mt-6 grid gap-4 sm:grid-cols-2">
        <li>
          <Link
            href="/learn/holdem"
            className="block rounded-2xl border border-emerald-800/20 bg-gradient-to-br from-emerald-50/95 via-white to-emerald-50/40 p-5 shadow-sm transition hover:border-emerald-800/35 hover:shadow-md"
          >
            <span className="text-xs font-medium uppercase tracking-wide text-emerald-800/80">
              카드 · 포커
            </span>
            <span className="mt-1 block text-lg font-semibold text-amber-950">
              텍사스 홀덤
            </span>
            <span className="mt-2 block text-sm leading-relaxed text-amber-900/70">
              블라인드, 베팅 라운드, 족보 순위까지 한 번에 정리했습니다.
            </span>
          </Link>
        </li>
      </ul>
    </section>
  );
}

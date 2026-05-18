import Link from "next/link";
import { LearnGameNav } from "@/app/learn/learn-game-nav";

export default function LearnLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="flex flex-1 flex-col">
      <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col px-4 py-8 sm:px-6 sm:py-12">
        <Link
          href="/"
          className="mb-6 inline-flex w-fit items-center gap-2 text-sm font-medium text-amber-800 underline decoration-amber-800/35 underline-offset-2 transition hover:text-amber-950"
        >
          ← 홈으로
        </Link>
        <header className="mb-2">
          <h1 className="text-2xl font-semibold tracking-tight text-amber-950 sm:text-3xl">
            학습
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-amber-900/75">
            규칙부터 흐름까지, 동아리에서 자주 만나는 게임을 차근차근 익혀 보세요.
          </p>
        </header>
        <LearnGameNav />
        {children}
      </div>
    </main>
  );
}

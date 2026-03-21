import Link from "next/link";

export default function Home() {
  return (
    <main className="mx-auto flex max-w-3xl flex-1 flex-col justify-center px-4 py-10 sm:px-6 sm:py-16">
      <h1 className="mt-2 text-3xl font-semibold tracking-tight text-amber-950 sm:text-4xl">
        BGU Archive
      </h1>
      <p className="mt-4 text-base leading-relaxed text-amber-900/80 sm:text-lg">
        BGU에서 모은 보드게임 정보를 한곳에서 찾고, 인원·장르에 맞는 게임을
        고르고, 누가 룰을 설명할 수 있는지까지 이어가는 아카이브의 시작점입니다. 아직 만드는 중이니까 여러 의견 주시면 떙큐.
      </p>
      <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        <Link
          href="/games"
          className="inline-flex items-center justify-center rounded-full bg-amber-900 px-6 py-2.5 text-sm font-medium text-amber-50 shadow transition hover:bg-amber-800"
        >
          게임 목록 보기
        </Link>
        <Link
          href="/games/recommend"
          className="inline-flex items-center justify-center rounded-full border border-violet-300/80 bg-violet-50/40 px-6 py-2.5 text-sm font-medium text-violet-950 transition hover:bg-violet-100/60"
        >
          게임 추천
        </Link>
        <Link
          href="/members"
          className="inline-flex items-center justify-center rounded-full border border-amber-900/20 bg-white/70 px-6 py-2.5 text-sm font-medium text-amber-950 transition hover:bg-amber-50"
        >
          회원
        </Link>
      </div>
    </main>
  );
}

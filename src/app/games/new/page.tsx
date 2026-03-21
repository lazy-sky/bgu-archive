import type { Metadata } from "next";
import { AddGameForm } from "./add-game-form";

export const metadata: Metadata = {
  title: "게임 추가",
  description: "새 보드게임 등록",
};

export default function NewGamePage() {
  return (
    <main className="mx-auto max-w-6xl flex-1 px-4 py-6 sm:px-6 sm:py-8">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-xl font-semibold tracking-tight text-amber-950 sm:text-2xl">
          게임 추가
        </h1>
        <p className="mt-1 text-sm leading-relaxed text-amber-900/65">
          등록한 게임에는 본인 프로필 이름이 &quot;추가한 사람&quot;으로 표시됩니다.
        </p>
      </div>
      <AddGameForm />
    </main>
  );
}

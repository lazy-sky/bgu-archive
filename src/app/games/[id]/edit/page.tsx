import type { Metadata } from "next";
import { EditGameForm } from "./edit-game-form";

export const metadata: Metadata = {
  title: "게임 수정",
  description: "등록한 게임 정보 수정",
};

export default async function EditGamePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <main className="mx-auto max-w-6xl flex-1 px-4 py-6 sm:px-6 sm:py-8">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-xl font-semibold tracking-tight text-amber-950 sm:text-2xl">
          게임 수정
        </h1>
        <p className="mt-1 text-sm leading-relaxed text-amber-900/65">
          로그인한 회원은 누구나 수정할 수 있습니다. (임시)
        </p>
      </div>
      <EditGameForm gameId={id} />
    </main>
  );
}

import type { Metadata } from "next";
import { MembersClient } from "./members-client";

export const metadata: Metadata = {
  title: "회원",
  description: "BGU 회원 프로필",
};

export default function MembersPage() {
  return (
    <main className="mx-auto max-w-6xl flex-1 px-4 py-6 sm:px-6 sm:py-8">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-xl font-semibold tracking-tight text-amber-950 sm:text-2xl">
          회원
        </h1>
        <p className="mt-1 text-sm leading-relaxed text-amber-900/65">
          동아리 회원 프로필입니다. 로그인하면 내 프로필에서 표시 이름을 바꿀 수
          있어요.
        </p>
      </div>
      <MembersClient />
    </main>
  );
}

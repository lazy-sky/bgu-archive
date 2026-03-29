import type { Metadata } from "next";
import Link from "next/link";
import { ManageHonorsClient } from "./manage-honors-client";

export const metadata: Metadata = {
  title: "업적 관리",
  description: "명예의 전당 업적 편집 (관리자)",
};

export default function ManageHonorsPage() {
  return (
    <main className="mx-auto max-w-6xl flex-1 px-4 py-6 sm:px-6 sm:py-8">
      <div className="mb-6 sm:mb-8">
        <Link
          href="/honors"
          className="text-sm font-medium text-amber-800 underline decoration-amber-800/30 underline-offset-2 hover:text-amber-950"
        >
          ← 명예의 전당
        </Link>
        <h1 className="mt-3 text-xl font-semibold tracking-tight text-amber-950 sm:text-2xl">
          업적 관리
        </h1>
        <p className="mt-1 text-sm leading-relaxed text-amber-900/65">
          업적을 만들고, 달성한 회원을 지정합니다. (관리자 전용)
        </p>
      </div>
      <ManageHonorsClient />
    </main>
  );
}

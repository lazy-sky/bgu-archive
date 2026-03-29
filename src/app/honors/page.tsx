import type { Metadata } from "next";
import { HallOfFameAdminLink, HallOfFameClient } from "./hall-of-fame-client";

export const metadata: Metadata = {
  title: "명예의 전당",
  description: "BGU 업적과 달성한 회원",
};

export default function HonorsPage() {
  return (
    <main className="mx-auto max-w-6xl flex-1 px-4 py-6 sm:px-6 sm:py-8">
      <div className="mb-6 flex flex-col gap-2 sm:mb-8 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-amber-950 sm:text-2xl">
            명예의 전당
          </h1>
          <p className="mt-1 text-sm leading-relaxed text-amber-900/65">
            동아리에서 의미 있는 업적을 달성한 회원을 기록합니다.
          </p>
        </div>
        <HallOfFameAdminLink />
      </div>
      <HallOfFameClient />
    </main>
  );
}

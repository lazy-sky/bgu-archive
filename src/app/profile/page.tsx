import type { Metadata } from "next";
import { ProfileForm } from "./profile-form";

export const metadata: Metadata = {
  title: "내 프로필",
  description: "표시 이름 등 프로필 설정",
};

export default function ProfilePage() {
  return (
    <main className="mx-auto max-w-6xl flex-1 px-4 py-6 sm:px-6 sm:py-8">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-xl font-semibold tracking-tight text-amber-950 sm:text-2xl">
          내 프로필
        </h1>
        <p className="mt-1 text-sm leading-relaxed text-amber-900/65">
          다른 회원에게 보이는 이름을 바꿀 수 있어요.
        </p>
      </div>
      <ProfileForm />
    </main>
  );
}

import { Suspense } from "react";
import { LoginForm } from "./login-form";

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <main className="mx-auto max-w-md px-4 py-16 text-center text-amber-900/70">
          로딩…
        </main>
      }
    >
      <LoginForm />
    </Suspense>
  );
}

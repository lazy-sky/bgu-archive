import type { NextRequest } from "next/server";

function hostnameIsLocal(host: string): boolean {
  return (
    host === "localhost" ||
    host === "127.0.0.1" ||
    host.endsWith(".local")
  );
}

/**
 * Google OAuth `redirectTo`에 넣을 origin.
 * - 로컬에서는 항상 현재 탭 주소
 * - 배포에서는 NEXT_PUBLIC_SITE_URL이 현재 호스트와 같을 때만 사용(오타·로컬 값이 섞인 빌드 방지)
 */
export function getOAuthRedirectBase(): string {
  if (typeof window === "undefined") return "";
  const win = window.location.origin;
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (!raw) return win;

  let fromEnv: string;
  try {
    fromEnv = new URL(raw).origin;
  } catch {
    return win;
  }

  let winHost: string;
  let envHost: string;
  try {
    winHost = new URL(win).hostname;
    envHost = new URL(fromEnv).hostname;
  } catch {
    return win;
  }

  if (hostnameIsLocal(winHost)) return win;
  if (hostnameIsLocal(envHost)) return win;
  if (envHost === winHost) return fromEnv;
  return win;
}

/**
 * Vercel 등 리버스 프록시 뒤에서도 최종 브라우저에 보이는 origin으로 리다이렉트하기 위함.
 */
export function getRequestOrigin(request: NextRequest): string {
  const forwardedHost = request.headers.get("x-forwarded-host");
  const forwardedProto = request.headers.get("x-forwarded-proto");
  if (forwardedHost) {
    const host = forwardedHost.split(",")[0].trim();
    const proto = (forwardedProto ?? "https").split(",")[0].trim();
    return `${proto}://${host}`;
  }
  return new URL(request.url).origin;
}

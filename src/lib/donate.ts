/** 기본 카카오페이 송금 QR 링크 (환경 변수로 덮어쓸 수 있음) */
export const DEFAULT_KAKAO_PAY_URL = "https://qr.kakaopay.com/Ej7vstwAw";

export const DONATE_LINKS = {
  kakao:
    process.env.NEXT_PUBLIC_DONATE_KAKAO_URL?.trim() || DEFAULT_KAKAO_PAY_URL,
} as const;

/** 카카오페이 금액 버튼(원) */
export const DONATE_AMOUNTS = [1000, 3000, 5000, 10000] as const;

/**
 * 카카오페이 기본 URL에 금액 쿼리를 붙입니다.
 * 고정 QR 링크는 금액 파라미터를 무시할 수 있습니다.
 */
export function getKakaoPayUrlWithAmount(
  kakaoBaseUrl: string,
  amount: number,
): string {
  try {
    const u = new URL(kakaoBaseUrl);
    u.searchParams.set("amount", String(amount));
    return u.toString();
  } catch {
    const sep = kakaoBaseUrl.includes("?") ? "&" : "?";
    return `${kakaoBaseUrl}${sep}amount=${amount}`;
  }
}

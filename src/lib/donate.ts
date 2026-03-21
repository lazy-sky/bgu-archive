/** 기본 카카오페이 송금 QR 링크(금액 미지정). 환경 변수로 덮어쓸 수 있음 */
export const DEFAULT_KAKAO_PAY_URL = "https://qr.kakaopay.com/Ej7vstwAw";

export const DONATE_LINKS = {
  kakao:
    process.env.NEXT_PUBLIC_DONATE_KAKAO_URL?.trim() || DEFAULT_KAKAO_PAY_URL,
} as const;

/** 카카오페이 금액 버튼(원) */
export const DONATE_AMOUNTS = [1000, 3000, 5000, 10000] as const;

const AMOUNT_SHIFT = 19;
const AMOUNT_UNIT = 1 << AMOUNT_SHIFT;

/**
 * 경로 끝에 이미 붙어 있는 금액 인코딩(금액 << 19 의 16진수)을 제거합니다.
 * 동일 세션에서 금액만 바꿔 다시 열 때 중복 접미사를 막습니다.
 */
function stripTrailingKakaoPayAmountHex(pathSegment: string): string {
  let i = pathSegment.length;
  while (i > 0) {
    const ch = pathSegment.charCodeAt(i - 1);
    const isHex =
      (ch >= 48 && ch <= 57) ||
      (ch >= 65 && ch <= 70) ||
      (ch >= 97 && ch <= 102);
    if (!isHex) break;
    i--;
  }
  const suffix = pathSegment.slice(i);
  if (suffix.length < 5 || i === 0) return pathSegment;

  let parsed: bigint;
  try {
    parsed = BigInt(`0x${suffix}`);
  } catch {
    return pathSegment;
  }
  const unit = BigInt(AMOUNT_UNIT);
  if (parsed % unit !== BigInt(0)) return pathSegment;
  const won = parsed / unit;
  if (won < BigInt(0) || won > BigInt(1_000_000_000)) return pathSegment;

  return pathSegment.slice(0, i);
}

/**
 * 카카오페이 송금 링크에 금액을 넣습니다.
 *
 * `https://qr.kakaopay.com/{uid}` 형태에서 `?amount=` 쿼리는 앱에서 무시되므로,
 * 경로 끝에 `(금액 << 19)`를 16진수로 붙이는 방식을 씁니다.
 *
 * @see https://moeun2.github.io/blog/kakaopay-qrcode-maker/ (비공식 분석)
 */
export function getKakaoPayUrlWithAmount(
  kakaoBaseUrl: string,
  amount: number,
): string {
  const n = Math.max(0, Math.floor(Number(amount)));

  try {
    const u = new URL(kakaoBaseUrl);

    if (u.hostname === "qr.kakaopay.com") {
      let path = u.pathname.replace(/^\//, "");
      if (!path) return kakaoBaseUrl;

      path = stripTrailingKakaoPayAmountHex(path);
      const encoded = BigInt(n) * BigInt(AMOUNT_UNIT);
      const hex = encoded.toString(16);
      u.pathname = `/${path}${hex}`;
      u.search = "";
      return u.toString();
    }

    u.searchParams.set("amount", String(n));
    return u.toString();
  } catch {
    const sep = kakaoBaseUrl.includes("?") ? "&" : "?";
    return `${kakaoBaseUrl}${sep}amount=${n}`;
  }
}

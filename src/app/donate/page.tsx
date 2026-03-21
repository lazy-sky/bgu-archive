import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  DONATE_AMOUNTS,
  DONATE_LINKS,
  getKakaoPayUrlWithAmount,
} from "@/lib/donate";

function siteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) {
    try {
      return new URL(explicit).origin;
    } catch {
      /* fall through */
    }
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return "http://localhost:3000";
}

const base = siteUrl();

export const metadata: Metadata = {
  title: "후원하기",
  description:
    "BGU Archive 운영·서버 비용을 후원해 주세요. 감사합니다.",
  openGraph: {
    title: "후원하기 | BGU Archive",
    description:
      "BGU Archive 운영·서버 비용을 후원해 주세요. 감사합니다.",
    url: `${base}/donate`,
    siteName: "BGU Archive",
    locale: "ko_KR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "후원하기 | BGU Archive",
    description:
      "BGU Archive 운영·서버 비용을 후원해 주세요. 감사합니다.",
  },
};

const kakaoUrl = DONATE_LINKS.kakao;

export default function DonatePage() {
  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col px-4 py-8 sm:px-6 sm:py-12">
      <Link
        href="/"
        className="mb-6 inline-flex w-fit items-center gap-2 text-sm font-medium text-amber-800 underline decoration-amber-800/35 underline-offset-2 transition hover:text-amber-950"
      >
        ← 홈으로
      </Link>

      <div className="rounded-3xl border border-amber-900/10 bg-white/90 p-8 shadow-sm backdrop-blur-sm md:p-12">
        <h1 className="text-2xl font-semibold tracking-tight text-amber-950">
          후원하기
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-amber-900/70">
          사이트를 유지·보수하는데 비용이 듭니다. BGU Archive가 안정적으로 운영될 수 있도록 도와주세요. 감사합니다.
        </p>

        <p className="mt-6 rounded-2xl border border-amber-900/10 bg-amber-50/80 p-4 text-sm text-amber-900/80">
          후원해 주신 분의 <strong className="font-medium text-amber-950">이름</strong>은
          하단에 명단으로 표시됩니다. 원하지 않는다면 따로 말씀해주세요.
        </p>

        <div className="mt-8 space-y-3">
          <p className="text-sm font-medium text-amber-950">금액을 선택하세요</p>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {DONATE_AMOUNTS.map((amount) => (
              <a
                key={amount}
                href={getKakaoPayUrlWithAmount(kakaoUrl, amount)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center rounded-2xl bg-gradient-to-br from-[#FEE500] to-[#F5D000] px-4 py-4 text-center font-semibold text-[#3C1E1E] shadow-lg transition hover:scale-[1.02] hover:shadow-xl"
              >
                {amount.toLocaleString("ko-KR")}원
              </a>
            ))}
          </div>
        </div>

        <p className="mt-8 text-xs leading-relaxed text-amber-800/55">
          후원은 서버·유지보수 비용에 활용됩니다. 입금내역은 최대한 빠르게 확인하도록 하겠습니다.
          <span className="mt-2 block text-amber-800/45">
            ※ 제작자가 부자되도록 다들 협조 부탁드립니다.
          </span>
        </p>

        <div className="mt-8 flex flex-col items-center gap-3 rounded-2xl border border-[#FEE500]/50 bg-[#FFFDE7]/90 p-6">
          <p className="text-sm font-medium text-[#3C1E1E]">
            카카오페이 QR 코드
          </p>
          <p className="text-xs text-amber-900/65">
            모바일에서 QR 스캔하여 후원하기
          </p>
          <Image
            src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(kakaoUrl)}`}
            alt="카카오페이 송금 QR"
            width={180}
            height={180}
            className="rounded-xl"
            unoptimized
          />
        </div>
      </div>
    </main>
  );
}

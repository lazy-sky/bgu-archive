import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SiteHeader } from "@/components/site-header";
import { Providers } from "@/components/providers";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

function metadataBase(): URL {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) {
    try {
      return new URL(explicit);
    } catch {
      /* fall through */
    }
  }
  if (process.env.VERCEL_URL) {
    return new URL(`https://${process.env.VERCEL_URL}`);
  }
  return new URL("http://localhost:3000");
}

const siteDescription =
  "BGU의 아카이브";

export const metadata: Metadata = {
  metadataBase: metadataBase(),
  title: {
    default: "BGU Archive",
    template: "%s | BGU Archive",
  },
  description: siteDescription,
  keywords: [
    "보드게임",
    "동아리",
    "BGU",
    "보드게임유니온",
  ],
  openGraph: {
    title: "BGU Archive",
    description: siteDescription,
    siteName: "BGU Archive",
    locale: "ko_KR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "BGU Archive",
    description: siteDescription,
  },
  appleWebApp: {
    title: "BGU Archive",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ko"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-dvh min-h-full flex-col bg-gradient-to-b from-amber-50/90 to-amber-100/40 text-foreground">
        <Providers>
          <SiteHeader />
          {children}
        </Providers>
      </body>
    </html>
  );
}

import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";

import Footer from "@/components/layout/Footer";
import { Providers } from "@/components/Providers";
import { Toaster } from "@/components/ui/sonner";

import "./globals.css";
import { cn } from "@/lib/utils";

/** 서체는 Pretendard 하나로 통일한다. 45~920 가변축이 본문과 디스플레이를 모두 담당한다. */
const pretendard = localFont({
  src: "../fonts/PretendardVariable.woff2",
  variable: "--font-pretendard",
  weight: "45 920",
  display: "swap",
});

/** 모바일 브라우저 상단 크롬 색. 지정하지 않으면 팔레트 밖 기본색이 노출된다. */
export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f3f1ec" },
    { media: "(prefers-color-scheme: dark)", color: "#1a1916" },
  ],
};

export const metadata: Metadata = {
  title: "로컬 밸런스 트립",
  description:
    "여행 성향과 가치소비 기준을 진단해 나에게 맞는 지역과 코스를 추천하고, 받을 수 있는 정부·지자체 지원 혜택까지 연결해 드려요.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ko"
      className={cn("bg-paper h-full antialiased", pretendard.variable)}
      suppressHydrationWarning
    >
      <body className="flex min-h-full flex-col">
        <Providers>{children}</Providers>
        <Footer />
        <Toaster position="top-center" />
      </body>
    </html>
  );
}

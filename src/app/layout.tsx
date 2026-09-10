import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";

import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages, getTranslations } from "next-intl/server";
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

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("meta");

  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const lang = await getLocale();
  const messages = await getMessages();

  return (
    <html
      lang={lang}
      className={cn("bg-paper h-full antialiased", pretendard.variable)}
      suppressHydrationWarning
    >
      <body className="flex min-h-full flex-col">
        <NextIntlClientProvider locale={lang} messages={messages}>
          <Providers>{children}</Providers>
          <Footer />
          <Toaster position="top-center" />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

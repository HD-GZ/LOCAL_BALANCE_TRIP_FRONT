import { Suspense } from "react";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";

import Header from "@/components/layout/Header";

/**
 * `[locale]` 밖에 있는 트리라 next-intl의 로케일 URL 프리픽스가 없다.
 * 카카오톡 등으로 공유 링크를 받은 사람은 로그인 상태가 아니고, 자신의
 * Accept-Language(NEXT_LOCALE 쿠키 → 기본값)로 봐야 하므로 getLocale()로 판별한다.
 *
 * 이 트리가 가져다 쓰는 CourseBenefitList/CourseStatusBadge/CourseTimeline이
 * useTranslations()를 쓰기 때문에, provider가 없으면 렌더링 시 크래시가 난다.
 */
export default async function SharedCoursesLayout({ children }: { children: React.ReactNode }) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <div className="flex flex-1 flex-col">
        <Header />
        <Suspense>{children}</Suspense>
      </div>
    </NextIntlClientProvider>
  );
}

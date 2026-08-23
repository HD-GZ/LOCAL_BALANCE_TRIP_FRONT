"use client";

import { useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

/**
 * 보호된 화면에 비로그인으로 접근하면 미들웨어가 이곳으로 보낸다(src/proxy.ts).
 * 아무 설명 없이 로그인 화면이 나타나면 사용자는 자기가 뭘 잘못했는지 알 수 없다.
 *
 * 렌더링되는 것이 없는 알림 전용 컴포넌트다.
 */
export default function AuthRedirectNotice() {
  const t = useTranslations("login");
  const searchParams = useSearchParams();
  const reason = searchParams.get("reason");
  const hasNotified = useRef(false);

  useEffect(() => {
    if (reason !== "auth" || hasNotified.current) return;

    hasNotified.current = true;
    toast.info(t("redirectNoticeTitle"), {
      description: t("redirectNoticeDescription"),
    });
  }, [reason, t]);

  return null;
}

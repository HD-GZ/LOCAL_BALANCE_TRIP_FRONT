"use client";

import { Check, Info, Loader2, OctagonX, TriangleAlert } from "lucide-react";
import { useTheme } from "next-themes";
import { Toaster as Sonner, type ToasterProps } from "sonner";

/**
 * 토스트. DESIGN.md §3.
 *
 * `richColors` 는 sonner 가 자체 초록/빨강을 쓰기 때문에 팔레트 밖 색이 새어 나온다.
 * 성공은 브랜드, 오류·경고는 danger 로 매핑해 우리 색만 쓰게 한다.
 * 경고와 오류가 같은 계열인 것은 의도다 — 이 팔레트의 의미 색은 하나다.
 */
const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      richColors
      icons={{
        success: <Check className="size-4" strokeWidth={2.25} />,
        info: <Info className="size-4" strokeWidth={1.75} />,
        warning: <TriangleAlert className="size-4" strokeWidth={1.75} />,
        error: <OctagonX className="size-4" strokeWidth={1.75} />,
        loading: <Loader2 className="size-4 animate-spin" strokeWidth={1.75} />,
      }}
      style={
        {
          "--normal-bg": "var(--surface)",
          "--normal-text": "var(--ink)",
          "--normal-border": "var(--line)",

          "--success-bg": "var(--brand-wash)",
          "--success-text": "var(--brand-ink)",
          "--success-border": "var(--brand)",

          "--error-bg": "var(--danger-wash)",
          "--error-text": "var(--danger-ink)",
          "--error-border": "var(--danger)",

          "--warning-bg": "var(--danger-wash)",
          "--warning-text": "var(--danger-ink)",
          "--warning-border": "var(--danger)",

          "--info-bg": "var(--surface-2)",
          "--info-text": "var(--ink-2)",
          "--info-border": "var(--line-control)",

          "--border-radius": "var(--radius)",
        } as React.CSSProperties
      }
      toastOptions={{
        classNames: {
          toast: "cn-toast",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };

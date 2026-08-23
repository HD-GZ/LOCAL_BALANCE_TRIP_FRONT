"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import { useTranslations } from "next-intl";

import Skeleton from "@/components/common/Skeleton";
import SurfaceState from "@/components/common/SurfaceState";
import type { PropensityResult as PropensityResultType } from "@/features/propensity/types";

/**
 * 결과 발표. DESIGN.md §7 — 표면당 한 번만 허용되는 연출된 순간이다.
 * 10개 축에 답한 끝이므로, 순서대로 드러나는 것이 서사에 맞다.
 */

const EASE = [0.22, 1, 0.36, 1] as const;

type PropensityResultProps = {
  result: PropensityResultType | undefined;
  isError: boolean;
  onRetry: () => void;
};

export default function PropensityResult({ result, isError, onRetry }: PropensityResultProps) {
  const t = useTranslations("propensity.result");
  const tCommon = useTranslations();
  const reduce = useReducedMotion();

  if (isError && !result) {
    return (
      <SurfaceState
        tone="error"
        title={t("errorTitle")}
        description={t("errorDescription")}
        action={{ label: tCommon("retry"), onRetry }}
      />
    );
  }

  if (!result) {
    return (
      <div className="flex flex-col items-center gap-4 py-6">
        <Skeleton className="size-30" rounded="full" />
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-8 w-56" />
        <Skeleton className="h-3 w-full max-w-100" />
        <Skeleton className="h-3 w-3/4 max-w-80" />
        <p className="text-ink-3 text-body-sm mt-2">{t("generating")}</p>
      </div>
    );
  }

  const step = (order: number) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0.35, y: 10 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.34, delay: order * 0.1, ease: EASE },
        };

  return (
    <div className="flex flex-col items-center gap-3 text-center">
      <motion.div
        {...(reduce
          ? {}
          : {
              initial: { opacity: 0.35, scale: 0.94 },
              animate: { opacity: 1, scale: 1 },
              transition: { duration: 0.42, ease: EASE },
            })}
        className="border-line bg-paper-sunk relative size-30 overflow-hidden rounded-full border"
      >
        <Image src={result.imageUrl} alt="" fill sizes="120px" className="object-cover" priority />
      </motion.div>

      <motion.p {...step(1)} className="text-brand-ink text-num tabular-nums">
        {result.code}
      </motion.p>

      <motion.h2 {...step(2)} className="text-title-1 text-ink sm:text-display-2">
        <span className="text-brand-ink">{result.type}</span>
        {t("travelerSuffix")}
      </motion.h2>

      <motion.p {...step(3)} className="text-ink-2 text-body max-w-[52ch] text-pretty">
        {result.description}
      </motion.p>
    </div>
  );
}

"use client";

import { motion, useReducedMotion } from "motion/react";

/**
 * 스크롤 진입. DESIGN.md §7.
 *
 * 섹션 단위로만 쓴다. 모든 요소에 붙이면 리듬이 아니라 소음이 된다.
 * reduced-motion 에서는 즉시 최종 상태로 렌더한다.
 */

const EASE = [0.22, 1, 0.36, 1] as const;

type RevealProps = {
  children: React.ReactNode;
  /** 같은 그룹 안에서의 순번. 50ms 간격으로 밀린다. */
  index?: number;
  className?: string;
  as?: "div" | "section" | "li";
};

export default function Reveal({ children, index = 0, className, as = "div" }: RevealProps) {
  const reduce = useReducedMotion();
  const Component = motion[as];

  if (reduce) {
    const Static = as;
    return <Static className={className}>{children}</Static>;
  }

  return (
    <Component
      className={className}
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.26, delay: Math.min(index, 6) * 0.05, ease: EASE }}
    >
      {children}
    </Component>
  );
}

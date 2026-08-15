import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

/**
 * 우리 타입 스케일(DESIGN.md §4)은 `text-body`, `text-title-1` 처럼 t-shirt 사이즈가
 * 아닌 이름을 쓴다. tailwind-merge 는 그런 이름을 폰트 크기로 알아보지 못해
 * **색상 그룹으로 분류**하고, 그 결과 `text-brand-on text-body` 처럼 색과 크기가 함께
 * 오면 둘을 충돌로 보고 뒤쪽만 남긴다 — 색 선언이 조용히 사라진다.
 *
 * 실제로 Button 의 주 CTA 글자색이 이렇게 날아가 `#222019` 를 상속했고,
 * 브랜드 그린 배경 위에서 대비가 2.72:1 까지 떨어졌다.
 *
 * 그래서 font-size 그룹에 우리 스케일을 명시해 준다. 스케일을 추가하면 여기도 함께 늘린다.
 */
const TYPE_SCALE = [
  "display-1",
  "display-2",
  "title-1",
  "title-2",
  "title-3",
  "body",
  "body-sm",
  "cap",
  "num",
  "num-lg",
] as const;

const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [{ text: [...TYPE_SCALE] }],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function parsePositiveIntParam(value: string | undefined): number | null {
  if (!value) return null;
  const parsed = Number(value);
  return Number.isSafeInteger(parsed) && parsed > 0 ? parsed : null;
}

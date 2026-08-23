import { useTranslations } from "next-intl";

/** 코스 추천 흐름의 단계 라벨. 세 표면이 같은 배열을 공유해야 스텝퍼가 어긋나지 않는다. */
export function useCourseSteps() {
  const t = useTranslations("courseRecommend.steps");
  return [t("recommend"), t("select"), t("course")];
}

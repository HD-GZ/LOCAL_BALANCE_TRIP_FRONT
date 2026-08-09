import type { SavedCourse } from "@/features/recommendation/types";

export type HeroItem = {
  imageUrl: string | null;
  title: string;
};

export type HeroResponse = {
  items: HeroItem[];
};

export type ProfileType = {
  code: string;
  nickname: string;
  description: string;
  imageUrl: string | null;
};

export type ProfileTypesResponse = {
  types: ProfileType[];
};

export type ProfileSlider = {
  key: string;
  minLabel: string;
  maxLabel: string;
  /** 1~5 */
  score: number;
};

export type ProfileSummaryResponse = {
  /** "{별칭} ({코드})" 형식 */
  type: string;
  description: string;
  imageUrl: string | null;
  /** yyyy-MM-dd */
  diagnosedAt: string;
  sliders: ProfileSlider[];
};

export type PopularCourse = {
  courseId: number;
  title: string;
  reason: string;
  imageUrl: string | null;
  regionName: string;
};

export type PopularCoursesResponse = {
  courses: PopularCourse[];
};

export type HomeFeedItemType = "SAVED_COURSE" | "RECOMMENDED_REGION";

export type HomeFeedItem = {
  itemType: HomeFeedItemType;
  /** 저장 코스 ID 또는 추천 지역 ID */
  id: number;
  title: string;
  imageUrl: string | null;
  /** SAVED_COURSE는 여행 상태값, RECOMMENDED_REGION은 추천 이유 */
  subtitle: string | null;
};

export type HomeFeedResponse = {
  items: HomeFeedItem[];
};

export type Incentive = {
  title: string;
  description: string | null;
  url: string;
  /** 상시(마감 없음)면 null */
  endDate: string | null;
  /** 마감까지 남은 일수. 상시면 null */
  dday: number | null;
};

export type IncentiveRegionTab = {
  regionName: string;
  ldongRegnCd: string;
  ldongSignguCd: string;
  incentives: Incentive[];
};

export type IncentivesResponse = {
  regions: IncentiveRegionTab[];
};

export type SavedCourseStatus = SavedCourse["status"];

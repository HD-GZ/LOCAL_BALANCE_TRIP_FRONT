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
  score: number;
};

export type ProfileSummaryResponse = {
  type: string;
  description: string;
  imageUrl: string | null;
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
  id: number;
  title: string;
  imageUrl: string | null;
  subtitle: string | null;
};

export type HomeFeedResponse = {
  items: HomeFeedItem[];
};

export type Incentive = {
  title: string;
  description: string | null;
  url: string;
  endDate: string | null;
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

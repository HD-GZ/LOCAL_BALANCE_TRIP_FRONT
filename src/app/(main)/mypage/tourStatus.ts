import type { SavedCourse } from "@/features/recommendation/types";

export type TourStatusValue = "all" | "progress" | "completed" | "before";

type StatusOption = {
  id: number;
  value: TourStatusValue;
  title: "전체" | "여행 중" | "완주" | "여행전";
};

export const TOUR_STATUS: StatusOption[] = [
  { id: 1, value: "all", title: "전체" },
  { id: 2, value: "progress", title: "여행 중" },
  { id: 3, value: "completed", title: "완주" },
  { id: 4, value: "before", title: "여행 전" },
];

export const STATUS_FILTER_MAP: Record<Exclude<TourStatusValue, "all">, SavedCourse["status"]> = {
  before: "BEFORE_TRIP",
  progress: "TRAVELING",
  completed: "COMPLETED",
};

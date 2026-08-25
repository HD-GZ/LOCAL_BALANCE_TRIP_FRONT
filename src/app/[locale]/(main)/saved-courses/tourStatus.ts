import type { SavedCourse } from "@/features/recommendation/types";

export type TourStatusValue = "all" | "progress" | "completed" | "before";

type StatusOption = {
  id: number;
  value: TourStatusValue;
};

export const TOUR_STATUS: StatusOption[] = [
  { id: 1, value: "all" },
  { id: 2, value: "progress" },
  { id: 3, value: "completed" },
  { id: 4, value: "before" },
];

export const STATUS_FILTER_MAP: Record<Exclude<TourStatusValue, "all">, SavedCourse["status"]> = {
  before: "BEFORE_TRIP",
  progress: "TRAVELING",
  completed: "COMPLETED",
};

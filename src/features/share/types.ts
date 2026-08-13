import type { CourseBenefit, CoursePlace } from "@/features/recommendation/types";

export type ShareTokenResponse = {
  token: string;
  expiresAt: string;
};

export type SharedCourseResponse = {
  savedCourseId: number;
  sharedByName: string;
  imageUrl: string;
  regionName: string;
  title: string;
  status: "BEFORE_TRIP" | "TRAVELING" | "COMPLETED";
  places: CoursePlace[];
  benefits: CourseBenefit[];
};

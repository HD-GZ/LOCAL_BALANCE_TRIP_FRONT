export type RecommendedRegion = {
  regionId: number;
  regionName: string;
  reason: string;
  imageUrl: string | null;
};

export type RecommendedCourse = {
  courseId: number;
  title: string;
  reason: string;
  imageUrl: string | null;
};

export type CoursePlace = {
  order: number;
  name: string;
  description: string;
  imageUrl: string;
  longitude: number;
  latitude: number;
  walkMinutes: number | null;
  hasAudio: boolean;
  audioUrl: string | null;
};

export type CourseBenefit = {
  title: string;
  description: string | null;
  url: string;
};

export type CourseDetailResponse = {
  courseId: number;
  regionName: string;
  title: string;
  places: CoursePlace[];
  benefits: CourseBenefit[];
};

export type SavedCourse = {
  savedCourseId: number;
  courseName: string;
  imageUrl: string;
  status: "BEFORE_TRIP" | "TRAVELING" | "COMPLETED";
}

export type SavedCourseResponse = {
  totalCount: number;
  page: number;
  limit: number;
  totalPages: number;
  courses: SavedCourse[];
}
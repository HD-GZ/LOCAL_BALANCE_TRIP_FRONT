import type { SavedCourse } from "@/features/recommendation/types";
import SavedCourseCard from "./SavedCourseCard";
import SavedCoursePager from "./SavedCoursePager";

type SavedCourseListProps = {
  courses: SavedCourse[];
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

export default function SavedCourseList({
  courses,
  page,
  totalPages,
  onPageChange,
}: SavedCourseListProps) {
  return (
    <div className="flex w-full flex-col items-start gap-7">
      <div className="grid w-full grid-cols-4 gap-4.5">
        {courses.map((course) => (
          <SavedCourseCard key={course.savedCourseId} course={course} />
        ))}
      </div>
      <SavedCoursePager page={page} totalPages={totalPages} onPageChange={onPageChange} />
    </div>
  );
}

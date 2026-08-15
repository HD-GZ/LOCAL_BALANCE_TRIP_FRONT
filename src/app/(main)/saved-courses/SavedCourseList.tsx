import Reveal from "@/components/common/Reveal";
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
    <div className="flex w-full flex-col gap-8">
      <ul className="grid w-full gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {courses.map((course, index) => (
          <Reveal as="li" key={course.savedCourseId} index={index}>
            <SavedCourseCard course={course} />
          </Reveal>
        ))}
      </ul>
      <SavedCoursePager page={page} totalPages={totalPages} onPageChange={onPageChange} />
    </div>
  );
}

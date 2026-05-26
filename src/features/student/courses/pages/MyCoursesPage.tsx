import { useAuth } from "../../../../contexts/AuthContext";
import CourseCard from "../../../shared/profile/components/CourseCard";
import { useUserEnrollments } from "../../dashboard/hooks/useUserEnrollments";
import { capitalize } from "../../../../utils/helper";

export default function MyCoursesPage() {
  const { user } = useAuth();
  const { enrollments, isLoading } = useUserEnrollments(user?.id ?? "");

  return (
    <div>
      <header className="curriculum-header">
        <h1 className="text-2xl font-semibold">My Courses</h1>
      </header>

      {isLoading ? (
        <p className="text-gray-500">Loading...</p>
      ) : !enrollments || enrollments.length === 0 ? (
        <p className="text-gray-500">You haven't enrolled in any courses yet.</p>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-x-14 gap-y-20 md:grid-cols-2 lg:grid-cols-4">
          {enrollments.map((enrollment) => (
            <CourseCard
              key={enrollment.course.id}
              course={enrollment.course}
              role={user?.role ?? "student"}
              enrollmentStatus={
                enrollment.status ? capitalize(enrollment.status) : "Unknown"
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}

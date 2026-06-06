import { Link } from "react-router-dom";
import { useAuth } from "../../../../contexts/AuthContext";
import CourseCard from "../../../shared/profile/components/CourseCard";
import { UserModel } from "../../../../models/user";
import { useUserEnrollments } from "../hooks/useUserEnrollments";
import { capitalize } from "../../../../utils/helper";
import StatsBar from "../components/statsBar";

export default function StudentDashboardPage() {
  const { user } = useAuth();
  const { enrollments } = useUserEnrollments(user?.id ?? "");

  const stats = {
    courses: 1,
    hoursThisWeek: 4.5,
    lessonsCompleted: 12,
    totalLessons: 30,
    streakDays: 5,
  };

  return (
    <div>
      <header className="curriculum-header">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
      </header>
      <div className="space-y-8">
        <StatsBar {...stats} />
        {/* <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded bg-white p-4">
            <p className="text-sm text-gray-500">Your Courses</p>
            <p className="mt-1 text-2xl font-semibold">
              {enrollments?.length ?? 0}
            </p>
          </div>
        </div> */}

        {enrollments && enrollments.length > 0 ? (
          <>
            <h2 className="mb-4 text-lg font-medium">Your courses</h2>

            <div className="mx-auto mt-10 mb-5 grid grid-cols-1 justify-between gap-x-14 gap-y-20 rounded md:grid-cols-2 lg:grid-cols-4">
              {enrollments.slice(0, 4).map((enrollment) => (
                <CourseCard
                  key={enrollment.course.id}
                  course={enrollment.course}
                  userModel={new UserModel(user)}
                  enrollmentStatus={
                    enrollment.status
                      ? capitalize(enrollment.status)
                      : "Unknown"
                  }
                />
              ))}
            </div>

            <Link
              to="/student/courses"
              className="mt-3 inline-block text-sm text-blue-600"
            >
              View all courses →
            </Link>
          </>
        ) : (
          <p>You don't have any courses</p>
        )}
      </div>
    </div>
  );
}

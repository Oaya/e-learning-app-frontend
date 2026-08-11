import { useParams, useNavigate } from "react-router-dom";
import { HiOutlineArrowLeft } from "react-icons/hi";

import LessonsList from "@/features/admin/lessons/components/LessonList";
import { useUser } from "@/features/admin/students/hooks/useUser";

export default function StudentLessonsPage() {
  const { id: studentIdParam } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user: student } = useUser(studentIdParam ?? "");

  if (!studentIdParam) return <p>User ID is missing.</p>;

  return (
    <LessonsList
      studentId={studentIdParam}
      student={student}
      topBar={(openModal) => (
        <>
          <button
            onClick={() => navigate(`/users/${studentIdParam}`)}
            className="flex items-center gap-2 text-gray-500 hover:text-gray-700"
          >
            <HiOutlineArrowLeft size={16} />
            Back to {student?.first_name} {student?.last_name}
          </button>

          <button onClick={openModal} className="btn-primary">
            + New lesson
          </button>
        </>
      )}
    />
  );
}

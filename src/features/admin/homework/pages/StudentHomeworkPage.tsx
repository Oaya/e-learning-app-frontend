import { useParams, useNavigate } from "react-router-dom";
import { HiOutlineArrowLeft } from "react-icons/hi2";

import HomeworkList from "@/features/admin/homework/components/HomeworkList";
import { useUser } from "@/features/admin/students/hooks/useUser";

export default function StudentHomeworkPage() {
  const { id: studentIdParam } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user: student } = useUser(studentIdParam ?? "");

  if (!studentIdParam) return <p>User ID is missing.</p>;

  return (
    <HomeworkList
      studentId={studentIdParam}
      student={student}
      searchPlaceholder="Search homework…"
      topBar={(openModal) => (
        <>
          <button
            onClick={() => navigate(`/users/${studentIdParam}`)}
            className="flex items-center gap-2 text-gray-500 hover:text-gray-700"
          >
            <HiOutlineArrowLeft size={16} />
            <span className="hidden sm:inline">
              Back to {student?.first_name} {student?.last_name}
            </span>
            <span className="sm:hidden">Back</span>
          </button>

          <button onClick={openModal} className="btn-primary-pink">
            + Assign Homework
          </button>
        </>
      )}
    />
  );
}

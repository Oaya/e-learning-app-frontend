import { HiOutlineSparkles } from "react-icons/hi";
import HomeworkList from "@/features/admin/homework/components/HomeworkList";
import { useAuth } from "@/contexts/AuthContext";

export default function HomeworkPage() {
  const { user: authUser } = useAuth();
  const canUseAI = authUser?.role === "admin" && authUser?.has_pro_access;

  return (
    <HomeworkList
      searchPlaceholder="Search student or task…"
      topBar={(openModal, openAiModal) => (
        <>
          <div>
            <h1 className="page-title">Homework</h1>
            <p className="mt-0.5 hidden text-sm text-gray-400 sm:block">
              Assign, track and review student homework
            </p>
          </div>
          <div className="flex gap-2">
            {canUseAI && (
              <button
                onClick={openAiModal}
                className="btn-white flex items-center gap-1.5"
              >
                <HiOutlineSparkles size={15} className="text-theme-purple-50" />
                <span className="hidden sm:inline">Generate with AI</span>
              </button>
            )}

            <button onClick={openModal} className="btn-primary-pink">
              + Assign Homework
            </button>
          </div>
        </>
      )}
    />
  );
}

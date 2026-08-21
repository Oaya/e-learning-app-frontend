import { useNavigate, useParams } from "react-router-dom";
import { MdOutlineKeyboardBackspace, MdMessage } from "react-icons/md";
import { FaRegEdit } from "react-icons/fa";
import { RiDeleteBinLine } from "react-icons/ri";
import { useState } from "react";
import { HiCalendar, HiUsers, HiDocumentText } from "react-icons/hi2";
import dayjs from "dayjs";

import { useGoals } from "@/features/shared/goals/hooks/useGoals";
import defaultAvatar from "@/assets/user.png";
import { useUser } from "@/features/admin/students/hooks/useUser";
import StatCard from "@/ui/StatCard";
import ConfirmModal from "@/ui/ConfirmModal";
import EditStudentModal from "@/features/admin/students/components/EditStudentModal";
import { useAllLessons } from "@/features/shared/lessons/hooks/useAllLessons";
import LessonsPanel from "@/features/admin/students/components/LessonsPanel";
import HomeworksPanel from "@/features/admin/students/components/HomeworksPanel";
import GoalsPanel from "@/features/shared/goals/components/GoalsPanel";
import { useHomeworks } from "@/features/shared/homeworks/hooks/useHomeworks";
import Badge from "@/ui/Badge";
import { USER_STATUS_BADGE } from "@/utils/constants";
import PageLoadingState from "@/ui/PageLoadingState";

export default function StudentProfile() {
  // Keep local form state, initialized safely even when user is null
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const userId = id || "";
  const { user, isLoading } = useUser(userId);
  const { lessons } = useAllLessons(userId);
  const { homeworks } = useHomeworks(userId);
  const { goals } = useGoals(userId);

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const {
    isDeleting,
    deleteStudent: deleteUsersMutation,
    isUpdating,
  } = useUser(userId, {
    onDeleteSuccess: () => {
      setIsDeleteOpen(false);
      navigate("/admin/students");
    },
  });

  if (!userId) return <p>User ID is missing.</p>;
  if (isLoading) return <PageLoadingState />;
  if (!user) return <p>User not found.</p>;

  //Stat Values//
  const hwDone = homeworks?.filter((h) => h.status === "done");
  const goalTotal = goals?.length ?? 0;
  const goalCompleted =
    goals?.filter((g) => g.status === "achieved").length ?? 0;
  const goalProgress = goals?.filter((g) => g.status === "in_progress").length;

  return (
    <div className="page-container">
      {/* Top bar */}
      <section className="page-header-row">
        <button
          onClick={() => navigate("/admin/students")}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-700"
        >
          <MdOutlineKeyboardBackspace size={16} />
          <span className="hidden sm:inline">Back to Students</span>
          <span className="sm:hidden">Back</span>
        </button>

        <div className="flex gap-2">
          <button onClick={() => {}} className="btn-white">
            <MdMessage size={16} /> Message
          </button>
        </div>
      </section>

      <section className="flex flex-col gap-6 rounded-xl border border-gray-300 bg-white px-6 py-6 md:my-10 md:flex-row md:items-stretch md:justify-between md:gap-10 md:px-8">
        <div className="flex items-center gap-4 gap-y-10">
          <div className="group relative h-14 w-14 shrink-0 md:h-28 md:w-28">
            <img
              src={user.avatar || defaultAvatar}
              alt="avatar"
              className="h-14 w-14 rounded-full object-cover md:h-28 md:w-28"
            />
          </div>

          <div className="item-end flex min-w-0 flex-col justify-between">
            <h1 className="font-semibold wrap-break-word md:mb-2 md:text-2xl">
              {user.first_name} {user.last_name}
            </h1>
            <p className="break-all">{user.email}</p>
            {user.learning_languages && user.learning_languages.length > 0 && (
              <div className="mt-1 flex flex-wrap gap-2 md:mt-2">
                {user.learning_languages.map((language) => (
                  <span
                    key={language}
                    className="bg-theme-green-30 text-theme-green-20 w-fit rounded-full px-1.5 py-0.5 text-[11px] md:px-2 md:py-1 md:text-sm"
                  >
                    {language}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col items-start gap-4 md:items-end md:justify-between">
          <div className="flex items-center gap-4 md:flex-col md:items-end md:gap-1">
            <Badge status={user.status} constant={USER_STATUS_BADGE} />

            <p className="text-gray-500">
              Joined: {dayjs(user.created_at).format("YYYY-MM-DD")}
            </p>
          </div>

          <div className="flex w-full gap-4 md:w-auto">
            <button
              onClick={() => setIsEditOpen(true)}
              className="btn-primary flex flex-1 items-center justify-center gap-1.5 px-4 py-2 md:flex-none"
            >
              <FaRegEdit size={16} /> Edit
            </button>
            <button
              className="btn-primary-pink flex flex-1 items-center justify-center gap-1.5 md:flex-none"
              onClick={() => setIsDeleteOpen(true)}
            >
              <RiDeleteBinLine size={16} />
              Delete
            </button>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="grid grid-cols-2 gap-2 md:gap-4 md:pt-4 lg:grid-cols-4">
        <StatCard
          icon={HiUsers}
          label="Total lessons"
          value={lessons?.length ?? 0}
          sub="Lessons total"
        />
        <StatCard
          icon={HiCalendar}
          label="Homework done"
          value={hwDone?.length ?? 0}
          sub="Homework Done"
        />
        <StatCard
          icon={HiDocumentText}
          label="Goal completed"
          value={goalTotal === 0 ? 0 : `${goalCompleted}/${goalTotal}`}
          sub={`${goalProgress} in progress`}
        />
        {/*
        <StatCard
          icon={HiCreditCard}
          iconColor="text-theme-yellow-20"
          label="Balance"
          value="$60"
          sub="1 lesson owed"
        /> */}
      </section>

      {/* Two panels — 50/50 */}
      <div className="flex flex-col gap-4 md:grid md:grid-cols-5 md:items-start md:gap-6">
        {/* Left — lessons + payment */}
        <div className="flex flex-col gap-4 md:col-span-2 md:gap-6">
          <LessonsPanel lessons={lessons} user={user} />
        </div>

        {/* Right — homeworks + goals */}
        <div className="flex flex-col gap-4 md:col-span-3 md:gap-6">
          <HomeworksPanel homeworks={homeworks} user={user} />
          <GoalsPanel goals={goals} userId={userId} />
        </div>
      </div>

      <ConfirmModal
        isOpen={isDeleteOpen}
        title="Delete Users"
        message={`Are you sure you want to delete ${user.first_name} ${user.last_name}? This action cannot be undone.`}
        isSubmitting={isDeleting}
        onCancel={() => setIsDeleteOpen(false)}
        onConfirm={() => deleteUsersMutation(userId)}
      />

      <EditStudentModal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        user={user}
        isSaving={isUpdating}
      />
    </div>
  );
}

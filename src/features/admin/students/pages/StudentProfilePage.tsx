import { Link, useNavigate, useParams } from "react-router-dom";
import { MdOutlineKeyboardBackspace, MdMessage } from "react-icons/md";
import { FaRegEdit } from "react-icons/fa";
import { RiDeleteBinLine } from "react-icons/ri";
import { useState } from "react";
import { HiCalendar, HiUsers } from "react-icons/hi";

import defaultAvatar from "../../../../assets/user.png";
import { useUser } from "../hooks/useUser";
import StatCard from "../../../../ui/StatCard";

import ConfirmModal from "../../../../ui/ConfirmModal";
import EditStudentModal from "../components/EditStudentModal";
import { useAllLessons } from "../../lessons/hooks/useAllLessons";
import LessonsPanel from "../components/LessonsPanel";
import HomeworksPanel from "../components/HomeworksPanel";
import GoalsPanel from "../components/GoalsPanel";
import { useHomeworks } from "../../homework/hooks/useHomeworks";
import Badge from "../../../../ui/badge";
import { USER_STATUS_BADGE } from "../../../../utils/constants";

export default function StudentProfile() {
  // Keep local form state, initialized safely even when user is null
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const userId = id || "";
  const { user, isLoading } = useUser(userId);
  const { lessons } = useAllLessons(userId);
  const { homeworks } = useHomeworks(userId);

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
  if (isLoading) return <p>Loading…</p>;
  if (!user) return <p>User not found.</p>;

  //Stat Values//
  const hwDone = homeworks?.filter((h) => h.status === "done");
  const hwOverDue = homeworks?.filter((h) => h.status === "overdue");

  return (
    <div className="space-y-6 p-10">
      {/* Top bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <Link
            to="/admin/students"
            className="flex items-center gap-1.5 text-gray-500"
          >
            <MdOutlineKeyboardBackspace size={16} /> Back to Students
          </Link>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => {}}
            className="btn-white flex items-center gap-1.5"
          >
            <MdMessage size={16} /> Message
          </button>
        </div>
      </div>

      <section className="my-10 flex items-stretch justify-between gap-10 rounded-xl border border-gray-300 bg-white px-8 py-6">
        <div className="flex items-center gap-6 gap-y-10">
          <div className="group relative h-28 w-28">
            <img
              src={user.avatar || defaultAvatar}
              alt="avatar"
              className="h-28 w-28 rounded-full object-cover"
            />
          </div>

          <div className="item-end flex flex-col justify-between">
            <h1 className="mb-2 text-2xl font-semibold">
              {user.first_name} {user.last_name}
            </h1>
            <p>{user.email}</p>
            {user.learning_languages && user.learning_languages.length > 0 && (
              <p className="text-gray-500">
                Learning languages: {user.learning_languages.join(", ")}
              </p>
            )}
          </div>
        </div>

        <div className="flex flex-col items-end justify-between gap-2">
          <div className="flex flex-col items-end gap-1">
            <Badge status={user.status} constant={USER_STATUS_BADGE} />

            <p className="text-gray-500">
              Joined: {user.created_at.split("T")[0]}
            </p>
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => setIsEditOpen(true)}
              className="btn-primary flex items-center gap-1.5 px-4 py-2"
            >
              <FaRegEdit size={16} /> Edit
            </button>
            <button
              className="btn-primary-pink flex items-center gap-1.5"
              onClick={() => setIsDeleteOpen(true)}
            >
              <RiDeleteBinLine size={16} />
              Delete
            </button>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
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
          sub={
            hwOverDue && hwOverDue.length > 0 ? (
              <>
                Homework Done
                <br />
                {hwOverDue.length} overdue
              </>
            ) : (
              "Homework Done"
            )
          }
        />
        {/* <StatCard
          icon={HiDocumentText}
          iconColor="text-theme-yellow-20"
          label="Goal completed"
          value={"2/3"}
          sub="2 in progress"
        />
        <StatCard
          icon={HiCreditCard}
          iconColor="text-theme-yellow-20"
          label="Balance"
          value="$60"
          sub="1 lesson owed"
        /> */}
      </section>

      {/* Two panels — 50/50 */}
      <div className="grid grid-cols-2 items-start gap-5">
        {/* Left — lessons + payment */}
        <div className="flex flex-col gap-4">
          <LessonsPanel lessons={lessons} user={user} />

          <div className="rounded-xl border border-gray-200 bg-white p-5">
            <p className="panel-header mb-3">Payment</p>
            <p className="text-sm text-gray-400">
              Payment tracking coming soon.
            </p>
          </div>
        </div>

        {/* Right — homeworks + goals */}
        <div className="flex flex-col gap-4">
          <HomeworksPanel homeworks={homeworks} user={user} />
          <GoalsPanel userId={userId} />
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

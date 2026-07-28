import { Link, useNavigate, useParams } from "react-router-dom";
import { MdOutlineKeyboardBackspace, MdMessage } from "react-icons/md";
import { FaRegEdit } from "react-icons/fa";
import { RiDeleteBinLine } from "react-icons/ri";
import { useState } from "react";
import {
  HiCalendar,
  HiCreditCard,
  HiDocumentText,
  HiUsers,
} from "react-icons/hi";

import defaultAvatar from "../../../../assets/user.png";
import { useUser } from "../hooks/useUser";
import StatCard from "../../../../ui/StatCard";

import UpsertLessonModal from "../../lessons/components/UpsertLessonModal";
import { useAuth } from "../../../../contexts/AuthContext";

import ConfirmModal from "../../../../ui/ConfirmModal";
import UpsertHomeworkModal from "../../homework/components/UpsertHomeworkModal";
import { useAllLessons } from "../../lessons/hooks/useAllLessons";
import LessonsPanel from "../components/LessonsPanel";
import HomeworksPanel from "../components/HomeworksPanel";
import { useHomeworks } from "../../homework/hooks/useHomeworks";

export default function UserProfile() {
  // Keep local form state, initialized safely even when user is null
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const userId = id || "";
  const { user, isLoading } = useUser(userId);
  const { user: authUser } = useAuth();
  const { lessons } = useAllLessons(userId);
  const { homeworks } = useHomeworks(userId);

  const [isCreateLessonOpen, setIsCreateLessonOpen] = useState(false);
  const [isCreateHWOpen, setIsCreateHWOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const { isDeleting, deleteUsersMutation } = useUser(userId, {
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
          <button
            onClick={() => setIsCreateLessonOpen(true)}
            className="btn-white flex items-center gap-1.5"
          >
            <HiCalendar size={16} /> New Lesson
          </button>
          <button
            onClick={() => setIsCreateHWOpen(true)}
            className="btn-secondary"
          >
            + Assign Homework
          </button>
        </div>
      </div>

      <section className="my-10 flex items-center justify-between gap-10 rounded-xl border border-gray-300 bg-white px-8 py-6">
        <div className="flex items-center gap-6 gap-y-10">
          <div className="group relative h-28 w-28">
            <img
              src={user.avatar || defaultAvatar}
              alt="avatar"
              className="h-28 w-28 rounded-full object-cover"
            />
          </div>

          <div className="flex flex-col justify-center">
            <h1 className="text-2xl font-semibold">
              {user.first_name} {user.last_name}
            </h1>
            <p>{user.email}</p>
            <p className="text-gray-500">
              Joined: {user.created_at.split("T")[0]}
            </p>
          </div>
        </div>

        <div className="flex gap-4">
          <button
            onClick={() => {}}
            className="btn-primary flex items-center gap-1.5"
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
      </section>

      {/* Stats */}
      <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          icon={HiUsers}
          iconColor="text-theme-yellow-20"
          label="Total lessons"
          value={lessons?.length ?? 0}
          sub="Lessons total"
        />
        <StatCard
          icon={HiCalendar}
          iconColor="text-theme-yellow-20"
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

      {/* Two panels */}
      <div className="flex items-start gap-5">
        {/* Left — lessons */}
        <LessonsPanel lessons={lessons} />
        {/* Right */}
        <div className="flex w-72 shrink-0 flex-col gap-4">
          <HomeworksPanel homeworks={homeworks} />
          <div className="rounded-xl border border-gray-200 bg-white p-5">
            <p className="panel-header mb-3">Payment</p>
            <p className="text-sm text-gray-400">
              Payment tracking coming soon.
            </p>
          </div>
        </div>
      </div>

      <UpsertLessonModal
        isOpen={isCreateLessonOpen}
        onClose={() => setIsCreateLessonOpen(false)}
        type="Create"
        student={user}
        lessons={lessons}
        timezone={authUser?.timezone}
      />

      <ConfirmModal
        isOpen={isDeleteOpen}
        title="Delete Users"
        message={`Are you sure you want to delete ${user.first_name} ${user.last_name}? This action cannot be undone.`}
        isSubmitting={isDeleting}
        onCancel={() => setIsDeleteOpen(false)}
        onConfirm={() => deleteUsersMutation(userId)}
      />

      <UpsertHomeworkModal
        isOpen={isCreateHWOpen}
        onClose={() => setIsCreateHWOpen(false)}
        type="Assign"
        student={user}
      />
    </div>
  );
}

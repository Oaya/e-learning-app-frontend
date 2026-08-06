import {
  HiUsers,
  HiCalendar,
  HiDocumentText,
  HiCreditCard,
} from "react-icons/hi";
import { useState } from "react";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
dayjs.extend(utc);
dayjs.extend(timezone);

import { useAuth } from "../../../../contexts/AuthContext";

import StatCard from "../../../../ui/StatCard";
import { greeting } from "../../../../utils/helper";
import { useLessons } from "../../lessons/hooks/useLessons";
import TodayLessonsPanel from "../components/TodayLessonsPanel";
import AllStudentPanel from "../components/AllStudentPanel";
import UpsertLessonModal from "../../lessons/components/UpsertLessonModal";
import { useUsersWithStatuses } from "../../students/hooks/useUsersWithStatues";
import { useHomeworks } from "../../homework/hooks/useHomeworks";

export default function AdminDashboardPage() {
  const { user } = useAuth();
  const { users: students } = useUsersWithStatuses();
  const { lessons } = useLessons();
  const { homeworks } = useHomeworks();
  const [modalOpen, setModalOpen] = useState(false);

  //Stat cards sub//
  const studentSub = students?.filter(
    (st) => dayjs(st.created_at).month() === dayjs().month(),
  );

  const pending =
    homeworks?.filter((h) => h.status === "draft" || h.status === "pending")
      .length ?? 0;
  const overdue = homeworks?.filter((h) => h.status === "overdue").length ?? 0;

  return (
    <div className="space-y-6 pb-10">
      {/* Top bar */}
      <section className="flex items-center justify-between bg-gray-200 px-10 py-6">
        <div>
          <h1 className="text-xl font-semibold text-gray-800">
            {greeting()},{" "}
            <span className="text-theme-purple-40">{user?.first_name}</span>
          </h1>
        </div>
        <button onClick={() => setModalOpen(true)} className="btn-primary">
          + New lesson
        </button>
      </section>

      {/* Stat cards */}
      <section className="grid grid-cols-2 gap-6 px-10 pt-4 lg:grid-cols-4">
        <StatCard
          icon={HiUsers}
          label="Students"
          value={students ? students?.length : 0}
          sub={`+${studentSub?.length ?? 0} this month`}
          subColor={studentSub?.length ? true : false}
        />
        <StatCard
          icon={HiCalendar}
          label="Lessons today"
          value={lessons?.length ?? 0}
        />
        <StatCard
          icon={HiDocumentText}
          label="Homework pending"
          value={pending}
          sub={`${overdue} past overdue`}
        />
        {/* <StatCard
          icon={HiCreditCard}
          label="Unpaid lessons"
          value="$240"
          sub="Across 3 students"
        /> */}
      </section>

      {/* Two panels */}
      <div className="grid grid-cols-1 gap-10 px-10 lg:grid-cols-5">
        {/* Today lessons */}
        {lessons && user && (
          <div className="lg:col-span-3">
            <TodayLessonsPanel lessons={lessons} user={user} />
          </div>
        )}

        {/* All students */}
        {students && (
          <div className="lg:col-span-2">
            <AllStudentPanel students={students} />
          </div>
        )}
      </div>

      <UpsertLessonModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        type="Create"
        lessons={lessons}
        timezone={user?.timezone}
      />
    </div>
  );
}

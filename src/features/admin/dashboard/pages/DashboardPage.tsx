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

export default function AdminDashboardPage() {
  const { user } = useAuth();
  const { users: students } = useUsersWithStatuses();
  const { lessons } = useLessons();
  const [modalOpen, setModalOpen] = useState(false);

  //Stat cards sub//
  const studentSub = students?.filter(
    (st) => dayjs(st.created_at).month() === dayjs().month(),
  );

  return (
    <div className="space-y-6 pb-10">
      {/* Header */}
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
      <section className="grid grid-cols-2 gap-4 px-10 pt-4 lg:grid-cols-4">
        <StatCard
          icon={HiUsers}
          iconColor="text-theme-yellow-20"
          label="Students"
          value={students ? students?.length : 0}
          sub={`+${studentSub?.length ?? 0} this month`}
          subColor={studentSub?.length ? true : false}
        />
        <StatCard
          icon={HiCalendar}
          iconColor="text-theme-yellow-20"
          label="Lessons today"
          value={lessons?.length ?? 0}
        />
        <StatCard
          icon={HiDocumentText}
          iconColor="text-theme-yellow-20"
          label="Homework pending"
          value={5}
          sub="2 overdue"
        />
        <StatCard
          icon={HiCreditCard}
          iconColor="text-theme-yellow-20"
          label="Unpaid lessons"
          value="$240"
          sub="Across 3 students"
        />
      </section>

      {/* Two panels */}
      <div className="grid grid-cols-1 gap-10 px-10 lg:grid-cols-2">
        {/* Today lessons */}
        {lessons && user && <TodayLessonsPanel lessons={lessons} user={user} />}

        {/* All students */}
        {students && <AllStudentPanel students={students} />}
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

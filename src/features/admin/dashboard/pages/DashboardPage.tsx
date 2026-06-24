import {
  HiUsers,
  HiCalendar,
  HiDocumentText,
  HiCreditCard,
} from "react-icons/hi";
import { useAuth } from "../../../../contexts/AuthContext";
import { useUsers } from "../../students/hooks/useUsers";
import StatCard from "../components/StatCard";
import { greeting } from "../../../../utils/helper";
import { useState } from "react";

import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
dayjs.extend(utc);
dayjs.extend(timezone);
import { useSessions } from "../../sessions/hooks/useSessions";
import TodaySessionsPanel from "../components/TodaySessionsPanel";
import AllStudentPanel from "../components/AllStudentPanel";
import NewSessionModal from "../../sessions/components/NewSessionModal";

export default function AdminDashboardPage() {
  const { user } = useAuth();
  const { users: students } = useUsers({});
  const { sessions } = useSessions();
  const [modalOpen, setModalOpen] = useState(false);

  //Stat cards sub//
  const studentSub = students?.filter(
    (st) => dayjs(st.created_at).month() === dayjs().month(),
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between bg-gray-200 px-10 py-6">
        <div>
          <h1 className="text-xl font-semibold text-gray-800">
            {greeting()},{" "}
            <span className="text-theme-purple-40">{user?.first_name}</span>
          </h1>
        </div>
        <button onClick={() => setModalOpen(true)} className="btn-primary">
          + New session
        </button>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-4 p-10 lg:grid-cols-4">
        <StatCard
          icon={<HiUsers size={20} className="text-theme-yellow-20" />}
          label="Students"
          value={students ? students?.length : 0}
          sub={`+${studentSub?.length ?? 0} this month`}
          subColor={studentSub?.length ? true : false}
        />
        <StatCard
          icon={<HiCalendar size={20} className="text-theme-yellow-20" />}
          label="Sessions today"
          value={sessions?.length ?? 0}
        />
        <StatCard
          icon={<HiDocumentText size={20} className="text-theme-yellow-20" />}
          label="Homework pending"
          value={5}
          sub="2 overdue"
        />
        <StatCard
          icon={<HiCreditCard size={20} className="text-theme-yellow-20" />}
          label="Unpaid sessions"
          value="$240"
          sub="Across 3 students"
        />
      </div>

      {/* Two panels */}
      <div className="grid grid-cols-1 gap-4 p-10 lg:grid-cols-2">
        {/* Today sessions */}
        {sessions && user && (
          <TodaySessionsPanel sessions={sessions} user={user} />
        )}

        {/* All students */}
        {students && <AllStudentPanel students={students} />}
      </div>

      {students && (
        <NewSessionModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          students={students}
          sessions={sessions}
          timezone={user?.timezone}
        />
      )}
    </div>
  );
}

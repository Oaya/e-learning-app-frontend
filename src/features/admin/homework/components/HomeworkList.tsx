import { useMemo, useState, type ReactNode } from "react";
import {
  HiOutlineDocumentText,
  HiOutlineCheck,
  HiOutlineClock,
  HiOutlineExclamationCircle,
} from "react-icons/hi2";

import HomeworkCard from "./HomeworkCard";
import UpsertHomeworkModal from "./UpsertHomeworkModal";
import EmptyState from "@/ui/EmptyState";
import StatCard from "@/ui/StatCard";
import TabFilters from "@/ui/TabFilters";
import { useHomeworks } from "@/features/shared/homeworks/hooks/useHomeworks";
import {
  matchesTab,
  inGroup,
  type HomeworkFilterTab,
} from "@/features/shared/homeworks/constants";
import type { User } from "@/type/user";
import CardHeader from "@/ui/CardHeader";

export const HOMEWORK_TABS: HomeworkFilterTab[] = [
  "all",
  "submitted",
  "overdue",
  "pending",
  "reviewed",
];

export const HOMEWORK_GROUP_ORDER: Exclude<HomeworkFilterTab, "all">[] = [
  "submitted",
  "overdue",
  "pending",
  "reviewed",
];

type HomeworkListProps = {
  studentId?: string;
  student?: User;
  searchPlaceholder: string;
  topBar: (openModal: () => void) => ReactNode;
};

export default function HomeworkList({
  studentId,
  student,
  searchPlaceholder,
  topBar,
}: HomeworkListProps) {
  const [activeTab, setActiveTab] = useState<HomeworkFilterTab>("all");
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const { homeworks, isLoading } = useHomeworks(studentId);

  const filtered = useMemo(() => {
    return homeworks?.filter((hw) => {
      const matchedTab = matchesTab(hw, activeTab);
      const studentName = `${hw.student.first_name} ${hw.student.last_name}`;
      const q = search.toLowerCase();
      const matchSearch =
        !q ||
        hw.title.toLowerCase().includes(q) ||
        studentName.toLowerCase().includes(q);
      return matchedTab && matchSearch;
    });
  }, [homeworks, activeTab, search]);

  // Stats — draft counts as pending
  const total = homeworks?.length ?? 0;
  const pending =
    homeworks?.filter((h) => h.status === "draft" || h.status === "pending")
      .length ?? 0;
  const submitted =
    homeworks?.filter((h) => h.status === "submitted").length ?? 0;
  const overdue = homeworks?.filter((h) => h.status === "overdue").length ?? 0;

  return (
    <div className="page-container">
      {/* Top bar */}
      <section className="page-header-row">
        {topBar(() => setModalOpen(true))}
      </section>

      {/* Stats */}
      <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          icon={HiOutlineDocumentText}
          label="Total assigned"
          value={total}
          sub="all time"
        />
        <StatCard
          icon={HiOutlineCheck}
          label="Submitted"
          value={submitted}
          sub="awaiting review"
        />
        <StatCard
          icon={HiOutlineClock}
          label="Pending"
          value={pending}
          sub="not submitted yet"
        />
        <StatCard
          icon={HiOutlineExclamationCircle}
          label="Overdue"
          value={overdue}
          sub="past due date"
        />
      </section>

      {/* Filters */}
      <div className="items-center xl:flex">
        <TabFilters
          tabs={HOMEWORK_TABS}
          activeTab={activeTab}
          onTabChange={(tab) => setActiveTab(tab as HomeworkFilterTab)}
        />

        <input
          type="text"
          placeholder={searchPlaceholder}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="form-input mt-2 mb-0 ml-auto h-10.5 text-xs md:text-[16px] xl:mt-0 xl:w-100"
        />
      </div>

      {isLoading && <p className="text-sm text-gray-400">Loading homework…</p>}

      {/* Grouped list */}
      {filtered?.length === 0 ? (
        <EmptyState message="No homework matches your filter." />
      ) : (
        <div className="space-y-6">
          {HOMEWORK_GROUP_ORDER.map((status) => {
            const group = filtered?.filter((h) => inGroup(h, status));
            if (!group?.length) return null;
            return (
              <section key={status}>
                <CardHeader
                  type={
                    status === "submitted" ? "Submitted — needs review" : status
                  }
                />
                <div className="space-y-2">
                  {group?.map((hw) => (
                    <HomeworkCard key={hw.id} hw={hw} />
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      )}

      <UpsertHomeworkModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        type="Assign"
        student={student}
      />
    </div>
  );
}

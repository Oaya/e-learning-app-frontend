import { useEffect, useMemo, useState } from "react";
import ReactPaginate from "react-paginate";
import {
  HiOutlineDocumentText,
  HiOutlineCheck,
  HiOutlineClock,
  HiOutlineExclamationCircle,
} from "react-icons/hi2";

import { useHomeworks } from "@/features/shared/homeworks/hooks/useHomeworks";
import StatCard from "@/ui/StatCard";
import TabFilters from "@/ui/TabFilters";
import StudentHomeworkCard from "@/features/student/homework/components/StudentHomeworkCard";
import EmptyState from "@/ui/EmptyState";
import {
  inGroup,
  matchesTab,
  type HomeworkFilterTab,
} from "@/features/shared/homeworks/constants";
import CardHeader from "@/ui/CardHeader";
import PageLoadingState from "@/ui/PageLoadingState";
import { PAGE_SIZE } from "@/utils/constants";

export const STUDENT_HOMEWORK_TABS: HomeworkFilterTab[] = [
  "all",
  "overdue",
  "pending",
  "submitted",
  "reviewed",
];

export const STUDENT_HOMEWORK_GROUP_ORDER: Exclude<HomeworkFilterTab, "all">[] =
  ["overdue", "pending", "submitted", "reviewed"];

export default function StudentHomeworkPage() {
  const [activeTab, setActiveTab] = useState<HomeworkFilterTab>("all");
  const { homeworks, isLoading } = useHomeworks();
  const [pastPage, setPastPage] = useState(1);

  const filtered = useMemo(
    () => homeworks?.filter((h) => matchesTab(h, activeTab)),
    [homeworks, activeTab],
  );

  useEffect(() => {
    setPastPage(1);
  }, [activeTab]);

  //Stats - draft counts as pending
  const total = homeworks?.length ?? 0;
  const pending =
    homeworks?.filter((h) => h.status === "draft" || h.status === "pending")
      .length ?? 0;
  const submitted =
    homeworks?.filter((h) => h.status === "submitted").length ?? 0;
  const overdue = homeworks?.filter((h) => h.status === "overdue").length ?? 0;

  if (isLoading) {
    return <PageLoadingState message="Loading homeworks..." />;
  }

  return (
    <div className="page-container">
      {/* Top bar */}
      <section className="page-header-row">
        <h1 className="page-title">Homework</h1>
      </section>

      {/* Stat cards */}
      <section className="grid grid-cols-2 gap-4 md:gap-6 lg:grid-cols-4">
        <StatCard
          icon={HiOutlineDocumentText}
          label="Total assigned"
          value={total}
        />
        <StatCard
          icon={HiOutlineClock}
          label="Pending"
          value={pending}
          sub="not finished yet"
        />
        <StatCard
          icon={HiOutlineCheck}
          label="Submitted"
          value={submitted}
          sub="waiting for review"
        />
        <StatCard
          icon={HiOutlineExclamationCircle}
          label="Overdue"
          value={overdue}
          sub="past due date"
        />
      </section>

      {/* Filters */}
      <TabFilters
        tabs={STUDENT_HOMEWORK_TABS}
        activeTab={activeTab}
        onTabChange={(tab) => setActiveTab(tab as HomeworkFilterTab)}
      />

      {/* Grouped list */}
      {filtered?.length === 0 ? (
        <EmptyState message="No homework matches your filter." />
      ) : (
        <div className="space-y-6">
          {STUDENT_HOMEWORK_GROUP_ORDER.map((status) => {
            const group = filtered?.filter((h) => inGroup(h, status));
            if (!group?.length) return null;

            const isReviewed = status === "reviewed";
            const visibleGroup = isReviewed
              ? group.slice((pastPage - 1) * PAGE_SIZE, pastPage * PAGE_SIZE)
              : group;

            return (
              <section key={status}>
                <CardHeader
                  type={
                    status == "submitted"
                      ? "Submitted — waiting for review"
                      : status
                  }
                />
                <div className="space-y-4">
                  {visibleGroup.map((hw) => (
                    <StudentHomeworkCard key={hw.id} hw={hw} />
                  ))}
                </div>

                {isReviewed && group.length > PAGE_SIZE && (
                  <ReactPaginate
                    breakLabel="..."
                    nextLabel=">"
                    previousLabel="<"
                    forcePage={pastPage - 1}
                    onPageChange={(e) => setPastPage(e.selected + 1)}
                    pageRangeDisplayed={5}
                    pageCount={Math.ceil(group.length / PAGE_SIZE)}
                    renderOnZeroPageCount={null}
                    containerClassName="mt-4 flex items-center justify-center gap-2"
                    pageClassName="pagination"
                    activeClassName="bg-gray-200 font-semibold"
                    previousClassName="pagination"
                    nextClassName="pagination"
                    disabledClassName="opacity-50 cursor-not-allowed"
                  />
                )}
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}

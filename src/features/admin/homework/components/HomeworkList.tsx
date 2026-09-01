import { useEffect, useMemo, useState, type ReactNode } from "react";
import ReactPaginate from "react-paginate";
import {
  HiOutlineDocumentText,
  HiOutlineCheck,
  HiOutlineClock,
  HiOutlineExclamationCircle,
} from "react-icons/hi";

import HomeworkCard from "./HomeworkCard";
import UpsertHomeworkModal from "./UpsertHomeworkModal";
import AiGenerateHomeworkModal from "./AiGenerateHomeworkModal";
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
import PageLoadingState from "@/ui/PageLoadingState";
import { PAGE_SIZE } from "@/utils/constants";

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
  topBar: (openModal: () => void, openAiModal: () => void) => ReactNode;
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
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const { homeworks, isLoading } = useHomeworks(studentId);
  const [pastPage, setPastPage] = useState(1);

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

  useEffect(() => {
    setPastPage(1);
  }, [search, activeTab]);

  // Stats
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
        {topBar(
          () => setModalOpen(true),
          () => setAiModalOpen(true),
        )}
      </section>

      {/* Stats */}
      <section className="grid grid-cols-2 gap-2 md:gap-4 lg:grid-cols-4">
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

      {/* Grouped list */}
      {filtered?.length === 0 ? (
        <EmptyState message="No homework matches your filter." />
      ) : (
        <div className="space-y-6">
          {HOMEWORK_GROUP_ORDER.map((status) => {
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
                    status === "submitted" ? "Submitted — needs review" : status
                  }
                />
                <div className="space-y-4">
                  {visibleGroup?.map((hw) => (
                    <HomeworkCard key={hw.id} hw={hw} />
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

      <UpsertHomeworkModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        type="Assign"
        student={student}
      />

      <AiGenerateHomeworkModal
        isOpen={aiModalOpen}
        onClose={() => setAiModalOpen(false)}
        student={
          student
            ? {
                value: student.id,
                label: `${student.first_name} ${student.last_name}`,
                avatar: student.avatar,
                language_levels: student.language_levels,
              }
            : undefined
        }
      />
    </div>
  );
}

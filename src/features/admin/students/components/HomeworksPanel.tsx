import dayjs from "dayjs";
import { useState } from "react";
import { Link } from "react-router-dom";
import { HiArrowRight } from "react-icons/hi";

import Badge from "@/ui/Badge";
import type { Homework } from "@/type/homework";
import { HW_STATUS_BADGE } from "@/utils/constants";
import UpsertHomeworkModal from "@/features/admin/homework/components/UpsertHomeworkModal";
import type { User } from "@/type/user";

type Props = { homeworks: Homework[] | undefined; user: User | undefined };

export default function HomeworksPanel({ homeworks, user }: Props) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="panel-box min-w-0 flex-1">
      <div className="mb-4 flex items-center justify-between">
        <p className="panel-header mb-4">Homeworks</p>

        <div className="flex items-center justify-between gap-4">
          <Link
            to={`/admin/students/${user!.id}/homework`}
            className="view-all"
          >
            View all <HiArrowRight className="h-3 w-3" />
          </Link>
          <button
            onClick={() => setIsModalOpen(true)}
            className="btn-white px-2 py-1"
          >
            + New
          </button>
        </div>
      </div>

      {homeworks?.length === 0 ? (
        <p className="py-8 text-center text-sm text-gray-400">
          No homework assigned.
        </p>
      ) : (
        <div className="divide-y divide-gray-100">
          {homeworks?.slice(0, 6).map((hw) => {
            const status = hw.submission?.status ?? "pending";
            const displayStatus = status === "draft" ? "pending" : status;
            return (
              <div
                key={hw.id}
                className="flex items-center justify-between py-2.5"
              >
                <div className="min-w-0 flex-1 pr-3">
                  <p className="truncate text-sm font-medium text-gray-800">
                    {hw.title}
                  </p>
                  <p className="mt-0.5 text-xs text-gray-400">
                    Due: {dayjs(hw.due_date).format("YYYY-MM-DD")}
                  </p>
                </div>
                <Badge
                  status={displayStatus}
                  constant={HW_STATUS_BADGE}
                  className="px-2 py-0.5 text-[12px]"
                />
              </div>
            );
          })}
        </div>
      )}

      <UpsertHomeworkModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        type="Assign"
        student={user}
      />
    </div>
  );
}

import {
  HiOutlinePencil,
  HiOutlineEye,
  HiOutlineTrash,
  // HiOutlineBell,
  HiOutlineCalendar,
  HiOutlineLanguage,
} from "react-icons/hi2";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import type { Homework } from "@/type/homework";
import { getHomeworkDateLabel } from "@/utils/helper";
import { HW_BORDER_COLOR, HW_STATUS_BADGE } from "@/utils/constants";
import ActionBtn from "@/ui/ActionButton";
import ConfirmModal from "@/ui/ConfirmModal";
import { useHomeworks } from "@/features/shared/homeworks/hooks/useHomeworks";
import UpsertHomeworkModal from "./UpsertHomeworkModal";
import defaultAvatar from "@/assets/user.png";
import Badge from "@/ui/Badge";

type Props = {
  hw: Homework;
};

export default function HomeworkCard({ hw }: Props) {
  const navigate = useNavigate();
  const [deletingHWId, setDeletingHWId] = useState<string | null>(null);
  const [editHWId, setEditHWId] = useState<string | null>(null);
  const { isDeleting, deleteHomework } = useHomeworks(undefined, {
    onDeleteSuccess: () => setDeletingHWId(null),
  });

  const dateLabel = getHomeworkDateLabel(hw);
  const displayStatus = hw.status === "draft" ? "pending" : hw.status;
  const isReviewable =
    displayStatus === "submitted" || displayStatus === "reviewed";

  return (
    <div
      className={`card ${HW_BORDER_COLOR[displayStatus]} ${isReviewable ? "cursor-pointer" : ""}`}
      onClick={() => {
        if (!isReviewable) return;
        navigate(`/admin/homework/${hw.id}/review`);
      }}
    >
      {/* Main */}
      <div className="h-20 min-w-0 flex-1 md:h-14">
        <div className="mb-2 flex flex-wrap items-center gap-2">
          <p className="text-sm font-medium text-gray-800">{hw.title}</p>
          {/* {hw.ai_generated && (
            <span className="flex items-center gap-1 rounded-full bg-purple-50 px-2 py-0.5 text-[11px] font-medium text-purple-700">
              <HiOutlineSparkles className="h-3 w-3" /> AI generated
            </span>
          )} */}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <span className="flex items-center gap-1 text-xs text-gray-400">
            <HiOutlineCalendar size={14} />
            {dateLabel}
          </span>
          {hw.language && (
            <span className="flex items-center gap-1 text-xs text-gray-400 capitalize">
              <HiOutlineLanguage size={14} />
              {hw.language} · {hw.level}
            </span>
          )}
          <span className="flex items-center gap-1.5 text-xs text-gray-400">
            <img
              src={hw.student.avatar || defaultAvatar}
              alt="avatar"
              className="h-6 w-6 rounded-full object-cover group-hover:opacity-80"
            />{" "}
            {hw.student.first_name} {hw.student.last_name}{" "}
          </span>
        </div>
      </div>

      {/* Badge + actions */}
      <div className="flex shrink-0 flex-col items-end gap-2">
        <Badge status={displayStatus} constant={HW_STATUS_BADGE} />

        <div className="flex gap-1">
          {/* View — goes to review page for submitted/reviewed, otherwise just icon */}
          {(displayStatus === "submitted" || displayStatus === "reviewed") && (
            <ActionBtn
              title="Review"
              onClick={() => navigate(`/admin/homework/${hw.id}/review`)}
            >
              <HiOutlineEye size={16} />
            </ActionBtn>
          )}

          {(displayStatus === "pending" ||
            displayStatus === "overdue" ||
            displayStatus === "draft") && (
            <>
              <ActionBtn title="Edit" onClick={() => setEditHWId(hw.id)}>
                <HiOutlinePencil size={16} />
              </ActionBtn>
              {/* <ActionBtn title="Remind student">
                <HiOutlineBell size={16} />
              </ActionBtn> */}
              <ActionBtn title="Delete" onClick={() => setDeletingHWId(hw.id)}>
                <HiOutlineTrash size={16} />
              </ActionBtn>
            </>
          )}
        </div>
      </div>

      {/* Delete confirm */}
      <ConfirmModal
        isOpen={deletingHWId !== null}
        title="Delete Homework"
        isSubmitting={isDeleting}
        message="Are you sure you want to delete this? This action cannot be undone."
        onCancel={() => setDeletingHWId(null)}
        onConfirm={() => {
          if (!deletingHWId) return;
          deleteHomework(deletingHWId);
        }}
      />

      {/* Edit HW */}
      <UpsertHomeworkModal
        isOpen={editHWId !== null}
        onClose={() => setEditHWId(null)}
        type="Edit"
        hw={hw}
      />
    </div>
  );
}

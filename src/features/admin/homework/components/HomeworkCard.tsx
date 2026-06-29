import {
  HiOutlinePencil,
  HiOutlineEye,
  HiOutlineTrash,
  HiOutlineBell,
  HiOutlineCheck,
  HiOutlineSparkles,
} from "react-icons/hi2";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import type { Homework } from "../../../../type/homework";
import {
  capitalize,
  getHomeworkDateLabel,
  initials,
} from "../../../../utils/helper";
import { HW_BORDER_COLOR, HW_STATUS_BADGE } from "../../../../utils/constants";
import ActionBtn from "../../lessons/components/ActionButton";
import ConfirmModal from "../../../../ui/ConfirmModal";
import { useHomeworks } from "../hooks/useHomeworks";
import UpsertHomeworkModal from "./UpsertHomeworkModal";

type Props = {
  hw: Homework;
};

export default function HomeworkCard({ hw }: Props) {
  const navigate = useNavigate();
  const [deletingHWId, setDeletingHWId] = useState<string | null>(null);
  const [editHWId, setEditHWId] = useState<string | null>(null);
  const { isDeleting, deleteHomework } = useHomeworks({
    onDeleteSuccess: () => setDeletingHWId(null),
  });

  const status = hw.submission ? hw.submission.status : "pending";
  const displayStatus = status === "draft" ? "pending" : status;

  const dateLabel = getHomeworkDateLabel(hw);

  return (
    <div
      className={`flex items-start gap-4 rounded-xl border border-l-4 border-gray-200 bg-white p-4 ${HW_BORDER_COLOR[displayStatus]}`}
    >
      {/* Main */}
      <div className="min-w-0 flex-1">
        <div className="mb-1.5 flex flex-wrap items-center gap-2">
          <p className="text-sm font-medium text-gray-800">{hw.title}</p>
          {hw.ai_generated && (
            <span className="flex items-center gap-1 rounded-full bg-purple-50 px-2 py-0.5 text-[11px] font-medium text-purple-700">
              <HiOutlineSparkles className="h-3 w-3" /> AI generated
            </span>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <span className="bg-theme-pink-10 text-theme-pink-20 flex h-7 w-7 items-center justify-center rounded-full text-[10px] font-semibold">
            {initials(hw.student.first_name, hw.student.last_name)}
          </span>
          <span className="text-xs text-gray-500">
            {hw.student.first_name} {hw.student.last_name}
          </span>
          <span className="text-xs text-gray-400">·</span>
          <span className="text-xs text-gray-400">{dateLabel}</span>
          {hw.language && (
            <>
              <span className="text-xs text-gray-400">·</span>
              <span className="text-xs text-gray-400">
                {hw.language} / {hw.level}
              </span>
            </>
          )}
        </div>
      </div>

      {/* Badge + actions */}
      <div className="flex shrink-0 flex-col items-end gap-2">
        <span
          className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${HW_STATUS_BADGE[displayStatus]}`}
        >
          {capitalize(displayStatus)}
        </span>
        <div className="flex gap-1">
          {/* View — goes to review page for submitted/reviewed, otherwise just icon */}
          {(status === "submitted" || status === "reviewed") && (
            <ActionBtn
              title="View"
              onClick={() => navigate(`/admin/homework/${hw.id}/review`)}
            >
              <HiOutlineEye size={16} />
            </ActionBtn>
          )}

          {(status === "pending" ||
            status === "draft" ||
            status === "overdue") && (
            <>
              <ActionBtn title="Edit" onClick={() => setEditHWId(hw.id)}>
                <HiOutlinePencil size={16} />
              </ActionBtn>
              <ActionBtn title="Remind student">
                <HiOutlineBell size={16} />
              </ActionBtn>
              <ActionBtn title="Delete" onClick={() => setDeletingHWId(hw.id)}>
                <HiOutlineTrash size={16} />
              </ActionBtn>
            </>
          )}

          {status === "submitted" && (
            <ActionBtn
              title="Mark as reviewed"
              // onClick={() => onMarkReviewed?.(hw)}
            >
              <HiOutlineCheck size={16} />
            </ActionBtn>
          )}
        </div>
      </div>

      {/* Delete confirm */}
      <ConfirmModal
        isOpen={deletingHWId !== null}
        title="Delete Home"
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

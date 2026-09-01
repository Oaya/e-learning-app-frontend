import dayjs from "dayjs";
import { useState } from "react";
import {
  HiOutlineCalendar,
  HiOutlinePencil,
  HiOutlineTrash,
} from "react-icons/hi";

import ActionBtn from "@/ui/ActionButton";
import { useGoal } from "@/features/shared/goals/hooks/useGoal";
import type { Goal } from "@/type/goal";

type Props = {
  goal: Goal;
  isAdmin: boolean;
};

export default function GoalCommentPanel({ goal, isAdmin }: Props) {
  const [addingComment, setAddingComment] = useState(false);
  const [commentDraft, setCommentDraft] = useState("");
  const { createComment, isCreating, removeComment } = useGoal(goal.id);

  async function handleAddComment() {
    await createComment(commentDraft);
    setCommentDraft("");
    setAddingComment(false);
  }
  return (
    <div className="panel-box">
      <div className="mb-4 flex items-center justify-between md:mb-8">
        <p className="panel-header">
          {isAdmin ? "Your comments" : "Your teacher's comment"}
        </p>
        {!addingComment && isAdmin && (
          <button
            onClick={() => setAddingComment(true)}
            className="btn-white flex items-center gap-1 text-xs"
          >
            <HiOutlinePencil size={13} />
            Add comment
          </button>
        )}
      </div>

      {addingComment && isAdmin && (
        <div className="mb-3 space-y-3">
          <textarea
            rows={4}
            value={commentDraft}
            onChange={(e) => setCommentDraft(e.target.value)}
            placeholder="Leave a comment for your student about this goal…"
            className="form-textarea"
            autoFocus
          />
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => {
                setCommentDraft("");
                setAddingComment(false);
              }}
              className="btn-primary-white"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={isCreating || !commentDraft.trim()}
              onClick={handleAddComment}
              className="btn-primary-pink"
            >
              {isCreating ? "Saving..." : "Save"}
            </button>
          </div>
        </div>
      )}

      {!goal.comments || goal.comments.length === 0 ? (
        !addingComment && (
          <p className="no-content text-center">You haven't commented yet.</p>
        )
      ) : (
        <div className="divide-y divide-gray-100">
          {goal.comments.map((c) => (
            <div
              key={c.id}
              className="group flex items-center justify-between gap-3 py-3 first:pt-0"
            >
              <div className="min-w-0 flex-1">
                <p className="text-sm leading-relaxed text-gray-700">
                  {c.comment}
                </p>

                <span className="mt-1 flex items-center gap-1 text-xs text-gray-400">
                  <HiOutlineCalendar size={13} />
                  {dayjs(c.created_at).format("YYYY-MM-DD")}
                </span>
              </div>

              {isAdmin && (
                <ActionBtn title="Delete" onClick={() => removeComment(c.id)}>
                  <HiOutlineTrash size={16} />
                </ActionBtn>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

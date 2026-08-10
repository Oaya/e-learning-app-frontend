import dayjs from "dayjs";
import { HiOutlineCalendar, HiOutlineLanguage } from "react-icons/hi2";
import type { Homework } from "../../../../type/homework";
import { HW_STATUS_BADGE } from "../../../../utils/constants";
import Badge from "../../../../ui/Badge";
import defaultAvatar from "../../../../assets/user.png";
import { useAuth } from "@/contexts/AuthContext";

type Props = {
  hw: Homework;
};

export default function HomeworkHeaderPanel({ hw }: Props) {
  const { user: authUser } = useAuth();
  const overDue =
    hw.status !== "reviewed" &&
    (hw.status === "overdue" ||
      (!!hw.submission?.submitted_at &&
        dayjs(hw.submission.submitted_at).isAfter(hw.due_date, "day")));

  const warning =
    authUser?.role === "admin"
      ? "This Homework is submitted after due date, but you can still give a feedback."
      : "This Homework is Overdue. You may not get feedback.";

  return (
    <div className="panel-box">
      <div className="flex justify-between">
        <div className="flex items-center gap-4">
          <p className="text-lg font-semibold text-gray-800">{hw.title}</p>
          {overDue && (
            <p className="text-sm font-semibold text-red-500">{warning}</p>
          )}
        </div>

        <Badge
          status={hw.status}
          constant={HW_STATUS_BADGE}
          className="h-fit"
        />
      </div>

      <div className="flex flex-wrap items-center gap-3 text-sm text-gray-400">
        {hw.student && authUser?.role === "admin" && (
          <span className="flex items-center gap-1">
            <img
              src={hw.student.avatar || defaultAvatar}
              alt="avatar"
              className="h-6 w-6 rounded-full object-cover group-hover:opacity-80"
            />
            {hw.student.first_name} {hw.student.last_name}
          </span>
        )}
        <span className="flex items-center gap-1">
          <HiOutlineCalendar size={14} />
          Due: {hw.due_date}
        </span>

        {hw.language && (
          <span className="flex items-center gap-1">
            <HiOutlineLanguage size={14} />
            {hw.language} · {hw.level}
          </span>
        )}

        {hw.submission?.submitted_at && (
          <span className="ml-auto">
            Submitted at: {hw.submission?.submitted_at}
          </span>
        )}
      </div>

      <p className="panel-header mt-6">Homework Instruction</p>
      {hw.instructions && (
        <div className="rounded-lg text-sm leading-relaxed text-gray-500">
          {hw.instructions}
        </div>
      )}
    </div>
  );
}

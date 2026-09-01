import dayjs from "dayjs";
import { HiOutlineCalendar } from "react-icons/hi";

import type { Homework } from "@/type/homework";
import { HW_STATUS_BADGE } from "@/utils/constants";
import Badge from "@/ui/Badge";
import defaultAvatar from "@/assets/user.png";
import { useAuth } from "@/contexts/AuthContext";
import { LuLanguages } from "react-icons/lu";

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
    <div className="panel-box mb-4 md:mb-6">
      <div className="flex justify-between">
        <p className="min-w-0 text-lg font-semibold text-gray-800">
          {hw.title}
        </p>

        <Badge
          status={hw.status}
          constant={HW_STATUS_BADGE}
          className="h-fit"
        />
      </div>

      {overDue && (
        <p className="my-1.5 text-[12px] font-semibold text-red-500 md:mt-1 md:text-sm">
          {warning}
        </p>
      )}

      <div className="flex-wrap items-center text-sm text-gray-400 md:flex md:gap-3">
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
            <LuLanguages size={14} />
            {hw.language} · {hw.level}
          </span>
        )}

        {hw.submission?.submitted_at && (
          <span className="ml-auto">
            Submitted: {hw.submission?.submitted_at}
          </span>
        )}
      </div>

      {hw.instructions && (
        <>
          <p className="panel-header mt-6">Homework Instruction</p>
          <div className="rounded-lg text-sm leading-relaxed text-gray-500">
            {hw.instructions}
          </div>
        </>
      )}
    </div>
  );
}

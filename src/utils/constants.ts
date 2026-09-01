import { LuCalendar1, LuVideo, LuNotebookPen } from "react-icons/lu";
import { GoGoal } from "react-icons/go";
import { MdPayment } from "react-icons/md";
import { TbRobot } from "react-icons/tb";
import type { IconType } from "react-icons";
import {
  HiOutlineLink,
  HiOutlineStar,
  HiOutlineVideoCamera,
} from "react-icons/hi";
import {
  HiOutlineDocumentArrowUp,
  HiOutlineHandThumbUp,
  HiOutlineWrenchScrewdriver,
} from "react-icons/hi";
import type { AttachmentType, ScoreType } from "@/type/homework_submission";
import type { GoalStatusType } from "@/type/goal";
import type { LessonStatusType } from "@/type/lesson";
import type { Status } from "@/type/user";
import type { InvoiceStatusType } from "@/type/invoice";

export const PAGE_SIZE = 10;

export const lessonDuration = [30, 60, 90, 120] as const;
export const currencies = [
  "USD",
  "JPY",
  "EUR",
  "GBP",
  "AUD",
  "CAD",
  "SGD",
  "KRW",
];

export const invoiceStatus = ["unpaid", "paid"];

export const howItWorks = [
  {
    title: "Add your students",
    desc: "Invite students by email. Set their language, level, and learning goals. Each student gets their own profile page with everything in one place.",
    budge: "2 minutes to set up",
  },
  {
    title: "Schedule a lesson",
    desc: "Book a lesson with a date, time, and duration. After the lesson, add notes on what was covered.",
    budge: "Keeps your week organised",
  },
  {
    title: "Run the video lesson - and revisit it anytime",
    desc: "Conduct your lesson over video. Upload the recording directly to the student's profile so both of you can review it later. Recordings are organised by lesson date and easy to find.",
    budge: "Run your lesson with zoom",
  },
  {
    title: "Assign homework",
    desc: "Create a homework task manually, or let AI generate exercises based on the student's level and what you covered in class. Students submit directly in the app.",
    budge: "AI-assisted",
  },
  {
    title: "Track progress and payments",
    desc: "See each student's completed goals, homework scores, and outstanding balance at a glance. No more spreadsheets or chasing invoices manually.",
    budge: "Everything in one view",
  },
];

export const features = [
  {
    icon: LuCalendar1,
    title: "Lesson scheduling",
    desc: "Book lessons, track attendance, add notes after each lesson.",
  },
  {
    icon: GoGoal,
    title: "Student goals",
    desc: "Set learning goals and track progress for every student.",
  },
  {
    icon: LuNotebookPen,
    title: "Homework",
    desc: "Assign tasks, review submissions, and generate exercises with AI.",
  },
  {
    icon: MdPayment,
    title: "Payment tracking",
    desc: "Log payments per student. See who's up to date at a glance.",
  },
  {
    icon: LuVideo,
    title: "Lesson recordings",
    desc: "Upload and store lesson recordings linked to each student.",
  },
  {
    icon: TbRobot,
    title: "AI homework gen",
    desc: "Generate tailored exercises from topic, level, and past lessons.",
  },
];

export const GoalStatus: Record<GoalStatusType, string> = {
  not_started: "Not started",
  in_progress: "In progress",
  achieved: "Achieved",
};

export const LessonStatus: Record<LessonStatusType, string> = {
  scheduled: "Scheduled",
  completed: "Completed",
  canceled: "Canceled",
  no_show: "No show",
};

export const USER_STATUS_BADGE: Record<Status, string> = {
  active: "bg-theme-green-30 text-theme-green-20",
  inactive: "bg-theme-pink-10 text-theme-pink-20",
  invited: "bg-theme-yellow-10  text-theme-yellow-20",
};

export const LESSON_BORDER_COLOR: Record<LessonStatusType, string> = {
  scheduled: "border-l-blue-500",
  completed: "border-l-theme-green-20",
  canceled: "border-l-theme-pink-20",
  no_show: "border-l-theme-yellow-20",
};

export const LESSON_STATUS_BADGE: Record<LessonStatusType, string> = {
  scheduled: "bg-blue-200 text-blue-500",
  completed: "bg-theme-green-30 text-theme-green-20",
  canceled: "bg-theme-pink-10 text-theme-pink-20",
  no_show: "bg-theme-yellow-10  text-theme-yellow-20",
};

export const HW_BORDER_COLOR: Record<string, string> = {
  submitted: "border-l-theme-green-20",
  pending: "border-l-blue-500",
  draft: "border-l-blue-500",
  overdue: "border-l-theme-pink-20",
  reviewed: "border-l-theme-yellow-20",
};

export const HW_STATUS_BADGE: Record<string, string> = {
  submitted: "bg-theme-green-30 text-theme-green-20",
  pending: "bg-blue-200 text-blue-500",
  draft: "bg-blue-200 text-blue-500",
  overdue: "bg-theme-pink-10 text-theme-pink-20",
  reviewed: "bg-theme-yellow-10 text-theme-yellow-20",
};

export const ADMIN_HW_STATUS_BADGE: Record<string, string> = {
  submitted: "bg-theme-green-30 text-theme-green-20",
  pending: "bg-blue-200 text-blue-500",
  overdue: "bg-theme-pink-10 text-theme-pink-20",
  reviewed: "bg-theme-yellow-10 text-theme-yellow-20",
};

export const ADMIN_PLAN_STATUS_BADGE: Record<string, string> = {
  active: "bg-theme-green-30 text-theme-green-20",
  pending: "bg-blue-200 text-blue-500",
  past_due: "bg-theme-pink-10 text-theme-pink-20",
  canceled: "bg-theme-yellow-10 text-theme-yellow-20",
};

export const HW_UPLOAD_BUTTON: Record<
  AttachmentType,
  {
    buttonCss: string;
    icon: IconType;
    color: string;
    bg: string;
  }
> = {
  file: {
    buttonCss: "hover:border-emerald-400 hover:bg-emerald-50",
    icon: HiOutlineDocumentArrowUp,
    color: "text-theme-green-20",
    bg: "bg-theme-green-30",
  },
  video: {
    buttonCss: "hover:border-blue-300 hover:bg-blue-50",
    icon: HiOutlineVideoCamera,
    color: "text-blue-700",
    bg: "bg-blue-100",
  },
  link: {
    buttonCss: "hover:border-theme-pink-20 hover:bg-theme-pink-10/30",
    icon: HiOutlineLink,
    color: "text-theme-pink-20",
    bg: "bg-theme-pink-10",
  },
};

export const SCORE_BUDGE: Record<
  ScoreType,
  {
    css: string;
    icon: IconType;
  }
> = {
  needs_work: {
    css: "bg-theme-pink-10 text-theme-pink-20",
    icon: HiOutlineWrenchScrewdriver,
  },
  good: {
    css: "bg-theme-yellow-10  text-theme-yellow-20 ",
    icon: HiOutlineHandThumbUp,
  },
  excellent: {
    css: "bg-theme-green-30 text-theme-green-20 ",
    icon: HiOutlineStar,
  },
};

export const GOAL_STATUS_BADGE: Record<GoalStatusType, string> = {
  in_progress: "bg-theme-yellow-10 text-theme-yellow-20",
  achieved: "bg-theme-green-30 text-theme-green-20",
  not_started: "bg-blue-200 text-blue-500",
};

export const GOAL_BORDER_COLOR: Record<GoalStatusType, string> = {
  in_progress: "border-l-theme-yellow-20",
  achieved: "border-l-theme-green-20",
  not_started: "border-l-blue-500",
};

export const INVOICE_STATUS_BADGE: Record<InvoiceStatusType, string> = {
  unpaid: "bg-theme-yellow-10 text-theme-yellow-20",
  paid: "bg-theme-green-30 text-theme-green-20",
};

export const EXERCISE_TYPES = [
  "Fill in the blank",
  "Vocabulary",
  "Reading",
  "Writing prompt",
  "Conversation",
  "Translation",
] as const;

export const TOPIC_CHIPS = [
  "Daily life",
  "Travel",
  "Food",
  "Business",
  "Nature",
  "Technology",
  "Health",
  "Education",
] as const;

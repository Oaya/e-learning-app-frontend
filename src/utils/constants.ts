import { LuCalendar1, LuVideo, LuNotebookPen } from "react-icons/lu";
import { GoGoal } from "react-icons/go";
import { MdPayment } from "react-icons/md";
import { TbRobot } from "react-icons/tb";

export const categories: { value: string; label: string }[] = [
  { value: "development", label: "Development" },
  { value: "business", label: "Business" },
  { value: "finance", label: "Finance" },
  { value: "it_software", label: "IT & Software" },
  { value: "personal_development", label: "Personal Development" },
  { value: "design", label: "Design" },
  { value: "marketing", label: "Marketing" },
  { value: "lifestyle", label: "Lifestyle" },
  { value: "photography", label: "Photography" },
  { value: "health_fitness", label: "Health & Fitness" },
  { value: "music", label: "Music" },
  { value: "teaching_academics", label: "Teaching & Academics" },
];

export const levels = ["beginner", "intermediate", "advanced"] as const;
export type Level = (typeof levels)[number];

export const lessonTypes: string[] = ["video", "reading"];

export const howItWorks = [
  {
    title: "Add your students",
    desc: "Invite students by email. Set their language, level, and learning goals. Each student gets their own profile page with everything in one place.",
    budge: "2 minutes to set up",
  },
  {
    title: "Schedule a session",
    desc: "Book a lesson with a date, time, and duration. After the session, add notes on what was covered.",
    budge: "Keeps your week organised",
  },
  {
    title: "Run the video session - and revisit it anytime",
    desc: "Conduct your lesson over video. Upload the recording directly to the student's profile so both of you can review it later. Recordings are organised by session date and easy to find.",
    budge: "Run your session with zoom",
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
    title: "Session scheduling",
    desc: "Book lessons, track attendance, add notes after each session.",
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
    title: "Session recordings",
    desc: "Upload and store lesson recordings linked to each student.",
  },
  {
    icon: TbRobot,
    title: "AI homework gen",
    desc: "Generate tailored exercises from topic, level, and past sessions.",
  },
];

export const BORDER_COLOR: Record<string, string> = {
  scheduled: "border-l-theme-green-20",
  completed: "border-l-gray-300",
  canceled: "border-l-theme-pink-20",
  no_show: "border-l-theme-yellow-20",
};

export const STATUS_BADGE: Record<string, string> = {
  scheduled: "bg-theme-green-30 text-theme-green-20",
  completed: "bg-gray-100  text-gray-500",
  canceled: "bg-theme-pink-10 text-theme-pink-20",
  no_show: "bg-theme-yellow-10  text-theme-yellow-20",
};

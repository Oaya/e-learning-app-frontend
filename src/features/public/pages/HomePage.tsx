import { Link } from "react-router-dom";

import { usePlans } from "../hooks/usePlans";
import PlanCard from "../components/PlanCard";
import { LuCalendar1, LuVideo, LuNotebookPen } from "react-icons/lu";
import { GoGoal } from "react-icons/go";
import { MdPayment } from "react-icons/md";
import { TbRobot } from "react-icons/tb";
import { BsStars } from "react-icons/bs";

const howItWorks = [
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

const features = [
  {
    icon: <LuCalendar1 size={20} className="text-theme-pink-20" />,
    title: "Session scheduling",
    desc: "Book lessons, track attendance, add notes after each session.",
  },
  {
    icon: <GoGoal size={20} className="text-theme-pink-20" />,
    title: "Student goals",
    desc: "Set learning goals and track progress for every student.",
  },
  {
    icon: <LuNotebookPen size={20} className="text-theme-pink-20" />,
    title: "Homework",
    desc: "Assign tasks, review submissions, and generate exercises with AI.",
  },
  {
    icon: <MdPayment size={20} className="text-theme-pink-20" />,
    title: "Payment tracking",
    desc: "Log payments per student. See who's up to date at a glance.",
  },
  {
    icon: <LuVideo size={20} className="text-theme-pink-20" />,
    title: "Session recordings",
    desc: "Upload and store lesson recordings linked to each student.",
  },
  {
    icon: <TbRobot size={20} className="text-theme-pink-20" />,
    title: "AI homework gen",
    desc: "Generate tailored exercises from topic, level, and past sessions.",
  },
];

export default function HomePage() {
  const { plans, isLoading, isError } = usePlans();
  if (isLoading) return <div>Loading plans...</div>;
  if (isError) return <div>Error loading plans.</div>;

  return (
    <div className="flex min-h-screen flex-col">
      {/* Hero */}
      <section className="mx-auto max-w-275 px-12 pt-20 pb-30 text-center">
        <div className="bg-theme-green-10 mb-6 inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-medium">
          <BsStars size={16}></BsStars>Build for language teachers
        </div>
        <h1 className="mx-auto mb-5 max-w-160 text-5xl leading-tight font-bold tracking-tight">
          Everything you need to{" "}
          <span className="text-theme-purple-10">teach</span>
          <br />
          <span className="text-theme-purple-10">better, </span>
          worry less
        </h1>
        <p className="mx-auto mb-9 max-w-160 text-lg text-gray-500">
          Manage your students, sessions, homework, and payments. All in one
          place. Spend more time teaching, less time on admin.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link to="/signup">
            <button className="btn-primary px-7 py-3.5 text-sm">
              Start for free
            </button>
          </Link>
          <a href="#how">
            <button className="btn-primary-white px-7 py-3.5 text-sm">
              See how it works
            </button>
          </a>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="bg-gray-50 px-12 py-20">
        <div className="mx-auto max-w-250">
          <p className="text-theme-purple-50 mb-2.5 text-center text-xs font-semibold tracking-widest uppercase">
            Features
          </p>
          <h2 className="mb-12 text-center text-4xl font-bold tracking-tight">
            Everything you need to land the job
          </h2>
          <div className="grid grid-cols-3 gap-10">
            {features.map(({ icon, title, desc }) => (
              <div
                key={title}
                className="rounded-xl border border-gray-200 bg-white p-6"
              >
                <div className="bg-theme-pink-10 mb-3.5 flex h-10 w-10 items-center justify-center rounded-md text-xl">
                  {icon}
                </div>
                <div className="mb-2 text-[15px] font-semibold">{title}</div>
                <p className="text-sm leading-relaxed text-gray-500">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="mx-auto max-w-250 px-12 py-20 text-center">
        <p className="text-theme-purple-50 mb-2.5 text-xs font-semibold tracking-widest uppercase">
          How it works
        </p>
        <h2 className="mb-12 text-4xl font-bold tracking-tight">
          Your whole teaching workflow, in order
        </h2>
        <div className="p-10">
          {howItWorks.map((value, i) => (
            <div key={i} className="py flex gap-10 text-left">
              <div className="flex flex-col items-center">
                <div className="bg-theme-purple-30 text-theme-purple-50 flex h-13 w-13 shrink-0 items-center justify-center rounded-full text-lg font-bold">
                  {(i + 1).toString()}
                </div>
                {i < howItWorks.length - 1 && (
                  <div className="bg-theme-purple-10 mt-1 h-12 w-0.5"></div>
                )}
              </div>

              <div className="pb-10">
                <div className="mb-2 text-base font-semibold">
                  {value.title}
                </div>
                <p className="mb-2 text-sm text-gray-500">{value.desc}</p>
                <p className="bg-theme-purple-10 text-theme-purple-50 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-sm font-medium">
                  {value.budge}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="bg-gray-50 px-12 py-20">
        <div className="mx-auto max-w-275 text-center">
          <p className="text-theme-purple-50 mb-2.5 text-xs font-semibold tracking-widest uppercase">
            Pricing
          </p>
          <h2 className="mb-12 text-4xl font-bold tracking-tight">
            Simple, honest pricing
          </h2>
          {plans && (
            <div className="flex justify-center gap-10 pt-8">
              {plans.map((plan) => {
                return <PlanCard key={plan.id} plan={plan} />;
              })}
            </div>
          )}
        </div>
      </section>

      {/* CTA Banner */}
      <section className="px-12 py-20">
        <div className="bg-theme-purple-40 mx-auto max-w-250 rounded-2xl px-12 py-14 text-center">
          <h2 className="mb-3 text-3xl font-bold tracking-tight text-white">
            Ready to get organised?
          </h2>
          <p className="mb-7 text-base text-white/70">
            Join teachers who've simplified their workflow.
          </p>
          <Link to="/signup">
            <button className="text-theme-purple-50 inline-flex items-center rounded-lg bg-white px-7 py-3.5 text-[15px] font-medium transition-colors">
              Get started — it's free
            </button>
          </Link>
        </div>
      </section>
    </div>
  );
}

import { Link } from "react-router-dom";

import { usePlans } from "../hooks/usePlans";
import PlanCard from "../components/PlanCard";
import { LuNotebookPen } from "react-icons/lu";
import { BsFillFileBarGraphFill, BsFillFilePlayFill } from "react-icons/bs";
import { FaBell } from "react-icons/fa";
import { BsFillPeopleFill } from "react-icons/bs";
import { FaFileContract } from "react-icons/fa";
import { BsFolderFill } from "react-icons/bs";

const howItWorks = [
  {
    title: "Add a job",
    desc: "Paste the job URL or fill in the details manually. Takes under 30 seconds per application.",
  },
  {
    title: "Move through stages",
    desc: "Drag cards as you progress. Add notes, contacts, and interview prep at each stage.",
  },
  {
    title: "Land the job",
    desc: "Follow the reminders, review your stats, and focus your energy where it matters most.",
  },
];

const features = [
  {
    icon: <BsFolderFill size={16} className="text-theme-green-20" />,
    bg: "#eeedfe",
    title: "Visual pipeline",
    desc: "Drag jobs across stages — applied, screening, interview, offer. See your whole search at a glance.",
  },
  {
    icon: <FaBell size={16} className="text-theme-pink-20" />,
    bg: "#faeeda",
    title: "Follow-up reminders",
    desc: "Get nudged when you haven't heard back. Never let a warm application go cold again.",
  },
  {
    icon: <BsFillFileBarGraphFill size={16} className="text-theme-green-20" />,
    bg: "#e1f5ee",
    title: "Search analytics",
    desc: "Response rate, interview conversion, time in each stage. Know exactly what's working.",
  },
  {
    icon: <LuNotebookPen size={16} className="text-theme-pink-20" />,
    bg: "#faece7",
    title: "Interview notes",
    desc: "Log questions asked, your answers, and what to improve per company and round.",
  },
  {
    icon: <BsFillPeopleFill size={16} className="text-theme-green-20" />,
    bg: "#fbeaf0",
    title: "Contact tracker",
    desc: "Save recruiters, hiring managers, and referrals per application — all in one place.",
  },
  {
    icon: <FaFileContract size={16} className="text-theme-pink-20" />,
    bg: "#e6f1fb",
    title: "Resume versions",
    desc: "Track which resume you sent to each company. No more guessing what they actually saw.",
  },
];

export default function HomePage() {
  const { plans, isLoading, isError } = usePlans();
  if (isLoading) return <div>Loading plans...</div>;
  if (isError) return <div>Error loading plans.</div>;

  return (
    <div className="flex min-h-screen flex-col">
      {/* Hero */}
      <section className="mx-auto max-w-275 px-12 pt-20 pb-16 text-center">
        <div className="bg-theme-green-10 mb-6 inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-medium">
          🚀 Stop losing track of applications
        </div>
        <h1 className="mb-5 text-5xl leading-tight font-bold tracking-tight">
          Your job search,
          <br />
          <span className="text-theme-purple-10">finally organized</span>
        </h1>
        <p className="mx-auto mb-9 max-w-120 text-lg text-gray-500">
          Track every application, interview, and offer in one place. No more
          spreadsheets, no more forgotten follow-ups.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link to="/signup">
            <button className="btn-primary px-7 py-3.5 text-sm">
              Start tracking for free
            </button>
          </Link>
          <a href="#how">
            <button className="btn-primary-white px-7 py-3.5 text-sm">
              ▶ See how it works
            </button>
          </a>
        </div>
        <p className="mt-4 text-sm text-gray-400">
          Free forever · No credit card needed
        </p>
      </section>

      {/* App Preview */}
      <section className="mx-auto max-w-275 px-12 pb-20">
        <div
          className="overflow-hidden rounded-2xl border border-gray-200"
          style={{ boxShadow: "0 20px 60px rgba(0,0,0,0.08)" }}
        >
          <div
            className="flex items-center gap-2 px-5 py-3"
            style={{ background: "#534ab7" }}
          >
            <div className="h-2.5 w-2.5 rounded-full bg-white/30"></div>
            <div className="h-2.5 w-2.5 rounded-full bg-white/30"></div>
            <div className="h-2.5 w-2.5 rounded-full bg-white/30"></div>
            <span className="ml-2.5 text-xs text-white/60">
              jobdesk.app/pipeline
            </span>
          </div>
          <div className="bg-gray-50 p-5">
            {/* Stats row */}
            <div className="mb-5 grid grid-cols-4 gap-3">
              {[
                {
                  label: "Total applied",
                  value: "24",
                  sub: "This month",
                  color: undefined,
                },
                {
                  label: "In progress",
                  value: "8",
                  sub: "Active pipeline",
                  color: "#534ab7",
                },
                {
                  label: "Response rate",
                  value: "33%",
                  sub: "Above average",
                  color: "#1d9e75",
                  subColor: "#3b6d11",
                },
                {
                  label: "Interviews",
                  value: "3",
                  sub: "2 this week",
                  color: "#d85a30",
                },
              ].map(({ label, value, sub, color, subColor }) => (
                <div
                  key={label}
                  className="rounded-lg border border-gray-200 bg-white px-4 py-3.5"
                >
                  <div className="mb-1.5 text-[11px] text-gray-400">
                    {label}
                  </div>
                  <div
                    className="text-2xl font-semibold"
                    style={color ? { color } : undefined}
                  >
                    {value}
                  </div>
                  <div
                    className="mt-1 text-[11px]"
                    style={{ color: subColor ?? "#9a9a9a" }}
                  >
                    {sub}
                  </div>
                </div>
              ))}
            </div>

            {/* Pipeline */}
            <div className="grid grid-cols-4 gap-3">
              {/* Applied */}
              <div>
                <div className="mb-2.5 flex items-center gap-1.5 text-[11px] font-semibold text-gray-400">
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#888780]"></span>
                  Applied
                </div>
                {[
                  {
                    company: "Stripe",
                    role: "Frontend Engineer",
                    tag: "Remote",
                    tagBg: "#f1efe8",
                    tagColor: "#5f5e5a",
                  },
                  {
                    company: "Linear",
                    role: "React Developer",
                    tag: "Hybrid",
                    tagBg: "#e6f1fb",
                    tagColor: "#185fa5",
                  },
                ].map(({ company, role, tag, tagBg, tagColor }) => (
                  <div
                    key={company}
                    className="mb-2 rounded-lg border border-gray-200 bg-white px-3.5 py-3"
                  >
                    <div className="mb-0.5 text-xs font-semibold">
                      {company}
                    </div>
                    <div className="mb-1.5 text-[11px] text-gray-400">
                      {role}
                    </div>
                    <span
                      className="rounded-full px-2 py-0.5 text-[10px] font-medium"
                      style={{ background: tagBg, color: tagColor }}
                    >
                      {tag}
                    </span>
                  </div>
                ))}
              </div>

              {/* Screening */}
              <div>
                <div className="mb-2.5 flex items-center gap-1.5 text-[11px] font-semibold text-gray-400">
                  <span
                    className="inline-block h-1.5 w-1.5 rounded-full"
                    style={{ background: "#534ab7" }}
                  ></span>
                  Screening
                </div>
                {[
                  {
                    company: "Vercel",
                    role: "Full Stack Engineer",
                    tag: "Remote",
                    tagBg: "#f1efe8",
                    tagColor: "#5f5e5a",
                  },
                  {
                    company: "Figma",
                    role: "Software Engineer",
                    tag: "Tomorrow",
                    tagBg: "#faeeda",
                    tagColor: "#854f0b",
                  },
                ].map(({ company, role, tag, tagBg, tagColor }) => (
                  <div
                    key={company}
                    className="mb-2 rounded-r-lg bg-white px-3.5 py-3"
                    style={{
                      border: "1px solid #e5e7eb",
                      borderLeft: "3px solid #534ab7",
                    }}
                  >
                    <div className="mb-0.5 text-xs font-semibold">
                      {company}
                    </div>
                    <div className="mb-1.5 text-[11px] text-gray-400">
                      {role}
                    </div>
                    <span
                      className="rounded-full px-2 py-0.5 text-[10px] font-medium"
                      style={{ background: tagBg, color: tagColor }}
                    >
                      {tag}
                    </span>
                  </div>
                ))}
              </div>

              {/* Interview */}
              <div>
                <div className="mb-2.5 flex items-center gap-1.5 text-[11px] font-semibold text-gray-400">
                  <span
                    className="inline-block h-1.5 w-1.5 rounded-full"
                    style={{ background: "#ba7517" }}
                  ></span>
                  Interview
                </div>
                {[
                  {
                    company: "Notion",
                    role: "Product Engineer",
                    tag: "Today 2pm",
                    tagBg: "#faece7",
                    tagColor: "#993c1d",
                  },
                  {
                    company: "Loom",
                    role: "Frontend Dev",
                    tag: "Fri 10am",
                    tagBg: "#e6f1fb",
                    tagColor: "#185fa5",
                  },
                ].map(({ company, role, tag, tagBg, tagColor }) => (
                  <div
                    key={company}
                    className="mb-2 rounded-r-lg bg-white px-3.5 py-3"
                    style={{
                      border: "1px solid #e5e7eb",
                      borderLeft: "3px solid #ba7517",
                    }}
                  >
                    <div className="mb-0.5 text-xs font-semibold">
                      {company}
                    </div>
                    <div className="mb-1.5 text-[11px] text-gray-400">
                      {role}
                    </div>
                    <span
                      className="rounded-full px-2 py-0.5 text-[10px] font-medium"
                      style={{ background: tagBg, color: tagColor }}
                    >
                      {tag}
                    </span>
                  </div>
                ))}
              </div>

              {/* Offer */}
              <div>
                <div className="mb-2.5 flex items-center gap-1.5 text-[11px] font-semibold text-gray-400">
                  <span
                    className="inline-block h-1.5 w-1.5 rounded-full"
                    style={{ background: "#1d9e75" }}
                  ></span>
                  Offer
                </div>
                <div
                  className="mb-2 rounded-lg bg-white px-3.5 py-3"
                  style={{ border: "1px solid #5dcaa5" }}
                >
                  <div className="mb-0.5 text-xs font-semibold">Supabase</div>
                  <div
                    className="mb-1.5 text-[11px] font-semibold"
                    style={{ color: "#0f6e56" }}
                  >
                    $120k / yr
                  </div>
                  <span
                    className="rounded-full px-2 py-0.5 text-[10px] font-medium"
                    style={{ background: "#e1f5ee", color: "#085041" }}
                  >
                    Deadline: 3 days
                  </span>
                </div>
              </div>
            </div>

            {/* Reminder bar */}
            <div
              className="mt-4 flex items-center justify-between rounded-lg px-4 py-3"
              style={{ background: "#faeeda" }}
            >
              <div className="flex items-center gap-2.5">
                <span className="text-lg">🔔</span>
                <div>
                  <div
                    className="text-[13px] font-semibold"
                    style={{ color: "#633806" }}
                  >
                    2 applications need a follow-up
                  </div>
                  <div className="text-[11px]" style={{ color: "#ba7517" }}>
                    Linear and Vercel — no response in over 7 days
                  </div>
                </div>
              </div>
              <button className="btn-primary px-4 py-2 text-[13px]">
                View
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="bg-gray-50 px-12 py-20">
        <div className="mx-auto max-w-275">
          <p className="text-theme-purple-50 mb-2.5 text-center text-xs font-semibold tracking-widest uppercase">
            Features
          </p>
          <h2 className="mb-12 text-center text-4xl font-bold tracking-tight">
            Everything you need to land the job
          </h2>
          <div className="grid grid-cols-3 gap-5">
            {features.map(({ icon, title, desc }, index) => (
              <div
                key={title}
                className="rounded-xl border border-gray-200 bg-white p-6"
              >
                <div
                  className={`${index % 2 === 1 ? "bg-theme-pink-10" : "bg-theme-green-10"} mb-3.5 flex h-10 w-10 items-center justify-center rounded-md text-xl`}
                >
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
      <section id="how" className="mx-auto max-w-275 px-12 py-20 text-center">
        <p className="text-theme-purple-50 mb-2.5 text-xs font-semibold tracking-widest uppercase">
          How it works
        </p>
        <h2 className="mb-12 text-4xl font-bold tracking-tight">
          Up and running in minutes
        </h2>
        <div className="grid grid-cols-3 gap-8">
          {howItWorks.map((value, i) => (
            <div key={i}>
              <div className="bg-theme-purple-30 text-theme-purple-50 mx-auto mb-4 flex h-11 w-11 items-center justify-center rounded-full text-lg font-bold">
                {i.toString()}
              </div>
              <div className="mb-2 text-base font-semibold">{value.title}</div>
              <p className="text-sm leading-relaxed text-gray-500">
                {value.desc}
              </p>
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
        <div className="bg-theme-purple-40 mx-auto max-w-251 rounded-2xl px-12 py-14 text-center">
          <h2 className="mb-3 text-3xl font-bold tracking-tight text-white">
            Stop managing your job search in a spreadsheet
          </h2>
          <p className="mb-7 text-base text-white/70">
            Join thousands of developers who landed their job with JobDesk.
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

import { TbLanguage } from "react-icons/tb";
import {
  HiOutlineChatBubbleLeftRight,
  HiOutlineCalendarDays,
} from "react-icons/hi2";
import { LuTarget } from "react-icons/lu";
import { useNavigate } from "react-router-dom";

interface Props {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: Props) {
  const navigate = useNavigate();
  return (
    <div className="flex min-h-screen">
      {/* ── Left panel ── */}
      <div className="bg-theme-purple-50 relative hidden w-[38%] flex-col overflow-hidden p-20 lg:flex">
        {/* Decorative circles */}
        <div className="absolute -top-16 -right-16 h-56 w-56 rounded-full bg-white/5" />
        <div className="absolute -bottom-20 -left-12 h-64 w-64 rounded-full bg-white/5" />

        {/* Logo */}
        <div
          className="relative z-10 flex cursor-pointer items-center gap-2.5"
          onClick={() => navigate("/")}
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/20">
            <TbLanguage className="text-white" size={20} />
          </div>
          <span className="text-lg font-semibold tracking-tight text-white">
            Fluently
          </span>
        </div>

        {/* Tagline + features */}
        <div className="relative z-10 mt-10">
          <p className="mb-8 text-4xl leading-snug font-bold text-white">
            From <span className="text-white/45">Hello</span>
            <br />
            to Fluent.
          </p>

          <div className="mt-15 space-y-8">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/15">
                <LuTarget className="text-white" size={16} />
              </div>
              <div>
                <p className="text-sm font-medium text-white/80">
                  Track goals and progress
                </p>
                <p className="text-xs text-white/45">
                  Stay on top of every milestone, beginner to expert
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/15">
                <HiOutlineChatBubbleLeftRight
                  className="text-white"
                  size={16}
                />
              </div>
              <div>
                <p className="text-sm font-medium text-white/80">
                  Stay connected with feedback
                </p>
                <p className="text-xs text-white/45">
                  Teachers leave notes, students see the path forward
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/15">
                <HiOutlineCalendarDays className="text-white" size={16} />
              </div>
              <div>
                <p className="text-sm font-medium text-white/80">
                  Lessons and schedules in one place
                </p>
                <p className="text-xs text-white/45">
                  Recordings, billing, and homework — all organized
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="relative z-10 mt-auto text-xs text-white/35">
          © {new Date().getFullYear()} Fluently · For teachers and learners
        </p>
      </div>

      {/* ── Right panel ── */}
      <div className="flex flex-1 justify-center bg-white px-6 py-12 pt-20">
        {children}
      </div>
    </div>
  );
}

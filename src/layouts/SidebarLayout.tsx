import { HiHome } from "react-icons/hi2";
import { LuNewspaper, LuGoal, LuCalendar1, LuVideo } from "react-icons/lu";
import { IoMdSettings } from "react-icons/io";

import StyledNavLink from "../ui/NavLink";
import SidebarShell from "./SidebarShell";

export default function SidebarLayout() {
  return (
    <SidebarShell>
      <section className="text-sm font-semibold text-gray-600">
        <h2 className="px-10">MAIN</h2>
        <StyledNavLink to="/dashboard" icon={HiHome}>
          Dashboard
        </StyledNavLink>
        <StyledNavLink to="/student/sessions" icon={LuCalendar1}>
          Sessions
        </StyledNavLink>
      </section>

      <section className="text-sm font-semibold text-gray-600">
        <h2 className="px-10">LEARNING</h2>
        <StyledNavLink to="/student/homework" icon={LuNewspaper}>
          Homework
        </StyledNavLink>
        <StyledNavLink to="/student/goals" icon={LuGoal}>
          Goals
        </StyledNavLink>
        <StyledNavLink to="/student/recordings" icon={LuVideo}>
          Recordings
        </StyledNavLink>
      </section>

      <section className="text-sm font-semibold text-gray-600">
        <h2 className="px-10">ACCOUNT</h2>
        <StyledNavLink to="/student/profile" icon={IoMdSettings}>
          Profile
        </StyledNavLink>
      </section>
    </SidebarShell>
  );
}

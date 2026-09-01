import { HiHome } from "react-icons/hi";
import { LuNewspaper, LuGoal, LuCalendar1 } from "react-icons/lu";
import { IoMdSettings } from "react-icons/io";

import StyledNavLink from "@/ui/NavLink";
import SidebarShell from "./SidebarShell";

export default function SidebarLayout() {
  return (
    <SidebarShell>
      <section className="text-sm font-semibold text-gray-600">
        <h2 className="px-10">MAIN</h2>
        <StyledNavLink to="/dashboard" icon={HiHome}>
          Dashboard
        </StyledNavLink>
        <StyledNavLink to="/student/lessons" icon={LuCalendar1}>
          Lessons
        </StyledNavLink>

        <StyledNavLink to="/student/homework" icon={LuNewspaper}>
          Homework
        </StyledNavLink>
        <StyledNavLink to="/student/goals" icon={LuGoal}>
          Goals
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

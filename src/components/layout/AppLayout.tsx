import {
  BarChart3,
  LayoutDashboard,
  Ticket,
  Users,
} from "lucide-react";
import {
  NavLink,
  Outlet,
} from "react-router-dom";

import Header from "./Header";
import Sidebar from "./Sidebar";

export default function AppLayout() {
  return (
    <div className="min-h-screen bg-[#f8f9ff]">
      <Sidebar />

      <div className="min-h-screen md:ml-[260px]">
        <Header />

        <main>
          <Outlet />
        </main>
      </div>

      <nav className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around border-t border-[#e2e8f0] bg-white px-2 py-2 md:hidden">
        <MobileLink
          to="/"
          icon={LayoutDashboard}
          label="Dashboard"
        />

        <MobileLink
          to="/tickets"
          icon={Ticket}
          label="Tickets"
        />

        <MobileLink
          to="/users"
          icon={Users}
          label="Users"
        />

        <MobileLink
          to="/analytics"
          icon={BarChart3}
          label="Analytics"
        />
      </nav>
    </div>
  );
}

function MobileLink({
  to,
  label,
  icon: Icon,
}: {
  to: string;
  label: string;
  icon: React.ElementType;
}) {
  return (
    <NavLink
      to={to}
      end={to === "/"}
      className={({ isActive }) =>
        `flex min-w-[72px] flex-col items-center gap-1 rounded-full px-3 py-1.5 text-xs font-semibold ${
          isActive
            ? "bg-[#dae2fd] text-[#4648d4]"
            : "text-[#64748b]"
        }`
      }
    >
      <Icon size={21} />
      {label}
    </NavLink>
  );
}
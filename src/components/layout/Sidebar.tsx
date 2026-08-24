import {
  BarChart3,
  Headset,
  LayoutDashboard,
  LogOut,
  Settings,
  Ticket,
  User,
  Users,
} from "lucide-react";
import { NavLink } from "react-router-dom";

import { useAuthStore } from "../../store/authStore";

const mainLinks = [
  {
    label: "Dashboard",
    to: "/",
    icon: LayoutDashboard,
  },
  {
    label: "Tickets",
    to: "/tickets",
    icon: Ticket,
  },
  {
    label: "My Tickets",
    to: "/my-tickets",
    icon: User,
  },
  {
    label: "Users",
    to: "/users",
    icon: Users,
  },
  {
    label: "Analytics",
    to: "/analytics",
    icon: BarChart3,
  },
];

export default function Sidebar() {
  const logout = useAuthStore((state) => state.logout);

  return (
    <aside className="fixed left-0 top-0 z-40 hidden h-screen w-[260px] flex-col border-r border-[#e2e8f0] bg-white md:flex">
      <div className="flex h-16 items-center border-b border-[#e2e8f0] px-6">
        <div className="flex items-center gap-2.5">
          <Headset
            size={28}
            className="text-[#4648d4]"
          />

          <span className="font-heading text-2xl font-semibold text-[#4648d4]">
            SupportOps
          </span>
        </div>
      </div>

      <nav className="flex-1 space-y-2 overflow-y-auto px-4 py-6">
        {mainLinks.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-4 py-3 text-[15px] font-medium transition ${
                  isActive
                    ? "bg-[#dce9ff] text-[#4648d4]"
                    : "text-[#475569] hover:bg-[#eff4ff]"
                }`
              }
            >
              <Icon size={20} />
              {item.label}
            </NavLink>
          );
        })}
      </nav>

      <div className="space-y-2 border-t border-[#e2e8f0] p-4">
        <button className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-[15px] font-medium text-[#475569] transition hover:bg-[#eff4ff]">
          <Settings size={20} />
          Settings
        </button>

        <button className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-[15px] font-medium text-[#475569] transition hover:bg-[#eff4ff]">
          <User size={20} />
          Profile
        </button>

        <button
          onClick={logout}
          className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-[15px] font-medium text-[#475569] transition hover:bg-red-50 hover:text-red-600"
        >
          <LogOut size={20} />
          Logout
        </button>
      </div>
    </aside>
  );
}
import {
  Bell,
  Search,
} from "lucide-react";

import { useAuthStore } from "../../store/authStore";

export default function Header() {
  const user = useAuthStore(
    (state) => state.user
  );

  const initials =
    user?.fullName
      ?.split(" ")
      .filter(Boolean)
      .map((name) => name[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() ?? "?";

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-[#e2e8f0] bg-white px-4 md:px-6">
      <div className="w-full max-w-md">
        <div className="relative">
          <Search
            size={19}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94a3b8]"
          />

          <input
            type="text"
            placeholder="Search tickets, users, or articles..."
            className="w-full rounded-lg border border-[#e2e8f0] bg-white py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-[#4648d4] focus:ring-4 focus:ring-[#4648d4]/10"
          />
        </div>
      </div>

      <div className="ml-6 flex items-center gap-4">
        <button className="relative rounded-full p-2 text-[#475569] transition hover:bg-[#eff4ff]">
          <Bell size={21} />

          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full border border-white bg-red-500" />
        </button>

        <div className="hidden h-8 border-l border-[#e2e8f0] sm:block" />

        <div className="hidden text-right sm:block">
          <p className="text-sm font-semibold text-[#0f172a]">
            {user?.fullName}
          </p>

          <p className="text-xs font-semibold text-[#64748b]">
            {user?.role}
          </p>
        </div>

        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#6063ee] text-sm font-semibold text-white">
          {initials}
        </div>
      </div>
    </header>
  );
}
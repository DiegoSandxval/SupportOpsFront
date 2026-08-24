import {
  AlertTriangle,
  CheckCircle2,
  Inbox,
  LoaderCircle,
  Timer,
} from "lucide-react";
import {
  useEffect,
  useState,
} from "react";

import { apiClient } from "../api/apiClient";
import PriorityChart from "../components/dashboard/PriorityChart";
import RecentTickets from "../components/dashboard/RecentTickets";
import StatCard from "../components/dashboard/StatCard";
import TicketActivityChart from "../components/dashboard/TicketActivityChart";
import { useAuthStore } from "../store/authStore";
import type {
  TicketListItem,
} from "../types/ticket";

export default function DashboardPage() {
  const user = useAuthStore(
    (state) => state.user
  );

  const [tickets, setTickets] =
    useState<TicketListItem[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  useEffect(() => {
    const loadTickets = async () => {
      try {
        setLoading(true);
        setError(null);

        const response =
          await apiClient.get<
            TicketListItem[]
          >("/tickets");

        setTickets(response.data);
      } catch (error) {
        console.error(
          "Error loading tickets:",
          error
        );

        setError(
          "Unable to load dashboard data."
        );
      } finally {
        setLoading(false);
      }
    };

    loadTickets();
  }, []);

  const firstName =
    user?.fullName
      ?.trim()
      .split(" ")[0] ?? "User";

  const openTickets =
    tickets.filter(
      (ticket) =>
        ticket.status === "Open"
    ).length;

  const inProgressTickets =
    tickets.filter(
      (ticket) =>
        ticket.status === "InProgress"
    ).length;

  const resolvedTickets =
    tickets.filter(
      (ticket) =>
        ticket.status === "Resolved"
    ).length;

  const criticalTickets =
    tickets.filter(
      (ticket) =>
        ticket.priority === "Critical"
    ).length;

  if (loading) {
    return (
      <div className="flex min-h-[calc(100vh-64px)] items-center justify-center bg-[#f8f9ff]">
        <div className="flex items-center gap-3 text-[#64748b]">
          <LoaderCircle
            size={22}
            className="animate-spin"
          />

          Loading dashboard...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-64px)] bg-[#f8f9ff] p-4 pb-24 md:p-6 md:pb-8">
      <div className="mx-auto max-w-[1440px] space-y-8">

        <section>
          <h1 className="font-heading text-3xl font-semibold tracking-tight text-[#0f172a] md:text-[32px]">
            Good morning, {firstName}.
          </h1>

          <p className="mt-1 text-lg text-[#64748b]">
            Here's what's happening today.
          </p>
        </section>

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        <section className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">

          <StatCard
            title="Open"
            value={openTickets}
            icon={Inbox}
            iconBackground="bg-blue-50"
            iconClassName="text-blue-600"
          />

          <StatCard
            title="In Progress"
            value={inProgressTickets}
            icon={Timer}
            iconBackground="bg-amber-50"
            iconClassName="text-amber-600"
          />

          <StatCard
            title="Resolved"
            value={resolvedTickets}
            icon={CheckCircle2}
            iconBackground="bg-green-50"
            iconClassName="text-green-600"
          />

          <StatCard
            title="Critical"
            value={criticalTickets}
            icon={AlertTriangle}
            iconBackground="bg-red-50"
            iconClassName="text-red-600"
          />

        </section>

        <section className="grid grid-cols-1 gap-6 xl:grid-cols-3">

          <div className="xl:col-span-2">
            <TicketActivityChart
              tickets={tickets}
            />
          </div>

          <PriorityChart
            tickets={tickets}
          />

        </section>

        <RecentTickets
          tickets={tickets}
        />

      </div>
    </div>
  );
}
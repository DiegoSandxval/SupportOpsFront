import {
  Activity,
  AlertTriangle,
  BarChart3,
  CheckCircle2,
  Inbox,
  LoaderCircle,
  Timer,
} from "lucide-react";

import type {
  LucideIcon,
} from "lucide-react";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { apiClient } from "../api/apiClient";
import { useAuthStore } from "../store/authStore";

import type {
  TicketListItem,
} from "../types/ticket";

type AnalyticsPeriod =
  | "7d"
  | "30d"
  | "90d"
  | "all";

const STATUS_COLORS: Record<
  string,
  string
> = {
  Open: "#3b82f6",
  Assigned: "#8b5cf6",
  InProgress: "#f59e0b",
  Resolved: "#22c55e",
  Closed: "#64748b",
};

const PRIORITY_COLORS: Record<
  string,
  string
> = {
  Low: "#cbd5e1",
  Medium: "#4648d4",
  High: "#f59e0b",
  Critical: "#ef4444",
};

export default function AnalyticsPage() {
  const user = useAuthStore(
    (state) => state.user
  );

  const [tickets, setTickets] =
    useState<TicketListItem[]>([]);

  const [period, setPeriod] =
    useState<AnalyticsPeriod>("30d");

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
          "Error loading analytics:",
          error
        );

        setError(
          "Unable to load analytics data."
        );
      } finally {
        setLoading(false);
      }
    };

    loadTickets();
  }, []);

  const filteredTickets =
    useMemo(() => {
      return filterTicketsByPeriod(
        tickets,
        period
      );
    }, [
      tickets,
      period,
    ]);

  const totalTickets =
    filteredTickets.length;

  const openTickets =
    filteredTickets.filter(
      (ticket) =>
        ticket.status === "Open"
    ).length;

  const inProgressTickets =
    filteredTickets.filter(
      (ticket) =>
        ticket.status ===
        "InProgress"
    ).length;

  const resolvedTickets =
    filteredTickets.filter(
      (ticket) =>
        ticket.status ===
        "Resolved"
    ).length;

  const criticalTickets =
    filteredTickets.filter(
      (ticket) =>
        ticket.priority ===
        "Critical"
    ).length;

  const activityData =
    useMemo(() => {
      return createActivityData(
        filteredTickets,
        period
      );
    }, [
      filteredTickets,
      period,
    ]);

  const statusData =
    useMemo(() => {
      const statuses = [
        "Open",
        "Assigned",
        "InProgress",
        "Resolved",
        "Closed",
      ];

      return statuses.map(
        (status) => ({
          name:
            status === "InProgress"
              ? "In Progress"
              : status,

          value:
            filteredTickets.filter(
              (ticket) =>
                ticket.status ===
                status
            ).length,

          color:
            STATUS_COLORS[status],
        })
      );
    }, [filteredTickets]);

  const priorityData =
    useMemo(() => {
      const priorities = [
        "Low",
        "Medium",
        "High",
        "Critical",
      ];

      return priorities.map(
        (priority) => ({
          name: priority,

          value:
            filteredTickets.filter(
              (ticket) =>
                ticket.priority ===
                priority
            ).length,

          color:
            PRIORITY_COLORS[
              priority
            ],
        })
      );
    }, [filteredTickets]);

  const categoryData =
    useMemo(() => {
      const categoryCounts =
        new Map<string, number>();

      filteredTickets.forEach(
        (ticket) => {
          categoryCounts.set(
            ticket.category,
            (categoryCounts.get(
              ticket.category
            ) ?? 0) + 1
          );
        }
      );

      return Array.from(
        categoryCounts.entries()
      )
        .map(
          ([
            category,
            count,
          ]) => ({
            category,
            tickets: count,
          })
        )
        .sort(
          (a, b) =>
            b.tickets -
            a.tickets
        );
    }, [filteredTickets]);

  const isPersonalScope =
    user?.role === "User";

  if (loading) {
    return (
      <div className="flex min-h-[calc(100vh-64px)] items-center justify-center bg-[#f8f9ff]">

        <div className="flex items-center gap-3 text-[#64748b]">

          <LoaderCircle
            size={22}
            className="animate-spin"
          />

          Loading analytics...

        </div>

      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-64px)] bg-[#f8f9ff] p-4 pb-24 md:p-6 md:pb-8">

      <div className="mx-auto max-w-[1440px] space-y-6">

        {/* HEADER */}
        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">

          <div className="flex items-center gap-3">

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#e1e0ff] text-[#4648d4]">
              <BarChart3 size={22} />
            </div>

            <div>

              <h1 className="font-heading text-3xl font-semibold tracking-tight text-[#0f172a]">
                Analytics
              </h1>

              <p className="mt-1 text-sm text-[#64748b]">

                {isPersonalScope
                  ? "Performance and trends for your support tickets."
                  : "Overall support ticket performance and trends."}

              </p>

            </div>

          </div>

          <div className="flex items-center gap-3">

            <span className="rounded-full bg-[#e1e0ff] px-3 py-1.5 text-xs font-semibold text-[#4648d4]">

              {isPersonalScope
                ? "Your Tickets"
                : "All Tickets"}

            </span>

            <select
              value={period}
              onChange={(event) =>
                setPeriod(
                  event.target
                    .value as
                    AnalyticsPeriod
                )
              }
              className="rounded-lg border border-[#e2e8f0] bg-white px-4 py-2.5 text-sm font-medium text-[#334155] outline-none transition focus:border-[#4648d4] focus:ring-4 focus:ring-[#4648d4]/10"
            >
              <option value="7d">
                Last 7 Days
              </option>

              <option value="30d">
                Last 30 Days
              </option>

              <option value="90d">
                Last 90 Days
              </option>

              <option value="all">
                All Time
              </option>
            </select>

          </div>

        </div>

        {/* ERROR */}
        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* METRICS */}
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">

          <MetricCard
            title="Total Tickets"
            value={totalTickets}
            icon={Activity}
            iconBackground="bg-indigo-50"
            iconColor="text-[#4648d4]"
          />

          <MetricCard
            title="Open"
            value={openTickets}
            icon={Inbox}
            iconBackground="bg-blue-50"
            iconColor="text-blue-600"
          />

          <MetricCard
            title="In Progress"
            value={inProgressTickets}
            icon={Timer}
            iconBackground="bg-amber-50"
            iconColor="text-amber-600"
          />

          <MetricCard
            title="Resolved"
            value={resolvedTickets}
            icon={CheckCircle2}
            iconBackground="bg-green-50"
            iconColor="text-green-600"
          />

          <MetricCard
            title="Critical"
            value={criticalTickets}
            icon={AlertTriangle}
            iconBackground="bg-red-50"
            iconColor="text-red-600"
          />

        </section>

        {/* ACTIVITY */}
        <ChartCard
          title="Ticket Activity"
          subtitle={
            period === "all"
              ? "Tickets created by month"
              : `Tickets created during ${getPeriodLabel(
                  period
                ).toLowerCase()}`
          }
        >

          {activityData.length === 0 ? (
            <EmptyChart />
          ) : (
            <div className="h-[340px]">

              <ResponsiveContainer
                width="100%"
                height="100%"
              >
                <AreaChart
                  data={activityData}
                >

                  <defs>
                    <linearGradient
                      id="analyticsActivityGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >

                      <stop
                        offset="5%"
                        stopColor="#4648d4"
                        stopOpacity={0.25}
                      />

                      <stop
                        offset="95%"
                        stopColor="#4648d4"
                        stopOpacity={0}
                      />

                    </linearGradient>
                  </defs>

                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#e2e8f0"
                  />

                  <XAxis
                    dataKey="label"
                    axisLine={false}
                    tickLine={false}
                    minTickGap={30}
                    tick={{
                      fill: "#64748b",
                      fontSize: 12,
                    }}
                  />

                  <YAxis
                    allowDecimals={false}
                    axisLine={false}
                    tickLine={false}
                    tick={{
                      fill: "#94a3b8",
                      fontSize: 12,
                    }}
                  />

                  <Tooltip />

                  <Area
                    type="monotone"
                    dataKey="tickets"
                    stroke="#4648d4"
                    strokeWidth={3}
                    fill="url(#analyticsActivityGradient)"
                  />

                </AreaChart>
              </ResponsiveContainer>

            </div>
          )}

        </ChartCard>

        {/* STATUS + PRIORITY */}
        <section className="grid grid-cols-1 gap-6 xl:grid-cols-2">

          {/* STATUS */}
          <ChartCard
            title="Tickets by Status"
            subtitle="Distribution by current ticket status"
          >

            {totalTickets === 0 ? (
              <EmptyChart />
            ) : (
              <div className="grid items-center gap-6 md:grid-cols-[1fr_220px]">

                <div className="relative h-[280px]">

                  <ResponsiveContainer
                    width="100%"
                    height="100%"
                  >
                    <PieChart>

                      <Pie
                        data={statusData}
                        dataKey="value"
                        nameKey="name"
                        innerRadius={75}
                        outerRadius={105}
                        paddingAngle={2}
                      >

                        {statusData.map(
                          (item) => (
                            <Cell
                              key={
                                item.name
                              }
                              fill={
                                item.color
                              }
                            />
                          )
                        )}

                      </Pie>

                      <Tooltip />

                    </PieChart>
                  </ResponsiveContainer>

                  <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">

                    <span className="font-heading text-4xl font-bold text-[#0f172a]">
                      {totalTickets}
                    </span>

                    <span className="text-xs font-semibold text-[#64748b]">
                      Total
                    </span>

                  </div>

                </div>

                <div className="space-y-3">

                  {statusData.map(
                    (item) => (
                      <LegendItem
                        key={item.name}
                        name={item.name}
                        value={item.value}
                        color={item.color}
                      />
                    )
                  )}

                </div>

              </div>
            )}

          </ChartCard>

          {/* PRIORITY */}
          <ChartCard
            title="Tickets by Priority"
            subtitle="Distribution by ticket priority"
          >

            {totalTickets === 0 ? (
              <EmptyChart />
            ) : (
              <div className="grid items-center gap-6 md:grid-cols-[1fr_220px]">

                <div className="relative h-[280px]">

                  <ResponsiveContainer
                    width="100%"
                    height="100%"
                  >
                    <PieChart>

                      <Pie
                        data={priorityData}
                        dataKey="value"
                        nameKey="name"
                        innerRadius={75}
                        outerRadius={105}
                        paddingAngle={2}
                      >

                        {priorityData.map(
                          (item) => (
                            <Cell
                              key={
                                item.name
                              }
                              fill={
                                item.color
                              }
                            />
                          )
                        )}

                      </Pie>

                      <Tooltip />

                    </PieChart>
                  </ResponsiveContainer>

                  <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">

                    <span className="font-heading text-4xl font-bold text-[#0f172a]">
                      {totalTickets}
                    </span>

                    <span className="text-xs font-semibold text-[#64748b]">
                      Total
                    </span>

                  </div>

                </div>

                <div className="space-y-3">

                  {priorityData.map(
                    (item) => (
                      <LegendItem
                        key={item.name}
                        name={item.name}
                        value={item.value}
                        color={item.color}
                      />
                    )
                  )}

                </div>

              </div>
            )}

          </ChartCard>

        </section>

        {/* CATEGORY */}
        <ChartCard
          title="Tickets by Category"
          subtitle="Most common support categories"
        >

          {categoryData.length === 0 ? (
            <EmptyChart />
          ) : (
            <div
              className="w-full"
              style={{
                height: Math.max(
                  300,
                  categoryData.length *
                    55
                ),
              }}
            >

              <ResponsiveContainer
                width="100%"
                height="100%"
              >
                <BarChart
                  data={categoryData}
                  layout="vertical"
                  margin={{
                    top: 10,
                    right: 20,
                    left: 20,
                    bottom: 10,
                  }}
                >

                  <CartesianGrid
                    strokeDasharray="3 3"
                    horizontal={false}
                    stroke="#e2e8f0"
                  />

                  <XAxis
                    type="number"
                    allowDecimals={false}
                    axisLine={false}
                    tickLine={false}
                    tick={{
                      fill: "#94a3b8",
                      fontSize: 12,
                    }}
                  />

                  <YAxis
                    type="category"
                    dataKey="category"
                    width={120}
                    axisLine={false}
                    tickLine={false}
                    tick={{
                      fill: "#64748b",
                      fontSize: 12,
                    }}
                  />

                  <Tooltip />

                  <Bar
                    dataKey="tickets"
                    fill="#4648d4"
                    radius={[
                      0,
                      6,
                      6,
                      0,
                    ]}
                    barSize={26}
                  />

                </BarChart>
              </ResponsiveContainer>

            </div>
          )}

        </ChartCard>

      </div>

    </div>
  );
}

function MetricCard({
  title,
  value,
  icon: Icon,
  iconBackground,
  iconColor,
}: {
  title: string;
  value: number;
  icon: LucideIcon;
  iconBackground: string;
  iconColor: string;
}) {
  return (
    <div className="rounded-2xl border border-[#e2e8f0] bg-white p-5 shadow-[0_4px_12px_rgba(15,23,42,0.02)]">

      <div className="flex items-center justify-between gap-4">

        <div>

          <p className="text-sm font-medium text-[#64748b]">
            {title}
          </p>

          <p className="mt-2 font-heading text-3xl font-semibold text-[#0f172a]">
            {value}
          </p>

        </div>

        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${iconBackground} ${iconColor}`}
        >
          <Icon size={21} />
        </div>

      </div>

    </div>
  );
}

function ChartCard({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <section className="overflow-hidden rounded-2xl border border-[#e2e8f0] bg-white shadow-[0_4px_12px_rgba(15,23,42,0.02)]">

      <div className="border-b border-[#e2e8f0] px-6 py-5">

        <h2 className="font-heading text-xl font-semibold text-[#0f172a]">
          {title}
        </h2>

        <p className="mt-1 text-sm text-[#64748b]">
          {subtitle}
        </p>

      </div>

      <div className="p-6">
        {children}
      </div>

    </section>
  );
}

function LegendItem({
  name,
  value,
  color,
}: {
  name: string;
  value: number;
  color: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4">

      <div className="flex items-center gap-2">

        <span
          className="h-3 w-3 rounded-full"
          style={{
            backgroundColor: color,
          }}
        />

        <span className="text-sm text-[#64748b]">
          {name}
        </span>

      </div>

      <span className="text-sm font-semibold text-[#0f172a]">
        {value}
      </span>

    </div>
  );
}

function EmptyChart() {
  return (
    <div className="flex min-h-[220px] items-center justify-center">

      <div className="text-center">

        <BarChart3
          size={30}
          className="mx-auto text-[#cbd5e1]"
        />

        <p className="mt-3 font-medium text-[#334155]">
          No data available
        </p>

        <p className="mt-1 text-sm text-[#94a3b8]">
          There are no tickets for this period.
        </p>

      </div>

    </div>
  );
}

function filterTicketsByPeriod(
  tickets: TicketListItem[],
  period: AnalyticsPeriod
) {
  if (period === "all") {
    return tickets;
  }

  const days =
    period === "7d"
      ? 7
      : period === "30d"
        ? 30
        : 90;

  const startDate = new Date();

  startDate.setHours(
    0,
    0,
    0,
    0
  );

  startDate.setDate(
    startDate.getDate() -
      (days - 1)
  );

  return tickets.filter(
    (ticket) =>
      new Date(
        ticket.createdAtUtc
      ) >= startDate
  );
}

function createActivityData(
  tickets: TicketListItem[],
  period: AnalyticsPeriod
) {
  if (period === "all") {
    return createMonthlyActivityData(
      tickets
    );
  }

  const days =
    period === "7d"
      ? 7
      : period === "30d"
        ? 30
        : 90;

  const result: {
    label: string;
    tickets: number;
  }[] = [];

  for (
    let i = days - 1;
    i >= 0;
    i--
  ) {
    const date = new Date();

    date.setHours(
      0,
      0,
      0,
      0
    );

    date.setDate(
      date.getDate() - i
    );

    const nextDay =
      new Date(date);

    nextDay.setDate(
      nextDay.getDate() + 1
    );

    const count =
      tickets.filter(
        (ticket) => {
          const created =
            new Date(
              ticket.createdAtUtc
            );

          return (
            created >= date &&
            created < nextDay
          );
        }
      ).length;

    result.push({
      label:
        date.toLocaleDateString(
          "en-US",
          {
            month: "short",
            day: "numeric",
          }
        ),

      tickets: count,
    });
  }

  return result;
}

function createMonthlyActivityData(
  tickets: TicketListItem[]
) {
  if (tickets.length === 0) {
    return [];
  }

  const monthCounts =
    new Map<string, number>();

  tickets.forEach(
    (ticket) => {
      const date =
        new Date(
          ticket.createdAtUtc
        );

      const key = `${date.getFullYear()}-${String(
        date.getMonth() + 1
      ).padStart(
        2,
        "0"
      )}`;

      monthCounts.set(
        key,
        (monthCounts.get(key) ??
          0) + 1
      );
    }
  );

  return Array.from(
    monthCounts.entries()
  )
    .sort(
      ([a], [b]) =>
        a.localeCompare(b)
    )
    .map(
      ([key, count]) => {
        const [
          year,
          month,
        ] = key.split("-");

        const date = new Date(
          Number(year),
          Number(month) - 1,
          1
        );

        return {
          label:
            date.toLocaleDateString(
              "en-US",
              {
                month: "short",
                year: "2-digit",
              }
            ),

          tickets: count,
        };
      }
    );
}

function getPeriodLabel(
  period: AnalyticsPeriod
) {
  switch (period) {
    case "7d":
      return "Last 7 Days";

    case "30d":
      return "Last 30 Days";

    case "90d":
      return "Last 90 Days";

    default:
      return "All Time";
  }
}
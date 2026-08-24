import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type {
  TicketListItem,
} from "../../types/ticket";

interface TicketActivityChartProps {
  tickets: TicketListItem[];
}

export default function TicketActivityChart({
  tickets,
}: TicketActivityChartProps) {
  const data = createLastSevenDays(
    tickets
  );

  return (
    <div className="overflow-hidden rounded-2xl border border-[#e2e8f0] bg-white shadow-[0_4px_12px_rgba(15,23,42,0.02)]">
      <div className="border-b border-[#e2e8f0] px-6 py-5">
        <h2 className="font-heading text-2xl font-semibold text-[#0f172a]">
          Ticket Activity
        </h2>

        <p className="mt-1 text-sm text-[#64748b]">
          Tickets created during the last 7 days
        </p>
      </div>

      <div className="h-[310px] p-6">
        <ResponsiveContainer
          width="100%"
          height="100%"
        >
          <AreaChart data={data}>
            <defs>
              <linearGradient
                id="ticketGradient"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="5%"
                  stopColor="#4648d4"
                  stopOpacity={0.2}
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
              dataKey="day"
              axisLine={false}
              tickLine={false}
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
              fill="url(#ticketGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function createLastSevenDays(
  tickets: TicketListItem[]
) {
  const days: {
    day: string;
    tickets: number;
  }[] = [];

  for (let i = 6; i >= 0; i--) {
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
      tickets.filter((ticket) => {
        const created =
          new Date(
            ticket.createdAtUtc
          );

        return (
          created >= date &&
          created < nextDay
        );
      }).length;

    days.push({
      day: date.toLocaleDateString(
        "en-US",
        {
          weekday: "short",
        }
      ),
      tickets: count,
    });
  }

  return days;
}
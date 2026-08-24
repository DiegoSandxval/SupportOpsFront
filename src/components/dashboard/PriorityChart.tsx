import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
} from "recharts";

import type {
  TicketListItem,
  TicketPriority,
} from "../../types/ticket";

interface PriorityChartProps {
  tickets: TicketListItem[];
}

const priorities: Array<{
  name: TicketPriority;
  color: string;
}> = [
  {
    name: "Low",
    color: "#cbd5e1",
  },
  {
    name: "Medium",
    color: "#4648d4",
  },
  {
    name: "High",
    color: "#fbbf24",
  },
  {
    name: "Critical",
    color: "#ef4444",
  },
];

export default function PriorityChart({
  tickets,
}: PriorityChartProps) {
  const data = priorities.map((priority) => ({
    ...priority,
    value: tickets.filter(
      (ticket) => ticket.priority === priority.name
    ).length,
  }));

  const total = tickets.length;

  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-[#e2e8f0] bg-white shadow-[0_4px_12px_rgba(15,23,42,0.02)]">
      <div className="border-b border-[#e2e8f0] px-6 py-5">
        <h2 className="font-heading text-2xl font-semibold text-[#0f172a]">
          Tickets by Priority
        </h2>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center p-6">
        <div className="relative h-[210px] w-full">
          <ResponsiveContainer
            width="100%"
            height="100%"
          >
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                innerRadius={65}
                outerRadius={88}
                paddingAngle={2}
              >
                {data.map((item) => (
                  <Cell
                    key={item.name}
                    fill={item.color}
                  />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>

          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            <span className="font-heading text-4xl font-bold text-[#0f172a]">
              {total}
            </span>

            <span className="text-xs font-semibold text-[#64748b]">
              Total
            </span>
          </div>
        </div>

        <div className="grid w-full grid-cols-2 gap-4">
          {data.map((item) => (
            <div
              key={item.name}
              className="flex items-center gap-2 text-sm text-[#64748b]"
            >
              <span
                className="h-3 w-3 rounded-full"
                style={{
                  backgroundColor:
                    item.color,
                }}
              />

              {item.name} ({item.value})
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

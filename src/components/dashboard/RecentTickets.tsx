import type {
  TicketListItem,
} from "../../types/ticket";

interface Props {
  tickets: TicketListItem[];
}

export default function RecentTickets({
  tickets,
}: Props) {
  const recentTickets = [
    ...tickets,
  ]
    .sort(
      (a, b) =>
        new Date(
          b.createdAtUtc
        ).getTime() -
        new Date(
          a.createdAtUtc
        ).getTime()
    )
    .slice(0, 5);

  return (
    <div className="overflow-hidden rounded-2xl border border-[#e2e8f0] bg-white shadow-[0_4px_12px_rgba(15,23,42,0.02)]">
      <div className="flex items-center justify-between border-b border-[#e2e8f0] px-6 py-5">
        <h2 className="font-heading text-2xl font-semibold text-[#0f172a]">
          Recent Tickets
        </h2>
      </div>

      {recentTickets.length === 0 ? (
        <div className="p-10 text-center">
          <p className="font-medium text-[#334155]">
            No tickets yet
          </p>

          <p className="mt-1 text-sm text-[#94a3b8]">
            Tickets will appear here
            when they are created.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-[#e2e8f0] bg-[#eff4ff]/60">
                <TableHeader>
                  Ticket
                </TableHeader>

                <TableHeader>
                  Category
                </TableHeader>

                <TableHeader>
                  Priority
                </TableHeader>

                <TableHeader>
                  Status
                </TableHeader>

                <TableHeader>
                  Created
                </TableHeader>
              </tr>
            </thead>

            <tbody>
              {recentTickets.map(
                (ticket) => (
                  <tr
                    key={ticket.id}
                    className="border-b border-[#e2e8f0]/70 transition last:border-0 hover:bg-[#eff4ff]/40"
                  >
                    <td className="px-6 py-4">
                      <div className="font-mono text-xs text-[#94a3b8]">
                        #
                        {ticket.id
                          .slice(0, 8)
                          .toUpperCase()}
                      </div>

                      <div className="mt-1 font-semibold text-[#0f172a]">
                        {
                          ticket.title
                        }
                      </div>
                    </td>

                    <td className="px-6 py-4 text-sm text-[#64748b]">
                      {
                        ticket.category
                      }
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`rounded-md px-2 py-1 text-xs font-semibold ${priorityClass(
                          ticket.priority
                        )}`}
                      >
                        {
                          ticket.priority
                        }
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold ${statusClass(
                          ticket.status
                        )}`}
                      >
                        {formatStatus(
                          ticket.status
                        )}
                      </span>
                    </td>

                    <td className="whitespace-nowrap px-6 py-4 text-sm text-[#64748b]">
                      {formatDate(
                        ticket.createdAtUtc
                      )}
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function priorityClass(
  priority: string
) {
  switch (priority) {
    case "Critical":
      return "bg-red-100 text-red-700";

    case "High":
      return "bg-orange-100 text-orange-700";

    case "Medium":
      return "bg-blue-100 text-blue-700";

    default:
      return "bg-slate-100 text-slate-700";
  }
}

function statusClass(
  status: string
) {
  switch (status) {
    case "Open":
      return "bg-blue-100 text-blue-700";

    case "Assigned":
      return "bg-purple-100 text-purple-700";

    case "InProgress":
      return "bg-amber-100 text-amber-700";

    case "Resolved":
      return "bg-green-100 text-green-700";

    default:
      return "bg-slate-100 text-slate-700";
  }
}

function formatStatus(
  status: string
) {
  if (status === "InProgress") {
    return "In Progress";
  }

  return status;
}

function formatDate(
  date: string
) {
  return new Intl.DateTimeFormat(
    "en-US",
    {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    }
  ).format(new Date(date));
}

function TableHeader({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <th className="whitespace-nowrap px-6 py-3 text-xs font-semibold text-[#64748b]">
      {children}
    </th>
  );
}
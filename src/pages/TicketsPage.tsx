import {
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  LoaderCircle,
  Search,
  Ticket,
} from "lucide-react";

import {
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import { apiClient } from "../api/apiClient";
import { useAuthStore } from "../store/authStore";

import type {
  TicketListItem,
} from "../types/ticket";

const PAGE_SIZE = 10;

type TicketsPageProps = {
  scope?: "all" | "mine";
};

export default function TicketsPage({
  scope = "all",
}: TicketsPageProps) {
  const navigate = useNavigate();

  const currentUser =
    useAuthStore(
      (state) => state.user
    );

  const [tickets, setTickets] =
    useState<TicketListItem[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  const [search, setSearch] =
    useState("");

  const [status, setStatus] =
    useState("All");

  const [priority, setPriority] =
    useState("All");

  const [category, setCategory] =
    useState("All");

  const [page, setPage] =
    useState(1);

  /*
   * LOAD TICKETS
   */
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
          "Unable to load tickets."
        );
      } finally {
        setLoading(false);
      }
    };

    loadTickets();
  }, []);

  /*
   * RESET PAGE WHEN CHANGING SCOPE
   */
  useEffect(() => {
    setPage(1);
  }, [scope]);

  /*
   * MY TICKETS LOGIC
   *
   * User  -> tickets created by him
   * Agent -> tickets assigned to him
   * Admin -> all tickets
   */
  const scopedTickets =
    useMemo(() => {
      if (scope === "all") {
        return tickets;
      }

      if (!currentUser) {
        return [];
      }

      /*
       * ADMIN
       * My Tickets shows everything.
       */
      if (
        currentUser.role === "Admin"
      ) {
        return tickets;
      }

      /*
       * AGENT
       * Only tickets assigned to him.
       */
      if (
        currentUser.role === "Agent"
      ) {
        return tickets.filter(
          (ticket) =>
            ticket.assignedAgentId ===
            currentUser.id
        );
      }

      /*
       * USER
       * Only tickets created by him.
       */
      return tickets.filter(
        (ticket) =>
          ticket.createdByUserId ===
          currentUser.id
      );
    }, [
      tickets,
      currentUser,
      scope,
    ]);

  /*
   * CATEGORIES
   */
  const categories =
    useMemo(() => {
      return Array.from(
        new Set(
          scopedTickets.map(
            (ticket) =>
              ticket.category
          )
        )
      ).sort();
    }, [scopedTickets]);

  /*
   * SEARCH + FILTERS
   */
  const filteredTickets =
    useMemo(() => {
      const normalizedSearch =
        search
          .trim()
          .toLowerCase();

      return scopedTickets
        .filter((ticket) => {
          const matchesSearch =
            !normalizedSearch ||
            ticket.title
              .toLowerCase()
              .includes(
                normalizedSearch
              ) ||
            ticket.id
              .toLowerCase()
              .includes(
                normalizedSearch
              );

          const matchesStatus =
            status === "All" ||
            ticket.status === status;

          const matchesPriority =
            priority === "All" ||
            ticket.priority ===
              priority;

          const matchesCategory =
            category === "All" ||
            ticket.category ===
              category;

          return (
            matchesSearch &&
            matchesStatus &&
            matchesPriority &&
            matchesCategory
          );
        })
        .sort(
          (a, b) =>
            new Date(
              b.createdAtUtc
            ).getTime() -
            new Date(
              a.createdAtUtc
            ).getTime()
        );
    }, [
      scopedTickets,
      search,
      status,
      priority,
      category,
    ]);

  /*
   * PAGINATION
   */
  const totalPages =
    Math.max(
      1,
      Math.ceil(
        filteredTickets.length /
          PAGE_SIZE
      )
    );

  const currentPage =
    Math.min(
      page,
      totalPages
    );

  const paginatedTickets =
    filteredTickets.slice(
      (currentPage - 1) *
        PAGE_SIZE,
      currentPage *
        PAGE_SIZE
    );

  const resetPage = () => {
    setPage(1);
  };

  /*
   * PAGE TITLE
   */
  const pageTitle =
    scope === "mine"
      ? "My Tickets"
      : "Tickets";

  const pageDescription =
    scope === "mine"
      ? getMyTicketsDescription(
          currentUser?.role
        )
      : "Manage and monitor support tickets.";

  /*
   * LOADING
   */
  if (loading) {
    return (
      <div className="flex min-h-[calc(100vh-64px)] items-center justify-center bg-[#f8f9ff]">

        <div className="flex items-center gap-3 text-[#64748b]">

          <LoaderCircle
            size={22}
            className="animate-spin"
          />

          Loading tickets...

        </div>

      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-64px)] bg-[#f8f9ff] p-4 pb-24 md:p-6 md:pb-8">

      <div className="mx-auto max-w-[1440px]">

        {/* HEADER */}
        <div className="mb-8">

          <div className="flex items-center gap-3">

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#e1e0ff] text-[#4648d4]">

              <Ticket size={22} />

            </div>

            <div>

              <h1 className="font-heading text-3xl font-semibold tracking-tight text-[#0f172a]">
                {pageTitle}
              </h1>

              <p className="mt-1 text-sm text-[#64748b]">
                {pageDescription}
              </p>

            </div>

          </div>

        </div>

        {/* ERROR */}
        {error && (
          <div className="mb-6 flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">

            <AlertCircle size={18} />

            {error}

          </div>
        )}

        {/* MAIN CARD */}
        <div className="overflow-hidden rounded-2xl border border-[#e2e8f0] bg-white shadow-[0_4px_12px_rgba(15,23,42,0.02)]">

          {/* FILTERS */}
          <div className="border-b border-[#e2e8f0] p-5">

            <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">

              {/* SEARCH */}
              <div className="relative w-full xl:max-w-md">

                <Search
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94a3b8]"
                />

                <input
                  value={search}
                  onChange={(event) => {
                    setSearch(
                      event.target.value
                    );

                    resetPage();
                  }}
                  placeholder="Search by title or ticket ID..."
                  className="w-full rounded-lg border border-[#e2e8f0] bg-white py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-[#4648d4] focus:ring-4 focus:ring-[#4648d4]/10"
                />

              </div>

              {/* FILTER SELECTS */}
              <div className="flex flex-wrap gap-3">

                <FilterSelect
                  value={status}
                  onChange={(value) => {
                    setStatus(value);
                    resetPage();
                  }}
                  options={[
                    "All",
                    "Open",
                    "Assigned",
                    "InProgress",
                    "Resolved",
                    "Closed",
                  ]}
                />

                <FilterSelect
                  value={priority}
                  onChange={(value) => {
                    setPriority(value);
                    resetPage();
                  }}
                  options={[
                    "All",
                    "Low",
                    "Medium",
                    "High",
                    "Critical",
                  ]}
                />

                <FilterSelect
                  value={category}
                  onChange={(value) => {
                    setCategory(value);
                    resetPage();
                  }}
                  options={[
                    "All",
                    ...categories,
                  ]}
                />

              </div>

            </div>

          </div>

          {/* RESULT COUNT */}
          <div className="flex items-center justify-between border-b border-[#e2e8f0] px-6 py-4">

            <p className="text-sm text-[#64748b]">

              Showing{" "}

              <span className="font-semibold text-[#0f172a]">
                {
                  filteredTickets.length
                }
              </span>{" "}

              ticket
              {filteredTickets.length !==
              1
                ? "s"
                : ""}

            </p>

          </div>

          {/* EMPTY */}
          {paginatedTickets.length ===
          0 ? (

            <div className="p-12 text-center">

              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#eff4ff] text-[#4648d4]">

                <Ticket size={22} />

              </div>

              <h3 className="mt-4 font-semibold text-[#0f172a]">

                {scope === "mine"
                  ? "No tickets found for your account"
                  : "No tickets found"}

              </h3>

              <p className="mt-1 text-sm text-[#64748b]">

                {scope === "mine"
                  ? "There are currently no tickets matching your filters."
                  : "Try changing your filters or search criteria."}

              </p>

            </div>

          ) : (

            /* TABLE */
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
                      Assigned
                    </TableHeader>

                    <TableHeader>
                      Created
                    </TableHeader>

                  </tr>

                </thead>

                <tbody>

                  {paginatedTickets.map(
                    (ticket) => (

                      <tr
                        key={ticket.id}
                        onClick={() =>
                          navigate(
                            `/tickets/${ticket.id}`
                          )
                        }
                        className="cursor-pointer border-b border-[#e2e8f0]/70 transition last:border-0 hover:bg-[#eff4ff]/60"
                      >

                        {/* TICKET */}
                        <td className="px-6 py-4">

                          <p className="font-mono text-xs text-[#94a3b8]">

                            #

                            {ticket.id
                              .slice(
                                0,
                                8
                              )
                              .toUpperCase()}

                          </p>

                          <p className="mt-1 max-w-sm font-semibold text-[#0f172a]">

                            {
                              ticket.title
                            }

                          </p>

                        </td>

                        {/* CATEGORY */}
                        <td className="px-6 py-4 text-sm text-[#64748b]">

                          {
                            ticket.category
                          }

                        </td>

                        {/* PRIORITY */}
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

                        {/* STATUS */}
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

                        {/* ASSIGNED */}
                        <td className="px-6 py-4 text-sm text-[#64748b]">

                          {ticket.assignedAgentId
                            ? "Assigned"
                            : "Unassigned"}

                        </td>

                        {/* CREATED */}
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

          {/* PAGINATION */}
          <div className="flex items-center justify-between border-t border-[#e2e8f0] px-6 py-4">

            <span className="text-sm text-[#64748b]">

              Page {currentPage} of{" "}
              {totalPages}

            </span>

            <div className="flex gap-2">

              {/* PREVIOUS */}
              <button
                disabled={
                  currentPage === 1
                }
                onClick={() =>
                  setPage(
                    (current) =>
                      current - 1
                  )
                }
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#e2e8f0] text-[#475569] transition hover:bg-[#eff4ff] disabled:cursor-not-allowed disabled:opacity-40"
              >

                <ChevronLeft
                  size={18}
                />

              </button>

              {/* NEXT */}
              <button
                disabled={
                  currentPage ===
                  totalPages
                }
                onClick={() =>
                  setPage(
                    (current) =>
                      current + 1
                  )
                }
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#e2e8f0] text-[#475569] transition hover:bg-[#eff4ff] disabled:cursor-not-allowed disabled:opacity-40"
              >

                <ChevronRight
                  size={18}
                />

              </button>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

/*
 * DESCRIPTION FOR MY TICKETS
 */
function getMyTicketsDescription(
  role?: string
) {
  switch (role) {
    case "Agent":
      return "View tickets assigned to you.";

    case "Admin":
      return "View all support tickets.";

    default:
      return "View tickets created by you.";
  }
}

/*
 * FILTER SELECT
 */
function FilterSelect({
  value,
  onChange,
  options,
}: {
  value: string;

  onChange: (
    value: string
  ) => void;

  options: string[];
}) {
  return (
    <select
      value={value}
      onChange={(event) =>
        onChange(
          event.target.value
        )
      }
      className="rounded-lg border border-[#e2e8f0] bg-white px-3 py-2.5 text-sm text-[#475569] outline-none transition focus:border-[#4648d4]"
    >

      {options.map(
        (option) => (

          <option
            key={option}
            value={option}
          >

            {option ===
            "InProgress"
              ? "In Progress"
              : option}

          </option>

        )
      )}

    </select>
  );
}

/*
 * PRIORITY COLORS
 */
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

/*
 * STATUS COLORS
 */
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

    case "Closed":
      return "bg-slate-100 text-slate-700";

    default:
      return "bg-slate-100 text-slate-700";
  }
}

/*
 * FORMAT STATUS
 */
function formatStatus(
  status: string
) {
  return status === "InProgress"
    ? "In Progress"
    : status;
}

/*
 * FORMAT DATE
 */
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
  ).format(
    new Date(date)
  );
}

/*
 * TABLE HEADER
 */
function TableHeader({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <th className="whitespace-nowrap px-6 py-3 text-xs font-semibold uppercase tracking-wide text-[#64748b]">

      {children}

    </th>
  );
}
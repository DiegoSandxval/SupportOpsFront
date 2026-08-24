import {
  AlertCircle,
  ArrowLeft,
  Calendar,
  CheckCircle2,
  CircleUserRound,
  Clock3,
  LoaderCircle,
  LockKeyhole,
  MessageSquare,
  Send,
  Tag,
  Ticket as TicketIcon,
} from "lucide-react";
import {
  useEffect,
  useState,
  type ElementType,
  type ReactNode,
} from "react";
import {
  Link,
  useParams,
} from "react-router-dom";

import { apiClient } from "../api/apiClient";
import { useAuthStore } from "../store/authStore";

import type {
  TicketComment,
  TicketDetail,
  TicketHistoryItem,
  TicketPriority,
  TicketStatus,
} from "../types/ticket";

import type {
  AgentListItem,
} from "../types/user";

export default function TicketDetailPage() {
  const { id } = useParams();

  const user = useAuthStore(
    (state) => state.user
  );

  const [ticket, setTicket] =
    useState<TicketDetail | null>(
      null
    );

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  const [comments, setComments] =
  useState<TicketComment[]>([]);

const [history, setHistory] =
  useState<TicketHistoryItem[]>([]);

const [commentMessage, setCommentMessage] =
  useState("");

const [isInternal, setIsInternal] =
  useState(false);

const [postingComment, setPostingComment] =
  useState(false);

const [agents, setAgents] =
  useState<AgentListItem[]>([]);

const [loadingAgents, setLoadingAgents] =
  useState(false);

const canManageStatus =
  user?.role === "Agent" ||
  user?.role === "Admin";

const canUseInternalNotes =
  user?.role === "Agent" ||
  user?.role === "Admin";

  const loadTicket = async () => {
    if (!id) {
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const [
        ticketResponse,
        commentsResponse,
        historyResponse,
      ] = await Promise.all([
        apiClient.get<TicketDetail>(
          `/tickets/${id}`
        ),

        apiClient.get<
          TicketComment[]
        >(
          `/tickets/${id}/comments`
        ),

        apiClient.get<
          TicketHistoryItem[]
        >(
          `/tickets/${id}/history`
        ),
      ]);

      setTicket(
        ticketResponse.data
      );

      setComments(
        [
          ...commentsResponse.data,
        ].sort(
          (a, b) =>
            new Date(
              a.createdAtUtc
            ).getTime() -
            new Date(
              b.createdAtUtc
            ).getTime()
        )
      );

      setHistory(
        [
          ...historyResponse.data,
        ].sort(
          (a, b) =>
            new Date(
              b.createdAtUtc
            ).getTime() -
            new Date(
              a.createdAtUtc
            ).getTime()
        )
      );
    } catch (error) {
      console.error(
        "Error loading ticket:",
        error
      );

      setError(
        getApiError(
          error,
          "Unable to load ticket."
        )
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTicket();
  }, [id]);

  useEffect(() => {
    if (!canManageStatus) {
      return;
    }

    const loadAgents =
      async () => {
        try {
          setLoadingAgents(true);

          const response =
            await apiClient.get<
              AgentListItem[]
            >("/users/agents");

          setAgents(
            response.data
          );
        } catch (error) {
          console.error(
            "Error loading agents:",
            error
          );

          setError(
            getApiError(
              error,
              "Unable to load agents."
            )
          );
        } finally {
          setLoadingAgents(
            false
          );
        }
      };

    loadAgents();
  }, [canManageStatus]);

  const updatePriority =
    async (
      priority: TicketPriority
    ) => {
      if (!ticket) {
        return;
      }

      try {
        setSaving(true);
        setError(null);

        await apiClient.patch(
          `/tickets/${ticket.id}`,
          {
            priority,
          }
        );

        await loadTicket();
      } catch (error) {
        console.error(
          "Error updating priority:",
          error
        );

        setError(
          getApiError(
            error,
            "Unable to update priority."
          )
        );
      } finally {
        setSaving(false);
      }
    };

  const updateStatus =
    async (
      status: TicketStatus
    ) => {
      if (!ticket) {
        return;
      }

      try {
        setSaving(true);
        setError(null);

        await apiClient.patch(
          `/tickets/${ticket.id}`,
          {
            status,
          }
        );

        await loadTicket();
      } catch (error) {
        console.error(
          "Error updating status:",
          error
        );

        setError(
          getApiError(
            error,
            "Unable to update status."
          )
        );
      } finally {
        setSaving(false);
      }
    };

  const assignAgent =
    async (
      agentId: string
    ) => {
      if (
        !ticket ||
        !agentId
      ) {
        return;
      }

      try {
        setSaving(true);
        setError(null);

        await apiClient.patch(
          `/tickets/${ticket.id}`,
          {
            assignedAgentId:
              agentId,
          }
        );

        await loadTicket();
      } catch (error) {
        console.error(
          "Error assigning agent:",
          error
        );

        setError(
          getApiError(
            error,
            "Unable to assign agent."
          )
        );
      } finally {
        setSaving(false);
      }
    };

  const addComment =
    async () => {
      if (
        !ticket ||
        !commentMessage.trim()
      ) {
        return;
      }

      try {
        setPostingComment(
          true
        );

        setError(null);

        await apiClient.post(
          `/tickets/${ticket.id}/comments`,
          {
            message:
              commentMessage.trim(),

            isInternal:
              canUseInternalNotes
                ? isInternal
                : false,
          }
        );

        setCommentMessage("");
        setIsInternal(false);

        const [
          commentsResponse,
          historyResponse,
        ] = await Promise.all([
          apiClient.get<
            TicketComment[]
          >(
            `/tickets/${ticket.id}/comments`
          ),

          apiClient.get<
            TicketHistoryItem[]
          >(
            `/tickets/${ticket.id}/history`
          ),
        ]);

        setComments(
          [
            ...commentsResponse.data,
          ].sort(
            (a, b) =>
              new Date(
                a.createdAtUtc
              ).getTime() -
              new Date(
                b.createdAtUtc
              ).getTime()
          )
        );

        setHistory(
          [
            ...historyResponse.data,
          ].sort(
            (a, b) =>
              new Date(
                b.createdAtUtc
              ).getTime() -
              new Date(
                a.createdAtUtc
              ).getTime()
          )
        );
      } catch (error) {
        console.error(
          "Error adding comment:",
          error
        );

        setError(
          getApiError(
            error,
            "Unable to add comment."
          )
        );
      } finally {
        setPostingComment(
          false
        );
      }
    };

  if (loading) {
    return (
      <div className="flex min-h-[calc(100vh-64px)] items-center justify-center bg-[#f8f9ff]">
        <div className="flex items-center gap-3 text-[#64748b]">
          <LoaderCircle
            size={22}
            className="animate-spin"
          />

          Loading ticket...
        </div>
      </div>
    );
  }

  if (
    error &&
    !ticket
  ) {
    return (
      <div className="min-h-[calc(100vh-64px)] bg-[#f8f9ff] p-6">
        <div className="mx-auto max-w-[1200px]">
          <Link
            to="/tickets"
            className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-[#4648d4]"
          >
            <ArrowLeft
              size={17}
            />

            Back to Tickets
          </Link>

          <div className="rounded-xl border border-red-200 bg-red-50 p-5 text-red-700">
            {error}
          </div>
        </div>
      </div>
    );
  }

  if (!ticket) {
    return null;
  }

  return (
    <div className="min-h-[calc(100vh-64px)] bg-[#f8f9ff] p-4 pb-24 md:p-6 md:pb-8">
      <div className="mx-auto max-w-[1400px]">

        <Link
          to="/tickets"
          className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-[#64748b] transition hover:text-[#4648d4]"
        >
          <ArrowLeft
            size={17}
          />

          Back to Tickets
        </Link>

        {error && (
          <div className="mb-6 flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            <AlertCircle
              size={18}
            />

            {error}
          </div>
        )}

        <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">

          <div>
            <div className="mb-3 flex flex-wrap items-center gap-3">

              <span className="font-mono text-sm font-semibold text-[#4648d4]">
                #
                {ticket.id
                  .slice(0, 8)
                  .toUpperCase()}
              </span>

              <StatusBadge
                status={
                  ticket.status
                }
              />

              <PriorityBadge
                priority={
                  ticket.priority
                }
              />

            </div>

            <h1 className="font-heading max-w-4xl text-3xl font-semibold tracking-tight text-[#0f172a] md:text-[36px]">
              {ticket.title}
            </h1>

            <p className="mt-2 text-sm text-[#64748b]">
              Created{" "}
              {formatDate(
                ticket.createdAtUtc
              )}
            </p>
          </div>

        </div>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_340px]">

          <div className="space-y-6">

            {/* DESCRIPTION */}
            <section className="rounded-2xl border border-[#e2e8f0] bg-white p-6 shadow-[0_4px_12px_rgba(15,23,42,0.02)]">

              <h2 className="font-heading text-xl font-semibold text-[#0f172a]">
                Description
              </h2>

              <p className="mt-4 whitespace-pre-wrap leading-7 text-[#475569]">
                {
                  ticket.description
                }
              </p>

            </section>

            {/* COMMENTS */}
            <section className="rounded-2xl border border-[#e2e8f0] bg-white shadow-[0_4px_12px_rgba(15,23,42,0.02)]">

              <div className="border-b border-[#e2e8f0] px-6 py-5">

                <div className="flex items-center gap-3">

                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#e1e0ff] text-[#4648d4]">
                    <MessageSquare
                      size={18}
                    />
                  </div>

                  <div>
                    <h2 className="font-heading text-xl font-semibold text-[#0f172a]">
                      Comments
                    </h2>

                    <p className="text-sm text-[#64748b]">
                      Ticket conversation
                      and internal notes
                    </p>
                  </div>

                </div>
              </div>

              <div className="p-6">

                {comments.length ===
                0 ? (
                  <div className="py-10 text-center">

                    <MessageSquare
                      size={30}
                      className="mx-auto text-[#cbd5e1]"
                    />

                    <p className="mt-3 font-medium text-[#334155]">
                      No comments yet
                    </p>

                    <p className="mt-1 text-sm text-[#94a3b8]">
                      Start the
                      conversation below.
                    </p>

                  </div>
                ) : (
                  <div className="space-y-5">

                    {comments.map(
                      (comment) => {
                        return (
                          <div
                            key={
                              comment.id
                            }
                            className={`rounded-xl border p-4 ${
                              comment.isInternal
                                ? "border-amber-200 bg-amber-50"
                                : "border-[#e2e8f0] bg-[#f8f9ff]"
                            }`}
                          >
                            <div className="mb-3 flex items-start justify-between gap-4">

                              <div className="flex items-center gap-3">

                                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#6063ee] text-xs font-semibold text-white">
                                 {getInitials(
                comment.userFullName
              )}
                                </div>

                                <div>

                                  <div className="flex flex-wrap items-center gap-2">

                                    <p className="text-sm font-semibold text-[#0f172a]">
                                      {comment.userFullName}
                                    </p>

                                    {comment.isInternal && (
                                      <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-semibold text-amber-700">
                                        <LockKeyhole
                                          size={
                                            11
                                          }
                                        />

                                        Internal
                                      </span>
                                    )}

                                  </div>

                                  <p className="mt-0.5 text-xs text-[#94a3b8]">
                                    {formatDate(
                                      comment.createdAtUtc
                                    )}
                                  </p>

                                </div>

                              </div>

                            </div>

                            <p className="whitespace-pre-wrap text-sm leading-6 text-[#475569]">
                              {
                                comment.message
                              }
                            </p>

                          </div>
                        );
                      }
                    )}

                  </div>
                )}

                <div className="mt-6 border-t border-[#e2e8f0] pt-6">

                  <label className="mb-2 block text-sm font-semibold text-[#334155]">
                    Add comment
                  </label>

                  <textarea
                    value={
                      commentMessage
                    }
                    onChange={(
                      event
                    ) =>
                      setCommentMessage(
                        event.target
                          .value
                      )
                    }
                    rows={4}
                    placeholder="Write a comment..."
                    className="w-full resize-none rounded-xl border border-[#e2e8f0] bg-white p-4 text-sm text-[#0f172a] outline-none transition focus:border-[#4648d4] focus:ring-4 focus:ring-[#4648d4]/10"
                  />

                  <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

                    {canUseInternalNotes ? (
                      <label className="flex cursor-pointer items-center gap-2 text-sm text-[#64748b]">

                        <input
                          type="checkbox"
                          checked={
                            isInternal
                          }
                          onChange={(
                            event
                          ) =>
                            setIsInternal(
                              event.target
                                .checked
                            )
                          }
                          className="h-4 w-4 accent-[#4648d4]"
                        />

                        <LockKeyhole
                          size={15}
                        />

                        Internal note
                      </label>
                    ) : (
                      <span />
                    )}

                    <button
                      type="button"
                      disabled={
                        postingComment ||
                        !commentMessage.trim()
                      }
                      onClick={
                        addComment
                      }
                      className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#4648d4] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#3d3fc2] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {postingComment ? (
                        <>
                          <LoaderCircle
                            size={
                              17
                            }
                            className="animate-spin"
                          />

                          Posting...
                        </>
                      ) : (
                        <>
                          <Send
                            size={
                              17
                            }
                          />

                          Add Comment
                        </>
                      )}
                    </button>

                  </div>

                </div>

              </div>

            </section>

            {/* HISTORY */}
            <section className="rounded-2xl border border-[#e2e8f0] bg-white shadow-[0_4px_12px_rgba(15,23,42,0.02)]">

              <div className="border-b border-[#e2e8f0] px-6 py-5">

                <div className="flex items-center gap-3">

                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#eff4ff] text-[#4648d4]">
                    <Clock3
                      size={18}
                    />
                  </div>

                  <div>
                    <h2 className="font-heading text-xl font-semibold text-[#0f172a]">
                      Activity History
                    </h2>

                    <p className="text-sm text-[#64748b]">
                      Changes recorded
                      for this ticket
                    </p>
                  </div>

                </div>

              </div>

              <div className="p-6">

                {history.length ===
                0 ? (
                  <p className="py-8 text-center text-sm text-[#94a3b8]">
                    No activity
                    recorded yet.
                  </p>
                ) : (
                  <div className="relative">

                    <div className="absolute bottom-3 left-[7px] top-3 w-px bg-[#e2e8f0]" />

                    <div className="space-y-6">

                      {history.map(
                        (item) => {
                          const isCurrentUser =
                            item.changedByUserId ===
                            user?.id;

                          return (
                            <div
                              key={
                                item.id
                              }
                              className="relative flex gap-4"
                            >

                              <div className="relative z-10 mt-1 h-[15px] w-[15px] shrink-0 rounded-full border-[3px] border-white bg-[#6063ee] shadow-[0_0_0_1px_#c7c4d7]" />

                              <div className="min-w-0 flex-1">

                                <div className="flex flex-col justify-between gap-1 sm:flex-row sm:items-center">

                                  <p className="text-sm font-semibold text-[#334155]">
                                    {formatAction(
                                      item.action
                                    )}
                                  </p>

                                  <span className="text-xs text-[#94a3b8]">
                                    {formatDate(
                                      item.createdAtUtc
                                    )}
                                  </span>

                                </div>

                                {item.description && (
                                  <p className="mt-1 text-sm text-[#64748b]">
                                    {
                                      item.description
                                    }
                                  </p>
                                )}

                                <p className="mt-1 text-xs text-[#94a3b8]">
                                      {isCurrentUser
                                          ? "By you"
                                          : `By ${item.changedByUserName}`}
                                </p>

                                {(item.previousValue ||
                                  item.newValue) && (
                                  <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">

                                    {item.previousValue && (
                                      <span className="rounded-md bg-slate-100 px-2 py-1 text-slate-500 line-through">
                                        {
                                          item.previousValue
                                        }
                                      </span>
                                    )}

                                    {item.newValue && (
                                      <span className="rounded-md bg-[#e1e0ff] px-2 py-1 font-semibold text-[#4648d4]">
                                        {
                                          item.newValue
                                        }
                                      </span>
                                    )}

                                  </div>
                                )}

                              </div>

                            </div>
                          );
                        }
                      )}

                    </div>

                  </div>
                )}

              </div>

            </section>

          </div>

          {/* DETAILS */}
          <aside className="space-y-6">

            <section className="rounded-2xl border border-[#e2e8f0] bg-white p-6 shadow-[0_4px_12px_rgba(15,23,42,0.02)]">

              <h2 className="font-heading text-lg font-semibold text-[#0f172a]">
                Details
              </h2>

              <div className="mt-6 space-y-5">

                {/* STATUS */}
                <DetailItem
                  icon={TicketIcon}
                  label="Status"
                >
                  {canManageStatus ? (
                    <select
                      value={
                        ticket.status
                      }
                      disabled={
                        saving
                      }
                      onChange={(
                        event
                      ) =>
                        updateStatus(
                          event.target
                            .value as TicketStatus
                        )
                      }
                      className="w-full rounded-lg border border-[#e2e8f0] bg-white px-3 py-2 text-sm font-medium text-[#334155] outline-none transition focus:border-[#4648d4] focus:ring-4 focus:ring-[#4648d4]/10 disabled:cursor-not-allowed disabled:opacity-60"
                    >

                      <option
                        value={
                          ticket.status
                        }
                      >
                        {formatStatus(
                          ticket.status
                        )}
                      </option>

                      {getAvailableStatuses(
                        ticket
                      ).map(
                        (status) => (
                          <option
                            key={
                              status
                            }
                            value={
                              status
                            }
                          >
                            {formatStatus(
                              status
                            )}
                          </option>
                        )
                      )}

                    </select>
                  ) : (
                    <StatusBadge
                      status={
                        ticket.status
                      }
                    />
                  )}
                </DetailItem>

                {/* PRIORITY */}
                <DetailItem
                  icon={AlertCircle}
                  label="Priority"
                >
                  <select
                    value={
                      ticket.priority
                    }
                    disabled={
                      saving
                    }
                    onChange={(
                      event
                    ) =>
                      updatePriority(
                        event.target
                          .value as TicketPriority
                      )
                    }
                    className="w-full rounded-lg border border-[#e2e8f0] bg-white px-3 py-2 text-sm font-medium text-[#334155] outline-none transition focus:border-[#4648d4] focus:ring-4 focus:ring-[#4648d4]/10 disabled:cursor-not-allowed disabled:opacity-60"
                  >

                    <option value="Low">
                      Low
                    </option>

                    <option value="Medium">
                      Medium
                    </option>

                    <option value="High">
                      High
                    </option>

                    <option value="Critical">
                      Critical
                    </option>

                  </select>
                </DetailItem>

                {/* CATEGORY */}
                <DetailItem
                  icon={Tag}
                  label="Category"
                >
                  <span className="text-sm font-medium text-[#334155]">
                    {
                      ticket.category
                    }
                  </span>
                </DetailItem>

                {/* ASSIGNED AGENT */}
                <DetailItem
                  icon={
                    CircleUserRound
                  }
                  label="Assigned Agent"
                >
                  {canManageStatus ? (
                    <select
                      value={
                        ticket.assignedAgentId ??
                        ""
                      }
                      disabled={
                        saving ||
                        loadingAgents
                      }
                      onChange={(
                        event
                      ) =>
                        assignAgent(
                          event.target
                            .value
                        )
                      }
                      className="w-full rounded-lg border border-[#e2e8f0] bg-white px-3 py-2 text-sm font-medium text-[#334155] outline-none transition focus:border-[#4648d4] focus:ring-4 focus:ring-[#4648d4]/10 disabled:cursor-not-allowed disabled:opacity-60"
                    >

                      <option
                        value=""
                        disabled
                      >
                        {loadingAgents
                          ? "Loading agents..."
                          : "Select an agent"}
                      </option>

                      {agents.map(
                        (agent) => (
                          <option
                            key={
                              agent.id
                            }
                            value={
                              agent.id
                            }
                          >
                            {
                              agent.fullName
                            }
                          </option>
                        )
                      )}

                    </select>
                  ) : (
                    <span className="text-sm font-medium text-[#334155]">
                      {ticket.assignedAgentId
                        ? "Assigned"
                        : "Unassigned"}
                    </span>
                  )}
                </DetailItem>

                {/* CREATED */}
                <DetailItem
                  icon={Calendar}
                  label="Created"
                >
                  <span className="text-sm font-medium text-[#334155]">
                    {formatDate(
                      ticket.createdAtUtc
                    )}
                  </span>
                </DetailItem>

                {/* RESOLVED */}
                {ticket.resolvedAtUtc && (
                  <DetailItem
                    icon={
                      CheckCircle2
                    }
                    label="Resolved"
                  >
                    <span className="text-sm font-medium text-[#334155]">
                      {formatDate(
                        ticket.resolvedAtUtc
                      )}
                    </span>
                  </DetailItem>
                )}

                {/* CLOSED */}
                {ticket.closedAtUtc && (
                  <DetailItem
                    icon={
                      CheckCircle2
                    }
                    label="Closed"
                  >
                    <span className="text-sm font-medium text-[#334155]">
                      {formatDate(
                        ticket.closedAtUtc
                      )}
                    </span>
                  </DetailItem>
                )}

              </div>

            </section>

          </aside>

        </div>

      </div>
    </div>
  );
}

function DetailItem({
  icon: Icon,
  label,
  children,
}: {
  icon: ElementType;
  label: string;
  children: ReactNode;
}) {
  return (
    <div>

      <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-[#94a3b8]">
        <Icon size={15} />
        {label}
      </div>

      {children}

    </div>
  );
}

function getAvailableStatuses(
  ticket: TicketDetail
): TicketStatus[] {
  if (
    ticket.status ===
    "Closed"
  ) {
    return [];
  }

  const statuses:
    TicketStatus[] = [];

  if (
    ticket.assignedAgentId &&
    ticket.status !==
      "InProgress"
  ) {
    statuses.push(
      "InProgress"
    );
  }

  if (
    ticket.status !==
    "Resolved"
  ) {
    statuses.push(
      "Resolved"
    );
  }

  if (
    ticket.status ===
    "Resolved"
  ) {
    statuses.push(
      "Closed"
    );
  }

  return statuses;
}

function StatusBadge({
  status,
}: {
  status: string;
}) {
  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${statusClass(
        status
      )}`}
    >
      {formatStatus(
        status
      )}
    </span>
  );
}

function PriorityBadge({
  priority,
}: {
  priority: string;
}) {
  return (
    <span
      className={`inline-flex rounded-md px-2.5 py-1 text-xs font-semibold ${priorityClass(
        priority
      )}`}
    >
      {priority}
    </span>
  );
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

    case "Closed":
      return "bg-slate-200 text-slate-700";

    default:
      return "bg-slate-100 text-slate-700";
  }
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

function formatStatus(
  status: string
) {
  return status ===
    "InProgress"
    ? "In Progress"
    : status;
}

function formatDate(
  value: string
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
    new Date(value)
  );
}

function getApiError(
  error: unknown,
  fallback: string
) {
  if (
    typeof error ===
      "object" &&
    error !== null &&
    "response" in error
  ) {
    const axiosError =
      error as {
        response?: {
          data?: {
            message?: string;
            detail?: string;
          };
        };
      };

    return (
      axiosError.response
        ?.data?.message ??
      axiosError.response
        ?.data?.detail ??
      fallback
    );
  }

  return fallback;
}

function getInitials(
  fullName?: string
) {
  if (!fullName) {
    return "?";
  }

  return fullName
    .trim()
    .split(/\s+/)
    .map(
      (part) => part[0]
    )
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function formatAction(
  action: string
) {
  switch (action) {
    case "Created":
      return "Ticket created";

    case "Assigned":
      return "Agent assigned";

    case "StatusChanged":
      return "Status changed";

    case "PriorityChanged":
      return "Priority changed";

    case "CategoryChanged":
      return "Category changed";

    case "CommentAdded":
      return "Comment added";

    case "Resolved":
      return "Ticket resolved";

    case "Closed":
      return "Ticket closed";

    default:
      return action;
  }
}
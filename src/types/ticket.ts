export type TicketStatus =
  | "Open"
  | "Assigned"
  | "InProgress"
  | "Resolved"
  | "Closed";

export type TicketPriority =
  | "Low"
  | "Medium"
  | "High"
  | "Critical";

export interface TicketListItem {
  id: string;
  title: string;
  status: TicketStatus;
  priority: TicketPriority;
  category: string;
  createdByUserId: string;
  assignedAgentId: string | null;
  createdAtUtc: string;
}
export interface TicketDetail {
  id: string;
  title: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
  category: string;
  createdByUserId: string;
  assignedAgentId: string | null;
  createdAtUtc: string;
  resolvedAtUtc: string | null;
  closedAtUtc: string | null;
}

export interface UpdateTicketRequest {
  priority?: TicketPriority;
  category?: string;
  assignedAgentId?: string;
  status?: TicketStatus;
}
export interface TicketComment {
  id: string;
  ticketId: string;
  userId: string;
  userFullName: string;
  message: string;
  isInternal: boolean;
  createdAtUtc: string;
}

export interface TicketHistoryItem {
  id: string;
  ticketId: string;
  changedByUserId: string;
  changedByUserName: string;
  action: string;
  previousValue: string | null;
  newValue: string | null;
  description: string | null;
  createdAtUtc: string;
}
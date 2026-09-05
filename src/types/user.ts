export type UserRole =
  | "User"
  | "Agent"
  | "Admin";

export interface AgentListItem {
  id: string;
  fullName: string;
  email: string;
}

export interface UserListItem {
  id: string;
  fullName: string;
  email: string;
  role: UserRole;
  isActive: boolean;
}

export interface CreateUserRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: UserRole;
}

export interface CreateUserResponse {
  id: string;
  fullName: string;
  email: string;
  role: UserRole;
}
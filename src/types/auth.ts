export type UserRole =
  | "User"
  | "Agent"
  | "Admin";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginUser {
  id: string;
  fullName: string;
  email: string;
  role: UserRole;
}

export interface LoginResponse {
  accessToken: string;
  expiresAtUtc: string;
  user: LoginUser;
}
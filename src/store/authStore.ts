import { create } from "zustand";
import type { UserRole } from "../types/auth";

export interface AuthUser {
  id: string;
  fullName: string;
  email: string;
  role: UserRole;
}

interface AuthState {
  token: string | null;
  user: AuthUser | null;

  setAuth: (
    token: string,
    user: AuthUser
  ) => void;

  updateUser: (
    updates: Partial<AuthUser>
  ) => void;

  logout: () => void;
}

function getStoredUser(): AuthUser | null {
  const storedUser =
    localStorage.getItem("supportops_user");

  if (!storedUser) {
    return null;
  }

  try {
    return JSON.parse(storedUser);
  } catch {
    localStorage.removeItem("supportops_user");
    return null;
  }
}

export const useAuthStore =
  create<AuthState>((set) => ({
    token:
      localStorage.getItem(
        "supportops_token"
      ),

    user: getStoredUser(),

    setAuth: (token, user) => {
      localStorage.setItem(
        "supportops_token",
        token
      );

      localStorage.setItem(
        "supportops_user",
        JSON.stringify(user)
      );

      set({
        token,
        user,
      });
    },

    updateUser: (updates) => {
      set((state) => {
        if (!state.user) {
          return {};
        }

        const updatedUser = {
          ...state.user,
          ...updates,
        };

        localStorage.setItem(
          "supportops_user",
          JSON.stringify(updatedUser)
        );

        return {
          user: updatedUser,
        };
      });
    },

    logout: () => {
      localStorage.removeItem(
        "supportops_token"
      );

      localStorage.removeItem(
        "supportops_user"
      );

      set({
        token: null,
        user: null,
      });
    },
  }));
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import {
  AlertCircle,
  Eye,
  EyeOff,
  UserPlus,
  X,
} from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { apiClient } from "../../api/apiClient";
import type {
  CreateUserRequest,
  CreateUserResponse,
} from "../../types/user";

const createUserSchema = z.object({
  firstName: z
    .string()
    .min(1, "First name is required."),

  lastName: z
    .string()
    .min(1, "Last name is required."),

  email: z
    .string()
    .min(1, "Email is required.")
    .email("Enter a valid email address."),

  password: z
    .string()
    .min(
      8,
      "Password must contain at least 8 characters."
    ),

  role: z.enum([
    "User",
    "Agent",
    "Admin",
  ]),
});

type CreateUserFormData =
  z.infer<typeof createUserSchema>;

interface CreateUserModalProps {
  open: boolean;
  onClose: () => void;
  onCreated: () => Promise<void>;
}

export default function CreateUserModal({
  open,
  onClose,
  onCreated,
}: CreateUserModalProps) {
  const [showPassword, setShowPassword] =
    useState(false);

  const [serverError, setServerError] =
    useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: {
      errors,
      isSubmitting,
    },
  } = useForm<CreateUserFormData>({
    resolver: zodResolver(
      createUserSchema
    ),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      role: "User",
    },
  });

  if (!open) {
    return null;
  }

  const closeModal = () => {
    if (isSubmitting) {
      return;
    }

    setServerError(null);
    setShowPassword(false);
    reset();
    onClose();
  };

  const onSubmit = async (
    data: CreateUserFormData
  ) => {
    try {
      setServerError(null);

      const request: CreateUserRequest = {
        firstName: data.firstName.trim(),
        lastName: data.lastName.trim(),
        email: data.email.trim(),
        password: data.password,
        role: data.role,
      };

      await apiClient.post<CreateUserResponse>(
        "/users",
        request
      );

      await onCreated();

      reset();
      setShowPassword(false);
      onClose();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setServerError(
          error.response?.data?.message ??
            "Unable to create user."
        );

        return;
      }

      setServerError(
        "Unable to connect to SupportOps."
      );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0f172a]/40 p-4">
      <div className="w-full max-w-[560px] overflow-hidden rounded-2xl bg-white shadow-2xl">

        {/* HEADER */}
        <div className="flex items-center justify-between border-b border-[#e2e8f0] px-6 py-5">
          <div>
            <h2 className="font-heading text-xl font-semibold text-[#0f172a]">
              Create User
            </h2>

            <p className="mt-1 text-sm text-[#64748b]">
              Add a new user to SupportOps.
            </p>
          </div>

          <button
            type="button"
            onClick={closeModal}
            disabled={isSubmitting}
            className="rounded-lg p-2 text-[#64748b] transition hover:bg-[#f1f5f9] hover:text-[#0f172a] disabled:opacity-50"
          >
            <X size={20} />
          </button>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-5 p-6"
        >
          {/* NAME */}
          <div className="grid gap-4 sm:grid-cols-2">

            <div>
              <label className="mb-2 block text-sm font-semibold text-[#334155]">
                First name
              </label>

              <input
                {...register("firstName")}
                placeholder="John"
                className={`w-full rounded-lg border bg-white px-4 py-3 text-sm text-[#0f172a] outline-none transition ${
                  errors.firstName
                    ? "border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-100"
                    : "border-[#e2e8f0] focus:border-[#4648d4] focus:ring-4 focus:ring-[#4648d4]/10"
                }`}
              />

              {errors.firstName && (
                <p className="mt-2 text-sm text-red-600">
                  {
                    errors.firstName
                      .message
                  }
                </p>
              )}
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-[#334155]">
                Last name
              </label>

              <input
                {...register("lastName")}
                placeholder="Smith"
                className={`w-full rounded-lg border bg-white px-4 py-3 text-sm text-[#0f172a] outline-none transition ${
                  errors.lastName
                    ? "border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-100"
                    : "border-[#e2e8f0] focus:border-[#4648d4] focus:ring-4 focus:ring-[#4648d4]/10"
                }`}
              />

              {errors.lastName && (
                <p className="mt-2 text-sm text-red-600">
                  {
                    errors.lastName
                      .message
                  }
                </p>
              )}
            </div>

          </div>

          {/* EMAIL */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-[#334155]">
              Email
            </label>

            <input
              type="email"
              {...register("email")}
              placeholder="user@example.com"
              className={`w-full rounded-lg border bg-white px-4 py-3 text-sm text-[#0f172a] outline-none transition ${
                errors.email
                  ? "border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-100"
                  : "border-[#e2e8f0] focus:border-[#4648d4] focus:ring-4 focus:ring-[#4648d4]/10"
              }`}
            />

            {errors.email && (
              <p className="mt-2 text-sm text-red-600">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* PASSWORD */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-[#334155]">
              Password
            </label>

            <div className="relative">

              <input
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                {...register("password")}
                placeholder="Minimum 8 characters"
                className={`w-full rounded-lg border bg-white px-4 py-3 pr-12 text-sm text-[#0f172a] outline-none transition ${
                  errors.password
                    ? "border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-100"
                    : "border-[#e2e8f0] focus:border-[#4648d4] focus:ring-4 focus:ring-[#4648d4]/10"
                }`}
              />

              <button
                type="button"
                onClick={() =>
                  setShowPassword(
                    (current) => !current
                  )
                }
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#94a3b8] hover:text-[#475569]"
              >
                {showPassword ? (
                  <EyeOff size={18} />
                ) : (
                  <Eye size={18} />
                )}
              </button>

            </div>

            {errors.password && (
              <p className="mt-2 text-sm text-red-600">
                {
                  errors.password
                    .message
                }
              </p>
            )}
          </div>

          {/* ROLE */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-[#334155]">
              Role
            </label>

            <select
              {...register("role")}
              className="w-full rounded-lg border border-[#e2e8f0] bg-white px-4 py-3 text-sm text-[#0f172a] outline-none transition focus:border-[#4648d4] focus:ring-4 focus:ring-[#4648d4]/10"
            >
              <option value="User">
                User
              </option>

              <option value="Agent">
                Agent
              </option>

              <option value="Admin">
                Admin
              </option>
            </select>
          </div>

          {/* SERVER ERROR */}
          {serverError && (
            <div className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              <AlertCircle
                size={18}
                className="mt-0.5 shrink-0"
              />

              <span>
                {serverError}
              </span>
            </div>
          )}

          {/* ACTIONS */}
          <div className="flex justify-end gap-3 border-t border-[#e2e8f0] pt-5">

            <button
              type="button"
              onClick={closeModal}
              disabled={isSubmitting}
              className="rounded-lg border border-[#e2e8f0] px-5 py-2.5 text-sm font-semibold text-[#475569] transition hover:bg-[#f8fafc] disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 rounded-lg bg-[#4648d4] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#3d3fc2] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                  Creating...
                </>
              ) : (
                <>
                  <UserPlus size={17} />
                  Create User
                </>
              )}
            </button>

          </div>
        </form>

      </div>
    </div>
  );
}
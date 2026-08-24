import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Eye,
  EyeOff,
  Headset,
  LockKeyhole,
  Mail,
  ShieldCheck,
} from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";

import { apiClient } from "../api/apiClient";
import { useAuthStore } from "../store/authStore";
import type { LoginResponse } from "../types/auth";

const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required.")
    .email("Enter a valid email address."),

  password: z
    .string()
    .min(1, "Password is required."),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const navigate = useNavigate();

const setAuth = useAuthStore(
  (state) => state.setAuth
);
  const [showPassword, setShowPassword] =
    useState(false);

  const [serverError, setServerError] =
    useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: {
      errors,
      isSubmitting,
    },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (
    data: LoginFormData
  ) => {
    try {
      setServerError(null);

        const response =
          await apiClient.post<LoginResponse>(
            "/auth/login",
            data
          );

setAuth(
  response.data.accessToken,
  response.data.user
);

navigate("/", {
  replace: true,
});
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setServerError(
          error.response?.data?.message ??
            "Invalid email or password."
        );

        return;
      }

      setServerError(
        "Unable to connect to SupportOps."
      );
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9ff] lg:grid lg:grid-cols-2">

      {/* LEFT SIDE */}
      <section className="relative hidden overflow-hidden border-r border-[#e2e8f0] bg-[#eff4ff] lg:flex lg:flex-col">

        {/* Logo */}
        <div className="flex h-20 items-center px-10">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#4648d4] text-white">
              <Headset size={22} />
            </div>

            <span className="font-heading text-2xl font-semibold text-[#4648d4]">
              SupportOps
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-1 items-center px-16">
          <div className="max-w-xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#c7d2fe] bg-white px-4 py-2 text-sm font-medium text-[#4648d4]">
              <ShieldCheck size={16} />
              Modern IT Support Platform
            </div>

            <h1 className="font-heading text-5xl font-bold leading-[1.08] tracking-tight text-[#0f172a]">
              Support operations,
              <br />
              simplified.
            </h1>

            <p className="mt-6 max-w-lg text-lg leading-8 text-[#475569]">
              Manage support tickets, collaborate
              with your team, and resolve customer
              issues through one organized workspace.
            </p>

            <div className="mt-10 space-y-4">
              <Feature text="Role-based access for Users, Agents and Admins" />
              <Feature text="Complete ticket lifecycle management" />
              <Feature text="Ticket history, comments and internal notes" />
            </div>
          </div>
        </div>

        {/* Decorative shapes */}
        <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-[#dce9ff]" />

        <div className="absolute -bottom-12 right-36 h-48 w-48 rounded-full bg-[#e1e0ff]/70" />
      </section>

      {/* RIGHT SIDE */}
      <section className="flex min-h-screen items-center justify-center px-6 py-12 sm:px-10">

        <div className="w-full max-w-[440px]">

          {/* Mobile logo */}
          <div className="mb-10 flex items-center gap-3 lg:hidden">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#4648d4] text-white">
              <Headset size={22} />
            </div>

            <span className="font-heading text-2xl font-semibold text-[#4648d4]">
              SupportOps
            </span>
          </div>

          <div className="mb-8">
            <h2 className="font-heading text-[32px] font-semibold tracking-tight text-[#0f172a]">
              Welcome back
            </h2>

            <p className="mt-2 text-base text-[#64748b]">
              Sign in to your SupportOps account.
            </p>
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-5"
          >

            {/* EMAIL */}
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-semibold text-[#334155]"
              >
                Email address
              </label>

              <div className="relative">
                <Mail
                  size={19}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94a3b8]"
                />

                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  {...register("email")}
                  className={`w-full rounded-lg border bg-white py-3 pl-11 pr-4 text-[15px] text-[#0f172a] outline-none transition
                    ${
                      errors.email
                        ? "border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-100"
                        : "border-[#e2e8f0] focus:border-[#4648d4] focus:ring-4 focus:ring-[#4648d4]/10"
                    }
                  `}
                />
              </div>

              {errors.email && (
                <p className="mt-2 flex items-center gap-1.5 text-sm text-red-600">
                  <AlertCircle size={14} />
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* PASSWORD */}
            <div>
              <div className="mb-2 flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="text-sm font-semibold text-[#334155]"
                >
                  Password
                </label>
              </div>

              <div className="relative">
                <LockKeyhole
                  size={19}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94a3b8]"
                />

                <input
                  id="password"
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  {...register("password")}
                  className={`w-full rounded-lg border bg-white py-3 pl-11 pr-12 text-[15px] text-[#0f172a] outline-none transition
                    ${
                      errors.password
                        ? "border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-100"
                        : "border-[#e2e8f0] focus:border-[#4648d4] focus:ring-4 focus:ring-[#4648d4]/10"
                    }
                  `}
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(
                      (current) => !current
                    )
                  }
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#94a3b8] transition hover:text-[#475569]"
                  aria-label={
                    showPassword
                      ? "Hide password"
                      : "Show password"
                  }
                >
                  {showPassword ? (
                    <EyeOff size={19} />
                  ) : (
                    <Eye size={19} />
                  )}
                </button>
              </div>

              {errors.password && (
                <p className="mt-2 flex items-center gap-1.5 text-sm text-red-600">
                  <AlertCircle size={14} />
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* SERVER ERROR */}
            {serverError && (
              <div className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                <AlertCircle
                  size={18}
                  className="mt-0.5 shrink-0"
                />

                <span>{serverError}</span>
              </div>
            )}

            {/* SUBMIT */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="group flex w-full items-center justify-center gap-2 rounded-lg bg-[#4648d4] px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-[#3d3fc2] focus:outline-none focus:ring-4 focus:ring-[#4648d4]/20 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                  Signing in...
                </>
              ) : (
                <>
                  Sign in

                  <ArrowRight
                    size={18}
                    className="transition-transform group-hover:translate-x-1"
                  />
                </>
              )}
            </button>

          </form>

          <div className="mt-8 flex items-center justify-center gap-2 text-sm text-[#64748b]">
            <ShieldCheck size={15} />
            Secure authentication powered by SupportOps
          </div>

        </div>
      </section>
    </div>
  );
}

function Feature({
  text,
}: {
  text: string;
}) {
  return (
    <div className="flex items-center gap-3 text-[#334155]">
      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white text-[#4648d4] shadow-sm">
        <CheckCircle2 size={16} />
      </div>

      <span className="text-[15px]">
        {text}
      </span>
    </div>
  );
}
import axios from "axios";

import {
  CheckCircle2,
  KeyRound,
  LoaderCircle,
  Save,
  ShieldCheck,
  UserRound,
} from "lucide-react";

import {
  useEffect,
  useState,
} from "react";

import { apiClient } from "../api/apiClient";
import { useAuthStore } from "../store/authStore";

import type {
  UserRole,
} from "../types/auth";

interface ProfileResponse {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
}

interface UpdateProfileResponse {
  id: string;
  fullName: string;
  email: string;
  role: UserRole;
}

export default function ProfilePage() {
  const updateUser =
    useAuthStore(
      (state) => state.updateUser
    );

  const [profile, setProfile] =
    useState<ProfileResponse | null>(
      null
    );

  const [firstName, setFirstName] =
    useState("");

  const [lastName, setLastName] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [
    currentPassword,
    setCurrentPassword,
  ] = useState("");

  const [
    newPassword,
    setNewPassword,
  ] = useState("");

  const [
    confirmPassword,
    setConfirmPassword,
  ] = useState("");

  const [loading, setLoading] =
    useState(true);

  const [
    savingProfile,
    setSavingProfile,
  ] = useState(false);

  const [
    savingPassword,
    setSavingPassword,
  ] = useState(false);

  const [
    profileError,
    setProfileError,
  ] = useState<string | null>(
    null
  );

  const [
    profileSuccess,
    setProfileSuccess,
  ] = useState<string | null>(
    null
  );

  const [
    passwordError,
    setPasswordError,
  ] = useState<string | null>(
    null
  );

  const [
    passwordSuccess,
    setPasswordSuccess,
  ] = useState<string | null>(
    null
  );

  useEffect(() => {
    const loadProfile =
      async () => {
        try {
          setLoading(true);

          const response =
            await apiClient.get<
              ProfileResponse
            >("/profile");

          setProfile(
            response.data
          );

          setFirstName(
            response.data.firstName
          );

          setLastName(
            response.data.lastName
          );

          setEmail(
            response.data.email
          );
        } catch (error) {
          setProfileError(
            getApiErrorMessage(
              error,
              "Unable to load profile."
            )
          );
        } finally {
          setLoading(false);
        }
      };

    loadProfile();
  }, []);

  const handleProfileSubmit =
    async (
      event: React.FormEvent
    ) => {
      event.preventDefault();

      setProfileError(null);
      setProfileSuccess(null);

      if (
        !firstName.trim() ||
        !lastName.trim() ||
        !email.trim()
      ) {
        setProfileError(
          "First name, last name and email are required."
        );

        return;
      }

      try {
        setSavingProfile(true);

        const response =
          await apiClient.patch<
            UpdateProfileResponse
          >(
            "/profile",
            {
              firstName:
                firstName.trim(),

              lastName:
                lastName.trim(),

              email:
                email
                  .trim()
                  .toLowerCase(),
            }
          );

        const updated =
          response.data;

        updateUser({
          fullName:
            updated.fullName,

          email:
            updated.email,

          role:
            updated.role,
        });

        setProfile(
          (current) =>
            current
              ? {
                  ...current,

                  firstName:
                    firstName.trim(),

                  lastName:
                    lastName.trim(),

                  email:
                    updated.email,

                  role:
                    updated.role,
                }
              : current
        );

        setEmail(
          updated.email
        );

        setProfileSuccess(
          "Profile updated successfully."
        );
      } catch (error) {
        setProfileError(
          getApiErrorMessage(
            error,
            "Unable to update profile."
          )
        );
      } finally {
        setSavingProfile(false);
      }
    };

  const handlePasswordSubmit =
    async (
      event: React.FormEvent
    ) => {
      event.preventDefault();

      setPasswordError(null);
      setPasswordSuccess(null);

      if (
        !currentPassword ||
        !newPassword ||
        !confirmPassword
      ) {
        setPasswordError(
          "Complete all password fields."
        );

        return;
      }

      if (
        newPassword.length < 8
      ) {
        setPasswordError(
          "New password must contain at least 8 characters."
        );

        return;
      }

      if (
        newPassword !==
        confirmPassword
      ) {
        setPasswordError(
          "New password and confirmation do not match."
        );

        return;
      }

      if (
        currentPassword ===
        newPassword
      ) {
        setPasswordError(
          "New password must be different from the current password."
        );

        return;
      }

      try {
        setSavingPassword(true);

        await apiClient.patch(
          "/profile/password",
          {
            currentPassword,
            newPassword,
          }
        );

        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");

        setPasswordSuccess(
          "Password changed successfully."
        );
      } catch (error) {
        setPasswordError(
          getApiErrorMessage(
            error,
            "Unable to change password."
          )
        );
      } finally {
        setSavingPassword(false);
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

          Loading profile...

        </div>

      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-64px)] bg-[#f8f9ff] p-4 pb-24 md:p-6 md:pb-8">

      <div className="mx-auto max-w-[1100px] space-y-6">

        {/* HEADER */}
        <div className="flex items-center gap-4">

          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#e1e0ff] text-[#4648d4]">

            <UserRound size={24} />

          </div>

          <div>

            <h1 className="font-heading text-3xl font-semibold tracking-tight text-[#0f172a]">
              Profile
            </h1>

            <p className="mt-1 text-sm text-[#64748b]">
              Manage your personal information and security.
            </p>

          </div>

        </div>

        {/* PROFILE SUMMARY */}
        {profile && (
          <div className="flex flex-col gap-4 rounded-2xl border border-[#e2e8f0] bg-white p-6 shadow-[0_4px_12px_rgba(15,23,42,0.02)] sm:flex-row sm:items-center">

            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#4648d4] font-heading text-xl font-semibold text-white">

              {getInitials(
                profile.firstName,
                profile.lastName
              )}

            </div>

            <div>

              <h2 className="text-xl font-semibold text-[#0f172a]">

                {profile.firstName}{" "}
                {profile.lastName}

              </h2>

              <p className="mt-1 text-sm text-[#64748b]">
                {profile.email}
              </p>

              <span className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-[#e1e0ff] px-3 py-1 text-xs font-semibold text-[#4648d4]">

                <ShieldCheck
                  size={14}
                />

                {profile.role}

              </span>

            </div>

          </div>
        )}

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">

          {/* ACCOUNT INFORMATION */}
          <form
            onSubmit={
              handleProfileSubmit
            }
            className="overflow-hidden rounded-2xl border border-[#e2e8f0] bg-white shadow-[0_4px_12px_rgba(15,23,42,0.02)]"
          >

            <div className="border-b border-[#e2e8f0] px-6 py-5">

              <h2 className="text-xl font-semibold text-[#0f172a]">
                Account Information
              </h2>

              <p className="mt-1 text-sm text-[#64748b]">
                Update your personal information.
              </p>

            </div>

            <div className="space-y-5 p-6">

              {profileError && (
                <MessageBox
                  type="error"
                  message={
                    profileError
                  }
                />
              )}

              {profileSuccess && (
                <MessageBox
                  type="success"
                  message={
                    profileSuccess
                  }
                />
              )}

              <div className="grid gap-5 sm:grid-cols-2">

                <Field
                  label="First Name"
                  value={firstName}
                  onChange={
                    setFirstName
                  }
                />

                <Field
                  label="Last Name"
                  value={lastName}
                  onChange={
                    setLastName
                  }
                />

              </div>

              <div>

                <label className="mb-2 block text-sm font-medium text-[#334155]">
                  Email
                </label>

                <input
                  type="email"
                  value={email}
                  onChange={(
                    event
                  ) =>
                    setEmail(
                      event.target
                        .value
                    )
                  }
                  className="w-full rounded-lg border border-[#e2e8f0] bg-white px-4 py-3 text-sm text-[#0f172a] outline-none transition focus:border-[#4648d4] focus:ring-4 focus:ring-[#4648d4]/10"
                  required
                />

              </div>

              <div>

                <label className="mb-2 block text-sm font-medium text-[#334155]">
                  Role
                </label>

                <input
                  value={
                    profile?.role ??
                    ""
                  }
                  disabled
                  className="w-full cursor-not-allowed rounded-lg border border-[#e2e8f0] bg-[#f8fafc] px-4 py-3 text-sm text-[#64748b]"
                />

                <p className="mt-2 text-xs text-[#94a3b8]">
                  Your role cannot be changed from your profile.
                </p>

              </div>

              <div className="flex justify-end pt-2">

                <button
                  type="submit"
                  disabled={
                    savingProfile
                  }
                  className="flex items-center gap-2 rounded-lg bg-[#4648d4] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#3d3fbd] disabled:cursor-not-allowed disabled:opacity-60"
                >

                  {savingProfile ? (
                    <LoaderCircle
                      size={17}
                      className="animate-spin"
                    />
                  ) : (
                    <Save
                      size={17}
                    />
                  )}

                  {savingProfile
                    ? "Saving..."
                    : "Save Changes"}

                </button>

              </div>

            </div>

          </form>

          {/* SECURITY */}
          <form
            onSubmit={
              handlePasswordSubmit
            }
            className="overflow-hidden rounded-2xl border border-[#e2e8f0] bg-white shadow-[0_4px_12px_rgba(15,23,42,0.02)]"
          >

            <div className="border-b border-[#e2e8f0] px-6 py-5">

              <div className="flex items-center gap-2">

                <KeyRound
                  size={20}
                  className="text-[#4648d4]"
                />

                <h2 className="text-xl font-semibold text-[#0f172a]">
                  Security
                </h2>

              </div>

              <p className="mt-1 text-sm text-[#64748b]">
                Change your account password.
              </p>

            </div>

            <div className="space-y-5 p-6">

              {passwordError && (
                <MessageBox
                  type="error"
                  message={
                    passwordError
                  }
                />
              )}

              {passwordSuccess && (
                <MessageBox
                  type="success"
                  message={
                    passwordSuccess
                  }
                />
              )}

              <PasswordField
                label="Current Password"
                value={
                  currentPassword
                }
                onChange={
                  setCurrentPassword
                }
              />

              <PasswordField
                label="New Password"
                value={
                  newPassword
                }
                onChange={
                  setNewPassword
                }
              />

              <PasswordField
                label="Confirm New Password"
                value={
                  confirmPassword
                }
                onChange={
                  setConfirmPassword
                }
              />

              <p className="text-xs text-[#94a3b8]">
                Password must contain at least 8 characters.
              </p>

              <div className="flex justify-end pt-2">

                <button
                  type="submit"
                  disabled={
                    savingPassword
                  }
                  className="flex items-center gap-2 rounded-lg bg-[#0f172a] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#1e293b] disabled:cursor-not-allowed disabled:opacity-60"
                >

                  {savingPassword ? (
                    <LoaderCircle
                      size={17}
                      className="animate-spin"
                    />
                  ) : (
                    <KeyRound
                      size={17}
                    />
                  )}

                  {savingPassword
                    ? "Changing..."
                    : "Change Password"}

                </button>

              </div>

            </div>

          </form>

        </div>

      </div>

    </div>
  );
}

function Field({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (
    value: string
  ) => void;
}) {
  return (
    <div>

      <label className="mb-2 block text-sm font-medium text-[#334155]">
        {label}
      </label>

      <input
        value={value}
        onChange={(event) =>
          onChange(
            event.target.value
          )
        }
        className="w-full rounded-lg border border-[#e2e8f0] bg-white px-4 py-3 text-sm text-[#0f172a] outline-none transition focus:border-[#4648d4] focus:ring-4 focus:ring-[#4648d4]/10"
        required
      />

    </div>
  );
}

function PasswordField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (
    value: string
  ) => void;
}) {
  return (
    <div>

      <label className="mb-2 block text-sm font-medium text-[#334155]">
        {label}
      </label>

      <input
        type="password"
        value={value}
        onChange={(event) =>
          onChange(
            event.target.value
          )
        }
        autoComplete="new-password"
        className="w-full rounded-lg border border-[#e2e8f0] bg-white px-4 py-3 text-sm text-[#0f172a] outline-none transition focus:border-[#4648d4] focus:ring-4 focus:ring-[#4648d4]/10"
        required
      />

    </div>
  );
}

function MessageBox({
  type,
  message,
}: {
  type:
    | "success"
    | "error";
  message: string;
}) {
  const success =
    type === "success";

  return (
    <div
      className={`flex items-center gap-2 rounded-lg border p-3 text-sm ${
        success
          ? "border-green-200 bg-green-50 text-green-700"
          : "border-red-200 bg-red-50 text-red-700"
      }`}
    >

      {success && (
        <CheckCircle2
          size={17}
        />
      )}

      {message}

    </div>
  );
}

function getInitials(
  firstName: string,
  lastName: string
) {
  return `${firstName
    .charAt(0)}${lastName.charAt(
    0
  )}`.toUpperCase();
}

function getApiErrorMessage(
  error: unknown,
  fallback: string
) {
  if (
    axios.isAxiosError(error)
  ) {
    const message =
      error.response?.data
        ?.message;

    if (
      typeof message ===
      "string"
    ) {
      return message;
    }
  }

  return fallback;
}
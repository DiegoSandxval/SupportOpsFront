import {
  Plus,
  Search,
  ShieldCheck,
  UserCheck,
  Users,
  UserX,
} from "lucide-react";
import {
  useEffect,
  useMemo,
  useState,
} from "react";

import { apiClient } from "../api/apiClient";
import CreateUserModal from "../components/users/CreateUserModal";
import { useAuthStore } from "../store/authStore";

import type {
  UserListItem,
  UserRole,
} from "../types/user";

export default function UsersPage() {
  const [users, setUsers] =
    useState<UserListItem[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  const [search, setSearch] =
    useState("");

  const [roleFilter, setRoleFilter] =
    useState<"All" | UserRole>("All");

  const [statusFilter, setStatusFilter] =
    useState<
      "All" | "Active" | "Inactive"
    >("All");

  const [
    createModalOpen,
    setCreateModalOpen,
  ] = useState(false);

  const currentUser =
    useAuthStore(
      (state) => state.user
    );

  const isAdmin =
    currentUser?.role === "Admin";

  // LOAD USERS
  const loadUsers = async () => {
    try {
      setLoading(true);
      setError(null);

      const response =
        await apiClient.get<
          UserListItem[]
        >("/users");

      setUsers(response.data);
    } catch (error) {
      console.error(
        "Error loading users:",
        error
      );

      setError(
        "Unable to load users."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  // FILTER USERS
  const filteredUsers =
    useMemo(() => {
      const normalizedSearch =
        search
          .trim()
          .toLowerCase();

      return users.filter(
        (user) => {
          const matchesSearch =
            !normalizedSearch ||
            user.fullName
              .toLowerCase()
              .includes(
                normalizedSearch
              ) ||
            user.email
              .toLowerCase()
              .includes(
                normalizedSearch
              );

          const matchesRole =
            roleFilter === "All" ||
            user.role === roleFilter;

          const matchesStatus =
            statusFilter === "All" ||
            (statusFilter ===
              "Active" &&
              user.isActive) ||
            (statusFilter ===
              "Inactive" &&
              !user.isActive);

          return (
            matchesSearch &&
            matchesRole &&
            matchesStatus
          );
        }
      );
    }, [
      users,
      search,
      roleFilter,
      statusFilter,
    ]);

  // STATS
  const activeCount =
    users.filter(
      (user) =>
        user.isActive
    ).length;

  const agentCount =
    users.filter(
      (user) =>
        user.role === "Agent"
    ).length;

  const adminCount =
    users.filter(
      (user) =>
        user.role === "Admin"
    ).length;

  return (
    <div className="min-h-[calc(100vh-64px)] bg-[#f8f9ff] p-4 md:p-6">
      <div className="mx-auto max-w-[1400px]">

        {/* HEADER */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

          <div>
            <h1 className="font-heading text-3xl font-semibold tracking-tight text-[#0f172a]">
              Users
            </h1>

            <p className="mt-2 text-sm text-[#64748b]">
              View and manage SupportOps users.
            </p>
          </div>

          {isAdmin && (
            <button
              type="button"
              onClick={() =>
                setCreateModalOpen(
                  true
                )
              }
              className="flex items-center justify-center gap-2 rounded-lg bg-[#4648d4] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#3d3fc2]"
            >
              <Plus size={18} />

              Create User
            </button>
          )}

        </div>

        {/* STATS */}
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

          <StatCard
            icon={Users}
            label="Total Users"
            value={users.length}
          />

          <StatCard
            icon={UserCheck}
            label="Active Users"
            value={activeCount}
          />

          <StatCard
            icon={ShieldCheck}
            label="Agents"
            value={agentCount}
          />

          <StatCard
            icon={ShieldCheck}
            label="Admins"
            value={adminCount}
          />

        </div>

        {/* USERS TABLE */}
        <section className="rounded-2xl border border-[#e2e8f0] bg-white shadow-[0_4px_12px_rgba(15,23,42,0.02)]">

          {/* FILTERS */}
          <div className="border-b border-[#e2e8f0] p-5">

            <div className="flex flex-col gap-4 lg:flex-row">

              {/* SEARCH */}
              <div className="relative flex-1">

                <Search
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94a3b8]"
                />

                <input
                  type="text"
                  value={search}
                  onChange={(
                    event
                  ) =>
                    setSearch(
                      event.target
                        .value
                    )
                  }
                  placeholder="Search by name or email..."
                  className="w-full rounded-lg border border-[#e2e8f0] bg-white py-2.5 pl-10 pr-4 text-sm text-[#0f172a] outline-none transition focus:border-[#4648d4] focus:ring-4 focus:ring-[#4648d4]/10"
                />

              </div>

              {/* ROLE FILTER */}
              <select
                value={roleFilter}
                onChange={(
                  event
                ) =>
                  setRoleFilter(
                    event.target
                      .value as
                      | "All"
                      | UserRole
                  )
                }
                className="rounded-lg border border-[#e2e8f0] bg-white px-4 py-2.5 text-sm text-[#334155] outline-none transition focus:border-[#4648d4]"
              >
                <option value="All">
                  All Roles
                </option>

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

              {/* STATUS FILTER */}
              <select
                value={statusFilter}
                onChange={(
                  event
                ) =>
                  setStatusFilter(
                    event.target
                      .value as
                      | "All"
                      | "Active"
                      | "Inactive"
                  )
                }
                className="rounded-lg border border-[#e2e8f0] bg-white px-4 py-2.5 text-sm text-[#334155] outline-none transition focus:border-[#4648d4]"
              >
                <option value="All">
                  All Statuses
                </option>

                <option value="Active">
                  Active
                </option>

                <option value="Inactive">
                  Inactive
                </option>
              </select>

            </div>
          </div>

          {/* LOADING */}
          {loading ? (
            <div className="p-12 text-center text-sm text-[#64748b]">
              Loading users...
            </div>
          ) : error ? (

            /* ERROR */
            <div className="p-12 text-center text-sm text-red-600">
              {error}
            </div>

          ) : filteredUsers.length ===
            0 ? (

            /* EMPTY */
            <div className="p-12 text-center">

              <Users
                size={34}
                className="mx-auto text-[#cbd5e1]"
              />

              <p className="mt-3 font-medium text-[#334155]">
                No users found
              </p>

              <p className="mt-1 text-sm text-[#94a3b8]">
                Try changing the
                search or filters.
              </p>

            </div>

          ) : (

            /* TABLE */
            <div className="overflow-x-auto">

              <table className="w-full">

                <thead>
                  <tr className="border-b border-[#e2e8f0] bg-[#f8f9ff] text-left text-xs font-semibold uppercase tracking-wide text-[#94a3b8]">

                    <th className="px-6 py-4">
                      User
                    </th>

                    <th className="px-6 py-4">
                      Role
                    </th>

                    <th className="px-6 py-4">
                      Status
                    </th>

                    <th className="px-6 py-4">
                      ID
                    </th>

                  </tr>
                </thead>

                <tbody>
                  {filteredUsers.map(
                    (user) => (
                      <tr
                        key={user.id}
                        className="border-b border-[#eef2f7] last:border-0 transition hover:bg-[#f8f9ff]"
                      >

                        {/* USER */}
                        <td className="px-6 py-5">

                          <div className="flex items-center gap-3">

                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#e1e0ff] text-sm font-semibold text-[#4648d4]">
                              {getInitials(
                                user.fullName
                              )}
                            </div>

                            <div>

                              <p className="font-medium text-[#0f172a]">
                                {
                                  user.fullName
                                }
                              </p>

                              <p className="mt-0.5 text-sm text-[#64748b]">
                                {
                                  user.email
                                }
                              </p>

                            </div>

                          </div>

                        </td>

                        {/* ROLE */}
                        <td className="px-6 py-5">

                          <RoleBadge
                            role={
                              user.role
                            }
                          />

                        </td>

                        {/* STATUS */}
                        <td className="px-6 py-5">

                          <StatusBadge
                            isActive={
                              user.isActive
                            }
                          />

                        </td>

                        {/* ID */}
                        <td className="px-6 py-5">

                          <span className="font-mono text-xs text-[#94a3b8]">
                            {user.id
                              .slice(
                                0,
                                8
                              )
                              .toUpperCase()}
                          </span>

                        </td>

                      </tr>
                    )
                  )}
                </tbody>

              </table>

            </div>
          )}

          {/* FOOTER */}
          {!loading &&
            !error && (
              <div className="border-t border-[#e2e8f0] px-6 py-4 text-sm text-[#64748b]">

                Showing{" "}
                {
                  filteredUsers.length
                }{" "}
                of{" "}
                {users.length} users

              </div>
            )}

        </section>

      </div>

      {/* CREATE USER MODAL */}
      <CreateUserModal
        open={createModalOpen}
        onClose={() =>
          setCreateModalOpen(
            false
          )
        }
        onCreated={loadUsers}
      />

    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Users;
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-xl border border-[#e2e8f0] bg-white p-5 shadow-[0_4px_12px_rgba(15,23,42,0.02)]">

      <div className="flex items-center justify-between">

        <div>

          <p className="text-sm font-medium text-[#64748b]">
            {label}
          </p>

          <p className="mt-2 text-2xl font-semibold text-[#0f172a]">
            {value}
          </p>

        </div>

        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#e1e0ff] text-[#4648d4]">
          <Icon size={21} />
        </div>

      </div>

    </div>
  );
}

function RoleBadge({
  role,
}: {
  role: UserRole;
}) {
  const className =
    role === "Admin"
      ? "bg-purple-100 text-purple-700"
      : role === "Agent"
        ? "bg-blue-100 text-blue-700"
        : "bg-slate-100 text-slate-700";

  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${className}`}
    >
      {role}
    </span>
  );
}

function StatusBadge({
  isActive,
}: {
  isActive: boolean;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${
        isActive
          ? "bg-green-100 text-green-700"
          : "bg-red-100 text-red-700"
      }`}
    >

      {isActive ? (
        <UserCheck size={13} />
      ) : (
        <UserX size={13} />
      )}

      {isActive
        ? "Active"
        : "Inactive"}

    </span>
  );
}

function getInitials(
  fullName: string
) {
  return fullName
    .trim()
    .split(/\s+/)
    .map(
      (part) =>
        part[0]
    )
    .slice(0, 2)
    .join("")
    .toUpperCase();
}
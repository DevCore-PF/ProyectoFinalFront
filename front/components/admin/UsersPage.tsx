"use client";
import { useState, useEffect, useMemo } from "react";
import { useAdmin } from "@/context/AdminContext";
import {
  toastConfirm,
  toastError,
  toastSuccess,
} from "@/helpers/alerts.helper";
import { UsersDetailProps } from "@/types/admin.types";
import { UserRole } from "@/types/user.types";
import {
  HiSearch,
  HiFilter,
  HiEye,
  HiBan,
  HiCheckCircle,
  HiUserCircle,
  HiMail,
  HiCalendar,
  HiChevronDown,
  HiDownload,
} from "react-icons/hi";
import Loader from "../Loaders/Loader";
import { downloadUsers } from "@/helpers/adminHandlers";
import TinyLoader from "../Loaders/TinyLoader";

type UserRoleType = "all" | UserRole;
type UserStatus = "all" | "active" | "inactive";
type SortBy = "name" | "email" | "createdAt";
type SortOrder = "asc" | "desc";

const UsersPage = ({ onViewDetail }: UsersDetailProps) => {
  const {
    users,
    isLoadingUsers,
    isLoadingActive,
    isLoadingInactive,
    usersError,
    activeError,
    inactiveError,
    refreshUsers,
    fetchActiveUser,
    fetchInactiveUser,
    deactivateUser,
    activateUser,
  } = useAdmin();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState<UserRoleType>("all");
  const [selectedStatus, setSelectedStatus] = useState<UserStatus>("all");
  const [sortBy, setSortBy] = useState<SortBy>("createdAt");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [imageError, setImageError] = useState(false);
  const [loadingUserId, setLoadingUserId] = useState<string | null>(null);

  // Cargar usuarios cuando cambia el filtro de estado
  useEffect(() => {
    const loadUsers = async () => {
      switch (selectedStatus) {
        case "all":
          await refreshUsers();
          break;
        case "active":
          await fetchActiveUser();
          break;
        case "inactive":
          await fetchInactiveUser();
          break;
      }
    };
    loadUsers();
  }, [selectedStatus]);

  // Determinar el estado de carga según el filtro activo
  const isLoading =
    (selectedStatus === "all" && isLoadingUsers) ||
    (selectedStatus === "active" && isLoadingActive) ||
    (selectedStatus === "inactive" && isLoadingInactive);

  // Determinar el error según el filtro activo
  const currentError =
    (selectedStatus === "all" && usersError) ||
    (selectedStatus === "active" && activeError) ||
    (selectedStatus === "inactive" && inactiveError);

  //============[ FILTRADO Y ORDENAMIENTO ]=============
  const filteredAndSortedUsers = useMemo(() => {
    let filtered = users;

    // Buscar por nombre o email
    if (searchTerm) {
      filtered = filtered.filter(
        (user) =>
          user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtrar por rol
    if (selectedRole !== "all") {
      filtered = filtered.filter((user) => user.role === selectedRole);
    }

    // Ordenar
    const sorted = [...filtered].sort((a, b) => {
      let aValue: any = a[sortBy];
      let bValue: any = b[sortBy];

      if (sortBy === "name" || sortBy === "email") {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
      if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

    return sorted;
  }, [users, searchTerm, selectedRole, sortBy, sortOrder]);

  //============[ ESTADISTICAS ]=============
  const stats = useMemo(() => {
    return {
      total: users.length,
      students: users.filter((u) => u.role === "student").length,
      teachers: users.filter((u) => u.role === "teacher").length,
      admins: users.filter((u) => u.role === "admin").length,
      active: users.filter((u) => u.isActive).length,
      inactive: users.filter((u) => !u.isActive).length,
    };
  }, [users]);

  //============[ ESTILOS BADGE ROL ]=============
  const getRoleBadge = (role: string | null) => {
    const config = {
      student: "bg-blue-400/10 text-blue-300 border-blue-500/20",
      teacher: "bg-button/10 text-purple-300/90 border-button/20",
      admin: "bg-amber-500/10 text-amber-300 border-amber-500/20",
      null: "bg-gray-200/10 text-gray-100 border-gray-200/30",
    };
    if (role === null) {
      return config.null;
    }
    return config[role as keyof typeof config] || config.null;
  };

  //============[ ESTILOS BADGE STATUS ]=============
  const getStatusBadge = (isActive: boolean) => {
    return isActive
      ? "bg-emerald-500/10 text-emerald-300/90 border-emerald-500/20"
      : "bg-amber-500/10 text-amber-200 border-amber-500/20";
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  //============[ HANDLERS ]=============
  const handleSelectUser = (userId: string) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSelectAll = () => {
    if (selectedUsers.length === filteredAndSortedUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(filteredAndSortedUsers.map((u) => u.id));
    }
  };

  const handleBanUser = async (userId: string) => {
    toastConfirm(
      "Banear usuario",
      async () => {
        setLoadingUserId(userId);
        try {
          await deactivateUser(userId);
          toastSuccess("Usuario baneado");
        } catch (error) {
          console.log(error);
          throw error;
        } finally {
          setLoadingUserId(null);
        }
      },
      () => {}
    );
  };
  const handleActivateUser = async (userId: string) => {
    toastConfirm(
      "Activar usuario",
      async () => {
        setLoadingUserId(userId);
        try {
          await activateUser(userId);
          toastSuccess("Usuario reactivado");
        } catch (error) {
          console.log(error);
          throw error;
        } finally {
          setLoadingUserId(null);
        }
      },
      () => {}
    );
  };

  const [loadingGroupBan, setLoadingGroupBan] = useState(false);

  const deactivateMultipleUsers = async (userIds: string[]) => {
    const results = {
      success: [] as string[],
      errors: [] as { userId: string; error: string }[],
    };
    toastConfirm(
      "Banear seleccionados",
      async () => {
        setLoadingGroupBan(true);
        for (const userId of userIds) {
          try {
            await deactivateUser(userId);
            results.success.push(userId);
          } catch (error) {
            results.errors.push({
              userId,
              error:
                error instanceof Error ? error.message : "Error desconocido",
            });
          } finally {
            setLoadingGroupBan(false);
          }
        }
        toastSuccess("Usuarios baneados");
      },
      () => {}
    );
  };
  const [loadingGroupActivate, setLoadingGroupActivate] = useState(false);

  const activateMultipleUsers = async (userIds: string[]) => {
    const results = {
      success: [] as string[],
      errors: [] as { userId: string; error: string }[],
    };
    toastConfirm(
      "Activar seleccionados",
      async () => {
        setLoadingGroupActivate(true);
        for (const userId of userIds) {
          try {
            await activateUser(userId);
            results.success.push(userId);
          } catch (error) {
            results.errors.push({
              userId,
              error:
                error instanceof Error ? error.message : "Error desconocido",
            });
          } finally {
            setLoadingGroupActivate(false);
          }
        }
        toastSuccess("Usuarios Activados");
      },
      () => {}
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-font-light mb-2">
                Gestión de Usuarios
              </h1>
            </div>
            <button
              onClick={() => downloadUsers(users)}
              className="flex cursor-pointer items-center gap-2 bg-button/80 hover:bg-button/90 text-font-light px-4 py-2 rounded-lg font-medium transition-all"
            >
              <HiDownload className="w-5 h-5" />
              Exportar usuarios
            </button>
          </div>

          {/* ============[ STATS CARDS ]============= */}
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
            <div className="bg-background2/40 border border-slate-700/50 rounded-xl p-4">
              <p className="text-slate-400 text-xs mb-1">Total</p>
              <p className="text-2xl font-bold text-font-light">
                {stats.total}
              </p>
            </div>
            <div className="bg-background2/40 border border-slate-700/50 rounded-xl p-4">
              <p className="text-slate-400 text-xs mb-1">Alumnos</p>
              <p className="text-2xl font-bold text-blue-300">
                {stats.students}
              </p>
            </div>
            <div className="bg-background2/40 border border-slate-700/50 rounded-xl p-4">
              <p className="text-slate-400 text-xs mb-1">Profesores</p>
              <p className="text-2xl font-bold text-purple-300">
                {stats.teachers}
              </p>
            </div>
            <div className="bg-background2/40 border border-slate-700/50 rounded-xl p-4">
              <p className="text-slate-400 text-xs mb-1">Admins</p>
              <p className="text-2xl font-bold text-amber-300">
                {stats.admins}
              </p>
            </div>
            <div className="bg-background2/40 border border-slate-700/50 rounded-xl p-4">
              <p className="text-slate-400 text-xs mb-1">Activos</p>
              <p className="text-2xl font-bold text-emerald-300">
                {stats.active}
              </p>
            </div>
            <div className="bg-background2/40 border border-slate-700/50 rounded-xl p-4">
              <p className="text-slate-400 text-xs mb-1">Inactivos</p>
              <p className="text-2xl font-bold text-amber-400">
                {stats.inactive}
              </p>
            </div>
          </div>
        </div>

        {/* ============[ FILTERS AND SEARCH ]============= */}
        <div className="bg-background2/40 border border-slate-700/50 rounded-xl p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Buscar por nombre o email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-background border border-slate-700 rounded-lg pl-10 pr-4 py-2.5 text-font-light placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-button"
              />
            </div>

            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value as UserRoleType)}
              className="bg-background border border-slate-700 rounded-lg px-4 py-2.5 text-font-light focus:outline-none focus:ring-2 focus:ring-button cursor-pointer"
            >
              <option value="all">Todos los roles</option>
              <option value="student">Alumnos</option>
              <option value="teacher">Profesores</option>
              <option value="admin">Administradores</option>
            </select>

            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value as UserStatus)}
              className="bg-background border border-slate-700 rounded-lg px-4 py-2.5 text-font-light focus:outline-none focus:ring-2 focus:ring-button cursor-pointer"
            >
              <option value="all">Todos los estados</option>
              <option value="active">Activos</option>
              <option value="inactive">Inactivos</option>
            </select>

            {/* ============[ SORT ]============= */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex cursor-pointer items-center gap-2 bg-slate-700/50 hover:bg-slate-700 border border-slate-600 text-font-light px-4 py-2.5 rounded-lg font-medium transition-all"
            >
              <HiFilter className="w-5 h-5" />
              Ordenar
              <HiChevronDown
                className={`w-4 h-4 transition-transform ${
                  showFilters ? "rotate-180" : ""
                }`}
              />
            </button>
          </div>

          {/* ============[ ORDENAR POR ADVANCE FILTER ]============= */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-slate-700/50">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-slate-400 text-sm mb-2 block">
                    Ordenar por
                  </label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as SortBy)}
                    className="w-full bg-background border border-slate-700 rounded-lg px-4 py-2 text-font-light focus:outline-none focus:ring-2 focus:ring-button cursor-pointer"
                  >
                    <option value="name">Nombre</option>
                    <option value="email">Email</option>
                    <option value="createdAt">Fecha de registro</option>
                  </select>
                </div>
                <div>
                  <label className="text-slate-400 text-sm mb-2 block">
                    Orden
                  </label>
                  <select
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value as SortOrder)}
                    className="w-full bg-background border border-slate-700 rounded-lg px-4 py-2 text-font-light focus:outline-none focus:ring-2 focus:ring-button cursor-pointer"
                  >
                    <option value="asc">Ascendente</option>
                    <option value="desc">Descendente</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ============[ LOADING ]============= */}
        {isLoading && (
          <div className="flex justify-center items-center py-16">
            <Loader />
          </div>
        )}

        {/* ============[ ERROR ]============= */}
        {currentError && !isLoading && (
          <div className="bg-amber-500/10 border border-amber-500/20 text-amber-400 px-4 py-3 rounded-xl mb-6">
            {currentError}
          </div>
        )}

        {/* ============[ CONTENT ]============= */}
        {!isLoading && !currentError && (
          <>
            <div className="flex items-center justify-between mb-4">
              <p className="text-slate-400">
                Mostrando{" "}
                <span className="text-font-light font-semibold">
                  {filteredAndSortedUsers.length}
                </span>{" "}
                de{" "}
                <span className="text-font-light font-semibold">
                  {users.length}
                </span>{" "}
                usuarios
              </p>

              {selectedUsers.length > 0 && (
                <>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400 text-sm">
                      {selectedUsers.length} seleccionados
                    </span>
                    <button
                      onClick={() => deactivateMultipleUsers(selectedUsers)}
                      disabled={loadingGroupBan}
                      className="cursor-pointer bg-slate-700/50 hover:bg-slate-700/80 border border-amber-300/50 text-amber-200  px-3 py-1.5 rounded-lg text-sm font-medium transition-all disabled:opacity-80 disabled:cursor-not-allowed"
                    >
                      {loadingGroupBan ? (
                        <div className="flex gap-2">
                          <TinyLoader />
                          Banear seleccionados
                        </div>
                      ) : (
                        <>Banear seleccionados</>
                      )}
                    </button>

                    <button
                      onClick={() => activateMultipleUsers(selectedUsers)}
                      disabled={loadingGroupActivate}
                      className="cursor-pointer bg-slate-700/50 hover:bg-slate-700/80 border border-emerald-500 text-emerald-100 px-3 py-1.5 rounded-lg text-sm font-medium transition-all
                      disabled:opacity-80 disabled:cursor-not-allowed"
                    >
                      {loadingGroupActivate ? (
                        <div className="flex gap-2">
                          <TinyLoader />
                          Activar seleccionados
                        </div>
                      ) : (
                        <>Activar seleccionados</>
                      )}
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* ============[ USERS TABLE ]============= */}
            <div className="bg-background2/40 border border-slate-700/50 rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  {/* ============[ HEAD ]============= */}
                  <thead className="bg-slate-800/50 border-b border-slate-700/50">
                    <tr>
                      <th className="px-4 py-4 text-left w-12">
                        <label className="inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={
                              selectedUsers.length ===
                                filteredAndSortedUsers.length &&
                              filteredAndSortedUsers.length > 0
                            }
                            onChange={handleSelectAll}
                            className="sr-only"
                          />
                          <div
                            className={`w-5 h-5 border rounded-[5px] flex items-center justify-center transition-all ${
                              selectedUsers.length ===
                                filteredAndSortedUsers.length &&
                              filteredAndSortedUsers.length > 0
                                ? " border-font-light"
                                : "border-slate-600 bg-slate-700/50"
                            }`}
                          >
                            <svg
                              className={`w-3 h-3 text-font-light transition-opacity ${
                                selectedUsers.length ===
                                  filteredAndSortedUsers.length &&
                                filteredAndSortedUsers.length > 0
                                  ? "opacity-100"
                                  : "opacity-0"
                              }`}
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth="3"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                          </div>
                        </label>
                      </th>
                      <th className="px-4 py-4 text-left text-slate-400 text-sm font-semibold">
                        Usuario
                      </th>
                      <th className="px-4 py-4 text-left text-slate-400 text-sm font-semibold">
                        Rol
                      </th>
                      <th className="px-4 py-4 text-left text-slate-400 text-sm font-semibold">
                        Estado
                      </th>
                      <th className="px-4 py-4 text-left text-slate-400 text-sm font-semibold">
                        Registro
                      </th>
                      <th className="px-4 py-4 text-right text-slate-400 text-sm font-semibold">
                        Acciones
                      </th>
                    </tr>
                  </thead>

                  {/* ============[ BODY ]============= */}
                  <tbody className="divide-y divide-slate-700/50">
                    {filteredAndSortedUsers.map((user) => (
                      <tr
                        key={user.id}
                        className={`transition-colors hover:bg-slate-800/30 ${
                          !user.isActive
                            ? "bg-amber-300/10 hover:bg-amber-300/10! "
                            : ""
                        }`}
                      >
                        <td className="px-4 py-4">
                          <label className="inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={selectedUsers.includes(user.id)}
                              onChange={() => handleSelectUser(user.id)}
                              className="sr-only"
                            />
                            <div
                              className={`w-5 h-5 border rounded-[5px] flex items-center justify-center transition-all ${
                                selectedUsers.includes(user.id)
                                  ? " border-font-light"
                                  : "border-slate-600 bg-slate-700/50"
                              }`}
                            >
                              <svg
                                className={`w-3 h-3 text-font-light transition-opacity ${
                                  selectedUsers.includes(user.id)
                                    ? "opacity-100"
                                    : "opacity-0"
                                }`}
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth="3"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M5 13l4 4L19 7"
                                />
                              </svg>
                            </div>
                          </label>
                        </td>
                        <td className="py-4">
                          <div className="flex items-center gap-3">
                            <div className="relative">
                              {user.profileImage && !imageError ? (
                                <img
                                  src={user.profileImage}
                                  alt={user.name}
                                  onError={() => setImageError(true)}
                                  className="w-10 h-10 rounded-full object-cover border-2 border-button/60"
                                />
                              ) : (
                                <div className="w-10 h-10 rounded-full flex items-center justify-center text-font-light text-3xl font-bold border bg-gradient-to-br from-slate-600 to-slate-700 border-slate-600">
                                  {user.name.charAt(0).toUpperCase()}
                                </div>
                              )}
                              {!user.isActive && (
                                <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 border-2 border-background rounded-full flex items-center justify-center">
                                  <HiBan className="w-2.5 h-2.5 text-font-light" />
                                </div>
                              )}
                            </div>

                            <div>
                              <p className="font-medium text-font-light">
                                {user.name}
                              </p>
                              <p className="text-sm flex items-center gap-1 text-slate-400">
                                <HiMail className="w-3 h-3" />
                                {user.email}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <span
                            className={`px-3 py-1 rounded-lg text-xs font-medium border inline-flex items-center gap-1.5 ${getRoleBadge(
                              user.role
                            )}`}
                          >
                            {user.role === "teacher"
                              ? "Profesor"
                              : user.role === "student"
                              ? "Alumno"
                              : user.role === "admin"
                              ? "Admin"
                              : "Sin rol"}
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          <span
                            className={`px-3 py-1 rounded-lg text-xs font-medium border ${getStatusBadge(
                              user.isActive
                            )}`}
                          >
                            {user.isActive ? "Activo" : "Baneado"}
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          <div className="text-sm">
                            <p className="flex items-center gap-1 text-slate-300">
                              <HiCalendar className="w-3 h-3" />
                              {formatDate(user.createdAt)}
                            </p>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => onViewDetail("users", user.id)}
                              className="p-2 cursor-pointer bg-slate-700/50 hover:bg-slate-700 border border-button/50 text-accent-medium rounded-lg transition-all"
                              title="Ver perfil"
                            >
                              <HiEye className="w-4 h-4" />
                            </button>
                            {user.isActive ? (
                              <button
                                onClick={() => handleBanUser(user.id)}
                                disabled={loadingUserId === user.id}
                                className="p-2 cursor-pointer bg-slate-700/50 hover:bg-slate-700/90 border border-amber-300/50 text-amber-300 rounded-lg transition-all"
                                title="Banear usuario"
                              >
                                {loadingUserId === user.id ? (
                                  <TinyLoader />
                                ) : (
                                  <HiBan className="w-4 h-4" />
                                )}
                              </button>
                            ) : (
                              <button
                                onClick={() => handleActivateUser(user.id)}
                                disabled={loadingUserId === user.id}
                                className="p-2 cursor-pointer bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 text-emerald-400/80 rounded-lg transition-all"
                                title="Activar usuario"
                              >
                                {loadingUserId === user.id ? (
                                  <TinyLoader />
                                ) : (
                                  <HiCheckCircle className="w-4 h-4" />
                                )}
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* ============[ NO HAY USERS ]============= */}
              {filteredAndSortedUsers.length === 0 && (
                <div className="text-center py-16">
                  <HiUserCircle className="w-16 h-16 mx-auto text-slate-600 mb-4" />
                  <p className="text-slate-400 text-lg font-medium mb-2">
                    No se encontraron usuarios
                  </p>
                  <p className="text-slate-500 text-sm">
                    Intenta ajustar los filtros de búsqueda
                  </p>
                </div>
              )}
            </div>

            {/* Pagination */}
            {filteredAndSortedUsers.length > 0 && (
              <div className="mt-6 flex items-center justify-between">
                <p className="text-slate-400 text-sm">Página 1 de 1</p>
                <div className="flex gap-2">
                  <button className="cursor-pointer px-4 py-2 bg-slate-700/50 border border-slate-600 text-slate-400 rounded-lg font-medium opacity-50 cursor-not-allowed">
                    Anterior
                  </button>
                  <button className="cursor-pointer px-4 py-2 bg-button/80 text-font-light rounded-lg font-medium">
                    1
                  </button>
                  <button className="cursor-pointer px-4 py-2 bg-slate-700/50 border border-slate-600 text-slate-400 rounded-lg font-medium opacity-50 cursor-not-allowed">
                    Siguiente
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default UsersPage;

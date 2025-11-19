"use client";
import { useState, useEffect, useMemo } from "react";
import { useAdmin } from "@/context/AdminContext";
import { toastConfirm, toastError, toastSuccess } from "@/helpers/alerts.helper";
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
import { downloadUsers } from "@/helpers/adminHandlers";
import { useAuth } from "@/context/UserContext";
import Loader from "@/components/Loaders/Loader";
import TinyLoader from "@/components/Loaders/TinyLoader";
import BanReasonModal from "./BanReasonModal";

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
  const [loadingGroupBan, setLoadingGroupBan] = useState(false);
  const [loadingGroupActivate, setLoadingGroupActivate] = useState(false);
  const [showBanModal, setShowBanModal] = useState(false);
  const [banReason, setBanReason] = useState("");
  const [userToBan, setUserToBan] = useState<string | null>(null);
  const [showGroupBanModal, setShowGroupBanModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const { user: contextUser } = useAuth();

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

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedRole]);

  useEffect(() => {
    setCurrentPage(1);
  }, [sortBy, sortOrder]);

  const isLoading =
    (selectedStatus === "all" && isLoadingUsers) ||
    (selectedStatus === "active" && isLoadingActive) ||
    (selectedStatus === "inactive" && isLoadingInactive);

  const currentError =
    (selectedStatus === "all" && usersError) ||
    (selectedStatus === "active" && activeError) ||
    (selectedStatus === "inactive" && inactiveError);

  const filteredAndSortedUsers = useMemo(() => {
    let filtered = users;

    if (searchTerm) {
      filtered = filtered.filter(
        (user) =>
          user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedRole !== "all") {
      filtered = filtered.filter((user) => user.role === selectedRole);
    }

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

  const totalPages = useMemo(() => {
    return Math.ceil(filteredAndSortedUsers.length / itemsPerPage);
  }, [filteredAndSortedUsers.length, itemsPerPage]);

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

  const paginatedUsers = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredAndSortedUsers.slice(startIndex, endIndex);
  }, [filteredAndSortedUsers, currentPage, itemsPerPage]);

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

  const handleSelectUser = (userId: string) => {
    setSelectedUsers((prev) =>
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
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
    setUserToBan(userId);
    setShowBanModal(true);
  };

  const handleGroupBan = () => {
    setShowGroupBanModal(true);
  };

  const handleActivateUser = async (userId: string) => {
    toastConfirm(
      "Reactivar usuario",
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
              error: error instanceof Error ? error.message : "Error desconocido",
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

  const confirmBan = () => {
    if (!banReason.trim()) {
      toastError("Debes proporcionar un motivo para el baneo");
      return;
    }
    if (banReason.trim().length < 10) {
      toastError("El motivo debe tener al menos 10 caracteres");
      return;
    }
    if (!userToBan) return;

    setShowBanModal(false);

    toastConfirm(
      "Banear usuario",
      async () => {
        setLoadingUserId(userToBan);
        try {
          await deactivateUser(userToBan, banReason);
          toastSuccess("Usuario baneado");
          setBanReason("");
          setUserToBan(null);
        } catch (error) {
          console.log(error);
          throw error;
        } finally {
          setLoadingUserId(null);
        }
      },
      () => {
        setBanReason("");
        setUserToBan(null);
      }
    );
  };

  const confirmGroupBan = () => {
    if (!banReason.trim()) {
      toastError("Debes proporcionar un motivo para el baneo");
      return;
    }

    setShowGroupBanModal(false);

    toastConfirm(
      "Banear seleccionados",
      async () => {
        setLoadingGroupBan(true);
        const results = {
          success: [] as string[],
          errors: [] as { userId: string; error: string }[],
        };

        for (const userId of selectedUsers) {
          try {
            await deactivateUser(userId, banReason);
            results.success.push(userId);
          } catch (error) {
            results.errors.push({
              userId,
              error: error instanceof Error ? error.message : "Error desconocido",
            });
          }
        }

        toastSuccess(`${results.success.length} usuarios baneados`);
        setBanReason("");
        setLoadingGroupBan(false);
      },
      () => {
        setBanReason("");
      }
    );
  };

  const goToNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const goToPrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const goToPage = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 sm:mb-8">
          {/* ============[ HEADER   ]============= */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-font-light mb-1 sm:mb-2">
                Gestión de Usuarios
              </h1>
            </div>
            <button
              onClick={() => downloadUsers(users)}
              className="flex cursor-pointer items-center justify-center sm:justify-start gap-1.5 sm:gap-2 bg-button/80 hover:bg-button/90 text-font-light px-3 sm:px-4 py-2 rounded-lg font-medium transition-all text-sm sm:text-base"
            >
              <HiDownload className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="hidden sm:inline">Exportar usuarios</span>
              <span className="sm:hidden">Exportar</span>
            </button>
          </div>

          {/* ============[ STATS CARDS   ]============= */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
            <div className="bg-background2/40 border border-slate-700/50 rounded-xl p-3 sm:p-4">
              <p className="text-slate-400 text-xs mb-1">Total</p>
              <p className="text-xl sm:text-2xl font-bold text-font-light">{stats.total}</p>
            </div>
            <div className="bg-background2/40 border border-slate-700/50 rounded-xl p-3 sm:p-4">
              <p className="text-slate-400 text-xs mb-1">Alumnos</p>
              <p className="text-xl sm:text-2xl font-bold text-blue-300">{stats.students}</p>
            </div>
            <div className="bg-background2/40 border border-slate-700/50 rounded-xl p-3 sm:p-4">
              <p className="text-slate-400 text-xs mb-1">Profesores</p>
              <p className="text-xl sm:text-2xl font-bold text-purple-300">{stats.teachers}</p>
            </div>
            <div className="bg-background2/40 border border-slate-700/50 rounded-xl p-3 sm:p-4">
              <p className="text-slate-400 text-xs mb-1">Admins</p>
              <p className="text-xl sm:text-2xl font-bold text-amber-300">{stats.admins}</p>
            </div>
            <div className="bg-background2/40 border border-slate-700/50 rounded-xl p-3 sm:p-4">
              <p className="text-slate-400 text-xs mb-1">Activos</p>
              <p className="text-xl sm:text-2xl font-bold text-emerald-300">{stats.active}</p>
            </div>
            <div className="bg-background2/40 border border-slate-700/50 rounded-xl p-3 sm:p-4">
              <p className="text-slate-400 text-xs mb-1">Inactivos</p>
              <p className="text-xl sm:text-2xl font-bold text-amber-400">{stats.inactive}</p>
            </div>
          </div>
        </div>

        {/* ============[ FILTERS   ]============= */}
        <div className="bg-background2/40 border border-slate-700/50 rounded-xl p-3 sm:p-4 mb-4 sm:mb-6">
          <div className="flex flex-col gap-3 sm:gap-4">
            {/* Búsqueda */}
            <div className="flex-1 relative">
              <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 sm:w-5 sm:h-5" />
              <input
                type="text"
                placeholder="Buscar por nombre o email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-background border border-slate-700 rounded-lg pl-9 sm:pl-10 pr-4 py-2 sm:py-2.5 text-sm sm:text-base text-font-light placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-button"
              />
            </div>

            {/* Filtros en grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3">
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value as UserRoleType)}
                className="bg-background border border-slate-700 rounded-lg px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base text-font-light focus:outline-none focus:ring-2 focus:ring-button cursor-pointer"
              >
                <option value="all">Todos los roles</option>
                <option value="student">Alumnos</option>
                <option value="teacher">Profesores</option>
                <option value="admin">Administradores</option>
              </select>

              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value as UserStatus)}
                className="bg-background border border-slate-700 rounded-lg px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base text-font-light focus:outline-none focus:ring-2 focus:ring-button cursor-pointer"
              >
                <option value="all">Todos los estados</option>
                <option value="active">Activos</option>
                <option value="inactive">Inactivos</option>
              </select>

              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex cursor-pointer items-center justify-center gap-2 bg-slate-700/50 hover:bg-slate-700 border border-slate-600 text-font-light px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg font-medium transition-all text-sm sm:text-base"
              >
                <HiFilter className="w-4 h-4 sm:w-5 sm:h-5" />
                Ordenar
                <HiChevronDown
                  className={`w-3 h-3 sm:w-4 sm:h-4 transition-transform ${showFilters ? "rotate-180" : ""}`}
                />
              </button>
            </div>
          </div>

          {/* ============[ ADVANCED FILTERS ]============= */}
          {showFilters && (
            <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-slate-700/50">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="text-slate-400 text-xs sm:text-sm mb-2 block">Ordenar por</label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as SortBy)}
                    className="w-full bg-background border border-slate-700 rounded-lg px-3 sm:px-4 py-2 text-sm sm:text-base text-font-light focus:outline-none focus:ring-2 focus:ring-button cursor-pointer"
                  >
                    <option value="name">Nombre</option>
                    <option value="email">Email</option>
                    <option value="createdAt">Fecha de registro</option>
                  </select>
                </div>
                <div>
                  <label className="text-slate-400 text-xs sm:text-sm mb-2 block">Orden</label>
                  <select
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value as SortOrder)}
                    className="w-full bg-background border border-slate-700 rounded-lg px-3 sm:px-4 py-2 text-sm sm:text-base text-font-light focus:outline-none focus:ring-2 focus:ring-button cursor-pointer"
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
          <div className="flex flex-col justify-center items-center py-12 sm:py-16">
            <Loader size="medium" />
            <p className="text-slate-400 text-sm sm:text-base mt-2">Cargando usuarios...</p>
          </div>
        )}

        {/* ============[ ERROR ]============= */}
        {currentError && !isLoading && (
          <div className="bg-amber-500/10 border border-amber-500/20 text-amber-400 px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl mb-4 sm:mb-6 text-sm sm:text-base">
            {currentError}
          </div>
        )}

        {/* ============[ CONTENT ]============= */}
        {!isLoading && !currentError && (
          <>
            {/* Acciones de selección múltiple */}
            {selectedUsers.length > 0 && (
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 mb-4">
                <span className="text-slate-400 text-xs sm:text-sm">
                  {selectedUsers.length} seleccionados
                </span>
                <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                  <button
                    onClick={handleGroupBan}
                    disabled={loadingGroupBan}
                    className="cursor-pointer bg-slate-700/50 hover:bg-slate-700/80 border border-amber-300/50 text-amber-200 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all disabled:opacity-80 disabled:cursor-not-allowed"
                  >
                    {loadingGroupBan ? (
                      <div className="flex gap-1.5 sm:gap-2">
                        <TinyLoader />
                        <span className="hidden sm:inline">Baneando...</span>
                        <span className="sm:hidden">...</span>
                      </div>
                    ) : (
                      <>
                        <span className="hidden sm:inline">Banear seleccionados</span>
                        <span className="sm:hidden">Banear</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => activateMultipleUsers(selectedUsers)}
                    disabled={loadingGroupActivate}
                    className="cursor-pointer bg-slate-700/50 hover:bg-slate-700/80 border border-emerald-500 text-emerald-100 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all disabled:opacity-80 disabled:cursor-not-allowed"
                  >
                    {loadingGroupActivate ? (
                      <div className="flex gap-1.5 sm:gap-2">
                        <TinyLoader />
                        <span className="hidden sm:inline">Activando...</span>
                        <span className="sm:hidden">...</span>
                      </div>
                    ) : (
                      <>
                        <span className="hidden sm:inline">Activar seleccionados</span>
                        <span className="sm:hidden">Activar</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* ============[ USERS TABLE ]============= */}
            <div className="bg-background2/40 border border-slate-700/50 rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-800/50 border-b border-slate-700/50">
                    <tr>
                      <th className="px-3 sm:px-4 py-3 sm:py-4 text-left w-12">
                        <label className="inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={
                              selectedUsers.length === filteredAndSortedUsers.length &&
                              filteredAndSortedUsers.length > 0
                            }
                            onChange={handleSelectAll}
                            className="sr-only"
                          />
                          <div
                            className={`w-4 h-4 sm:w-5 sm:h-5 border rounded-[5px] flex items-center justify-center transition-all ${
                              selectedUsers.length === filteredAndSortedUsers.length &&
                              filteredAndSortedUsers.length > 0
                                ? "border-font-light"
                                : "border-slate-600 bg-slate-700/50"
                            }`}
                          >
                            <svg
                              className={`w-2.5 h-2.5 sm:w-3 sm:h-3 text-font-light transition-opacity ${
                                selectedUsers.length === filteredAndSortedUsers.length &&
                                filteredAndSortedUsers.length > 0
                                  ? "opacity-100"
                                  : "opacity-0"
                              }`}
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth="3"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                        </label>
                      </th>
                      <th className="px-3 sm:px-4 py-3 sm:py-4 text-left text-slate-400 text-xs sm:text-sm font-semibold min-w-[200px]">
                        Usuario
                      </th>
                      <th className="px-3 sm:px-4 py-3 sm:py-4 text-left text-slate-400 text-xs sm:text-sm font-semibold min-w-[100px]">
                        Rol
                      </th>
                      <th className="px-3 sm:px-4 py-3 sm:py-4 text-left text-slate-400 text-xs sm:text-sm font-semibold min-w-[90px]">
                        Estado
                      </th>
                      <th className="px-3 sm:px-4 py-3 sm:py-4 text-left text-slate-400 text-xs sm:text-sm font-semibold min-w-[110px]">
                        Registro
                      </th>
                      <th className="px-3 sm:px-4 py-3 sm:py-4 text-right text-slate-400 text-xs sm:text-sm font-semibold min-w-[100px]">
                        Acciones
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-700/50">
                    {paginatedUsers.map((user) => (
                      <tr
                        key={user.id}
                        className={`transition-colors hover:bg-slate-800/30 ${
                          !user.isActive ? "bg-amber-300/10 hover:bg-amber-300/10! " : ""
                        }`}
                      >
                        <td className="px-3 sm:px-4 py-3 sm:py-4">
                          <label className="inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={selectedUsers.includes(user.id)}
                              onChange={() => handleSelectUser(user.id)}
                              className="sr-only"
                            />
                            <div
                              className={`w-4 h-4 sm:w-5 sm:h-5 border rounded-[5px] flex items-center justify-center transition-all ${
                                selectedUsers.includes(user.id)
                                  ? "border-font-light"
                                  : "border-slate-600 bg-slate-700/50"
                              }`}
                            >
                              <svg
                                className={`w-2.5 h-2.5 sm:w-3 sm:h-3 text-font-light transition-opacity ${
                                  selectedUsers.includes(user.id) ? "opacity-100" : "opacity-0"
                                }`}
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth="3"
                              >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                              </svg>
                            </div>
                          </label>
                        </td>
                        <td className="px-3 sm:px-4 py-3 sm:py-4">
                          <div className="flex items-center gap-2 sm:gap-3">
                            <div className="relative shrink-0">
                              {user.profileImage && !imageError ? (
                                <img
                                  src={user.profileImage}
                                  alt={user.name}
                                  onError={() => setImageError(true)}
                                  className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover border-2 border-button/60"
                                />
                              ) : (
                                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-font-light text-lg sm:text-3xl font-bold border bg-gradient-to-br from-slate-600 to-slate-700 border-slate-600">
                                  {user.name.charAt(0).toUpperCase()}
                                </div>
                              )}
                              {!user.isActive && (
                                <div className="absolute -top-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 bg-amber-500 border-2 border-background rounded-full flex items-center justify-center">
                                  <HiBan className="w-2 h-2 sm:w-2.5 sm:h-2.5 text-font-light" />
                                </div>
                              )}
                            </div>

                            <div className="min-w-0">
                              <p className="font-medium text-font-light text-sm sm:text-base truncate">
                                {user.name}
                              </p>
                              <p className="text-xs sm:text-sm flex items-center gap-1 text-slate-400 truncate">
                                <HiMail className="w-3 h-3 shrink-0" />
                                <span className="truncate">{user.email}</span>
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-3 sm:px-4 py-3 sm:py-4">
                          <span
                            className={`px-2 sm:px-3 py-1 rounded-lg text-xs font-medium border inline-flex items-center gap-1 sm:gap-1.5 ${getRoleBadge(
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
                        <td className="px-3 sm:px-4 py-3 sm:py-4">
                          <span
                            className={`px-2 sm:px-3 py-1 rounded-lg text-xs font-medium border ${getStatusBadge(
                              user.isActive
                            )}`}
                          >
                            {user.isActive ? "Activo" : "Baneado"}
                          </span>
                        </td>
                        <td className="px-3 sm:px-4 py-3 sm:py-4">
                          <div className="text-xs sm:text-sm">
                            <p className="flex items-center gap-1 text-slate-300">
                              <HiCalendar className="w-3 h-3 shrink-0" />
                              <span className="truncate">{formatDate(user.createdAt)}</span>
                            </p>
                          </div>
                        </td>
                        <td className="px-3 sm:px-4 py-3 sm:py-4">
                          <div className="flex items-center justify-end gap-1 sm:gap-2">
                            <button
                              onClick={() => onViewDetail("users", user.id)}
                              className="p-1.5 sm:p-2 cursor-pointer bg-slate-700/50 hover:bg-slate-700 border border-button/50 text-accent-medium rounded-lg transition-all"
                              title="Ver perfil"
                            >
                              <HiEye className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                            </button>
                            {user.id === contextUser?.id ? null : user.isActive ? (
                              <button
                                onClick={() => handleBanUser(user.id)}
                                disabled={loadingUserId === user.id}
                                className="p-1.5 sm:p-2 cursor-pointer bg-slate-700/50 hover:bg-slate-700/90 border border-amber-300/50 text-amber-300 rounded-lg transition-all"
                                title="Banear usuario"
                              >
                                {loadingUserId === user.id ? (
                                  <TinyLoader />
                                ) : (
                                  <HiBan className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                )}
                              </button>
                            ) : (
                              <button
                                onClick={() => handleActivateUser(user.id)}
                                disabled={loadingUserId === user.id}
                                className="p-1.5 sm:p-2 cursor-pointer bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 text-emerald-400/80 rounded-lg transition-all"
                                title="Activar usuario"
                              >
                                {loadingUserId === user.id ? (
                                  <TinyLoader />
                                ) : (
                                  <HiCheckCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
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
              {paginatedUsers.length === 0 && (
                <div className="text-center py-12 sm:py-16">
                  <HiUserCircle className="w-12 h-12 sm:w-16 sm:h-16 mx-auto text-slate-600 mb-4" />
                  <p className="text-slate-400 text-base sm:text-lg font-medium mb-2">
                    No se encontraron usuarios
                  </p>
                  <p className="text-slate-500 text-sm">Intenta ajustar los filtros de búsqueda</p>
                </div>
              )}
            </div>

            {/* ============[ PAGINATION   ]============= */}
            {paginatedUsers.length > 0 && (
              <div className="mt-4 sm:mt-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
                  <p className="text-slate-400 text-xs sm:text-sm text-center sm:text-left">
                    Página {currentPage} de {totalPages}
                  </p>

                  <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2">
                    <button
                      onClick={goToPrevPage}
                      disabled={currentPage === 1}
                      className={`cursor-pointer px-2.5 sm:px-4 py-1.5 sm:py-2 bg-slate-700/50 border border-slate-600 rounded-lg font-medium transition-all text-xs sm:text-sm ${
                        currentPage === 1
                          ? "text-slate-400 opacity-50 cursor-not-allowed"
                          : "text-font-light hover:bg-slate-700"
                      }`}
                    >
                      Anterior
                    </button>

                    {Array.from({ length: totalPages }, (_, i) => i + 1)
                      .filter((pageNum) => {
                        if (typeof window !== "undefined" && window.innerWidth < 640) {
                          return (
                            Math.abs(pageNum - currentPage) <= 1 || pageNum === 1 || pageNum === totalPages
                          );
                        }
                        return true;
                      })
                      .map((pageNum, index, array) => {
                        const prevNum = array[index - 1];
                        const showDots = prevNum && pageNum - prevNum > 1;

                        return (
                          <div key={pageNum} className="flex items-center gap-1.5 sm:gap-2">
                            {showDots && <span className="text-slate-400 px-1">...</span>}
                            <button
                              onClick={() => goToPage(pageNum)}
                              className={`cursor-pointer px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-lg font-medium transition-all text-xs sm:text-sm ${
                                currentPage === pageNum
                                  ? "bg-button/80 text-font-light"
                                  : "bg-slate-700/50 border border-slate-600 text-slate-400 hover:bg-slate-700"
                              }`}
                            >
                              {pageNum}
                            </button>
                          </div>
                        );
                      })}

                    <button
                      onClick={goToNextPage}
                      disabled={currentPage === totalPages}
                      className={`cursor-pointer px-2.5 sm:px-4 py-1.5 sm:py-2 bg-slate-700/50 border border-slate-600 rounded-lg font-medium transition-all text-xs sm:text-sm ${
                        currentPage === totalPages
                          ? "text-slate-400 opacity-50 cursor-not-allowed"
                          : "text-font-light hover:bg-slate-700"
                      }`}
                    >
                      Siguiente
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {showBanModal && (
        <BanReasonModal
          banReason={banReason}
          setBanReason={setBanReason}
          onCancel={() => {
            setShowBanModal(false);
            setBanReason("");
            setUserToBan(null);
          }}
          onConfirm={confirmBan}
        />
      )}
      {showGroupBanModal && (
        <BanReasonModal
          banReason={banReason}
          setBanReason={setBanReason}
          onCancel={() => {
            setShowGroupBanModal(false);
            setBanReason("");
          }}
          onConfirm={confirmGroupBan}
          isMultiple={true}
          userCount={selectedUsers.length}
        />
      )}
    </div>
  );
};

export default UsersPage;

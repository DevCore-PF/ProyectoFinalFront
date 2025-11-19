// context/AdminContext.tsx
"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import {
  activateDeactivateCourseService,
  activateUserService,
  approveCourseService,
  approveProfileService,
  changeVisivilityService,
  deactivateUserService,
  getActiveUsersService,
  getAllCoursesAdminService,
  getAllPaidBatchesService,
  getAllPendingBatchesService,
  getAllPendingSummaryService,
  getAllProfessorProfilesService,
  getAllUsersService,
  getCourseFeedbackService,
  getInactiveUsersService,
  getUserByIdService,
  rejectCourseService,
  rejectProfileService,
} from "@/services/admin.service";
import { User } from "@/types/user.types";
import { Course, CourseVisibility } from "@/types/course.types";
import {
  CourseReview,
  GetAllCoursesAdminParams,
  PayoutBatch,
  PendingSummary,
  ProfessorProfileAdmin,
} from "@/types/admin.types";
import { useAuth } from "./UserContext";
import { getCourseByIdService } from "@/services/course.services";

interface AdminContextType {
  // Data
  users: User[];
  courses: Course[];
  feedbacks: CourseReview[];
  professorProfiles: ProfessorProfileAdmin[];
  pendingBatches: PayoutBatch[];
  paidBatches: PayoutBatch[];
  pendingSummary: PendingSummary[];

  // Loading states
  isLoadingUsers: boolean;
  isLoadingCourses: boolean;
  isLoadingProfiles: boolean;
  isLoadingInactive: boolean;
  isLoadingActive: boolean;
  isLoadingFeedbacks: boolean;
  isInitialLoading: boolean;
  isLoadingPendingBatches: boolean;
  isLoadingPaidBatches: boolean;
  isLoadingPendingSummary: boolean;

  // Errors
  usersError: string | null;
  coursesError: string | null;
  profileError: string | null;
  activeError: string | null;
  inactiveError: string | null;
  feedbacksError: string | null;

  // Actions
  refreshUsers: () => Promise<void>;
  refreshCourses: (filters?: GetAllCoursesAdminParams) => Promise<void>;
  refreshProfiles: () => Promise<void>;
  refreshAll: () => Promise<void>;
  silentRefreshCourses: () => Promise<void>;
  silentRefreshProfiles: () => Promise<void>;
  fetchUserById: (id: string) => Promise<User>;
  fetchActiveUser: () => Promise<User[]>;
  fetchInactiveUser: () => Promise<User[]>;
  fetchCourseById: (userId: string) => Promise<Course | undefined>;
  fetchProfessorProfiles: () => Promise<ProfessorProfileAdmin[]>;
  activateDeactivateCourse: (CourseId: string) => Promise<void>;
  fetchFeedback: (courseId: string) => Promise<CourseReview[] | undefined>;
  fetchPendingBatches: () => Promise<void>;
  fetchPaidBatches: () => Promise<void>;
  fetchPendingSummary: () => Promise<void>;

  // User actions
  deactivateUser: (id: string, banReason: string) => Promise<void>;
  activateUser: (id: string) => Promise<void>;
  changeVisibility: (id: string) => Promise<void>;
  approveProfile: (id: string) => Promise<void>;
  rejectProfile: (id: string, reason: string) => Promise<void>;
  approveCourse: (id: string) => Promise<void>;
  rejectCourse: (id: string, reason: string) => Promise<void>;
  // Validation actions
  //   rejectValidation: (validationId: string, reason?: string) => Promise<void>;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider = ({ children }: { children: ReactNode }) => {
  // State
  const [users, setUsers] = useState<User[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [professorProfiles, setProfessorProfile] = useState<ProfessorProfileAdmin[]>([]);
  const [feedbacks, setFeedbacks] = useState<CourseReview[]>([]);
  const [pendingBatches, setPendingBatches] = useState<PayoutBatch[]>([]);
  const [paidBatches, setPaidBatches] = useState<PayoutBatch[]>([]);
  const [pendingSummary, setPendingSummary] = useState<PendingSummary[]>([]);

  // Loading states
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [isLoadingCourses, setIsLoadingCourses] = useState(false);
  const [isLoadingProfiles, setIsLoadingProfiles] = useState(false);
  const [isLoadingActive, setIsLoadingActive] = useState(false);
  const [isLoadingInactive, setIsLoadingInactive] = useState(false);
  const [isLoadingFeedbacks, setIsLoadingFeedbacks] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isLoadingPendingBatches, setIsLoadingPendingBatches] = useState(false);
  const [isLoadingPaidBatches, setIsLoadingPaidBatches] = useState(false);
  const [isLoadingPendingSummary, setIsLoadingPendingSummary] = useState(false);

  // Error states
  const [usersError, setUsersError] = useState<string | null>(null);
  const [coursesError, setCoursesError] = useState<string | null>(null);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [activeError, setActiveError] = useState<string | null>(null);
  const [inactiveError, setInactiveError] = useState<string | null>(null);
  const [feedbacksError, setFeedbacksError] = useState<string | null>(null);

  //Context
  const { token } = useAuth();

  // Fetch Users
  const fetchUsers = async () => {
    setIsLoadingUsers(true);
    setUsersError(null);
    try {
      const data = await getAllUsersService();
      setUsers(data);
    } catch (error) {
      setUsersError("Error al cargar usuarios");
      console.error("Error fetching users:", error);
    } finally {
      setIsLoadingUsers(false);
    }
  };

  const fetchActiveUser = async () => {
    setIsLoadingActive(true);
    setActiveError(null);
    try {
      if (token) {
        const data = await getActiveUsersService(token);
        setUsers(data);
        return data;
      }
    } catch (error) {
      setActiveError("Error al obtener usuarios activos");
      console.error("Error fetching users:", error);
    } finally {
      setIsLoadingActive(false);
    }
  };

  const fetchInactiveUser = async () => {
    setIsLoadingInactive(true);
    setInactiveError(null);
    try {
      if (token) {
        const data = await getInactiveUsersService(token);
        setUsers(data);
        return data;
      }
    } catch (error) {
      setInactiveError("Error al obtener usuarios inactivos");
      console.error("Error fetching users:", error);
    } finally {
      setIsLoadingInactive(false);
    }
  };

  const fetchUserById = async (id: string) => {
    try {
      const data = await getUserByIdService(id);

      return data;
    } catch (error) {
      setUsersError("Error al cargar usuario");
      console.error("Error fetching user:", error);
    }
  };

  const fetchCourses = async (filters?: {
    title?: string;
    category?: string;
    difficulty?: string;
    isActive?: boolean;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
  }) => {
    setIsLoadingCourses(true);
    setCoursesError(null);
    try {
      if (token) {
        const data = await getAllCoursesAdminService(token, filters);
        setCourses(data);
      }
    } catch (error) {
      setCoursesError("Error al cargar cursos");
      console.error("Error fetching courses:", error);
    } finally {
      setIsLoadingCourses(false);
    }
  };

  const fetchCourseById = async (userId: string) => {
    try {
      if (token) {
        const data = await getCourseByIdService(userId, token);
        return data;
      }
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  const fetchFeedback = async (courseId: string) => {
    setIsLoadingFeedbacks(true);
    setFeedbacksError(null);
    try {
      if (token) {
        const data = await getCourseFeedbackService(token, courseId);
        setFeedbacks(data);
        return data;
      }
    } catch (error) {
      setFeedbacksError("Error al cargar feedback");
      console.log(error);
      throw error;
    } finally {
      setIsLoadingFeedbacks(false);
    }
  };

  const fetchPendingBatches = async () => {
    setIsLoadingPendingBatches(true);
    try {
      if (token) {
        const data = await getAllPendingBatchesService(token);
        setPendingBatches(data);
      }
    } catch (error) {
      console.error("Error fetching pending batches:", error);
    } finally {
      setIsLoadingPendingBatches(false);
    }
  };

  const fetchPaidBatches = async () => {
    setIsLoadingPaidBatches(true);
    try {
      if (token) {
        const data = await getAllPaidBatchesService(token);
        setPaidBatches(data);
      }
    } catch (error) {
      console.error("Error fetching paid batches:", error);
    } finally {
      setIsLoadingPaidBatches(false);
    }
  };

  const fetchPendingSummary = async () => {
    setIsLoadingPendingSummary(true);
    try {
      if (token) {
        const data = await getAllPendingSummaryService(token);
        setPendingSummary(data);
      }
    } catch (error) {
      console.error("Error fetching pending summary:", error);
    } finally {
      setIsLoadingPendingSummary(false);
    }
  };

  const activateUser = async (userId: string) => {
    try {
      if (token) {
        await activateUserService(token, userId);
        setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, isActive: true } : u)));
      }
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  const deactivateUser = async (userId: string, banReason: string) => {
    try {
      if (token) {
        await deactivateUserService(userId, token, banReason);
        setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, isActive: false } : u)));
      }
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  const activateDeactivateCourse = async (courseId: string) => {
    try {
      if (token) {
        await activateDeactivateCourseService(token, courseId);
        // ESTO ES LO QUE TE FALTABA - Actualizar el estado local
        setCourses((prev) => prev.map((c) => (c.id === courseId ? { ...c, isActive: !c.isActive } : c)));
      }
    } catch (error) {
      setCoursesError("Error al cambiar estado de curso");
      console.error(error);
      throw error; // Importante para que el componente maneje el error
    }
  };

  const changeVisibility = async (courseId: string) => {
    try {
      if (token) {
        await changeVisivilityService(token, courseId);
        setCourses((prev) =>
          prev.map((c) =>
            c.id === courseId
              ? {
                  ...c,
                  visibility:
                    c.visibility === CourseVisibility.PUBLIC
                      ? CourseVisibility.PRIVATE
                      : CourseVisibility.PUBLIC,
                }
              : c
          )
        );
      }
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  //////////////////////////////////// Validations
  const fetchProfessorProfiles = async () => {
    setIsLoadingProfiles(true);
    setProfileError(null);
    try {
      if (token) {
        const data = await getAllProfessorProfilesService(token);
        setProfessorProfile(data);
        return data;
      }
    } catch (error) {
      setProfileError("Error al cargar perfiles");
      console.error("Error fetching validations:", error);
    } finally {
      setIsLoadingProfiles(false);
    }
  };

  const approveProfile = async (professorId: string) => {
    try {
      if (token) {
        await approveProfileService(token, professorId);
        setProfessorProfile((prev) => prev.filter((v) => v.id !== professorId));
        await refreshProfiles();
      }
    } catch (error) {
      console.error("Error al aprobar perfil:", error);
      throw error;
    }
  };

  const rejectProfile = async (professorId: string, reason: string) => {
    try {
      if (token) {
        const data = await rejectProfileService(token, professorId, reason);
        setProfessorProfile((prev) => prev.filter((p) => p.id === professorId));
        await refreshProfiles();
      }
    } catch (error) {
      console.error("Error al rechazar perfil:", error);
      throw error;
    }
  };

  const approveCourse = async (courseId: string) => {
    try {
      if (token) {
        await approveCourseService(token, courseId);
        changeVisibility(courseId);
        setCourses((prev) => prev.filter((v) => v.id !== courseId));
        await refreshCourses();
      }
    } catch (error) {
      console.error("Error al aprobar curso:", error);
      throw error;
    }
  };

  const rejectCourse = async (courseId: string, reason: string) => {
    try {
      if (token) {
        await rejectCourseService(token, courseId, reason);
        setCourses((prev) => prev.filter((v) => v.id !== courseId));
        await refreshCourses();
      }
    } catch (error) {
      console.error("Error al aprobar curso:", error);
      throw error;
    }
  };

  ///////////////////////////////////// Refresh functions
  const silentRefreshProfiles = async () => {
    try {
      if (token) {
        const data = await getAllProfessorProfilesService(token);
        setProfessorProfile(data);
      }
    } catch (error) {
      console.error("Error en silent refresh profiles:", error);
    }
  };

  const silentRefreshCourses = async () => {
    try {
      if (token) {
        const data = await getAllCoursesAdminService(token);
        setCourses(data);
      }
    } catch (error) {
      console.error("Error en silent refresh courses:", error);
    }
  };

  const refreshUsers = async () => {
    await fetchUsers();
  };

  const refreshCourses = async (filters?: GetAllCoursesAdminParams) => {
    await fetchCourses(filters);
  };

  const refreshProfiles = async () => {
    await fetchProfessorProfiles();
  };

  const refreshAll = async () => {
    setIsInitialLoading(true);
    try {
      await Promise.all([
        fetchUsers(),
        fetchCourses(),
        fetchProfessorProfiles(),
        fetchPendingBatches(),
        fetchPaidBatches(),
        fetchPendingSummary(),
      ]);
    } finally {
      setIsInitialLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      refreshAll();
    }
  }, [token]);

  const value: AdminContextType = {
    users,
    courses,
    isLoadingUsers,
    isLoadingCourses,
    isLoadingProfiles,
    isLoadingActive,
    isLoadingInactive,
    isInitialLoading,
    activeError,
    inactiveError,
    usersError,
    coursesError,
    profileError,
    refreshUsers,
    refreshCourses,
    refreshProfiles,
    refreshAll,
    fetchUserById,
    deactivateUser,
    fetchActiveUser,
    fetchInactiveUser,
    fetchCourseById,
    fetchProfessorProfiles,
    professorProfiles,
    activateUser,
    activateDeactivateCourse,
    changeVisibility,
    feedbacks,
    isLoadingFeedbacks,
    feedbacksError,
    fetchFeedback,
    approveProfile,
    rejectProfile,
    silentRefreshCourses,
    silentRefreshProfiles,
    approveCourse,
    rejectCourse,
    pendingBatches,
    paidBatches,
    isLoadingPendingBatches,
    isLoadingPaidBatches,
    fetchPendingBatches,
    fetchPaidBatches,
    pendingSummary,
    isLoadingPendingSummary,
    fetchPendingSummary,
  };

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
};

// Custom hook
export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error("useAdmin must be used within an AdminProvider");
  }
  return context;
};

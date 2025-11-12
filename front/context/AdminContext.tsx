// context/AdminContext.tsx
"use client";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import {
  activateDeactivateCourseService,
  activateUserService,
  changeVisivilityService,
  deactivateUserService,
  filterCoursesService,
  getActiveUsersService,
  getAllUsersService,
  getCourseFeedbackService,
  getInactiveUsersService,
  getUserByIdService,
} from "@/services/admin.services";
import { User } from "@/types/user.types";
import { Course, CourseReview, Visibility } from "@/types/course.types";
import { CourseFilters, ValidationRequest } from "@/types/admin.types";
import { useAuth } from "./UserContext";
import {
  getAllCoursesService,
  getCourseByIdService,
} from "@/services/course.services";

interface AdminStats {
  totalUsers: number;
  totalCourses: number;
  totalRevenue: number;
  pendingValidations: number;
  activeTeachers: number;
  monthlyGrowth: number;
}

interface AdminContextType {
  // Data
  users: User[];
  courses: Course[];
  validationRequests: ValidationRequest[];
  stats: AdminStats | null;
  feedbacks: CourseReview[];

  // Loading states
  isLoadingUsers: boolean;
  isLoadingCourses: boolean;
  isLoadingValidations: boolean;
  isLoadingInactive: boolean;
  isLoadingActive: boolean;
  isLoadingFeedbacks: boolean;

  // Errors
  usersError: string | null;
  coursesError: string | null;
  validationsError: string | null;
  activeError: string | null;
  inactiveError: string | null;
  feedbacksError: string | null;

  // Actions
  refreshUsers: () => Promise<void>;
  refreshCourses: () => Promise<void>;
  refreshValidations: () => Promise<void>;
  refreshAll: () => Promise<void>;
  fetchUserById: (id: string) => Promise<User>;
  fetchActiveUser: () => Promise<User[]>;
  fetchInactiveUser: () => Promise<User[]>;
  fetchCourseById: (userId: string) => Promise<Course | undefined>; /////////////para el profesor
  activateDeactivateCourse: (CourseId: string) => Promise<void>;
  fetchFeedback: (courseId: string) => Promise<CourseReview[] | undefined>;

  // User actions
  deactivateUser: (id: string) => Promise<void>;
  activateUser: (id: string) => Promise<void>;
  changeVisibility: (id: string) => Promise<void>;
  // Validation actions
  //   approveValidation: (validationId: string) => Promise<void>;
  //   rejectValidation: (validationId: string, reason?: string) => Promise<void>;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider = ({ children }: { children: ReactNode }) => {
  // State
  const [users, setUsers] = useState<User[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [validationRequests, setValidationRequests] = useState<
    ValidationRequest[]
  >([]);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [feedbacks, setFeedbacks] = useState<CourseReview[]>([]);

  // Loading states
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [isLoadingCourses, setIsLoadingCourses] = useState(false);
  const [isLoadingValidations, setIsLoadingValidations] = useState(false);
  const [isLoadingActive, setIsLoadingActive] = useState(false);
  const [isLoadingInactive, setIsLoadingInactive] = useState(false);
  const [isLoadingFeedbacks, setIsLoadingFeedbacks] = useState(false);

  // Error states
  const [usersError, setUsersError] = useState<string | null>(null);
  const [coursesError, setCoursesError] = useState<string | null>(null);
  const [validationsError, setValidationsError] = useState<string | null>(null);
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

  const fetchCourses = async () => {
    setIsLoadingCourses(true);
    setCoursesError(null);
    try {
      const data = await filterCoursesService();
      setCourses(data);
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
  // Fetch Validations (implementar tu servicio)
  const fetchValidations = async () => {
    setIsLoadingValidations(true);
    setValidationsError(null);
    try {
      // const data = await getAllValidationsService();
      // setValidationRequests(data);
      // calculateStats(users, courses, data);
    } catch (error) {
      setValidationsError("Error al cargar validaciones");
      console.error("Error fetching validations:", error);
    } finally {
      setIsLoadingValidations(false);
    }
  };

  const activateUser = async (userId: string) => {
    try {
      if (token) {
        await activateUserService(token, userId);
        setUsers((prev) =>
          prev.map((u) => (u.id === userId ? { ...u, isActive: true } : u))
        );
      }
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  const deactivateUser = async (userId: string) => {
    try {
      if (token) {
        await deactivateUserService(userId, token);
        setUsers((prev) =>
          prev.map((u) => (u.id === userId ? { ...u, isActive: false } : u))
        );
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
        setCourses((prev) =>
          prev.map((c) =>
            c.id === courseId ? { ...c, isActive: !c.isActive } : c
          )
        );
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
                    c.visibility === Visibility.PUBLICO
                      ? Visibility.PRIVADO
                      : Visibility.PUBLICO,
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

  ///////////////////////////////////// Refresh functions
  const refreshUsers = async () => {
    await fetchUsers();
  };

  const refreshCourses = async () => {
    await fetchCourses();
  };

  const refreshValidations = async () => {
    await fetchValidations();
  };

  const refreshAll = async () => {
    await Promise.all([fetchUsers(), fetchCourses(), fetchValidations()]);
  };
  ///////////////////////////////////////// User actions
  //   const banUser = async (userId: string) => {
  //     try {
  //       // await banUserService(userId);
  //       setUsers(prev => prev.map(u =>
  //         u.id === userId ? { ...u, isActive: false, status: 'banned' } : u
  //       ));
  //     } catch (error) {
  //       console.error('Error banning user:', error);
  //       throw error;
  //     }
  //   };

  //   const activateUser = async (userId: string) => {
  //     try {
  //       // await activateUserService(userId);
  //       setUsers(prev => prev.map(u =>
  //         u.id === userId ? { ...u, isActive: true, status: 'active' } : u
  //       ));
  //     } catch (error) {
  //       console.error('Error activating user:', error);
  //       throw error;
  //     }
  //   };

  //   const deleteUser = async (userId: string) => {
  //     try {
  //       // await deleteUserService(userId);
  //       setUsers(prev => prev.filter(u => u.id !== userId));
  //     } catch (error) {
  //       console.error('Error deleting user:', error);
  //       throw error;
  //     }
  //   };

  // Validation actions
  //   const approveValidation = async (validationId: string) => {
  //     try {
  //       // await approveValidationService(validationId);
  //       setValidationRequests(prev =>
  //         prev.filter(v => v.id !== validationId)
  //       );
  //       await refreshUsers(); // Refrescar porque el usuario puede cambiar
  //     } catch (error) {
  //       console.error('Error approving validation:', error);
  //       throw error;
  //     }
  //   };

  //   const rejectValidation = async (validationId: string, reason?: string) => {
  //     try {
  //       // await rejectValidationService(validationId, reason);
  //       setValidationRequests(prev =>
  //         prev.filter(v => v.id !== validationId)
  //       );
  //     } catch (error) {
  //       console.error('Error rejecting validation:', error);
  //       throw error;
  //     }
  //   };

  // Course actions
  //   const deactivateCourse = async (courseId: string) => {
  //     try {
  //       // await deactivateCourseService(courseId);
  //       setCourses(prev => prev.map(c =>
  //         c.id === courseId ? { ...c, status: 'RECHAZADO' } : c
  //       ));
  //     } catch (error) {
  //       console.error('Error deactivating course:', error);
  //       throw error;
  //     }
  //   };

  //   const activateCourse = async (courseId: string) => {
  //     try {
  //       // await activateCourseService(courseId);
  //       setCourses(prev => prev.map(c =>
  //         c.id === courseId ? { ...c, status: 'PUBLICADO' } : c
  //       ));
  //     } catch (error) {
  //       console.error('Error activating course:', error);
  //       throw error;
  //     }
  //   };

  // Initial fetch
  useEffect(() => {
    refreshAll();
  }, []);

  const value: AdminContextType = {
    users,
    courses,
    validationRequests,
    stats,
    isLoadingUsers,
    isLoadingCourses,
    isLoadingValidations,
    isLoadingActive,
    isLoadingInactive,
    activeError,
    inactiveError,
    usersError,
    coursesError,
    validationsError,
    refreshUsers,
    refreshCourses,
    refreshValidations,
    refreshAll,
    fetchUserById,
    deactivateUser,
    fetchActiveUser,
    fetchInactiveUser,
    fetchCourseById,
    activateUser,
    activateDeactivateCourse,
    changeVisibility,
    feedbacks,
    isLoadingFeedbacks,
    feedbacksError,
    fetchFeedback,
    // deleteUser,
    // approveValidation,
    // rejectValidation,
    // deactivateCourse,
    // activateCourse,
  };

  return (
    <AdminContext.Provider value={value}>{children}</AdminContext.Provider>
  );
};

// Custom hook
export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error("useAdmin must be used within an AdminProvider");
  }
  return context;
};

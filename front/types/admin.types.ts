import { Course } from "./course.types";
import { User } from "./user.types";
import { ApprovalStatus } from "./professor.types";

export type AdminTabType =
  | "overview"
  | "validations"
  | "courses"
  | "users"
  | "finances"
  | "admins"
  | "reports"
  | "analytics";

export type ValidationType =
  | "professor"
  | "course_create"
  | "course_edit"
  | "profile_edit"
  | "role_change";

export interface ValidationRequest {
  id: string;
  type: ValidationType;
  userName: string;
  userEmail: string;
  profileImage?: string;
  submittedAt: string;
  status: ApprovalStatus;
  data: any;
}

export interface AdminStats {
  totalUsers: number;
  totalCourses: number;
  totalRevenue: number;
  pendingValidations: number;
  activeTeachers: number;
  monthlyGrowth: number;
  activeMemberships?: number;
  totalRefunds?: number;
}

export interface AdminActivity {
  id: string;
  action: string;
  user: string;
  time: string;
  type: "user" | "course" | "validation" | "purchase" | "refund";
}

export interface AdminCourse extends Course {
  sales: number;
  revenue: number;
  rating: number;
  professorName: string;
  commissionPlatform: number;
  commissionProfessor: number;
}

export interface AdminUser extends User {
  coursesCreated?: number;
  coursesEnrolled?: number;
  totalSpent?: number;
  status: "active" | "inactive" | "banned";
  lastLogin?: string;
}

export interface FinancialConfig {
  courseCommission: number; // Porcentaje
  premiumMembershipPrice: number;
  premiumDiscount: number; // Porcentaje
  minCoursePrice: number;
  maxCoursePrice: number;
}

export interface PaymentTransaction {
  id: string;
  userId: string;
  courseId: string;
  amount: number;
  commission: number;
  professorPayment: number;
  status: "completed" | "pending" | "refunded";
  createdAt: string;
}

export interface AdminInvite {
  email: string;
  message?: string;
  role: "admin" | "super-admin";
}

export interface AdminProfile {
  id: string;
  name: string;
  email: string;
  role: "admin" | "super-admin";
  createdAt: string;
  lastLogin?: string;
}

// Para reportes y moderación
export interface ContentReport {
  id: string;
  type: "course" | "comment" | "review" | "user";
  reportedBy: string;
  reportedItem: string;
  reason: string;
  status: "pending" | "reviewed" | "resolved" | "dismissed";
  createdAt: string;
}

export interface Coupon {
  id: string;
  code: string;
  discount: number; // Porcentaje o monto fijo
  type: "percentage" | "fixed";
  validFrom: string;
  validUntil: string;
  usageLimit?: number;
  usedCount: number;
  isActive: boolean;
}

export interface UsersDetailProps {
  onViewDetail: (tab: TabType, id: string) => void;
}

export type TabType =
  | "overview"
  | "validations"
  | "courses"
  | "users"
  | "finances"
  | "admins";

export interface UserDetailsProps {
  user: User;
  onBack: () => void;
}

export interface UserEnrollments {
  course: {
    title: string;
    duration: string;
    professor: string;
  };
  completed: boolean;
  completedAt: string | null;
  diplomaUrl: string;
  id: string;
  inscripcionDate: string;
  priceAtPurchase: string;
  progress: string;
}

export interface CourseReview {
  id: string;
  rating: number; /////del 1 al 5 porque son estrellitas
  feedback: string;
  createdAt: string;
  // Campos de moderación
  isCensored: boolean;
  moderationStatus: 'approved' | 'pending' | 'censored' | 'rejected';
  toxicityScore?: number;
  moderationReason?: string;
  requiresManualReview?: boolean;
  user: {
    id: string;
    name: string;
    image: string | null;
  };
}
export interface CourseFilters {
  title?: string;
  category?: string;
  difficulty?: string;
}
export interface CourseModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
}
export interface CreateCourseFormProps {
  onSuccess?: (courseId: string) => void
  onCancel?: () => void;
}

import { Course, CourseStatus } from "./course.types";
import { User } from "./user.types";
import { ApprovalStatus } from "./professor.types";
import { UserFeedback } from "@/components/admin/adminCourses/CourseDetails";

export type AdminTabType =
  | "overview"
  | "validations"
  | "courses"
  | "users"
  | "finances"
  | "admins"
  | "reports"
  | "analytics";

export type ValidationType = "professor" | "course_create" | "course_edit" | "profile_edit" | "role_change";

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

export type TabType = "overview" | "validations" | "courses" | "users" | "finances" | "admins" | "newsletter";

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
  courseId: string;
  id: string;
  rating: number; /////del 1 al 5 porque son estrellitas
  feedback: string;
  createdAt: string;
  // Campos de moderación
  isCensored: boolean;
  moderationStatus: "approved" | "pending" | "censored" | "rejected";
  toxicityScore?: number;
  moderationReason?: string;
  requiresManualReview?: boolean;
  user: {
    id: string;
    name: string;
    image?: string | null;
    isActive: boolean;
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
  onSuccess?: (courseId: string) => void;
  onCancel?: () => void;
}

export interface GetAllCoursesAdminParams {
  title?: string;
  category?: string;
  difficulty?: string;
  isActive?: boolean;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}
export interface ProfessorValidation {
  id: string;
  userName: string;
  userEmail: string;
  userImage: string | null | undefined;
  profession: string;
  phone: string | undefined;
  biography: string;
  certificates: string[];
  professionalLinks: string[];
  approvalStatus: ApprovalStatus;
  createdAt: string;
}

export interface CourseValidation {
  id: string;
  title: string;
  professorName: string;
  professorEmail: string;
  category: string;
  status: CourseStatus;
  createdAt: string;
  price: string;
  difficulty: string;
  visibility: string;
}
export interface BanReasonModalProps {
  banReason: string;
  setBanReason: (reason: string) => void;
  onCancel: () => void;
  onConfirm: (user?: UserFeedback) => void;
  isMultiple?: boolean;
  userCount?: number;
}

export interface RejectedReasonModalProps {
  rejectedReason: string;
  setRejectedReason: (reason: string) => void;
  onCancel: () => void;
  onConfirm: () => void;
}

export interface ProfessorProfileAdmin {
  rejectionReason: string;
  agreedToAproveed: boolean;
  agreedToInfo: boolean;
  agreedToTerms: boolean;
  approvalStatus: string;
  biography: string;
  certificates: string[];
  id: string;
  phone: string;
  profession: string;
  professionalLinks: string[];
  speciality: string | null;
  user: UserProfile;
}

export interface UserProfile {
  RequestingTeacherRoleDate: string;
  checkBoxTerms: boolean;
  ciudad: string | null;
  createdAt: string;
  direccion: string | null;
  dni: string | null;
  email: string;
  emailVerificationToken: string | null;
  fechaNacimiento: string | null;
  genero: string | null;
  githubId: string | null;
  googleId: string | null;
  hasCompletedProfile: boolean;
  id: string;
  image: string;
  isActive: boolean;
  isEmailVerified: boolean;
  isGitHubAccount: boolean;
  isGoogleAccount: boolean;
  name: string;
  newPasswordRequest: string | null;
  newPasswordToken: string | null;
  password: string | null;
  resetPasswordExpires: string | null;
  resetPasswordToken: string | null;
  role: string;
  suspensionReason: string | null;
  telefono: string | null;
  updatedAt: string;
}

export interface registerAdminForm {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}
export interface Sale {
  saleID: string;
  saleDate: string;
  courseTitle: string;
  studentName: string;
  studentEmail: string;
  professorName: string;
  totalPrice: string;
  professorEarnings: string;
  adminEarnings: string;
  paymentId: string;
  stripeID: string;
  payoutStatus: string;
}
export interface AbandonedCartDashboard {
  isEnabled: boolean;
  delayHours: string;
  delayValue: string;
  pendingCount: number;
  lastExecution: string;
}
export interface PayoutBatch {
  payoutId: string;
  status: "PENDING" | "PAID";
  createdAt: string;
  paidAt: string | null;
  totalAmount: string;
  professorName: string;
  professorId: string;
  referenceNumber?: string;
  salesCount: number;
}

export interface PendingSummary {
  professorId: string;
  professorName: string;
  totalOwed: number;
  salesCount: number;
}

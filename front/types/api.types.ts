//AGREGAR RESPUESTAS FALTANTES

export interface RegisterResponse {
  access_token: string;
  userReturn: {
    email: string;
    hasCompletedProfile: boolean;
    id: string;
    name: string;
    role: "student" | "teacher" | "admin" | null;
    isEmailVerified: false;
    resetPasswordToken: null;
    resetPasswordExpires: null;
    checkBoxTerms: null;
    emailVerificationToken: string;
    googleId: null;
    image: null;
    isActive: boolean;
    isGoogleAccount: false;
  };
}

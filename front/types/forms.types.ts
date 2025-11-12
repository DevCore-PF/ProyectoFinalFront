// export interface ContactFormData {
//   name: string;
//   email: string;
//   subject: string;
//   message: string;
// }

export interface RoleData {
  role: string;
}
export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface RoleChangeData {
  role: "student" | "teacher" | "admin";
}

export interface SearchFormData {
  query: string;
  filters?: {
    category?: string;
    difficulty?: string;
    priceRange?: [number, number];
  };
}
export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  checkBoxTerms: boolean;
}

export interface JwtPayload {
  sub: string;
  email: string;
  role: string;
  iat: number;
  exp: number;
}

export interface LoginResponse {
  access_token: string;
  userReturn: User;
}

export interface RegisterResponse {
  access_token: string;
  userReturn: User;
}

import { User } from "./user.types";

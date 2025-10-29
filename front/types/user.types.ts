export interface UploadImageResponse {
  success: boolean;
  imageUrl: string;
  message: string;
}

export interface UserUpdateResponse {
  id: string;
  name: string;
  email: string;
  role: string;
  profileImage?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  profileImage?: string;
  phone?: string;
  address?: string;
}

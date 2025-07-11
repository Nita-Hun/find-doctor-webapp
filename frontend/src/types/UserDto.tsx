export interface UserDto {
  id: number;
  email: string;
  password: string;
  role: string;
  profilePhotoUrl: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface User {
  id?: number;
  email: string;
  password: string;
  role: string;
  profilePhotoUrl: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface UserFormModalProps {
  user?: UserDto | null;
  onClose: () => void;
  onSuccess: () => void;
}

export const roleColors: Record<string, string> = {
  ADMIN: "bg-purple-100 text-purple-800",
  PATIENT: "bg-blue-100 text-blue-800",
  DOCTOR: "bg-green-100 text-green-800",
};
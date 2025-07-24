import { UserSimple } from "./UserDto";

export interface Doctor {
  id?: number;
  firstname: string;
  lastname: string;
  status: string;
  hospitalId: number;
  specializationId: number;
  createdAt?: string;
  updatedAt?: string;

  userId?: number;    
  userEmail?: string;
}

export interface DoctorDto {
  id: number;
  firstname: string;
  lastname: string;
  status: string;
  hospitalId: number;
  hospitalName?: string;
  specializationId: number;
  specializationName?: string;
  createdAt: string;
  updatedAt: string;

  userId?: number;    
  userEmail?: string; 
}

export interface DoctorFormModalProps {
  doctor?: Doctor | null;
  users?: UserSimple[]; 
  onClose: () => void;
  onSuccess: () => void;
}
export interface DoctorDashboardDto {
  totalPatients: number;
  consultations: number;
  chart: {
    month: string;
    male: number;
    female: number;
  }[];
  doctor: {
    id: number;
    name: string;
    specialization: string;
    photoUrl: string;
    rating: number;
    ratingCount: number;
  };
  colleagues: {
    id: number;
    name: string;
    specialization: string;
    photoUrl: string;
    rating: number;
  }[];
  recentPatients: {
    id: number;
    name: string;
    age: number;
    date: string;
  }[];
}

export type DoctorOption = {
  id: number;
  name: string;
  hospitalName?: string;
  hospitalPhone?: string;
};




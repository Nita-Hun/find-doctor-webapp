export interface Doctor {
  id?: number;
  firstname: string;
  lastname: string;
  status: string;
  hospitalId: number;
  specializationId: number;
  createdAt?: string;
  updatedAt?: string;
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
}

export interface DoctorFormModalProps {
  doctor?: Doctor | null;
  onClose: () => void;
  onSuccess: () => void;
}


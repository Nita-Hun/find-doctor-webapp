export interface PatientDto {
  id: number;
  firstname: string;
  lastname: string;
  status: string;
  gender: string;
  dateOfBirth: string;
  address: string;
  createdAt: string;
  updatedAt: string;
}

export interface Patient {
  id?: number;
  firstname: string;
  lastname: string;
  status: string;
  gender: string;
  dateOfBirth: string;
  address: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface PatientFormModalProps {
  patient?: PatientDto | null;
  onClose: () => void;
  onSuccess: () => void;
}
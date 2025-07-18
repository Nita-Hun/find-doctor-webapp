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

  userId?: number;    
  userEmail?: string;
}

export interface UserSimple {
  id: number;
  email: string;
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

  userId?: number;    
  userEmail?: string;
}

export interface PatientFormModalProps {
  patient?: PatientDto | null;
  users?: UserSimple[]; 
  onClose: () => void;
  onSuccess: () => void;
}


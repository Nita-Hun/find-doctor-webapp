export interface Doctor {
  id?: number;
  firstname: string;
  lastname: string;
  status: string;
  hospitalId: number;
  specializationId: number;
}
export interface Props {
  doctor: Doctor | null;
  onClose: () => void;
  onSuccess: () => void;
}

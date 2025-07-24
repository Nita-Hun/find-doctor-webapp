import { AppointmentDto } from "./Appointment";

export interface Feedback {
  id?: number;
  rating: number;
  comment: string;
  appointmentId: number;
  createdAt?: string;
  updatedAt?: string;
  doctorName?: string;
  doctorId?: number;
}

export interface Appointment {
  appointmentTypeName: string;
  dateTime: string | number | Date;
  id: number;
  doctor?: {
    id: number;
    name: string;
  };
  doctorName?: string;
  doctorId?: number;
}

export interface FeedbackFormModalProps {
  feedback: Feedback | null;
  appointments: (AppointmentDto | Appointment)[];
  onClose: () => void;
  onSuccess: () => void;
}
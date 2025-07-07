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
  appointments: Appointment[];
  onClose: () => void;
  onSuccess: () => void;
}
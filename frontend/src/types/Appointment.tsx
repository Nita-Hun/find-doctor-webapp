import { AppointmentTypeOption } from "./AppointmentType";
import { DoctorOption } from "./DoctorDto";

export interface Appointment {
  id?: number;
  doctorId: number;
  patientId: number;
  appointmentTypeId: number;
  dateTime: string;
  note?: string;
}
export interface AppointmentFormModalProps {
  appointment?: Appointment;
  onClose: () => void;
  onSuccess: () => void;
}

//For public appointment details
export interface AppointmentDetailsProps {
  doctorId: number;
  setDoctorId: (v: number) => void;
  appointmentTypeId: number;
  setAppointmentTypeId: (v: number) => void;
  dateTime: string;
  setDateTime: (v: string) => void;
  note: string;
  setNote: (v: string) => void;
  doctors: DoctorOption[];
  appointmentTypes: AppointmentTypeOption[];
  onNext: () => void;
  onBack: () => void;
  loading: boolean;
}

export type AppointmentStatus = 'PENDING' | 'CONFIRMED' | 'CANCELED' | 'COMPLETED';

export interface AppointmentDto {
  id: number;
  doctorId: number;
  doctorName?: string;
  doctorImage?: string;
  patientId: number;
  patientName?: string;
  patientImage?: string;
  appointmentTypeId: number;
  appointmentTypeName?: string;
  doctorHospitalName?: string;
  doctorHospitalPhone?: string;
  dateTime: string;
  note?: string;
  status: AppointmentStatus;
  paymentStatus?: string | null;
  feedbackGiven: boolean; 
}

//For appointment form modal and table Admin & Doctor dashboard
export type SelectOption = {
  id: number;
  name: string;
};







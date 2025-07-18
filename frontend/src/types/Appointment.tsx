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
}

export type AppointmentTypeOption = {
  id: number;
  name: string;
  price: number;
  duration: number;
};

export type SelectOption = {
  id: number;
  name: string;
};

export type DoctorOption = {
  id: number;
  name: string;
  hospitalName?: string;
  hospitalPhone?: string;
};





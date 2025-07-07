export interface Appointment {
  id?: number;
  doctorId: number;
  patientId: number;
  appointmentTypeId: number;
  dateTime: string;
  note?: string;
  attachment?: string;
}

export interface SelectOption {
  id: number;
  name: string;
}

export interface AppointmentFormModalProps {
  appointment?: Appointment;
  onClose: () => void;
  onSuccess: () => void;
}

export interface AppointmentDto {
  id: number;
  doctorId: number;
  patientId: number;
  appointmentTypeId: number;
  dateTime: string;
  note: string;
  attachment?: string;
  doctorName?: string;
  patientName?: string;
  appointmentTypeName?: string;
  doctorImage?: string;
  patientImage?: string;
}


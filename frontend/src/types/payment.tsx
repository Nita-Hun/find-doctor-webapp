export interface Payment {
  id?: number;
  paymentStatus: string;
  paymentMethod: string;
  amount: number;

}

export interface PaymentDto {
  id: number;
  appointmentId: number;
  amount: number;
  paymentStatus: string;
  paymentMethod: string;
  paidAt: string | null;
  patientName: string;
}

export interface Appointment {
  id: number;
  patientName: string;
  dateTime: string;
  amount: number;
  doctorSpecialty?: string;
}
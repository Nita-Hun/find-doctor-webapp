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
  doctorName: string;
}

export interface Appointment {
  id: number;
  doctorName: string;
  dateTime: string;
  amount: number;
  doctorSpecialty?: string;
}
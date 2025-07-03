export interface AppointmentType {
  id?: number;  // Optional for new items
  name: string;
  price: number;
  createdAt?: string;
  updatedAt?: string;
}
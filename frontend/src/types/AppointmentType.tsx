export interface AppointmentType {
  id?: number;  // Optional for new items
  name: string;
  price: number;
  duration: number;
  createdAt?: string;
  updatedAt?: string;
}
export interface AppointmentTypeDto {
  id: number;
  name: string;
  price: number;
  duration: number;
  createdAt?: string;
  updatedAt?: string;
}

export type AppointmentTypeOption = {
  id: number;
  name: string;
  price: number;
  duration: number;
};


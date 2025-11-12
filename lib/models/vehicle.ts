export interface Vehicle {
  id: string;
  plate: string;
  model: string;
  capacity: number;
  status: "active" | "inactive";
}

export type VehicleCreate = Omit<Vehicle, "id">;
export type VehicleUpdate = Partial<Omit<Vehicle, "id">>;

export interface User {
  id: string;
  email: string;
  name: string;
  role: "admin" | "operator";
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}
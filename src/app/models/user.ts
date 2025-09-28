export interface User {
  id: string;
  username: string;
  rut: string;
  region: string;
  comuna: string;
  email: string;
  password: string; // En producción debería estar hasheado
  role: 'admin' | 'user';
  createdAt: Date;
  isActive: boolean;
}

export interface UserRegistrationData {
  username: string;
  rut: string;
  region: string;
  comuna: string;
  email: string;
  password: string;
  confirmPassword: string;
  acceptTerms: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}
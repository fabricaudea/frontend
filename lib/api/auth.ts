import { User, LoginCredentials, AuthResponse } from '@/lib/models/vehicle';

// Mock users for development
const MOCK_USERS: User[] = [
  {
    id: '1',
    email: 'admin@demo.com',
    name: 'Administrador',
    role: 'admin',
  },
  {
    id: '2',
    email: 'operador@demo.com',
    name: 'Operador',
    role: 'operator',
  },
];

// Mock passwords (in real app, this would be handled by backend)
const MOCK_PASSWORDS: Record<string, string> = {
  'admin@demo.com': 'Admin123',
  'operador@demo.com': 'Operador123',
};

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function login(credentials: LoginCredentials): Promise<AuthResponse> {
  await delay(Math.random() * 300 + 800); // 800-1100ms delay
  
  const user = MOCK_USERS.find(u => u.email === credentials.email);
  const password = MOCK_PASSWORDS[credentials.email];
  
  if (!user || password !== credentials.password) {
    throw new Error('Credenciales inválidas');
  }
  
  return {
    user,
    token: `mock-token-${user.id}`,
  };
}

export async function logout(): Promise<void> {
  await delay(200);
  // In a real app, this would invalidate the token on the server
}
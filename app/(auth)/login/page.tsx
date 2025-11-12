'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { login as apiLogin } from '@/lib/api/auth';
import { useAuth } from '@/lib/auth/context';
import { Truck, AlertCircle } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email('Email inválido').min(1, 'El email es requerido'),
  password: z.string().min(1, 'La contraseña es requerida'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { login } = useAuth();

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      setIsSubmitting(true);
      setError(null);
      
      const response = await apiLogin(data);
      login(response.user, response.token);
      
      // Redirect based on role
      const redirectPath = response.user.role === 'admin' ? '/fleet' : '/alerts';
      router.push(redirectPath);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al iniciar sesión');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
            <Truck className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">FleetGuard360</h1>
          <p className="text-gray-400">Sistema de Gestión de Flotas</p>
        </div>

        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-2xl text-center text-gray-100">
              Iniciar Sesión
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {error && (
                  <Alert className="bg-red-900/20 border-red-900/50">
                    <AlertCircle className="h-4 w-4 text-red-400" />
                    <AlertDescription className="text-red-400">
                      {error}
                    </AlertDescription>
                  </Alert>
                )}

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-200">Usuario</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="email"
                          placeholder="ejemplo@empresa.com"
                          className="bg-gray-800 border-gray-700 text-gray-100 placeholder:text-gray-400 focus:border-blue-500"
                        />
                      </FormControl>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-200">Contraseña</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="password"
                          placeholder="••••••••"
                          className="bg-gray-800 border-gray-700 text-gray-100 placeholder:text-gray-400 focus:border-blue-500"
                        />
                      </FormControl>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Iniciando sesión...' : 'Iniciar sesión'}
                </Button>
              </form>
            </Form>

            <div className="mt-6 text-center">
              <a 
                href="#" 
                className="text-sm text-blue-400 hover:text-blue-300"
                onClick={(e) => e.preventDefault()}
              >
                ¿Olvidó su contraseña?
              </a>
            </div>

            {/* Demo credentials */}
            <div className="mt-8 p-4 bg-gray-800 rounded-lg">
              <h3 className="text-sm font-medium text-gray-200 mb-2">
                Credenciales de prueba:
              </h3>
              <div className="text-xs text-gray-400 space-y-1">
                <div>
                  <strong>Admin:</strong> admin@demo.com / Admin123
                </div>
                <div>
                  <strong>Operador:</strong> operador@demo.com / Operador123
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
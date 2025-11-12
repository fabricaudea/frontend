'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ShieldX, ArrowLeft } from 'lucide-react';

export default function ForbiddenPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
      <Card className="bg-gray-900 border-gray-800 max-w-md w-full">
        <CardContent className="flex flex-col items-center text-center p-8">
          <div className="rounded-full bg-red-600/20 p-4 mb-6">
            <ShieldX className="h-12 w-12 text-red-400" />
          </div>
          
          <h1 className="text-2xl font-bold text-gray-100 mb-2">
            Acceso Denegado
          </h1>
          
          <p className="text-gray-400 mb-8">
            No tienes permisos para acceder a esta sección.
            Contacta al administrador si necesitas acceso.
          </p>
          
          <div className="space-y-3 w-full">
            <Button
              onClick={() => router.back()}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver
            </Button>
            
            <Button
              variant="outline"
              onClick={() => router.push('/alerts')}
              className="w-full bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700"
            >
              Ir a Alertas
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
'use client';

import { useState } from 'react';
import { NavBar } from '@/components/NavBar';
import { SideBar } from '@/components/SideBar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Clock, MapPin, Truck } from 'lucide-react';

// Mock alerts data
const mockAlerts = [
  {
    id: '1',
    type: 'maintenance',
    severity: 'medium',
    vehicle: 'ABC123',
    message: 'Mantenimiento preventivo requerido',
    location: 'Depot Central',
    timestamp: '2024-01-15T10:30:00Z',
  },
  {
    id: '2',
    type: 'speed',
    severity: 'high',
    vehicle: 'DEF456',
    message: 'Exceso de velocidad detectado',
    location: 'Av. Principal, Km 15',
    timestamp: '2024-01-15T09:45:00Z',
  },
  {
    id: '3',
    type: 'fuel',
    severity: 'low',
    vehicle: 'GUH045',
    message: 'Nivel de combustible bajo',
    location: 'Ruta 25, Km 8',
    timestamp: '2024-01-15T08:20:00Z',
  },
];

const getSeverityBadge = (severity: string) => {
  const variants = {
    high: 'bg-red-600 text-white hover:bg-red-700',
    medium: 'bg-yellow-600 text-white hover:bg-yellow-700',
    low: 'bg-blue-600 text-white hover:bg-blue-700',
  };
  
  const labels = {
    high: 'Alta',
    medium: 'Media',
    low: 'Baja',
  };

  return (
    <Badge className={variants[severity as keyof typeof variants]}>
      {labels[severity as keyof typeof labels]}
    </Badge>
  );
};

const getAlertIcon = (type: string) => {
  const icons = {
    maintenance: Truck,
    speed: AlertTriangle,
    fuel: AlertTriangle,
  };
  
  const Icon = icons[type as keyof typeof icons] || AlertTriangle;
  return <Icon className="h-5 w-5" />;
};

const formatTime = (timestamp: string) => {
  return new Date(timestamp).toLocaleString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export default function AlertsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-950 flex">
      <SideBar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className="flex-1 flex flex-col md:ml-0">
        <NavBar onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
        
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-100">Alertas</h1>
              <p className="text-gray-400 mt-2">
                Monitoreo en tiempo real de eventos de la flota
              </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card className="bg-gray-900 border-gray-800">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm font-medium">Alertas Activas</p>
                      <p className="text-2xl font-bold text-gray-100">3</p>
                    </div>
                    <div className="rounded-full bg-red-600/20 p-3">
                      <AlertTriangle className="h-6 w-6 text-red-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-900 border-gray-800">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm font-medium">Vehículos Monitoreados</p>
                      <p className="text-2xl font-bold text-gray-100">7</p>
                    </div>
                    <div className="rounded-full bg-blue-600/20 p-3">
                      <Truck className="h-6 w-6 text-blue-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-900 border-gray-800">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm font-medium">Última Actualización</p>
                      <p className="text-2xl font-bold text-gray-100">10:30</p>
                    </div>
                    <div className="rounded-full bg-green-600/20 p-3">
                      <Clock className="h-6 w-6 text-green-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Alerts List */}
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-gray-100">Alertas Recientes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockAlerts.map((alert) => (
                    <div
                      key={alert.id}
                      className="flex items-start space-x-4 p-4 bg-gray-800 rounded-lg border border-gray-700"
                    >
                      <div className="flex-shrink-0">
                        <div className="rounded-full bg-gray-700 p-2 text-gray-300">
                          {getAlertIcon(alert.type)}
                        </div>
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-sm font-medium text-gray-100 truncate">
                            {alert.message}
                          </h3>
                          {getSeverityBadge(alert.severity)}
                        </div>
                        
                        <div className="flex items-center space-x-4 text-xs text-gray-400">
                          <div className="flex items-center">
                            <Truck className="h-3 w-3 mr-1" />
                            {alert.vehicle}
                          </div>
                          <div className="flex items-center">
                            <MapPin className="h-3 w-3 mr-1" />
                            {alert.location}
                          </div>
                          <div className="flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            {formatTime(alert.timestamp)}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
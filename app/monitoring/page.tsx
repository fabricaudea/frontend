'use client';

import { useState, useEffect } from 'react';
import { Radio, AlertTriangle, Activity, MapPin } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { NavBar } from '@/components/NavBar';
import { SideBar } from '@/components/SideBar';
import { RealTimeMap, VehicleInfoPanel } from '@/components/RealTimeTracking';
import { useAuth } from '@/lib/auth/context';
import { VehicleTracking, SpeedAlert, DashboardStats } from '@/lib/models/tracking';
import * as trackingApi from '@/lib/api/tracking';
import { toast } from 'sonner';

export default function RealTimeMonitoringPage() {
  const [vehicles, setVehicles] = useState<VehicleTracking[]>([]);
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleTracking | null>(null);
  const [alerts, setAlerts] = useState<SpeedAlert[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  const { user } = useAuth();

  const loadData = async () => {
    try {
      const [vehiclesData, alertsData, statsData] = await Promise.all([
        trackingApi.getVehicleTracking(),
        trackingApi.getSpeedAlerts(),
        trackingApi.getDashboardStats()
      ]);

      setVehicles(vehiclesData);
      setAlerts(alertsData);
      setStats(statsData);
      setLastUpdate(new Date());
    } catch (error) {
      console.error('Error loading tracking data:', error);
      toast.error('Error al cargar datos de tracking');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();

    // Actualizar cada 15 segundos
    const interval = setInterval(loadData, 15000);
    return () => clearInterval(interval);
  }, []);

  const handleVehicleSelect = (vehicle: VehicleTracking) => {
    setSelectedVehicle(vehicle);
  };

  const handleAcknowledgeAlert = async (alertId: string) => {
    try {
      await trackingApi.acknowledgeAlert(alertId);
      setAlerts(prev => prev.map(alert => 
        alert.id === alertId ? { ...alert, acknowledged: true } : alert
      ));
      toast.success('Alerta reconocida');
    } catch (error) {
      toast.error('Error al reconocer alerta');
    }
  };

  const unacknowledgedAlerts = alerts.filter(alert => !alert.acknowledged);
  const criticalAlerts = alerts.filter(alert => alert.severity === 'critical' && !alert.acknowledged);

  return (
    <div className="min-h-screen bg-gray-950 flex">
      <SideBar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className="flex-1 flex flex-col md:ml-0">
        <NavBar onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
        
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold text-gray-100 flex items-center">
                  <Radio className="h-8 w-8 mr-3 text-blue-400" />
                  Monitoreo en Tiempo Real
                </h1>
                <p className="text-gray-400 mt-2">
                  Seguimiento GPS y alertas de la flota
                </p>
              </div>
              
              <div className="mt-4 sm:mt-0 flex items-center space-x-4">
                <div className="text-right">
                  <p className="text-sm text-gray-400">Última actualización</p>
                  <p className="text-sm text-gray-300">{lastUpdate.toLocaleTimeString()}</p>
                </div>
                <div className="h-3 w-3 bg-green-400 rounded-full animate-pulse" title="Actualizando cada 15 segundos" />
              </div>
            </div>

            {/* Stats Cards */}
            {stats && (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <Card className="bg-gray-900 border-gray-800">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-400 text-sm">Vehículos Activos</p>
                        <p className="text-2xl font-bold text-gray-100">
                          {stats.activeVehicles}/{stats.totalVehicles}
                        </p>
                      </div>
                      <Activity className="h-8 w-8 text-green-400" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gray-900 border-gray-800">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-400 text-sm">Velocidad Promedio</p>
                        <p className="text-2xl font-bold text-gray-100">
                          {stats.averageSpeed.toFixed(0)} km/h
                        </p>
                      </div>
                      <MapPin className="h-8 w-8 text-blue-400" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gray-900 border-gray-800">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-400 text-sm">Alertas Totales</p>
                        <p className="text-2xl font-bold text-gray-100">{stats.totalAlerts}</p>
                      </div>
                      <AlertTriangle className="h-8 w-8 text-yellow-400" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gray-900 border-gray-800">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-400 text-sm">Alertas Críticas</p>
                        <p className="text-2xl font-bold text-red-400">{stats.criticalAlerts}</p>
                      </div>
                      <AlertTriangle className="h-8 w-8 text-red-400" />
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Alerts Panel */}
            {unacknowledgedAlerts.length > 0 && (
              <Card className="bg-red-900/10 border-red-900/50 mb-8">
                <CardHeader>
                  <CardTitle className="text-red-400 flex items-center">
                    <AlertTriangle className="h-5 w-5 mr-2" />
                    Alertas Activas ({unacknowledgedAlerts.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {unacknowledgedAlerts.map((alert) => (
                      <div key={alert.id} className="flex items-center justify-between bg-red-900/20 rounded-lg p-4">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <Badge variant="destructive">{alert.vehiclePlate}</Badge>
                            <Badge variant={alert.severity === 'critical' ? 'destructive' : 'secondary'}>
                              {alert.severity === 'critical' ? 'Crítica' : 'Advertencia'}
                            </Badge>
                          </div>
                          <p className="text-red-300 text-sm">
                            Velocidad: {alert.currentSpeed} km/h (límite: {alert.speedLimit} km/h)
                          </p>
                          <p className="text-red-400 text-sm">
                            {alert.location.address || `${alert.location.latitude}, ${alert.location.longitude}`}
                          </p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleAcknowledgeAlert(alert.id)}
                          className="bg-red-900/20 border-red-700 text-red-300 hover:bg-red-900/40"
                        >
                          Reconocer
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Map */}
              <div className="lg:col-span-2">
                <RealTimeMap
                  vehicles={vehicles}
                  selectedVehicle={selectedVehicle}
                  onVehicleSelect={handleVehicleSelect}
                />
              </div>

              {/* Vehicle Info Panel */}
              <div>
                <VehicleInfoPanel vehicle={selectedVehicle} alerts={alerts} />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
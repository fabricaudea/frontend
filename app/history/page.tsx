'use client';

import { useState, useEffect } from 'react';
import { History, MapPin, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { NavBar } from '@/components/NavBar';
import { SideBar } from '@/components/SideBar';
import { 
  LocationFilters, 
  LocationHistoryMap, 
  LocationStats, 
  LocationHistoryTable 
} from '@/components/LocationHistory';
import { useAuth } from '@/lib/auth/context';
import { LocationHistory, TrackingFilters } from '@/lib/models/tracking';
import { Vehicle } from '@/lib/models/vehicle';
import * as trackingApi from '@/lib/api/tracking';
import * as vehicleApi from '@/lib/api/vehicles';
import { toast } from 'sonner';

export default function LocationHistoryPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [history, setHistory] = useState<LocationHistory[]>([]);
  const [selectedHistory, setSelectedHistory] = useState<LocationHistory | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [filters, setFilters] = useState<TrackingFilters>({
    startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 7 días atrás
    endDate: new Date().toISOString().split('T')[0], // hoy
  });

  const { user } = useAuth();

  const loadVehicles = async () => {
    try {
      const vehiclesData = await vehicleApi.listVehicles();
      setVehicles(vehiclesData);
    } catch (error) {
      console.error('Error loading vehicles:', error);
      toast.error('Error al cargar vehículos');
    }
  };

  const loadHistory = async () => {
    try {
      setIsLoading(true);
      const historyData = await trackingApi.getLocationHistory(filters);
      setHistory(historyData);
    } catch (error) {
      console.error('Error loading location history:', error);
      toast.error('Error al cargar historial de ubicaciones');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadVehicles();
  }, []);

  useEffect(() => {
    loadHistory();
  }, []);

  const handleFiltersChange = (newFilters: TrackingFilters) => {
    setFilters(newFilters);
  };

  const handleApplyFilters = () => {
    loadHistory();
    toast.success('Filtros aplicados');
  };

  const handleSelectHistory = (historyItem: LocationHistory) => {
    setSelectedHistory(historyItem);
    toast.success(`Ruta seleccionada para vehículo ${getVehicleInfo(historyItem.vehicleId)}`);
  };

  const handleExportData = () => {
    // Simular exportación
    toast.success('Exportando datos a CSV...');
  };

  const getVehicleInfo = (vehicleId: string) => {
    const vehicle = vehicles.find(v => v.id === vehicleId);
    return vehicle ? vehicle.plate : vehicleId;
  };

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
                  <History className="h-8 w-8 mr-3 text-purple-400" />
                  Historial de Ubicaciones
                </h1>
                <p className="text-gray-400 mt-2">
                  Dashboard de posiciones, velocidad y paradas
                </p>
              </div>
              
              <div className="mt-4 sm:mt-0">
                <Button
                  onClick={handleExportData}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Exportar CSV
                </Button>
              </div>
            </div>

            {/* Filters */}
            <div className="mb-8">
              <LocationFilters
                vehicles={vehicles}
                filters={filters}
                onFiltersChange={handleFiltersChange}
                onApplyFilters={handleApplyFilters}
              />
            </div>

            {/* Stats */}
            {!isLoading && history.length > 0 && (
              <div className="mb-8">
                <LocationStats history={history} />
              </div>
            )}

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
              {/* Map */}
              <div className="lg:col-span-2">
                <LocationHistoryMap
                  history={history}
                  selectedHistory={selectedHistory}
                />
              </div>

              {/* Vehicle Selection */}
              <div>
                <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-100 mb-4 flex items-center">
                    <MapPin className="h-5 w-5 mr-2" />
                    Vehículos en Consulta
                  </h3>
                  
                  {isLoading ? (
                    <div className="space-y-3">
                      {[...Array(3)].map((_, i) => (
                        <div key={i} className="h-12 bg-gray-800 rounded animate-pulse" />
                      ))}
                    </div>
                  ) : history.length > 0 ? (
                    <div className="space-y-3">
                      {history.map((h) => (
                        <button
                          key={h.vehicleId}
                          onClick={() => handleSelectHistory(h)}
                          className={`w-full text-left p-3 rounded-lg border transition-all ${
                            selectedHistory?.vehicleId === h.vehicleId
                              ? 'bg-purple-900/20 border-purple-700 text-purple-300'
                              : 'bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700'
                          }`}
                        >
                          <div className="font-medium">{getVehicleInfo(h.vehicleId)}</div>
                          <div className="text-sm opacity-75">
                            {h.locations.length} puntos • {h.totalDistance.toFixed(1)} km
                          </div>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center text-gray-400 py-8">
                      <MapPin className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No hay datos para el rango seleccionado</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* History Table */}
            {!isLoading && history.length > 0 && (
              <LocationHistoryTable
                history={history}
                vehicles={vehicles}
                onSelectHistory={handleSelectHistory}
              />
            )}

            {/* Empty State */}
            {!isLoading && history.length === 0 && (
              <div className="text-center py-12">
                <History className="h-16 w-16 mx-auto mb-4 text-gray-500" />
                <h3 className="text-xl font-semibold text-gray-300 mb-2">
                  No hay historial disponible
                </h3>
                <p className="text-gray-400 mb-6">
                  Ajusta los filtros para encontrar datos de ubicación
                </p>
                <Button onClick={handleApplyFilters} variant="outline">
                  Actualizar Búsqueda
                </Button>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
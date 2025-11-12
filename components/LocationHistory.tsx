'use client';

import { useState } from 'react';
import { Calendar, MapPin, Clock, TrendingUp, Filter } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { LocationHistory, TrackingFilters, GpsLocation } from '@/lib/models/tracking';
import { Vehicle } from '@/lib/models/vehicle';

interface LocationFiltersProps {
  vehicles: Vehicle[];
  filters: TrackingFilters;
  onFiltersChange: (filters: TrackingFilters) => void;
  onApplyFilters: () => void;
}

export function LocationFilters({ vehicles, filters, onFiltersChange, onApplyFilters }: LocationFiltersProps) {
  return (
    <Card className="bg-gray-900 border-gray-800">
      <CardHeader>
        <CardTitle className="text-gray-100 flex items-center">
          <Filter className="h-5 w-5 mr-2" />
          Filtros de Búsqueda
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label className="text-gray-300">Vehículo</Label>
            <Select 
              value={filters.vehicleId || 'all'} 
              onValueChange={(value) => onFiltersChange({ ...filters, vehicleId: value === 'all' ? undefined : value })}
            >
              <SelectTrigger className="bg-gray-800 border-gray-700 text-gray-100">
                <SelectValue placeholder="Todos los vehículos" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
                <SelectItem value="all">Todos los vehículos</SelectItem>
                {vehicles.map((vehicle) => (
                  <SelectItem key={vehicle.id} value={vehicle.id}>
                    {vehicle.plate} - {vehicle.model}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-gray-300">Fecha Inicio</Label>
            <Input
              type="date"
              value={filters.startDate}
              onChange={(e) => onFiltersChange({ ...filters, startDate: e.target.value })}
              className="bg-gray-800 border-gray-700 text-gray-100"
            />
          </div>

          <div>
            <Label className="text-gray-300">Fecha Fin</Label>
            <Input
              type="date"
              value={filters.endDate}
              onChange={(e) => onFiltersChange({ ...filters, endDate: e.target.value })}
              className="bg-gray-800 border-gray-700 text-gray-100"
            />
          </div>

          <div>
            <Label className="text-gray-300">Velocidad Mínima (km/h)</Label>
            <Input
              type="number"
              placeholder="0"
              value={filters.speedMin || ''}
              onChange={(e) => onFiltersChange({ ...filters, speedMin: e.target.value ? parseInt(e.target.value) : undefined })}
              className="bg-gray-800 border-gray-700 text-gray-100"
            />
          </div>
        </div>

        <Button onClick={onApplyFilters} className="w-full bg-blue-600 hover:bg-blue-700">
          <Filter className="h-4 w-4 mr-2" />
          Aplicar Filtros
        </Button>
      </CardContent>
    </Card>
  );
}

interface LocationHistoryMapProps {
  history: LocationHistory[];
  selectedHistory?: LocationHistory | null;
}

export function LocationHistoryMap({ history, selectedHistory }: LocationHistoryMapProps) {
  const [showRoutes, setShowRoutes] = useState(true);

  return (
    <Card className="bg-gray-900 border-gray-800">
      <CardHeader>
        <CardTitle className="text-gray-100 flex items-center justify-between">
          <div className="flex items-center">
            <MapPin className="h-5 w-5 mr-2" />
            Mapa de Rutas Históricas
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowRoutes(!showRoutes)}
              className={`px-3 py-1 rounded text-xs transition-colors ${
                showRoutes 
                  ? 'bg-purple-600 text-white' 
                  : 'bg-gray-700 text-gray-300'
              }`}
            >
              Rutas
            </button>
            <Badge variant="outline" className="text-xs">
              {history.length} rutas
            </Badge>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative bg-gray-800 rounded-lg overflow-hidden" style={{ height: '400px' }}>
          {/* Fondo del mapa mejorado */}
          <div 
            className="absolute inset-0 bg-gradient-to-br from-gray-700 to-gray-900"
            style={{
              backgroundImage: `
                radial-gradient(circle at 25% 25%, #374151 0%, transparent 50%),
                radial-gradient(circle at 75% 75%, #4B5563 0%, transparent 50%),
                linear-gradient(45deg, #1F2937 25%, transparent 25%),
                linear-gradient(-45deg, #1F2937 25%, transparent 25%)
              `,
              backgroundSize: '40px 40px, 40px 40px, 20px 20px, 20px 20px'
            }}
          />

          {/* Grid de calles */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
              <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                <path d="M 10 0 L 0 0 0 10" fill="none" stroke="#6B7280" strokeWidth="0.2" opacity="0.5"/>
              </pattern>
            </defs>
            <rect width="100" height="100" fill="url(#grid)" />
            
            {/* Calles principales */}
            <g stroke="#9CA3AF" strokeWidth="0.3" fill="none" opacity="0.7">
              <line x1="0" y1="25" x2="100" y2="25" />
              <line x1="0" y1="50" x2="100" y2="50" />
              <line x1="0" y1="75" x2="100" y2="75" />
              <line x1="25" y1="0" x2="25" y2="100" />
              <line x1="50" y1="0" x2="50" y2="100" />
              <line x1="75" y1="0" x2="75" y2="100" />
            </g>

            {/* Rutas históricas */}
            {showRoutes && history.map((h, index) => {
              const isSelected = selectedHistory?.vehicleId === h.vehicleId;
              const routeColor = isSelected ? '#8B5CF6' : ['#3B82F6', '#10B981', '#F59E0B'][index % 3];
              const opacity = isSelected ? 1 : 0.6;
              
              // Generar puntos de ruta basados en datos simulados
              const routePoints = Array.from({ length: 8 }, (_, i) => [
                10 + i * 10 + Math.sin(i) * 5,
                20 + index * 15 + Math.cos(i) * 8
              ]);
              
              const pathData = `M ${routePoints[0][0]} ${routePoints[0][1]} ${
                routePoints.slice(1).map(p => `L ${p[0]} ${p[1]}`).join(' ')
              }`;

              return (
                <g key={index}>
                  {/* Ruta principal */}
                  <path
                    d={pathData}
                    stroke={routeColor}
                    strokeWidth={isSelected ? '1.2' : '0.8'}
                    fill="none"
                    opacity={opacity}
                    strokeDasharray={isSelected ? '0' : '4,2'}
                  />
                  
                  {/* Puntos de parada */}
                  {routePoints.map((point, pointIndex) => (
                    <g key={pointIndex}>
                      <circle
                        cx={point[0]}
                        cy={point[1]}
                        r={isSelected ? '1' : '0.6'}
                        fill={routeColor}
                        opacity={opacity}
                      />
                      {/* Animación en puntos seleccionados */}
                      {isSelected && (
                        <circle
                          cx={point[0]}
                          cy={point[1]}
                          r="1"
                          fill="none"
                          stroke={routeColor}
                          strokeWidth="0.5"
                          opacity="0.8"
                        >
                          <animate
                            attributeName="r"
                            values="1;3;1"
                            dur="3s"
                            begin={`${pointIndex * 0.5}s`}
                            repeatCount="indefinite"
                          />
                        </circle>
                      )}
                    </g>
                  ))}
                  
                  {/* Marcador de inicio */}
                  <circle
                    cx={routePoints[0][0]}
                    cy={routePoints[0][1]}
                    r="1.5"
                    fill="#10B981"
                    stroke="#ffffff"
                    strokeWidth="0.5"
                  />
                  
                  {/* Marcador de fin */}
                  <circle
                    cx={routePoints[routePoints.length - 1][0]}
                    cy={routePoints[routePoints.length - 1][1]}
                    r="1.5"
                    fill="#EF4444"
                    stroke="#ffffff"
                    strokeWidth="0.5"
                  />
                </g>
              );
            })}
          </svg>

          {/* Información de ruta seleccionada */}
          {selectedHistory && (
            <div className="absolute top-4 left-4 bg-gray-900/95 backdrop-blur-sm rounded-lg p-4 max-w-sm border border-purple-500/30">
              <h4 className="text-purple-300 font-semibold mb-2 flex items-center">
                <MapPin className="h-4 w-4 mr-1" />
                Ruta Seleccionada
              </h4>
              <div className="space-y-1 text-sm text-gray-300">
                <p><span className="text-gray-400">Puntos:</span> {selectedHistory.locations.length}</p>
                <p><span className="text-gray-400">Distancia:</span> {selectedHistory.totalDistance.toFixed(1)} km</p>
                <p><span className="text-gray-400">Tiempo:</span> {Math.floor(selectedHistory.totalTime / 60)}h {selectedHistory.totalTime % 60}m</p>
                <p><span className="text-gray-400">Vel. Promedio:</span> {selectedHistory.averageSpeed.toFixed(0)} km/h</p>
                <p><span className="text-gray-400">Paradas:</span> {selectedHistory.stops.length}</p>
              </div>
            </div>
          )}

          {/* Leyenda */}
          <div className="absolute bottom-4 left-4 bg-gray-900/90 backdrop-blur-sm rounded-lg p-3 text-xs text-gray-300">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span>Inicio</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span>Fin</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                <span>Seleccionada</span>
              </div>
            </div>
          </div>

          {/* Controles de zoom simulados */}
          <div className="absolute top-4 right-4 flex flex-col space-y-1">
            <button className="bg-gray-700 hover:bg-gray-600 text-white w-8 h-8 rounded flex items-center justify-center text-lg font-bold">
              +
            </button>
            <button className="bg-gray-700 hover:bg-gray-600 text-white w-8 h-8 rounded flex items-center justify-center text-lg font-bold">
              −
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface LocationStatsProps {
  history: LocationHistory[];
}

export function LocationStats({ history }: LocationStatsProps) {
  const totalDistance = history.reduce((acc, h) => acc + h.totalDistance, 0);
  const totalTime = history.reduce((acc, h) => acc + h.totalTime, 0);
  const maxSpeed = Math.max(...history.map(h => h.maxSpeed));
  const avgSpeed = history.length > 0 ? history.reduce((acc, h) => acc + h.averageSpeed, 0) / history.length : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <Card className="bg-gray-900 border-gray-800">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Distancia Total</p>
              <p className="text-2xl font-bold text-gray-100">
                {totalDistance.toFixed(1)} km
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
              <p className="text-gray-400 text-sm">Tiempo Total</p>
              <p className="text-2xl font-bold text-gray-100">
                {Math.floor(totalTime / 60)}h {totalTime % 60}m
              </p>
            </div>
            <Clock className="h-8 w-8 text-green-400" />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gray-900 border-gray-800">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Velocidad Promedio</p>
              <p className="text-2xl font-bold text-gray-100">
                {avgSpeed.toFixed(0)} km/h
              </p>
            </div>
            <TrendingUp className="h-8 w-8 text-purple-400" />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gray-900 border-gray-800">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Velocidad Máxima</p>
              <p className="text-2xl font-bold text-gray-100">
                {maxSpeed.toFixed(0)} km/h
              </p>
            </div>
            <TrendingUp className="h-8 w-8 text-red-400" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

interface LocationHistoryTableProps {
  history: LocationHistory[];
  vehicles: Vehicle[];
  onSelectHistory: (history: LocationHistory) => void;
}

export function LocationHistoryTable({ history, vehicles, onSelectHistory }: LocationHistoryTableProps) {
  const getVehicleInfo = (vehicleId: string) => {
    const vehicle = vehicles.find(v => v.id === vehicleId);
    return vehicle ? `${vehicle.plate} - ${vehicle.model}` : vehicleId;
  };

  return (
    <Card className="bg-gray-900 border-gray-800">
      <CardHeader>
        <CardTitle className="text-gray-100">Historial de Ubicaciones</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-800">
                <th className="text-left text-gray-300 py-3 px-4">Vehículo</th>
                <th className="text-left text-gray-300 py-3 px-4">Distancia</th>
                <th className="text-left text-gray-300 py-3 px-4">Tiempo</th>
                <th className="text-left text-gray-300 py-3 px-4">Vel. Promedio</th>
                <th className="text-left text-gray-300 py-3 px-4">Vel. Máxima</th>
                <th className="text-left text-gray-300 py-3 px-4">Paradas</th>
                <th className="text-left text-gray-300 py-3 px-4">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {history.map((h) => (
                <tr key={h.vehicleId} className="border-b border-gray-800 hover:bg-gray-800/30">
                  <td className="py-3 px-4">
                    <div className="text-gray-100 font-medium">
                      {getVehicleInfo(h.vehicleId)}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-gray-300">
                    {h.totalDistance.toFixed(1)} km
                  </td>
                  <td className="py-3 px-4 text-gray-300">
                    {Math.floor(h.totalTime / 60)}h {h.totalTime % 60}m
                  </td>
                  <td className="py-3 px-4 text-gray-300">
                    {h.averageSpeed.toFixed(0)} km/h
                  </td>
                  <td className="py-3 px-4">
                    <Badge variant={h.maxSpeed > 60 ? 'destructive' : 'default'}>
                      {h.maxSpeed.toFixed(0)} km/h
                    </Badge>
                  </td>
                  <td className="py-3 px-4 text-gray-300">
                    {h.stops.length}
                  </td>
                  <td className="py-3 px-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onSelectHistory(h)}
                      className="bg-gray-800 border-gray-700 text-blue-400 hover:bg-gray-700"
                    >
                      Ver Ruta
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
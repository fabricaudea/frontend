'use client';

import { useEffect, useState } from 'react';
import { MapPin, Navigation, Clock, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { VehicleTracking, SpeedAlert } from '@/lib/models/tracking';

interface RealTimeMapProps {
  vehicles: VehicleTracking[];
  selectedVehicle?: VehicleTracking | null;
  onVehicleSelect: (vehicle: VehicleTracking) => void;
}

export function RealTimeMap({ vehicles, selectedVehicle, onVehicleSelect }: RealTimeMapProps) {
  const [animationPhase, setAnimationPhase] = useState(0);

  // Animación de rutas cada 3 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationPhase(prev => (prev + 1) % 4);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Card className="bg-gray-900 border-gray-800">
      <CardHeader>
        <CardTitle className="text-gray-100 flex items-center">
          <MapPin className="h-5 w-5 mr-2" />
          Mapa en Tiempo Real
          <Badge className="ml-auto bg-green-600">
            GPS Activo
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative bg-gray-800 rounded-lg overflow-hidden" style={{ height: '500px' }}>
          {/* Imagen de fondo de mapa */}
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-30"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1000 600'%3E%3Cpath d='M0,200 Q250,100 500,200 T1000,200 L1000,600 L0,600 Z' fill='%23374151'/%3E%3Cpath d='M0,300 Q250,250 500,300 T1000,300 L1000,600 L0,600 Z' fill='%234B5563'/%3E%3C/svg%3E")`
            }}
          />
          
          {/* Líneas de calles simuladas */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            {/* Red de calles */}
            <g stroke="#6B7280" strokeWidth="0.2" fill="none" opacity="0.6">
              <line x1="0" y1="20" x2="100" y2="20" />
              <line x1="0" y1="40" x2="100" y2="40" />
              <line x1="0" y1="60" x2="100" y2="60" />
              <line x1="0" y1="80" x2="100" y2="80" />
              <line x1="20" y1="0" x2="20" y2="100" />
              <line x1="40" y1="0" x2="40" y2="100" />
              <line x1="60" y1="0" x2="60" y2="100" />
              <line x1="80" y1="0" x2="80" y2="100" />
            </g>
            
            {/* Rutas de vehículos animadas */}
            {vehicles.map((vehicle, index) => {
              const isSelected = selectedVehicle?.vehicleId === vehicle.vehicleId;
              const baseX = 20 + index * 25;
              const baseY = 30 + index * 15;
              
              // Calcular puntos de ruta
              const routePoints = [
                [baseX - 10, baseY + 20],
                [baseX - 5, baseY + 10],
                [baseX, baseY],
                [baseX + 5, baseY - 5],
                [baseX + 10, baseY - 10]
              ];
              
              const pathData = `M ${routePoints[0][0]} ${routePoints[0][1]} ${routePoints.slice(1).map(p => `L ${p[0]} ${p[1]}`).join(' ')}`;
              
              return (
                <g key={vehicle.vehicleId}>
                  {/* Ruta completa */}
                  <path
                    d={pathData}
                    stroke={isSelected ? '#8B5CF6' : '#6B7280'}
                    strokeWidth={isSelected ? '0.8' : '0.4'}
                    fill="none"
                    strokeDasharray={isSelected ? '0' : '2,2'}
                    opacity={isSelected ? 1 : 0.6}
                  />
                  
                  {/* Puntos de ruta */}
                  {routePoints.map((point, pointIndex) => (
                    <circle
                      key={pointIndex}
                      cx={point[0]}
                      cy={point[1]}
                      r="0.5"
                      fill={isSelected ? '#8B5CF6' : '#9CA3AF'}
                      opacity={pointIndex <= animationPhase ? 1 : 0.3}
                    />
                  ))}
                  
                  {/* Animación de movimiento */}
                  {isSelected && (
                    <circle
                      cx={routePoints[Math.min(animationPhase, routePoints.length - 1)][0]}
                      cy={routePoints[Math.min(animationPhase, routePoints.length - 1)][1]}
                      r="1"
                      fill="#8B5CF6"
                      opacity="0.8"
                    >
                      <animate
                        attributeName="r"
                        values="1;2;1"
                        dur="2s"
                        repeatCount="indefinite"
                      />
                    </circle>
                  )}
                </g>
              );
            })}
          </svg>
          
          {/* Marcadores de vehículos */}
          <div className="absolute inset-0">
            {vehicles.map((vehicle, index) => {
              const isSelected = selectedVehicle?.vehicleId === vehicle.vehicleId;
              const hasAlert = vehicle.currentLocation && vehicle.currentLocation.speed > 50;
              
              return (
                <button
                  key={vehicle.vehicleId}
                  onClick={() => onVehicleSelect(vehicle)}
                  className={`absolute transform -translate-x-1/2 -translate-y-1/2 p-2 rounded-full transition-all duration-300 ${
                    isSelected
                      ? 'bg-purple-500 ring-4 ring-purple-300 scale-125 z-20'
                      : hasAlert
                      ? 'bg-red-500 ring-2 ring-red-300 animate-pulse z-10'
                      : 'bg-blue-500 hover:bg-blue-400 z-10'
                  }`}
                  style={{
                    left: `${20 + index * 25}%`,
                    top: `${30 + index * 15}%`
                  }}
                  title={`${vehicle.vehiclePlate} - ${vehicle.currentLocation?.speed.toFixed(0) || 0} km/h`}
                >
                  <MapPin className="h-4 w-4 text-white" />
                  
                  {/* Indicador de velocidad */}
                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                    {vehicle.vehiclePlate}
                    <div className="text-yellow-400">
                      {vehicle.currentLocation?.speed.toFixed(0) || 0} km/h
                    </div>
                  </div>
                  
                  {/* Animación de alerta */}
                  {hasAlert && (
                    <div className="absolute -inset-2 border-2 border-red-400 rounded-full animate-ping" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Leyenda */}
          <div className="absolute bottom-4 left-4 bg-gray-900/90 backdrop-blur-sm rounded-lg p-3 text-xs text-gray-300">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span>Normal</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                <span>Alerta</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                <span>Seleccionado</span>
              </div>
            </div>
          </div>

          {/* Botón para integrar Google Maps */}
          <div className="absolute top-4 right-4">
            <button 
              className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-sm flex items-center space-x-2"
              onClick={() => window.open('https://maps.google.com', '_blank')}
            >
              <MapPin className="h-4 w-4" />
              <span>Ver en Google Maps</span>
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface VehicleInfoPanelProps {
  vehicle: VehicleTracking | null;
  alerts: SpeedAlert[];
}

export function VehicleInfoPanel({ vehicle, alerts }: VehicleInfoPanelProps) {
  if (!vehicle) {
    return (
      <Card className="bg-gray-900 border-gray-800">
        <CardContent className="p-6">
          <div className="text-center text-gray-400">
            <Navigation className="h-12 w-12 mx-auto mb-4" />
            <p>Selecciona un vehículo en el mapa para ver su información</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const vehicleAlerts = alerts.filter(alert => alert.vehicleId === vehicle.vehicleId);
  const hasSpeedAlert = vehicleAlerts.some(alert => !alert.acknowledged);

  return (
    <Card className="bg-gray-900 border-gray-800">
      <CardHeader>
        <CardTitle className="text-gray-100 flex items-center justify-between">
          <span>Información del Vehículo</span>
          <Badge 
            variant={vehicle.isOnline ? 'default' : 'secondary'}
            className={vehicle.isOnline ? 'bg-green-600' : 'bg-gray-600'}
          >
            {vehicle.isOnline ? 'En línea' : 'Desconectado'}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-gray-400">Placa</label>
            <p className="text-lg font-semibold text-gray-100">{vehicle.vehiclePlate}</p>
          </div>
          <div>
            <label className="text-sm text-gray-400">Modelo</label>
            <p className="text-lg font-semibold text-gray-100">{vehicle.vehicleModel}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-gray-400">Estado</label>
            <p className="text-lg font-semibold text-gray-100 capitalize">{vehicle.status}</p>
          </div>
          <div>
            <label className="text-sm text-gray-400">Velocidad Registrada</label>
            <p className={`text-lg font-semibold ${hasSpeedAlert ? 'text-red-400' : 'text-gray-100'}`}>
              {vehicle.currentLocation?.speed.toFixed(0) || 0} km/h
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-gray-400">Hora Salida</label>
            <p className="text-lg font-semibold text-gray-100">9:30 AM</p>
          </div>
          <div>
            <label className="text-sm text-gray-400">Hora Llegada</label>
            <p className="text-lg font-semibold text-gray-100">2:00 PM</p>
          </div>
        </div>

        {hasSpeedAlert && (
          <div className="bg-red-900/20 border border-red-900/50 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="h-5 w-5 text-red-400 mt-0.5" />
              <div className="flex-1">
                <h4 className="text-red-400 font-semibold mb-1">
                  El vehículo ha superado el límite permitido
                </h4>
                <p className="text-red-300 text-sm mb-2">
                  de {vehicle.speedLimit} km/h en zona urbana.
                </p>
                <p className="text-red-300 text-sm mb-2">
                  Velocidad registrada: {vehicle.currentLocation?.speed.toFixed(0)} km/h
                </p>
                <p className="text-red-300 text-sm">
                  Ubicación: Calle 111b Boyacá/Medellín
                </p>
                <p className="text-red-300 text-sm">
                  Fecha y hora: {new Date().toLocaleDateString()} - {new Date().toLocaleTimeString()}
                </p>
              </div>
            </div>
          </div>
        )}

        <div>
          <label className="text-sm text-gray-400 flex items-center">
            <Clock className="h-4 w-4 mr-1" />
            Última actualización
          </label>
          <p className="text-sm text-gray-300">
            {vehicle.lastUpdate ? new Date(vehicle.lastUpdate).toLocaleTimeString() : 'N/A'}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
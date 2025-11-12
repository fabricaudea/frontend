// Versión con Mapbox - Más fácil de implementar
// npm install mapbox-gl react-map-gl

import React, { useState, useCallback } from 'react';
import Map, { Marker, Source, Layer, NavigationControl } from 'react-map-gl';
import { VehicleTracking } from '@/lib/models/tracking';
import 'mapbox-gl/dist/mapbox-gl.css';

interface MapboxComponentProps {
  vehicles: VehicleTracking[];
  selectedVehicle?: VehicleTracking | null;
  onVehicleSelect: (vehicle: VehicleTracking) => void;
}

export function MapboxComponent({ vehicles, selectedVehicle, onVehicleSelect }: MapboxComponentProps) {
  const [viewState, setViewState] = useState({
    longitude: -74.0817,
    latitude: 4.6097,
    zoom: 12
  });

  // Simular ruta para el vehículo seleccionado
  const getRouteData = useCallback(() => {
    if (!selectedVehicle?.currentLocation) return null;

    const { latitude, longitude } = selectedVehicle.currentLocation;
    
    // Generar puntos de ruta simulados
    const route = {
      type: 'Feature' as const,
      properties: {},
      geometry: {
        type: 'LineString' as const,
        coordinates: [
          [longitude - 0.01, latitude - 0.01],
          [longitude - 0.005, latitude - 0.005],
          [longitude - 0.002, latitude],
          [longitude, latitude]
        ]
      }
    };

    return {
      type: 'FeatureCollection' as const,
      features: [route]
    };
  }, [selectedVehicle]);

  const routeLayerStyle = {
    id: 'route',
    type: 'line' as const,
    layout: {
      'line-join': 'round',
      'line-cap': 'round'
    },
    paint: {
      'line-color': '#4F46E5',
      'line-width': 4,
      'line-opacity': 0.8
    }
  };

  return (
    <div className="w-full h-full rounded-lg overflow-hidden">
      <Map
        {...viewState}
        onMove={evt => setViewState(evt.viewState)}
        style={{ width: '100%', height: '500px' }}
        mapStyle="mapbox://styles/mapbox/dark-v11" // Tema oscuro
        mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || 'pk.demo_token'}
      >
        {/* Controles de navegación */}
        <NavigationControl position="top-right" />

        {/* Marcadores de vehículos */}
        {vehicles
          .filter(vehicle => vehicle.currentLocation)
          .map(vehicle => (
            <Marker
              key={vehicle.vehicleId}
              longitude={vehicle.currentLocation!.longitude}
              latitude={vehicle.currentLocation!.latitude}
              onClick={() => onVehicleSelect(vehicle)}
            >
              <div
                className={`w-8 h-8 rounded-full border-2 border-white cursor-pointer transform transition-transform hover:scale-110 ${
                  selectedVehicle?.vehicleId === vehicle.vehicleId
                    ? 'bg-blue-500 scale-125'
                    : 'bg-red-500'
                }`}
                title={`${vehicle.vehiclePlate} - ${vehicle.vehicleModel}`}
              />
            </Marker>
          ))}

        {/* Ruta del vehículo seleccionado */}
        {getRouteData() && (
          <Source id="route-source" type="geojson" data={getRouteData()!}>
            <Layer {...routeLayerStyle} />
          </Source>
        )}
      </Map>
    </div>
  );
}
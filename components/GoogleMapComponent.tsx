// Instalación requerida:
// npm install @googlemaps/js-api-loader

import { useEffect, useRef, useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import { VehicleTracking } from '@/lib/models/tracking';

interface GoogleMapComponentProps {
  vehicles: VehicleTracking[];
  selectedVehicle?: VehicleTracking | null;
  onVehicleSelect: (vehicle: VehicleTracking) => void;
}

export function GoogleMapComponent({ vehicles, selectedVehicle, onVehicleSelect }: GoogleMapComponentProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [markers, setMarkers] = useState<google.maps.Marker[]>([]);
  const [directionsService, setDirectionsService] = useState<google.maps.DirectionsService | null>(null);
  const [directionsRenderer, setDirectionsRenderer] = useState<google.maps.DirectionsRenderer | null>(null);

  // Configuración del mapa
  useEffect(() => {
    const initMap = async () => {
      const loader = new Loader({
        apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || 'TU_API_KEY_AQUI',
        version: 'weekly',
        libraries: ['places', 'geometry']
      });

      try {
        await loader.load();
        
        if (mapRef.current) {
          const mapInstance = new google.maps.Map(mapRef.current, {
            center: { lat: 4.6097, lng: -74.0817 }, // Bogotá
            zoom: 12,
            mapTypeId: 'roadmap',
            styles: [
              // Estilo oscuro para coincidir con tu UI
              {
                "elementType": "geometry",
                "stylers": [{ "color": "#242f3e" }]
              },
              {
                "elementType": "labels.text.stroke",
                "stylers": [{ "color": "#242f3e" }]
              },
              {
                "elementType": "labels.text.fill",
                "stylers": [{ "color": "#746855" }]
              }
            ]
          });

          setMap(mapInstance);
          setDirectionsService(new google.maps.DirectionsService());
          setDirectionsRenderer(new google.maps.DirectionsRenderer({
            suppressMarkers: false,
            polylineOptions: {
              strokeColor: '#4F46E5', // Color de la ruta
              strokeWeight: 4,
              strokeOpacity: 0.8
            }
          }));
        }
      } catch (error) {
        console.error('Error loading Google Maps:', error);
      }
    };

    initMap();
  }, []);

  // Actualizar marcadores de vehículos
  useEffect(() => {
    if (!map) return;

    // Limpiar marcadores existentes
    markers.forEach(marker => marker.setMap(null));

    // Crear nuevos marcadores
    const newMarkers = vehicles
      .filter(vehicle => vehicle.currentLocation)
      .map(vehicle => {
        const position = {
          lat: vehicle.currentLocation!.latitude,
          lng: vehicle.currentLocation!.longitude
        };

        const marker = new google.maps.Marker({
          position,
          map,
          title: `${vehicle.vehiclePlate} - ${vehicle.vehicleModel}`,
          icon: {
            url: selectedVehicle?.vehicleId === vehicle.vehicleId 
              ? 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="16" cy="16" r="12" fill="#3B82F6" stroke="#ffffff" stroke-width="3"/>
                  <circle cx="16" cy="16" r="6" fill="#ffffff"/>
                </svg>
              `)
              : 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="16" cy="16" r="12" fill="#EF4444" stroke="#ffffff" stroke-width="3"/>
                  <circle cx="16" cy="16" r="6" fill="#ffffff"/>
                </svg>
              `),
            scaledSize: new google.maps.Size(32, 32),
            anchor: new google.maps.Point(16, 16)
          }
        });

        // Click event para seleccionar vehículo
        marker.addListener('click', () => {
          onVehicleSelect(vehicle);
        });

        return marker;
      });

    setMarkers(newMarkers);
  }, [map, vehicles, selectedVehicle, onVehicleSelect]);

  // Mostrar ruta del vehículo seleccionado
  useEffect(() => {
    if (!map || !directionsService || !directionsRenderer || !selectedVehicle?.currentLocation) {
      return;
    }

    // Simular puntos de ruta (en producción vendrían del historial)
    const waypoints = [
      { lat: selectedVehicle.currentLocation.latitude - 0.01, lng: selectedVehicle.currentLocation.longitude - 0.01 },
      { lat: selectedVehicle.currentLocation.latitude - 0.005, lng: selectedVehicle.currentLocation.longitude },
      { lat: selectedVehicle.currentLocation.latitude, lng: selectedVehicle.currentLocation.longitude }
    ];

    const request: google.maps.DirectionsRequest = {
      origin: waypoints[0],
      destination: waypoints[waypoints.length - 1],
      waypoints: waypoints.slice(1, -1).map(point => ({ location: point })),
      travelMode: google.maps.TravelMode.DRIVING,
      optimizeWaypoints: true
    };

    directionsService.route(request, (result, status) => {
      if (status === 'OK' && result) {
        directionsRenderer.setDirections(result);
        directionsRenderer.setMap(map);
      }
    });

    return () => {
      directionsRenderer.setMap(null);
    };
  }, [map, directionsService, directionsRenderer, selectedVehicle]);

  return (
    <div className="w-full h-full">
      <div 
        ref={mapRef} 
        className="w-full h-full rounded-lg"
        style={{ minHeight: '500px' }}
      />
    </div>
  );
}

// Hook para cargar Google Maps de forma segura
export function useGoogleMaps() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    const loadGoogleMaps = async () => {
      try {
        const loader = new Loader({
          apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
          version: 'weekly',
          libraries: ['places', 'geometry']
        });

        await loader.load();
        setIsLoaded(true);
      } catch (error) {
        setLoadError('Error loading Google Maps API');
        console.error('Google Maps loading error:', error);
      }
    };

    if (!isLoaded && !loadError) {
      loadGoogleMaps();
    }
  }, [isLoaded, loadError]);

  return { isLoaded, loadError };
}
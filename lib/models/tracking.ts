// Modelos para tracking GPS y monitoreo en tiempo real

export interface GpsLocation {
  id: string;
  vehicleId: string;
  latitude: number;
  longitude: number;
  speed: number; // km/h
  direction: number; // grados (0-360)
  timestamp: string;
  altitude?: number;
  accuracy?: number;
}

export interface VehicleTracking {
  vehicleId: string;
  vehiclePlate: string;
  vehicleModel: string;
  currentLocation: GpsLocation | null;
  isOnline: boolean;
  lastUpdate: string;
  status: 'active' | 'inactive' | 'maintenance';
  speedLimit: number; // km/h
}

export interface SpeedAlert {
  id: string;
  vehicleId: string;
  vehiclePlate: string;
  currentSpeed: number;
  speedLimit: number;
  location: {
    latitude: number;
    longitude: number;
    address?: string;
  };
  timestamp: string;
  severity: 'warning' | 'critical';
  acknowledged: boolean;
}

export interface LocationHistory {
  vehicleId: string;
  locations: GpsLocation[];
  totalDistance: number; // km
  averageSpeed: number; // km/h
  maxSpeed: number; // km/h
  totalTime: number; // minutos
  stops: LocationStop[];
}

export interface LocationStop {
  id: string;
  startTime: string;
  endTime: string;
  duration: number; // minutos
  location: {
    latitude: number;
    longitude: number;
    address?: string;
  };
}

export interface TrackingFilters {
  vehicleId?: string;
  startDate: string;
  endDate: string;
  speedMin?: number;
  speedMax?: number;
}

export interface DashboardStats {
  totalVehicles: number;
  activeVehicles: number;
  averageSpeed: number;
  totalAlerts: number;
  criticalAlerts: number;
}
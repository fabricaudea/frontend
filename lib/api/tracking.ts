import { 
  GpsLocation, 
  VehicleTracking, 
  SpeedAlert, 
  LocationHistory, 
  LocationStop,
  TrackingFilters,
  DashboardStats
} from '@/lib/models/tracking';

// Mock data para tracking GPS
const MOCK_GPS_LOCATIONS: GpsLocation[] = [
  {
    id: '1',
    vehicleId: '1',
    latitude: 4.6097,
    longitude: -74.0817,
    speed: 45,
    direction: 120,
    timestamp: new Date().toISOString(),
    altitude: 2640,
    accuracy: 5
  },
  {
    id: '2',
    vehicleId: '2',
    latitude: 4.6127,
    longitude: -74.0723,
    speed: 32,
    direction: 90,
    timestamp: new Date().toISOString(),
    altitude: 2635,
    accuracy: 4
  },
  {
    id: '3',
    vehicleId: '3',
    latitude: 4.6156,
    longitude: -74.0632,
    speed: 54,
    direction: 180,
    timestamp: new Date().toISOString(),
    altitude: 2645,
    accuracy: 6
  }
];

const MOCK_VEHICLE_TRACKING: VehicleTracking[] = [
  {
    vehicleId: '1',
    vehiclePlate: 'ABC123',
    vehicleModel: 'Chevrolet Burstón NGR',
    currentLocation: MOCK_GPS_LOCATIONS[0],
    isOnline: true,
    lastUpdate: new Date().toISOString(),
    status: 'active',
    speedLimit: 50
  },
  {
    vehicleId: '2',
    vehiclePlate: 'DEF456',
    vehicleModel: 'Toyota Coaster',
    currentLocation: MOCK_GPS_LOCATIONS[1],
    isOnline: true,
    lastUpdate: new Date().toISOString(),
    status: 'active',
    speedLimit: 50
  },
  {
    vehicleId: '3',
    vehiclePlate: 'GUH045',
    vehicleModel: 'Volvo B8R',
    currentLocation: MOCK_GPS_LOCATIONS[2],
    isOnline: true,
    lastUpdate: new Date().toISOString(),
    status: 'active',
    speedLimit: 50
  }
];

const MOCK_SPEED_ALERTS: SpeedAlert[] = [
  {
    id: '1',
    vehicleId: '3',
    vehiclePlate: 'GUH045',
    currentSpeed: 54,
    speedLimit: 50,
    location: {
      latitude: 4.6156,
      longitude: -74.0632,
      address: 'Calle 111b Boyacá/Medellín'
    },
    timestamp: new Date().toISOString(),
    severity: 'warning',
    acknowledged: false
  }
];

// Simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// API functions
export async function getVehicleTracking(): Promise<VehicleTracking[]> {
  await delay(300);
  
  // Simulate real-time updates
  return MOCK_VEHICLE_TRACKING.map(vehicle => ({
    ...vehicle,
    currentLocation: vehicle.currentLocation ? {
      ...vehicle.currentLocation,
      speed: Math.max(0, vehicle.currentLocation.speed + (Math.random() - 0.5) * 10),
      timestamp: new Date().toISOString()
    } : null,
    lastUpdate: new Date().toISOString()
  }));
}

export async function getVehicleTrackingById(vehicleId: string): Promise<VehicleTracking | null> {
  await delay(200);
  
  const vehicle = MOCK_VEHICLE_TRACKING.find(v => v.vehicleId === vehicleId);
  if (!vehicle) return null;
  
  return {
    ...vehicle,
    currentLocation: vehicle.currentLocation ? {
      ...vehicle.currentLocation,
      speed: Math.max(0, vehicle.currentLocation.speed + (Math.random() - 0.5) * 10),
      timestamp: new Date().toISOString()
    } : null,
    lastUpdate: new Date().toISOString()
  };
}

export async function getSpeedAlerts(): Promise<SpeedAlert[]> {
  await delay(250);
  return [...MOCK_SPEED_ALERTS];
}

export async function acknowledgeAlert(alertId: string): Promise<void> {
  await delay(200);
  
  const alert = MOCK_SPEED_ALERTS.find(a => a.id === alertId);
  if (alert) {
    alert.acknowledged = true;
  }
}

export async function getLocationHistory(filters: TrackingFilters): Promise<LocationHistory[]> {
  await delay(400);
  
  // Generate mock historical data
  const generateHistory = (vehicleId: string): GpsLocation[] => {
    const history: GpsLocation[] = [];
    const baseLocation = MOCK_GPS_LOCATIONS.find(l => l.vehicleId === vehicleId);
    
    if (!baseLocation) return [];
    
    for (let i = 0; i < 50; i++) {
      history.push({
        id: `${vehicleId}-${i}`,
        vehicleId,
        latitude: baseLocation.latitude + (Math.random() - 0.5) * 0.02,
        longitude: baseLocation.longitude + (Math.random() - 0.5) * 0.02,
        speed: Math.max(0, 40 + (Math.random() - 0.5) * 30),
        direction: Math.random() * 360,
        timestamp: new Date(Date.now() - i * 60000).toISOString(), // cada minuto hacia atrás
        altitude: (baseLocation.altitude || 2640) + (Math.random() - 0.5) * 20,
        accuracy: 3 + Math.random() * 5
      });
    }
    
    return history.reverse(); // orden cronológico
  };
  
  const vehicleIds = filters.vehicleId ? [filters.vehicleId] : ['1', '2', '3'];
  
  return vehicleIds.map(vehicleId => {
    const locations = generateHistory(vehicleId);
    const speeds = locations.map(l => l.speed);
    
    return {
      vehicleId,
      locations,
      totalDistance: Math.random() * 100 + 50, // km
      averageSpeed: speeds.reduce((a, b) => a + b, 0) / speeds.length,
      maxSpeed: Math.max(...speeds),
      totalTime: locations.length, // minutos
      stops: [
        {
          id: `stop-${vehicleId}-1`,
          startTime: new Date(Date.now() - 120000).toISOString(),
          endTime: new Date(Date.now() - 60000).toISOString(),
          duration: 60,
          location: {
            latitude: locations[10]?.latitude || 0,
            longitude: locations[10]?.longitude || 0,
            address: 'Parada comercial'
          }
        }
      ]
    };
  });
}

export async function getDashboardStats(): Promise<DashboardStats> {
  await delay(300);
  
  return {
    totalVehicles: MOCK_VEHICLE_TRACKING.length,
    activeVehicles: MOCK_VEHICLE_TRACKING.filter(v => v.isOnline).length,
    averageSpeed: MOCK_VEHICLE_TRACKING.reduce((acc, v) => acc + (v.currentLocation?.speed || 0), 0) / MOCK_VEHICLE_TRACKING.length,
    totalAlerts: MOCK_SPEED_ALERTS.length,
    criticalAlerts: MOCK_SPEED_ALERTS.filter(a => a.severity === 'critical').length
  };
}
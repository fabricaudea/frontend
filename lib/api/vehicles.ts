import { Vehicle, VehicleCreate, VehicleUpdate } from '@/lib/models/vehicle';

// Mock data for development
const MOCK_VEHICLES: Vehicle[] = [
  {
    id: '1',
    plate: 'ABC123',
    model: 'Chevrolet Burstón NGR',
    capacity: 40,
    status: 'active',
  },
  {
    id: '2',
    plate: 'DEF456',
    model: 'Toyota Coaster',
    capacity: 32,
    status: 'active',
  },
  {
    id: '3',
    plate: 'GUH045',
    model: 'Volvo B8R',
    capacity: 20,
    status: 'active',
  },
  {
    id: '4',
    plate: 'FGT862',
    model: 'Mercedes-Benz',
    capacity: 20,
    status: 'active',
  },
  {
    id: '5',
    plate: 'KLM934',
    model: 'Isuzu N-Series',
    capacity: 36,
    status: 'active',
  },
  {
    id: '6',
    plate: 'HIJ672',
    model: 'Hino RK',
    capacity: 16,
    status: 'active',
  },
  {
    id: '7',
    plate: 'YUP073',
    model: 'Volvo B340M',
    capacity: 32,
    status: 'inactive',
  },
];

// Simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Simulate random errors (optional)
const shouldSimulateError = () => Math.random() < 0.1; // 10% chance

export async function listVehicles(): Promise<Vehicle[]> {
  await delay(Math.random() * 300 + 400); // 400-700ms delay
  
  if (shouldSimulateError()) {
    throw new Error('Failed to fetch vehicles');
  }
  
  return [...MOCK_VEHICLES];
}

export async function createVehicle(payload: VehicleCreate): Promise<Vehicle> {
  await delay(Math.random() * 300 + 400);
  
  if (shouldSimulateError()) {
    throw new Error('Failed to create vehicle');
  }
  
  const newVehicle: Vehicle = {
    id: Math.random().toString(36).substr(2, 9),
    ...payload,
  };
  
  MOCK_VEHICLES.push(newVehicle);
  return newVehicle;
}

export async function updateVehicle(id: string, payload: VehicleUpdate): Promise<Vehicle> {
  await delay(Math.random() * 300 + 400);
  
  if (shouldSimulateError()) {
    throw new Error('Failed to update vehicle');
  }
  
  const index = MOCK_VEHICLES.findIndex(v => v.id === id);
  if (index === -1) {
    throw new Error('Vehicle not found');
  }
  
  MOCK_VEHICLES[index] = { ...MOCK_VEHICLES[index], ...payload };
  return MOCK_VEHICLES[index];
}

export async function deleteVehicle(id: string): Promise<void> {
  await delay(Math.random() * 300 + 400);
  
  if (shouldSimulateError()) {
    throw new Error('Failed to delete vehicle');
  }
  
  const index = MOCK_VEHICLES.findIndex(v => v.id === id);
  if (index === -1) {
    throw new Error('Vehicle not found');
  }
  
  MOCK_VEHICLES.splice(index, 1);
}

export async function getVehicleById(id: string): Promise<Vehicle | null> {
  await delay(Math.random() * 200 + 100);

  const vehicle = MOCK_VEHICLES.find(v => v.id === id) || null;
  return vehicle ? { ...vehicle } : null;
}

export async function findVehicleByPlate(plate: string): Promise<Vehicle | null> {
  await delay(Math.random() * 200 + 100);

  const vehicle = MOCK_VEHICLES.find(v => v.plate.toLowerCase() === plate.toLowerCase()) || null;
  return vehicle ? { ...vehicle } : null;
}

export async function toggleVehicleStatus(id: string): Promise<Vehicle> {
  await delay(Math.random() * 300 + 200);

  const index = MOCK_VEHICLES.findIndex(v => v.id === id);
  if (index === -1) {
    throw new Error('Vehicle not found');
  }

  MOCK_VEHICLES[index].status = MOCK_VEHICLES[index].status === 'active' ? 'inactive' : 'active';
  return { ...MOCK_VEHICLES[index] };
}
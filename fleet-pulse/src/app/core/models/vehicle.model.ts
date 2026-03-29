export type VehicleStatus = 'Active' | 'Idle' | 'Maintenance';

export interface Vehicle {
  id: string;
  name: string;
  registration: string;
  status: VehicleStatus;
  latitude: number;
  longitude: number;
  speed: number; // km/h
  fuelLevel: number; // 0–100 percentage
  driverName: string;
  driverContact: string;
  vehicleType: string; // e.g., "Truck", "Van", "SUV"
  lastUpdated: string; // ISO 8601 timestamp
}

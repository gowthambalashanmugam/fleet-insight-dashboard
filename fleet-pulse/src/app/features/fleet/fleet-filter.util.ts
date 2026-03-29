import { Vehicle, VehicleStatus } from '../../core/models/vehicle.model';

export type FuelLevelRange = 'All' | 'Low' | 'Medium' | 'High' | 'Full';

export interface FleetFilterCriteria {
  searchTerm: string;
  status: VehicleStatus | 'All';
  fuelRange: FuelLevelRange;
  vehicleType: string;
}

export function matchesFuelRange(fuelLevel: number, range: FuelLevelRange): boolean {
  switch (range) {
    case 'All':
      return true;
    case 'Low':
      return fuelLevel >= 0 && fuelLevel <= 25;
    case 'Medium':
      return fuelLevel >= 26 && fuelLevel <= 50;
    case 'High':
      return fuelLevel >= 51 && fuelLevel <= 75;
    case 'Full':
      return fuelLevel >= 76 && fuelLevel <= 100;
  }
}

export function filterVehicles(vehicles: Vehicle[], criteria: FleetFilterCriteria): Vehicle[] {
  return vehicles.filter(vehicle => {
    if (criteria.searchTerm) {
      const term = criteria.searchTerm.toLowerCase();
      const matchesSearch =
        vehicle.name.toLowerCase().includes(term) ||
        vehicle.id.toLowerCase().includes(term) ||
        vehicle.driverName.toLowerCase().includes(term);
      if (!matchesSearch) return false;
    }

    if (criteria.status !== 'All' && vehicle.status !== criteria.status) {
      return false;
    }

    if (criteria.fuelRange !== 'All' && !matchesFuelRange(vehicle.fuelLevel, criteria.fuelRange)) {
      return false;
    }

    if (criteria.vehicleType !== 'All' && vehicle.vehicleType !== criteria.vehicleType) {
      return false;
    }

    return true;
  });
}

export function extractUniqueTypes(vehicles: Vehicle[]): string[] {
  return [...new Set(vehicles.map(v => v.vehicleType))].sort((a, b) => a.localeCompare(b));
}

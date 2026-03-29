import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Vehicle, VehicleStatus } from '../models/vehicle.model';
import { VehicleDataService } from './vehicle-data.service';

const SWEDISH_CITIES: { name: string; lat: number; lng: number }[] = [
  { name: 'Stockholm', lat: 59.33, lng: 18.07 },
  { name: 'Gothenburg', lat: 57.71, lng: 11.97 },
  { name: 'Malmö', lat: 55.6, lng: 13 },
  { name: 'Uppsala', lat: 59.86, lng: 17.64 },
  { name: 'Linköping', lat: 58.41, lng: 15.63 },
  { name: 'Örebro', lat: 59.27, lng: 15.21 },
  { name: 'Västerås', lat: 59.61, lng: 16.55 },
  { name: 'Helsingborg', lat: 56.05, lng: 12.69 },
  { name: 'Norrköping', lat: 58.59, lng: 16.18 },
  { name: 'Jönköping', lat: 57.78, lng: 14.16 },
  { name: 'Umeå', lat: 63.83, lng: 20.26 },
  { name: 'Lund', lat: 55.7, lng: 13.19 },
  { name: 'Borås', lat: 57.72, lng: 12.94 },
  { name: 'Sundsvall', lat: 62.39, lng: 17.31 },
  { name: 'Gävle', lat: 60.67, lng: 17.15 },
  { name: 'Karlstad', lat: 59.38, lng: 13.5 },
  { name: 'Luleå', lat: 65.58, lng: 22.15 },
  { name: 'Växjö', lat: 56.88, lng: 14.81 },
];

const STATUSES: VehicleStatus[] = ['Active', 'Idle', 'Maintenance'];

function buildMockVehicles(): Vehicle[] {
  return SWEDISH_CITIES.map((city, i) => {
    const status = STATUSES[i % STATUSES.length];
    const id = `VH-${String(i + 1).padStart(3, '0')}`;
    return {
      id,
      name: `Truck ${city.name}`,
      registration: `ABC ${100 + i}`,
      status,
      latitude: city.lat + (Math.random() - 0.5) * 0.1,
      longitude: city.lng + (Math.random() - 0.5) * 0.1,
      speed: status === 'Active' ? Math.round(40 + Math.random() * 80) : 0,
      fuelLevel: Math.round(10 + Math.random() * 90),
    };
  });
}

@Injectable()
export class MockVehicleDataService implements VehicleDataService {
  private readonly vehicles = buildMockVehicles();

  getVehicles(): Observable<Vehicle[]> {
    return of(this.vehicles);
  }
}

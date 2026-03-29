import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Trip, TripStatus } from '../models/trip.model';
import { TripDataService } from './trip-data.service';

const DESTINATIONS = [
  'Stockholm', 'Gothenburg', 'Malmö', 'Uppsala', 'Linköping',
  'Örebro', 'Västerås', 'Helsingborg', 'Norrköping', 'Jönköping',
];

const DRIVERS = [
  { name: 'Erik Lindqvist', avatarUrl: 'https://i.pravatar.cc/40?u=erik' },
  { name: 'Anna Svensson', avatarUrl: 'https://i.pravatar.cc/40?u=anna' },
  { name: 'Lars Johansson', avatarUrl: 'https://i.pravatar.cc/40?u=lars' },
  { name: 'Maria Karlsson', avatarUrl: 'https://i.pravatar.cc/40?u=maria' },
  { name: 'Oskar Nilsson', avatarUrl: 'https://i.pravatar.cc/40?u=oskar' },
  { name: 'Sofia Andersson', avatarUrl: 'https://i.pravatar.cc/40?u=sofia' },
  { name: 'Gustav Pettersson', avatarUrl: 'https://i.pravatar.cc/40?u=gustav' },
  { name: 'Elin Bergström', avatarUrl: 'https://i.pravatar.cc/40?u=elin' },
];

const STATUSES: TripStatus[] = ['Ongoing', 'Done', 'Cancelled'];

function buildMockTrips(): Trip[] {
  return Array.from({ length: 10 }, (_, i) => {
    const driver = DRIVERS[i % DRIVERS.length];
    const hours = Math.floor(1 + Math.random() * 5);
    const minutes = Math.floor(Math.random() * 60);
    return {
      id: `TR-${String(i + 1).padStart(3, '0')}`,
      tripNumber: `TRIP-${2024000 + i + 1}`,
      driver,
      vehicle: {
        name: `Truck ${DESTINATIONS[i % DESTINATIONS.length]}`,
        registration: `ABC ${100 + i}`,
      },
      destination: DESTINATIONS[(i + 3) % DESTINATIONS.length],
      duration: `${hours}h ${minutes}m`,
      status: STATUSES[i % STATUSES.length],
    };
  });
}

@Injectable()
export class MockTripDataService implements TripDataService {
  private readonly trips = buildMockTrips();

  getTrips(): Observable<Trip[]> {
    return of(this.trips);
  }
}

import { Vehicle, VehicleStatus } from '../models/vehicle.model';
import { Trip, TripStatus } from '../models/trip.model';
import { Alert, AlertSeverity } from '../models/alert.model';

// ─── Helper Constants ────────────────────────────────────────

export const SWEDISH_CITIES = [
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

export const DRIVERS = [
  { name: 'Erik Lindqvist', avatarUrl: 'https://i.pravatar.cc/40?u=erik' },
  { name: 'Anna Svensson', avatarUrl: 'https://i.pravatar.cc/40?u=anna' },
  { name: 'Lars Johansson', avatarUrl: 'https://i.pravatar.cc/40?u=lars' },
  { name: 'Maria Karlsson', avatarUrl: 'https://i.pravatar.cc/40?u=maria' },
  { name: 'Oskar Nilsson', avatarUrl: 'https://i.pravatar.cc/40?u=oskar' },
  { name: 'Sofia Andersson', avatarUrl: 'https://i.pravatar.cc/40?u=sofia' },
  { name: 'Gustav Pettersson', avatarUrl: 'https://i.pravatar.cc/40?u=gustav' },
  { name: 'Elin Bergström', avatarUrl: 'https://i.pravatar.cc/40?u=elin' },
];

export const V_STATUSES: VehicleStatus[] = ['Active', 'Idle', 'Maintenance'];
export const VEHICLE_TYPES = ['Truck', 'Van', 'SUV', 'Sedan'];

export const DESTINATIONS = [
  'Stockholm', 'Gothenburg', 'Malmö', 'Uppsala', 'Linköping',
  'Örebro', 'Västerås', 'Helsingborg', 'Norrköping', 'Jönköping',
];

export const T_STATUSES: TripStatus[] = ['Ongoing', 'Done', 'Cancelled'];

export const ALERT_LOCATIONS = [
  { lat: 59.35, lng: 18.1, city: 'Stockholm' },
  { lat: 57.7, lng: 11.95, city: 'Gothenburg' },
  { lat: 55.62, lng: 13.02, city: 'Malmö' },
  { lat: 63.82, lng: 20.3, city: 'Umeå' },
  { lat: 65.6, lng: 22.13, city: 'Luleå' },
];

export const A_SEVERITIES: AlertSeverity[] = ['low', 'medium', 'high'];
export const ALERT_TYPES = ['Engine', 'Fuel', 'Speed', 'Maintenance', 'Tire'];
export const MESSAGES = [
  'Engine temperature warning',
  'Low fuel alert',
  'Speeding detected',
  'Maintenance overdue',
  'Tire pressure low',
];

// ─── Seed Data Arrays ────────────────────────────────────────

export const SEED_VEHICLES: Vehicle[] = SWEDISH_CITIES.map((city, i) => {
  const status = V_STATUSES[i % V_STATUSES.length];
  return {
    id: `VH-${String(i + 1).padStart(3, '0')}`,
    name: `Truck ${city.name}`,
    registration: `SFM ${100 + i}`,
    status,
    latitude: city.lat + (Math.random() - 0.5) * 0.1,
    longitude: city.lng + (Math.random() - 0.5) * 0.1,
    speed: status === 'Active' ? Math.round(40 + Math.random() * 80) : 0,
    fuelLevel: Math.round(10 + Math.random() * 90),
    driverName: DRIVERS[i % DRIVERS.length].name,
    driverContact: `+46 70 ${100 + i} ${1000 + i}`,
    vehicleType: VEHICLE_TYPES[i % VEHICLE_TYPES.length],
    lastUpdated: new Date(Date.now() - i * 3600000).toISOString(),
  };
});

export const SEED_TRIPS: Trip[] = Array.from({ length: 10 }, (_, i) => {
  const driver = DRIVERS[i % DRIVERS.length];
  const hours = Math.floor(1 + Math.random() * 5);
  const minutes = Math.floor(Math.random() * 60);
  return {
    id: `TR-${String(i + 1).padStart(3, '0')}`,
    tripNumber: `TRIP-${2024000 + i + 1}`,
    driver,
    vehicle: {
      name: `Truck ${DESTINATIONS[i % DESTINATIONS.length]}`,
      registration: `SFM ${100 + i}`,
    },
    destination: DESTINATIONS[(i + 3) % DESTINATIONS.length],
    duration: `${hours}h ${minutes}m`,
    status: T_STATUSES[i % T_STATUSES.length],
  };
});

export const SEED_ALERTS: Alert[] = ALERT_LOCATIONS.map((loc, i) => ({
  id: `AL-${String(i + 1).padStart(3, '0')}`,
  vehicleId: `VH-${String(i + 1).padStart(3, '0')}`,
  latitude: loc.lat,
  longitude: loc.lng,
  severity: A_SEVERITIES[i % A_SEVERITIES.length],
  message: MESSAGES[i % MESSAGES.length],
  type: ALERT_TYPES[i % ALERT_TYPES.length],
  timestamp: new Date(Date.now() - i * 1800000).toISOString(),
}));

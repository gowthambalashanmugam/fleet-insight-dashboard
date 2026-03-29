import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { delay, of } from 'rxjs';
import { Vehicle, VehicleStatus } from '../models/vehicle.model';
import { Trip, TripStatus } from '../models/trip.model';
import { Alert, AlertSeverity } from '../models/alert.model';
import {
  LoginRequest,
  LoginResponse,
  RefreshTokenRequest,
  RefreshTokenResponse,
  GetVehiclesResponse,
  GetTripsResponse,
  GetAlertsResponse,
} from '../models/api.model';

/**
 * Mock API interceptor — intercepts HTTP requests to /api/* endpoints
 * and returns mock JSON responses. Remove this interceptor when
 * connecting to real backend APIs.
 *
 * Simulates ~200ms network latency.
 */
export const mockApiInterceptor: HttpInterceptorFn = (req, next) => {
  const url = req.url;

  // GET /api/vehicles
  if (req.method === 'GET' && url.endsWith('/api/vehicles')) {
    return of(new HttpResponse<GetVehiclesResponse>({ status: 200, body: MOCK_VEHICLES })).pipe(delay(200));
  }

  // GET /api/trips
  if (req.method === 'GET' && url.endsWith('/api/trips')) {
    return of(new HttpResponse<GetTripsResponse>({ status: 200, body: MOCK_TRIPS })).pipe(delay(200));
  }

  // GET /api/alerts
  if (req.method === 'GET' && url.endsWith('/api/alerts')) {
    return of(new HttpResponse<GetAlertsResponse>({ status: 200, body: MOCK_ALERTS })).pipe(delay(200));
  }

  // POST /api/auth/login
  if (req.method === 'POST' && url.endsWith('/api/auth/login')) {
    const body = req.body as LoginRequest | null;
    if (body?.username && body?.password) {
      const response: LoginResponse = {
        accessToken: btoa(`access:${body.username}:${Date.now()}`),
        refreshToken: btoa(`refresh:${body.username}:${Date.now()}`),
        user: { username: body.username },
      };
      return of(new HttpResponse<LoginResponse>({ status: 200, body: response })).pipe(delay(300));
    }
    return of(new HttpResponse({ status: 401, body: { message: 'Invalid credentials' } }));
  }

  // POST /api/auth/refresh
  if (req.method === 'POST' && url.endsWith('/api/auth/refresh')) {
    const body = req.body as RefreshTokenRequest | null;
    if (body?.refreshToken) {
      const response: RefreshTokenResponse = {
        accessToken: btoa(`access:refreshed:${Date.now()}`),
        refreshToken: btoa(`refresh:refreshed:${Date.now()}`),
      };
      return of(new HttpResponse<RefreshTokenResponse>({ status: 200, body: response })).pipe(delay(200));
    }
    return of(new HttpResponse({ status: 401, body: { message: 'Invalid refresh token' } }));
  }

  // Pass through anything not matched
  return next(req);
};

// ─── Mock Data ───────────────────────────────────────────────

const SWEDISH_CITIES = [
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

const V_STATUSES: VehicleStatus[] = ['Active', 'Idle', 'Maintenance'];

const MOCK_VEHICLES: Vehicle[] = SWEDISH_CITIES.map((city, i) => {
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
  };
});

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

const DESTINATIONS = [
  'Stockholm', 'Gothenburg', 'Malmö', 'Uppsala', 'Linköping',
  'Örebro', 'Västerås', 'Helsingborg', 'Norrköping', 'Jönköping',
];

const T_STATUSES: TripStatus[] = ['Ongoing', 'Done', 'Cancelled'];

const MOCK_TRIPS: Trip[] = Array.from({ length: 10 }, (_, i) => {
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

const ALERT_LOCATIONS = [
  { lat: 59.35, lng: 18.1, city: 'Stockholm' },
  { lat: 57.7, lng: 11.95, city: 'Gothenburg' },
  { lat: 55.62, lng: 13.02, city: 'Malmö' },
  { lat: 63.82, lng: 20.3, city: 'Umeå' },
  { lat: 65.6, lng: 22.13, city: 'Luleå' },
];

const A_SEVERITIES: AlertSeverity[] = ['low', 'medium', 'high'];
const MESSAGES = [
  'Engine temperature warning',
  'Low fuel alert',
  'Speeding detected',
  'Maintenance overdue',
  'Tire pressure low',
];

const MOCK_ALERTS: Alert[] = ALERT_LOCATIONS.map((loc, i) => ({
  id: `AL-${String(i + 1).padStart(3, '0')}`,
  vehicleId: `VH-${String(i + 1).padStart(3, '0')}`,
  latitude: loc.lat,
  longitude: loc.lng,
  severity: A_SEVERITIES[i % A_SEVERITIES.length],
  message: MESSAGES[i % MESSAGES.length],
}));

import { inject } from '@angular/core';
import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { from, of, switchMap, delay, map } from 'rxjs';
import { IndexedDbService } from '../services/indexed-db.service';
import { Vehicle } from '../models/vehicle.model';
import { Trip } from '../models/trip.model';
import { Alert } from '../models/alert.model';
import {
  LoginRequest,
  LoginResponse,
  RefreshTokenRequest,
  RefreshTokenResponse,
  CreateVehicleRequest,
  GetVehiclesResponse,
  GetTripsResponse,
  GetAlertsResponse,
} from '../models/api.model';

/**
 * Mock API interceptor — intercepts HTTP requests to /api/* endpoints
 * and returns mock JSON responses backed by IndexedDB persistence.
 * Auth endpoints remain in-memory. Remove this interceptor when
 * connecting to real backend APIs.
 *
 * Simulates ~200ms network latency.
 */
export const mockApiInterceptor: HttpInterceptorFn = (req, next) => {
  const db = inject(IndexedDbService);
  const url = req.url;

  // GET /api/vehicles
  if (req.method === 'GET' && url.endsWith('/api/vehicles')) {
    return from(db.getAll<Vehicle>('vehicles')).pipe(
      map(vehicles => new HttpResponse<GetVehiclesResponse>({ status: 200, body: vehicles })),
      delay(200)
    );
  }

  // GET /api/trips
  if (req.method === 'GET' && url.endsWith('/api/trips')) {
    return from(db.getAll<Trip>('trips')).pipe(
      map(trips => new HttpResponse<GetTripsResponse>({ status: 200, body: trips })),
      delay(200)
    );
  }

  // GET /api/alerts
  if (req.method === 'GET' && url.endsWith('/api/alerts')) {
    return from(db.getAll<Alert>('alerts')).pipe(
      map(alerts => new HttpResponse<GetAlertsResponse>({ status: 200, body: alerts })),
      delay(200)
    );
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

  // POST /api/vehicles
  if (req.method === 'POST' && url.endsWith('/api/vehicles')) {
    const body = req.body as CreateVehicleRequest | null;
    if (body) {
      return from(db.getAll<Vehicle>('vehicles')).pipe(
        switchMap(vehicles => {
          const duplicate = vehicles.find(v => v.registration === body.registration);
          if (duplicate) {
            return of(new HttpResponse({ status: 409, body: { message: 'A vehicle with this registration already exists' } }));
          }
          const newVehicle: Vehicle = {
            id: `VH-${Date.now()}`,
            name: body.name,
            registration: body.registration,
            vehicleType: body.vehicleType,
            driverName: body.driverName,
            driverContact: body.driverContact,
            status: body.status,
            latitude: body.latitude,
            longitude: body.longitude,
            speed: 0,
            fuelLevel: 100,
            lastUpdated: new Date().toISOString(),
          };
          return from(db.put('vehicles', newVehicle)).pipe(
            map(() => new HttpResponse<Vehicle>({ status: 201, body: newVehicle }))
          );
        }),
        delay(250)
      );
    }
  }

  // Pass through anything not matched
  return next(req);
};

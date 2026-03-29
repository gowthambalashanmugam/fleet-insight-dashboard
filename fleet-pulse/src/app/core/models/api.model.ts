import { Vehicle } from './vehicle.model';
import { Trip } from './trip.model';
import { Alert } from './alert.model';

// ─── Generic API wrapper ─────────────────────────────────────

/** Standard API response envelope from the backend */
export interface ApiResponse<T> {
  data: T;
  message?: string;
  timestamp?: string;
}

/** Standard API error response */
export interface ApiErrorResponse {
  status: number;
  message: string;
  errors?: Record<string, string[]>;
}

// ─── Auth ────────────────────────────────────────────────────

/** POST /api/auth/login — request body */
export interface LoginRequest {
  username: string;
  password: string;
}

/** POST /api/auth/login — response body */
export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: AuthUserResponse;
}

/** User object returned from auth endpoints */
export interface AuthUserResponse {
  username: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  role?: string;
}

/** POST /api/auth/refresh — request body */
export interface RefreshTokenRequest {
  refreshToken: string;
}

/** POST /api/auth/refresh — response body */
export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
}

// ─── Vehicles ────────────────────────────────────────────────

/** GET /api/vehicles — response body */
export type GetVehiclesResponse = Vehicle[];

/** GET /api/vehicles/:id — response body */
export type GetVehicleResponse = Vehicle;

/** POST /api/vehicles — request body */
export interface CreateVehicleRequest {
  name: string;
  registration: string;
  status: Vehicle['status'];
  latitude: number;
  longitude: number;
}

/** PUT /api/vehicles/:id — request body */
export interface UpdateVehicleRequest extends Partial<CreateVehicleRequest> {
  id: string;
}

// ─── Trips ───────────────────────────────────────────────────

/** GET /api/trips — response body */
export type GetTripsResponse = Trip[];

/** GET /api/trips/:id — response body */
export type GetTripResponse = Trip;

// ─── Alerts ──────────────────────────────────────────────────

/** GET /api/alerts — response body */
export type GetAlertsResponse = Alert[];

/** GET /api/alerts/:id — response body */
export type GetAlertResponse = Alert;

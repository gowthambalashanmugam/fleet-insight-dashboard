import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Alert } from '../models/alert.model';
import { Trip } from '../models/trip.model';
import { Vehicle } from '../models/vehicle.model';
import { VehicleDataService } from './vehicle-data.service';
import { TripDataService } from './trip-data.service';
import { AlertDataService } from './alert-data.service';

/**
 * Facade service for the dashboard.
 * All data flows through real HTTP calls (GET /api/vehicles, etc.).
 * The mock-api interceptor catches these in dev; remove it for production.
 */
@Injectable({ providedIn: 'root' })
export class DashboardService {
  private readonly vehicleService = inject(VehicleDataService);
  private readonly tripService = inject(TripDataService);
  private readonly alertService = inject(AlertDataService);

  getVehicles(): Observable<Vehicle[]> {
    return this.vehicleService.getVehicles();
  }

  getTrips(): Observable<Trip[]> {
    return this.tripService.getTrips();
  }

  getAlerts(): Observable<Alert[]> {
    return this.alertService.getAlerts();
  }
}

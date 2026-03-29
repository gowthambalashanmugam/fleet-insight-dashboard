import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Alert } from '../models/alert.model';
import { Trip } from '../models/trip.model';
import { Vehicle } from '../models/vehicle.model';
import { ALERT_DATA_SERVICE, AlertDataService } from './alert-data.service';
import { TRIP_DATA_SERVICE, TripDataService } from './trip-data.service';
import {
  VEHICLE_DATA_SERVICE,
  VehicleDataService,
} from './vehicle-data.service';

@Injectable({ providedIn: 'root' })
export class DashboardService {
  constructor(
    @Inject(VEHICLE_DATA_SERVICE)
    private readonly vehicleData: VehicleDataService,
    @Inject(TRIP_DATA_SERVICE)
    private readonly tripData: TripDataService,
    @Inject(ALERT_DATA_SERVICE)
    private readonly alertData: AlertDataService
  ) {}

  getVehicles(): Observable<Vehicle[]> {
    return this.vehicleData.getVehicles();
  }

  getTrips(): Observable<Trip[]> {
    return this.tripData.getTrips();
  }

  getAlerts(): Observable<Alert[]> {
    return this.alertData.getAlerts();
  }
}

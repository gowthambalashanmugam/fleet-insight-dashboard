import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';
import { Vehicle } from '../models/vehicle.model';

export interface VehicleDataService {
  getVehicles(): Observable<Vehicle[]>;
}

export const VEHICLE_DATA_SERVICE = new InjectionToken<VehicleDataService>(
  'VehicleDataService'
);

import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';
import { Trip } from '../models/trip.model';

export interface TripDataService {
  getTrips(): Observable<Trip[]>;
}

export const TRIP_DATA_SERVICE = new InjectionToken<TripDataService>(
  'TripDataService'
);

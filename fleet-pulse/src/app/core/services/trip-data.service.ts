import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { GetTripsResponse } from '../models/api.model';
import { ApiService } from './api.service';

@Injectable({ providedIn: 'root' })
export class TripDataService {
  private readonly api = inject(ApiService);

  getTrips(): Observable<GetTripsResponse> {
    return this.api.get<GetTripsResponse>('/trips');
  }
}

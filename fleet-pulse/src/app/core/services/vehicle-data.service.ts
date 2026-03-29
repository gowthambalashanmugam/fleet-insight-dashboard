import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { GetVehiclesResponse } from '../models/api.model';
import { ApiService } from './api.service';

@Injectable({ providedIn: 'root' })
export class VehicleDataService {
  private readonly api = inject(ApiService);

  getVehicles(): Observable<GetVehiclesResponse> {
    return this.api.get<GetVehiclesResponse>('/vehicles');
  }
}

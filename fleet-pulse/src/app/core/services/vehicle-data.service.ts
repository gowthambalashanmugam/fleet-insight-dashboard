import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { CreateVehicleRequest, GetVehiclesResponse } from '../models/api.model';
import { Vehicle } from '../models/vehicle.model';
import { ApiService } from './api.service';

@Injectable({ providedIn: 'root' })
export class VehicleDataService {
  private readonly api = inject(ApiService);

  getVehicles(): Observable<GetVehiclesResponse> {
    return this.api.get<GetVehiclesResponse>('/vehicles');
  }

  addVehicle(payload: CreateVehicleRequest): Observable<Vehicle> {
    return this.api.post<Vehicle>('/vehicles', payload);
  }
}

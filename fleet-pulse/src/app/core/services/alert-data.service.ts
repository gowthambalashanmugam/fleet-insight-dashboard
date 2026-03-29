import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { GetAlertsResponse } from '../models/api.model';
import { ApiService } from './api.service';

@Injectable({ providedIn: 'root' })
export class AlertDataService {
  private readonly api = inject(ApiService);

  getAlerts(): Observable<GetAlertsResponse> {
    return this.api.get<GetAlertsResponse>('/alerts');
  }
}

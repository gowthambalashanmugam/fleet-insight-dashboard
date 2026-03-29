import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';
import { Alert } from '../models/alert.model';

export interface AlertDataService {
  getAlerts(): Observable<Alert[]>;
}

export const ALERT_DATA_SERVICE = new InjectionToken<AlertDataService>(
  'AlertDataService'
);

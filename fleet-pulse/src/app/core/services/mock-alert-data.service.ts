import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Alert, AlertSeverity } from '../models/alert.model';
import { AlertDataService } from './alert-data.service';

const SEVERITIES: AlertSeverity[] = ['low', 'medium', 'high'];

const ALERT_LOCATIONS: { lat: number; lng: number; city: string }[] = [
  { lat: 59.35, lng: 18.1, city: 'Stockholm' },
  { lat: 57.7, lng: 11.95, city: 'Gothenburg' },
  { lat: 55.62, lng: 13.02, city: 'Malmö' },
  { lat: 63.82, lng: 20.3, city: 'Umeå' },
  { lat: 65.6, lng: 22.13, city: 'Luleå' },
];

const MESSAGES = [
  'Engine temperature warning',
  'Low fuel alert',
  'Speeding detected',
  'Maintenance overdue',
  'Tire pressure low',
];

function buildMockAlerts(): Alert[] {
  return ALERT_LOCATIONS.map((loc, i) => ({
    id: `AL-${String(i + 1).padStart(3, '0')}`,
    vehicleId: `VH-${String(i + 1).padStart(3, '0')}`,
    latitude: loc.lat,
    longitude: loc.lng,
    severity: SEVERITIES[i % SEVERITIES.length],
    message: MESSAGES[i % MESSAGES.length],
  }));
}

@Injectable()
export class MockAlertDataService implements AlertDataService {
  private readonly alerts = buildMockAlerts();

  getAlerts(): Observable<Alert[]> {
    return of(this.alerts);
  }
}

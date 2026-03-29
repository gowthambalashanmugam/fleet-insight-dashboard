import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
} from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

import { routes } from './app.routes';
import { VEHICLE_DATA_SERVICE } from './core/services/vehicle-data.service';
import { MockVehicleDataService } from './core/services/mock-vehicle-data.service';
import { TRIP_DATA_SERVICE } from './core/services/trip-data.service';
import { MockTripDataService } from './core/services/mock-trip-data.service';
import { ALERT_DATA_SERVICE } from './core/services/alert-data.service';
import { MockAlertDataService } from './core/services/mock-alert-data.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes, withComponentInputBinding()),
    provideHttpClient(withInterceptors([])),
    { provide: VEHICLE_DATA_SERVICE, useClass: MockVehicleDataService },
    { provide: TRIP_DATA_SERVICE, useClass: MockTripDataService },
    { provide: ALERT_DATA_SERVICE, useClass: MockAlertDataService },
  ],
};

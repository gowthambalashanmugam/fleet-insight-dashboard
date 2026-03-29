import { Routes } from '@angular/router';

export const fleetRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./fleet.component').then((m) => m.FleetComponent),
  },
];

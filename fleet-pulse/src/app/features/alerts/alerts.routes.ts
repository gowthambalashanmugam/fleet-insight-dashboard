import { Routes } from '@angular/router';

export const alertsRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./alerts.component').then((m) => m.AlertsComponent),
  },
];

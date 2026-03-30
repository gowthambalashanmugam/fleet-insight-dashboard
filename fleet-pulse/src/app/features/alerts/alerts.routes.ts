import { Routes } from '@angular/router';

export const alertsRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./alerts-page.component').then((m) => m.AlertsPageComponent),
  },
];

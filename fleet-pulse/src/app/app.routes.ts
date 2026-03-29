import { Routes } from '@angular/router';
import { ShellComponent } from './layout/shell/shell.component';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./features/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: '',
    component: ShellComponent,
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
      {
        path: 'dashboard',
        loadChildren: () =>
          import('./features/dashboard/dashboard.routes').then((m) => m.dashboardRoutes),
      },
      {
        path: 'fleet',
        loadChildren: () =>
          import('./features/fleet/fleet.routes').then((m) => m.fleetRoutes),
      },
      {
        path: 'alerts',
        loadChildren: () =>
          import('./features/alerts/alerts.routes').then((m) => m.alertsRoutes),
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'login',
  },
];

import { Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Subject, startWith, switchMap, catchError, of, tap } from 'rxjs';
import { DashboardService } from '../../core/services/dashboard.service';
import { Vehicle } from '../../core/models/vehicle.model';
import { Trip } from '../../core/models/trip.model';
import { Alert } from '../../core/models/alert.model';
import { KpiItem } from '../../core/models/kpi.model';
import { TripSummaryItem } from '../../core/models/trip-summary.model';
import { KpiCardListComponent } from './components/kpi-card-list/kpi-card-list.component';
import { LiveTrackingSectionComponent } from './components/live-tracking-section/live-tracking-section.component';
import { TripSummaryCardListComponent } from './components/trip-summary-card-list/trip-summary-card-list.component';
import { LatestTripTableComponent } from './components/latest-trip-table/latest-trip-table.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
  imports: [
    KpiCardListComponent,
    LiveTrackingSectionComponent,
    TripSummaryCardListComponent,
    LatestTripTableComponent,
  ],
})
export class DashboardComponent {
  private readonly dashboardService = inject(DashboardService);
  private readonly refresh$ = new Subject<void>();

  readonly isLoading = signal(true);
  readonly error = signal<string | null>(null);

  private readonly vehicles$ = this.refresh$.pipe(
    startWith(undefined),
    switchMap(() =>
      this.dashboardService.getVehicles().pipe(
        catchError(() => {
          this.error.update((prev) =>
            prev ? prev + '. Unable to load vehicle data' : 'Unable to load vehicle data'
          );
          return of<Vehicle[]>([]);
        })
      )
    ),
    tap(() => this.isLoading.set(false))
  );

  private readonly trips$ = this.refresh$.pipe(
    startWith(undefined),
    switchMap(() =>
      this.dashboardService.getTrips().pipe(
        catchError(() => {
          this.error.update((prev) =>
            prev ? prev + '. Unable to load trip data' : 'Unable to load trip data'
          );
          return of<Trip[]>([]);
        })
      )
    )
  );

  private readonly alerts$ = this.refresh$.pipe(
    startWith(undefined),
    switchMap(() =>
      this.dashboardService.getAlerts().pipe(
        catchError(() => {
          this.error.update((prev) =>
            prev ? prev + '. Unable to load alert data' : 'Unable to load alert data'
          );
          return of<Alert[]>([]);
        })
      )
    )
  );

  readonly vehicles = toSignal(this.vehicles$, { initialValue: [] as Vehicle[] });
  readonly trips = toSignal(this.trips$, { initialValue: [] as Trip[] });
  readonly alerts = toSignal(this.alerts$, { initialValue: [] as Alert[] });

  readonly kpiData = computed<KpiItem[]>(() => {
    const v = this.vehicles();
    const total = v.length;
    const active = v.filter((x: Vehicle) => x.status === 'Active').length;
    const idle = v.filter((x: Vehicle) => x.status === 'Idle').length;
    const maintenance = v.filter((x: Vehicle) => x.status === 'Maintenance').length;

    return [
      { title: 'Total Vehicles', value: total, icon: 'M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4zM6 18.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm13.5-9 1.96 2.5H17V9.5h2.5zm-1.5 9c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z', color: 'blue', category: 'total' },
      { title: 'Active Vehicles', value: active, icon: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z', color: 'green', category: 'active' },
      { title: 'Idle Vehicles', value: idle, icon: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z', color: 'yellow', category: 'idle' },
      { title: 'Maintenance Required', value: maintenance, icon: 'M22.7 19l-9.1-9.1c.9-2.3.4-5-1.5-6.9-2-2-5-2.4-7.4-1.3L9 6 6 9 1.6 4.7C.4 7.1.9 10.1 2.9 12.1c1.9 1.9 4.6 2.4 6.9 1.5l9.1 9.1c.4.4 1 .4 1.4 0l2.3-2.3c.5-.4.5-1.1.1-1.4z', color: 'red', category: 'maintenance' },
    ];
  });

  readonly tripSummary = computed<TripSummaryItem[]>(() => {
    const t = this.trips();
    const total = t.length;
    const ongoing = t.filter((x: Trip) => x.status === 'Ongoing').length;
    const cancelled = t.filter((x: Trip) => x.status === 'Cancelled').length;

    return [
      {
        title: 'Total Trip',
        value: total,
        trendPercentage: 15,
        trendDirection: 'up',
        iconType: 'trip',
        color: '#6366f1',
      },
      {
        title: 'On Going Trip',
        value: ongoing,
        trendPercentage: 8,
        trendDirection: 'up',
        iconType: 'ongoing',
        color: '#3b82f6',
      },
      {
        title: 'Cancelled Trip',
        value: cancelled,
        trendPercentage: 3,
        trendDirection: 'down',
        iconType: 'cancelled',
        color: '#ef4444',
      },
    ];
  });

  onRefreshRequest(): void {
    this.isLoading.set(true);
    this.error.set(null);
    this.refresh$.next();
  }

  onRetry(): void {
    this.onRefreshRequest();
  }
}

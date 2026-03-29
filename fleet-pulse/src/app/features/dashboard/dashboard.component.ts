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
      { title: 'Total Vehicle', value: total, icon: '🚛', color: 'blue', category: 'total' },
      { title: 'Active Vehicle', value: active, icon: '🟢', color: 'green', category: 'active' },
      { title: 'Idle Vehicle', value: idle, icon: '🟡', color: 'yellow', category: 'idle' },
      { title: 'Maintenance Required', value: maintenance, icon: '🔧', color: 'red', category: 'maintenance' },
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

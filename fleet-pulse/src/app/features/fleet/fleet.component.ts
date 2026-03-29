import { Component, computed, inject, signal, viewChild } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { DatePipe } from '@angular/common';
import { Subject, startWith, switchMap, catchError, of, tap } from 'rxjs';
import { VehicleDataService } from '../../core/services/vehicle-data.service';
import { AlertDataService } from '../../core/services/alert-data.service';
import { NotificationService } from '../../core/services/notification.service';
import { Vehicle, VehicleStatus } from '../../core/models/vehicle.model';
import { Alert } from '../../core/models/alert.model';
import { FuelLevelRange, filterVehicles, extractUniqueTypes } from './fleet-filter.util';
import { FleetFilterBarComponent } from './components/fleet-filter-bar/fleet-filter-bar.component';
import { FleetDetailPanelComponent } from './components/fleet-detail-panel/fleet-detail-panel.component';
import { StatusBadgeComponent } from '../../shared/components/status-badge/status-badge.component';
import { CardComponent } from '../../shared/components/card/card.component';
import { ModalComponent } from '../../shared/components/modal/modal.component';
import { AddVehicleFormComponent } from './components/add-vehicle-form/add-vehicle-form.component';
import { PaginationComponent } from '../../shared/components/pagination/pagination.component';

@Component({
  selector: 'app-fleet',
  templateUrl: './fleet.component.html',
  styleUrl: './fleet.component.scss',
  imports: [
    FleetFilterBarComponent,
    FleetDetailPanelComponent,
    StatusBadgeComponent,
    CardComponent,
    DatePipe,
    ModalComponent,
    AddVehicleFormComponent,
    PaginationComponent,
  ],
})
export class FleetComponent {
  private readonly vehicleDataService = inject(VehicleDataService);
  private readonly alertDataService = inject(AlertDataService);
  private readonly notificationService = inject(NotificationService);
  private readonly refresh$ = new Subject<void>();

  readonly isLoading = signal(true);
  readonly error = signal<string | null>(null);

  private readonly vehicles$ = this.refresh$.pipe(
    startWith(undefined),
    switchMap(() =>
      this.vehicleDataService.getVehicles().pipe(
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

  private readonly alerts$ = this.refresh$.pipe(
    startWith(undefined),
    switchMap(() =>
      this.alertDataService.getAlerts().pipe(
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
  readonly alerts = toSignal(this.alerts$, { initialValue: [] as Alert[] });

  // Filter state
  readonly searchTerm = signal('');
  readonly statusFilter = signal<VehicleStatus | 'All'>('All');
  readonly fuelFilter = signal<FuelLevelRange>('All');
  readonly vehicleTypeFilter = signal<string>('All');

  // Derived
  readonly vehicleTypes = computed(() => extractUniqueTypes(this.vehicles()));
  readonly filteredVehicles = computed(() =>
    filterVehicles(this.vehicles(), {
      searchTerm: this.searchTerm(),
      status: this.statusFilter(),
      fuelRange: this.fuelFilter(),
      vehicleType: this.vehicleTypeFilter(),
    })
  );

  // Expansion
  readonly expandedVehicleId = signal<string | null>(null);

  // Pagination
  readonly currentPage = signal(1);
  readonly pageSize = signal(10);

  readonly paginatedVehicles = computed(() => {
    const all = this.filteredVehicles();
    const start = (this.currentPage() - 1) * this.pageSize();
    return all.slice(start, start + this.pageSize());
  });

  // Add Vehicle Modal
  readonly showAddVehicleModal = signal(false);
  private readonly addVehicleForm = viewChild(AddVehicleFormComponent);

  toggleExpand(vehicleId: string): void {
    this.expandedVehicleId.update((current) => (current === vehicleId ? null : vehicleId));
  }

  resetFilters(): void {
    this.searchTerm.set('');
    this.statusFilter.set('All');
    this.fuelFilter.set('All');
    this.vehicleTypeFilter.set('All');
    this.currentPage.set(1);
  }

  getAlertsForVehicle(vehicleId: string): Alert[] {
    return this.alerts().filter((alert) => alert.vehicleId === vehicleId);
  }

  onRetry(): void {
    this.error.set(null);
    this.isLoading.set(true);
    this.refresh$.next();
  }

  onAddVehicle(): void {
    this.showAddVehicleModal.set(true);
  }

  onVehicleAdded(): void {
    this.showAddVehicleModal.set(false);
    this.refresh$.next();
    this.notificationService.success('Vehicle added successfully');
  }

  onCloseModal(): void {
    this.addVehicleForm()?.resetForm();
    this.showAddVehicleModal.set(false);
  }
}

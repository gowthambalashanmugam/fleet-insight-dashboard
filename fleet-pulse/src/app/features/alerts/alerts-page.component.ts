import { Component, OnInit, OnDestroy, inject, signal, computed } from '@angular/core';
import { Subscription } from 'rxjs';
import { Alert, AlertSeverity } from '../../core/models/alert.model';
import { AlertFilterCriteria, SortOption } from './models/alert.model';
import { AlertService } from './services/alert.service';
import { AlertHeaderComponent } from './components/alert-header/alert-header.component';
import { AlertCardComponent } from './components/alert-card/alert-card.component';
import { AlertFiltersComponent } from './components/alert-filters/alert-filters.component';

@Component({
  selector: 'app-alerts-page',
  imports: [AlertHeaderComponent, AlertCardComponent, AlertFiltersComponent],
  providers: [AlertService],
  templateUrl: './alerts-page.component.html',
  styleUrl: './alerts-page.component.scss',
})
export class AlertsPageComponent implements OnInit, OnDestroy {
  private readonly alertService = inject(AlertService);
  private loadSub?: Subscription;
  private wsSub?: Subscription;

  readonly alerts = signal<Alert[]>([]);
  readonly sortOption = signal<SortOption>('latest');
  readonly filterCriteria = signal<AlertFilterCriteria>({
    severities: [],
    vehicleName: null,
    dateRange: { start: null, end: null },
    types: [],
  });
  readonly selectedIds = signal(new Set<string>());
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);

  private readonly severityOrder: Record<AlertSeverity, number> = {
    CRITICAL: 0,
    WARNING: 1,
    INFO: 2,
  };

  readonly displayedAlerts = computed(() => {
    return this.applySort(this.applyFilter(this.alerts()));
  });

  ngOnInit(): void {
    this.loadSub = this.alertService.loadAlerts().subscribe({
      next: (alerts) => {
        this.alerts.set(alerts);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.error.set('Failed to load alerts');
      },
    });

    this.wsSub = this.alertService.alerts$.subscribe((alerts) => {
      if (!this.loading()) {
        this.alerts.set(alerts);
      }
    });
  }

  ngOnDestroy(): void {
    this.loadSub?.unsubscribe();
    this.wsSub?.unsubscribe();
  }

  onSortChange(sort: SortOption): void {
    this.sortOption.set(sort);
  }

  onFilterChange(criteria: AlertFilterCriteria): void {
    this.filterCriteria.set(criteria);
  }

  onSelectAll(checked: boolean): void {
    if (checked) {
      this.selectedIds.set(new Set(this.displayedAlerts().map((a) => a.id)));
    } else {
      this.selectedIds.set(new Set());
    }
  }

  onSelectionChange(event: { id: string; selected: boolean }): void {
    const next = new Set(this.selectedIds());
    event.selected ? next.add(event.id) : next.delete(event.id);
    this.selectedIds.set(next);
  }

  onDelete(id: string): void {
    this.alertService.deleteAlert(id).subscribe();
    const next = new Set(this.selectedIds());
    next.delete(id);
    this.selectedIds.set(next);
  }

  onBulkDelete(): void {
    const ids = Array.from(this.selectedIds());
    if (ids.length === 0) return;
    this.alertService.deleteAlerts(ids).subscribe();
    this.selectedIds.set(new Set());
  }

  isSelected(id: string): boolean {
    return this.selectedIds().has(id);
  }

  private applyFilter(alerts: Alert[]): Alert[] {
    const f = this.filterCriteria();
    return alerts.filter((a) => {
      if (f.severities.length && !f.severities.includes(a.severity)) return false;
      if (f.types.length && !f.types.includes(a.type)) return false;
      if (f.vehicleName && !a.vehicleName.toLowerCase().includes(f.vehicleName.toLowerCase())) return false;
      if (f.dateRange.start && new Date(a.timestamp) < new Date(f.dateRange.start)) return false;
      if (f.dateRange.end && new Date(a.timestamp) > new Date(f.dateRange.end)) return false;
      return true;
    });
  }

  private applySort(alerts: Alert[]): Alert[] {
    return [...alerts].sort((a, b) => {
      if (this.sortOption() === 'latest') return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
      return this.severityOrder[a.severity] - this.severityOrder[b.severity];
    });
  }
}

import { Component, output, input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AlertSeverity, AlertType, Alert } from '../../../../core/models/alert.model';
import { AlertFilterCriteria } from '../../models/alert.model';

@Component({
  selector: 'app-alert-filters',
  imports: [FormsModule],
  templateUrl: './alert-filters.component.html',
  styleUrl: './alert-filters.component.scss',
})
export class AlertFiltersComponent {
  readonly alerts = input<Alert[]>([]);
  readonly filterChange = output<AlertFilterCriteria>();

  readonly severityOptions: { value: AlertSeverity; label: string }[] = [
    { value: 'CRITICAL', label: 'Critical' },
    { value: 'WARNING', label: 'Warning' },
    { value: 'INFO', label: 'Information' },
  ];

  readonly typeOptions: { value: AlertType; label: string }[] = [
    { value: 'OVER_SPEED', label: 'Over Speed' },
    { value: 'DTC', label: 'Check Engine / DTC' },
    { value: 'IDLE', label: 'Extended Stop' },
    { value: 'GEOFENCE', label: 'Geofence Breach' },
  ];

  selectedSeverity: AlertSeverity | '' = '';
  selectedType: AlertType | '' = '';
  alertName: string = '';
  assetName: string = '';

  get severityCounts(): { critical: number; warning: number; info: number } {
    const all = this.alerts();
    return {
      critical: all.filter(a => a.severity === 'CRITICAL').length,
      warning: all.filter(a => a.severity === 'WARNING').length,
      info: all.filter(a => a.severity === 'INFO').length,
    };
  }

  get maxCount(): number {
    const c = this.severityCounts;
    return Math.max(c.critical, c.warning, c.info, 1);
  }

  barHeight(count: number): number {
    return Math.max((count / this.maxCount) * 100, 2);
  }

  onFilterChange(): void {
    const criteria: AlertFilterCriteria = {
      severities: this.selectedSeverity ? [this.selectedSeverity] : [],
      vehicleName: this.assetName.trim() || null,
      dateRange: { start: null, end: null },
      types: this.selectedType ? [this.selectedType] : [],
    };
    this.filterChange.emit(criteria);
  }

  clearFilters(): void {
    this.selectedSeverity = '';
    this.selectedType = '';
    this.alertName = '';
    this.assetName = '';
    this.onFilterChange();
  }
}

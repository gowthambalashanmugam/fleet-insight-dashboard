import { Component, computed, input, output } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Vehicle } from '../../../../core/models/vehicle.model';
import { Alert } from '../../../../core/models/alert.model';
import { StatusBadgeComponent } from '../../../../shared/components/status-badge/status-badge.component';

@Component({
  selector: 'app-fleet-detail-panel',
  standalone: true,
  imports: [DatePipe, StatusBadgeComponent],
  templateUrl: './fleet-detail-panel.component.html',
  styleUrl: './fleet-detail-panel.component.scss',
})
export class FleetDetailPanelComponent {
  readonly vehicle = input.required<Vehicle>();
  readonly alerts = input<Alert[]>([]);

  readonly viewDetails = output<string>();
  readonly viewTripHistory = output<string>();
  readonly resolveAlert = output<string>();

  readonly recentAlerts = computed(() => this.alerts().slice(0, 3));
  readonly hasHighSeverityAlert = computed(() =>
    this.alerts().some(a => a.severity === 'CRITICAL')
  );

  getSeverityColor(severity: string): string {
    switch (severity) {
      case 'CRITICAL':
        return 'var(--color-status-maintenance, #ef4444)';
      case 'WARNING':
        return 'var(--color-status-idle, #eab308)';
      case 'INFO':
        return 'var(--color-status-active, #22c55e)';
      default:
        return '#6b7280';
    }
  }
}

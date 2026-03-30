import { Component, input, output } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Alert, AlertSeverity, AlertType } from '../../../../core/models/alert.model';

@Component({
  selector: 'app-alert-card',
  imports: [DatePipe],
  templateUrl: './alert-card.component.html',
  styleUrl: './alert-card.component.scss',
})
export class AlertCardComponent {
  readonly alert = input.required<Alert>();
  readonly selected = input<boolean>(false);

  readonly selectionChange = output<{ id: string; selected: boolean }>();
  readonly delete = output<string>();

  expanded = false;

  private readonly MESSAGE_TRUNCATE_THRESHOLD = 180;

  private readonly severityColorMap: Record<AlertSeverity, string> = {
    CRITICAL: '#FF4D4F',
    WARNING: '#FAAD14',
    INFO: '#52C41A',
  };

  private readonly severityLabelMap: Record<AlertSeverity, string> = {
    CRITICAL: 'Critical',
    WARNING: 'Warning',
    INFO: 'Information',
  };

  private readonly typeLabelMap: Record<AlertType, string> = {
    OVER_SPEED: 'Over Speed',
    DTC: 'Check Engine / Diagnostic (DTC)',
    IDLE: 'Extended Stop',
    GEOFENCE: 'Geofence Breach',
  };

  getSeverityColor(severity: AlertSeverity): string {
    return this.severityColorMap[severity];
  }

  getSeverityLabel(severity: AlertSeverity): string {
    return this.severityLabelMap[severity];
  }

  getTypeLabel(type: AlertType): string {
    return this.typeLabelMap[type];
  }

  get isMessageTruncated(): boolean {
    return this.alert().message.length > this.MESSAGE_TRUNCATE_THRESHOLD;
  }

  get displayMessage(): string {
    if (this.expanded || !this.isMessageTruncated) {
      return this.alert().message;
    }
    return this.alert().message.substring(0, this.MESSAGE_TRUNCATE_THRESHOLD) + '...';
  }

  toggleReadMore(): void {
    this.expanded = !this.expanded;
  }

  onSelectionChange(): void {
    this.selectionChange.emit({
      id: this.alert().id,
      selected: !this.selected(),
    });
  }

  onDelete(): void {
    this.delete.emit(this.alert().id);
  }
}

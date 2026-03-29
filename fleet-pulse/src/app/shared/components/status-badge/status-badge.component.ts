import { Component, computed, input } from '@angular/core';

const DEFAULT_COLOR_MAP: Record<string, string> = {
  Ongoing: '#3b82f6',
  Done: '#22c55e',
  Cancelled: '#ef4444',
  Active: '#22c55e',
  Idle: '#eab308',
  Maintenance: '#ef4444',
};

@Component({
  selector: 'app-status-badge',
  templateUrl: './status-badge.component.html',
  styleUrl: './status-badge.component.scss',
})
export class StatusBadgeComponent {
  readonly status = input.required<string>();
  readonly colorMap = input<Record<string, string>>(DEFAULT_COLOR_MAP);

  protected readonly backgroundColor = computed(() => {
    const map = this.colorMap() ?? DEFAULT_COLOR_MAP;
    return map[this.status()] ?? '#6b7280';
  });
}

import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-kpi-card',
  templateUrl: './kpi-card.component.html',
  styleUrl: './kpi-card.component.scss',
})
export class KpiCardComponent {
  readonly title = input.required<string>();
  readonly value = input.required<string | number>();
  readonly icon = input.required<string>();
  readonly color = input.required<'blue' | 'green' | 'yellow' | 'red'>();
  readonly category = input<string>('');

  readonly cardClick = output<string>();

  protected readonly colorMap: Record<string, string> = {
    blue: '#3b82f6',
    green: '#22c55e',
    yellow: '#eab308',
    red: '#ef4444',
  };

  protected readonly bgColorMap: Record<string, string> = {
    blue: 'rgba(59, 130, 246, 0.1)',
    green: 'rgba(34, 197, 94, 0.1)',
    yellow: 'rgba(234, 179, 8, 0.1)',
    red: 'rgba(239, 68, 68, 0.1)',
  };

  onCardClick(): void {
    this.cardClick.emit(this.category() || this.title());
  }
}

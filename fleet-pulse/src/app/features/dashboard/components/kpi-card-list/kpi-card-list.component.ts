import { Component, input, output } from '@angular/core';
import { KpiItem } from '../../../../core/models/kpi.model';
import { KpiCardComponent } from '../kpi-card/kpi-card.component';

@Component({
  selector: 'app-kpi-card-list',
  templateUrl: './kpi-card-list.component.html',
  styleUrl: './kpi-card-list.component.scss',
  imports: [KpiCardComponent],
})
export class KpiCardListComponent {
  readonly kpiData = input.required<KpiItem[]>();

  readonly kpiSelect = output<string>();

  onCardClick(category: string): void {
    this.kpiSelect.emit(category);
  }
}

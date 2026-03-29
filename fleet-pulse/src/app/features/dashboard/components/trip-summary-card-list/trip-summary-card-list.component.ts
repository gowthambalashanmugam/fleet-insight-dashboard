import { Component, input } from '@angular/core';
import { TripSummaryItem } from '../../../../core/models/trip-summary.model';
import { TripSummaryCardComponent } from '../trip-summary-card/trip-summary-card.component';

const CHART_TYPE_MAP: Record<string, 'donut' | 'bar' | 'area'> = {
  'Total Trip': 'donut',
  'On Going Trip': 'bar',
  'Cancelled Trip': 'area',
};

const DEFAULT_CHART_DATA: Record<string, number[]> = {
  donut: [75, 25],
  bar: [4, 7, 5, 9, 6, 3, 8],
  area: [3, 5, 2, 7, 4, 6, 3],
};

@Component({
  selector: 'app-trip-summary-card-list',
  templateUrl: './trip-summary-card-list.component.html',
  styleUrl: './trip-summary-card-list.component.scss',
  imports: [TripSummaryCardComponent],
})
export class TripSummaryCardListComponent {
  readonly tripSummary = input.required<TripSummaryItem[]>();

  getChartType(item: TripSummaryItem): 'donut' | 'bar' | 'area' {
    return CHART_TYPE_MAP[item.title] ?? 'bar';
  }

  getChartData(item: TripSummaryItem): number[] {
    const type = this.getChartType(item);
    return DEFAULT_CHART_DATA[type];
  }
}

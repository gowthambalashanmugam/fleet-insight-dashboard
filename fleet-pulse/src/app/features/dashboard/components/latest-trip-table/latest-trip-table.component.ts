import { Component, input, output } from '@angular/core';
import { Trip } from '../../../../core/models/trip.model';
import { StatusBadgeComponent } from '../../../../shared/components/status-badge/status-badge.component';

@Component({
  selector: 'app-latest-trip-table',
  templateUrl: './latest-trip-table.component.html',
  styleUrl: './latest-trip-table.component.scss',
  imports: [StatusBadgeComponent],
})
export class LatestTripTableComponent {
  readonly trips = input<Trip[]>([]);

  readonly tripSelect = output<string>();
  readonly seeAllClick = output<void>();

  onRowClick(tripId: string): void {
    this.tripSelect.emit(tripId);
  }

  onSeeAll(): void {
    this.seeAllClick.emit();
  }
}

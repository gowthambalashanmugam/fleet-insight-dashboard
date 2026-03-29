import { Component, input, model, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { VehicleStatus } from '../../../../core/models/vehicle.model';
import { FuelLevelRange } from '../../fleet-filter.util';

@Component({
  selector: 'app-fleet-filter-bar',
  imports: [FormsModule],
  templateUrl: './fleet-filter-bar.component.html',
  styleUrl: './fleet-filter-bar.component.scss',
})
export class FleetFilterBarComponent {
  readonly searchTerm = model<string>('');
  readonly statusFilter = model<VehicleStatus | 'All'>('All');
  readonly fuelFilter = model<FuelLevelRange>('All');
  readonly vehicleTypeFilter = model<string>('All');

  readonly vehicleTypes = input<string[]>([]);

  readonly resetFilters = output<void>();
}

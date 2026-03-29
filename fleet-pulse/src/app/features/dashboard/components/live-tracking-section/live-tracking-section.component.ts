import { Component, DestroyRef, OnInit, inject, input, output, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { interval } from 'rxjs';
import { filter } from 'rxjs/operators';
import { Vehicle } from '../../../../core/models/vehicle.model';
import { Alert } from '../../../../core/models/alert.model';
import { MapComponent } from '../map/map.component';

@Component({
  selector: 'app-live-tracking-section',
  templateUrl: './live-tracking-section.component.html',
  styleUrl: './live-tracking-section.component.scss',
  imports: [MapComponent],
})
export class LiveTrackingSectionComponent implements OnInit {
  readonly vehicles = input<Vehicle[]>([]);
  readonly alerts = input<Alert[]>([]);

  readonly seeAllClick = output<void>();
  readonly refreshRequest = output<void>();

  readonly autoRefresh = signal(true);

  private readonly destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    interval(30000)
      .pipe(
        filter(() => this.autoRefresh()),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(() => this.refreshRequest.emit());
  }

  toggleAutoRefresh(): void {
    this.autoRefresh.update((v) => !v);
  }

  onManualRefresh(): void {
    this.refreshRequest.emit();
  }

}

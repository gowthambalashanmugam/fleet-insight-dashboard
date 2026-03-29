import { Component, DestroyRef, OnInit, inject, input, output, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Vehicle } from '../../../../core/models/vehicle.model';
import { Alert } from '../../../../core/models/alert.model';
import { WebSocketService } from '../../../../core/services/websocket.service';
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
  readonly wsUrl = input<string>('ws://localhost:4200/ws/fleet');

  readonly seeAllClick = output<void>();
  readonly refreshRequest = output<void>();
  readonly vehicleUpdate = output<Vehicle[]>();
  readonly alertUpdate = output<Alert[]>();

  readonly autoRefresh = signal(true);

  private readonly destroyRef = inject(DestroyRef);
  private readonly webSocketService = inject(WebSocketService);

  ngOnInit(): void {
    this.webSocketService.connect(this.wsUrl());

    this.webSocketService.vehicles$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((vehicles) => this.vehicleUpdate.emit(vehicles));

    this.webSocketService.alerts$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((alerts) => this.alertUpdate.emit(alerts));

    this.destroyRef.onDestroy(() => this.webSocketService.disconnect());
  }

  toggleAutoRefresh(): void {
    this.autoRefresh.update((v) => !v);
    if (this.autoRefresh()) {
      this.webSocketService.connect(this.wsUrl());
    } else {
      this.webSocketService.disconnect();
    }
  }

  onManualRefresh(): void {
    this.refreshRequest.emit();
  }
}

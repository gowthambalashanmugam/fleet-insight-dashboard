import { Injectable, inject } from '@angular/core';
import { Observable, Subject, Subscription, interval, startWith } from 'rxjs';
import { Vehicle } from '../models/vehicle.model';
import { Alert } from '../models/alert.model';
import { DashboardService } from './dashboard.service';

/**
 * Pure function for calculating reconnect delay with exponential backoff.
 * Exported separately for testability.
 */
export function calculateReconnectDelay(
  attempt: number,
  baseDelay: number,
  maxDelay: number
): number {
  return Math.min(baseDelay * Math.pow(2, attempt), maxDelay);
}

@Injectable({ providedIn: 'root' })
export class WebSocketService {
  private readonly dashboardService = inject(DashboardService);

  private socket: WebSocket | null = null;
  private readonly vehicleUpdates$ = new Subject<Vehicle[]>();
  private readonly alertUpdates$ = new Subject<Alert[]>();
  private reconnectAttempts = 0;
  private readonly maxReconnectAttempts = 5;
  private readonly baseDelay = 1000;
  private readonly maxDelay = 30000;
  private reconnectTimeout: ReturnType<typeof setTimeout> | null = null;
  private pollingSubscription: Subscription | null = null;
  private currentUrl: string | null = null;

  vehicles$: Observable<Vehicle[]> = this.vehicleUpdates$.asObservable();
  alerts$: Observable<Alert[]> = this.alertUpdates$.asObservable();

  connect(url: string): void {
    this.currentUrl = url;
    this.closeSocket();
    this.stopPolling();

    this.socket = new WebSocket(url);

    this.socket.onopen = () => {
      this.reconnectAttempts = 0;
    };

    this.socket.onmessage = (event: MessageEvent) => {
      this.handleMessage(event);
    };

    this.socket.onclose = () => {
      if (this.currentUrl) {
        this.reconnect(this.currentUrl);
      }
    };

    this.socket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
  }

  disconnect(): void {
    this.currentUrl = null;
    this.closeSocket();
    this.clearReconnectTimeout();
    this.stopPolling();
    this.socket = null;
  }

  private reconnect(url: string): void {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      this.fallbackToPolling();
      return;
    }

    const delay = calculateReconnectDelay(
      this.reconnectAttempts,
      this.baseDelay,
      this.maxDelay
    );
    this.reconnectAttempts++;

    this.reconnectTimeout = setTimeout(() => {
      this.connect(url);
    }, delay);
  }

  private fallbackToPolling(): void {
    this.pollingSubscription = interval(30000)
      .pipe(startWith(0))
      .subscribe(() => {
        this.dashboardService
          .getVehicles()
          .subscribe((vehicles) => this.vehicleUpdates$.next(vehicles));
        this.dashboardService
          .getAlerts()
          .subscribe((alerts) => this.alertUpdates$.next(alerts));
      });
  }

  private handleMessage(event: MessageEvent): void {
    try {
      const data = JSON.parse(event.data);

      if (data?.type === 'vehicle-update' && Array.isArray(data.payload)) {
        this.vehicleUpdates$.next(data.payload as Vehicle[]);
      } else if (data?.type === 'alert-update' && Array.isArray(data.payload)) {
        this.alertUpdates$.next(data.payload as Alert[]);
      }
    } catch (e) {
      console.warn('WebSocket: failed to parse message', e);
    }
  }

  private closeSocket(): void {
    if (this.socket) {
      this.socket.onopen = null;
      this.socket.onmessage = null;
      this.socket.onclose = null;
      this.socket.onerror = null;
      if (
        this.socket.readyState === WebSocket.OPEN ||
        this.socket.readyState === WebSocket.CONNECTING
      ) {
        this.socket.close();
      }
    }
  }

  private clearReconnectTimeout(): void {
    if (this.reconnectTimeout !== null) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }
  }

  private stopPolling(): void {
    if (this.pollingSubscription) {
      this.pollingSubscription.unsubscribe();
      this.pollingSubscription = null;
    }
  }
}

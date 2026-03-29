import { Injectable, signal } from '@angular/core';

export interface Notification {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
}

/**
 * Signal-based notification service.
 * Components can subscribe to `notifications()` to render toasts.
 * Auto-dismisses after a configurable duration.
 */
@Injectable({ providedIn: 'root' })
export class NotificationService {
  private nextId = 0;
  private readonly _notifications = signal<Notification[]>([]);

  readonly notifications = this._notifications.asReadonly();

  success(message: string): void {
    this.add(message, 'success');
  }

  error(message: string): void {
    this.add(message, 'error');
  }

  info(message: string): void {
    this.add(message, 'info');
  }

  warning(message: string): void {
    this.add(message, 'warning');
  }

  dismiss(id: number): void {
    this._notifications.update((list) => list.filter((n) => n.id !== id));
  }

  private add(message: string, type: Notification['type'], duration = 4000): void {
    const id = this.nextId++;
    this._notifications.update((list) => [...list, { id, message, type }]);

    setTimeout(() => this.dismiss(id), duration);
  }
}

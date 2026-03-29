import { Injectable, computed, signal } from '@angular/core';

/**
 * Tracks in-flight HTTP requests via signals.
 * Components can bind to `isLoading()` for global loading state.
 */
@Injectable({ providedIn: 'root' })
export class LoadingService {
  private readonly activeRequests = signal(0);

  /** True when at least one HTTP request is in flight */
  readonly isLoading = computed(() => this.activeRequests() > 0);

  start(): void {
    this.activeRequests.update((n) => n + 1);
  }

  stop(): void {
    this.activeRequests.update((n) => Math.max(0, n - 1));
  }
}

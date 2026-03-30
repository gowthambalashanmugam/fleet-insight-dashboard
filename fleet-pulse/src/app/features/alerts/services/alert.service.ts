import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable, forkJoin, tap, catchError, of } from 'rxjs';
import { Alert } from '../../../core/models/alert.model';
import { AlertDataService } from '../../../core/services/alert-data.service';
import { WebSocketService } from '../../../core/services/websocket.service';
import { ApiService } from '../../../core/services/api.service';
import { DeleteAlertResponse } from '../../../core/models/api.model';

@Injectable()
export class AlertService {
  private readonly alertDataService = inject(AlertDataService);
  private readonly webSocketService = inject(WebSocketService);
  private readonly apiService = inject(ApiService);

  private readonly alertsSubject = new BehaviorSubject<Alert[]>([]);
  readonly alerts$ = this.alertsSubject.asObservable();

  constructor() {
    this.webSocketService.alerts$.subscribe((wsAlerts) => {
      const current = this.alertsSubject.getValue();
      const currentIds = new Set(current.map((a) => a.id));
      const newAlerts = wsAlerts.filter((a) => !currentIds.has(a.id));
      if (newAlerts.length > 0) {
        this.alertsSubject.next([...newAlerts, ...current]);
      }
    });
  }

  loadAlerts(): Observable<Alert[]> {
    return this.alertDataService.getAlerts().pipe(
      tap((alerts) => this.alertsSubject.next(alerts)),
      catchError((err) => {
        console.error('Failed to load alerts:', err);
        throw err;
      })
    );
  }

  deleteAlert(id: string): Observable<DeleteAlertResponse> {
    return this.apiService.delete<DeleteAlertResponse>(`/alerts/${id}`).pipe(
      tap(() => {
        const current = this.alertsSubject.getValue();
        this.alertsSubject.next(current.filter((a) => a.id !== id));
      })
    );
  }

  deleteAlerts(ids: string[]): Observable<DeleteAlertResponse[]> {
    return forkJoin(
      ids.map((id) => this.apiService.delete<DeleteAlertResponse>(`/alerts/${id}`))
    ).pipe(
      tap(() => {
        const idsToRemove = new Set(ids);
        const current = this.alertsSubject.getValue();
        this.alertsSubject.next(current.filter((a) => !idsToRemove.has(a.id)));
      })
    );
  }
}

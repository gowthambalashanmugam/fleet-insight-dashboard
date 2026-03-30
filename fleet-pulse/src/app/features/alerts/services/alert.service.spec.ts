import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { Subject, of } from 'rxjs';
import { AlertService } from './alert.service';
import { AlertDataService } from '../../../core/services/alert-data.service';
import { WebSocketService } from '../../../core/services/websocket.service';
import { ApiService } from '../../../core/services/api.service';
import { Alert } from '../../../core/models/alert.model';

function makeAlert(overrides: Partial<Alert> = {}): Alert {
  return {
    id: '1',
    vehicleId: 'v1',
    vehicleName: 'Truck A',
    latitude: 0,
    longitude: 0,
    severity: 'WARNING',
    title: 'Test Alert',
    message: 'test',
    type: 'IDLE',
    timestamp: new Date().toISOString(),
    location: 'Stockholm',
    status: 'ACTIVE',
    ...overrides,
  };
}

describe('AlertService', () => {
  let service: AlertService;
  let alertDataService: jasmine.SpyObj<AlertDataService>;
  let apiService: jasmine.SpyObj<ApiService>;
  let wsAlerts$: Subject<Alert[]>;

  beforeEach(() => {
    wsAlerts$ = new Subject<Alert[]>();

    alertDataService = jasmine.createSpyObj('AlertDataService', ['getAlerts']);
    apiService = jasmine.createSpyObj('ApiService', ['delete']);

    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        AlertService,
        { provide: AlertDataService, useValue: alertDataService },
        {
          provide: WebSocketService,
          useValue: { alerts$: wsAlerts$.asObservable() },
        },
        { provide: ApiService, useValue: apiService },
      ],
    });

    service = TestBed.inject(AlertService);
  });

  it('should start with an empty alerts array', (done) => {
    service.alerts$.subscribe((alerts) => {
      expect(alerts).toEqual([]);
      done();
    });
  });

  it('loadAlerts should populate alerts$ from AlertDataService', (done) => {
    const mockAlerts = [makeAlert({ id: 'a1' }), makeAlert({ id: 'a2' })];
    alertDataService.getAlerts.and.returnValue(of(mockAlerts));

    service.loadAlerts();

    service.alerts$.subscribe((alerts) => {
      expect(alerts.length).toBe(2);
      expect(alerts.map((a) => a.id)).toEqual(['a1', 'a2']);
      done();
    });
  });

  it('should merge WebSocket alerts with existing alerts', (done) => {
    const initial = [makeAlert({ id: 'a1' })];
    alertDataService.getAlerts.and.returnValue(of(initial));
    service.loadAlerts();

    const wsAlert = makeAlert({ id: 'ws1' });
    wsAlerts$.next([wsAlert]);

    service.alerts$.subscribe((alerts) => {
      expect(alerts.length).toBe(2);
      expect(alerts[0].id).toBe('ws1');
      expect(alerts[1].id).toBe('a1');
      done();
    });
  });

  it('should not duplicate alerts from WebSocket that already exist', (done) => {
    const initial = [makeAlert({ id: 'a1' })];
    alertDataService.getAlerts.and.returnValue(of(initial));
    service.loadAlerts();

    wsAlerts$.next([makeAlert({ id: 'a1' })]);

    service.alerts$.subscribe((alerts) => {
      expect(alerts.length).toBe(1);
      done();
    });
  });

  it('deleteAlert should remove the alert from local state on success', (done) => {
    const initial = [makeAlert({ id: 'a1' }), makeAlert({ id: 'a2' })];
    alertDataService.getAlerts.and.returnValue(of(initial));
    service.loadAlerts();

    apiService.delete.and.returnValue(of({ message: 'deleted' }));

    service.deleteAlert('a1').subscribe(() => {
      service.alerts$.subscribe((alerts) => {
        expect(alerts.length).toBe(1);
        expect(alerts[0].id).toBe('a2');
        done();
      });
    });

    expect(apiService.delete).toHaveBeenCalledWith('/alerts/a1');
  });

  it('deleteAlerts should remove multiple alerts from local state', (done) => {
    const initial = [
      makeAlert({ id: 'a1' }),
      makeAlert({ id: 'a2' }),
      makeAlert({ id: 'a3' }),
    ];
    alertDataService.getAlerts.and.returnValue(of(initial));
    service.loadAlerts();

    apiService.delete.and.returnValue(of({ message: 'deleted' }));

    service.deleteAlerts(['a1', 'a3']).subscribe(() => {
      service.alerts$.subscribe((alerts) => {
        expect(alerts.length).toBe(1);
        expect(alerts[0].id).toBe('a2');
        done();
      });
    });
  });
});

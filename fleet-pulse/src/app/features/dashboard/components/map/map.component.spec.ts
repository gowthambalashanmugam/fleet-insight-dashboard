import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, provideZonelessChangeDetection } from '@angular/core';
import { MapComponent } from './map.component';
import { Vehicle } from '../../../../core/models/vehicle.model';
import { Alert } from '../../../../core/models/alert.model';
import { CircleMarker, Circle } from 'leaflet';

@Component({
  template: `<app-map [vehicles]="vehicles" [alerts]="alerts" />`,
  imports: [MapComponent],
})
class TestHostComponent {
  vehicles: Vehicle[] = [];
  alerts: Alert[] = [];
}

describe('MapComponent', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let host: TestHostComponent;
  let mapComponent: MapComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    host = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();

    mapComponent = fixture.debugElement.children[0].componentInstance;
  });

  it('should create the component', () => {
    expect(mapComponent).toBeTruthy();
  });

  it('should render the map container', () => {
    const mapEl = fixture.nativeElement.querySelector('.map-container');
    expect(mapEl).toBeTruthy();
  });

  it('should produce zero markers for empty vehicles', () => {
    expect(mapComponent.vehicleMarkers().length).toBe(0);
  });

  it('should produce zero overlays for empty alerts', () => {
    expect(mapComponent.alertOverlays().length).toBe(0);
  });

  it('should produce markers matching vehicle count', async () => {
    host.vehicles = [
      mockVehicle('v1', 'Active', 59.33, 18.07),
      mockVehicle('v2', 'Idle', 57.71, 11.97),
    ];
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(mapComponent.vehicleMarkers().length).toBe(2);
  });

  it('should color Active vehicles green', async () => {
    host.vehicles = [mockVehicle('v1', 'Active', 59.33, 18.07)];
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();
    await fixture.whenStable();

    const marker = mapComponent.vehicleMarkers()[0] as CircleMarker;
    expect(marker.options.fillColor).toBe('#22c55e');
  });

  it('should color Idle vehicles yellow', async () => {
    host.vehicles = [mockVehicle('v1', 'Idle', 59.33, 18.07)];
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();
    await fixture.whenStable();

    const marker = mapComponent.vehicleMarkers()[0] as CircleMarker;
    expect(marker.options.fillColor).toBe('#eab308');
  });

  it('should color vehicles with alerts red', async () => {
    host.vehicles = [mockVehicle('v1', 'Active', 59.33, 18.07)];
    host.alerts = [mockAlert('a1', 'v1', 59.33, 18.07)];
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();
    await fixture.whenStable();

    const marker = mapComponent.vehicleMarkers()[0] as CircleMarker;
    expect(marker.options.fillColor).toBe('#ef4444');
  });

  it('should produce alert overlays matching alert count', async () => {
    host.alerts = [
      mockAlert('a1', 'v1', 59.33, 18.07),
      mockAlert('a2', 'v2', 57.71, 11.97),
    ];
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(mapComponent.alertOverlays().length).toBe(2);
  });

  it('should place alert overlay at correct position', async () => {
    host.alerts = [mockAlert('a1', 'v1', 60.5, 17.2)];
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();
    await fixture.whenStable();

    const overlay = mapComponent.alertOverlays()[0] as Circle;
    const center = overlay.getLatLng();
    expect(center.lat).toBe(60.5);
    expect(center.lng).toBe(17.2);
  });

  it('should place vehicle marker at correct position', async () => {
    host.vehicles = [mockVehicle('v1', 'Active', 63.2, 14.8)];
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();
    await fixture.whenStable();

    const marker = mapComponent.vehicleMarkers()[0] as CircleMarker;
    const pos = marker.getLatLng();
    expect(pos.lat).toBe(63.2);
    expect(pos.lng).toBe(14.8);
  });

  it('should render zoom controls', () => {
    const buttons = fixture.nativeElement.querySelectorAll('.control-btn');
    expect(buttons.length).toBe(3);
  });

  it('should filter out vehicles with NaN coordinates', async () => {
    host.vehicles = [
      mockVehicle('v1', 'Active', NaN, 18.07),
      mockVehicle('v2', 'Active', 59.33, 18.07),
    ];
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(mapComponent.vehicleMarkers().length).toBe(1);
  });
});

function mockVehicle(
  id: string,
  status: 'Active' | 'Idle' | 'Maintenance',
  lat: number,
  lng: number
): Vehicle {
  return {
    id,
    name: `Vehicle ${id}`,
    registration: `SFM-${id}`,
    status,
    latitude: lat,
    longitude: lng,
    speed: 60,
    fuelLevel: 75,
  };
}

function mockAlert(id: string, vehicleId: string, lat: number, lng: number): Alert {
  return {
    id,
    vehicleId,
    latitude: lat,
    longitude: lng,
    severity: 'high',
    message: 'Test alert',
  };
}

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, provideZonelessChangeDetection } from '@angular/core';
import { MapComponent } from './map.component';
import { Vehicle } from '../../../../core/models/vehicle.model';
import { Alert } from '../../../../core/models/alert.model';

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

  it('should start with leafletReady as false', () => {
    expect(mapComponent.leafletReady()).toBe(false);
  });

  it('should start with leafletError as null', () => {
    expect(mapComponent.leafletError()).toBeNull();
  });

  it('should show loading placeholder before leaflet loads', () => {
    const placeholder = fixture.nativeElement.querySelector('.map-placeholder');
    expect(placeholder).toBeTruthy();
  });

  it('should not show map container before leaflet loads', () => {
    const mapEl = fixture.nativeElement.querySelector('.map-container');
    expect(mapEl).toBeFalsy();
  });

  it('should not show controls before leaflet loads', () => {
    const controls = fixture.nativeElement.querySelector('.map-controls');
    expect(controls).toBeFalsy();
  });

  it('should show map container after leaflet loads', async () => {
    // Simulate leaflet loading by setting the signal
    mapComponent.leafletReady.set(true);
    fixture.detectChanges();
    await fixture.whenStable();

    const mapEl = fixture.nativeElement.querySelector('.map-container');
    expect(mapEl).toBeTruthy();
  });

  it('should show controls after leaflet loads', async () => {
    mapComponent.leafletReady.set(true);
    fixture.detectChanges();
    await fixture.whenStable();

    const controls = fixture.nativeElement.querySelector('.map-controls');
    expect(controls).toBeTruthy();
  });

  it('should show error message when leaflet fails to load', async () => {
    mapComponent.leafletError.set('Unable to load the map. Please try refreshing the page.');
    fixture.detectChanges();
    await fixture.whenStable();

    const errorEl = fixture.nativeElement.querySelector('.map-error');
    expect(errorEl).toBeTruthy();
    expect(errorEl.textContent).toContain('Unable to load the map');
  });

  it('should not show placeholder when error is set', async () => {
    mapComponent.leafletError.set('Error');
    fixture.detectChanges();
    await fixture.whenStable();

    const placeholder = fixture.nativeElement.querySelector('.map-placeholder');
    expect(placeholder).toBeFalsy();
  });

  it('should render 4 control buttons when leaflet is ready', async () => {
    mapComponent.leafletReady.set(true);
    fixture.detectChanges();
    await fixture.whenStable();

    const buttons = fixture.nativeElement.querySelectorAll('.control-btn');
    expect(buttons.length).toBe(4);
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

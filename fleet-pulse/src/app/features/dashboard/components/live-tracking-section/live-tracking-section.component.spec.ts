import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, provideZonelessChangeDetection } from '@angular/core';
import { LiveTrackingSectionComponent } from './live-tracking-section.component';
import { Vehicle } from '../../../../core/models/vehicle.model';
import { Alert } from '../../../../core/models/alert.model';

@Component({
  template: `<app-live-tracking-section
    [vehicles]="vehicles"
    [alerts]="alerts"
    (seeAllClick)="seeAllClicked = true"
    (refreshRequest)="refreshCount = refreshCount + 1"
  />`,
  imports: [LiveTrackingSectionComponent],
})
class TestHostComponent {
  vehicles: Vehicle[] = [];
  alerts: Alert[] = [];
  seeAllClicked = false;
  refreshCount = 0;
}

describe('LiveTrackingSectionComponent', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let host: TestHostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    host = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create the component', () => {
    const section = fixture.nativeElement.querySelector('.live-tracking');
    expect(section).toBeTruthy();
  });

  it('should display "Live Tracking" title', () => {
    const title = fixture.nativeElement.querySelector('h2');
    expect(title.textContent.trim()).toBe('Live Tracking');
  });

  it('should display auto-refresh checkbox checked by default', () => {
    const checkbox: HTMLInputElement = fixture.nativeElement.querySelector(
      'input[type="checkbox"]'
    );
    expect(checkbox).toBeTruthy();
    expect(checkbox.checked).toBeTrue();
  });

  it('should display refresh button', () => {
    const btn = fixture.nativeElement.querySelector('.refresh-btn');
    expect(btn).toBeTruthy();
    expect(btn.textContent).toContain('Refresh');
  });

  it('should display See All button', () => {
    const btn = fixture.nativeElement.querySelector('.see-all-link');
    expect(btn).toBeTruthy();
    expect(btn.textContent.trim()).toBe('See All');
  });

  it('should emit seeAllClick when See All is clicked', async () => {
    const btn: HTMLButtonElement = fixture.nativeElement.querySelector('.see-all-link');
    btn.click();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(host.seeAllClicked).toBeTrue();
  });

  it('should emit refreshRequest when refresh button is clicked', async () => {
    const btn: HTMLButtonElement = fixture.nativeElement.querySelector('.refresh-btn');
    btn.click();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(host.refreshCount).toBe(1);
  });

  it('should toggle auto-refresh off when checkbox is clicked', async () => {
    const sectionComponent: LiveTrackingSectionComponent =
      fixture.debugElement.children[0].componentInstance;
    expect(sectionComponent.autoRefresh()).toBeTrue();

    const checkbox: HTMLInputElement = fixture.nativeElement.querySelector(
      'input[type="checkbox"]'
    );
    checkbox.click();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(sectionComponent.autoRefresh()).toBeFalse();
  });

  it('should host the map component', () => {
    const map = fixture.nativeElement.querySelector('app-map');
    expect(map).toBeTruthy();
  });
});

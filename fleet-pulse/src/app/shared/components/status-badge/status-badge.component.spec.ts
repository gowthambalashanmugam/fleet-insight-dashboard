import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, provideZonelessChangeDetection } from '@angular/core';
import { StatusBadgeComponent } from './status-badge.component';

@Component({
  template: `<app-status-badge [status]="status" />`,
  imports: [StatusBadgeComponent],
})
class TestHostComponent {
  status = 'Active';
}

@Component({
  template: `<app-status-badge [status]="status" [colorMap]="colorMap" />`,
  imports: [StatusBadgeComponent],
})
class TestHostWithColorMapComponent {
  status = 'Active';
  colorMap: Record<string, string> = { Active: '#ff0000' };
}

describe('StatusBadgeComponent', () => {
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

  async function updateStatus(status: string): Promise<void> {
    host.status = status;
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();
    await fixture.whenStable();
  }

  it('should render the status text', () => {
    const badge: HTMLElement = fixture.nativeElement.querySelector('.status-badge');
    expect(badge.textContent?.trim()).toBe('Active');
  });

  it('should apply default color for Active status', () => {
    const badge: HTMLElement = fixture.nativeElement.querySelector('.status-badge');
    expect(badge.style.backgroundColor).toBe('rgb(34, 197, 94)');
  });

  it('should apply default color for Ongoing status', async () => {
    await updateStatus('Ongoing');
    const badge: HTMLElement = fixture.nativeElement.querySelector('.status-badge');
    expect(badge.style.backgroundColor).toBe('rgb(59, 130, 246)');
  });

  it('should apply default color for Done status', async () => {
    await updateStatus('Done');
    const badge: HTMLElement = fixture.nativeElement.querySelector('.status-badge');
    expect(badge.style.backgroundColor).toBe('rgb(34, 197, 94)');
  });

  it('should apply default color for Cancelled status', async () => {
    await updateStatus('Cancelled');
    const badge: HTMLElement = fixture.nativeElement.querySelector('.status-badge');
    expect(badge.style.backgroundColor).toBe('rgb(239, 68, 68)');
  });

  it('should apply default color for Idle status', async () => {
    await updateStatus('Idle');
    const badge: HTMLElement = fixture.nativeElement.querySelector('.status-badge');
    expect(badge.style.backgroundColor).toBe('rgb(234, 179, 8)');
  });

  it('should apply default color for Maintenance status', async () => {
    await updateStatus('Maintenance');
    const badge: HTMLElement = fixture.nativeElement.querySelector('.status-badge');
    expect(badge.style.backgroundColor).toBe('rgb(239, 68, 68)');
  });

  it('should fall back to gray for unknown status', async () => {
    await updateStatus('Unknown');
    const badge: HTMLElement = fixture.nativeElement.querySelector('.status-badge');
    expect(badge.style.backgroundColor).toBe('rgb(107, 114, 128)');
  });
});

describe('StatusBadgeComponent with custom colorMap', () => {
  let fixture: ComponentFixture<TestHostWithColorMapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostWithColorMapComponent],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostWithColorMapComponent);
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should use custom colorMap when provided', () => {
    const badge: HTMLElement = fixture.nativeElement.querySelector('.status-badge');
    expect(badge.style.backgroundColor).toBe('rgb(255, 0, 0)');
  });
});

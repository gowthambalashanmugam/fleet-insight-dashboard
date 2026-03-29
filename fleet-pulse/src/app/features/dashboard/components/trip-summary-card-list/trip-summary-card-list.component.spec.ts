import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, provideZonelessChangeDetection } from '@angular/core';
import { TripSummaryCardListComponent } from './trip-summary-card-list.component';
import { TripSummaryItem } from '../../../../core/models/trip-summary.model';

@Component({
  template: `<app-trip-summary-card-list [tripSummary]="tripSummary" />`,
  imports: [TripSummaryCardListComponent],
})
class TestHostComponent {
  tripSummary: TripSummaryItem[] = [
    {
      title: 'Total Trip',
      value: 1250,
      trendPercentage: 15,
      trendDirection: 'up',
      iconType: 'trip',
      color: '#6366f1',
    },
    {
      title: 'On Going Trip',
      value: 360,
      trendPercentage: 8,
      trendDirection: 'up',
      iconType: 'ongoing',
      color: '#3b82f6',
    },
    {
      title: 'Cancelled Trip',
      value: 72,
      trendPercentage: 3,
      trendDirection: 'down',
      iconType: 'cancelled',
      color: '#ef4444',
    },
  ];
}

describe('TripSummaryCardListComponent', () => {
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

  it('should render three trip summary cards', () => {
    const cards = fixture.nativeElement.querySelectorAll('app-trip-summary-card');
    expect(cards.length).toBe(3);
  });

  it('should render all card titles', () => {
    const text = fixture.nativeElement.textContent;
    expect(text).toContain('Total Trip');
    expect(text).toContain('On Going Trip');
    expect(text).toContain('Cancelled Trip');
  });

  it('should render all card values', () => {
    const text = fixture.nativeElement.textContent;
    expect(text).toContain('1250');
    expect(text).toContain('360');
    expect(text).toContain('72');
  });

  it('should handle empty trip summary array', async () => {
    host.tripSummary = [];
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();
    await fixture.whenStable();

    const cards = fixture.nativeElement.querySelectorAll('app-trip-summary-card');
    expect(cards.length).toBe(0);
  });

  it('should use flex-col layout with gap', () => {
    const container = fixture.nativeElement.querySelector('.flex.flex-col.gap-4');
    expect(container).toBeTruthy();
  });
});

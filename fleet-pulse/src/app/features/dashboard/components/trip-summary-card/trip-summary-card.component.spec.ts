import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, provideZonelessChangeDetection } from '@angular/core';
import { TripSummaryCardComponent } from './trip-summary-card.component';

@Component({
  template: `<app-trip-summary-card
    [title]="title"
    [value]="value"
    [trendPercentage]="trendPercentage"
    [trendDirection]="trendDirection"
    [chartType]="chartType"
    [chartData]="chartData"
    [color]="color"
  />`,
  imports: [TripSummaryCardComponent],
})
class TestHostComponent {
  title = 'Total Trip';
  value = 1250;
  trendPercentage = 15;
  trendDirection: 'up' | 'down' = 'up';
  chartType: 'donut' | 'bar' | 'area' = 'donut';
  chartData = [75, 25];
  color = '#6366f1';
}

describe('TripSummaryCardComponent', () => {
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

  it('should render the title', () => {
    const el: HTMLElement = fixture.nativeElement;
    expect(el.textContent).toContain('Total Trip');
  });

  it('should render the value', () => {
    const el: HTMLElement = fixture.nativeElement;
    expect(el.textContent).toContain('1250');
  });

  it('should render the trend percentage', () => {
    const el: HTMLElement = fixture.nativeElement;
    expect(el.textContent).toContain('15%');
  });

  it('should show up arrow for positive trend', () => {
    const el: HTMLElement = fixture.nativeElement;
    const trend = el.querySelector('.trend');
    expect(trend?.textContent).toContain('▲');
  });

  it('should show down arrow for negative trend', async () => {
    host.trendDirection = 'down';
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();
    await fixture.whenStable();

    const el: HTMLElement = fixture.nativeElement;
    const trend = el.querySelector('.trend');
    expect(trend?.textContent).toContain('▼');
  });

  it('should render a canvas element for the chart', () => {
    const canvas = fixture.nativeElement.querySelector('canvas');
    expect(canvas).toBeTruthy();
    expect(canvas.width).toBe(60);
    expect(canvas.height).toBe(40);
  });

  it('should apply card-base styling', () => {
    const card = fixture.nativeElement.querySelector('.trip-summary-card');
    expect(card).toBeTruthy();
  });
});

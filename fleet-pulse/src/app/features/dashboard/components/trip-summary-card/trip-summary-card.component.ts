import {
  Component,
  input,
  ElementRef,
  viewChild,
  afterNextRender,
  effect,
  OnDestroy,
  signal,
} from '@angular/core';

@Component({
  selector: 'app-trip-summary-card',
  templateUrl: './trip-summary-card.component.html',
  styleUrl: './trip-summary-card.component.scss',
})
export class TripSummaryCardComponent implements OnDestroy {
  readonly title = input.required<string>();
  readonly value = input.required<number>();
  readonly trendPercentage = input.required<number>();
  readonly trendDirection = input.required<'up' | 'down'>();
  readonly chartType = input.required<'donut' | 'bar' | 'area'>();
  readonly chartData = input.required<number[]>();
  readonly color = input.required<string>();

  readonly chartCanvas = viewChild<ElementRef<HTMLCanvasElement>>('chartCanvas');

  readonly chartLoading = signal(true);
  readonly chartError = signal<string | null>(null);

  private ChartCtor: any = null;
  private chart: any = null;
  private rendered = false;

  constructor() {
    afterNextRender(async () => {
      this.rendered = true;
      await this.loadChartJs();
    });

    effect(() => {
      // Track signal dependencies so effect re-runs on input changes
      this.chartData();
      this.chartType();
      this.color();
      if (this.rendered && this.ChartCtor) {
        this.rebuildChart();
      }
    });
  }

  private async loadChartJs(): Promise<void> {
    try {
      const { default: Chart } = await import('chart.js/auto');
      this.ChartCtor = Chart;
      this.chartLoading.set(false);
      this.rebuildChart();
    } catch (e) {
      this.chartLoading.set(false);
      this.chartError.set('Unable to load chart. Please try refreshing the page.');
    }
  }

  private rebuildChart(): void {
    if (this.chart) {
      this.chart.destroy();
      this.chart = null;
    }
    this.createChart();
  }

  ngOnDestroy(): void {
    this.chart?.destroy();
  }

  get trendColor(): string {
    return this.trendDirection() === 'up'
      ? 'var(--color-trend-up)'
      : 'var(--color-trend-down)';
  }

  get trendArrow(): string {
    return this.trendDirection() === 'up' ? '▲' : '▼';
  }

  private createChart(): void {
    const canvas = this.chartCanvas();
    if (!canvas || !this.ChartCtor) return;

    const ctx = canvas.nativeElement.getContext('2d');
    if (!ctx) return;

    const data = this.chartData();
    const color = this.color();
    const type = this.chartType();

    switch (type) {
      case 'donut':
        this.chart = this.createDonutChart(ctx, data, color);
        break;
      case 'bar':
        this.chart = this.createBarChart(ctx, data, color);
        break;
      case 'area':
        this.chart = this.createAreaChart(ctx, data, color);
        break;
    }
  }

  private createDonutChart(ctx: CanvasRenderingContext2D, data: number[], color: string): any {
    return new this.ChartCtor(ctx, {
      type: 'doughnut',
      data: {
        labels: data.map((_, i) => `${i}`),
        datasets: [
          {
            data,
            backgroundColor: [color, `${color}33`],
            borderWidth: 0,
          },
        ],
      },
      options: {
        responsive: false,
        cutout: '65%',
        plugins: { legend: { display: false }, tooltip: { enabled: false } },
        events: [],
      },
    });
  }

  private createBarChart(ctx: CanvasRenderingContext2D, data: number[], color: string): any {
    return new this.ChartCtor(ctx, {
      type: 'bar',
      data: {
        labels: data.map((_, i) => `${i}`),
        datasets: [
          {
            data,
            backgroundColor: color,
            borderRadius: 2,
            barPercentage: 0.6,
          },
        ],
      },
      options: {
        responsive: false,
        plugins: { legend: { display: false }, tooltip: { enabled: false } },
        scales: {
          x: { display: false },
          y: { display: false },
        },
        events: [],
      },
    });
  }

  private createAreaChart(ctx: CanvasRenderingContext2D, data: number[], color: string): any {
    return new this.ChartCtor(ctx, {
      type: 'line',
      data: {
        labels: data.map((_, i) => `${i}`),
        datasets: [
          {
            data,
            borderColor: color,
            backgroundColor: `${color}33`,
            fill: true,
            tension: 0.4,
            pointRadius: 0,
            borderWidth: 2,
          },
        ],
      },
      options: {
        responsive: false,
        plugins: { legend: { display: false }, tooltip: { enabled: false } },
        scales: {
          x: { display: false },
          y: { display: false },
        },
        events: [],
      },
    });
  }
}

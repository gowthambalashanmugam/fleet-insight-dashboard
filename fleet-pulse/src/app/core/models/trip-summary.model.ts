export interface TripSummaryItem {
  title: string;
  value: number;
  trendPercentage: number;
  trendDirection: 'up' | 'down';
  iconType: string;
  color: string;
}

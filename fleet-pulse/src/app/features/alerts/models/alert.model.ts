import { AlertSeverity, AlertType } from '../../../core/models/alert.model';

export interface AlertFilterCriteria {
  severities: AlertSeverity[];
  vehicleName: string | null;
  dateRange: { start: string | null; end: string | null };
  types: AlertType[];
}

export type SortOption = 'latest' | 'severity';

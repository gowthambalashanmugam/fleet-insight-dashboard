export type AlertSeverity = 'low' | 'medium' | 'high';

export interface Alert {
  id: string;
  vehicleId: string;
  latitude: number;
  longitude: number;
  severity: AlertSeverity;
  message: string;
}

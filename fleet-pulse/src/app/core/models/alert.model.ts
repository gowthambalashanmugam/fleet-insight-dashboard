export type AlertType = 'OVER_SPEED' | 'DTC' | 'IDLE' | 'GEOFENCE';
export type AlertSeverity = 'CRITICAL' | 'WARNING' | 'INFO';
export type AlertStatus = 'ACTIVE' | 'ACKNOWLEDGED' | 'RESOLVED';

export interface Alert {
  id: string;
  vehicleId: string;
  vehicleName: string;
  latitude: number;
  longitude: number;
  severity: AlertSeverity;
  title: string;
  message: string;
  type: AlertType;
  timestamp: string;
  location: string;
  status: AlertStatus;
  metadata?: any;
}

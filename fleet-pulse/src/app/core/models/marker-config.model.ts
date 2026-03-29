import { Vehicle } from './vehicle.model';
import { Alert } from './alert.model';

export interface MarkerConfig {
  id: string;
  latitude: number;
  longitude: number;
  iconHtml: string;
  popupHtml: string;
  color: string;
}

export interface AlertOverlayConfig {
  id: string;
  latitude: number;
  longitude: number;
  innerRadius: number;
  outerRadius: number;
  color: string;
}

export interface MarkerProcessingRequest {
  vehicles: Vehicle[];
  alerts: Alert[];
}

export interface MarkerProcessingResponse {
  markers: MarkerConfig[];
  alertOverlays: AlertOverlayConfig[];
}

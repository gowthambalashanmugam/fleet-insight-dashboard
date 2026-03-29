import { Vehicle } from '../../../../core/models/vehicle.model';
import { Alert } from '../../../../core/models/alert.model';
import {
  MarkerConfig,
  AlertOverlayConfig,
  MarkerProcessingResponse,
} from '../../../../core/models/marker-config.model';

export const STATUS_COLOR_MAP: Record<string, string> = {
  Active: '#22c55e',
  Idle: '#3b82f6',
  Maintenance: '#eab308',
  Alert: '#ef4444',
};

export function isValidCoordinate(lat: number, lng: number): boolean {
  return Number.isFinite(lat) && Number.isFinite(lng);
}

export function buildMarkerConfig(vehicle: Vehicle, alertSet: Set<string>): MarkerConfig {
  const hasAlert = alertSet.has(vehicle.id);
  const color = hasAlert
    ? STATUS_COLOR_MAP['Alert']
    : (STATUS_COLOR_MAP[vehicle.status] ?? '#6b7280');

  const iconHtml = `
            <div class="truck-icon" style="background: ${color};">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4zM6 18.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm13.5-9 1.96 2.5H17V9.5h2.5zm-1.5 9c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/>
              </svg>
            </div>
          `;

  const statusColor = STATUS_COLOR_MAP[vehicle.status] ?? '#6b7280';
  const popupHtml = `
      <div style="font-family: 'Inter', system-ui, sans-serif; min-width: 180px; padding: 4px 0;">
        <div style="font-size: 14px; font-weight: 600; margin-bottom: 8px;">${vehicle.name}</div>
        <div style="display: grid; grid-template-columns: auto 1fr; gap: 4px 12px; font-size: 12px; color: #555;">
          <span>Status</span>
          <span style="font-weight: 600; color: ${statusColor};">${vehicle.status}</span>
          <span>Speed</span>
          <span style="font-weight: 600;">${vehicle.speed} km/h</span>
          <span>Fuel</span>
          <span style="font-weight: 600;">${vehicle.fuelLevel}%</span>
          <span>Reg.</span>
          <span style="font-weight: 600;">${vehicle.registration}</span>
        </div>
      </div>
    `;

  return {
    id: vehicle.id,
    latitude: vehicle.latitude,
    longitude: vehicle.longitude,
    color,
    iconHtml,
    popupHtml,
  };
}

export function buildAlertOverlayConfig(alert: Alert): AlertOverlayConfig {
  return {
    id: alert.id,
    latitude: alert.latitude,
    longitude: alert.longitude,
    innerRadius: 3000,
    outerRadius: 8000,
    color: '#ef4444',
  };
}

export function processMarkers(vehicles: Vehicle[], alerts: Alert[]): MarkerProcessingResponse {
  const alertSet = new Set(alerts.map((a) => a.vehicleId));

  const markers = vehicles
    .filter((v) => isValidCoordinate(v.latitude, v.longitude))
    .map((v) => buildMarkerConfig(v, alertSet));

  const alertOverlays = alerts
    .filter((a) => isValidCoordinate(a.latitude, a.longitude))
    .map((a) => buildAlertOverlayConfig(a));

  return { markers, alertOverlays };
}

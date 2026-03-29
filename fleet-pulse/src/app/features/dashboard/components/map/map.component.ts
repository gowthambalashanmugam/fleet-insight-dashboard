import { Component, computed, input, signal } from '@angular/core';
import { LeafletModule } from '@bluehalo/ngx-leaflet';
import {
  circle,
  divIcon,
  latLng,
  latLngBounds,
  marker,
  tileLayer,
  Layer,
  Map,
} from 'leaflet';
import { Vehicle } from '../../../../core/models/vehicle.model';
import { Alert } from '../../../../core/models/alert.model';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrl: './map.component.scss',
  imports: [LeafletModule],
})
export class MapComponent {
  readonly vehicles = input<Vehicle[]>([]);
  readonly alerts = input<Alert[]>([]);

  private readonly mapInstance = signal<Map | null>(null);

  private readonly defaultCenter = latLng(62, 15);
  private readonly defaultZoom = 5;

  readonly mapOptions = {
    center: this.defaultCenter,
    zoom: this.defaultZoom,
    layers: [
      tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; OpenStreetMap &copy; CARTO',
        maxZoom: 19,
      }),
    ],
    zoomControl: false,
  };

  private readonly statusColorMap: Record<string, string> = {
    Active: '#22c55e',
    Idle: '#3b82f6',
    Maintenance: '#eab308',
    Alert: '#ef4444',
  };

  readonly vehicleMarkers = computed<Layer[]>(() => {
    const vehicleList = this.vehicles();
    const alertSet = new Set(this.alerts().map((a) => a.vehicleId));

    return vehicleList
      .filter(
        (v) =>
          Number.isFinite(v.latitude) &&
          Number.isFinite(v.longitude) &&
          !Number.isNaN(v.latitude) &&
          !Number.isNaN(v.longitude)
      )
      .map((v) => {
        const hasAlert = alertSet.has(v.id);
        const color = hasAlert
          ? this.statusColorMap['Alert']
          : (this.statusColorMap[v.status] ?? '#6b7280');

        const icon = divIcon({
          className: 'truck-marker',
          html: `
            <div class="truck-icon" style="background: ${color};">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4zM6 18.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm13.5-9 1.96 2.5H17V9.5h2.5zm-1.5 9c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/>
              </svg>
            </div>
          `,
          iconSize: [32, 32],
          iconAnchor: [16, 16],
          popupAnchor: [0, -18],
        });

        const m = marker(latLng(v.latitude, v.longitude), { icon });
        m.bindPopup(this.buildPopupContent(v));
        return m;
      });
  });

  readonly alertOverlays = computed<Layer[]>(() => {
    return this.alerts()
      .filter(
        (a) =>
          Number.isFinite(a.latitude) &&
          Number.isFinite(a.longitude) &&
          !Number.isNaN(a.latitude) &&
          !Number.isNaN(a.longitude)
      )
      .flatMap((a) => {
        const center = latLng(a.latitude, a.longitude);
        const outer = circle(center, {
          radius: 8000,
          color: '#ef4444',
          fillColor: '#ef4444',
          fillOpacity: 0.08,
          weight: 1,
          opacity: 0.3,
          className: 'alert-pulse-outer',
        });
        const inner = circle(center, {
          radius: 3000,
          color: '#ef4444',
          fillColor: '#ef4444',
          fillOpacity: 0.2,
          weight: 1.5,
          opacity: 0.5,
          className: 'alert-pulse-inner',
        });
        return [outer, inner];
      });
  });

  readonly allLayers = computed<Layer[]>(() => [
    ...this.alertOverlays(),
    ...this.vehicleMarkers(),
  ]);

  onMapReady(map: Map): void {
    this.mapInstance.set(map);
    setTimeout(() => map.invalidateSize(), 100);
  }

  zoomIn(): void {
    this.mapInstance()?.zoomIn();
  }

  zoomOut(): void {
    this.mapInstance()?.zoomOut();
  }

  resetView(): void {
    this.mapInstance()?.setView(this.defaultCenter, this.defaultZoom);
  }

  fitBounds(): void {
    const map = this.mapInstance();
    if (!map) return;
    const vehicles = this.vehicles();
    if (vehicles.length === 0) return;
    const bounds = latLngBounds(
      vehicles
        .filter((v) => Number.isFinite(v.latitude) && Number.isFinite(v.longitude))
        .map((v) => latLng(v.latitude, v.longitude))
    );
    if (bounds.isValid()) {
      map.fitBounds(bounds.pad(0.1));
    }
  }

  private buildPopupContent(vehicle: Vehicle): string {
    const statusColor = this.statusColorMap[vehicle.status] ?? '#6b7280';
    return `
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
  }
}

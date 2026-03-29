import { Component, computed, input, signal } from '@angular/core';
import { LeafletModule } from '@bluehalo/ngx-leaflet';
import {
  circleMarker,
  circle,
  latLng,
  tileLayer,
  Layer,
  Map,
  CircleMarkerOptions,
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
      tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
      }),
    ],
    zoomControl: true,
  };

  private readonly statusColorMap: Record<string, string> = {
    Active: '#22c55e',
    Idle: '#eab308',
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
        const color = hasAlert ? this.statusColorMap['Alert'] : (this.statusColorMap[v.status] ?? '#6b7280');

        const options: CircleMarkerOptions = {
          radius: 8,
          fillColor: color,
          color: color,
          weight: 2,
          opacity: 1,
          fillOpacity: 0.8,
        };

        const marker = circleMarker(latLng(v.latitude, v.longitude), options);
        marker.bindPopup(this.buildPopupContent(v));
        return marker;
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
      .map((a) => {
        return circle(latLng(a.latitude, a.longitude), {
          radius: 5000,
          color: '#ef4444',
          fillColor: '#ef4444',
          fillOpacity: 0.15,
          weight: 2,
          opacity: 0.6,
        });
      });
  });

  readonly allLayers = computed<Layer[]>(() => [
    ...this.vehicleMarkers(),
    ...this.alertOverlays(),
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

  private buildPopupContent(vehicle: Vehicle): string {
    return `
      <div style="font-family: system-ui, sans-serif; min-width: 160px;">
        <strong style="font-size: 14px;">${vehicle.name}</strong>
        <div style="margin-top: 6px; font-size: 12px; color: #555;">
          <div>Status: <strong>${vehicle.status}</strong></div>
          <div>Speed: <strong>${vehicle.speed} km/h</strong></div>
          <div>Fuel: <strong>${vehicle.fuelLevel}%</strong></div>
        </div>
      </div>
    `;
  }
}

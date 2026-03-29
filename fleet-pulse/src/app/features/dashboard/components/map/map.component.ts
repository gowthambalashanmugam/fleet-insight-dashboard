import {
  Component,
  ChangeDetectorRef,
  effect,
  ElementRef,
  input,
  signal,
  viewChild,
  afterNextRender,
  Injector,
  OnDestroy,
  inject,
} from '@angular/core';
import { Vehicle } from '../../../../core/models/vehicle.model';
import { Alert } from '../../../../core/models/alert.model';
import { MarkerProcessingResponse } from '../../../../core/models/marker-config.model';
import { processMarkers } from './marker-processing';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrl: './map.component.scss',
  imports: [],
})
export class MapComponent implements OnDestroy {
  readonly vehicles = input<Vehicle[]>([]);
  readonly alerts = input<Alert[]>([]);

  readonly leafletReady = signal(false);
  readonly leafletError = signal<string | null>(null);

  private L: typeof import('leaflet') | null = null;
  private mapInstance: import('leaflet').Map | null = null;
  private layerGroup: import('leaflet').LayerGroup | null = null;

  private worker: Worker | null = null;
  private workerAvailable = false;
  private mapInitialized = false;

  private readonly injector = inject(Injector);
  private readonly cdr = inject(ChangeDetectorRef);

  readonly mapContainerRef = viewChild<ElementRef<HTMLDivElement>>('mapContainer');

  constructor() {
    afterNextRender(() => {
      this.loadLeaflet();
    });

    // Watch for vehicle/alert data changes and update layers
    effect(() => {
      this.vehicles();
      this.alerts();
      if (this.mapInitialized && this.L && this.mapInstance) {
        this.updateLayers();
      }
    });
  }

  ngOnDestroy(): void {
    this.worker?.terminate();
    if (this.mapInstance) {
      this.mapInstance.remove();
      this.mapInstance = null;
    }
  }

  private async loadLeaflet(): Promise<void> {
    try {
      const [leaflet] = await Promise.all([
        import('leaflet'),
        import('@bluehalo/ngx-leaflet'),
      ]);
      this.L = leaflet;
      this.leafletReady.set(true);
      // Trigger change detection so the template renders #mapContainer
      this.cdr.detectChanges();
      // Use afterNextRender to wait for the DOM to actually update
      afterNextRender(() => {
        if (!this.mapInitialized) {
          this.mapInitialized = true;
          this.initializeMap();
          this.initializeWorker();
        }
      }, { injector: this.injector });
    } catch (e) {
      this.leafletError.set('Unable to load the map. Please try refreshing the page.');
    }
  }

  private initializeWorker(): void {
    try {
      this.worker = new Worker(new URL('./map.worker.ts', import.meta.url), { type: 'module' });
      this.workerAvailable = true;
      this.worker.onmessage = ({ data }: MessageEvent<MarkerProcessingResponse>) => {
        this.applyWorkerResult(data);
      };
      this.worker.onerror = () => {
        this.workerAvailable = false;
        this.worker = null;
        this.updateLayersFallback();
      };
    } catch {
      this.workerAvailable = false;
    }
  }

  private initializeMap(): void {
    const L = this.L!;
    const container = this.mapContainerRef()?.nativeElement;
    if (!container) return;

    this.mapInstance = L.map(container, {
      center: L.latLng(62, 15),
      zoom: 5,
      layers: [
        L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
          attribution: '&copy; OpenStreetMap &copy; CARTO',
          maxZoom: 19,
        }),
      ],
      zoomControl: false,
    });

    this.layerGroup = L.layerGroup().addTo(this.mapInstance);
    setTimeout(() => this.mapInstance?.invalidateSize(), 100);
    this.updateLayers();
  }

  private updateLayers(): void {
    if (!this.L || !this.layerGroup) return;

    if (this.workerAvailable && this.worker) {
      this.worker.postMessage({ vehicles: this.vehicles(), alerts: this.alerts() });
    } else {
      this.updateLayersFallback();
    }
  }

  private updateLayersFallback(): void {
    const result = processMarkers(this.vehicles(), this.alerts());
    this.applyWorkerResult(result);
  }

  private applyWorkerResult(result: MarkerProcessingResponse): void {
    const L = this.L;
    if (!L || !this.layerGroup) return;

    this.layerGroup.clearLayers();

    // Create alert overlay circles from config data
    for (const overlay of result.alertOverlays) {
      const center = L.latLng(overlay.latitude, overlay.longitude);
      L.circle(center, {
        radius: overlay.outerRadius,
        color: overlay.color,
        fillColor: overlay.color,
        fillOpacity: 0.08,
        weight: 1,
        opacity: 0.3,
        className: 'alert-pulse-outer',
      }).addTo(this.layerGroup);
      L.circle(center, {
        radius: overlay.innerRadius,
        color: overlay.color,
        fillColor: overlay.color,
        fillOpacity: 0.2,
        weight: 1.5,
        opacity: 0.5,
        className: 'alert-pulse-inner',
      }).addTo(this.layerGroup);
    }

    // Create vehicle markers from config data
    for (const marker of result.markers) {
      const icon = L.divIcon({
        className: 'truck-marker',
        html: marker.iconHtml,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
        popupAnchor: [0, -18],
      });

      const m = L.marker(L.latLng(marker.latitude, marker.longitude), { icon });
      m.bindPopup(marker.popupHtml);
      m.addTo(this.layerGroup);
    }
  }

  zoomIn(): void {
    this.mapInstance?.zoomIn();
  }

  zoomOut(): void {
    this.mapInstance?.zoomOut();
  }

  resetView(): void {
    const L = this.L;
    if (L && this.mapInstance) {
      this.mapInstance.setView(L.latLng(62, 15), 5);
    }
  }

  fitBounds(): void {
    const L = this.L;
    const map = this.mapInstance;
    if (!L || !map) return;
    const vehicles = this.vehicles();
    if (vehicles.length === 0) return;
    const bounds = L.latLngBounds(
      vehicles
        .filter((v) => Number.isFinite(v.latitude) && Number.isFinite(v.longitude))
        .map((v) => L.latLng(v.latitude, v.longitude))
    );
    if (bounds.isValid()) {
      map.fitBounds(bounds.pad(0.1));
    }
  }
}

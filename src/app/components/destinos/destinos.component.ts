import { Component, OnInit, OnDestroy } from '@angular/core';
import { UbicacionService } from '../../Services/ubicacion.service';
import { NotificationService } from '../../utils/notification.service';
import { Ubicacion } from '../../model/ubicacion.model';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import { fromLonLat } from 'ol/proj';
import { Icon, Stroke, Style } from 'ol/style';
import { LineString } from 'ol/geom';
import { Router } from '@angular/router';
import { RouteEncoderService } from '../../Services/route-encoder.service';

@Component({
  selector: 'app-destinos',
  templateUrl: './destinos.component.html',
  styleUrls: ['./destinos.component.scss']
})
export class DestinosComponent implements OnInit, OnDestroy {
  ubicaciones: Ubicacion[] = [];
  isLoading: boolean = true;
  map!: Map;

  constructor(
    private ubicacionService: UbicacionService,
    private notification: NotificationService,
    private router: Router,
    private encoder: RouteEncoderService
  ) {}

  // Añadir métodos faltantes
  getTotalPaises(): number {
    return new Set(this.ubicaciones.map(u => u.pais)).size;
  }

  formatCoordinate(coord: string): string {
    const num = parseFloat(coord);
    return isNaN(num) ? 'Inválida' : num.toFixed(4).replace('.', ',');
  }

  private handleError(message: string): void {
    this.isLoading = false;
    this.notification.showMessage(message, 'error');
    this.ubicaciones = [];
  }

  private getErrorMessage(error: any): string {
    return error.status === 404 
      ? 'Tripulante no encontrado' 
      : 'Error cargando destinos';
  }

  private cleanupMap(): void {
    if (this.map) {
      this.map.dispose();
      const mapElement = document.getElementById('map-destinos');
      if (mapElement) mapElement.innerHTML = '';
    }
  }

  // Resto del código existente...
  ngOnInit(): void {
    this.loadUserData();
  }

  // Añadir en el ngOnDestroy
ngOnDestroy(): void {
  if (this.map) {
      this.map.setTarget();
      this.map.dispose();
  }
}

  private loadUserData(): void {
    const raw = localStorage.getItem('usuarioLogeado');
    if (!raw) { this.handleError('Debe iniciar sesión'); return; }

    try {
      const userData = JSON.parse(raw);        // JSON.parse puede lanzar error :contentReference[oaicite:2]{index=2}
      const tripulanteId = userData.id;        // <-- aquí cambias

      if (tripulanteId == null) {              // null o undefined
        this.handleError('ID de tripulante no encontrado');
        return;
      }

      this.loadUbicaciones(tripulanteId);
    } catch (e) {
      this.handleError('Error en formato de datos de usuario');
    }
}

  private loadUbicaciones(tripulanteId: number): void {
    this.isLoading = true;
    
    this.ubicacionService.getUbicacionesByTripulanteId(tripulanteId).subscribe({
      next: (ubicaciones) => {
        this.ubicaciones = this.processUbicaciones(ubicaciones);
        this.initMapConUbicaciones(this.ubicaciones);
        this.isLoading = false;
      },
      error: (err) => this.handleError(this.getErrorMessage(err))
    });
  }

  private processUbicaciones(ubicaciones: Ubicacion[]): Ubicacion[] {
    const coordenadasUnicas = new Set<string>();
    
    return ubicaciones.filter(ubicacion => {
        const lat = parseFloat(ubicacion.latitud).toFixed(4);
        const lon = parseFloat(ubicacion.longitud).toFixed(4);
        const clave = `${lat}|${lon}`;
        
        if (coordenadasUnicas.has(clave)) return false;
        
        coordenadasUnicas.add(clave);
        return this.isValidCoordinate(ubicacion.latitud) && 
               this.isValidCoordinate(ubicacion.longitud);
    });
}

  private isValidCoordinate(coord: string): boolean {
    return !isNaN(parseFloat(coord)) && isFinite(parseFloat(coord));
  }

  private initMapConUbicaciones(ubicaciones: Ubicacion[]): void {
    this.cleanupMap();
    if (ubicaciones.length === 0) return;

    // Esperar a que Angular actualice el DOM
    setTimeout(() => {
        const mapTarget = document.getElementById('map-destinos');
        
        if (!mapTarget) {
            console.error('Elemento del mapa no encontrado');
            return;
        }

        // Verificar dimensiones del contenedor
        if (mapTarget.offsetWidth === 0 || mapTarget.offsetHeight === 0) {
            mapTarget.style.height = '500px';
            mapTarget.style.width = '100%';
        }

        // Crear features
        const features = ubicaciones
            .filter(u => this.isValidCoordinate(u.latitud) && this.isValidCoordinate(u.longitud))
            .map(u => {
                const coord = fromLonLat([
                    parseFloat(u.longitud),
                    parseFloat(u.latitud)
                ]);
                return new Feature({
                    geometry: new Point(coord),
                    name: `${u.ciudad}, ${u.pais}`
                });
            });

        // Configurar capas
        const vectorSource = new VectorSource({ features });
        const vectorLayer = new VectorLayer({
            source: vectorSource,
            style: new Style({
                image: new Icon({
                    src: 'https://cdn-icons-png.flaticon.com/512/684/684908.png',
                    scale: 0.05,
                    anchor: [0.5, 1]
                })
            })
        });

        // Crear mapa
        this.map = new Map({
            target: 'map-destinos',
            layers: [new TileLayer({ source: new OSM() }), vectorLayer],
            view: new View({
                center: features.length > 0 
                    ? (features[0].getGeometry() as Point).getCoordinates()
                    : fromLonLat([0, 0]),
                zoom: 3
            })
        });

        // Ajustar vista si hay features
        if (features.length > 0) {
            const extent = vectorSource.getExtent();
            this.map.getView().fit(extent, {
                padding: [50, 50, 50, 50],
                maxZoom: 8
            });
        }

        // Forzar actualización después de renderizado
        setTimeout(() => this.map.updateSize(), 100);
    }, 0);
}

goBack(): void {
  this.router.navigate([ this.encoder.encode('homePermisos') ]);
}
}
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
import { Icon, Style } from 'ol/style';

@Component({
  selector: 'app-destinos',
  templateUrl: './destinos.component.html',
  styleUrls: ['./destinos.component.scss']
})
export class DestinosComponent implements OnInit, OnDestroy {
  ubicaciones: Ubicacion[] = [];
  map!: Map;

  constructor(
    private ubicacionService: UbicacionService,
    private notification: NotificationService
  ) {}

  ngOnInit(): void {
    const usuarioId = this.obtenerIdUsuario(); // Obtener ID de usuario
    if(usuarioId) {
      this.loadUbicaciones(usuarioId);
    } else {
      this.notification.showMessage('Debe iniciar sesión', 'error');
    }
  }
  ngOnDestroy(): void {
    if (this.map) {
      this.map.setTarget('');
    }
  }

  private loadUbicaciones(tripulanteId: number): void {
    this.ubicacionService.getUbicacionesByTripulanteId(tripulanteId).subscribe({
      next: (ubicaciones: Ubicacion[]) => {
        if (ubicaciones.length === 0) {
          this.notification.showMessage('Tienes vuelos pero no hay destinos registrados');
        }
        this.ubicaciones = ubicaciones;
        this.initMapConUbicaciones(ubicaciones);
      },
      error: (err) => {
        console.error('Error detallado:', err);
        this.notification.showMessage('Error cargando destinos: ' + err.message, 'error');
      }
    });
  }

  private obtenerIdUsuario(): number | null {
    const usuario = localStorage.getItem('usuarioLogeado');
    if (usuario) {
      const userData = JSON.parse(usuario);
      // Asegúrate que la propiedad del ID del tripulante es correcta
      return userData.idTripulante || userData.id; 
    }
    return null;
  }

  private initMapConUbicaciones(ubicaciones: Ubicacion[]): void {
    if (ubicaciones.length === 0) return;

    const features: Feature[] = [];

    for (const u of ubicaciones) {
      const coord = fromLonLat([parseFloat(u.longitud), parseFloat(u.latitud)]);

      const marker = new Feature({
        geometry: new Point(coord),
        name: u.ciudad
      });

      features.push(marker);
    }

    const markerLayer = new VectorLayer({
      source: new VectorSource({ features }),
      style: new Style({
        image: new Icon({
          src: 'https://cdn-icons-png.flaticon.com/512/684/684908.png',
          scale: 0.05,
          anchor: [0.5, 1]
        })
      })
    });

    const center = fromLonLat([
      parseFloat(ubicaciones[0].longitud),
      parseFloat(ubicaciones[0].latitud)
    ]);

    this.map = new Map({
      target: 'map-destinos',
      layers: [
        new TileLayer({ source: new OSM() }),
        markerLayer
      ],
      view: new View({
        center,
        zoom: 3
      })
    });
  }
}
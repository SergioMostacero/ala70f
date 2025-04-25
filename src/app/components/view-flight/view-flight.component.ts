import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { VueloService } from '../../Services/vuelo.service';
import { UbicacionService } from '../../Services/ubicacion.service';
import { Ubicacion } from '../../model/ubicacion.model';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import LineString from 'ol/geom/LineString';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import { fromLonLat } from 'ol/proj';
import { Icon, Style, Stroke } from 'ol/style';

@Component({
  selector: 'app-view-flight',
  templateUrl: './view-flight.component.html',
  styleUrls: ['./view-flight.component.scss']
})
export class ViewFlightComponent implements OnInit, OnDestroy {
  vuelo: any;
  ubicaciones: Ubicacion[] = [];
  map!: Map;

  constructor(
    private vueloService: VueloService,
    private ubicacionService: UbicacionService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadVuelo();
  }

  ngOnDestroy(): void {
    if (this.map) {
      this.map.setTarget('');  
    }
  }
  

  goBack() {
    const tienePermisos = localStorage.getItem('permisos') === 'true';
    this.router.navigate([tienePermisos ? '/homePermisos' : '/home']);
  }

  private loadVuelo(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.vueloService.getVueloById(+id).subscribe({
        next: (data) => {
          console.log('Vuelo cargado:', data);  // Asegúrate de que los datos del vuelo sean correctos
          this.vuelo = data;
          const itinerarioId = this.vuelo.itinerarioDTO?.id;  // Usamos itinerarioDTO.id
          
          if (itinerarioId) {
            this.loadUbicacionesYMapa(itinerarioId);  // Usamos el itinerarioId
          } else {
            console.error('Error: itinerario_id no encontrado');
          }
        },
        error: (err) => console.error('Error cargando vuelo:', err)
      });
    } else {
      console.error('Error: ID de vuelo no encontrado');
    }
  }
  
  
  

  private loadUbicacionesYMapa(itinerarioId: number): void {
    this.ubicacionService.getUbicacionesByItinerarioId(itinerarioId).subscribe({
      next: (ubicaciones) => {
        this.ubicaciones = ubicaciones;
        this.initMapConUbicaciones(ubicaciones);
      },
      error: (err) => console.error('Error cargando ubicaciones:', err)
    });
  }

  private initMapConUbicaciones(ubicaciones: Ubicacion[]): void {
    if (ubicaciones.length === 0) return;
  
    // Creamos un array para almacenar las coordenadas y los marcadores
    const features: Feature[] = [];
    const coordinates: [number, number][] = [];
  
    // Iteramos sobre todas las ubicaciones y agregamos marcadores
    for (const u of ubicaciones) {
      const coord = fromLonLat([parseFloat(u.longitud), parseFloat(u.latitud)]);
      coordinates.push([parseFloat(u.longitud), parseFloat(u.latitud)]);
  
      const marker = new Feature({
        geometry: new Point(coord),
        name: u.ciudad // O u.nombre si lo prefieres
      });
  
      features.push(marker);
    }
  
    // Capa de los marcadores
    const markerLayer = new VectorLayer({
      source: new VectorSource({
        features: features
      }),
      style: new Style({
        image: new Icon({
          src: 'https://cdn-icons-png.flaticon.com/512/684/684908.png',
          scale: 0.05,
          anchor: [0.5, 1]
        })
      })
    });
  
    // Línea entre todas las ubicaciones
    const routeLine = new Feature({
      geometry: new LineString(coordinates.map(coord => fromLonLat(coord)))
    });
  
    const routeLayer = new VectorLayer({
      source: new VectorSource({
        features: [routeLine]
      }),
      style: new Style({
        stroke: new Stroke({
          color: '#007bff',
          width: 3
        })
      })
    });
  
    // Centrar el mapa en la primera ubicación
    const center = fromLonLat([parseFloat(ubicaciones[0].longitud), parseFloat(ubicaciones[0].latitud)]);
  
    this.map = new Map({
      target: 'map',
      layers: [
        new TileLayer({
          source: new OSM()
        }),
        routeLayer,
        markerLayer
      ],
      view: new View({
        center: center,   // Centrar en la primera ubicación
        zoom: 5            // Zoom ajustable según tu preferencia
      })
    });
  }
}  
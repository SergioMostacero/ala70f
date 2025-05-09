import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';   


import { VueloService } from '../../Services/vuelo.service';
import { UbicacionService } from '../../Services/ubicacion.service';
import { NotificationService } from '../../utils/notification.service';

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
import { RouteEncoderService } from '../../Services/route-encoder.service';

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
    private encoder: RouteEncoderService,
    private vueloService: VueloService,
    private ubicacionService: UbicacionService,
    private notification: NotificationService,
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

  goBack(): void {
    this.router.navigate([ this.encoder.encode('homePermisos') ]);
  }

  private loadVuelo(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.vueloService.getVueloById(+id).subscribe({
        next: (data) => {
          this.vuelo = data;
          const itinerarioId = this.vuelo.itinerarioDTO?.id;
          if (itinerarioId) {
            this.loadUbicacionesYMapa(itinerarioId);
          } else {
            this.notification.showMessage('Itinerario no encontrado', 'error');
          }
        },
        error: () => {
          this.notification.showMessage('Error cargando vuelo', 'error');
        }
      });
    } else {
      this.notification.showMessage('ID de vuelo no encontrado', 'error');
    }
  }

  async exportarPDF(): Promise<void> {
    const panel = document.querySelector('.user-panel') as HTMLElement;
    if (!panel) return;
  
    // 1. Preparar elementos para captura
    const originalMapVisibility = (document.querySelector('.map') as HTMLElement).style.visibility;
    const originalBackground = panel.style.background;
    
    try {
      // 2. Forzar renderizado del mapa
      (document.querySelector('.map') as HTMLElement).style.visibility = 'visible';
      this.map.renderSync();
      
      // 3. Configurar parámetros de alta calidad
      const canvas = await html2canvas(panel, {
        scale: 3, // Aumentar resolución
        useCORS: true,
        logging: true, // Solo para desarrollo
        backgroundColor: null,
        allowTaint: true,
        onclone: (clonedDoc) => {
          // Mantener estilos originales en el clon
          clonedDoc.querySelector('.user-panel')!.classList.add('printing');
          (clonedDoc.querySelector('.map') as HTMLElement).style.visibility = 'visible';
        }
      });
  
      // 4. Crear PDF con dimensiones precisas
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: [canvas.width * 0.264583, canvas.height * 0.264583], // Convertir pixeles a mm (96dpi)
        hotfixes: ["px_scaling"]
      });
  
      // 5. Añadir imagen con máxima calidad
      pdf.addImage(canvas.toDataURL('image/png', 1), 'PNG', 0, 0, pdf.internal.pageSize.getWidth(), pdf.internal.pageSize.getHeight());
      
      // 6. Metadatos profesionales
      pdf.setProperties({
        title: `Reporte de Vuelo ${this.vuelo?.id}`,
        subject: 'Detalles completos del vuelo',
        author: 'AeroGest',
        keywords: 'vuelo, reporte, aeronáutica'
      });
  
      pdf.save(`Vuelo_${this.vuelo?.id}_Reporte.pdf`);
    } finally {
      // Restaurar estilos originales
      (document.querySelector('.map') as HTMLElement).style.visibility = originalMapVisibility;
      panel.style.background = originalBackground;
      panel.classList.remove('printing');
    }
  }

  private loadUbicacionesYMapa(itinerarioId: number): void {
    this.ubicacionService.getUbicacionesByItinerarioId(itinerarioId).subscribe({
      next: (ubicaciones) => {
        this.ubicaciones = ubicaciones;
        this.initMapConUbicaciones(ubicaciones);
      },
      error: () => {
        this.notification.showMessage('Error cargando ubicaciones', 'error');
      }
    });
  }

  private initMapConUbicaciones(ubicaciones: Ubicacion[]): void {
    if (ubicaciones.length === 0) return;

    const features: Feature[] = [];
    const coordinates: [number, number][] = [];

    for (const u of ubicaciones) {
      const coord = fromLonLat([parseFloat(u.longitud), parseFloat(u.latitud)]);
      coordinates.push([parseFloat(u.longitud), parseFloat(u.latitud)]);

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
          crossOrigin: 'anonymous',  
          src: 'https://cdn-icons-png.flaticon.com/512/684/684908.png',
          scale: 0.05,
          anchor: [0.5, 1]
        })
      })
    });

    const routeLine = new Feature({
      geometry: new LineString(coordinates.map(c => fromLonLat(c)))
    });

    const routeLayer = new VectorLayer({
      source: new VectorSource({ features: [routeLine] }),
      style: new Style({
        stroke: new Stroke({
          color: '#007bff',
          width: 3
        })
      })
    });

    const center = fromLonLat([
      parseFloat(ubicaciones[0].longitud),
      parseFloat(ubicaciones[0].latitud)
    ]);

    this.map = new Map({
      target: 'map',
      layers: [
        new TileLayer({
          source: new OSM({
            crossOrigin: 'anonymous',
            url: 'https://{a-c}.tile.openstreetmap.org/{z}/{x}/{y}.png'
          })
        }),
        routeLayer,
        markerLayer
      ],
      view: new View({
        center,
        zoom: 5,
        constrainResolution: true // Mejor calidad
      })
    });
  
    // Forzar renderizado completo
    setTimeout(() => {
      this.map.renderSync();
    }, 500);
  }
}

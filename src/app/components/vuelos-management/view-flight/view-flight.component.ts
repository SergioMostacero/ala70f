import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { VueloService } from '../../../Services/vuelo.service';
import { UbicacionService } from '../../../Services/ubicacion.service';
import { NotificationService } from '../../../utils/notification.service';

import { Ubicacion } from '../../../model/ubicacion.model';
import { TripulantesService } from '../../../Services/tripulantes.service';

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
import { RouteEncoderService } from '../../../Services/route-encoder.service';

import autoTable, { CellDef } from 'jspdf-autotable';
import * as dayjs from 'dayjs';
import jsPDF from 'jspdf';

const fecha = dayjs('2025-05-12').format('DD/MM/YYYY');

@Component({
  selector: 'app-view-flight',
  templateUrl: './view-flight.component.html',
  styleUrls: ['./view-flight.component.scss']
})
export class ViewFlightComponent implements OnInit, OnDestroy {
  vuelo: any;
  ubicaciones: Ubicacion[] = [];
  tripulantes: any[] = [];   
  map!: Map;

  constructor(
    private encoder: RouteEncoderService,
    private vueloService: VueloService,
    private ubicacionService: UbicacionService,
    private notification: NotificationService,
    private tripulantesService: TripulantesService,  
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
    if (!id) {
      this.notification.showMessage('ID de vuelo no encontrado', 'error');
      return;
    }
  
    this.vueloService.getVueloById(+id).subscribe({
      next: (data) => {
        this.vuelo = data;
  
        this.tripulantesService.getTripulantesByVuelo(this.vuelo.id)
          .subscribe({
            next: trs => this.tripulantes = trs,
            error: ()  => this.notification.showMessage(
                            'Error cargando tripulación', 'error')
          });
  
        const itiId = this.vuelo.itinerarioDTO?.id;
        if (itiId) this.loadUbicacionesYMapa(itiId);
        else       this.notification.showMessage('Itinerario no encontrado', 'error');
      },
      error: () => this.notification.showMessage('Error cargando vuelo', 'error')
    });
  }
  

  private loadLogo(): Promise<HTMLImageElement> {
    return new Promise(resolve => {
      const img = new Image();
      img.src = 'assets/img/logo.png';
      img.onload = () => resolve(img);
    });
  }
  
  public exportarPDF(): void {
    if (!this.vuelo) return;
  
    /* ——— CONFIG BÁSICA ——— */
    const doc  = new jsPDF({ orientation: 'portrait', unit: 'pt' });
    const blue: [number, number, number] = [29, 114, 184];
    const pageW = doc.internal.pageSize.getWidth();
  
    /* ——— FUNCIÓN PRINCIPAL ——— */
    this.loadLogo().then(logo => {
  
      /* 1) CABECERA CORPORATIVA — fondo azul + logo */
      doc.setFillColor(...blue);
      doc.rect(0, 0, pageW, 60, 'F');
  
      // logo: 45 × 45 pt
      doc.addImage(
        logo,
        'PNG',
        20,
        7,
        45,
        45
      );
  
      // título
      doc.setFont('Roboto', 'normal').setFontSize(22).setTextColor(255, 255, 255);
      doc.text('INFORME DE VUELO', pageW / 2, 36, { align: 'center' });
  
      /* 3) TABLA DATOS PRINCIPALES */
      const datosPrincipales: CellDef[][] = [
        ['Itinerario',    this.vuelo.itinerarioDTO?.nombre ?? '-'],
        ['Duración',      this.vuelo.itinerarioDTO?.duracion ?? '-'],
        ['Salida',        `${dayjs(this.vuelo.fecha_salida).format('DD/MM/YYYY')}  ${this.vuelo.hora_salida}`],
        ['Llegada',       `${dayjs(this.vuelo.fecha_llegada).format('DD/MM/YYYY')}  ${this.vuelo.hora_llegada}`],
        ['Avión',         this.vuelo.avionDTO?.nombre ?? '-'],
        ['Misión',        this.vuelo.misionDTO?.nombre ?? '-'],
        ['Combustible',   `${this.vuelo.combustible ?? '-'}  t`],
        ['Anticipo',      `${this.vuelo.anticipo ?? '-'}  €`]
      ];
  
      autoTable(doc, {
        startY: 110,
        head: [['Campo', 'Valor']],
        body: datosPrincipales,
        theme: 'striped',
        styles:      { font: 'Roboto', fontSize: 11 },
        headStyles:  { fillColor: blue, textColor: 255, fontStyle: 'bold', halign: 'center' },
        bodyStyles:  { cellPadding: 6 }
      });
  
      const tripRows = this.tripulantes.map(t => [
        t.oficioDTO?.nombre ?? '-',                   // rol
        `${t.nombre} ${t.apellidos}`,
        t.licencia ?? '-'
      ]);
      
  
      if (tripRows.length) {
        autoTable(doc, {
          margin: { top: 20 },
          head: [['Rol', 'Nombre', 'Licencia']],
          body: tripRows,
          theme: 'striped',
          styles:     { font: 'Roboto', fontSize: 10 },
          headStyles: { fillColor: [90, 90, 90], textColor: 255, fontStyle: 'bold', halign: 'center' },
          bodyStyles: { cellPadding: 5 }
        });
      }
  
      /* 5) GUARDAR */
      doc.save(`vuelo-${this.vuelo.id}.pdf`);
    });
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
        new TileLayer({ source: new OSM() }),
        routeLayer,
        markerLayer
      ],
      view: new View({
        center,
        zoom: 5
      })
    });
  }
}

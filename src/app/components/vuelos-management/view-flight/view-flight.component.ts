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

  const doc = new jsPDF({ orientation: 'portrait', unit: 'pt' });
  const blue: [number, number, number] = [29, 114, 184];
  const today = dayjs().format('DD/MM/YYYY');
  const pageW = doc.internal.pageSize.getWidth();

  this.loadLogo().then(logo => {
    // CABECERA
    doc.setFillColor(...blue);
    doc.rect(0, 0, pageW, 70, 'F');
    doc.addImage(logo, 'PNG', 20, 12, 45, 45);
    doc.setFont('Helvetica', 'bold').setFontSize(20).setTextColor(255, 255, 255);
    doc.text('INFORME OFICIAL DE VUELO', pageW / 2, 32, { align: 'center' });
    doc.setFont('Helvetica', 'normal').setFontSize(12);
    doc.text(`Fecha del informe: ${today}`, pageW / 2, 50, { align: 'center' });

    // FECHAS Y FORMATO
    const itinerary = this.vuelo.itinerarioDTO?.nombre ?? '-';
    const salida = this.formatFechaHora(this.vuelo.fecha_salida, this.vuelo.hora_salida);
    const llegada = this.formatFechaHora(this.vuelo.fecha_llegada, this.vuelo.hora_llegada);

    const datosPrincipales: CellDef[][] = [
      ['Itinerario', itinerary],
      ['Duración', this.limpiarTexto(this.vuelo.itinerarioDTO?.duracion)],
      ['Salida', salida],
      ['Llegada', llegada],
      ['Avión', this.limpiarTexto(this.vuelo.avionDTO?.nombre)],
      ['Misión', this.limpiarTexto(this.vuelo.misionDTO?.nombre)],
      ['Combustible', this.vuelo.combustible ? `${this.vuelo.combustible} t` : 'N/A'],
      ['Anticipo', this.vuelo.anticipo ? `${this.vuelo.anticipo} €` : 'N/A']
    ];

    autoTable(doc, {
      startY: 90,
      head: [['Campo', 'Valor']],
      body: datosPrincipales,
      theme: 'grid',
      styles: { font: 'Helvetica', fontSize: 11, halign: 'left' },
      headStyles: { fillColor: blue, textColor: 255, fontStyle: 'bold', halign: 'left' },
      bodyStyles: { cellPadding: 6 }
    });

    // TRIPULACIÓN
    if (this.tripulantes.length) {
      autoTable(doc, {
        margin: { top: 20 },
        head: [['Oficio', 'Nombre completo', 'Rango']],
        body: this.tripulantes.map(t => [
          this.limpiarTexto(t.oficioDTO?.nombre),
          `${t.nombre} ${t.apellidos}`,
          this.limpiarTexto(t.rangoDTO?.nombre)
        ]),
        theme: 'striped',
        styles: { font: 'Helvetica', fontSize: 10, halign: 'left' },
        headStyles: { fillColor: [60, 60, 60], textColor: 255, fontStyle: 'bold', halign: 'left' },
        bodyStyles: { cellPadding: 5 }
      });
    }

    // UBICACIONES (sin ordenar)
    if (this.ubicaciones.length) {
      autoTable(doc, {
        margin: { top: 20 },
        head: [['Ciudad', 'País', 'Latitud', 'Longitud']],
        body: this.ubicaciones.map(u => [
          this.limpiarTexto(u.ciudad),
          this.limpiarTexto(u.pais),
          u.latitud ?? 'N/A',
          u.longitud ?? 'N/A'
        ]),
        theme: 'striped',
        styles: { font: 'Helvetica', fontSize: 10, halign: 'left' },
        headStyles: { fillColor: blue, textColor: 255, fontStyle: 'bold', halign: 'left' },
        bodyStyles: { cellPadding: 5 }
      });
    }

    // PIE DE PÁGINA
    doc.setFontSize(9).setTextColor(150);
    doc.text(`Generado automáticamente por el sistema el ${today}`, pageW / 2, doc.internal.pageSize.getHeight() - 20, {
      align: 'center'
    });

    // NOMBRE ARCHIVO
    const safeItinerary = itinerary.replace(/\s+/g, '_').replace(/[!’]/g, '');
    const salidaStr = dayjs(this.vuelo.fecha_salida).format('YYYYMMDD');
    doc.save(`INFORME_VUELO_G45-${safeItinerary}-${salidaStr}.pdf`);
  });
}

private formatFechaHora(fecha: string, hora: string): string {
  const dt = dayjs(`${fecha}T${hora}`);
  return dt.format('DD [de] MMMM [de] YYYY, HH:mm [h]');
}

private limpiarTexto(valor: any): string {
  return valor && valor !== '-' ? valor : 'N/A';
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

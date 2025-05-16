import { Component, OnInit } from '@angular/core';
import { VueloService } from '../../../Services/vuelo.service';
import { Router } from '@angular/router';
import { NotificationService } from '../../../utils/notification.service';
import { RouteEncoderService } from '../../../Services/route-encoder.service';

@Component({
  selector: 'app-historial-flights',
  templateUrl: './historial-flights.component.html',
  styleUrls: ['./historial-flights.component.scss']
})
export class HistorialFlightsComponent implements OnInit {
  historialVuelos: any[] = [];

  constructor(
    private encoder: RouteEncoderService,
    private vueloService: VueloService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadVuelosUsuario();
  }

  goBack(): void {
  this.router.navigate([ this.encoder.encode('homePermisos') ]);
}

  irARegistrarVuelo() {
    this.router.navigate([this.encoder.encode('register-flights')]);
  }


  verVuelo(vueloId: number) {
    const encodedPath = this.encoder.encode('vuelo');
    this.router.navigate([encodedPath, vueloId]); // Mantener ID legible
  }

  private loadVuelosUsuario(): void {
    const raw = localStorage.getItem('usuarioLogeado');
    if (!raw) {
      console.warn('No hay usuario logueado en localStorage');
      return;
    }
    const { id: tripulanteId } = JSON.parse(raw) as { id: number };

    this.vueloService.getVuelosByUser(tripulanteId).subscribe({
      next: (data) => {
        const hoy = new Date();
        this.historialVuelos = data.filter(
          (v: any) =>
            v.fecha_salida && new Date(v.fecha_salida) < hoy
        );
      },
      error: (err) =>
        console.error('Error cargando historial de vuelos:', err)
    });
  }

  
  
}

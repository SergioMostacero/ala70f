import { Component, OnInit } from '@angular/core';
import { VueloService } from '../../Services/vuelo.service';
import { Router } from '@angular/router';
import { NotificationService } from '../../utils/notification.service';

@Component({
  selector: 'app-historial-flights',
  templateUrl: './historial-flights.component.html',
  styleUrls: ['./historial-flights.component.scss']
})
export class HistorialFlightsComponent implements OnInit {
  vuelosRecientes: any[] = [];

  constructor(
    private vueloService: VueloService,
    private router: Router,
    private notification: NotificationService
  ) {}

  ngOnInit(): void {
    this.loadVuelosUsuario();
  }

  verVuelo(vueloId: number) {
    this.router.navigate(['/vuelo', vueloId]);
  }
  
  goBack() {
    const tienePermisos = localStorage.getItem('permisos') === 'true';
  
    if (tienePermisos) {
      this.router.navigate(['/homePermisos']);
    } else {
      this.router.navigate(['/home']);
    }
  }

  private loadVuelosUsuario(): void {
    const tripulanteId = Number(localStorage.getItem('tripulanteId'));
    if (tripulanteId) {
      this.vueloService.getVuelosByUser(tripulanteId).subscribe({
        next: (data) => {
          const hoy = new Date();
          this.vuelosRecientes = data.filter((vuelo: any) => {
            const fechaVuelo = new Date(vuelo.fecha);
            return hoy > fechaVuelo;
          });
        },
        error: (err) => {
          const errorMessage = err.error?.message || 'Error al cargar el historial de vuelos';
          this.notification.showMessage(`${errorMessage}`, 'error');
        }
      });
    } else {
      const message = 'Sesión expirada o no autenticado';
      this.notification.showMessage(message, 'error');
      setTimeout(() => this.router.navigate(['/login']), 2000);
    }
  }
}
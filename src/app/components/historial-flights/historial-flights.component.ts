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
  historialVuelos: any[] = [];

  constructor(
    private vueloService: VueloService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadVuelosUsuario();
  }

  goBack() {
    const tienePermisos = localStorage.getItem('permisos') === 'true';
    this.router.navigate([tienePermisos ? '/homePermisos' : '/home']);
  }

  irARegistrarVuelo() {
    this.router.navigate(['/register-flights']);
  }

  verVuelo(vueloId: number) {
    this.router.navigate(['/vuelo', vueloId]);
  }

  private loadVuelosUsuario(): void {
    const tripulanteId = Number(localStorage.getItem('tripulanteId'));
    if (tripulanteId) {
      this.vueloService.getVuelosByUser(tripulanteId).subscribe({
        next: (data) => {
          const hoy = new Date();
          this.historialVuelos = data.filter((vuelo: any) => {
            // Convertimos fecha_salida a Date (asegúrate de que sea YYYY-MM-DD)
            if (vuelo.fecha_salida) {
              const fechaVuelo = new Date(vuelo.fecha_salida);
              return fechaVuelo < hoy;
            }
            return false;
          });
        },
        error: (err) => console.error('Error cargando vuelos recientes:', err)
      });
    } else {
      console.warn('No se encontró el tripulanteId en localStorage');
    }
  }
  
  
}

import { Component, OnInit } from '@angular/core';
import { VueloService } from '../../Services/vuelo.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-vuelos',
  templateUrl: './vuelos.component.html',
  styleUrls: ['./vuelos.component.scss']
})
export class VuelosComponent implements OnInit {
  vuelosRecientes: any[] = [];
  mostrarBotonRegistro = false;

  constructor(
    private vueloService: VueloService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadVuelosUsuario();
    this.mostrarBotonRegistro = localStorage.getItem('permisos') === 'true';
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
          this.vuelosRecientes = data.filter((vuelo: any) => {
            // Convertimos fecha_salida a Date (asegúrate de que sea YYYY-MM-DD)
            if (vuelo.fecha_salida) {
              const fechaVuelo = new Date(vuelo.fecha_salida);
              return fechaVuelo >= hoy;
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

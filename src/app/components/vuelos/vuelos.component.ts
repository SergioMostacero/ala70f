import { Component, OnInit } from '@angular/core';
import { VueloService } from '../../Services/vuelo.service';
import { Router } from '@angular/router';
import { RouteEncoderService } from '../../Services/route-encoder.service';

@Component({
  selector: 'app-vuelos',
  templateUrl: './vuelos.component.html',
  styleUrls: ['./vuelos.component.scss']
})
export class VuelosComponent implements OnInit {
  vuelosRecientes: any[] = [];
  mostrarBotonRegistro = false;

  constructor(
    private encoder: RouteEncoderService,
    private vueloService: VueloService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadVuelosUsuario();
    this.mostrarBotonRegistro = localStorage.getItem('permisos') === 'true';
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

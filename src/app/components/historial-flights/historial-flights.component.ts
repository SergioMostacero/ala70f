import { Component, OnInit } from '@angular/core';
import { VueloService } from '../../Services/vuelo.service';
import { Router } from '@angular/router';
import { AppComponent } from 'src/app/app.component';

@Component({
  selector: 'app-historial-flights',
  templateUrl: './historial-flights.component.html',
  styleUrls: ['./historial-flights.component.scss']
})
export class HistorialFlightsComponent implements OnInit {
  vuelosRecientes: any[] = [];

  constructor(
    private vueloService: VueloService,
    private router: Router
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
          return hoy > fechaVuelo
        });
      },
      error: (err) => console.error('Error cargando vuelos recientes:', err)
    });
  } else {
    console.warn('No se encontró el tripulanteId en localStorage');
  }
}



}


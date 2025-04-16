import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TripulantesService } from '../../Services/tripulantes.service';
import { Tripulantes } from '../../model/Tripulantes.model';
import { GrupoSanguineoService } from '../../Services/grupo-sanguineo.service';
import { OficioService } from '../../Services/oficio.service';

@Component({
  selector: 'app-homePermisos',
  templateUrl: './homePermisos.component.html',
  styleUrls: ['./homePermisos.component.scss'],
})
export class HomePermisosComponent implements OnInit {
  tripulante: Tripulantes | null = null;
  isLoading = true;
  errorMessage: string | null = null;

  constructor(
    private router: Router,
    private tripulantesService: TripulantesService,
    private grupoSanguineoService: GrupoSanguineoService,
    private oficioService: OficioService,
  ) {}

  ngOnInit(): void {
    this.tripulante = this.tripulantesService.getLoggedInUser();

    if (!this.tripulante) {
      this.errorMessage = 'No hay tripulante logueado. Redirigiendo...';
      setTimeout(() => this.router.navigate(['/login']), 1500);
      return;
    }

    this.isLoading = false;
  }
  irALogrosMedallas(): void {
    this.router.navigate(['/logros-medallas']);
  }

  // Resto de métodos permanecen igual
  getNombreCompleto(): string {
    return this.tripulante ? `${this.tripulante.nombre}` : '';
  }


  verGestion() {
    this.router.navigate(['/management']);
  }
  
  verVuelos() {
    this.router.navigate(['/flights']);
  }
  

  registrar() {
    this.router.navigate(['/register'], { 
      state: { 
        currentTripulante: this.tripulante 
      } 
    });
  }
}
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TripulantesService } from '../../Services/tripulantes.service';
import { Tripulantes } from '../../model/Tripulantes.model';
import { GrupoSanguineoService } from '../../Services/grupo-sanguineo.service';
import { OficioService } from '../../Services/oficio.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
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

  // Resto de métodos permanecen igual
  getNombreCompleto(): string {
    return this.tripulante ? `${this.tripulante.nombre}` : '';
  }

  home() {
    this.router.navigate(['/register-flight']);
  }
  verVuelos() {
    this.router.navigate(['/flights']);
  }
  
  irALogrosMedallas(): void {
    this.router.navigate(['/logros-medallas']);
  }
}
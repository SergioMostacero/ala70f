import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TripulantesService } from '../../Services/tripulantes.service';
import { Tripulantes } from '../../model/Tripulantes.model';
import { GrupoSanguineoService } from '../../Services/grupo-sanguineo.service';
import { OficioService } from '../../Services/oficio.service';
import { NotificationService } from '../../utils/notification.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  tripulante: Tripulantes | null = null;
  isLoading = true;

  constructor(
    private router: Router,
    private tripulantesService: TripulantesService,
    private grupoSanguineoService: GrupoSanguineoService,
    private oficioService: OficioService,
    private notification: NotificationService
  ) {}

  ngOnInit(): void {
    this.tripulante = this.tripulantesService.getLoggedInUser();

    if (!this.tripulante) {
      this.notification.showMessage('No hay tripulante logueado. Redirigiendo...', 'error');
      setTimeout(() => this.router.navigate(['/login']), 1500);
      return;
    }

    this.isLoading = false;
  }

  getNombreCompleto(): string {
    return this.tripulante ? `${this.tripulante.nombre}` : '';
  }

  home() {
    this.router.navigate(['/register-flight']);
  }

  verVuelos() {
    this.router.navigate(['/flights']);
  }

  irALogrosHistorial(): void {
    this.router.navigate(['/historial']);
  }
  
  irALogrosMedallas(): void {
    this.router.navigate(['/logros-medallas']);
  }

  irADestinos(){
    this.router.navigate(['/destinos'])
  }
}
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TripulantesService } from '../../Services/tripulantes.service';
import { Tripulantes } from '../../model/Tripulantes.model';
import { GrupoSanguineoService } from '../../Services/grupo-sanguineo.service';
import { OficioService } from '../../Services/oficio.service';
import { NotificationService } from '../../utils/notification.service';
import { RouteEncoderService } from '../../Services/route-encoder.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  tripulante: Tripulantes | null = null;
  isLoading = true;

  constructor(
    private encoder: RouteEncoderService,
    private router: Router,
    private tripulantesService: TripulantesService,
    private grupoSanguineoService: GrupoSanguineoService,
    private oficioService: OficioService,
    private notification: NotificationService
  ) {}

  ngOnInit(): void {
    const stub = this.tripulantesService.getLoggedInUser();
  
    // 1) Validar que haya stub *y* que tenga un id
    if (!stub || stub.id == null) {
      this.notification.showMessage(
        'No hay tripulante logueado. Redirigiendo…',
        'error'
      );
      setTimeout(() => {
        this.router.navigate([this.encoder.encode('login')]);
      }, 1500);
      return;
    }
  
    // 2) Ya sabemos que stub.id es un number
    this.tripulantesService.getById(stub.id).subscribe({
      next: full => {
        this.tripulante = full;
        this.isLoading = false;
      },
      error: () => {
        this.notification.showMessage(
          'No se pudo cargar datos de usuario',
          'error'
        );
        this.router.navigate([this.encoder.encode('login')]);
      }
    });
  }

  getNombreCompleto(): string {
    return this.tripulante ? `${this.tripulante.nombre}` : '';
  }

  home() {
    this.router.navigate([this.encoder.encode('register-flight')]);
  }

  verVuelos() {
    this.router.navigate([this.encoder.encode('flights')]);
  }

  irALogrosHistorial(): void {
    this.router.navigate([this.encoder.encode('historial')]);
  }
  
  irALogrosMedallas(): void {
    this.router.navigate([this.encoder.encode('logros-medallas')]);
  }

  irADestinos(){
    this.router.navigate([this.encoder.encode('destinos')]);
  }
}
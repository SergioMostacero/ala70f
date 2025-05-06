import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TripulantesService } from '../../Services/tripulantes.service';
import { Tripulantes } from '../../model/Tripulantes.model';
import { GrupoSanguineoService } from '../../Services/grupo-sanguineo.service';
import { OficioService } from '../../Services/oficio.service';
import { RangoService } from 'src/app/Services/rango.service';
import { NotificationService } from '../../utils/notification.service';
import { RouteEncoderService } from '../../Services/route-encoder.service';
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
    private encoder: RouteEncoderService,
    private router: Router,
    private tripulantesService: TripulantesService,
    private grupoSanguineoService: GrupoSanguineoService,
    private rangoService: RangoService,
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
  
  

  
  irALogrosMedallas(): void {
    this.router.navigate([this.encoder.encode('logros-medallas')]);
  }
  irALogrosHistorial(): void {
    this.router.navigate([this.encoder.encode('historial')]);
  }


  getNombreCompleto(): string {
    return this.tripulante ? `${this.tripulante.nombre}` : '';
  }


  verGestion() {
    this.router.navigate([this.encoder.encode('management')]);
  }
  
  verVuelos() {
    this.router.navigate([this.encoder.encode('flights')]);
  }

  irADestinos(){
    this.router.navigate([this.encoder.encode('destinos')]);
  }

  registrar(): void {
    const encodedRoute = this.encoder.encode('register');
    
    this.router.navigate(
      [encodedRoute], 
      { 
        state: {
          currentTripulante: (this.tripulante)
        }
      }
    );
  }
}